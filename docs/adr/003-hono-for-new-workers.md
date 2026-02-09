# ADR 003: Hono for New Workers, itty-router for Existing

## Status

Accepted

## Context

Existing Mukoko services use itty-router, a minimal router for Cloudflare Workers. Hono is a newer, more feature-rich framework purpose-built for edge runtimes with built-in middleware, validation, and OpenAPI support.

## Decision

New Cloudflare Worker services use Hono. Existing services retain itty-router and will be migrated opportunistically. Both frameworks target the same Workers runtime.

## Consequences

- **Positive**: Hono provides middleware, validation, and better TypeScript support out of the box.
- **Positive**: No forced rewrite of stable existing services.
- **Negative**: Two routing frameworks coexist temporarily, requiring contributors to know both.
- **Negative**: Shared middleware must be framework-agnostic or duplicated.
