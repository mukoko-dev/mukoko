import { WaitlistForm } from "../components/WaitlistForm";
import { navigate } from "../router";

const questions = [
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
];

export function Ubuntu() {
  return (
    <section class="section" id="ubuntu">
      <div class="ubuntu text-center">
        <h2 class="ubuntu__headline">Munhu munhu muvanhu</h2>
        <p class="ubuntu__translation mt-1">A person is a person through other persons</p>
        <p class="mt-3">
          mukoko is built on Ubuntu — the understanding that we exist through our
          relationships with each other. Before every feature ships, it passes
          five questions we call the <strong>Ubuntu Test</strong>.
        </p>

        <div class="ubuntu-questions">
          {questions.map((item, i) => (
            <div class="ubuntu-question" key={i}>
              <span class="ubuntu-question__num">0{i + 1}</span>
              <div>
                <p class="ubuntu-question__text">{item.q}</p>
                <p class="ubuntu-question__sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <button class="ubuntu__manifesto-link" onClick={() => navigate("/manifesto")}>
          Read the full manifesto →
        </button>

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
