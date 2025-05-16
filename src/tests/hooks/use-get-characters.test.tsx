import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetCharacters } from "@/hooks/use-get-characters";
import { axiosInstance } from "@/lib/axios-config";

// Mock axiosInstance.get
jest.mock("@/lib/axios-config", () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  );
};

describe("useGetCharacters", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns characters on success", async () => {
    const mockCharacters = [{ id: 1, name: "Alice" }];
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockCharacters });

    const { result } = renderHook(() => useGetCharacters(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCharacters);
    expect(axiosInstance.get).toHaveBeenCalledWith("/characters");
  });

  it("returns empty array on error", async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useGetCharacters(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});