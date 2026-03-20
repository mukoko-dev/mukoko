import { useState, useEffect } from "preact/hooks";
import { navigate } from "../router";

const navLinks = [
  { href: "#apps", label: "Apps" },
  { href: "#privacy", label: "Privacy" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#ubuntu", label: "Ubuntu" },
  { href: "/manifesto", label: "Manifesto", internal: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header class={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div class="header__inner">
        {/* Left: Logo */}
        <a href="/" class="header__logo">
          <div class="header__icon">m</div>
          <span class={`header__wordmark ${isScrolled ? "header__wordmark--hidden" : ""}`}>
            mukoko
          </span>
        </a>

        {/* Center: Nav links (hidden on mobile) */}
        <nav class="header__nav">
          {navLinks.map((link) =>
            link.internal ? (
              <button
                key={link.href}
                class="header__link header__link--btn"
                onClick={() => navigate(link.href)}
              >
                {link.label}
              </button>
            ) : (
              <a key={link.href} href={link.href} class="header__link">
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Right: Action pill */}
        <div class="header__actions">
          <a href="#waitlist" class="header__pill-btn">
            Join waitlist
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
