import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.L;
const N = K.L27;
const L27 = K.L27 as Record<string, unknown>;
const plansOut = K.announced('2027');
const fsa27 = typeof L27.healthFsa === 'number' ? K.usd(L27.healthFsa) : 'not published yet';
const diff = (a: number, b: number) => `+${K.usd(b - a)}`;
// Worked cases for 2027: family coverage at 58 (born 1969); self-only for nine months at 40; the per-paycheck change
// for 26 pay periods; an HDHP with a deductible equal to the 2026 minimum.
const fam = K.hsa('family', 58, 12, 0, false, '2027');
const nine = K.hsa('self', 40, 9, 0, false, '2027');
const pc26 = L.hsaSelf / 26, pc27 = N.hsaSelf / 26;
const pf26 = L.hsaFamily / 26, pf27 = N.hsaFamily / 26;

export default defineGuide({
  id: 'hsa-limits-2027',
  group: 'next',
  order: 88,
  slug: 'hsa-limits-2027',
  nav: 'HSA limits 2027',
  card: 'Final 2027 HSA and HDHP amounts, compared with 2026',
  title: `HSA Limits 2027: ${K.usd(N.hsaSelf)} Self-Only, ${K.usd(N.hsaFamily)} Family vs 2026`,
  description: `HSA limits 2027 are final: ${K.usd(N.hsaSelf)} self-only and ${K.usd(N.hsaFamily)} family, up from ${K.usd(L.hsaSelf)} and ${K.usd(L.hsaFamily)} in 2026. New HDHP minimums as well. Plan your 2027 enrollment.`,
  h1: 'HSA limits 2027: the final amounts and what changes from 2026',
  intro: `The IRS publishes HSA amounts months before retirement plan limits, and the 2027 figures are already official. The calculator below is set to 2027 and applies them to your coverage, age and months of eligibility.`,
  resume: `For 2027 the HSA contribution limit is ${K.usd(N.hsaSelf)} with self-only HDHP coverage and ${K.usd(N.hsaFamily)} with family coverage, up from ${K.usd(L.hsaSelf)} and ${K.usd(L.hsaFamily)} in 2026. These are final amounts, set by Rev. Proc. 2026-24, not estimates. The catch-up for account holders aged 55 or over stays at ${K.usd(N.hsaCatchUp)}. To qualify in 2027, a plan needs a deductible of at least ${K.usd(N.hdhpMinDeductible.self)} self-only or ${K.usd(N.hdhpMinDeductible.family)} family and out-of-pocket costs of no more than ${K.usd(N.hdhpMaxOutOfPocket.self)} and ${K.usd(N.hdhpMaxOutOfPocket.family)}. Someone aged 58 with family coverage all of 2027 can put in ${K.usd(fam.total)}; a 40-year-old covered self-only for nine months has ${K.usd(nine.total)}. Spreading the self-only maximum over 26 paychecks means ${K.usd(pc27)} each instead of ${K.usd(pc26)}, an amount to set during the fall enrollment. The 2027 401(k) and IRA limits, by contrast, are not out yet.`,
  body: (h) => `
<h2>2026 and 2027 side by side</h2>
${h.table(['Amount', '2026', '2027', 'Change'], [
  ['HSA limit, self-only', K.usd(L.hsaSelf), K.usd(N.hsaSelf), diff(L.hsaSelf, N.hsaSelf)],
  ['HSA limit, family', K.usd(L.hsaFamily), K.usd(N.hsaFamily), diff(L.hsaFamily, N.hsaFamily)],
  ['Catch-up at 55 or over', K.usd(L.hsaCatchUp), K.usd(N.hsaCatchUp), 'none'],
  ['HDHP minimum deductible, self-only', K.usd(L.hdhpMinDeductible.self), K.usd(N.hdhpMinDeductible.self), diff(L.hdhpMinDeductible.self, N.hdhpMinDeductible.self)],
  ['HDHP minimum deductible, family', K.usd(L.hdhpMinDeductible.family), K.usd(N.hdhpMinDeductible.family), diff(L.hdhpMinDeductible.family, N.hdhpMinDeductible.family)],
  ['HDHP out-of-pocket maximum, self-only', K.usd(L.hdhpMaxOutOfPocket.self), K.usd(N.hdhpMaxOutOfPocket.self), diff(L.hdhpMaxOutOfPocket.self, N.hdhpMaxOutOfPocket.self)],
  ['HDHP out-of-pocket maximum, family', K.usd(L.hdhpMaxOutOfPocket.family), K.usd(N.hdhpMaxOutOfPocket.family), diff(L.hdhpMaxOutOfPocket.family, N.hdhpMaxOutOfPocket.family)],
], `Rev. Proc. 2025-19 for 2026 and Rev. Proc. 2026-24 for 2027, read on ${K.day(K.P.retrieved_at)}.`, ['l', 'r', 'r', 'r'])}
<p>The family limit rises by ${K.usd(N.hsaFamily - L.hsaFamily)}, the self-only limit by ${K.usd(N.hsaSelf - L.hsaSelf)}, which is about ${K.dec((N.hsaSelf / L.hsaSelf - 1) * 100, 1)} %. The figures come from section 3.01 of ${h.src('rp_2026_24', 'Rev. Proc. 2026-24')}, the HSA-only revenue procedure the IRS releases each spring.</p>
<h2>Why the HSA figures come out first</h2>
<p>Section 223(g) of the code requires the IRS to publish the next year's HSA amounts by June 1, using inflation data through March. The 401(k), IRA and catch-up amounts for 2027 depend on data through September and arrive in an IRS notice ${plansOut ? 'that is now out' : `expected in ${N.expected}; they are not announced yet`}. The health FSA cap for 2027 plan years is ${fsa27}. This site does not show projections for any of them: see ${h.a('401k-limits-2027', '401(k) limits 2027')} and ${h.a('ira-limits-2027', 'IRA limits 2027')} for the status.</p>
<h2>Your 2027 limit</h2>
<p>The rules for using these amounts do not change. Your limit is still earned month by month, one twelfth for each month you are eligible on the 1st, and the catch-up follows the same proration. A 40-year-old who starts an HDHP on April 1, 2027 has nine eligible months and ${K.usd(nine.total)} of room, unless the last-month rule is used. Employer deposits still count toward the same ceiling. The detailed rules, including Medicare and couples, are on ${h.a('hsa-contribution-limits', 'HSA contribution limits 2026')}.</p>
${h.mini('hsa', { t: 'Your 2027 limit for the months you will be covered', p: ['cov', 'm'], d: { y: '2027', cov: 'self', m: 9, by: 1987 } })}
<h2>What changes for open enrollment</h2>
<p>Most employers run benefits enrollment between October and December for a January 1 plan year, and the election you make sets your payroll HSA contributions for 2027. Three points are worth checking.</p>
<ol>
<li><strong>The per-paycheck amount.</strong> With 26 pay periods, the self-only maximum is ${K.usd(pc27)} a paycheck in 2027 against ${K.usd(pc26)} in 2026; for family coverage, ${K.usd(pf27)} against ${K.usd(pf26)}. An election carried over automatically from last year will not capture the increase.</li>
<li><strong>The employer's share.</strong> If your employer deposits a fixed amount, subtract it from the new limit before choosing your own election. A higher employer seed money in 2027 leaves you less room, not more.</li>
<li><strong>The plan's deductible.</strong> A plan whose deductible sat exactly at the 2026 minimum of ${K.usd(L.hdhpMinDeductible.self)} self-only would fall below the 2027 floor of ${K.usd(N.hdhpMinDeductible.self)} unless the insurer raises it. Plans usually adjust, but an HDHP that does not qualify means no HSA contributions at all for the months it covers you.</li>
</ol>
${h.mini('hsa', { t: 'Room left in 2027 after your employer’s deposit', p: ['er'], d: { y: '2027', cov: 'family', er: 1000, by: 1979 } })}
<h2>Turning 55 or 65 in 2027</h2>
<p>Anyone born in 1972 reaches 55 during 2027 and can add the ${K.usd(N.hsaCatchUp)} catch-up for the whole year, even with a December birthday. At the other end, people born in 1962 reach 65 in 2027; those who enroll in Medicare stop contributing from the first month of coverage, so a Medicare start on July 1, 2027 leaves six months, or ${K.usd(K.hsa('self', 65, 6, 0, false, '2027').total)} with self-only coverage and the catch-up. Delaying Social Security and Medicare Part A keeps the HSA open longer.</p>
<h2>Plan years that do not start in January</h2>
<p>HSA contribution limits always follow the calendar year, whatever your health plan's year. The HDHP thresholds work differently: for a plan year starting, say, July 1, the deductible test uses the amounts in effect when that plan year begins. A plan year starting in mid-2026 therefore runs on the 2026 thresholds until it renews in 2027, while your contributions switch to the 2027 limit on January 1.</p>
<h2>Other items in Rev. Proc. 2026-24</h2>
<p>The 2025 tax law added a rule that a direct primary care arrangement, paid by a flat monthly fee to a primary care practice, is not treated as other health coverage, as long as the monthly fees stay under a cap. That rule started with months after December 31, 2025, and Rev. Proc. 2026-24 states the fee caps for 2027 without any increase. The procedure also sets the 2027 amount that can be made newly available in an excepted benefit HRA. Neither changes how much you may put in an HSA.</p>
<h2>2026 contributions are still open</h2>
<p>The 2027 amounts start on January 1, 2027. Until April 15, 2027 you can still make contributions for 2026, within the ${K.usd(L.hsaSelf)} or ${K.usd(L.hsaFamily)} limit of that year. When you deposit money between January and April 2027, tell the custodian which year it is for. Someone who used the last-month rule in December 2026 must stay eligible through December 31, 2027 to keep the full 2026 amount.</p>
`,
  faqs: [
    { q: 'Can I make a 2027 HSA contribution in December 2026?', a: `No. A deposit made in December 2026 counts for 2026, within the ${K.usd(L.hsaSelf)} or ${K.usd(L.hsaFamily)} limit of that year. Contributions for 2027 can be made from January 1, 2027 until April 15, 2028, and only for the months you are eligible. Payroll elections chosen this fall start with the first paycheck of 2027.` },
    { q: 'What deductible does an HDHP need to qualify for an HSA in 2027?', a: `At least ${K.usd(N.hdhpMinDeductible.self)} for self-only coverage and ${K.usd(N.hdhpMinDeductible.family)} for family coverage, with out-of-pocket costs (deductibles, copays and coinsurance, but not premiums) capped at ${K.usd(N.hdhpMaxOutOfPocket.self)} and ${K.usd(N.hdhpMaxOutOfPocket.family)}. A plan meeting the 2026 floor but not the 2027 one would no longer qualify from its 2027 plan year.` },
    { q: 'How much should I put in per paycheck to reach the 2027 HSA maximum?', a: `With 26 pay periods and no employer money, ${K.usd(pc27)} a paycheck for self-only coverage and ${K.usd(pf27)} for family coverage. If you are 55 or older, add ${K.usd(N.hsaCatchUp / 26)} a paycheck for the catch-up. Subtract any employer contribution first, since it counts toward the same limit.` },
    { q: 'How much can a 58-year-old with family coverage contribute to an HSA in 2027?', a: `${K.usd(fam.total)} for a full year of family HDHP coverage: the ${K.usd(N.hsaFamily)} family limit plus the ${K.usd(N.hsaCatchUp)} catch-up. If the spouse is also 55 or over, the spouse can add a separate catch-up to a separate HSA. Employer contributions reduce what you can still deposit yourself.` },
  ],
  tool: 'hsa',
  toolArg: { y: '2027' },
  related: ['hsa-contribution-limits', 'fsa-contribution-limits', 'ira-limits-2027', '401k-limits-2027'],
  sources: ['rp_2026_24', 'rp_2025_19', 'pub969'],
});
