"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
      onClick={onToggle}
      className="text-muted-foreground hover:text-foreground"
      aria-pressed={show}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

export function usePasswordToggle() {
  const [show, setShow] = useState(false);
  return { show, toggle: () => setShow((s) => !s) };
}
