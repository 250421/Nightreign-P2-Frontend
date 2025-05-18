import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddCharacter } from "@/features/auth/hooks/use-add-character";
import { AxiosError } from "axios";
const mockAxios = require("@/lib/axios-config").axiosInstance;
const mockToast = require("sonner").toast;

// filepath: d:\Program Files\Revature\Nightreign-P2-Frontend\src\tests\hooks\use-add-character.test.tsx

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

const testHero = {
    character_id: null,
    name: "Hero",
    origin: "Test",
    image: undefined,
}

const testVillain = {
    character_id: null,
    name: "Villain",
    origin: "Test",
    image: undefined,
}

describe("useAddCharacter", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls axios.post and shows success toast on success", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: { id: 1, name: "Hero" } });

        const { result } = renderHook(() => useAddCharacter(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync(testHero);
        });

        expect(mockAxios.post).toHaveBeenCalledWith("/characters", testHero);
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
        mockAxios.post.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useAddCharacter(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(testHero);
            } catch { }
        });

        expect(mockToast.error).toHaveBeenCalledWith("Name already exists");
    });

    it("logs error and does not call toast.error if not AxiosError", async () => {
        const error = new Error("Unknown error");
        jest.spyOn(console, "error").mockImplementation(() => { });
        mockAxios.post.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useAddCharacter(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync(testVillain);
            } catch { }
        });

        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockToast.error).not.toHaveBeenCalled();
        (console.error as jest.Mock).mockRestore();
    });
});