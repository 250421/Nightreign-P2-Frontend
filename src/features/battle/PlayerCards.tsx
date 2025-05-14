import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Player } from "@/models/player";
import type { RefObject } from "react";

type PlayerCardProps = {
  player: Player;
  playerNumber: number;
  onSelect: (index: number, playerNumber: number) => void;
  carouselRef: RefObject<CarouselApi | null>;
};

export function PlayerCard({
  player,
  playerNumber,
  onSelect,
  carouselRef,
}: PlayerCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold">{player.username}</h2>
        <Carousel
          className="w-full max-w-xs"
          setApi={(api) => (carouselRef.current = api)}
        >
          <CarouselContent>
            {player.team.map((character) => (
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
          {player.team.map((character, idx) => (
            <Button
              variant="outline"
              className={`w-24 transition-all ${
                player.selected?.character_id === character.character_id
                  ? "border-blue-500 shadow-md shadow-blue-400"
                  : ""
              }`}
              disabled={player.defeated.some(
                (c) => c.character_id === character.character_id
              )}
              key={character.character_id}
              onClick={() => onSelect(idx, playerNumber)}
            >
              {character.name}
            </Button>
          ))}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Selected Character: <strong>{player.selected?.name || "None"}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Defeated Characters:{" "}
            <strong>
              {player.defeated.map((c) => c.name).join(", ") || "None"}
            </strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
