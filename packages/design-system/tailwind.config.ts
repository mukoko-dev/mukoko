// Nyuchi Brand v6 — Five African Minerals
// These are the SINGLE SOURCE OF TRUTH for all Mukoko colors

export const minerals = {
  tanzanite: {
    light: "#4B0082",
    dark: "#B388FF",
  },
  cobalt: {
    light: "#0047AB",
    dark: "#00B0FF",
  },
  gold: {
    light: "#5D4037",
    dark: "#FFD740",
  },
  malachite: {
    light: "#004D40",
    dark: "#64FFDA",
  },
  terracotta: {
    light: "#8B4513",
    dark: "#D4A574",
  },
} as const;

export const typography = {
  display: "'Noto Serif', serif",
  body: "'Plus Jakarta Sans', sans-serif",
  code: "'JetBrains Mono', monospace",
} as const;

export const radii = {
  button: "12px",
  card: "16px",
  full: "9999px",
} as const;

export const spacing = {
  touchTarget: "44px",
  flagStrip: "4px",
} as const;

// Tailwind v4 compatible config
export default {
  theme: {
    extend: {
      colors: {
        tanzanite: {
          light: minerals.tanzanite.light,
          dark: minerals.tanzanite.dark,
        },
        cobalt: {
          light: minerals.cobalt.light,
          dark: minerals.cobalt.dark,
        },
        gold: {
          light: minerals.gold.light,
          dark: minerals.gold.dark,
        },
        malachite: {
          light: minerals.malachite.light,
          dark: minerals.malachite.dark,
        },
        terracotta: {
          light: minerals.terracotta.light,
          dark: minerals.terracotta.dark,
        },
      },
      fontFamily: {
        display: [typography.display],
        body: [typography.body],
        code: [typography.code],
      },
      borderRadius: {
        button: radii.button,
        card: radii.card,
      },
      spacing: {
        "touch-target": spacing.touchTarget,
        "flag-strip": spacing.flagStrip,
      },
    },
  },
};
