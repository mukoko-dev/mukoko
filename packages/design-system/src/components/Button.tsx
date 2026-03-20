import type { JSX } from "preact";

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: JSX.Element | string;
  onClick?: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, JSX.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--color-secondary)",
    color: "#ffffff",
    border: "none",
  },
  accent: {
    backgroundColor: "var(--color-accent)",
    color: "#ffffff",
    border: "none",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
  },
};

const sizeStyles: Record<ButtonSize, JSX.CSSProperties> = {
  sm: {
    padding: "8px 16px",
    fontSize: "14px",
    minHeight: "36px",
  },
  md: {
    padding: "12px 24px",
    fontSize: "16px",
    minHeight: "44px",
  },
  lg: {
    padding: "16px 32px",
    fontSize: "18px",
    minHeight: "52px",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = "button",
}: ButtonProps) {
  const baseStyle: JSX.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "var(--radius-button, 12px)",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontWeight: "600",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : loading ? 0.8 : 1,
    transition: "all 150ms ease-in-out",
    minWidth: "44px",
    lineHeight: "1.2",
    textDecoration: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <button
      type={type}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled || loading}
      class={className}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
    >
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "16px",
            height: "16px",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "mukoko-spin 600ms linear infinite",
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
