# mukoko — THE HIVE

## Digital Twin Social Ecosystem — Super App Architecture & Technical Specification

**Version 2.0 | February 2026**

🟩🟨🟥⬛

*A Product of The Bundu Family — Built by Nyuchi Africa*

*Ndiri nekuti tiri — I am because we are*

**Your Honey. Your Identity. Your Sovereignty.**

`CONFIDENTIAL`

---

## 1. Executive Summary

Mukoko is a Digital Twin Social Ecosystem for Africa and the global African diaspora, delivered as a WeChat-style super app on Android, iOS, and Huawei devices. It is the flagship product of The Bundu Family, built by Nyuchi Africa.

The platform consists of six interconnected apps — Mukoko ID, Clips, Pulse, Connect, Novels, and Events — all powered by "Your Honey," a privacy-first personalization engine that works FOR users, not against them. Your Honey runs on-device AI, meaning user behavior data never leaves the device. This is the core product: personalization that empowers rather than manipulates.

The application uses a hybrid architecture: a Flutter native shell provides the core platform services (authentication, wallet, Shamwari AI, notifications, device APIs), while the six ecosystem apps run as optimized WebView mini-apps, enabling rapid development and independent deployment. Each app can also operate as a standalone PWA.

This architecture is adapted for African market realities: mixed device quality, high data costs, intermittent connectivity, and mobile money as the primary payment rail.

- **Target Markets:** Zimbabwe (primary), SADC region, global African diaspora
- **Platforms:** Android (API 24+), iOS (15+), HarmonyOS (Huawei AppGallery)
- **Framework:** Flutter native shell + WebView mini-apps (WeChat model)
- **Backend:** Cloudflare Workers (existing), MongoDB Atlas, D1, KV, Durable Objects
- **AI:** Shamwari AI companion + Nuchi Honey personalization engine (honey.nyuchi.com)
- **Payments:** EcoCash, InnBucks, bank integrations + MUKOKO token economy
- **Identity:** Mukoko ID with Digital Twin NFT on Base blockchain

---

## 2. The Bundu Family

Mukoko exists within a unified brand ecosystem rooted in Shona language and Ubuntu philosophy. Understanding this hierarchy is essential to the architecture because it determines how products relate, how branding flows, and how the user journey works.

### 2.1 Brand Hierarchy

| Layer | Name | Role | Mineral | Hex (Light) | Hex (Dark) |
|-------|------|------|---------|-------------|------------|
| Container | Bundu | The Family — Parent Entity | Terracotta | `#8B4513` | `#D4A574` |
| Philosophy | Ubuntu | Guidelines & Guardrails | Gold | `#5D4037` | `#FFD740` |
| Action | Nyuchi (Bee) | Collective Effort, Pollination | Gold | `#5D4037` | `#FFD740` |
| Structure | Mukoko (Hive) | Community Gathering Space | Tanzanite | `#4B0082` | `#B388FF` |
| Intelligence | Shamwari (Friend) | AI That Lives Inside the Hive | Malachite | `#004D40` | `#64FFDA` |

### 2.2 The Symbiotic Metaphor

> *"The bee needs the hive. The hive needs the bees. Neither exists meaningfully without the other."*

Bees (Nyuchi) fly out into the Bundu (wilderness) to collect, pollinate, and build. They return to the Mukoko (hive) to store knowledge, collaborate, and rest. Inside the Mukoko lives Shamwari — the collective wisdom, the helpful AI intelligence. The cycle continues: gather → store → share → grow.

This mirrors the Ubuntu principle: "Munhu munhu muvanhu" — A person is a person through other persons.

### 2.3 The User Journey in the Bundu Family

1. **ENTER THE BUNDU** — Discover the ecosystem (marketing, word-of-mouth)
2. **JOIN THE MUKOKO** — Create Mukoko ID (single sign-on), welcome ceremony (onboarding)
3. **MEET SHAMWARI** — AI companion introduces features, personalized guidance begins
4. **BECOME NYUCHI** — Start contributing (learning, sharing, creating), pollinate across platforms
5. **SERVE THE HIVE** — Help others in community, store knowledge for next generation
6. **EMBODY UBUNTU** — "I am because we are" realized, individual success = community success

### 2.4 Product Relationships

Mukoko is the flagship Digital Twin Social Ecosystem. Other Nyuchi products are **separate** but use Mukoko ID for authentication:

- **Nyuchi Learning** — Education platform (separate product, uses Mukoko ID)
- **Zimbabwe Travel** — Travel/tourism platform (separate product, uses Mukoko ID)
- **Harare Metro** — Merges INTO Clips (no longer separate; becomes part of Mukoko)

---

## 3. Your Honey — The Core Product

> *"Your Honey. Your Identity. Your Sovereignty."*

Your Honey is the single most important component of Mukoko. It is a personalization engine that learns user preferences on-device and surfaces relevant content across all six ecosystem apps. Unlike exploitative algorithms that optimize for engagement (platform profit), Your Honey optimizes for enrichment (user growth).

### 3.1 How Your Honey Works

1. **You Choose Interests Explicitly** — 32 categories with granular keywords (e.g., "African tech startups" within Technology)
2. **Your Digital Twin Learns On-Device** — As you engage across Clips, Pulse, Connect, Novels, Events, your preferences evolve. All processing stays on YOUR device, never sent to servers.
3. **Content Surfaces Across All Components** — Clips shows news you care about, Pulse surfaces creators you'll love, Connect suggests matching Circles, Novels recommends stories, Events highlights relevant gatherings.
4. **Preferences Evolve As You Grow** — Your Digital Twin captures personality evolution. Interests deepen, shift, and new passions emerge naturally.
5. **Privacy Preserved Always** — On-device AI means no data sent to servers, no surveillance, no selling preferences, no manipulation.

### 3.2 The 32 Interest Categories

Users select from 32 categories during onboarding and can adjust at any time. Each category has granular sub-keywords. Examples:

- Technology (AI, startups, programming, African tech, gadgets)
- Music (Afrobeats, Chimurenga, Amapiano, Gospel, Hip-Hop, Sungura)
- Business (Entrepreneurship, Finance, Investing, SMEs, Agriculture)
- Sports (Football, Cricket, Rugby, Athletics, Boxing)
- Culture (Shona traditions, Ndebele heritage, Pan-African identity, Diaspora)
- Food (Zimbabwean cuisine, Cooking, Restaurants, Street food)
- Politics (Zimbabwe, SADC, AU, Global affairs)
- Health (Fitness, Mental health, Traditional medicine, Healthcare)
- Education (STEM, Languages, Vocational training, Scholarships)
- Entertainment (Movies, Series, Comedy, Theatre, Gaming)
- *...and 22 more categories*

### 3.3 Nuchi Honey Technical Architecture

Nuchi Honey is the backend personalization service that powers Your Honey. It runs on completely isolated infrastructure, separate from the main Cloudflare Workers deployment, for maximum privacy and security.

| Component | Detail |
|-----------|--------|
| Endpoint | `honey.nyuchi.com` |
| Access | Secret-based authentication via Cloudflare Tunnel (zero public exposure) |
| Runtime | Docker containerized, FastAPI-based service |
| Monitoring | Prometheus metrics collection, comprehensive health checks |
| Resilience | Netflix-inspired: circuit breakers, retry logic, bulkhead isolation |
| Privacy Model | Federated learning — improves platform without exposing individual behavior |

### 3.4 On-Device AI Architecture

The on-device component runs as a lightweight ML model embedded in the Flutter shell. It processes user interactions locally, builds the Digital Twin profile, and communicates with Nuchi Honey only to receive updated model weights (federated learning), never raw user data.

- **Model format:** TensorFlow Lite (Android/Huawei) + Core ML (iOS)
- **Size target:** < 5MB model, < 10MB total on-device AI footprint
- **Battery budget:** < 2% additional drain from background learning
- **Sync pattern:** Model weight updates via delta sync, not full model download
- **Local storage:** Digital Twin profile stored encrypted in app sandbox (SQLite)

---

## 4. The Six Ecosystem Apps

Mukoko consists of six interconnected apps, all sharing one Digital Twin, one Your Honey engine, one reputation system, and one token economy. Each app is implemented as a WebView mini-app loaded inside the Flutter shell.

| App | Domain | Purpose | Migrating From |
|-----|--------|---------|----------------|
| Mukoko ID | `id.mukoko.com` | Unified identity, Digital Twin, single sign-on | mukoko-id-api (existing) |
| Clips | `clips.mukoko.com` | Context-rich news from trusted African + global sources | Harare Metro / Mukoko News |
| Pulse | *(super app only)* | Personalized aggregated feed — pulls from all apps, powered by Memory File | Monorepo-native |
| Connect | `connect.mukoko.com` | Interest-based Circles (communities), social forum | New build |
| Novels | `novels.mukoko.com` | African author platform, web novels, long-form stories | New build |
| Events | `events.mukoko.com` | Cultural gatherings, meetups, ticket purchasing | Nhimbe (existing) |

### 4.1 Clips — Informed Communities

Clips is the evolution of Harare Metro and Mukoko News. It provides context-rich news from trusted African and global sources, filtered by Your Honey to surface topics the user actually cares about. News should inform, not manipulate. Context over clickbait.

- Migrates from existing `mukoko-news-backend` Cloudflare Worker
- RSS aggregation from 17+ Zimbabwean sources (Herald, NewsDay, Chronicle, ZBC, Techzim, The Standard, ZimLive, Business Weekly, etc.)
- AI-powered categorization into 10+ content categories
- Your Honey personalizes the feed based on Digital Twin interests
- Threaded comments, bookmarks, reading history (MongoDB Atlas)

### 4.2 Pulse — Your Personalized Feed

Pulse is the super app's aggregated feed — a monorepo-native feature that pulls content from ALL ecosystem apps into a single, personalized stream. It exists only within the super app, powered by the **Memory File**.

- Aggregates content from Clips, Connect, Novels, Events, and creator content
- Personalized by the **Memory File** (co-created by Nyuchi Honey on-device + Mukoko ID cloud)
- Combines TikTok-style vertical scrolling with Instagram-style discovery
- MUKOKO token rewards for quality content creation
- **Not to be confused with Bytes** — Bytes is the TikTok-style scrolling feature in the `mukoko-news` standalone app only

### 4.3 Connect — Interest Communities

Social forum with Circles — interest-based communities. Your Honey suggests Circles matching explicit interests and recommends discussions the user would find valuable. Community forms around shared interests, not algorithmic manipulation.

- Circle creation and moderation tools
- Discussion threads with rich media
- Circle reputation system (moderators earn tokens)
- Cross-pollination: Clips articles can be discussed in relevant Circles
- Leverages existing Durable Objects (ChatRoom, UserSession) for real-time features

### 4.4 Novels — Author Platform

Web novel platform supporting African authors. Authors keep 80%+ of revenue. Your Honey recommends stories in genres the user loves. African stories deserve global audiences.

- Chapter-by-chapter publishing
- Reader engagement (likes, comments, bookmarks)
- Author dashboard with analytics
- MUKOKO token payments for premium chapters
- Genre categorization aligned with Your Honey interest categories

### 4.5 Events — Community Gatherings

Cultural celebrations, meetups, and community events. Evolves from the existing Nhimbe Events platform. Digital connection should enhance physical community, not replace it. Integrates with Mukoko Wallet for ticket purchasing.

- Migrates from existing `mukoko-nhimbe-api` Cloudflare Worker
- Event discovery powered by Your Honey (location + interests)
- Ticket purchasing via Mukoko Wallet (EcoCash, InnBucks, MUKOKO tokens)
- Event organizer tools (create, manage, promote)
- Post-event community: attendees can form Connect Circles

### 4.6 Additional Utility Services

Beyond the six core ecosystem apps, Mukoko supports utility mini-apps that extend the platform:

- **Mukoko Weather** — Local weather forecasts for Zimbabwean cities (utility mini-app, not core ecosystem)
- **Future:** Marketplace, Transport (kombi/taxi booking), Services (bill pay, airtime, utilities)

---

## 5. Shamwari AI — The Intelligence Layer

> *"I serve, I do not control."*

Shamwari (Shona for "friend") is the AI companion that lives inside the Mukoko hive. It is not a separate app but an omnipresent intelligence woven into every part of the ecosystem, guiding users, providing recommendations, and bridging human connection with technology.

### 5.1 Shamwari's Role

- **Onboarding guide** — Introduces new users to the ecosystem, helps configure interests
- **Cross-app intelligence** — Surfaces connections between Clips articles, Pulse creators, Connect discussions, Novels, and Events
- **Conversational assistant** — Answers questions, helps navigate, provides context
- **Content summarization** — Summarizes long articles, provides TLDR for busy users
- **Language support** — Multilingual assistance including Shona and Ndebele

### 5.2 Shamwari's Code (Guidelines)

- **Companionship** — Be present without being intrusive
- **Guidance** — Suggest, don't command
- **Trust** — Earn trust through consistent helpfulness
- **Humility** — Know your limitations
- **Partnership** — Work alongside humans, not above them

### 5.3 Technical Integration

Shamwari runs as a service accessible through the MukokoBridge API. Mini-apps can invoke Shamwari for contextual assistance. The Flutter shell provides a persistent Shamwari chat interface accessible from any screen via a floating action button.

- **Brand color:** Malachite (`#004D40` light / `#64FFDA` dark)
- **Backend:** Dedicated Cloudflare Worker + AI model inference
- **Context:** Receives anonymized context from Your Honey to provide relevant assistance
- **Personality:** Warm, knowledgeable, culturally aware, never condescending

---

## 6. Mukoko ID & Digital Twin

Mukoko ID is the honeycomb that holds the honey. It is the enabling infrastructure that makes Your Honey possible — invisible to users enjoying the sweetness, but essential to the ecosystem. Great infrastructure disappears.

### 6.1 What Mukoko ID Provides

- **ONE** login across all six apps (seamless, no friction)
- **ONE** Digital Twin that learns evolving personality
- **ONE** reputation system that builds as users participate anywhere
- **ONE** wallet collecting MUKOKO tokens from all activities
- **ONE** Your Honey engine that improves across everything

### 6.2 Digital Twin NFT

Each user's Digital Twin is minted as an NFT on the Base blockchain. This is not a gimmick — it represents genuine ownership of digital identity.

- **Not a username granted by Mukoko** — it is the user's PROPERTY
- **Includes:** personality evolution, preferences, reputation
- **Portable:** future use across other African Web3 platforms
- **Valuable:** reputation and social capital are assets
- **Permanent:** cannot be taken away by corporations
- **Deletable:** users can burn their NFT and delete everything (full data sovereignty)

### 6.3 The Memory File

The **Memory File** is the central personalization artifact for each user. It is co-created by two systems:

```
Nyuchi Honey (on-device)          Mukoko ID (cloud)
┌─────────────────────┐          ┌─────────────────────┐
│ Learns preferences   │ ──sync──▶│ Stores Memory File   │
│ privately on phone   │ summaries│ in user's account    │
│ Raw data stays local │          │ Editable by user     │
└─────────────────────┘          └──────────┬──────────┘
                                            │ reads
                              ┌─────────────┼──────────────┐
                              ▼             ▼              ▼
                          Shamwari AI    Pulse feed    All app
                          (companion)   (aggregated)   personalization
```

- **Honey** processes interactions on-device, syncs only summarized data (never raw events) to Mukoko ID
- **Mukoko ID** stores the Memory File securely in the cloud
- **The user can edit or delete** their Memory File at any time — full data sovereignty
- **Shamwari AI**, Pulse, and all app personalization read the Memory File

### 6.4 Existing Infrastructure

Mukoko ID already has production and staging Cloudflare Workers deployed (`mukoko-id-api`, `mukoko-id-api-staging`). The Flutter shell integrates with this existing infrastructure via Stytch authentication, adding biometric unlock, secure token storage, and the Digital Twin minting flow.

---

## 7. Technical Architecture

### 7.1 High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│       MUKOKO SUPER APP (Flutter Shell)                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Native Platform Services (Flutter/Dart)         │  │
│  │                                                  │  │
│  │  Mukoko ID | Wallet | Shamwari AI | NavBar       │  │
│  │  Your Honey (On-Device AI / Digital Twin)        │  │
│  │  Push Notifications | Biometrics | Camera        │  │
│  │  Offline Engine (SQLite + Sync Queue)            │  │
│  └──────────────────────────────────────────────────┘  │
│              │ MukokoBridge JS API │                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Mini-App Runtime (WebView)                      │  │
│  │                                                  │  │
│  │  Clips | Pulse | Connect | Novels | Events       │  │
│  │  + Utility apps (Weather, Marketplace, etc.)     │  │
│  │  (Preact + Nyuchi Design System)                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                        │
            HTTPS (Cloudflare Edge)
                        │
┌────────────────────────────────────────────────────────┐
│  BACKEND SERVICES                                      │
│  API Gateway Worker                                    │
│     │                                                  │
│  ┌──┴───┬──────┬─────┬──────┬──────┬───────┐         │
│  │ ID   │ News │ Nhi │ Weat │ Wall │ Honey │         │
│  │ API  │ API  │ API │ API  │ API  │ (iso) │         │
│  └──┬───┴──────┴─────┴──────┴──────┴───────┘         │
│     │                                                  │
│  ┌──┴─────┬──────┬────┬──────┬───────────┐           │
│  │MongoDB │  D1  │ KV │  R2  │ Durable Obj│          │
│  │ Atlas  │      │    │      │            │          │
│  └────────┴──────┴────┴──────┴───────────┘           │
└────────────────────────────────────────────────────────┘
                        │
               honey.nyuchi.com
         (Isolated Nuchi Honey Service)
      Docker | FastAPI | Cloudflare Tunnel
```

### 7.2 Flutter Native Shell

The Flutter shell handles everything requiring native device access or persistence across mini-app contexts. Built with clean architecture: presentation (widgets), domain (use cases), data (repositories).

#### Shell Responsibilities

- **Authentication lifecycle (Mukoko ID):** login, register, biometric unlock, token refresh, Digital Twin minting
- **Your Honey on-device AI:** TFLite/CoreML model, local preference learning, federated weight sync
- **Shamwari AI:** persistent chat interface, contextual assistance across all apps
- **Wallet operations:** EcoCash, InnBucks, MUKOKO tokens, balance, transactions, QR scan-to-pay
- **WebView management:** lifecycle, caching, preloading, memory management, MukokoBridge injection
- **Mini-app manifest:** registry, version checking, asset preloading from R2
- **Offline engine:** SQLite local database, sync queue, conflict resolution
- **Push notifications:** FCM (Android), APNs (iOS), HMS Push (Huawei), unified notification center
- **Device APIs:** camera, location, contacts, biometrics, NFC, share sheet

#### Key Flutter Dependencies

| Package | Purpose | Notes |
|---------|---------|-------|
| `flutter_inappwebview` | Mini-app WebView runtime | JS bridge, caching, offline |
| `stytch_flutter` | Authentication | Mukoko ID (Stytch sessions, OAuth, MFA) |
| `sqflite` | Local database | Offline cache + sync queue |
| `flutter_secure_storage` | Secure tokens | Keychain/Keystore |
| `tflite_flutter` | On-device ML | Your Honey AI model |
| `firebase_messaging` | Push (Android/iOS) | + `agconnect_push` for Huawei |
| `local_auth` | Biometrics | Fingerprint, Face ID |
| `flutter_riverpod` | State management | Clean, testable state |
| `web3dart` | Blockchain | Digital Twin NFT minting (Base) |
| `mobile_scanner` | QR scanning | Wallet payments |

### 7.3 MukokoBridge JavaScript API

Injected into every mini-app WebView. Provides typed access to native platform services.

```javascript
window.MukokoBridge = {
  auth: {
    getUser()           // Current user + Digital Twin profile
    getToken()          // JWT for API calls
    onAuthChange(cb)    // Subscribe to auth state
  },
  honey: {
    getInterests()      // User's 32-category interest map
    trackInteraction({ type, contentId, duration })
    getSuggestions(context)  // Ask Your Honey for recommendations
  },
  shamwari: {
    ask(question)       // Invoke Shamwari AI
    summarize(content)  // Content summarization
    translate(text, lang)
  },
  wallet: {
    getBalance()        // Wallet balance (fiat + MUKOKO tokens)
    requestPayment({ amount, currency, description })
    transferTokens({ to, amount })
    onPaymentResult(cb)
  },
  device: {
    getLocation()       // GPS coordinates
    openCamera()        // Returns image data
    scanQR()            // QR code scanner
    share(data)         // Native share sheet
    haptic(type)        // Haptic feedback
  },
  nav: {
    openMiniApp(id, params)  // Launch another mini-app
    goBack()                 // Navigate back
    setTitle(text)           // Update nav bar title
  },
  storage: {
    get(key) / set(key, value) / remove(key)
  },
  reputation: {
    getScore()          // Cross-platform reputation
    getTokenBalance()   // MUKOKO token balance
  }
}
```

### 7.4 Mini-App Framework

Each of the six ecosystem apps is a lightweight web application loaded inside the Flutter shell's WebView.

- **UI Framework:** Preact (3KB gzipped — not React's 40KB)
- **Design System:** `@mukoko/ui` — shared Nyuchi Brand v6 components
- **Bridge SDK:** `@mukoko/bridge` — typed TypeScript wrapper around MukokoBridge
- **Build:** Vite, output < 150KB gzipped per mini-app
- **Hosting:** Cloudflare R2 (static assets) + Workers (API)
- **Caching:** Service Worker + Flutter WebView cache (offline-capable)
- **Standalone:** Each mini-app also works as PWA at its subdomain

---

## 8. Backend Architecture

The backend leverages existing Cloudflare Workers infrastructure already deployed and running. The mobile app targets the same API endpoints, with a new API gateway worker for unified routing.

### 8.1 Existing Cloudflare Workers (Production)

| Worker | Purpose | Domain/Route | Status |
|--------|---------|--------------|--------|
| `mukoko-news-backend` | News aggregation, RSS, search, analytics | `app.mukoko.com` | Production |
| `mukoko-id-api` | Authentication, profiles, sessions | — | Production |
| `mukoko-id-api-staging` | Auth staging environment | — | Staging |
| `mukoko-nhimbe-api` | Events discovery, ticketing | — | Production |
| `mukoko-events-api` | Events API | — | Production |
| `mukoko-events-api-staging` | Events staging | — | Staging |
| `mukoko-auth-staging` | Auth staging | — | Staging |
| `nyuchi_api` | Core Nyuchi platform API | — | Production |
| `nyuchi-brand-assets` | Brand system CDN | `assets.nyuchi.com` | Production |
| `hararemetro-redirect` | Legacy redirect | — | Production |
| `r2-brand-explorer` | R2 asset browser | — | Production |
| `zimbabwe-travel` | Travel platform | — | Production |
| `origins-with-perspective` | — | — | Production |
| `nyuchi-africa-dispatcher-staging` | Dispatcher staging | — | Staging |
| `raspy-fog-4352-nlweb` | NLWeb | — | Production |

**Total: 15 workers deployed**

### 8.2 Data Layer

| Service | Usage | Key Resources |
|---------|-------|---------------|
| **MongoDB Atlas** | Primary database — all application data | `users`, `articles`, `events`, `novels`, `circles`, `pulse_posts`, `transactions`, `notifications` |
| **Stytch** | Authentication — sessions, OAuth, MFA, SSO | Mukoko ID SSO across all Nyuchi products |
| **Cloudflare D1** | Edge-local reads for fast auth verification | `mukoko_users` |
| **Cloudflare KV** | Config, cache, sessions, news storage | 4 namespaces: `CONFIG_STORAGE`, `CACHE_STORAGE`, `USER_STORAGE`, `NEWS_STORAGE` |
| **Durable Objects** | Real-time chat, user presence | `ChatRoom`, `UserSession` |
| **Analytics Engine** | Interaction tracking | 3 datasets: `category_clicks`, `news_interactions`, `search_queries` |
| **R2 Storage** | Media, mini-app bundles, brand assets | Brand assets bucket |
| **Nuchi Honey** | Personalization AI (isolated) | `honey.nyuchi.com` (Docker/FastAPI) |

### 8.3 Auth — Stytch

Stytch is the auth provider for the entire ecosystem. NOT Supabase.

- **Sessions:** Stytch session tokens (not Supabase JWT)
- **Methods:** Email magic links, OAuth (Google, GitHub, Apple), SMS OTP, biometric
- **SSO:** Mukoko ID provides SSO to all Nyuchi products (Learning, Travel, Bundu Family)
- **Worker middleware:** Every worker verifies Stytch session token on protected routes
- **Super Admin:** `bryan@nyuchi.com`

### 8.4 New Services Required

| Service | Purpose | Priority |
|---------|---------|----------|
| API Gateway Worker | Unified routing, rate limiting, auth verification | Phase 1 |
| Weather API Worker | Weather data for utility mini-app | Phase 2 |
| Wallet Service Worker | Payment processing, EcoCash/InnBucks, MUKOKO token ledger | Phase 3 |
| Mini-App Registry Worker | Manifest management, versioning, asset serving from R2 | Phase 1 |
| Push Notification Worker | Unified push for FCM, APNs, HMS Push | Phase 2 |
| Shamwari AI Worker | AI inference, conversational assistance, content summarization | Phase 2 |
| Digital Twin Worker | NFT minting on Base, profile sync, reputation calculation | Phase 3 |
| Pulse API Worker | Short-form content, creator profiles, trending | Phase 2 |
| Connect API Worker | Circles, discussions, community management | Phase 2 |
| Novels API Worker | Author platform, chapters, payments | Phase 3 |

---

## 9. MUKOKO Token Economy

Quality contributions deserve quality rewards. The token economy creates sustainable value for community participation across all six apps.

### 9.1 Earning MUKOKO Tokens

- **Clips** — Quality comments, sharing news, community journalism contributions
- **Pulse** — Creating content, trending contributions, curating quality
- **Connect** — Circle moderation, helpful discussions, community building
- **Novels** — Publishing stories, reader engagement, editorial contributions
- **Events** — Organizing events, community gathering, cultural celebration

### 9.2 Spending MUKOKO Tokens

- Premium features across all apps (enhanced analytics, advanced Circle tools)
- Novel subscriptions and chapter unlocks
- Event ticket purchases
- Peer-to-peer transfers between users
- Future: marketplace transactions, service payments

### 9.3 Creator Economics

Creators keep **80%+** of revenue (vs. 30-50% on mainstream platforms):
- Novel authors: 85% of chapter revenue
- Pulse creators: 80% of tipping revenue
- Event organizers: 90% of ticket revenue (platform takes 10% for infrastructure)
- Circle moderators: reputation + token bonuses

### 9.4 Integration with Mobile Money

MUKOKO tokens bridge Web3 and traditional finance. Users can convert between tokens and mobile money (EcoCash, InnBucks) through the Mukoko Wallet, enabling real economic participation.

---

## 10. Mukoko Wallet & Payments

| Method | Integration | Priority |
|--------|-------------|----------|
| EcoCash | Econet API — USSD push / app-to-app | v1 — Critical |
| InnBucks | InnBucks API — wallet integration | v1 — Critical |
| MUKOKO Tokens | Base blockchain — internal ledger + on-chain | v1 |
| Bank Transfer | ZimSwitch / RTGS integration | v2 |
| Card Payments | Visa/Mastercard via payment gateway | v2 |

### Wallet Features

- QR code scan-to-pay at merchants
- Peer-to-peer transfers between Mukoko users
- Event ticket purchasing via Events integration
- Novel chapter purchases and author tips
- Bill splitting for events and group purchases
- Transaction history with full export
- Biometric auth required for transactions above threshold

---

## 11. Data Efficiency & Offline Strategy

Data costs are a primary concern in Zimbabwe. The architecture minimizes data consumption at every level.

### 11.1 Optimization Strategies

- Mini-app bundles downloaded once, cached locally (50-150KB gzipped per app)
- Shared design system loaded once across all mini-apps (not duplicated)
- Images via Cloudflare Images: automatic WebP/AVIF, responsive sizing
- API responses: gzip compression, pagination, delta sync (only changes since last timestamp)
- User-configurable data saver mode: reduces image quality, disables auto-play, limits prefetch
- Your Honey model weights: delta sync, not full model download

### 11.2 Offline Architecture

SQLite (`sqflite`) serves as local database with sync queue pattern. When offline, all writes queue locally with timestamps. When connectivity returns, the sync engine replays against the API with conflict resolution (last-write-wins for content, manual resolution for payments). News, weather, and events are cached with TTLs. The app remains fully browsable offline with stale data indicated in UI.

### 11.3 Data Budget Targets

| Action | Data Cost |
|--------|-----------|
| App install (Flutter shell) | < 25MB |
| Each mini-app first load | < 150KB gzipped |
| News feed refresh (20 articles) | < 50KB |
| Your Honey model sync | < 500KB (delta) |
| Image (article thumbnail) | < 30KB (WebP) |

---

## 12. Repository Structure

```
mukoko/
├── app/                           # Flutter super app shell
│   ├── android/ | ios/ | huawei/  # Platform configs
│   ├── lib/
│   │   ├── core/                  # Init, routing, DI
│   │   ├── features/
│   │   │   ├── auth/              # Mukoko ID (login, register, biometric, Digital Twin)
│   │   │   ├── wallet/            # Payments, balance, tokens, QR
│   │   │   ├── honey/             # On-device AI, Digital Twin learning
│   │   │   ├── shamwari/          # AI companion, chat, assistance
│   │   │   ├── miniapp_runtime/   # WebView manager, bridge, lifecycle
│   │   │   ├── notifications/     # Push + local notification center
│   │   │   ├── discovery/         # Mini-app launcher / home screen
│   │   │   └── settings/          # Preferences, data saver
│   │   ├── shared/                # Design system widgets, Nyuchi theme
│   │   └── bridge/                # MukokoBridge JS implementation
│   └── pubspec.yaml
│
├── mini-apps/                     # Super app frontends (WebView in Flutter shell)
│   ├── clips/                     # Clips — news feed (backend in mukoko-news repo)
│   ├── pulse/                     # Pulse — personalized aggregated feed (monorepo-native)
│   ├── connect/                   # Connect — Circles (backend in mukoko-connect repo)
│   ├── novels/                    # Novels — author platform (backend in mukoko-novels repo)
│   ├── events/                    # Events — gatherings (backend in nhimbe repo)
│   ├── weather/                   # Weather — utility (backend in mukoko-weather repo)
│   └── _template/                 # Starter template for new mini-apps
│
├── services/                      # Cloudflare Workers — super app infrastructure only
│   ├── gateway/                   # API gateway + Stytch session verification
│   ├── id-api/                    # Mukoko ID (Stytch auth + Memory File storage)
│   ├── wallet-api/                # Payments + MUKOKO tokens
│   ├── shamwari-api/              # AI companion (reads Memory File)
│   ├── miniapp-registry/          # Mini-app manifest + R2 assets
│   ├── digital-twin/              # NFT minting + reputation
│   └── _template/                 # Starter template for new services
│
├── honey/                         # Nuchi Honey (isolated)
│   ├── Dockerfile
│   ├── app/                       # FastAPI service
│   ├── models/                    # ML models
│   └── docker-compose.yml
│
├── packages/                      # Shared libraries
│   ├── design-system/             # @mukoko/ui (Preact components)
│   ├── bridge-sdk/                # @mukoko/bridge (typed JS bridge)
│   ├── api-client/                # @mukoko/api (shared API client)
│   └── types/                     # @mukoko/types (shared TypeScript)
│
├── web/                           # Marketing landing page (mukoko.com → Vercel)
│   ├── src/                       # Preact + Vite, Formspree waitlist
│   ├── vercel.json                # Vercel deployment config
│   └── index.html                 # Entry with OG tags
├── docs/                          # Architecture, API docs, guides
├── .github/                       # CI/CD workflows
└── turbo.json                     # Monorepo orchestration
```

---

## 13. Design System: Nyuchi Brand v6

All UI uses the Five African Minerals palette. Mukoko Platform: Tanzanite primary, Cobalt secondary, Gold accent.

### Color System

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| Primary (Tanzanite) | `#4B0082` | `#B388FF` | CTAs, active states, primary nav |
| Secondary (Cobalt) | `#0047AB` | `#00B0FF` | Links, info states, secondary actions |
| Accent (Gold) | `#5D4037` | `#FFD740` | Rewards, wallet, honey, highlights |
| Shamwari (Malachite) | `#004D40` | `#64FFDA` | AI companion, success states |
| Bundu (Terracotta) | `#8B4513` | `#D4A574` | Community, Ubuntu, parent brand |

### Typography

- **Display:** Noto Serif (elegant, cultural weight)
- **Body:** Plus Jakarta Sans (clean, modern, excellent readability)
- **Code:** JetBrains Mono (developer-facing content)

### Design Tokens

- Button radius: 12px
- Card radius: 16px
- Touch targets: 44x44px minimum
- Five African Minerals strip: 4px vertical left edge (Tanzanite → Cobalt → Gold → Malachite → Terracotta, hidden < 480px)
- Wordmarks: always lowercase (`mukoko`, `nyuchi`, `shamwari`, `bundu`)
- Contrast ratios: WCAG AAA (7:1+) — non-negotiable
- Mode adaptation: all colors adapt between light and dark automatically

### Brand Separation Rules

- **Travel Brand:** NO purple/tanzanite (nature-forward aesthetic)
- **Education Brand:** Uses slate dark theme variant (`#0F172A` base, `#1E293B` surface)
- **Mukoko Platform:** Tanzanite primary, Cobalt secondary, Gold accent
- **Shamwari AI:** Malachite primary, Cobalt secondary, Gold accent

---

## 14. Platform Distribution

| Platform | Store | Notes |
|----------|-------|-------|
| Android | Google Play Store | API 24+ (Android 7.0), primary market |
| Android (alt) | APK direct download (mukoko.com) | For devices without Play Store |
| iOS | Apple App Store | iOS 15+, secondary market |
| Huawei | Huawei AppGallery | HarmonyOS, HMS Core, Petal Maps |
| Web (PWA) | `*.mukoko.com` subdomains | Standalone mini-apps as PWAs |

### HarmonyOS Strategy

- Replace Google services with HMS equivalents
- HMS Push Kit (replaces FCM)
- Petal Maps (replaces Google Maps)
- HMS Core ML Kit (supplement for on-device AI)
- `agconnect_push` Flutter package for Huawei push notifications

---

## 15. Development Phases

### Phase 1: Foundation (Weeks 1–8)

- Flutter project: clean architecture, Riverpod state management, platform configs
- Mukoko ID integration: Stytch auth, biometric unlock, secure storage
- WebView runtime: MukokoBridge injection, lifecycle management, caching
- Navigation shell: bottom tabs, mini-app launcher, discovery surface
- Nyuchi Design System for Flutter: shared theme, Tanzanite primary
- API gateway worker deployment
- Your Honey on-device AI: TFLite/CoreML model scaffold, interest selection UI
- Mini-app manifest registry (R2-based asset serving)

### Phase 2: Core Ecosystem (Weeks 9–18)

- Clips mini-app: migrate Harare Metro/Mukoko News to Preact, integrate Your Honey
- Events mini-app: migrate Nhimbe, add ticket purchasing flow
- Pulse mini-app: short-form content, creator profiles, trending
- Connect mini-app: Circles, interest communities, discussions
- Shamwari AI: onboarding flow, basic conversational assistance
- Weather utility mini-app
- Offline engine: SQLite cache + sync queue
- Push notifications: FCM + APNs + HMS Push
- Internal testing on Android

### Phase 3: Wallet & Identity (Weeks 19–26)

- Mukoko Wallet: native Flutter implementation
- EcoCash integration (USSD push + API)
- InnBucks integration
- MUKOKO token ledger + earning/spending across apps
- Digital Twin NFT minting on Base blockchain
- QR code scan-to-pay
- Novels mini-app: author platform, reading experience, chapter payments
- Beta launch on Google Play (Zimbabwe)

### Phase 4: Platform Launch (Weeks 27–34)

- iOS App Store submission
- Huawei AppGallery submission (HMS adaptation)
- Nuchi Honey federated learning: model improvement without exposing user data
- Performance optimization for low-end devices
- Data saver mode implementation
- Mini-app developer SDK documentation
- Public launch across all stores
- 50,000 Digital Twin target

---

## 16. Security & Privacy

- **Transport:** All API communication HTTPS with certificate pinning
- **Token storage:** JWT tokens in platform secure storage (Keychain/Keystore), never in WebView localStorage
- **Mini-app sandboxing:** Scoped storage per app, no cross-app data access without MukokoBridge
- **Your Honey:** On-device only, federated learning for model updates, no raw data leaves device
- **Wallet:** Biometric auth required for transactions above threshold
- **Digital Twin NFT:** User-controlled, deletable (burn), exportable
- **Nuchi Honey service:** Isolated infrastructure, Cloudflare Tunnel, secret-based auth
- **Mini-app permissions:** Apps declare required capabilities in manifest, user approves
- **PCI DSS:** No card data stored on device, tokenization only
- **MongoDB Atlas:** Role-based access control on all collections
- **Secrets management:** All API keys and tokens in environment variables, never in source code
- **Admin access:** `bryan@nyuchi.com` is super_admin with full RBAC system

---

## 17. The Ubuntu Test

Before any feature, product, or decision launches, it must pass the Ubuntu Test:

1. **Does this strengthen community?** (Not just engagement)
2. **Does this respect human dignity?** (Not just compliance)
3. **Does this serve the collective good?** (Not just revenue)
4. **Would we explain this proudly to our elders?** (Not just legally)
5. **Does this align with "I am because we are"?** (Not just "I win")

If the answer to any is "no," reconsider.

---

🟩🟨🟥⬛

**The algorithm works FOR you.**
**The identity belongs TO you.**
**The community strengthens WITH you.**

*Ndiri nekuti tiri — Built by Nyuchi Africa*