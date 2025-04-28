export type CellContent = 'empty' | 'wumpus' | 'pit' | 'gold' | 'player';

export type Position = {
  x: number;
  y: number;
};

export type Perception = {
  stench: boolean;
  breeze: boolean;
  glitter: boolean;
  bump: boolean;
  scream: boolean;
};

export type Direction = 'up' | 'right' | 'down' | 'left';

export type GameState = {
  board: CellContent[][];
  playerPosition: Position;
  playerDirection: Direction;
  wumpusAlive: boolean;
  hasGold: boolean;
  gameOver: boolean;
  score: number;
  perception: Perception;
  visited: boolean[][];
  message: string;
  history: string[];
};

export type Action = 'moveForward' | 'turnLeft' | 'turnRight' | 'grab' | 'shoot' | 'climb';