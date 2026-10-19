import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
const extra = L.catchUp6063 - L.catchUp50;
const first = 2025; // first plan year of the age 60 to 63 catch-up (SECURE 2.0, section 109)
const in26 = [1963, 1964, 1965, 1966];
// Worked case: born 1965, $140,000 of pay.
const a = K.deferral('401k', 1965, 140000);
const yrsA = K.superCatchUpYears(1965);
const at64 = K.deferral('401k', 1962, 140000);
const H27 = K.announced('2027') ? K.usd((K.L27 as Record<string, unknown>).catchUp6063 as number) : 'not announced yet';
const birthRows = [1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968].map((y) => {
  const yrs = K.superCatchUpYears(y);
  const usable = yrs.filter((x) => x >= first);
  return [String(y), `${yrs[0]} to ${yrs[3]}`, usable.length ? `${usable.length} of 4` : 'none', in26.includes(y) ? K.usd(L.catchUp6063) : K.usd(K.catchUp('401k', 2026 - y) ?? 0)];
});

export default defineGuide({
  id: 'super-catch-up-60-63',
  group: 'plans',
  order: 25,
  slug: 'super-catch-up-60-63',
  nav: 'Age 60 to 63 catch-up',
  card: 'Which birth years get the higher catch-up in 2026, and for how long',
  title: `Super Catch-Up 60-63 2026: ${K.usd(L.catchUp6063)} for Born 1963 to 1966`,
  description: `Super catch-up 60-63 in 2026: ${K.usd(L.catchUp6063)} instead of ${K.usd(L.catchUp50)} if you were born 1963 to 1966, ${K.usd(L.simpleCatchUp6063)} in a SIMPLE. See your four years and the drop back at age 64.`,
  h1: 'Super catch-up 60-63 in 2026: who gets it and for how long',
  intro: `SECURE 2.0 gave a larger catch-up to savers in the four calendar years they turn 60, 61, 62 and 63. Pick your birth year to see those years and your 2026 amount.`,
  resume: `In 2026 the age 60 to 63 catch-up is ${K.usd(L.catchUp6063)} in a 401(k), 403(b), governmental 457(b) or the TSP, against ${K.usd(L.catchUp50)} for other savers aged 50 and over, so ${K.usd(extra)} more. It applies to people who turn 60, 61, 62 or 63 by December 31, 2026, which means those born from 1963 to 1966; their total deferral limit is ${K.usd(L.deferral + L.catchUp6063)}. In a SIMPLE IRA or SIMPLE 401(k) the same tier is ${K.usd(L.simpleCatchUp6063)}. The window lasts four calendar years and closes in the year you turn 64, when you return to the standard catch-up. Born in 1965, you have it from ${yrsA[0]} to ${yrsA[3]} and can defer ${K.usd(a.total)} on ${K.usd(140000)} of pay this year. Your plan has to offer it: employers are allowed to leave it out, and many smaller plans still do.`,
  body: (h) => `
<h2>Birth year by birth year</h2>
${h.table(['Born in', 'Years you turn 60 to 63', 'Years usable (from 2025)', 'Your 2026 catch-up'], birthRows, `Ages counted at December 31. The tier exists from ${first}, so earlier years do not count.`, ['l', 'l', 'r', 'r'])}
<p>The test is the age reached by the end of the year, as for every catch-up, so the month of your birthday does not matter. A person born in December 1966 turns 60 in the last weeks of 2026 and may use the higher amount from the first paycheck in January. Because the provision started in ${first}, people born in 1962 had only one year of it (2025) and people born in 1961 or earlier had none: they had turned 63 before it began. Those born in 1963 get two years, 2025 and 2026; people born in 1965 and later get all four.</p>
${h.mini('super', { t: 'Your four years and your 2026 catch-up', p: ['by'], d: { pay: 140000 } })}
<h2>Back to the standard catch-up at 64</h2>
<p>The extra amount is tied to the years you turn 60 through 63, not to "age 60 and over". In the calendar year you turn 64 your catch-up falls back to the regular amount, ${K.usd(L.catchUp50)} in 2026. Someone born in 1962 turns 64 this year and has a limit of ${K.usd(at64.total)}, ${K.usd(extra)} less than a colleague born a year later. Payroll systems sometimes miss this: if your rate was set to reach ${K.usd(L.deferral + L.catchUp6063)} last year, check that the plan stops you at the right amount, because an excess deferral has to be paid back by April 15 of the next year.</p>
<h2>Where the ${K.usd(L.catchUp6063)} comes from</h2>
<p>The law sets this tier at the greater of a fixed amount or 150 % of the standard catch-up for 2024. That catch-up was ${K.usd(K.P.history.catchUp50[1])}, which gives ${K.usd(K.P.history.catchUp50[1] * 1.5)}. Indexing for inflation began after 2025, in $500 steps rounded down, and for 2026 the result still rounds to the same figure: ${K.usd(PR.catchUp6063)} in 2025, ${K.usd(L.catchUp6063)} in 2026. As the standard catch-up rose to ${K.usd(L.catchUp50)}, the gap between the two tiers narrowed from ${K.usd(PR.catchUp6063 - PR.catchUp50)} to ${K.usd(extra)}. The 2027 amount is ${H27}; the IRS publishes it ${String(K.L27.expected)}. The 2026 figures are in ${h.src('notice_2025_67', 'Notice 2025-67')}.</p>
<h2>SIMPLE plans have their own version</h2>
<p>In a SIMPLE IRA or SIMPLE 401(k), the age 60 to 63 catch-up is ${K.usd(L.simpleCatchUp6063)}, against ${K.usd(L.simpleCatchUp)} for other savers 50 and over in an ordinary SIMPLE and ${K.usd(L.simpleCatchUpApplicable)} in one that uses the higher deferral limit. A 61 year old in an ordinary SIMPLE can therefore defer ${K.usd(L.simple + L.simpleCatchUp6063)} in 2026. The Roth requirement for high earners does not apply to SIMPLE IRAs (${h.a('simple-ira-contribution-limits', 'SIMPLE IRA limits')}).</p>
${h.mini('super', { t: 'Total limit with the higher catch-up', p: ['pay'], d: { by: 1963 } })}
<h2>Your plan has to offer it</h2>
<p>Catch-up contributions are optional for employers, and the age 60 to 63 tier needed plan changes from payroll providers and recordkeepers. Many plans adopted it for 2025, but some smaller plans, and some 403(b) and 457(b) plans run by local employers, have not. If yours does not offer it, you are limited to the standard ${K.usd(L.catchUp50)} in that plan, even in the years you qualify. A plan that offers catch-ups generally has to make them available to every eligible participant; it cannot pick and choose among employees. The questions to ask HR are short: does the plan allow the higher catch-up, and does payroll switch to it automatically in the year I turn 60?</p>
<h2>The Roth catch-up rule applies to this tier too</h2>
<p>From 2026, if your 2025 Social Security wages from the employer that sponsors the plan were above ${K.usd(L.rothCatchUpWageThreshold)}, the whole catch-up, including the larger ${K.usd(L.catchUp6063)}, has to be made as Roth. You still get the same dollar amount; what changes is that it is taxed now instead of later. For a saver in the 24 % bracket the Roth treatment of ${K.usd(L.catchUp6063)} means about ${K.usd(L.catchUp6063 * 0.24)} more federal income tax for 2026. The ${h.a('roth-catch-up-rule', 'Roth catch-up page')} explains the wage test and what happens in a plan with no Roth option.</p>
<h2>Making the most of four years</h2>
<p>Four years at the higher tier add up. In 2026 alone the extra room is ${K.usd(extra)}, and later years will be set each November by the IRS. Saved in a 401(k) at the edge of retirement, those amounts reduce taxable income in years that are often the highest paid of a career, or build Roth money if the Roth rule applies to you. If you are close to retiring, keep in mind that deferrals only come from pay: a person who stops working in mid 2026 can only use the tier on the paychecks received before leaving. The IRA has no equivalent tier: its catch-up is ${K.usd(L.iraCatchUp)} at any age from 50 (${h.a('catch-up-contributions', 'all catch-up amounts')}).</p>
`,
  faqs: [
    { q: 'I turn 64 in 2026: do I keep the age 60 to 63 catch-up?', a: `No. The higher amount applies only in the calendar years you turn 60, 61, 62 or 63. In the year you turn 64 you return to the standard catch-up of ${K.usd(L.catchUp50)}, so a person born in 1962 can defer ${K.usd(at64.total)} in 2026. Check that payroll lowers your rate, or the plan will have to correct an excess.` },
    { q: 'I was born in 1962: did I miss the super catch-up?', a: `Almost. You turned 60 in 2022, before the provision existed, and 63 in 2025, the first year it applied. So 2025 was your only year at the higher tier. In 2026, at 64, your catch-up is the standard ${K.usd(L.catchUp50)}. People born in 1961 or earlier never qualified at all.` },
    { q: 'My plan does not offer the age 60 to 63 catch-up: what can I do?', a: `Inside that plan, nothing: you are limited to the standard ${K.usd(L.catchUp50)}. You can ask the employer to adopt it, since many did through a plan amendment. If you also have a governmental 457(b) or a side business with a solo 401(k) that allows it, the higher tier may be available there instead.` },
    { q: 'Is there an age 60 to 63 catch-up for IRAs?', a: `No. The higher tier is for workplace plans only: 401(k), 403(b), governmental 457(b), the TSP and SIMPLE plans. The IRA catch-up is ${K.usd(L.iraCatchUp)} in 2026 for everyone aged 50 or over, with no extra amount at 60. The HSA catch-up starts at 55 and does not change at 60 either.` },
  ],
  tool: 'super',
  toolArg: { by: 1965, pay: 140000 },
  related: ['catch-up-contributions', 'roth-catch-up-rule', '401k-contribution-limits', 'simple-ira-contribution-limits'],
  sources: ['notice_2025_67', 'ir_2025_111', 'ir_2025_91'],
});
