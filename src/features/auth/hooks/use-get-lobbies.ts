import { axiosInstance } from "@/lib/axios-config";
import type { Lobby } from "@/models/lobby";
import { useQuery } from "@tanstack/react-query"

export const useGetCharacters = () => {
    return useQuery({
        queryKey: ["lobbies"],
        queryFn: async (): Promise<Lobby[]> => {
            try {
                const response = await axiosInstance.get("/lobbies");
                return response.data;
            } catch (error) {
                return [];
            }
        }
    })
}