import Link from "next/link";

const year = new Date().getFullYear();

const columns = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#ubuntu" },
      { label: "Manifesto", href: "/manifesto", internal: true },
      { label: "Careers", href: "mailto:careers@nyuchi.com" },
      { label: "Press", href: "mailto:press@nyuchi.com" },
      { label: "Contact", href: "mailto:hello@mukoko.com" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Clips", href: "https://clips.mukoko.com" },
      { label: "Pulse", href: "/#apps" },
      { label: "Connect", href: "https://connect.mukoko.com" },
      { label: "Novels", href: "https://novels.mukoko.com" },
      { label: "Events", href: "https://events.mukoko.com" },
      { label: "Weather", href: "https://weather.mukoko.com" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog", internal: true },
      { label: "Documentation", href: "/docs", internal: true },
      { label: "Brand Kit", href: "https://assets.nyuchi.com" },
      { label: "API Status", href: "https://status.mukoko.com" },
    ],
  },
  {
    heading: "Legal & Security",
    links: [
      { label: "Privacy Policy", href: "/privacy", internal: true },
      { label: "Terms of Service", href: "/terms", internal: true },
      { label: "Cookie Policy", href: "/cookies", internal: true },
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
            <Link
              href="/"
              className="footer__logo-btn"
            >
              <span className="footer__wordmark">mukoko</span>
            </Link>
            <p className="footer__tagline">
              A Digital Twin Social Ecosystem for Africa. Built by Nyuchi Africa.
            </p>
            <p className="footer__nyuchi text-muted">A Nyuchi Africa product</p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div className="footer__col" key={col.heading}>
              <p className="footer__col-heading">{col.heading}</p>
              <ul className="footer__col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link
                        href={link.href}
                        className="footer__col-link-btn"
                      >
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
          <p className="text-muted">
            &copy; {year} Nyuchi Africa. All rights reserved.
          </p>
          <p className="footer__motto text-muted">
            Ndiri nekuti tiri — I am because we are.
          </p>
        </div>
      </div>
    </footer>
  );
}
