import { GameState, Action, Position, Direction } from '../types';

// Simple representation of the agent's knowledge
type KnowledgeBase = {
  safeSquares: Set<string>;
  dangerousSquares: Set<string>;
  wumpusLocation: Position | null;
  pitLocations: Set<string>;
  unvisitedSafeSquares: Set<string>;
  frontierSquares: Set<string>;
};

// Convert position to string key for sets
const posToKey = (pos: Position): string => `${pos.x},${pos.y}`;
const keyToPos = (key: string): Position => {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
};

// Get adjacent positions
const getAdjacentPositions = (pos: Position, size: number): Position[] => {
  const { x, y } = pos;
  const adjacent: Position[] = [];
  
  if (x > 0) adjacent.push({ x: x - 1, y });
  if (x < size - 1) adjacent.push({ x: x + 1, y });
  if (y > 0) adjacent.push({ x, y: y - 1 });
  if (y < size - 1) adjacent.push({ x, y: y + 1 });
  
  return adjacent;
};

// Initialize knowledge base
export const initializeKnowledgeBase = (size: number): KnowledgeBase => {
  return {
    safeSquares: new Set([posToKey({ x: 0, y: 0 })]),
    dangerousSquares: new Set(),
    wumpusLocation: null,
    pitLocations: new Set(),
    unvisitedSafeSquares: new Set([posToKey({ x: 0, y: 0 })]),
    frontierSquares: new Set()
  };
};

// Update knowledge base based on current perceptions
export const updateKnowledgeBase = (kb: KnowledgeBase, state: GameState): KnowledgeBase => {
  const { board, playerPosition, perception, visited } = state;
  const size = board.length;
  const pos = playerPosition;
  const posKey = posToKey(pos);
  
  // Mark current position as safe and visited
  kb.safeSquares.add(posKey);
  kb.unvisitedSafeSquares.delete(posKey);
  
  // Update frontier squares (unvisited adjacent to safe squares)
  const adjacentPositions = getAdjacentPositions(pos, size);
  
  for (const adjPos of adjacentPositions) {
    const adjKey = posToKey(adjPos);
    
    // Skip if we already know this is dangerous
    if (kb.dangerousSquares.has(adjKey)) continue;
    
    // If no breeze and no stench, mark adjacent as safe
    if (!perception.breeze && !perception.stench) {
      kb.safeSquares.add(adjKey);
      
      // If not visited, add to unvisited safe squares
      if (!visited[adjPos.y][adjPos.x]) {
        kb.unvisitedSafeSquares.add(adjKey);
      }
    }
    // If there's a breeze or stench, mark as frontier unless already safe
    else if (!kb.safeSquares.has(adjKey)) {
      kb.frontierSquares.add(adjKey);
      
      // If there's a breeze, potential pit
      if (perception.breeze) {
        // Mark potential pit location for future reasoning
      }
      
      // If there's a stench, potential wumpus
      if (perception.stench && state.wumpusAlive) {
        // Mark potential wumpus location for future reasoning
      }
    }
  }
  
  // Clear frontier squares that are now marked as safe
  for (const key of kb.frontierSquares) {
    if (kb.safeSquares.has(key)) {
      kb.frontierSquares.delete(key);
    }
  }
  
  // If wumpus killed, update knowledge
  if (!state.wumpusAlive && kb.wumpusLocation) {
    const wumpusKey = posToKey(kb.wumpusLocation);
    kb.dangerousSquares.delete(wumpusKey);
    kb.safeSquares.add(wumpusKey);
    kb.wumpusLocation = null;
    
    // Reevaluate frontier squares
    for (const key of kb.frontierSquares) {
      // If only marked as dangerous because of wumpus, may now be safe
      // This is a simplified version; a full implementation would track why a square is dangerous
    }
  }
  
  return kb;
};

// Determine the next action based on knowledge
export const decideNextAction = (kb: KnowledgeBase, state: GameState): Action => {
  const { playerPosition, playerDirection, hasGold, board } = state;
  const size = board.length;
  
  // If at starting position with gold, climb out
  if (hasGold && playerPosition.x === 0 && playerPosition.y === 0) {
    return 'climb';
  }
  
  // If standing on gold, grab it
  if (state.perception.glitter) {
    return 'grab';
  }
  
  // If have gold, head back to start
  if (hasGold) {
    // Simple path to start (0,0) - not optimal but functional
    if (playerPosition.x > 0) {
      // Need to go left
      if (playerDirection === 'left') {
        return 'moveForward';
      } else if (playerDirection === 'up') {
        return 'turnLeft';
      } else if (playerDirection === 'down') {
        return 'turnRight';
      } else { // facing right
        return 'turnLeft'; // Turn around (will take two turns)
      }
    } else if (playerPosition.y > 0) {
      // Need to go up
      if (playerDirection === 'up') {
        return 'moveForward';
      } else if (playerDirection === 'right') {
        return 'turnLeft';
      } else if (playerDirection === 'left') {
        return 'turnRight';
      } else { // facing down
        return 'turnLeft'; // Turn around (will take two turns)
      }
    }
  }
  
  // If there are unvisited safe squares, move to one of them
  if (kb.unvisitedSafeSquares.size > 0) {
    // Get the first unvisited safe square
    const targetKey = Array.from(kb.unvisitedSafeSquares)[0];
    const targetPos = keyToPos(targetKey);
    
    // Simple (not optimal) navigation to target
    if (targetPos.x > playerPosition.x) {
      // Need to go right
      if (playerDirection === 'right') {
        return 'moveForward';
      } else if (playerDirection === 'up') {
        return 'turnRight';
      } else if (playerDirection === 'down') {
        return 'turnLeft';
      } else { // facing left
        return 'turnRight'; // Turn around (will take two turns)
      }
    } else if (targetPos.x < playerPosition.x) {
      // Need to go left
      if (playerDirection === 'left') {
        return 'moveForward';
      } else if (playerDirection === 'up') {
        return 'turnLeft';
      } else if (playerDirection === 'down') {
        return 'turnRight';
      } else { // facing right
        return 'turnLeft'; // Turn around (will take two turns)
      }
    } else if (targetPos.y > playerPosition.y) {
      // Need to go down
      if (playerDirection === 'down') {
        return 'moveForward';
      } else if (playerDirection === 'right') {
        return 'turnRight';
      } else if (playerDirection === 'left') {
        return 'turnLeft';
      } else { // facing up
        return 'turnRight'; // Turn around (will take two turns)
      }
    } else if (targetPos.y < playerPosition.y) {
      // Need to go up
      if (playerDirection === 'up') {
        return 'moveForward';
      } else if (playerDirection === 'right') {
        return 'turnLeft';
      } else if (playerDirection === 'left') {
        return 'turnRight';
      } else { // facing down
        return 'turnLeft'; // Turn around (will take two turns)
      }
    }
  }
  
  // No safe unvisited squares, take a risk if needed
  // This is a simplified strategy - a full agent would do more reasoning
  if (kb.frontierSquares.size > 0) {
    // In a full implementation, we'd try to determine which frontier square is safest
    // For now, just make a random guess (not truly intelligent)
    return Math.random() > 0.5 ? 'turnLeft' : 'turnRight';
  }
  
  // If no good options, try to shoot if we suspect wumpus is nearby
  if (state.perception.stench && state.wumpusAlive) {
    return 'shoot';
  }
  
  // Default: explore randomly
  const randomAction = Math.random();
  if (randomAction < 0.6) {
    return 'moveForward';
  } else if (randomAction < 0.8) {
    return 'turnLeft';
  } else {
    return 'turnRight';
  }
};

// Get an agent's explanation of its reasoning
export const getAgentReasoning = (kb: KnowledgeBase, state: GameState): string => {
  const { playerPosition, perception, hasGold } = state;
  
  // Basic reasoning explanation
  let reasoning = "Agent's reasoning:\n";
  
  // Current situation assessment
  reasoning += `I am at position (${playerPosition.x},${playerPosition.y}).\n`;
  
  // Perceptions
  reasoning += "I perceive: ";
  const perceptions = [];
  if (perception.stench) perceptions.push("stench");
  if (perception.breeze) perceptions.push("breeze");
  if (perception.glitter) perceptions.push("glitter");
  if (perception.bump) perceptions.push("bump");
  if (perception.scream) perceptions.push("scream");
  reasoning += perceptions.length ? perceptions.join(", ") : "nothing unusual";
  reasoning += ".\n";
  
  // Knowledge base stats
  reasoning += `I know ${kb.safeSquares.size} safe squares and ${kb.unvisitedSafeSquares.size} are unvisited.\n`;
  reasoning += `There are ${kb.frontierSquares.size} frontier squares I'm uncertain about.\n`;
  
  // Goals
  if (hasGold) {
    reasoning += "I have the gold! My goal is to return to the exit at (0,0).\n";
  } else if (perception.glitter) {
    reasoning += "I see the gold! I should grab it.\n";
  } else {
    reasoning += "I'm searching for the gold while avoiding dangers.\n";
  }
  
  return reasoning;
};