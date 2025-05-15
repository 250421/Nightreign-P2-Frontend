import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { StompProvider } from "@/context/stomp-context";

export const Route = createRootRoute({
  component: () => <RootLayout />,
});
const queryClient = new QueryClient(); 

const RootLayout = () => {
  // Create a client

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <StompProvider>
          <Outlet />
          <Toaster />
        </StompProvider>
      </QueryClientProvider>
    </div>
  );
};
