import type { Player } from "../../models/player";

export interface RoomResponse {
  creator: Player;
  id: string;
  name: string;
  players: Player[];
}
