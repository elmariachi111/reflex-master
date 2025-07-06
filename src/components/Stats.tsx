import React from 'react';
import { calculateAverage, formatTime, getBestTime } from '../utils/gameUtils';

interface StatsProps {
  reactionHistory: Array<any>;
  onClearHistory: () => void;
  onTrackResults: () => void;
  isDialogDisabled: boolean;  // Add this line
}

const Stats: React.FC<StatsProps> = ({ 
  reactionHistory, 
  onClearHistory, 
}) => {
  const times = reactionHistory.map(item => item.time);
  const averageTime = calculateAverage(times);
  const bestTime = getBestTime(times);
  
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Stats</h2>
        {reactionHistory.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Best Time</div>
          <div className="text-xl font-bold text-blue-600">{formatTime(bestTime)}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Average Time</div>
          <div className="text-xl font-bold text-blue-600">{formatTime(averageTime)}</div>
        </div>
      </div>
      
      {reactionHistory.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Attempts</h3>
          <div className="max-h-40 overflow-y-auto">
            {reactionHistory.map((record) => (
              <div 
                key={record.id} 
                className="flex justify-between items-center py-1.5 border-b border-gray-100"
              >
                <span className="text-sm text-gray-700">
                  {new Date(record.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatTime(record.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;