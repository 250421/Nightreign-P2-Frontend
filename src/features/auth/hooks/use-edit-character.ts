import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { EditCharacterSchemaType } from "../schemas/edit-character-schema";

export const useEditCharacter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values: EditCharacterSchemaType) => {
            const response = await axiosInstance.put(`/characters/${values.character_id}`, values);
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