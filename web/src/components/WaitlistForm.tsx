"use client";

import { useState } from "react";

const FORMSPREE_ID = "mwvnprag";

export function WaitlistForm({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("submission failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`waitlist-success ${variant === "compact" ? "waitlist-success--compact" : ""}`}
      >
        <p>You're on the list. We'll be in touch.</p>
      </div>
    );
  }

  return (
    <form
      className={`waitlist-form ${variant === "compact" ? "waitlist-form--compact" : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        required
        className="waitlist-input"
        disabled={status === "submitting"}
      />
      <button type="submit" className="waitlist-button" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && <p className="waitlist-error">Something went wrong. Try again.</p>}
    </form>
  );
}
