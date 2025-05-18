import { renderHook, act } from "@testing-library/react";
import { useEditCharacter } from "@/features/auth/hooks/use-edit-character";
import { AxiosError } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockAxios = require("@/lib/axios-config").axiosInstance;
const mockToast = require("sonner").toast;

jest.mock("@/lib/axios-config", () => ({
    axiosInstance: {
        put: jest.fn(),
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

const testCharacter = {
    character_id: 1,
    name: "Edited Hero",
    origin: "Test",
    image: undefined,
};

describe("useEditCharacter", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls axios.put and shows success toast on success", async () => {
        mockAxios.put.mockResolvedValueOnce({ data: { id: "1", name: "Edited Hero" } });

        const { result } = renderHook(() => useEditCharacter(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync(testCharacter);
        });

        expect(mockAxios.put).toHaveBeenCalledWith("/characters/1", testCharacter);
        expect(mockToast.success).toHaveBeenCalledWith("Character added successfully");
        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["characters"] });
    });

    it("shows error toast with message from AxiosError", async () => {
        const error = new AxiosError(
            "Request failed",
            undefined,
            undefined,
            undefined,
            { data: { message: "Name already exists" } } as any
        );
        mockAxios.put.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useEditCharacter(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(testCharacter);
            } catch {}
        });

        expect(mockToast.error).toHaveBeenCalledWith("Name already exists");
    });

    it("logs error and does not call toast.error if not AxiosError", async () => {
        const error = new Error("Unknown error");
        jest.spyOn(console, "error").mockImplementation(() => {});
        mockAxios.put.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useEditCharacter(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(testCharacter);
            } catch {}
        });

        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockToast.error).not.toHaveBeenCalled();
        (console.error as jest.Mock).mockRestore();
    });
});