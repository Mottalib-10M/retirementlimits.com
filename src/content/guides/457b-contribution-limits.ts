import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
// Worked cases: a firefighter born in 1974 (52 in 2026) earning $85,000; a city engineer born in 1964 (62) earning $120,000;
// a young police officer born in 1990 (36) earning $40,000.
const ff = K.stack457(1974, 85000);
const eng = K.stack457(1964, 120000);
const cop = K.stack457(1990, 40000);
const alone = K.deferral('gov457', 1974, 85000);
const twice = 2 * L.gov457;

export default defineGuide({
  id: '457b-contribution-limits',
  group: 'plans',
  order: 60,
  slug: '457b-contribution-limits',
  nav: '457(b) limits',
  card: 'A separate limit that stacks on a 403(b) or 401(k): double deferral for public employees',
  title: '457b Contribution Limits 2026: Stacking With a 403b or 401k',
  description: `457b contribution limits 2026: ${K.usd(L.gov457)} in a governmental 457(b), on top of a 403(b) or 401(k), so up to ${K.usd(2 * L.deferral)} in two plans before catch-ups. Check yours.`,
  h1: '457(b) contribution limits 2026: a second limit for public employees',
  intro: `State and local government workers often have two plans at once, a 403(b) or 401(k) and a governmental 457(b). The calculator adds the two limits for your age and pay, since one does not reduce the other.`,
  resume: `For 2026 a governmental 457(b) plan accepts up to ${K.usd(L.gov457)} of deferrals, under section 457(e)(15). That amount is not shared with the 401(k) and 403(b) limit of ${K.usd(L.deferral)}: an employee offered both plans can fill each one, which is often called double deferral. The age catch-ups also apply in each governmental plan, ${K.usd(L.catchUp50)} from the year you turn 50 and ${K.usd(L.catchUp6063)} in the years you turn 60 to 63. A firefighter born in 1974 with ${K.usd(85000)} of pay can therefore defer ${K.usd(ff.first.total)} in a 403(b) and ${K.usd(ff.second.total)} in the 457(b), ${K.usd(ff.total)} in all. Money in a governmental 457(b) can be withdrawn after you leave the job, at any age, without the 10 % additional tax on early distributions. A special catch-up for the last three years before normal retirement age also exists, but it cannot be combined with the age 50 catch-up in the same year.`,
  body: (h) => `
<h2>A 457(b) has its own limit</h2>
<p>Deferred compensation plans of states, cities, counties, school districts and other public bodies are governed by section 457, not by section 402(g). Notice 2025-67 sets both limits at the same figure for 2026 but lists them separately (${h.src('notice_2025_67', 'Notice 2025-67')}). The practical consequence is large: deferrals to a 457(b) are not added to deferrals to a 401(k), a 403(b) or the federal Thrift Savings Plan when the IRS checks your personal limit, and the reverse is also true.</p>
${h.table(['Age on December 31, 2026', '403(b) or 401(k)', 'Governmental 457(b)', 'Both plans'], [
  ['Under 50', K.usd(L.deferral), K.usd(L.gov457), K.usd(L.deferral + L.gov457)],
  ['50 to 59, or 64 and over', K.usd(L.deferral + L.catchUp50), K.usd(L.gov457 + L.catchUp50), K.usd(L.deferral + L.gov457 + 2 * L.catchUp50)],
  ['60 to 63 (born 1963 to 1966)', K.usd(L.deferral + L.catchUp6063), K.usd(L.gov457 + L.catchUp6063), K.usd(L.deferral + L.gov457 + 2 * L.catchUp6063)],
], 'Maximum deferrals if pay is high enough; each plan is also capped at your includible compensation.', ['l', 'r', 'r', 'r'])}
<p>One detail sets the 457(b) apart from the other plans. Its limit covers everything that goes into it for the year, employee deferrals and employer contributions together. A city that puts ${K.usd(2000)} of its own money into your 457(b) leaves you ${K.usd(L.gov457 - 2000)} of deferral room in that plan. Most public employers fund their pension instead and put nothing in the 457(b), so this rarely bites, but it is worth checking before setting a payroll election at the maximum.</p>
<h2>Double deferral in practice</h2>
<p>Take three people. A firefighter born in 1974 earns ${K.usd(85000)}; she is 52 at the end of 2026, so each plan accepts the base plus ${K.usd(L.catchUp50)}: ${K.usd(ff.first.total)} and ${K.usd(ff.second.total)}, ${K.usd(ff.total)} in total, about ${K.pct(ff.total / 85000, 0)} of her pay. A city engineer born in 1964 turns 62 and gets the larger catch-up in both plans, ${K.usd(eng.total)} on a ${K.usd(120000)} salary. A police officer born in 1990 earning ${K.usd(40000)} is held back by pay: after ${K.usd(cop.first.total)} in the 403(b) only ${K.usd(cop.second.total)} of salary is left for the 457(b), and nobody can defer more than they earn.</p>
<p>Whether doubling up makes sense depends on cash flow more than on the limit. Pre-tax deferrals in both plans cut taxable wages by the full amount; Roth deferrals, where the plan offers them, do not. The Roth catch-up rule applies to governmental 457(b) plans too: with 2025 FICA wages from the employer above ${K.usd(L.rothCatchUpWageThreshold)}, catch-ups in each plan must be Roth (${h.a('roth-catch-up-rule', 'Roth catch-up rule')}).</p>
${h.mini('stack', { t: 'Your two limits together at age 60 to 63', p: ['pay'], d: { pay: 120000, by: 1964 } })}
<h2>No 10 % early withdrawal tax after you leave</h2>
<p>The additional tax of section 72(t) applies to qualified plans, 403(b) plans and IRAs, but not to distributions from a governmental 457(b). Once you separate from service, the account can be drawn at 45 or 52 with ordinary income tax only. This is why public employees who plan to retire before 59 and a half often favor the 457(b) when they cannot fill both plans. Two cautions: amounts rolled into the 457(b) from an IRA or another type of plan keep their own early withdrawal tax, and rolling the 457(b) itself into an IRA brings the IRA rules with it. Required minimum distributions start at the same age as for other plans.</p>
<h2>The special catch-up of the last three years</h2>
<p>Governmental 457(b) plans may offer a second kind of catch-up, written in section 457(b)(3). It is available in the three taxable years that end before the year you reach the normal retirement age named in the plan, and lets you make up for limits you did not use in earlier years with that employer. The ceiling in 2026 is twice the regular limit, ${K.usd(twice)}, but the amount actually allowed is the regular limit plus your unused amounts from past years, if that is lower, so it depends on your deferral history.</p>
<p>The special catch-up and the age 50 catch-up cannot be stacked in the same year: you use whichever gives the larger amount. A 62 year old who qualifies for the three-year catch-up and has a large unused balance may get more from it than from the ${K.usd(L.catchUp6063)} age catch-up; someone with little unused room is better off with the age amount. Because it rests on the plan's retirement age and on your records, the calculator above does not compute it; the plan administrator does.</p>
<h2>Nongovernmental 457(b) plans are a different product</h2>
<p>Hospitals, universities and other tax-exempt employers can also offer a 457(b), usually to a small group of highly paid staff. It shares the ${K.usd(L.gov457)} figure, but the money stays the employer's property until paid out and is exposed to its creditors, the age catch-ups do not apply, and the account cannot be rolled into an IRA. The no-penalty withdrawal rule above is the same in substance, but the risk profile is not. For a 403(b) at the same employer see the ${h.a('403b-contribution-limits', '403(b) limit page')}; for one deferral limit alone, the ${h.a('401k-contribution-limits', '401(k) page')}.</p>
${h.mini('k401', { t: 'One governmental 457(b) alone: your limit', p: ['by'], d: { plan: 'gov457', by: 1974, pay: 85000 } })}
<p>With only the 457(b), the firefighter of the first example can defer ${K.usd(alone.total)} in 2026, which shows how much of the room of a public employee depends on whether a second plan is on offer.</p>
`,
  faqs: [
    { q: 'Can I contribute the full amount to both a 457(b) and a 403(b) in 2026?', a: `Yes, if the 457(b) is a governmental plan. Its ${K.usd(L.gov457)} limit is separate from the ${K.usd(L.deferral)} limit shared by 403(b) and 401(k) plans, so you can fill each one, plus the age catch-up in each. Your pay sets the only other bound: total deferrals cannot exceed what you earn.` },
    { q: 'Is there a penalty for taking money out of a governmental 457(b) before 59 and a half?', a: `No 10 % additional tax applies to a governmental 457(b) distribution after you leave the employer, whatever your age. Ordinary income tax is still due on pre-tax money. The exception is money that came into the 457(b) by rollover from an IRA, a 401(k) or a 403(b), which keeps the early withdrawal tax.` },
    { q: 'Can I use the 457(b) three-year catch-up together with the age 50 catch-up?', a: `Not in the same year. In each of the three years before the plan's normal retirement age you take whichever is larger: the age catch-up for your age, or the special catch-up, which is capped at ${K.usd(twice)} in 2026 and limited by the amounts you left unused in earlier years.` },
    { q: 'Do employer contributions to my 457(b) reduce my own deferral limit?', a: `Yes, unlike in a 401(k) or a 403(b). The 457(b) limit counts employee and employer money together, so every dollar the employer adds to the plan takes a dollar of your ${K.usd(L.gov457)} room. Employer money in a separate pension or in a 403(b) does not touch the 457(b) limit.` },
  ],
  tool: 'stack',
  toolArg: { pay: 85000, by: 1974 },
  related: ['403b-contribution-limits', '401k-contribution-limits', 'roth-catch-up-rule', 'catch-up-contributions', 'super-catch-up-60-63'],
  sources: ['notice_2025_67', 'ir_2025_111', 'irs_cola'],
});
