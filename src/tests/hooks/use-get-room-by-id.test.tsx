import { renderHook, waitFor } from "@testing-library/react";
import { useGetRoomById } from "@/features/game-room/hooks/use-get-room-by-id";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGet = jest.fn();
jest.mock("@/lib/axios-config", () => ({
    axiosInstance: {
        get: (...args: any[]) => mockGet(...args),
    },
}));
jest.mock("axios", () => {
    const actual = jest.requireActual("axios");
    return {
        ...actual,
        isAxiosError: actual.isAxiosError,
    };
});

function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const roomResponse = { id: "abc123", name: "Test Room" };

describe("useGetRoomById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns room data when API call succeeds", async () => {
        mockGet.mockResolvedValueOnce({ data: roomResponse });

        const { result } = renderHook(() => useGetRoomById({ id: "abc123" }), { wrapper });

        await waitFor(() => expect(result.current.data).toEqual(roomResponse));
        expect(mockGet).toHaveBeenCalledWith("/room/abc123");
    });

    it("returns null on 401 error", async () => {
        const error = new Error("Unauthorized");
        (error as any).response = { status: 401 };
        // Simulate axios.isAxiosError returning true
        jest.spyOn(require("axios"), "isAxiosError").mockReturnValue(true);

        mockGet.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useGetRoomById({ id: "abc123" }), { wrapper });

        await waitFor(() => expect(result.current.data).toBeNull());
        (require("axios").isAxiosError as jest.Mock).mockRestore();
    });

    it("returns null and logs error for other axios errors", async () => {
        const error = new Error("Server error");
        (error as any).response = { status: 500 };
        jest.spyOn(require("axios"), "isAxiosError").mockReturnValue(true);
        jest.spyOn(console, "error").mockImplementation(() => {});

        mockGet.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useGetRoomById({ id: "abc123" }), { wrapper });

        await waitFor(() => expect(result.current.data).toBeNull());
        expect(console.error).toHaveBeenCalledWith("Error fetching room:", error);

        (require("axios").isAxiosError as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });

    it("returns null and logs error for non-axios errors", async () => {
        const error = new Error("Some other error");
        jest.spyOn(require("axios"), "isAxiosError").mockReturnValue(false);
        jest.spyOn(console, "error").mockImplementation(() => {});

        mockGet.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useGetRoomById({ id: "abc123" }), { wrapper });

        await waitFor(() => expect(result.current.data).toBeNull());
        expect(console.error).toHaveBeenCalledWith("Unexpected error:", error);

        (require("axios").isAxiosError as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });
});