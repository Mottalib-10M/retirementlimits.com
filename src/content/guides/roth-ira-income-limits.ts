import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const PR = K.P.previous;
const S = L.rothPhase.single, J = L.rothPhase.joint;
// Worked cases: single filer, 40 years old, MAGI $160,000; the same at 56; a joint return at $247,000.
const a = K.rothReduced('single', 160000, 40, 160000);
const b = K.rothReduced('single', 160000, 56, 160000);
const c = K.rothReduced('joint', 247000, 40, 247000);
const near = K.rothReduced('single', 167900, 40, 167900);
const old = K.worksheet22(PR.ira, 160000, PR.rothPhase.single as [number, number]);
const per1k = (r: number[], lim: number) => lim * 1000 / (r[1] - r[0]);

export default defineGuide({
  id: 'roth-ira-income-limits',
  group: 'ira',
  order: 20,
  slug: 'roth-ira-income-limits',
  nav: 'Roth IRA income limits',
  card: 'The reduced amount inside the phase-out, worked out to the dollar',
  title: 'Roth IRA Income Limits 2026: Your Reduced Contribution',
  description: `Roth IRA income limits 2026: ${K.usd(S[0])} to ${K.usd(S[1])} single, ${K.usd(J[0])} to ${K.usd(J[1])} joint. Type your MAGI to get the reduced amount from the IRS worksheet 2-2.`,
  h1: 'Roth IRA income limits 2026: how much can you still put in?',
  intro: `Inside the phase-out band a Roth IRA contribution is not refused, it is reduced. The calculator runs Worksheet 2-2 of Publication 590-A on your modified AGI and gives the amount, rounded the way the IRS rounds it.`,
  resume: `For 2026 a single filer or head of household can contribute the full ${K.usd(L.ira)} to a Roth IRA (${K.usd(L.ira + L.iraCatchUp)} at 50 or over) with a modified AGI below ${K.usd(S[0])}; the amount shrinks between ${K.usd(S[0])} and ${K.usd(S[1])} and is zero from ${K.usd(S[1])}. On a joint return the band runs from ${K.usd(J[0])} to ${K.usd(J[1])}, and married filing separately after living together it is $0 to $10,000 (Notice 2025-67). Inside the band the IRS does not let you guess: Publication 590-A Worksheet 2-2 takes the share of the band your income has crossed, removes that share of your limit, rounds the result up to the next $10 and keeps $200 as a floor. A single filer aged 40 with ${K.usd(160000)} of MAGI can therefore put ${K.usd(a.reduced)} in a Roth IRA, and ${K.usd(b.reduced)} at 56. The calculator above does the same steps on your figures.`,
  body: (h) => `
<h2>The 2026 phase-out bands</h2>
${h.table(['Filing status', 'Full contribution below', 'Nothing from', 'Each $1,000 above the start removes'], [
  ['Single, head of household, separated all year', K.usd(S[0]), K.usd(S[1]), K.usd(per1k(S, L.ira))],
  ['Married filing jointly, qualifying surviving spouse', K.usd(J[0]), K.usd(J[1]), K.usd(per1k(J, L.ira))],
  ['Married filing separately, lived together', '$0', K.usd(10000), K.usd(per1k([0, 10000], L.ira))],
], `Notice 2025-67, read on irs.gov on ${K.day(K.P.retrieved_at)}. Last column for the ${K.usd(L.ira)} limit under 50.`, ['l', 'r', 'r', 'r'])}
<p>The bands moved up from 2025, when they ran from ${K.usd(PR.rothPhase.single[0])} to ${K.usd(PR.rothPhase.single[1])} for a single filer and from ${K.usd(PR.rothPhase.joint[0])} to ${K.usd(PR.rothPhase.joint[1])} on a joint return. The single band is ${K.usd(S[1] - S[0])} wide, the joint band only ${K.usd(J[1] - J[0])}: a married couple loses the contribution faster for each dollar of income than a single person does, which is why a raise or a bonus near the top of the joint band can take the whole Roth contribution away in one year.</p>
<h2>Worksheet 2-2, step by step</h2>
<p>Publication 590-A gives the method in a short worksheet (${h.src('pub590a', 'Publication 590-A, chapter 2')}). Take a single filer, 40 years old, with a modified AGI of ${K.usd(160000)} in 2026.</p>
<ol>
<li>Subtract the start of the band from your MAGI: ${K.usd(160000)} minus ${K.usd(S[0])} leaves ${K.usd(160000 - S[0])}.</li>
<li>Divide by the width of the band, ${K.usd(S[1] - S[0])}: the result, ${K.dec(a.share * 100, 1)} %, is the share of your limit you lose.</li>
<li>Multiply your limit by that share: ${K.usd(L.ira)} times ${K.dec(a.share * 100, 1)} % is ${K.usd(L.ira * a.share)}.</li>
<li>Subtract it from the limit and round up to the next multiple of $10: ${K.usd(a.reduced)}.</li>
<li>If the result is above zero but under $200, the contribution allowed is $200.</li>
</ol>
<p>At 56 the same income gives ${K.usd(b.reduced)}, because the worksheet starts from ${K.usd(L.ira + L.iraCatchUp)}: the catch-up is reduced in the same proportion, not kept whole. On a joint return with ${K.usd(247000)} of MAGI, halfway through the narrower band, each spouse under 50 can contribute ${K.usd(c.reduced)}.</p>
${h.mini('roth', { t: 'Your reduced amount on a joint return', p: ['magi'], d: { f: 'joint', magi: 247000 } })}
<h2>Why the rounding and the $200 floor matter</h2>
<p>The two rules come from the code itself, section 408A(c)(3), and they always work in your favor. Rounding up means a result of ${K.usd(3991)} becomes ${K.usd(4000)}. The floor protects people at the very top of the band: a single filer with ${K.usd(167900)} of MAGI would compute a few dollars, and is allowed ${K.usd(near.reduced)} instead. Above ${K.usd(S[1])}, though, there is no floor: the limit is zero.</p>
<p>Many pages that rank for this question stop at "your contribution is reduced" and link to the IRS. Others still show the 2025 band. With the 2025 figures, the same ${K.usd(160000)} of income would have allowed only ${K.usd(old.reduced)}, so using last year's table understates what you may put in this year.</p>
<h2>What counts as modified AGI</h2>
<p>The figure tested is not your salary. It starts from adjusted gross income on Form 1040 and adds back a few items, listed in Worksheet 2-1 of Publication 590-A: a traditional IRA deduction, the student loan interest deduction, excluded foreign earned income and housing, excluded savings bond interest used for education, and employer adoption benefits. It then subtracts any income from a Roth conversion and from a rollover from a qualified plan to a Roth IRA. Pre-tax 401(k) deferrals have already reduced your AGI, which makes them the main lever: deferring an extra ${K.usd(5000)} through payroll lowers MAGI by the same amount and can bring you back inside the band.</p>
<h2>When your income ends up above the band</h2>
<p>Income is only known at year end, and a contribution made in January can turn into an excess contribution when the bonus arrives. The IRS gives you until the due date of the return, extensions included, to fix it: withdraw the excess with the earnings on it, or recharacterize it as a traditional IRA contribution. Left in place, an excess is taxed at 6 % for each year it stays. A traditional IRA contribution has no income limit, so one made above the band and later converted is the route people call a backdoor Roth; the pro rata rule on existing pre-tax IRA balances then decides how much of that conversion is taxed. The ${h.a('traditional-ira-deduction-limits', 'deduction calculator')} shows whether such a contribution is deductible, and the ${h.a('ira-contribution-limits', 'IRA limit page')} covers the compensation test.</p>
${h.mini('deduct', { t: 'Is the traditional IRA contribution deductible?', p: ['magi'], d: { f: 'single', cov: 'you', magi: 86000 } })}
<h2>The limit is shared with traditional IRAs</h2>
<p>The ${K.usd(L.ira)} is one limit for all your IRAs. Whatever you put in a traditional IRA for 2026 reduces what you can put in a Roth, and the worksheet subtracts it at its last line. A 401(k) does not: maxing out the ${K.usd(L.deferral)} deferral leaves the IRA limit untouched. Married couples filing jointly each have their own IRA limit, but the phase-out tests the couple's MAGI, and a spouse with no pay can contribute on the other's earnings (${h.a('spousal-ira', 'spousal IRA')}).</p>
`,
  faqs: [
    { q: 'At what income can I no longer contribute to a Roth IRA in 2026?', a: `At ${K.usd(S[1])} of modified AGI for a single filer or head of household, ${K.usd(J[1])} on a joint return and ${K.usd(10000)} for married filing separately if you lived with your spouse. Below those amounts you can contribute something; below ${K.usd(S[0])} and ${K.usd(J[0])} you can contribute the full limit.` },
    { q: 'How does the IRS round a reduced Roth IRA contribution?', a: 'Up, to the next multiple of $10, so the rounding never costs you. If the result is more than zero but less than $200, you may contribute $200. These two rules are in section 408A(c)(3) of the code and in Worksheet 2-2 of Publication 590-A, which the calculator on this page follows line by line.' },
    { q: 'Is the age 50 catch-up also reduced inside the Roth phase-out?', a: `Yes. The worksheet starts from your whole limit, ${K.usd(L.ira + L.iraCatchUp)} if you are 50 or older by December 31, 2026, and reduces it by the same share as for a younger person. With ${K.usd(160000)} of MAGI, a single filer gets ${K.usd(b.reduced)} at 56 against ${K.usd(a.reduced)} at 40.` },
    { q: 'What happens if my income turns out too high after I contributed?', a: 'You have until the tax filing deadline, extensions included, to take the excess out with its earnings or to recharacterize the contribution as a traditional IRA contribution. If you do nothing, a 6 % excise tax applies to the excess for each year it remains in the Roth IRA, reported on Form 5329.' },
    { q: 'Does my 401(k) contribution lower my Roth IRA income test?', a: `A pre-tax deferral does, because it is excluded from wages and so from AGI. Deferring more through payroll can move a modified AGI back below ${K.usd(S[1])} or into the full-contribution zone. Roth 401(k) deferrals do not reduce AGI and do not help with the test.` },
  ],
  tool: 'roth',
  toolArg: { f: 'single', magi: 160000, by: 1986 },
  related: ['roth-ira-married-filing-jointly', 'ira-contribution-limits', 'traditional-ira-deduction-limits', 'spousal-ira', 'ira-limits-2027'],
  sources: ['notice_2025_67', 'pub590a', 'ir_2025_111'],
});
