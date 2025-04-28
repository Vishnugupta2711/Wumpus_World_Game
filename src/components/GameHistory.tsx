import React from 'react';

interface GameHistoryProps {
  history: string[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  const historyEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    // Scroll to bottom of history when it updates
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold mb-3 border-b border-gray-700 pb-2">Game Log</h2>
      
      <div className="h-40 overflow-y-auto pr-2 text-sm">
        {history.map((entry, index) => (
          <div 
            key={`history-${index}`}
            className={`mb-1 p-1.5 rounded ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}
          >
            {entry}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>
    </div>
  );
};

export default GameHistory;