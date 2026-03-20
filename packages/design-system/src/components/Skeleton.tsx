import type { JSX } from "preact";

export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "20px",
  rounded = false,
  className,
}: SkeletonProps) {
  const style: JSX.CSSProperties = {
    display: "block",
    width,
    height,
    borderRadius: rounded ? "var(--radius-full, 9999px)" : "var(--radius-button, 12px)",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    backgroundImage:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    backgroundRepeat: "no-repeat",
    animation: "mukoko-shimmer 1.5s ease-in-out infinite",
  };

  return (
    <span style={style} class={className} role="status" aria-label="Loading" aria-busy="true" />
  );
}

/**
 * CSS keyframes string for the shimmer animation.
 * Inject this into a <style> tag or use getCSSCustomProperties() which includes it.
 */
export const skeletonKeyframes = `
  @keyframes mukoko-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes mukoko-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
