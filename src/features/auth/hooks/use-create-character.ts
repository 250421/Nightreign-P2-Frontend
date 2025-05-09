import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useAddCharacter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(`/characters`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Character added successfully");
            queryClient.invalidateQueries({
                queryKey: ["characters"]
            });
        },
        onError: (error) => {
            console.error(error);
            if(error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    })
}