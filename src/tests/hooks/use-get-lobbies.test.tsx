import { renderHook, waitFor } from "@testing-library/react";
import { useGetCharacters } from "@/features/auth/hooks/use-get-lobbies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockAxios = require("@/lib/axios-config").axiosInstance;

jest.mock("@/lib/axios-config", () => ({
    axiosInstance: {
        get: jest.fn(),
    },
}));

function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useGetCharacters", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns lobbies data when API call succeeds", async () => {
        const lobbies = [
            { id: 1, name: "Lobby 1" },
            { id: 2, name: "Lobby 2" },
        ];
        mockAxios.get.mockResolvedValueOnce({ data: lobbies });

        const { result } = renderHook(() => useGetCharacters(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(lobbies);
        expect(mockAxios.get).toHaveBeenCalledWith("/lobbies");
    });

    it("returns empty array when API call fails", async () => {
        mockAxios.get.mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useGetCharacters(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([]);
        expect(mockAxios.get).toHaveBeenCalledWith("/lobbies");
    });
});