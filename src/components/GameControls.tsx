import React from 'react';
import { Action } from '../types';
import { ArrowBigUp, ArrowBigLeft, ArrowBigRight, GrabIcon, Target, LogOut } from 'lucide-react';

interface GameControlsProps {
  onAction: (action: Action) => void;
  gameOver: boolean;
  hasGold: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onAction, gameOver, hasGold }) => {
  // Button style classes
  const buttonClass = "flex items-center justify-center p-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500";
  const primaryButtonClass = `${buttonClass} bg-blue-600 hover:bg-blue-700 text-white`;
  const secondaryButtonClass = `${buttonClass} bg-gray-700 hover:bg-gray-600 text-white`;
  const destructiveButtonClass = `${buttonClass} bg-red-600 hover:bg-red-700 text-white`;
  const successButtonClass = `${buttonClass} bg-green-600 hover:bg-green-700 text-white`;
  
  const handleAction = (action: Action) => {
    if (!gameOver) {
      onAction(action);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="col-start-2">
          <button 
            className={primaryButtonClass}
            onClick={() => handleAction('moveForward')}
            disabled={gameOver}
            aria-label="Move Forward"
          >
            <ArrowBigUp size={24} />
          </button>
        </div>
        <div className="col-start-1 col-end-2 row-start-2">
          <button 
            className={secondaryButtonClass}
            onClick={() => handleAction('turnLeft')}
            disabled={gameOver}
            aria-label="Turn Left"
          >
            <ArrowBigLeft size={24} />
          </button>
        </div>
        <div className="col-start-3 col-end-4 row-start-2">
          <button 
            className={secondaryButtonClass}
            onClick={() => handleAction('turnRight')}
            disabled={gameOver}
            aria-label="Turn Right"
          >
            <ArrowBigRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button 
          className={primaryButtonClass}
          onClick={() => handleAction('grab')}
          disabled={gameOver}
          aria-label="Grab Gold"
        >
          <GrabIcon size={20} />
          <span className="ml-2">Grab</span>
        </button>
        <button 
          className={destructiveButtonClass}
          onClick={() => handleAction('shoot')}
          disabled={gameOver}
          aria-label="Shoot Arrow"
        >
          <Target size={20} />
          <span className="ml-2">Shoot</span>
        </button>
        <button 
          className={hasGold ? successButtonClass : secondaryButtonClass}
          onClick={() => handleAction('climb')}
          disabled={gameOver}
          aria-label="Climb Out"
        >
          <LogOut size={20} />
          <span className="ml-2">Climb</span>
        </button>
      </div>
    </div>
  );
};

export default GameControls;