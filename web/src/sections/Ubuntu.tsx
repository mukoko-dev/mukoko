import { WaitlistForm } from "../components/WaitlistForm";

export function Ubuntu() {
  return (
    <section class="section" id="ubuntu">
      <div class="ubuntu text-center">
        <h2 class="ubuntu__headline">Munhu munhu muvanhu</h2>
        <p class="ubuntu__translation mt-1">A person is a person through other persons</p>
        <p class="mt-3">
          mukoko is built on Ubuntu — the understanding that we exist through our
          relationships with each other. Every feature we build must strengthen
          community, respect dignity, and serve the collective good.
        </p>
        <p class="mt-2 text-muted">
          This isn't just a philosophy. It's our engineering principle. Before every
          feature ships, it passes the Ubuntu Test: Does this make us more connected?
          Would we explain this proudly to our elders?
        </p>
        <div class="mt-4">
          <h3 class="section__subtitle">Be part of the hive</h3>
          <div class="ubuntu__cta mt-2">
            <WaitlistForm variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
