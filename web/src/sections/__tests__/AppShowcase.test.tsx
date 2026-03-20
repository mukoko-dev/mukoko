import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShowcase } from "../AppShowcase";

describe("AppShowcase", () => {
  it("renders the section title", () => {
    render(<AppShowcase />);
    expect(screen.getByText("Six apps. One ecosystem.")).toBeInTheDocument();
  });

  it("renders all 6 apps with correct names", () => {
    render(<AppShowcase />);
    const appNames = ["Clips", "Pulse", "Connect", "Novels", "Events", "Weather"];
    for (const name of appNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders descriptions for each app", () => {
    render(<AppShowcase />);
    expect(screen.getByText(/Context-rich news from trusted sources/)).toBeInTheDocument();
    expect(screen.getByText(/Your personalized feed/)).toBeInTheDocument();
    expect(screen.getByText(/Interest-based Circles/)).toBeInTheDocument();
    expect(screen.getByText(/platform for African authors/)).toBeInTheDocument();
    expect(screen.getByText(/Cultural gatherings, concerts/)).toBeInTheDocument();
    expect(screen.getByText(/Hyperlocal forecasts/)).toBeInTheDocument();
  });
});
