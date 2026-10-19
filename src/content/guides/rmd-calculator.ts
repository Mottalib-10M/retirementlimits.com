import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const R = K.P.rmd;
// Worked cases: born 1951 (75 in 2026), $500,000 on December 31, 2025; the Pub. 590-B $100,000 cases.
const a = K.ownerRmd(500000, 75, null, false, 1951);
const pub = K.ownerRmd(100000, 75);
const pubJ = K.ownerRmd(100000, 75, 64, true);
const sch = K.schedule(500000, 1951, 2026, 6, 0.05);
const at80 = K.uniform(80)!, at90 = K.uniform(90)!;

export default defineGuide({
  id: 'rmd-calculator',
  group: 'rmd',
  order: 10,
  slug: 'rmd-calculator',
  nav: 'RMD calculator',
  card: 'Your 2026 required minimum distribution and the next six years',
  title: 'RMD Calculator 2026: Required Minimum Distribution by Age',
  description: `RMD calculator 2026: divide your December 31, 2025 balance by the IRS factor for your age. At 75 the factor is ${K.dec(pub.factor)}. Joint table and six-year schedule included.`,
  h1: 'RMD calculator 2026: your required minimum distribution',
  intro: 'Type the balance of the account on December 31, 2025 and your birth year. The calculator finds your factor in the IRS table that applies to you and shows the distributions of the next six years.',
  resume: `A required minimum distribution (RMD) for 2026 is the balance of the account at the close of December 31, 2025 divided by a factor from the IRS life expectancy tables, read at the age you reach on your 2026 birthday. Most owners use the Uniform Lifetime Table (Table III of Publication 590-B); an owner whose sole beneficiary for the whole year is a spouse more than 10 years younger uses the Joint and Last Survivor Table (Table II), which gives a smaller amount. RMDs start at 73 for people born from 1951 to 1959 and at 75 for those born in 1960 or later. Publication 590-B gives the example: ${K.usd(100000)} at 75 divided by ${K.dec(pub.factor)} is ${K.usd(pub.rmd)}, or ${K.usd(pubJ.rmd)} with a sole beneficiary spouse aged 64. With ${K.usd(500000)} at 75, the 2026 distribution is ${K.usd(a.rmd)}. Taking less costs ${K.pct(R.exciseTax, 0)} of the shortfall.`,
  body: (h) => `
<h2>The formula, one line</h2>
<p>An RMD is a division and nothing else: <strong>prior year-end balance ÷ applicable denominator</strong>. The balance is the value printed on the December 31 statement of the year before, adjusted only for a rollover that was in transit between two accounts on that date. Contributions and distributions made after December 31 do not change it. The denominator comes from the tables of ${h.src('ecfr_tables', '26 CFR 1.401(a)(9)-9')}, which this site loads in full, and is read at the age you reach in the distribution year, not the age you are on January 1.</p>
<p>Because the factor shrinks each year, the share of the account you must take rises: ${K.pct(1 / K.uniform(73)!, 2)} at 73, ${K.pct(1 / at80, 2)} at 80 and ${K.pct(1 / at90, 2)} at 90. A balance that grows faster than that share keeps rising even while you withdraw; one that grows slower declines.</p>
<h2>A six-year schedule</h2>
<p>Someone born in 1951 turns 75 in 2026. With ${K.usd(500000)} at the end of 2025 and, as an assumption, 5 % growth after each withdrawal, the next distributions look like this:</p>
${h.table(['Year', 'Age', 'Uniform factor', 'RMD'], sch.map((x) => [String(x.year), String(x.age), K.dec(x.factor), K.usd(x.rmd)]), 'Factors from Table III of Publication 590-B (26 CFR 1.401(a)(9)-9(c)). Growth rate is an assumption, not a forecast.', ['l', 'r', 'r', 'r'])}
<p>Only the first line is a requirement today. Each later RMD will be recomputed on the real balance of the prior December 31, so a market drop lowers the next distribution and a good year raises it.</p>
${h.mini('rmd', { t: 'Your own 2026 RMD from your balance', p: ['bal', 'by'], d: { sp: 'no' } })}
<h2>Which accounts have an RMD</h2>
${h.table(['Account', 'RMD for the owner?', 'Where it must come from'], [
  ['Traditional IRA, rollover IRA, SEP IRA, SIMPLE IRA', 'yes', 'any of your IRAs, totals combined'],
  ['401(k), 403(b), 457(b), profit sharing', 'yes, unless still working there and not a 5 % owner', 'each plan separately (403(b)s may be combined)'],
  ['Roth IRA', 'no, during the owner’s life', 'not applicable'],
  ['Designated Roth account in a 401(k) or 403(b)', 'no, from 2024', 'not applicable'],
  ['Inherited IRA', 'depends on the beneficiary', 'that inherited account'],
], 'Publication 590-B and the IRS RMD FAQs.', ['l', 'l', 'l'])}
<p>The rule on combining is where people trip. IRA RMDs are computed account by account and then added up; the total can be taken from any one IRA or spread over several. A 401(k) cannot help another plan: each plan's RMD comes out of that plan. The details are on the ${h.a('rmd-multiple-accounts', 'multiple accounts page')}.</p>
<h2>Uniform or joint: the one question on beneficiaries</h2>
<p>Who you named as beneficiary does not matter for your own RMD, with one exception. If your spouse is the only beneficiary from January 1 to December 31 and is more than 10 years younger than you, Table II applies and gives a longer life expectancy. In the Publication 590-B case the owner is 75 and the spouse 64: factor ${K.dec(pubJ.factor)} instead of ${K.dec(pub.factor)}, ${K.usd(pub.rmd - pubJ.rmd)} less to take on ${K.usd(100000)}. Marital status is set on January 1, so a divorce or a death during the year changes the table only from the next year (${h.a('joint-life-expectancy-table', 'joint table')}).</p>
${h.mini('joint', { t: 'Spouse more than 10 years younger?', p: ['sa'], d: { oa: 77, bal: 600000 } })}
<h2>Timing, withholding and the first year</h2>
<p>Every RMD after the first is due by December 31. The first one can wait until April 1 of the following year, which then carries two distributions on one return (${h.a('first-rmd-deadline', 'first RMD deadline')}). Taking the money in one payment in December or in monthly installments makes no difference to the requirement. Custodians withhold 10 % of federal income tax on an IRA payment unless you choose another rate on Form W-4R, and you can choose zero. An RMD can never be rolled over to another account or converted to a Roth IRA: the conversion has to come after the year's distribution is out.</p>
<p>Taking more than the minimum in one year gives no credit toward the next. The exception is the year you reach your RMD age: money taken that year counts toward the RMD that could have been delayed to April 1.</p>
<h2>Why the share rises with age</h2>
<p>The tables were rebuilt in 2022 on longer life expectancies, so the factors printed today are larger than those of the older tables, and the distributions smaller. Pages that still show a start at 70½ and a 50 % penalty are using rules that ended with the SECURE Act of 2019 and SECURE 2.0 of 2022. If a figure on a statement or in an old article does not match the calculator, check the year of the table it uses first. The current rules are on the ${h.src('rmd_faq', 'IRS RMD FAQs')}.</p>
<h2>What the calculator assumes</h2>
<p>Ages are those reached on the 2026 birthday, as Publication 590-B reads the tables. The owner is alive on January 1 and the account is an individual account, not an annuity contract, which follows different rules. For accounts inherited from someone else, use the ${h.a('inherited-ira-rmd', 'inherited IRA calculator')}: beneficiaries use the Single Life Table and, in many cases, a 10-year deadline. If your RMD age is not reached yet, the result shows the first year you will owe one, read from the ${h.a('rmd-age', 'RMD age rules')}.</p>
`,
  faqs: [
    { q: 'Which balance do I use for my 2026 RMD?', a: 'The fair market value of the account at the close of business on December 31, 2025, as shown on the year-end statement. A contribution or distribution made in 2026 does not change it. The only adjustment is for a rollover or transfer that had left one account but not reached the other on December 31: that amount is added to the receiving account.' },
    { q: 'Do I have to take an RMD from a Roth 401(k) in 2026?', a: 'No. Since 2024 designated Roth accounts in 401(k) and 403(b) plans have no required distributions during the owner’s life, like Roth IRAs. Pre-tax money in the same plan still has an RMD, computed on the pre-tax balance only. Beneficiaries who inherit a Roth account do have distribution rules.' },
    { q: 'Can I reinvest my RMD in a Roth IRA?', a: 'Not as a rollover or conversion: an RMD is not eligible for rollover, and a conversion made before the year’s RMD is out counts as the RMD first. What you can do is take the RMD, pay the tax and, if you have earned income for the year, make a regular Roth IRA contribution within the yearly limit and income test.' },
    { q: 'What happens to my RMD if the market falls after December 31?', a: `Nothing for the current year. The 2026 amount is fixed by the December 31, 2025 balance, so a fall in 2026 makes the distribution a larger share of what is left. The next year’s RMD will be computed on the lower balance of December 31, 2026, with the factor for the age you reach in 2027.` },
  ],
  tool: 'rmd',
  toolArg: { bal: 500000, by: 1951 },
  related: ['rmd-table', 'rmd-age', 'joint-life-expectancy-table', 'inherited-ira-rmd', 'missed-rmd-penalty'],
  sources: ['pub590b', 'ecfr_tables', 'rmd_faq', 'ecfr_rmd_age'],
});
