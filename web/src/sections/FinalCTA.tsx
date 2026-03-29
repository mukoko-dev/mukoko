import { WaitlistForm } from "../components/WaitlistForm";

export function FinalCTA() {
  return (
    <section className="section section--alt" id="join">
      <div className="section__inner text-center">
        <p className="final-cta__text">
          If Ubuntu resonates with you — if you believe technology should strengthen community, not
          extract from it — mukoko is being built for you.
        </p>
        <div className="final-cta__form mt-3">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
