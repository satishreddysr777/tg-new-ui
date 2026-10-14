"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { contactApi } from "@/lib/contact-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const intents = ["Hire talent", "Apply for a role", "Partner with us"];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

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

  if (submitted) {
    return (
      <div className="py-16 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-5 text-2xl font-semibold text-navy">Thanks — message received.</h2>
        <p className="mt-2 text-muted-foreground">
          A talent acquisition manager will reach out to you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <p className="eyebrow">I want to…</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {intents.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIntent(i)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                intent === i
                  ? "border-navy bg-navy text-navy-foreground"
                  : "hover:bg-muted",
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input required ref={nameRef} name="name" />
        </Field>
        <Field label="Work email" required>
          <Input required type="email" ref={emailRef} name="email" />
        </Field>
        <Field label="Company">
          <Input name="company" />
        </Field>
        <Field label="Phone (optional)">
          <Input name="phone" type="tel" />
        </Field>
      </div>
      <Field label="How can we help?">
        <Textarea rows={5} name="message" />
      </Field>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" variant="navy" disabled={submitting}>
        {submitting ? "Sending…" : "Send message →"}
      </Button>
    </form>
  );
}
