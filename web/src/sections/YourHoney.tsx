const theyDo = [
  "Data harvested from every tap",
  "Sold to advertisers for profit",
  "Algorithm manipulates you to scroll more",
];

const weDo = [
  "Your Honey learns on-device only",
  "Raw data never leaves your phone",
  "Algorithm works FOR you, not against you",
];

export function YourHoney() {
  return (
    <section className="section" id="your-honey">
      <div className="section__inner">
        <h2 className="section__title text-center">Your data. Your algorithm. Your Honey.</h2>

        <div className="honey-comparison mt-4">
          <div className="honey-comparison__col honey-comparison__col--them">
            <h3 className="honey-comparison__heading">How they do it</h3>
            <ul className="honey-comparison__list">
              {theyDo.map((item) => (
                <li key={item} className="honey-comparison__item honey-comparison__item--them">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="honey-comparison__col honey-comparison__col--us">
            <h3 className="honey-comparison__heading">How we do it</h3>
            <ul className="honey-comparison__list">
              {weDo.map((item) => (
                <li key={item} className="honey-comparison__item honey-comparison__item--us">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <blockquote className="honey-quote mt-4">
          <p>
            Your Honey is a personal AI that runs on YOUR phone. It learns your preferences, curates
            your feed, and helps shamwari understand you. But it never sends your data to any
            server. Ever.
          </p>
        </blockquote>

        <p className="text-muted text-center mt-3">
          Your Honey profile is fully editable. You can see exactly what it contains, change it, or
          delete it entirely. It&rsquo;s your data sovereignty — not a black box.
        </p>
      </div>
    </section>
  );
}
