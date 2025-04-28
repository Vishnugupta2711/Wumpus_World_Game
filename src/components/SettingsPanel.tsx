import React from 'react';
import { Cog, RefreshCcw, Eye, EyeOff, HelpCircle } from 'lucide-react';

interface SettingsPanelProps {
  size: number;
  setSize: (size: number) => void;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  showHidden: boolean;
  toggleShowHidden: () => void;
  resetGame: () => void;
  toggleHelp: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  size,
  setSize,
  difficulty,
  setDifficulty,
  showHidden,
  toggleShowHidden,
  resetGame,
  toggleHelp
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Cog className="mr-2 text-gray-400" />
          Settings
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleHelp}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
            aria-label="Help"
          >
            <HelpCircle size={16} />
          </button>
          <button
            onClick={resetGame}
            className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
          >
            <RefreshCcw size={16} className="mr-1" />
            New Game
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Board Size: {size}x{size}</label>
        <input
          type="range"
          min="4"
          max="8"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">
          Difficulty: {Math.round(difficulty * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="0.5"
          step="0.05"
          value={difficulty}
          onChange={(e) => setDifficulty(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-2">
        <button
          onClick={toggleShowHidden}
          className="flex items-center w-full justify-between px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          <span>Reveal Map</span>
          {showHidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        * Changing settings will apply on next game reset
      </p>
    </div>
  );
};

export default SettingsPanel;