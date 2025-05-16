import { render, screen } from "@testing-library/react";
import { UserProfile } from "@/components/shared/navbar/user-profile";
import "@testing-library/jest-dom";

// Create a mock function for useAuth
const mockUseAuth = jest.fn();

// Mock the useAuth hook to use the mock function
jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("UserProfile", () => {
  it("renders user initials from username", () => {
    mockUseAuth.mockReturnValue({ data: { username: "alice" } });
    render(<UserProfile />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("renders empty fallback if username is missing", () => {
    mockUseAuth.mockReturnValue({ data: { username: "??" } });
    render(<UserProfile />);
    expect(screen.getByText("??")).toBeInTheDocument();
  });

  it("renders fallback when user is null", () => {
    mockUseAuth.mockReturnValue({ data: null });
    render(<UserProfile />);
    expect(screen.getByText("??")).toBeInTheDocument();
  });

  it("renders fallback when user is undefined", () => {
    mockUseAuth.mockReturnValue({ data: undefined });
    render(<UserProfile />);
    expect(screen.getByText("??")).toBeInTheDocument();
  });

  it("renders fallback when username is undefined", () => {
    mockUseAuth.mockReturnValue({ data: { username: undefined } });
    render(<UserProfile />);
    expect(screen.getByText("??")).toBeInTheDocument();
  });

  it("renders fallback when username is null", () => {
    mockUseAuth.mockReturnValue({ data: { username: null } });
    render(<UserProfile />);
    expect(screen.getByText("??")).toBeInTheDocument();
  });
});