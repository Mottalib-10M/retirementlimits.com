import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const fx = (x: number | null) => (x === null ? 'n/a' : x.toFixed(1));
const owners = [73, 75, 78, 80, 85, 90];
const gaps = [11, 15, 20, 25];
const rows = owners.map((o) => [String(o), fx(K.uniform(o)), ...gaps.map((g) => fx(K.joint(o, o - g)))]);
const pubJ = K.ownerRmd(100000, 75, 64, true), pubU = K.ownerRmd(100000, 75);
// Worked case: owner 76, spouse 62, $800,000.
const w = K.ownerRmd(800000, 76, 62, true), wu = K.ownerRmd(800000, 76);

export default defineGuide({
  id: 'joint-life-expectancy-table',
  group: 'rmd',
  order: 40,
  slug: 'joint-life-expectancy-table',
  nav: 'Joint life expectancy table',
  card: 'Table II for a sole beneficiary spouse more than 10 years younger',
  title: 'Joint Life Expectancy Table 2026: RMD With a Younger Spouse',
  description: `Joint life expectancy table 2026: when your sole beneficiary is a spouse more than 10 years younger, Table II lowers your RMD. Owner 75, spouse 64: factor ${fx(pubJ.factor)}.`,
  h1: 'Joint life expectancy table: the RMD with a much younger spouse',
  intro: 'Enter both ages and the balance. If the gap is more than 10 years, the calculator reads Table II and shows how much less you have to take out than with the Uniform table.',
  resume: `The Joint and Last Survivor Table, Table II of Publication 590-B, replaces the Uniform Lifetime Table for one group of owners only: those whose sole designated beneficiary for the whole year is a spouse more than 10 years younger. The factor sits where the owner's age in the distribution year crosses the spouse's age in the same year, and it is always larger than the uniform factor, so the RMD is smaller. In the IRS example the owner turns 75 in 2026 and the spouse 64: the factor is ${fx(pubJ.factor)} instead of ${fx(pubU.factor)}, and the RMD on ${K.usd(100000)} falls from ${K.usd(pubU.rmd)} to ${K.usd(pubJ.rmd)}. The wider the gap, the larger the saving. With an owner of 76, a spouse of 62 and ${K.usd(800000)}, the 2026 RMD is ${K.usd(w.rmd)} instead of ${K.usd(wu.rmd)}. Marital status and the beneficiary are tested on January 1 of each year.`,
  body: (h) => `
<h2>An extract of Table II</h2>
${h.table(['Owner age', 'Uniform', 'Spouse 11 years younger', '15 years', '20 years', '25 years'], rows, `Joint and Last Survivor Table, 26 CFR 1.401(a)(9)-9(d), read on ecfr.gov on ${K.day(K.P.retrieved_at)}. The full table covers every pair of ages; the calculator reads it for yours.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Each row is one owner age and each column one age gap. The full table in ${h.src('ecfr_tables', 'the regulation')} has a row for every owner age from 0 to 120 and a column for every spouse age, because it is also used by surviving spouses and in other calculations. For an RMD, only the pairs with a gap of more than 10 years matter: at 10 years or less, the Uniform table already assumes a beneficiary 10 years younger and is the one to use.</p>
<h2>The conditions, all three</h2>
<ol>
<li><strong>The beneficiary is your spouse.</strong> A partner who is not a spouse, a child or a trust do not qualify, even if much younger. A trust can qualify only in specific see-through situations where the spouse is treated as the sole beneficiary.</li>
<li><strong>The spouse is the sole designated beneficiary.</strong> Naming the spouse together with children, even for a small share, brings back the Uniform table. A contingent beneficiary who inherits only if the spouse dies first does not count.</li>
<li><strong>More than 10 years younger.</strong> The ages compared are those reached by each of you on your birthdays in the distribution year. A gap of exactly 10 years does not qualify; the table gives no factor for it in this use.</li>
</ol>
${h.mini('joint', { t: 'Your factor with your spouse’s age', p: ['oa', 'sa'], d: { bal: 500000 } })}
<h2>How much it changes</h2>
<p>At 76 the uniform factor is ${fx(K.uniform(76))}. With a spouse aged 62, Table II gives ${fx(w.factor)}, so on ${K.usd(800000)} the minimum drops by ${K.usd(wu.rmd - w.rmd)} for 2026. With a spouse aged 66, exactly 10 years younger, the joint factor does not apply and the owner stays on the Uniform table. The saving grows with the gap and with time: as the owner ages, the uniform factor falls quickly while the joint factor, driven by the younger spouse's life expectancy, falls slowly. Over ten or fifteen years of RMDs, more money stays invested in the account.</p>
<p>A smaller RMD is a floor, not a recommendation. Nothing prevents you from taking more, and some couples prefer to withdraw evenly over the years to keep their income in a lower tax bracket. The joint table only changes what the law requires.</p>
<h2>Divorce, death and the January 1 test</h2>
<p>Publication 590-B sets the test date at January 1. If your spouse is the sole beneficiary on that date, the spouse remains the beneficiary for the whole year for this purpose, even if you divorce or your spouse dies during the year. The change of table takes effect the following year. One exception: if you divorce and change the beneficiary designation during the same year, your former spouse is no longer treated as the sole beneficiary for that year.</p>
<p>When the spouse dies first, the owner moves back to the Uniform table from the next year unless another spouse is named. When the owner dies first, the surviving spouse inherits and can treat the IRA as his or her own, with RMDs then based on the spouse's own age (${h.a('inherited-ira-rmd', 'inherited accounts')}).</p>
<h2>Reading the table by hand</h2>
<p>If you want to check a custodian's figure, the method fits on one line. Take the age the owner reaches on the 2026 birthday and find that row; take the age the spouse reaches on the 2026 birthday and find that column; the number where they cross is the denominator. Divide the account value of December 31, 2025 by it. Custodians normally apply the joint table only when they hold the beneficiary designation and the spouse's date of birth, so a statement that shows the uniform amount may simply mean the information is missing. The custodian computes the figure for convenience; the obligation to take the right amount stays with the owner, and so does the excise tax on a shortfall. Sending the spouse's birth date and confirming the sole designation before the first payment of the year avoids a correction later.</p>
<h2>Plans and IRAs alike</h2>
<p>The same rule applies to a 401(k), a 403(b) and a governmental 457(b), as long as the spouse is the sole beneficiary of that plan. Each account is tested on its own: a couple may name the spouse alone on one IRA and the children on another, and use Table II for the first and the Uniform table for the second. When IRA totals are combined to take the distribution from one account, each IRA's RMD is still computed with its own table first (${h.a('rmd-multiple-accounts', 'several accounts')}).</p>
${h.mini('rmd', { t: 'A six-year schedule with a younger spouse', p: ['sb'], d: { bal: 800000, by: 1950, sp: 'yes', sb: 1964 } })}
`,
  faqs: [
    { q: 'My wife is exactly 10 years younger than me. Can I use the joint table?', a: 'No. The joint table applies only when the sole beneficiary spouse is more than 10 years younger, comparing the ages you each reach on your birthdays in the distribution year. At exactly 10 years, you use the Uniform Lifetime Table, which is already built on a beneficiary 10 years younger than the owner.' },
    { q: 'Can I use the joint table if my spouse shares the IRA with our children?', a: 'Not while the children are primary beneficiaries with your spouse, even for a small share. The spouse must be the sole designated beneficiary for the entire year. Naming the children only as contingent beneficiaries, who inherit if your spouse dies first, keeps the joint table available.' },
    { q: 'We divorced in June. Which RMD table applies to my IRA this year?', a: 'If your former spouse was the sole beneficiary on January 1 and you did not change the designation during the year, the joint table can still be used for this year. If you changed the beneficiary in the same year as the divorce, the former spouse is no longer treated as the sole beneficiary, and the Uniform table applies.' },
    { q: 'Does the joint table also apply to my 401(k)?', a: 'Yes, if the plan follows the regulations and your spouse is the sole beneficiary of that plan account for the year and is more than 10 years younger. Each plan and each IRA is tested separately, so the table can apply to one account and not to another depending on the beneficiary designations on file.' },
  ],
  tool: 'joint',
  toolArg: { oa: 76, sa: 62, bal: 800000 },
  related: ['rmd-calculator', 'rmd-table', 'inherited-ira-rmd', 'rmd-multiple-accounts'],
  sources: ['pub590b', 'ecfr_tables', 'rmd_faq'],
});
