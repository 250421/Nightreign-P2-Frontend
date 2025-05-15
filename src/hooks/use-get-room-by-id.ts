import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import axios from "axios";
import type { RoomResponse } from "@/models/room-response";

interface useGetRoomByIdProps {
  id: string;
}

export const useGetRoomById = ({ id }: useGetRoomByIdProps) => {
  return useQuery<RoomResponse | null>({
    queryKey: ["rooms", id],
    queryFn: async (): Promise<RoomResponse | null> => {
      try {
        console.log("Fetching room with ID:", id);
        const resp = await axiosInstance.get(`/room/${id}`);
        return resp.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // Handle unauthorized error
            return null;
          }
          // Handle other errors
          console.error("Error fetching room:", error);
        } else {
          // Handle non-Axios errors
          console.error("Unexpected error:", error);
        }
        return null;
      }
    },
  });
};
