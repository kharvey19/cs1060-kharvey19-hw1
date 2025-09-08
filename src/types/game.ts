export type MoleType = 'normal' | 'golden' | 'bomb';
export type PowerUpType = 'doublePoints' | 'freezeTime' | 'slowMotion';

export interface Mole {
  id: number;
  type: MoleType;
  visible: boolean;
  timeLeft: number;
  hit: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  gameRunning: boolean;
  gameStarted: boolean;
  level: number;
  combo: number;
  powerUp: PowerUpType | null;
  powerUpTimeLeft: number;
  timeLeft: number;
}