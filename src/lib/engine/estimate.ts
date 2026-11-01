/**
 * Our estimate of the 2027 plan and IRA limits (params-2026.json > estimate2027). NOT an IRS figure: it applies
 * the indexing formulas of the code to the BLS indexes and rounds down as the code does. Back-tested against the
 * official 2024 to 2026 limits (tests/engine.test.ts). Pages show it only while limits.2027.announced is false.
 */
import P from '../../data/params-2026.json';

const E = P.estimate2027;
type PlanKey = 'deferral' | 'catchUp50' | 'total415c' | 'compensationCap';
type Q3Year = keyof typeof E.cpiU_q3;
type CcYear = keyof typeof E.cCpiU_12mAug;

const q3 = (y: string) => {
  const v = E.cpiU_q3[y as Q3Year] as unknown as number[];
  return (v[0] + v[1] + v[2]) / 3;
};
const down = (x: number, step: number) => Math.floor(x / step + 1e-9) * step;

/** A section 415(d) limit for a year (2024 to 2027): base x CPI-U of the prior July-September quarter / base quarter. */
export function planEstimate(k: PlanKey, year = 2027) {
  const [base, baseQ, step] = E.planBases[k] as [number, string, number];
  const raw = (base * q3(String(year - 1))) / q3(baseQ);
  return { raw, value: down(raw, step), step };
}

/** The IRA limit (section 219(b)(5)(C), indexed through section 1(f)(3)) for a year (2025 to 2027). */
export function iraEstimate(year = 2027) {
  const [base, baseY, step] = E.iraBase as [number, string, number];
  const c = E.cCpiU_12mAug, u = E.cpiU_12mAug;
  const f = (c[String(year - 1) as CcYear] / c['2016']) * (u['2016'] / u[baseY as keyof typeof u]);
  const raw = base * f;
  return { raw, value: down(raw, step), step };
}

/** The IRA catch-up (section 219(b)(5)(C)(iii), indexed after 2023 in $100 steps) for a year (2025 to 2027). */
export function iraCatchUpEstimate(year = 2027) {
  const [base, baseY, step] = E.iraCatchUpBase as [number, string, number];
  const c = E.cCpiU_12mAug;
  const raw = (base * c[String(year - 1) as CcYear]) / c[baseY as CcYear];
  return { raw, value: down(raw, step), step };
}

/** All the 2027 estimates, with the margin above the rounding step (a small margin = a fragile estimate). */
export function estimates2027() {
  const plan = (k: PlanKey) => planEstimate(k, 2027);
  const all = {
    deferral: plan('deferral'), catchUp50: plan('catchUp50'), total415c: plan('total415c'), compensationCap: plan('compensationCap'),
    ira: iraEstimate(2027), iraCatchUp: iraCatchUpEstimate(2027),
  };
  return Object.fromEntries(Object.entries(all).map(([k, v]) => [k, { ...v, margin: v.raw - v.value }])) as Record<keyof typeof all, { raw: number; value: number; step: number; margin: number }>;
}
export const EST = { computedAt: E.computed_at, cpiReleased: E.cpiReleased, q3, inflationQ3: q3('2026') / q3('2025') - 1 };
