# Gabriel Growth Engine

Local-first revenue command center and public tools for Gabriel Impact Group.

## Purpose

This repo supports the Gabriel Impact Group paid-services workflow:

1. Start with a warm/referral/manually researched prospect intake queue.
2. Create a free business visibility snapshot or free spotlight-style value offer.
3. Record the prospect in the local command center.
4. Generate a practical next step for visibility, video, reputation, website trust, SEO/AEO, or CRM setup.
5. Keep any capital-readiness conversation as a back-end path only after trust, response, or clear business need.

Gabriel Faith Alliance is separate and should not be used as the paid-services conversion hook.

## Current pages

Expected GitHub Pages routes, assuming Pages is enabled for this repo:

- `/gabriel-crm/` — internal Revenue Command Center
- `/gabriel-crm/home/` — public free-video-first funnel
- `/gabriel-crm/tools/` — public tools index
- `/gabriel-crm/tools/warm-prospect-intake/` — Warm Prospect Intake / Research Queue
- `/gabriel-crm/tools/visibility-snapshot/` — public Visibility Snapshot Tool
- `/gabriel-crm/tools/pricing-proposal/` — public Pricing & Proposal Calculator
- `/gabriel-crm/tools/offer-builder/` — public Offer Page Builder

## Deployment status

The GitHub Actions Pages workflow is manual-only now. It should not run on future pushes.

Recommended setup for this static repo:

1. Open GitHub repo settings.
2. Go to **Pages**.
3. Set **Build and deployment** source to **Deploy from a branch**.
4. Choose branch: `main`.
5. Choose folder: `/ (root)`.
6. Save.

After that, test the routes listed above.

## Templates

- `templates/warm-prospect-import-template.csv` — command-center-ready CSV starter template.

## Hard rules

- Static / GitHub Pages compatible.
- Local-first only unless a future change clearly says otherwise.
- No paid APIs required.
- No email auto-sending.
- No social media auto-posting.
- No guessed email addresses.
- No generic capital/referral links.
- Preserve the assigned capital referral path recorded in `docs/DAC_LINK_RULE.md`.
- No funding approval promises, guarantees, or lender claims inside this app.
- Human review before any external message is sent or published.

## Daily workflow

1. Open the Warm Prospect Intake Queue.
2. Add or research one warm/referral/manually researched prospect.
3. Export a command-center-ready CSV or manually add the prospect in the Revenue Command Center.
4. Generate a visibility snapshot.
5. Score relationship warmth, visibility need, and readiness.
6. Use the Pricing & Proposal Calculator to create a paid next-step range only when the prospect context is clear.
7. Use the Offer Page Builder to draft a clean paid-service page or proposal insert when needed.
8. Create a human-reviewed draft or proposal only after the prospect context is clear.
9. Export/backup the local data at the end of each work session.

## Completed build pieces

- Local revenue command center.
- Lead database with localStorage.
- CSV export/import.
- JSON backup/restore.
- Warm Prospect Intake / Research Queue.
- Warm prospect CSV template.
- Visibility Snapshot Tool.
- Pricing & Proposal Calculator.
- Offer Page Builder.
- Tools landing page.
- Revenue-engine documentation.
- Capital referral path guardrail documentation.
- Test checklist issue created in GitHub.
- GitHub Pages Actions workflow changed to manual-only after deploy failures; branch-based Pages is recommended.

## Next build target

Confirm GitHub Pages deployment using branch-based Pages and test all current routes. After that, tighten the root command center CSV importer so it handles every field exported by the Warm Prospect Intake Queue.
