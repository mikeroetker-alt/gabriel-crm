# Gabriel Impact Group Public Website Rebuild Spec

## Primary Objective

Rebuild the public-facing Gabriel Impact Group website so it is credible enough to send to warm business contacts while preserving the internal local-first CRM / Command Center exactly as a separate internal workflow.

This build is for Gabriel Impact Group, the paid business-services entity. It must not mix in Gabriel Faith Alliance nonprofit, ministry, charity, donation, or 501(c)(3) positioning.

## Non-Negotiable Protection Rules

Do not delete, overwrite, break, or refactor the internal CRM / Command Center unless Mike explicitly asks for that in a separate task.

Preserve:

- `/` root Command Center / CRM.
- Internal dashboard, localStorage data model, and all in-browser local-first behavior.
- CSV export/import.
- JSON backup/restore.
- Prospect, package, proposal, snapshot, diagnostics, scoring, follow-up, and funding-readiness workflow if currently usable.
- `/tools/` and every internal/public utility currently under `/tools/` unless a later task specifically targets one of those tools.
- Existing docs, templates, DAC link guardrails, and internal QA material.

Public-site work may touch only these public-facing paths unless inspection proves another public-only asset must be updated:

- `/home/index.html`
- `/request/index.html`
- `/assets/funnel.css`
- `/assets/funnel.js` only if needed for public site behavior
- New public-only assets under `/assets/` if needed
- This spec file

## Route Standard

Required route split:

- `/` = internal CRM / Command Center.
- `/tools/` = tools and internal/public utilities.
- `/home/` or `/site/` = public Gabriel Impact Group website.
- `/request/` = public request/intake page.

Do not make `/` the public homepage in this task. The internal CRM must remain reachable at root.

## Public Brand Standard

The public site must feel like a real small business website, not an internal prototype or app.

Required visible public identity:

- Brand: Gabriel Impact Group.
- Owner/contact: Mike Roetker or Michael Roetker.
- Email: `mikeroetker@gmail.com` until Mike provides a better business email.
- Service area: Northwest Indiana and remote support where appropriate.
- Tone: calm, practical, credible, service-first, no hype.
- Business positioning: digital visibility, video, website clarity, local search, reputation, and follow-up support.

## Required Public Offer

Lead with the free front-end offer:

- Free short AI business spotlight concept, visibility review, or first-impression review.
- Manual review first.
- No automated spam.
- No obligation.
- Nothing posted without approval.
- Paid services only after value is clear.

The first screen must quickly answer:

1. What is this?
2. Who is it for?
3. What free thing can the business owner request?
4. What happens next?
5. How do they contact Mike?

## Required Service Sections

The public `/home/` page must include clear sections for:

1. Hero / above-the-fold offer.
2. Free review / spotlight concept explanation.
3. Services:
   - AI business spotlight videos.
   - Visibility reviews / audits.
   - Website trust and conversion cleanup.
   - Local SEO / AEO / Google Business Profile visibility.
   - Reputation / review support.
   - CRM / follow-up setup.
   - Business funding only as a back-end conversation when relevant.
4. Process:
   - Request.
   - Manual review.
   - Concept / recommendation.
   - Optional paid next step.
5. About Mike / credibility.
6. Contact / next step.
7. Plain disclaimers: no guaranteed rankings, leads, revenue, approvals, or funding.

## Required Request / Intake Page

The `/request/` page must be a real next step, not fake automation.

If no backend form handler exists yet, use a simple honest intake flow that opens a prefilled email draft to `mikeroetker@gmail.com` and/or copies request details for manual sending.

The request page must collect, at minimum:

- Business name.
- Contact name.
- Email or phone.
- Website, Google Business Profile, Facebook page, or public link.
- Service area.
- Primary interest.
- Notes about what people should understand, trust, or remember.

Required behavior:

- Form submit opens a prefilled email draft.
- Copy button copies the request details.
- Page clearly states nothing is posted, sent, or automated without approval.
- Do not claim there is a backend, CRM integration, API workflow, auto-sequence, or automation if it is not actually active.

## CTA Rules

Every CTA must go somewhere real:

- `/request/`
- `mailto:mikeroetker@gmail.com`
- A valid section on the same page

Do not use jumpy buttons that appear to go nowhere.
Do not create fake scheduler, fake form submission, fake automation, fake CRM connection, or fake approval workflow.
Do not use confusing anchor-only CTAs unless they intentionally scroll to a section that answers the CTA promise.

## Forbidden Public Language

Do not include public-facing language such as:

- Static GitHub Pages.
- No APIs.
- Local storage.
- Internal build.
- Command Center.
- Revenue command center.
- Prototype.
- Scaffold.
- Test record.
- Demo leads.
- Codex built this.
- Developer-only notes.
- Mike approves relationship-sensitive outreach.
- Funding approval language.
- We can get you approved.
- Guaranteed funding.
- Guaranteed rankings.
- Guaranteed leads.
- Guaranteed revenue.
- Automatic email sending.
- Automatic posting.
- Nonprofit, charity, donations, ministry, 501(c)(3), Gabriel Faith Alliance, or faith-based charitable language.

## Funding / DAC Guardrail

Funding must not be front-and-center on the public website.

It may only be mentioned as an optional back-end conversation when relevant to the business owner’s situation.

If David Allen Capital is ever mentioned or linked, Mike’s assigned path must be preserved exactly:

`https://davidallencapital.com/MikeR`

All DAC subpage links must preserve `/MikeR`. Never use generic DAC links.

Do not promise approvals, rates, revenue outcomes, lender results, or funding availability.

## Outreach Guardrail

No outreach is part of this build.

Do not contact or prepare live outreach to:

- Texas Storm Shelter.
- Bob Wilson / FreeStand.
- John Thomas.
- Any other prospect.

No prospect message should be sent until:

1. Public site is credible.
2. Video source/assets workflow is ready.
3. Mike approves the exact message and link.

## Visual / UX Standard

The site should look like a credible small business consulting site:

- Clean professional layout.
- Strong first screen.
- Clear service cards.
- Clear process steps.
- Trust-building, not hype.
- Mobile-friendly.
- Readable typography.
- Buttons are stable and visually consistent.
- Contact info visible without hunting.
- No app-like internal dashboard feel.
- No massive walls of text.
- No hidden next step.

## QA Checklist Before Presenting to Mike

Before saying the public site is ready, verify:

- `/home/` loads.
- `/request/` loads.
- Every nav link works.
- Every CTA goes to `/request/`, email, or a valid section.
- No internal/prototype/scaffolding language remains on public pages.
- No fake backend claims.
- Contact email is visible.
- Service offer is clear in the first screen.
- Paid services are presented separately from the free offer.
- Funding is not front-and-center.
- Gabriel Faith Alliance / nonprofit language is not mixed into the GIG paid site.
- Mobile-friendly layout.
- Clear next step for a business owner.
- No broken buttons.
- No confusing jump-only CTAs unless they intentionally scroll to a useful section.
- Public page feels credible enough to send to a warm business contact.

## Implementation Notes

Recommended implementation:

1. Inspect root `index.html` and do not modify it.
2. Inspect `/tools/` and do not modify it.
3. Rebuild `/home/index.html` as the public landing page.
4. Rebuild `/request/index.html` as the honest email-draft intake page.
5. Update `/assets/funnel.css` only for shared public styling.
6. Keep `/assets/funnel.js` minimal and honest.
7. Re-run the QA checklist.

If a conflict appears between this spec and the internal CRM, preserve the CRM and stop before editing the risky file.
