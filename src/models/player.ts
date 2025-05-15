import type { Character } from "./character";

 type Player = {
    id: number,
    username: string,
    team: Character[];
    selected: Character | null;
    defeated: Character[];
    isReady: boolean;
}