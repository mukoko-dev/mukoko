"use client";

import { useState } from "react";

const interests = [
  { icon: "\u{1F3B5}", label: "Music" },
  { icon: "\u{1F3D9}\uFE0F", label: "Harare" },
  { icon: "\u{1F4DA}", label: "Novels" },
  { icon: "\u26BD", label: "Football" },
  { icon: "\u{1F4BC}", label: "Business" },
  { icon: "\u{1F30D}", label: "Travel" },
  { icon: "\u{1F3AC}", label: "Film" },
  { icon: "\u{1F331}", label: "Nature" },
];

const defaultTags = ["Music", "Harare", "Football"];

export function TwinDemo() {
  const [active, setActive] = useState<string | null>(null);

  const visibleTags = active
    ? [...new Set([...defaultTags.slice(0, 2), active])]
    : defaultTags;

  return (
    <div className="twin-demo">
      {/* Interest selector */}
      <div>
        <p className="content-section__number" style={{ marginBottom: "1.25rem" }}>
          Your interests
        </p>
        <div className="twin-interests">
          {interests.map((i) => (
            <button
              key={i.label}
              onClick={() => setActive(active === i.label ? null : i.label)}
              className={`twin-interest-btn ${active === i.label ? "twin-interest-btn--active" : ""}`}
            >
              <span className="twin-interest-btn__icon">{i.icon}</span>
              {i.label}
              {active === i.label && <span className="twin-interest-btn__dot" />}
            </button>
          ))}
        </div>
      </div>

      {/* Twin card */}
      <div className={`twin-card ${active ? "twin-card--active" : ""}`}>
        <div className="twin-card__header">
          <div className="twin-card__avatar" aria-hidden="true">
            {"\u{1F9EC}"}
          </div>
          <div>
            <div className="twin-card__name">shamwari Twin</div>
            <div className="twin-card__version">Version 1 &middot; Active</div>
          </div>
          <div className="twin-card__status">
            <span className="twin-card__status-dot" />
            <span className="twin-card__status-label">On-chain</span>
          </div>
        </div>

        <div>
          <p className="twin-card__stat-label" style={{ marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Active interests
          </p>
          <div className="twin-card__tags">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className={`twin-card__tag ${tag === active ? "twin-card__tag--highlight" : ""}`}
              >
                {interests.find((i) => i.label === tag)?.icon} {tag}
              </span>
            ))}
            {active && !defaultTags.includes(active) && (
              <span className="twin-card__tag twin-card__tag--highlight">
                \u2726 {active}
              </span>
            )}
          </div>
        </div>

        <div className="twin-card__stats">
          {[
            { label: "\u{1F52D} Discovery Mode", value: "Balanced" },
            { label: "\u{1F512} Privacy", value: "On-device" },
            { label: "\u26A1 Ubuntu Score", value: "142" },
            { label: "\u{1FA99} Token Status", value: "Minted" },
          ].map((item) => (
            <div className="twin-card__stat" key={item.label}>
              <div className="twin-card__stat-label">{item.label}</div>
              <div className="twin-card__stat-value">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="twin-card__privacy">
          {"\u{1F6E1}\uFE0F"} Your twin is private by default. shamwari never sends
          your data to any server.
        </div>
      </div>
    </div>
  );
}
