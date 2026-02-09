# ADR 007: Workers for Platforms for Mini-App Hosting

## Status

Accepted

## Context

Mukoko's mini-app ecosystem requires sandboxed execution of third-party and first-party lightweight applications. Mini-apps must load fast, be isolated from each other, and be deployable independently. Cloudflare Workers for Platforms enables multi-tenant Worker dispatch.

## Decision

We use Cloudflare Workers for Platforms to host mini-apps. Each mini-app is deployed as an isolated Worker, dispatched via the platform's routing layer. The Flutter app renders mini-apps in WebViews pointing to their Worker URLs.

## Consequences

- **Positive**: Strong isolation between mini-apps (separate V8 isolates).
- **Positive**: Independent deployment per mini-app without affecting others.
- **Positive**: Global edge execution for low latency across Africa.
- **Negative**: Workers for Platforms requires an Enterprise plan or special access arrangement.
- **Negative**: Mini-apps are limited to Worker runtime constraints (CPU time, memory).
