import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy — mukoko",
  description: "How mukoko uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <article className="legal-page">
          <div className="legal-page__inner">
            <p className="legal-page__eyebrow">Legal</p>
            <h1 className="legal-page__title">Cookie Policy</h1>
            <p className="legal-page__updated">Last updated: March 2026</p>

            <section className="legal-section">
              <h2>What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you visit a website.
                They help us provide a better experience and understand how our site is used.
              </p>
            </section>

            <section className="legal-section">
              <h2>Cookies We Use</h2>

              <h3>Essential Cookies</h3>
              <p>
                Required for the site to function. These include authentication session
                cookies managed by Stytch. You cannot opt out of essential cookies.
              </p>

              <h3>Analytics Cookies</h3>
              <p>
                Help us understand how visitors interact with our site. We use Cloudflare
                Analytics Engine, which is privacy-focused and does not track users across sites.
              </p>
            </section>

            <section className="legal-section">
              <h2>What We Do Not Use</h2>
              <ul>
                <li>No third-party advertising cookies</li>
                <li>No cross-site tracking</li>
                <li>No fingerprinting or supercookies</li>
                <li>No selling of cookie data to third parties</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>Managing Cookies</h2>
              <p>
                You can manage cookie preferences through your browser settings. Note that
                disabling essential cookies may affect site functionality.
              </p>
            </section>

            <section className="legal-section">
              <h2>Contact</h2>
              <p>
                For questions about our cookie practices, contact us at{" "}
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
