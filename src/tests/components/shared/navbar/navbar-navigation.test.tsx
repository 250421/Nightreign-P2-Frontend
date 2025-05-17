import { render, screen } from "@testing-library/react";
import { NavbarNavigation } from "@/components/shared/navbar/navbar-navigation";

jest.mock("@/components/ui/navigation-menu", () => ({
  NavigationMenu: ({ children }: any) => <nav data-testid="navigation-menu">{children}</nav>,
  NavigationMenuList: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  NavigationMenuItem: ({ children }: any) => <li>{children}</li>,
  NavigationMenuLink: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NavbarNavigation", () => {
  beforeEach(() => {
    render(<NavbarNavigation />);
  });

  it("renders the navigation menu", () => {
    expect(screen.getByTestId("navigation-menu")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Lobbies")).toBeInTheDocument();
    expect(screen.getByText("Rules")).toBeInTheDocument();
    expect(screen.getByText("Characters")).toBeInTheDocument();
  });

  it("links have correct hrefs", () => {
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Lobbies").closest("a")).toHaveAttribute("href", "/lobby");
    expect(screen.getByText("Rules").closest("a")).toHaveAttribute("href", "/rules");
    expect(screen.getByText("Characters").closest("a")).toHaveAttribute("href", "/character-page");
  });
});