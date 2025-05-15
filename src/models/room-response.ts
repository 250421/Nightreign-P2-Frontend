import type { Character } from "./character";
import type { RoomUser } from "./room-user";

export interface RoomResponse {
    creator: {
      userId: number;
      username: string;
      activeCharacter: Character[];
      defeatedCharacters: Character[];
    };
    id: string;
    name: string;
    players: RoomUser[];
  }
  