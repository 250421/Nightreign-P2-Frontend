
import { UserProfile } from "@/components/shared/navbar/user-profile";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(auth)/(lobby)/_lobby")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center h-screen justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );

  if (!user) {
    return <Navigate to={"/login"} />;
    // TODO: Kill lobby if needed?
  }

  return (
    <div>
        <nav className="py-4 bg-gray-800 border-b">
                    <div className="flex justify-between max-w-screen mx-auto w-11/12">
                        <div className="flex justify-between items-center gap-x-5">
                            <h1 className=" font-bold text-2xl text-red-800">Battle Simulator</h1>
                        </div>
        
                        <div>
                            <UserProfile />
                        </div>
                    </div>
                </nav>
      <main className="max-w-screen mx-auto w-11/12 py-10">
        <Outlet />
      </main>
    </div>
  );
}
