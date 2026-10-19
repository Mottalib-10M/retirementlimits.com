import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Uniform Lifetime Table (Table III of Publication 590-B, 26 CFR 1.401(a)(9)-9(c)), ages 72 to 120, in three blocks.
const fx = (x: number) => x.toFixed(1);
const ages = Array.from({ length: 49 }, (_, i) => 72 + i);
const third = Math.ceil(ages.length / 3);
const rows = Array.from({ length: third }, (_, i) => [0, 1, 2].flatMap((k) => {
  const a = ages[i + k * third];
  return a === undefined ? ['', ''] : [String(a), fx(K.uniform(a)!)];
}));
const f73 = K.uniform(73)!, f75 = K.uniform(75)!, f85 = K.uniform(85)!, f100 = K.uniform(100)!;
const b = 250000;

export default defineGuide({
  id: 'rmd-table',
  group: 'rmd',
  order: 20,
  slug: 'rmd-table',
  nav: 'RMD table (Uniform Lifetime)',
  card: 'The full Uniform Lifetime Table, 72 to 120, and your factor',
  title: 'RMD Table 2026: Uniform Lifetime Table, Ages 72 to 120',
  description: `RMD table 2026: the IRS Uniform Lifetime Table in full, from ${fx(K.uniform(72)!)} at 72 to ${fx(K.uniform(120)!)} at 120, with the factor for your own age and the RMD on any balance you type.`,
  h1: 'RMD table 2026: the Uniform Lifetime Table in full',
  intro: 'Find your age, read the factor, divide your December 31 balance by it. The calculator does the division and shows the factors around your age.',
  resume: `The Uniform Lifetime Table is the table almost every IRA and 401(k) owner uses to compute a required minimum distribution. It is Table III in Appendix B of Publication 590-B and comes from 26 CFR 1.401(a)(9)-9(c), in force since 2022. Each age from 72 to 120 has a distribution period: ${K.dec(f73)} at 73, ${K.dec(f75)} at 75, ${K.dec(f85)} at 85, ${K.dec(f100)} at 100. For 2026 you read the factor at the age you reach on your 2026 birthday and divide the account balance of December 31, 2025 by it: ${K.usd(b)} at 75 means ${K.usd(b / f75)}. The table is the same for everyone, married or single, unless the sole beneficiary is a spouse more than 10 years younger, who brings in the joint table. Tables printed before 2022 give smaller factors and larger RMDs; they no longer apply.`,
  body: (h) => `
<h2>Table III, ages 72 to 120</h2>
${h.table(['Age', 'Factor', 'Age', 'Factor', 'Age', 'Factor'], rows, `Uniform Lifetime Table, 26 CFR 1.401(a)(9)-9(c), loaded from ecfr.gov on ${K.day(K.P.retrieved_at)}. Same values as Table III of Publication 590-B.`, ['l', 'r', 'l', 'r', 'l', 'r'])}
<p>The first age printed is 72 because the table also serves people who reached their RMD age under earlier rules. Under current law nobody starts at 72 any more: RMDs begin at 73 for owners born from 1951 to 1959 and at 75 for those born in 1960 or later (${h.a('rmd-age', 'RMD age by birth year')}). The table ends at 120 with a factor of ${fx(K.uniform(120)!)}, which is used for every age beyond.</p>
<h2>Reading it for 2026</h2>
<p>Use your age on your birthday in 2026, even if the birthday is in December. Someone born on December 30, 1951 is 74 on January 1 and 75 at year end: the factor is the one for 75, ${K.dec(f75)}. Then divide the balance of the account on December 31, 2025. The calculator above does both steps and shows the factors just before and after your age, so you can see how the next years will move.</p>
${h.mini('table', { t: 'Factor and RMD at a given age', p: ['age', 'bal'], d: {} })}
<h2>Your first factor depends on your birth year</h2>
<p>Because the starting age moved twice in four years, two people of almost the same age can enter the table at different lines. An owner born in 1953 reaches 73 in 2026 and starts with ${fx(f73)}, about ${K.pct(1 / f73, 2)} of the account. An owner born in 1960 has no RMD until 2035, the year of the 75th birthday, and starts directly at ${fx(f75)}, skipping the lines for 73 and 74. Those two extra years without a required withdrawal are years in which a Roth conversion or a charitable plan can be arranged at a lower income. Nothing stops you from withdrawing earlier than the table asks, but money taken before your RMD age never counts toward a later RMD.</p>
<h2>Spreading the amount over the year</h2>
<p>The table gives a yearly minimum, not a schedule. Custodians usually offer a single December payment, quarterly or monthly installments, and an automatic recalculation each January from the new balance and the next factor. ${K.usd(b / f75)} taken monthly is about ${K.usd(b / f75 / 12)} a month. Whatever the rhythm, what the IRS checks is that the total for the calendar year reached the minimum by December 31.</p>
<h2>What the factor means</h2>
<p>A factor is a number of years. It is the joint life expectancy of a person of your age and a hypothetical beneficiary 10 years younger, which is why it is called uniform: the IRS assumes the same beneficiary for everyone so that one table can serve all owners. Dividing by ${K.dec(f75)} amounts to taking ${K.pct(1 / f75, 2)} of the account at 75; at 85, with a factor of ${K.dec(f85)}, the share is ${K.pct(1 / f85, 2)}; at 100 it is ${K.pct(1 / f100, 2)}. The factor never reaches zero, so the table alone never forces an account to be emptied.</p>
<h2>The 2022 update and the old tables still online</h2>
<p>The Treasury replaced the tables from January 1, 2022, using longer life expectancies. Every factor went up, by about one to two years at most ages, and every RMD went down. At 75 the old table gave 22.9; the current one gives ${K.dec(f75)}. On ${K.usd(b)}, that difference is about ${K.usd(b / 22.9 - b / f75)} a year. Articles written before 2022 still rank for "RMD table", sometimes with a start at 70½ and a 50 % penalty on a missed distribution. Both are out of date: the penalty is now ${K.pct(K.P.rmd.exciseTax, 0)}, and ${K.pct(K.P.rmd.exciseTaxCorrected, 0)} if corrected in time (${h.a('missed-rmd-penalty', 'missed RMD penalty')}).</p>
<h2>When this table is not the one</h2>
<ul>
<li><strong>Spouse more than 10 years younger, sole beneficiary all year</strong>: the Joint and Last Survivor Table (Table II) gives a larger factor, see the ${h.a('joint-life-expectancy-table', 'joint table page')}.</li>
<li><strong>You inherited the account</strong>: beneficiaries use the Single Life Table (Table I), with rules of their own on the ${h.a('inherited-ira-rmd', 'inherited IRA page')}.</li>
<li><strong>An annuity contract</strong>: payments from an annuity purchased inside an IRA or plan follow 26 CFR 1.401(a)(9)-6, not this table.</li>
</ul>
${h.mini('rmd', { t: 'Same balance, with a much younger spouse', p: ['sb'], d: { bal: 250000, by: 1951, sp: 'yes', sb: 1964 } })}
<h2>Using the table across several accounts</h2>
<p>The same factor applies to each of your accounts in a given year, since it depends on your age only. For IRAs you can add the balances, divide once and take the total from any of them. For 401(k) plans you divide each plan's balance separately and take each amount from its own plan. The ${h.a('rmd-calculator', 'RMD calculator')} adds a six-year schedule on a growth rate you choose.</p>
`,
  faqs: [
    { q: 'Why does the RMD table start at age 72 if RMDs start at 73?', a: 'The table was published in 2020 and took effect in 2022, when the RMD age was 72. It still serves owners who reached 72 under that rule and continue to take distributions. Under the current rules, people born from 1951 to 1959 start at 73 and those born in 1960 or later at 75, and simply read the table from that age on.' },
    { q: 'Do I use my age on January 1 or on my birthday for the factor?', a: 'Your age on your birthday in the distribution year. Publication 590-B says to use the factor listed next to your age as of your birthday in 2026 for the 2026 RMD. Someone who turns 80 in November 2026 uses the factor for 80 for the whole year, even though the distribution may be taken earlier.' },
    { q: 'Is the Uniform Lifetime Table different for married and single owners?', a: 'No. Every owner uses the same table, whatever the marital status or the beneficiary named, with one exception: when the sole beneficiary for the entire year is a spouse more than 10 years younger. In that case the Joint and Last Survivor Table applies and gives a longer distribution period.' },
    { q: 'Will the RMD table change again soon?', a: 'The regulations provide that the tables are updated periodically to reflect new mortality data, and the 2022 tables were the first change in about twenty years. No new table has been proposed. If one is adopted, this site will load it from the eCFR text and the calculators will follow from its effective date.' },
  ],
  tool: 'table',
  toolArg: { age: 75, bal: 250000 },
  related: ['rmd-calculator', 'joint-life-expectancy-table', 'rmd-age', 'rmd-multiple-accounts'],
  sources: ['ecfr_tables', 'pub590b', 'rmd_faq'],
});
