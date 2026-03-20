import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Hive Manifesto — mukoko",
  description:
    "On building digital infrastructure for African community life.",
};

export default function ManifestoPage() {
  return (
    <div className="manifesto-page">
      {/* Sticky header */}
      <div className="manifesto-header">
        <Link className="manifesto-back" href="/">
          ← mukoko
        </Link>
        <span className="manifesto-header-meta">Manifesto · v1.0 · 2025</span>
      </div>

      {/* Cover */}
      <div className="manifesto-cover">
        <div className="manifesto-cover__inner">
          <p className="manifesto-cover__eyebrow">Nyuchi Africa · mukoko</p>
          <p className="manifesto-cover__wordmark">mukoko</p>
          <h1 className="manifesto-cover__title">
            The Hive<br />
            <em className="manifesto-cover__title-em">Manifesto</em>
          </h1>
          <p className="manifesto-cover__tagline">
            On building digital infrastructure for African community life.
          </p>
          <p className="manifesto-cover__statement">
            This is why we build. Who we build for. What we will never do.
            And the Ubuntu principle that governs every line of code we write.
          </p>
          <div className="manifesto-cover__meta">
            <div className="manifesto-cover__meta-item">
              <strong>Founded</strong>
              Nyuchi Africa
            </div>
            <div className="manifesto-cover__meta-item">
              <strong>Published</strong>
              2025
            </div>
            <div className="manifesto-cover__meta-item">
              <strong>Principle</strong>
              Ubuntu
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="manifesto-content">

        {/* Opening */}
        <div className="manifesto-opening">
          <p className="manifesto-opening__ubuntu">Munhu munhu muvanhu.</p>
          <p className="manifesto-opening__translation">A person is a person through other persons.</p>
          <p className="manifesto-opening__declaration">
            This is not a tagline. Not a brand value extracted from a workshop.
            It is the <strong>operating system</strong> beneath everything we build.
          </p>
          <p className="manifesto-opening__declaration">
            <span className="manifesto-shona">Mukoko</span> means <em>beehive</em> in Shona.
            A hive is not built by one bee. It is built by many — each contributing
            their small piece, trusting that the whole will be greater.{" "}
            <strong>That is what we are making.</strong>
          </p>
          <p className="manifesto-opening__declaration">
            Africa has 1.4 billion people. We are the fastest-growing continent,
            the youngest population on earth, the most linguistically rich, the most
            culturally diverse. And yet the digital tools we use were built for
            someone else — by someone else — optimising for someone else's context.
          </p>
          <p className="manifesto-opening__declaration">
            <strong>We are changing that.</strong>
          </p>
        </div>

        {/* 01 — The Problem */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">01 — The Problem</p>
          <h2 className="manifesto-section__title">
            The internet arrived.<br />
            It didn't come <em>for us</em>.
          </h2>

          <p className="manifesto-body-large">
            The platforms we use were designed for contexts with abundant bandwidth,
            cheap data, cold winters, and cultures that prioritise the individual
            over the community. None of that describes most of Africa.
          </p>

          <p className="manifesto-body">
            Data is expensive. Connections are intermittent. Cities are dense but
            infrastructure is sparse. Communities are strong, but the apps we use
            tear them apart into isolated feeds, optimised for outrage and scrolling
            rather than genuine relationship.
          </p>

          <div className="manifesto-pull-quote">
            <p>
              "We didn't build mukoko because Africa has no apps.
              We built it because Africa has no apps built <em>for</em> Africa."
            </p>
            <cite>Bryan · Founder, Nyuchi Africa</cite>
          </div>

          <p className="manifesto-body">
            The existing super apps — WeChat, Grab, Gojek — solved this in Asia.
            They understood that the phone is not a screen for consuming content.
            It is a <strong>life infrastructure tool</strong>. For paying,
            communicating, navigating, learning, connecting.
          </p>

          <p className="manifesto-body">
            Africa deserves the same. Not a copy.{" "}
            <strong>Something indigenous.</strong>
          </p>
        </div>

        {/* 02 — The Ecosystem */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">02 — The Ecosystem</p>
          <h2 className="manifesto-section__title">
            Six apps.<br />
            One <em>hive</em>.
          </h2>

          <p className="manifesto-body-large">
            mukoko is not one app. It is six interconnected apps sharing one
            identity, one AI engine, one reputation system, and one token economy.
          </p>

          <div className="manifesto-app-map">
            <span className="am-anchor">mukoko ID — Identity Layer</span>
            <span>├─ <span className="am-name">Clips</span> — context-rich news from Africa and the world</span>
            <span>├─ <span className="am-name">Pulse</span> — your personalised super app feed</span>
            <span>├─ <span className="am-name">Connect</span> — interest-based Circles (communities)</span>
            <span>├─ <span className="am-name">Novels</span> — African author platform, web fiction</span>
            <span>├─ <span className="am-name">Events</span> — cultural gatherings, ticketing</span>
            <span>└─ <span className="am-name">Weather</span> — hyperlocal forecasts for African life</span>
            <span>&nbsp;</span>
            <span className="am-infra">Shared infrastructure beneath all six:</span>
            <span>{"  "}shamwari AI · Memory File · MUKOKO tokens · MukokoBridge</span>
          </div>

          <p className="manifesto-body">
            Every app is <strong>standalone</strong>. You can use Clips to read
            news without ever touching Novels. But when you use them together,
            something emerges that none of them could be alone.
          </p>

          <p className="manifesto-body">
            Your interests in Clips inform your Pulse feed. Your Pulse feed
            surfaces Events near you. Your Events attendance builds your reputation
            in Connect. Your reputation earns MUKOKO tokens. This is{" "}
            <strong>compound community value</strong>.
          </p>
        </div>

        {/* 03 — Memory File */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">03 — Personalisation Without Surveillance</p>
          <h2 className="manifesto-section__title">
            Your Memory File.<br />
            Never a <em>product</em>.
          </h2>

          <p className="manifesto-body-large">
            At the centre of mukoko is your <strong>Memory File</strong> — a
            structured profile that shapes how every app works for you. It knows
            what you like to read, how long you spend on articles, which communities
            you engage with, and which topics you return to.
          </p>

          <p className="manifesto-body">
            But here is what makes it different:{" "}
            <strong>it is entirely yours.</strong>
          </p>

          <div className="manifesto-pillar-grid">
            <div className="manifesto-pillar-card manifesto-pillar-card--cobalt">
              <span className="manifesto-pillar-card__icon">🐝</span>
              <p className="manifesto-pillar-card__title">Nyuchi Honey</p>
              <p className="manifesto-pillar-card__body">
                On-device AI that observes your behaviour and learns your
                preferences. Raw data never leaves your phone. Ever.
              </p>
            </div>
            <div className="manifesto-pillar-card manifesto-pillar-card--tanzanite">
              <span className="manifesto-pillar-card__icon">🪪</span>
              <p className="manifesto-pillar-card__title">Mukoko ID</p>
              <p className="manifesto-pillar-card__body">
                Your cloud identity. Stores only summarised Memory File data —
                never raw events. You can read, edit, or delete it at any time.
              </p>
            </div>
            <div className="manifesto-pillar-card manifesto-pillar-card--malachite">
              <span className="manifesto-pillar-card__icon">🤖</span>
              <p className="manifesto-pillar-card__title">shamwari AI</p>
              <p className="manifesto-pillar-card__body">
                Reads your Memory File to give context-aware assistance across
                all six apps. Only what you choose to share.
              </p>
            </div>
            <div className="manifesto-pillar-card manifesto-pillar-card--terracotta">
              <span className="manifesto-pillar-card__icon">🔐</span>
              <p className="manifesto-pillar-card__title">Data Sovereignty</p>
              <p className="manifesto-pillar-card__body">
                Full transparency. Full editability. Full deletability. Your
                Memory File is not a black box — it is your possession.
              </p>
            </div>
          </div>

          <p className="manifesto-body">
            The major platforms have built empires on surveillance. They monetise
            your attention by selling your behaviour to advertisers. Your data is
            their product. Your outrage is their revenue model.
          </p>

          <p className="manifesto-body">
            <strong>We refuse this.</strong> mukoko's business model does not
            depend on selling your attention. Personalisation exists to serve{" "}
            <em>you</em>, not to extract from you.
          </p>
        </div>

        {/* 04 — Architecture as Values */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">04 — Architecture as Values</p>
          <h2 className="manifesto-section__title">
            Built for the<br />
            African <em>context</em>.
          </h2>

          <p className="manifesto-body-large">
            The engineering decisions we made are not arbitrary. They are values
            made concrete in code.
          </p>

          <div className="manifesto-vision-blocks">
            <div className="manifesto-vision-block">
              <p className="manifesto-vision-block__label">Lightweight by design</p>
              <p className="manifesto-vision-block__text">
                Mini-apps under <strong>150KB gzipped</strong>. News feed
                refreshes under <strong>50KB</strong>. We build as if data costs
                money — because in Zimbabwe, it does. This is not a performance
                optimisation. It is a dignity decision.
              </p>
            </div>
            <div className="manifesto-vision-block">
              <p className="manifesto-vision-block__label">Offline-first architecture</p>
              <p className="manifesto-vision-block__text">
                Every feature must <strong>degrade gracefully</strong> when the
                network disappears. We don't build for the ideal case. We build
                for the reality of intermittent connectivity. Your app works in a
                taxi, on a farm, in a city basement.
              </p>
            </div>
            <div className="manifesto-vision-block">
              <p className="manifesto-vision-block__label">Huawei and HMS — first class</p>
              <p className="manifesto-vision-block__text">
                Huawei phones are ubiquitous across Africa. We do not treat Huawei
                users as second-class.{" "}
                <strong>HarmonyOS and HMS are first-class platforms</strong> for
                mukoko. We ship on Huawei AppGallery on day one.
              </p>
            </div>
            <div className="manifesto-vision-block">
              <p className="manifesto-vision-block__label">Local payments first</p>
              <p className="manifesto-vision-block__text">
                EcoCash is the dominant payment rail in Zimbabwe. We build for{" "}
                <strong>EcoCash first</strong>, then InnBucks, then MUKOKO tokens,
                then bank transfer. Not Stripe first with Africa as an afterthought.
              </p>
            </div>
          </div>
        </div>

        {/* 05 — The Ubuntu Test */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">05 — The Ubuntu Test</p>
          <h2 className="manifesto-section__title">
            Five questions.<br />
            Every feature. <em>Every time.</em>
          </h2>

          <p className="manifesto-body-large">
            Before any feature ships, every member of our team asks these five
            questions. This is not a checklist. It is a{" "}
            <strong>cultural operating system</strong>.
          </p>

          <div className="manifesto-ubuntu-list">
            {(
              [
                {
                  q: "Does this strengthen community?",
                  sub: "Not just individual engagement — collective flourishing.",
                },
                {
                  q: "Does this respect human dignity?",
                  sub: "Every person using mukoko deserves to feel respected, not manipulated.",
                },
                {
                  q: "Does this serve the collective good?",
                  sub: "Beyond the individual benefit — what does this do for the hive?",
                },
                {
                  q: "Would we explain this proudly to our elders?",
                  sub: "If we'd be ashamed to describe it, we don't ship it.",
                },
                {
                  q: 'Does this align with "I am because we are"?',
                  sub: "Does it reinforce that our existence is relational — not isolated?",
                },
              ] as Array<{ q: string; sub: string }>
            ).map((item, i) => (
              <div className="manifesto-ubuntu-q" key={i}>
                <span className="manifesto-ubuntu-q__num">0{i + 1}</span>
                <div>
                  <p className="manifesto-ubuntu-q__text">
                    <strong>{item.q}</strong>
                  </p>
                  <p className="manifesto-ubuntu-q__sub">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="manifesto-body">
            Features that fail the Ubuntu Test are not delayed. They are removed.
            This has already happened. It will happen again. We are comfortable
            with that.
          </p>
        </div>

        {/* 06 — Creator Economics */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">06 — Creator Economics</p>
          <h2 className="manifesto-section__title">
            African creators<br />
            deserve <em>fair returns</em>.
          </h2>

          <p className="manifesto-body-large">
            The platforms extracting African content have made creators the product
            while paying them almost nothing. We designed mukoko's economics around
            a different premise: <strong>creators are partners.</strong>
          </p>

          <div className="manifesto-stack">
            <p className="manifesto-stack-line">Novel authors keep <strong>85%</strong> of chapter revenue</p>
            <p className="manifesto-stack-line">Pulse creators keep <strong>80%</strong> of tipping revenue</p>
            <p className="manifesto-stack-line">Event organisers keep <strong>90%</strong> of ticket revenue</p>
            <p className="manifesto-stack-line manifesto-stack-line--strong">
              We take the minimum needed to sustain the hive.
            </p>
          </div>

          <p className="manifesto-body">
            This is not charity. This is the only model that makes sense if you
            believe the hive is worth more than any individual node in it. Creators
            who thrive bring more creators. More creators bring more community.{" "}
            <strong>The hive grows stronger.</strong>
          </p>
        </div>

        <div className="manifesto-divider">What we will always do</div>

        {/* 07 — Pledges */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">07 — Our Pledges</p>
          <h2 className="manifesto-section__title">
            What we will<br />
            <em>always</em> do.
          </h2>

          <ul className="manifesto-pledge-list">
            {(
              [
                {
                  pledge: "Keep raw behavioural data on-device.",
                  detail:
                    "Honey learns on your phone. Summaries sync to the cloud. Never the raw events.",
                },
                {
                  pledge: "Let you see, edit, and delete your Memory File.",
                  detail:
                    "No hidden profiles. Full transparency. Full control.",
                },
                {
                  pledge: "Build for the data reality of our users.",
                  detail:
                    "150KB mini-apps. 50KB feed refreshes. Offline-capable. Always.",
                },
                {
                  pledge: "Support Huawei as a first-class platform.",
                  detail:
                    "HarmonyOS and HMS on day one, every release.",
                },
                {
                  pledge: "Pay creators fairly.",
                  detail:
                    "85% on novels. 80% on Pulse. 90% on events. No renegotiation.",
                },
                {
                  pledge: "Apply the Ubuntu Test before every feature ships.",
                  detail:
                    "Community, dignity, collective good, elder test, I am because we are.",
                },
                {
                  pledge: "Keep the hive open.",
                  detail:
                    "Standalone PWAs for all six apps. You can access mukoko without the super app.",
                },
              ] as Array<{ pledge: string; detail: string }>
            ).map((item, i) => (
              <li key={i}>
                <span className="manifesto-pledge-num">0{i + 1}</span>
                <span className="manifesto-pledge-text">
                  <strong>{item.pledge}</strong> {item.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 08 — Never */}
        <div className="manifesto-section">
          <p className="manifesto-section__number">08 — What We Will Never Do</p>
          <h2 className="manifesto-section__title">
            Some lines we<br />
            will not <em>cross</em>.
          </h2>

          <p className="manifesto-body-large">
            Manifestos are easier to write than to keep. We are writing these not
            as aspirations but as{" "}
            <strong>enforceable constraints</strong> — decisions we have already
            locked into architecture.
          </p>

          <div className="manifesto-never-list">
            {[
              "Sell user behavioural data to advertisers",
              "Use dark patterns to extend engagement at the cost of wellbeing",
              "Build recommendation algorithms optimised for outrage",
              "Treat Huawei users as second-class platform citizens",
              "Ship features that fail the Ubuntu Test because they drive metrics",
              "Store session tokens in WebView localStorage — always platform secure storage",
              "Hardcode secrets in source code",
              "Prioritise growth over dignity",
              "Build for Western data abundance and ignore African data reality",
              "Capitalise our brand wordmarks — always lowercase: mukoko, nyuchi, shamwari",
            ].map((item, i) => (
              <div className="manifesto-never-item" key={i}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="manifesto-closing">
          <div className="manifesto-honeycomb">
            <svg viewBox="0 0 100 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points="50,2 98,27 98,60 50,85 2,60 2,27"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <polygon
                points="50,18 78,34 78,52 50,68 22,52 22,34"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <p className="manifesto-closing__ubuntu">Ndiri nekuti tiri.</p>
          <p className="manifesto-closing__sub">Shona — "I am because we are."</p>
          <p className="manifesto-closing__tagline">This is the hive. You are the bee.</p>
          <p className="manifesto-closing__byline">
            Nyuchi Africa · mukoko · 2025<br />
            Bryan · Founder<br />
            Built from Zimbabwe, for Africa and the world.
          </p>
          <Link
            className="manifesto-back"
            style={{ marginTop: "2.5rem" }}
            href="/"
          >
            ← Back to mukoko
          </Link>
        </div>
      </div>
    </div>
  );
}
