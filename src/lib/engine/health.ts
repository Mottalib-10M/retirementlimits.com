/**
 * HSA (Rev. Proc. 2025-19 for 2026, Rev. Proc. 2026-24 for 2027, Publication 969) and FSA limits
 * (Rev. Proc. 2025-32 § 3.15 for the health FSA, Publication 15-B for dependent care).
 * HSA rule used: the monthly rule of Publication 969 (1/12 of the limit for each month you are eligible on the
 * first day), with the last-month rule as an option (eligible on December 1 = full year, if you stay eligible
 * through December 31 of the next year). Catch-up of $1,000 from the year you turn 55, also prorated by month.
 */
import P from '../../data/params-2026.json';
import type { Year } from './limits';

export type HsaCover = 'self' | 'family';
const H = (y: Year) => P.limits[y] as { hsaSelf: number; hsaFamily: number; hsaCatchUp: number; hdhpMinDeductible: { self: number; family: number }; hdhpMaxOutOfPocket: { self: number; family: number } };

export function hsa(cover: HsaCover, age: number, months = 12, employer = 0, lastMonthRule = false, y: Year = '2026') {
  const h = H(y);
  const m = lastMonthRule ? 12 : Math.max(0, Math.min(12, Math.round(months)));
  const base = (cover === 'family' ? h.hsaFamily : h.hsaSelf) * m / 12;
  const catchUp = age >= P.ages.hsaCatchUp ? h.hsaCatchUp * m / 12 : 0;
  const total = base + catchUp;
  // Employer contributions, including through a cafeteria plan, count toward the same limit (Pub. 969).
  const you = Math.max(0, total - employer);
  return { base, catchUp, total, employer, you, months: m, over: Math.max(0, employer - total), minDeductible: h.hdhpMinDeductible[cover], maxOop: h.hdhpMaxOutOfPocket[cover] };
}

/** Spouses with family coverage share one family limit; each spouse 55 or over adds his or her own catch-up to his or her own HSA. */
export function hsaCouple(ageA: number, ageB: number, shareA: number, y: Year = '2026') {
  const h = H(y);
  const a = h.hsaFamily * shareA + (ageA >= P.ages.hsaCatchUp ? h.hsaCatchUp : 0);
  const b = h.hsaFamily * (1 - shareA) + (ageB >= P.ages.hsaCatchUp ? h.hsaCatchUp : 0);
  return { a, b, total: a + b };
}

/** Health FSA: salary reduction limit per employee and per employer, and the carryover cap when the plan allows it. */
export function healthFsa(election: number, unused = 0) {
  const L = P.limits['2026'];
  return { limit: L.healthFsa, allowed: Math.min(election, L.healthFsa), over: Math.max(0, election - L.healthFsa), carry: Math.min(Math.max(0, unused), L.healthFsaCarryover), lost: Math.max(0, unused - L.healthFsaCarryover) };
}

/** Dependent care FSA: $7,500 a household ($3,750 married filing separately), never more than the lower earned income. */
export function dependentCare(mfs: boolean, earnedYou: number, earnedSpouse: number | null, expenses: number) {
  const L = P.limits['2026'];
  const cap = mfs ? L.dependentCareFsaMfs : L.dependentCareFsa;
  const earnedCap = earnedSpouse === null ? earnedYou : Math.min(earnedYou, earnedSpouse);
  const limit = Math.max(0, Math.min(cap, earnedCap));
  return { cap, earnedCap, limit, usable: Math.min(limit, expenses), limitedByEarnings: earnedCap < cap };
}
