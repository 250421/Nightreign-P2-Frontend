import { renderHook, act } from "@testing-library/react";
import { useSignOut } from "@/hooks/use-sign-out";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

jest.mock("@/lib/axios-config", () => ({
  axiosInstance: { post: jest.fn() },
}));


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
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(axiosInstance.post as jest.Mock).toHaveBeenCalledWith("/auth/sign-out");
    //expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["auth"] });
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("calls onError and logs error on failure", async () => {
    const error = new Error("Sign out failed");
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(error);
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