import { WaitlistForm } from "../components/WaitlistForm";

export function Hero() {
  return (
    <section class="hero" id="waitlist">
      <div class="hero__content">
        <p class="hero__quote">&ldquo;Ndiri nekuti tiri&rdquo;</p>
        <h1 class="hero__heading">
          Your digital twin.{" "}
          <span class="hero__accent">Your sovereignty.</span>
        </h1>
        <p class="hero__subheading">I am because we are</p>
        <p class="hero__description">
          Six apps, one identity, built on community. A digital twin social
          ecosystem for Africa — where the algorithm works for you, not
          against you.
        </p>
        <WaitlistForm />
        <p class="hero__note text-muted">
          Early access coming soon. Be the first to know.
        </p>
      </div>
    </section>
  );
}
