import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const SE = K.P.se;
// Worked cases: an architect on salary in her own S corporation ($150,000 W-2); a sole proprietor with $150,000 and
// $300,000 of profit; an assistant paid $40,000; a part-timer paid $600.
const emp150 = K.sep(150000, false);
const self150 = K.sep(150000, true);
const self300 = K.sep(300000, true);
const asst = K.sep(40000, false);
const solo150 = K.solo401k(150000, 1980);
const capPay = L.total415c / SE.sepRate;
let capProfit = 300000;
while (K.sep(capProfit, true).amount < L.total415c) capProfit += 1000;

export default defineGuide({
  id: 'sep-ira-contribution-limits',
  group: 'plans',
  order: 70,
  slug: 'sep-ira-contribution-limits',
  nav: 'SEP IRA limits',
  card: '25 % of pay, 20 % of net earnings for the owner, up to the dollar cap',
  title: 'SEP IRA Contribution Limits 2026: 25 % of Pay, 20 % If Self',
  description: `SEP IRA contribution limits 2026: 25 % of pay or 20 % of net self-employment earnings, up to ${K.usd(L.total415c)}, pay counted to ${K.usd(L.compensationCap)}. Enter yours for the amount.`,
  h1: 'SEP IRA contribution limits 2026 for owners and their employees',
  intro: `A SEP IRA is funded by the employer alone, as a share of each eligible person's pay. The calculator applies 25 % to an employee's wages or the reduced 20 % rate to a self-employed owner's net earnings, then the two caps.`,
  resume: `For 2026 an employer can put into each eligible employee's SEP IRA up to 25 % of that person's pay, with no more than ${K.usd(L.total415c)} per person and pay counted only up to ${K.usd(L.compensationCap)}. For a sole proprietor or a partner the same plan gives an effective 20 %, because the base is net earnings from self-employment after half the self-employment tax and the rate is reduced to account for the contribution itself. An S corporation owner on a ${K.usd(150000)} salary can receive ${K.usd(emp150.amount)}; a sole proprietor with ${K.usd(150000)} of profit gets ${K.usd(self150.amount)}. There is no catch-up in a SEP, at any age. Anyone who received at least ${K.usd(L.sepMinComp)} in 2026 and meets the plan's age and service terms must be covered at the same rate as the owner. Contributions for 2026 can be made up to the due date of the employer's tax return, extensions included.`,
  body: (h) => `
<h2>The two caps and the rate</h2>
<p>A simplified employee pension is a set of traditional IRAs, one per worker, into which only the employer pays. Section 402(h) limits the yearly contribution for each person to the lesser of 25 % of compensation and the section 415(c) dollar amount, ${K.usd(L.total415c)} for 2026. Compensation above ${K.usd(L.compensationCap)} is ignored, under section 408(k)(3)(C) (${h.src('notice_2025_67', 'Notice 2025-67')}).</p>
${h.table(['Who', 'Pay or profit', 'Base used', 'Rate', 'SEP contribution'], [
  ['Assistant on W-2', K.usd(40000), K.usd(asst.capped), K.pct(asst.rate, 0), K.usd(asst.amount)],
  ['Owner on S corp salary', K.usd(150000), K.usd(emp150.capped), K.pct(emp150.rate, 0), K.usd(emp150.amount)],
  ['Sole proprietor', K.usd(150000), K.usd(self150.capped), K.pct(self150.rate, 0), K.usd(self150.amount)],
  ['Sole proprietor', K.usd(300000), K.usd(self300.capped), K.pct(self300.rate, 0), K.usd(self300.amount)],
], 'Base for the self-employed: profit minus half of the self-employment tax. 2026 figures.', ['l', 'r', 'r', 'r', 'r'])}
<p>An employee reaches the dollar cap at a salary of ${K.usd(capPay)}. Above that, the percentage is no longer the binding limit. A self-employed owner gets there much later, at a profit of about ${K.usd(capProfit)}, because the base is smaller and the rate is lower.</p>
<h2>Why the owner's rate is 20 % in effect</h2>
<p>For an incorporated business that pays its owner a salary, nothing special happens: the owner is an employee and gets 25 % of W-2 wages. A sole proprietor or partner has no wages. The code uses net earnings from self-employment, and those earnings are figured after the deduction for the SEP contribution itself, which makes the calculation circular. Publication 560 solves it in two steps (${h.src('pub560', 'Publication 560, chapter 2 and its rate table')}): first subtract half of the self-employment tax from profit, then apply the reduced rate, 25 % divided by 1.25, which is 20 %.</p>
<p>For ${K.usd(150000)} of Schedule C profit, the self-employment tax is ${K.usd(K.selfEmployed(150000).tax)} (${h.src('tc554', 'Topic 554')}), half of it is ${K.usd(K.selfEmployed(150000).half)}, the base is ${K.usd(self150.base)} and the contribution is ${K.usd(self150.amount)}, or ${K.pct(self150.amount / 150000, 1)} of profit. Using 25 % of the raw profit, as some quick calculators do, would give ${K.usd(150000 * SE.sepRate)} and create an excess contribution.</p>
${h.mini('sep', { t: 'Your SEP amount as a sole proprietor', p: ['pay'], d: { se: 'self', pay: 90000 } })}
<h2>Who must be covered</h2>
<p>A SEP cannot be limited to the owner if others qualify. The plan must cover every employee who is at least 21, has worked for the employer in at least three of the last five years, and received at least ${K.usd(L.sepMinComp)} of compensation in 2026, the threshold of section 408(k)(2)(C) as indexed. The employer may use looser terms, never stricter ones. Whatever percentage the owner gives himself, the same percentage of pay goes to each eligible employee: an owner taking 25 % of his salary owes ${K.usd(asst.amount)} to the assistant paid ${K.usd(40000)}. A part-timer paid ${K.usd(600)} in the year falls under the ${K.usd(L.sepMinComp)} line and can be left out for that year.</p>
<p>The rate can change every year, down to zero. That flexibility is the main reason small firms with uneven profits choose a SEP: in a lean year the employer contributes nothing, and no employee has a contractual claim to a deposit.</p>
<h2>No catch-up, and no employee deferral</h2>
<p>Catch-up contributions under section 414(v) exist only where there are elective deferrals, and a SEP has none (the old salary reduction SEPs set up before 1997 are a closed exception). A 58 year old owner therefore has the same SEP limit as a 30 year old. If extra room after 50 matters, the ${h.a('solo-401k-contribution-limits', 'solo 401(k)')} adds both the employee deferral and the catch-up: at ${K.usd(150000)} of profit an owner under 50 can put in ${K.usd(solo150.total)} there, against ${K.usd(self150.amount)} in a SEP.</p>
<p>SEP money does not use any of your personal IRA limit. The same person may also contribute ${K.usd(L.ira)} to a traditional or Roth IRA for 2026 (${h.a('ira-contribution-limits', 'IRA limits')}), within the usual income tests. Since SECURE 2.0, a SEP can accept Roth employer contributions if the provider offers them; they are taxable to the employee in the year made.</p>
<h2>Deadline and paperwork</h2>
<p>Contributions for 2026 can be deposited up to the due date of the employer's federal return for that year, including extensions. For a sole proprietor filing on the calendar year, that is April 15, 2027, or October 15, 2027 with an extension; an S corporation follows its own March due date and extension. The plan itself can also be adopted as late as that due date, usually on Form 5305-SEP, which is why a SEP is often the plan people open after the year has ended. No annual Form 5500 is needed. The employer deducts the contribution; a sole proprietor takes it on Schedule 1 of Form 1040, not on Schedule C.</p>
${h.mini('sep', { t: 'Contribution for an employee on salary', p: ['pay'], d: { se: 'emp', pay: 150000 } })}
<p>For the plan with a salary deferral and the lowest setup cost, see the ${h.a('simple-ira-contribution-limits', 'SIMPLE IRA page')}; for the overall cap on employer money in a 401(k), the ${h.a('employer-401k-contribution-limit', 'employer contribution page')}.</p>
`,
  faqs: [
    { q: `How much can I put in a SEP IRA on ${K.usd(100000)} of self-employment profit in 2026?`, a: `About ${K.usd(K.sep(100000, true).amount)}. Half of the self-employment tax, ${K.usd(K.selfEmployed(100000).half)}, comes off the profit first, then the reduced 20 % rate applies to what is left. A solo 401(k) on the same profit allows more because it adds the ${K.usd(L.deferral)} employee deferral, which a SEP does not have.` },
    { q: 'Do I have to give my employees the same SEP percentage I give myself?', a: `Yes. Each eligible employee receives the same percentage of pay as the owner, for the year the employer decides to contribute. Eligibility can be at most age 21, three of the last five years of service and ${K.usd(L.sepMinComp)} of compensation in 2026. Employees who do not meet those tests can be left out.` },
    { q: 'Is there an age 50 catch-up in a SEP IRA?', a: `No. A SEP contains only employer contributions, and catch-ups are tied to elective deferrals, so the limit is the same at 30 and at 65. Someone over 50 who wants a catch-up needs a plan with deferrals, such as a solo 401(k) or a SIMPLE IRA, or can add the IRA catch-up to a personal IRA.` },
    { q: 'Can I open a SEP IRA in 2027 and still contribute for 2026?', a: `Yes. A SEP can be established and funded up to the due date of the employer's 2026 return, extensions included. For a sole proprietor on a calendar year that means April 15, 2027, or October 15, 2027 if an extension was filed on time.` },
  ],
  tool: 'sep',
  toolArg: { pay: 150000, se: 'self' },
  related: ['solo-401k-contribution-limits', 'simple-ira-contribution-limits', 'ira-contribution-limits', 'employer-401k-contribution-limit'],
  sources: ['notice_2025_67', 'pub560', 'tc554', 'irs_cola'],
});
