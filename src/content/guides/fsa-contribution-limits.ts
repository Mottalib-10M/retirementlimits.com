import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const L27 = K.L27 as Record<string, unknown>;
const next = typeof L27.healthFsa === 'number' ? K.usd(L27.healthFsa) : 'not published yet';
// Worked cases: a full election with $900 left at year end; a $2,000 election with $150 left; a $4,000 request;
// two working spouses with two employers.
const a = K.healthFsa(L.healthFsa, 900);
const b = K.healthFsa(2000, 150);
const over = K.healthFsa(4000, 0);
const perCheck = L.healthFsa / 26;

export default defineGuide({
  id: 'fsa-contribution-limits',
  group: 'health',
  order: 20,
  slug: 'fsa-contribution-limits',
  nav: 'Health FSA limits',
  card: 'The salary reduction cap, the carryover and the grace period',
  title: 'FSA Contribution Limits 2026: Health FSA Cap and Carryover',
  description: `FSA contribution limits 2026: ${K.usd(L.healthFsa)} per employee for a health FSA, with up to ${K.usd(L.healthFsaCarryover)} carried over if the plan allows it. See what you would keep or lose.`,
  h1: 'FSA contribution limits 2026: the health FSA cap and what carries over',
  intro: `A health flexible spending account lets you set aside pay before tax for medical costs, up to a yearly cap per job. The calculator checks your election and shows how much of an unused balance a carryover plan lets you keep.`,
  resume: `For plan years beginning in 2026 you can elect up to ${K.usd(L.healthFsa)} of salary reductions to a health FSA (Rev. Proc. 2025-32, section 3.15). The cap applies per employee and per employer, so two working spouses can each elect ${K.usd(L.healthFsa)} through their own jobs, ${K.usd(L.healthFsa * 2)} for the household. What you do not spend is normally lost, with two possible relief rules, and a plan may offer one of them but not both: a carryover of up to ${K.usd(L.healthFsaCarryover)} into the next plan year, or a grace period of up to two and a half months to spend the balance. With a full ${K.usd(L.healthFsa)} election and ${K.usd(900)} left in December, a carryover plan saves ${K.usd(a.carry)} and ${K.usd(a.lost)} is forfeited. If you have an HSA, only a limited purpose FSA for dental and vision keeps you eligible. The 2027 cap is ${next}.`,
  body: (h) => `
<h2>The 2026 health FSA figures</h2>
${h.table(['Rule', 'Plan years beginning in 2026'], [
  ['Salary reduction limit, per employee and per employer', K.usd(L.healthFsa)],
  ['Maximum carryover to the next plan year, if the plan has one', K.usd(L.healthFsaCarryover)],
  ['Grace period, if the plan has one instead', 'up to 2 months and 15 days after the plan year'],
  ['Per paycheck for the full amount, 26 pay periods', K.usd(perCheck)],
  ['Limit for plan years beginning in 2027', next],
], `Rev. Proc. 2025-32, section 3.15, read on ${K.day(K.P.retrieved_at)}.`, ['l', 'r'])}
<p>The figure is a ceiling, not a default: employers can set a lower cap, and many do. The limit is tied to the plan year, which is not always the calendar year. A plan year starting July 1, 2026 uses the 2026 figure until June 30, 2027. The amount for 2027 plan years usually appears in the IRS inflation adjustments published in the fall; until then this page shows it as ${next}.</p>
<h2>Per employee, per employer</h2>
<p>The cap is set by section 125(i) and applies to what each employee elects under each employer's cafeteria plan (${h.src('pub15b', 'Publication 15-B')}). Two consequences follow. A married couple who both work can each elect ${K.usd(L.healthFsa)} at their own employer, and either FSA can reimburse costs for the whole family. And a person who works for two unrelated employers can, in principle, elect the full amount at each; employers under common control count as one.</p>
<p>Employer money is treated differently from your own. Flex credits that the employer adds and that you cannot take as cash do not count toward the ${K.usd(L.healthFsa)} salary reduction limit, although plan rules often cap them. If you could have taken them as cash instead, they are treated as salary reductions and do count.</p>
${h.mini('fsa', { t: 'Is your election within the cap?', p: ['el'], d: { el: 4000, un: 0 } })}
<p>An election above the cap is not allowed: ask for ${K.usd(4000)} and the plan can only accept ${K.usd(over.allowed)}, leaving ${K.usd(over.over)} that must stay in your taxable pay.</p>
<h2>Carryover or grace period: the plan chooses</h2>
<p>A health FSA is "use it or lose it" by design, but the regulations let an employer soften that in one of two ways, never both in the same plan:</p>
<ul>
<li><strong>Carryover.</strong> Up to ${K.usd(L.healthFsaCarryover)} of unused money moves into the next plan year. It does not count toward the next year's election limit, so you could elect a full ${K.usd(L.healthFsa)} again on top of it. Anything above ${K.usd(L.healthFsaCarryover)} is forfeited.</li>
<li><strong>Grace period.</strong> Up to two months and fifteen days after the plan year, often to March 15, to incur new expenses paid from last year's balance. There is no dollar cap, but whatever is left after the grace period is lost.</li>
</ul>
<p>Two cases show the difference. With ${K.usd(900)} left from a full election, a carryover plan keeps ${K.usd(a.carry)} and forfeits ${K.usd(a.lost)}; a grace period plan keeps all ${K.usd(900)} available until mid-March, if you have expenses to use it. With ${K.usd(150)} left from a ${K.usd(2000)} election, the carryover keeps all ${K.usd(b.carry)}. A run-out period, often 90 days, is a third and separate feature: it only gives time to submit claims for expenses incurred during the plan year.</p>
${h.mini('fsa', { t: 'What a carryover plan lets you keep', p: ['un'], d: { el: L.healthFsa, un: 900 } })}
<h2>The uniform coverage rule</h2>
<p>A health FSA must make your whole annual election available from the first day of coverage, even though you fund it paycheck by paycheck. Someone who elects ${K.usd(L.healthFsa)} and has surgery in February can be reimbursed in full before contributing more than a few hundred dollars. If you leave the job in March, you generally do not owe the difference back. The flip side is that you cannot change the election during the year without a qualifying change in status, such as marriage, a birth or a change in employment.</p>
<h2>Health FSA and HSA together</h2>
<p>A general-purpose health FSA counts as other health coverage, so it makes you ineligible to contribute to an HSA, and the same is true if your spouse's general FSA can reimburse your expenses. The solution is a limited purpose FSA, which covers only dental and vision care (and, in some plans, medical costs after the HDHP deductible is met). It has the same ${K.usd(L.healthFsa)} cap and keeps your HSA eligibility intact, so you can fund both: up to ${K.usd(L.hsaSelf)} in a self-only HSA plus the limited FSA. The HSA rules are on ${h.a('hsa-contribution-limits', 'HSA contribution limits')}.</p>
<h2>What it is not</h2>
<p>The dependent care FSA is a separate account with its own household cap, for child care and adult day care rather than medical costs (${h.a('dependent-care-fsa-limit', 'dependent care FSA limit')}). Money cannot move between the two. Health FSA dollars pay for deductibles, copays, prescriptions, eyeglasses, dental work and, since 2020, over-the-counter medicines and menstrual products without a prescription; they do not pay insurance premiums.</p>
`,
  faqs: [
    { q: 'Can my spouse and I each put the maximum in a health FSA in 2026?', a: `Yes, if each of you has a health FSA through your own employer. The ${K.usd(L.healthFsa)} limit applies per employee and per employer, so a couple can set aside ${K.usd(L.healthFsa * 2)} in all. Either account can usually reimburse expenses of the spouse and dependents, but the same expense can only be paid once.` },
    { q: 'Does the FSA carryover count toward next year’s limit?', a: `No. The up to ${K.usd(L.healthFsaCarryover)} you carry over from a 2026 plan year sits on top of your next election, so you may elect the full new limit as well. The carryover cap applies only to what moves forward; your employer may set a lower carryover than the IRS maximum, or none at all.` },
    { q: 'Can a health FSA have both a carryover and a grace period?', a: 'No. A plan can offer one relief rule or the other, or neither, but not both at once. The plan document, or the summary from your benefits office, says which one applies. A run-out period for filing old claims is a different feature and can exist alongside either rule.' },
    { q: 'Can I have a health FSA and an HSA in the same year?', a: `Only if the FSA is limited purpose, covering dental and vision care. A general-purpose health FSA, yours or your spouse's, is coverage that pays before the deductible and makes you ineligible for HSA contributions for each month it applies. A limited purpose FSA has the same ${K.usd(L.healthFsa)} cap.` },
  ],
  tool: 'fsa',
  toolArg: { el: L.healthFsa, un: 900 },
  related: ['dependent-care-fsa-limit', 'hsa-contribution-limits', 'hsa-limits-2027'],
  sources: ['rp_2025_32', 'pub15b', 'pub969'],
});
