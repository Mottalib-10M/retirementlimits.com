import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
// Worked cases: an office manager born in 1970 (56 in 2026) earning $70,000 at a 12-person dental practice;
// the same at a 60-person firm; a technician born in 1964 (62); a 35 year old earning $48,000.
const small = K.deferral('simpleApplicable', 1970, 70000);
const large = K.deferral('simple', 1970, 70000);
const at62 = K.deferral('simpleApplicable', 1964, 70000);
const young = K.deferral('simple', 1991, 48000);
const match3 = Math.min(small.total, 70000 * 0.03);
const flat2 = 70000 * 0.02;
const flatYoung = 48000 * 0.02;

export default defineGuide({
  id: 'simple-ira-contribution-limits',
  group: 'plans',
  order: 65,
  slug: 'simple-ira-contribution-limits',
  nav: 'SIMPLE IRA limits',
  card: 'The two SIMPLE limits, three catch-ups and the employer 3 % or 2 %',
  title: 'SIMPLE IRA Contribution Limits 2026: Small vs Larger Firms',
  description: `SIMPLE IRA contribution limits 2026: ${K.usd(L.simple)}, or ${K.usd(L.simpleApplicable)} at employers with 25 or fewer staff, plus catch-ups and the 3 % match. See your own amount here.`,
  h1: 'SIMPLE IRA contribution limits 2026: which of the two limits is yours',
  intro: `A SIMPLE IRA has a lower deferral limit than a 401(k), and since 2024 it has two of them depending on the size of the employer. The calculator picks the right one, adds your catch-up and shows what the employer must put in.`,
  resume: `For 2026 the standard SIMPLE IRA deferral limit is ${K.usd(L.simple)}. A higher limit of ${K.usd(L.simpleApplicable)}, 110 % of the old figure indexed, applies automatically at employers with 25 or fewer employees, and at employers with 26 to 100 employees that choose it and pay a higher employer contribution. Catch-ups come in three sizes: ${K.usd(L.simpleCatchUp)} from the year you turn 50 in a standard plan, ${K.usd(L.simpleCatchUpApplicable)} in a plan using the higher limit, and ${K.usd(L.simpleCatchUp6063)} in any SIMPLE plan for the years you turn 60 to 63. On top of that the employer adds a 3 % match or 2 % of pay for everyone eligible. An office manager born in 1970 earning ${K.usd(70000)} at a 12-person practice can defer ${K.usd(small.total)} and receive a match of ${K.usd(match3)}. SIMPLE plans are outside the Roth catch-up rule, so her catch-up can stay pre-tax whatever her pay.`,
  body: (h) => `
<h2>The 2026 SIMPLE limits in one table</h2>
<p>SECURE 2.0 split the SIMPLE limit in two from 2024. Notice 2025-67 sets the 2026 amounts: ${K.usd(L.simple)} under section 408(p)(2)(E)(i)(III), up from ${K.usd(PR.simple)}, and ${K.usd(L.simpleApplicable)} under the "certain accounts or plans" wording of (I) and (II) (${h.src('notice_2025_67', 'Notice 2025-67')}).</p>
${h.table(['Age on December 31, 2026', 'Standard plan', 'Plan with the higher limit'], [
  ['Under 50', K.usd(L.simple), K.usd(L.simpleApplicable)],
  ['50 to 59, or 64 and over', K.usd(L.simple + L.simpleCatchUp), K.usd(L.simpleApplicable + L.simpleCatchUpApplicable)],
  ['60 to 63 (born 1963 to 1966)', K.usd(L.simple + L.simpleCatchUp6063), K.usd(L.simpleApplicable + L.simpleCatchUp6063)],
], 'Employee salary reduction contributions; the employer contribution is added on top.', ['l', 'r', 'r'])}
<p>The catch-up column holds an oddity. In a plan with the higher base, the age 50 catch-up is ${K.usd(L.simpleCatchUpApplicable)}, which is less than the ${K.usd(L.simpleCatchUp)} of a standard plan, because the higher one is pegged to an older figure that the IRS kept unchanged for 2026. The total is still larger: ${K.usd(small.total)} against ${K.usd(large.total)} for the same 56 year old. At 60 to 63 both kinds of plan use ${K.usd(L.simpleCatchUp6063)}.</p>
<h2>Which limit applies to your employer</h2>
<p>The size test counts employees who earned at least ${K.usd(5000)} from the employer in the preceding year. With 25 or fewer, the plan uses the higher limits without doing anything. With 26 to 100, the employer may opt in, but only by raising its own contribution to a 4 % match or a 3 % nonelective contribution for the year. An employer that grows past 25 keeps the automatic higher limits for a two-year grace period, unless the growth comes from an acquisition, and after that only by making the election (${h.src('notice_2024_02', 'Notice 2024-2, Q&A E-2 to E-5')}). If you do not know which side your plan is on, the summary description or the annual notice the employer must give before the election period says so.</p>
<p>Above 100 employees an employer cannot keep a SIMPLE IRA past a short grace period; it moves to a 401(k), where the regular ${K.usd(L.deferral)} limit applies (${h.a('401k-contribution-limits', '401(k) limits')}).</p>
${h.mini('simple', { t: 'Your SIMPLE limit at a larger employer', p: ['by'], d: { big: 'large', by: 1970, pay: 70000 } })}
<h2>What the employer must add</h2>
<p>A SIMPLE IRA does not leave the employer's share to chance. Each year it chooses one of two formulas and applies it to every eligible employee. The match is dollar for dollar on your deferrals up to 3 % of pay; the employer may lower it to as little as 1 % in no more than two years out of five, with notice. The alternative is a nonelective contribution of 2 % of pay, paid whether or not you defer, and computed on pay up to the ${K.usd(L.compensationCap)} compensation cap.</p>
<p>For the office manager earning ${K.usd(70000)}, a 3 % match is worth ${K.usd(match3)} if she defers at least that much, and the 2 % nonelective formula would give ${K.usd(flat2)}. A 35 year old earning ${K.usd(48000)} who defers nothing receives nothing under the match but ${K.usd(flatYoung)} under the 2 % formula, on top of a personal limit of ${K.usd(young.total)} he could use. Since 2024 an employer may also add an extra nonelective contribution of up to 10 % of pay, within a small yearly dollar cap that Notice 2025-67 also indexes.</p>
<h2>Catch-ups without the Roth rule</h2>
<p>From 2026, participants in 401(k), 403(b) and governmental 457(b) plans whose prior-year FICA wages from the employer topped ${K.usd(L.rothCatchUpWageThreshold)} must make catch-ups as Roth. Section 414(v)(7) leaves SIMPLE IRAs out of that rule. A technician born in 1964, 62 at the end of 2026, can put ${K.usd(at62.total)} into a SIMPLE IRA at a small employer, and the ${K.usd(at62.catchUp)} of catch-up may remain pre-tax even with high wages. A SIMPLE IRA can accept Roth deferrals if the provider offers them, but the choice is yours.</p>
${h.mini('catchup', { t: 'Catch-up in a SIMPLE plan for your birth year', p: ['by'], d: { plan: 'simpleApplicable', by: 1964 } })}
<h2>Rules that catch people out</h2>
<p>The SIMPLE limit is not a separate pot. SIMPLE deferrals count toward the personal limit of section 402(g), shared with any 401(k) or 403(b) you contribute to in the same year. Someone who leaves a 401(k) job in June after deferring ${K.usd(15000)} and joins a small firm with a SIMPLE IRA can defer only what is left under the 401(k) figure, and no more than the SIMPLE limit in the new plan.</p>
<p>Withdrawals during the first two years of participation, before 59 and a half, are taxed at 25 % instead of the usual 10 %, and money cannot be rolled to a non-SIMPLE IRA in that window without the same cost. Deferrals must be deposited by the employer within 30 days after the end of the month in which they were withheld. And the employer contribution does not count against your deferral limit: the office manager can defer ${K.usd(small.total)} and still receive the ${K.usd(match3)} match. For the other workplace limits, see the ${h.a('catch-up-contributions', 'catch-up guide')} and the ${h.a('sep-ira-contribution-limits', 'SEP IRA page')}.</p>
`,
  faqs: [
    { q: 'Why is the SIMPLE IRA catch-up lower in a plan with the higher limit?', a: `In 2026 a standard plan allows a ${K.usd(L.simpleCatchUp)} catch-up from age 50, but a plan using the ${K.usd(L.simpleApplicable)} limit allows ${K.usd(L.simpleCatchUpApplicable)}. The higher-limit catch-up is set at 110 % of an older amount and was not raised for 2026. The combined total is still larger in the higher-limit plan.` },
    { q: 'My employer has 40 employees: can I get the higher SIMPLE limit?', a: `Only if the employer elects it for the year and raises its own contribution to a 4 % match or a 3 % nonelective contribution. Without that choice, a business with 26 to 100 employees keeps the standard ${K.usd(L.simple)} limit and the ${K.usd(L.simpleCatchUp)} catch-up. Ask for the plan's annual notice, which states the formula.` },
    { q: 'Do high earners have to make SIMPLE IRA catch-ups as Roth in 2026?', a: `No. The rule that forces catch-ups into Roth accounts for people whose 2025 FICA wages exceeded ${K.usd(L.rothCatchUpWageThreshold)} applies to 401(k), 403(b) and governmental 457(b) plans. SIMPLE IRAs, like SEPs, are excluded by the code, so a SIMPLE catch-up can be pre-tax at any income level.` },
    { q: 'Can I contribute to a SIMPLE IRA and a 401(k) in the same year?', a: `Yes, if you work for two employers, or change jobs during the year. Your own deferrals to both are added together under one personal limit of ${K.usd(L.deferral)}, and the SIMPLE plan itself cannot take more than its own limit. Employer contributions to each plan are not part of that count.` },
  ],
  tool: 'simple',
  toolArg: { pay: 70000, by: 1970, big: 'small' },
  related: ['sep-ira-contribution-limits', 'catch-up-contributions', 'roth-catch-up-rule', '401k-contribution-limits', 'super-catch-up-60-63'],
  sources: ['notice_2025_67', 'ir_2025_111', 'pub560', 'notice_2024_02'],
});
