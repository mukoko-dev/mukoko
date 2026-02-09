import { WaitlistForm } from "../components/WaitlistForm";

export function Hero() {
  return (
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__wordmark">mukoko</h1>
        <p class="hero__tagline">Ndiri nekuti tiri</p>
        <p class="hero__tagline-en">I am because we are</p>
        <p class="hero__description">
          A digital twin social ecosystem for Africa — six apps, one identity,
          built on community.
        </p>
        <WaitlistForm />
        <p class="hero__note text-muted">
          Early access coming soon. Be the first to know.
        </p>
      </div>
    </section>
  );
}
