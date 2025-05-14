import { axiosInstance } from "@/lib/axios-config";
import type { Character } from "@/models/character";
import { useQuery } from "@tanstack/react-query";

export const useGetCharacters = () => {
  return useQuery({
    queryKey: ["characters"],
    queryFn: async (): Promise<Character[]> => {
      try {
        const response = await axiosInstance.get("/characters");
        return response.data;
      } catch {
        return [];
      }
    },
  });
};
