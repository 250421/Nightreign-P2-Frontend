import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
// import type { Player } from "@/models/player";
import type { RefObject } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../auth/hooks/use-auth";
import type { Player } from "../../game-room/models/player";

type PlayerCardProps = {
  player: Player;
  onSelect: (index: number) => void;
  carouselRef: RefObject<CarouselApi | null>;
  onReady: () => void;
  isSimulating: boolean;
  disabled: boolean;
};

export function PlayerCard({
  player,
  onSelect,
  carouselRef,
  onReady: onSimulate,
  isSimulating,
  disabled,
}: PlayerCardProps) {
  const { data: user } = useAuth();
  return (
    <Card>
      <CardContent className="p-4 space-y-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold">{player.username}</h2>
        <Carousel
          className="w-full max-w-xs"
          setApi={(api) => (carouselRef.current = api)}
        >
          <CarouselContent>
            {player.activeCharacters?.map((character) => (
              <CarouselItem key={character.character_id}>
                <div className="p-1">
                  <img
                    src={character.characterImageUrl}
                    alt={character.name}
                    className="rounded-lg w-full h-48 object-contain"
                  />
                </div>
              </CarouselItem>
            )) || []}
          </CarouselContent>
        </Carousel>
        <div className="flex flex-wrap gap-2">
          {player.activeCharacters?.map((character, idx) => (
            <Button
              variant="outline"
              className={`w-24 transition-all ${
                player.selectedCharacter?.character_id ===
                character.character_id
                  ? "border-blue-500 shadow-md shadow-blue-400"
                  : ""
              }`}
              disabled={
                player.defeatedCharacters?.some(
                  (c) => c.character_id === character.character_id
                ) || player.username !== user?.username
              }
              key={character.character_id}
              onClick={() => onSelect(idx)}
            >
              {character.name}
            </Button>
          ))}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Selected Character:{" "}
            <strong>{player.selectedCharacter?.name || "None"}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Defeated Characters:{" "}
            <strong>
              {player.defeatedCharacters?.map((c) => c.name).join(", ") ||
                "None"}
            </strong>
          </p>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            onClick={onSimulate}
            disabled={disabled || player.selectedCharacter === null || player.username !== user?.username}
            className={`${player.battleReady ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            {isSimulating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : player.battleReady ? (
              "Ready!"
            ) : (
              "Begin Battle!"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
