import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Player } from "@/models/player";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import { GetCharacters } from "@/mocks/getCharacters";
import { useBattleResult } from "@/hooks/use-battle-result";
import type { BattleResult } from "@/models/battle-result";
import { Loader2 } from "lucide-react";
import { PlayerCard } from "@/features/battle/PlayerCards";
export const Route = createFileRoute("/(auth)/_auth/battle")({
  component: BattleScreen,
});

function BattleScreen() {
  //TODO use LobbyData
  const [player1, setPlayer1] = useState<Player>({
    id: 1,
    username: "Player 1",
    team: GetCharacters,
    selected: null,
    defeated: [],
  });
  const [player2, setPlayer2] = useState<Player>({
    id: 2,
    username: "Player 2",
    team: GetCharacters,
    selected: null,
    defeated: [],
  });
  const { mutate, data: battleResult, error, isPending } = useBattleResult();
  const [winner, setWinner] = useState<string | null>(null);

  const p1CarouselRef = useRef<CarouselApi | null>(null);
  const p2CarouselRef = useRef<CarouselApi | null>(null);

  const handleSimulate = () => {
    if (!player1.selected || !player2.selected) {
      toast("Select characters for both players!");
      return;
    }
    mutate(
      {
        fighter1: player1.selected.name,
        fighter2: player2.selected.name,
      },
      {
        onSuccess: (result: BattleResult) => {
          if (result.winner === "Player 1") {
            setPlayer2({
              ...player2,
              defeated: [...player2.defeated, player2.selected!],
              selected: null,
            });
          } else {
            setPlayer1({
              ...player1,
              defeated: [...player1.defeated, player1.selected!],
              selected: null,
            });
          }
        },
      }
    );
  };

  useEffect(() => {
    handleCharacterSelect(0, 1);
    handleCharacterSelect(0, 2);
  }, []);

  const handleCharacterSelect = (index: number, player: number) => {
    if (player === 1) {
      const character = player1.team[index];
      setPlayer1((prev) => ({ ...prev, selected: character }));
      p1CarouselRef.current?.scrollTo(index);
    } else {
      const character = player2.team[index];
      setPlayer2((prev) => ({ ...prev, selected: character }));
      p2CarouselRef.current?.scrollTo(index);
    }
  };

  const resetBattle = () => {
    setPlayer1({
      id: 1,
      username: "Player 1",
      team: GetCharacters,
      selected: null,
      defeated: [],
    });
    setPlayer2({
      id: 2,
      username: "Player 2",
      team: GetCharacters,
      selected: null,
      defeated: [],
    });
    setWinner(null);
    handleCharacterSelect(0, 1);
    handleCharacterSelect(0, 2);
  };

  return (
    <div className="mx-auto space-y-6 p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-center">Battle Arena</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* <Card>
          <CardContent className="p-4 space-y-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold">Player 1</h2>
            <Carousel
              className="w-full max-w-xs"
              setApi={(api) => (p1CarouselRef.current = api)}
            >
              <CarouselContent>
                {player1.team.map((character) => (
                  <CarouselItem key={character.character_id}>
                    <div className="p-1">
                      <img
                        src={character.characterImageUrl}
                        alt={character.name}
                        className="rounded-lg w-full h-48 object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex flex-wrap gap-2">
              {player1.team.map((character, idx) => (
                <Button
                  variant="outline"
                  className={`w-24 transition-all ${
                    player1.selected?.character_id === character.character_id
                      ? "border-blue-500 shadow-md shadow-blue-400"
                      : ""
                  }`}
                  disabled={player1.defeated.some(
                    (c) => c.character_id === character.character_id
                  )}
                  key={character.character_id}
                  onClick={() => handleCharacterSelect(idx, 1)}
                >
                  {character.name}
                </Button>
              ))}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Selected Character:{" "}
                <strong>{player1.selected?.name || "None"}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Defeated Characters:{" "}
                <strong>
                  {player1.defeated.map((c) => c.name).join(", ") || "None"}
                </strong>
              </p>
            </div>
          </CardContent>
        </Card> */}
        <PlayerCard
          player={player1}
          playerNumber={1}
          onSelect={handleCharacterSelect}
          carouselRef={p1CarouselRef}
        />
        <Card>
          <CardContent className="p-4 space-y-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold">Player 2</h2>
            <Carousel
              className="w-full max-w-xs"
              setApi={(api) => (p2CarouselRef.current = api)}
            >
              <CarouselContent>
                {player2.team.map((character) => (
                  <CarouselItem key={character.character_id}>
                    <div className="p-1">
                      <img
                        src={character.characterImageUrl}
                        alt={character.name}
                        className="rounded-lg w-full h-48 object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex flex-wrap gap-2">
              {player2.team.map((character, idx) => (
                <Button
                  variant="outline"
                  className={`w-24 transition-all ${
                    player2.selected?.character_id === character.character_id
                      ? "border-blue-500 shadow-md shadow-blue-400"
                      : ""
                  }`}
                  disabled={player2.defeated.some(
                    (c) => c.character_id === character.character_id
                  )}
                  key={character.character_id}
                  onClick={() => handleCharacterSelect(idx, 2)}
                >
                  {character.name}
                </Button>
              ))}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Selected Character:{" "}
                <strong>{player2.selected?.name || "None"}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Defeated Characters:{" "}
                <strong>
                  {player2.defeated.map((c) => c.name).join(", ") || "None"}
                </strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={handleSimulate} disabled={!!winner || isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Begin Battle!"
          )}
        </Button>
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
        {isPending && <p>Simulating...</p>}
        {error instanceof Error && (
          <p className="text-red-600">❌ {error.message}</p>
        )}
        {battleResult && (
          <div className="bg-gray-100 p-4 rounded shadow">
            <p>
              <strong>Winner:</strong> {battleResult.winner}
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
