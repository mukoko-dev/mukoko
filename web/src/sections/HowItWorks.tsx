const steps = [
  {
    number: "01",
    title: "Create your Mukoko ID",
    description: "One identity across the entire ecosystem. Sign up once, access everything.",
  },
  {
    number: "02",
    title: "Explore the apps",
    description: "News, community, novels, events — each app works standalone or together in the super app.",
  },
  {
    number: "03",
    title: "Your Memory File grows",
    description: "Nyuchi Honey learns on-device. Your preferences shape your experience — privately.",
  },
  {
    number: "04",
    title: "shamwari assists you",
    description: "Your AI companion summarizes, translates, and personalizes — powered by your Memory File.",
  },
];

export function HowItWorks() {
  return (
    <section className="section section--alt" id="how-it-works">
      <h2 className="section__title text-center">How it works</h2>
      <div className="steps mt-4">
        {steps.map((step) => (
          <div className="step" key={step.number}>
            <span className="step__number">{step.number}</span>
            <h3 className="step__title">{step.title}</h3>
            <p className="step__description text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
