import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WaitlistForm } from "../WaitlistForm";

describe("WaitlistForm", () => {
  it("renders the email input", () => {
    render(<WaitlistForm />);
    expect(
      screen.getByPlaceholderText("Your email address")
    ).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<WaitlistForm />);
    expect(
      screen.getByRole("button", { name: /Join the waitlist/ })
    ).toBeInTheDocument();
  });

  it("email input has required attribute", () => {
    render(<WaitlistForm />);
    const input = screen.getByPlaceholderText("Your email address");
    expect(input).toBeRequired();
  });

  it("email input has type email", () => {
    render(<WaitlistForm />);
    const input = screen.getByPlaceholderText("Your email address");
    expect(input).toHaveAttribute("type", "email");
  });
});
