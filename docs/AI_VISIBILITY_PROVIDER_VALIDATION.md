# AI Visibility provider validation packet

Reviewed 2026-09-06 against PR #23 head `5ac57a9`. Public documentation only;
no account creation, provider call, vendor contact, purchase, or business study.

## Decision

Continue no-cost validation of OtterlyAI. Shared prompts across brand reports
are now **documented**, not merely inferred from unlimited-report marketing.
The API also documents much of the required evidence. Neither finding is a
measured sandbox result. The combined provider gate remains **incomplete**.

## Findings and exact remaining checks

| Requirement | Evidence reviewed | Status / remaining check |
|---|---|---|
| One saved prompt feeds several brand reports | [Prompt allowance](https://help.otterly.ai/amount-searchprompts) explicitly says reuse does not multiply slots; country variants use separate slots | Documented. Verify account counters before/after linking a second synthetic report. |
| Isolation across client workspaces | [Multiple clients](https://help.otterly.ai/can-i-manage-multiple-brands-under-one-account) describes separate workspaces and a shared allowance | Cross-workspace reuse of the identical saved prompt/run is not established. Do not promise it. A GIG-only cohort workspace with internally derived client reports is a design candidate, subject to rights confirmation. |
| Raw answer and citation evidence | [API response reference](https://docs.otterly.ai/api-reference/brand-reports/list-ai-responses-for-a-prompt-in-a-brand-report) documents `runId`, `runDate`, `engine`, `state`, `content`, `overviewAvailable`, brand mentions and citation title/link/rank | Schema documented; actual completeness, failed-run states and consistency need a sample. A completed run without an overview must not become a fabricated answer. |
| Geography and capture environment | Same response reference documents a required country filter | City in prompt text is not proof of a city-localized session. Effective location, model version, language, retrieval and personalization settings still need evidence or explicit unavailable metadata. |
| Full-window retrieval | Same reference documents inclusive UTC date windows and cursor pagination | Verify all pages, stable run identity, missing cells, retries and billing behavior. HTTP request success is not observation success. |
| Manual raw export | [Export help](https://help.otterly.ai/can-i-export-my-data-and-reports) documents CSV/JSON raw-response exports and citation exports | Documented feature, not an automation test or a blanket redistribution license. |
| Measurable consumption | [Account API](https://docs.otterly.ai/api-reference/accounts/get-account-information) exposes prompt/API usage and limits | Supports a before/after counter experiment; no authenticated request made. |
| Historical baseline | [History policy](https://help.otterly.ai/historical-data) ties history to saved prompts and does not backfill pre-monitoring observations | A new account cannot supply a genuine historical baseline on day one. |

## Rights review remains open

The current [terms](https://otterly.ai/terms) link to the
[April 24, 2026 agreement](https://otterly.ai/Terms-OtterlyAI-2026-04.pdf).
Section 6.3 provides a 30-day post-termination download period for CUSTOMER Data;
section 7.2 addresses customer ownership of that data. Those provisions do not
by themselves settle which collected third-party AI outputs fall within that
definition or grant every intended report-reproduction right. Obtain a concrete
answer covering raw-output retention, private paid-client reports, cohort reuse,
and rights after subscription termination. Section 4.2 also addresses provider
usage data. This is a list of unresolved contract questions, not legal clearance.

## Cost and request budget

[Current monthly pricing](https://otterly.ai/pricing) still lists Standard at
$189 with 100 prompts and 2,000 API requests; Premium at $489 with 400 prompts
and 5,000 requests. Standard includes four base engines. Other engines cost
extra. These are list prices, not measured fully loaded cost.

For one ten-prompt cohort, Standard provider allocation is $189/client at one
paying client, $37.80 at five, $18.90 at ten, and $7.56 at 25. Thus the original
25-client threshold does not demonstrate attractive first-client economics.
The original unique-prompt bound should remain a stress case for workspace
duplication and multiple cohorts; do not assume all customers share one market.

Request-planning arithmetic (assumptions, not observed API behavior):

- One page/prompt/day for 28 days: 10 x 28 = 280 response-page reads/cohort.
- Four separately filtered engines: 10 x 4 x 28 = 1,120 reads/cohort.
- Repeating that second pattern for 25 reports: 28,000 reads, beyond either
  listed allowance. Extra pages, retries and metadata increase these counts.

Prefer retaining one authorized cohort capture and deriving reports internally
if rights permit it. Unlimited brand reports does not imply unlimited API reads.

## Prepared no-cost experiment (not executed)

1. Confirm a no-card trial actually includes the needed read API and raw export.
   Do not accept paid upgrades or overage terms to unlock it.
2. Use a vendor-provided sandbox payload or fictional entities only. Do not run
   real roofing searches as a substitute for an approved business study.
3. Record account counters; associate one saved fictional prompt with two
   fictional reports; compare counters and run IDs. Separately test workspace
   behavior only if trial rights permit it.
4. Capture a completed response, missing-overview case, failed/pending run,
   paginated window and export. Record provenance, exact schema, timestamps,
   capture environment, quota consumption and any undocumented fields.
5. Confirm evidence retention/report rights and local-session behavior in
   writing. Vendor-contact authorization remains separate; no message was sent.
6. Return measured findings. Real-data study, payment, outreach and launch
   remain separate decisions. Preserve all existing kill thresholds.

## Offline feasibility checker

`prototypes/ai-visibility/feasibility.mjs` checks entered aggregate measurements
against the existing plan. It has no I/O and does not ingest provider records.
Missing, malformed or nonfinite values remain unverified; known failures win
over missing fields. Fractions use 0..1, money uses USD, and counts are integers.
The 80% reporting-coverage minimum does not waive the stricter 5% study-failure
ceiling. Numeric thresholds and evidence confirmations must all pass.

Outputs are `incomplete`, `no-go`, or `ready-for-review`, never launch approval.
References identify the study packet, reviewer and measurement definitions;
their contents are not automatically authenticated. A reviewer must check the
5-10-business cohort, sample size, observation schedule, measurement formulas,
cost allocation, margin buffer and raw evidence. The checker does not establish
statistical sufficiency, verify self-reported booleans, or replace those reviews.

The deterministic examples in `test/ai_visibility_feasibility.test.mjs` are
synthetic test inputs, not actual feasibility results. Run with `node --test`.

## Next implementation priority

Validate the sandbox payload against the documented schema once accessible,
then implement normalization only after evidence/environment/rights decisions.
The existing Snapshot, Dashboard, ledger and Spotlight remain reusable.
No UI rebuild or production CRM connection is needed for this gate.
