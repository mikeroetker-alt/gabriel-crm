# GitHub Pages Setup

This repo is a static GitHub Pages project for the Gabriel Growth Engine.

## Recommended deployment mode

Use branch-based GitHub Pages deployment, not the Actions workflow.

In GitHub:

1. Open the repository.
2. Go to **Settings**.
3. Go to **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Set branch to `main`.
6. Set folder to `/ (root)`.
7. Save.

Expected public URL pattern:

`https://mikeroetker-alt.github.io/gabriel-crm/`

## Why not automatic Actions deploy?

An automatic GitHub Actions Pages workflow was attempted and failed before Pages settings were confirmed. To stop repeat failure emails, the workflow was changed to manual-only.

Do not re-enable automatic Actions deployment unless the repo is explicitly configured to deploy Pages through GitHub Actions.

## Expected routes

After Pages publishes, test:

- `/gabriel-crm/`
- `/gabriel-crm/home/`
- `/gabriel-crm/tools/`
- `/gabriel-crm/tools/warm-prospect-intake/`
- `/gabriel-crm/tools/visibility-snapshot/`
- `/gabriel-crm/tools/pricing-proposal/`
- `/gabriel-crm/tools/offer-builder/`

## Current workflow file status

The Pages Actions workflow should remain manual-only unless the deployment source is changed to GitHub Actions intentionally.
