import { render, screen } from "@testing-library/react";
import { RouteComponent } from "@/routes/(auth)/_auth.index";

// Mock Link to render a real anchor for testing
jest.mock("@tanstack/react-router", () => {
  const actual = jest.requireActual("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => (
      <a href={typeof to === "string" ? to : "/"} {...props}>
        {children}
      </a>
    ),
  };
});

describe("Auth Index Page", () => {
  beforeEach(() => {
    render(<RouteComponent />);
  });

  it("renders the rules card", () => {
    expect(
      screen.getByRole("heading", { name: /new to the game\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/check out the rules and how to play here/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /rules/i })).toHaveAttribute(
      "href",
      "/rules"
    );
  });

  it("renders the characters card", () => {
    expect(
      screen.getByRole("heading", { name: /build a team of three/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/choose from a wide variety of characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view characters/i })
    ).toHaveAttribute("href", "/character-page");
  });

  it("renders the battle card", () => {
    expect(
      screen.getByRole("heading", { name: /ready\? battle!/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/join or create a lobby and start battling/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /battle!/i })).toHaveAttribute(
      "href",
      "/lobby"
    );
  });
});