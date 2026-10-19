/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Calculators of the 2026 US contribution limits applied to one person: 401(k), 403(b) and 457(b) deferrals with the age 50 and age 60 to 63 catch-up and the mandatory Roth catch-up (Notice 2025-67), the reduced Roth IRA contribution and the deductible traditional IRA amount (Publication 590-A worksheets), HSA and FSA limits (Rev. Procs. 2025-19, 2026-24 and 2025-32), and required minimum distributions from the Uniform, Joint and Single Life tables of 26 CFR 1.401(a)(9)-9, including inherited accounts under the 10-year rule. 2027 plan and IRA limits are added the day the IRS publishes them. Independent site published by Radif Partners; general information, not personal financial advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
