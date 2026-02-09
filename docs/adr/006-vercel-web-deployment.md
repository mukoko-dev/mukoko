# ADR 006: Vercel for Web Deployment

## Status

Accepted

## Context

The Mukoko web application needs a deployment platform that supports Preact/Vite builds, provides global CDN distribution, offers preview deployments for PRs, and integrates well with the GitHub-based workflow.

## Decision

We deploy the web application to Vercel. Vercel provides automatic preview deployments, edge CDN, and seamless integration with the monorepo build pipeline.

## Consequences

- **Positive**: Automatic preview deployments for every PR improve review workflows.
- **Positive**: Global edge network ensures fast loads for African and diaspora users.
- **Positive**: Zero-config builds for Vite projects.
- **Negative**: Free tier has bandwidth limits that may be reached as user base grows.
- **Negative**: Backend logic must remain on Cloudflare Workers; the web layer is purely frontend.
