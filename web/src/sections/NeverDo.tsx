const commitments = [
  "We will never sell your data.",
  "We will never show you ads.",
  "We will never manipulate your feed.",
  "We will never lock you in.",
  "We will never let an investor override Ubuntu.",
  "We will never build something we'd be ashamed to explain to our elders.",
];

export function NeverDo() {
  return (
    <section className="section" id="never-do">
      <div className="section__inner text-center">
        <h2 className="section__title">What we will never do.</h2>

        <div className="ubuntu-questions" style={{ maxWidth: 640, marginInline: "auto" }}>
          {commitments.map((item, i) => (
            <div className="ubuntu-question" key={i}>
              <span className="ubuntu-question__num">0{i + 1}</span>
              <div>
                <p className="ubuntu-question__text">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
