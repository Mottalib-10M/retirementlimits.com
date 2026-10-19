import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const H = K.P.history;
const ok = K.announced('2027');
const N = K.lim('2027') as Record<string, unknown>;
const v27 = (k: string) => (ok && typeof N[k] === 'number' ? (N[k] as number) : 0);
const show = (k: string) => (v27(k) ? K.usd(v27(k)) : 'not announced yet');
const expected = String(K.L27.expected);
const d27 = v27('deferral');
const hsa27 = { self: K.L27.hsaSelf, family: K.L27.hsaFamily };
const steps = H.years.map((y, i) => ({ y, d: H.deferral[i], c: H.catchUp50[i], t: H.total415c[i] }));
// Birth years of the age 60 to 63 catch-up in 2027 (turning 60 to 63 that year), and the 2026 group that leaves it.
const sup27 = [2027 - 63, 2027 - 60];
const sup26 = [2026 - 63, 2026 - 60];

export default defineGuide({
  id: '401k-limits-2027',
  group: 'next',
  order: 80,
  slug: '401k-limits-2027',
  nav: '401(k) limits 2027',
  card: ok ? 'The 2027 deferral, catch-ups and 415(c) cap, against 2026' : 'Not announced yet: when the IRS publishes it and what is already settled',
  title: ok ? `401k Limits 2027: ${K.usd(d27)} Deferral Against ${K.usd(L.deferral)} in 2026` : '401k Limits 2027: Not Announced Yet, Due November 2026',
  description: ok
    ? `401k limits 2027 from the IRS notice: ${K.usd(d27)} deferral, against ${K.usd(L.deferral)} in 2026, with the 2027 catch-ups and 415(c) cap. Find your own 2027 figure in one step.`
    : `401k limits 2027 are not out: the IRS publishes them ${expected}, as it did on Nov. 13 for 2026 (${K.usd(L.deferral)}). What is settled now and what to do meanwhile.`,
  h1: ok ? '401(k) limits 2027: the new figures next to 2026' : '401(k) limits 2027: not announced yet, here is what is known',
  intro: ok
    ? `The IRS has published the 2027 plan limits. The calculator compares your 2027 deferral limit with your 2026 one, by birth year.`
    : `The IRS has not yet published the 2027 401(k) limits, and this page does not guess them. It explains when they come, how they are computed, and which 2027 facts are already settled.`,
  resume: ok
    ? `The IRS has set the 2027 elective deferral limit for 401(k), 403(b), governmental 457(b) plans and the Thrift Savings Plan at ${K.usd(d27)}, against ${K.usd(L.deferral)} for 2026. The age 50 catch-up is ${show('catchUp50')}, the catch-up for those who turn 60 to 63 in 2027 is ${show('catchUp6063')}, and the total additions cap of section 415(c) is ${show('total415c')}. The age 60 to 63 catch-up applies in 2027 to people born from ${sup27[0]} to ${sup27[1]}; anyone born in ${sup26[0]} turns 64 and goes back to the standard catch-up. The Roth catch-up test for 2027 looks at 2026 FICA wages from the employer sponsoring the plan, compared with a threshold of ${show('rothCatchUpWageThreshold')}. HSA limits for 2027 were set earlier: ${K.usd(hsa27.self)} self-only and ${K.usd(hsa27.family)} family. The calculator above shows your own 2027 figure next to the 2026 one, from your year of birth.`
    : `The 2027 limits for 401(k), 403(b), governmental 457(b) plans and the Thrift Savings Plan are not announced yet. The IRS publishes them each autumn in a notice, expected ${expected}; the 2026 figures came out on November 13, 2025, in Notice 2025-67, with a deferral limit of ${K.usd(L.deferral)}. Until then this site shows no 2027 amount, because any number would be a projection, and projections for this limit regularly miss by ${K.usd(500)} because of the way the IRS rounds. Some things about 2027 are already settled: the age 60 to 63 catch-up applies to people born from ${sup27[0]} to ${sup27[1]}, the Roth catch-up test will look at 2026 FICA wages from the employer, and the 2027 HSA limits are final at ${K.usd(hsa27.self)} self-only and ${K.usd(hsa27.family)} family. Meanwhile, the 2026 limit still applies to every paycheck dated in 2026.`,
  body: (h) => `
<h2>${ok ? 'The 2027 figures next to 2026' : 'Where the 2027 figures stand today'}</h2>
${h.table(['Limit', '2026', '2027'], [
  ['Elective deferral (401(k), 403(b), TSP)', K.usd(L.deferral), show('deferral')],
  ['Governmental 457(b)', K.usd(L.gov457), show('gov457')],
  ['Catch-up from age 50', K.usd(L.catchUp50), show('catchUp50')],
  ['Catch-up at 60 to 63', K.usd(L.catchUp6063), show('catchUp6063')],
  ['Total additions, section 415(c)', K.usd(L.total415c), show('total415c')],
  ['Compensation cap, section 401(a)(17)', K.usd(L.compensationCap), show('compensationCap')],
  ['Roth catch-up wage threshold', K.usd(L.rothCatchUpWageThreshold), show('rothCatchUpWageThreshold')],
  ['HSA, self-only and family', `${K.usd(L.hsaSelf)} / ${K.usd(L.hsaFamily)}`, `${K.usd(hsa27.self)} / ${K.usd(hsa27.family)}`],
], ok ? 'From the IRS notice on 2027 limits and Rev. Proc. 2026-24 for the HSA.' : `2026 from Notice 2025-67. 2027: HSA from Rev. Proc. 2026-24; plan limits expected ${expected}.`, ['l', 'r', 'r'])}
<p>${ok
    ? `The 2027 deferral limit is ${K.usd(d27)}, ${d27 > L.deferral ? `${K.usd(d27 - L.deferral)} more than` : 'the same as'} in 2026. Every other plan amount above comes from the same IRS notice, read on irs.gov. A percentage election set during 2026 carries into January and applies to the new ceiling automatically; a fixed dollar election does not, and needs to be raised by hand if you want to reach the new figure. The calculator below compares your own 2027 deferral room with what you had in 2026, catch-up included, from your year of birth.`
    : `Each plan cell in the 2027 column will be filled on the day the IRS releases its notice, with the figure read on irs.gov. Until then, the honest entry is that the number does not exist yet. Pages that print a "2027 401(k) limit" today are showing their own estimate, and some of them still show the 2025 figure of ${K.usd(K.P.previous.deferral)} as if it were current.`}</p>
<h2>When the IRS announces the limits</h2>
<p>The cost-of-living adjustments of section 415(d) depend on the consumer price index up to the quarter ending September 30. The September index is published in October, so the IRS can only compute the next year's amounts after that, and it usually releases them in late October or in November. For 2026 the notice was dated November 13, 2025 (${h.src('notice_2025_67', 'Notice 2025-67')}), with a news release the same day (${h.src('ir_2025_111', 'IR-2025-111')}). The ${h.src('irs_cola', 'IRS table of COLA increases')} is updated at the same time. This page will show the 2027 figures from the day they are published.</p>
<h2>How indexing and rounding work</h2>
<p>Each limit starts from a base amount written in the code and grows with inflation, but it does not rise smoothly. The deferral limit is rounded down to a multiple of ${K.usd(500)}, as is the age 50 catch-up. The section 415(c) cap moves in ${K.usd(1000)} steps and the compensation cap in ${K.usd(5000)} steps, also rounded down. Rounding down means a year of moderate inflation can leave a limit unchanged, and the gap is caught up later in a single jump.</p>
${h.table(['Year', 'Deferral', 'Catch-up at 50', '415(c) cap'], steps.map((s) => [String(s.y), K.usd(s.d), K.usd(s.c), K.usd(s.t)]), 'IRS figures for each year; the 2027 row is added when announced.', ['l', 'r', 'r', 'r'])}
<p>The table shows the pattern. The deferral rose by ${K.usd(steps[1].d - steps[0].d)}, then ${K.usd(steps[2].d - steps[1].d)}, then ${K.usd(steps[3].d - steps[2].d)}; the age 50 catch-up stayed at ${K.usd(steps[0].c)} for three years before moving to ${K.usd(steps[3].c)}. The age 60 to 63 amount follows its own rule: it was set at 150 % of the regular catch-up for 2025 and is indexed after that, which is why it stayed at ${K.usd(L.catchUp6063)} for 2026. ${ok ? '' : `This site does not turn this pattern into a forecast: a forecast that turns out ${K.usd(500)} too high would lead someone to over-defer and face an excess deferral to correct.`}</p>
${h.mini('y2027', { t: 'Your 2027 deferral, or its status, by birth year', p: ['by'], d: { k: 'deferral', by: 1965 } })}
<h2>What is already settled for 2027</h2>
<p>The age rules do not wait for the notice. In 2027, the larger catch-up applies to people who turn 60, 61, 62 or 63 that year, so to those born from ${sup27[0]} to ${sup27[1]}. Someone born in ${sup26[0]} used it in 2026, turns 64 in 2027 and goes back to the standard age 50 amount, a drop that payroll elections set as a fixed dollar amount will not make on their own. Someone born in ${sup27[1]} enters the group in 2027, and someone born in 1977 turns 50 and gets the regular catch-up for the first time (${h.a('super-catch-up-60-63', 'age 60 to 63 catch-up')}).</p>
<p>The Roth catch-up test for 2027 will use your 2026 FICA wages from the employer sponsoring the plan, box 3 of the W-2 you receive in early 2027. Its threshold for that test is also part of the coming notice. The HSA amounts are final already: ${K.usd(hsa27.self)} for self-only coverage and ${K.usd(hsa27.family)} for family coverage, under ${h.src('rp_2026_24', 'Rev. Proc. 2026-24')}, with the ${K.usd(K.L27.hsaCatchUp)} catch-up at 55 unchanged (${h.a('hsa-limits-2027', 'HSA limits 2027')}).</p>
<h2>Who the coming notice concerns</h2>
<p>The autumn notice is not only about 401(k) plans. The same document sets the deferral limit for 403(b) plans, the separate limit of governmental 457(b) plans, the Thrift Savings Plan used by federal employees and the military, and the lower limits of SIMPLE IRAs and SIMPLE 401(k)s. It also fixes the amounts employers test against: the highly compensated employee threshold, ${K.usd(L.hce)} for 2026, the key employee threshold for top-heavy testing, and the minimum pay that brings a worker into a SEP. Payroll providers load the new values in December, so the first paycheck of January is usually the first one computed under them. For the IRA side of the same release, see the ${h.a('ira-limits-2027', 'IRA limits 2027 page')}.</p>
<h2>What to do in the meantime</h2>
<p>Finish 2026 first: the ${K.usd(L.deferral)} limit applies to deferrals taken from paychecks dated in 2026, so a December bonus can still help you reach it. If your election is a percentage of pay, it simply carries into 2027 and will put more in if your salary rises; if it is a dollar amount, plan to revise it once the notice is out. Many plans let you change the election online in a few minutes, and the change usually takes effect within one or two payroll cycles, so a January update is enough. If you turn 64 in 2027, lower a fixed catch-up election at the turn of the year. For year-by-year figures see the ${h.a('401k-limits-by-year', 'history page')}, and for the current year the ${h.a('401k-contribution-limits', '2026 401(k) limits')}.</p>
`,
  faqs: [
    { q: 'Should I change my 401(k) payroll election before the 2027 limit is known?', a: `Not yet, unless you turn 64 in 2027. A percentage election carries over and adjusts with your pay. A fixed dollar election can be raised once the IRS notice is out, and a January change is usually in time for most of the year. Make sure your 2026 deferrals reach the ${K.usd(L.deferral)} limit you are aiming for first.` },
    { q: 'I turn 64 in 2027: what happens to my larger catch-up?', a: `It ends. The ${K.usd(L.catchUp6063)} catch-up applies only in the calendar years you turn 60 to 63, so someone born in ${sup26[0]} uses it for the last time in 2026. In 2027 you return to the standard catch-up from age 50, ${ok ? `which is ${show('catchUp50')} for 2027` : `whose 2027 amount is not announced yet (it is ${K.usd(L.catchUp50)} in 2026)`}.` },
    { q: 'Why does the 401(k) limit sometimes stay the same from one year to the next?', a: `Because the IRS rounds each indexed amount down to a fixed step, ${K.usd(500)} for the deferral and the catch-up. If inflation is not enough to cross the next step, the figure stays put and the unused rise carries into later years. The catch-up at 50 stayed at ${K.usd(H.catchUp50[0])} from ${H.years[0]} to ${H.years[2]} for this reason.` },
    { q: 'Which wages decide whether my 2027 catch-up must be Roth?', a: `Your 2026 FICA wages from the employer that sponsors the plan, shown in box 3 of the W-2 for 2026. If they exceed the threshold the IRS sets for that test, ${ok ? show('rothCatchUpWageThreshold') : `not announced yet (${K.usd(L.rothCatchUpWageThreshold)} for the 2026 test)`}, your 2027 catch-up contributions must be designated Roth. Wages from other employers do not count.` },
  ],
  tool: 'y2027',
  toolArg: { k: 'deferral', by: 1966 },
  related: ['401k-contribution-limits', 'ira-limits-2027', 'hsa-limits-2027', '401k-limits-by-year', 'super-catch-up-60-63'],
  sources: ['notice_2025_67', 'ir_2025_111', 'irs_cola', 'rp_2026_24'],
});
