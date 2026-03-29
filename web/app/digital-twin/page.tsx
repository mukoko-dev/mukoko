import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";
import { HoneycombBackgroundLoader } from "@/components/HoneycombBackgroundLoader";
import { TwinDemo } from "./TwinDemo";

export const metadata: Metadata = {
  title: "Digital Twin — mukoko",
  description:
    "Your Mukoko Digital Twin is a living, evolving portrait of who you are — on-chain, soulbound, and permanently yours.",
  openGraph: {
    title: "Digital Twin — mukoko",
    description:
      "Your Mukoko Digital Twin is a living, evolving portrait of who you are — on-chain, soulbound, and permanently yours.",
  },
};

const twinStages = [
  {
    step: "01",
    title: "You verify your identity",
    desc: "A real person, a real birth date, a real moment in time. Your verified date of birth becomes the mathematical anchor of your identity token — permanently and immutably yours.",
    icon: "\u{1FAAA}",
    color: "var(--color-cobalt)",
  },
  {
    step: "02",
    title: "Your token is minted on-chain",
    desc: "A soulbound MUKOKO Identity Token is minted to your wallet on the Polygon blockchain. This token is non-transferable — it cannot be sold, traded, or taken from you. It belongs to you the way your birthday belongs to you.",
    icon: "\u26D3\uFE0F",
    color: "var(--color-tanzanite)",
  },
  {
    step: "03",
    title: "Your twin learns your world",
    desc: "As you use mukoko — reading news, attending events, buying on the marketplace, talking in communities — shamwari builds a rich picture of your interests, preferences, and personality. All learning happens on your device. Nothing leaves without your permission.",
    icon: "\u{1F9E0}",
    color: "var(--color-malachite)",
  },
  {
    step: "04",
    title: "Your twin becomes you",
    desc: "Your digital twin carries your interests across every mini-app simultaneously. The same you that loves Afrobeats in Mukoko News also gets Afrobeats event recommendations in Nhimbe, Afrobeats articles in Pulse, and Afrobeats creators to follow in Circles. One identity. One twin. Everywhere.",
    icon: "\u2728",
    color: "var(--color-gold)",
  },
];

const sovereigntyCards = [
  {
    icon: "\u{1F512}",
    title: "On-device learning",
    body: "shamwari AI processes your behaviour entirely on your device. Your patterns, preferences, and habits never leave your phone unless you explicitly choose to share them.",
    color: "malachite",
  },
  {
    icon: "\u{1F9EC}",
    title: "Soulbound identity",
    body: "Your MIT Token cannot be transferred, sold, or revoked. It is cryptographically bound to your verified identity on the Polygon blockchain. It is yours for life.",
    color: "tanzanite",
  },
  {
    icon: "\u{1F4E4}",
    title: "Full data portability",
    body: "Export your complete digital twin — every interest, preference, and setting — at any time, in any format. Take it with you. Delete it. You decide.",
    color: "cobalt",
  },
  {
    icon: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}",
    title: "Family protection",
    body: "Users under 18 are never profiled. shamwari's learning engine is automatically disabled for minor accounts. Parents set the rules.",
    color: "gold",
  },
  {
    icon: "\u{1F30D}",
    title: "African by design",
    body: "Your identity isn't filtered through American or European systems. mukoko is built in Africa, for Africa, and your data stays on African infrastructure.",
    color: "terracotta",
  },
  {
    icon: "\u26A1",
    title: "Ubuntu Score",
    body: "Your contribution to the community — helping others, creating content, hosting events — builds a reputation that amplifies your voice in governance. Community is the currency.",
    color: "tanzanite",
  },
];

export default function DigitalTwinPage() {
  return (
    <>
      <HoneycombBackgroundLoader />
      <Header />
      <main id="main-content">
        {/* Hero */}
        <div className="hero-cover">
          <div className="hero-cover__inner">
            <p className="hero-cover__eyebrow">Mukoko Identity</p>
            <p className="hero-cover__wordmark">mukoko</p>
            <h1 className="hero-cover__title">
              You are more than
              <br />
              <em>a username.</em>
            </h1>
            <p className="hero-cover__tagline">
              Your Mukoko Digital Twin is a living, evolving portrait of who you
              are — your interests, your communities, your world. It lives
              on-chain as an identity token that is permanently and irreversibly
              yours. Nobody can take it. Nobody can buy it. Nobody can copy it.
            </p>
            <div className="hero-cover__meta">
              <div className="hero-cover__meta-item">
                <strong>Protocol</strong>
                Polygon PoS
              </div>
              <div className="hero-cover__meta-item">
                <strong>Token</strong>
                Soulbound ERC-721
              </div>
              <div className="hero-cover__meta-item">
                <strong>Privacy</strong>
                On-device AI
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Twin Demo */}
        <div className="content-area" style={{ maxWidth: 1100 }}>
          <section className="content-section">
            <p className="content-section__number">01 — Your Digital Twin</p>
            <h2 className="content-section__title">
              Your twin builds
              <br />
              in <em>real time</em>
            </h2>
            <p className="body-text">
              Tap any interest below to see your digital twin evolve. In mukoko,
              this happens automatically as you live your life on the platform.
            </p>

            <TwinDemo />
          </section>
        </div>

        {/* From Person to Protocol */}
        <div className="content-area">
          <section className="content-section">
            <p className="content-section__number">
              02 — From Person to Protocol
            </p>
            <h2 className="content-section__title">
              How a human being becomes
              <br />a soulbound <em>digital identity</em>
            </h2>

            <div className="journey-steps">
              {twinStages.map((stage) => (
                <div className="journey-step" key={stage.step}>
                  <div className="journey-step__icon-wrap">
                    <div className="journey-step__icon">{stage.icon}</div>
                    <div
                      className="journey-step__num"
                      style={{ color: stage.color }}
                    >
                      {stage.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="journey-step__title">{stage.title}</h3>
                    <p className="journey-step__desc">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Data Sovereignty */}
        <div className="content-area" style={{ maxWidth: 1000 }}>
          <section className="content-section">
            <p className="content-section__number">03 — Data Sovereignty</p>
            <h2 className="content-section__title">
              Your data.
              <br />
              Your <em>rules</em>.
            </h2>
            <p className="body-large">
              Most platforms extract your data and sell it. mukoko inverts the
              relationship entirely.
            </p>

            <div className="sovereignty-grid">
              {sovereigntyCards.map((card) => (
                <div className="sovereignty-card" key={card.title}>
                  <div className="sovereignty-card__icon">{card.icon}</div>
                  <h3
                    className="sovereignty-card__title"
                    style={{ color: `var(--color-${card.color})` }}
                  >
                    {card.title}
                  </h3>
                  <p className="sovereignty-card__body">{card.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* The Three-Pool System */}
        <div className="content-area">
          <section className="content-section">
            <p className="content-section__number">04 — The Protocol</p>
            <h2 className="content-section__title">
              Value anchored to
              <br />
              <em>time itself</em>
            </h2>

            <p className="body-large">
              The Mukoko Token Protocol anchors value to the one thing that is
              universally shared, immutable, and impossible to manipulate:{" "}
              <strong>the passage of time.</strong>
            </p>

            <p className="body-text">
              Every person has a date of birth. That date cannot be changed,
              inflated, or devalued by any government, central bank, or market
              participant. The older that moment becomes, the more time has
              accumulated around it — and time accumulates at exactly one second
              per second, for everyone, forever.
            </p>

            <div className="card-grid">
              <div className="mineral-card mineral-card--tanzanite">
                <span className="mineral-card__icon" aria-hidden="true">
                  {"\u{1F4C5}"}
                </span>
                <p className="mineral-card__title">Year Pool (60%)</p>
                <p className="mineral-card__body">
                  Everyone born in the same calendar year. The largest, most
                  stable pool — resistant to manipulation because flooding it
                  would require millions of fake users.
                </p>
              </div>
              <div className="mineral-card mineral-card--cobalt">
                <span className="mineral-card__icon" aria-hidden="true">
                  {"\u{1F319}"}
                </span>
                <p className="mineral-card__title">Month Pool (30%)</p>
                <p className="mineral-card__body">
                  Everyone born in the same month across any year. Bridges
                  generations, creating connections across birth year cohorts.
                </p>
              </div>
              <div className="mineral-card mineral-card--gold">
                <span className="mineral-card__icon" aria-hidden="true">
                  \u2B50
                </span>
                <p className="mineral-card__title">Day Pool (10%)</p>
                <p className="mineral-card__body">
                  Everyone born on the same day-of-month. The most personal
                  layer — connecting you to a multigenerational community.
                </p>
              </div>
            </div>

            <p className="body-text">
              Your token&apos;s value is the weighted composite of these three
              pool means. Every token ages at exactly one second per second.
              Value is therefore <strong>monotonically increasing</strong> — it
              can never permanently go down. There is no crash scenario in the
              protocol.
            </p>

            <div className="pull-quote">
              <p>
                &ldquo;In Ubuntu thinking, a person&apos;s worth is inseparable
                from the community around them. In the Mukoko Token Protocol, a
                token&apos;s value is inseparable from the community of tokens
                it shares time with.&rdquo;
              </p>
            </div>
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
              Your twin. Your sovereignty. Your hive.
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
