import { renderHook, waitFor } from "@testing-library/react";
import { useGetAllRooms } from "@/features/game-room/hooks/use-get-all-rooms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

const mockNavigate = jest.fn();
const mockGet = jest.fn();

jest.mock("@tanstack/react-router", () => ({
    useNavigate: () => mockNavigate,
}));
jest.mock("axios", () => {
    const actual = jest.requireActual("axios");
    return {
        ...actual,
        get: (...args: any[]) => mockGet(...args),
    };
});
function wrapper({ children }: { children: React.ReactNode }) {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useGetAllRooms", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns rooms data when API call succeeds", async () => {
        const rooms = [
            { id: 1, name: "Room 1" },
            { id: 2, name: "Room 2" },
        ];
        mockGet.mockResolvedValueOnce({ data: rooms });

        const { result } = renderHook(() => useGetAllRooms(), { wrapper });

        await waitFor(() => expect(result.current.rooms).toEqual(rooms));
        expect(mockGet).toHaveBeenCalledWith(
            `${import.meta.env.VITE_API_URL}/rooms`,
            { withCredentials: true }
        );
    });

    it("navigates to /login on 401 error", async () => {
        const error = new AxiosError(
            "Unauthorized",
            undefined,
            undefined,
            undefined,
            { status: 401 } as any
        );
        (error as any).response = { status: 401 };
        mockGet.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useGetAllRooms(), { wrapper });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
        });
        expect(result.current.rooms).toBeUndefined();
    });

    it("throws error for non-401 errors", async () => {
        const error = new AxiosError("Server error", undefined, undefined, undefined, {
            status: 500,
        } as any);
        (error as any).response = { status: 500 };
        mockGet.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useGetAllRooms(), { wrapper });

        await waitFor(() => {
            expect(result.current.rooms).toBeUndefined();
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});