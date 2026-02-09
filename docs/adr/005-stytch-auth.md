# ADR 005: Stytch as Auth Provider

## Status

Accepted

## Context

Mukoko needs passwordless authentication that works well across African markets where SMS and WhatsApp are dominant communication channels. Many users lack email addresses or prefer mobile-first flows. We need a provider that supports OTP via SMS/WhatsApp, magic links, and OAuth.

## Decision

We use Stytch as our authentication provider. Stytch supports SMS OTP, WhatsApp OTP, email magic links, and OAuth flows. Session management uses Stytch JWTs validated at the gateway.

## Consequences

- **Positive**: Native WhatsApp and SMS OTP support aligns with African user behavior.
- **Positive**: Managed session handling reduces custom auth code.
- **Positive**: Strong free tier for early development.
- **Negative**: Vendor lock-in for authentication. Migration would require significant effort.
- **Negative**: SMS delivery reliability varies by African country and carrier.
