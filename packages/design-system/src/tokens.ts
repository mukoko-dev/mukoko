// Nyuchi Brand v6 — Five African Minerals
// Runtime-accessible design tokens for all Mukoko applications

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

export type MineralName = keyof typeof minerals;
export type ColorMode = "light" | "dark";

/**
 * Get a mineral color value for the given mode.
 */
export function getMineralColor(name: MineralName, mode: ColorMode): string {
  return minerals[name][mode];
}

/**
 * Generate CSS custom properties for the Five African Minerals palette.
 * Includes both light (default) and dark mode via prefers-color-scheme.
 */
export function getCSSCustomProperties(): string {
  return `
    :root {
      --color-primary: ${minerals.tanzanite.light};
      --color-secondary: ${minerals.cobalt.light};
      --color-accent: ${minerals.gold.light};
      --color-shamwari: ${minerals.malachite.light};
      --color-community: ${minerals.terracotta.light};
      --color-tanzanite: ${minerals.tanzanite.light};
      --color-cobalt: ${minerals.cobalt.light};
      --color-gold: ${minerals.gold.light};
      --color-malachite: ${minerals.malachite.light};
      --color-terracotta: ${minerals.terracotta.light};
      --font-display: ${typography.display};
      --font-body: ${typography.body};
      --font-code: ${typography.code};
      --radius-button: ${radii.button};
      --radius-card: ${radii.card};
      --radius-full: ${radii.full};
      --spacing-touch-target: ${spacing.touchTarget};
      --spacing-flag-strip: ${spacing.flagStrip};
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-primary: ${minerals.tanzanite.dark};
        --color-secondary: ${minerals.cobalt.dark};
        --color-accent: ${minerals.gold.dark};
        --color-shamwari: ${minerals.malachite.dark};
        --color-community: ${minerals.terracotta.dark};
        --color-tanzanite: ${minerals.tanzanite.dark};
        --color-cobalt: ${minerals.cobalt.dark};
        --color-gold: ${minerals.gold.dark};
        --color-malachite: ${minerals.malachite.dark};
        --color-terracotta: ${minerals.terracotta.dark};
      }
    }
  `;
}
