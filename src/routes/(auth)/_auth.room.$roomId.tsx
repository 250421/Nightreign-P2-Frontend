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

  // character select
  const { data: characters } = useGetCharacters();
  const [characterSelect, updateSelectedCharacter] = useState<Character[]>();
  const [searchInput, updateSearchInput] = useState<string>("");
  const [p2ready, p2setReady] = useState(false);
  const [ready, setReady] = useState(false);

  const addToEnd = (newChara: Character) => {
    updateSelectedCharacter(prevList => [...prevList ? prevList : [], newChara]);
  }

  const removeCharacter = (charaToDelete: Character) => {
    updateSelectedCharacter(characterSelect?.filter(chara => chara !== charaToDelete));
  }

  const removeFirst = () => {
    updateSelectedCharacter(characterSelect?.filter(chara => chara !== characterSelect.at(0)));
  }

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


      {!characters || characters.length == 0 ?
        <div>No characters found</div>
        :
        <main>
          <h1 className='flex justify-center text-5xl font-bold'>
            Select your team!
          </h1>
          <Card className={`fixed left-9/10 bottom-2/3 w-40 text-center flex flex-row justify-center ${p2ready ? "bg-green-400" : "bg-yellow-300"}`}>
            <p>Player 2</p>
            {p2ready ? <Check /> : <Ellipsis />}
          </Card>
          <h2 className="my-10">
            <Input
              placeholder="Search"
              className='bg-gray-100'
              onChange={(event) => updateSearchInput(event.target.value)} />
          </h2>
          <div className={cn("grid gap-y-10 grid-cols-3 pb-100 my-10")}>
            {characters
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(chara => chara.name.toLowerCase().includes(searchInput))
              .map((chara) => {
                return (
                  <Card key={chara.character_id}
                    className="w-[400px] h-[200px] cursor-pointer"
                    onClick={() => {
                      console.log(chara);
                      if (characterSelect?.includes(chara)) {
                        // "deselect character" by removing it
                        removeCharacter(chara);
                      }
                      else if (characterSelect?.length == 3) {
                        // Remove first selected and add the new one as third
                        removeFirst();
                        addToEnd(chara);
                      }
                      else {
                        addToEnd(chara);
                      }
                    }}>
                    <div className="flex justify-between">
                      <CardHeader>
                        <CardTitle className="text-3xl font-bold text-wrap">{chara.name}</CardTitle>
                        <CardDescription className="text-wrap">{chara.origin}</CardDescription>
                      </CardHeader>
                      <CardContent className="w-40 h-40">
                        <img src={chara.characterImageUrl} alt={chara.name} className=" w-full h-full object-contain" />
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
          </div>
          <div className="fixed bottom-0 right-0 left-0 mx-5">
            <Card>
              <div className="flex flex-row gap-x-50 justify-center">
                <Card className="w-50 h-50">
                  <img
                    src={characterSelect?.at(0)?.characterImageUrl || "https://placehold.co/600x400/transparent/black?text=Character+1"}
                    alt={characterSelect?.at(0)?.name || "Placeholder"}
                    className="w-full h-full object-contain"
                  />
                </Card>
                <Card className="w-50 h-50">
                  <img
                    src={characterSelect?.at(1)?.characterImageUrl || "https://placehold.co/600x400/transparent/black?text=Character+2"}
                    alt={characterSelect?.at(1)?.name || "Placeholder"}
                    className="w-full h-full object-contain"
                  />
                </Card>
                <Card className="w-50 h-50">
                  <img
                    src={characterSelect?.at(2)?.characterImageUrl || "https://placehold.co/600x400/transparent/black?text=Character+3"}
                    alt={characterSelect?.at(2)?.name || "Placeholder"}
                    className="w-full h-full object-contain"
                  />
                </Card>
              </div>
              <footer className="flex flex-row justify-center w-full">
                <Button className={`${ready ? 'bg-red-500' : 'bg-green-500'} w-1/2 self-center justify-items-center`} disabled={characterSelect?.length !== 3} onClick={() => {
                  setReady(!ready);
                  console.log(ready);
                }}>
                  {ready ? "Cancel" : "Ready"}
                </Button>
              </footer>
            </Card>
          </div>
        </main>
      }
    </div>
  );
}
