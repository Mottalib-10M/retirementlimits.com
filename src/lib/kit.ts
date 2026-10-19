/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P, K.L, K.L27      params-2026.json, the 2026 limits, the 2027 block (nulls until announced)
 *   K.tool(kind, args)   runs a calculator of tool-specs.ts and returns its result card
 *   engine functions     limits (deferral, catchUp…), ira (rothReduced, deductible…), health (hsa…), rmd (ownerRmd…)
 *   formats              K.usd, K.pct, K.num, K.dec, K.day
 */
import P from '../data/params-2026.json';
import { usd, getTool, pct } from './tool-specs';
import { formatNumber, formatDecimal, displayDate } from './format';
import * as limits from './engine/limits';
import * as ira from './engine/ira';
import * as health from './engine/health';
import * as rmd from './engine/rmd';
import type { V } from './tool-types';

function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
export const KIT = {
  P, L: P.limits['2026'], L27: P.limits['2027'], tool,
  ...limits, ...ira, ...health, ...rmd,
  usd, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: (iso: string) => displayDate(iso, 'en-US'),
};
export type Kit = typeof KIT;
