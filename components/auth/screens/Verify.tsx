"use client";

import { useRef, useState } from "react";
import { authApi, ApiError } from "@/lib/auth-api";
import { completeLogin } from "@/lib/session";
import type { GoFn, AuthContext } from "../types";

const LEN = 6;

export function Verify({ go, ctx }: { go: GoFn; ctx: AuthContext }) {
  const [code, setCode] = useState<string[]>(Array(LEN).fill(""));
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const full = code.every((c) => c !== "");
  const hint = ctx.hint ?? "···· ·· 0163";

  function set(i: number, v: string) {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, j) => (j === i ? digit : x)));
    if (digit && i < LEN - 1) refs.current[i + 1]?.focus();
  }

  function onKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!digits) return;
    e.preventDefault();
    const next = Array(LEN)
      .fill("")
      .map((_, i) => digits[i] ?? "");
    setCode(next);
    refs.current[Math.min(digits.length, LEN - 1)]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!full) return;
    setError(undefined);
    setBusy(true);
    try {
      if (ctx.challengeId) {
        const res = await authApi.verify({
          challengeId: ctx.challengeId,
          code: code.join(""),
        });
        completeLogin(res.user);
        return;
      }
      // Demo fallback (no live API) — nowhere to route yet.
      go("signin", {});
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "That code didn’t match. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel-inner" onSubmit={submit} noValidate>
      <button
        type="button"
        className="link"
        style={{ fontSize: 12.5, marginBottom: 20 }}
        onClick={() => go("signin")}
      >
        ← Back
      </button>
      <span className="eyebrow">
        <span className="tick" />
        Two-factor
      </span>
      <h2>Verify it&apos;s you</h2>
      <p className="sub" style={{ marginBottom: 26, lineHeight: 1.6 }}>
        Enter the 6-digit code we texted to{" "}
        <strong style={{ color: "var(--ink)" }}>{hint}</strong>.
      </p>

      <div className="code-grid" onPaste={onPaste}>
        {code.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={c}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className={"code-cell" + (c ? " filled" : "")}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
          />
        ))}
      </div>

      {error && (
        <p className="err" role="alert" style={{ marginTop: 14 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn"
        style={{ width: "100%", marginTop: 24, opacity: full ? 1 : 0.55 }}
        disabled={!full || busy}
      >
        {busy ? "Verifying…" : "Verify & continue"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          color: "var(--muted)",
          marginTop: 20,
        }}
      >
        No code?{" "}
        <button type="button" className="link" style={{ fontSize: 12.5, display: "inline-flex" }}>
          Resend
        </button>{" "}
        ·{" "}
        <button type="button" className="link" style={{ fontSize: 12.5, display: "inline-flex" }}>
          Use email instead
        </button>
      </p>
    </form>
  );
}
