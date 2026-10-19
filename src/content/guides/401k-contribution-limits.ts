import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
const at50 = L.deferral + L.catchUp50;
const at60 = L.deferral + L.catchUp6063;
// Worked cases: born 1975 with $110,000 of pay; a part-time worker born 1992 earning $18,000; someone born 1964.
const a = K.deferral('401k', 1975, 110000);
const low = K.deferral('401k', 1992, 18000);
const s = K.deferral('401k', 1964, 130000);
// Two jobs in the same year: $15,000 deferred at the first employer.
const firstJob = 15000;
const rows = [
  ['Under 50 on December 31', K.usd(PR.deferral), K.usd(L.deferral), K.usd(L.deferral - PR.deferral)],
  ['50 to 59, or 64 and over', K.usd(PR.deferral + PR.catchUp50), K.usd(at50), K.usd(at50 - PR.deferral - PR.catchUp50)],
  ['60, 61, 62 or 63', K.usd(PR.deferral + PR.catchUp6063), K.usd(at60), K.usd(at60 - PR.deferral - PR.catchUp6063)],
];

export default defineGuide({
  id: '401k-contribution-limits',
  group: 'plans',
  order: 10,
  slug: '401k-contribution-limits',
  nav: '401(k) contribution limits',
  card: 'Your own deferral limit for 2026, by birth year and pay',
  title: `401(k) Contribution Limits 2026: ${K.usd(L.deferral)} and Catch-Ups`,
  description: `401(k) contribution limits 2026: ${K.usd(L.deferral)} under 50, ${K.usd(at50)} from 50, ${K.usd(at60)} at 60 to 63. Enter your birth year and pay to see your personal deferral cap.`,
  h1: '401(k) contribution limits 2026: your own deferral limit',
  intro: `The IRS raised the employee limit for 2026 and kept the age 60 to 63 catch-up where it was. Enter the year you were born and your pay: the calculator applies the December 31 age test and the pay cap.`,
  resume: `For 2026 you can defer up to ${K.usd(L.deferral)} of your pay into a 401(k), a 403(b), a governmental 457(b) or the Thrift Savings Plan, against ${K.usd(PR.deferral)} in 2025 (Notice 2025-67). If you are 50 or older on December 31, 2026, you may add a catch-up of ${K.usd(L.catchUp50)}, for ${K.usd(at50)} in all; in the calendar years you turn 60, 61, 62 or 63 the catch-up is ${K.usd(L.catchUp6063)} instead, for ${K.usd(at60)}. The limit belongs to you, not to the plan: two employers in the same year share one ${K.usd(L.deferral)}. It also cannot exceed your pay. A worker born in 1975 with ${K.usd(110000)} of salary turns ${a.age} in 2026 and can defer ${K.usd(a.total)}; a part-time worker born in 1992 earning ${K.usd(18000)} is held to ${K.usd(low.total)}, the whole of that pay. Employer money is counted elsewhere and does not use up this limit.`,
  body: (h) => `
<h2>2025 against 2026, by age</h2>
${h.table(['Your age at the end of the year', '2025 limit', '2026 limit', 'Change'], rows, `Employee deferrals with catch-up, Notice 2025-67 (read on ${K.day(K.P.retrieved_at)}). Same figures for 403(b), governmental 457(b) and TSP.`, ['l', 'r', 'r', 'r'])}
<p>The base amount rose by ${K.usd(L.deferral - PR.deferral)}, the standard catch-up by ${K.usd(L.catchUp50 - PR.catchUp50)}. The age 60 to 63 amount did not move, because the law ties it to 150 % of the 2024 standard catch-up (${K.usd(K.P.history.catchUp50[1])}), and after indexing and rounding it stayed at ${K.usd(L.catchUp6063)}. That is why the gain is ${K.usd(at50 - PR.deferral - PR.catchUp50)} at 55 but only ${K.usd(at60 - PR.deferral - PR.catchUp6063)} at 61. The full set of 2026 amounts is in ${h.src('ir_2025_111', 'IRS news release IR-2025-111')}.</p>
<h2>The December 31 age test</h2>
<p>Section 414(v) looks at the age you reach by the end of the calendar year, not at your age on the day you contribute. Someone born on December 30, 1976 turns 50 on the next to last day of 2026 and may start the ${K.usd(L.catchUp50)} catch-up from the first paycheck in January. Plans usually let you set the extra percentage at any time during the year, so a person who learns this in October can still raise the deferral rate for the last few pay dates.</p>
<p>The same test sets the upper tier. Born in 1964, you reach ${s.age} on December 31, 2026, and your limit is ${K.usd(s.total)} for the whole year. A worker who turns 64 in 2026 falls back to the standard ${K.usd(L.catchUp50)}; the ${h.a('super-catch-up-60-63', 'age 60 to 63 page')} lists the birth years and the four calendar years for each.</p>
${h.mini('k401', { t: 'Your 2026 limit for a birth year', p: ['by'], d: { pay: 110000, plan: '401k' } })}
<h2>Your pay sets a ceiling too</h2>
<p>A deferral is a share of compensation, so it can never be larger than what the employer pays you during the year. For most full-time workers this never matters. It does for students, part-timers, people who retire early in the year and spouses working a few months. The worker earning ${K.usd(18000)} could in theory defer every dollar of it, though payroll still has to withhold Social Security and Medicare tax, and most plans cap the deferral rate at a percentage such as 75 % or 90 %. In practice the plan's own maximum rate is often the limit you hit first.</p>
<h2>One limit per person across every employer</h2>
<p>The ${K.usd(L.deferral)} is set by section 402(g) and is personal. If you defer ${K.usd(firstJob)} at a job you leave in June, your next 401(k) can take only ${K.usd(L.deferral - firstJob)} more for 2026 (plus your catch-up, which is also shared). The new employer has no record of what you put in before: telling payroll is your job. The ${h.a('max-401k-contribution', 'page on maxing out')} shows how to spread what is left over the remaining paychecks and what to do if the two plans together went over.</p>
<p>A 403(b) shares the same limit with a 401(k). A governmental 457(b) does not: it has its own ${K.usd(L.gov457)}, so a teacher with both plans can defer twice (see ${h.a('457b-contribution-limits', '457(b) limits')}). The TSP is treated as a 401(k) for this purpose, which means a federal employee with a side job that offers a 401(k) has one limit for both.</p>
<h2>What the limit does not include</h2>
<p>Employer matching and profit sharing are outside the ${K.usd(L.deferral)}. They count, with your own deferrals, toward a larger ceiling of ${K.usd(L.total415c)} or 100 % of pay, explained on the ${h.a('employer-401k-contribution-limit', 'employer contribution page')}. After-tax contributions, where a plan allows them, also sit under that larger ceiling and not under the employee limit. Your IRA limit of ${K.usd(L.ira)} is separate from both.</p>
${h.mini('k401', { t: 'Check the cap on a small salary', p: ['pay'], d: { by: 1992, plan: '401k' } })}
<h2>Catch-up for high earners: the Roth condition</h2>
<p>From 2026 a catch-up made by someone whose 2025 Social Security wages from the employer exceeded ${K.usd(L.rothCatchUpWageThreshold)} must go in as Roth. The amount you may contribute does not change, only its tax treatment: the base ${K.usd(L.deferral)} can still be pre-tax. The calculator's folded field for 2025 FICA wages applies this test. The ${h.a('roth-catch-up-rule', 'Roth catch-up page')} covers the details, including what happens in a plan with no Roth option (${h.src('ir_2025_91', 'final regulations, IR-2025-91')}).</p>
<h2>Only paychecks dated in 2026 count</h2>
<p>An IRA lets you contribute for 2026 until the April 2027 filing deadline. A 401(k) does not work that way. Elective deferrals are taken from pay, so the year they count for is the year the paycheck is paid: a bonus for 2026 work that arrives on January 8, 2027 is a 2027 deferral, under the 2027 limit. If you are short of the limit in December, the last regular pay date of the year is the real deadline, and payroll often needs the new election a week or two before it. Year end bonuses are a common place to catch up, provided the plan's definition of compensation includes them; some plans exclude bonuses from deferrals entirely, which you can check in the summary plan description.</p>
<h2>Beware of last year's table</h2>
<p>A number of pages that come up for this query still print ${K.usd(PR.deferral)} as the current limit, or show the 2023 figure of ${K.usd(K.P.history.deferral[0])} in a "2026" headline. A payroll setup built on those amounts leaves ${K.usd(L.deferral - PR.deferral)} or more unused for the year. The official list is the IRS cost of living page (${h.src('irs_cola', 'COLA increases')}), and the ${h.a('401k-limits-by-year', 'year by year table')} on this site is copied from it.</p>
`,
  faqs: [
    { q: 'Is the 2026 401(k) limit the same for the TSP and a 403(b)?', a: `Yes. The ${K.usd(L.deferral)} limit of section 402(g) covers elective deferrals to a 401(k), a 403(b), a SARSEP and the Thrift Savings Plan, and they all share it. The catch-up amounts are the same in each. Only a governmental 457(b) has a separate limit of its own, also ${K.usd(L.gov457)}, which can be used in addition.` },
    { q: 'I turn 50 in December 2026: can I use the catch-up in January?', a: `Yes. The test is the age you reach by December 31 of the year, so a person born in any month of 1976 is treated as 50 for all of 2026 and may contribute up to ${K.usd(at50)} from the first paycheck. The plan does not have to wait for your birthday, and most let you change the rate at any time.` },
    { q: 'Does a part-time job with a small salary still get the full limit?', a: `No. A deferral cannot be more than your compensation from that employer for the year, and the plan may also cap the percentage you can elect. With ${K.usd(18000)} of wages the most you could defer is ${K.usd(low.total)}, and less in practice once payroll taxes are withheld and the plan's maximum rate is applied.` },
    { q: 'Do I get a new 401(k) limit when I change jobs?', a: `No. The limit is per person and per calendar year, not per plan. Deferrals at every employer you work for in 2026 add up against the same ${K.usd(L.deferral)} plus your catch-up. A new employer does not know what you contributed before, so you have to track the total and lower your rate when you approach it.` },
  ],
  tool: 'k401',
  toolArg: { by: 1975, pay: 110000, plan: '401k' },
  related: ['max-401k-contribution', 'catch-up-contributions', 'super-catch-up-60-63', 'roth-catch-up-rule', '401k-limits-by-year'],
  sources: ['notice_2025_67', 'ir_2025_111', 'irs_cola', 'ir_2025_91'],
});
