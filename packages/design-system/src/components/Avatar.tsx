import { h, JSX } from "preact";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { dimension: string; fontSize: string }> = {
  sm: { dimension: "32px", fontSize: "13px" },
  md: { dimension: "40px", fontSize: "16px" },
  lg: { dimension: "56px", fontSize: "22px" },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Simple string-to-index hash for deterministic color selection.
 */
function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const fallbackColors = [
  "var(--color-tanzanite, #4B0082)",
  "var(--color-cobalt, #0047AB)",
  "var(--color-gold, #5D4037)",
  "var(--color-malachite, #004D40)",
  "var(--color-terracotta, #8B4513)",
];

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const { dimension, fontSize } = sizeMap[size];
  const initials = getInitials(name);
  const bgColor = fallbackColors[hashName(name) % fallbackColors.length];

  const baseStyle: JSX.CSSProperties = {
    width: dimension,
    height: dimension,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontWeight: "600",
    fontSize,
    lineHeight: "1",
    userSelect: "none",
  };

  if (src) {
    return (
      <div
        style={baseStyle}
        class={className}
        role="img"
        aria-label={name}
      >
        <img
          src={src}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: bgColor,
        color: "#ffffff",
      }}
      class={className}
      role="img"
      aria-label={name}
    >
      {initials}
    </div>
  );
}
