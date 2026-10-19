import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const L27 = K.L27;
const md = L.hdhpMinDeductible, oop = L.hdhpMaxOutOfPocket;
// Worked cases: self-only all year at 51; family all year at 58; self-only from July 1 at 40, with and without the
// last-month rule; employer puts in $1,000; a 65-year-old whose Medicare starts June 1; a couple aged 57 and 52.
const self51 = K.hsa('self', 51);
const fam58 = K.hsa('family', 58);
const july = K.hsa('self', 40, 6);
const julyLm = K.hsa('self', 40, 6, 0, true);
const er = K.hsa('self', 45, 12, 1000);
const medicare = K.hsa('self', 65, 5);
const couple = K.hsaCouple(57, 52, 0.5);

export default defineGuide({
  id: 'hsa-contribution-limits',
  group: 'health',
  order: 10,
  slug: 'hsa-contribution-limits',
  nav: 'HSA contribution limits',
  card: 'Self-only and family limits, month by month, with employer money',
  title: 'HSA Contribution Limits 2026: Self-Only, Family and Age 55',
  description: `HSA contribution limits 2026: ${K.usd(L.hsaSelf)} self-only, ${K.usd(L.hsaFamily)} family, ${K.usd(L.hsaCatchUp)} more from age 55. Prorated by month, employer money included. Check your own limit.`,
  h1: 'HSA contribution limits 2026: your limit, month by month',
  intro: `The HSA limit depends on the kind of coverage you have, on how many months you were eligible and on what your employer already put in. The calculator applies the monthly rule of Publication 969, with the last-month rule as an option.`,
  resume: `For 2026 you can put up to ${K.usd(L.hsaSelf)} in a health savings account with self-only coverage under a high deductible health plan, or ${K.usd(L.hsaFamily)} with family coverage (Rev. Proc. 2025-19), plus ${K.usd(L.hsaCatchUp)} if you are 55 or older by the end of the year. The plan has to qualify: a deductible of at least ${K.usd(md.self)} self-only or ${K.usd(md.family)} family, and out-of-pocket costs capped at ${K.usd(oop.self)} and ${K.usd(oop.family)}. The limit counts every dollar, yours and your employer's, and is earned month by month: someone covered from July 1 has ${K.usd(july.total)}, unless the last-month rule gives the full ${K.usd(julyLm.total)} in exchange for staying eligible through 2027. A family plan all year at 58 allows ${K.usd(fam58.total)}; if the employer adds ${K.usd(1000)} to a self-only account, you can add ${K.usd(er.you)}. Contributions stop once Medicare starts.`,
  body: (h) => `
<h2>The 2026 HSA and HDHP figures</h2>
${h.table(['Item', 'Self-only coverage', 'Family coverage'], [
  ['HSA contribution limit', K.usd(L.hsaSelf), K.usd(L.hsaFamily)],
  ['Catch-up, 55 or older', K.usd(L.hsaCatchUp), `${K.usd(L.hsaCatchUp)} per eligible spouse`],
  ['HDHP minimum annual deductible', K.usd(md.self), K.usd(md.family)],
  ['HDHP maximum out-of-pocket', K.usd(oop.self), K.usd(oop.family)],
], `Rev. Proc. 2025-19, read on ${K.day(K.P.retrieved_at)}. The catch-up is set by the code and does not change with inflation.`, ['l', 'r', 'r'])}
<p>The out-of-pocket ceiling covers deductibles, copays and coinsurance but not premiums. A plan with a lower deductible, or with a higher out-of-pocket maximum, is not an HDHP, even if the insurer calls it a "health savings plan". Preventive care can be covered before the deductible without breaking the rules. The 2027 amounts are already published: ${K.usd(L27.hsaSelf)} and ${K.usd(L27.hsaFamily)} (${h.a('hsa-limits-2027', 'HSA limits 2027')}).</p>
<h2>Who can contribute</h2>
<p>Eligibility is tested on the first day of each month (${h.src('pub969', 'Publication 969')}). You need to be covered by a qualifying HDHP on that day and to have no other health coverage that pays before the deductible: a general-purpose health FSA of your own or of your spouse, a spouse's low-deductible plan that covers you, or Medicare. Dental, vision, accident and long-term care coverage are allowed, and so is a limited purpose FSA. You also cannot be claimed as a dependent on someone else's return.</p>
<h2>The monthly rule</h2>
<p>Each month you are eligible on the 1st gives you one twelfth of the yearly limit for the coverage you had that month. Someone who starts an HDHP on July 1 at 40 has six eligible months and ${K.usd(july.total)} of room. The catch-up is prorated the same way. If you switch from self-only to family coverage during the year, add the months of each: the engine computes one type at a time, so run it once per period and add the results.</p>
${h.mini('hsa', { t: 'Your limit if you joined the plan during the year', p: ['m', 'lm'], d: { cov: 'self', m: 6, by: 1986 } })}
<h2>The last-month rule and its testing period</h2>
<p>If you are eligible on December 1, 2026, you may treat yourself as eligible for the whole year and contribute the full amount: ${K.usd(julyLm.total)} instead of ${K.usd(july.total)} for the July case. The price is the testing period: you must stay eligible from December 1, 2026 through December 31, 2027. If you drop the HDHP, take a job with a regular health plan or enroll in Medicare before then, the extra amount you put in thanks to the rule is added to your income for the year you lose eligibility, plus an additional tax of 10 %. Death or disability ends the testing period without that cost.</p>
<h2>Employer money counts</h2>
<p>Unlike a 401(k), an HSA has one limit for everybody's money. Employer contributions, including pre-tax amounts you elect through a cafeteria plan, use the same ${K.usd(L.hsaSelf)} or ${K.usd(L.hsaFamily)}. If your employer deposits ${K.usd(1000)} into a self-only account, you have ${K.usd(er.you)} left. Payroll contributions also avoid FICA tax, which a deposit you deduct on your return does not; the limit is the same either way.</p>
${h.mini('hsa', { t: 'What is left after your employer’s deposit', p: ['er'], d: { cov: 'family', er: 1500, by: 1980 } })}
<h2>Age 55 and Medicare</h2>
<p>The ${K.usd(L.hsaCatchUp)} catch-up applies from the year you turn 55, so for 2026 to anyone born in 1971 or earlier, and it is not reduced for a person who turns 55 in December. It ends with Medicare. From the first month you are enrolled in Medicare, Part A included, you cannot contribute at all, even though the money already in the HSA stays yours and can pay medical costs. A 65-year-old whose Medicare starts on June 1, 2026 has five eligible months and a limit of ${K.usd(medicare.total)}. Watch the retroactive start: Part A taken after 65 can be backdated up to six months, which can turn earlier contributions into excess contributions.</p>
<h2>Married couples with family coverage</h2>
<p>If either spouse has family HDHP coverage, both are treated as having family coverage, and they share a single family limit of ${K.usd(L.hsaFamily)}. They can split it as they agree, half each by default. HSAs are individual accounts, so each spouse who is 55 or older puts his or her own catch-up into his or her own HSA. A couple aged 57 and 52 splitting evenly can contribute ${K.usd(couple.a)} and ${K.usd(couple.b)}, ${K.usd(couple.total)} in all. If only one spouse is eligible, only that spouse has an HSA limit.</p>
<h2>Deadline and excess contributions</h2>
<p>Contributions for 2026 can be made until April 15, 2027. Anything above your limit is an excess contribution, taxed at 6 % for each year it stays in the account unless you withdraw it, with its earnings, by the due date of the return. Employer excesses are your problem too: check box 12, code W, of your W-2. Some pages still show last year's lower figures under a 2026 heading; the amounts on this page are the ones set by Rev. Proc. 2025-19.</p>
`,
  faqs: [
    { q: 'How much can I put in an HSA if my HDHP started in the middle of 2026?', a: `One twelfth of the limit for each month you were covered on the first day: with self-only coverage from July 1, ${K.usd(july.total)}. If you are still covered on December 1 you may use the last-month rule and contribute the full ${K.usd(L.hsaSelf)}, provided you stay eligible through December 31, 2027.` },
    { q: 'Do my employer’s HSA contributions reduce my own limit?', a: `Yes. Everything that goes into your HSA for the year counts toward one limit: your own deposits, payroll contributions through a cafeteria plan and the employer’s money. With an employer deposit of ${K.usd(1000)} into a self-only account, you can add ${K.usd(er.you)} yourself in 2026. Your W-2, box 12, code W, shows the employer and payroll total.` },
    { q: 'Can I contribute to an HSA after I sign up for Medicare?', a: 'No. Your contribution limit is zero for each month you are enrolled in any part of Medicare, and Part A can start up to six months before the month you apply if you are over 65. You keep the account and can use it for medical expenses, including Medicare premiums other than Medigap.' },
    { q: 'How do spouses split the family HSA limit?', a: `Both spouses are treated as having family coverage and share one limit of ${K.usd(L.hsaFamily)}. They divide it as they agree, or equally if they do not. Each spouse aged 55 or more adds ${K.usd(L.hsaCatchUp)} to his or her own account; the two catch-ups cannot go into one HSA.` },
  ],
  tool: 'hsa',
  toolArg: { cov: 'self', by: 1975 },
  related: ['hsa-limits-2027', 'fsa-contribution-limits', 'dependent-care-fsa-limit', 'ira-vs-401k'],
  sources: ['rp_2025_19', 'pub969', 'rp_2026_24'],
});
