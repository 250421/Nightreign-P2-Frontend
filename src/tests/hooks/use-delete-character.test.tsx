import { renderHook, act } from "@testing-library/react";
import { useDeleteCharacter } from "@/features/auth/hooks/use-delete-character";
import { AxiosError } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockAxios = require("@/lib/axios-config").axiosInstance;
const mockToast = require("sonner").toast;

jest.mock("@/lib/axios-config", () => ({
    axiosInstance: {
        delete: jest.fn(),
    },
}));
jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));
const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => {
    const actual = jest.requireActual("@tanstack/react-query");
    return {
        ...actual,
        useQueryClient: () => ({
            invalidateQueries: mockInvalidateQueries,
        }),
    };
});

function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useDeleteCharacter", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls axios.delete and shows success toast on success", async () => {
        mockAxios.delete.mockResolvedValueOnce({ data: { success: true } });

        const { result } = renderHook(() => useDeleteCharacter(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ id: "123" });
        });

        expect(mockAxios.delete).toHaveBeenCalledWith("/characters/123");
        expect(mockToast.success).toHaveBeenCalledWith("Character deleted successfully");
        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["characters"] });
    });

    it("shows error toast with message from AxiosError", async () => {
        const error = new AxiosError(
            "Request failed",
            undefined,
            undefined,
            undefined,
            { data: { message: "Not found" } } as any
        );
        mockAxios.delete.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteCharacter(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync({ id: "404" });
            } catch {}
        });

        expect(mockToast.error).toHaveBeenCalledWith("Not found");
    });

    it("logs error and does not call toast.error if not AxiosError", async () => {
        const error = new Error("Unknown error");
        jest.spyOn(console, "error").mockImplementation(() => {});
        mockAxios.delete.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteCharacter(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync({ id: "500" });
            } catch {}
        });

        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockToast.error).not.toHaveBeenCalled();
        (console.error as jest.Mock).mockRestore();
    });
});