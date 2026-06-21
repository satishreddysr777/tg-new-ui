"use client";

import { useRef, useState } from "react";
import { contactApi } from "@/lib/contact-api";

const intents = ["Hire talent", "Apply for a role", "Partner with us"];

export default function ContactForm() {
  const [intent, setIntent] = useState(intents[0]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = nameRef.current;
    const email = emailRef.current;
    if (!name?.value.trim() || !email?.value.trim()) {
      (!name?.value.trim() ? name : email)?.focus();
      return;
    }

    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      await contactApi.submit({
        intent,
        name: name.value.trim(),
        email: email.value.trim(),
        company: (data.get("company") as string)?.trim() || undefined,
        phone: (data.get("phone") as string)?.trim() || undefined,
        message: (data.get("message") as string)?.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="reveal">
      <span className="kicker">I want to…</span>
      <div className="intent" style={{ marginTop: "12px" }}>
        {intents.map((v) => (
          <button
            key={v}
            type="button"
            className={v === intent ? "active" : undefined}
            onClick={() => setIntent(v)}
          >
            {v}
          </button>
        ))}
      </div>

      {!submitted ? (
        <form className="form" onSubmit={onSubmit} noValidate>
          <input type="hidden" name="intent" value={intent} />
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              ref={nameRef}
            />
          </div>
          <div className="field">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              ref={emailRef}
            />
          </div>
          <div className="field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
            />
          </div>
          <div className="field">
            <label htmlFor="phone">
              Phone{" "}
              <span style={{ textTransform: "none", letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
            />
          </div>
          <div className="field full">
            <label htmlFor="message">How can we help?</label>
            <textarea
              id="message"
              name="message"
            />
          </div>
          {error && (
            <div className="field full">
              <p className="body" role="alert" style={{ color: "#b3261e" }}>
                {error}
              </p>
            </div>
          )}
          <div className="field full">
            <button
              type="submit"
              className="btn btn-dark"
              style={{ justifySelf: "start" }}
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send message →"}
            </button>
          </div>
        </form>
      ) : (
        <div className="form-success show">
          <div className="badge">
            <svg viewBox="0 0 22 22" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11.5l4.5 4.5L18 6" />
            </svg>
          </div>
          <h3>Thanks — message received.</h3>
          <p className="body" style={{ marginTop: "10px" }}>
            A talent acquisition manager will reach out to you.
          </p>
        </div>
      )}
    </div>
  );
}
