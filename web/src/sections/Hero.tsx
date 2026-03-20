import { WaitlistForm } from "../components/WaitlistForm";

export function Hero() {
  return (
    <section className="hero" id="waitlist">
      <div className="hero__content">
        <p className="hero__quote">&ldquo;Ndiri nekuti tiri&rdquo;</p>
        <h1 className="hero__heading">
          Your digital twin.{" "}
          <span className="hero__accent">Your sovereignty.</span>
        </h1>
        <p className="hero__subheading">I am because we are</p>
        <p className="hero__description">
          Six apps, one identity, built on community. A digital twin social
          ecosystem for Africa — where the algorithm works for you, not
          against you.
        </p>
        <WaitlistForm />
        <p className="hero__note text-muted">
          Early access coming soon. Be the first to know.
        </p>
      </div>
    </section>
  );
}
