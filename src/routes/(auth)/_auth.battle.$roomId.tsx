import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { toast } from "sonner";
import type { BattleResult } from "@/features/battle/dtos/responses/battle-result-response";
import { PlayerCard } from "@/features/battle/PlayerCards";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { IsReadyRequest } from "@/features/battle/dtos/requests/is-ready-request";
import { useGetRoomById } from "@/features/game-room/hooks/use-get-room-by-id";
import type { Player } from "@/features/game-room/models/player";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const Route = createFileRoute("/(auth)/_auth/battle/$roomId")({
  component: BattleScreen,
});

function BattleScreen() {
  // Get the roomId from the URL parameters
  const { data: user } = useAuth();
  const { roomId } = useParams({
    from: "/(auth)/_auth/battle/$roomId",
  });

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { data: roomDetails, isLoading: isRoomLoading } = useGetRoomById({
    id: roomId,
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (stompClient?.connected && user) {
        stompClient.publish({
          destination: "/app/room/leave",
          body: JSON.stringify({
            roomId: roomId,
            userId: user.id.toString(),
          }),
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [stompClient, user, roomId]);

  useEffect(() => {
    if (roomDetails) {
      //console.log("Room details:", roomDetails);
      setPlayer1({
        ...player1,
        ...roomDetails.players[0],
      });
      setPlayer2({
        ...player2,
        ...roomDetails.players[1],
      });
    }
    if (isRoomLoading) {
      //console.log("Loading room details...");
    }
  }, [roomDetails, isRoomLoading]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        //console.log("Connected to Battle socket");

        // Subscribe to lobby updates
        client.subscribe("/topic/battle/isReady/" + roomId, (message) => {
          const data = JSON.parse(message.body);
          // Process the received battle data and update player states
          if (data && Array.isArray(data) && data.length === 2) {
            // Check if the data contains two players
            // Find the correct player data based on user ID
            let updatedPlayer1, updatedPlayer2;
            if (user && data[0].userId === user.id) {
              updatedPlayer1 = data[0];
              updatedPlayer2 = data[1];
            } else if (user && data[1].userId === user.id) {
              updatedPlayer1 = data[1];
              updatedPlayer2 = data[0];
            } else {
              toast.error("Could not match player data with current players");
              return;
            }

            // if (updatedPlayer1.userId !== user.id) {
            //   toast.error("Player 1 ID mismatch");
            //   return;
            // }
            // if (updatedPlayer2.userId !== user.id) {
            //   toast.error("Player 2 ID mismatch");
            //   return;
            // }
            setPlayer1((prevPlayer) => ({
              ...prevPlayer,
              ...updatedPlayer1,
            }));

            setPlayer2((prevPlayer) => ({
              ...prevPlayer,
              ...updatedPlayer2,
            }));
          }
          //console.log("Received battle update:", data);
        });

        // Subscribe to battle result updates
        client.subscribe("/topic/battle/result/" + roomId, (message) => {
          const data = JSON.parse(message.body);
          // Process the received battle result and update the winner state
          if (data && data.winner) {
            setBattleResult(data);
          }
          //console.log("Received battle result:", data);
        });
      },
    });

    client.activate();
    setStompClient(client);
  }, []);

  const [player1, setPlayer1] = useState<Player>({
    userId: 1,
    username: "Player 1",
    activeCharacters: [],
    defeatedCharacters: [],
    battleReady: false,
    readyForBattle: true,
    selectedCharacter: null,
  });
  const [player2, setPlayer2] = useState<Player>({
    userId: 2,
    username: "Player 2",
    activeCharacters: [],
    defeatedCharacters: [],
    battleReady: false,
    readyForBattle: true,
    selectedCharacter: null,
  });
  // Effect to update carousel position when selectedCharacter changes
  useEffect(() => {
    if (player1.selectedCharacter) {
      const index = player1.activeCharacters.findIndex(
        (char) => char.character_id === player1.selectedCharacter?.character_id
      );
      if (index !== -1) {
        p1CarouselRef.current?.scrollTo(index);
      }
    }
  }, [player1.selectedCharacter]);

  useEffect(() => {
    if (player2.selectedCharacter) {
      const index = player2.activeCharacters.findIndex(
        (char) => char.character_id === player2.selectedCharacter?.character_id
      );
      if (index !== -1) {
        p2CarouselRef.current?.scrollTo(index);
      }
    }
  }, [player2.selectedCharacter]);
  // State to track the battle result
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  // State to track the winner
  const [winner, setWinner] = useState<string | null>(null);

  // Refs to store the carousel API for each player need useref for scrollto logic
  const p1CarouselRef = useRef<CarouselApi | null>(null);
  const p2CarouselRef = useRef<CarouselApi | null>(null);

  // Effect to reset the battle when the component mounts
  // This is to ensure that the players start with the first character selected
  useEffect(() => {
    handlePlayer1Select(0);
    handlePlayer2Select(0);
  }, []);

  // Effect to check if either player has been defeated
  // and set the winner accordingly
  useEffect(() => {
    if (
      player1.defeatedCharacters.length === player1.activeCharacters.length &&
      player1.activeCharacters.length > 0
    ) {
      setWinner(player2.username);
    } else if (
      player2.defeatedCharacters.length === player2.activeCharacters.length &&
      player2.activeCharacters.length > 0
    ) {
      setWinner(player1.username);
    }
  }, [player1.defeatedCharacters, player2.defeatedCharacters]);

  // Factory function to create a character select handler
  // for each player
  const createCharacterSelectHandler = (
    setPlayer: React.Dispatch<React.SetStateAction<Player>>,
    carouselRef: React.RefObject<CarouselApi | null>
  ) => {
    return (index: number) => {
      setPlayer((prev) => {
        const character = prev.activeCharacters[index];
        return { ...prev, selectedCharacter: character };
      });
      carouselRef.current?.scrollTo(index);
    };
  };

  // Create character select handlers for both players
  // This allows each player to select a character from their team
  const handlePlayer1Select = createCharacterSelectHandler(
    setPlayer1,
    p1CarouselRef
  );

  const handlePlayer2Select = createCharacterSelectHandler(
    setPlayer2,
    p2CarouselRef
  );

  // Function to reset the battle state
  // This is called when the "Reset Match" button is clicked
  const resetBattle = () => {
    setPlayer1({
      userId: 1,
      username: "Player 1",
      activeCharacters: [],
      defeatedCharacters: [],
      battleReady: false,
      readyForBattle: true,
      selectedCharacter: null,
    });
    setPlayer2({
      userId: 2,
      username: "Player 2",
      activeCharacters: [],
      defeatedCharacters: [],
      battleReady: false,
      readyForBattle: true,
      selectedCharacter: null,
    });
    setWinner(null);
    handlePlayer1Select(0);
    handlePlayer2Select(0);
  };

  const handleIsReady = (request: IsReadyRequest) => {
    if (!stompClient) return;

    stompClient.publish({
      destination: "/app/battle/isReady",
      body: JSON.stringify(request),
    });
  };

  return (
    <div className="mx-auto space-y-6 p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-center">Battle Arena</h1>
      <div className="grid grid-cols-2 gap-4">
        <PlayerCard
          player={player1}
          onSelect={handlePlayer1Select}
          carouselRef={p1CarouselRef}
          onSimulate={() => {
            if (player1?.userId) {
              handleIsReady({
                roomId: roomId,
                userId: player1.userId.toString(),
                username: player1?.username,
                battleReady: true,
                character_id: player1?.selectedCharacter?.character_id || null,
              });
            }
          }}
          isSimulating={false}
          disabled={!!winner || false}
        />
        <PlayerCard
          player={player2}
          onSelect={handlePlayer2Select}
          carouselRef={p2CarouselRef}
          onSimulate={() => {
            if (player2?.userId) {
              handleIsReady({
                roomId: roomId,
                userId: player2.userId.toString(),
                username: player2?.username,
                battleReady: true,
                character_id: player2?.selectedCharacter?.character_id || null,
              });
            }
          }}
          isSimulating={false}
          disabled={!!winner || false}
        />
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        {winner && (
          <div className="text-xl font-bold text-green-600">
            {winner} Wins the Match!
          </div>
        )}
        <Button variant="secondary" onClick={resetBattle}>
          Reset Match
        </Button>
      </div>

      <Separator />
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Battle Log</h2>

        {/* {false && <p>Simulating...</p>} */}
        {battleResult && (
          <div className="bg-gray-100 p-4 rounded shadow">
            <p>
              <strong>Winner:</strong> {battleResult.winningCharacter}
            </p>
            <p>
              <strong>Reason:</strong> {battleResult.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
