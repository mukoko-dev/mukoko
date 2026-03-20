import type { FunctionalComponent } from "preact";

export const App: FunctionalComponent = () => {
  return (
    <div
      style={{ fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)", padding: "1rem" }}
    >
      <h1 style={{ fontFamily: "var(--font-display, 'Noto Serif', serif)" }}>
        events — community gatherings
      </h1>
      <p>Cultural gatherings, meetups, and community events.</p>
    </div>
  );
};
