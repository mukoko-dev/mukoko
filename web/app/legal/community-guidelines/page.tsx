import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Community Guidelines — mukoko",
  description:
    "Ubuntu-grounded standards for the mukoko ecosystem — how we build and protect our community.",
};

export default function CommunityGuidelinesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <article className="legal-page">
          <div className="legal-page__inner">
            <p className="legal-page__eyebrow">Legal</p>
            <h1 className="legal-page__title">Community Guidelines</h1>
            <p className="legal-page__updated">
              Ubuntu-grounded standards for the mukoko ecosystem
            </p>

            <section className="legal-section">
              <h2>The Ubuntu Standard</h2>
              <p>
                Every interaction on mukoko should strengthen community, respect human dignity,
                and serve the collective good. We hold ourselves to the principle of{" "}
                <em>&ldquo;Munhu munhu muvanhu&rdquo;</em> — a person is a person through other
                persons.
              </p>
              <p>
                Before posting, commenting, or interacting, ask yourself: Does this uplift the
                community? Would I say this in the presence of my elders? Does it align with
                &ldquo;I am because we are&rdquo;?
              </p>
            </section>

            <section className="legal-section">
              <h2>Content Standards</h2>
              <p>The following are not permitted anywhere in the mukoko ecosystem:</p>
              <ul>
                <li><strong>Hate speech</strong> — content that attacks or demeans any individual or group based on race, ethnicity, gender, religion, disability, or sexual orientation</li>
                <li><strong>Harassment</strong> — targeted abuse, threats, intimidation, doxxing, or persistent unwanted contact</li>
                <li><strong>Spam</strong> — unsolicited commercial content, bot-generated noise, or manipulative engagement tactics</li>
                <li><strong>Illegal content</strong> — material that violates applicable laws, including pirated intellectual property</li>
                <li><strong>Misinformation</strong> — deliberately false or misleading content designed to deceive or cause harm</li>
              </ul>
              <p>
                Content standards are applied contextually. Moderation in Circles (community
                discussions) differs from Novels (creative writing) and Mukoko News (journalism).
                Each app context has guidelines appropriate to its purpose.
              </p>
            </section>

            <section className="legal-section">
              <h2>Moderation Approach</h2>
              <p>
                mukoko follows a restorative justice model. Our goal is to educate and restore
                community trust, not to punish. The moderation ladder is:
              </p>
              <ul>
                <li><strong>Warning</strong> — a private notice explaining the violation and community standards</li>
                <li><strong>Education</strong> — resources and guidance to help the user understand the impact of their actions</li>
                <li><strong>Mediation</strong> — facilitated dialogue between parties in cases of interpersonal conflict</li>
                <li><strong>Temporary suspension</strong> — a cooling-off period for repeated or serious violations</li>
                <li><strong>Permanent ban</strong> — reserved for the most severe or unrepentant violations</li>
              </ul>
              <p>
                Community moderators are empowered members of the ecosystem, supported by AI
                detection tools. AI assists with flagging potential violations, but all
                consequential moderation decisions involve human judgment.
              </p>
            </section>

            <section className="legal-section">
              <h2>Appeals</h2>
              <p>
                Every moderation decision can be appealed. Appeals are reviewed by humans, not
                by AI alone. The appeals process is:
              </p>
              <ul>
                <li>Submit an appeal through the in-app moderation panel</li>
                <li>A different moderator (not the original decision-maker) reviews the case</li>
                <li>You will receive a written explanation of the outcome</li>
                <li>For permanent bans, a second-level review by the community trust team is available</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>Creator Responsibilities</h2>
              <p>Creators across the mukoko ecosystem are expected to:</p>
              <ul>
                <li><strong>Respect copyright</strong> — only publish content you own or have rights to distribute</li>
                <li><strong>Disclose AI-generated content</strong> — clearly label any content created with AI assistance</li>
                <li><strong>Maintain quality standards</strong> — contribute meaningfully to the ecosystem rather than flooding it with low-effort content</li>
                <li><strong>Engage honestly</strong> — do not manipulate engagement metrics, fake reviews, or misrepresent your identity</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>Reporting</h2>
              <p>
                If you encounter content or behaviour that violates these guidelines, you can
                report it through:
              </p>
              <ul>
                <li><strong>In-app reporting</strong> — tap the report button on any content, profile, or message</li>
                <li><strong>Email</strong> — contact <a href="mailto:security@nyuchi.com">security@nyuchi.com</a> for urgent safety concerns</li>
              </ul>
              <p>
                All reports are reviewed within 24 hours. You will not face retaliation for
                reporting in good faith.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
