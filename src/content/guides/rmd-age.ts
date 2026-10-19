import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const R = K.P.rmd;
const fx = (x: number) => x.toFixed(1);
const ageTxt = (a: number) => (a === 70.5 ? '70½' : String(a));
const rows = R.applicableAge.map((r) => [r.bornFrom ? K.day(r.bornFrom) : 'any date before', r.bornTo ? K.day(r.bornTo) : 'any later date', ageTxt(r.age), r.note]);
const y53 = K.firstRmdYear(1953), y59 = K.firstRmdYear(1959), y60 = K.firstRmdYear(1960), y58 = K.firstRmdYear(1958);

export default defineGuide({
  id: 'rmd-age',
  group: 'rmd',
  order: 30,
  slug: 'rmd-age',
  nav: 'RMD age by birth year',
  card: '73 or 75: your first RMD year and its April 1 deadline',
  title: 'RMD Age 2026: 73 or 75 Depending on Your Birth Year',
  description: `RMD age 2026: 73 if you were born from 1951 to 1959, 75 if born in 1960 or later. Find your first RMD year, its April 1 deadline and the still-working rule.`,
  h1: 'RMD age: 73 or 75, and the year your first RMD is due',
  intro: 'Pick your birth year: the tool gives the age at which required minimum distributions start, the first year they are due, and the latest date for the first one.',
  resume: `The age at which required minimum distributions start depends only on your date of birth. SECURE 2.0 raised it to 73 for people who reach 72 after 2022, that is people born from 1951 on, and to 75 for people born in 1960 or later. Owners born from July 1, 1949 to the end of 1950 started at 72, and those born before July 1, 1949 started at 70½. The law as written left people born in 1959 with two possible ages; the Treasury proposed 73 for them in July 2024, and the final rule of the same month kept that paragraph reserved. In 2026 the owners who reach their RMD age are those born in ${y53.year - 73}: their first RMD is for ${y53.year} and can wait until April 1, ${y53.rbdYear}. Someone born in 1960 has no RMD before ${y60.year}. Owners still working can usually delay RMDs from their current employer's plan.`,
  body: (h) => `
<h2>Birth date and RMD age</h2>
${h.table(['Born from', 'Born to', 'RMD age', 'Rule'], rows, 'IRC section 401(a)(9)(C) as amended by the SECURE Act (2019) and SECURE 2.0 (2022); 26 CFR 1.401(a)(9)-2(b)(2).', ['l', 'l', 'r', 'l'])}
<p>The regulation states the rule through the year you would reach each age. Applied to a birth year it gives a simple test: born in 1953, you are 73 in 2026, so 2026 is your first distribution year. Born in 1958, your first year is ${y58.year}. Born in 1960, it is ${y60.year}, the year you turn 75 (${h.src('ecfr_rmd_age', '26 CFR 1.401(a)(9)-2')}).</p>
${h.mini('rmdage', { t: 'Your first RMD year from your birth year', p: ['by'], d: {} })}
<h2>The 1959 question</h2>
<p>SECURE 2.0 was drafted with an overlap: a person born in 1959 turns 73 in 2032 and also reaches 74 in 2033, the year the age was due to move up. Read literally, both ages applied. The Treasury and the IRS addressed it in proposed regulations published in the ${h.src('fr_2024_14543', 'Federal Register on July 19, 2024')}: the applicable age is 73 for anyone born in 1959. The final regulations issued the same month did not include that paragraph; section 1.401(a)(9)-2(b)(2)(v) is printed as reserved. This site uses 73, the only answer in an official text, and gives ${y59.year} as the first year for that birth year. Congress could also fix the drafting in a later law. If you were born in 1959 there is no decision to make for several years, and this page will change if the rule does.</p>
<h2>The required beginning date</h2>
<p>The first RMD has a later deadline than the others: April 1 of the year after the year you reach your RMD age. That date is called the required beginning date. Every later RMD is due by December 31 of its own year. Waiting until April therefore places two distributions in the same calendar year, which matters for income tax and for Medicare premiums based on income. The trade-off is worked out on the ${h.a('first-rmd-deadline', 'first RMD page')}.</p>
<h2>The still-working exception</h2>
<p>For a 401(k), 403(b) or governmental 457(b) of the employer you still work for, the required beginning date can be April 1 of the year after you retire, if the plan allows it. Three limits apply. The exception does not cover IRAs, including SEP and SIMPLE IRAs, which follow your RMD age whatever your job. It does not cover plans of former employers. And it does not apply to an owner of more than 5 % of the business sponsoring the plan, who must start at the RMD age like an IRA owner. Rolling an old 401(k) into the plan of your current employer before your RMD age is one way to bring that money under the exception, if the plan accepts rollovers.</p>
${h.mini('rmd', { t: 'What you would owe if you were already retired', p: ['bal'], d: { by: 1953, sp: 'no', bal: 400000 } })}
<h2>Ages that moved three times in four years</h2>
<p>For decades the starting point was 70½, a half-year test that forced people to work out the date six months after their 70th birthday. The SECURE Act of December 2019 replaced it with 72 for anyone who had not reached 70½ by the end of 2019. SECURE 2.0, signed in December 2022, moved it to 73 from 2023 and schedules 75 for the generation born from 1960. Each change applied only to people who had not yet reached the previous age, which is why three different starting ages are in use at the same time among today's retirees. When a statement, an article or a relative mentions a different age, the question to ask is the year of the rule it relies on. The IRS keeps a summary of the current ages in its ${h.src('rmd_faq', 'RMD FAQs')}.</p>
<h2>Why the date of birth, not the age on January 1</h2>
<p>The rule looks at the calendar year in which you reach the age. Someone born on January 2, 1953 and someone born on December 30, 1953 both have 2026 as their first distribution year, and both read the Uniform Lifetime Table at 73, a factor of ${fx(K.uniform(73)!)}. The only half-year rule left is the old 70½ test, which concerns people born before July 1, 1949, all of whom have been taking RMDs for years.</p>
<h2>Accounts that never reach an RMD age</h2>
<p>A Roth IRA has no RMD during the owner's life, and since 2024 neither does a designated Roth account in a 401(k) or 403(b). Converting pre-tax money to Roth before your RMD age reduces the balance that RMDs will apply to, at the price of income tax in the conversion years. After the RMD age, the year's RMD must be taken before any conversion. Beneficiaries follow different rules, whatever their own age (${h.a('inherited-ira-rmd', 'inherited accounts')}).</p>
`,
  faqs: [
    { q: 'I was born in 1959. Is my RMD age 73 or 75?', a: 'The only official answer is 73, from the proposed regulations of July 2024, which treat 1959 as the last birth year with an RMD age of 73. The final rule left that paragraph reserved, so it could still change before your first RMD year, 2032. This site uses 73 and will update the page if a final text says otherwise.' },
    { q: 'Can I delay RMDs from my 401(k) if I keep working past 73?', a: 'Usually, for the plan of the employer you still work for, if the plan document allows it and you do not own more than 5 % of the company. Your required beginning date becomes April 1 of the year after you retire. The delay never applies to IRAs, SEP IRAs or SIMPLE IRAs, or to plans of former employers.' },
    { q: 'Who has to take a first RMD for 2026?', a: `Owners born in 1953, who turn 73 in 2026. Their first RMD can be taken during 2026 or as late as April 1, 2027, and the RMD for 2027 is then due by December 31, 2027. People born in 1954 through 1959 start in the year they turn 73, and those born in 1960 or later at 75.` },
    { q: 'If I already started RMDs at 72, can I stop until 73?', a: 'No. Owners who reached their required beginning date under an earlier rule keep taking RMDs every year. The higher ages only apply to people who had not yet reached the previous RMD age when the law changed. An owner born in 1950 who started at 72 continues with the Uniform Lifetime Table factor for each new age.' },
  ],
  tool: 'rmdage',
  toolArg: { by: 1959 },
  related: ['first-rmd-deadline', 'rmd-calculator', 'rmd-table', 'qualified-charitable-distribution'],
  sources: ['ecfr_rmd_age', 'fr_2024_14543', 'pub590b', 'rmd_faq'],
});
