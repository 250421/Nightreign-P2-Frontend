import type { GameCharacter } from "./game-character";

export interface Player {
  userId: number;
  username: string;
  activeCharacter: GameCharacter[];
  defeatedCharacters: GameCharacter[];
}
