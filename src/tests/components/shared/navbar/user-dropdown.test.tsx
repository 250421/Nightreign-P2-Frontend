import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserDropdown } from "@/components/shared/navbar/user-dropdown";

// Mock lucide-react LogOut icon
jest.mock("lucide-react", () => ({
  LogOut: (props: any) => <svg data-testid="logout-icon" {...props} />,
}));

// Mock UserProfile component
jest.mock("@/components/shared/navbar/user-profile", () => ({
  UserProfile: () => <div data-testid="user-profile">UserProfile</div>,
}));

// Mock useConfirm hook
const mockLogOutConfirm = jest.fn();
const MockLogOutDialog = (props: any) => (
  <div data-testid="logout-dialog">{props.title}</div>
);
jest.mock("@/hooks/use-confirm", () => ({
  useConfirm: () => [mockLogOutConfirm, MockLogOutDialog],
}));

// Mock useSignOut hook
const mockSignOut = jest.fn();
jest.mock("@/hooks/use-sign-out", () => ({
  useSignOut: () => ({ mutate: mockSignOut }),
}));

// Mock DropdownMenu components
jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <button data-testid="dropdown-trigger">{children}</button>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" tabIndex={0} onClick={onClick}>
      {children}
    </div>
  ),
}));

describe("UserDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user profile and dropdown", () => {
    render(<UserDropdown />);
    expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("shows dropdown content when trigger is clicked", () => {
    render(<UserDropdown />);
    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-item")).toBeInTheDocument();
    expect(screen.getByTestId("logout-icon")).toBeInTheDocument();
  });

  it("calls logOutConfirm and signOut on logout", async () => {
    mockLogOutConfirm.mockResolvedValueOnce(true);
    render(<UserDropdown />);
    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.click(screen.getByTestId("dropdown-item"));
    await waitFor(() => {
      expect(mockLogOutConfirm).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it("does not call signOut if logOutConfirm is cancelled", async () => {
    mockLogOutConfirm.mockResolvedValueOnce(false);
    render(<UserDropdown />);
    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    fireEvent.click(screen.getByTestId("dropdown-item"));
    await waitFor(() => {
      expect(mockLogOutConfirm).toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
    });
  });

  it("renders the logout dialog", () => {
    render(<UserDropdown />);
    expect(screen.getByTestId("logout-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("logout-dialog")).toHaveTextContent("Log Out");
  });
});