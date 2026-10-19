import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const D = L.deductPhase;
const H = K.P.history;
const full = L.ira + L.iraCatchUp;
const last = H.years.length - 1;
// Worked cases: a single filer covered at work with $86,000 of MAGI, at 40 and at 55; a covered spouse on a joint
// return at $135,000; a spouse not covered whose partner is, at $249,000; nobody covered at $400,000.
const s40 = K.deductible('single', 'you', 86000, 40, 86000);
const s55 = K.deductible('single', 'you', 86000, 55, 86000);
const jc = K.deductible('joint', 'you', 135000, 45, 135000);
const sp = K.deductible('joint', 'spouse', 249000, 45, 249000);
const none = K.deductible('joint', 'none', 400000, 45, 400000);
const mfs = K.deductible('mfs', 'you', 4000, 45, 60000);

export default defineGuide({
  id: 'traditional-ira-deduction-limits',
  group: 'ira',
  order: 30,
  slug: 'traditional-ira-deduction-limits',
  nav: 'Traditional IRA deduction',
  card: 'How much of a traditional IRA contribution you can deduct with a workplace plan',
  title: 'Traditional IRA Deduction Limits 2026: Covered by a Plan',
  description: `Traditional IRA deduction limits 2026: covered at work, the deduction phases out from ${K.usd(D.singleCovered[0])} single and ${K.usd(D.jointCovered[0])} joint. See your own deductible part.`,
  h1: 'Traditional IRA deduction limits 2026: what you can still deduct',
  intro: `Anyone with compensation may contribute to a traditional IRA, but a workplace retirement plan can take the deduction away. The calculator applies Worksheet 1-2 of Publication 590-A to your filing status, coverage and modified AGI.`,
  resume: `In 2026 a traditional IRA contribution of up to ${K.usd(L.ira)} (${K.usd(full)} at 50 or over) is fully deductible when neither you nor your spouse is covered by a workplace plan, at any income. If you are covered, the deduction phases out between ${K.usd(D.singleCovered[0])} and ${K.usd(D.singleCovered[1])} of modified AGI as a single filer or head of household, and between ${K.usd(D.jointCovered[0])} and ${K.usd(D.jointCovered[1])} on a joint return. If only your spouse is covered, your own range on a joint return is ${K.usd(D.spouseCovered[0])} to ${K.usd(D.spouseCovered[1])}; filing separately it is ${K.usd(D.mfsCovered[0])} to ${K.usd(D.mfsCovered[1])}. A covered single filer aged 40 with ${K.usd(86000)} of MAGI can deduct ${K.usd(s40.deductible)} of a full contribution and ${K.usd(s55.deductible)} at 55. What is not deductible can still go in as a nondeductible contribution, recorded on Form 8606.`,
  body: (h) => `
<h2>The four deduction ranges for 2026</h2>
${h.table(['Your situation', 'Full deduction up to', 'No deduction from'], [
  ['Covered by a plan, single or head of household', K.usd(D.singleCovered[0]), K.usd(D.singleCovered[1])],
  ['Covered by a plan, married filing jointly', K.usd(D.jointCovered[0]), K.usd(D.jointCovered[1])],
  ['Not covered, spouse covered, married filing jointly', K.usd(D.spouseCovered[0]), K.usd(D.spouseCovered[1])],
  ['Covered (you or spouse), married filing separately', K.usd(D.mfsCovered[0]), K.usd(D.mfsCovered[1])],
  ['Neither spouse covered, any status', 'any income', 'never'],
], `Notice 2025-67, read on ${K.day(K.P.retrieved_at)}. A separate filer who lived apart from the spouse all year uses the single line.`, ['l', 'r', 'r'])}
<p>The single and joint ranges both moved up this year, from a starting point of ${K.usd(H.deductStartSingle[last - 1])} and ${K.usd(H.deductStartJoint[last - 1])} in 2025. The joint range for a covered worker is ${K.usd(D.jointCovered[1] - D.jointCovered[0])} wide, twice the single one, which makes the reduction gentler per dollar of income. The spouse range is the same as the Roth IRA joint range, ${K.usd(D.spouseCovered[1] - D.spouseCovered[0])} wide.</p>
<h2>What "covered by a plan" means</h2>
<p>Coverage is a yes or no question asked for each spouse separately, and box 13 of Form W-2 answers it: if "Retirement plan" is checked, you count as covered for the whole year (${h.src('pub590a', 'Publication 590-A, chapter 1')}). In a 401(k), 403(b), 457(b), SIMPLE IRA or SEP, you are covered for a year in which any contribution or forfeiture was allocated to your account, including a match or a profit-sharing amount you did not ask for. In a defined benefit pension, being eligible to participate is enough, even if you decline. A single day of employment with a contribution can therefore turn coverage on for the entire year.</p>
<p>Coverage does not depend on how long you were enrolled, and it is not shared automatically between spouses: if one spouse is covered, the other is not "covered", but is subject to the higher spouse range on a joint return. Social Security and railroad retirement do not count as plans.</p>
<h2>Worksheet 1-2: three worked cases</h2>
<p>Inside a range the deduction is the full limit multiplied by the share of the range still ahead of your income, rounded up to the next $10, with a $200 minimum. The worksheet in Publication 590-A writes it as a percentage of the distance to the top of the range; the engine applies the same formula.</p>
${h.table(['Case', 'Range', 'MAGI', 'Deductible', 'Nondeductible'], [
  ['Single, covered, age 40', `${K.usd(D.singleCovered[0])} to ${K.usd(D.singleCovered[1])}`, K.usd(86000), K.usd(s40.deductible), K.usd(s40.nondeductible)],
  ['Single, covered, age 55', `${K.usd(D.singleCovered[0])} to ${K.usd(D.singleCovered[1])}`, K.usd(86000), K.usd(s55.deductible), K.usd(s55.nondeductible)],
  ['Joint, you are covered, age 45', `${K.usd(D.jointCovered[0])} to ${K.usd(D.jointCovered[1])}`, K.usd(135000), K.usd(jc.deductible), K.usd(jc.nondeductible)],
  ['Joint, only your spouse covered, age 45', `${K.usd(D.spouseCovered[0])} to ${K.usd(D.spouseCovered[1])}`, K.usd(249000), K.usd(sp.deductible), K.usd(sp.nondeductible)],
  ['Joint, nobody covered, age 45', 'none', K.usd(400000), K.usd(none.deductible), K.usd(none.nondeductible)],
], 'Full contribution assumed in every case.', ['l', 'r', 'r', 'r', 'r'])}
<p>The second line shows the catch-up being reduced in proportion: at 55 the starting amount is ${K.usd(full)}, so the same income leaves ${K.usd(s55.deductible)} deductible rather than ${K.usd(s40.deductible)}. On a joint return each spouse runs the worksheet separately, with his or her own coverage status but the couple's single MAGI, so a covered spouse and an uncovered spouse can end up with very different results.</p>
${h.mini('deduct', { t: 'Deductible part when only your spouse has a plan', p: ['magi'], d: { f: 'joint', cov: 'spouse', magi: 249000 } })}
<h2>Married filing separately</h2>
<p>A separate return with a covered spouse in the picture uses a range of ${K.usd(D.mfsCovered[0])} to ${K.usd(D.mfsCovered[1])}, so almost no one keeps a deduction: at ${K.usd(4000)} of MAGI the deductible part is already ${K.usd(mfs.deductible)}. The single line applies instead if you lived apart from your spouse for the entire year.</p>
<h2>The modified AGI used here</h2>
<p>The MAGI of the deduction test is the AGI on your return, before the IRA deduction itself, with a few exclusions added back: foreign earned income and housing, excluded savings bond interest, employer adoption benefits and the student loan interest deduction. It is close to, but not the same as, the Roth figure. Pre-tax deferrals into the workplace plan already lower it, so a larger 401(k) contribution can move a covered worker below ${K.usd(D.singleCovered[0])}, which is often worth checking before December.</p>
<h2>When the deduction is limited: nondeductible contributions</h2>
<p>The contribution limit is not affected by any of these ranges. If only part of your ${K.usd(L.ira)} is deductible, you can still contribute the rest; that part is a nondeductible contribution and creates basis in the IRA. You report it on Form 8606 for the year, and the form tracks the basis every year after, so that this money is not taxed a second time when you withdraw it. Forgetting Form 8606 has a cost: the IRS can charge $50 for a missing one, and without the record later withdrawals may be taxed as if they were all pre-tax.</p>
<p>When you take money out, each distribution is partly basis and partly taxable, in proportion to all your traditional, SEP and SIMPLE IRA balances at year end. A nondeductible contribution is also the first step of what is called a backdoor Roth: the ${h.a('roth-ira-income-limits', 'Roth income limits page')} explains when the direct route is closed, and the ${h.a('ira-contribution-limits', 'IRA contribution limits page')} covers the compensation test that applies to deductible and nondeductible money alike.</p>
${h.mini('deduct', { t: 'Covered at work: how much is deductible?', p: ['magi', 'by'], d: { f: 'single', cov: 'you', magi: 86000, by: 1971 } })}
`,
  faqs: [
    { q: 'Can I deduct a traditional IRA contribution if I have a 401(k) at work?', a: `Yes, fully, if your 2026 modified AGI is at or below ${K.usd(D.singleCovered[0])} as a single filer or ${K.usd(D.jointCovered[0])} on a joint return. The deduction shrinks above those amounts and disappears at ${K.usd(D.singleCovered[1])} and ${K.usd(D.jointCovered[1])}. Without any workplace plan for either spouse, there is no income limit at all.` },
    { q: 'My spouse has a pension but I do not: which deduction range applies to me?', a: `On a joint return your own range is ${K.usd(D.spouseCovered[0])} to ${K.usd(D.spouseCovered[1])} of joint MAGI in 2026, much higher than the range for a covered worker. Your spouse, being covered, uses ${K.usd(D.jointCovered[0])} to ${K.usd(D.jointCovered[1])}. The same couple can therefore have one deductible IRA and one that is not.` },
    { q: 'How do I know if I count as covered by a workplace retirement plan?', a: 'Look at box 13 of your Form W-2: a checked "Retirement plan" box means you are covered for the year. In a 401(k) or 403(b) that happens when any money, even only a match or a forfeiture, was added to your account for the year. Eligibility alone is enough in a traditional pension.' },
    { q: 'Should I still contribute if none of my traditional IRA contribution is deductible?', a: 'That depends on your situation, and this page gives general information only. The money still grows tax-deferred, and the part you contributed comes back tax-free because it is basis tracked on Form 8606. Some people use it as the first step of a Roth conversion; the pro rata rule on other pre-tax IRA balances decides how much of that conversion is taxed.' },
  ],
  tool: 'deduct',
  toolArg: { f: 'single', cov: 'you', magi: 86000, by: 1986 },
  related: ['ira-contribution-limits', 'roth-ira-income-limits', 'spousal-ira', 'ira-vs-401k'],
  sources: ['notice_2025_67', 'pub590a', 'irs_cola'],
});
