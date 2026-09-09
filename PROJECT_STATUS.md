# Gabriel CRM Project Status

This file is the shared handoff point between ChatGPT and Codex.

## Email evidence recovery — 2026-09-09

- Observed: Otterly trial-confirmation email dated September 6; provider email advertises up to 50 trial prompts. This is dated account correspondence, not a fresh dashboard capacity check.
- Observed: September 6 provider-generated report notification for the fictional synthetic validation brand. Its example prompt explicitly names the fictional brand and asks about unverifiable certifications. Notification metrics cannot be used as unprompted market visibility, recommendations or real-client results; raw export and capture metadata still need inspection.
- Observed: technical clarification messages were sent September 4 and September 8. Exact-subject search returned those two sent messages and no reply. No matching checkpoint 5fff75d7 or codex_issue20 package was recovered in the targeted September email search. Search absence does not establish that no package exists elsewhere.
- Unresolved: shared observations across brand workspaces, run/failure metadata, paid-report reuse and post-cancellation retention rights, raw export contents, actual trial expiry. September 8 follow-up estimated expiry around September 13; this is not a provider-confirmed deadline.
- Next actionable provider input: authenticated access to the existing synthetic trial report and its raw export, followed by the outstanding written provider clarification. Do not create another trial or run prospect measurements to replace this evidence.
- No email sent, paid plan activated, private data exported or production system changed. This session changed documentation only; no additional tests were needed. Existing staging suite last passed 40 tests.

## Latest session — CRM evidence review and staging guards, 2026-09-09

- Reviewed current GitHub Issues #20/#22, Issue #22 comments, recently updated PRs, and the historical `crm-audit-c4739219` source-excerpt branch. Issue #20 remains open and last updated September 3; Issue #22 records the later CRM-use GO claim at checkpoint `5fff75d7`. Neither the inspected source branch nor the recent PR inventory supplies the implementation/acceptance package for that checkpoint. Current live CRM acceptance remains unresolved, not a newly established failure.
- Historical excerpts at `audit/c4739219/CRITICAL_CONTROL_EVIDENCE.md` show failed-event replay suppression and a mutating unsubscribe GET at the older checkpoint. Do not infer those defects persist in 5fff75d7, or patch a replacement CRM from excerpts.
- Fixed concrete defects in the available staging workflow: confirmation flags require boolean true; references require nonempty text; missing/malformed exception status blocks advancement; only evidence required for the current transition is copied, preserving identity/suppression and preventing injected later approvals. Cancellation remains possible while blocked. Successful progress clears stale missing-field diagnostics.
- Files changed: `pilot/workflow.mjs`, `test/pilot_workflow.test.mjs`, `PROJECT_STATUS.md`.
- Validation: `node --test` — 40 passed, 0 failed, including malformed confirmations, unknown exception state, evidence-field injection, malformed/inherited payloads and a complete synthetic lifecycle. `git diff --check` passed. These tests do not establish live CRM identity enforcement, delivery, webhook concurrency or approval authenticity.
- Smallest remaining CRM handoff: sanitized source/export for checkpoint 5fff75d7 (or the current successor), with source-to-deployment provenance, scenario-level AT-06/09/11/13/14 results, and AT-01 backup/rollback/migration/reconciliation evidence. No credentials or contacts needed. Recover original private cohort separately; do not rebuild it.
- No live CRM calls, production writes, sends, purchases, website edits or deployment. Existing FREE Snapshot to $197/month offer preserved.

## Latest session — two-day pilot sprint, 2026-09-08

- Mike authorized immediate work toward a reviewable pilot workflow within two focused days. Outreach, billing, public publishing, provider purchase, and production CRM changes remain disabled pending their existing approval and acceptance gates.
- Sent one authorized follow-up in the existing Otterly technical-evaluation email thread. It requests answers on shared observations, evidence/failure metadata, paid-client reporting and retention rights, and a no-cost sample or trial extension. No billing or purchase was authorized.
- Added `config/model-routing.mjs`: provider-flexible routing by role capability, validation status, quality, budget, fallback provider, and optional independent critic. Outcomes record provider, model, cost, latency, and acceptance result; source does not permanently bind model vendors or prices.
- Added `pilot/workflow.mjs`: fail-closed business verification, fact approval, evidence import, report review, Mike approval, and delivery states. Separate outreach eligibility requires verified email, named decision-maker, HTTPS source evidence, current unsuppressed state, no open exception, and Mike-specific approval.
- Added `pilot/otterly-import.mjs` and `tools/import-otterly-export.mjs`: manual JSON normalization without an API key, preserving nulls and row hashes, distinguishing prompted mentions, and marking unavailable run/location/model metadata. The supplied four-row fictional export normalized successfully; all four mentions were prompted and all four lack required audit metadata, so it remains ineligible for headline reporting.
- Added `tools/prepare-hvac-pilot.ps1`. It selected a private, ignored 20-row review cohort from 300 HVAC records and 49 unique valid-format email candidates. All 20 have contact name, company and phone; none has an HTTPS website/source in the master file, zero emails are deliverability-verified, and zero are outreach-ready. Private rows remain under ignored `private-pilot/` and were not printed, committed, imported, or sent.
- Added `docs/PILOT_OPERATIONS.md`; ignored `staging/` and `private-pilot/`; added an Otterly import package script; and added seven synthetic tests in `test/pilot_workflow.test.mjs`.
- Validation: bundled Node `--test` passed 30 tests, 0 failed; Node syntax checks passed for all `.mjs` files under config/pilot/tools/test; PowerShell parser passed for the HVAC preparation script; `git diff --check` passed. The current tests are offline/synthetic and do not establish production CRM, AgentMail, provider, or outreach readiness.
- Next: research source URLs and decision-maker/business validity for the private 20-row cohort without sending; choose an approved email-verification mechanism; reconcile the current Manus checkpoint against Issue #20 controls; connect normalized observations and pilot states to a staging-only UI; then present the complete cohort/messages/workflow to Mike for approval.
- Public-source research now confirms business evidence for 18 of the 20 private HVAC candidates; two remain blocked as ambiguous. The evidence manifest is stored only under ignored `private-pilot/`. No address has been treated as deliverability-verified and no outreach was sent.
- Added provider-neutral outreach copy renderers and tests for the initial Snapshot message, follow-up, and proposed-service invitation. Every rendered message requires a private Snapshot URL and unsubscribe URL and includes sampling/outcome limitations. These templates have no delivery integration.

## Latest session — AI Visibility validation, 2026-09-06

- Continued at Mike's request in an isolated checkout of PR #23, head `5ac57a9`;
  branch `codex/ai-visibility-validation`. PR #23 is open and unmerged. Reviewed
  Issue #22, open issue inventory, current PR discussion (empty), instructions,
  status, feasibility/data contracts and recent commits.
- Confirmed from official documentation: saved prompts can feed multiple brand
  reports without extra slots; public API documents raw response/run/citation
  fields; manual raw exports are documented. These are documentation findings,
  not measured trial results or approval of a provider.
- Added `docs/AI_VISIBILITY_PROVIDER_VALIDATION.md` with sources, remaining gates,
  first-client cost implications, request-budget arithmetic and a concrete
  synthetic-only sandbox experiment. Linked it from the original feasibility
  plan while preserving the original thresholds and historical assumptions.
- Added offline `prototypes/ai-visibility/feasibility.mjs` and seven tests in
  `test/ai_visibility_feasibility.test.mjs`. Missing/invalid values do not pass;
  failures remain no-go; successful checks request review and grant no authority.
- Validation in this checkout: Node executable
  `C:/Users/miker/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
  with `--test` — baseline 16 passed, final 23 passed, 0 failed.
  `git diff --check` — passed. No build/lint/type-check scripts are configured.
  Browser checks were not repeated because report UI and styles were unchanged.
- The historical 20-test statement refers to a different local tree: the live
  PR has ten visibility fixture tests and six bridge tests. No existing tests
  were removed in this session.
- No vendor contact, account signup, provider runtime call, real-business study,
  payment, deployment, publishing, outreach or production CRM change occurred.
- Remaining: verify sandbox access, actual payload completeness, capture
  environment, cross-workspace behavior and commercial retention/report rights.
  Do not interpret documentary progress as study or launch authorization.
- Next: obtain a permitted no-cost sample/sandbox and review the resulting packet
  before requesting a private real-data study. Preserve CRM/remediation safeguards.

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

## Issue #22 AI Visibility prototype — 2026-09-03

### Authorization and scope

- Mike explicitly authorized implementation of the prototype assets defined in Issue #22.
- The work remains synthetic and local/repository-only. No outreach, live campaigns, vendor purchases, credentials, client-property edits, or public publishing are authorized.

### Completed work

- Built a polished Free Local AI Visibility Snapshot without a fake composite score.
- Built a Monthly Client Dashboard answering the four required questions: where the client appears, who appears more often, what GIG completed, and what needs attention.
- Added deterministic positive-movement, flat-movement, and blocked/provider-unavailable demo scenarios.
- Built an immutable-style monthly activity ledger that demonstrates value even when external metrics remain flat.
- Built a synthetic Local Business Spotlight with source placeholders, factual-conflict blocking, one canonical-page framing, and quality disclosures.
- Documented the provider-neutral observation, citation, controlled-work, engagement, Spotlight, CRM/Rakazo, exception, cancellation, and measurement contracts.
- Added print styling and responsive desktop/mobile layouts.

### Files changed

- `prototypes/ai-visibility/index.html`
- `prototypes/ai-visibility/styles.css`
- `prototypes/ai-visibility/app.js`
- `prototypes/ai-visibility/fixtures.js`
- `prototypes/ai-visibility/README.md`
- `docs/AI_VISIBILITY_DATA_CONTRACT.md`
- `test/ai_visibility_fixture.test.mjs`
- `PROJECT_STATUS.md`

### Validation

- `C:\Users\miker\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test` — passed: 16 tests, 0 failed (six Issue #22 fixture/safety tests plus ten existing bridge tests).
- `git diff --check` — passed.
- Desktop browser smoke test — passed for Snapshot, Dashboard, Work Ledger, and Spotlight; no console errors or warnings.
- Dashboard scenario interaction — passed for the flat-movement scenario.
- Mobile check at 390 × 844 — passed; primary navigation, scenario control, and report content remain available.

### Real versus synthetic

- The UI, calculation/display logic, scenario switching, print layout, responsive layout, data contract, and tests are implemented.
- All business names, facts, observations, citations, competitors, activity records, engagement events, dates, hashes, and metrics are deterministic synthetic fixtures.
- No provider or live CRM integration is enabled.

### Optional/unverified integrations

- OtterlyAI, Google Search Console Generative AI Performance, and Bing Webmaster Tools AI Performance remain optional and unverified.
- Current pricing, feature availability, terms, and API/export support must be verified before selection or purchase.

### Blockers and next action

- No blocker prevents Mike from reviewing the prototype.
- After Mike reviews and approves the product screens, the next recommended step is to refine the prototype from his feedback and approve a separate implementation phase for CRM integration or the public marketing website. Do not launch, buy a provider, collect live observations, or activate outreach without separate approval.

### Post-review integrity refinement and feasibility gate

- Replaced percentage-first fixtures with stored numerator/denominator evidence and calculated display rates.
- Clarified the Free Snapshot's eligible-response denominators versus total cross-surface observations.
- Made dashboard surface and evidence records scenario-specific so provider outages cannot show positive-scenario evidence.
- Added first-class source/citation metrics.
- Added a labeled trend scale and explicit client/competitor/other bar roles.
- Changed the unresolved service area to `Pending verification` and made the synthetic Spotlight visibly unpublished and blocked.
- Added invariant tests for fraction storage, scenario ownership, visual roles, and fail-closed unresolved facts.
- Added `docs/AI_VISIBILITY_FEASIBILITY_PLAN.md` with an exact source map, fixed measurement design, public list-price cost bounds at 10/25/50/100 clients, automation targets, exception handling, vendor trial questions, and precommitted failure criteria.
- Current research identifies OtterlyAI as the first provider candidate, not an approved purchase. Prompt-sharing semantics and API evidence fields remain unverified gates.
- Google/Bing AI property reporting and Cloudflare first-party analytics remain secondary sources for GIG-controlled properties, not substitutes for cross-surface observation.

Validation after refinement:

- Node test runner — passed: 20 tests, 0 failed.
- `git diff --check` — passed.
- Browser regression — blocked/provider-unavailable scenario showed only scenario-specific unavailable evidence; positive evidence was absent.
- Fail-closed Spotlight regression — passed: visible publishing-blocked state and `Pending verification` service area.
- Browser console — no errors or warnings.

Next gate: Mike reviews the corrected prototype and feasibility plan. No real-business study, provider purchase, live data collection, outreach, or public website is authorized yet.

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

## Local CRM recovery — 2026-08-29

### Completed work

- Reconstructed a local staging checkout from the last complete application commit `e4c0b68a50b437f73df22a688ae004dd759671f2`.
- Added the read-only OutreachAI adapter, synthetic fixtures, tests, and documentation from draft PR #14 at head `b05993d6fcc91eadbd48500410c2dddfca442fa6`.
- Preserved the application and adapter together on local branch `codex/recover-gabriel-crm` without changing GitHub, Manus, OutreachAI, credentials, or production data.
- Located and aggregate-validated the authoritative local master CSV at `C:\Users\miker\OneDrive\Desktop\Email Lists\master_crm_import_all_pipelines.csv`: 1,331 rows comprising 300 HVAC, 356 Bank, and 675 Former DAC records.
- Did not copy the private master CSV into the repository and did not import, send, deploy, or contact any lead.

### Files changed

- Restored the prior static CRM application, public pages, assets, documentation, templates, Pages workflow, and tools.
- Added the PR #14 bridge directory, package/test files, synthetic fixtures, `AGENTS.md`, `.gitignore`, and this status record.

### Validation commands and exact results

- Static HTML inventory — 12 HTML files recovered; 11 have valid doctype/title structure. `funnel/index.html` is a two-byte historical placeholder and remains intentionally nonfunctional pending product review.
- JSON parse validation — passed for all three files under `bridge/fixtures/`.
- Likely-secret pattern scan — 0 hits.
- Master CSV aggregate validation — passed: 1,331 rows; HVAC 300, Bank 356, Former DAC 675.
- `npm test` — not run because Node.js/npm is not installed on this host.
- Python compile check — not run because Python is not installed on this host.
- Browser smoke test — not run because the browser security policy blocks direct `file://` navigation and no approved local server runtime is installed.

### Blockers and next actions

- Install or provide an approved JavaScript runtime before relying on the 10-test adapter suite locally.
- Review and smoke-test the restored static routes through an approved local server before deployment.
- Keep the 1,331-record CSV outside source control; design and validate a staging-only import path before loading it.
- Do not merge PR #14, deploy, or activate outreach without Michael's explicit approval.

### Staging import preparation

- Added `bridge/prepare_master_import.ps1` to validate the legacy master CSV schema and transform it into the restored command-center field structure.
- Generated an ignored, local-only review file at `staging/master_crm_review.csv`; private contact rows remain outside source control.
- Validation passed with 1,331 input rows and 1,331 output rows: Bank 356, Former DAC 675, HVAC 300.
- All 1,331 staging rows are deliberately marked `doNotContact=yes` and `importReady=no` so this preparation cannot activate outreach.
- Used Contact Name as the display record when Company is blank; four source rows lack both fields and are explicitly marked `identityReviewRequired=yes` with unique review placeholders.
- No records were imported into browser storage, a hosted database, GitHub, or OutreachAI.

### Final adapter test — 2026-08-29

- Executed the complete 10-case adapter suite through the Codex-provided JavaScript runtime because system Node/npm is not installed.
- Result: 10 passed, 0 failed.
- Covered legacy fixture validation, tRPC translation, GET-only route construction, unsupported-option rejection, unique IDs, pipeline/stage validation, required tRPC fields, malformed envelopes, cursor validation, and aggregate-count validation.
- No live CRM endpoint, private lead data, sending action, database write, deployment, or GitHub mutation was involved.




## Codex execution resumed — 2026-09-09

Mike selected this Codex session as execution owner. Preserved the existing pilot branch, cohort, offer, Manus CRM and completed website edits.

Fixed a staging eligibility defect: missing/null/malformed openException values previously passed the no-open-exception gate. Outreach eligibility now requires explicit boolean false. Added regression coverage for missing, null, string, numeric and active-exception states plus an explicit-clear positive control. This does not establish freshness of CRM evidence or production readiness.

Validation: `node --test` passed 35 tests, zero failures. `npm test` could not start because its network approval was cancelled; ran its exact underlying Node test command without network. `git diff --check` passed.

Recovery: cloned existing validation branch at 21bc7d0. No cohort/Hunter files appeared in reachable Git filename history; exact saved-file search returned no originals. This does not establish where ignored files exist. Issue #20 comments retain historical incomplete-remediation findings; later checkpoint 5fff75d7 CRM-use GO remains recorded, not independently reconciled here.

Next: obtain original ignored cohort files from the prior execution environment, reconcile dated email results, and obtain current Manus checkpoint acceptance evidence. Do not substitute candidates, infer current readiness from historical counts, or call live contact endpoints. No sends, deployments, production writes or purchases performed.
