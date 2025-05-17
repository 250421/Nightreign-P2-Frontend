import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(auth)/_auth/")({
  component: RouteComponent,
});

export function RouteComponent() {
  return (
    <div>
      <h1 className="flex items-center justify-center gap-x-10 my-30 text-center">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              New to the game?
            </CardTitle>
            <CardDescription>
              Check out the rules and how to play here!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-1/2" asChild>
              <Link to={"/rules"}>Rules</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Build a team of three!
            </CardTitle>
            <CardDescription>
              Choose from a wide variety of characters and assemble the best
              team!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-1/2" asChild>
              <Link to={"/character-page"}>View Characters</Link>
            </Button>
          </CardContent>
        </Card>
      </h1>
      <h2 className="flex items-center justify-center gap-x-10 my-30 text-center">
        <Card className="w-screen">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Ready? Battle!</CardTitle>
            <CardDescription>
              Join or Create a lobby and start battling!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-1/2" asChild>
              <Link to={"/lobby"}>Battle!</Link>
            </Button>
          </CardContent>
        </Card>
      </h2>
    </div>
  );
}
