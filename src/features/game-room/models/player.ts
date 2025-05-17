import type { GameCharacter } from "./game-character";

export interface Player {
  userId: number;
  username: string;
  activeCharacters: GameCharacter[];
  defeatedCharacters: GameCharacter[];
  battleReady: boolean;
  readyForBattle: boolean;
  selectedCharacter: GameCharacter | null;
}
