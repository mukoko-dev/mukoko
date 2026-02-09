# Stytch Auth Integration

Mukoko uses Stytch as its authentication provider, offering passwordless auth flows optimized for African markets where SMS and WhatsApp are primary communication channels.

## Overview

Stytch provides:
- OTP via SMS and WhatsApp
- Email magic links
- OAuth (Google, Apple)
- Session management with JWTs

## Architecture

```
Mobile App / Web
    |
    v
Stytch SDK (client-side)
    |
    v
Stytch API (auth)
    |
    v
Gateway Worker (validates JWT, attaches user context)
    |
    v
Backend Services
```

## Configuration

Environment variables required:

```
STYTCH_PROJECT_ID=project-live-...
STYTCH_SECRET=secret-live-...
STYTCH_PUBLIC_TOKEN=public-token-live-...
```

## Mobile (Flutter)

The Flutter app uses Stytch's REST API directly via the `auth` feature module at `app/lib/features/auth/`.

## Web (Preact)

The web app uses the Stytch JavaScript SDK for browser-based authentication.

## Session Validation

All backend services validate Stytch JWTs at the gateway layer. The gateway worker extracts the user ID and passes it downstream via headers.
