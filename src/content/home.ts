/** Home page text. Every figure comes from the kit (src/lib/kit.ts). */
import type { FAQ, Helpers } from '../lib/page-types';
import { KIT as K } from '../lib/kit';

const L = K.L;
const PR = K.P.previous;
const H27 = K.P.limits['2027'];
// Worked case of the home page: born 1970 (56 at the end of 2026), single, $120,000 of pay, MAGI $160,000.
const d = K.deferral('401k', 1970, 120000, 120000);
const roth = K.rothReduced('single', 160000, 56, 120000);
const d64 = K.deferral('401k', 1964, 200000, 200000);
const r = K.ownerRmd(500000, 75, null, false, 1951);

export const HOME = {
  title: 'Contribution Limits 2026: 401(k), IRA, Roth, HSA and RMD',
  description: `2026 contribution limits applied to you: ${K.usd(L.deferral)} 401(k) with catch-up by birth year, Roth IRA after the phase-out, HSA, and the RMD from the IRS life tables.`,
  h1: '2026 contribution limits, worked out for your age and income',
  intro: 'The IRS publishes one headline number per account. Type your birth year, pay and income: the calculator gives the limit that actually applies to you, account by account.',
  resume: `For 2026 the IRS set the 401(k), 403(b) and governmental 457(b) deferral limit at ${K.usd(L.deferral)}, the IRA limit at ${K.usd(L.ira)} and the HSA limit at ${K.usd(L.hsaSelf)} for self-only coverage and ${K.usd(L.hsaFamily)} for a family (Notice 2025-67 and Rev. Proc. 2025-19). Those are starting points. Your own limit moves with three facts. Your age on December 31: from 50 a catch-up of ${K.usd(L.catchUp50)} is added to a 401(k), and in the year you turn 60, 61, 62 or 63 it becomes ${K.usd(L.catchUp6063)}. Your income: a Roth IRA contribution shrinks inside a ${K.usd(L.rothPhase.single[0])} to ${K.usd(L.rothPhase.single[1])} band of modified AGI for a single filer and disappears above it. Your wages last year: above ${K.usd(L.rothCatchUpWageThreshold)} of 2025 FICA wages from the same employer, the catch-up has to go in as Roth. Someone born in 1970 with ${K.usd(120000)} of pay and ${K.usd(160000)} of MAGI can defer ${K.usd(d.total)} and put ${K.usd(roth.reduced)} in a Roth IRA, not the full ${K.usd(L.ira + L.iraCatchUp)}.`,
  ledgerCaption: `2026 amounts from Notice 2025-67, Rev. Proc. 2025-19, Rev. Proc. 2025-32 and Publication 15-B; 2025 amounts as printed in Notice 2025-67; 2027 HSA amounts from Rev. Proc. 2026-24. Read on irs.gov, ${K.day(K.P.retrieved_at)}.`,
  ledger: () => [
    ['401(k), 403(b), 457(b) deferral', K.usd(PR.deferral), K.usd(L.deferral), 'mid-November'],
    ['Catch-up, age 50 and over', K.usd(PR.catchUp50), K.usd(L.catchUp50), 'mid-November'],
    ['Catch-up, the years you turn 60 to 63', K.usd(PR.catchUp6063), K.usd(L.catchUp6063), 'mid-November'],
    ['Total additions, all sources (415(c))', K.usd(PR.total415c), K.usd(L.total415c), 'mid-November'],
    ['IRA, traditional and Roth together', K.usd(PR.ira), K.usd(L.ira), 'mid-November'],
    ['IRA catch-up, age 50 and over', K.usd(PR.iraCatchUp), K.usd(L.iraCatchUp), 'mid-November'],
    ['Roth IRA phase-out, single', `${K.usd(PR.rothPhase.single[0])} to ${K.usd(PR.rothPhase.single[1])}`, `${K.usd(L.rothPhase.single[0])} to ${K.usd(L.rothPhase.single[1])}`, 'mid-November'],
    ['Roth IRA phase-out, joint', `${K.usd(PR.rothPhase.joint[0])} to ${K.usd(PR.rothPhase.joint[1])}`, `${K.usd(L.rothPhase.joint[0])} to ${K.usd(L.rothPhase.joint[1])}`, 'mid-November'],
    ['SIMPLE IRA deferral', K.usd(PR.simple), K.usd(L.simple), 'mid-November'],
    ['HSA, self-only coverage', K.usd(PR.hsaSelf), K.usd(L.hsaSelf), K.usd(H27.hsaSelf)],
    ['HSA, family coverage', K.usd(PR.hsaFamily), K.usd(L.hsaFamily), K.usd(H27.hsaFamily)],
    ['Health FSA salary reduction', K.usd(PR.healthFsa), K.usd(L.healthFsa), 'autumn'],
    ['Dependent care FSA', K.usd(PR.dependentCareFsa), K.usd(L.dependentCareFsa), K.usd(H27.dependentCareFsa)],
  ],
  why: (h: Helpers) => `
<h2>Why the headline limit is rarely your limit</h2>
<p>Most pages that rank for these numbers copy the IRS news release and stop. That is fine if you are 40, earn a salary well under the Roth range and have one 401(k). Everyone else has to apply a rule the headline does not show, and the rules are where people over-contribute, lose a deduction or pay a penalty they did not see coming.</p>
<p><strong>The age test is the calendar year, not your birthday.</strong> You can make catch-up contributions for all of 2026 if you are 50 or older on December 31, 2026, even in January. The age 60 to 63 catch-up works the same way: it covers the four calendar years in which you turn 60, 61, 62 and 63, then drops back to ${K.usd(L.catchUp50)} the year you turn 64. Someone born in 1963 gets ${K.usd(L.catchUp6063)} in 2026; someone born in 1962, who turns 64, gets ${K.usd(L.catchUp50)} (${h.a('super-catch-up-60-63', 'which years are yours')}).</p>
<p><strong>The Roth IRA limit is a slope, not a cliff.</strong> Inside the phase-out band, Publication 590-A Worksheet 2-2 reduces the ${K.usd(L.ira)} in proportion to how far your income has entered the band, rounds the result up to the next $10 and never leaves less than $200 (${h.src('pub590a', 'Publication 590-A')}). Bank and broker pages say the contribution is "reduced" and send you to irs.gov; the ${h.a('roth-ira-income-limits', 'Roth IRA calculator')} does the worksheet.</p>
<p><strong>High earners lose the pre-tax catch-up.</strong> Starting in 2026, if your 2025 FICA wages from the employer that sponsors the plan were above ${K.usd(L.rothCatchUpWageThreshold)}, any catch-up you make there must be designated Roth (${h.src('notice_2025_67', 'Notice 2025-67')}, ${h.src('ir_2025_91', 'final regulations')}). Someone born in 1964 earning ${K.usd(200000)} can defer ${K.usd(d64.total)} in 2026, of which ${K.usd(d64.catchUp)} goes in after tax (${h.a('roth-catch-up-rule', 'Roth catch-up check')}).</p>
<p><strong>Distributions have their own clock.</strong> Required minimum distributions start at 73 for people born from 1951 to 1959 and at 75 for those born in 1960 or later. At 75 the Uniform Lifetime Table divides the prior year-end balance by ${K.dec(r.factor)}: ${K.usd(500000)} means ${K.usd(r.rmd)} to take out (${h.a('rmd-calculator', 'RMD calculator')}). The penalty for a shortfall is ${K.pct(K.P.rmd.exciseTax, 0)} of the amount missed, ${K.pct(K.P.rmd.exciseTaxCorrected, 0)} if you fix it in time, not the 50 % some older pages still print.</p>
`,
  next: (h: Helpers) => `<p>The IRS published the 2026 plan limits on November 13, 2025. The 2027 notice is expected around the same time in 2026: the ${h.a('401k-limits-2027', '2027 401(k) page')} and the ${h.a('ira-limits-2027', '2027 IRA page')} are ready and will carry the official figures the day they are released, with no projection shown in the meantime. The 2027 HSA limits are already final: ${K.usd(H27.hsaSelf)} and ${K.usd(H27.hsaFamily)} (${h.src('rp_2026_24', 'Rev. Proc. 2026-24')}).</p>`,
  sections: (h: Helpers) => [
    { title: 'Two plans at work: one limit or two?', html: `<p>The ${K.usd(L.deferral)} deferral limit follows the person, not the plan: a 401(k) at one job and a 403(b) at another share it. The exception is a governmental 457(b), which has its own ${K.usd(L.gov457)} limit, so a teacher or a city employee with both a 403(b) and a 457(b) can defer twice (${h.a('457b-contribution-limits', '403(b) plus 457(b)')}). The total additions limit of ${K.usd(L.total415c)}, on the other hand, applies plan by plan for unrelated employers, which matters to someone with a side business and a ${h.a('solo-401k-contribution-limits', 'solo 401(k)')}.</p>` },
    { title: 'IRA money and 401(k) money do not compete', html: `<p>Deferring the maximum to a 401(k) does not reduce what you can put in an IRA. What a workplace plan changes is the deduction for a traditional IRA: covered by a plan, a single filer loses it gradually between ${K.usd(L.deductPhase.singleCovered[0])} and ${K.usd(L.deductPhase.singleCovered[1])} of modified AGI in 2026 (${h.a('traditional-ira-deduction-limits', 'deduction calculator')}). Above that, the contribution is still allowed; it is simply not deductible.</p>` },
    { title: 'HSA limits are monthly', html: `<p>An HSA limit is earned month by month: each month you are covered by a high deductible health plan on the first day counts for one twelfth of ${K.usd(L.hsaSelf)} or ${K.usd(L.hsaFamily)}, and employer contributions count toward the same cap. From the year you turn 55 you add ${K.usd(L.hsaCatchUp)}, which is not indexed. Medicare enrollment stops new contributions from the month it starts (${h.a('hsa-contribution-limits', 'HSA calculator')}).</p>` },
    { title: 'Deadlines that differ by account', html: `<p>Payroll deferrals to a 401(k), 403(b), 457(b) or SIMPLE IRA must come out of pay received by December 31. IRA and HSA contributions for 2026 can be made until the filing deadline in April 2027. A first RMD can wait until April 1 of the year after you reach the applicable age, at the price of two distributions on one return (${h.a('first-rmd-deadline', 'first RMD timing')}).</p>` },
  ],
  faqs: [
    { q: 'What is the maximum I can put in a 401(k) for 2026 if I am 56?', a: `${K.usd(L.deferral + L.catchUp50)}: the ${K.usd(L.deferral)} limit plus the ${K.usd(L.catchUp50)} catch-up, since you are over 50 on December 31, 2026. If your 2025 FICA wages from that employer were above ${K.usd(L.rothCatchUpWageThreshold)}, the ${K.usd(L.catchUp50)} has to be Roth. Employer contributions are on top, within ${K.usd(L.total415c)} in all.` },
    { q: 'Can I max out a 401(k) and a Roth IRA in the same year?', a: `Yes. The ${K.usd(L.deferral)} 401(k) limit and the ${K.usd(L.ira)} IRA limit are separate. The Roth IRA has an income test of its own: in 2026 the amount falls between ${K.usd(L.rothPhase.single[0])} and ${K.usd(L.rothPhase.single[1])} of modified AGI for a single filer and between ${K.usd(L.rothPhase.joint[0])} and ${K.usd(L.rothPhase.joint[1])} on a joint return.` },
    { q: 'Are the 2027 contribution limits out yet?', a: `Only for HSAs: ${K.usd(H27.hsaSelf)} self-only and ${K.usd(H27.hsaFamily)} family, set by Rev. Proc. 2026-24. The 401(k), IRA, Roth phase-out and catch-up amounts for 2027 come in an IRS notice expected in mid-November 2026. This site adds them that day; until then it shows no estimate as if it were official.` },
    { q: 'Do employer matching contributions count toward the 401(k) limit?', a: `Not toward the ${K.usd(L.deferral)} employee limit. They count toward the total additions limit of section 415(c), ${K.usd(L.total415c)} in 2026 or 100 % of pay if lower, together with your own deferrals (catch-up apart), profit sharing and any after-tax money you add.` },
    { q: 'Which table do I use for my RMD?', a: `The Uniform Lifetime Table, unless your spouse is the sole beneficiary of the account for the whole year and is more than 10 years younger than you. In that case the Joint and Last Survivor Table applies and gives a smaller distribution. Both tables are in Publication 590-B and in 26 CFR 1.401(a)(9)-9.` },
    { q: 'Is the HSA catch-up $1,000 or does it change with inflation?', a: `It is ${K.usd(L.hsaCatchUp)} and is not indexed: the same amount applies in 2026 and in 2027. You can add it from the year you turn 55 until you enroll in Medicare. If both spouses are 55 or over, each adds it to his or her own HSA; a couple cannot put both catch-ups in one account.` },
  ] as FAQ[],
  sources: ['notice_2025_67', 'ir_2025_111', 'rp_2025_19', 'rp_2026_24', 'rp_2025_32', 'pub590a', 'pub590b', 'ir_2025_91', 'ecfr_tables'],
};
