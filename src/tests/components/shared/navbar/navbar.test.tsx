import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/shared/navbar/navbar";

// Mock NavbarNavigation and UserDropdown
jest.mock("@/components/shared/navbar/navbar-navigation", () => ({
  NavbarNavigation: () => <div data-testid="navbar-navigation">NavbarNavigation</div>,
}));
jest.mock("@/components/shared/navbar/user-dropdown", () => ({
  UserDropdown: () => <div data-testid="user-dropdown">UserDropdown</div>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it("renders the navbar container", () => {
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the title", () => {
    expect(screen.getByText("Battle Simulator")).toBeInTheDocument();
  });

  it("renders NavbarNavigation", () => {
    expect(screen.getByTestId("navbar-navigation")).toBeInTheDocument();
  });

  it("renders UserDropdown", () => {
    expect(screen.getByTestId("user-dropdown")).toBeInTheDocument();
  });
});