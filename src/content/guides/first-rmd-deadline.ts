import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const fx = (x: number) => x.toFixed(1);
// Worked case: born 1953, $600,000 on December 31, 2025, 5 % growth assumed during 2026.
const d = K.firstYearDouble(600000, 1953, 0.05);
const f60 = K.firstRmdYear(1960);
const early = K.ownerRmd((600000 - d.first) * 1.05, 74).rmd;
const rows = [1953, 1954, 1955, 1956, 1958, 1959, 1960, 1962].map((b) => { const f = K.firstRmdYear(b); return [String(b), String(f.age), String(f.year), `April 1, ${f.rbdYear}`]; });

export default defineGuide({
  id: 'first-rmd-deadline',
  group: 'rmd',
  order: 70,
  slug: 'first-rmd-deadline',
  nav: 'First RMD deadline',
  card: 'April 1 of the next year, and the cost of two RMDs in one year',
  title: 'First RMD Deadline 2026: April 1 Rule and the Double Year',
  description: 'First RMD deadline 2026: turning 73 this year, you can wait until April 1, 2027, but then two RMDs fall in 2027. See both amounts and the year each is taxed.',
  h1: 'First RMD deadline: take it this year or by April 1?',
  intro: 'Type your birth year and the balance of the year before your first RMD. The calculator shows the two distributions you would take in the same year if you use the April 1 deadline.',
  resume: `Your first required minimum distribution has a later deadline than every other one: April 1 of the year after the year you reach your RMD age. If you were born in 1953, you turn 73 in 2026; the RMD for 2026 can be taken at any time in 2026 or as late as April 1, 2027. The catch is the second one: the RMD for 2027 is still due by December 31, 2027, so delaying puts both on your 2027 tax return. With ${K.usd(600000)} at the end of 2025, the 2026 RMD is ${K.usd(d.first)} (factor ${fx(K.uniform(73)!)}), and the 2027 RMD on a balance grown at an assumed 5 % would be about ${K.usd(d.second)}, ${K.usd(d.both)} of taxable income in one year. Taking the first RMD in 2026 spreads the two amounts over two returns. People born in 1960 or later start at 75, with a first deadline of April 1, ${f60.rbdYear}.`,
  body: (h) => `
<h2>First RMD year and deadline by birth year</h2>
${h.table(['Born in', 'RMD age', 'First distribution year', 'Latest date for the first RMD'], rows, 'IRC section 401(a)(9)(C); 26 CFR 1.401(a)(9)-2; for 1959, the proposed rule of July 2024.', ['l', 'r', 'r', 'l'])}
<p>The required beginning date applies once, to the first distribution year. From then on, each year's RMD is due by December 31 of that year. The first RMD is computed like any other, on the balance of December 31 of the year before the first distribution year and with the factor for the age reached that year (${h.a('rmd-calculator', 'RMD calculator')}).</p>
<h2>Two RMDs in one year: what changes</h2>
${h.table(['', 'Take the first in 2026', 'Wait until early 2027'], [
  ['Distributions on the 2026 return', K.usd(d.first), K.usd(0)],
  ['Distributions on the 2027 return', K.usd(early), K.usd(d.both)],
  ['Balance used for the 2027 RMD', 'December 31, 2026, after the first RMD', 'December 31, 2026, before the first RMD'],
], `Born in 1953, ${K.usd(600000)} at the end of 2025, 5 % growth assumed in 2026. The real 2027 amount will use the real December 31, 2026 balance.`, ['l', 'r', 'r'])}
<p>A detail in the table matters. When the first RMD is taken in early 2027, it is not yet out of the account on December 31, 2026, so the balance used for the second RMD is higher. The difference is small but goes the same way: waiting raises the total withdrawn in 2027.</p>
${h.mini('first', { t: 'Your two amounts if you wait until April 1', p: ['by', 'bal'], d: {} })}
<h2>When waiting can still make sense</h2>
<p>The April 1 option was designed for people whose income drops in the year after they stop working. If 2026 is still a year of salary and 2027 the first full year of retirement, two distributions in 2027 may be taxed at a lower rate than one in 2026 on top of wages. The reverse is more common: a retired owner with stable income who waits simply stacks two RMDs on one return, which can push part of the income into a higher bracket, increase the taxable share of Social Security benefits, and raise Medicare Part B and D premiums two years later through the income-related adjustment. This page shows the amounts; the comparison with your own brackets is yours or your tax preparer's to make.</p>
<h2>What counts toward the first RMD</h2>
<p>Any distribution taken during the first distribution year counts toward that year's RMD, even if taken before your birthday. Publication 590-B adds that money taken in the year you reach your RMD age is credited toward the amount due by April 1. Distributions taken between January 1 and April 1 of the next year count first toward the delayed RMD, then toward the current year's. A conversion to a Roth IRA in that window is possible only after the delayed RMD has been fully taken, because RMDs cannot be converted.</p>
<h2>A short calendar for someone born in 1953</h2>
<ul>
<li><strong>January 2026</strong>: the December 31, 2025 statement fixes the balance for the first RMD; the custodian usually sends the amount by the end of January.</li>
<li><strong>During 2026</strong>: take the 2026 RMD, in one payment or several, or decide to wait.</li>
<li><strong>By April 1, 2027</strong>: last day for the 2026 RMD if you waited.</li>
<li><strong>By December 31, 2027</strong>: the 2027 RMD, computed on the December 31, 2026 balance with the factor for 74.</li>
<li><strong>April 2028</strong>: the 2027 return reports one or two RMDs, depending on the choice made in 2026.</li>
</ul>
<p>A custodian asked to pay the delayed RMD in the first quarter needs time to process it: a request sent in the last days of March may arrive too late for an April 1 payment.</p>
<h2>Plans with the still-working exception</h2>
<p>If you still work for the employer whose 401(k), 403(b) or governmental 457(b) holds your money and you are not a 5 % owner, that plan may let the first RMD wait until April 1 of the year after you retire. The two-RMD issue then appears in the year after retirement instead. IRAs never get this delay, so a person born in 1953 who keeps working still has an IRA deadline of April 1, 2027 (${h.a('rmd-age', 'RMD age rules')}).</p>
${h.mini('rmdage', { t: 'Your required beginning date', p: ['by'], d: { by: 1956 } })}
<h2>If the owner dies before April 1</h2>
<p>An owner who dies after reaching the RMD age but before the required beginning date has not reached it, and the beneficiaries are treated as inheriting from an owner who died before RMDs started. No distribution is required for that year because of the death. For the rules that follow, see the ${h.a('inherited-ira-rmd', 'inherited IRA page')}.</p>
<h2>Missing the April 1 date</h2>
<p>If April 1 passes without the first distribution, the shortfall is subject to the excise tax of ${K.pct(K.P.rmd.exciseTax, 0)}, or ${K.pct(K.P.rmd.exciseTaxCorrected, 0)} once corrected within the window, and the RMD for the current year is still due by December 31 (${h.a('missed-rmd-penalty', 'missed RMD penalty')}).</p>
`,
  faqs: [
    { q: 'I turn 73 in 2026. When is my first RMD due?', a: 'You can take it at any time during 2026, or as late as April 1, 2027. If you wait until 2027, the RMD for 2027 is also due by December 31, 2027, so two distributions will be taxed on the same return. The amount for 2026 is your December 31, 2025 balance divided by the Uniform factor for 73.' },
    { q: 'Is it usually better to take the first RMD in the year I turn 73?', a: 'For many retirees with stable income, yes, because it avoids doubling taxable income in the next year. Waiting can help when income falls sharply in the following year, for example because salary stops. The answer depends on your brackets, Social Security and Medicare premiums, which a tax preparer can compare with both scenarios.' },
    { q: 'Does the April 1 deadline apply to every year’s RMD?', a: 'No, only to the first one. Every RMD after it must be taken by December 31 of its own year. The April 1 date is the required beginning date, defined once for each owner, and each plan with a still-working exception can have its own date tied to retirement from that employer.' },
    { q: 'If I take money in February of my RMD year, does it count?', a: 'Yes. Any distribution in the calendar year you reach your RMD age counts toward that year’s RMD, even before your birthday, and Publication 590-B credits it toward the amount that could have waited until April 1. Distributions in earlier years do not count, however large they were.' },
  ],
  tool: 'first',
  toolArg: { by: 1953, bal: 600000 },
  related: ['rmd-age', 'rmd-calculator', 'missed-rmd-penalty', 'qualified-charitable-distribution'],
  sources: ['pub590b', 'ecfr_rmd_age', 'rmd_faq'],
});
