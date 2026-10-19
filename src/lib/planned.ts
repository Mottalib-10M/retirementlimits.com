/** Every page id the site is meant to have (id = file name = URL slug). Content tests accept links to these ids
 *  while pages are being written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  // 401(k) and work plans
  '401k-contribution-limits', 'max-401k-contribution', 'catch-up-contributions', 'super-catch-up-60-63', 'roth-catch-up-rule', 'roth-401k-limits',
  'employer-401k-contribution-limit', 'solo-401k-contribution-limits', '403b-contribution-limits', '457b-contribution-limits', 'simple-ira-contribution-limits', 'sep-ira-contribution-limits',
  // IRA and Roth IRA
  'ira-contribution-limits', 'roth-ira-income-limits', 'roth-ira-married-filing-jointly', 'traditional-ira-deduction-limits', 'spousal-ira', 'ira-vs-401k',
  // HSA and FSA
  'hsa-contribution-limits', 'fsa-contribution-limits', 'dependent-care-fsa-limit',
  // RMDs
  'rmd-calculator', 'rmd-table', 'rmd-age', 'joint-life-expectancy-table', 'inherited-ira-rmd', 'missed-rmd-penalty', 'first-rmd-deadline', 'qualified-charitable-distribution', 'rmd-multiple-accounts',
  // 2027 and past years
  '401k-limits-2027', 'ira-limits-2027', 'hsa-limits-2027', '401k-limits-by-year',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);
