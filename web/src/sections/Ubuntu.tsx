import Link from "next/link";
import { WaitlistForm } from "../components/WaitlistForm";

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
    <section className="section" id="ubuntu">
      <div className="ubuntu text-center">
        <h2 className="ubuntu__headline">Munhu munhu muvanhu</h2>
        <p className="ubuntu__translation mt-1">A person is a person through other persons</p>
        <p className="mt-3">
          mukoko is built on Ubuntu — the understanding that we exist through our relationships with
          each other. Before every feature ships, it passes five questions we call the{" "}
          <strong>Ubuntu Test</strong>.
        </p>

        <div className="ubuntu-questions">
          {questions.map((item, i) => (
            <div className="ubuntu-question" key={i}>
              <span className="ubuntu-question__num">0{i + 1}</span>
              <div>
                <p className="ubuntu-question__text">{item.q}</p>
                <p className="ubuntu-question__sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/manifesto" className="ubuntu__manifesto-link">
          Read the full manifesto →
        </Link>

        <div className="mt-4">
          <h3 className="section__subtitle">Be part of the hive</h3>
          <div className="ubuntu__cta mt-2">
            <WaitlistForm variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
