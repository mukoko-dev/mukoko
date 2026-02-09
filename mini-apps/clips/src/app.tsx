import type { FunctionalComponent } from "preact";

export const App: FunctionalComponent = () => {
  return (
    <div style={{ fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)", padding: "1rem" }}>
      <h1 style={{ fontFamily: "var(--font-display, 'Noto Serif', serif)" }}>clips — informed communities</h1>
      <p>Context-rich news from trusted African sources.</p>
    </div>
  );
};
