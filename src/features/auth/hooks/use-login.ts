import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import type { LoginFormValues } from "../schemas/login-schema";

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (values: LoginFormValues) => {
            const resp = await axiosInstance.post("/auth/sign-in", values);
            return resp.data;
        },
        onSuccess: () => {
            toast.success("User logged in");
            navigate({ to: "/" });
        },
        onError: (error) => {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
    });
};
