import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
const cap = L.qcd;
// Worked case: an owner aged 76 with an RMD of $24,000 who gives $10,000 a year to charity.
const q = K.qcd(24000, 10000);
const big = K.qcd(30000, 40000);

export default defineGuide({
  id: 'qualified-charitable-distribution',
  group: 'rmd',
  order: 80,
  slug: 'qualified-charitable-distribution',
  nav: 'Qualified charitable distribution',
  card: `Give up to ${K.usd(cap)} from an IRA, counted toward the RMD, untaxed`,
  title: 'Qualified Charitable Distribution 2026: $111,000 QCD Limit',
  description: `Qualified charitable distribution 2026: from age 70½, send up to ${K.usd(cap)} from an IRA straight to a charity. It counts toward the RMD and is not taxed.`,
  h1: 'Qualified charitable distribution: the 2026 limit and how it meets your RMD',
  intro: 'Enter this year’s RMD and the amount you plan to give from the IRA. The calculator shows how much of the RMD the gift covers and what is left to report as income.',
  resume: `A qualified charitable distribution (QCD) is a payment made directly from a traditional IRA to an eligible charity by an owner or beneficiary aged 70½ or older. Up to ${K.usd(cap)} per person in 2026 is excluded from taxable income, up from ${K.usd(PR.qcd)} in 2025 (Notice 2025-67), and the amount counts toward the year's required minimum distribution. The QCD age is still 70½, so it starts before RMDs do, at 73 or 75. Because the money never enters adjusted gross income, a QCD can be worth more than a deduction: it helps people who take the standard deduction, and it keeps AGI lower for the taxation of Social Security benefits and for Medicare premiums. An owner with an RMD of ${K.usd(24000)} who sends ${K.usd(10000)} to charity through a QCD reports only ${K.usd(q.taxableRmd)} of the RMD as income. QCDs are not allowed from a 401(k).`,
  body: (h) => `
<h2>The rules in one table</h2>
${h.table(['Rule', '2026'], [
  ['Minimum age on the date of the gift', '70½'],
  ['Yearly exclusion per person', K.usd(cap)],
  ['One-time gift to a split-interest entity (charitable remainder trust or gift annuity)', `up to ${K.usd(L.qcdSplit)}, within the yearly limit`],
  ['Accounts', 'traditional IRA, inherited IRA; SEP or SIMPLE IRA only if no employer contribution that year'],
  ['Not allowed from', '401(k), 403(b), 457(b) plans'],
  ['Counts toward the RMD', 'yes, for the year it is made'],
], `Notice 2025-67 (QCD amounts), read on irs.gov on ${K.day(K.P.retrieved_at)}; IRC section 408(d)(8); Publication 590-B.`, ['l', 'l'])}
<p>The yearly exclusion has been indexed since SECURE 2.0: ${K.usd(100000)} a year until 2023, then raised each year to ${K.usd(PR.qcd)} in 2025 and ${K.usd(cap)} for 2026 (${h.src('notice_2025_67', 'Notice 2025-67')}). Each spouse has his or her own limit, from his or her own IRA.</p>
<h2>How a QCD meets the RMD</h2>
<p>The first dollars that leave an IRA in a year count toward the RMD, and a QCD is a distribution like any other for that purpose. If your RMD is ${K.usd(24000)} and the IRA sends ${K.usd(10000)} to a charity, ${K.usd(q.coversRmd)} of the RMD is satisfied and ${K.usd(q.taxableRmd)} remains to take as an ordinary, taxable distribution. A gift larger than the RMD also works: with an RMD of ${K.usd(30000)} and ${K.usd(40000)} given, the whole RMD is covered and nothing of it is taxed, and the extra ${K.usd(big.qcd - 30000)} simply comes out of the IRA tax free as well.</p>
${h.mini('qcd', { t: 'How much of your RMD a gift covers', p: ['rmd', 'gift'], d: {} })}
<h2>QCD or a check from your bank account</h2>
<p>Compare two ways of giving the same ${K.usd(10000)} with an RMD of ${K.usd(24000)}. With a check, the full ${K.usd(24000)} RMD enters adjusted gross income, and the gift reduces taxable income only if you itemize deductions and only within the percentage limits on charitable gifts. Most retirees take the standard deduction, and for them the check brings no tax benefit at all. With a QCD, AGI is ${K.usd(10000)} lower from the start, whether you itemize or not. A lower AGI also feeds into other calculations: the share of Social Security benefits that is taxable, the income-related Medicare premium surcharge two years later, and the floor for deducting medical expenses. The gift to the charity is the same; the difference is only on your return.</p>
<h2>Order matters inside the year</h2>
<p>Because the first distributions of the year count toward the RMD, a QCD made after you have already taken the full RMD does not undo the tax on that RMD. Someone who wants a QCD to cover the RMD should send the gift first, or at least before the RMD is complete. This is also why a first-year owner who delays the first RMD to April 1 has to think about which year a January QCD counts for (${h.a('first-rmd-deadline', 'first RMD timing')}).</p>
<h2>The conditions that make it qualified</h2>
<ul>
<li><strong>Direct payment.</strong> The custodian pays the charity, or issues a check made out to the charity that you pass on. Money paid to you first and then donated is a taxable distribution followed by an ordinary gift.</li>
<li><strong>An eligible charity.</strong> Public charities qualify. Donor-advised funds, supporting organizations and private foundations that are not operating foundations do not.</li>
<li><strong>No benefit in return.</strong> The gift must be fully deductible had it been made in cash: a gala dinner or a ticket in exchange disqualifies the payment.</li>
<li><strong>Written acknowledgment.</strong> Keep the charity's letter, as for any gift of ${K.usd(250)} or more.</li>
<li><strong>Age 70½ on the day of the payment.</strong> Not the year: a gift made a week before the half-birthday is taxable.</li>
</ul>
<h2>Reporting it</h2>
<p>The custodian reports the full distribution on Form 1099-R, usually without marking it as a QCD. On Form 1040 you enter the total on the IRA distributions line, write the taxable part next to it and the letters QCD beside the line. No charitable deduction is taken for the same money: the benefit comes from the exclusion.</p>
<h2>A deductible IRA contribution after 70½</h2>
<p>Since 2020 you can contribute to a traditional IRA at any age if you have earned income. A deductible contribution made after age 70½ reduces the QCD that can be excluded, dollar for dollar, until the total of such contributions is used up. A working retiree who both deducts IRA contributions and makes QCDs should track that adjustment (${h.a('ira-contribution-limits', 'IRA limits')}).</p>
${h.mini('rmd', { t: 'Your RMD before choosing a gift amount', p: ['bal'], d: { by: 1950, sp: 'no', bal: 650000 } })}
<h2>QCD and inherited IRAs</h2>
<p>A beneficiary aged 70½ or older can make QCDs from an inherited IRA, and they count toward that account's RMD under the inherited rules (${h.a('inherited-ira-rmd', 'inherited accounts')}). Age is the beneficiary's own, not the deceased owner's.</p>
`,
  faqs: [
    { q: 'Can I make a QCD at 70½ even though my RMD starts at 73?', a: 'Yes. The QCD age was not raised with the RMD age and is still 70½ on the date of the gift. A QCD made before your RMD age does not satisfy any requirement, since there is none yet, but it still leaves the IRA tax free and lowers the balance that future RMDs will be computed on.' },
    { q: 'Can I make a qualified charitable distribution from my 401(k)?', a: 'No. QCDs are allowed only from IRAs: traditional and inherited IRAs, and SEP or SIMPLE IRAs in a year with no employer contribution. To give from 401(k) money, roll it into an IRA first, keeping in mind that the year’s 401(k) RMD must be taken before the rollover and cannot itself be rolled.' },
    { q: 'Can a QCD go to a donor-advised fund?', a: 'No. Donor-advised funds, supporting organizations and most private foundations are excluded. The gift must go to a public charity or a private operating foundation, and you must not receive anything in return. A separate one-time election allows a gift to a charitable remainder trust or gift annuity, within a lower limit.' },
    { q: 'How do I report a QCD on my 2026 tax return?', a: 'Enter the full IRA distribution on the IRA distributions line of Form 1040, the taxable amount net of the QCD on the next line, and write QCD next to it. Keep the charity’s written acknowledgment. Do not also deduct the gift on Schedule A, since the exclusion already provides the tax benefit.' },
  ],
  tool: 'qcd',
  toolArg: { rmd: 24000, gift: 10000 },
  related: ['rmd-calculator', 'first-rmd-deadline', 'rmd-age', 'inherited-ira-rmd'],
  sources: ['notice_2025_67', 'pub590b', 'rmd_faq'],
});
