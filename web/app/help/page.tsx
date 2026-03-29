import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Help — mukoko",
  description:
    "Get help with mukoko — answers to common questions about your account, apps, tokens, privacy, and more.",
};

export default function HelpPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <article className="legal-page">
          <div className="legal-page__inner">
            <p className="legal-page__eyebrow">Support</p>
            <h1 className="legal-page__title">Help</h1>
            <p className="legal-page__updated">
              Frequently asked questions about the mukoko ecosystem
            </p>

            <section className="legal-section help-section">
              <h2>Getting Started</h2>
              <Accordion type="multiple" className="help-accordion">
                <AccordionItem value="what-is-mukoko">
                  <AccordionTrigger>What is mukoko?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      mukoko is a digital twin social ecosystem for Africa — 15
                      mini-apps sharing one identity, one AI companion, and one
                      token economy. Think of it as a WeChat-style super app
                      built on Ubuntu philosophy.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="create-account">
                  <AccordionTrigger>
                    How do I create an account?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Download mukoko and sign up with your email, phone number,
                      or social account. You&apos;ll create your mukoko ID — one
                      identity that works across all 15 apps.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="is-free">
                  <AccordionTrigger>Is mukoko free?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes. mukoko is free to use. Some features (novel chapters,
                      event tickets, premium content) may cost MUKOKO tokens
                      (MXT).
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="legal-section help-section">
              <h2>Your Honey &amp; Privacy</h2>
              <Accordion type="multiple" className="help-accordion">
                <AccordionItem value="what-is-honey">
                  <AccordionTrigger>What is Your Honey?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Your Honey is your personal AI that runs on your phone. It
                      learns your preferences to personalize your experience —
                      but your raw behavioral data never leaves your device.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="honey-data">
                  <AccordionTrigger>
                    Can I see what Your Honey knows about me?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes. You can view, edit, and delete your Your Honey
                      profile at any time. Full data sovereignty — no black boxes.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="data-selling">
                  <AccordionTrigger>
                    Does mukoko sell my data?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Never. Your Honey runs on-device. We do not sell, trade,
                      or monetize your personal data. This is a founding
                      principle, not a feature.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="legal-section help-section">
              <h2>Mini-Apps</h2>
              <Accordion type="multiple" className="help-accordion">
                <AccordionItem value="apps-included">
                  <AccordionTrigger>
                    What apps are included?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Campfire (messaging), Pulse (feed), Mukoko News, Bytes
                      (short video), Circles (communities), Nhimbe (events),
                      Novels, BushTrade (marketplace), Mukoko Lingo (language),
                      Weather, Transport, and more.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="standalone-apps">
                  <AccordionTrigger>
                    Can I use apps outside the super app?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes. Every app is also available as a standalone PWA at
                      *.mukoko.com.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="legal-section help-section">
              <h2>Account &amp; Identity</h2>
              <Accordion type="multiple" className="help-accordion">
                <AccordionItem value="digital-twin">
                  <AccordionTrigger>
                    What is a Digital Twin?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Your Digital Twin is a soulbound token (MIT) on Polygon —
                      non-transferable, anchored to your verified birth date.
                      It&apos;s your sovereign identity on the platform.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delete-account">
                  <AccordionTrigger>
                    Can I delete my account?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes. You can delete your account, your Your Honey
                      profile, and burn your Digital Twin at any time. Your data sovereignty
                      is absolute.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="legal-section help-section">
              <h2>MUKOKO Token</h2>
              <Accordion type="multiple" className="help-accordion">
                <AccordionItem value="what-is-mxt">
                  <AccordionTrigger>What is MXT?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      MXT (MUKOKO Exchange Token) is the platform currency —
                      used for payments, tipping creators, buying content, and
                      peer-to-peer transfers.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="earn-mxt">
                  <AccordionTrigger>How do I earn MXT?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Create content, moderate communities, organize events,
                      publish novels, contribute quality discussions. Creators
                      keep 80-90% of revenue.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="legal-section help-section">
              <h2>Community &amp; Safety</h2>
              <Accordion type="multiple" className="help-accordion">
                <AccordionItem value="moderation">
                  <AccordionTrigger>
                    How is content moderated?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Using Ubuntu principles — restorative justice before
                      punitive action. Community moderators are empowered, AI
                      assists with detection, and every moderation decision can
                      be appealed.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
