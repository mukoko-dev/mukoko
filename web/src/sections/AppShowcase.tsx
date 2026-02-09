const apps = [
  {
    name: "Clips",
    description: "Context-rich news from trusted sources across Africa and the world.",
    icon: "📰",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container, rgba(0, 71, 171, 0.08))",
  },
  {
    name: "Pulse",
    description: "Your personalized feed — everything happening across the ecosystem, curated for you.",
    icon: "⚡",
    color: "var(--color-tanzanite)",
    colorBg: "var(--color-tanzanite-container, rgba(75, 0, 130, 0.08))",
  },
  {
    name: "Connect",
    description: "Interest-based Circles where communities gather, discuss, and grow together.",
    icon: "🤝",
    color: "var(--color-terracotta)",
    colorBg: "var(--color-terracotta-container, rgba(139, 69, 19, 0.08))",
  },
  {
    name: "Novels",
    description: "A platform for African authors to publish and readers to discover web novels.",
    icon: "📖",
    color: "var(--color-gold)",
    colorBg: "var(--color-gold-container, rgba(93, 64, 55, 0.08))",
  },
  {
    name: "Events",
    description: "Cultural gatherings, concerts, meetups — discover and book what's happening near you.",
    icon: "🎉",
    color: "var(--color-malachite)",
    colorBg: "var(--color-malachite-container, rgba(0, 77, 64, 0.08))",
  },
  {
    name: "Weather",
    description: "Hyperlocal forecasts built for African cities, farms, and daily life.",
    icon: "🌤",
    color: "var(--color-cobalt)",
    colorBg: "var(--color-cobalt-container, rgba(0, 71, 171, 0.08))",
  },
];

export function AppShowcase() {
  return (
    <section class="section section--alt" id="apps">
      <h2 class="section__title text-center">Six apps. One ecosystem.</h2>
      <p class="section__subtitle text-center text-muted mt-1">
        Each app stands on its own. Together, they become something greater.
      </p>
      <div class="app-grid mt-4">
        {apps.map((app) => (
          <div
            class="app-card"
            key={app.name}
            style={{ "--card-accent": app.color, "--card-bg": app.colorBg } as Record<string, string>}
          >
            <span class="app-card__icon">{app.icon}</span>
            <h3 class="app-card__name">{app.name}</h3>
            <p class="app-card__description text-muted">{app.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
