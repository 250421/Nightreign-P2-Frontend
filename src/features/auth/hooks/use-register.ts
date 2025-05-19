import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { RegisterFormValues } from "../schemas/register-schema";

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (values: RegisterFormValues) => {
            const resp = await axiosInstance.post("/auth/sign-up", values);
            return resp.data;
        },
        onSuccess: () => {
            toast.success("User created");
            navigate({ to: "/login" });
        },
        onError: (error) => {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
    });
};
