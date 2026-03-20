import type { JSX } from "preact";

export interface FlagStripProps {
  className?: string;
}

/**
 * Five African Minerals strip — a 4px vertical bar on the left edge
 * using the mineral palette: Tanzanite, Cobalt, Gold, Malachite, Terracotta.
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

  // Five African Minerals (top to bottom)
  const colors = [
    "#4B0082", // Tanzanite
    "#0047AB", // Cobalt
    "#5D4037", // Gold
    "#004D40", // Malachite
    "#8B4513", // Terracotta
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
