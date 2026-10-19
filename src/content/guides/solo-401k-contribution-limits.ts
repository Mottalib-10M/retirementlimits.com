import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const SE = K.P.se;
// Worked cases: a consultant born in 1985 (41 at the end of 2026) and one born in 1972 (54), at several profits.
const young = 1985, older = 1972;
const p60 = K.solo401k(60000, young);
const p150 = K.solo401k(150000, young);
const p150o = K.solo401k(150000, older);
const p250 = K.solo401k(250000, young);
const p400o = K.solo401k(400000, older);
const p30 = K.solo401k(30000, young);
const sepAt150 = K.sep(150000, true);
const reduced = (r: number) => r / (1 + r);
const roomAfterDayJob = L.total415c - p150.employer;
const perK = K.solo401k(91000, young).employer - K.solo401k(90000, young).employer;
let capProfit = 100000;
while (K.solo401k(capProfit, young).total < L.total415c) capProfit += 1000;

export default defineGuide({
  id: 'solo-401k-contribution-limits',
  group: 'plans',
  order: 50,
  slug: 'solo-401k-contribution-limits',
  nav: 'Solo 401(k) limits',
  card: 'Employee deferral plus 20 % of net earnings, from your Schedule C profit',
  title: 'Solo 401k Contribution Limits 2026: Both Halves Worked Out',
  description: `Solo 401k contribution limits 2026: ${K.usd(L.deferral)} as the employee plus 20 % of net earnings as the employer, ${K.usd(L.total415c)} cap. Type your profit to get your total.`,
  h1: 'Solo 401(k) contribution limits 2026: employee and employer side',
  intro: `A one-participant 401(k) lets the owner contribute twice, once as the employee and once as the employer. The calculator starts from your Schedule C profit and applies the Publication 560 steps to each half.`,
  resume: `For 2026 a self-employed person with no employees other than a spouse can defer up to ${K.usd(L.deferral)} as the employee, plus a catch-up of ${K.usd(L.catchUp50)} from the year they turn 50 (${K.usd(L.catchUp6063)} in the years they turn 60 to 63). On top of that the business, acting as employer, can add profit sharing equal to ${K.pct(SE.selfEmployedRate, 0)} of net earnings, which means profit minus half of the self-employment tax. Employee and employer money together cannot pass ${K.usd(L.total415c)}, catch-up excluded, nor your net earnings. A consultant aged 41 with ${K.usd(150000)} of profit pays ${K.usd(p150.tax)} of self-employment tax, deducts half of it, and can put ${K.usd(p150.employee)} plus ${K.usd(p150.employer)}, so ${K.usd(p150.total)}, into a solo 401(k). Born in 1972, the same consultant adds the catch-up and reaches ${K.usd(p150o.total)}. The calculator above runs these steps on your own profit.`,
  body: (h) => `
<h2>Two contributions, two different limits</h2>
<p>A solo 401(k) is an ordinary 401(k) plan whose only participants are the owner and, if the spouse works in the business, the spouse. Because the owner is both the worker and the business, the plan accepts money under two headings. The employee deferral is capped by the personal limit of section 402(g), ${K.usd(L.deferral)} in 2026 (${h.src('notice_2025_67', 'Notice 2025-67')}). The employer contribution is a profit sharing amount, capped by a percentage of compensation. Both then sit under the section 415(c) ceiling of ${K.usd(L.total415c)} for the year, with the catch-up allowed above it.</p>
<p>The two halves follow different calendars. The deferral is a choice the owner makes as an employee and must be elected by the end of the year; the profit sharing part can be deposited up to the due date of the business return, extensions included. Most owners fund the deferral during the year and settle the employer part once the books are closed and the profit is known.</p>
<h2>The 20 % rule from the Publication 560 rate table</h2>
<p>An incorporated owner who takes a W-2 salary from an S corporation or a C corporation gets an employer contribution of up to ${K.pct(SE.sepRate, 0)} of that salary. A sole proprietor or partner has no salary. Compensation for plan purposes is net earnings from self-employment, which already include the contribution being computed, so the rate has to be reduced. Publication 560 handles the circularity with its rate table for the self-employed: the reduced rate equals the plan rate divided by one plus the plan rate (${h.src('pub560', 'Publication 560, chapter 5')}).</p>
${h.table(['Plan rate', 'Rate for a self-employed owner'], [
  [K.pct(0.25, 0), K.pct(reduced(0.25), 0)],
  [K.pct(0.15, 0), K.pct(reduced(0.15), 4)],
  [K.pct(0.1, 0), K.pct(reduced(0.1), 4)],
], 'Reduced rate = plan rate ÷ (1 + plan rate), Publication 560 rate table.', ['l', 'r'])}
<p>The base to which the reduced rate applies is profit minus half of the self-employment tax. The tax itself is ${K.pct(SE.ssRate, 1)} for Social Security up to the ${K.usd(L.wageBase)} wage base and ${K.pct(SE.medicareRate, 1)} for Medicare, both on ${K.pct(SE.netEarningsFactor, 2)} of profit (${h.src('tc554', 'Topic 554')}). For ${K.usd(60000)} of profit the tax is ${K.usd(p60.tax)}, half of it is ${K.usd(p60.half)}, and the base becomes ${K.usd(p60.comp)}. Twenty percent of that is ${K.usd(p60.employer)}, the employer side for that profit.</p>
<h2>Worked cases at several profits</h2>
${h.table(['Schedule C profit', 'Half of SE tax', 'Employee deferral', 'Employer 20 %', 'Total at 41', 'Total at 54'], [30000, 60000, 90000, 150000, 250000, 400000].map((x) => {
  const a = K.solo401k(x, young), b = K.solo401k(x, older);
  return [K.usd(x), K.usd(a.half), K.usd(a.employee), K.usd(Math.min(a.employer, a.total - a.employee)), K.usd(a.total), K.usd(b.total)];
}), `2026 figures. Age on December 31, 2026: 41 for someone born in ${young}, 54 for someone born in ${older}.`, ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>Three things show up in the table. At low profit, net earnings bind before any dollar limit: with ${K.usd(30000)} of profit the base is ${K.usd(p30.comp)}, and that is the whole amount the owner can put in, since contributions cannot exceed compensation. Between those levels and the ceiling, the deferral is fixed and only the employer part grows with profit, by about ${K.usd(perK)} for each extra ${K.usd(1000)} of profit below the wage base. At the top, ${K.usd(250000)} of profit gives ${K.usd(p250.total)} at 41, close to the cap, and ${K.usd(400000)} gives ${K.usd(p400o.total)} at 54: ${K.usd(L.total415c)} plus the ${K.usd(L.catchUp50)} catch-up, which never counts against section 415(c).</p>
${h.mini('solo', { t: 'Your solo 401(k) total at a lower profit', p: ['profit'], d: { profit: 60000, by: 1985 } })}
<h2>Catch-up for an owner over 50</h2>
<p>The catch-up belongs to the employee half. It starts in the calendar year you turn 50 and rises to ${K.usd(L.catchUp6063)} in the four years you turn 60, 61, 62 and 63 (in 2026, owners born from 1963 to 1966). It needs compensation left after the other two contributions, which is why the ${K.usd(30000)} row above gets no extra amount at 54. The ${h.a('catch-up-contributions', 'catch-up page')} covers the age test in detail, and the ${h.a('super-catch-up-60-63', 'age 60 to 63 page')} lists the years for each birth year.</p>
<p>The rule that forces catch-ups into Roth accounts tests FICA wages paid by the employer that sponsors the plan. A sole proprietor's net earnings are self-employment income, not FICA wages, so the owner of an unincorporated business is outside that test (${h.src('ir_2025_91', 'final regulations, IR-2025-91')}). An S corporation owner paid through payroll is not: the W-2 from the corporation counts.</p>
<h2>A day job and a solo 401(k) at the same time</h2>
<p>Many people open a solo 401(k) for consulting income while keeping a salaried job with its own plan. The two limits behave differently. The employee deferral limit is personal: ${K.usd(L.deferral)} across every 401(k), 403(b), SIMPLE and SARSEP you take part in during the year, whichever employers sponsor them. If you defer the full amount at work, the solo plan can take no employee deferral at all, and any excess must be withdrawn by April 15 to avoid being taxed twice.</p>
<p>Section 415(c), on the other hand, applies plan by plan for unrelated employers. Your own business is not related to your employer, so its plan has a fresh ${K.usd(L.total415c)} ceiling. A 41 year old with ${K.usd(150000)} of side profit who already maxed the deferral at work can still receive ${K.usd(p150.employer)} of employer profit sharing in the solo plan, and that plan still sits ${K.usd(roomAfterDayJob)} below its own cap. Pages that add the day job match to the solo plan's total understate what is allowed.</p>
${h.mini('solo', { t: 'Employer side only: how much at your profit?', p: ['profit', 'by'], d: { profit: 150000, by: 1972 } })}
<h2>Solo 401(k) or SEP IRA</h2>
<p>Both plans give the same employer percentage to a self-employed owner. The difference is the employee deferral, which a SEP does not have. At ${K.usd(150000)} of profit a ${h.a('sep-ira-contribution-limits', 'SEP IRA')} allows ${K.usd(sepAt150.amount)}, against ${K.usd(p150.total)} in a solo 401(k) for the same 41 year old. The gap closes only near the top, where both reach ${K.usd(L.total415c)}. A solo plan asks for more paperwork in return: once plan assets pass ${K.usd(250000)} at year end, the owner files Form 5500-EZ. Hiring a common-law employee who meets the plan's eligibility terms ends the one-participant status, and the plan then has to cover that person too.</p>
<p>Employee deferrals can go in as Roth if the plan document offers that option; the employer part can also be designated Roth under SECURE 2.0 when the plan allows it, and is then taxed in the year it is made. Neither choice changes the dollar limits on this page. For the general ${K.usd(L.deferral)} rule and the 415(c) cap in an ordinary workplace plan, see the ${h.a('401k-contribution-limits', '401(k) limit page')} and the ${h.a('employer-401k-contribution-limit', 'employer contribution page')}.</p>
`,
  faqs: [
    { q: 'Why is the solo 401(k) employer part 20 % and not 25 % for a sole proprietor?', a: `Because the profit used as compensation already includes the contribution itself. Publication 560 corrects this with a reduced rate: the plan rate divided by one plus that rate, so 25 % becomes 20 %. It is applied to profit minus half of the self-employment tax, not to the raw Schedule C figure. Corporate owners on a W-2 salary use the full 25 % of that salary.` },
    { q: 'I max out my 401(k) at work: can I still use a solo 401(k) for side income?', a: `Yes, for the employer half. The ${K.usd(L.deferral)} deferral limit is shared by all your plans, so a full deferral at work leaves none for the solo plan. The ${K.usd(L.total415c)} ceiling of section 415(c) is separate for an unrelated business, so profit sharing of up to 20 % of your net earnings still fits in the solo plan.` },
    { q: 'Can my spouse join my solo 401(k) and contribute too?', a: `Yes, if your spouse actually works in the business and is paid for it. A plan covering only the owner and the owner's spouse keeps its one-participant status. Each spouse then has a personal deferral limit of ${K.usd(L.deferral)}, a catch-up from 50, and an employer contribution based on his or her own pay or share of net earnings.` },
    { q: 'At what profit does a solo 401(k) reach the 2026 maximum?', a: `For an owner under 50, the deferral plus 20 % of net earnings reaches ${K.usd(L.total415c)} at a Schedule C profit of about ${K.usd(capProfit)}. Above it, extra profit adds nothing, except the catch-up, which sits on top: up to ${K.usd(L.total415c + L.catchUp6063)} for an owner who turns 60 to 63 in 2026.` },
  ],
  tool: 'solo',
  toolArg: { profit: 120000, by: 1972 },
  related: ['sep-ira-contribution-limits', '401k-contribution-limits', 'employer-401k-contribution-limit', 'catch-up-contributions', 'roth-401k-limits'],
  sources: ['notice_2025_67', 'pub560', 'tc554', 'ir_2025_91'],
});
