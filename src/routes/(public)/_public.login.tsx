import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";

import { createFileRoute} from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/use-login";
export const Route = createFileRoute("/(public)/_public/login")({
  component: LoginPage,
});

export function LoginPage() {
  const {mutate: login } = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    //console.log("Logging in with:", data);
    login(data);
    // handle login logic
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <Card className="w-full max-w-sm p-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground justify-center">
          Don’t have an account?{" "}
          <a href="/register" className="ml-1 underline">
            Register
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
