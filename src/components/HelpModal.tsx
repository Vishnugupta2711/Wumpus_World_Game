import React from 'react';
import { X, ArrowBigUp, ArrowBigLeft, ArrowBigRight, GrabIcon, Target, LogOut, Wind, Skull, Bold as Gold } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Wumpus World Game Guide</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Game Overview</h3>
          <p className="mb-4">
            Wumpus World is a classic AI problem where you navigate a dangerous cave to find gold and escape. 
            The cave contains pits you can fall into and a deadly Wumpus monster!
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Goal</h3>
          <p className="mb-4">
            Find the gold and climb out of the cave (return to position 0,0) to win.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Game Elements</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <div className="bg-gray-700 p-2 rounded mr-3">
                <Skull className="text-red-500" />
              </div>
              <div>
                <strong>Wumpus:</strong> Deadly monster that will eat you if you enter its square
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-700 p-2 rounded mr-3">
                <Wind className="text-blue-400" />
              </div>
              <div>
                <strong>Pit:</strong> Falling into a pit means game over
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-700 p-2 rounded mr-3">
                <Gold className="text-yellow-400" />
              </div>
              <div>
                <strong>Gold:</strong> Your treasure to collect and escape with
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Percepts (Clues)</h3>
          <p className="mb-2">
            You can sense what's in adjacent squares:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Stench:</strong> You smell a stench when the Wumpus is in an adjacent square</li>
            <li><strong>Breeze:</strong> You feel a breeze when a pit is in an adjacent square</li>
            <li><strong>Glitter:</strong> You see a glitter when gold is in your current square</li>
            <li><strong>Bump:</strong> You feel a bump when you hit a wall</li>
            <li><strong>Scream:</strong> You hear a scream when your arrow kills the Wumpus</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Controls</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded mr-3">
                <ArrowBigUp className="text-white" />
              </div>
              <div>
                <strong>Move Forward:</strong> Move in the direction you're facing
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-700 p-2 rounded mr-3">
                <ArrowBigLeft className="text-white" />
              </div>
              <div>
                <strong>Turn Left:</strong> Rotate 90° counter-clockwise
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-700 p-2 rounded mr-3">
                <ArrowBigRight className="text-white" />
              </div>
              <div>
                <strong>Turn Right:</strong> Rotate 90° clockwise
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded mr-3">
                <GrabIcon className="text-white" />
              </div>
              <div>
                <strong>Grab:</strong> Pick up the gold when you're on its square
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-red-600 p-2 rounded mr-3">
                <Target className="text-white" />
              </div>
              <div>
                <strong>Shoot:</strong> Fire an arrow in the direction you're facing
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded mr-3">
                <LogOut className="text-white" />
              </div>
              <div>
                <strong>Climb:</strong> Exit the cave when at position (0,0)
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Scoring</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>-1 point for each action (move, turn, grab, climb)</li>
            <li>-10 points for shooting an arrow</li>
            <li>+1000 points for grabbing the gold</li>
            <li>+500 additional points for escaping with the gold</li>
            <li>-1000 points for dying (falling in a pit or eaten by Wumpus)</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">AI Mode</h3>
          <p className="mb-4">
            The AI agent uses logical reasoning to navigate the Wumpus World safely. 
            You can watch it play automatically or ask it for the next best move.
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-center">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;