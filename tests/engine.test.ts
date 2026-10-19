/**
 * Engine tests: the worked examples printed by the IRS and the 2026 amounts of Notice 2025-67,
 * Rev. Proc. 2025-19, Rev. Proc. 2026-24 and Rev. Proc. 2025-32. A mistyped parameter fails the build.
 */
import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import T from '../src/data/life-tables.json';
import { deferral, catchUpTier, superCatchUpYears, annualAdditions, sep, solo401k, stack457, announced, lim } from '../src/lib/engine/limits';
import { rothReduced, worksheet22, deductible, iraLimit, spousal, deductRange } from '../src/lib/engine/ira';
import { hsa, healthFsa, dependentCare } from '../src/lib/engine/health';
import { applicableAge, firstRmdYear, ownerRmd, joint, uniform, single, inherited, excise, qcd } from '../src/lib/engine/rmd';
import { SPECS, getTool } from '../src/lib/tool-specs';

const L = P.limits['2026'];

describe('2026 amounts (Notice 2025-67, Rev. Procs. 2025-19, 2025-32, 2026-24)', () => {
  it('plan and IRA limits', () => {
    expect([L.deferral, L.catchUp50, L.catchUp6063, L.total415c, L.compensationCap]).toEqual([24500, 8000, 11250, 72000, 360000]);
    expect([L.ira, L.iraCatchUp, L.simple, L.simpleCatchUp, L.rothCatchUpWageThreshold]).toEqual([7500, 1100, 17000, 4000, 150000]);
    expect(L.rothPhase.single).toEqual([153000, 168000]);
    expect(L.rothPhase.joint).toEqual([242000, 252000]);
    expect(L.deductPhase.singleCovered).toEqual([81000, 91000]);
    expect(L.deductPhase.jointCovered).toEqual([129000, 149000]);
  });
  it('health accounts', () => {
    expect([L.hsaSelf, L.hsaFamily, L.hsaCatchUp, L.healthFsa, L.healthFsaCarryover, L.dependentCareFsa]).toEqual([4400, 8750, 1000, 3400, 680, 7500]);
    const y27 = P.limits['2027'];
    expect([y27.hsaSelf, y27.hsaFamily]).toEqual([4500, 9000]);
  });
  it('2027 plan and IRA limits stay empty until announced', () => {
    expect(announced('2027')).toBe(false);
    const l = lim('2027') as Record<string, unknown>;
    for (const k of ['deferral', 'catchUp50', 'catchUp6063', 'ira', 'total415c']) expect(l[k], k).toBeNull();
    expect(SPECS.y2027().run({ by: '1966', k: 'deferral' }).value).toMatch(/not announced/i);
  });
});

describe('workplace plans', () => {
  it('catch-up tiers by age at year end', () => {
    expect(catchUpTier(49)).toBe('none');
    expect(catchUpTier(50)).toBe('standard');
    expect(catchUpTier(60)).toBe('super');
    expect(catchUpTier(63)).toBe('super');
    expect(catchUpTier(64)).toBe('standard');
    expect(deferral('401k', 1963, 200000).total).toBe(35750);
    expect(deferral('401k', 1966, 200000).total).toBe(35750);
    expect(deferral('401k', 1962, 200000).total).toBe(32500);
    expect(deferral('401k', 1967, 200000).total).toBe(32500);
    expect(deferral('401k', 1977, 200000).total).toBe(24500);
    expect(deferral('401k', 1976, 200000).total).toBe(32500);
    expect(superCatchUpYears(1966)).toEqual([2026, 2027, 2028, 2029]);
  });
  it('deferral never exceeds pay', () => {
    expect(deferral('401k', 1980, 18000).total).toBe(18000);
  });
  it('mandatory Roth catch-up above $150,000 of 2025 wages, never for a SIMPLE IRA, yes for a SIMPLE 401(k)', () => {
    expect(deferral('401k', 1968, 160000, 150000).rothCatchUp).toBe(false);
    expect(deferral('401k', 1968, 160000, 150001).rothCatchUp).toBe(true);
    expect(deferral('simple', 1968, 160000, 200000).rothCatchUp).toBe(false);
    expect(deferral('simpleApplicable', 1968, 160000, 200000).rothCatchUp).toBe(false);
    // SIMPLE 401(k): covered by § 414(v)(7)(A); only SEPs and SIMPLE IRAs are excluded (Notice 2023-62).
    expect(deferral('simple401k', 1968, 160000, 200000).rothCatchUp).toBe(true);
    expect(deferral('simple401k', 1968, 160000, 200000).total).toBe(21000);
    expect(deferral('simple401kApplicable', 1968, 160000, 150000).rothCatchUp).toBe(false);
    expect(deferral('401k', 1990, 300000, 300000).rothCatchUp).toBe(false);
  });
  it('SIMPLE amounts', () => {
    expect(deferral('simple', 1970, 100000).total).toBe(21000);
    expect(deferral('simpleApplicable', 1970, 100000).total).toBe(21950);
    expect(deferral('simple', 1964, 100000).total).toBe(22250);
  });
  it('415(c) and plan stacking', () => {
    expect(annualAdditions(200000, 24500, 50000).over).toBe(2500);
    expect(annualAdditions(50000, 24500, 30000).cap).toBe(50000);
    expect(stack457(1980, 200000).total).toBe(49000);
  });
  it('SEP and solo 401(k) (Publication 560 rate table)', () => {
    expect(sep(100000, false).amount).toBe(25000);
    expect(sep(1000000, false).amount).toBe(72000);
    const s = sep(100000, true);
    expect(Math.round(s.amount)).toBe(18587);
    const o = solo401k(100000, 1980);
    expect(Math.round(o.total)).toBe(24500 + 18587);
  });
});

describe('IRAs (Publication 590-A)', () => {
  it('Worksheet 2-2, illustrated example: 2025, single, MAGI $151,000, limit $7,000 gives $6,540', () => {
    const pr = P.previous;
    expect(worksheet22(pr.ira, 151000, pr.rothPhase.single as [number, number]).reduced).toBe(6540);
  });
  it('2026 reduced Roth IRA contribution', () => {
    expect(rothReduced('single', 153000, 40, 100000).reduced).toBe(7500);
    expect(rothReduced('single', 160000, 40, 100000).reduced).toBe(4000);
    expect(rothReduced('single', 160500, 56, 100000).reduced).toBe(4300);
    expect(rothReduced('single', 167900, 40, 100000).reduced).toBe(200);
    expect(rothReduced('single', 168000, 40, 100000).reduced).toBe(0);
    expect(rothReduced('joint', 247000, 40, 300000).reduced).toBe(3750);
    expect(rothReduced('mfs', 5000, 40, 100000).reduced).toBe(3750);
  });
  it('IRA limit capped by compensation; spousal IRA', () => {
    expect(iraLimit(52, 100000).limit).toBe(8600);
    expect(iraLimit(30, 3000).limit).toBe(3000);
    expect(spousal(45, 45, 80000, 0).total).toBe(15000);
  });
  it('deduction phase-out (Worksheet 1-2)', () => {
    expect(deductRange('joint', 'none')).toBeNull();
    expect(deductible('single', 'you', 86000, 40, 100000).deductible).toBe(3750);
    expect(deductible('single', 'you', 92000, 40, 100000).deductible).toBe(0);
    expect(deductible('joint', 'spouse', 247000, 40, 100000).deductible).toBe(3750);
    expect(deductible('single', 'none', 500000, 40, 100000).deductible).toBe(7500);
  });
});

describe('HSAs and FSAs', () => {
  it('monthly rule, catch-up and employer money', () => {
    expect(hsa('self', 40).total).toBe(4400);
    expect(hsa('family', 56).total).toBe(9750);
    expect(hsa('self', 40, 6).total).toBe(2200);
    expect(hsa('self', 40, 6, 0, true).total).toBe(4400);
    expect(hsa('family', 40, 12, 1500).you).toBe(7250);
    expect(hsa('self', 40, 12, 0, false, '2027').total).toBe(4500);
  });
  it('health and dependent care FSA', () => {
    expect(healthFsa(4000, 900)).toMatchObject({ allowed: 3400, carry: 680, lost: 220 });
    expect(dependentCare(false, 70000, 4000, 12000).limit).toBe(4000);
    expect(dependentCare(true, 70000, 45000, 12000).limit).toBe(3750);
  });
});

describe('RMDs (Publication 590-B, 26 CFR 1.401(a)(9)-9)', () => {
  it('tables loaded as published', () => {
    const U = T.uniform as Record<string, number>;
    expect([U['72'], U['73'], U['75'], U['100'], U['120']]).toEqual([27.4, 26.5, 24.6, 6.4, 2]);
    expect(single(0)).toBe(84.6);
    expect(uniform(75)).toBe(24.6);
  });
  it('Pub. 590-B worked cases: $100,000 at 75 gives $4,065; with a spouse aged 64, $3,953', () => {
    expect(Math.round(ownerRmd(100000, 75).rmd)).toBe(4065);
    expect(joint(75, 64)).toBe(25.3);
    expect(Math.round(ownerRmd(100000, 75, 64, true).rmd)).toBe(3953);
    expect(joint(75, 65)).toBeNull();
  });
  it('applicable age by birth date', () => {
    expect(applicableAge('1949-06-30')).toBe(70.5);
    expect(applicableAge(1950)).toBe(72);
    expect(applicableAge(1951)).toBe(73);
    expect(applicableAge(1959)).toBe(73);
    expect(applicableAge(1960)).toBe(75);
    expect(firstRmdYear(1953)).toMatchObject({ age: 73, year: 2026, rbdYear: 2027 });
    expect(firstRmdYear(1960)).toMatchObject({ age: 75, year: 2035 });
  });
  it('inherited accounts: 10-year rule and eligible designated beneficiaries', () => {
    const a = inherited(300000, 'other', 2023, true, 48, 2026);
    expect(a.deadline).toBe(2033);
    expect(a.plan[a.plan.length - 1].year).toBe(2033);
    expect(a.factor).toBeCloseTo(single(48) - 2, 5);
    const b = inherited(300000, 'other', 2023, false, 48, 2026);
    expect(b.rmd).toBe(0);
    const c = inherited(300000, 'spouse', 2023, true, 70, 2026);
    expect(c.deadline).toBeNull();
    expect(c.factor).toBe(single(72));
  });
  it('excise tax and QCD', () => {
    expect(excise(20000, 5000, false).tax).toBe(3750);
    expect(excise(20000, 5000, true).tax).toBe(1500);
    expect(qcd(30000, 200000).qcd).toBe(111000);
  });
});

describe('every calculator runs on its defaults', () => {
  for (const k of Object.keys(SPECS)) it(k, () => {
    const spec = getTool(k);
    const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
    const out = JSON.stringify(spec.run(v));
    expect(out).not.toMatch(/NaN|undefined|Infinity/);
  });
});

describe('IRA compensation is W-2 box 1, after pre-tax deferrals (Pub. 590-A; W-2 instructions, box 1)', () => {
  it('401(k) and IRA calculator caps the IRA at pay minus the deferral', () => {
    const r = SPECS.both().run({ pay: 30000, by: '1980' });
    // $30,000 of pay, $24,500 deferred pre-tax: $5,500 of box 1 wages, so $5,500 of IRA room.
    expect(r.value).toBe('$30,000');
    const hi = SPECS.both().run({ pay: 120000, by: '1980' });
    expect(hi.value).toBe('$32,000');
  });
});
