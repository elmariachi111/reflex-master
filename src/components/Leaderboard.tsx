import { Clock, Loader2, Target, Trophy, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, LeaderboardData } from "../types/game";
import { toAddress, truncateEthAddress } from "../utils/dids";

interface LeaderboardProps {
  onBack: () => void;
}

const API_URL = `${
  import.meta.env.VITE_HEALTH_WALLET_BASE_URL
}/api/query/reflex`;

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [data, setData] = useState<LeaderboardData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(undefined);

        // Replace with your actual API endpoint
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const leaderboardData: LeaderboardData = await response.json();
        setData(leaderboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const formatTime = (time: number) => {
    return `${time}ms`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-medium">#{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Leaderboard
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Game
          </button>
        </div>

        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Leaderboard
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Game
          </button>
        </div>

        <div className="text-center py-12">
          <div className="text-red-500 mb-2">Error loading leaderboard</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!data || !data.aggregated) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Leaderboard
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Game
          </button>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-600">No data available</div>
        </div>
      </div>
    );
  }

  const { aggregated } = data;
  const topControllers = aggregated.allControllers.slice(0, 50);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Leaderboard
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Game
        </button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 font-medium">
          <Trophy className="h-4 w-4" />
          Total Records: {aggregated.totalRecords}
        </div>
        {aggregated.fastestController && (
          <div className="mt-2 text-sm text-blue-600">
            Fastest Overall:{" "}
            {truncateEthAddress(
              toAddress(aggregated.fastestController.controller_did)
            )}{" "}
            - {formatTime(aggregated.fastestController.fastestReactionTime)}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-700">
                Rank
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                Controller
              </th>
              <th className="text-center p-3 font-semibold text-gray-700">
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-4 w-4" />
                  Attempts
                </div>
              </th>
              <th className="text-center p-3 font-semibold text-gray-700">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  Average Time
                </div>
              </th>
              <th className="text-center p-3 font-semibold text-gray-700">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="h-4 w-4" />
                  Best Time
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {topControllers.map((controller: Controller, index: number) => (
              <tr
                key={controller.controller_did}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  index < 3
                    ? "bg-gradient-to-r from-yellow-50 to-transparent"
                    : ""
                }`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span
                      className="font-mono text-sm"
                      title={controller.controller_did}
                    >
                      {truncateEthAddress(toAddress(controller.controller_did), 6,6)}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium">
                    {controller.totalAttempts}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium text-blue-600">
                    {formatTime(controller.averageTime)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="font-bold text-green-600">
                    {formatTime(controller.bestTime)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {topControllers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No controllers found in the leaderboard.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
