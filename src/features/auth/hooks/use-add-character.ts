import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { type AddCharacterSchemaType } from "../schemas/add-character-schema";

export const useAddCharacter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values: AddCharacterSchemaType) => {
            const response = await axiosInstance.post("/characters", values);
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