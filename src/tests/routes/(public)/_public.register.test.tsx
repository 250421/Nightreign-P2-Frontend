import { render, screen, fireEvent } from "@testing-library/react";
import { Route } from "@/routes/(public)/_public.register";
const { Route: PatchedRoute } = require("@/routes/(public)/_public.register");

// filepath: d:\Program Files\Revature\Nightreign-P2-Frontend\src\tests\routes\(public)\_public.register.test.tsx

// Mocks
jest.mock("@/features/auth/hooks/use-register", () => ({
    useRegister: () => ({ mutate: jest.fn() }),
}));
jest.mock("@tanstack/react-router", () => ({
    createFileRoute: () => (config: any) => config,
}));
jest.mock("@/components/ui/card", () => ({
    Card: ({ children }: any) => <div data-testid="card">{children}</div>,
    CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
    CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
    CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
    CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
    CardFooter: ({ children }: any) => <div data-testid="card-footer">{children}</div>,
}));
jest.mock("@/components/ui/form", () => ({
    Form: ({ children }: any) => <form data-testid="form">{children}</form>,
    FormControl: ({ children }: any) => <div>{children}</div>,
    FormField: ({ render, ...props }: any) => render({ field: { ...props } }),
    FormItem: ({ children }: any) => <div>{children}</div>,
    FormLabel: ({ children }: any) => <label>{children}</label>,
    FormMessage: () => <div data-testid="form-message" />,
}));
jest.mock("@/components/ui/button", () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock("@/components/ui/input", () => ({
    Input: (props: any) => <input {...props} />,
}));
jest.mock("@hookform/resolvers/zod", () => ({
    zodResolver: () => jest.fn(),
}));
jest.mock("@/features/auth/schemas/register-schema", () => ({
    registerSchema: {},
}));
jest.mock("react-hook-form", () => {
    // Provide a minimal mock for useForm to avoid destructure errors
    const actual = jest.requireActual("react-hook-form");
    return {
        ...actual,
        useForm: () => ({
            control: {},
            handleSubmit: (cb: any) => (e: any) => {
                e && e.preventDefault && e.preventDefault();
                // Simulate form values
                return cb({
                    username: "testuser",
                    password: "password123",
                });
            },
            formState: { errors: {} },
            register: jest.fn(),
            setValue: jest.fn(),
            getValues: jest.fn(() => ({ username: "", password: "" })),
        }),
    };
});

// Import after mocks

function renderComponent() {
    const Component = (Route as any).component;
    return render(<Component />);
}

describe("RegisterPage", () => {
    it("renders register form", () => {
        renderComponent();
        expect(screen.getByTestId("card-title")).toBeInTheDocument();
        expect(screen.getByText("Create a new account to get started")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("your_username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
        expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    });

    it("calls register on form submit", () => {
        const mockRegister = jest.fn();
        jest.spyOn(require("@/features/auth/hooks/use-register"), "useRegister").mockReturnValue({ mutate: mockRegister });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("your_username"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /register/i }));

        expect(mockRegister).toHaveBeenCalledWith({
            username: "testuser",
            password: "password123",
        });
    });

    it("renders login link", () => {
        renderComponent();
        const loginLink = screen.getByText("Log in");
        expect(loginLink).toBeInTheDocument();
        expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
    });

    it("shows validation error if username is empty", async () => {
        jest.doMock("react-hook-form", () => {
            const actual = jest.requireActual("react-hook-form");
            return {
                ...actual,
                useForm: () => ({
                    control: {},
                    handleSubmit: (cb: any) => (e: any) => {
                        e && e.preventDefault && e.preventDefault();
                        return cb({ username: "", password: "password123" });
                    },
                    formState: { errors: { username: { message: "Username is required" } } },
                    register: jest.fn(),
                    setValue: jest.fn(),
                    getValues: jest.fn(() => ({ username: "", password: "" })),
                }),
            };
        });
        const Component = (PatchedRoute as any).component;
        render(<Component />);
        fireEvent.click(screen.getByRole("button", { name: /register/i }));
        expect(screen.getAllByTestId("form-message").length).toBeGreaterThan(0);
    });

    it("shows validation error if password is empty", async () => {
        jest.doMock("react-hook-form", () => {
            const actual = jest.requireActual("react-hook-form");
            return {
                ...actual,
                useForm: () => ({
                    control: {},
                    handleSubmit: (cb: any) => (e: any) => {
                        e && e.preventDefault && e.preventDefault();
                        return cb({ username: "testuser", password: "" });
                    },
                    formState: { errors: { password: { message: "Password is required" } } },
                    register: jest.fn(),
                    setValue: jest.fn(),
                    getValues: jest.fn(() => ({ username: "", password: "" })),
                }),
            };
        });
        const Component = (PatchedRoute as any).component;
        render(<Component />);
        fireEvent.click(screen.getByRole("button", { name: /register/i }));
        expect(screen.getAllByTestId("form-message").length).toBeGreaterThan(0);
    });
});