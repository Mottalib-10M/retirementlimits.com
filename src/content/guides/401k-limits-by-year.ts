import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const H = K.P.history;
const Y = H.years;
const n = Y.length - 1;
const first = Y[0], last = Y[n];
const up = (arr: number[]) => arr[n] - arr[0];
const rise = (arr: number[]) => (arr[n] - arr[0]) / arr[0];
const step = (arr: number[], i: number) => (i === 0 ? 'base year' : arr[i] === arr[i - 1] ? 'no change' : `+${K.usd(arr[i] - arr[i - 1])}`);
const at50 = (i: number) => H.deferral[i] + H.catchUp50[i];
const y27 = K.announced('2027') ? K.usd((K.L27 as Record<string, unknown>).deferral as number) : 'not announced yet';
const cu6063 = (y: number) => (y >= 2025 ? K.usd(y === 2026 ? L.catchUp6063 : K.P.previous.catchUp6063) : 'did not exist');

export default defineGuide({
  id: '401k-limits-by-year',
  group: 'next',
  order: 90,
  slug: '401k-limits-by-year',
  nav: '401(k) limits by year',
  card: 'The IRS limits from 2023 to 2026 side by side, with each yearly change',
  title: `401(k) Limits by Year: ${first} to 2026 IRS Table and Changes`,
  description: `401(k) limits by year, ${first} to 2026: deferral from ${K.usd(H.deferral[0])} to ${K.usd(L.deferral)}, catch-up, 415(c), IRA, SIMPLE, HCE and wage base, with each yearly change shown.`,
  h1: '401(k) limits by year: 2023 to 2026',
  intro: `The IRS resets the retirement plan limits every November for the next year. This table keeps four years side by side, read from the IRS cost of living page, so you can check any figure you see quoted.`,
  resume: `The 401(k) employee deferral limit was ${K.usd(H.deferral[0])} in ${first}, ${K.usd(H.deferral[1])} in ${Y[1]}, ${K.usd(H.deferral[2])} in ${Y[2]} and ${K.usd(H.deferral[n])} in ${last}: up ${K.usd(up(H.deferral))}, or ${K.pct(rise(H.deferral), 1)}, over the period. The age 50 catch-up stayed at ${K.usd(H.catchUp50[0])} for three years before moving to ${K.usd(H.catchUp50[n])} in ${last}, and the total additions limit of section 415(c) went from ${K.usd(H.total415c[0])} to ${K.usd(H.total415c[n])}. A saver aged 55 could therefore defer ${K.usd(at50(0))} in ${first} and ${K.usd(at50(n))} in ${last}. The amounts move in fixed steps, $500 for deferrals and catch-ups, which is why some years show no change at all. The IRA limit went from ${K.usd(H.ira[0])} to ${K.usd(H.ira[n])} and its catch-up moved for the first time, to ${K.usd(H.iraCatchUp[n])}, while the compensation cap climbed from ${K.usd(H.compensationCap[0])} to ${K.usd(H.compensationCap[n])}. The 2027 figures are ${y27}; the IRS publishes them ${String(K.L27.expected)}.`,
  body: (h) => `
<h2>The table, ${first} to ${last}</h2>
${h.table(['Limit', ...Y.map(String)], [
  ['401(k), 403(b), 457(b) deferral', ...H.deferral.map(K.usd)],
  ['Catch-up at 50', ...H.catchUp50.map(K.usd)],
  ['Catch-up at 60 to 63', ...Y.map(cu6063)],
  ['Total additions, 415(c)', ...H.total415c.map(K.usd)],
  ['Compensation cap, 401(a)(17)', ...H.compensationCap.map(K.usd)],
  ['IRA', ...H.ira.map(K.usd)],
  ['IRA catch-up at 50', ...H.iraCatchUp.map(K.usd)],
  ['SIMPLE deferral', ...H.simple.map(K.usd)],
  ['Highly compensated employee', ...H.hce.map(K.usd)],
  ['Social Security wage base', ...H.wageBase.map(K.usd)],
], `${H._source} Wage base: Social Security Administration.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>How much each limit moved, year by year</h2>
${h.table(['Limit', ...Y.slice(1).map(String)], [
  ['Deferral', ...Y.slice(1).map((_, i) => step(H.deferral, i + 1))],
  ['Catch-up at 50', ...Y.slice(1).map((_, i) => step(H.catchUp50, i + 1))],
  ['415(c) total', ...Y.slice(1).map((_, i) => step(H.total415c, i + 1))],
  ['IRA', ...Y.slice(1).map((_, i) => step(H.ira, i + 1))],
  ['HCE threshold', ...Y.slice(1).map((_, i) => step(H.hce, i + 1))],
  ['Wage base', ...Y.slice(1).map((_, i) => step(H.wageBase, i + 1))],
], 'Change against the previous year.', ['l', 'r', 'r', 'r'])}
<p>The pattern is uneven. The deferral limit rose by ${K.usd(H.deferral[1] - H.deferral[0])} in ${Y[1]}, only ${K.usd(H.deferral[2] - H.deferral[1])} in ${Y[2]}, then ${K.usd(H.deferral[n] - H.deferral[2])} in ${last}. The IRA limit jumped in ${Y[1]}, stood still in ${Y[2]} and rose again in ${last}. These are not policy decisions taken each year: the code fixes a formula, and the IRS applies it to the inflation measured up to the third quarter.</p>
${h.mini('history', { t: 'Your 401(k) limit in a past year', p: ['y'], d: { by: 1970 } })}
<h2>Why the limits move in $500 steps</h2>
<p>Each limit has a rounding rule written into the code, and the rule is always to round down. The elective deferral limit of section 402(g) and the catch-up of section 414(v) are adjusted in multiples of $500; the 415(c) total in multiples of $1,000; the compensation cap and the highly compensated threshold in multiples of $5,000. The IRA limit moves in $500 steps as well. The IRA catch-up, indexed since SECURE 2.0, moves in $100 steps, which is how it went from ${K.usd(H.iraCatchUp[2])} to ${K.usd(H.iraCatchUp[n])} in ${last} after years at the same figure.</p>
<p>Rounding down explains the flat years. The indexed catch-up for ${Y[1]} and ${Y[2]} came out above ${K.usd(H.catchUp50[0])} but short of the next $500 step, so it printed as ${K.usd(H.catchUp50[0])} three years running. The highly compensated threshold shows the same thing in ${last}: ${K.usd(H.hce[n])}, as in ${Y[2]}. When a figure stays flat for a year, the unrounded value usually crosses the next step the following year. The Social Security wage base is different again: the Social Security Administration sets it from the national average wage index, not from consumer prices, so it moves by amounts such as ${K.usd(H.wageBase[n] - H.wageBase[2])} that fit no $500 grid.</p>
<h2>Limits that did not exist before</h2>
<p>The age 60 to 63 catch-up was created by SECURE 2.0 and first applied in 2025, at ${K.usd(K.P.previous.catchUp6063)}; it is the same in ${last}, as the table shows (${h.a('super-catch-up-60-63', 'age 60 to 63 catch-up')}). The Roth catch-up requirement for higher paid workers is also new: its wage threshold is ${K.usd(L.rothCatchUpWageThreshold)} of 2025 wages for ${last}, and ${last} is the first year it is enforced (${h.a('roth-catch-up-rule', 'Roth catch-up rule')}). A history table that lists these columns for ${first} or ${Y[1]} is wrong for those years.</p>
${h.mini('history', { t: 'The same year for another birth year', p: ['by'], d: { y: String(Y[1]) } })}
<h2>Pages that still show an older year</h2>
<p>Limits pages are often written once and updated late. It is common to find a "${last} limits" headline above a table that still shows ${K.usd(H.deferral[1])} or ${K.usd(H.deferral[2])} for the deferral, or a catch-up of ${K.usd(H.catchUp50[0])}. Using those figures in a payroll election leaves room unused: ${K.usd(H.deferral[n] - H.deferral[2])} on the deferral alone against ${Y[2]}, ${K.usd(at50(n) - at50(2))} for someone over 50. A quick check is the catch-up line: if a page claims to be current and shows ${K.usd(H.catchUp50[0])}, it predates the ${last} notice. The official source is the IRS ${h.src('irs_cola', 'COLA increases page')}, which lists each year in a column, and the notice for each year (${h.src('notice_2025_67', 'Notice 2025-67')} for ${last}).</p>
<h2>Reading the trend without guessing next year</h2>
<p>Over these four years the deferral limit gained ${K.pct(rise(H.deferral), 1)}, the 415(c) total ${K.pct(rise(H.total415c), 1)} and the IRA limit ${K.pct(rise(H.ira), 1)}. The total grew faster than the employee limit because it rounds in larger steps and started from a larger base, so a single year of high inflation, as in the adjustment for ${Y[0]}, moved it by several thousand dollars at once. It is tempting to extend these lines to the next year, and many sites print a forecast with the same typography as an official figure. This site does not: the next figures depend on the third quarter price index, and on the rounding thresholds, which can turn a small difference in inflation into a full $500 step or none. The real amounts are added the day the IRS notice comes out.</p>
<h2>Can you make up a past year?</h2>
<p>A 401(k) limit is a calendar year limit tied to paychecks, so unused room does not carry forward. Someone who deferred ${K.usd(15000)} in ${Y[2]} cannot add the missing ${K.usd(H.deferral[2] - 15000)} in ${last}. The only look back is for IRAs, where contributions for a year can be made until the filing deadline in April of the next year. For ${last}, your own figures by age and pay are on the ${h.a('401k-contribution-limits', '2026 limits page')}, and the outlook for the next year is on ${h.a('401k-limits-2027', 'the 2027 page')}.</p>
`,
  faqs: [
    { q: `Why did the 401(k) catch-up stay at ${K.usd(H.catchUp50[0])} from 2023 to 2025?`, a: `Because the indexed amount is rounded down to a multiple of $500. Inflation pushed the unrounded figure above ${K.usd(H.catchUp50[0])} in ${Y[1]} and ${Y[2]}, but not to the next step, so the published limit did not change until ${last}, when it reached ${K.usd(H.catchUp50[n])}. The same rounding rule explains the flat years of other limits.` },
    { q: 'How much has the 401(k) deferral limit risen since 2023?', a: `By ${K.usd(up(H.deferral))}, from ${K.usd(H.deferral[0])} in ${first} to ${K.usd(H.deferral[n])} in ${last}, about ${K.pct(rise(H.deferral), 1)} in three adjustments. The catch-up rose by ${K.usd(up(H.catchUp50))} over the same years and the 415(c) total by ${K.usd(up(H.total415c))}, so a saver over 50 gained ${K.usd(at50(n) - at50(0))} of room. Each step came from the inflation formula, not a new law.` },
    { q: 'Did the age 60 to 63 catch-up exist in 2024?', a: `No. SECURE 2.0 created it for plan years starting in 2025, at ${K.usd(K.P.previous.catchUp6063)}, and it stayed at ${K.usd(L.catchUp6063)} in ${last}. Before 2025 everyone aged 50 or over had the same catch-up, ${K.usd(H.catchUp50[0])} in ${first} and ${Y[1]}. A table showing a higher catch-up at 60 for those years is in error.` },
    { q: 'Why does the Social Security wage base not follow the $500 steps?', a: `It is set by the Social Security Administration from the growth of the national average wage index, not by the IRS from consumer prices, and its rounding is different. It went from ${K.usd(H.wageBase[0])} in ${first} to ${K.usd(H.wageBase[n])} in ${last}. It matters for plans through self-employment tax and the Roth catch-up wage test.` },
  ],
  tool: 'history',
  toolArg: { y: String(Y[0]), by: 1970 },
  related: ['401k-contribution-limits', '401k-limits-2027', 'catch-up-contributions', 'ira-limits-2027', 'super-catch-up-60-63'],
  sources: ['irs_cola', 'notice_2025_67', 'ir_2025_111'],
});
