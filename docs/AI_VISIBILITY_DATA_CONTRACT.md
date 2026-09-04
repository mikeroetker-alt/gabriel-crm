# AI Visibility prototype data contract

This contract supports GitHub Issue #22. It is provider-neutral, synthetic-first, and designed to layer onto the existing CRM/Rakazo system of record.

## Proof layers

1. **Observation:** sampled AI/search responses on a fixed cohort query panel.
2. **Citation/source:** links, citations, domains, and officially exposed search-system evidence.
3. **Controlled work:** an immutable-style activity ledger recording what GIG changed or blocked.
4. **First-party engagement:** events occurring on GIG-controlled Spotlight assets.

These layers must remain separate. A work event does not prove it caused a later external observation, and an engagement click is not a verified lead or sale.

## Core entities

### `visibility_cohort`

- `id`, `name`, `trade`, `market`, `geography_definition`
- `query_library_version`, `surface_configuration_version`
- `active_from`, `active_to`, `status`

### `query_family`

- `id`, `cohort_id`, `canonical_prompt`, `intent`, `market`
- `eligibility_rule`, `version`, `approved_at`, `approved_by`

Approved prompts are versioned. Historical results never change query text in place.

### `observation_run`

- `id`, `cohort_id`, `provider_id`, `started_at`, `completed_at`
- `model_or_surface`, `retrieval_mode`, `location`, `session_mode`
- `provider_run_ref`, `status`, `exception_code`

### `observation`

- `id`, `run_id`, `query_family_id`, `captured_at`
- `eligible`, `client_mentioned`, `client_recommended`
- `raw_evidence_ref`, `normalized_summary`, `content_hash`
- `review_status`, `reviewed_by`, `reviewed_at`

### `observed_brand`

- `observation_id`, `brand_id`, `role` (`client`, `competitor`, `other`)
- `mentioned`, `recommended`, `position_note`, `confidence`

### `citation`

- `id`, `observation_id`, `url`, `domain`, `page_title`
- `citation_type`, `client_controlled`, `spotlight_id`, `captured_at`

### `fact_claim`

- `id`, `business_id`, `field`, `value`, `source_ref`, `observed_at`
- `verification_status`, `approved_by_client`, `expires_at`

Conflicting approved candidates produce a `fact_exception`; automation must not select one.

### `spotlight`

- `id`, `business_id`, `canonical_url`, `status`, `verified_as_of`
- `content_hash`, `source_log_ref`, `indexing_policy`, `authorized_at`
- `published_at`, `cancelled_at`, `retention_disposition`

### `activity_event`

- `id`, `business_id`, `timestamp`, `action_type`, `actor_type`
- `automation_run_id`, `source_refs`, `before_hash`, `after_hash`
- `status`, `exception_id`, `client_action_required`

Events are append-only to clients. Corrections create a superseding event.

### `engagement_event`

- `id`, `spotlight_id`, `occurred_at`, `event_type`
- `referrer_category`, `campaign_ref`, `anonymous_session_ref`

Do not store unnecessary personal data. Supported prototype types are `page_view`, `website_click`, `call_click`, `email_click`, and `contact_click`.

## Transparent measures

- Mention rate = eligible observations mentioning the client / eligible observations.
- Recommendation rate = applicable observations recommending the client / applicable observations.
- Competitive observed share = client mentions / total defined-brand mentions in the same panel.
- Query coverage = query families with a client mention / eligible query families.
- Surface coverage = monitored surfaces with a client observation in the selected window.

These are sampled observations, not rankings or universal market share. Preserve numerators, denominators, window, panel version, and environment fields with every rendered measure.

## Provider interface

```ts
interface VisibilityObservationProvider {
  readonly id: string;
  capabilities(): Promise<{
    surfaces: string[];
    returnsRawEvidence: boolean;
    returnsCitations: boolean;
    supportsLocation: boolean;
  }>;
  observe(input: {
    cohortId: string;
    queryFamilyId: string;
    prompt: string;
    market: string;
    requestedAt: string;
  }): Promise<ProviderObservationResult>;
}

type ProviderObservationResult =
  | { status: "complete"; providerRunRef: string; capturedAt: string; rawEvidenceRef: string; citations: ProviderCitation[]; response: string }
  | { status: "unavailable"; providerRunRef?: string; exceptionCode: string; retryAfter?: string }
  | { status: "blocked"; exceptionCode: "TERMS" | "AUTH" | "UNSUPPORTED_SURFACE" };
```

Adapters normalize provider output after retaining an authorized evidence reference. No provider is allowed to silently change cohort prompts or fill missing facts.

## CRM/Rakazo hooks

- CRM remains the business/contact system of record.
- A visibility account references, but does not duplicate ownership of, the CRM business ID.
- Rakazo may enqueue observation or report jobs only through a versioned provider contract.
- Publication requires a Mike/client authorization record and zero unresolved material `fact_exception` records.
- Provider outages create an exception and preserve the prior window; they never become zero-valued observations.
- No outreach or campaign state is changed by this product layer.

## Cancellation

The final production policy still requires Mike approval. The data model supports `remove`, `noindex`, or `archive` disposition with an explicit retention date. The prototype does not publish or change any real Spotlight.

## External integrations

OtterlyAI, Google Search Console Generative AI Performance, and Bing Webmaster Tools AI Performance remain optional and unverified. Current pricing, capabilities, API/export access, and terms must be checked before selection or purchase.

