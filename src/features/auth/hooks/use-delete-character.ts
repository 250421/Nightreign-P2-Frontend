import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UseDeleteCharacterProps {
    id: String;
}

export const useDeleteCharacter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: UseDeleteCharacterProps) => {
            const response = await axiosInstance.delete(`/characters/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Character deleted successfully");
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