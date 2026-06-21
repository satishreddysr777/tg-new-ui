"use client";

import { useId, useState } from "react";

export function Field({
  label,
  type = "text",
  value,
  onChange,
  right,
  mono,
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  right?: React.ReactNode;
  mono?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const id = useId();
  return (
    <div>
      <div className="between" style={{ marginBottom: 7 }}>
        <label className="field-label" htmlFor={id} style={{ marginBottom: 0 }}>
          {label}
        </label>
        {right}
      </div>
      <input
        id={id}
        className={"input" + (mono ? " mono" : "")}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id={`${id}-err`} className="err" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="link-muted"
      onClick={onToggle}
      aria-pressed={show}
    >
      {show ? "HIDE" : "SHOW"}
    </button>
  );
}

/** Shared local-state hook for a show/hide password input. */
export function usePasswordToggle() {
  const [show, setShow] = useState(false);
  return { show, toggle: () => setShow((s) => !s) };
}
