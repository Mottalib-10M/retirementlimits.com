import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
const T = L.rothCatchUpWageThreshold;
// Worked cases: born 1968 with $165,000 of 2025 wages from the employer; the same with $148,000; born 1964 at $210,000.
const hi = K.deferral('401k', 1968, 200000, 165000);
const lo = K.deferral('401k', 1968, 200000, 148000);
const sup = K.deferral('401k', 1964, 220000, 210000);
const rate = 0.24, periods = 26;
const taxNow = hi.catchUp * rate;
const taxSup = sup.catchUp * rate;
const wb25 = K.P.history.wageBase[K.P.history.years.indexOf(2025)];
const thr27 = K.announced('2027') ? K.usd((K.L27 as Record<string, unknown>).rothCatchUpWageThreshold as number) : 'not announced yet';

export default defineGuide({
  id: 'roth-catch-up-rule',
  group: 'plans',
  order: 30,
  slug: 'roth-catch-up-rule',
  nav: 'Roth catch-up rule',
  card: 'Who must make catch-ups as Roth from 2026, tested on your 2025 W-2',
  title: `Roth Catch-Up Rule 2026: The ${K.usd(T)} Wage Test Explained`,
  description: `Roth catch-up rule 2026: if your 2025 W-2 box 3 wages from the employer topped ${K.usd(T)}, your catch-up must be Roth. Test your wages, see the tax effect.`,
  h1: 'Roth catch-up rule 2026: does your catch-up have to be Roth?',
  intro: `From 2026, higher paid workers aged 50 and over can still make catch-up contributions, but only as Roth. The test is one number on last year's W-2 from the employer that runs the plan.`,
  resume: `Starting with 2026 contributions, a catch-up to a 401(k), 403(b) or governmental 457(b) must be designated Roth if your 2025 FICA wages from the employer sponsoring the plan, box 3 of that employer's W-2, were above ${K.usd(T)} (Notice 2025-67, final regulations announced in IR-2025-91). The amount is unchanged: ${K.usd(L.catchUp50)} from 50, ${K.usd(L.catchUp6063)} at 60 to 63. The base ${K.usd(L.deferral)} can stay pre-tax. SIMPLE IRAs and SEPs are outside the rule, and so are partners and sole proprietors with no FICA wages. A saver born in 1968 who had ${K.usd(165000)} of box 3 wages in 2025 puts the ${K.usd(hi.catchUp)} catch-up in Roth; at ${K.usd(148000)} it may stay pre-tax. In the 24 % bracket the Roth treatment costs about ${K.usd(taxNow)} more federal tax now, ${K.usd(taxNow / periods)} a paycheck over 26 pay dates. A plan with no Roth option cannot take catch-ups from those above the threshold.`,
  body: (h) => `
<h2>The wage test, step by step</h2>
<p>The rule comes from section 603 of SECURE 2.0, now section 414(v)(7) of the code. It was meant to start in 2024; the IRS gave plans a two year administrative transition, so 2026 is the first year it binds. Three questions decide whether it applies to you.</p>
<ol>
<li><strong>Are you making a catch-up?</strong> Only the catch-up part is affected, which means you are 50 or older on December 31, 2026 and you defer beyond ${K.usd(L.deferral)}.</li>
<li><strong>Which employer?</strong> The wages that count are those paid in 2025 by the employer that sponsors the plan you contribute to now (or a related employer in the same group). Wages from a previous employer do not count.</li>
<li><strong>How much?</strong> Box 3 of that 2025 W-2, the Social Security wages. Above ${K.usd(T)}, the catch-up must be Roth. Box 1 is not the test: pre-tax 401(k) deferrals lower box 1 but not box 3.</li>
</ol>
${h.table(['2025 box 3 wages from the plan sponsor', 'Age at end of 2026', 'Catch-up in 2026', 'Must be Roth?'], [
  [K.usd(148000), String(lo.age), K.usd(lo.catchUp), lo.rothCatchUp ? 'yes' : 'no'],
  [K.usd(165000), String(hi.age), K.usd(hi.catchUp), hi.rothCatchUp ? 'yes' : 'no'],
  [K.usd(210000), String(sup.age), K.usd(sup.catchUp), sup.rothCatchUp ? 'yes' : 'no'],
  ['No 2025 wages (hired in 2026)', String(hi.age), K.usd(hi.catchUp), 'no'],
], `Threshold ${K.usd(T)} of 2025 wages for 2026 catch-ups (Notice 2025-67). It was ${K.usd(PR.rothCatchUpWageThreshold)} for 2024 wages.`, ['l', 'r', 'r', 'l'])}
<p>Box 3 is capped at the Social Security wage base, ${K.usd(wb25)} for 2025, which is well above the threshold, so a box 3 at the cap always means the rule applies. The threshold is indexed: the one for 2026 wages, which will decide 2027 catch-ups, is ${thr27}.</p>
${h.mini('rothcatch', { t: 'Is your catch-up Roth only?', p: ['prior'], d: { by: 1968, plan: '401k' } })}
<h2>Who is outside the rule</h2>
<p>Someone hired during 2026 had no 2025 wages from that employer and keeps the choice for this year. Partners in a partnership and sole proprietors with a solo 401(k) receive self-employment income, not FICA wages, so they have nothing in box 3 and are not caught. The rule also does not reach SIMPLE IRAs or SEPs: a high earner aged 55 in a SIMPLE IRA can still make the ${K.usd(L.simpleCatchUp)} catch-up pre-tax. People under 50 are unaffected, because they make no catch-up at all. A 457(b) of a tax-exempt employer is not a governmental plan and does not allow catch-ups of this kind in the first place.</p>
<h2>A plan without a Roth option</h2>
<p>The code does not let the plan simply keep the catch-up pre-tax. If a plan offers no Roth deferrals, participants above the threshold cannot make catch-up contributions in it at all, while those below it still can. Most employers avoided that outcome by adding a Roth source before 2026, but it is worth checking: a high earner aged 58 in a pre-tax only plan is held to ${K.usd(L.deferral)} for 2026, ${K.usd(L.catchUp50)} less than a colleague with lower wages. The ${h.a('roth-401k-limits', 'Roth 401(k) page')} covers how Roth deferrals sit inside the same limit.</p>
<h2>The deemed Roth election</h2>
<p>The final regulations (${h.src('ir_2025_91', 'IR-2025-91')}) let a plan treat the catch-up of an affected participant as Roth automatically, without a new election form. In practice payroll keeps your single deferral rate and, once you pass ${K.usd(L.deferral)}, books the rest as Roth. You must be given an effective chance to change that, which in this case means stopping the catch-up rather than making it pre-tax. The regulations also describe how a plan fixes a catch-up that went in as pre-tax by mistake: it can move the amount to the Roth account and report it as taxable on a corrected or later W-2, within set deadlines. The final rules apply in general from 2027, and for 2026 plans follow a reasonable good faith reading of the statute.</p>
<h2>What it does to take home pay</h2>
<p>A Roth deferral is taxed in the year it is made. Moving ${K.usd(hi.catchUp)} from pre-tax to Roth adds the same amount to your taxable wages in box 1. In the 24 % federal bracket that is about ${K.usd(taxNow)} more income tax for 2026, or ${K.usd(taxNow / periods)} a paycheck if withholding spreads it over 26 pay dates, plus state tax where it applies. At 62, with the larger ${K.usd(sup.catchUp)} catch-up, the extra federal tax is about ${K.usd(taxSup)}. Social Security and Medicare taxes do not change, because they were always due on deferrals. The money later comes out tax free if the Roth account is at least five years old and you are 59½ or older.</p>
${h.mini('rothcatch', { t: 'The same test at 60 to 63', p: ['by'], d: { prior: 165000, plan: '401k' } })}
<h2>Planning around the rule</h2>
<p>For many savers near retirement the change is less costly than it looks. Roth money has no required distributions while you are alive and is not counted in income when it comes out, which can help with Medicare premiums and the taxation of Social Security later. Those who want the deduction back can still defer the full base amount pre-tax, or use an HSA or a traditional IRA for pre-tax room. The catch-up amounts themselves are on the ${h.a('catch-up-contributions', 'catch-up page')}, and the extra tier for ages 60 to 63 on its ${h.a('super-catch-up-60-63', 'own page')}. Notice 2025-67 gives the ${K.usd(T)} figure (${h.src('notice_2025_67', 'Notice 2025-67')}).</p>
`,
  faqs: [
    { q: 'I was hired in 2026: does the Roth catch-up rule apply to me this year?', a: `No. The test uses your 2025 Social Security wages from the employer that sponsors the plan. A new employer paid you nothing in 2025, so your catch-up can be pre-tax or Roth as you choose in 2026. Next year the test will use your 2026 wages from that employer, against a threshold the IRS sets in November.` },
    { q: 'Which box of my W-2 decides the Roth catch-up requirement?', a: `Box 3, Social Security wages, on the 2025 W-2 from the employer running the plan. Box 1 is lower when you make pre-tax deferrals and is not the test. If box 3 shows more than ${K.usd(T)}, every catch-up you make in that employer's plan in 2026 must be designated Roth.` },
    { q: 'My plan has no Roth option and my wages were above the threshold: can I still catch up?', a: `Not in that plan. The law does not allow a pre-tax catch-up for someone above the threshold, so a plan without Roth deferrals has to refuse your catch-up while still allowing the base ${K.usd(L.deferral)}. Colleagues under the threshold keep their catch-up. Ask whether the employer plans to add a Roth source.` },
    { q: 'Does the Roth catch-up rule apply to a SIMPLE IRA or a self-employed saver?', a: `No to both, in general. SIMPLE IRAs and SEPs are excluded by the statute. Self-employed partners and sole proprietors have no FICA wages from the business, so they fall outside the wage test and can keep a solo 401(k) catch-up pre-tax. A SIMPLE 401(k), unlike a SIMPLE IRA, is not on the excluded list.` },
    { q: 'Can my employer switch my catch-up to Roth without asking me?', a: `Yes, if the plan uses the deemed Roth election allowed by the final regulations. Payroll then books deferrals above ${K.usd(L.deferral)} as Roth automatically. You must have a real chance to opt out, which here means stopping the catch-up, since keeping it pre-tax is not allowed above the threshold.` },
  ],
  tool: 'rothcatch',
  toolArg: { prior: 165000, by: 1968, plan: '401k' },
  related: ['catch-up-contributions', 'super-catch-up-60-63', 'roth-401k-limits', '401k-contribution-limits'],
  sources: ['ir_2025_91', 'notice_2025_67'],
});
