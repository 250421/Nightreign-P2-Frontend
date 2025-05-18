import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "@/routes/(public)/_public.login";
const { LoginPage: PatchedLoginPage } = require("@/routes/(public)/_public.login");

// filepath: d:\Program Files\Revature\Nightreign-P2-Frontend\src\tests\routes\(public)\_public.login.test.tsx

// Mocks
jest.mock("@/features/auth/hooks/use-login", () => ({
    useLogin: () => ({ mutate: jest.fn() }),
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
jest.mock("@/features/auth/schemas/login-schema", () => ({
    loginSchema: {},
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

describe("LoginPage", () => {
    it("renders login form", () => {
        render(<LoginPage/>)
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Enter your credentials to access your account")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByText(/Don’t have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    it("calls login on form submit", () => {
        const mockLogin = jest.fn();
        jest.spyOn(require("@/features/auth/hooks/use-login"), "useLogin").mockReturnValue({ mutate: mockLogin });

        render(<LoginPage/>)

        fireEvent.change(screen.getByPlaceholderText("username"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /log in/i }));

        // Formik/React Hook Form may debounce, so we can't guarantee immediate call, but we can check if called
        expect(mockLogin).toHaveBeenCalledWith({
            username: "testuser",
            password: "password123",
        });
    });

    it("renders register link", () => {
        render(<LoginPage/>)
        const registerLink = screen.getByText("Register");
        expect(registerLink).toBeInTheDocument();
        expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
    });
});