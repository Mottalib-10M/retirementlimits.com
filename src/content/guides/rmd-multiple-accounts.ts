import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const fx = (x: number) => x.toFixed(1);
// Worked case: owner turning 76 in 2026 with two traditional IRAs ($300,000 and $120,000) and an old 401(k) ($250,000).
const f = K.uniform(76)!;
const i1 = 300000 / f, i2 = 120000 / f, k1 = 250000 / f;
const all = K.tool('accounts', { i1: 300000, i2: 120000, k1: 250000, age: 76 });

export default defineGuide({
  id: 'rmd-multiple-accounts',
  group: 'rmd',
  order: 90,
  slug: 'rmd-multiple-accounts',
  nav: 'RMD with several accounts',
  card: 'Which RMDs can be combined, and which must come from each plan',
  title: 'RMD Multiple Accounts 2026: Which Ones You Can Combine',
  description: 'RMD multiple accounts 2026: IRA RMDs can be added up and taken from any IRA, 403(b)s among themselves, but each 401(k) pays its own. See your total by account.',
  h1: 'RMD with several accounts: what can be combined',
  intro: 'Enter two IRA balances, an old 401(k) and your age. The calculator shows the IRA total you can take from either IRA, and the 401(k) amount that must come from the plan itself.',
  resume: `When you own several retirement accounts, each one has its own required minimum distribution, computed on its own December 31 balance with the same life expectancy factor. What differs is where the money may come from. RMDs of traditional IRAs, including SEP and SIMPLE IRAs, can be added together and taken from any one or several of your IRAs. RMDs of 403(b) contracts can be combined the same way, but only among 403(b)s. Each 401(k), 457(b) or other employer plan must pay its own RMD; an IRA withdrawal never satisfies it. Inherited accounts are kept apart from your own, and grouped only with accounts inherited from the same person. An owner turning 76 in 2026, with ${K.usd(300000)} and ${K.usd(120000)} in two IRAs and ${K.usd(250000)} in an old 401(k), divides each balance by ${fx(f)}: ${K.usd(i1 + i2)} to take from the IRAs in any mix, and ${K.usd(k1)} from the 401(k).`,
  body: (h) => `
<h2>The aggregation rules</h2>
${h.table(['Accounts', 'Combine the RMDs?', 'Where the money comes from'], [
  ['Your traditional, rollover, SEP and SIMPLE IRAs', 'yes', 'any one or more of these IRAs'],
  ['Your 403(b) contracts', 'yes, among 403(b)s only', 'any one or more of your 403(b)s'],
  ['Your 401(k), profit sharing or 457(b) plans', 'no', 'each plan pays its own RMD'],
  ['IRAs inherited from the same person', 'yes, among themselves', 'any of those inherited IRAs'],
  ['IRAs inherited from different people', 'no', 'each group separately'],
  ['Your Roth IRAs, Roth 401(k) since 2024', 'no RMD', 'not applicable'],
], 'Publication 590-B (2025); 26 CFR 1.408-8 and 1.403(b)-6; IRS RMD FAQs.', ['l', 'l', 'l'])}
<p>The rules come from the regulations, summarized in the IRS ${h.src('rmd_faq', 'RMD FAQs')}. The order matters: first compute each account's RMD, then decide where to take the total. A spouse's IRA is never combined with yours, since each of you is a separate owner.</p>
<h2>A worked example</h2>
${h.table(['Account', 'Balance Dec. 31, 2025', 'Factor at 76', 'RMD', 'Can come from'], [
  ['Traditional IRA A', K.usd(300000), fx(f), K.usd(i1), 'IRA A or B'],
  ['Traditional IRA B', K.usd(120000), fx(f), K.usd(i2), 'IRA A or B'],
  ['Old employer 401(k)', K.usd(250000), fx(f), K.usd(k1), 'the 401(k) only'],
  ['Total', K.usd(670000), '', all.value, ''],
], 'Uniform Lifetime Table, 26 CFR 1.401(a)(9)-9(c). Computed by the calculator on this page.', ['l', 'r', 'r', 'r', 'l'])}
<p>The owner can take the full ${K.usd(i1 + i2)} from IRA A and leave IRA B untouched, or split it in any proportion. Taking ${K.usd(i1 + i2 + k1)} from the IRAs and nothing from the 401(k) would still leave a shortfall of ${K.usd(k1)} in the plan, subject to the excise tax, even though the total withdrawn is right (${h.a('missed-rmd-penalty', 'missed RMD penalty')}).</p>
${h.mini('accounts', { t: 'Your own mix of IRAs and an old 401(k)', p: ['i1', 'k1'], d: { i2: 0, age: 78 } })}
<h2>Why people consolidate</h2>
<p>Every separate employer plan adds a separate RMD to track, often with a custodian that sends its own forms. Rolling old 401(k)s into one IRA before the RMD age brings everything under the IRA aggregation rule: one total, taken from whichever IRA is most convenient. Once RMDs have started, a rollover is still possible, but the year's RMD must leave the plan before the rest can be rolled, because an RMD cannot be rolled over. Keeping a plan can have reasons too: the still-working exception for the current employer, creditor protection or institutional fund prices. The choice is yours; the rules above say what each choice requires.</p>
<h2>Picking which IRA to draw from</h2>
<p>Because any IRA can pay the combined amount, the choice of account is a small planning tool. Some owners draw from the account invested in cash or bonds to avoid selling stocks after a fall. Others empty the smallest account first to reduce the number of statements. An IRA that holds an asset hard to sell, like a private placement, can be left alone while another IRA covers its RMD. Whatever the choice, all the IRA RMDs added together must be out by December 31.</p>
<h2>Annuities, small balances and statements</h2>
<p>An annuity contract bought inside an IRA follows its own payment rules, and its payments count toward the RMD of that contract only, unless you use the special rule of Publication 590-B that combines the annuity's value with the rest of the IRA. A very small IRA still has an RMD: there is no minimum balance below which the requirement disappears, so a forgotten account of a few thousand dollars must be counted in the IRA total. Custodians report each account's year-end value on Form 5498 and, for IRAs, tell you by January 31 that an RMD is due, often with the amount. They do not know about your other IRAs: a custodian's figure is the RMD of its account, not of your total, and the choice of where to take it stays with you.</p>
<p>A missed account is the most common reason for a shortfall among people with several IRAs. Listing every account with its December 31 value each January, then adding the RMDs, takes a few minutes and protects against the excise tax. The calculator above holds two IRAs and one plan; with more accounts, compute each one and add them up in the same way.</p>
<h2>Joint table on some accounts only</h2>
<p>The factor depends on the beneficiary of each account. If your spouse, more than 10 years younger, is the sole beneficiary of IRA A while your children are named on IRA B, IRA A uses the joint table and IRA B the Uniform table. You add the two RMDs computed with different factors and take the sum from either IRA (${h.a('joint-life-expectancy-table', 'joint table')}).</p>
${h.mini('rmd', { t: 'One account, with its own beneficiary', p: ['bal', 'sp'], d: { by: 1950, sb: 1963 } })}
<h2>Inherited accounts on top of your own</h2>
<p>An inherited IRA has its own clock and its own factor, set by the beneficiary rules, and is never added to your own IRAs. If you inherited two IRAs from the same parent, their RMDs can be combined with each other; an IRA from a parent and another from an aunt cannot (${h.a('inherited-ira-rmd', 'inherited IRA rules')}). A charitable gift made directly from one IRA can cover RMDs of your other IRAs as well, since the total is shared (${h.a('qualified-charitable-distribution', 'QCD')}).</p>
`,
  faqs: [
    { q: 'Can I take all my IRA RMDs from just one IRA?', a: 'Yes. Compute the RMD of each traditional, rollover, SEP and SIMPLE IRA you own, add them up, and take the total from one IRA or from several in any proportion. The rule covers only IRAs you own as the original owner; inherited IRAs are combined only with others inherited from the same person.' },
    { q: 'Can my IRA withdrawal cover the RMD of my old 401(k)?', a: 'No. Each 401(k), profit sharing or 457(b) plan must distribute its own RMD to you. Taking extra from an IRA leaves the plan short, and the shortfall is subject to the excise tax. Rolling the 401(k) into an IRA before your RMD year avoids tracking a separate plan amount.' },
    { q: 'Can I combine 403(b) RMDs with my IRA RMDs?', a: 'No. RMDs from several 403(b) contracts can be added together and taken from any of those 403(b)s, but not from an IRA, and IRA RMDs cannot be taken from a 403(b). The two groups follow the same idea of aggregation, each within its own type of account.' },
    { q: 'Do I need a separate RMD for each of my Roth IRAs?', a: 'No. Roth IRAs have no required distributions while the owner is alive, and since 2024 designated Roth accounts in 401(k) and 403(b) plans have none either. Only beneficiaries who inherit a Roth account have distribution rules to follow, and pre-tax money in the same 401(k) keeps its own RMD.' },
  ],
  tool: 'accounts',
  toolArg: { i1: 300000, i2: 120000, k1: 250000, age: 76 },
  related: ['rmd-calculator', 'joint-life-expectancy-table', 'inherited-ira-rmd', 'qualified-charitable-distribution'],
  sources: ['pub590b', 'rmd_faq', 'ecfr_tables'],
});
