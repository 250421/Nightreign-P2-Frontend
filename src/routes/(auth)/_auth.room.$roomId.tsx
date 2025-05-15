import { CharacterSelection } from "@/components/game-room/character-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { LeaveRoomRequest } from "@/features/game-room/dtos/requests/leave-room-request";
import { useGetRoomById } from "@/features/game-room/hooks/use-get-room-by-id";
import type { Room } from "@/features/game-room/models/room";
import { useGetCharacters } from "@/hooks/use-get-characters";
import { cn } from "@/lib/utils";
import type { Character } from "@/models/character";

import { Client } from "@stomp/stompjs";

import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { Check, Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/_auth/room/$roomId")({
  component: GameRoomIdPage,
});

function GameRoomIdPage() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams({
    from: "/(auth)/_auth/room/$roomId",
  });
  const { data: initialRoomDetails, isLoading: isRoomLoading } = useGetRoomById(
    {
      id: roomId,
    }
  );

  const [roomDetails, setRoomDetails] = useState<Room | null>(null);

  useEffect(() => {
    if (initialRoomDetails) {
      const room: Room = {
        id: initialRoomDetails.id,
        name: initialRoomDetails.name,
        players: initialRoomDetails.players,
        status: "Waiting",
        creator: initialRoomDetails.creator,
      };
      setRoomDetails(room);
    }
  }, [initialRoomDetails]);

  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to game rooms socket");

        client.subscribe("/topic/room/" + roomId, (message) => {
          const data = JSON.parse(message.body);
          console.log("Received room update:", data);
          if (data) {
            const room: Room = {
              id: data.id,
              name: data.name,
              players: data.players,
              status: "Waiting",
              creator: data.creator.username,
            };
            setRoomDetails(room);
          }
        });
      },
    });

    client.activate();
    setStompClient(client);
  }, []);

  const handleLeaveRoom = (request: LeaveRoomRequest) => {
    console.log("Leaving room with ID:", roomId);
    if (!stompClient) return;

    stompClient.publish({
      destination: "/app/room/leave",
      body: JSON.stringify(request),
    });

    navigate({
      to: "/lobby",
    });

    toast.success(`Leaving room: ${request.roomId}`);
  };
  return (
    <div>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Room: {roomDetails?.name}</h1>
          <Button
            variant="outline"
            onClick={() => {
              if (user) {
                handleLeaveRoom({ roomId: roomId, userId: user?.id.toString() });
              }
            }}
          >
            Leave Room
          </Button>
        </div>

        {isRoomLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="border rounded-md p-4">
            <h2 className="text-xl font-semibold mb-4">Players</h2>
            <ul className="space-y-2">
              {roomDetails?.players.map((player, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="font-medium">{player.username}</span>
                  {roomDetails?.creator.userId === player.userId && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Creator
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>


      <CharacterSelection/>
    </div>
  );
}
