import { Navbar } from "@/components/shared/navbar/navbar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(auth)/_auth")({
  component: AuthPage,
});

export function AuthPage() {
  const { data: user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center h-screen justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-screen mx-auto w-11/12 py-10">
        <Outlet />
      </main>
    </div>
  );
}
