import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — mukoko",
  description:
    "How mukoko handles your data. Your privacy is a right, not a feature.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <article className="legal-page">
          <div className="legal-page__inner">
            <p className="legal-page__eyebrow">Legal</p>
            <h1 className="legal-page__title">Privacy Policy</h1>
            <p className="legal-page__updated">Last updated: March 2026</p>

            <section className="legal-section">
              <h2>Our Commitment</h2>
              <p>
                At mukoko, privacy is not a feature — it is a right. Built on the Ubuntu principle
                of <em>&ldquo;Munhu munhu muvanhu&rdquo;</em>, we believe your data belongs to you.
              </p>
              <p>
                Your digital twin is yours. Your Honey is yours. We do not sell, trade, or
                monetise your personal data. Ever.
              </p>
            </section>

            <section className="legal-section">
              <h2>What We Collect</h2>
              <p>We collect only what is necessary to provide our 15 mini-apps:</p>
              <ul>
                <li><strong>Account information</strong> — email, name, and authentication credentials via Stytch</li>
                <li><strong>Usage data</strong> — anonymised interaction patterns to improve our services</li>
                <li><strong>Content you create</strong> — posts, comments, and contributions within the ecosystem</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>On-Device Learning</h2>
              <p>
                Your Honey, our personalisation engine, learns <strong>on your device</strong>.
                Raw behavioural data never leaves your phone. Only a summarised profile syncs
                to your mukoko ID — and you can view, edit, or delete it at any time.
              </p>
            </section>

            <section className="legal-section">
              <h2>Data Storage</h2>
              <p>
                Your data is stored securely on MongoDB Atlas with encryption at rest and in transit.
                Authentication tokens are kept in platform-secure storage (Keychain on iOS,
                Keystore on Android) — never in browser localStorage.
              </p>
            </section>

            <section className="legal-section">
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access all data we hold about you</li>
                <li>Edit or delete Your Honey profile at any time</li>
                <li>Export your data in a portable format</li>
                <li>Delete your account and all associated data</li>
                <li>Opt out of any data collection beyond what is required for core functionality</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>Contact</h2>
              <p>
                For privacy inquiries, contact us at{" "}
                <a href="mailto:privacy@mukoko.com">privacy@mukoko.com</a>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
