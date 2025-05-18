import { render, screen } from "@testing-library/react";
import { AuthPage, Route } from "@/routes/(auth)/_auth";


// Mocks
jest.mock("@/components/shared/navbar/navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));
jest.mock("@tanstack/react-router", () => ({
  ...jest.requireActual("@tanstack/react-router"),
  Navigate: ({ to }: any) => <div data-testid="navigate">Navigate to {to}</div>,
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));
jest.mock("lucide-react", () => ({
  Loader2: (props: any) => <svg data-testid="loader" {...props} />,
}));

let mockUser: any = {};
let mockIsLoading = false;
jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({ data: mockUser, isLoading: mockIsLoading }),
}));

describe("Auth Route Page", () => {
  beforeEach(() => {
    mockUser = {};
    mockIsLoading = false;
  });

  it("renders loader when loading", () => {
    mockIsLoading = true;
    render(<AuthPage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("navigates to /login if user is not present", () => {
    mockUser = null;
    render(<AuthPage />);
    expect(screen.getByTestId("navigate")).toHaveTextContent("Navigate to /login");
  });

  it("renders navbar and outlet when user is present", () => {
    mockUser = { id: 1, username: "testuser" };
    render(<AuthPage />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });
});