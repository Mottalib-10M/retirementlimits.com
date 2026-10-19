/**
 * Required minimum distributions (Publication 590-B, 26 CFR 1.401(a)(9)-2 and -9).
 * Owner: balance at December 31 of the prior year ÷ Uniform Lifetime Table factor at the age reached in the
 * distribution year, or the Joint and Last Survivor factor when the sole beneficiary is a spouse more than
 * 10 years younger. Beneficiary: Single Life Table factor at the beneficiary's age in the year after death,
 * minus one each later year (non-spouse), and the 10-year deadline for designated beneficiaries who are not
 * eligible designated beneficiaries. Excise tax: 25 % of the shortfall, 10 % if corrected in the window.
 */
import P from '../../data/params-2026.json';
import T from '../../data/life-tables.json';

const R = P.rmd;
const U = T.uniform as Record<string, number>;
const S = T.single as Record<string, number>;
const J = T.joint as Record<string, Record<string, number>>;

/** Applicable age for a birth date (ISO "1959-05-12" or a year). 70.5 for those who reached 70½ before 2020. */
export function applicableAge(birth: string | number): number {
  const iso = typeof birth === 'number' ? `${birth}-07-01` : birth;
  for (const r of R.applicableAge) {
    if ((r.bornFrom === null || iso >= r.bornFrom) && (r.bornTo === null || iso <= r.bornTo)) return r.age;
  }
  return 75;
}
export const ageRule = (birthYear: number) => R.applicableAge.find((r) => (r.bornFrom === null || `${birthYear}-07-01` >= r.bornFrom) && (r.bornTo === null || `${birthYear}-07-01` <= r.bornTo))!;

/** First distribution year, and the required beginning date (April 1 of the next year). */
export function firstRmdYear(birthYear: number) {
  const age = applicableAge(birthYear);
  const year = Math.ceil(birthYear + age);
  return { age, year, rbd: `${year + 1}-${R.rbdMonthDay}`, rbdYear: year + 1 };
}

export const uniform = (age: number) => U[String(Math.min(120, Math.max(72, Math.floor(age))))] ?? null;
export const single = (age: number) => S[String(Math.min(120, Math.max(0, Math.floor(age))))];
/** Joint and Last Survivor factor; null if the spouse is not more than 10 years younger (then the Uniform table applies). */
export function joint(ownerAge: number, spouseAge: number): number | null {
  if (ownerAge - spouseAge <= R.jointYoungerBy) return null;
  const row = J[String(Math.min(120, ownerAge))];
  return row?.[String(Math.max(20, spouseAge))] ?? null;
}

export interface OwnerRmd { factor: number; table: 'Uniform Lifetime' | 'Joint and Last Survivor'; rmd: number; uniformFactor: number; uniformRmd: number; due: boolean; age: number }
/** Owner RMD for the year in which `age` is reached. `spouseAge` only matters if the spouse is the sole beneficiary. */
export function ownerRmd(balance: number, age: number, spouseAge: number | null = null, soleSpouse = false, birthYear?: number): OwnerRmd {
  const u = uniform(age) ?? U['72'];
  const j = soleSpouse && spouseAge !== null ? joint(age, spouseAge) : null;
  const factor = j ?? u;
  const due = birthYear === undefined ? age >= 73 : age >= applicableAge(birthYear);
  return { factor, table: j ? 'Joint and Last Survivor' : 'Uniform Lifetime', rmd: balance / factor, uniformFactor: u, uniformRmd: balance / u, due, age };
}

/** Year-by-year owner schedule from the first RMD year, with a growth rate you choose. */
export function schedule(balance: number, birthYear: number, startYear: number, years: number, growth: number, spouseBirthYear: number | null = null, soleSpouse = false) {
  const out: Array<{ year: number; age: number; start: number; factor: number; rmd: number; table: string }> = [];
  let b = balance;
  const first = firstRmdYear(birthYear).year;
  for (let y = Math.max(startYear, first); out.length < years; y++) {
    const age = y - birthYear;
    const r = ownerRmd(b, age, spouseBirthYear === null ? null : y - spouseBirthYear, soleSpouse, birthYear);
    out.push({ year: y, age, start: b, factor: r.factor, rmd: r.rmd, table: r.table });
    b = Math.max(0, (b - r.rmd) * (1 + growth));
  }
  return out;
}

export type Beneficiary = 'spouse' | 'minor' | 'disabled' | 'close' | 'other' | 'estate';
/** Eligible designated beneficiary: spouse, minor child of the owner, disabled, chronically ill, or not more than 10 years younger. */
export const isEdb = (b: Beneficiary) => b === 'spouse' || b === 'minor' || b === 'disabled' || b === 'close';

export interface Inherited { rule: string; annual: boolean; deadline: number | null; factor: number | null; rmd: number; plan: Array<{ year: number; factor: number | null; rmd: number; start: number }> }
/**
 * Inherited IRA RMD. `balance` = balance on December 31 of the year before `fromYear`; `deathYear` = owner's
 * death; `ownerAtRbd` = owner had reached the required beginning date; `benAgeYearAfter` = beneficiary's age
 * in the year after the death. A non-spouse beneficiary's life expectancy is fixed in the year after death
 * and reduced by one each year; a surviving spouse looks up Table I again each year (Pub. 590-B).
 */
export function inherited(balance: number, b: Beneficiary, deathYear: number, ownerAtRbd: boolean, benAgeYearAfter: number, fromYear: number, growth = 0): Inherited {
  const deadline = b === 'estate' ? (ownerAtRbd ? null : deathYear + 5) : isEdb(b) ? null : deathYear + R.tenYearRule;
  const lifeFactor = (k: number) => (b === 'spouse' ? single(benAgeYearAfter + k) : Math.max(1, single(benAgeYearAfter) - k));
  const annual = isEdb(b) || (b === 'other' && ownerAtRbd);
  const rule = b === 'estate' ? (ownerAtRbd ? 'owner’s remaining life expectancy' : '5-year rule') : isEdb(b) ? 'life expectancy (eligible designated beneficiary)' : ownerAtRbd ? '10-year rule with yearly RMDs' : '10-year rule, no yearly RMD before year 10';
  const plan: Inherited['plan'] = [];
  let bal = balance;
  const start = Math.max(fromYear, deathYear + 1);
  const end = deadline ?? start + 14;
  for (let y = start; y <= end; y++) {
    const k = y - (deathYear + 1);
    let f: number | null = annual && b !== 'estate' ? lifeFactor(k) : null;
    // Yearly RMDs in the 10-year window were waived through 2024 (Notice 2024-35); they apply from 2025.
    if (!isEdb(b) && y < R.annualRmdInTenYearFrom) f = null;
    let r = f ? Math.min(bal, bal / f) : 0;
    if (deadline !== null && y === deadline) { r = bal; f = null; }
    plan.push({ year: y, factor: f, rmd: r, start: bal });
    bal = Math.max(0, (bal - r) * (1 + growth));
  }
  const row = plan.find((p) => p.year === fromYear);
  return { rule, annual, deadline, factor: row?.factor ?? null, rmd: row?.rmd ?? 0, plan };
}

/** Excise tax on a missed RMD: 25 %, or 10 % when the shortfall is taken and reported within the correction window. */
export function excise(required: number, taken: number, corrected: boolean) {
  const short = Math.max(0, required - taken);
  const rate = corrected ? R.exciseTaxCorrected : R.exciseTax;
  return { short, rate, tax: short * rate, full: short * R.exciseTax, saved: short * (R.exciseTax - R.exciseTaxCorrected) };
}

/** Qualified charitable distribution: counts toward the RMD, excluded from income up to $111,000 in 2026. */
export function qcd(rmd: number, gift: number) {
  const cap = P.limits['2026'].qcd;
  const q = Math.min(gift, cap);
  return { qcd: q, coversRmd: Math.min(q, rmd), taxableRmd: Math.max(0, rmd - q), cap };
}

/** First year double-up: delaying the first RMD to April 1 puts two RMDs on one return. */
export function firstYearDouble(balanceEndPrior: number, birthYear: number, growth: number) {
  const f = firstRmdYear(birthYear);
  const r1 = ownerRmd(balanceEndPrior, f.age === 70.5 ? 71 : f.age, null, false, birthYear).rmd;
  const b2 = Math.max(0, balanceEndPrior * (1 + growth));
  const r2 = ownerRmd(b2, (f.age === 70.5 ? 71 : f.age) + 1, null, false, birthYear).rmd;
  return { ...f, first: r1, second: r2, both: r1 + r2 };
}
