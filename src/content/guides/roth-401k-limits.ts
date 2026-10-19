import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const S = L.rothPhase.single, J = L.rothPhase.joint;
// Worked cases: $100,000 of pay at 48 with half in Roth; a single filer at $220,000 above the Roth IRA band; a couple at 54.
const d = K.deferral('401k', 1978, 100000);
const half = d.total / 2;
const rich = K.deferral('401k', 1980, 220000);
const richIra = K.rothReduced('single', 220000, 2026 - 1980, 220000);
const older = K.deferral('401k', 1972, 150000);
const pctSplit = [0, 25, 50, 75, 100];
const rate = 0.22;
// Roth employer match: 100 % up to 4 % on $100,000.
const m = K.match(100000, d.total, 1, 0.04);

export default defineGuide({
  id: 'roth-401k-limits',
  group: 'plans',
  order: 35,
  slug: 'roth-401k-limits',
  nav: 'Roth 401(k) limits',
  card: 'How Roth and pre-tax deferrals share one 2026 limit',
  title: `Roth 401(k) Limits 2026: One ${K.usd(L.deferral)} Cap, No Income Test`,
  description: `Roth 401(k) limits 2026: Roth and pre-tax share one ${K.usd(L.deferral)} limit, with no income test unlike a Roth IRA. Choose your split, see the tax now and later.`,
  h1: 'Roth 401(k) limits 2026: how the split works',
  intro: `A Roth 401(k) is not a second account with a second limit. It is a tax choice inside the same deferral limit, and you can change the split during the year.`,
  resume: `In 2026 Roth 401(k) and pre-tax 401(k) deferrals share one limit of ${K.usd(L.deferral)}, plus the catch-up from 50 (${K.usd(L.deferral + L.catchUp50)} in all, ${K.usd(L.deferral + L.catchUp6063)} at 60 to 63). You can put all of it in Roth, none, or any split: at ${K.usd(100000)} of pay and age ${d.age}, a half and half split means ${K.usd(half)} Roth, taxed now, and ${K.usd(half)} pre-tax. Unlike a Roth IRA, a Roth 401(k) has no income limit: a single filer earning ${K.usd(220000)} cannot contribute directly to a Roth IRA, since the phase-out ends at ${K.usd(S[1])}, but can defer the full ${K.usd(rich.total)} to a Roth 401(k). Since SECURE 2.0, a plan may also let you take the employer match as Roth, and since 2024 a Roth 401(k) has no required minimum distributions during your lifetime, which removes the old reason to roll it over.`,
  body: (h) => `
<h2>One limit, two tax treatments</h2>
<p>Section 402(g) caps elective deferrals, and a designated Roth contribution is an elective deferral like any other. The only difference is when you pay tax. A pre-tax deferral is left out of box 1 of your W-2 and taxed when withdrawn; a Roth deferral is taxed now and comes out tax free later, earnings included, if the distribution is qualified. The split below assumes ${K.usd(100000)} of pay, age ${d.age}, and a 22 % marginal federal rate.</p>
${h.table(['Share to Roth', 'Roth deferrals', 'Pre-tax deferrals', 'Extra federal tax for 2026 at 22 %'], pctSplit.map((p) => [`${p} %`, K.usd(d.total * p / 100), K.usd(d.total * (100 - p) / 100), K.usd(d.total * p / 100 * rate)]), `Same ${K.usd(d.total)} limit on every line. Social Security and Medicare tax apply to both kinds of deferral.`, ['l', 'r', 'r', 'r'])}
<p>The split can change at any time the plan allows, usually from one paycheck to the next. If you have already reached the limit in pre-tax money by October, there is no room left for Roth: the two sources draw from the same total. Your W-2 reports them separately, with code D in box 12 for pre-tax 401(k) deferrals and code AA for Roth ones.</p>
${h.mini('roth401k', { t: 'Choose your Roth share', p: ['share'], d: { pay: 100000, by: 1978 } })}
<h2>No income limit, unlike a Roth IRA</h2>
<p>The Roth IRA has a modified AGI test: in 2026 a single filer starts losing the contribution at ${K.usd(S[0])} and has none left at ${K.usd(S[1])}; on a joint return the band runs from ${K.usd(J[0])} to ${K.usd(J[1])} (${h.a('roth-ira-income-limits', 'Roth IRA income limits')}). The Roth 401(k) has no such test. A single filer aged ${rich.age} earning ${K.usd(220000)} can put ${K.usd(richIra.reduced)} directly in a Roth IRA, and the full ${K.usd(rich.total)} in a Roth 401(k). For higher earners the workplace plan is the simplest way to build Roth savings without a backdoor conversion. The two limits are independent, so the same person could also make a traditional IRA contribution and convert it, subject to the pro rata rule.</p>
<p>Keep in mind that Roth deferrals do not reduce your AGI. Someone near the top of the Roth IRA band who moves deferrals from pre-tax to Roth raises the MAGI used for that test, and can lose some or all of the Roth IRA contribution as a result. Pre-tax deferrals do the opposite.</p>
<h2>Catch-up contributions and the Roth requirement</h2>
<p>The catch-up sits in the same limit and follows the same choice, with one exception from 2026. If your 2025 Social Security wages from the plan's employer were above ${K.usd(L.rothCatchUpWageThreshold)}, the catch-up part must be Roth; the base can still be split as you like. A 54 year old in that position with ${K.usd(150000)} of pay has ${K.usd(older.total)} of room: up to ${K.usd(older.base)} in either source, and ${K.usd(older.catchUp)} that can only be Roth (${h.a('roth-catch-up-rule', 'Roth catch-up rule')}).</p>
<h2>Roth employer contributions</h2>
<p>Section 604 of SECURE 2.0 allows a plan to let employees take matching or nonelective contributions as Roth, if the plan has adopted the option and the contributions are fully vested when made. The employer contribution is then included in your taxable income for the year, though no Social Security or Medicare tax applies to it, and the plan reports it on Form 1099-R rather than on the W-2. With a match of 100 % up to 4 % on ${K.usd(100000)}, a Roth match adds ${K.usd(m)} to your taxable income, about ${K.usd(m * rate)} of federal tax at 22 %. Employer money, Roth or not, does not use any of your ${K.usd(L.deferral)}: it counts toward the separate ${K.usd(L.total415c)} total (${h.a('employer-401k-contribution-limit', 'employer contribution limit')}). Few plans offered the Roth match option at first, so check before assuming it is there.</p>
${h.mini('roth401k', { t: 'All Roth on a higher salary', p: ['pay'], d: { share: 100, by: 1970 } })}
<h2>No required distributions since 2024</h2>
<p>Before 2024, a Roth 401(k) was subject to required minimum distributions from the applicable age, unlike a Roth IRA, and many people rolled it into a Roth IRA just to avoid them. SECURE 2.0 removed that difference: from 2024 there is no lifetime RMD on designated Roth accounts in a plan. Pre-tax money in the same 401(k) is still subject to RMDs, at 73 or 75 depending on your birth year (${h.a('rmd-age', 'RMD age')}). Beneficiaries who inherit a Roth 401(k) still follow the inherited account rules.</p>
<h2>Five years and age 59½</h2>
<p>A Roth 401(k) distribution is fully tax free when it is qualified: at least five tax years after your first Roth deferral to that plan, and after age 59½, disability or death. A nonqualified distribution is split pro rata between your contributions, which are never taxed again, and earnings, which are. A rollover to a Roth IRA is tax free, but the five year clock of the Roth IRA is the one that applies afterwards, which matters for someone opening a first Roth IRA late in life. The deferral limits themselves come from ${h.src('notice_2025_67', 'Notice 2025-67')}.</p>
`,
  faqs: [
    { q: 'Can I split 2026 deferrals between Roth and pre-tax in any proportion?', a: `Yes, if the plan offers both. Any mix is allowed as long as the two together stay within ${K.usd(L.deferral)} plus your catch-up. Many plans let you set a separate percentage for each source and change it during the year. Once your total reaches the limit, both sources stop, whatever their order.` },
    { q: 'Does a high salary stop me from using a Roth 401(k)?', a: `No. The Roth 401(k) has no income test. The modified AGI band that reduces Roth IRA contributions, ${K.usd(S[0])} to ${K.usd(S[1])} for a single filer in 2026, does not apply to designated Roth deferrals in a workplace plan, so a high earner can defer the whole limit as Roth.` },
    { q: 'How is a Roth employer match taxed?', a: `It is included in your taxable income for the year it is contributed, reported on Form 1099-R, but it is not subject to Social Security or Medicare tax. It must be fully vested. Your plan has to offer the option, introduced by SECURE 2.0, and many plans still do not, so the default remains a pre-tax match.` },
    { q: 'Does a Roth 401(k) contribution reduce my Roth IRA limit?', a: `No. The ${K.usd(L.deferral)} plan limit and the ${K.usd(L.ira)} IRA limit are separate. The only link is indirect: Roth 401(k) deferrals leave your AGI higher than pre-tax ones would, which can push your modified AGI into the Roth IRA phase-out band and reduce what you may put in the IRA.` },
  ],
  tool: 'roth401k',
  toolArg: { pay: 100000, by: 1978, share: 50 },
  related: ['401k-contribution-limits', 'roth-catch-up-rule', 'roth-ira-income-limits', 'employer-401k-contribution-limit', 'ira-vs-401k'],
  sources: ['notice_2025_67', 'ir_2025_111', 'ir_2025_91'],
});
