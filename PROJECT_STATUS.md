# Gabriel CRM Project Status

This file is the shared handoff point between ChatGPT and Codex.

## Working rules

1. Read this file, `AGENTS.md`, recent commits, and the relevant GitHub issue before starting work.
2. Update this file after every meaningful work session with completed work, files changed, exact validation commands and results, blockers, deployment status, and next actions.
3. Commit and push finished work so ChatGPT can review repository-visible state.
4. Use a dedicated branch and pull request for substantial changes.
5. Never commit passwords, API keys, tokens, private client information, or other secrets.

## Status snapshot

- Last audited: 2026-07-23
- Audited branch: `main`
- HEAD before this status update: `c2c52815c8e42279ec13d090ea909f093a70ce28` (`Add shared ChatGPT and Codex handoff files`)
- Repository access: the connected GitHub account has pull and push permission.
- Current repository state: `main` contains `AGENTS.md` and `PROJECT_STATUS.md`, but the application and its supporting files are absent.
- Critical finding: commit `c2c5281` added the two handoff files and removed the previously tracked application, public pages, assets, documentation, templates, and Pages workflow. The prior application state is available in commit `e4c0b68a50b437f73df22a688ae004dd759671f2`.

## Completed work

### Product work present before the current HEAD

Recent commits before `c2c5281` show these completed features:

- Internal local-first Revenue Command Center at the repository root.
- Browser `localStorage` lead data, CSV import/export, and JSON backup/restore.
- Public Gabriel Impact Group homepage and free-review request intake flow.
- Public tools for warm-prospect intake, visibility snapshots, pricing/proposals, offer building, warm follow-up, test-record loading, and video-source setup.
- Public styling and JavaScript assets.
- Pages setup, QA, revenue-engine, public-site specification, and capital-referral guardrail documentation.
- CSV and JSON templates for import and test data.

### Issue #7 handoff work completed on 2026-07-23

- Read `AGENTS.md`, the prior `PROJECT_STATUS.md`, GitHub Issue #7, repository metadata, and the ten most recent commits.
- Audited current `main` paths against the file set removed by `c2c5281`.
- Identified and documented the accidental removal of the deployable application.
- Replaced the placeholder project status with this technical handoff.
- No product code was changed in this session.

## Files and features changed in this session

- `PROJECT_STATUS.md`: replaced the placeholder summary with the audited repository state, prior completed features, validation evidence, deployment target, blockers, and recovery actions.

## Validation commands and exact results

The audit used the authenticated GitHub connector because this Codex environment has no local checkout and neither `git` nor `gh` is installed.

- `gh --version` — failed: PowerShell reported that `gh` is not recognized.
- `git clone https://github.com/mikeroetker-alt/gabriel-crm.git C:\\Users\\miker\\OneDrive\\Documents\\gabriel-crm` — failed before cloning: PowerShell reported that `git` is not recognized.
- GitHub repository metadata lookup — passed: repository `mikeroetker-alt/gabriel-crm` exists, default branch is `main`, visibility is public, and the connected account has push access.
- GitHub issue lookup for Issue #7 — passed: issue found and its requested handoff scope was reviewed.
- GitHub file reads for `AGENTS.md` and `PROJECT_STATUS.md` at `main` — passed before this update.
- GitHub recent-commit lookup — passed: ten commits inspected; `c2c5281` was the current HEAD before this update.
- GitHub current-file checks at `main` for `README.md`, `.github/workflows/pages.yml`, `index.html`, `home/index.html`, `request/index.html`, `assets/funnel.css`, `assets/funnel.js`, `docs/PAGES_SETUP.md`, `docs/QA_CHECKLIST.md`, `tools/index.html`, and `templates/warm-prospect-import-template.csv` — all returned GitHub 404 Not Found.
- Build — not run: the buildable/static application files are absent from current `main`.
- Lint — not run: no lint configuration or application files are present on current `main`.
- Automated tests — not run: no test harness is present on current `main`.
- Browser smoke test — not completed: the application entry points are absent from current `main`.

## Deployment target

- Documented target from the pre-deletion repository state: GitHub Pages at `https://mikeroetker-alt.github.io/gabriel-crm/`.
- Documented deployment mode: deploy branch `main`, folder `/ (root)`.
- The prior GitHub Actions Pages workflow was manual-only; branch-based Pages deployment was recommended.
- Current deployment status: blocked/broken from the repository perspective because `main` has no `index.html`, public routes, assets, or Pages workflow. GitHub Pages settings themselves were not available through the current connector and remain unverified.

## Local-only and uncommitted work

- No `gabriel-crm` local checkout was found under the user profile during this session.
- Therefore no local working tree, untracked files, or uncommitted changes could be inspected.
- ChatGPT and the GitHub connector can see only committed repository state. Any work stored elsewhere locally must be identified and copied into a proper checkout before it can be reviewed.

## Blockers and unresolved problems

1. The deployable application was removed from `main` by `c2c5281`.
2. The current environment lacks `git` and GitHub CLI, preventing a normal local restore, full-file validation, and working-tree audit.
3. GitHub Pages configuration and live deployment health remain unverified.
4. No build, lint, automated-test, or browser smoke-test evidence exists for the restored application because recovery has not yet been performed.
5. Any local-only work outside this environment remains unknown.

## Next recommended actions

1. Recover the application files from `e4c0b68a50b437f73df22a688ae004dd759671f2` while preserving `AGENTS.md` and this `PROJECT_STATUS.md`. Use a dedicated recovery branch and pull request.
2. Review the recovery diff carefully to ensure it restores only the files removed by `c2c5281` and does not reintroduce secrets or private client information.
3. Install Git and GitHub CLI, or open the repository in an environment that already has them, then create a separate local checkout outside the Verlaine workspace.
4. Run the documented QA checklist against every restored route and exercise CSV import/export, JSON backup/restore, request email/copy behavior, and each tool.
5. Confirm GitHub Pages is configured for `main` and `/ (root)`, then smoke-test the root, `/home/`, `/request/`, and `/tools/` URLs.
6. Update this file with the recovery commit/PR, exact validation output, verified deployment state, remaining blockers, and the next action.

## OutreachAI read-adapter follow-up — 2026-08-14

### Completed work

- Recreated the repository-only change described for unavailable commit `32f92a1` on top of base commit `4e54963bd2b3968a2ff5494a85eef6beef9b8ef7`.
- Added a dependency-injected contacts adapter that constructs only `GET` requests and validates HTTP responses, pagination, totals, stable unique IDs, and optional pipeline aggregates.
- Added a synthetic contact envelope and seven contract tests; no credentials, private prospect data, production writes, outreach, or deployment were used.
- Documented the authenticated, sanitized response metadata needed before replacing the synthetic contract with a verified live contract.

### Files changed

- `.gitignore`
- `bridge/outreachai_adapter.mjs`
- `bridge/fixtures/contacts-page.synthetic.json`
- `bridge/AUTHENTICATED_CONTRACT_GAPS.md`
- `bridge/README.md`
- `test/outreachai_adapter.test.mjs`
- `package.json`
- `PROJECT_STATUS.md`

### Validation commands and exact results

- `npm test` — passed: 7 tests, 0 failures.
- `python3 -m py_compile bridge/scrape_outreach.py` — passed.
- `node --check bridge/import_contacts.mjs` — passed.
- `node --check bridge/outreachai_adapter.mjs` — passed.
- `git diff --check` — passed.

### Assumptions, blockers, and next actions

- Assumption: the synthetic endpoint and envelope are scaffolding, not claims about the unavailable authenticated production contract.
- Publication blocker: commit `32f92a1` was not present in this checkout and could not be fetched because outbound GitHub access returned HTTP 403, so its described repository-only changes were recreated against the stated base rather than copied from the object.
- Next: apply or review this committed diff through the connected GitHub API, then replace synthetic paths only after obtaining the non-secret metadata listed in `bridge/AUTHENTICATED_CONTRACT_GAPS.md`.

## OutreachAI tRPC translation follow-up — 2026-08-14

### Completed work

- Replaced the synthetic `/api/contacts` request assumption with the sanitized, verified read route `GET /api/trpc/contacts.list`.
- Added a translation function for the observed `result.data.json.contacts` plus `result.data.json.total` envelope.
- Normalized the verified live workflow field `status` to the bridge's internal `stage` field.
- Kept unverified pagination, filters, cursors, and aggregate response fields disabled; the adapter rejects unsupported options before issuing a request.
- Added a synthetic-only tRPC fixture containing no prospect data.
- Expanded the contract suite to 10 tests covering the legacy internal fixture, tRPC translation, GET-only route construction, rejection of unverified options, stable IDs, normalized workflow fields, malformed tRPC envelopes, optional legacy cursor validation, and optional legacy aggregate validation.
- Updated bridge documentation to distinguish verified tRPC metadata from remaining unknowns and to prohibit further live endpoint probing during repository-only work.
- Added a metadata-only authorized contract-capture template.
- Added an aggregate-only plan for reconciling the 1,508 Contacts-page count with the 1,395 Dashboard count without accessing prospect values.
- No live OutreachAI endpoint calls, production writes, outreach, deployments, credential changes, or prospect-value access were performed by ChatGPT during this follow-up.

### Files changed in this follow-up

- `bridge/outreachai_adapter.mjs`
- `test/outreachai_adapter.test.mjs`
- `bridge/fixtures/contacts-list-trpc.synthetic.json`
- `bridge/README.md`
- `bridge/AUTHENTICATED_CONTRACT_GAPS.md`
- `bridge/fixtures/authorized-contract-capture.template.json`
- `bridge/RECONCILIATION_PLAN.md`
- `PROJECT_STATUS.md`

### Validation performed by ChatGPT

- `npm test` against the exact new adapter/test/fixture contents — passed: 10 tests, 0 failures.
- `node --check bridge/outreachai_adapter.mjs` — passed.
- `node --check test/outreachai_adapter.test.mjs` — passed.
- Python probe compilation was not re-run in this ChatGPT follow-up because `bridge/scrape_outreach.py` was unchanged; Codex has been asked to run the full safe check set independently.

### Remaining verified unknowns / genuine blocker

Further live probing is intentionally stopped because the discovered tRPC route unexpectedly returned a production contact. The remaining live-contract details must come from an authorized metadata-only capture, not additional prospect-value inspection.

Still unknown: tRPC input/filter schema, pagination semantics, stable-ID scope/type guarantees, complete pipeline/status value rules, rate-limit/cache/version metadata, tenant scoping, aggregate endpoints, and count/deduplication/lifecycle semantics needed to resolve the 1,508-vs-1,395 discrepancy.

### Next safe action

- Codex independently reviews the current PR head, reruns the safe test/syntax/compile checks, checks for secrets/private prospect data, and fixes any repository-only defects it finds.
- Do not merge or deploy PR #14 without Michael's explicit approval.
- Do not call the live OutreachAI endpoint again unless an authorized metadata-only capture procedure is explicitly approved.
