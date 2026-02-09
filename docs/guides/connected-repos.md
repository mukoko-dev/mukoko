# Connected Repos — Migration Paths

The Mukoko monorepo consolidates several existing Nyuchi Tech repositories. This document maps the migration paths from standalone repos into the monorepo structure.

## Migration Map

| Original Repo | Monorepo Location | Status |
|---------------|-------------------|--------|
| `mukoko-news` | `mini-apps/clips/` | Planned |
| `nhimbe` | `mini-apps/events/` | Planned |
| `mukoko-web` | `web/` | Planned |
| `mukoko-gateway` | `services/gateway/` | Planned |
| `nyuchi-honey` | `honey/` | Scaffolded |
| `mukoko-app` | `app/` | Scaffolded |

## Migration Process

1. **Preserve history**: Use `git subtree add` or a clean copy depending on whether commit history needs to be preserved.
2. **Update imports**: Ensure all internal imports reference the new monorepo package names (e.g., `@mukoko/types`, `@mukoko/design-system`).
3. **Update CI**: Remove standalone CI workflows from the original repo; the monorepo CI handles builds.
4. **Redirect**: Archive the original repo and add a redirect notice in its README.

## Notes

- Existing repos using `itty-router` will continue to use it; only new services adopt Hono.
- Shared types and utilities should be extracted into `packages/types/` or `packages/utils/`.
- Design tokens live in `packages/design-system/` and are consumed by all frontends.
