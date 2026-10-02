# Mukoko Platform Architecture

## The Technical Foundation of Africa's Super App

**Version:** 5.0
**Date:** October 2026
**Type:** Technical Architecture Reference
**Owner:** Mukoko — Africa's Super App
**Parent:** Nyuchi Africa / The Bundu Family
**Author:** Bryan Fawcett, Founder & CEO
**Supersedes:** Mukoko Architecture v4.0.x (`nyuchi/mukoko-platform/docs/foundation/`)

**v5.0 Changelog:**

- The infrastructure-purity rule is retired. "No MongoDB (SSPL)" and "open source everywhere" are replaced by the **open data and open weights covenant**. Managed and source-available infrastructure is acceptable; closed data and closed weights are not.
- Two APIs, with one rule each. The **Nyuchi API** (`api.nyuchi.com`, `nyuchi/api-gateway`) is the internal API and the only component that touches a database. The **Mukoko API** (`api.mukoko.com`, `mukoko-dev/mukoko-api`) is the public consumer API for developers, partners and AI agents, and touches no database at all.
- MongoDB Atlas is the content system of record. ScyllaDB is superseded; it was never built.
- Supabase/PostgreSQL is re-adopted as the **relational spine** in a new project, `nyuchi_relational_db`. The v4 platform project `tdcpuzqyoodrdsxldgsh` has been deleted.
- Apache Doris is the search engine, the analytics engine and the open data commons, reachable only over Fly's private network. Redpanda and Flink are deployed but suspended.
- Every Mukoko app becomes a thin client with no backend of its own. `super-app-web` and `super-app-mobile` replace the v4 `mukoko-app` plan.
- Every section now carries a status: **Live**, **Designed**, **Superseded** or **Deferred**.

---

## 1. What This Document Is

This is the canonical technical architecture of the Mukoko platform. Every technology choice, every data flow, every integration point described here is marked with what it is today. Nothing is aspirational without saying so. Everything is grounded.

If this document contradicts any other document, this document wins.

Every status in this document was checked against the repositories, their deploy configuration (`fly.toml`, Wrangler configs, READMEs) and `fly apps list` on 2 October 2026.

| Status         | Meaning                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| **Live**       | Deployed and serving, or holding production data, on 2 October 2026.       |
| **Designed**   | Decided and documented. Not built, or built but not yet serving its role.  |
| **Superseded** | Named in an earlier version. Replaced by something else in this version.   |
| **Deferred**   | Still wanted. Not scheduled. Nothing will be built until this doc changes. |

Where a fact could not be confirmed from a repository or a read-only command, it is marked _(unverified)_.

---

## 2. The Two Non-Negotiables

v4 carried many rules. v5 keeps two, and makes them absolute.

### 2.1 Open Data and Open Weights

**Status:** Designed (covenant); Live in part (Doris holds the commons).

The v4 sovereignty lens asked whether each piece of infrastructure was open source. That was the wrong question. A database engine is a tool. The data it holds and the intelligence trained on that data are the inheritance. v5 asks the right question: **does what Africa gives the platform come back to Africa, in a form anyone can use?**

- **Open data.** Anonymised, aggregate platform data flows into the open data commons (Layer 7) and is publicly queryable. Researchers, journalists, NGOs and African governments can ask what the Mukoko community collectively knows about weather, coverage, economic activity and cultural trends. Platform data belongs to Africa.
- **Open weights.** Any model the platform trains on community data — the community layer of the Digital Twin, classification and enrichment models — is released with open weights. The community that taught the model owns what it learned.
- **Portable stores.** Every system of record must export to open formats (JSON, CSV, SQL, Parquet) on demand. A managed service is acceptable because it can be left.

This replaces the v4.0.1 rule "No MongoDB (SSPL, not OSI-recognised)". Managed or source-available infrastructure — MongoDB Atlas, Supabase, Cloudflare, Fly.io, Vercel, WorkOS — is acceptable. Closed data and closed weights are not.

### 2.2 Ubuntu in Code

**Status:** Designed (tri-mode contract); Live in part.

_Ndiri nekuti tiri — I am because we are._ The philosophy is not decoration. It is a contract every mini-app signs.

Every mini-app operates in three modes simultaneously:

- **Musha** (home) is the foreground experience — the app you open and dwell in.
- **Basa** (work) is the background service — data and capabilities other apps consume silently, through the Nyuchi API.
- **Nhaka** (heritage) is the open data contribution — anonymised data flowing into the continental knowledge commons.

The Shona names encode the Ubuntu principle at the architectural level: the individual experience, the community service, and the civilisational gift. A mini-app that has only Musha is not a Mukoko mini-app.

**Ubuntu contributions** — content, review, verification, moderation, translation, curation, mentorship — accumulate into Ubuntu scores that unlock features and amplify governance weight. **Community governance** runs through conviction voting by MIT holders. The Nyuchi API's `/v1/ubuntu` namespace exists today; the scoring rules and governance contracts are Designed.

---

## 3. The Ecosystem

The Bundu Family is the complete ecosystem built by Nyuchi Africa. It has three pillars.

**Mukoko** is the consumer-facing super app — mini-apps, a platform substrate, one unified identity. This is where a billion African users live their digital lives.

**Nyuchi** is the enterprise layer and the platform underneath. The Nyuchi API serves Mukoko, every Nyuchi product and every other Bundu app. Nyuchi products are standalone products, doors into the Mukoko platform, and professional surfaces for the same ecosystem. A doctor on Nyuchi Medical and a patient on Mukoko Health are in the same world, connected through the same identity.

**Sister Brands** are specialist verticals — Zimbabwe Information Platform and Barstool by Nyuchi — drawing on the platform's data and verification infrastructure under their own brands.

The Nyuchi products (API Platform, Web Services, Learning, Medical, Rentals, Tools, SEO Manager) and the Sister Brands are unchanged from v4.0.1 and are not restated here.

---

## 4. The Two APIs

**This is the central change in v5.** Apps stop reading databases. Every read and every write goes through one internal API, and the public sees one consumer API.

```text
   Outside consumers                         First-party apps
   developers, partners, AI agents           news.mukoko.com, weather, events,
              |                              lingo, home, super-app-web/mobile,
              v                              Nyuchi products, other Bundu apps
   api.mukoko.com/v1/{news,weather,...}                 |
   mukoko-dev/mukoko-api                                |
   Cloudflare Workers                                   |
   verify sign-ins, cache, rate limit,                  |
   public request/response shapes                       |
   NO database access                                   |
              |  one client id + secret                 |  one client id + secret per app
              v                                         v
   +-------------------------------------------------------------------+
   |  api.nyuchi.com/v1/*   nyuchi/api-gateway   FastAPI on Fly (jnb)  |
   |  the ONLY component that touches a database                       |
   +-------------------------------------------------------------------+
        |                  |                    |                 |
   MongoDB Atlas     Supabase/Postgres     Supabase/Postgres   Apache Doris
   content system    relational spine      payments (ACID)     search, analytics,
   of record         nyuchi_relational_db  /v1/pay             open data (Fly 6PN)
```

### 4.1 The Internal API — the Nyuchi API

**Status:** Live.

| Property   | Value                                                                                                                                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository | `nyuchi/api-gateway` (stays in the `nyuchi` organisation)                                                                                                                                                                                     |
| Runtime    | FastAPI (Python) on Fly.io, region `jnb` (Johannesburg)                                                                                                                                                                                       |
| Hostname   | `api.nyuchi.com` — healthy on 2 October 2026, reporting API version `4.1.0`                                                                                                                                                                   |
| Fly app    | `mukoko-platform-api` serves today. Fly cannot rename an app, so it is being recreated as `nyuchi-api` (api-gateway PR #123, open). `nyuchi-api` exists on Fly with no deploy yet. When the cut-over lands, `mukoko-platform-api` is retired. |
| Callers    | Mukoko apps, Nyuchi products, every other Bundu ecosystem app, and the Mukoko consumer API                                                                                                                                                    |
| Shape      | About 30 routers under one `/v1/*` tree, one per domain: `news`, `weather`, `events`, `places`, `lingo`, `identity`, `search`, `pay`, `ubuntu` and the rest. OpenAPI 3.0.3 at `/openapi.json`.                                                |

The rule: **the Nyuchi API is the only component that touches a database.** It owns the choice of store for each query, caching, rate limiting and visibility rules. An app holding a database connection can issue any query shape against production from every serverless instance, with no shared cache and no rate limit. On 2 October 2026 that is exactly what saturated the Atlas cluster ingestion writes to. v5 removes the possibility.

**Credentials.** The Nyuchi API issues client id and secret pairs (`nyk_…` / `nys_…`) at `POST /v1/api-keys`. Each key is owned by a workspace (a family or organisation entity) and carries per-namespace scopes from the API catalogue (`gateway/lib/api_catalog.py`). Scopes are `public` or `internal`; an external key can never carry an internal scope, and minting a key with internal scopes requires the `X-Internal-Key` shared secret (first-party services only). `POST /v1/auth/token` exchanges a key pair for a one-hour machine token through OAuth 2.0 `client_credentials`.

**Every first-party app holds its own key.** News, Weather, Events, Lingo, the super apps and the Nyuchi products each call `api.nyuchi.com` directly with their own client id and secret, scoped to the namespaces they need. They do not go through `api.mukoko.com`.

### 4.2 The Consumer API — the Mukoko API

**Status:** Designed. The repository exists; no code, no deploy, and `api.mukoko.com` has no DNS record.

| Property     | Value                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| Repository   | `mukoko-dev/mukoko-api`                                                                                      |
| Runtime      | Cloudflare Workers                                                                                           |
| Hostname     | `api.mukoko.com`                                                                                             |
| Callers      | Outside consumers only: developers, partners and AI agents                                                   |
| Data access  | **None.** No MongoDB, no Postgres, no Hyperdrive, no D1, no Doris                                            |
| Credentials  | One client id and secret issued by the Nyuchi API (`POST /v1/api-keys`), held as Worker secrets              |
| Contract     | The OpenAPI document for `api.mukoko.com` lives in `mukoko-api`. The `mukoko-openapi` repository is retired. |
| First routes | The public news API from `nyuchi/mukoko-news-gateway`, rewritten to call the Nyuchi API instead of MongoDB   |

**One public API, organised by namespace, not by app.** Every Mukoko app's public customer API is consolidated under `api.mukoko.com`:

| Not this                     | This                         |
| ---------------------------- | ---------------------------- |
| `weather.mukoko.com/api/...` | `api.mukoko.com/v1/weather/` |
| `news.mukoko.dev/api/...`    | `api.mukoko.com/v1/news/`    |
| `nhimbe.com/api/events`      | `api.mukoko.com/v1/events/`  |

Apps serve that public API to their customers through `api.mukoko.com`. Internally, the apps themselves call the Nyuchi API.

The consumer API does the edge work and nothing else: verifying sign-ins, caching at the edge, rate limiting per consumer, and the public request and response shapes. It is a translation and protection layer. If it were deleted, no data would be lost.

### 4.3 Transitional exceptions

**Status:** Live today; to be retired.

The rule "only the Nyuchi API touches a database" is not yet met. The known exceptions on 2 October 2026:

- **`mukoko-news`** (Next.js on Vercel) still reads MongoDB directly, path by path. Reads are moving to `/v1/news` behind `NYUCHI_API_URL`, `NYUCHI_API_CLIENT_ID` and `NYUCHI_API_CLIENT_SECRET`, with a direct-read fallback removed once each path has run clean for two weeks. Merged: PRs #208, #210, #211. Open: #212 (article page). Closed unmerged: #209.
- **`mukoko-news-gateway`** (Workers) binds D1 (`mukoko-news-db`) and Hyperdrive (`RELATIONAL`, to `nyuchi_relational_db`), and runs the five-minute identity converge cron. It keeps the MCP server; its public routes move to `api.mukoko.com`.
- **`mukoko-weather`**, **`mukoko-lingo`** and **`kweli`** hold their own `MONGODB_URI`. Weather and Lingo run their own backends as Vercel serverless functions.
- **`mukoko-auth`** (Mukoko ID) runs on its own D1 database.
- **`mukoko-events-admin`** reads MongoDB directly.

The working migration plan, with a file-by-file read map, is `docs/architecture/data-access.md` in `nyuchi/api-gateway` (PR #118, proposed). It moves to this repository once accepted.

---

## 5. The Sources of Truth

**Every record lives in exactly one database.** Replication is allowed only for faster reads, geographic positioning, or device, cloud, hot and cold tiering.

| Store                                    | Owns                                                                    | Status                     |
| ---------------------------------------- | ----------------------------------------------------------------------- | -------------------------- |
| **MongoDB Atlas**                        | Content: article bodies, enrichment output, domain documents            | Live                       |
| **Supabase/Postgres** (relational spine) | Identity, entities, memberships, verification, the classification layer | Live, cut-over in progress |
| **Supabase/Postgres** (payments)         | Money: `/v1/pay`                                                        | Live                       |
| **The Web3 Pod**                         | The person's sovereign data                                             | Designed (database TBD)    |

Everything else — Doris, CouchDB, Cloudflare caches, device stores — is a search index, a sync mechanism, an edge cache, a device cache, or the open data commons.

**Why Postgres came back.** v4.0.x moved relational data out of Postgres. It did not work: memberships, verification and classification are joins, and other apps join against them. A document store could not hold foreign keys, uniqueness across collections, or row-level security on a membership. v5 puts the relational facts back where joins live, and leaves the documents in MongoDB.

---

## 6. The Seven Data Layers

Each layer serves a distinct stakeholder with a distinct covenant. All seven are necessary. None can be replaced by any of the others. The covenants are unchanged from v4. The technologies under three of them have changed.

### Layer 1 — The Pod (Web3 — Database TBD)

**Covenant:** "Your data is yours."
**Stakeholder:** The individual.
**Status:** Designed.

The personal source of truth. Personal preferences, engagement history, Digital Twin memory, AI conversation context, learned interests. Cryptographically bound to the person's MIT token. Accessible only with their keys. Progressive decentralisation: unverified users' personal data is held by the platform; verification triggers pod provisioning and data migration. Pod database technology is still under evaluation.

### Layer 2 — The Relational Layer (Supabase/PostgreSQL — the spine)

**Covenant:** "The platform is structured and trustworthy."
**Stakeholder:** The platform.
**Status:** Live (schema and backfilled rows); writers still on MongoDB.

`nyuchi_relational_db` — Supabase project `ponbvierjjqsbvvkkafl`, `eu-west-1` — is the platform's relational database. It replaces `mukoko_platform_cloud` (`tdcpuzqyoodrdsxldgsh`), which has been deleted.

- **One schema per MongoDB database.** 28 domain schemas — `identity`, `entity`, `engagement`, `news`, `places` and the rest — each named after the MongoDB database that owns the domain. Nothing new goes in `public`.
- **Table = collection, snake_cased. Column = document field, snake_cased.** Ids are the MongoDB `_id` values, unchanged. A `*Id` reference is a foreign key; a `*Ids` array is a link table, never an array column.
- **MongoDB's `$jsonSchema` validators are the specification.** `enum` becomes a `CHECK`, `required` becomes `NOT NULL`.
- **Published vocabularies.** Persons use OpenID Connect standard claims (`given_name`, `family_name`, `email_verified`, `locale`…), because WorkOS issues them. Organisations use Schema.org (`schemaOrgType`, `additionalType`, `alternateName`); a family is an `Organization` with `additionalType` Family.
- **Row Level Security on every table.**

What lives there today: `identity.persons`, `entity.entities`, `entity.memberships`, `engagement.interest_categories` and `engagement.topics` with their link tables (migrations `001`–`006` in `api-gateway/db/spine/migrations`). Rows were copied from MongoDB by `scripts/backfill_relational_spine.py`, an idempotent upsert keyed on `_id` that quarantines — never drops — what does not fit (`public.backfill_quarantine`).

**These are still two copies.** A domain is cut over by moving its writers to Postgres, then its readers, then retiring the MongoDB collection. Identity moves in four stages: expand (`005`), converge (a temporary five-minute cron in `mukoko-news-gateway`), readers, writers. The rule "one record, one database" is not met for a domain until the last step.

**Payments stay on Supabase/Postgres** for financial ACID, served by `/v1/pay`, which demands `X-Internal-Key` on every request. The payments project reference is not recorded in any repository _(unverified)_.

### Layer 3 — The Document Layer (MongoDB Atlas)

**Covenant:** "All content has a home."
**Stakeholder:** The creator and the community.
**Status:** Live.

MongoDB Atlas is the content system of record. **One database per domain.** Documents follow Schema.org with camelCase property names, so the API can emit JSON-LD without a mapping layer. The ingestion pipeline and the Nyuchi API write to it. Single-record reads, small catalogues and vector similarity (Atlas Vector Search, where the embeddings live) are answered here, through the Nyuchi API.

**Superseded:** ScyllaDB. v4.0.1 named ScyllaDB as the non-relational source of truth on Fly.io. It was never deployed.

### Layer 4 — The Sync Layer (Apache CouchDB)

**Covenant:** "Data flows where it is needed."
**Stakeholder:** The connected ecosystem.
**Status:** Deployed; sync role Designed.

CouchDB is not a data store. It is the sync protocol — the replication protocol that PouchDB, RxDB and offline-first libraries speak. If its data were lost it could be rebuilt from the sources of truth.

Fly app `mukoko-couchdb` (`jnb`) is deployed and healthy. Only the Nyuchi API talks to it, over Fly's private network, through `/v1/couch`. Its `fly.toml` deliberately has no public HTTP service, though the app still holds a shared public IPv4 address that the `fly.toml` notes say should be released. Replication to device, edge and pod is Designed.

### Layer 5 — The Edge Layer (Cloudflare)

**Covenant:** "Responses are instant."
**Stakeholder:** The active web user.
**Status:** Designed.

In v5 the edge is where the consumer API lives: `api.mukoko.com` on Cloudflare Workers caches public responses and rate-limits consumers at the edge, and holds no data of its own.

**Deferred:** the v4.0.1 edge data plan — 54 country-level geographic Durable Objects, per-user Durable Objects with an ephemeral lifecycle, a KV routing map, and CouchDB-fed edge sync. It remains the right shape for web users at scale. It is not scheduled, and under v5 it must read through the Nyuchi API, never from a database.

### Layer 6 — The Device Layer (RxDB + SQLite)

**Covenant:** "The app works without internet."
**Stakeholder:** The user in the village.
**Status:** Designed.

On-device database inside the native shell: RxDB with SQLite on mobile, IndexedDB in the browser. Syncs personal data from the pod and platform content through CouchDB's replication protocol. The device is a window into the pod and a cache of recently accessed content — it never syncs large catalogues.

### Layer 7 — The Open Data Layer (Apache Doris)

**Covenant:** "Africa's knowledge belongs to Africa."
**Stakeholder:** The continent.
**Status:** Deployed (search and analytics); open data publication Designed.

The seventh layer closes the circle, and it is where the open data covenant is kept.

Fly app `mukoko-doris` (`jnb`, single node) is deployed with both its frontend and backend health checks passing. It has **no public IP addresses**: it is reachable only over Fly's private network, which is why only the Nyuchi API — a Fly app in the same region — can query it. Doris is the search engine and the aggregation engine for the whole platform: counts, facets, time series and full-text land on Doris, and MongoDB hydrates single records by `_id`.

**How data reaches Doris.** Designed: a MongoDB change stream in the ingestion pipeline mirrors content into Doris, deletes and moderation included (`nyuchi/mukoko-ingestion-pipeline` #68). **Suspended:** the v4 Redpanda → Flink → Doris streaming path. Fly apps `mukoko-redpanda` and `mukoko-flink` exist and are suspended; neither is on the read or write path.

**Public access** to the commons — the open data API that lets researchers and governments query Doris — is Designed. Until then Doris is internal only.

---

## 7. Identity and Authentication

**Status:** Live (WorkOS through the Nyuchi API); Designed (Nyuchi Identity as the single gateway).

**WorkOS AuthKit is the sole authentication provider.** Stytch is superseded.

- **Today (Live).** Clients sign in through `/v1/auth/workos/*` on the Nyuchi API, which mints an HS256 platform JWT with `sub` = person id. Every router verifies that JWT.
- **Nyuchi Identity (Designed, deployed as a scaffold).** `nyuchi-identity` is a Rust identity gateway, v0.1.0, deployed on Fly (`nyuchi-identity`, `jnb`, two machines). It is designed to be the sole integration boundary with WorkOS: translate WorkOS sessions into platform JWTs, resolve WorkOS users and organisations into `identity` and `entity` rows, bootstrap a family of one at signup, and publish identity events. Every other service validates platform JWTs and never talks to WorkOS. The repository is moving from `nyuchi` to `mukoko-dev`.
- **Mukoko ID (`mukoko-dev/mukoko-auth`).** The identity product — one login, one Digital Twin, one reputation across every Mukoko app and Nyuchi product. The repository's current code is the earlier Stytch-based Worker (`mukoko-id-api`, `id-worker.mukoko.com`) on its own D1 database, and still has to be brought onto WorkOS and the spine.

Multi-tenancy is unchanged: individual (`identity.persons`), family and organisation (`entity.entities`, joined by `entity.memberships`).

---

## 8. The Application Stack

### 8.1 Thin Clients

**Status:** Designed; migration in progress.

**Every Mukoko app is a thin client with no backend of its own.** No database clients, no domain logic that lives only inside one app. The same Nyuchi API endpoints serve today's standalone apps and tomorrow's super apps, so neither blocks the other.

| App                  | Repository                                               | Today (2 October 2026)                                                               | Status                      |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------- |
| Mukoko News          | `nyuchi/mukoko-news`                                     | Next.js on Vercel, `news.mukoko.com`. Reads moving to `/v1/news` path by path.       | Live, migrating             |
| News public API, MCP | `nyuchi/mukoko-news-gateway`                             | Workers on `news.mukoko.dev`, D1 + Hyperdrive. Public API moves to `api.mukoko.com`. | Live, to be reduced         |
| News ingestion       | `nyuchi/mukoko-ingestion-pipeline`                       | Fly app `mukoko-news-api` (`jnb`), writes MongoDB                                    | Live                        |
| Weather              | `nyuchi/mukoko-weather`                                  | Next.js + FastAPI functions on Vercel, `weather.mukoko.com`, direct MongoDB          | Live, not yet migrated      |
| Weather mobile       | `nyuchi/mukoko-weather-mobile`                           | Expo / React Native                                                                  | Not verified _(unverified)_ |
| Events (Nhimbe)      | `nyuchi/mukoko-events-admin`, `nyuchi/mukoko-events-mcp` | Admin on Next.js, direct MongoDB; MCP Worker on `events.mukoko.com/mcp`              | Live, not yet migrated      |
| Lingo                | `mukoko-dev/mukoko-lingo`                                | Expo + Vercel functions, direct MongoDB, WorkOS                                      | Live, not yet migrated      |
| Kweli                | `mukoko-dev/kweli`, `mukoko-dev/kweli-mcp`               | Next.js on Vercel, `kweli.mukoko.com`, MongoDB; MCP Workers not yet deployed         | Live, not yet migrated      |
| Circles              | `mukoko-dev/mukoko-circles`                              | Reserved repository, no code                                                         | Designed                    |
| Home                 | `mukoko-dev/mukoko-home`                                 | Reads Supabase directly                                                              | Not yet migrated            |

### 8.2 The Super Apps

**Status:** Designed (repositories created, not started).

`mukoko-dev/super-app-web` and `mukoko-dev/super-app-mobile` are one home for every Mukoko service — news, weather, events, language learning, communities — in a single app, on web and on iOS and Android. They have no backend of their own; every feature calls the Nyuchi API, organised by domain, not by app. Users sign in with Mukoko ID. The technology choice and scaffold come next.

They replace the v4 single `mukoko-app` (Next.js wrapped in Capacitor) plan, which is **Superseded**. Whether the mobile shell is Capacitor, Expo or native is open.

### 8.3 Design System

`mukoko-dev/packages-ui` holds the shared, publishable UI packages of the Nyuchi Design System.

### 8.4 Schema.org Compliance

Non-negotiable, as in v4. Every MongoDB document maps to a Schema.org type with camelCase property names. Every Postgres column mirrors its document field, snake_cased, so the API can camelCase back to JSON-LD with no mapping table. Persons are the exception by design: they follow OpenID Connect claim names.

### 8.5 The Service Bus

**Superseded:** the v4.0.1 `service_bus.events` / `service_bus.subscriptions` tables. They lived in the deleted `mukoko_platform_cloud` project. **Designed:** an event bus for identity and cross-app events; the transport is undecided _(unverified — `nyuchi-identity` names Cloudflare Queues)_.

---

## 9. Repositories

Checked with `gh repo list` for both organisations on 2 October 2026.

### `mukoko-dev` — Mukoko

| Repository                          | Role                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `mukoko`                            | The Mukoko docs: vision, architecture, the super-app plan (this document) |
| `mukoko-auth`                       | Mukoko ID                                                                 |
| `mukoko-api`                        | The consumer API, `api.mukoko.com`, and its OpenAPI contract              |
| `super-app-web`, `super-app-mobile` | The super apps                                                            |
| `mukoko-circles`                    | Circles (reserved)                                                        |
| `mukoko-home`                       | Mukoko Home                                                               |
| `mukoko-lingo`                      | Lingo                                                                     |
| `kweli`, `kweli-mcp`                | Business, places and verification; its MCP server                         |
| `packages-ui`                       | Shared UI packages                                                        |
| `mukoko-openapi`                    | Retired — empty. Its role moved to `mukoko-api`.                          |

### `nyuchi` — moving to `mukoko-dev` later

`mukoko-news`, `mukoko-news-gateway`, `mukoko-ingestion-pipeline`, `mukoko-platform`, `mukoko-weather`, `mukoko-weather-mobile`, `mukoko-events-admin`, `mukoko-events-mcp`, `nyuchi-identity`.

### `nyuchi` — staying

`api-gateway` — the Nyuchi API — stays in `nyuchi`. It serves every Bundu app, not only Mukoko.

---

## 10. Infrastructure

### 10.1 Fly.io (organisation `nyuchi-web-services`)

| Fly app               | What it is                                | State on 2 October 2026       | Status    |
| --------------------- | ----------------------------------------- | ----------------------------- | --------- |
| `mukoko-platform-api` | The Nyuchi API (`api.nyuchi.com`), `jnb`  | Deployed, 2 machines, healthy | Live      |
| `nyuchi-api`          | The Nyuchi API's new app name             | Created, never deployed       | Designed  |
| `mukoko-doris`        | Apache Doris, `jnb`, private network only | Deployed, healthy             | Live      |
| `mukoko-couchdb`      | Apache CouchDB, `jnb`                     | Deployed, healthy             | Deployed  |
| `mukoko-news-api`     | News ingestion pipeline worker, `jnb`     | Deployed                      | Live      |
| `nyuchi-identity`     | Rust identity gateway, `jnb`              | Deployed, 2 machines          | Scaffold  |
| `mukoko-redpanda`     | Redpanda                                  | Suspended                     | Suspended |
| `mukoko-flink`        | Apache Flink                              | Suspended                     | Suspended |

### 10.2 Licences

The v4 licence table justified each choice by its licence. In v5 the licence of the engine is a cost and a portability question, not a covenant. The covenant is on the data and the weights (section 2.1).

| Technology                | Licence                         | Role                                 | Status     |
| ------------------------- | ------------------------------- | ------------------------------------ | ---------- |
| MongoDB Atlas             | SSPL engine, managed service    | Content system of record             | Live       |
| PostgreSQL (via Supabase) | PostgreSQL (permissive)         | Relational spine; payments           | Live       |
| Apache Doris              | Apache 2.0                      | Search, analytics, open data commons | Live       |
| Apache CouchDB            | Apache 2.0                      | Sync protocol                        | Deployed   |
| FastAPI                   | MIT                             | The Nyuchi API                       | Live       |
| Cloudflare Workers        | Proprietary (managed)           | The consumer API and edge            | Designed   |
| WorkOS AuthKit            | Proprietary (managed)           | Authentication                       | Live       |
| Redpanda                  | BSL → Apache 2.0                | Event streaming                      | Suspended  |
| Apache Flink              | Apache 2.0                      | Stream processing                    | Suspended  |
| Polygon                   | Open source                     | Blockchain (MIT + MXT)               | Designed   |
| ScyllaDB                  | AGPL 3.0, then source-available | Was: non-relational source of truth  | Superseded |
| JanusGraph, Cassandra     | Apache 2.0                      | Was: graph and wide-column plans     | Superseded |
| Maestro                   | —                               | Was: orchestration plan              | Superseded |

---

## 11. The Platform Substrate

**Status:** Designed. Unchanged in intent from v4.0.1.

- **The Digital Twin — Sovereign AI.** Your Honey, Shamwari AI and the Digital Twin NFT, unified into one sovereign intelligence living in the pod. Three layers: personal (trained on pod data, encrypted), community (trained on anonymised Doris data — its weights are open, per section 2.1), platform (base Mukoko knowledge). The conversational interface is still **Shamwari**: a friend serves; a friend does not control. The `shamwari-ai` Fly app is suspended.
- **Mukoko Home — The Surface.** The ambient agentic interface, connecting to external services through MCP.
- **MUKOKO Token — The Economic Protocol.** MIT (soulbound) and MXT (transferable) on Polygon, governed by conviction staking. No contracts are deployed.
- **Ubuntu Layer — The Community Conscience.** Section 2.2.

Media storage (Cloudflare R2 hot, IPFS for ownership, Arweave for permanence) and the Web3 dApp expansion are carried forward from v4.0.1 as **Deferred**.

---

## 12. What Is Live vs. Designed vs. Superseded

### Live

The Nyuchi API at `api.nyuchi.com` (Fly `mukoko-platform-api`, `jnb`), about 30 `/v1` namespaces, scoped client id and secret keys, OAuth `client_credentials`, WorkOS AuthKit sign-in. MongoDB Atlas, one database per domain. `nyuchi_relational_db` with the identity, entity, membership and classification tables backfilled. Payments on Supabase. Doris on Fly, private network only. CouchDB on Fly. The news ingestion pipeline. Mukoko News, Weather, Lingo and Kweli as apps — not yet thin clients.

### Designed

The consumer API at `api.mukoko.com`. Thin clients for every app. The super apps. Writers and readers cut over to the relational spine. Nyuchi Identity as the single WorkOS boundary. The MongoDB → Doris change-stream mirror. Public access to the open data commons. Open-weights release of community-trained models. The sync, edge and device layers. The pod. The token contracts.

### Superseded

ScyllaDB, Cassandra, JanusGraph and Maestro — never built. The v4 `mukoko_platform_cloud` project and its service bus — deleted. Stytch. The single `mukoko-app` plan. The `mukoko-openapi` repository. The "open source everywhere" and "No MongoDB" rules.

### Suspended or Deferred

Redpanda and Flink (suspended on Fly). Geographic and per-user Durable Objects. Media archival to IPFS and Arweave. Web3 dApps.

---

_The Mukoko Architecture — Version 5.0_
_October 2026_
_Built by Nyuchi Africa_
_The Bundu Family — Ubuntu in code_

**mukoko.com** | **nyuchi.com**
