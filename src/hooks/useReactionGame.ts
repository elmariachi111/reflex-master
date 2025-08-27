import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, ReactionTime } from '../types/game';
import { generateRandomDelay } from '../utils/gameUtils';

export function useReactionGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [reactionHistory, setReactionHistory] = useState<ReactionTime[]>([]);
  const [earlyClick, setEarlyClick] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const startGame = useCallback(() => {
    clearTimer();
    setGameState('waiting');
    setEarlyClick(false);
    setReactionTime(null);
    
    // Random delay between 2-6 seconds
    const delay = generateRandomDelay(2000, 6000);
    
    timerRef.current = window.setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
    }, delay);
  }, [clearTimer]);
  
  const handleClick = useCallback(() => {
    switch (gameState) {
      case 'idle':
        startGame();
        break;
        
      case 'waiting':
        clearTimer();
        setGameState('idle');
        setEarlyClick(true);
        break;
        
      case 'ready': {
        const endTime = Date.now();
        const elapsed = startTimeRef.current ? endTime - startTimeRef.current : 0;
        setReactionTime(elapsed);
        setGameState('finished');
        
        const newReactionTime: ReactionTime = {
          id: Date.now().toString(),
          time: elapsed,
          timestamp: new Date().toISOString()
        };
        
        setReactionHistory(prev => [newReactionTime, ...prev].slice(0, 10));
        break;
      }
      
      case 'finished':
        startGame();
        break;
    }
  }, [gameState, startGame, clearTimer]);
  
  const resetGame = useCallback(() => {
    clearTimer();
    setGameState('idle');
    setReactionTime(null);
    setEarlyClick(false);
    startTimeRef.current = null;
  }, [clearTimer]);
  
  const clearHistory = useCallback(() => {
    setReactionHistory([]);
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);
  
  return {
    gameState,
    reactionTime,
    reactionHistory,
    earlyClick,
    handleClick,
    startGame,
    resetGame,
    clearHistory
  };
}