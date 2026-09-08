# Minimum pilot operations

Status: staging only. This does not activate outreach, billing, publication, production CRM writes, or a real-business visibility study.

## Two-day target

The reviewable pilot path is: business request → business verification → fact approval → manual evidence import → report review → Mike approval → delivery-ready. `pilot/workflow.mjs` enforces that order and blocks advancement when evidence or an exception is unresolved.

Otterly JSON can be normalized through `pilot/otterly-import.mjs` without an API key. The importer preserves nulls, hashes each original row, records its row index, identifies prompted mentions, and marks unavailable run/location/model metadata explicitly. Manual export evidence cannot become headline-ready merely because parsing succeeded.

## Flexible multimodel routing

`config/model-routing.mjs` defines capability requirements for Rakazo roles without permanently binding a vendor. A runtime candidate is eligible only when enabled, approved, validated, capable, and within the task budget. Selection favors the highest validated quality score within budget, records a fallback, and can require a critic from another provider. Every completed task should record model, provider, cost, latency and acceptance outcome so later routing uses measured cost per accepted result.

Candidate models and prices belong in runtime configuration after current availability and commercial terms are verified. They do not belong in source as permanent commitments. A new paid provider or higher spending limit requires Mike approval.

## Outreach cohort

The first planned outreach cohort remains M1-B1-20: twenty prospects. Inventory review on September 8 found 300 HVAC rows in the private master CSV, 49 with unique syntactically valid emails, and no roofing rows. Syntax is not deliverability verification. Selection requires a named decision-maker, source URL, verified email, current suppression check, no open exception, and Mike-specific approval. `outreachEligibility` represents these fail-closed gates.

Private contact rows and generated cohort files belong under ignored `staging/` or `private-pilot/` paths and must never be committed. Release in a five-recipient canary followed by fifteen only after AgentMail traceability and stop/suppression behavior are verified. No sending is authorized by this document.

## Still external

- Otterly response on shared observations, run/failure evidence, environment metadata and paid-report retention rights.
- Current Manus checkpoint/source evidence sufficient to reconcile Issue #20 controls.
- Approved email verification mechanism and current AgentMail/domain readiness.
- Mike approval of each initial outbound message and any real-business measurement.

