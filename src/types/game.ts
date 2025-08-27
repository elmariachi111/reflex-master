export type GameState = 'idle' | 'waiting' | 'ready' | 'finished';

export interface ReactionTime {
  id: string;
  time: number;
  timestamp: string;
}

export interface Controller {
  _id: string;
  total_attempts: number;
  average_reaction_time: number;
  best_time: number;
  weighted_score: number;
  consistency_bonus: number;
  final_score: number;
}

export interface LeaderboardData {
  message: "success" | "error";
  error?: string;
  result: Controller[]
}