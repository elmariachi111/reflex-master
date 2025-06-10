import { Trophy, Zap } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from "react-hot-toast";
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

type CurrentView = 'game' | 'leaderboard';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('game');

  const handleShowLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  const handleBackToGame = () => {
    setCurrentView('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <header className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">ReflexMaster</h1>
      </header>
      
      <main className="w-full max-w-4xl mx-auto">
        {currentView === 'game' ? (
          <div className="max-w-lg mx-auto">
            <div className="mb-4 text-center">
              <button
                onClick={handleShowLeaderboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                <Trophy className="h-4 w-4" />
                View Leaderboard
              </button>
            </div>
            <Game />
          </div>
        ) : (
          <Leaderboard onBack={handleBackToGame} />
        )}
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Test your reflexes and challenge your friends!</p>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;