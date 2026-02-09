# ADR 006: Vercel for Web Deployment

## Status

Accepted

## Context

The Mukoko web application needs a deployment platform that supports Preact/Vite builds, provides global CDN distribution, offers preview deployments for PRs, and integrates well with the GitHub-based workflow.

## Decision

We deploy the web application to Vercel. Vercel provides automatic preview deployments, edge CDN, and seamless integration with the monorepo build pipeline.

## Implementation

The `web/` directory contains the mukoko.com marketing landing page:

- **Stack:** Preact + Vite (11KB gzipped production build)
- **Deployment:** CI via `.github/workflows/deploy-web.yml` on push to `main`
- **Config:** `web/vercel.json` with SPA rewrite rules
- **Waitlist:** Formspree integration for email capture
- **Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` in GitHub repo settings

## Consequences

- **Positive**: Automatic preview deployments for every PR improve review workflows.
- **Positive**: Global edge network ensures fast loads for African and diaspora users.
- **Positive**: Zero-config builds for Vite projects.
- **Positive**: 11KB gzipped total — well under 150KB data budget for first load.
- **Negative**: Free tier has bandwidth limits that may be reached as user base grows.
- **Negative**: Backend logic must remain on Cloudflare Workers; the web layer is purely frontend.
