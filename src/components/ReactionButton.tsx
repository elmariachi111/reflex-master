import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { getTimeColor, getReactionMessage } from '../utils/gameUtils';

interface ReactionButtonProps {
  gameState: GameState;
  reactionTime: number | null;
  earlyClick: boolean;
  onClick: () => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  gameState,
  reactionTime,
  earlyClick,
  onClick
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (gameState === 'ready') {
      const maxOffset = 250; // Increased maximum pixel offset
      setPosition({
        x: Math.random() * maxOffset * 2 - maxOffset,
        y: Math.random() * maxOffset * 2 - maxOffset
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [gameState]);

  const getBgColor = () => {
    if (earlyClick) return 'bg-red-100 hover:bg-red-200';
    
    switch (gameState) {
      case 'idle':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'waiting':
        return 'bg-yellow-500';
      case 'ready':
        return 'bg-green-500 hover:bg-green-600';
      case 'finished':
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };
  
  const getText = () => {
    if (earlyClick) return 'Too early! Click to try again';
    
    switch (gameState) {
      case 'idle':
        return 'Click to start';
      case 'waiting':
        return 'Wait...';
      case 'ready':
        return 'Click now!';
      case 'finished':
        return `${reactionTime} ms - Click to try again`;
    }
  };
  
  const getTextColor = () => {
    if (earlyClick) return 'text-red-800';
    if (gameState === 'finished' && reactionTime) {
      return getTimeColor(reactionTime);
    }
    return gameState === 'idle' || gameState === 'ready' ? 'text-white' : 'text-gray-800';
  };
  
  const getTransition = () => {
    return gameState === 'ready' ? 'all 0.1s ease-in' : 'all 0.3s ease-out';
  };
  
  return (
    <div className="relative w-full h-32 md:h-52">
      <button
        onClick={onClick}
        disabled={false}
        className={`
          ${getBgColor()} 
          ${getTextColor()} 
          absolute 
          left-1/2 
          top-1/2
          -translate-x-1/2 
          -translate-y-1/2
          rounded-xl 
          w-3/5
          h-3/5
          text-lg 
          md:text-xl 
          font-semibold 
          shadow-lg 
          flex 
          flex-col 
          items-center 
          justify-center 
          px-6
        `}
        style={{
          transition: getTransition(),
          transform: `
            translate(
              calc(-50% + ${position.x}px), 
              calc(-50% + ${position.y}px)
            )
            ${gameState === 'ready' ? 'scale(0.5)' : 'scale(1)'}
          `
        }}
      >
        <span>{getText()}</span>
        {gameState === 'finished' && !earlyClick && (
          <span className={`text-base mt-2 ${getTimeColor(reactionTime)}`}>
            {getReactionMessage(reactionTime)}
          </span>
        )}
      </button>
    </div>
  );
};

export default ReactionButton;