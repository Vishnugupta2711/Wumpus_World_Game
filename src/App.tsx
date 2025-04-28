import React, { useState, useEffect } from 'react';
import { GameState, Action } from './types';
import { getInitialGameState, executeAction } from './utils/gameUtils';
import { initializeKnowledgeBase, updateKnowledgeBase, decideNextAction, getAgentReasoning } from './utils/aiAgent';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import StatusPanel from './components/StatusPanel';
import AIPanel from './components/AIPanel';
import GameHistory from './components/GameHistory';
import SettingsPanel from './components/SettingsPanel';
import HelpModal from './components/HelpModal';
import { Brain } from 'lucide-react';

function App() {
  // Game configuration
  const [size, setSize] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<number>(0.2);
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(getInitialGameState(size, difficulty));
  
  // AI state
  const [knowledgeBase, setKnowledgeBase] = useState(initializeKnowledgeBase(size));
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [isAIActive, setIsAIActive] = useState<boolean>(false);
  const [aiDelay, setAiDelay] = useState<number>(1000);
  const [aiInterval, setAiInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Format knowledge base for display
  const formatKnowledgeBase = () => {
    const { safeSquares, dangerousSquares, unvisitedSafeSquares, frontierSquares } = knowledgeBase;
    
    return `Safe: ${Array.from(safeSquares).join(', ')}\n` +
           `Unvisited Safe: ${Array.from(unvisitedSafeSquares).join(', ')}\n` +
           `Dangerous: ${Array.from(dangerousSquares).join(', ')}\n` +
           `Frontier: ${Array.from(frontierSquares).join(', ')}`;
  };
  
  // Reset the game
  const resetGame = () => {
    const newGameState = getInitialGameState(size, difficulty);
    setGameState(newGameState);
    setKnowledgeBase(initializeKnowledgeBase(size));
    setAiReasoning("");
    
    // Stop AI if it's running
    if (aiInterval) {
      clearInterval(aiInterval);
      setAiInterval(null);
    }
    setIsAIActive(false);
  };
  
  // Handle player actions
  const handleAction = (action: Action) => {
    if (gameState.gameOver) return;
    
    const newState = executeAction(gameState, action);
    setGameState(newState);
    
    // Update AI knowledge base
    const updatedKB = updateKnowledgeBase(knowledgeBase, newState);
    setKnowledgeBase(updatedKB);
    setAiReasoning(getAgentReasoning(updatedKB, newState));
  };
  
  // Handle AI action
  const handleAIAction = () => {
    if (gameState.gameOver) return;
    
    // Update knowledge base
    const updatedKB = updateKnowledgeBase(knowledgeBase, gameState);
    setKnowledgeBase(updatedKB);
    
    // Decide next action
    const action = decideNextAction(updatedKB, gameState);
    const reasoning = getAgentReasoning(updatedKB, gameState);
    setAiReasoning(reasoning + `\nDecided to: ${action}`);
    
    // Execute action
    const newState = executeAction(gameState, action);
    setGameState(newState);
  };
  
  // Toggle AI auto-play
  const toggleAI = () => {
    if (isAIActive) {
      // Stop AI
      if (aiInterval) {
        clearInterval(aiInterval);
        setAiInterval(null);
      }
    } else {
      // Start AI
      const interval = setInterval(() => {
        handleAIAction();
      }, aiDelay);
      setAiInterval(interval);
    }
    
    setIsAIActive(!isAIActive);
  };
  
  // Stop AI when game is over
  useEffect(() => {
    if (gameState.gameOver && aiInterval) {
      clearInterval(aiInterval);
      setAiInterval(null);
      setIsAIActive(false);
    }
  }, [gameState.gameOver, aiInterval]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (aiInterval) {
        clearInterval(aiInterval);
      }
    };
  }, [aiInterval]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Brain className="text-blue-500 mr-2" />
            Wumpus World
          </h1>
          <div className="text-sm">
            {gameState.gameOver ? (
              <span className={gameState.hasGold && gameState.playerPosition.x === 0 && gameState.playerPosition.y === 0 
                ? "text-green-400" 
                : "text-red-400"}>
                Game Over • Score: {gameState.score}
              </span>
            ) : (
              <span>Score: {gameState.score}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col items-center">
              <GameBoard gameState={gameState} showHidden={showHidden} size={size} />
              <div className="w-full max-w-md mt-6">
                <GameControls onAction={handleAction} gameOver={gameState.gameOver} hasGold={gameState.hasGold} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatusPanel gameState={gameState} />
              <GameHistory history={gameState.history} />
            </div>
          </div>
          
          {/* Right Column - AI & Settings */}
          <div className="space-y-6">
            <AIPanel 
              gameState={gameState}
              aiReasoning={aiReasoning}
              onAIAction={handleAIAction}
              isAIActive={isAIActive}
              toggleAI={toggleAI}
              aiKnowledge={formatKnowledgeBase()}
            />
            <SettingsPanel 
              size={size}
              setSize={setSize}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              showHidden={showHidden}
              toggleShowHidden={() => setShowHidden(!showHidden)}
              resetGame={resetGame}
              toggleHelp={() => setShowHelp(true)}
            />
          </div>
        </div>
      </main>
      
      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default App;