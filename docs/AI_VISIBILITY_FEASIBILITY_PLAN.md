# AI Visibility measurement and economics feasibility plan

**Status:** design only; no purchase, credential request, live-business collection, outreach, or public publishing authorized  
**Prepared:** 2026-09-03  
**Decision gate:** approve, revise, or abandon a private 5–10-business feasibility study only after reviewing this plan

## Executive recommendation

Use a commercial AI-search observation provider as the primary cross-surface measurement layer, with OtterlyAI as the first candidate to validate. Do not build direct consumer-interface scrapers. Use Google Search Console, Bing Webmaster Tools, and first-party analytics only for GIG-controlled Spotlight properties and only through supported access.

The public OtterlyAI pricing makes the $197 offer economically plausible on paper, but two unanswered commercial/technical questions are gates:

1. whether one trade/geography prompt panel can feed multiple brand/client reports without consuming separate prompt capacity; and
2. whether the API exposes the raw evidence, location/environment fields, citations, and daily observations needed by the product contract.

Until a trial or written vendor clarification answers those questions, the economics are estimates—not proof.

## Exact data-source map

| Product datum | Primary collection tool | Backup/secondary source | Cost status | Automation status |
|---|---|---|---|---|
| Mention/recommendation presence by fixed query and surface | OtterlyAI candidate observation layer | None approved; direct UI scraping is excluded | Paid; not purchased | Expected API automation, unverified |
| Competitor presence/share of sampled mentions | Normalize named brands from the same provider observations | Human exception only for ambiguous entities | Included in observation layer | Expected 90%+ after alias rules |
| Query and surface coverage | Derived from completed provider observations and fixed cohort manifest | None | Internal calculation | Fully automatable |
| Citations and recurring domains | Provider citation/link fields | Authorized evidence record review | Included in observation layer | API shape unverified |
| Google AI impressions for Spotlight pages | Google Search Console Generative AI Performance report | Exported report if API filtering is unavailable | No usage price identified | Report exists; exact API exposure unverified |
| Copilot/Bing citations for Spotlight pages | Bing Webmaster Tools AI Performance | Manual supported export if available | Bing Webmaster Tools is free | AI report API not documented; treat as manual/unavailable |
| Spotlight views and action clicks | Cloudflare Web Analytics plus first-party click events | Server access logs | Cloudflare Web Analytics is free | Automatable on GIG-controlled property |
| Facts, conflicts, approvals | CRM/Rakazo fact-claim and exception records | Client attestation | Internal | Automatable except exceptions |
| GIG work completed | Append-only activity ledger | Deployment/change logs | Internal | Fully automatable |
| Report narrative | Deterministic templates; low-cost model only for optional summaries | Template-only output | Target under $1/client/month | Automatable with factual validation |

Official-source notes:

- OtterlyAI publicly lists four-engine tracking on its paid plans, daily tracking, unlimited brand reports, and API access on Standard/Premium: https://otterly.ai/pricing
- Google says its Generative AI Performance report covers AI Overviews and AI Mode impressions for verified properties and provides UI export: https://support.google.com/webmasters/answer/16984139
- The documented Search Console API covers Search Analytics, Sites, Sitemaps, and URL Inspection, but the current public API reference does not expressly document the new dedicated Generative AI report as an API resource: https://developers.google.com/webmaster-tools/v1/api_reference_index
- Bing says AI Performance is in public preview and reports citations, cited pages, grounding queries, and trends. Its public announcement does not promise an AI Performance API: https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview
- Cloudflare documents Web Analytics as free and privacy-first: https://developers.cloudflare.com/web-analytics/about/
- Google warns that third parties do not have access to Google's internal ranking or AI systems; the product must call third-party results sampled observations, never internal Google ranking data: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

## Fixed pilot measurement design

### Cohort

- One trade: roofing.
- One geography: Crown Point / defined Northwest Indiana market.
- Ten buyer-intent query families, versioned and locked before collection.
- Four candidate surfaces included in the Otterly base plan: ChatGPT, Google AI Overviews, Perplexity, and Microsoft Copilot.
- Business aliases and competitor aliases fixed before normalization.

### Repetition and stability

The initial hypothesis to test—not an asserted scientific threshold—is:

- **Free Snapshot:** three independent daily captures per query/surface: `10 queries × 4 surfaces × 3 days = 120 surface-response observations` per cohort window.
- **Monthly service:** use the provider's daily tracking and report at least 28 completed daily cycles: up to `10 × 4 × 28 = 1,120` surface-response observations per cohort/month.
- Never replace missing provider results with zeroes.
- Report the numerator, denominator, completed-run count, provider failures, panel version, market, surface, and capture window.
- Require at least 80% of scheduled observation cells to complete before publishing a comparison; otherwise label the window incomplete.

Three repeats are a starting feasibility setting, not a claim of statistical sufficiency. The study must measure agreement and determine whether three, five, or daily sampling is required.

### Stability measures

For each query/surface pair calculate:

- client-presence agreement across repeats;
- recommended/not-recommended agreement where applicable;
- recurring-brand overlap (Jaccard similarity);
- citation-domain overlap;
- provider completion/failure rate.

Primary comparisons are business-versus-own-prior-window and business-versus-competitors in the identical panel. No universal rank is calculated.

## Can one query panel be reused across businesses?

**Technically:** yes. One captured response can be normalized for every named business in that market. This is the preferred cohort model because it gives every business the same observation environment and makes competitor comparison internally consistent.

**Commercially within OtterlyAI:** unverified. The pricing page says plans have prompt limits and unlimited brand reports; its agency program mentions separate client workspaces. Those statements do not establish whether one prompt consumes capacity once across many brand reports/workspaces. This requires trial evidence or written vendor clarification before purchase.

The cost model therefore shows two bounds:

- **Shared-cohort bound:** ten prompts total, regardless of businesses in the same trade/market.
- **Client-unique bound:** ten separately allocated prompts per client.

## Public list-price cost model

Public monthly OtterlyAI prices observed on 2026-09-03:

- Lite: $29 for 15 prompts, no advertised API.
- Standard: $189 for 100 prompts and 2,000 API requests.
- Premium: $489 for 400 prompts and 5,000 API requests.
- Additional 100 prompts: $99/month on Standard/Premium; Standard moves to Premium after 300 additional prompts.

Taxes, add-on engines, discounts, agency benefits, hosting, and vendor price changes are excluded. Lite is not considered operational because API access is not advertised.

### Provider-only cost

| Active clients | Shared 10-prompt cohort | Provider/client | Unique 10 prompts/client | Conservative plan capacity | Provider/client |
|---:|---:|---:|---:|---|---:|
| 10 | $189 | $18.90 | $189 | Standard, 100 prompts | $18.90 |
| 25 | $189 | $7.56 | $387 | Standard + 200 prompts, 300 total | $15.48 |
| 50 | $189 | $3.78 | $588 | Premium + 100 prompts, 500 total | $11.76 |
| 100 | $189 | $1.89 | $1,083 | Premium + 600 prompts, 1,000 total | $10.83 |

This table assumes the public prompt limits mean ten stored tracked prompts per cohort/client—not ten multiplied by four included engines. That interpretation must be verified in trial.

### Estimated fully loaded variable cost

Planning assumptions only:

- Provider: table above.
- Normalization/report compute and evidence storage: $1/client/month ceiling.
- GIG-controlled analytics/hosting allocation: $1/client/month ceiling.
- Human exception review: target five to ten minutes at a planning labor rate of $30/hour = $2.50–$5.00/client/month.

| Active clients | Shared-cohort estimate/client | Unique-prompt estimate/client | Revenue/client | Estimated contribution before fixed overhead |
|---:|---:|---:|---:|---:|
| 10 | $23.40–$25.90 | $23.40–$25.90 | $197 | 86.9%–88.1% |
| 25 | $12.06–$14.56 | $19.98–$22.48 | $197 | 88.6%–93.9% |
| 50 | $8.28–$10.78 | $16.26–$18.76 | $197 | 90.5%–95.8% |
| 100 | $6.39–$8.89 | $15.33–$17.83 | $197 | 90.9%–96.8% |

These figures are plausible but exclude acquisition cost, payment processing, sales time, support outside the monthly exception allowance, taxes, and fixed engineering/administration. They cannot be used as a purchase justification until prompt allocation and API behavior are verified.

## Automation and exception budget

| Workflow step | Target straight-through automation | Human exception |
|---|---:|---|
| Schedule and collect provider observations | 98% | authentication, quota, provider outage |
| Normalize known business/competitor aliases | 95% | ambiguous entities and name collisions |
| Extract citations/source domains | 95% | malformed/missing provider evidence |
| Calculate transparent measures | 100% | none if contract-valid |
| Detect factual conflicts | 90% | resolve material source disagreement |
| Maintain approved Spotlight facts | 90% | client approval or unresolved fact |
| Produce activity ledger and report | 98% | incomplete observation window |
| Overall month without human exception | target 85%+ | exception queue must remain under ten minutes/client/month median |

The feasibility study must measure these values. They are targets, not current achievements.

## Failure and recovery behavior

- Provider failure creates an unavailable observation with an exception code; prior evidence remains frozen.
- No denominator includes an observation that did not complete.
- Below 80% panel completion, no month-over-month headline comparison is published.
- A material factual conflict blocks the affected fact and, where material to the page, blocks Spotlight publication.
- Client-owned problems are displayed separately and do not become included manual work.
- Retries are bounded and idempotent. Repeated failure escalates; it does not trigger direct-interface scraping.
- Reports preserve raw authorized evidence references and normalized hashes so corrections are auditable.

## Questions the provider trial must answer

1. Does one prompt run cover all four base engines?
2. Can a single cohort prompt feed multiple client/brand reports and workspaces?
3. What exactly counts against the prompt and API-request limits?
4. Does the API expose daily raw/normalized response evidence, citations, location, language, engine/model, timestamp, and run status?
5. Can evidence be retained/exported under the plan's terms?
6. How are local geography and non-personalized/session settings controlled?
7. What retry, latency, outage, and historical-retention behavior is documented?
8. Does agency/client use require a specific plan or partner agreement?

## Precommitted pass/fail criteria

Define these before looking at real-business results.

### Hard no-go / redesign triggers

- Direct variable data cost exceeds $30/client/month at 25 clients, or fully loaded variable cost exceeds $40/client/month.
- Median human intervention exceeds ten minutes/client/month, or more than 20% of clients require over fifteen minutes.
- More than 5% of scheduled provider observations remain failed/unavailable after bounded retries.
- Median same-query/surface brand-presence agreement across repeats is below 70%, making the result difficult to explain honestly.
- Fewer than 60% of studied businesses produce at least two material, business-specific differentiating insights.
- Fewer than 50% produce at least one bounded GIG-controlled improvement beyond generic “update your website/GBP” advice.
- Material factual-error/dispute rate exceeds 2%, or any system design pressures operators to publish unresolved claims.
- The provider cannot supply audit-ready evidence or compliant commercial/API rights for the intended workflow.

### Pass-to-pilot requirements

- Cost and labor remain below the hard thresholds with a documented margin buffer.
- At least 80% panel completion and at least 70% median presence agreement.
- At least 60% of reports provide two or more specific differentiating insights.
- At least 50% identify one safe, bounded, controllable improvement.
- Zero fabricated observations and zero published unresolved material facts.
- A reviewer can trace every headline metric to numerator, denominator, query, surface, date, and evidence reference.

Longer-term retention is still unproven after feasibility. A later paid pilot would need its own 30/60-day retention and customer-value thresholds.

## Recommended next decision

1. Review the corrected synthetic prototype and this plan.
2. If the product still looks sound, authorize only a no-cost trial/vendor clarification phase.
3. Do not purchase a plan until the prompt-sharing and API-evidence gates are answered.
4. Return with measured trial behavior and a revised cost table.
5. Only then consider authorizing the private 5–10-business real-data feasibility study.

No public website, outreach, live campaign, real Spotlight publication, or client-property work should begin at this gate.

