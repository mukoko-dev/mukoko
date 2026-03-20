const apps = [
  {
    name: "Clips",
    description: "Context-rich news from trusted sources across Africa and the world.",
    icon: "📰",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container)",
  },
  {
    name: "Pulse",
    description:
      "Your personalized feed — everything happening across the ecosystem, curated for you.",
    icon: "⚡",
    color: "var(--color-tanzanite)",
    colorBg: "var(--color-tanzanite-container)",
  },
  {
    name: "Connect",
    description: "Interest-based Circles where communities gather, discuss, and grow together.",
    icon: "🤝",
    color: "var(--color-terracotta)",
    colorBg: "var(--color-terracotta-container)",
  },
  {
    name: "Novels",
    description: "A platform for African authors to publish and readers to discover web novels.",
    icon: "📖",
    color: "var(--color-gold)",
    colorBg: "var(--color-gold-container)",
  },
  {
    name: "Events",
    description:
      "Cultural gatherings, concerts, meetups — discover and book what's happening near you.",
    icon: "🎉",
    color: "var(--color-malachite)",
    colorBg: "var(--color-malachite-container)",
  },
  {
    name: "Weather",
    description: "Hyperlocal forecasts built for African cities, farms, and daily life.",
    icon: "🌤",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container)",
  },
];

export function AppShowcase() {
  return (
    <section className="section section--alt" id="apps">
      <h2 className="section__title text-center">Six apps. One ecosystem.</h2>
      <p className="section__subtitle text-center text-muted mt-1">
        Each app stands on its own. Together, they become something greater.
      </p>
      <div className="app-grid mt-4">
        {apps.map((app) => (
          <div
            className="app-card"
            key={app.name}
            style={{ "--card-accent": app.color, "--card-bg": app.colorBg } as React.CSSProperties}
          >
            <span className="app-card__icon">{app.icon}</span>
            <h3 className="app-card__name">{app.name}</h3>
            <p className="app-card__description text-muted">{app.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
