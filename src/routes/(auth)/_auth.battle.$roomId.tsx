import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import type { Player } from "@/models/player";
import { useEffect, useRef, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { toast } from "sonner";
import { GetCharacters } from "@/mocks/getCharacters";
import { useBattleResult } from "@/hooks/use-battle-result";
import type { BattleResult } from "@/models/battle-result";
import { PlayerCard } from "@/features/battle/PlayerCards";
import { Client } from "@stomp/stompjs";
import { useGetRoomById } from "@/hooks/use-get-room-by-id";
import SockJS from "sockjs-client";
import type { RoomResponse } from "@/models/room-response";
import type { Room } from "@/models/room";
import type { IsReadyRequest } from "@/models/is-ready-request";
import type { RoomUser } from "@/models/room-user";

export const Route = createFileRoute("/(auth)/_auth/battle/$roomId")({
  component: BattleScreen,
});

function BattleScreen() {
  // Get the roomId from the URL parameters
  const { roomId } = useParams({
    from: "/(auth)/_auth/battle/$roomId",
  });

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { data: roomDetails, isLoading: isRoomLoading } = useGetRoomById({
    id: roomId,
  });
  const [gameRoom, setGameRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (roomDetails) {
      console.log("Room details:", roomDetails);
      // Handle room details here
      // For example, you can update the player state based on room details
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
      console.log("Loading room details...");
    }
  }, [roomDetails, isRoomLoading]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to Battle socket");

        // Subscribe to lobby updates
        client.subscribe("/topic/battle/isReady/" + roomId, (message) => {
          const data = JSON.parse(message.body);
          // Process the received battle data and update player states
          if (data && Array.isArray(data) && data.length === 2) {
            // Check if the data contains two players
            // Find the correct player data based on user ID
            let updatedPlayer1, updatedPlayer2;
            if (data[0].userId === player1.userId) {
              updatedPlayer1 = data[0];
              updatedPlayer2 = data[1];
            } else if (data[1].userId === player1.userId) {
              updatedPlayer1 = data[1];
              updatedPlayer2 = data[0];
            } else {
              toast.error("Could not match player data with current players");
              return;
            }

            if (updatedPlayer1.userId !== player1.userId) {
              toast.error("Player 1 ID mismatch");
              return;
            }
            if (updatedPlayer2.userId !== player2.userId) {
              toast.error("Player 2 ID mismatch");
              return;
            }
            setPlayer1((prevPlayer) => ({
              ...prevPlayer,
              ...updatedPlayer1,
            }));

            setPlayer2((prevPlayer) => ({
              ...prevPlayer,
              ...updatedPlayer2,
            }));
          }
          console.log("Received battle update:", data);
        });

        // Subscribe to battle result updates
        client.subscribe("/topic/battle/result/" + roomId, (message) => {
          const data = JSON.parse(message.body);
          // Process the received battle result and update the winner state
          if (data && data.winner) {
            setBattleResult(data);
            // setWinner(data.winner);
          }
          console.log("Received battle result:", data);
        });
      },
    });

    client.activate();
    setStompClient(client);
  }, []);

  //TODO use LobbyData
  const [player1, setPlayer1] = useState<RoomUser>({
    userId: 1,
    username: "Player 1",
    activeCharacters: GetCharacters,
    defeatedCharacters: [],
    battleReady: false,
    selectedCharacter: null,
  });
  const [player2, setPlayer2] = useState<RoomUser>({
    userId: 2,
    username: "Player 2",
    activeCharacters: GetCharacters,
    defeatedCharacters: [],
    battleReady: false,
    selectedCharacter: null,
  });

  //using Battle result hook to simulate the battle from open ai
  // const {
  //   mutate: battleSimulate,
  //   data: battleResult,
  //   error,
  //   isPending,
  // } = useBattleResult();

  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  // State to track the winner
  const [winner, setWinner] = useState<string | null>(null);

  // Refs to store the carousel API for each player
  const p1CarouselRef = useRef<CarouselApi | null>(null);
  const p2CarouselRef = useRef<CarouselApi | null>(null);

  // Function to handle when Player 1 is ready
  // This function is called when Player 2 clicks the "Ready" button
  const handlePlayer1Ready = () => {
    setPlayer1((prev) => ({ ...prev, battleReady: true }));
  };

  // Function to handle when Player 2 is ready
  // This function is called when Player 2 clicks the "Ready" button
  const handlePlayer2Ready = () => {
    setPlayer2((prev) => ({ ...prev, battleReady: true }));
  };

  // Effect to simulate the battle when both players are ready
  useEffect(() => {
    if (player1.battleReady && player2.battleReady) {
      // handleSimulate();
    } else if (player1.battleReady && !player2.battleReady) {
      toast("Waiting for Player 2 to be ready");
    } else if (!player1.battleReady && player2.battleReady) {
      toast("Waiting for Player 1 to be ready");
    }
    // If both players are not ready, do nothing
  }, [player1.battleReady, player2.battleReady]);

  // Function to handle the battle simulation
  // const handleSimulate = () => {
  //   // Check if both players have selected a character
  //   // and are ready to battle
  //   if (
  //     !player1.selected ||
  //     !player2.selected ||
  //     !player1.isReady ||
  //     !player2.isReady
  //   ) {
  //     toast("Waiting for both players to select a character");
  //     return;
  //   }

  //   // Call the battle simulation API
  //   // and pass the selected characters
  //   // to determine the winner
  //   battleSimulate(
  //     {
  //       fighter1: player1.selected.name,
  //       fighter2: player2.selected.name,
  //     },
  //     {
  //       onSuccess: (result: BattleResult) => {
  //         // add defeated character to the defeated array
  //         //clear selected character
  //         // and reset the isReady state for both players
  //         if (result.winner === "Player 1") {
  //           setPlayer2({
  //             ...player2,
  //             defeated: [...player2.defeated, player2.selected!],
  //             selected: null,
  //             isReady: false,
  //           });
  //           setPlayer1({
  //             ...player1,
  //             selected: null,
  //             isReady: false,
  //           });
  //         } else {
  //           setPlayer1({
  //             ...player1,
  //             defeated: [...player1.defeated, player1.selected!],
  //             selected: null,
  //             isReady: false,
  //           });
  //           setPlayer2({
  //             ...player2,
  //             selected: null,
  //             isReady: false,
  //           });
  //         }
  //       },
  //     }
  //   );
  // };

  // Effect to reset the battle when the component mounts
  // This is to ensure that the players start with the first character selected
  useEffect(() => {
    handlePlayer1Select(0);
    handlePlayer2Select(0);
  }, []);

  // Effect to check if either player has been defeated
  // and set the winner accordingly
  useEffect(() => {
    if (player1.defeatedCharacters.length === player1.activeCharacters.length) {
      setWinner("Player 2");
    } else if (
      player2.defeatedCharacters.length === player2.activeCharacters.length
    ) {
      setWinner("Player 1");
    }
  }, [player1.defeatedCharacters, player2.defeatedCharacters]);

  // Factory function to create a character select handler
  // for each player
  const createCharacterSelectHandler = (
    setPlayer: React.Dispatch<React.SetStateAction<RoomUser>>,
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
      activeCharacters: GetCharacters,
      defeatedCharacters: [],
      battleReady: false,
      selectedCharacter: null,
    });
    setPlayer2({
      userId: 2,
      username: "Player 2",
      activeCharacters: GetCharacters,
      defeatedCharacters: [],
      battleReady: false,
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

    toast.success("");
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
        {false && <p>Simulating...</p>}
        {/* {error instanceof Error && (
          <p className="text-red-600">{error.message}</p>
        )} */}
        {battleResult && (
          <div className="bg-gray-100 p-4 rounded shadow">
            <p>
              <strong>Winner:</strong> {battleResult.winner == player1.username ? player1.selectedCharacter?.name : player2.selectedCharacter?.name }
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
