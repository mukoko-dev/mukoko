import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: Record<string, unknown>) => (
    <a {...props}>{children as React.ReactNode}</a>
  ),
}));

describe("Footer", () => {
  it("renders all column headings", () => {
    render(<Footer />);
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Legal & Security")).toBeInTheDocument();
  });

  it("renders the copyright notice", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${year} Nyuchi Africa. All rights reserved.`)),
    ).toBeInTheDocument();
  });

  it("renders the manifesto link", () => {
    render(<Footer />);
    expect(screen.getByText("Manifesto")).toBeInTheDocument();
  });

  it("renders the mukoko wordmark", () => {
    render(<Footer />);
    expect(screen.getByText("mukoko")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/A Digital Twin Social Ecosystem for Africa/)).toBeInTheDocument();
  });
});
