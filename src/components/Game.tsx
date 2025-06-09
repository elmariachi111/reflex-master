import React, { useEffect, useState, useCallback } from 'react';
import { useReactionGame } from '../hooks/useReactionGame';
import ReactionButton from './ReactionButton';
import Stats from './Stats';
import Instructions from './Instructions';

const WELSHARE_WALLET_URL = "http://localhost:3000/wallet-external"

interface DialogMessage {
  type: string;
  payload?: any;
  id?: string;
}

const Game: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogWindow, setDialogWindow] = useState<Window | null>(null);
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  const {
    gameState,
    reactionTime,
    reactionHistory,
    earlyClick,
    handleClick,
    clearHistory
  } = useReactionGame();

  useEffect(() => {
    const handleMessage = (event: MessageEvent<DialogMessage>) => {
      // Verify origin for security
      if (event.origin !== new URL(WELSHARE_WALLET_URL).origin) {
        return;
      }

      const message = event.data;
      
      switch (message.type) {
        case 'DIALOG_READY':
          setIsDialogOpen(true);
          console.log('Dialog is ready');
          break;
          
        case 'DIALOG_CLOSING':
          setIsDialogOpen(false);
          setDialogWindow(null);
          console.log('Dialog is closing');
          break;
          
        default:
          console.log('Received message from dialog:', message);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const openDialog = useCallback(() => {
    const width = 800;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const newWindow = window.open(
      WELSHARE_WALLET_URL,
      'Welshare Wallet',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (newWindow) {
      setDialogWindow(newWindow);
      // Note: We'll set isDialogOpen when we receive DIALOG_READY event
    }
  }, []);

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
    
    // If dialog is open, send the results
    if (isDialogOpen && dialogWindow) {
      const message: DialogMessage = {
        type: 'PING',
        payload: resultsData,
        id: String(messageIdCounter)
      };
      
      dialogWindow.postMessage(message, WELSHARE_WALLET_URL);
      setMessageIdCounter(prev => prev + 1);
    }
    
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
          isDialogDisabled={!isDialogOpen}  // Add this line
        />
        
        <button
          onClick={openDialog}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Open External Content
        </button>
        
        <Instructions />
      </div>
    </div>
  );
};

export default Game;