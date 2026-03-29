import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "../Hero";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: Record<string, unknown>) => (
    <a {...props}>{children as React.ReactNode}</a>
  ),
}));

describe("Hero", () => {
  it("renders the heading", () => {
    render(<Hero />);
    expect(screen.getByText(/The Algorithm Works/)).toBeInTheDocument();
    expect(screen.getByText(/For You\./)).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Hero />);
    expect(screen.getByText(/15 mini-apps, one identity, built on community/)).toBeInTheDocument();
  });

  it("renders the waitlist form", () => {
    render(<Hero />);
    expect(screen.getByPlaceholderText("Your email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join the waitlist/ })).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    render(<Hero />);
    expect(screen.getByText("I am because we are")).toBeInTheDocument();
  });
});
