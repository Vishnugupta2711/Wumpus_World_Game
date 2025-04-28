import React from 'react';
import { CellContent, Position, Direction, GameState } from '../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Wind, Skull, Bold as Gold, User } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  showHidden: boolean;
  size: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, showHidden, size }) => {
  const { board, playerPosition, playerDirection, visited } = gameState;
  
  // Calculate cell size based on viewport
  const cellSize = Math.min(Math.floor(70 / size), 12);
  
  const getCellStyle = (x: number, y: number) => {
    const isPlayerHere = playerPosition.x === x && playerPosition.y === y;
    const hasVisited = visited[y][x];
    
    return {
      width: `${cellSize}vh`,
      height: `${cellSize}vh`,
      border: '1px solid #4b5563',
      position: 'relative' as const,
      backgroundColor: isPlayerHere 
        ? '#10b981' // Player position (teal)
        : hasVisited 
        ? '#1f2937' // Visited (dark gray)
        : showHidden 
        ? '#374151' // Fog of war lifted but not visited (medium gray)
        : '#111827', // Not visible (dark)
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${cellSize / 2}vh`,
      transition: 'all 0.3s ease',
    };
  };
  
  const renderCellContent = (content: CellContent, x: number, y: number) => {
    const isPlayerHere = playerPosition.x === x && playerPosition.y === y;
    const hasVisited = visited[y][x];
    const isVisible = hasVisited || showHidden;
    
    // Always render player on top of cell contents
    if (isPlayerHere) {
      return renderPlayer(playerDirection);
    }
    
    // Only show cell contents if visible
    if (!isVisible && !showHidden) {
      return null;
    }
    
    switch (content) {
      case 'wumpus':
        return <Skull className="text-red-500" />;
      case 'pit':
        return <div className="rounded-full bg-black w-3/4 h-3/4 flex items-center justify-center">
          <Wind className="text-blue-400" size={Math.max(12, cellSize * 2)} />
        </div>;
      case 'gold':
        return <Gold className="text-yellow-400" />;
      default:
        return null;
    }
  };
  
  const renderPlayer = (direction: Direction) => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="text-white" />;
      case 'right':
        return <ArrowRight className="text-white" />;
      case 'down':
        return <ArrowDown className="text-white" />;
      case 'left':
        return <ArrowLeft className="text-white" />;
    }
  };
  
  const renderPerceptionIndicators = (x: number, y: number) => {
    const { perception } = gameState;
    const isPlayerHere = playerPosition.x === x && playerPosition.y === y;
    
    if (!isPlayerHere) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {perception.stench && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
        {perception.breeze && (
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
        {perception.glitter && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </div>
    );
  };
  
  const renderGrid = () => {
    return Array(size).fill(null).map((_, y) => (
      <div key={`row-${y}`} className="flex flex-row">
        {Array(size).fill(null).map((_, x) => (
          <div
            key={`cell-${x}-${y}`}
            style={getCellStyle(x, y)}
            className="relative"
          >
            {renderCellContent(board[y][x], x, y)}
            {renderPerceptionIndicators(x, y)}
          </div>
        ))}
      </div>
    ));
  };
  
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        {renderGrid()}
      </div>
    </div>
  );
};

export default GameBoard;