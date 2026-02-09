import { h, JSX } from "preact";

export interface FlagStripProps {
  className?: string;
}

/**
 * Zimbabwe flag strip -- a 4px vertical bar on the left edge
 * using the Zimbabwe flag colors: green, gold, red, black, with a white chevron accent.
 * Hidden below 480px viewport width.
 */
export function FlagStrip({ className }: FlagStripProps) {
  const containerStyle: JSX.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "var(--spacing-flag-strip, 4px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const stripeStyle = (color: string): JSX.CSSProperties => ({
    flex: 1,
    backgroundColor: color,
  });

  // Zimbabwe flag colors in order (top to bottom)
  const colors = [
    "#006400", // Green
    "#FFD200", // Gold
    "#EF3340", // Red
    "#000000", // Black
    "#EF3340", // Red
    "#FFD200", // Gold
    "#006400", // Green
  ];

  return (
    <div
      style={containerStyle}
      class={className}
      aria-hidden="true"
      role="presentation"
      data-flag-strip
    >
      {colors.map((color, i) => (
        <span key={i} style={stripeStyle(color)} />
      ))}
      <style>{`
        @media (max-width: 479px) {
          [data-flag-strip] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
