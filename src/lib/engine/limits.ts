/**
 * Workplace plan limits: 401(k), 403(b), governmental 457(b), SIMPLE, SEP and solo 401(k).
 * Every amount comes from params-2026.json (Notice 2025-67). Age = age reached by December 31 of the year,
 * which is how the code tests catch-up eligibility (§ 414(v): "attained age 50 before the close of the year";
 * § 414(v)(2)(E): "attain age 60, 61, 62 or 63" during the year).
 */
import P from '../../data/params-2026.json';

export type Year = '2026' | '2027';
/** 'simple' / 'simpleApplicable' = SIMPLE IRA (408(p)); 'simple401k' / 'simple401kApplicable' = SIMPLE 401(k) (401(k)(11)), same dollar limits. */
export type Plan = '401k' | '403b' | 'gov457' | 'simple' | 'simpleApplicable' | 'simple401k' | 'simple401kApplicable';
const baseKind = (p: Plan): Plan => (p === 'simple401k' ? 'simple' : p === 'simple401kApplicable' ? 'simpleApplicable' : p);
type Lim = (typeof P.limits)['2026'];

/** Limits of a year. 2027 entries are null until the IRS publishes its notice. */
export const lim = (y: Year = '2026') => P.limits[y] as unknown as Partial<Lim> & { announced?: boolean; expected?: string };
export const L = P.limits['2026'];
export const announced = (y: Year) => y === '2026' || !!(P.limits['2027'] as { announced?: boolean }).announced;

export const ageAtYearEnd = (birthYear: number, y: Year | number = 2026) => Number(y) - birthYear;

export type CatchTier = 'none' | 'standard' | 'super';
export function catchUpTier(age: number): CatchTier {
  if (age < P.ages.catchUp) return 'none';
  return age >= P.ages.superCatchUp[0] && age <= P.ages.superCatchUp[1] ? 'super' : 'standard';
}

/** Catch-up amount for a plan and an age (null if the year's figure is not announced). */
export function catchUp(planIn: Plan, age: number, y: Year = '2026'): number | null {
  const plan = baseKind(planIn);
  const t = catchUpTier(age);
  if (t === 'none') return 0;
  const l = lim(y) as Record<string, number | null | undefined>;
  if (plan === 'simple') return (t === 'super' ? l.simpleCatchUp6063 : l.simpleCatchUp) ?? null;
  if (plan === 'simpleApplicable') return (t === 'super' ? l.simpleCatchUp6063 : l.simpleCatchUpApplicable) ?? null;
  return (t === 'super' ? l.catchUp6063 : l.catchUp50) ?? null;
}

/** Base elective deferral limit of a plan. */
export function baseDeferral(planIn: Plan, y: Year = '2026'): number | null {
  const plan = baseKind(planIn);
  const l = lim(y) as Record<string, number | null | undefined>;
  if (plan === 'simple') return l.simple ?? null;
  if (plan === 'simpleApplicable') return l.simpleApplicable ?? null;
  if (plan === 'gov457') return l.gov457 ?? null;
  return l.deferral ?? null;
}

export interface Deferral {
  base: number; catchUp: number; total: number; tier: CatchTier; age: number;
  /** Capped by pay: you cannot defer more than your compensation. */
  cappedByPay: boolean;
  /** Catch-up must go in as Roth (prior-year FICA wages above the threshold). */
  rothCatchUp: boolean;
  rothThreshold: number;
}

/** Personal elective deferral limit (2026). `priorWages` = prior-year FICA wages from the same employer. */
export function deferral(plan: Plan, birthYear: number, pay: number, priorWages = 0, y: Year = '2026'): Deferral {
  const age = ageAtYearEnd(birthYear, y);
  const base = baseDeferral(plan, y) ?? 0;
  const c = catchUp(plan, age, y) ?? 0;
  const raw = base + c;
  const total = Math.max(0, Math.min(raw, pay));
  const thr = (lim(y).rothCatchUpWageThreshold as number | null) ?? L.rothCatchUpWageThreshold;
  // Only SEPs (408(k)) and SIMPLE IRAs (408(p)) are outside the Roth catch-up rule: § 414(v)(7)(C), Notice 2023-62
  // section III. A SIMPLE 401(k) is a 401(k) plan and is covered.
  const rothCatchUp = c > 0 && plan !== 'simple' && plan !== 'simpleApplicable' && priorWages > thr;
  return { base, catchUp: c, total, tier: catchUpTier(age), age, cappedByPay: raw > pay, rothCatchUp, rothThreshold: thr };
}

/** Years in which someone born in `birthYear` can use the age 60 to 63 catch-up. */
export const superCatchUpYears = (birthYear: number) => [0, 1, 2, 3].map((i) => birthYear + P.ages.superCatchUp[0] + i);
export const firstCatchUpYear = (birthYear: number) => birthYear + P.ages.catchUp;

/**
 * Section 415(c): total annual additions (your deferrals except catch-up, employer money, after-tax money)
 * are capped at the lesser of $72,000 and 100 % of pay. Catch-up contributions sit on top.
 */
export function annualAdditions(pay: number, employeeDeferral: number, employer: number, afterTax = 0, catchUpAmount = 0) {
  const cap = Math.min(L.total415c, pay);
  const counted = Math.max(0, employeeDeferral - catchUpAmount) + employer + afterTax;
  return { cap, counted, room: Math.max(0, cap - counted), over: Math.max(0, counted - cap), withCatchUp: cap + catchUpAmount };
}

/** Employer match: `rate` of pay matched up to `upTo` of pay (e.g. 50 % up to 6 %), on pay capped at 401(a)(17). */
export function match(pay: number, deferralAmount: number, rate: number, upTo: number) {
  const p = Math.min(pay, L.compensationCap);
  const matched = Math.min(deferralAmount, p * upTo);
  return matched * rate;
}

/** Per-paycheck amount to reach a limit from the next paycheck on. */
export function perPaycheck(limit: number, already: number, remaining: number, pay: number, periods: number) {
  const left = Math.max(0, limit - already);
  const each = remaining > 0 ? left / remaining : 0;
  const payEach = pay / periods;
  return { left, each, pct: payEach > 0 ? each / payEach : 0, payEach };
}

/** Net earnings from self-employment, the self-employment tax and the compensation that plans use (Pub. 560). */
export function selfEmployed(profit: number) {
  const se = Math.max(0, profit) * P.se.netEarningsFactor;
  const tax = Math.min(se, L.wageBase) * P.se.ssRate + se * P.se.medicareRate;
  const half = tax / 2;
  const comp = Math.max(0, profit - half);
  return { se, tax, half, comp };
}

/** SEP IRA: 25 % of an employee's pay, or 20 % of a self-employed person's net earnings after half the SE tax. */
export function sep(pay: number, selfEmp: boolean) {
  const base = selfEmp ? selfEmployed(pay).comp : pay;
  const capped = Math.min(base, L.compensationCap);
  const rate = selfEmp ? P.se.selfEmployedRate : P.se.sepRate;
  const amount = Math.min(capped * rate, L.total415c);
  return { base, capped, rate, amount, limitedBy: capped * rate > L.total415c ? '415c' : base > L.compensationCap ? 'comp' : 'rate' };
}

/** Solo 401(k): deferral as the employee plus 20 % profit sharing as the employer, within 415(c). */
export function solo401k(profit: number, birthYear: number) {
  const s = selfEmployed(profit);
  const age = ageAtYearEnd(birthYear);
  const c = catchUp('401k', age) ?? 0;
  const employee = Math.min(L.deferral, s.comp);
  // Employer part: 20 % of net earnings, within what is left of 415(c) and of net earnings after the deferral.
  const employer = Math.min(Math.min(s.comp, L.compensationCap) * P.se.selfEmployedRate, Math.max(0, L.total415c - employee), Math.max(0, s.comp - employee));
  const catchUpAmt = Math.min(c, Math.max(0, s.comp - employee - employer));
  const total = Math.min(employee + employer, s.comp, L.total415c) + catchUpAmt;
  return { ...s, employee, employer, catchUp: catchUpAmt, total, age };
}

/** 457(b) of a state or local government stacks on a 401(k) or 403(b): two separate limits. */
export function stack457(birthYear: number, pay: number) {
  const a = deferral('403b', birthYear, pay);
  const b = deferral('gov457', birthYear, Math.max(0, pay - a.total));
  return { first: a, second: b, total: a.total + b.total };
}
