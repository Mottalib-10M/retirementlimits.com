import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const L27 = K.L27;
const cap = L.dependentCareFsa, capMfs = L.dependentCareFsaMfs;
// Worked cases: two earners at $70,000 and $45,000 with $12,000 of daycare; the same family when one spouse earns
// $4,000 part-time; a single parent at $52,000 with $6,000 of after-school care; a separate return.
const both = K.dependentCare(false, 70000, 45000, 12000);
const partTime = K.dependentCare(false, 70000, 4000, 12000);
const single = K.dependentCare(false, 52000, null, 6000);
const mfs = K.dependentCare(true, 70000, 45000, 12000);

export default defineGuide({
  id: 'dependent-care-fsa-limit',
  group: 'health',
  order: 30,
  slug: 'dependent-care-fsa-limit',
  nav: 'Dependent care FSA',
  card: 'The new household cap, the earned income test and the credit',
  title: 'Dependent Care FSA Limit 2026: New Household Cap Explained',
  description: `Dependent care FSA limit 2026: ${K.usd(cap)} per household, ${K.usd(capMfs)} if married filing separately, never above the lower earned income. Check your amount and the credit.`,
  h1: 'Dependent care FSA limit 2026: how much you can set aside',
  intro: `From 2026 a dependent care FSA can shelter much more of what you pay for child care. The calculator applies the household cap, the earned income test and your actual expenses.`,
  resume: `For the 2026 tax year the amount you can exclude through a dependent care FSA, or any dependent care assistance program, is ${K.usd(cap)} per household, or ${K.usd(capMfs)} for a married person filing separately (Publication 15-B). The 2025 tax law raised the cap, which had not moved since 1986, and it stays at ${K.usd(L27.dependentCareFsa)} for 2027. The cap is per household, not per parent: two spouses with an account each still share it. It can never exceed the earned income of the lower-earning spouse. A couple earning ${K.usd(70000)} and ${K.usd(45000)} who pay ${K.usd(12000)} for daycare can use ${K.usd(both.usable)}; if one spouse earns only ${K.usd(4000)}, the limit falls to ${K.usd(partTime.usable)}. Money reimbursed by the FSA cannot also count for the child and dependent care credit, and at the new cap a full FSA usually leaves the credit with nothing.`,
  body: (h) => `
<h2>The 2026 cap, in the words of the IRS</h2>
<p>Publication 15-B for 2026 states it plainly in its list of changes: for the 2026 tax year the annual dependent care FSA limit was raised, to ${K.usd(cap)} and to ${K.usd(capMfs)} for married filing separately (${h.src('pub15b', 'Publication 15-B, What’s New')}). The change comes from Public Law 119-21 of July 4, 2025, which amended section 129. The amount is written into the code and is not indexed for inflation, which is why the 2027 figure is already known and identical.</p>
${h.table(['Situation', '2026 cap', '2027 cap'], [
  ['Single, head of household, married filing jointly', K.usd(cap), K.usd(L27.dependentCareFsa)],
  ['Married filing separately', K.usd(capMfs), K.usd(L27.dependentCareFsaMfs)],
], `Publication 15-B (2026), read on ${K.day(K.P.retrieved_at)}. Employer contributions to the account count toward the same cap.`, ['l', 'r', 'r'])}
<p>Employers had to amend their plans to offer the higher amount, and some kept a lower ceiling for 2026. The figure above is the most the law excludes; your plan's own cap may be smaller.</p>
<h2>Three limits, the smallest wins</h2>
<p>What you can actually set aside is the smallest of three amounts: the household cap, your earned income (and, if you are married, your spouse's earned income, taking the lower of the two), and the qualifying care costs you really incur.</p>
${h.table(['Household', 'Earned incomes', 'Care costs', 'Usable FSA amount'], [
  ['Two earners', `${K.usd(70000)} and ${K.usd(45000)}`, K.usd(12000), K.usd(both.usable)],
  ['One spouse works part-time', `${K.usd(70000)} and ${K.usd(4000)}`, K.usd(12000), K.usd(partTime.usable)],
  ['Single parent', K.usd(52000), K.usd(6000), K.usd(single.usable)],
  ['Married filing separately', `${K.usd(70000)} and ${K.usd(45000)}`, K.usd(12000), K.usd(mfs.usable)],
], 'Computed with the 2026 caps.', ['l', 'r', 'r', 'r'])}
<p>The earned income test explains the second line: a spouse with ${K.usd(4000)} of wages limits the household to ${K.usd(partTime.usable)}, even with a much larger daycare bill. A spouse who is a full-time student for at least five months of the year, or who cannot care for himself or herself, is treated as earning a monthly amount set in Publication 503, so that family is not shut out entirely.</p>
${h.mini('dcfsa', { t: 'Your usable amount when one spouse earns little', p: ['es'], d: { mfs: 'no', ey: 70000, es: 4000, ex: 12000 } })}
<h2>One cap per household</h2>
<p>Unlike the health FSA, which each working spouse can fill at his or her own job, the dependent care cap is shared. If both spouses' employers offer an account, the two elections together should stay within ${K.usd(cap)}. Any amount above the cap is added to your taxable wages; employers report the total benefits in box 10 of Form W-2, and Form 2441 sorts out what stays excluded. Married couples filing separately each have ${K.usd(capMfs)}, half the joint amount.</p>
<h2>What the FSA can pay for</h2>
<p>The care must allow you, and your spouse if married, to work or look for work. It must be for a qualifying person: your child under 13, or a spouse or dependent of any age who is physically or mentally unable to care for himself or herself and lives with you for more than half the year. Daycare, preschool, before and after school programs, day camps and a nanny's wages qualify. Overnight camp, private school tuition from kindergarten up, and care by your own child under 19 or by a dependent do not.</p>
<h2>The FSA and the child and dependent care credit</h2>
<p>The same expenses cannot give you both benefits. Publication 503 tells you to subtract what was excluded through a dependent care benefit plan from the dollar limit of the credit before figuring it (${h.src('pub503', 'Publication 503')}). That dollar limit, for one qualifying person or for two or more, is lower than the new ${K.usd(cap)} cap. So a household that excludes the full ${K.usd(cap)} through its FSA has nothing left for the credit, however much it spends on care.</p>
<p>Which route saves more depends on your tax bracket, payroll taxes and income level: the FSA avoids income tax and the ${K.pct((K.P.se.ssRate + K.P.se.medicareRate) / 2, 2)} employee share of FICA on the amount, while the credit is a percentage of expenses that varies with AGI. A household that does not use the full FSA can still claim the credit on the part of the credit limit that the FSA did not use. Form 2441 does the arithmetic; this page gives general information only.</p>
<h2>Use it or lose it, and no carryover</h2>
<p>Dependent care accounts follow stricter rules than health FSAs. There is no uniform coverage: you can only be reimbursed up to what has been withheld so far, so a large January daycare bill is paid back as your paychecks come in. A plan can offer a grace period of up to two and a half months, but the ${K.usd(L.healthFsaCarryover)} carryover of the ${h.a('fsa-contribution-limits', 'health FSA')} does not exist for dependent care. Unused money at the end is forfeited. You can change your election mid-year when the cost of care changes, for example when a child starts kindergarten or your provider raises its rates, which is not possible for a health FSA.</p>
<p>Families with an HSA can use a dependent care FSA without any effect on HSA eligibility, since it does not cover medical costs (${h.a('hsa-contribution-limits', 'HSA limits')}).</p>
`,
  faqs: [
    { q: 'Can both spouses each put the full amount in a dependent care FSA?', a: `No. The ${K.usd(cap)} cap for 2026 is per household on a joint return, so two accounts at two employers share it. Elections that add up to more lead to taxable wages for the excess. On separate returns each spouse is limited to ${K.usd(capMfs)}. This is the main difference from the health FSA, which is per employee.` },
    { q: 'What if my spouse does not work: can we still use a dependent care FSA?', a: 'Generally no, because the limit cannot exceed the lower earned income, and a spouse with no earnings brings it to zero. The exceptions are a spouse who is a full-time student during at least five months of the year or who is incapable of self-care: Publication 503 treats that spouse as having a set monthly earned income.' },
    { q: 'Can I use a dependent care FSA and the child care credit in the same year?', a: `Yes, but not on the same dollars. The amount excluded through the FSA reduces the expenses the credit can use, dollar for dollar, under the Publication 503 rule. Since the credit's expense limit is lower than ${K.usd(cap)}, a full FSA leaves no room for the credit; a partly used FSA may leave some.` },
    { q: 'Does the dependent care FSA limit change in 2027?', a: `No. The ${K.usd(L27.dependentCareFsa)} household cap, and ${K.usd(L27.dependentCareFsaMfs)} for married filing separately, are fixed amounts in section 129 and are not adjusted for inflation. The amounts for 2027 are therefore the same as for 2026, unless Congress changes the law again.` },
  ],
  tool: 'dcfsa',
  toolArg: { ey: 70000, es: 45000, ex: 12000 },
  related: ['fsa-contribution-limits', 'hsa-contribution-limits', 'hsa-limits-2027'],
  sources: ['pub15b', 'pub503'],
});
