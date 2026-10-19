import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const C = L.total415c;
// Case: $150,000 of pay, full deferral, three match formulas.
const pay = 150000;
const f1 = K.match(pay, L.deferral, 0.5, 0.06);
const f2 = K.match(pay, L.deferral, 1, 0.04);
const f3 = K.match(pay, L.deferral, 1, 0.06);
const a1 = K.annualAdditions(pay, L.deferral, f1);
const a3 = K.annualAdditions(pay, L.deferral, f3);
// Above the compensation cap: $500,000 of pay, 100 % up to 6 %.
const big = 500000;
const capM = K.match(big, L.deferral, 1, 0.06);
// Low pay: $40,000, deferring $10,000, match 100 % up to 6 % plus $25,000 of profit sharing.
const lowM = K.match(40000, 10000, 1, 0.06);
const low = K.annualAdditions(40000, 10000, lowM + 25000);
// Mega backdoor room at 150k with the 50 % up to 6 % match.
const mega = a1.room;

export default defineGuide({
  id: 'employer-401k-contribution-limit',
  group: 'plans',
  order: 40,
  slug: 'employer-401k-contribution-limit',
  nav: 'Employer contribution limit',
  card: 'The 415(c) total for you and your employer together, and the room left',
  title: `Employer 401(k) Contribution Limit 2026: ${K.usd(C)} in Total`,
  description: `Employer 401(k) contribution limit 2026: ${K.usd(C)} or 100 % of pay for you and the employer together, pay counted to ${K.usd(L.compensationCap)}. See the room you have left.`,
  h1: 'Employer 401(k) contribution limit 2026: the total that can go in',
  intro: `Your employer's match and profit sharing do not use your own deferral limit. They count toward a larger total, set by section 415(c), that covers every dollar added to your account in the year.`,
  resume: `For 2026 the total that can go into one person's 401(k) account from all sources is ${K.usd(C)} or 100 % of pay, whichever is lower (section 415(c), Notice 2025-67). It counts your own deferrals except catch-ups, the employer match, profit sharing or other employer contributions, and any after-tax money; catch-ups come on top, so ${K.usd(C + L.catchUp50)} at 50 and ${K.usd(C + L.catchUp6063)} at 60 to 63. Matches are computed on pay up to ${K.usd(L.compensationCap)}. On ${K.usd(pay)} of salary with the full ${K.usd(L.deferral)} deferred, a match of 50 % up to 6 % of pay brings in ${K.usd(f1)}, 100 % up to 4 % brings ${K.usd(f2)}, and 100 % up to 6 % brings ${K.usd(f3)}. In the first case ${K.usd(a1.room)} of the ${K.usd(C)} is still unused: that space is what a plan with after-tax contributions, the so-called mega backdoor Roth, lets you fill.`,
  body: (h) => `
<h2>What counts toward the ${K.usd(C)}</h2>
<p>Section 415(c) limits the annual additions to a participant's account in a defined contribution plan. Annual additions are your elective deferrals (pre-tax and Roth), employer matching and nonelective contributions, after-tax employee contributions and forfeitures allocated to you. Catch-up contributions, rollovers and loan repayments are excluded. The cap is the lesser of ${K.usd(C)} and 100 % of your compensation for the year, so for most workers the dollar figure is the one that binds, while for lower paid workers the 100 % test can be tighter than expected.</p>
${h.table(['Match formula', 'Match on ' + K.usd(pay), 'Your deferral', 'Total counted', 'Room left under ' + K.usd(C)], [
  ['50 % up to 6 % of pay', K.usd(f1), K.usd(L.deferral), K.usd(a1.counted), K.usd(a1.room)],
  ['100 % up to 4 % of pay', K.usd(f2), K.usd(L.deferral), K.usd(L.deferral + f2), K.usd(C - L.deferral - f2)],
  ['100 % up to 6 % of pay', K.usd(f3), K.usd(L.deferral), K.usd(a3.counted), K.usd(a3.room)],
], `Pay ${K.usd(pay)}, under 50, no profit sharing. Annual additions under section 415(c), Notice 2025-67.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The formulas read the same way in every plan. "50 % up to 6 %" means the employer adds 50 cents per dollar you defer, on deferrals up to 6 % of your pay: the most it gives is 3 % of pay, and only if you defer at least 6 %. "100 % up to 4 %" gives a dollar per dollar on the first 4 % of pay. A worker who defers less than the matched share leaves part of the match unclaimed; deferring more than the matched share earns no more match but still counts toward the total.</p>
${h.mini('total', { t: 'Your match formula against the limit', p: ['mr', 'up'], d: { pay: 150000, def: L.deferral, ps: 0 } })}
<h2>The compensation cap of ${K.usd(L.compensationCap)}</h2>
<p>Section 401(a)(17) stops a plan from counting pay above ${K.usd(L.compensationCap)} in 2026 when it computes contributions or runs its tests. A manager paid ${K.usd(big)} with a 100 % up to 6 % match would expect ${K.usd(big * 0.06)} of match; the plan can only use 6 % of ${K.usd(L.compensationCap)}, which is ${K.usd(capM)}. The same cap applies to profit sharing formulas and to SEP IRAs. For a high earner the practical consequence is that the match rate on total pay is lower than the formula suggests, and that the deferral percentage needed to receive the full match should be applied to the capped amount.</p>
<h2>When 100 % of pay is the lower limit</h2>
<p>The percentage limb mostly concerns part-time workers, people with a short working year and small business owners with a generous profit sharing plan. Take ${K.usd(40000)} of pay, ${K.usd(10000)} deferred, a 100 % up to 6 % match worth ${K.usd(lowM)} and a ${K.usd(25000)} profit sharing allocation. That totals ${K.usd(low.counted)}, above the ${K.usd(low.cap)} that 100 % of pay allows, so ${K.usd(low.over)} has to be corrected, usually by cutting back the profit sharing allocation. A catch-up made by the same worker, if over 50, would not be counted in that total.</p>
<h2>Separate employers, separate totals</h2>
<p>Your own deferral limit is personal and shared across every job. The 415(c) total is not: it applies per employer, so two unrelated employers each have a ${K.usd(C)} ceiling for the plan they sponsor. This is how a salaried employee with a side business can have a solo 401(k) with its own profit sharing, as long as the deferrals in both plans stay within one ${K.usd(L.deferral)} (${h.a('solo-401k-contribution-limits', 'solo 401(k) limits')}). Companies under common control, such as a parent and its subsidiaries, are treated as one employer.</p>
<h2>After-tax money and the mega backdoor Roth</h2>
<p>Some plans allow after-tax contributions in addition to pre-tax and Roth deferrals. They fall under the ${K.usd(C)} total, not under the ${K.usd(L.deferral)}. In the 50 % up to 6 % case, ${K.usd(mega)} of room remains; a plan that accepts after-tax money and then allows an in-plan Roth conversion, or an in-service rollover to a Roth IRA, lets you move that money into Roth quickly, before much earnings build up. That combination is what people call a mega backdoor Roth. Two limits apply in practice. The plan must offer both features, and after-tax contributions are tested together with the match in the ACP test, which can cut back highly compensated employees, those paid more than ${K.usd(L.hce)} in the prior year. A plan that fails the test returns the excess after year end.</p>
${h.mini('total', { t: 'Add profit sharing and see what remains', p: ['ps'], d: { pay: 150000, def: L.deferral, mr: 50, up: 6 } })}
<h2>Timing of employer deposits</h2>
<p>Your deferrals have to come from 2026 paychecks, but the employer has more time. An employer contribution counts as an annual addition for 2026 if it is allocated for the plan year and paid by the due date of the employer's tax return, extensions included. That is why profit sharing often appears in the account in the spring, and why a true-up match for 2026 may arrive in early 2027 (${h.a('max-401k-contribution', 'maxing out and the true-up')}). Vesting schedules decide when the employer money becomes yours, not whether it counts: unvested money still uses the limit in the year it is allocated. The figures come from ${h.src('notice_2025_67', 'Notice 2025-67')} and the IRS ${h.src('irs_cola', 'COLA table')}.</p>
`,
  faqs: [
    { q: 'What is the most an employer can put in my 401(k) for 2026?', a: `In theory, ${K.usd(C)} minus your own deferrals other than catch-ups, and never more than your pay. If you defer the full ${K.usd(L.deferral)}, the employer could add up to ${K.usd(C - L.deferral)} through match and profit sharing. If you defer nothing, the employer alone could reach ${K.usd(C)}, a pattern seen in some small business plans.` },
    { q: 'Is my 401(k) match calculated on pay above the compensation cap?', a: `No. Plans may not count compensation above ${K.usd(L.compensationCap)} in 2026. A 100 % match up to 6 % of pay on a ${K.usd(big)} salary gives ${K.usd(capM)}, not ${K.usd(big * 0.06)}. The cap moves with inflation in $5,000 steps; it was ${K.usd(K.P.history.compensationCap[2])} in 2025. Profit sharing formulas use the same capped pay.` },
    { q: 'Does the 415(c) total reset when I change employers?', a: `Yes, if the employers are unrelated. Each employer's plan has its own ${K.usd(C)} ceiling for the year. Your elective deferral limit, by contrast, does not reset: deferrals at both jobs share one ${K.usd(L.deferral)} plus catch-up. Employers in the same controlled group count as one employer for both limits.` },
    { q: 'How much after-tax money can I add for a mega backdoor Roth?', a: `The room left under ${K.usd(C)} after your deferrals, other than catch-ups, and all employer money. With ${K.usd(pay)} of pay, the full deferral and a 50 % up to 6 % match, that is ${K.usd(mega)}. The plan must accept after-tax contributions, and testing can limit highly paid employees.` },
  ],
  tool: 'total',
  toolArg: { pay: 150000, def: L.deferral, mr: 50, up: 6, ps: 0 },
  related: ['401k-contribution-limits', 'max-401k-contribution', 'solo-401k-contribution-limits', 'roth-401k-limits', 'catch-up-contributions'],
  sources: ['notice_2025_67', 'irs_cola', 'ir_2025_111'],
});
