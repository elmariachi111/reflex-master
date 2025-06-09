export type GameState = 'idle' | 'waiting' | 'ready' | 'finished';

export interface ReactionTime {
  id: string;
  time: number;
  timestamp: Date;
}