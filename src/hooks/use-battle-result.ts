import { axiosInstance } from '@/lib/axios-config';
import type { BattleResult } from '@/models/battle-result';
import { useMutation } from '@tanstack/react-query';

interface BattleParams {
  fighter1: string;
  fighter2: string;
}

async function fetchBattleResult({ fighter1, fighter2 }: BattleParams): Promise<BattleResult> {
  const response = await axiosInstance.get<BattleResult>('/battle', {
    params: { fighter1, fighter2 },
  });
  
  return response.data;
}

export function useBattleResult() {
  return useMutation({
    mutationFn: fetchBattleResult,
  });
}