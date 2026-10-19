import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const J = L.rothPhase.joint, S = L.rothPhase.single, M = L.rothPhase.mfs;
const PR = K.P.previous;
const full = L.ira + L.iraCatchUp;
const width = J[1] - J[0];
const lost1k = L.ira * 1000 / width;
// Worked cases: a couple aged 44 and 52 with a joint MAGI of $247,000; the same couple at $250,500;
// a married person filing separately with $6,000 of MAGI after living together; the same person after living apart.
const younger = K.rothReduced('joint', 247000, 44, 247000);
const older = K.rothReduced('joint', 247000, 52, 247000);
const top = K.rothReduced('joint', 250500, 44, 250500);
const mfsTrap = K.rothReduced('mfs', 6000, 40, 6000);
const apart = K.rothReduced('mfsApart', 120000, 40, 120000);
const grid = [242000, 244000, 246000, 248000, 250000, 251900].map((m) => [K.usd(m), K.usd(K.rothReduced('joint', m, 40, m).reduced), K.usd(K.rothReduced('joint', m, 55, m).reduced), K.usd(K.rothReduced('joint', m, 40, m).reduced * 2)]);

export default defineGuide({
  id: 'roth-ira-married-filing-jointly',
  group: 'ira',
  order: 25,
  slug: 'roth-ira-married-filing-jointly',
  nav: 'Roth IRA, married filing jointly',
  card: 'The joint band, each spouse’s own limit and the separate-return trap',
  title: 'Roth IRA Income Limits Married Filing Jointly 2026',
  description: `Roth IRA income limits married filing jointly 2026: full amount below ${K.usd(J[0])} of joint MAGI, nothing from ${K.usd(J[1])}. Each spouse keeps a separate limit in it.`,
  h1: 'Roth IRA income limits for married couples filing jointly in 2026',
  intro: `A married couple is tested on one household income but contributes to two separate Roth IRAs. The calculator takes your joint modified AGI and shows what each spouse may still deposit.`,
  resume: `On a 2026 joint return, each spouse can put the full Roth IRA amount, ${K.usd(L.ira)} or ${K.usd(full)} from age 50, as long as the couple's modified AGI stays under ${K.usd(J[0])}. Between ${K.usd(J[0])} and ${K.usd(J[1])} the amount shrinks, and at ${K.usd(J[1])} it is gone (Notice 2025-67). The band is only ${K.usd(width)} wide, so every ${K.usd(1000)} of extra income removes about ${K.usd(lost1k)} from each spouse under 50, which is ${K.usd(lost1k * 2)} for the couple. The test uses one MAGI, but the limits stay personal: a couple aged 44 and 52 with ${K.usd(247000)} of joint MAGI can deposit ${K.usd(younger.reduced)} and ${K.usd(older.reduced)}, so ${K.usd(younger.reduced + older.reduced)} in all. Filing separately after living together uses a ${K.usd(M[0])} to ${K.usd(M[1])} band instead, which blocks almost everyone; spouses who lived apart all year are tested like single filers.`,
  body: (h) => `
<h2>The joint band in 2026</h2>
<p>The range applies to married couples filing jointly and to a qualifying surviving spouse. It moved up from ${K.usd(PR.rothPhase.joint[0])} to ${K.usd(PR.rothPhase.joint[1])} in 2025. A household that earned the same in both years therefore has a little more room in 2026, and one that got a raise of more than ${K.usd(J[0] - PR.rothPhase.joint[0])} may have lost some.</p>
${h.table(['Joint MAGI', 'Each spouse under 50', 'Each spouse 50 or over', 'Couple, both under 50'], grid, `Computed with the Publication 590-A method on the ${K.usd(J[0])} to ${K.usd(J[1])} band (Notice 2025-67, read ${K.day(K.P.retrieved_at)}).`, ['r', 'r', 'r', 'r'])}
<p>The last line is the floor at work: at ${K.usd(251900)} the formula gives almost nothing, and each spouse may still deposit ${K.usd(K.rothReduced('joint', 251900, 40, 251900).reduced)}. One dollar past ${K.usd(J[1])} and both are at zero. The method itself is explained step by step on the ${h.a('roth-ira-income-limits', 'Roth IRA income limits page')}; this page deals with what changes for a couple.</p>
<h2>One income test, two separate limits</h2>
<p>There is no such thing as a joint Roth IRA. Each account belongs to one spouse, and each spouse has an individual limit that depends on his or her own age on December 31, 2026. What the couple shares is the income figure: the MAGI from the joint Form 1040, which adds both salaries, investment income and any other income of either spouse.</p>
<p>Ages can differ, and so can the reduced amounts. In the case above, the spouse who is 52 starts from ${K.usd(full)} and keeps ${K.usd(older.reduced)}, while the 44-year-old starts from ${K.usd(L.ira)} and keeps ${K.usd(younger.reduced)}. Each figure is computed separately; the older spouse cannot hand unused room to the other, and neither can put the couple's total into a single account.</p>
${h.mini('roth', { t: 'What each spouse keeps at your joint income', p: ['magi', 'by'], d: { f: 'joint', magi: 247000, by: 1974 } })}
<p>Compensation is pooled on a joint return. A spouse who earns little or nothing can still fund a Roth IRA on the other's pay, as long as the two contributions together do not exceed the couple's combined taxable compensation. That rule, and how it combines with the age 50 catch-up, is on the ${h.a('spousal-ira', 'spousal IRA page')}.</p>
<h2>Why the joint band is so steep</h2>
<p>For a single filer the band is ${K.usd(S[1] - S[0])} wide; for a couple it is ${K.usd(width)}, although it has to cover two people's income. A single person loses about ${K.usd(L.ira * 1000 / (S[1] - S[0]))} of Roth room per ${K.usd(1000)} of income; a married spouse loses ${K.usd(lost1k)}, and the couple ${K.usd(lost1k * 2)}. Near the top of the range a year-end bonus of ${K.usd(5000)} can wipe out half the household's Roth contribution, and the couple at ${K.usd(250500)} is already down to ${K.usd(top.reduced)} each.</p>
<p>Two income earners can also cross the band in a way a single earner never would. Two salaries of ${K.usd(125000)} each make ${K.usd(250000)} of joint MAGI, deep in the reduction, while each spouse alone would sit far below the single range. Married couples sometimes ask whether they should file separately to escape that; the next section shows why that usually makes things worse.</p>
<h2>Married filing separately: the ${K.usd(M[0])} to ${K.usd(M[1])} trap</h2>
<p>If you are married, file a separate return and lived with your spouse at any time during 2026, your Roth phase-out runs from ${K.usd(M[0])} to ${K.usd(M[1])}. Any separate filer with ordinary pay is above it. A spouse with only ${K.usd(6000)} of MAGI keeps ${K.usd(mfsTrap.reduced)}, and from ${K.usd(M[1])} the direct contribution is closed. This range is not indexed and has not moved in years, which is why it catches people who changed filing status for an unrelated reason, such as income-driven student loan payments.</p>
<p>The exception is in Publication 590-A: a married person filing separately who did not live with the spouse at any time during the year is treated as single for this test (${h.src('pub590a', 'Publication 590-A, chapter 2')}). With ${K.usd(120000)} of MAGI that person has the full ${K.usd(apart.reduced)}. "At any time" is strict: one night under the same roof in January is enough to fall back into the narrow range.</p>
${h.table(['Situation in 2026', 'Phase-out range used', 'Roth room at the MAGI shown'], [
  ['Joint return, MAGI ' + K.usd(247000), `${K.usd(J[0])} to ${K.usd(J[1])}`, K.usd(younger.reduced)],
  ['Separate return, lived together, MAGI ' + K.usd(6000), `${K.usd(M[0])} to ${K.usd(M[1])}`, K.usd(mfsTrap.reduced)],
  ['Separate return, apart all year, MAGI ' + K.usd(120000), `${K.usd(S[0])} to ${K.usd(S[1])}`, K.usd(apart.reduced)],
], 'Spouse under 50 in every line.', ['l', 'r', 'r'])}
<h2>Planning moves for a couple near the band</h2>
<p>Because both incomes feed one MAGI, either spouse's pre-tax savings lower it. Pre-tax deferrals into a 401(k) or 403(b), HSA contributions through payroll and a deductible traditional IRA (if the deduction is allowed) all reduce the joint figure. Contributing early in the year is fine, but a couple whose income is uncertain may prefer to wait for the final pay stubs of December, since an excess has to be removed or recharacterized before the return is due. When both spouses are clearly above ${K.usd(J[1])}, a nondeductible traditional contribution followed by a conversion remains possible, and the ${h.a('traditional-ira-deduction-limits', 'traditional IRA deduction calculator')} shows how much of a traditional contribution each spouse could deduct.</p>
<p>The joint range for 2027 is ${K.announced('2027') ? 'published' : 'not announced yet'}; the ${h.a('ira-limits-2027', '2027 IRA page')} adds it the day the IRS releases its notice. This page is general information; a tax professional can look at your full return.</p>
`,
  faqs: [
    { q: 'Can my spouse and I each contribute the full Roth amount on a joint return?', a: `Yes, if your joint modified AGI is below ${K.usd(J[0])} in 2026. Each spouse then has a separate limit of ${K.usd(L.ira)}, or ${K.usd(full)} at 50 or over, so a couple can deposit up to twice that amount in two separate Roth IRAs, as long as their combined pay covers both contributions.` },
    { q: 'How much Roth room does a married couple lose for each $1,000 of income in the band?', a: `About ${K.usd(lost1k)} per spouse under 50, because the joint range is only ${K.usd(width)} wide. For a couple where both are under 50 that is ${K.usd(lost1k * 2)} of combined Roth room for every ${K.usd(1000)} of joint MAGI above ${K.usd(J[0])}. Spouses aged 50 or more lose slightly more, since their starting limit is higher.` },
    { q: 'Does filing separately help a married couple qualify for a Roth IRA?', a: `Almost never. A married person who files separately and lived with the spouse at any time in 2026 faces a range of ${K.usd(M[0])} to ${K.usd(M[1])}, so ordinary pay closes the Roth entirely. Only spouses who lived apart for the whole year are tested against the single filer range of ${K.usd(S[0])} to ${K.usd(S[1])}.` },
    { q: 'If one spouse is 50 and the other is 45, do they get the same reduced amount?', a: `No. The share of the band crossed is the same for both, but it is applied to each spouse's own limit. At ${K.usd(247000)} of joint MAGI the spouse aged 50 or over keeps ${K.usd(older.reduced)} and the younger one keeps ${K.usd(younger.reduced)}. Neither can move unused room to the other.` },
  ],
  tool: 'roth',
  toolArg: { f: 'joint', magi: 247000, by: 1982 },
  related: ['roth-ira-income-limits', 'spousal-ira', 'traditional-ira-deduction-limits', 'ira-contribution-limits', 'ira-limits-2027'],
  sources: ['notice_2025_67', 'pub590a', 'ir_2025_111'],
});
