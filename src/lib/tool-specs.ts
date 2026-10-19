/**
 * The calculators of the site, one entry per subject. Every figure comes from the engine (src/lib/engine/*),
 * which reads params-2026.json and life-tables.json. A spec lists its inputs (visible first, `adv` ones
 * folded) and a pure `run` that turns them into a result card. Birth years are lists, never number fields
 * (a year is a code, not an amount: no thousands separator).
 */
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input } from './tool-types';
import { formatMoney, formatPercent, formatDecimal } from './format';
import { deferral, annualAdditions, match, perPaycheck, sep, solo401k, stack457, catchUp, superCatchUpYears, firstCatchUpYear, ageAtYearEnd, baseDeferral, lim, announced, type Plan } from './engine/limits';
import { iraLimit, spousal, rothReduced, deductible, deductRange, rothRange, type Filing, type Coverage } from './engine/ira';
import { hsa, healthFsa, dependentCare, type HsaCover } from './engine/health';
import { ownerRmd, schedule, firstRmdYear, ageRule, uniform, joint, inherited, excise, qcd, firstYearDouble, applicableAge, type Beneficiary } from './engine/rmd';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const pct = (x: number, d = 1) => formatPercent(x, d);
const dec = (x: number, d = 1) => formatDecimal(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const L = P.limits['2026'];
const L27 = P.limits['2027'] as Record<string, unknown>;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;
const range = (r: [number, number]) => `${usd(r[0])} to ${usd(r[1])}`;

const years = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(to - i), label: String(to - i) }));
const BIRTH = (def: number, label = 'Year you were born', id = 'by', from = 1930, to = 2008, adv = false): Input => ({ kind: 'select', id, label, def: String(def), options: years(from, to), adv });
const by = (v: V, k = 'by') => Number(v[k]);
const PLAN: Input = { kind: 'select', id: 'plan', label: 'Plan', def: '401k', options: [{ value: '401k', label: '401(k) or TSP' }, { value: '403b', label: '403(b)' }, { value: 'gov457', label: 'Governmental 457(b)' }] };
const FILING: Input = { kind: 'select', id: 'f', label: 'Filing status', def: 'single', options: [{ value: 'single', label: 'Single' }, { value: 'joint', label: 'Married filing jointly' }, { value: 'head', label: 'Head of household' }, { value: 'mfs', label: 'Married filing separately' }] };
const PAY = (def = 95000, label = 'Your pay this year', id = 'pay'): Input => ({ id, label, def, unit: '$', max: 10000000, help: 'W-2 wages before deferrals' });
const tierName = (t: string) => (t === 'super' ? 'age 60 to 63 catch-up' : t === 'standard' ? 'age 50 catch-up' : 'no catch-up yet');
const yesNo = (id: string, label: string, def: 'yes' | 'no'): Input => ({ kind: 'choice', id, label, def, options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] });

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Home: every 2026 limit that applies to one person */
  all: () => ({
    inputs: [
      BIRTH(1970), PAY(120000), FILING,
      { id: 'magi', label: 'Modified AGI for the Roth test', def: 160000, unit: '$', max: 10000000, help: 'Household MAGI if you file jointly' },
      { kind: 'select', id: 'cov', label: 'Covered by a workplace plan', def: 'you', options: [{ value: 'you', label: 'Yes, me' }, { value: 'spouse', label: 'Only my spouse' }, { value: 'both', label: 'Both of us' }, { value: 'none', label: 'Neither' }] },
      { kind: 'select', id: 'hsa', label: 'HSA-eligible health plan', def: 'self', options: [{ value: 'none', label: 'No HDHP' }, { value: 'self', label: 'Self-only HDHP' }, { value: 'family', label: 'Family HDHP' }] },
      { ...PLAN, adv: true },
      { id: 'prior', label: '2025 FICA wages from this employer', def: 0, unit: '$', max: 10000000, adv: true, help: 'Box 3 of your 2025 W-2; 0 = same as your pay' },
    ],
    run: (v) => {
      const pay = n(v, 'pay'), age = ageAtYearEnd(by(v));
      const prior = n(v, 'prior') || pay;
      const d = deferral(s(v, 'plan') as Plan, by(v), pay, prior);
      // IRA compensation = W-2 box 1, net of pre-tax deferrals; a mandatory Roth catch-up stays in box 1.
      const comp = Math.max(0, pay - (d.total - (d.rothCatchUp ? d.catchUp : 0)));
      const roth = rothReduced(s(v, 'f') as Filing, n(v, 'magi'), age, comp);
      const ded = deductible(s(v, 'f') as Filing, s(v, 'cov') as Coverage, n(v, 'magi'), age, comp);
      const h = s(v, 'hsa') === 'none' ? null : hsa(s(v, 'hsa') as HsaCover, age);
      const ira = iraLimit(age, comp).limit;
      const iraLine = roth.reduced > 0 ? roth.reduced : ira;
      const tot = d.total + ira + (h?.total ?? 0);
      return {
        label: 'Your own 2026 limits add up to', value: usd(tot),
        sub: `${tierName(d.tier)} at ${age} by December 31${d.rothCatchUp ? `; your catch-up must go in as Roth (2025 wages above ${usd(d.rothThreshold)})` : ''}.`,
        rows: [
          [`${s(v, 'plan') === '403b' ? '403(b)' : s(v, 'plan') === 'gov457' ? '457(b)' : '401(k)'} deferral with catch-up`, usd(d.total), d.total],
          ['IRA, traditional and Roth together', usd(ira), ira],
          [roth.status === 'full' ? 'Roth IRA: full amount allowed' : roth.status === 'none' ? 'Roth IRA: none above the range' : 'Roth IRA: reduced amount', usd(roth.reduced), roth.reduced],
          [ded.status === 'full' ? 'Traditional IRA: fully deductible' : ded.status === 'none' ? 'Traditional IRA: not deductible' : 'Traditional IRA: deductible part', usd(ded.deductible)],
          ['HSA, catch-up included', h ? usd(h.total) : 'no HDHP', h?.total ?? 0],
        ],
        note: `Total = deferral + IRA + HSA. A direct Roth IRA contribution uses the same ${usd(ira)}: here ${usd(iraLine)}. Employer money comes on top, up to ${usd(L.total415c)} (section 415(c)).`,
      };
    },
  }),

  /* 401(k), 403(b), 457(b): personal deferral limit */
  k401: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1975)), PAY(Number(arg?.pay ?? 110000)), { ...PLAN, def: String(arg?.plan ?? '401k') },
      { id: 'prior', label: '2025 FICA wages from this employer', def: Number(arg?.prior ?? 0), unit: '$', max: 10000000, help: '0 = same as this year', adv: true }],
    run: (v) => {
      const pay = n(v, 'pay');
      const d = deferral(s(v, 'plan') as Plan, by(v), pay, n(v, 'prior') || pay);
      return { label: 'Your 2026 deferral limit', value: usd(d.total), sub: d.cappedByPay ? 'Capped at your pay: a deferral cannot exceed compensation.' : `${tierName(d.tier)}, age ${d.age} on December 31, 2026.`,
        rows: [['Base limit', usd(d.base), d.base], [`Catch-up (${tierName(d.tier)})`, usd(d.catchUp), d.catchUp], ['Catch-up must be Roth', d.catchUp ? (d.rothCatchUp ? 'yes' : 'no') : 'no catch-up'], ['Per month to reach it', usd(d.total / 12)]],
        note: `Roth catch-up rule: required when 2025 FICA wages from the employer exceed ${usd(d.rothThreshold)} (Notice 2025-67).` };
    },
  }),

  /* Per paycheck to max out */
  paycheck: (arg) => ({
    inputs: [PAY(Number(arg?.pay ?? 90000), 'Yearly salary'), { kind: 'select', id: 'freq', label: 'Paid', def: String(arg?.freq ?? '26'), options: [{ value: '52', label: 'Weekly' }, { value: '26', label: 'Every two weeks' }, { value: '24', label: 'Twice a month' }, { value: '12', label: 'Monthly' }] },
      { id: 'left', label: 'Paychecks left in 2026', def: Number(arg?.left ?? 26), unit: '', max: 60 }, { id: 'done', label: 'Already deferred in 2026', def: Number(arg?.done ?? 0), unit: '$', max: 1000000 },
      BIRTH(Number(arg?.by ?? 1980))],
    run: (v) => {
      const d = deferral('401k', by(v), n(v, 'pay'));
      const p = perPaycheck(d.total, n(v, 'done'), n(v, 'left'), n(v, 'pay'), n(v, 'freq'));
      return { label: 'Defer this from each paycheck', value: usd(p.each), sub: p.left === 0 ? 'You have already reached your 2026 limit.' : `${pct(p.pct, 1)} of a ${usd(p.payEach)} paycheck.`,
        rows: [['Your 2026 limit', usd(d.total), d.total], ['Already deferred', usd(n(v, 'done')), n(v, 'done')], ['Left to defer', usd(p.left), p.left], ['Percent to set with payroll', pct(Math.min(1, p.pct), 1)]] };
    },
  }),

  /* Catch-up for a birth year */
  catchup: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1972)), { kind: 'select', id: 'plan', label: 'Plan', def: String(arg?.plan ?? '401k'), options: [{ value: '401k', label: '401(k), 403(b), 457(b)' }, { value: 'simple', label: 'SIMPLE IRA' }, { value: 'simpleApplicable', label: 'SIMPLE IRA, 25 or fewer employees' }, { value: 'simple401k', label: 'SIMPLE 401(k)' }, { value: 'simple401kApplicable', label: 'SIMPLE 401(k), 25 or fewer employees' }] }],
    run: (v) => {
      const age = ageAtYearEnd(by(v));
      const plan = s(v, 'plan') as Plan;
      const c = catchUp(plan, age) ?? 0;
      const base = baseDeferral(plan) ?? 0;
      return { label: 'Your 2026 catch-up', value: usd(c), sub: c ? `On top of the ${usd(base)} base: ${usd(base + c)} in all.` : `You reach 50 in ${firstCatchUpYear(by(v))}.`,
        rows: [['Age on December 31, 2026', String(age)], ['Base limit', usd(base), base], ['Catch-up', usd(c), c], ['First year of catch-up', String(firstCatchUpYear(by(v)))]],
        table: { caption: 'Catch-up by birth year in 2026', headers: ['Born', 'Age in 2026', 'Catch-up'], rows: [1977, 1976, 1967, 1966, 1963, 1962, 1961].map((y) => [String(y), String(2026 - y), usd(catchUp(plan, 2026 - y) ?? 0)]), align: ['l', 'r', 'r'] } };
    },
  }),

  /* Age 60 to 63 super catch-up */
  super: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1965)), PAY(Number(arg?.pay ?? 140000))],
    run: (v) => {
      const yrs = superCatchUpYears(by(v));
      const in26 = yrs.includes(2026);
      const d = deferral('401k', by(v), n(v, 'pay'));
      const extra = L.catchUp6063 - L.catchUp50;
      return { label: in26 ? 'Your 2026 catch-up (age 60 to 63)' : 'Your super catch-up years', value: in26 ? usd(L.catchUp6063) : `${yrs[0]} to ${yrs[3]}`,
        sub: in26 ? `${usd(extra)} more than the standard ${usd(L.catchUp50)}; ${usd(d.total)} in all.` : `The four calendar years in which you turn 60, 61, 62 and 63.`,
        rows: [['Age on December 31, 2026', String(d.age)], ['Standard catch-up', usd(L.catchUp50), L.catchUp50], ['Age 60 to 63 catch-up', usd(L.catchUp6063), L.catchUp6063], ['Your 2026 deferral limit', usd(d.total)]],
        table: { caption: 'Your four years, and the amount when known', headers: ['Year', 'Age at year end', 'Catch-up'], rows: yrs.map((y) => [String(y), String(y - by(v)), y === 2026 ? usd(L.catchUp6063) : y < 2026 ? 'past year' : 'set each November']), align: ['l', 'r', 'r'] } };
    },
  }),

  /* Mandatory Roth catch-up */
  rothcatch: (arg) => ({
    inputs: [{ id: 'prior', label: '2025 FICA wages from this employer', def: Number(arg?.prior ?? 165000), unit: '$', max: 10000000, help: 'Box 3 of the 2025 W-2 from this employer', wide: true }, BIRTH(Number(arg?.by ?? 1968)), { ...PLAN, def: '401k' }],
    run: (v) => {
      const d = deferral(s(v, 'plan') as Plan, by(v), Number.MAX_SAFE_INTEGER, n(v, 'prior'));
      const gap = L.rothCatchUpWageThreshold - n(v, 'prior');
      return { label: d.rothCatchUp ? 'Catch-up you must make as Roth' : 'Catch-up you may keep pre-tax', value: usd(d.catchUp), sub: d.catchUp === 0 ? 'No catch-up before the year you turn 50.' : d.rothCatchUp ? `2025 wages ${usd(n(v, 'prior') - L.rothCatchUpWageThreshold)} above the ${usd(L.rothCatchUpWageThreshold)} threshold.` : `2025 wages ${usd(Math.max(0, gap))} under the threshold.`,
        rows: [['Threshold (2025 wages, for 2026)', usd(L.rothCatchUpWageThreshold)], ['Your 2025 wages', usd(n(v, 'prior'))], ['Catch-up for your age', usd(d.catchUp), d.catchUp], ['Base deferral, pre-tax or Roth as you choose', usd(d.base), d.base]] };
    },
  }),

  /* Roth 401(k) split */
  roth401k: (arg) => ({
    inputs: [PAY(Number(arg?.pay ?? 100000)), BIRTH(Number(arg?.by ?? 1978)), { id: 'share', label: 'Share you send to Roth', def: Number(arg?.share ?? 50), unit: '%', max: 100 }],
    run: (v) => {
      const d = deferral('401k', by(v), n(v, 'pay'));
      const r = d.total * n(v, 'share') / 100;
      return { label: 'Roth 401(k) part of your limit', value: usd(r), sub: `One limit of ${usd(d.total)} shared by pre-tax and Roth deferrals; no income limit applies.`,
        rows: [['Roth deferrals (taxed now)', usd(r), r], ['Pre-tax deferrals', usd(d.total - r), d.total - r], ['Shared limit', usd(d.total)], ['Taxable pay added by the Roth part', usd(r)]] };
    },
  }),

  /* 415(c) annual additions */
  total: (arg) => ({
    inputs: [PAY(Number(arg?.pay ?? 150000)), { id: 'def', label: 'Your deferrals', def: Number(arg?.def ?? L.deferral), unit: '$', max: 1000000 },
      { id: 'mr', label: 'Employer match rate', def: Number(arg?.mr ?? 100), unit: '%', max: 400, help: '100 = dollar for dollar' }, { id: 'up', label: 'Matched up to', def: Number(arg?.up ?? 6), unit: '%', max: 100, help: 'Share of pay' },
      { id: 'ps', label: 'Other employer money', def: Number(arg?.ps ?? 0), unit: '$', max: 1000000, help: 'Profit sharing, nonelective' }, { id: 'at', label: 'After-tax contributions', def: 0, unit: '$', max: 1000000, adv: true }, BIRTH(1975, undefined, undefined, undefined, undefined, true)],
    run: (v) => {
      const pay = n(v, 'pay'), dv = n(v, 'def');
      const d = deferral('401k', by(v), pay);
      const own = Math.min(dv, d.total);
      const cu = Math.max(0, own - d.base);
      const m = match(pay, own, n(v, 'mr') / 100, n(v, 'up') / 100);
      const a = annualAdditions(pay, own, m + n(v, 'ps'), n(v, 'at'), cu);
      return { label: a.over > 0 ? 'Over the 415(c) limit by' : 'Room left under the 415(c) limit', value: usd(a.over > 0 ? a.over : a.room), sub: `Limit ${usd(a.cap)}${cu ? `, plus ${usd(cu)} of catch-up outside it` : ''}.`,
        rows: [['Your deferrals counted', usd(own - cu), own - cu], ['Employer match', usd(m), m], ['Other employer and after-tax money', usd(n(v, 'ps') + n(v, 'at')), n(v, 'ps') + n(v, 'at')], ['Total counted', usd(a.counted)]] };
    },
  }),

  /* Solo 401(k) */
  solo: (arg) => ({
    inputs: [{ id: 'profit', label: 'Net profit (Schedule C)', def: Number(arg?.profit ?? 120000), unit: '$', max: 10000000, wide: true }, BIRTH(Number(arg?.by ?? 1972))],
    run: (v) => {
      const r = solo401k(n(v, 'profit'), by(v));
      return { label: 'Your 2026 solo 401(k) maximum', value: usd(r.total), sub: `As employee ${usd(r.employee + r.catchUp)}, as employer ${usd(r.employer)}.`,
        rows: [['Employee deferral', usd(r.employee), r.employee], ['Catch-up', usd(r.catchUp), r.catchUp], ['Employer profit sharing (20 %)', usd(r.employer), r.employer], ['Half of self-employment tax deducted first', usd(r.half)]],
        note: `Self-employment tax: ${pct(P.se.ssRate, 1)} up to the ${usd(L.wageBase)} wage base and ${pct(P.se.medicareRate, 1)} on ${pct(P.se.netEarningsFactor, 2)} of profit (Topic 554).` };
    },
  }),

  /* SEP IRA */
  sep: (arg) => ({
    inputs: [{ id: 'pay', label: 'Pay or net profit', def: Number(arg?.pay ?? 150000), unit: '$', max: 10000000, wide: true }, { kind: 'choice', id: 'se', label: 'You are', def: String(arg?.se ?? 'self'), options: [{ value: 'self', label: 'Self-employed' }, { value: 'emp', label: 'An employee' }] }],
    run: (v) => {
      const r = sep(n(v, 'pay'), s(v, 'se') === 'self');
      return { label: 'Your 2026 SEP IRA contribution', value: usd(r.amount), sub: r.limitedBy === '415c' ? `Capped at ${usd(L.total415c)}.` : r.limitedBy === 'comp' ? `Pay counted up to ${usd(L.compensationCap)}.` : `${pct(r.rate, 0)} of ${s(v, 'se') === 'self' ? 'net earnings after half the self-employment tax' : 'pay'}.`,
        rows: [['Compensation used', usd(r.capped), r.capped], ['Rate', pct(r.rate, 0)], ['Dollar cap', usd(L.total415c)], ['Pay that reaches the cap', usd(L.total415c / r.rate)]] };
    },
  }),

  /* SIMPLE IRA */
  simple: (arg) => ({
    inputs: [PAY(Number(arg?.pay ?? 70000)), BIRTH(Number(arg?.by ?? 1970)), { kind: 'choice', id: 'big', label: 'Employer size', def: String(arg?.big ?? 'small'), options: [{ value: 'small', label: '25 or fewer' }, { value: 'large', label: '26 to 100' }] },
      { kind: 'choice', id: 'emp', label: 'Employer pays', def: 'match', options: [{ value: 'match', label: '3 % match' }, { value: 'flat', label: '2 % of pay' }] }],
    run: (v) => {
      // Employers with 25 or fewer employees get the higher limits automatically (Notice 2025-67, § 408(p)(2)(E)(i)(I)).
      const plan: Plan = s(v, 'big') === 'small' ? 'simpleApplicable' : 'simple';
      const d = deferral(plan, by(v), n(v, 'pay'));
      const er = s(v, 'emp') === 'match' ? Math.min(d.total, n(v, 'pay') * 0.03) : Math.min(n(v, 'pay'), L.compensationCap) * 0.02;
      return { label: 'Your 2026 SIMPLE deferral limit', value: usd(d.total), sub: `Plus ${usd(er)} from the employer.`,
        rows: [['Base limit', usd(d.base), d.base], ['Catch-up', usd(d.catchUp), d.catchUp], ['Employer contribution', usd(er), er], ['Total going in', usd(d.total + er)]] };
    },
  }),

  /* 403(b) + 457(b) stacking */
  stack: (arg) => ({
    inputs: [PAY(Number(arg?.pay ?? 85000)), BIRTH(Number(arg?.by ?? 1974))],
    run: (v) => {
      const r = stack457(by(v), n(v, 'pay'));
      return { label: '403(b) and 457(b) together in 2026', value: usd(r.total), sub: 'Two separate limits: a governmental 457(b) does not share the 403(b) or 401(k) limit.',
        rows: [['403(b) or 401(k) deferral', usd(r.first.total), r.first.total], ['Governmental 457(b) deferral', usd(r.second.total), r.second.total], ['Catch-up in each plan', usd(r.first.catchUp)], ['Share of pay', pct(r.total / Math.max(1, n(v, 'pay')), 0)]] };
    },
  }),

  /* IRA limit */
  ira: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1975)), { id: 'comp', label: 'Taxable compensation', def: Number(arg?.comp ?? 60000), unit: '$', max: 10000000, help: 'Wages, self-employment income, taxable alimony' }],
    run: (v) => {
      const age = ageAtYearEnd(by(v));
      const r = iraLimit(age, n(v, 'comp'));
      return { label: 'Your 2026 IRA limit', value: usd(r.limit), sub: r.cappedByPay ? 'Limited to your taxable compensation.' : age >= 50 ? `${usd(L.ira)} plus the ${usd(L.iraCatchUp)} catch-up.` : `The catch-up starts the year you turn 50 (${by(v) + 50}).`,
        rows: [['Base limit', usd(L.ira), L.ira], ['Catch-up at 50', usd(age >= 50 ? L.iraCatchUp : 0), age >= 50 ? L.iraCatchUp : 0], ['Shared by traditional and Roth IRAs', usd(r.limit)], ['Deadline', 'April 15, 2027']] };
    },
  }),

  /* Spousal IRA */
  spousal: (arg) => ({
    inputs: [{ id: 'pa', label: 'Your compensation', def: Number(arg?.pa ?? 80000), unit: '$', max: 10000000 }, { id: 'pb', label: 'Spouse’s compensation', def: Number(arg?.pb ?? 0), unit: '$', max: 10000000 },
      BIRTH(Number(arg?.by ?? 1972), 'Year you were born'), BIRTH(Number(arg?.sb ?? 1978), 'Year your spouse was born', 'sb')],
    run: (v) => {
      const r = spousal(ageAtYearEnd(by(v)), ageAtYearEnd(by(v, 'sb')), n(v, 'pa'), n(v, 'pb'));
      return { label: 'Two IRAs on a joint return', value: usd(r.total), sub: 'Each IRA is in one name; the joint pay only has to cover both contributions.',
        rows: [['Your IRA', usd(r.a), r.a], ['Spouse’s IRA', usd(r.b), r.b], ['Joint compensation', usd(n(v, 'pa') + n(v, 'pb'))]] };
    },
  }),

  /* Reduced Roth IRA */
  roth: (arg) => ({
    inputs: [{ ...FILING, def: String(arg?.f ?? 'single') }, { id: 'magi', label: 'Modified AGI', def: Number(arg?.magi ?? 160000), unit: '$', max: 10000000, help: 'Worksheet 2-1 of Publication 590-A' }, BIRTH(Number(arg?.by ?? 1980)),
      { id: 'comp', label: 'Taxable compensation', def: Number(arg?.comp ?? 150000), unit: '$', max: 10000000, adv: true }, { id: 'other', label: 'Already put in traditional IRAs', def: 0, unit: '$', max: 100000, adv: true }],
    run: (v) => {
      const f = s(v, 'f') as Filing;
      const r = rothReduced(f, n(v, 'magi'), ageAtYearEnd(by(v)), n(v, 'comp'), n(v, 'other'));
      const rows: Array<[string, string, number?]> = [['Phase-out range', range(r.range)], ['Share of the range used', pct(r.share, 1)], ['Limit before the reduction', usd(r.limit), r.limit], ['Reduced Roth contribution', usd(r.reduced), r.reduced]];
      const step = (r.range[1] - r.range[0]) / 5;
      return { label: 'You can put in a Roth IRA for 2026', value: usd(r.reduced), sub: r.status === 'full' ? 'Below the phase-out range: the full amount.' : r.status === 'none' ? 'At or above the top of the range: no direct contribution.' : 'Worksheet 2-2: reduction rounded up to $10, never under $200.',
        rows, table: { caption: 'Reduced amount across the range', headers: ['MAGI', 'Roth IRA'], rows: [0, 1, 2, 3, 4, 5].map((k) => { const m = r.range[0] + step * k; return [usd(m), usd(rothReduced(f, m, ageAtYearEnd(by(v)), n(v, 'comp')).reduced)]; }), align: ['r', 'r'] } };
    },
  }),

  /* Traditional IRA deduction */
  deduct: (arg) => ({
    inputs: [{ ...FILING, def: String(arg?.f ?? 'single') }, { kind: 'select', id: 'cov', label: 'Covered by a workplace plan', def: String(arg?.cov ?? 'you'), options: [{ value: 'you', label: 'Yes, me' }, { value: 'spouse', label: 'Only my spouse' }, { value: 'both', label: 'Both of us' }, { value: 'none', label: 'Neither' }] },
      { id: 'magi', label: 'Modified AGI', def: Number(arg?.magi ?? 86000), unit: '$', max: 10000000 }, BIRTH(Number(arg?.by ?? 1975))],
    run: (v) => {
      const f = s(v, 'f') as Filing, cov = s(v, 'cov') as Coverage;
      const r = deductible(f, cov, n(v, 'magi'), ageAtYearEnd(by(v)), Infinity);
      return { label: 'Deductible part of a 2026 IRA contribution', value: usd(r.deductible), sub: !r.range ? 'No workplace plan in the picture: fully deductible at any income.' : r.status === 'reduced' ? `Inside the ${range(r.range)} range.` : r.status === 'none' ? `At or above ${usd(r.range[1])}: nothing deductible.` : `Below ${usd(r.range[0])}: fully deductible.`,
        rows: [['IRA limit', usd(r.limit), r.limit], ['Deductible', usd(r.deductible), r.deductible], ['Nondeductible (Form 8606)', usd(r.nondeductible), r.nondeductible], ['Phase-out range', r.range ? range(r.range) : 'none']] };
    },
  }),

  /* IRA and 401(k) together */
  both: (arg) => ({
    inputs: [PAY(Number(arg?.pay ?? 85000)), BIRTH(Number(arg?.by ?? 1976))],
    run: (v) => {
      const age = ageAtYearEnd(by(v));
      const d = deferral('401k', by(v), n(v, 'pay'));
      // IRA compensation = W-2 box 1 (Pub. 590-A, What Is Compensation?), which excludes pre-tax elective
      // deferrals (General Instructions for Forms W-2 and W-3, box 1). The deferral is taken as pre-tax here.
      const comp = Math.max(0, n(v, 'pay') - d.total);
      const i = iraLimit(age, comp).limit;
      return { label: '401(k) and IRA in the same year', value: usd(d.total + i), sub: i < iraLimit(age, Infinity).limit ? `IRA capped at your taxable pay after the pre-tax 401(k) deferral, ${usd(comp)} (W-2 box 1).` : 'Separate limits: a 401(k) deferral does not reduce the IRA limit, only the pay it is tested against.',
        rows: [['401(k) deferral', usd(d.total), d.total], ['IRA, traditional or Roth', usd(i), i], ['Share of pay', pct((d.total + i) / Math.max(1, n(v, 'pay')), 0)]] };
    },
  }),

  /* HSA */
  hsa: (arg) => ({
    inputs: [{ kind: 'choice', id: 'cov', label: 'HDHP coverage', def: String(arg?.cov ?? 'self'), options: [{ value: 'self', label: 'Self-only' }, { value: 'family', label: 'Family' }] }, BIRTH(Number(arg?.by ?? 1975)),
      { id: 'm', label: 'Months eligible on the 1st', def: Number(arg?.m ?? 12), unit: 'mo', max: 12 }, { id: 'er', label: 'Employer contributions', def: Number(arg?.er ?? 0), unit: '$', max: 100000 },
      yesNo('lm', 'Use the last-month rule', 'no'), { kind: 'choice', id: 'y', label: 'Year', def: String(arg?.y ?? '2026'), options: [{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }], adv: true }],
    run: (v) => {
      const y = s(v, 'y') as '2026' | '2027';
      const r = hsa(s(v, 'cov') as HsaCover, Number(y) - by(v), n(v, 'm'), n(v, 'er'), s(v, 'lm') === 'yes', y);
      return { label: `Your ${y} HSA limit`, value: usd(r.total), sub: r.over ? `Employer money is ${usd(r.over)} over the limit.` : `You can still add ${usd(r.you)} yourself.`,
        rows: [['Coverage limit for your months', usd(r.base), r.base], ['Catch-up at 55', usd(r.catchUp), r.catchUp], ['Employer contributions', usd(n(v, 'er')), n(v, 'er')], ['HDHP minimum deductible', usd(r.minDeductible)]],
        note: s(v, 'lm') === 'yes' ? 'Last-month rule: eligible on December 1 counts as the full year, if you stay eligible through the next December 31.' : undefined };
    },
  }),

  /* Health FSA */
  fsa: (arg) => ({
    inputs: [{ id: 'el', label: 'Election for 2026', def: Number(arg?.el ?? 3400), unit: '$', max: 100000, wide: true }, { id: 'un', label: 'Unused at year end', def: Number(arg?.un ?? 900), unit: '$', max: 100000 }],
    run: (v) => {
      const r = healthFsa(n(v, 'el'), n(v, 'un'));
      return { label: 'Health FSA election allowed', value: usd(r.allowed), sub: r.over ? `${usd(r.over)} above the ${usd(r.limit)} limit.` : `Limit ${usd(r.limit)} per employer.`,
        rows: [['2026 limit', usd(r.limit), r.limit], ['Carryover if the plan allows it', usd(r.carry), r.carry], ['Lost (or grace period, if offered)', usd(r.lost), r.lost], ['Per paycheck, 26 pay periods', usd(r.allowed / 26)]] };
    },
  }),

  /* Dependent care FSA */
  dcfsa: (arg) => ({
    inputs: [{ kind: 'choice', id: 'mfs', label: 'Filing separately', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] }, { id: 'ey', label: 'Your earned income', def: Number(arg?.ey ?? 70000), unit: '$', max: 10000000 },
      { id: 'es', label: 'Spouse’s earned income', def: Number(arg?.es ?? 45000), unit: '$', max: 10000000, help: 'Leave 0 if single' }, { id: 'ex', label: 'Care expenses for the year', def: Number(arg?.ex ?? 12000), unit: '$', max: 1000000 }],
    run: (v) => {
      const r = dependentCare(s(v, 'mfs') === 'yes', n(v, 'ey'), n(v, 'es') > 0 ? n(v, 'es') : null, n(v, 'ex'));
      return { label: 'Dependent care FSA you can use', value: usd(r.usable), sub: r.limitedByEarnings ? 'Limited by the lower earned income.' : `Household cap ${usd(r.cap)}.`,
        rows: [['2026 cap', usd(r.cap), r.cap], ['Lower earned income', usd(r.earnedCap)], ['Limit for you', usd(r.limit), r.limit], ['Expenses not covered', usd(Math.max(0, n(v, 'ex') - r.usable))]] };
    },
  }),

  /* RMD for 2026 */
  rmd: (arg) => ({
    inputs: [{ id: 'bal', label: 'Balance on December 31, 2025', def: Number(arg?.bal ?? 500000), unit: '$', max: 100000000, wide: true }, BIRTH(Number(arg?.by ?? 1952), 'Year you were born', 'by', 1920, 1975),
      { kind: 'choice', id: 'sp', label: 'Sole beneficiary is your spouse', def: String(arg?.sp ?? 'no'), options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] }, BIRTH(Number(arg?.sb ?? 1960), 'Spouse’s birth year', 'sb', 1920, 2005),
      { id: 'g', label: 'Growth after each RMD', def: Number(arg?.g ?? 5), unit: '%', max: 20, decimals: 1, adv: true, help: 'An assumption for the schedule' }],
    run: (v) => {
      const age = 2026 - by(v), spAge = 2026 - by(v, 'sb');
      const sole = s(v, 'sp') === 'yes';
      const due = age >= applicableAge(by(v));
      const r = ownerRmd(n(v, 'bal'), age, spAge, sole, by(v));
      const f = firstRmdYear(by(v));
      const sch = schedule(n(v, 'bal'), by(v), 2026, 6, n(v, 'g') / 100, by(v, 'sb'), sole);
      return { label: due ? 'Your 2026 required minimum distribution' : 'No RMD due for 2026', value: due ? usd(r.rmd) : usd(0), sub: due ? `Balance ÷ ${dec(r.factor)} (${r.table} table, age ${age}).` : `First RMD for ${f.year}, at ${f.age}; deadline April 1, ${f.rbdYear}.`,
        rows: [['Age reached in 2026', String(age)], ['Table and factor', `${r.table}, ${dec(r.factor)}`], ['RMD with the Uniform table', usd(r.uniformRmd), r.uniformRmd], ['RMD with the table that applies', usd(r.rmd), r.rmd]],
        table: { caption: `Next RMDs at ${dec(n(v, 'g'))} % growth (an assumption)`, headers: ['Year', 'Age', 'Factor', 'RMD'], rows: sch.map((x) => [String(x.year), String(x.age), dec(x.factor), usd(x.rmd)]), align: ['l', 'r', 'r', 'r'] } };
    },
  }),

  /* Uniform Lifetime factor for an age */
  table: (arg) => ({
    inputs: [{ id: 'age', label: 'Age reached this year', def: Number(arg?.age ?? 75), unit: 'yrs', max: 120 }, { id: 'bal', label: 'Balance at last December 31', def: Number(arg?.bal ?? 250000), unit: '$', max: 100000000 }],
    run: (v) => {
      const a = Math.max(72, Math.min(120, Math.floor(n(v, 'age'))));
      const f = uniform(a)!;
      return { label: `Uniform Lifetime factor at ${a}`, value: dec(f), sub: `RMD = ${usd(n(v, 'bal'))} ÷ ${dec(f)} = ${usd(n(v, 'bal') / f)}.`,
        rows: [['Share of the balance', pct(1 / f, 2)], [`Factor at ${a + 1}`, dec(uniform(a + 1) ?? f)], [`Factor at ${a + 5}`, dec(uniform(a + 5) ?? f)], ['RMD this year', usd(n(v, 'bal') / f), n(v, 'bal') / f]],
        table: { caption: 'Uniform Lifetime Table around your age', headers: ['Age', 'Factor', 'Share'], rows: [-2, -1, 0, 1, 2, 3].map((k) => a + k).filter((x) => x >= 72 && x <= 120).map((x) => [String(x), dec(uniform(x)!), pct(1 / uniform(x)!, 2)]), align: ['l', 'r', 'r'] } };
    },
  }),

  /* RMD age by birth year */
  rmdage: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1959), 'Year you were born', 'by', 1940, 1975)],
    run: (v) => {
      const f = firstRmdYear(by(v));
      const rule = ageRule(by(v));
      return { label: 'Your RMD age', value: f.age === 70.5 ? '70½' : String(f.age), sub: `First RMD for ${f.year}; it can wait until April 1, ${f.rbdYear}, then the second is due by December 31, ${f.rbdYear}.`,
        rows: [['First distribution year', String(f.year)], ['Required beginning date', longDate(f.rbd)], ['Rule', rule.note], ['Uniform factor that first year', dec(uniform(f.age === 70.5 ? 72 : f.age)!)]] };
    },
  }),

  /* Joint table when the spouse is more than 10 years younger */
  joint: (arg) => ({
    inputs: [{ id: 'oa', label: 'Your age this year', def: Number(arg?.oa ?? 76), unit: 'yrs', max: 120 }, { id: 'sa', label: 'Spouse’s age this year', def: Number(arg?.sa ?? 62), unit: 'yrs', max: 120 }, { id: 'bal', label: 'Balance at last December 31', def: Number(arg?.bal ?? 800000), unit: '$', max: 100000000, wide: true }],
    run: (v) => {
      const oa = Math.max(72, Math.min(120, n(v, 'oa'))), sa = n(v, 'sa');
      const j = joint(oa, sa), u = uniform(oa)!;
      const f = j ?? u;
      return { label: j ? 'RMD with the Joint and Last Survivor table' : 'Uniform Lifetime table applies', value: usd(n(v, 'bal') / f), sub: j ? `Factor ${dec(j)} instead of ${dec(u)}: ${usd(n(v, 'bal') / u - n(v, 'bal') / j)} less to take out.` : `Your spouse is not more than ${P.rmd.jointYoungerBy} years younger.`,
        rows: [['Age gap', `${oa - sa} years`], ['Uniform factor', dec(u)], ['Joint factor', j ? dec(j) : 'not used'], ['RMD with the Uniform table', usd(n(v, 'bal') / u), n(v, 'bal') / u]] };
    },
  }),

  /* Inherited IRA */
  inherited: (arg) => ({
    inputs: [{ id: 'bal', label: 'Inherited balance on December 31, 2025', def: Number(arg?.bal ?? 300000), unit: '$', max: 100000000, wide: true },
      { kind: 'select', id: 'b', label: 'You are the owner’s', def: String(arg?.b ?? 'other'), options: [{ value: 'other', label: 'Child (adult), other heir' }, { value: 'spouse', label: 'Spouse' }, { value: 'close', label: 'Heir 10 years younger or less' }, { value: 'minor', label: 'Minor child' }, { value: 'disabled', label: 'Disabled or chronically ill heir' }] },
      { kind: 'select', id: 'dy', label: 'Year the owner died', def: String(arg?.dy ?? 2023), options: years(2020, 2026) }, yesNo('rbd', 'Owner had started RMDs', String(arg?.rbd ?? 'yes') as 'yes' | 'no'),
      BIRTH(Number(arg?.by ?? 1975), 'Your birth year', 'by', 1930, 2025), { id: 'g', label: 'Growth', def: 5, unit: '%', max: 20, decimals: 1, adv: true }],
    run: (v) => {
      const dy = Number(v.dy);
      const r = inherited(n(v, 'bal'), s(v, 'b') as Beneficiary, dy, s(v, 'rbd') === 'yes', dy + 1 - by(v), 2026, n(v, 'g') / 100);
      return { label: 'Your 2026 inherited IRA RMD', value: usd(r.rmd), sub: r.deadline ? `Rule: ${r.rule}; empty the account by December 31, ${r.deadline}.` : `Rule: ${r.rule}.`,
        rows: [['Life expectancy factor for 2026', r.factor ? dec(r.factor) : 'none'], ['Account must be empty by', r.deadline ? String(r.deadline) : 'no fixed date'], ['Yearly RMDs', r.annual ? 'yes' : 'no'], ['Years left after 2026', r.deadline ? String(Math.max(0, r.deadline - 2026)) : 'n/a']],
        table: { caption: `Schedule from your balance at ${dec(n(v, 'g'))} % growth (an assumption)`, headers: ['Year', 'Factor', 'Minimum'], rows: r.plan.slice(0, 6).map((p) => [String(p.year), p.factor ? dec(p.factor) : p.rmd > 0 ? 'all' : 'none', usd(p.rmd)]), align: ['l', 'r', 'r'] } };
    },
  }),

  /* Missed RMD excise tax */
  penalty: (arg) => ({
    inputs: [{ id: 'req', label: 'RMD you had to take', def: Number(arg?.req ?? 20000), unit: '$', max: 10000000 }, { id: 'took', label: 'What you took by the deadline', def: Number(arg?.took ?? 5000), unit: '$', max: 10000000 }, yesNo('fix', 'Corrected within the window', String(arg?.fix ?? 'yes') as 'yes' | 'no')],
    run: (v) => {
      const r = excise(n(v, 'req'), n(v, 'took'), s(v, 'fix') === 'yes');
      return { label: 'Excise tax on the shortfall', value: usd(r.tax), sub: `${pct(r.rate, 0)} of ${usd(r.short)}, reported on Form 5329.`,
        rows: [['Shortfall', usd(r.short), r.short], [`At ${pct(P.rmd.exciseTax, 0)}`, usd(r.full), r.full], [`At ${pct(P.rmd.exciseTaxCorrected, 0)} once corrected`, usd(r.short * P.rmd.exciseTaxCorrected), r.short * P.rmd.exciseTaxCorrected], ['Saved by correcting', usd(r.saved)]] };
    },
  }),

  /* First RMD: take it now or by April 1 */
  first: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1953), 'Year you were born', 'by', 1945, 1975), { id: 'bal', label: 'Balance at the end of the year before your first RMD', def: Number(arg?.bal ?? 600000), unit: '$', max: 100000000 }, { id: 'g', label: 'Growth in that first year', def: 5, unit: '%', max: 20, decimals: 1, adv: true }],
    run: (v) => {
      const r = firstYearDouble(n(v, 'bal'), by(v), n(v, 'g') / 100);
      return { label: `Two RMDs in ${r.rbdYear} if you wait`, value: usd(r.both), sub: `First RMD (for ${r.year}) by April 1, ${r.rbdYear}; second (for ${r.rbdYear}) by December 31, ${r.rbdYear}.`,
        rows: [[`RMD for ${r.year}`, usd(r.first), r.first], [`RMD for ${r.rbdYear}`, usd(r.second), r.second], ['On one tax return if you wait', usd(r.both), r.both]] };
    },
  }),

  /* Qualified charitable distribution */
  qcd: (arg) => ({
    inputs: [{ id: 'rmd', label: 'Your RMD this year', def: Number(arg?.rmd ?? 24000), unit: '$', max: 10000000 }, { id: 'gift', label: 'Sent straight to charity from the IRA', def: Number(arg?.gift ?? 10000), unit: '$', max: 10000000 }],
    run: (v) => {
      const r = qcd(n(v, 'rmd'), n(v, 'gift'));
      return { label: 'RMD left in your taxable income', value: usd(r.taxableRmd), sub: `${usd(r.qcd)} of qualified charitable distributions, cap ${usd(r.cap)} for 2026.`,
        rows: [['RMD', usd(n(v, 'rmd')), n(v, 'rmd')], ['Covered by the QCD', usd(r.coversRmd), r.coversRmd], ['Taxable part of the RMD', usd(r.taxableRmd), r.taxableRmd]] };
    },
  }),

  /* Several accounts: who withdraws from where */
  accounts: (arg) => ({
    inputs: [{ id: 'i1', label: 'Traditional IRA A', def: Number(arg?.i1 ?? 300000), unit: '$', max: 100000000 }, { id: 'i2', label: 'Traditional IRA B', def: Number(arg?.i2 ?? 120000), unit: '$', max: 100000000 },
      { id: 'k1', label: 'Old 401(k)', def: Number(arg?.k1 ?? 250000), unit: '$', max: 100000000 }, { id: 'age', label: 'Age reached in 2026', def: Number(arg?.age ?? 76), unit: 'yrs', max: 120 }],
    run: (v) => {
      const f = uniform(Math.max(72, n(v, 'age')))!;
      const ira = (n(v, 'i1') + n(v, 'i2')) / f, k = n(v, 'k1') / f;
      return { label: 'Total RMD for 2026', value: usd(ira + k), sub: 'The IRA total can come from either IRA; the 401(k) RMD must come from the 401(k).',
        rows: [['IRAs together (any mix)', usd(ira), ira], ['401(k), from that plan only', usd(k), k], ['Factor used', dec(f)]] };
    },
  }),

  /* History */
  history: (arg) => ({
    inputs: [{ kind: 'select', id: 'y', label: 'Year', def: String(arg?.y ?? '2023'), options: P.history.years.map((y) => ({ value: String(y), label: String(y) })).reverse() }, BIRTH(Number(arg?.by ?? 1970))],
    run: (v) => {
      const H = P.history; const i = H.years.indexOf(Number(v.y)); const age = Number(v.y) - by(v);
      const sup = age >= 60 && age <= 63 && H.catchUp6063[i] > 0;
      const c = sup ? H.catchUp6063[i] : age >= 50 ? H.catchUp50[i] : 0;
      const ira = H.ira[i] + (age >= 50 ? H.iraCatchUp[i] : 0);
      return { label: `Your ${v.y} 401(k) limit`, value: usd(H.deferral[i] + c), sub: `Against ${usd(L.deferral + (catchUp('401k', ageAtYearEnd(by(v))) ?? 0))} for 2026.`,
        rows: [['Base deferral', usd(H.deferral[i]), H.deferral[i]], [sup ? 'Age 60 to 63 catch-up then' : 'Catch-up at your age then', usd(c), c], ['IRA limit at your age then', usd(ira)], ['Annual additions (415(c))', usd(H.total415c[i])]],
        table: { caption: 'IRS limits by year', headers: ['Year', '401(k)', 'Catch-up', 'IRA', '415(c)'], rows: H.years.map((y, k) => [String(y), usd(H.deferral[k]), usd(H.catchUp50[k]), usd(H.ira[k]), usd(H.total415c[k])]).reverse(), align: ['l', 'r', 'r', 'r', 'r'] } };
    },
  }),

  /* 2027: what is known, what comes in November */
  y2027: (arg) => ({
    inputs: [BIRTH(Number(arg?.by ?? 1966)), { kind: 'select', id: 'k', label: 'Limit', def: String(arg?.k ?? 'deferral'), options: [{ value: 'deferral', label: '401(k), 403(b), 457(b)' }, { value: 'ira', label: 'IRA' }, { value: 'hsa', label: 'HSA self-only' }, { value: 'hsaf', label: 'HSA family' }] }],
    run: (v) => {
      const k = s(v, 'k');
      const age27 = 2027 - by(v), age26 = 2026 - by(v);
      const ok = announced('2027');
      const d26 = k === 'deferral' ? deferral('401k', by(v), Infinity).total : k === 'ira' ? iraLimit(age26, Infinity).limit : hsa(k === 'hsaf' ? 'family' : 'self', age26).total;
      const hsaKnown = k === 'hsa' || k === 'hsaf';
      let d27: number | null = null;
      if (hsaKnown) d27 = hsa(k === 'hsaf' ? 'family' : 'self', age27, 12, 0, false, '2027').total;
      else if (ok && k === 'deferral') d27 = deferral('401k', by(v), Infinity, 0, '2027').total;
      else if (ok && k === 'ira') { const l = lim('2027') as Record<string, number>; d27 = l.ira + (age27 >= 50 ? l.iraCatchUp : 0); }
      return { label: `Your 2027 limit`, value: d27 === null ? 'Not announced' : usd(d27), sub: d27 === null ? `The IRS publishes the 2027 plan and IRA limits ${String(L27.expected)}. Your 2026 figure: ${usd(d26)}.` : `Against ${usd(d26)} in 2026${hsaKnown ? ' (Rev. Proc. 2026-24)' : ''}.`,
        rows: [['Your age at the end of 2027', String(age27)], ['2026 limit for you', usd(d26), d26], ['2027 limit for you', d27 === null ? 'to come' : usd(d27), d27 ?? 0], ['Status', hsaKnown ? 'published' : ok ? 'published' : 'expected mid-November']] };
    },
  }),
};

/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: i.kind === 'select' || i.kind === 'choice' ? String(arg[i.id]) : arg[i.id] } as typeof i))) };
}
export const TOOL_KINDS = Object.keys(SPECS);
export { deductRange, rothRange };
