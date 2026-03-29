# ADR 008: Polygon PoS with Two-Token Architecture (MIT + MXT)

## Status

Accepted

## Context

Mukoko needs a blockchain layer for sovereign digital identity (soulbound tokens) and a platform transaction currency. The original design used Base with a single NFT model. As the token economics matured, we needed:

1. A soulbound identity token (non-transferable, birth-date anchored) for governance and value anchoring
2. A transferable utility token for transactions, creator payments, and cross-border remittances
3. Low transaction costs suitable for African markets where users transact in small amounts
4. An elastic supply model (no hard cap) to serve a growing continental economy
5. Established ecosystem with mobile money off-ramp partners

## Decision

We deploy on **Polygon PoS** with two tokens:

- **MIT (MUKOKO Identity Token)** — soulbound ERC-721 (non-transferable). One per verified user, anchored to birth date. Used for governance staking and as the value anchor via a three-pool temporal system (Year Pool 60%, Month Pool 30%, Day Pool 10%).
- **MXT (MUKOKO Exchange Token)** — standard ERC-20 (transferable). Used for all platform transactions. Floor price derived from MIT pool means. Elastic supply: baseline emission 10,000 MXT/user, annual ceiling 15%, burn rate 30% of fees.

Five smart contracts (Solidity ^0.8.20, OpenZeppelin v5): PoolRegistry, IdentityToken, ValueOracle, ExchangeToken, EmissionController.

Governance uses conviction staking with quadratic voting: `Weight = sqrt(MXT staked) * Ubuntu Multiplier * Regional Multiplier`.

## Why Polygon over Base

- **Lower fees**: Polygon PoS consistently < $0.01/tx vs Base's variable L2 fees
- **Mobile money integrations**: Existing partnerships with African off-ramp providers
- **Ecosystem maturity**: Longer track record, more auditing firms familiar with the chain
- **EVM compatibility**: Same Solidity tooling, easy to migrate if needed

## Consequences

- **Positive**: Two-token design cleanly separates identity (non-transferable) from currency (transferable), preventing identity commodification.
- **Positive**: Elastic supply avoids the deflationary trap — the currency can grow with Africa's economy.
- **Positive**: Three-pool system creates a mathematically rising floor value as the community ages.
- **Positive**: Quadratic voting with Ubuntu multiplier prevents plutocratic governance capture.
- **Negative**: Two tokens are more complex to explain to users than one. Wallet UX must abstract this.
- **Negative**: Polygon PoS has different security assumptions than Ethereum L1. Acceptable for our use case.
- **Negative**: Elastic supply requires careful emission parameter governance to prevent inflation.
