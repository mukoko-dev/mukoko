const problems = [
  {
    label: "Your data",
    result: "sold",
    color: "var(--color-destructive)",
  },
  {
    label: "Your identity",
    result: "fragmented",
    color: "var(--color-gold)",
  },
  {
    label: "Your community",
    result: "voiceless",
    color: "var(--color-terracotta)",
  },
];

export function Problem() {
  return (
    <section className="section" id="problem">
      <div className="section__inner text-center">
        <h2 className="section__title">47 passwords. 12 apps. Zero ownership.</h2>
        <p className="section__subtitle text-muted mt-2">
          You live on platforms that don&rsquo;t know you, sell your attention, and lock you in.
          Your identity is fragmented. Your data is someone else&rsquo;s product. Your community has
          no voice.
        </p>
        <div className="problem-cards mt-4">
          {problems.map((item) => (
            <div
              className="problem-card"
              key={item.label}
              style={{ "--problem-color": item.color } as React.CSSProperties}
            >
              <span className="problem-card__label">{item.label}</span>
              <span className="problem-card__arrow">&rarr;</span>
              <span className="problem-card__result">{item.result}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
