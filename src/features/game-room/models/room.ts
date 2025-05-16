import type { Player } from "./player";

export interface Room {
  id: string;
  name: string;
  players: Player[];
  creator: Player;
  status: string;
}

export function formatRoomStatus(status: string): string {
  switch (status) {
    case "WAITING_FOR_PLAYERS":
      return "Waiting for players";
    case "CHOOSING_CHARACTERS":
      return "Choosing characters";
    case "IN_BATTLE":
      return "In battle";
    default:
      return status;
  }
}
