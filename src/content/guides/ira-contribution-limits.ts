import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const H = K.P.history;
const PR = K.P.previous;
const full = L.ira + L.iraCatchUp;
// Worked cases: a 51-year-old (born 1975) earning $60,000; a student, 22, with $4,800 of summer pay;
// a 74-year-old still consulting with $30,000 of fees; a $9,000 deposit at 45 (excess).
const a = K.iraLimit(51, 60000);
const student = K.iraLimit(22, 4800);
const late = K.iraLimit(74, 30000);
const excessBase = 9000 - K.iraLimit(45, 80000).limit;
const excessTax = excessBase * 0.06;
const idx = H.years.map((y, i) => [String(y), K.usd(H.ira[i]), K.usd(H.iraCatchUp[i]), K.usd(H.ira[i] + H.iraCatchUp[i])]);

export default defineGuide({
  id: 'ira-contribution-limits',
  group: 'ira',
  order: 10,
  slug: 'ira-contribution-limits',
  nav: 'IRA contribution limits',
  card: 'One cap for traditional and Roth IRAs, checked against your pay',
  title: 'IRA Contribution Limits 2026: The Cap, Catch-Up and Deadline',
  description: `IRA contribution limits 2026: ${K.usd(L.ira)}, or ${K.usd(full)} at 50 and over, shared by traditional and Roth IRAs and never above your taxable pay. Deadline April 15, 2027.`,
  h1: 'IRA contribution limits 2026: how much you can put in',
  intro: `One yearly cap covers every IRA you own, traditional and Roth together. The calculator checks it against your age on December 31 and against the pay that actually counts as compensation.`,
  resume: `For 2026 you can contribute up to ${K.usd(L.ira)} to your IRAs, up from ${K.usd(PR.ira)} in 2025, and ${K.usd(full)} if you are 50 or older by December 31, 2026, because the catch-up rose to ${K.usd(L.iraCatchUp)} (Notice 2025-67). That figure is one ceiling for all your traditional and Roth IRAs combined, not a ceiling per account. It is also capped by taxable compensation: wages, tips, commissions and net self-employment earnings count, while interest, dividends, rent, pensions and Social Security do not. Someone born in 1975 earning ${K.usd(60000)} can put in ${K.usd(a.limit)}; a student with ${K.usd(4800)} of summer pay is limited to ${K.usd(student.limit)}. Contributions for 2026 are accepted until April 15, 2027, there is no upper age for a traditional IRA since 2020, and an excess left in the account costs 6 % a year.`,
  body: (h) => `
<h2>The 2026 IRA limit and how it moved</h2>
<p>The base amount is indexed to inflation in steps of $500, and 2026 is the first step since 2024. The catch-up was a flat ${K.usd(PR.iraCatchUp)} written into the code for two decades; SECURE 2.0 indexed it in steps of $100, which is why it shows ${K.usd(L.iraCatchUp)} this year for the first time.</p>
${h.table(['Year', 'Under 50', 'Catch-up at 50', 'Total at 50 and over'], idx, `IRS COLA table, read on ${K.day(K.P.retrieved_at)}. Same cap for traditional and Roth IRAs.`, ['l', 'r', 'r', 'r'])}
<p>Some pages that still rank for this query print the 2024 or 2025 figures under a "2026" heading. If you set up an automatic monthly transfer last year, check it: spreading ${K.usd(L.ira)} over twelve months means ${K.usd(L.ira / 12)} a month, and ${K.usd(full / 12)} a month at 50 or over.</p>
<h2>One limit for all your IRAs</h2>
<p>The cap is personal and global. Two traditional IRAs and a Roth IRA at three different firms still share a single ${K.usd(L.ira)}, and the custodians do not talk to each other: tracking the total is your job. You can split it any way you like, for instance ${K.usd(3000)} to a Roth and ${K.usd(L.ira - 3000)} to a traditional account. Rollovers, direct transfers between custodians and conversions are not contributions and do not use any of it. The Roth side has an income test of its own that can lower your share (see ${h.a('roth-ira-income-limits', 'the Roth phase-out calculator')}); the traditional side never has one, though the deduction may be limited if a workplace plan covers you (${h.a('traditional-ira-deduction-limits', 'deduction limits')}).</p>
<p>Workplace plans are separate. A SEP IRA receives employer contributions under its own rules, and a SIMPLE IRA has its own deferral limit; neither uses up the ${K.usd(L.ira)} you may add to a regular IRA. The comparison with a 401(k) is on ${h.a('ira-vs-401k', 'IRA vs 401(k)')}.</p>
<h2>What counts as compensation</h2>
<p>The second ceiling is your taxable compensation for the year: you cannot put in more than you earned from work. Publication 590-A lists what qualifies (${h.src('pub590a', 'Publication 590-A, chapter 1')}).</p>
${h.table(['Counts as compensation', 'Does not count'], [
  ['Wages, salaries, tips, bonuses, commissions', 'Interest and dividends'],
  ['Net earnings from self-employment, after the deduction for half the SE tax and plan contributions', 'Rental income and other passive income'],
  ['Taxable alimony under a divorce or separation agreement signed before 2019', 'Pensions, annuities and Social Security benefits'],
  ['Nontaxable combat pay', 'Deferred compensation and amounts excluded from income'],
  ['Certain difficulty-of-care payments to home caregivers', 'Capital gains and IRA distributions'],
], 'Publication 590-A, What Is Compensation.', ['l', 'l'])}
<p>The student from the summary shows how it bites: ${K.usd(4800)} of wages allows ${K.usd(student.limit)}, even if a parent gives the money. A self-employed person with a loss has no compensation from that business, and a loss does not reduce wages earned elsewhere. On a joint return, a spouse with little or no pay can use the other spouse's earnings, which is the ${h.a('spousal-ira', 'spousal IRA')} rule.</p>
${h.mini('ira', { t: 'Your IRA limit with low or part-time pay', p: ['comp'], d: { by: 2004, comp: 4800 } })}
<h2>The catch-up and the age test</h2>
<p>The extra ${K.usd(L.iraCatchUp)} is open to anyone who is 50 or older on December 31, 2026, so to everyone born in 1976 or earlier, even if the birthday falls in late December. Unlike workplace plans, IRAs have no larger catch-up between 60 and 63: the IRA catch-up stays at ${K.usd(L.iraCatchUp)} whatever your age above 50.</p>
<p>There is no upper age any more. Before 2020 you could not contribute to a traditional IRA in the year you reached 70½; the SECURE Act removed that rule, so a consultant aged 74 with ${K.usd(30000)} of fees can still put ${K.usd(late.limit)} in a traditional or Roth IRA, while taking required distributions from the same traditional IRA if they are due.</p>
${h.mini('ira', { t: 'Do you get the catch-up this year?', p: ['by'], d: { by: 1976, comp: 75000 } })}
<h2>The deadline: April 15, 2027</h2>
<p>A contribution for 2026 can be made at any time from January 1, 2026 until the due date of your 2026 return, April 15, 2027. Unlike the filing itself, that date does not move with an extension. A deposit made between January and April 2027 has to be designated as a prior-year contribution with the custodian, otherwise it is booked to 2027. You can claim a traditional IRA deduction on a return filed before the money goes in, provided it arrives by the deadline.</p>
<h2>Putting in too much</h2>
<p>An amount above your limit is an excess contribution, and section 4973 charges 6 % of it for each year it stays in the account, reported on Form 5329. Take a 45-year-old who deposits ${K.usd(9000)} for 2026: the excess is ${K.usd(excessBase)}, and leaving it in costs ${K.usd(excessTax)} for 2026 and again every following year. Withdrawing it, with the earnings it produced, by the due date of the return (extensions included) avoids the tax; the earnings are taxable. You can also absorb the excess by contributing less the next year, but the 6 % still applies for each year it was in place.</p>
<p>The most common causes are a Roth contribution made before a raise pushed income past the phase-out, two accounts funded without adding them up, and a contribution larger than a small paycheck. The yearly cap for 2027 is ${K.announced('2027') ? K.usd(K.L27.ira as number) : 'not announced yet'}; the ${h.a('ira-limits-2027', '2027 IRA page')} is updated the day the IRS publishes it.</p>
`,
  faqs: [
    { q: 'Can I contribute to an IRA if my only income is interest and dividends?', a: `No. The IRA limit is the smaller of ${K.usd(L.ira)} (${K.usd(full)} at 50 or over) and your taxable compensation, and investment income is not compensation. Rent, pensions, annuities and Social Security are excluded too. On a joint return, though, a spouse with wages can support your contribution through the spousal IRA rule.` },
    { q: 'Is the 2026 IRA limit per account or per person?', a: `Per person. All your traditional and Roth IRAs share one ${K.usd(L.ira)} cap, or ${K.usd(full)} if you are 50 or older by December 31, 2026. Opening a second or third IRA gives no extra room. Each spouse has a separate cap, because an IRA is always held in one name.` },
    { q: 'Can I still contribute to a traditional IRA after 73?', a: `Yes, as long as you have compensation. The age limit of 70½ was removed for tax years from 2020 on. You can make a new contribution and take a required minimum distribution from the same account in the same year; the distribution cannot be rolled back in, and a qualified charitable distribution may be reduced by deductible contributions made after 70½.` },
    { q: 'Do rollovers and Roth conversions count toward the IRA limit?', a: `No. Moving money from a 401(k) to an IRA, transferring between custodians or converting a traditional IRA to a Roth IRA does not use any of the ${K.usd(L.ira)}. Only new money you deposit for the year counts. Indirect 60-day rollovers between IRAs are limited to one in any 12 months, a separate rule from the contribution cap.` },
    { q: 'Can I make a 2026 IRA contribution in March 2027?', a: 'Yes, up to April 15, 2027, the regular due date of the 2026 return. Tell the custodian the deposit is for 2026, or it will be reported as a 2027 contribution on Form 5498. A filing extension does not push this date back, so a contribution in May 2027 can only count for 2027.' },
  ],
  tool: 'ira',
  toolArg: { by: 1975, comp: 60000 },
  related: ['roth-ira-income-limits', 'traditional-ira-deduction-limits', 'spousal-ira', 'ira-vs-401k', 'ira-limits-2027'],
  sources: ['notice_2025_67', 'irs_cola', 'pub590a'],
});
