import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ecosystem } from "../Ecosystem";

describe("Ecosystem", () => {
  it("renders the section title", () => {
    render(<Ecosystem />);
    expect(screen.getByText(/15 mini-apps\. One ecosystem\./)).toBeInTheDocument();
  });

  it("renders key apps with new names", () => {
    render(<Ecosystem />);
    expect(screen.getByText("Campfire")).toBeInTheDocument();
    expect(screen.getByText("Mukoko News")).toBeInTheDocument();
    expect(screen.getByText("Circles")).toBeInTheDocument();
    expect(screen.getByText("Nhimbe")).toBeInTheDocument();
    expect(screen.getByText("BushTrade")).toBeInTheDocument();
  });

  it("renders descriptions", () => {
    render(<Ecosystem />);
    expect(screen.getByText(/personalized feed/i)).toBeInTheDocument();
    expect(screen.getByText(/messaging/i)).toBeInTheDocument();
  });
});
