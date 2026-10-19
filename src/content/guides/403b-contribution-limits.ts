import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const P571 = 'https://www.irs.gov/publications/p571';
// 15-year rule amounts written in section 402(g)(7) and Publication 571 (not indexed).
const Y15 = 3000, Y15LIFE = 15000, Y15PERYEAR = 5000;
// Worked cases: a teacher born in 1984 (42 in 2026), a nurse born in 1974 (52), a hospital pharmacist born in 1965 (61).
const teacher = K.deferral('403b', 1984, 68000);
const nurse = K.deferral('403b', 1974, 92000);
const pharm = K.deferral('403b', 1965, 160000, 158000);
const both = K.stack457(1974, 92000);
const with15 = L.deferral + Y15;

export default defineGuide({
  id: '403b-contribution-limits',
  group: 'plans',
  order: 55,
  slug: '403b-contribution-limits',
  nav: '403(b) limits',
  card: 'Teachers, hospitals and nonprofits: the deferral, catch-ups and the 15-year rule',
  title: '403b Contribution Limits 2026: Teachers, Nurses, Nonprofits',
  description: `403b contribution limits 2026: ${K.usd(L.deferral)}, ${K.usd(L.deferral + L.catchUp50)} at 50 and ${K.usd(L.deferral + L.catchUp6063)} at 60 to 63, shared with any 401(k). Pick your birth year for your own 403(b) figure.`,
  h1: '403(b) contribution limits 2026 for schools, hospitals and charities',
  intro: `A 403(b) has the same personal deferral limit as a 401(k), and the two are counted together. The calculator gives your 2026 figure from your birth year and pay; the 15-year service increase is explained below, since only the employer's records can settle it.`,
  resume: `In 2026 an employee of a public school, a college, a hospital, a church or another 501(c)(3) organization can defer up to ${K.usd(L.deferral)} of salary into a 403(b) plan. From the year you turn 50 the limit rises by ${K.usd(L.catchUp50)} to ${K.usd(L.deferral + L.catchUp50)}, and in the years you turn 60, 61, 62 or 63 by ${K.usd(L.catchUp6063)} to ${K.usd(L.deferral + L.catchUp6063)}. That limit is personal: deferrals to a 401(k) at a second job in the same year count against it. Some plans also offer a 15-year rule for long-serving staff, worth up to ${K.usd(Y15)} more a year, which can lift the base to ${K.usd(with15)}. A nurse born in 1974 earning ${K.usd(92000)} can defer ${K.usd(nurse.total)} in 2026; a teacher born in 1984 is limited to ${K.usd(teacher.total)}. A governmental 457(b), if your employer also offers one, has a separate limit of its own.`,
  body: (h) => `
<h2>Who has a 403(b) and what the 2026 numbers are</h2>
<p>Section 403(b) plans are open to employees of public schools and state colleges, of organizations exempt under section 501(c)(3) such as hospitals, charities, private schools and research institutes, and to ministers and church employees. The deferral limit comes from the same section 402(g) amount that governs a 401(k), and Notice 2025-67 raised it for 2026 (${h.src('notice_2025_67', 'Notice 2025-67')}).</p>
${h.table(['Your situation in 2026', 'Salary deferral limit'], [
  ['Under 50 on December 31', K.usd(L.deferral)],
  ['50 to 59, or 64 and over', K.usd(L.deferral + L.catchUp50)],
  ['Turning 60, 61, 62 or 63 (born 1963 to 1966)', K.usd(L.deferral + L.catchUp6063)],
  ['15-year rule only, plan permitting', `up to ${K.usd(with15)}`],
], 'Personal limits across all your 401(k) and 403(b) plans. Employer contributions are counted separately.', ['l', 'r'])}
<p>Deferrals can be pre-tax or Roth if the plan has a Roth option, and both kinds share the one limit. Contributions from the employer, such as a hospital match or a school district's fixed percentage, do not use any of it. They fall under the total cap of section 415(c), ${K.usd(L.total415c)} or 100 % of includible compensation if lower, where catch-ups are left out.</p>
<h2>Age catch-ups in a 403(b)</h2>
<p>Age is read on December 31: a social worker born in 1976 turns 50 in 2026 and can add the ${K.usd(L.catchUp50)} from January, even before the birthday. The larger ${K.usd(L.catchUp6063)} applies only in the four calendar years in which you turn 60 to 63. A hospital pharmacist born in 1965 is 61 at the end of 2026 and has ${K.usd(pharm.total)} of room. The jump ends in the year you turn 64, when the standard amount returns.</p>
<p>The Roth catch-up rule reaches 403(b) plans as it does 401(k) plans. If your FICA wages from the employer sponsoring the plan were above ${K.usd(L.rothCatchUpWageThreshold)} in 2025 (box 3 of the W-2), your 2026 catch-up must be designated Roth. The pharmacist above, with ${K.usd(158000)} of 2025 wages, therefore puts the ${K.usd(pharm.catchUp)} in as Roth${pharm.rothCatchUp ? '' : ' if the plan requires it'}. A plan with no Roth option cannot accept catch-ups from someone above that line. Many public school plans added a Roth feature for this reason; check the plan's summary.</p>
${h.mini('k401', { t: 'Your 403(b) limit at your age', p: ['by'], d: { plan: '403b', by: 1965, pay: 120000 } })}
<h2>The 15-year rule: an extra amount computed by your employer</h2>
<p>This increase exists only in 403(b) plans and only when the plan document allows it. You need at least 15 years of service with the same qualifying employer: Publication 571 describes it for an educational organization, a hospital, a home health service agency, a health and welfare service agency, a church or a convention or association of churches (${h.ext(P571, 'Publication 571')}). The limit then increases by the least of three amounts:</p>
<ol>
<li>${K.usd(Y15)} for the year;</li>
<li>${K.usd(Y15LIFE)}, minus the 15-year increases already used in earlier years, which makes ${K.usd(Y15LIFE)} a lifetime ceiling;</li>
<li>${K.usd(Y15PERYEAR)} times your years of service with that employer, minus all the elective deferrals it made for you in earlier years.</li>
</ol>
<p>The third test is the one that usually decides. Someone who has deferred heavily for 15 years has no unused amount left, while a librarian who started saving late may qualify for the full ${K.usd(Y15)}. When both the 15-year increase and the age 50 catch-up apply, Publication 571 says to allocate amounts first to the 15-year rule and then to the catch-up, so a 52 year old with the full increase could defer ${K.usd(with15 + L.catchUp50)}. Because years of service and past deferrals live in the employer's payroll records, this site does not compute the increase: ask the benefits office or the plan's vendor for the maximum includible amount calculation.</p>
<h2>One limit with a 401(k), a separate one with a 457(b)</h2>
<p>The ${K.usd(L.deferral)} is a limit on you, not on each plan. A nurse who works at a nonprofit hospital with a 403(b) and picks up shifts at a for-profit clinic with a 401(k) has one shared deferral room for both. If the two employers each let her defer the full amount, the excess must come back out by April 15, 2027, or it is taxed twice: once in 2026 and again when withdrawn.</p>
<p>A governmental 457(b) is different. Its limit under section 457(e)(15) is counted apart, so a school district employee offered both plans can defer the full amount in each. The nurse born in 1974 earning ${K.usd(92000)} would reach ${K.usd(both.total)} with a 403(b) and a governmental 457(b) together, catch-ups included. The ${h.a('457b-contribution-limits', '457(b) page')} shows that stacking in detail.</p>
${h.mini('stack', { t: 'A 403(b) plus a 457(b): your combined room', p: ['pay'], d: { pay: 92000, by: 1974 } })}
<h2>Pay, timing and common errors</h2>
<p>A deferral cannot exceed your includible compensation for the year, which matters for part-time staff and adjuncts: a teacher born in 1984 with a ${K.usd(68000)} salary can still defer ${K.usd(teacher.total)}, but someone earning less than the limit is capped at pay. Deferrals must come out of paychecks dated within the calendar year, so a teacher on a ten-month contract who spreads pay over twelve months should check which checks fall in 2026.</p>
<p>Three mistakes come up often. Some pages still print the limit of a past year as if it were current, which makes people under-save. Others say the 15-year rule adds ${K.usd(Y15)} to everyone with long service, without the lifetime and past-deferral tests. And some readers believe a 403(b) has a lower limit than a 401(k) because it is a nonprofit plan; it does not. For the general rules see the ${h.a('401k-contribution-limits', '401(k) limit page')} and the ${h.a('catch-up-contributions', 'catch-up guide')}; the ${h.a('roth-catch-up-rule', 'Roth catch-up page')} covers the wage test.</p>
`,
  faqs: [
    { q: 'Is the 403(b) limit for 2026 the same as the 401(k) limit?', a: `Yes, ${K.usd(L.deferral)} of salary deferrals, with the same catch-ups: ${K.usd(L.catchUp50)} from the year you turn 50 and ${K.usd(L.catchUp6063)} in the years you turn 60 to 63. The two plans also share a single limit, so if you defer in both during 2026, your combined deferrals cannot pass that amount.` },
    { q: 'How do I know if I qualify for the 403(b) 15-year catch-up?', a: `You need 15 years of service with one qualifying employer, such as a school, hospital or church, and a plan that offers the rule. The increase is the least of ${K.usd(Y15)}, ${K.usd(Y15LIFE)} minus amounts already used, and ${K.usd(Y15PERYEAR)} per year of service minus past deferrals. Only the employer's records can give the last figure, so ask the benefits office.` },
    { q: 'Can I use the 15-year rule and the age 50 catch-up in the same year?', a: `Yes, if you qualify for both. Publication 571 tells the employer to count amounts first under the 15-year rule and only then as an age 50 catch-up. With the full ${K.usd(Y15)} increase and the ${K.usd(L.catchUp50)} catch-up, the 2026 total could reach ${K.usd(with15 + L.catchUp50)}, before any employer contribution.` },
    { q: 'Does my school district 457(b) reduce what I can put in my 403(b)?', a: `No. A governmental 457(b) has its own ${K.usd(L.gov457)} limit, counted apart from the 403(b) and 401(k) limit. A district employee offered both can defer the full amount in each plan during 2026, plus the age catch-up in each, as long as total deferrals stay within pay.` },
  ],
  tool: 'k401',
  toolArg: { plan: '403b', by: 1974, pay: 92000 },
  related: ['457b-contribution-limits', '401k-contribution-limits', 'catch-up-contributions', 'roth-catch-up-rule', 'super-catch-up-60-63'],
  sources: ['notice_2025_67', 'ir_2025_111', 'irs_cola'],
});
