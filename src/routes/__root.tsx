import { createRootRoute, Outlet } from "@tanstack/react-router";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { Toaster } from "sonner";

export const Route = createRootRoute({
    component: () => <RootLayout /> ,
  });
  
  const RootLayout = () => {
  
      // Create a client
      const queryClient = new QueryClient();
  
      return(
          <div>
              <QueryClientProvider client={queryClient}>
                  <Outlet />
                  <Toaster  />
              </QueryClientProvider>
          </div>
      )
  }