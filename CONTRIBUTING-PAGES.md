# Écrire ou étoffer une page de Limit Ledger (us-retirement-limits)

Cette notice s'adresse aux agents qui écrivent les pages. Lis-la en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §5, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

**Le site** couvre les plafonds 2026 de l'épargne retraite et santé aux États-Unis :
- 401(k), 403(b) et 457(b), avec le catch-up à 50 ans, le catch-up de 60 à 63 ans et le Roth catch-up obligatoire ;
- 415(c), solo 401(k), SEP et SIMPLE ;
- IRA : plafond, montant Roth réduit, déduction d'un IRA traditionnel, IRA du conjoint ;
- HSA, FSA santé et FSA garde d'enfants ;
- RMD : tables uniforme, jointe et viagère, comptes hérités, pénalité, QCD.

Les pages 2027 sont prêtes pour l'annonce. Le site est en **anglais américain seulement**, sous `/en/`. L'éditeur est **Radif Partners** (jamais le nom d'une personne).

**L'angle** : le premier résultat Google imprime le chiffre de l'IRS ; ce site calcule le plafond de la personne. Il prend en compte :
- l'âge au 31 décembre ;
- les salaires FICA 2025 ;
- le revenu ajusté (MAGI), lu sur la feuille 2-2 de la Publication 590-A ;
- les tables du 26 CFR 1.401(a)(9)-9.

Les têtes de requête sont tenues par irs.gov et les gestionnaires de plans : on vise la traîne. Le rapport SERP est dans `~/Documents/GitHub/reports/us-retirement-limits-serp-2026-10-19.md`.

## Interdits

- Ne jamais présenter le site comme l'IRS, ni mettre un nom d'administration dans son nom ou son logo.
- Aucun lien vers un gestionnaire, un courtier, un conseiller ou un assureur (Fidelity, Vanguard, Schwab, Empower…).
- Aucun conseil personnalisé (« you should »).
- Aucun lien vers un site du portefeuille (`_trame/domaines-ovh.txt`), ni vers truetakehomepay.com, bridgeto59.com ou socialsecurityage.com.
- Liens externes : seulement des sources officielles (irs.gov, ecfr.gov, govinfo.gov), par `h.src(clé)` ou `h.ext(url, texte)`.
- **Un chiffre incertain ne se publie pas.** Tout montant vient du kit (`K.…`) ou d'un calcul du moteur.
- **Aucune projection 2027 présentée comme officielle.** Tant que `limits.2027.announced` vaut `false`, les montants 401(k), IRA, Roth et catch-up 2027 sont vides et s'affichent « not announced ».

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Plafonds 2026 des plans, des IRA et des fourchettes Roth et déduction, plus les montants 2025 | Notice 2025-67 (13 novembre 2025), IR-2025-111 | `src/data/params-2026.json` (`limits.2026`, `previous`) |
| Années 2023 à 2026 | Table COLA de l'IRS | `history` |
| Roth catch-up (150 000 $ de salaires FICA 2025) | Notice 2025-67, règlement final (IR-2025-91) | `limits.2026.rothCatchUpWageThreshold` |
| HSA 2026 et 2027, HDHP | Rev. Proc. 2025-19 et Rev. Proc. 2026-24 | `limits.2026`, `limits.2027` |
| FSA santé 3 400 $, report de 680 $ | Rev. Proc. 2025-32 § 3.15 | `limits.2026` |
| FSA garde 7 500 $ (3 750 $ en déclaration séparée) | Publication 15-B (2026) | `limits.2026` |
| Âges RMD, date du 1er avril, pénalité 25 %/10 %, règle des 10 ans | 26 CFR 1.401(a)(9)-2, Pub. 590-B, Notice 2024-35 | `rmd` |
| Tables d'espérance de vie | 26 CFR 1.401(a)(9)-9, chargées par `scripts/build-tables.py` | `src/data/life-tables.json` |
| Cotisations des indépendants (92,35 %, 12,4 % jusqu'à 184 500 $, 2,9 %, 20 % et 25 %) | Pub. 560, Topic 554 | `se` |

Les textes officiels extraits sont dans `research/sources/*.txt` : lis-les avant d'écrire une règle.

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`), id = slug = nom du fichier | `/en/<slug>/` |
| Accueil | `src/content/home.ts` + `src/components/HomePage.astro` | `/en/` |

La liste des pages est dans `src/lib/planned.ts`. **Modèle (copier la structure, jamais les phrases)** : `src/content/guides/roth-ira-income-limits.ts`.

Champs :
- `title` : 50 à 60 caractères, terme-clé en tête, contient 2026 (y compris sur les pages 2027).
- `description` : 150 à 160 caractères, contient 2026.
- `resume` : un paragraphe de 120 mots ou plus.
- `body` : 650 mots de prose ou plus, au moins un `h.mini`.
- `faqs` : 3 à 8 questions, réponses de 40 à 90 mots, question unique sur tout le site.
- `tool` et `toolArg` : une clé de `src/lib/tool-specs.ts`.

## Le kit

```ts
import { KIT as K } from '../../lib/kit';
K.P, K.L, K.L27                         // params, plafonds 2026, bloc 2027
K.deferral(plan, birthYear, pay, priorWages)   // { base, catchUp, total, tier, age, rothCatchUp }
K.rothReduced(f, magi, age, comp), K.worksheet22(limit, magi, range), K.deductible(f, cov, magi, age, comp)
K.hsa(cover, age, months, employer, lastMonthRule, '2026'|'2027'), K.healthFsa, K.dependentCare
K.ownerRmd(balance, age, spouseAge, soleSpouse, birthYear), K.schedule, K.inherited, K.firstRmdYear, K.excise, K.qcd
K.tool(kind, args)                      // lance un calculateur, renvoie sa carte
K.usd, K.pct, K.num, K.dec, K.day
```

## Contrôles

```bash
PAGE_FILES=rmd-table,spousal-ira npx vitest run tests/pages.test.ts
npx vitest run tests/pages.test.ts >/dev/null; python3 scripts/sim-pages.py --only rmd-table,spousal-ira
npx vitest run tests/engine.test.ts
```

Le serveur local tourne sur le port **5602**. Pour l'arrêter, passe par le port (`lsof -ti tcp:5602 | xargs kill`), jamais par `pkill -f`.

## Jour de l'annonce 2027 (mi-novembre 2026)

1. Lire la nouvelle Notice de l'IRS (« 2027 amounts relating to retirement plans and IRAs ») et le communiqué de presse.
2. Dans `params-2026.json > limits.2027` :
   - remplir chaque champ vide avec la valeur de la Notice : deferral, catchUp50, catchUp6063, total415c, compensationCap, hce, keyEmployee, gov457, simple, simpleApplicable, simpleCatchUp, simpleCatchUpApplicable, simpleCatchUp6063, ira, iraCatchUp, rothPhase, deductPhase, saversCredit, qcd, rothCatchUpWageThreshold ;
   - passer `announced` à `true` ;
   - ajouter la source (`notice_2026_xx`) dans `sources`, avec son URL.
3. Pour la FSA santé 2027, attendre la Rev. Proc. d'automne des ajustements d'inflation (section « health flexible spending arrangements »), puis remplir `healthFsa` et `healthFsaCarryover`.
4. Ajouter la colonne 2027 dans `history` et ajouter un test du moteur sur les nouveaux montants.
5. `npx vitest run`, `npm run build`, puis tous les contrôles. Les pages `401k-limits-2027`, `ira-limits-2027`, le registre de l'accueil et le calculateur `y2027` basculent seuls sur les montants officiels.
6. Mettre à jour `LAST_UPDATED` dans `src/data/site-config.ts`.

## Mise à jour annuelle

- **Novembre** : la Notice des plafonds de l'année suivante (procédure ci-dessus). Ensuite, renommer `params-<année>.json` et faire glisser `previous` et `history`.
- **Mai** : la Rev. Proc. HSA de l'année suivante.
- **Octobre et novembre** : la Rev. Proc. d'inflation (FSA santé).
- **RMD** : surveiller le règlement final sur l'âge des personnes nées en 1959. Le paragraphe (b)(2)(v) est encore réservé.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS.
- Ne pas toucher à `_trame` ni à la RECETTE.
- Laisser `GA4_ID` et `CLARITY_ID` vides.
- Pas de publicité tant que l'éditeur n'a rien décidé, et jamais de publicité de courtier ou de conseiller.
