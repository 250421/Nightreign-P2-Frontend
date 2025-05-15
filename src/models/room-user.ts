import type { Character } from "./character";

export interface RoomUser {
    userId: number;
    username: string;
    activeCharacters: Character[];
    defeatedCharacters: Character[];
    battleReady: boolean;
    selectedCharacter: Character | null;
  }
  