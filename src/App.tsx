import React from 'react';
import Game from './components/Game';
import { Zap } from 'lucide-react';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <header className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">ReflexMaster</h1>
      </header>
      
      <main className="w-full max-w-lg mx-auto">
        <Game />
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Test your reflexes and challenge your friends!</p>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;