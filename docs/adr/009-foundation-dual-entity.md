# ADR 009: Mukoko Foundation (Mauritius) + Nyuchi Africa (Zimbabwe) Dual-Entity Structure

## Status

Accepted

## Context

Mukoko operates a token economy, manages soulbound identity tokens, and runs a platform serving African users. This creates overlapping regulatory, operational, and philosophical requirements:

1. Token issuance and governance need a regulated, non-profit custodian
2. Day-to-day product development needs a for-profit operating company
3. The Ubuntu charter and African sovereignty mandate need structural protection beyond token voting
4. VASP (Virtual Asset Service Provider) licensing requires a jurisdiction with crypto-specific regulation
5. The operating company must be based in Africa (Zimbabwe, the primary market)

## Decision

Two legally independent entities:

**Mukoko Foundation** — Mauritius, registered under the Foundations Act 2012

- Non-profit custodian of protocol, token economics, and Ubuntu charter
- Holds the VASP licence under VAITOS Act 2021
- Controls the smart contracts (PoolRegistry, EmissionController, IdentityToken)
- Governed by a Council elected by MIT holders via conviction staking
- Cannot be acquired, merged, or dissolved without Tier 1 constitutional vote (66%)

**Nyuchi Africa (Pvt) Ltd** — Zimbabwe, Companies and Other Business Entities Act

- For-profit operating company building and running the platform
- Holds commercial agreements (EcoCash, InnBucks, M-Pesa)
- Licensed by the Foundation under a revocable service agreement
- Revenue from platform fees, enterprise API access, premium features

**Founder's Reserved Powers** — embedded in Foundation constitutional documents as legal rights (not token rights):

- Ubuntu Veto, African Sovereignty Mandate, Core Protocol Lock, Emergency Pause
- Cannot allocate tokens, direct treasury spending, or benefit the founder financially

## Why Mauritius

- **Foundations Act 2012**: Purpose-based entity (not shareholder-based), ideal for protocol governance
- **VAITOS Act 2021**: VASP licensing framework, FATF-compliant
- **Common law**: English-language legal system, familiar to international investors
- **Tax treaties**: Extensive network including Zimbabwe and key African markets
- **Proximity**: 4hr flight from Johannesburg, same timezone range as East Africa

## Consequences

- **Positive**: Clean separation of custodianship (Foundation) from operations (Nyuchi Africa). Neither can unilaterally change the other.
- **Positive**: Reserved Powers protect the platform's soul without giving the founder financial privilege.
- **Positive**: VASP licence provides regulatory clarity for token issuance and exchange.
- **Positive**: Foundation structure prevents hostile acquisition of the protocol.
- **Negative**: Two-entity structure adds legal and administrative overhead.
- **Negative**: Mauritius Foundation requires annual filings, council meetings, and compliance reporting.
- **Negative**: The revocable service agreement creates theoretical risk for Nyuchi Africa, though this is mitigated by the Foundation's constitutional constraints.
