import { useAuth } from "@/features/auth/hooks/use-auth";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(public)/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { data: user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center h-screen justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );

  if (user) {
    return <Navigate to={"/"} />;
  }
  
  return (
    <div>
      <h1 className="fixed top text-5xl flex text-center justify-center w-screen bg-gray-800 my-50 text-red-800 font-bold">
        <h2>
          Welcome to Battle Simulator!
        </h2>
      </h1>
      <Outlet />
    </div>
  );
}
