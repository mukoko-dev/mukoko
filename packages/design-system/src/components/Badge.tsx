import { h, JSX, ComponentChildren } from "preact";
import type { MineralName } from "../tokens.js";

export type BadgeVariant = MineralName;
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ComponentChildren;
  size?: BadgeSize;
  className?: string;
}

const variantColorMap: Record<BadgeVariant, { bg: string; text: string }> = {
  tanzanite: {
    bg: "var(--color-tanzanite, #4B0082)",
    text: "#ffffff",
  },
  cobalt: {
    bg: "var(--color-cobalt, #0047AB)",
    text: "#ffffff",
  },
  gold: {
    bg: "var(--color-gold, #5D4037)",
    text: "#ffffff",
  },
  malachite: {
    bg: "var(--color-malachite, #004D40)",
    text: "#ffffff",
  },
  terracotta: {
    bg: "var(--color-terracotta, #8B4513)",
    text: "#ffffff",
  },
};

const sizeMap: Record<BadgeSize, JSX.CSSProperties> = {
  sm: {
    padding: "2px 10px",
    fontSize: "12px",
  },
  md: {
    padding: "4px 14px",
    fontSize: "14px",
  },
};

export function Badge({
  variant = "tanzanite",
  children,
  size = "md",
  className,
}: BadgeProps) {
  const colors = variantColorMap[variant];

  const style: JSX.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-full, 9999px)",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontWeight: "600",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    backgroundColor: colors.bg,
    color: colors.text,
    ...sizeMap[size],
  };

  return (
    <span style={style} class={className}>
      {children}
    </span>
  );
}
