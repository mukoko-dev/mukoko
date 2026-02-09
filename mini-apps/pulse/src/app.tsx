import type { FunctionalComponent } from "preact";

export const App: FunctionalComponent = () => {
  return (
    <div style={{ fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)", padding: "1rem" }}>
      <h1 style={{ fontFamily: "var(--font-display, 'Noto Serif', serif)" }}>pulse — trending moments</h1>
      <p>Trending short-form content celebrating African creativity.</p>
    </div>
  );
};
