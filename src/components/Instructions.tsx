import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
        <li>Click the blue button to start</li>
        <li>Wait for the button to turn <span className="text-green-500 font-medium">green</span></li>
        <li>Click as quickly as you can when it changes</li>
        <li>See your reaction time in milliseconds</li>
        <li>Try to beat your best time!</li>
      </ol>
      <p className="mt-3 text-sm text-red-500">Don't click too early or you'll have to restart!</p>
    </div>
  );
};

export default Instructions;