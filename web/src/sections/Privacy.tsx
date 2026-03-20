export function Privacy() {
  return (
    <section className="section" id="privacy">
      <div className="privacy">
        <div className="privacy__content">
          <h2 className="section__title">Your data. Your identity. Your sovereignty.</h2>
          <p className="mt-2">
            At the heart of mukoko is your <strong>Memory File</strong> — a personal
            profile that shapes how every app works for you. It's built by two systems
            working together:
          </p>
          <div className="privacy__duo mt-3">
            <div className="privacy__card">
              <h3>Nyuchi Honey</h3>
              <p className="text-muted">
                On-device AI that learns your preferences privately.
                Your raw data never leaves your phone.
              </p>
            </div>
            <div className="privacy__card">
              <h3>Mukoko ID</h3>
              <p className="text-muted">
                Your cloud identity that stores your Memory File securely —
                synced summaries, never raw events.
              </p>
            </div>
          </div>
          <p className="mt-3">
            Your Memory File is <strong>fully editable</strong>. You can see exactly
            what it contains, change it, or delete it entirely. It's your data
            sovereignty — not a black box.
          </p>
          <p className="mt-2 text-muted">
            shamwari, our AI companion, reads your Memory File to give you
            personalized help across all six apps. But only with your permission,
            and only what you choose to share.
          </p>
        </div>
      </div>
    </section>
  );
}
