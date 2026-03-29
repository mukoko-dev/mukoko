import { WaitlistForm } from "../components/WaitlistForm";

export function Hero() {
  return (
    <section className="hero" id="waitlist">
      <div className="hero__content">
        <p className="hero__quote">&ldquo;Ndiri nekuti tiri&rdquo;</p>
        <h1 className="hero__heading">
          The Algorithm Works <span className="hero__accent">For You.</span>
        </h1>
        <p className="hero__subheading">I am because we are</p>
        <p className="hero__description">
          15 mini-apps, one identity, built on community. A digital twin social ecosystem for Africa
          — where your data stays yours, your identity is sovereign, and the algorithm works for
          you.
        </p>
        <WaitlistForm />
        <p className="hero__note text-muted">Early access coming soon.</p>
      </div>
    </section>
  );
}
