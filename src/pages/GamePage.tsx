import { Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Game from '../components/Game';

const GamePage = () => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-4 text-right">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors font-medium underline"
        >
          <Trophy className="h-4 w-4" />
          view leaderboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Game />
    </div>
  );
};

export default GamePage;