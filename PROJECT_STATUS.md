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

## Rakazo / OutreachAI bridge publication — 2026-09-02

### Direction confirmed

- The active CRM to preserve is the Manus-hosted Outreach Automation Platform identified in Issue #9, not the obsolete static Gabriel CRM application that was removed from `main` in July.
- Rakazo should integrate with that existing CRM through a controlled bridge rather than introducing another CRM.

### Completed work

- Created branch `rakazo-outreachai-bridge` from current `main`.
- Published the safe read-only OutreachAI adapter patch that Codex had previously produced in Issue #13.
- Added a synthetic response fixture with no private prospect records.
- Added six contract tests covering GET-only behavior, pagination limits, stable IDs, cursor validation, aggregate counts, and endpoint construction.
- Added documentation for the non-secret authenticated response metadata still needed before connecting the adapter to the live Manus CRM.
- Added `.gitignore` and a minimal Node test package.
- Updated `bridge/README.md` to document the adapter, fixture, and authenticated-contract gap file.

### Files changed

- `.gitignore`
- `bridge/outreachai_adapter.mjs`
- `bridge/fixtures/contacts-page.synthetic.json`
- `bridge/AUTHENTICATED_CONTRACT_GAPS.md`
- `bridge/README.md`
- `test/outreachai_adapter.test.mjs`
- `package.json`
- `PROJECT_STATUS.md`

### Validation

- Codex previously validated the exact published patch with `npm test` (6 passed, 0 failed), Python compile checks, Node syntax checks, and `git diff --check` as recorded in Issue #13.
- This ChatGPT GitHub-connector session published the previously validated repository-only patch but did not execute a separate Node runtime locally.

### Safety boundary and blocker

- No outreach was sent, no production data was changed, no credentials were committed, and no private prospect records were added.
- The live CRM adapter remains intentionally disconnected until the exact authenticated read contract (paths, pagination semantics, response envelope, stable ID field, and rate-limit metadata) is captured in sanitized form.
- After that read contract is verified, the next step is to map Rakazo's CRM/account bot to this bridge and keep all write actions approval-gated until separately tested.

## DeepSeek GitHub issue bridge — 2026-09-16

### Goal

- Eliminate Mike as the manual message courier between DeepSeek and the canonical GIG coordination thread.
- Give DeepSeek a real repository-native path to read the live Issue #22 context and post its own generated responses back into Issue #22.

### Completed work

- Created branch `deepseek-github-bridge` from `main`.
- Added `bridge/deepseek_issue_bridge.mjs` to fetch live Issue #22 context, call the DeepSeek API, and post the model response back to Issue #22.
- Added `.github/workflows/deepseek-issue-bridge.yml` with narrow `contents: read` and `issues: write` permissions.
- Added `test/deepseek_issue_bridge.test.mjs` covering canonical-issue routing, command normalization, bounded context construction, and response extraction.
- Added `docs/DEEPSEEK_GITHUB_BRIDGE.md` with activation, usage, scope, and security rules.
- The explicit trigger is a new Issue #22 comment beginning with `/deepseek`.
- The bridge uses the official current `deepseek-flash` API model and does not commit or expose the API key.

### Files changed

- `.github/workflows/deepseek-issue-bridge.yml`
- `bridge/deepseek_issue_bridge.mjs`
- `test/deepseek_issue_bridge.test.mjs`
- `docs/DEEPSEEK_GITHUB_BRIDGE.md`
- `PROJECT_STATUS.md`

### Validation

- Node.js 22 and npm are available in the ChatGPT container.
- A direct container fetch of the public branch was attempted for an independent test run, but outbound DNS to `raw.githubusercontent.com` is blocked in that container, so the repository files could not be downloaded there.
- The committed test suite is configured to run via `npm test` inside the GitHub Action before each DeepSeek API call.
- Live end-to-end validation remains pending until the branch is merged to `main` and the repository Actions secret `DEEPSEEK_API_KEY` is configured.

### Security / behavior boundaries

- Only Issue #22 is accepted.
- Only an explicit `/deepseek` comment triggers the API call.
- The GitHub token can read contents and write issue comments; it cannot mutate repository files through this workflow.
- The DeepSeek API key must exist only as the GitHub Actions repository secret `DEEPSEEK_API_KEY`.
- No repository file changes, merges, deployments, outreach, CRM writes, payments, purchases, or production actions are delegated to DeepSeek by this bridge.

### Remaining activation step

- Add the DeepSeek API key as the GitHub Actions repository secret named `DEEPSEEK_API_KEY` after merge.
- Then post a `/deepseek` verification request in Issue #22 and confirm that a new `DEEPSEEK — DIRECT BRIDGE RESPONSE` comment appears automatically.

## Claude GitHub response workflow — 2026-09-24

### Goal

- Enable repository-authorized users to address Claude directly with `@claude` in Issues, pull requests, and reviews, with Claude posting its progress and response in the same GitHub thread.

### Completed setup work

- Confirmed that the official Claude GitHub App is installed for all repositories owned by `mikeroetker-alt`.
- Added `.github/workflows/claude.yml` on branch `chore/claude-github-action`. The workflow is based on Anthropic's official interactive mention example and supports issue comments, pull-request comments, pull-request reviews, and newly opened or assigned issues.
- Restricted triggering to GitHub's default write-access and human-actor checks implemented by the official `anthropics/claude-code-action`.
- Configured a bounded eight-turn default and an explicit instruction not to expose secrets or private prospect data or take consequential actions without Mike's authority.

### Activation blocker

- The workflow intentionally uses the repository Actions secret `CLAUDE_CODE_OAUTH_TOKEN`; no credential is committed to the repository.
- A subscription-backed token-generation session is awaiting its one-time Anthropic OAuth callback. My Browser control has repeatedly timed out while retrieving that callback, so the secret has not been set and this workflow will remain inactive until authentication completes.
- Do not merge the workflow pull request until the repository secret has been added, or merge it knowing that `@claude` invocations will fail closed until then.

### Validation still required

- Review the workflow diff with `git diff --check`.
- After the token is configured, merge the workflow and post a reply-only `@claude` test in Issue #32. Confirm a Claude comment appears in the same thread and inspect the workflow run for a successful completion.


## M4a — pinned GitHub Actions CI for `gabriel-crm` — 2026-09-25

### Scope and safety boundary

- Added `.github/workflows/ci.yml` on dedicated branch `ci/gabriel-crm-test` for pull requests and pushes to `main`.
- The workflow has workflow-level `permissions: contents: read`, uses no secrets, has no write permissions, and contains no deploy, production, CRM, payment, email, DNS, or external-system step.
- `actions/checkout` is pinned to `11bd71901bbe5b1630ceea73d27597364c9af683` (`v4.2.2`) and `actions/setup-node` is pinned to `49933ea5288caeca8642d1e84afbd3f7d6820020` (`v4.4.0`).
- The job uses Node.js 22, npm caching keyed to `package.json`, `npm ci` only if `package-lock.json` exists, otherwise `npm install --no-audit --no-fund`, then `npm test`.
- Ref-keyed workflow concurrency cancels superseded CI runs.

### Validation evidence

- `npm test` at baseline `aac6f77` — **13 passed, 0 failed**.
- `git diff --check` — **passed**.
- `! grep -nE 'secrets\\.|\\bwrite\\b' .github/workflows/ci.yml` — **passed**; the workflow contains neither secret reference nor write permission.
- Static workflow-content verification — **passed** for triggers, read-only permission, concurrency, action SHA pins, Node 22/npm cache, lockfile fallback, and `npm test`.
- Initial green CI run: [Run 36145407850](https://github.com/mikeroetker-alt/gabriel-crm/actions/runs/36145407850) on commit `8dd983f` — **success**.
- Controlled negative test: commit `97f5112` added one explicit failing assertion. Local `npm test` produced **13 passed, 1 failed** as expected. [Run 36145566143](https://github.com/mikeroetker-alt/gabriel-crm/actions/runs/36145566143) — **failure** as expected.
- Recovery: commit `abc4e54` reverted only the controlled failure. Local `npm test` again produced **13 passed, 0 failed**. [Run 36145643425](https://github.com/mikeroetker-alt/gabriel-crm/actions/runs/36145643425) — **success**.

### Current review state and next action

- The M4a pull request is [#35](https://github.com/mikeroetker-alt/gabriel-crm/pull/35) and is awaiting Claude review.
- After PR #35 is merged, **D5 (branch protection) can require the `CI / test` check on `main`**.
- No branch-protection, repository-settings, deployment, access, billing, payment, outreach, CRM-write, DNS, or credential change was made in this work session.
