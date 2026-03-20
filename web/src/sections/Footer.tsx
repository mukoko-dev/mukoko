import { navigate } from "../router";

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
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__grid">
          {/* Brand column */}
          <div class="footer__brand">
            <button
              class="footer__logo-btn"
              onClick={() => navigate("/")}
            >
              <span class="footer__wordmark">mukoko</span>
            </button>
            <p class="footer__tagline">
              A Digital Twin Social Ecosystem for Africa. Built by Nyuchi Africa.
            </p>
            <p class="footer__nyuchi text-muted">A Nyuchi Africa product</p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div class="footer__col" key={col.heading}>
              <p class="footer__col-heading">{col.heading}</p>
              <ul class="footer__col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <button
                        class="footer__col-link-btn"
                        onClick={() => navigate(link.href)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div class="footer__bottom">
          <p class="text-muted">
            &copy; {year} Nyuchi Africa. All rights reserved.
          </p>
          <p class="footer__motto text-muted">
            Ndiri nekuti tiri — I am because we are.
          </p>
        </div>
      </div>
    </footer>
  );
}
