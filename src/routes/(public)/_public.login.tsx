import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login-schema";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/(public)/_public/login")({
  component: LoginPage,
});

function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return <div>Hello "/(public)/_public/login"!</div>;
}
