import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { toast } from "sonner";
import type { BattleResult } from "@/features/battle/dtos/responses/battle-result-response";
import { PlayerCard } from "@/features/battle/components/PlayerCards";
import { type IMessage } from "@stomp/stompjs";
import { useGetRoomById } from "@/features/game-room/hooks/use-get-room-by-id";
import type { Player } from "@/features/game-room/models/player";
import { useLeaveRoom } from "@/hooks/use-leave-room";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useStompSubscription } from "@/hooks/use-stomp-subscriptions";
import { useSendBattleReady } from "@/features/battle/hooks/use-battle-ready";

export const Route = createFileRoute("/(auth)/_auth/battle/$roomId")({
  component: BattleScreen,
});

function BattleScreen() {
  // Get the roomId from the URL parameters
  const { data: user } = useAuth();
  const { roomId } = useParams({
    from: "/(auth)/_auth/battle/$roomId",
  });
  const { leaveRoom } = useLeaveRoom();
  const { sendBattleReady } = useSendBattleReady();
  const { data: roomDetails, isLoading: isRoomLoading } = useGetRoomById({
    id: roomId,
  });
  const [player1, setPlayer1] = useState<Player>({
    userId: 1,
    username: "Player 1",
    activeCharacters: [],
    defeatedCharacters: [],
    battleReady: false,
    selectedCharacter: null,
    readyForBattle: true,
  });
  const [player2, setPlayer2] = useState<Player>({
    userId: 2,
    username: "Player 2",
    activeCharacters: [],
    defeatedCharacters: [],
    battleReady: false,
    selectedCharacter: null,
    readyForBattle: true,
  });
  // State to track the battle result
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  // State to track the winner
  const [winner, setWinner] = useState<string | null>(null);

  // Refs to store the carousel API for each player need useref for scrollto logic
  const p1CarouselRef = useRef<CarouselApi | null>(null);
  const p2CarouselRef = useRef<CarouselApi | null>(null);

  useEffect(() => {
    if (roomDetails) {
      console.log("Room details:", roomDetails);
      if (roomDetails.players[0].userId === user?.id) {
        setPlayer1({
          ...player1,
          ...roomDetails.players[0],
        });
        setPlayer2({
          ...player2,
          ...roomDetails.players[1],
        });
      } else if (roomDetails.players[1].userId === user?.id) {
        setPlayer1({
          ...player1,
          ...roomDetails.players[1],
        });
        setPlayer2({
          ...player2,
          ...roomDetails.players[0],
        });
      }
    }
    if (isRoomLoading) {
      console.log("Loading room details...");
    }
  }, [roomDetails, isRoomLoading]);

  useStompSubscription(
    `/topic/battle/isReady/${roomId}`,
    (message: IMessage) => {
      const data = JSON.parse(message.body);
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
        setPlayer1((prevPlayer) => ({
          ...prevPlayer,
          ...updatedPlayer1,
        }));
        setPlayer2((prevPlayer) => ({
          ...prevPlayer,
          ...updatedPlayer2,
        }));
        console.log("Received battle update:", data);
      }
    }
  );

  useStompSubscription(
    `/topic/battle/result/${roomId}`,
    (message: IMessage) => {
      const data = JSON.parse(message.body);
      // Process the received battle result and update the winner state
      if (data && data.winner) {
        setBattleResult(data);
      }
      console.log("Received battle result:", data);
    }
  );

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

  const handleBattleReadyP1 = () => {
    sendBattleReady({
      roomId: roomId,
      userId: player1.userId.toString(),
      username: player1?.username,
      battleReady: true,
      character_id: player1?.selectedCharacter?.character_id || null,
    });
  };

  const handleBattleReadyP2 = () => {
    sendBattleReady({
      roomId: roomId,
      userId: player2.userId.toString(),
      username: player2?.username,
      battleReady: true,
      character_id: player2?.selectedCharacter?.character_id || null,
    });
  };


  const handleLeaveRoom = () => {
    if (user?.id) {
      leaveRoom({ roomId, userId: user.id.toString() });
    }
  };

  return (
    <div className="mx-auto space-y-6 p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-center">Battle Arena</h1>
      <div className="grid grid-cols-2 gap-4">
        <PlayerCard
          player={player1}
          onSelect={handlePlayer1Select}
          carouselRef={p1CarouselRef}
          onReady={() => {
            if (player1?.userId) {
              handleBattleReadyP1();
            }
          }}
          isSimulating={false}
          disabled={!!winner || false}
        />
        <PlayerCard
          player={player2}
          onSelect={handlePlayer2Select}
          carouselRef={p2CarouselRef}
          onReady={() => {
            if (player2?.userId) {
              handleBattleReadyP2();
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
        <Button onClick={handleLeaveRoom}>Leave Room</Button>
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
