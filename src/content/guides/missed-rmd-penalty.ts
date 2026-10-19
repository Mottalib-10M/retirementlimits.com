import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const R = K.P.rmd;
const full = K.pct(R.exciseTax, 0), low = K.pct(R.exciseTaxCorrected, 0);
// Worked case: an RMD of $18,000 for 2025, of which $6,000 was taken by December 31, 2025.
const e = K.excise(18000, 6000, false), c = K.excise(18000, 6000, true);
const old = 18000 - 6000;

export default defineGuide({
  id: 'missed-rmd-penalty',
  group: 'rmd',
  order: 60,
  slug: 'missed-rmd-penalty',
  nav: 'Missed RMD penalty',
  card: `${full} of the shortfall, ${low} once corrected, or a waiver`,
  title: 'Missed RMD Penalty 2026: 25 % Excise Tax, 10 % if Corrected',
  description: `Missed RMD penalty 2026: an excise tax of ${full} of the amount not taken, cut to ${low} if you take it within the correction window. Form 5329 and the waiver.`,
  h1: 'Missed RMD penalty: what it costs and how to reduce it',
  intro: 'Enter the RMD you had to take and what you actually took. The calculator shows the excise tax at the full rate, at the reduced rate once the shortfall is corrected, and the difference.',
  resume: `If you take less than your required minimum distribution for a year, the shortfall is subject to an excise tax of ${full}, reported on Form 5329. SECURE 2.0 cut the rate from 50 % for tax years beginning in 2023, and added a lower rate of ${low} when you take the missing amount and file a return reflecting the tax within the correction window, which runs at most to the end of the second year after the year of the shortfall. You can also ask the IRS to waive the tax entirely if the shortfall came from a reasonable error and you are fixing it, by attaching an explanation to Form 5329. Example: an RMD of ${K.usd(18000)} for 2025 of which only ${K.usd(6000)} was taken leaves ${K.usd(e.short)} short. Left alone, the tax is ${K.usd(e.tax)}; corrected in time it is ${K.usd(c.tax)}, and with an accepted waiver it is zero.`,
  body: (h) => `
<h2>The rates since 2023</h2>
${h.table(['Situation', 'Excise tax on the shortfall', `On a ${K.usd(old)} shortfall`], [
  ['Shortfall not corrected', full, K.usd(e.tax)],
  ['Taken and reported within the correction window', low, K.usd(c.tax)],
  ['Waiver for reasonable error granted', '0 %', K.usd(0)],
  ['Rule before 2023, still printed on some pages', '50 %', K.usd(old * 0.5)],
], 'IRC section 4974 as amended by SECURE 2.0; Publication 590-B (2025), Tax on excess accumulations.', ['l', 'r', 'r'])}
<p>The tax applies to the amount not distributed, not to the whole RMD, and not to the account. Taking ${K.usd(6000)} of an ${K.usd(18000)} requirement leaves ${K.usd(e.short)} subject to tax. The income tax on the distribution, once you take it, is a separate matter: it is due in the year the money comes out.</p>
${h.mini('penalty', { t: 'Your shortfall and the tax at each rate', p: ['req', 'took'], d: { fix: 'no' } })}
<h2>The correction window</h2>
<p>Publication 590-B (${h.src('pub590b', 'read on irs.gov')}) defines the window as ending on the earliest of three dates: the mailing of a deficiency notice for this tax, the date the tax is assessed, and the last day of the second tax year that begins after the year in which the tax arose. For a shortfall in 2025, the outer limit is December 31, 2027. Two things must happen inside it to get the ${low} rate: the missing amount must be distributed, and a return reflecting the tax must be filed. In practice that means taking the distribution as soon as the error is found and filing Form 5329 with the tax at ${low}, either with the return for the year or on its own if the return was already filed.</p>
<h2>Asking for a waiver</h2>
<p>The full waiver remains available. If the shortfall was due to a reasonable error, such as a custodian's mistake, a serious illness, a move or a misunderstanding of a new rule, and you have taken or are taking steps to remedy it, you can request that the tax be waived. The method is set by the instructions to Form 5329: complete the form, write "RC" and the amount you want waived next to the excise tax line, and attach a short statement. Pay no tax on the amount you ask to waive. The IRS reviews the explanation and writes only if it refuses.</p>
<p>A practical order follows. First, take the missing amount. Second, file Form 5329 asking for the waiver. If the IRS refuses, the reduced rate remains possible as long as the correction window is still open, which is another reason to take the distribution quickly.</p>
<h2>Common causes of a shortfall</h2>
<ul>
<li><strong>The first RMD forgotten after delaying it to April 1.</strong> Two distributions fall in the same year, and only one is taken (${h.a('first-rmd-deadline', 'first RMD deadline')}).</li>
<li><strong>A 401(k) left at a former employer.</strong> Its RMD cannot be taken from an IRA, so an owner who took the whole amount from the IRA still has a shortfall in the plan (${h.a('rmd-multiple-accounts', 'several accounts')}).</li>
<li><strong>An inherited IRA under the 10-year rule.</strong> Yearly minimums are enforced from 2025 when the owner had started RMDs; many heirs only knew the 10-year deadline (${h.a('inherited-ira-rmd', 'inherited accounts')}).</li>
<li><strong>A wrong balance.</strong> The RMD uses the December 31 value of the prior year; a rollover in transit at year end must be added to the receiving account.</li>
</ul>
<h2>Reading the two numbers in the calculator</h2>
<p>The first line is the tax if nothing is done; the second, the tax once the shortfall is distributed and reported within the window; the last, what the correction saves. On ${K.usd(e.short)} the saving is ${K.usd(e.saved)}. The calculator does not decide whether a waiver would be granted: that depends on the facts you explain to the IRS.</p>
<h2>Years before 2023</h2>
<p>A shortfall for a tax year that began before 2023 falls under the old 50 % rate. The waiver for reasonable error was available then too, and remains the usual route for an old missed distribution. Missed yearly amounts under the 10-year rule for 2021 to 2024 are covered by IRS relief and owe no excise tax (${h.src('notice_2024_35', 'Notice 2024-35')}).</p>
${h.mini('rmd', { t: 'Check this year’s RMD before December 31', p: ['bal', 'by'], d: { sp: 'no', bal: 450000, by: 1950 } })}
<h2>Statute of limitations</h2>
<p>SECURE 2.0 also set a clock for this tax. The period for the IRS to assess it starts when you file your income tax return for the year, even if Form 5329 is not attached, and runs three years. Before that change, an unfiled Form 5329 meant the period never started, and old shortfalls could be assessed many years later. Filing the income tax return now starts the clock, but an honest correction is still the safer route: it is one more reason to file Form 5329 as soon as a shortfall is known instead of waiting.</p>
`,
  faqs: [
    { q: 'Is the missed RMD penalty still 50 %?', a: `No, not for tax years beginning in 2023 or later. SECURE 2.0 reduced the excise tax to ${full} of the amount not distributed, and to ${low} if you take the missing amount and file a return reflecting the tax within the correction window. The 50 % rate applies only to shortfalls in 2022 and earlier years.` },
    { q: 'Do I have to file Form 5329 if I ask for a waiver?', a: 'Yes. The waiver request is made on Form 5329 itself: you complete the part on excess accumulations, enter RC with the amount to be waived next to the tax line, and attach a statement explaining the reasonable error and the steps taken to fix it. If your tax return is already filed, Form 5329 can be filed on its own.' },
    { q: 'I took my missed RMD in March. Does it count toward this year’s RMD?', a: 'No. The catch-up distribution corrects the earlier year and does not reduce the current year’s requirement. You still have to take this year’s full RMD by December 31. Tell the custodian which year a distribution is for, since its forms report the total taken in the calendar year.' },
    { q: 'Who pays the excise tax when the custodian made the error?', a: 'The account owner or beneficiary, legally. A custodian error is a strong ground for the reasonable error waiver, though, and a letter from the custodian confirming the mistake supports the statement attached to Form 5329. Take the missing distribution as soon as the error is found so that the correction window is respected.' },
  ],
  tool: 'penalty',
  toolArg: { req: 18000, took: 6000, fix: 'yes' },
  related: ['rmd-calculator', 'first-rmd-deadline', 'inherited-ira-rmd', 'rmd-multiple-accounts'],
  sources: ['pub590b', 'rmd_faq', 'notice_2024_35'],
});
