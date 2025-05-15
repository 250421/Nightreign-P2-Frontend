// useLeaveRoom.ts
import { useStompClient } from "@/context/stomp-context";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner"; // or whatever toast lib you're using

interface LeaveRoomRequest {
  roomId: string;
  userId: string;
}

export function useLeaveRoom() {
  const navigate = useNavigate();
  const stompClient = useStompClient(); // assuming this returns your stomp client

  const leaveRoom = (request: LeaveRoomRequest) => {
    console.log("Leaving room with ID:", request.roomId);
    if (!stompClient) return;

    stompClient.publish({
      destination: "/app/room/leave",
      body: JSON.stringify(request),
    });

    navigate({ to: "/lobby" });

    toast.success(`Leaving room: ${request.roomId}`);
  };

  return { leaveRoom };
}
