import { Zap } from 'lucide-react';
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <header className="flex items-center justify-center gap-2 mb-6">
          <Zap className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">ReflexMaster</h1>
        </header>
        
        <main className="w-full max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </main>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Test your reflexes and challenge your friends!</p>
        </footer>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;