
export type TeamSide = 'left' | 'right';

export interface TeamState {
  name: string;
  color: string;
  score: number;
  fouls: boolean[];
  timeoutUsed: boolean; // Um único pedido de tempo por período
  logo?: string; // Base64 image string
}

export interface ScoreboardState {
  leftTeam: TeamState;
  rightTeam: TeamState;
  time: number; // in seconds
  isRunning: boolean;
  period: number;
}
