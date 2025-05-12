import type { Character } from "./character";

export type Player = {
    id: number,
    username: string,
    team: Character[];
    selected: Character | null;
    defeated: Character[];
}