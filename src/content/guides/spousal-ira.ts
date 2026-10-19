import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const J = L.rothPhase.joint;
const D = L.deductPhase;
const full = L.ira + L.iraCatchUp;
// Worked cases: one earner at $80,000, spouses aged 54 and 48; one earner at $12,000, both under 50;
// a couple aged 58 and 61 with $95,000 and $3,000; the first couple at $246,000 of joint MAGI.
const c1 = K.spousal(54, 48, 80000, 0);
const c2 = K.spousal(44, 42, 12000, 0);
const c3 = K.spousal(58, 61, 95000, 3000);
const r54 = K.rothReduced('joint', 246000, 54, 246000);
const r48 = K.rothReduced('joint', 246000, 48, 246000);
const dNon = K.deductible('joint', 'spouse', 246000, 48, 246000);
const dWork = K.deductible('joint', 'you', 140000, 54, 140000);
const dNon140 = K.deductible('joint', 'spouse', 140000, 48, 140000);

export default defineGuide({
  id: 'spousal-ira',
  group: 'ira',
  order: 35,
  slug: 'spousal-ira',
  nav: 'Spousal IRA',
  card: 'Two IRAs on one paycheck: the joint compensation test',
  title: 'Spousal IRA Contribution Limit 2026: Two IRAs on One Income',
  description: `Spousal IRA contribution limit 2026: a spouse with no pay can put ${K.usd(L.ira)} (${K.usd(full)} at 50) in an IRA on a joint return, if the couple's pay covers both of them.`,
  h1: 'Spousal IRA contribution limit 2026: an IRA for the spouse without pay',
  intro: `A spouse who stays home or earns very little can still have a full IRA, funded on the working spouse's compensation. The calculator splits the couple's pay between the two accounts the way Publication 590-A does.`,
  resume: `For 2026 a married couple filing jointly can contribute up to ${K.usd(L.ira)} to an IRA for each spouse, or ${K.usd(full)} for a spouse who is 50 or older by December 31, even if one of them has no earnings at all. The only condition on income is that the two contributions together do not exceed the couple's combined taxable compensation. A household with one salary of ${K.usd(80000)}, spouses aged 54 and 48, can therefore put ${K.usd(c1.a)} and ${K.usd(c1.b)} in two IRAs, ${K.usd(c1.total)} in all. With only ${K.usd(12000)} of pay the second IRA is capped at ${K.usd(c2.b)}. Each account belongs to one spouse, can be traditional or Roth, and follows the usual rules: for a Roth, the joint phase-out from ${K.usd(J[0])} to ${K.usd(J[1])} of household MAGI; for a deduction, the ${K.usd(D.spouseCovered[0])} to ${K.usd(D.spouseCovered[1])} range when only the working spouse has a plan.`,
  body: (h) => `
<h2>There is no "spousal IRA" account</h2>
<p>The name describes a rule, not a product. The non-earning spouse opens an ordinary traditional or Roth IRA in his or her own name, and the custodian handles it like any other. What makes it spousal is only the source of the compensation that supports the contribution: section 219(c) lets a spouse filing jointly count the other spouse's taxable compensation as if it were his or her own, after subtracting what the other spouse contributes to his or her own IRAs (${h.src('pub590a', 'Publication 590-A, Kay Bailey Hutchison Spousal IRA limit')}).</p>
<p>The money in the account belongs to the spouse whose name is on it, including after a divorce, unless a court orders a transfer. Beneficiary designations and investment choices are that spouse's too.</p>
<h2>The conditions</h2>
<ul>
<li><strong>A joint return.</strong> Married filing separately does not allow the transfer of compensation; each spouse is limited to his or her own pay.</li>
<li><strong>Enough combined pay.</strong> The two IRA contributions together cannot exceed the taxable compensation shown on the joint return: wages, self-employment earnings and the other items listed on the ${h.a('ira-contribution-limits', 'IRA contribution limits page')}.</li>
<li><strong>Each spouse's own limit.</strong> ${K.usd(L.ira)} per person, or ${K.usd(full)} for a spouse who is 50 or older on December 31, 2026. Each limit counts traditional and Roth IRAs together.</li>
</ul>
<p>There is no age limit for either spouse and no condition about which spouse is older. A couple can also use the rule in a year when the lower earner has a small part-time income: that spouse's own pay is simply added to what is left of the other's.</p>
<h2>How the compensation test splits the pay</h2>
<p>Publication 590-A computes the second spouse's limit from the couple's total compensation minus the first spouse's IRA contributions for the year. In practice it matters only when pay is modest.</p>
${h.table(['Household', 'Joint pay', 'IRA of the earner', 'IRA of the other spouse', 'Total'], [
  ['One earner, spouses 54 and 48', K.usd(80000), K.usd(c1.a), K.usd(c1.b), K.usd(c1.total)],
  ['One earner, both under 50', K.usd(12000), K.usd(c2.a), K.usd(c2.b), K.usd(c2.total)],
  ['Main earner and a small job, spouses 58 and 61', K.usd(98000), K.usd(c3.a), K.usd(c3.b), K.usd(c3.total)],
], 'Computed with the 2026 limits; each spouse must stay within his or her own IRA cap.', ['l', 'r', 'r', 'r', 'r'])}
<p>In the second household, the earner uses ${K.usd(c2.a)} and leaves ${K.usd(12000 - c2.a)} of compensation for the other IRA. The couple could choose a different split, for example ${K.usd(6000)} each, but never more than ${K.usd(12000)} in total. In the third, both spouses are over 50, so each IRA can reach ${K.usd(full)}: the older spouse does not get a larger catch-up, because IRAs have no extra amount between 60 and 63.</p>
${h.mini('spousal', { t: 'Two IRAs on a single modest salary', p: ['pa', 'pb'], d: { pa: 12000, pb: 0, by: 1982, sb: 1984 } })}
<h2>The catch-up belongs to each spouse</h2>
<p>The ${K.usd(L.iraCatchUp)} catch-up is tested on each person's own birthday. If the earner is 48 and the spouse at home is 52, the spouse's IRA can take ${K.usd(full)} and the earner's ${K.usd(L.ira)}. The older spouse cannot pass the catch-up to the younger, and a single IRA cannot receive both spouses' room. Born in 1976 or earlier means 50 or older at the end of 2026.</p>
<h2>A spousal Roth IRA and the income test</h2>
<p>For a Roth IRA, the couple's joint modified AGI decides the amount, and both spouses are reduced in the same proportion. With ${K.usd(246000)} of joint MAGI, the first household from the table would keep ${K.usd(r54.reduced)} for the 54-year-old and ${K.usd(r48.reduced)} for the 48-year-old. The full range is ${K.usd(J[0])} to ${K.usd(J[1])}; the ${h.a('roth-ira-married-filing-jointly', 'married filing jointly page')} has the details for couples near it.</p>
<h2>Deducting a traditional spousal IRA</h2>
<p>The spouse without a job has no workplace plan, but the working spouse may have one. In that case the non-covered spouse deducts the contribution in full up to ${K.usd(D.spouseCovered[0])} of joint MAGI, and the deduction phases out by ${K.usd(D.spouseCovered[1])}. At ${K.usd(246000)} the spouse at home can deduct ${K.usd(dNon.deductible)} of ${K.usd(L.ira)}. The covered earner uses the lower range of ${K.usd(D.jointCovered[0])} to ${K.usd(D.jointCovered[1])}: at ${K.usd(140000)} of joint MAGI the earner, aged 54, deducts only ${K.usd(dWork.deductible)}, while the spouse at home still deducts ${K.usd(dNon140.deductible)}. If neither spouse has a plan, both contributions are deductible at any income (${h.a('traditional-ira-deduction-limits', 'traditional IRA deduction limits')}).</p>
${h.mini('deduct', { t: 'Deduction for the spouse at home', p: ['magi'], d: { f: 'joint', cov: 'spouse', magi: 140000, by: 1978 } })}
<h2>Practical points</h2>
<p>The deadline is the same as for any IRA: contributions for 2026 can be made until April 15, 2027. The custodian sees only the account holder, so it cannot check whether the joint pay covers both deposits; you show the result on the joint return, where the deductions of both spouses appear on separate lines. If the earner loses a job late in the year, what counts is the compensation actually received in 2026, and contributions above it become excess contributions taxed at 6 % a year until removed. This page gives general information about the rules, not advice on whether a spousal IRA suits your household.</p>
`,
  faqs: [
    { q: 'Can a stay-at-home spouse contribute to a Roth IRA in 2026?', a: `Yes, on a joint return, if the working spouse's compensation covers both contributions and the couple's joint MAGI is below ${K.usd(J[1])}. Below ${K.usd(J[0])} the full ${K.usd(L.ira)} is allowed, or ${K.usd(full)} for a spouse aged 50 or over; inside the range the amount is reduced for both spouses.` },
    { q: 'How much pay does a couple need to fund two full IRAs?', a: `At least ${K.usd(L.ira * 2)} of combined taxable compensation if both spouses are under 50, ${K.usd(L.ira + full)} if one is 50 or older, and ${K.usd(full * 2)} if both are. Below those amounts, the second IRA is limited to the pay left after the first spouse's contribution.` },
    { q: 'Can we use the spousal IRA rule if we file separate returns?', a: 'No. The rule that lets one spouse use the other’s compensation applies only on a joint return. Filing separately, a spouse with no pay has no compensation and cannot contribute to any IRA for the year. A spouse with a small job of his or her own can still contribute, but only up to that pay.' },
    { q: 'Is a spousal IRA contribution deductible if my spouse has a 401(k)?', a: `Yes, fully, as long as your joint MAGI is at or below ${K.usd(D.spouseCovered[0])} in 2026, because you are not covered yourself. The deduction phases out between ${K.usd(D.spouseCovered[0])} and ${K.usd(D.spouseCovered[1])}. Your spouse, who has the 401(k), faces the lower range of ${K.usd(D.jointCovered[0])} to ${K.usd(D.jointCovered[1])}.` },
  ],
  tool: 'spousal',
  toolArg: { pa: 80000, pb: 0, by: 1972, sb: 1978 },
  related: ['ira-contribution-limits', 'roth-ira-married-filing-jointly', 'traditional-ira-deduction-limits', 'ira-vs-401k'],
  sources: ['pub590a', 'notice_2025_67', 'ir_2025_111'],
});
