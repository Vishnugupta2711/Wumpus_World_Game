import React from 'react';
import { GameState, Action } from '../types';
import { Brain, Play, Pause } from 'lucide-react';

interface AIControlProps {
  gameState: GameState;
  aiReasoning: string;
  onAIAction: () => void;
  isAIActive: boolean;
  toggleAI: () => void;
  aiKnowledge: string;
}

const AIPanel: React.FC<AIControlProps> = ({ 
  gameState, 
  aiReasoning, 
  onAIAction, 
  isAIActive, 
  toggleAI,
  aiKnowledge
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="mr-2 text-blue-400" />
          AI Agent
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleAI}
            className={`flex items-center px-3 py-1 rounded ${isAIActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isAIActive ? (
              <>
                <Pause size={16} className="mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play size={16} className="mr-1" />
                Auto
              </>
            )}
          </button>
          <button
            onClick={onAIAction}
            disabled={isAIActive || gameState.gameOver}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 rounded"
          >
            Next Move
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Knowledge Base</h3>
        <div className="bg-gray-900 p-3 rounded text-xs font-mono h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{aiKnowledge}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Reasoning</h3>
        <div className="bg-gray-900 p-3 rounded text-xs font-mono h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{aiReasoning}</pre>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;