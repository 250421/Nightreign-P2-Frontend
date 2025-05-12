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
export const Route = createFileRoute("/(auth)/_auth/battle")({
  component: BattleScreen,
});

function BattleScreen() {
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

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  const p1CarouselRef = useRef<CarouselApi | null>(null);
  const p2CarouselRef = useRef<CarouselApi | null>(null);

  const simulateBattle = () => {
    if (!player1.selected || !player2.selected) {
      toast("Select characters for both players!");
      return;
    }

    const result = Math.random() < 0.5 ? "player1" : "player2"; // Replace with AI call

    setBattleLog([
      ...battleLog,
      `${result === "player1" ? player1.selected?.name : player2.selected?.name} wins!`,
    ]);

    if (result === "player1") {
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

    checkVictory(result);
  };

  const checkVictory = (result: string) => {
    if (result === "player1" && player2.defeated.length >= 2) {
      setWinner("Player 1");
    } else if (result === "player2" && player1.defeated.length >= 2) {
      setWinner("Player 2");
    }
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
    setBattleLog([]);
    setWinner(null);
    handleCharacterSelect(0, 1);
    handleCharacterSelect(0, 2);
  };

  return (
    <div className="mx-auto space-y-6 p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-center">Battle Arena</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
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
                        src={character.image}
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
        </Card>
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
                        src={character.image}
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
        <Button onClick={simulateBattle} disabled={!!winner}>
          Begin Battle!
        </Button>
        {winner && (
          <div className="text-xl font-bold text-green-600">
            🏆 {winner} Wins the Match!
          </div>
        )}
        <Button variant="secondary" onClick={resetBattle}>
          Reset Match
        </Button>
      </div>

      <Separator />
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Battle Log</h2>
        <ul className="list-disc pl-5">
          {battleLog.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
