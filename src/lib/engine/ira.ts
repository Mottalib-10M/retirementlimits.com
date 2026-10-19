/**
 * IRA limits: the yearly cap shared by traditional and Roth IRAs, the Roth phase-out (Publication 590-A,
 * Worksheet 2-2) and the phase-out of the traditional IRA deduction (Worksheet 1-2), with 2026 amounts
 * from Notice 2025-67. Rounding: up to the next multiple of $10, and $200 when the result is above $0 but
 * below $200 (IRC § 408A(c)(3)(A) and § 219(g)(2)(B) and (C), as printed in Publication 590-A).
 */
import P from '../../data/params-2026.json';

export type Filing = 'single' | 'joint' | 'mfs' | 'mfsApart' | 'head';
export type Coverage = 'none' | 'you' | 'spouse' | 'both';
const L = P.limits['2026'];
export const iraAge = P.ages.catchUp;

/** Yearly IRA limit: $7,500 + $1,100 at 50 or over, never more than taxable compensation. */
export function iraLimit(age: number, compensation: number) {
  const nominal = L.ira + (age >= iraAge ? L.iraCatchUp : 0);
  return { nominal, limit: Math.max(0, Math.min(nominal, compensation)), cappedByPay: compensation < nominal };
}

/** Spousal IRA: a couple filing jointly can each contribute as long as their combined pay covers both. */
export function spousal(ageA: number, ageB: number, payA: number, payB: number) {
  const a = iraLimit(ageA, payA + payB);
  const b = iraLimit(ageB, Math.max(0, payA + payB - a.limit));
  return { a: a.limit, b: b.limit, total: a.limit + b.limit };
}

const roundUp10 = (x: number) => Math.ceil(x / 10 - 1e-9) * 10;
/** The $200 floor: a reduced limit above $0 but below $200 is raised to $200. */
const floor200 = (x: number) => (x > 0 && x < 200 ? 200 : x);

/** Phase-out range of a Roth IRA contribution for a filing status. */
export function rothRange(f: Filing): [number, number] {
  if (f === 'joint') return L.rothPhase.joint as [number, number];
  if (f === 'mfs') return L.rothPhase.mfs as [number, number];
  return L.rothPhase.single as [number, number];
}

/** Worksheet 2-2 alone, for any year: limit, MAGI and the phase-out range of that year. */
export function worksheet22(limit: number, magi: number, range: [number, number]) {
  const share = Math.min(1, Math.max(0, (magi - range[0]) / (range[1] - range[0])));
  return { share, reduced: share <= 0 ? limit : share >= 1 ? 0 : floor200(roundUp10(limit - limit * share)) };
}

export interface Reduced { limit: number; reduced: number; range: [number, number]; share: number; status: 'full' | 'reduced' | 'none'; otherIra: number }

/** Reduced Roth IRA contribution (Worksheet 2-2). `otherIra` = contributions to traditional IRAs this year. */
export function rothReduced(f: Filing, magi: number, age: number, compensation: number, otherIra = 0): Reduced {
  const range = rothRange(f);
  const lim = iraLimit(age, compensation).limit;
  const { share, reduced: w } = worksheet22(lim, magi, range);
  let reduced = w;
  reduced = Math.max(0, Math.min(reduced, lim - otherIra));
  return { limit: lim, reduced, range, share, status: share <= 0 ? 'full' : share >= 1 ? 'none' : 'reduced', otherIra };
}

/** MAGI at which the Roth contribution reaches zero, and the extra income that removes each $100. */
export const rothSlope = (f: Filing, age: number) => { const r = rothRange(f); const lim = iraLimit(age, Infinity).limit; return (r[1] - r[0]) / lim * 100; };

/** Deduction phase-out range for a traditional IRA contribution, or null when the deduction is not limited. */
export function deductRange(f: Filing, cov: Coverage): [number, number] | null {
  const youCovered = cov === 'you' || cov === 'both';
  const spouseCovered = cov === 'spouse' || cov === 'both';
  if (f === 'mfs' && (youCovered || spouseCovered)) return L.deductPhase.mfsCovered as [number, number];
  if (f === 'joint') {
    if (youCovered) return L.deductPhase.jointCovered as [number, number];
    if (spouseCovered) return L.deductPhase.spouseCovered as [number, number];
    return null;
  }
  // Single, head of household, or married filing separately having lived apart all year: only your own coverage counts.
  return youCovered ? (L.deductPhase.singleCovered as [number, number]) : null;
}

/** Deductible part of a traditional IRA contribution (Worksheet 1-2). */
export function deductible(f: Filing, cov: Coverage, magi: number, age: number, compensation: number, contribution?: number) {
  const lim = iraLimit(age, compensation).limit;
  const c = Math.min(contribution ?? lim, lim);
  const range = deductRange(f, cov);
  if (!range) return { deductible: c, limit: lim, range, status: 'full' as const, nondeductible: 0 };
  if (magi <= range[0]) return { deductible: c, limit: lim, range, status: 'full' as const, nondeductible: 0 };
  if (magi >= range[1]) return { deductible: 0, limit: lim, range, status: 'none' as const, nondeductible: c };
  const nominal = iraLimit(age, Infinity).nominal;
  const d = floor200(roundUp10(nominal * (range[1] - magi) / (range[1] - range[0])));
  const ded = Math.min(d, c);
  return { deductible: ded, limit: lim, range, status: 'reduced' as const, nondeductible: c - ded };
}

/** Saver's credit income ceiling of a filing status (credit itself not computed on this site). */
export const saversCeiling = (f: Filing) => (f === 'joint' ? L.saversCredit.joint : f === 'head' ? L.saversCredit.head : L.saversCredit.single);
