import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ubuntu } from "../Ubuntu";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: Record<string, unknown>) => (
    <a {...props}>{children as React.ReactNode}</a>
  ),
}));

describe("Ubuntu", () => {
  it("renders all 5 Ubuntu Test questions", () => {
    render(<Ubuntu />);
    expect(
      screen.getByText("Does this strengthen community?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Does this respect human dignity?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Does this serve the collective good?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Would we explain this proudly to our elders?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Does this align with.*I am because we are/)
    ).toBeInTheDocument();
  });

  it("renders the manifesto link", () => {
    render(<Ubuntu />);
    expect(
      screen.getByText(/Read the full manifesto/)
    ).toBeInTheDocument();
  });

  it("renders the Ubuntu headline", () => {
    render(<Ubuntu />);
    expect(
      screen.getByText("Munhu munhu muvanhu")
    ).toBeInTheDocument();
  });

  it("renders the translation", () => {
    render(<Ubuntu />);
    expect(
      screen.getByText("A person is a person through other persons")
    ).toBeInTheDocument();
  });
});
