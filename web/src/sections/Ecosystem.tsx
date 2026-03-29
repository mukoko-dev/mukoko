const apps = [
  {
    name: "Campfire",
    description: "Your home base. Messaging, payments, and community — all in one conversation.",
    icon: "🔥",
    color: "var(--color-terracotta)",
    colorBg: "var(--color-terracotta-container)",
    anchor: true,
  },
  {
    name: "Pulse",
    description:
      "Your personalized feed — everything happening across the ecosystem, curated by Your Honey.",
    icon: "⚡",
    color: "var(--color-tanzanite)",
    colorBg: "var(--color-tanzanite-container)",
  },
  {
    name: "Mukoko News",
    description: "Context-rich news from trusted sources across Africa and the world.",
    icon: "📰",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container)",
  },
  {
    name: "Bytes",
    description: "Short-form video — scroll, discover, and share what moves you.",
    icon: "🎬",
    color: "var(--color-tanzanite)",
    colorBg: "var(--color-tanzanite-container)",
  },
  {
    name: "Circles",
    description: "Interest-based communities where people gather, discuss, and grow together.",
    icon: "🤝",
    color: "var(--color-terracotta)",
    colorBg: "var(--color-terracotta-container)",
  },
  {
    name: "Nhimbe",
    description:
      "Cultural gatherings, concerts, meetups — discover and book what's happening near you.",
    icon: "🎉",
    color: "var(--color-malachite)",
    colorBg: "var(--color-malachite-container)",
  },
  {
    name: "Novels",
    description: "A platform for African authors to publish and readers to discover web novels.",
    icon: "📖",
    color: "var(--color-gold)",
    colorBg: "var(--color-gold-container)",
  },
  {
    name: "BushTrade",
    description: "A marketplace rooted in trust — buy, sell, and trade within the community.",
    icon: "🏪",
    color: "var(--color-gold)",
    colorBg: "var(--color-gold-container)",
  },
  {
    name: "Mukoko Lingo",
    description: "Learn African languages — Shona, Ndebele, Zulu, Swahili, and more.",
    icon: "🗣️",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container)",
  },
  {
    name: "Weather",
    description: "Hyperlocal forecasts built for African cities, farms, and daily life.",
    icon: "🌤",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container)",
  },
  {
    name: "Transport",
    description: "Routes, schedules, and ride coordination — coming soon.",
    icon: "🚌",
    color: "var(--color-malachite)",
    colorBg: "var(--color-malachite-container)",
  },
  {
    name: "Mukoko ID",
    description: "One identity across the entire ecosystem. Sign up once, access everything.",
    icon: "🪪",
    color: "var(--color-tanzanite)",
    colorBg: "var(--color-tanzanite-container)",
  },
  {
    name: "shamwari",
    description: "Your AI companion — summarizes, translates, recommends, and personalizes.",
    icon: "🧠",
    color: "var(--color-malachite)",
    colorBg: "var(--color-malachite-container)",
  },
  {
    name: "Your Honey",
    description:
      "On-device AI that learns your preferences. Your raw data never leaves your phone.",
    icon: "🍯",
    color: "var(--color-gold)",
    colorBg: "var(--color-gold-container)",
  },
  {
    name: "Mukoko Wallet",
    description: "EcoCash, InnBucks, and MUKOKO tokens — payments built for Africa.",
    icon: "💰",
    color: "var(--color-gold)",
    colorBg: "var(--color-gold-container)",
  },
];

export function Ecosystem() {
  return (
    <section className="section section--alt" id="apps">
      <h2 className="section__title text-center">15 mini-apps. One ecosystem.</h2>
      <p className="section__subtitle text-center text-muted mt-1">
        Every app stands alone as a PWA. Together in the super app, they share one identity, one
        wallet, one AI companion.
      </p>
      <div className="app-grid mt-4">
        {apps.map((app) => (
          <div
            className={`app-card${app.anchor ? " app-card--anchor" : ""}`}
            key={app.name}
            style={{ "--card-accent": app.color, "--card-bg": app.colorBg } as React.CSSProperties}
          >
            <span className="app-card__icon" aria-hidden="true">
              {app.icon}
            </span>
            <h3 className="app-card__name">{app.name}</h3>
            <p className="app-card__description text-muted">{app.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
