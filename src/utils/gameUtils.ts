import { CellContent, Position, Direction, GameState, Perception, Action } from '../types';

// Constants for scoring
const MOVE_COST = -1;
const SHOOT_COST = -10;
const DEATH_COST = -1000;
const GOLD_REWARD = 1000;
const WIN_REWARD = 500;

// Create a new game board
export const createBoard = (size: number, difficulty: number = 0.2): CellContent[][] => {
  const board: CellContent[][] = Array(size).fill(null).map(() => 
    Array(size).fill('empty')
  );
  
  // Place pits based on difficulty (higher = more pits)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Skip the starting position (0,0) and adjacent cells
      if ((x === 0 && y === 0) || 
          (x === 1 && y === 0) || 
          (x === 0 && y === 1)) {
        continue;
      }
      
      if (Math.random() < difficulty) {
        board[y][x] = 'pit';
      }
    }
  }
  
  // Place the Wumpus (not in starting position)
  let wumpusPlaced = false;
  while (!wumpusPlaced) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if ((x !== 0 || y !== 0) && board[y][x] === 'empty') {
      board[y][x] = 'wumpus';
      wumpusPlaced = true;
    }
  }
  
  // Place the gold (not in starting position or with Wumpus)
  let goldPlaced = false;
  while (!goldPlaced) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if ((x !== 0 || y !== 0) && board[y][x] === 'empty') {
      board[y][x] = 'gold';
      goldPlaced = true;
    }
  }
  
  return board;
};

// Get the initial game state
export const getInitialGameState = (size: number, difficulty: number = 0.2): GameState => {
  const board = createBoard(size, difficulty);
  
  return {
    board,
    playerPosition: { x: 0, y: 0 },
    playerDirection: 'right',
    wumpusAlive: true,
    hasGold: false,
    gameOver: false,
    score: 0,
    perception: getPerception(board, { x: 0, y: 0 }),
    visited: Array(size).fill(null).map(() => Array(size).fill(false)),
    message: "You entered the Wumpus World. Be careful!",
    history: ["Game started. You are at position (0,0)"]
  };
};

// Get the player's perception at a position
export const getPerception = (board: CellContent[][], position: Position): Perception => {
  const size = board.length;
  const { x, y } = position;
  
  // Initialize perception
  const perception: Perception = {
    stench: false,
    breeze: false,
    glitter: false,
    bump: false,
    scream: false
  };
  
  // Check for glitter in current cell
  if (board[y][x] === 'gold') {
    perception.glitter = true;
  }
  
  // Check adjacent cells for stench and breeze
  const adjacentCells = [
    { x: x-1, y },
    { x: x+1, y },
    { x, y: y-1 },
    { x, y: y+1 }
  ];
  
  for (const cell of adjacentCells) {
    if (cell.x >= 0 && cell.x < size && cell.y >= 0 && cell.y < size) {
      if (board[cell.y][cell.x] === 'wumpus') {
        perception.stench = true;
      }
      if (board[cell.y][cell.x] === 'pit') {
        perception.breeze = true;
      }
    }
  }
  
  return perception;
};

// Get the next position based on current position and direction
export const getNextPosition = (position: Position, direction: Direction): Position => {
  const { x, y } = position;
  
  switch (direction) {
    case 'up':
      return { x, y: y - 1 };
    case 'right':
      return { x: x + 1, y };
    case 'down':
      return { x, y: y + 1 };
    case 'left':
      return { x: x - 1, y };
    default:
      return position;
  }
};

// Check if a position is valid on the board
export const isValidPosition = (position: Position, size: number): boolean => {
  const { x, y } = position;
  return x >= 0 && x < size && y >= 0 && y < size;
};

// Turn the player left or right
export const turn = (currentDirection: Direction, turnDirection: 'left' | 'right'): Direction => {
  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  const currentIndex = directions.indexOf(currentDirection);
  
  if (turnDirection === 'left') {
    return directions[(currentIndex + 3) % 4];
  } else {
    return directions[(currentIndex + 1) % 4];
  }
};

// Execute an action and return the new game state
export const executeAction = (state: GameState, action: Action): GameState => {
  const { board, playerPosition, playerDirection, score, visited } = state;
  const size = board.length;
  let newState = { ...state };
  
  // Track visited cells
  const newVisited = visited.map(row => [...row]);
  newVisited[playerPosition.y][playerPosition.x] = true;
  
  // Process different actions
  switch (action) {
    case 'moveForward': {
      const nextPosition = getNextPosition(playerPosition, playerDirection);
      
      if (!isValidPosition(nextPosition, size)) {
        // Bump into wall
        newState = {
          ...newState, 
          perception: { ...newState.perception, bump: true },
          message: "Bump! You hit a wall.",
          history: [...newState.history, "Bump! You hit a wall."]
        };
      } else {
        // Move to new position
        const content = board[nextPosition.y][nextPosition.x];
        newState.playerPosition = nextPosition;
        newState.perception = getPerception(board, nextPosition);
        newState.perception.bump = false;
        newState.score += MOVE_COST;
        newVisited[nextPosition.y][nextPosition.x] = true;
        
        // Check for death or other outcomes
        if (content === 'wumpus' && newState.wumpusAlive) {
          newState.gameOver = true;
          newState.score += DEATH_COST;
          newState.message = "You were eaten by the Wumpus! Game over.";
          newState.history = [...newState.history, "You were eaten by the Wumpus! Game over."];
        } else if (content === 'pit') {
          newState.gameOver = true;
          newState.score += DEATH_COST;
          newState.message = "You fell into a pit! Game over.";
          newState.history = [...newState.history, "You fell into a pit! Game over."];
        } else {
          newState.message = `Moved to position (${nextPosition.x},${nextPosition.y}).`;
          newState.history = [...newState.history, `Moved to position (${nextPosition.x},${nextPosition.y}).`];
        }
      }
      break;
    }
    
    case 'turnLeft': {
      const newDirection = turn(playerDirection, 'left');
      newState = {
        ...newState, 
        playerDirection: newDirection,
        message: `Turned left. Now facing ${newDirection}.`,
        history: [...newState.history, `Turned left. Now facing ${newDirection}.`]
      };
      break;
    }
    
    case 'turnRight': {
      const newDirection = turn(playerDirection, 'right');
      newState = {
        ...newState, 
        playerDirection: newDirection,
        message: `Turned right. Now facing ${newDirection}.`,
        history: [...newState.history, `Turned right. Now facing ${newDirection}.`]
      };
      break;
    }
    
    case 'grab': {
      const { x, y } = playerPosition;
      if (board[y][x] === 'gold') {
        // Create a new board with gold removed
        const newBoard = board.map(row => [...row]);
        newBoard[y][x] = 'empty';
        
        newState = {
          ...newState,
          board: newBoard,
          hasGold: true,
          score: score + GOLD_REWARD,
          message: "You grabbed the gold!",
          history: [...newState.history, "You grabbed the gold!"]
        };
      } else {
        newState = {
          ...newState,
          message: "There's no gold here to grab.",
          history: [...newState.history, "There's no gold here to grab."]
        };
      }
      break;
    }
    
    case 'shoot': {
      if (!newState.wumpusAlive) {
        newState = {
          ...newState,
          message: "You've already killed the Wumpus.",
          history: [...newState.history, "You've already killed the Wumpus."]
        };
        break;
      }
      
      newState.score += SHOOT_COST;
      
      // Check if arrow hits Wumpus
      const { x, y } = playerPosition;
      const size = board.length;
      let hitWumpus = false;
      
      // Arrow travels in the direction the player is facing
      if (playerDirection === 'right') {
        for (let i = x + 1; i < size; i++) {
          if (board[y][i] === 'wumpus') {
            hitWumpus = true;
            break;
          }
        }
      } else if (playerDirection === 'left') {
        for (let i = x - 1; i >= 0; i--) {
          if (board[y][i] === 'wumpus') {
            hitWumpus = true;
            break;
          }
        }
      } else if (playerDirection === 'up') {
        for (let i = y - 1; i >= 0; i--) {
          if (board[i][x] === 'wumpus') {
            hitWumpus = true;
            break;
          }
        }
      } else if (playerDirection === 'down') {
        for (let i = y + 1; i < size; i++) {
          if (board[i][x] === 'wumpus') {
            hitWumpus = true;
            break;
          }
        }
      }
      
      if (hitWumpus) {
        // Create a new board with wumpus removed
        const newBoard = board.map(row => [...row]);
        
        // Find and remove wumpus
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (newBoard[y][x] === 'wumpus') {
              newBoard[y][x] = 'empty';
              break;
            }
          }
        }
        
        newState = {
          ...newState,
          board: newBoard,
          wumpusAlive: false,
          perception: { ...newState.perception, scream: true, stench: false },
          message: "You hear a scream! You killed the Wumpus!",
          history: [...newState.history, "You hear a scream! You killed the Wumpus!"]
        };
      } else {
        newState = {
          ...newState,
          message: "Your arrow missed the Wumpus.",
          history: [...newState.history, "Your arrow missed the Wumpus."]
        };
      }
      break;
    }
    
    case 'climb': {
      if (playerPosition.x === 0 && playerPosition.y === 0) {
        if (newState.hasGold) {
          newState = {
            ...newState,
            gameOver: true,
            score: newState.score + WIN_REWARD,
            message: "Congratulations! You escaped with the gold and won!",
            history: [...newState.history, "Congratulations! You escaped with the gold and won!"]
          };
        } else {
          newState = {
            ...newState,
            gameOver: true,
            message: "You climbed out without the gold. Better luck next time!",
            history: [...newState.history, "You climbed out without the gold. Better luck next time!"]
          };
        }
      } else {
        newState = {
          ...newState,
          message: "You can only climb out from the starting position (0,0).",
          history: [...newState.history, "You can only climb out from the starting position (0,0)."]
        };
      }
      break;
    }
  }
  
  newState.visited = newVisited;
  return newState;
};