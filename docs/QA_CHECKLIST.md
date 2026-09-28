# Gabriel Growth Engine QA Checklist

Use this checklist before treating the platform as ready for daily prospect work.

## Deployment check

1. In GitHub, open `Settings > Pages`.
2. Confirm source is `Deploy from a branch`.
3. Confirm branch is `main` and folder is `/ (root)`.
4. Save, then wait for GitHub to publish the site.
5. Confirm the public URL pattern is `https://mikeroetker-alt.github.io/gabriel-crm/`.

## Route smoke tests

Open each route and confirm the page loads without a 404:

- `/gabriel-crm/`
- `/gabriel-crm/home/`
- `/gabriel-crm/tools/`
- `/gabriel-crm/tools/visibility-snapshot/`
- `/gabriel-crm/tools/pricing-proposal/`
- `/gabriel-crm/tools/offer-builder/`
- `/gabriel-crm/tools/warm-prospect-intake/`

## Root command center checks

On `/gabriel-crm/`:

- Confirm launchpad links open the correct tools.
- Add a demo prospect record.
- Confirm relationship warmth, service fit, funding readiness, and revenue priority scores appear.
- Confirm do-not-contact records cannot be saved into the active revenue queue.
- Generate a visibility snapshot.
- Generate a funding readiness note and confirm it includes a preliminary-screen-only disclaimer.
- Generate a draft message and confirm it is draft-only.
- Generate a proposal output.
- Export CSV.
- Export JSON backup.
- Clear local data only after backing up if real data is present.

## Intake CSV to Command Center import checks

Use `tools/warm-prospect-intake/` and `/gabriel-crm/` together:

- Add one normal warm prospect in the intake queue.
- Add one do-not-contact prospect in the intake queue.
- Export the command-center CSV from the intake queue.
- Import that CSV into the root command center.
- Confirm the normal prospect imports with business name, website, local area, relationship source, warmth, lead temperature, verified contact/source URL, service fit, funding readiness, monthly revenue, follow-up date, research notes, and relationship notes preserved.
- Confirm any do-not-contact row is skipped and does not enter the active revenue queue.
- Confirm the command center import summary reports added, updated, skipped DNC, and skipped missing-business counts.
- Confirm importing can either replace existing records or merge/update existing records.

## Visibility Snapshot Tool checks

- Enter a business name, URL, city/state, category, relationship context, and notes.
- Generate the snapshot.
- Confirm the output includes first impression, visibility gaps, conversion issues, recommended next step, and internal notes.
- Confirm copy and print controls work.
- Confirm there is no API key, external scan, auto-send, or hidden data transmission.

## Pricing & Proposal Calculator checks

- Select at least one service.
- Enter base project price and monthly support.
- Generate proposal.
- Confirm the proposal is clear, editable, copyable, and printable.
- Confirm it does not promise results, funding approval, or automatic posting.

## Offer Page Builder checks

- Select an offer type.
- Generate the service-page draft.
- Confirm the output is copyable and printable.
- Confirm no capital/referral link is added unless the assigned path rule has been checked.

## Warm Prospect Intake checks

- Add a warm prospect.
- Mark one prospect as do-not-contact and confirm it is clearly flagged.
- Export CSV.
- Confirm exported headers match `templates/warm-prospect-import-template.csv`.
- Confirm no guessed email or unverified contact is treated as ready.

## DAC / capital referral guardrail

Before adding or changing any capital/referral link:

- Read `docs/DAC_LINK_RULE.md`.
- Confirm the assigned path is preserved.
- Do not use generic referral links.
- Do not add funding promises, approvals, or guarantees.

## Pass/fail rule

The platform is not considered ready for daily use until:

- Every route loads.
- All local-only tools generate output.
- CSV export works.
- Intake CSV import works into the command center without importing do-not-contact records.
- No automatic email/posting/funding application behavior exists.
- The DAC path guardrail is preserved.
