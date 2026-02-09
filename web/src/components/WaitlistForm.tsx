import { useState } from "preact/hooks";

const FORMSPREE_ID = "mwvnprag";

export function WaitlistForm({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: Event) => {
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
      <div class={`waitlist-success ${variant === "compact" ? "waitlist-success--compact" : ""}`}>
        <p>You're on the list. We'll be in touch.</p>
      </div>
    );
  }

  return (
    <form
      class={`waitlist-form ${variant === "compact" ? "waitlist-form--compact" : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        required
        class="waitlist-input"
        disabled={status === "submitting"}
      />
      <button type="submit" class="waitlist-button" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && <p class="waitlist-error">Something went wrong. Try again.</p>}
    </form>
  );
}
