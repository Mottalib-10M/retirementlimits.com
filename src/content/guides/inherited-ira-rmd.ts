import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const fx = (x: number | null) => (x === null ? 'none' : x.toFixed(1));
// Worked cases, all from a $300,000 balance on December 31, 2025:
// an adult child born in 1975 whose parent died in 2023 after starting RMDs; the same child if the parent had not started;
// a surviving spouse born in 1956; a brother born in 1948, less than 10 years younger than the owner.
const child = K.inherited(300000, 'other', 2023, true, 2024 - 1975, 2026);
const childNo = K.inherited(300000, 'other', 2023, false, 2024 - 1975, 2026);
const spouse = K.inherited(300000, 'spouse', 2023, true, 2024 - 1956, 2026);
const close = K.inherited(300000, 'close', 2023, true, 2024 - 1948, 2026);

export default defineGuide({
  id: 'inherited-ira-rmd',
  group: 'rmd',
  order: 50,
  slug: 'inherited-ira-rmd',
  nav: 'Inherited IRA RMD',
  card: '10-year rule or life expectancy, and the yearly RMD from 2025',
  title: 'Inherited IRA RMD 2026: 10-Year Rule and Yearly Minimums',
  description: 'Inherited IRA RMD 2026: who must empty the account in 10 years, who takes yearly RMDs on top, and who can stretch payments over life. Your 2026 amount and plan.',
  h1: 'Inherited IRA RMD: the 10-year rule and what is due in 2026',
  intro: 'Tell the calculator who you are to the owner, the year of death and whether RMDs had started. It applies the beneficiary rules of Publication 590-B and shows the minimum for 2026 and the years after.',
  resume: `What you must take from an inherited IRA in 2026 depends on two facts: who you are, and whether the owner died before or after the required beginning date. A spouse, a minor child of the owner, a disabled or chronically ill person, or anyone not more than 10 years younger than the owner is an eligible designated beneficiary and can take yearly distributions over a life expectancy from the Single Life Table. Every other individual, adult children and grandchildren included, must empty the account by December 31 of the tenth year after the death. If the owner had already started RMDs, that beneficiary also owes a yearly minimum in years one to nine, enforced from 2025 after the IRS waived it for 2021 to 2024 (Notice 2024-35). An adult child born in 1975 who inherited ${K.usd(300000)} from a parent who died in 2023 after starting RMDs owes ${K.usd(child.rmd)} for 2026 and must finish by ${child.deadline}.`,
  body: (h) => `
<h2>Three questions decide the rule</h2>
${h.table(['Beneficiary', 'Owner died before RMDs started', 'Owner died after RMDs started'], [
  ['Surviving spouse', 'life expectancy, recalculated each year, or treat as own IRA', 'life expectancy, recalculated each year, or treat as own IRA'],
  ['Minor child of the owner', 'life expectancy until 21, then 10 years', 'life expectancy until 21, then 10 years'],
  ['Disabled, chronically ill, or not more than 10 years younger', 'life expectancy (or 10-year rule if elected)', 'life expectancy'],
  ['Any other individual (adult child, grandchild, friend)', 'empty by year 10, nothing required before', 'yearly RMD in years 1 to 9, empty by year 10'],
  ['Estate, charity, non-qualifying trust', 'empty by year 5', 'over the owner’s remaining life expectancy'],
], 'Publication 590-B (2025), chapter 1, What if You Inherit an IRA; 26 CFR 1.401(a)(9)-3 and -5.', ['l', 'l', 'l'])}
<p>The required beginning date is April 1 of the year after the owner reached RMD age (${h.a('rmd-age', '73 or 75 by birth year')}). An owner born in 1949 who died at 74 in 2023, already taking RMDs, died after it; one who died at 70 died before it, whatever the balance.</p>
<h2>The 10-year rule, with and without yearly RMDs</h2>
<p>For a designated beneficiary who is not eligible, the account must be empty by December 31 of the year containing the tenth anniversary of the death: for a death in 2023, by the end of ${child.deadline}. When the owner had not started RMDs, nothing is required in between, and the money can come out in any pattern. When the owner had started, the final regulations require a yearly minimum in years one to nine as well, computed on the beneficiary's own life expectancy. After years of uncertainty the IRS waived the excise tax on those yearly amounts for 2021 to 2024 (${h.src('notice_2024_35', 'Notice 2024-35')}); from 2025 they are due.</p>
<p>For the adult child born in 1975, the factor is set once, in 2024, the year after death: the Single Life Table value at age 49, reduced by one for each later year. In 2026 it is ${fx(child.factor)}, and ${K.usd(300000)} gives ${K.usd(child.rmd)}. Had the parent died before starting RMDs, the 2026 minimum would be ${K.usd(childNo.rmd)}, with the whole balance still due by ${childNo.deadline}.</p>
${h.mini('inherited', { t: 'Your 2026 minimum as an adult child', p: ['bal', 'dy'], d: { b: 'other', rbd: 'yes', by: 1978 } })}
<h2>Surviving spouses</h2>
<p>A spouse who is the sole beneficiary has the most options. Treating the IRA as your own moves you onto the Uniform table at your own RMD age, as if you had always owned it. Keeping it as an inherited IRA lets you take money before 59½ without the 10 % additional tax, with yearly RMDs based on the Single Life Table looked up again each year at your new age, not reduced by one. A spouse born in 1956 who keeps the inherited account owes ${K.usd(spouse.rmd)} for 2026 on ${K.usd(300000)}, with a factor of ${fx(spouse.factor)}. If the owner died before the required beginning date, the spouse can even wait until the year the owner would have reached RMD age. The calculator applies the yearly lookup but not that delay.</p>
<h2>Other eligible beneficiaries</h2>
<p>A beneficiary not more than 10 years younger than the owner, such as a sibling or a partner of similar age, keeps the life expectancy method: a brother born in 1948 inheriting in 2023 has a 2026 factor of ${fx(close.factor)} and a minimum of ${K.usd(close.rmd)}. Disabled and chronically ill beneficiaries follow the same method, with documentation to give the custodian. A minor child of the owner uses life expectancy only until 21; the 10-year clock then starts. This calculator treats a minor child as a life expectancy beneficiary and does not model the switch at 21, so a child close to that age should plan for the 10-year deadline from then.</p>
<h2>Owner older than the beneficiary, and other details</h2>
<p>When the owner died after the required beginning date, Publication 590-B lets a beneficiary use the longer of his or her own life expectancy and the owner's remaining life expectancy. That matters only for a beneficiary older than the owner; the calculator uses the beneficiary's age. Inherited IRAs cannot be combined with your own IRAs for RMD purposes, and accounts inherited from different people are kept apart (${h.a('rmd-multiple-accounts', 'several accounts')}). The owner's own RMD for the year of death, if not taken, must be taken by the beneficiary by December 31 of that year.</p>
${h.mini('penalty', { t: 'A missed 2025 inherited RMD', p: ['req', 'took'], d: { fix: 'yes', req: 12000, took: 0 } })}
<h2>Roth IRAs inherited</h2>
<p>An inherited Roth IRA follows the same 10-year or life expectancy rules, but because a Roth owner never has a required beginning date, a non-eligible beneficiary owes no yearly amount in years one to nine. Qualified distributions remain tax free, so many beneficiaries let the account grow until the tenth year. A pre-tax inherited IRA is the opposite case: every dollar is taxed as ordinary income when it comes out, and spreading withdrawals over the ten years usually keeps more of them in lower brackets than one large payment in the last year.</p>
`,
  faqs: [
    { q: 'I inherited my father’s IRA in 2022. Did I miss RMDs for 2022 to 2024?', a: 'If he had started RMDs and you are an adult child, yearly minimums technically applied, but Notice 2024-35 and earlier notices waived the excise tax on missed 10-year rule amounts for 2021 through 2024. From 2025 the yearly minimum is enforced, and the account must be empty by December 31, 2032, ten years after his death.' },
    { q: 'Can a surviving spouse delay RMDs from an inherited IRA?', a: 'Yes, in two ways. Treating the account as your own means RMDs start at your own RMD age. Keeping it as an inherited IRA when the owner died before the required beginning date lets you wait until the year the owner would have reached RMD age. Either way, you can still withdraw more at any time.' },
    { q: 'Does the 10-year rule apply to my grandchild who inherits my IRA?', a: 'Yes. A grandchild is a designated beneficiary but not an eligible one, even if a minor: the minor child exception covers only the owner’s own children. The account must be emptied by the end of the tenth year after your death, and if you had started RMDs, yearly minimums apply in years one to nine.' },
    { q: 'How is the life expectancy factor of an inherited IRA reduced each year?', a: 'For a beneficiary other than a spouse, the factor is read once in the Single Life Table at the age reached in the year after the death, then reduced by one each year. A surviving spouse who keeps an inherited IRA looks up the table again each year at the new age, which gives a slower decline.' },
  ],
  tool: 'inherited',
  toolArg: { bal: 300000, b: 'other', dy: 2023, rbd: 'yes', by: 1975 },
  related: ['rmd-calculator', 'rmd-age', 'missed-rmd-penalty', 'rmd-multiple-accounts', 'joint-life-expectancy-table'],
  sources: ['pub590b', 'notice_2024_35', 'ecfr_tables', 'rmd_faq'],
});
