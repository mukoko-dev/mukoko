import type { CSSProperties, TargetedEvent, TargetedFocusEvent } from "preact";

/** The input types this single-line field renders; Preact 11 types `<input type>` per kind. */
export type TextInputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "tel"
  | "url"
  | "number";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: TargetedEvent<HTMLInputElement>) => void;
  type?: TextInputType;
  error?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

let inputIdCounter = 0;

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  disabled = false,
  id,
  name,
  className,
}: InputProps) {
  const inputId = id || `mukoko-input-${++inputIdCounter}`;
  const errorId = error ? `${inputId}-error` : undefined;

  const wrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
  };

  const labelStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--color-primary, #4B0082)",
  };

  const inputStyle: CSSProperties = {
    padding: "10px 14px",
    fontSize: "16px",
    fontFamily: "inherit",
    borderRadius: "var(--radius-button, 12px)",
    border: error
      ? "2px solid #DC2626"
      : "1px solid var(--card-border, rgba(0, 0, 0, 0.2))",
    backgroundColor: disabled ? "rgba(0, 0, 0, 0.04)" : "transparent",
    color: "inherit",
    outline: "none",
    transition: "border-color 150ms ease-in-out, box-shadow 150ms ease-in-out",
    minHeight: "var(--spacing-touch-target, 44px)",
    width: "100%",
    boxSizing: "border-box",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "text",
  };

  const errorStyle: CSSProperties = {
    fontSize: "13px",
    color: "#DC2626",
    marginTop: "2px",
  };

  return (
    <div style={wrapperStyle} class={className}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        // Every TextInputType shares the text input's attributes; Preact 11 only discriminates
        // `type` as a literal, so a union value is narrowed here.
        type={type as "text"}
        placeholder={placeholder}
        value={value}
        onInput={onChange}
        disabled={disabled}
        style={inputStyle}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        aria-disabled={disabled || undefined}
        onFocus={(e: TargetedFocusEvent<HTMLInputElement>) => {
          if (!error) {
            e.currentTarget.style.borderColor = "var(--color-primary, #4B0082)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(75, 0, 130, 0.15)";
          }
        }}
        onBlur={(e: TargetedFocusEvent<HTMLInputElement>) => {
          if (!error) {
            e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.2)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      />
      {error && (
        <span id={errorId} role="alert" style={errorStyle}>
          {error}
        </span>
      )}
    </div>
  );
}
