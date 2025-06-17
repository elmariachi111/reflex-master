export type GameState = 'idle' | 'waiting' | 'ready' | 'finished';

export interface ReactionTime {
  id: string;
  time: number;
  timestamp: Date;
}

export interface Controller {
  controllerDID: string;
  totalAttempts: number;
  averageTime: number;
  bestTime: number;
  minTimeFromAllTimes: number;
  allTimes: number[];
  submissions: number;
}

export interface FastestController {
  controllerDID: string;
  fastestReactionTime: number;
}

export interface LeaderboardData {
  aggregated: {
    totalRecords: number;
    allControllers: Controller[];
    fastestController: FastestController;
  };
}