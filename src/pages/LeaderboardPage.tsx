import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
  const handleBack = () => {
    // This is not needed anymore since we're using Link navigation
    // but keeping the component interface for now
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Game
        </Link>
      </div>
      <Leaderboard onBack={handleBack} />
    </div>
  );
};

export default LeaderboardPage;