"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home", internal: true },
  { href: "/manifesto", label: "Manifesto", internal: true },
  { href: "/help", label: "Help", internal: true },
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
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="header__inner">
        {/* Left: Logo */}
        <Link href="/" className="header__logo">
          <div className="header__icon">m</div>
          <span className={`header__wordmark ${isScrolled ? "header__wordmark--hidden" : ""}`}>
            mukoko
          </span>
        </Link>

        {/* Center: Nav links (hidden on mobile) */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="header__link header__link--btn">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Action pill */}
        <div className="header__actions">
          <a href="#waitlist" className="header__pill-btn">
            Join waitlist
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
