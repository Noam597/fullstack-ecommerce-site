import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";


describe("Footer Component", () => {
  it("renders the current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders the GitHub link with correct href", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/Noam597");
  });

  it("renders the GitHub icon", () => {
    render(<Footer />);
    const icon = screen.getByTestId("github-icon");
    expect(icon).toBeInTheDocument();
  });
});
