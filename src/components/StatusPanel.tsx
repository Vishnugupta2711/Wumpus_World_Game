import React from 'react';
import { GameState, Perception } from '../types';
import { Wind, Skull, Bold as Gold, Bug as Bump, Volume2 } from 'lucide-react';

interface StatusPanelProps {
  gameState: GameState;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ gameState }) => {
  const { score, playerPosition, playerDirection, hasGold, perception, message } = gameState;
  
  const renderPerception = (perception: Perception) => {
    return (
      <div className="grid grid-cols-5 gap-2 my-3">
        <div className={`flex flex-col items-center ${perception.stench ? 'text-red-500' : 'text-gray-600'}`}>
          <Skull size={24} />
          <span className="text-xs mt-1">Stench</span>
        </div>
        <div className={`flex flex-col items-center ${perception.breeze ? 'text-blue-400' : 'text-gray-600'}`}>
          <Wind size={24} />
          <span className="text-xs mt-1">Breeze</span>
        </div>
        <div className={`flex flex-col items-center ${perception.glitter ? 'text-yellow-400' : 'text-gray-600'}`}>
          <Gold size={24} />
          <span className="text-xs mt-1">Glitter</span>
        </div>
        <div className={`flex flex-col items-center ${perception.bump ? 'text-amber-500' : 'text-gray-600'}`}>
          <Bump size={24} />
          <span className="text-xs mt-1">Bump</span>
        </div>
        <div className={`flex flex-col items-center ${perception.scream ? 'text-purple-500' : 'text-gray-600'}`}>
          <Volume2 size={24} />
          <span className="text-xs mt-1">Scream</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 border-b border-gray-700 pb-2">Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div>
            <p className="text-gray-400">Position</p>
            <p className="text-xl">({playerPosition.x}, {playerPosition.y})</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-400">Direction</p>
          <p className="capitalize text-xl">{playerDirection}</p>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-400">Inventory</p>
          <p className={hasGold ? "text-yellow-400 flex items-center" : "text-gray-500"}>
            <Gold size={16} className="mr-2" />
            {hasGold ? "Gold acquired!" : "No gold yet"}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-lg mb-1">Perceptions</h3>
        {renderPerception(perception)}
      </div>
      
      <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
        <p className="text-sm italic">{message}</p>
      </div>
    </div>
  );
};

export default StatusPanel;