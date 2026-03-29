import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";
import { HoneycombBackgroundLoader } from "@/components/HoneycombBackgroundLoader";
import { ValueSimulator } from "./ValueSimulator";

export const metadata: Metadata = {
  title: "Token Economics — mukoko",
  description:
    "The MUKOKO Token is the first currency whose value is anchored to human time. Two tokens, one ecosystem — identity and exchange working together.",
  openGraph: {
    title: "Token Economics — mukoko",
    description:
      "The MUKOKO Token is the first currency whose value is anchored to human time. Two tokens, one ecosystem — identity and exchange working together.",
  },
};

const mitAttrs = [
  { k: "Type", v: "Soulbound ERC-721" },
  { k: "Transferable", v: "Never" },
  { k: "Anchor", v: "Your birth date" },
  { k: "Purpose", v: "Identity + Governance" },
  { k: "Supply", v: "1 per verified human" },
];

const mxtAttrs = [
  { k: "Type", v: "ERC-20" },
  { k: "Transferable", v: "Yes" },
  { k: "Floor", v: "MIT pool mean" },
  { k: "Purpose", v: "Payments + Governance staking" },
  { k: "Supply", v: "Elastic \u00B7 no hard cap" },
];

const allocation = [
  {
    label: "Ecosystem Reserve",
    pct: 30,
    color: "var(--color-tanzanite)",
    desc: "Creator rewards, developer grants, expansion",
  },
  {
    label: "Community Treasury",
    pct: 20,
    color: "var(--color-malachite)",
    desc: "Governed by MIT holders via conviction staking",
  },
  {
    label: "Founding Team",
    pct: 25,
    color: "var(--color-cobalt)",
    desc: "4yr vest \u00B7 1yr cliff \u00B7 builder alignment",
  },
  {
    label: "Operations Reserve",
    pct: 10,
    color: "var(--color-gold)",
    desc: "Salaries, infrastructure, legal, audits",
  },
  {
    label: "Investors & Partners",
    pct: 10,
    color: "var(--color-terracotta)",
    desc: "Economic rights \u00B7 no governance rights",
  },
  {
    label: "Advisors",
    pct: 5,
    color: "var(--color-tanzanite)",
    desc: "2yr vest \u00B7 3 month cliff",
  },
];

const growthSteps = [
  { text: "1M new users join mukoko", final: false },
  { text: "10B MXT minted into Ecosystem Reserve", final: false },
  { text: "Creator rewards fund new content", final: false },
  {
    text: "More content \u2192 more users \u2192 more growth",
    final: false,
  },
  { text: "MIT pool means rise as community ages", final: false },
  { text: "MXT floor value rises. Always.", final: true },
];

export default function TokenPage() {
  return (
    <>
      <HoneycombBackgroundLoader />
      <Header />
      <main id="main-content">
        {/* Hero */}
        <div className="hero-cover">
          <div className="hero-cover__inner">
            <p className="hero-cover__eyebrow">Token Economics</p>
            <p className="hero-cover__wordmark">mukoko</p>
            <h1 className="hero-cover__title">
              A currency that grows
              <br />
              <em>because you do.</em>
            </h1>
            <p className="hero-cover__tagline">
              The MUKOKO Token is the first currency in history whose value is
              anchored to human time — not gold, not dollars, not speculation.
              The older the community, the more valuable every token in it
              becomes. This is Ubuntu as economics.
            </p>
            <div className="hero-cover__meta">
              <div className="hero-cover__meta-item">
                <strong>Chain</strong>
                Polygon PoS
              </div>
              <div className="hero-cover__meta-item">
                <strong>Initial Supply</strong>
                3B MXT
              </div>
              <div className="hero-cover__meta-item">
                <strong>Supply Model</strong>
                Elastic
              </div>
            </div>
          </div>
        </div>

        {/* Two tokens */}
        <div className="content-area" style={{ maxWidth: 1000 }}>
          <section className="content-section">
            <p className="content-section__number">01 — Two Tokens</p>
            <h2 className="content-section__title">
              Two tokens.
              <br />
              One <em>ecosystem</em>.
            </h2>
            <p className="body-text">
              They are different instruments designed for different jobs, but
              they work as one system.
            </p>

            <div className="token-pair">
              {/* MIT */}
              <div className="token-card token-card--mit">
                <div className="token-card__header">
                  <div className="token-card__symbol">MIT</div>
                  <div>
                    <div className="token-card__name">
                      MUKOKO Identity Token
                    </div>
                    <div className="token-card__tagline">Who you are</div>
                  </div>
                </div>
                <div className="token-card__attrs">
                  {mitAttrs.map((a) => (
                    <div className="token-card__attr" key={a.k}>
                      <span className="token-card__attr-key">{a.k}</span>
                      <span className="token-card__attr-val">{a.v}</span>
                    </div>
                  ))}
                </div>
                <p className="token-card__desc">
                  Your MIT is permanently, cryptographically bound to your
                  verified birth date. It pools with everyone born in the same
                  year, month, and day. As the community ages together, every
                  MIT&apos;s value rises. You cannot buy a second one. You
                  cannot sell yours. It is the digital equivalent of ancestral
                  land — it represents your permanent stake in the community.
                </p>
              </div>

              {/* MXT */}
              <div className="token-card token-card--mxt">
                <div className="token-card__header">
                  <div className="token-card__symbol">MXT</div>
                  <div>
                    <div className="token-card__name">
                      MUKOKO Exchange Token
                    </div>
                    <div className="token-card__tagline">What you spend</div>
                  </div>
                </div>
                <div className="token-card__attrs">
                  {mxtAttrs.map((a) => (
                    <div className="token-card__attr" key={a.k}>
                      <span className="token-card__attr-key">{a.k}</span>
                      <span className="token-card__attr-val">{a.v}</span>
                    </div>
                  ))}
                </div>
                <p className="token-card__desc">
                  MXT is the currency you use every day — paying for event
                  tickets, renting equipment, rewarding novel authors, splitting
                  a bill in chat. Its floor value is mathematically guaranteed by
                  the MIT pool system and can never fall below that floor. The
                  supply grows with the economy, like any functioning currency
                  should.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Value Simulator */}
        <div className="content-area" style={{ maxWidth: 820 }}>
          <section className="content-section">
            <p className="content-section__number">02 — Value Formula</p>
            <h2 className="content-section__title">
              How your MIT value
              <br />
              is <em>calculated</em>
            </h2>
            <p className="body-text">
              Adjust the sliders to see how birth date affects the composite
              value formula. Your MIT gains value every second — automatically,
              without you doing anything.
            </p>

            <ValueSimulator />
          </section>
        </div>

        {/* Allocation */}
        <div className="content-area" style={{ maxWidth: 1000 }}>
          <section className="content-section">
            <p className="content-section__number">03 — Allocation</p>
            <h2 className="content-section__title">
              Token
              <br />
              <em>allocation</em>
            </h2>
            <p className="body-text">
              3 billion MXT minted at launch. 50% goes to the community from day
              one. Investors get economic participation — not governance rights.
            </p>

            <div className="alloc-bars">
              {allocation.map((a) => (
                <div className="alloc-row" key={a.label}>
                  <div className="alloc-row__label">{a.label}</div>
                  <div className="alloc-row__track">
                    <div
                      className="alloc-row__fill"
                      style={{
                        width: `${a.pct * 2}%`,
                        background: a.color,
                      }}
                    >
                      {a.pct > 10 && (
                        <span className="alloc-row__fill-text">{a.desc}</span>
                      )}
                    </div>
                  </div>
                  <div className="alloc-row__pct" style={{ color: a.color }}>
                    {a.pct}%
                  </div>
                </div>
              ))}
            </div>

            <div className="stat-summary">
              <div className="stat-card">
                <div className="stat-card__value">50%</div>
                <div className="stat-card__label">Community + Ecosystem</div>
                <div className="stat-card__note">
                  Majority belongs to the community from day one
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">3B</div>
                <div className="stat-card__label">Initial MXT Supply</div>
                <div className="stat-card__note">
                  Growing elastically with the African economy
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">Zero</div>
                <div className="stat-card__label">
                  Investor Governance Rights
                </div>
                <div className="stat-card__note">
                  Economic participation. Not platform control.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Why no hard cap */}
        <div className="content-area" style={{ maxWidth: 900 }}>
          <section className="content-section">
            <p className="content-section__number">04 — Elastic Supply</p>
            <h2 className="content-section__title">
              Why there is no
              <br />
              hard supply <em>cap</em>
            </h2>

            <div className="supply-split">
              <div>
                <p className="body-large">
                  Bitcoin has 21 million coins because Bitcoin is designed as
                  digital gold — something you hold, not spend. MXT is designed
                  to be <strong>everyday money</strong>: an event ticket in
                  Accra, a meal in Lagos, a chapter from your favourite author.
                </p>
                <p className="body-text">
                  At continental scale — 1 billion users, trillions of dollars in
                  transactions — a fixed supply would strangle the
                  platform&apos;s own success. So MXT&apos;s supply grows with
                  the economy, governed by mathematics, not by institutions.
                </p>

                <div className="supply-params">
                  <div className="supply-param">
                    <span className="supply-param__key">
                      Baseline emission
                    </span>
                    <span className="supply-param__val">
                      10,000 MXT per new verified user
                    </span>
                  </div>
                  <div className="supply-param">
                    <span className="supply-param__key">Annual ceiling</span>
                    <span className="supply-param__val">
                      15% maximum growth per year
                    </span>
                  </div>
                  <div className="supply-param">
                    <span className="supply-param__key">Burn rate</span>
                    <span className="supply-param__val">
                      30% of all transaction fees
                    </span>
                  </div>
                </div>
              </div>

              <div className="growth-engine">
                <div className="growth-engine__title">The growth engine</div>
                {growthSteps.map((s, idx) => (
                  <div key={idx}>
                    <div className="growth-engine__step">
                      <div className="growth-engine__num">{idx + 1}</div>
                      <span
                        className={`growth-engine__text ${s.final ? "growth-engine__text--final" : ""}`}
                      >
                        {s.text}
                      </span>
                    </div>
                    {!s.final && (
                      <div className="growth-engine__arrow">\u2193</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Governance */}
        <div className="content-area">
          <section className="content-section">
            <p className="content-section__number">05 — Governance</p>
            <h2 className="content-section__title">
              Community governs.
              <br />
              The founder <em>protects</em>.
            </h2>

            <p className="body-large">
              Governance is built on conviction staking — you stake MXT against
              specific mandates. The option with the highest total effective
              weight wins. Collective participation beats individual wealth
              concentration. This is <strong>Ubuntu as governance</strong>.
            </p>

            <div className="feature-blocks">
              <div className="feature-block">
                <p className="feature-block__label">Quadratic voting</p>
                <p className="feature-block__text">
                  Doubling your stake only increases your weight by ~41%, not
                  100%. A community of 1,000 people each staking 100 MXT has
                  more weight than one person staking 100,000 MXT.{" "}
                  <strong>
                    Effective Weight = \u221A(MXT staked) \u00D7 Ubuntu
                    Multiplier \u00D7 Regional Multiplier
                  </strong>
                </p>
              </div>
              <div className="feature-block">
                <p className="feature-block__label">Ubuntu Multiplier</p>
                <p className="feature-block__text">
                  Long-standing community members carry amplified governance
                  influence — not because they have more money, but because they
                  have demonstrated sustained commitment. Ranges from{" "}
                  <strong>1.0\u00D7</strong> for new users to{" "}
                  <strong>2.0\u00D7</strong> for community pillars with Ubuntu
                  scores above 900.
                </p>
              </div>
              <div className="feature-block">
                <p className="feature-block__label">
                  Founder&apos;s Reserved Powers
                </p>
                <p className="feature-block__text">
                  The founding team&apos;s protection comes from legal rights
                  embedded in the Mukoko Foundation&apos;s Mauritius
                  constitutional documents — not token dominance. The community
                  governs operations. The founder protects the soul:{" "}
                  <strong>
                    Ubuntu purpose, African sovereignty, core protocol integrity
                  </strong>
                  .
                </p>
              </div>
              <div className="feature-block">
                <p className="feature-block__label">Four governance tiers</p>
                <p className="feature-block__text">
                  <strong>Tier 1 Constitutional</strong> (66% quorum) for
                  protocol changes. <strong>Tier 2 Strategic</strong> (40%) for
                  expansion and reserve releases.{" "}
                  <strong>Tier 3 Operational</strong> (20%) for features and
                  policy. <strong>Tier 4 Community</strong> (10% local stake)
                  for circles and regional matters.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Foundation */}
        <div className="content-area">
          <section className="content-section">
            <p className="content-section__number">06 — The Foundation</p>
            <h2 className="content-section__title">
              Two entities.
              <br />
              One <em>mission</em>.
            </h2>

            <div className="card-grid">
              <div className="mineral-card mineral-card--tanzanite">
                <span className="mineral-card__icon" aria-hidden="true">
                  {"\u{1F3DB}\uFE0F"}
                </span>
                <p className="mineral-card__title">Mukoko Foundation</p>
                <p className="mineral-card__body">
                  Mauritius-registered under the Foundations Act 2012. Token
                  issuer, governance steward, VASP licence holder. Exists for
                  the community — not for profit.
                </p>
              </div>
              <div className="mineral-card mineral-card--cobalt">
                <span className="mineral-card__icon" aria-hidden="true">
                  {"\u{1F3D7}\uFE0F"}
                </span>
                <p className="mineral-card__title">Nyuchi Africa</p>
                <p className="mineral-card__body">
                  Zimbabwe-registered operating company. Builds the platform,
                  employs the team, generates B2B revenue. Legally independent
                  from the Foundation.
                </p>
              </div>
            </div>

            <p className="body-text">
              This separation is philosophically essential. Using token dominance
              to protect founder control would mean concentrating economic wealth
              at the top while claiming to build a community platform — a direct
              contradiction of Ubuntu. The Reserved Powers structure separates
              the question cleanly:{" "}
              <strong>
                genuine community economic participation alongside genuine
                constitutional founder protection
              </strong>
              , each in its proper domain.
            </p>
          </section>
        </div>

        {/* Closing */}
        <div className="content-area">
          <div className="content-closing">
            <p className="content-closing__headline">Ndiri nekuti tiri.</p>
            <p className="content-closing__sub">
              Shona — &ldquo;I am because we are.&rdquo;
            </p>
            <p className="content-closing__tagline">
              Growth benefits everyone already on the platform.
            </p>
            <p className="content-closing__byline">
              Nyuchi Africa &middot; mukoko &middot; Mukoko Foundation
              <br />
              Built from Zimbabwe, for Africa and the world.
            </p>
            <Link className="back-link mt-5" href="/">
              &larr; Back to mukoko
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
