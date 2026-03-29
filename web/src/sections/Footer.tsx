import Link from "next/link";

const columns = [
  {
    heading: "Products",
    links: [
      { label: "Campfire", href: "https://campfire.mukoko.com" },
      { label: "Pulse", href: "/#apps" },
      { label: "Bytes", href: "https://bytes.mukoko.com" },
      { label: "Circles", href: "https://circles.mukoko.com" },
      { label: "Nhimbe", href: "https://nhimbe.mukoko.com" },
      { label: "BushTrade", href: "https://trade.mukoko.com" },
      { label: "Mukoko Lingo", href: "https://lingo.mukoko.com" },
      { label: "Mukoko News", href: "https://news.mukoko.com" },
      { label: "Weather", href: "https://weather.mukoko.com" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Nyuchi", href: "https://nyuchi.com" },
      { label: "Manifesto", href: "/manifesto", internal: true },
      { label: "Help", href: "/help", internal: true },
      { label: "Blog", href: "/blog", internal: true },
      { label: "Contact", href: "mailto:hello@mukoko.com" },
      { label: "nyuchi.com", href: "https://nyuchi.com" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy", internal: true },
      { label: "Terms", href: "/legal/terms", internal: true },
      { label: "Cookie Policy", href: "/legal/cookies", internal: true },
      { label: "Community Guidelines", href: "/legal/community-guidelines", internal: true },
      { label: "Security", href: "mailto:security@nyuchi.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand column */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo-btn">
              <span className="footer__wordmark">mukoko</span>
            </Link>
            <p className="footer__tagline">Your Honey. Your Identity. Your Sovereignty.</p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div className="footer__col" key={col.heading}>
              <p className="footer__col-heading">{col.heading}</p>
              <ul className="footer__col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link href={link.href} className="footer__col-link-btn">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="text-muted">Built with Ubuntu &middot; Zimbabwe</p>
          <p className="text-muted">&copy; 2026 Nyuchi Africa. All rights reserved.</p>
          <p className="footer__motto text-muted">Ndiri nekuti tiri — I am because we are.</p>
        </div>
      </div>
    </footer>
  );
}
