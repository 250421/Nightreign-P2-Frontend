import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const mockAxios = require("@/lib/axios-config").axiosInstance;

// filepath: d:\Program Files\Revature\Nightreign-P2-Frontend\src\tests\hooks\use-auth.test.tsx

jest.mock("@/lib/axios-config", () => ({
    axiosInstance: {
        get: jest.fn(),
    },
}));


function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useAuth", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns user data when API call succeeds", async () => {
        mockAxios.get.mockResolvedValueOnce({ data: { id: 1, username: "testuser" } });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ id: 1, username: "testuser" });
        expect(mockAxios.get).toHaveBeenCalledWith("/auth");
    });

    it("returns null when API call fails", async () => {
        mockAxios.get.mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeNull();
        expect(mockAxios.get).toHaveBeenCalledWith("/auth");
    });

    it("isLoading is true while fetching", async () => {
        let resolvePromise: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });
        mockAxios.get.mockReturnValueOnce(promise);

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isLoading).toBe(true);

        resolvePromise!({ data: { id: 2, username: "anotheruser" } });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ id: 2, username: "anotheruser" });
    });
});