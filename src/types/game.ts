export type GameState = 'idle' | 'waiting' | 'ready' | 'finished';

export interface ReactionTime {
  id: string;
  time: number;
  timestamp: Date;
}

export interface Controller {
  controller_did: string;
  totalAttempts: number;
  averageTime: number;
  bestTime: number;
  minTimeFromAllTimes: number;
  allTimes: number[];
  submissions: number;
}

export interface FastestController {
  controller_did: string;
  fastestReactionTime: number;
}

export interface LeaderboardData {
  aggregated: {
    totalRecords: number;
    allControllers: Controller[];
    fastestController: FastestController;
  };
}