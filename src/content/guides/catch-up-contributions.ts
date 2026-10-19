import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
const A = K.P.ages;
// Worked case: born 1968, 58 at the end of 2026, a 401(k), an IRA and a self-only HSA.
const age = K.ageAtYearEnd(1968);
const k = K.catchUp('401k', age) ?? 0;
const hsa = K.hsa('self', age);
const sumCatch = k + L.iraCatchUp + hsa.catchUp;
const sumAll = L.deferral + k + L.ira + L.iraCatchUp + hsa.total;
const born50 = 2026 - A.catchUp, born55 = 2026 - A.hsaCatchUp;

export default defineGuide({
  id: 'catch-up-contributions',
  group: 'plans',
  order: 20,
  slug: 'catch-up-contributions',
  nav: 'Catch-up contributions',
  card: 'Every 2026 catch-up amount by plan, and your first year',
  title: 'Catch-Up Contributions 2026: Every Plan, IRA and HSA',
  description: `Catch-up contributions 2026: ${K.usd(L.catchUp50)} in a 401(k), 403(b) or 457(b), ${K.usd(L.simpleCatchUp)} in a SIMPLE, ${K.usd(L.iraCatchUp)} in an IRA, ${K.usd(L.hsaCatchUp)} in an HSA from 55. See your first year.`,
  h1: 'Catch-up contributions 2026: how much each plan adds',
  intro: `A catch-up is an extra amount allowed once you reach a set age by December 31. Each kind of account has its own, and you can use all of them in the same year.`,
  resume: `In 2026 the catch-up is ${K.usd(L.catchUp50)} in a 401(k), 403(b), governmental 457(b) or the TSP for anyone 50 or older at the end of the year, and ${K.usd(L.catchUp6063)} in the years you turn 60 to 63. A SIMPLE IRA or SIMPLE 401(k) allows ${K.usd(L.simpleCatchUp)}, or ${K.usd(L.simpleCatchUpApplicable)} in a SIMPLE plan that uses the higher deferral limit. An IRA adds ${K.usd(L.iraCatchUp)}, the first increase of that amount since it was set, and an HSA adds ${K.usd(L.hsaCatchUp)} from 55. These sit on top of each other: a person born in 1968, ${age} in 2026, with a 401(k), an IRA and a self-only HSA can put ${K.usd(sumCatch)} more than a younger saver, ${K.usd(sumAll)} in all. Plan catch-ups do not count toward the ${K.usd(L.total415c)} total limit on additions, so employer money never squeezes them out.`,
  body: (h) => `
<h2>All the 2026 catch-up amounts</h2>
${h.table(['Account', 'Age test', 'Base 2026 limit', 'Catch-up', 'Age 60 to 63'], [
  ['401(k), 403(b), TSP', A.catchUp + ' by Dec. 31', K.usd(L.deferral), K.usd(L.catchUp50), K.usd(L.catchUp6063)],
  ['Governmental 457(b)', A.catchUp + ' by Dec. 31', K.usd(L.gov457), K.usd(L.catchUp50), K.usd(L.catchUp6063)],
  ['SIMPLE IRA or SIMPLE 401(k)', A.catchUp + ' by Dec. 31', K.usd(L.simple), K.usd(L.simpleCatchUp), K.usd(L.simpleCatchUp6063)],
  ['SIMPLE with the higher deferral', A.catchUp + ' by Dec. 31', K.usd(L.simpleApplicable), K.usd(L.simpleCatchUpApplicable), K.usd(L.simpleCatchUp6063)],
  ['Traditional and Roth IRA', A.catchUp + ' by Dec. 31', K.usd(L.ira), K.usd(L.iraCatchUp), 'no extra tier'],
  ['HSA', A.hsaCatchUp + ' by Dec. 31', K.usd(L.hsaSelf) + ' / ' + K.usd(L.hsaFamily), K.usd(L.hsaCatchUp), 'no extra tier'],
], `Notice 2025-67 for plans and IRAs, Rev. Proc. 2025-19 for HSAs. HSA base: self-only / family coverage.`, ['l', 'l', 'r', 'r', 'r'])}
<p>Compared with 2025, the workplace catch-up went up from ${K.usd(PR.catchUp50)}, the SIMPLE catch-up from ${K.usd(PR.simpleCatchUp)} and the IRA catch-up from ${K.usd(PR.iraCatchUp)}. The IRA amount had been frozen for years until SECURE 2.0 tied it to inflation in $100 steps; 2026 is the first year the indexed figure moved. The HSA catch-up is written into the code as a flat amount and has no inflation adjustment at all.</p>
<h2>Your first catch-up year</h2>
<p>For the 50 tier, the first year is the calendar year of your 50th birthday, whatever the month. In 2026 that means everyone born in ${born50} or earlier. For the HSA, the first year is the one in which you turn 55: born in ${born55} or earlier. Nothing has to be filed. The plan or the IRA custodian just accepts the larger amount, and in a 401(k) the extra deferral usually continues in the same payroll election once you pass the base limit.</p>
${h.mini('catchup', { t: 'Your catch-up for a birth year', p: ['by'], d: { plan: '401k' } })}
<h2>Small employer SIMPLE plans</h2>
<p>A SIMPLE plan normally has a ${K.usd(L.simple)} deferral limit and a ${K.usd(L.simpleCatchUp)} catch-up. Since SECURE 2.0, a SIMPLE run by an employer with 25 or fewer employees gets a deferral limit about 10 % higher, ${K.usd(L.simpleApplicable)}, and a larger employer (up to 100 employees) can reach it by paying a slightly bigger employer contribution. In those higher limit plans the catch-up is ${K.usd(L.simpleCatchUpApplicable)}, a figure the statute ties to 110 % of the 2024 SIMPLE catch-up, which this year is below the general SIMPLE catch-up. The combined amount is still higher: ${K.usd(L.simpleApplicable + L.simpleCatchUpApplicable)} against ${K.usd(L.simple + L.simpleCatchUp)}. The ${h.a('simple-ira-contribution-limits', 'SIMPLE IRA page')} has the employer side.</p>
${h.mini('catchup', { t: 'Compare the plan types at the same age', p: ['plan'], d: { by: 1966 } })}
<h2>Catch-ups and the total additions limit</h2>
<p>Section 415(c) caps what goes into one person's account in a defined contribution plan at ${K.usd(L.total415c)} or 100 % of pay. Catch-up contributions are left out of that count. A 52 year old whose deferrals, match and profit sharing already reach ${K.usd(L.total415c)} can still add the ${K.usd(L.catchUp50)} catch-up, for ${K.usd(L.total415c + L.catchUp50)} going into the account. At 61 the ceiling with catch-up is ${K.usd(L.total415c + L.catchUp6063)}. The plan's nondiscrimination tests also ignore catch-up deferrals, which is why a highly paid employee whose regular deferrals are cut back after a failed test can often keep the catch-up. The ${h.a('employer-401k-contribution-limit', 'employer contribution page')} has the full calculation.</p>
<h2>Several accounts, several catch-ups</h2>
<p>The 401(k) catch-up and the IRA catch-up are separate, and the HSA one is separate again. In the worked case above, the ${K.usd(sumCatch)} of extra room breaks down into ${K.usd(k)} in the 401(k), ${K.usd(L.iraCatchUp)} in the IRA and ${K.usd(hsa.catchUp)} in the HSA. Inside the workplace group, the catch-up is shared the same way as the base limit: one 401(k) catch-up across all your 401(k) and 403(b) plans. A governmental 457(b) is the exception, with its own catch-up next to a 403(b) one. That 457(b) also has a special catch-up for the three years before normal retirement age, which can be larger, but you use whichever of the two gives more, never both in the same year (${h.a('457b-contribution-limits', '457(b) limits')}).</p>
<h2>How to claim them in practice</h2>
<p>Each account has its own route. In a 401(k) or 403(b), you raise your deferral rate, or set a separate catch-up election if your plan asks for one, and payroll keeps deducting after you pass the base limit. Check your last pay stub of the year: the year to date deferral should reach ${K.usd(L.deferral + k)} at 58, not stop at ${K.usd(L.deferral)}. For an IRA, you simply contribute the larger amount to the custodian by the filing deadline in April 2027, and the custodian codes it for 2026 if you say so. For an HSA, payroll contributions through a cafeteria plan are the cheapest way, since they also avoid Social Security and Medicare tax, but a direct deposit to the HSA trustee works too and is deducted on Form 8889. Someone who forgets the IRA or HSA catch-up in December still has until the April deadline; the 401(k) catch-up, tied to paychecks, does not wait.</p>
<h2>Two conditions to check</h2>
<p>Workplace catch-ups are optional for the employer, though almost every 401(k) and 403(b) offers them; the age 60 to 63 tier in particular depends on the plan being amended (${h.a('super-catch-up-60-63', 'age 60 to 63 page')}). From 2026, a person whose 2025 Social Security wages from the plan's employer exceeded ${K.usd(L.rothCatchUpWageThreshold)} must make the catch-up as Roth, which changes the tax but not the amount (${h.a('roth-catch-up-rule', 'Roth catch-up rule')}). SIMPLE IRAs and IRAs are outside that Roth requirement. For an HSA the condition is different: the catch-up stops for the months you are enrolled in Medicare, usually from 65 (${h.a('hsa-contribution-limits', 'HSA limits')}).</p>
<p>The amounts come from ${h.src('notice_2025_67', 'Notice 2025-67')} and ${h.src('rp_2025_19', 'Rev. Proc. 2025-19')}.</p>
`,
  faqs: [
    { q: 'Can I make a 401(k) catch-up and an IRA catch-up in the same year?', a: `Yes. They are separate limits under separate sections of the code. At 50 or older in 2026 you can add ${K.usd(L.catchUp50)} to your workplace plan and ${K.usd(L.iraCatchUp)} to your traditional or Roth IRA, and an HSA catch-up of ${K.usd(L.hsaCatchUp)} from 55. The IRA one is subject to the usual income rules for Roth contributions and deductions.` },
    { q: 'Do I get a separate catch-up in a 403(b) and a 457(b)?', a: `Yes, if the 457(b) is a governmental plan. Its limit is separate from the 403(b) one, and so is its ${K.usd(L.catchUp50)} catch-up. A 403(b) and a 401(k), by contrast, share one base limit and one catch-up between them, however many employers are involved.` },
    { q: 'Why is the SIMPLE catch-up smaller in some small employer plans?', a: `SIMPLE plans that use the higher deferral limit of ${K.usd(L.simpleApplicable)} have a catch-up fixed at ${K.usd(L.simpleCatchUpApplicable)}, a figure the statute sets at 110 % of the 2024 SIMPLE catch-up rather than the yearly indexed amount. The ordinary SIMPLE catch-up rose to ${K.usd(L.simpleCatchUp)}. The higher plan still allows more in total, ${K.usd(L.simpleApplicable + L.simpleCatchUpApplicable)}.` },
    { q: 'Does my employer have to offer catch-up contributions?', a: `No. A plan may choose not to allow them, but nearly all 401(k) and 403(b) plans do, and if a plan allows them it must offer them to every participant who reaches 50. The age 60 to 63 amount is a separate choice the plan makes. Your summary plan description or HR can confirm both.` },
  ],
  tool: 'catchup',
  toolArg: { by: 1972, plan: '401k' },
  related: ['super-catch-up-60-63', 'roth-catch-up-rule', '401k-contribution-limits', 'simple-ira-contribution-limits', 'hsa-contribution-limits'],
  sources: ['notice_2025_67', 'rp_2025_19', 'ir_2025_111'],
});
