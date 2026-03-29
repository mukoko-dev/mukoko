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
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders the copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(/Nyuchi Africa/)).toBeInTheDocument();
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
    expect(screen.getByText(/Your Honey\. Your Identity\. Your Sovereignty\./)).toBeInTheDocument();
  });

  it("renders new product names", () => {
    render(<Footer />);
    expect(screen.getByText("Campfire")).toBeInTheDocument();
    expect(screen.getByText("Circles")).toBeInTheDocument();
    expect(screen.getByText("Nhimbe")).toBeInTheDocument();
    expect(screen.getByText("Mukoko News")).toBeInTheDocument();
  });
});
