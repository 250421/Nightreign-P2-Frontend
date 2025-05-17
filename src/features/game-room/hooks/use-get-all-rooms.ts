import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios, { AxiosError } from "axios";

export const useGetAllRooms = () => {
  const navigate = useNavigate();
  const { data: rooms } = useQuery({
    queryKey: ["gameRooms"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`, {
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
          navigate({ to: "/login" });
        }
        throw error;
      }
    },
  });

  return { rooms };
};
