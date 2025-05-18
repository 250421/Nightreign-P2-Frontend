import { renderHook, act } from "@testing-library/react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { AxiosError } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockAxios = require("@/lib/axios-config").axiosInstance;
const mockToast = require("sonner").toast;
const mockNavigate = jest.fn();

jest.mock("@/lib/axios-config", () => ({
    axiosInstance: {
        post: jest.fn(),
    },
}));
jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));
jest.mock("@tanstack/react-router", () => ({
    useNavigate: () => mockNavigate,
}));

function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const loginData = { username: "test", password: "pass" };

describe("useLogin", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls axios.post and shows success toast and navigates on success", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { id: 1, username: "test" } });

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync(loginData);
        });

        expect(mockAxios.post).toHaveBeenCalledWith("/auth/sign-in", loginData);
        expect(mockToast.success).toHaveBeenCalledWith("User logged in");
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });

    it("shows error toast with message from AxiosError", async () => {
        const error = new AxiosError(
            "Request failed",
            undefined,
            undefined,
            undefined,
            { data: { message: "Invalid credentials" } } as any
        );
        mockAxios.post.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(loginData);
            } catch {}
        });

        expect(mockToast.error).toHaveBeenCalledWith("Invalid credentials");
    });

    it("logs error and does not call toast.error if not AxiosError", async () => {
        const error = new Error("Unknown error");
        jest.spyOn(console, "error").mockImplementation(() => {});
        mockAxios.post.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(loginData);
            } catch {}
        });

        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockToast.error).not.toHaveBeenCalled();
        (console.error as jest.Mock).mockRestore();
    });
});