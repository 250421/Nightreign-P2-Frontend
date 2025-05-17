import { renderHook, act } from "@testing-library/react";
import { useSignOut } from "@/hooks/use-sign-out";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

var mockPost = jest.fn();
jest.mock("@/lib/axios-config", () => ({
  axiosInstance: { post: mockPost },
}));

const mockInvalidateQueries = jest.fn();
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  );
};

var mockNavigate = jest.fn();
jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("useSignOut", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls axiosInstance.post and onSuccess invalidates queries and navigates", async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockPost).toHaveBeenCalledWith("/auth/sign-out");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["auth"] });
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("calls onError and logs error on failure", async () => {
    const error = new Error("Sign out failed");
    mockPost.mockRejectedValueOnce(error);
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() });

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {}
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});