import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — mukoko",
  description: "Terms and conditions for using the mukoko ecosystem.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <article className="legal-page">
          <div className="legal-page__inner">
            <p className="legal-page__eyebrow">Legal</p>
            <h1 className="legal-page__title">Terms of Service</h1>
            <p className="legal-page__updated">Last updated: March 2026</p>

            <section className="legal-section">
              <h2>Agreement</h2>
              <p>
                By accessing or using mukoko, you agree to be bound by these Terms of Service.
                mukoko is a digital twin social ecosystem comprising 15 mini-apps, operated by
                Nyuchi Africa (Pvt) Ltd, a company registered in Zimbabwe, under licence from
                the Mukoko Foundation, a non-profit entity established in Mauritius under the
                Foundations Act 2012.
              </p>
            </section>

            <section className="legal-section">
              <h2>The Ubuntu Principle</h2>
              <p>
                All participants in the mukoko ecosystem agree to uphold the Ubuntu principle:
                &ldquo;I am because we are.&rdquo; This means treating fellow community members
                with dignity, respect, and care.
              </p>
            </section>

            <section className="legal-section">
              <h2>Your Account</h2>
              <p>
                Your mukoko ID is your unified identity across the ecosystem. You are responsible
                for maintaining the security of your account credentials and for all activity
                that occurs under your account.
              </p>
            </section>

            <section className="legal-section">
              <h2>Content &amp; Creator Rights</h2>
              <p>
                You retain ownership of all content you create on mukoko. By publishing content,
                you grant mukoko a non-exclusive licence to display and distribute it within the
                ecosystem. Creator revenue shares are:
              </p>
              <ul>
                <li>Novel authors — 85% of chapter revenue</li>
                <li>Pulse creators — 80% of tipping revenue</li>
                <li>Nhimbe event organisers — 90% of ticket revenue</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>Prohibited Conduct</h2>
              <p>You may not use mukoko to:</p>
              <ul>
                <li>Harass, abuse, or harm other users</li>
                <li>Spread misinformation or hate speech</li>
                <li>Attempt to access other users&apos; data without authorisation</li>
                <li>Use automated tools to scrape or extract data</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>MUKOKO Tokens</h2>
              <p>
                The mukoko ecosystem uses two tokens on Polygon PoS: the MUKOKO Identity Token
                (MIT), a soulbound non-transferable token anchored to your verified identity, and
                the MUKOKO Exchange Token (MXT), a transferable utility token for payments,
                tipping, and peer-to-peer transfers. Neither token represents any ownership
                interest or security in Nyuchi Africa, the Mukoko Foundation, or any affiliated
                entity.
              </p>
            </section>

            <section className="legal-section">
              <h2>Governing Entities</h2>
              <p>
                The Mukoko Foundation (Mauritius) serves as the non-profit custodian of the
                protocol, token economics, and Ubuntu charter. Nyuchi Africa (Pvt) Ltd (Zimbabwe)
                is the for-profit operating company that builds and operates the platform under
                a revocable service agreement with the Foundation.
              </p>
            </section>

            <section className="legal-section">
              <h2>Contact</h2>
              <p>
                For questions about these terms, contact us at{" "}
                <a href="mailto:legal@mukoko.com">legal@mukoko.com</a>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
