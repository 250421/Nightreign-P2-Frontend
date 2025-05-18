import { render, screen } from "@testing-library/react";
import * as useAuthModule from "@/features/auth/hooks/use-auth";
import { Route } from "@/routes/(public)/_public";

// filepath: d:\Program Files\Revature\Nightreign-P2-Frontend\src\tests\routes\(public)\_public.test.tsx

// Mock dependencies
jest.mock("@/features/auth/hooks/use-auth");
jest.mock("@tanstack/react-router", () => ({
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
    Outlet: () => <div>Outlet rendered</div>,
    createFileRoute: () => (config: any) => config,
}));
jest.mock("lucide-react", () => ({
    Loader2: (props: any) => <div data-testid="loader" {...props} />,
}));

// Import after mocks

function renderComponent() {
    // Route.component is the PublicLayout function
    const Component = (Route as any).component;
    return render(<Component />);
}

describe("PublicLayout", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders loader when isLoading is true", () => {
        (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isLoading: true, data: null });
        renderComponent();
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("navigates to / when user is present", () => {
        (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isLoading: false, data: { id: 1, name: "Test" } });
        renderComponent();
        expect(screen.getByText("Navigate to /")).toBeInTheDocument();
    });

    it("renders Outlet when not loading and no user", () => {
        (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isLoading: false, data: null });
        renderComponent();
        expect(screen.getByText("Outlet rendered")).toBeInTheDocument();
    });

    it("does not render loader or navigate when not loading and no user", () => {
        (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isLoading: false, data: null });
        renderComponent();
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
        expect(screen.queryByText(/Navigate to/)).not.toBeInTheDocument();
        expect(screen.getByText("Outlet rendered")).toBeInTheDocument();
    });

    it("does not render Outlet or loader when user is present", () => {
        (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isLoading: false, data: { id: 2 } });
        renderComponent();
        expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
        expect(screen.queryByText("Outlet rendered")).not.toBeInTheDocument();
        expect(screen.getByText("Navigate to /")).toBeInTheDocument();
    });

    it("renders correct class names for loader", () => {
        (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isLoading: true, data: null });
        renderComponent();
        const loader = screen.getByTestId("loader");
        expect(loader).toHaveClass("size-8", "animate-spin");
    });
});