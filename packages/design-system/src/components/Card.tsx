import { h, JSX, ComponentChildren } from "preact";

export type CardPadding = "sm" | "md" | "lg";

export interface CardProps {
  children: ComponentChildren;
  className?: string;
  padding?: CardPadding;
  interactive?: boolean;
}

const paddingMap: Record<CardPadding, string> = {
  sm: "12px",
  md: "20px",
  lg: "32px",
};

export function Card({
  children,
  className,
  padding = "md",
  interactive = false,
}: CardProps) {
  const style: JSX.CSSProperties = {
    borderRadius: "var(--radius-card, 16px)",
    padding: paddingMap[padding],
    backgroundColor: "var(--card-bg, #ffffff)",
    border: "1px solid var(--card-border, rgba(0, 0, 0, 0.08))",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
    transition: interactive ? "box-shadow 150ms ease-in-out, transform 150ms ease-in-out" : "none",
    cursor: interactive ? "pointer" : "default",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
  };

  return (
    <div
      style={style}
      class={className}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onMouseEnter={interactive ? (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)";
        el.style.transform = "translateY(-1px)";
      } : undefined}
      onMouseLeave={interactive ? (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        el.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)";
        el.style.transform = "translateY(0)";
      } : undefined}
    >
      {children}
    </div>
  );
}
