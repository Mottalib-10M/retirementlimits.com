import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const D = L.deductPhase;
const R = L.rothPhase;
// Totals by age band for someone with ample pay (born 1990, 1970, 1964, 1960); worked case: $85,000 at 50 (born 1976);
// a covered single filer at $95,000 who defers $12,000 more.
const band = (by: number, label: string) => {
  const d = K.deferral('401k', by, 10000000);
  const i = K.iraLimit(2026 - by, 10000000).limit;
  return [label, K.usd(d.total), K.usd(i), K.usd(d.total + i)];
};
const rows = [band(1990, 'Under 50 (born 1977 or later)'), band(1970, '50 to 59, or 64 and over'), band(1964, '60 to 63 (born 1963 to 1966)')];
const w = K.deferral('401k', 1976, 85000);
const wi = K.iraLimit(50, 85000).limit;
const before = K.deductible('single', 'you', 95000, 40, 95000);
const after = K.deductible('single', 'you', 95000 - 12000, 40, 95000);

export default defineGuide({
  id: 'ira-vs-401k',
  group: 'ira',
  order: 40,
  slug: 'ira-vs-401k',
  nav: 'IRA vs 401(k) limits',
  card: 'Two separate limits, how they add up by age, and where they interact',
  title: 'Difference Between IRA and 401(k) Limits 2026, Side by Side',
  description: `Difference between IRA and 401(k) limits 2026: ${K.usd(L.deferral)} of 401(k) deferrals and ${K.usd(L.ira)} in IRAs, two caps that add up. See totals by age and the deduction catch.`,
  h1: 'IRA vs 401(k) limits in 2026: two caps, one household',
  intro: `A 401(k) and an IRA have separate contribution limits, so saving in one never uses up the other. Where they touch is the tax side: the workplace plan can limit the IRA deduction, and pre-tax deferrals change the income the Roth IRA test looks at.`,
  resume: `In 2026 the employee limit for a 401(k), 403(b) or governmental 457(b) is ${K.usd(L.deferral)}, plus ${K.usd(L.catchUp50)} from age 50 or ${K.usd(L.catchUp6063)} in the years you turn 60 to 63. The IRA limit is ${K.usd(L.ira)}, plus ${K.usd(L.iraCatchUp)} from 50, shared by traditional and Roth IRAs. The two are independent: a person aged 50 earning ${K.usd(85000)} can defer ${K.usd(w.total)} and still put ${K.usd(wi)} in an IRA, ${K.usd(w.total + wi)} in all. Employer money goes only into the 401(k), within a ${K.usd(L.total415c)} cap on total additions. What links the accounts is tax: being covered by the workplace plan phases out the traditional IRA deduction from ${K.usd(D.singleCovered[0])} of MAGI for a single filer, and the Roth IRA has an income test (${K.usd(R.single[0])} to ${K.usd(R.single[1])} single) that a 401(k), Roth or not, does not have.`,
  body: (h) => `
<h2>The limits side by side</h2>
${h.table(['Rule in 2026', '401(k), 403(b), 457(b)', 'IRA (traditional and Roth)'], [
  ['Base limit', K.usd(L.deferral), K.usd(L.ira)],
  ['Catch-up from age 50', K.usd(L.catchUp50), K.usd(L.iraCatchUp)],
  ['Catch-up at 60 to 63', K.usd(L.catchUp6063), 'no extra amount'],
  ['Employer money', `on top, up to ${K.usd(L.total415c)} in total`, 'none'],
  ['Income limit to contribute', 'none', `Roth only: ${K.usd(R.single[0])} to ${K.usd(R.single[1])} single, ${K.usd(R.joint[0])} to ${K.usd(R.joint[1])} joint`],
  ['Who sets it up', 'your employer', 'you, at any custodian'],
  ['Last day for 2026', 'last 2026 paycheck', 'April 15, 2027'],
], `Notice 2025-67, read on ${K.day(K.P.retrieved_at)}.`, ['l', 'l', 'l'])}
<p>The 401(k) figure is per person across all the plans of that type you join in the year: two jobs with two 401(k)s still share one ${K.usd(L.deferral)} limit. A governmental 457(b) has a separate limit of its own (${h.a('457b-contribution-limits', '457(b) limits')}). The IRA figure is also per person, across every IRA you hold.</p>
<h2>What the two add up to, by age</h2>
<p>With enough pay, the maximum you can put in from your own salary is the sum of both limits. The age tests are applied on December 31, 2026.</p>
${h.table(['Age at the end of 2026', '401(k) deferral', 'IRA', 'Both together'], rows, 'Employer contributions not included. The IRA has no age 60 to 63 increase.', ['l', 'r', 'r', 'r'])}
<p>The line for 60 to 63 is the largest because of the catch-up created by SECURE 2.0, which applies only to workplace plans; from 64 the 401(k) catch-up drops back to ${K.usd(L.catchUp50)}. For a high earner there is one more wrinkle: if your 2025 FICA wages from the employer exceeded ${K.usd(L.rothCatchUpWageThreshold)}, the 401(k) catch-up must be Roth (${h.a('roth-catch-up-rule', 'Roth catch-up rule')}). Nothing similar exists in an IRA.</p>
${h.mini('both', { t: 'Your two limits at your age', p: ['by'], d: { pay: 150000, by: 1964 } })}
<h2>Where the limits interact: the IRA deduction</h2>
<p>The contribution limits never touch each other, but the 401(k) has one effect on the IRA. If you are covered by a workplace plan for the year, which a match alone is enough to trigger, a traditional IRA contribution is deductible only if your modified AGI is below ${K.usd(D.singleCovered[0])} as a single filer or ${K.usd(D.jointCovered[0])} on a joint return, with nothing deductible from ${K.usd(D.singleCovered[1])} and ${K.usd(D.jointCovered[1])}. Without a workplace plan, the traditional IRA deduction has no income limit.</p>
<p>The link runs in both directions. Pre-tax 401(k) deferrals lower your AGI, so they also lower the MAGI tested for the IRA deduction. A covered single filer at ${K.usd(95000)} of MAGI can deduct ${K.usd(before.deductible)} of a traditional IRA contribution; deferring ${K.usd(12000)} more into the 401(k) brings MAGI to ${K.usd(95000 - 12000)} and the deductible part to ${K.usd(after.deductible)}. Roth 401(k) deferrals do not have that effect. The full ranges are on ${h.a('traditional-ira-deduction-limits', 'traditional IRA deduction limits')}.</p>
${h.mini('deduct', { t: 'Covered by your 401(k): what stays deductible?', p: ['magi'], d: { f: 'single', cov: 'you', magi: 95000 } })}
<h2>Where the limits interact: the Roth IRA test</h2>
<p>The Roth IRA reduces your contribution once MAGI reaches ${K.usd(R.single[0])} (single) or ${K.usd(R.joint[0])} (joint). Having a 401(k) does not change that range, but pre-tax deferrals can move you below it. A Roth 401(k) has no income test at all, so a high earner who is above the Roth IRA range can still put Roth money in the workplace plan up to the full deferral limit (${h.a('roth-401k-limits', 'Roth 401(k) limits')}).</p>
<h2>An order of saving often described</h2>
<p>Many explanations of these accounts describe a common sequence. It is general information, not a recommendation for your situation:</p>
<ol>
<li>Contribute enough to the 401(k) to receive the full employer match, since the match is money the IRA cannot offer.</li>
<li>Fund an IRA, which often gives a wider choice of investments and, for a Roth IRA, withdrawals of contributions at any time.</li>
<li>Return to the 401(k) and raise the deferral toward the ${K.usd(L.deferral)} limit.</li>
<li>For someone with a high-deductible health plan, an HSA is a third limit, separate from both (${h.a('hsa-contribution-limits', 'HSA limits')}).</li>
</ol>
<p>Fees, the quality of the plan's funds, your tax bracket now and later, and access to the money all change the picture. The calculators show what is allowed; they do not say what is best.</p>
<h2>Changing jobs, and couples with four limits</h2>
<p>Someone who changes employers in the middle of 2026 has to watch the 401(k) side closely. Each payroll system only sees its own deferrals, so a person who deferred ${K.usd(15000)} at the first job and joins a plan at the second can defer only ${K.usd(L.deferral - 15000)} more before turning 50. A deferral above the yearly limit must be returned by April 15, 2027, or it is taxed twice. The IRA side is unaffected by the move: the same ${K.usd(L.ira)} stays available whatever happens at work, and an old 401(k) can be rolled into an IRA without using any of it.</p>
<p>A married couple where both spouses work has four separate limits: two deferral limits and two IRA limits, each tested on the owner's own age. A spouse who has no plan at work keeps a fully deductible IRA up to a much higher joint income, ${K.usd(D.spouseCovered[0])}, than the spouse who has one. When only one spouse earns, the other can still fund an IRA on that pay through the ${h.a('spousal-ira', 'spousal IRA')} rule, but cannot defer into the employer's 401(k).</p>
<h2>Other differences that are not about the amount</h2>
<p>A 401(k) deferral comes out of payroll and stops on December 31; an IRA can be funded in a lump sum until the April deadline. A 401(k) may allow loans; an IRA does not. Required distributions apply to traditional accounts of both types, while Roth IRAs and, since 2024, Roth 401(k)s have none during the owner's lifetime. Self-employed people without employees can open a ${h.a('solo-401k-contribution-limits', 'solo 401(k)')} and still use an IRA on top.</p>
`,
  faqs: [
    { q: 'Does contributing to a 401(k) reduce how much I can put in an IRA?', a: `No. The ${K.usd(L.deferral)} deferral limit and the ${K.usd(L.ira)} IRA limit are counted separately, so filling one leaves the other untouched. The only connection is the tax treatment: being covered by the 401(k) can limit how much of a traditional IRA contribution you may deduct.` },
    { q: 'What is the most one person can save from salary in a 401(k) and an IRA in 2026?', a: `${K.usd(K.deferral('401k', 1964, 10000000).total + L.ira + L.iraCatchUp)} for someone aged 60 to 63 at the end of 2026, with enough pay. Under 50 the total is ${K.usd(L.deferral + L.ira)}. Employer contributions to the 401(k) come on top, within the ${K.usd(L.total415c)} total additions limit, and an HSA adds a third, separate limit.` },
    { q: 'Is the IRA deduction lost if I only get an employer match and do not defer?', a: 'You still count as covered. Any contribution allocated to your 401(k) account for the year, including a match, profit sharing or a forfeiture, makes you an active participant, and box 13 of your W-2 is checked. The traditional IRA deduction then depends on your modified AGI and filing status.' },
    { q: 'Can I contribute to a Roth 401(k) if my income is too high for a Roth IRA?', a: `Yes. A Roth 401(k) has no income limit, so you can defer up to ${K.usd(L.deferral)} as Roth even far above the Roth IRA range of ${K.usd(R.single[0])} to ${K.usd(R.single[1])} for a single filer. The plan must offer a Roth option; not every 401(k) does.` },
  ],
  tool: 'both',
  toolArg: { pay: 85000, by: 1976 },
  related: ['ira-contribution-limits', '401k-contribution-limits', 'traditional-ira-deduction-limits', 'roth-401k-limits', 'max-401k-contribution'],
  sources: ['notice_2025_67', 'ir_2025_111', 'pub590a'],
});
