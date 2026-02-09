# ADR 002: Preact over React for Web and Mini-Apps

## Status

Accepted

## Context

Mukoko targets users across Africa where mobile data is expensive and devices are often lower-end. Bundle size directly impacts accessibility and cost. React's runtime is approximately 40KB gzipped, while Preact offers the same API at approximately 3KB.

## Decision

We use Preact (with `preact/compat` for ecosystem compatibility) for all web frontends and mini-apps. Vite is used as the build tool.

## Consequences

- **Positive**: 90%+ reduction in framework bundle size. Critical for users paying per-MB data costs.
- **Positive**: Faster initial load and time-to-interactive on low-end devices.
- **Positive**: `preact/compat` maintains compatibility with most React ecosystem libraries.
- **Negative**: Some React libraries may have subtle incompatibilities with `preact/compat`.
- **Negative**: Smaller community and fewer learning resources compared to React.
