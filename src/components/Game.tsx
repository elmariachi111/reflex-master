import React from 'react';
import { useReactionGame } from '../hooks/useReactionGame';
import ReactionButton from './ReactionButton';
import Stats from './Stats';
import Instructions from './Instructions';

const Game: React.FC = () => {
  const {
    gameState,
    reactionTime,
    reactionHistory,
    earlyClick,
    handleClick,
    clearHistory
  } = useReactionGame();

  const handleTrackResults = () => {
    const times = reactionHistory.map(item => item.time);
    const averageTime = times.reduce((acc, time) => acc + time, 0) / times.length;
    const bestTime = Math.min(...times);
    
    const resultsData = {
      totalAttempts: reactionHistory.length,
      averageTime: Math.round(averageTime),
      bestTime: bestTime,
      allTimes: times,
      timestamp: new Date().toISOString(),
      reactionHistory: reactionHistory
    };
    
    console.log('🎯 Reaction Time Results:', resultsData);
    console.log('📊 Summary:', {
      'Total Attempts': resultsData.totalAttempts,
      'Average Time': `${resultsData.averageTime}ms`,
      'Best Time': `${resultsData.bestTime}ms`,
      'Performance Level': resultsData.averageTime < 250 ? 'Excellent' : 
                          resultsData.averageTime < 350 ? 'Good' : 
                          resultsData.averageTime < 450 ? 'Average' : 'Needs Practice'
    });
    
    // Clear the results after tracking
    clearHistory();
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reaction Time Test</h1>
      
      <ReactionButton
        gameState={gameState}
        reactionTime={reactionTime}
        earlyClick={earlyClick}
        onClick={handleClick}
      />
      
      <div className="w-full mt-8 space-y-4">
        <Stats 
          reactionHistory={reactionHistory} 
          onClearHistory={clearHistory}
          onTrackResults={handleTrackResults}
        />
        <Instructions />
      </div>
    </div>
  );
};

export default Game;