import type { Player } from "./player";

export interface Room {
  id: string;
  name: string;
  players: Player[];
  creator: Player;
  status: "Waiting" | "Playing";
}
