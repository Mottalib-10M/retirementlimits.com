import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const H = K.P.history;
const ok = K.announced('2027');
const N = K.lim('2027') as Record<string, unknown>;
const num = (k: string) => (ok && typeof N[k] === 'number' ? (N[k] as number) : 0);
const showN = (k: string) => (num(k) ? K.usd(num(k)) : 'not announced yet');
const band = (k: 'single' | 'joint') => {
  const r = ok ? (N.rothPhase as Record<string, number[]> | undefined)?.[k] : undefined;
  return r ? `${K.usd(r[0])} to ${K.usd(r[1])}` : 'not announced yet';
};
const expected = String(K.L27.expected);
const ira27 = num('ira');
const S = L.rothPhase.single, J = L.rothPhase.joint;
const rows = H.years.map((y, i) => ({ y, ira: H.ira[i], cu: H.iraCatchUp[i] }));
// A saver born in 1977 turns 50 in 2027: first year of the IRA catch-up.
const late26 = K.rothReduced('single', 160000, 49, 160000);

export default defineGuide({
  id: 'ira-limits-2027',
  group: 'next',
  order: 85,
  slug: 'ira-limits-2027',
  nav: 'IRA limits 2027',
  card: ok ? 'The 2027 IRA limit, catch-up and Roth bands, against 2026' : 'Not announced yet: how the IRA limit is indexed and what to do before April 15',
  title: ok ? `IRA Limits 2027: ${K.usd(ira27)} Against ${K.usd(L.ira)} in 2026, Roth Bands` : 'IRA Limits 2027: Not Published Yet, 2026 Room Until April',
  description: ok
    ? `IRA limits 2027 from the IRS notice: ${K.usd(ira27)} against ${K.usd(L.ira)} in 2026, with the 2027 catch-up and Roth income bands. Your own 2027 IRA figure by birth year.`
    : `IRA limits 2027 are not published: the IRS sets them ${expected}. Meanwhile the 2026 limit of ${K.usd(L.ira)} stays open until April 15, 2027. How indexing works.`,
  h1: ok ? 'IRA limits 2027: the new amounts and Roth bands' : 'IRA limits 2027: not published yet, and what you can still do for 2026',
  intro: ok
    ? `The IRS has published the 2027 IRA amounts. The calculator compares your 2027 IRA limit with your 2026 one by birth year.`
    : `The 2027 IRA limit, catch-up and Roth income bands come in the same IRS notice as the 401(k) figures, and this page shows none of them until then. What it does show is how each one moves and what the 2026 deadline still allows.`,
  resume: ok
    ? `For 2027 the IRA contribution limit, shared by traditional and Roth IRAs, is ${K.usd(ira27)}, against ${K.usd(L.ira)} in 2026, and the catch-up from age 50 is ${showN('iraCatchUp')}. The Roth IRA phase-out runs from ${band('single')} for a single filer and from ${band('joint')} on a joint return. The limit still cannot exceed your taxable compensation for the year, and a spouse with no pay can contribute on the other spouse's earnings. Contributions for 2027 can be made from January 1, 2027 until the April 2028 filing deadline. Contributions for 2026 remain possible until April 15, 2027, at the 2026 limit of ${K.usd(L.ira)} (${K.usd(L.ira + L.iraCatchUp)} at 50 or over) and with the 2026 Roth bands, ${K.usd(S[0])} to ${K.usd(S[1])} single and ${K.usd(J[0])} to ${K.usd(J[1])} joint. The calculator gives your own 2027 figure from your year of birth.`
    : `The 2027 IRA contribution limit has not been announced. The IRS sets it in the autumn notice on retirement plan amounts, expected ${expected}; the 2026 notice came on November 13, 2025. Two rules decide how far it can move. The base limit, ${K.usd(L.ira)} in 2026, is indexed in steps of ${K.usd(500)}, rounded down, so it either stays put or jumps. The age 50 catch-up, ${K.usd(L.iraCatchUp)} in 2026, has been indexed since 2024 under SECURE 2.0, in steps of ${K.usd(100)}. The Roth income bands for 2027 are not published either. Nothing is lost by waiting: a contribution for 2026 can still be made until April 15, 2027, at the 2026 limit of ${K.usd(L.ira)}, or ${K.usd(L.ira + L.iraCatchUp)} from age 50, and with the 2026 Roth bands of ${K.usd(S[0])} to ${K.usd(S[1])} single and ${K.usd(J[0])} to ${K.usd(J[1])} joint.`,
  body: (h) => `
<h2>${ok ? 'The 2027 IRA amounts' : 'What is published and what is not'}</h2>
${h.table(['Amount', '2026', '2027'], [
  ['IRA limit, traditional and Roth together', K.usd(L.ira), showN('ira')],
  ['Catch-up from age 50', K.usd(L.iraCatchUp), showN('iraCatchUp')],
  ['Roth phase-out, single or head of household', `${K.usd(S[0])} to ${K.usd(S[1])}`, band('single')],
  ['Roth phase-out, married filing jointly', `${K.usd(J[0])} to ${K.usd(J[1])}`, band('joint')],
  ['Roth phase-out, married filing separately', `${K.usd(L.rothPhase.mfs[0])} to ${K.usd(L.rothPhase.mfs[1])}`, `${K.usd(L.rothPhase.mfs[0])} to ${K.usd(L.rothPhase.mfs[1])} (not indexed)`],
], ok ? '2026: Notice 2025-67. 2027: the IRS notice on 2027 amounts.' : `2026: Notice 2025-67. 2027: expected ${expected}.`, ['l', 'r', 'r'])}
<p>${ok
    ? `The 2027 base limit is ${K.usd(ira27)}${ira27 > L.ira ? `, up ${K.usd(ira27 - L.ira)} from 2026` : ', unchanged from 2026'}. The figures come from the IRS notice, read on irs.gov on the day of publication. They apply to contributions made for 2027, from January 1, 2027 until the April 2028 deadline, while any contribution designated for 2026 keeps the 2026 amounts. An automatic monthly deposit set during 2026 does not adjust on its own: to reach the new 2027 limit, raise it with the custodian or add the difference in one deposit later. The calculator below shows your own 2027 figure from your year of birth.`
    : `Only one line of the table is known for 2027: the married filing separately band, which the code fixes at ${K.usd(L.rothPhase.mfs[0])} to ${K.usd(L.rothPhase.mfs[1])} and never indexes. Everything else waits for the notice. A page that shows a 2027 IRA limit now is printing its own guess, and some still show ${K.usd(K.P.previous.ira)}, the 2025 amount, as though it were the current one.`}</p>
<h2>The ${K.usd(500)} step of the base limit</h2>
<p>Section 219(b)(5)(C) indexes the IRA limit to inflation, starting from the ${K.usd(5000)} that applied in 2008, with each result rounded down to the nearest multiple of ${K.usd(500)}. Two consequences follow. The limit never rises by an odd amount, and it can stand still for a year or two while inflation builds up below the next step. That is what happened between ${rows[1].y} and ${rows[2].y}, when it stayed at ${K.usd(rows[1].ira)}, before moving to ${K.usd(rows[3].ira)} for ${rows[3].y}.</p>
${h.table(['Year', 'IRA limit', 'Catch-up at 50', 'Total at 50+'], rows.map((r) => [String(r.y), K.usd(r.ira), K.usd(r.cu), K.usd(r.ira + r.cu)]), 'IRS figures; the 2027 row is added the day the notice is out.', ['l', 'r', 'r', 'r'])}
<h2>The ${K.usd(100)} step of the catch-up</h2>
<p>For two decades the IRA catch-up was a flat ${K.usd(H.iraCatchUp[0])}. SECURE 2.0 made it indexed for years after 2023, in multiples of ${K.usd(100)}, rounded down. The first change came for 2026, when it went to ${K.usd(L.iraCatchUp)}. Because the step is small, the catch-up will tend to rise more often than the base limit, by a hundred dollars at a time. The age test does not change: the catch-up applies from the year you turn 50, so someone born in 1977 can add it for the first time in 2027, on any date in the year (${h.a('ira-contribution-limits', 'IRA contribution limits')}).</p>
${h.mini('y2027', { t: 'Your 2027 IRA limit, or its status', p: ['by'], d: { k: 'ira', by: 1977 } })}
<h2>The Roth bands for 2027</h2>
<p>The phase-out ranges of section 408A(c)(3) are indexed separately, with the start of each band rounded down to a multiple of ${K.usd(1000)}; the width of each band is set by the code (${K.usd(S[1] - S[0])} single, ${K.usd(J[1] - J[0])} joint) and does not move. The traditional IRA deduction bands follow the same kind of rule. The 2027 Roth test will be applied to your 2027 modified AGI, which is not known until the year is over, so a contribution made early in 2027 near the top of a band carries some risk whatever the published figures turn out to be. The ${h.a('roth-ira-income-limits', 'Roth income limit page')} shows how the reduced amount is computed with the bands in force.</p>
<h2>Deduction bands for people covered at work</h2>
<p>A traditional IRA contribution is always allowed below the limit, whatever your income, but its deduction phases out if you or your spouse are covered by a workplace plan. Those bands move with the same notice. For 2026 a covered single filer loses the deduction between ${K.usd(L.deductPhase.singleCovered[0])} and ${K.usd(L.deductPhase.singleCovered[1])} of modified AGI, a covered spouse on a joint return between ${K.usd(L.deductPhase.jointCovered[0])} and ${K.usd(L.deductPhase.jointCovered[1])}, and a spouse who is not covered but is married to someone who is between ${K.usd(L.deductPhase.spouseCovered[0])} and ${K.usd(L.deductPhase.spouseCovered[1])}. The 2027 values are ${ok ? 'in the notice' : 'not announced yet'}; the ${h.a('traditional-ira-deduction-limits', 'deduction page')} computes the deductible part with the bands in force.</p>
<h2>The 2026 contribution is still open</h2>
<p>An IRA contribution for a tax year can be made until the unextended filing deadline of that year's return, so contributions for 2026 are accepted until April 15, 2027. A filing extension does not extend it. Any deposit made between January 1 and April 15, 2027 must be marked for one year or the other: tell the custodian which year when you contribute, since a deposit not designated is usually treated as being for the current year.</p>
<p>The 2026 rules apply to a 2026 contribution even when it is made in 2027: the ${K.usd(L.ira)} limit, the ${K.usd(L.iraCatchUp)} catch-up if you were 50 by December 31, 2026, and the 2026 Roth bands tested on 2026 income. A single filer aged 49 at the end of 2026 with ${K.usd(160000)} of MAGI can still put ${K.usd(late26.reduced)} in a Roth IRA for 2026 at any time before the deadline, once the year's income is known for sure. Since the income is final by then, a Roth contribution for a past year carries none of the excess risk of an early one.</p>
<h2>What to do while waiting</h2>
<p>If you have not yet used your 2026 room, that is the move with no unknowns left. For 2027, a monthly automatic deposit can be set at the 2026 rate and raised once the notice is out; you can catch up the difference in a single deposit later in the year or before April 2028. Couples with one earner can fund a ${h.a('spousal-ira', 'spousal IRA')} for each spouse for both years. The 2027 figures for workplace plans arrive in the same notice (${h.a('401k-limits-2027', '401(k) limits 2027')}), while the ${h.a('hsa-limits-2027', '2027 HSA limits')} are already final.</p>
`,
  faqs: [
    { q: 'Can I still make a 2026 Roth IRA contribution in early 2027?', a: `Yes, until April 15, 2027. Tell the custodian the deposit is for 2026. The 2026 rules apply: ${K.usd(L.ira)}, or ${K.usd(L.ira + L.iraCatchUp)} if you were 50 by December 31, 2026, reduced by the 2026 Roth bands on your 2026 modified AGI. A filing extension does not move this deadline.` },
    { q: `Why does the IRA limit move by ${K.usd(500)} while the IRA catch-up moves by ${K.usd(100)}?`, a: `The code rounds each one to a different step. The base limit of section 219(b)(5)(A) is indexed in multiples of ${K.usd(500)}, rounded down. The catch-up was a fixed amount until SECURE 2.0 indexed it for years after 2023, in multiples of ${K.usd(100)}. A smaller step means smaller but more frequent changes.` },
    { q: 'I turn 50 in 2027: when can I start adding the IRA catch-up?', a: `From January 1, 2027, for your 2027 contribution, because the test is the age you reach by December 31 of the tax year. For 2026 you were still 49, so a 2026 contribution made in early 2027 stays at ${K.usd(L.ira)} without the catch-up. The 2027 catch-up amount is ${ok ? showN('iraCatchUp') : 'not announced yet'}.` },
    { q: 'Will the 2027 Roth IRA income test use my 2026 or my 2027 income?', a: `Your 2027 modified AGI, compared with the 2027 phase-out bands. For a 2026 contribution, made before April 15, 2027, it is 2026 income against the 2026 bands. The year of the contribution decides both the limit and the income test, not the date on which the money is deposited.` },
  ],
  tool: 'y2027',
  toolArg: { k: 'ira', by: 1977 },
  related: ['ira-contribution-limits', 'roth-ira-income-limits', '401k-limits-2027', 'spousal-ira', '401k-limits-by-year'],
  sources: ['notice_2025_67', 'ir_2025_111', 'irs_cola', 'pub590a'],
});
