export interface IsReadyRequest {
    roomId: string;
    userId: string;
    username: string;
    battleReady: boolean;
    character_id: number | null;
  }
  