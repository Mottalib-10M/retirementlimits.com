import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
// Case 1: $90,000 salary, paid every two weeks, born 1980, from the first paycheck of the year.
const lim1 = K.deferral('401k', 1980, 90000).total;
const full = K.perPaycheck(lim1, 0, 26, 90000, 26);
// Case 2: same person who wakes up in July with 13 paychecks left and $6,000 already in.
const july = K.perPaycheck(lim1, 6000, 13, 90000, 26);
// Case 3: job change. $14,000 deferred at the first employer, then $120,000 a year, paid twice a month, 12 pay dates left.
const lim3 = K.deferral('401k', 1971, 120000).total;
const sw = K.perPaycheck(lim3, 14000, 12, 120000, 24);
// Case 4: front-loading. $200,000 salary, 26 paychecks, 20 % deferral rate, match 100 % up to 4 % of each paycheck.
const pay4 = 200000, per4 = pay4 / 26;
let left4 = L.deferral, checks4 = 0, matchGot = 0;
for (let k = 0; k < 26 && left4 > 0; k++) { const d = Math.min(left4, per4 * 0.2); left4 -= d; checks4++; matchGot += Math.min(d, per4 * 0.04); }
const matchFull = K.match(pay4, L.deferral, 1, 0.04);
// Case 5: an over-contribution after two jobs.
const over = 26000 - L.deferral;

export default defineGuide({
  id: 'max-401k-contribution',
  group: 'plans',
  order: 15,
  slug: 'max-401k-contribution',
  nav: 'Max out a 401(k)',
  card: 'The amount and percentage per paycheck that reach the 2026 limit',
  title: 'Max 401(k) Contribution 2026: Per Paycheck and Percent',
  description: `Max 401(k) contribution 2026: reach ${K.usd(L.deferral)} (more from 50) from any pay date. Get the amount and percent per paycheck, fix a job change overage by April 15.`,
  h1: 'Max 401(k) contribution 2026: what to set on each paycheck',
  intro: `Maxing out is a division: what is left of your limit over the paychecks left in the year. The calculator does it from any pay date, with what you have already put in.`,
  resume: `To max out a 401(k) in 2026 you need to defer ${K.usd(L.deferral)} by your last paycheck of the year, or ${K.usd(L.deferral + L.catchUp50)} if you are 50 or older on December 31 (${K.usd(L.deferral + L.catchUp6063)} in the years you turn 60 to 63). Start from what is left, divide by the paychecks remaining, then turn that into the percentage payroll asks for. On a ${K.usd(90000)} salary paid every two weeks from January, that is ${K.usd(full.each)} a paycheck, or ${K.pct(full.pct, 1)} of a ${K.usd(full.payEach)} check. Starting in July with ${K.usd(6000)} already in and 13 pay dates left, it becomes ${K.usd(july.each)}, ${K.pct(july.pct, 1)}. After a job change the limit is shared, so the new plan only gets the rest, and any excess over the limit has to be taken out by April 15, 2027 to avoid being taxed twice.`,
  body: (h) => `
<h2>The method in three numbers</h2>
<p>Every maxing out plan uses the same three inputs: your limit for the year, what you have already deferred, and the number of paychecks still to come. The limit comes from your age at the end of 2026 (see ${h.a('401k-contribution-limits', 'the 2026 limits by age')}). What you have deferred appears on your latest pay stub as a year to date figure. The paychecks left are easy to miscount, so check the payroll calendar: a biweekly schedule has 26 pay dates in most years, but the first paycheck of January can pay for December work and still count for 2026, because deferrals follow the date the money is paid.</p>
${h.table(['Situation', 'Left to defer', 'Paychecks left', 'Per paycheck', 'Percent of pay'], [
  ['From January, salary ' + K.usd(90000) + ', every two weeks', K.usd(full.left), '26', K.usd(full.each), K.pct(full.pct, 1)],
  ['From July, ' + K.usd(6000) + ' already in', K.usd(july.left), '13', K.usd(july.each), K.pct(july.pct, 1)],
  ['New job, ' + K.usd(14000) + ' deferred at the old one, age ' + (2026 - 1971), K.usd(sw.left), '12', K.usd(sw.each), K.pct(sw.pct, 1)],
], 'Worked with the per paycheck formula of the calculator above. Percent of gross pay before taxes.', ['l', 'r', 'r', 'r', 'r'])}
<p>Payroll systems usually take whole percentages. Round up and the deferrals stop on their own once the limit is reached, because the plan must cut you off at the annual limit; round down and you finish a little short. The ${K.pct(full.pct, 1)} of the first case becomes ${Math.ceil(full.pct * 100)} %, which reaches the limit on the last pay date or one before it. Check your plan's maximum rate: some cap the election at 50 % or 75 % of each paycheck, which matters in the July case.</p>
${h.mini('paycheck', { t: 'Starting late in the year: what is left per paycheck?', p: ['left', 'done'], d: { pay: 90000, freq: '26', by: 1980 } })}
<h2>Changing jobs in the middle of 2026</h2>
<p>The annual limit applies to you, not to each plan, so the deferrals at your old job count against the new plan's room. A person born in 1971 turns ${2026 - 1971} this year and has ${K.usd(lim3)} in all. With ${K.usd(14000)} already deferred before leaving, only ${K.usd(sw.left)} remains for the new employer. Paid twice a month at ${K.usd(120000)} a year with 12 pay dates left, that is ${K.usd(sw.each)} per paycheck, ${K.pct(sw.pct, 1)} of each. The new plan has no idea what you did before and will happily accept a full rate, so the arithmetic is on your side of the desk.</p>
<p>The most frequent mistake is to set the new plan at the same percentage as the old one. A person who reaches ${K.usd(26000)} across both jobs has gone ${K.usd(over)} over. That amount is an excess deferral. You tell one of the plans by the date that plan requires, and it pays back the excess with its earnings by April 15, 2027 (${h.src('pub525', 'Publication 525, excess deferrals')}). The excess is taxed as 2026 wages either way; the earnings are taxed in the year they are paid out. Miss April 15 and the excess stays in the plan, already taxed once, and is taxed again when it eventually comes out, with no basis to show for it. A Roth excess is just as awkward. Each employer applies the limit only inside its own plan, so nobody else will catch this for you.</p>
${h.box('Two jobs at the same time', `<p>Holding two jobs that each offer a 401(k) works the same way: one ${K.usd(L.deferral)} limit across both, plus one catch-up. Split it in any proportion. A governmental 457(b) is the only plan with a separate limit of its own (${h.a('457b-contribution-limits', '457(b) limits')}).</p>`)}
<h2>Front-loading and the employer match true-up</h2>
<p>Some people set a high rate early to reach the limit by summer. The risk is the match. Many plans compute the match on each paycheck: if you stop deferring in August, the match stops with you. Take a ${K.usd(pay4)} salary, 26 paychecks and a match of 100 % up to 4 % of each check. At a 20 % rate you reach ${K.usd(L.deferral)} after ${checks4} paychecks and collect ${K.usd(matchGot)} of match, against ${K.usd(matchFull)} if the same deferrals had been spread over the whole year. The difference, ${K.usd(matchFull - matchGot)}, is lost unless the plan has a true-up: a contribution after year end that tops the match up to what the annual formula would have given. Whether your plan has one is written in the summary plan description; payroll or HR can confirm it in one email. If there is no true-up, spread the deferrals so the last one falls on the last pay date. The ${h.a('employer-401k-contribution-limit', 'employer contribution page')} explains how match formulas are computed.</p>
${h.mini('paycheck', { t: 'Your own salary and pay schedule', p: ['pay', 'freq'], d: { left: 26, done: 0, by: 1980 } })}
<h2>Catch-up and Roth while maxing out</h2>
<p>If you turn 50 or more in 2026, your target includes the catch-up, and the extra deferral simply continues past the base limit in the same payroll election in most plans. When your 2025 wages from that employer were above ${K.usd(L.rothCatchUpWageThreshold)}, the part above ${K.usd(L.deferral)} must go in as Roth, which lowers your take home pay more than a pre-tax deferral would. Payroll systems handle this by switching the source automatically once you pass the base limit; the ${h.a('roth-catch-up-rule', 'Roth catch-up page')} shows the effect. Bonuses deserve a check too: if the plan applies your percentage to bonuses, a large one in March can carry you to the limit early, with the same match question as front-loading.</p>
<h2>A short checklist for the rest of 2026</h2>
<p>Read the year to date deferral on your last pay stub, count the pay dates left on the payroll calendar, run the calculator, round the rate up, then look at the stub again after the next two paychecks to be sure the change took. If you changed jobs, add the old employer's figure from its final stub, or from box 12 of the W-2 next January with code D for a 401(k) or E for a 403(b). The IRS sets the annual amounts in ${h.src('notice_2025_67', 'Notice 2025-67')}.</p>
`,
  faqs: [
    { q: 'Should I round my 401(k) percentage up or down to max out?', a: `Up, in most plans. Once your deferrals reach the annual limit the plan has to stop them, so a slightly high rate only makes you finish a paycheck or two early. Rounding down leaves you short. The exception is a plan whose match is computed per paycheck without a year end true-up, where finishing early costs match.` },
    { q: 'I went over the 401(k) limit after changing jobs: what do I do?', a: `Ask one of the plans to return the excess deferral with its earnings, telling it by the date the plan sets for such requests; the plan must pay it by April 15, 2027. The excess counts as 2026 wages. If it is not paid out by April 15, it is taxed in 2026 and taxed again when it leaves the plan later.` },
    { q: 'Does reaching the limit early in the year cost me the match?', a: `It can. If the match is calculated paycheck by paycheck, it stops when your deferrals stop. Some plans make a true-up contribution after the year ends to give you the full annual match anyway. Without a true-up, set a rate that spreads the limit over every paycheck of the year.` },
    { q: 'Do 401(k) deferrals from a January 2027 paycheck count for 2026?', a: `No. Elective deferrals belong to the year the pay is received. A paycheck dated January 2, 2027 counts toward the 2027 limit, even if it pays for December 2026 work. To finish maxing out for 2026 you need the deferral on a paycheck dated by December 31, 2026, so set the election early.` },
  ],
  tool: 'paycheck',
  toolArg: { pay: 90000, freq: '26', left: 26, done: 0, by: 1980 },
  related: ['401k-contribution-limits', 'employer-401k-contribution-limit', 'catch-up-contributions', 'roth-catch-up-rule'],
  sources: ['notice_2025_67', 'ir_2025_111', 'pub525'],
});
