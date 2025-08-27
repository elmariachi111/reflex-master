import { ConnectWelshareButton, Schemas, useWelshare } from "@welshare/react";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useReactionGame } from "../hooks/useReactionGame";
import { ReactionTime } from "../types/game";
import { truncateDid } from "../utils/dids";
import Instructions from "./Instructions";
import ReactionButton from "./ReactionButton";
import Stats from "./Stats";

interface ReactionTimeSubmission {
  attempts: ReactionTime[];
  stats: {
    averageTime: number;
    bestTime: number;
  };
}

const Game: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);

  const { openWallet, submitData, isDialogOpen, storageKey } =
    useWelshare({
      applicationId: import.meta.env.VITE_HEALTH_APP_ID,
      apiBaseUrl: import.meta.env.VITE_HEALTH_WALLET_BASE_URL,
      environment: "development", //optional, at the moment the environment is always development
      callbacks: {
        onUploaded: (payload: unknown) => {
          console.log("Data uploaded:", payload);
          setIsUploading(false);
          clearHistory();
        },
        onError: (error: unknown) => {
          console.error("Error:", error);
          setIsUploading(false);
        },
        onSessionReady: (storageKey: unknown) =>
          console.log("Session ready:", storageKey),
      },
    });

  const {
    gameState,
    reactionTime,
    reactionHistory,
    earlyClick,
    handleClick,
    clearHistory,
  } = useReactionGame();

  const hasEnoughResultsForSubmission = reactionHistory.length >= 3;

  const handleTrackResults = useCallback(async () => {
    const times = reactionHistory.map((item) => item.time);
    const averageTime = Math.round(
      times.reduce((acc, time) => acc + time, 0) / times.length
    );
    const bestTime = Math.min(...times);

    if (!storageKey) {
      toast("session is not ready, check your health wallet");
      return;
    }

    //reduce this:
    const submission: ReactionTimeSubmission = {
      attempts: reactionHistory,
      stats: {
        averageTime,
        bestTime,
      },
    };

    console.log("🎯 Reaction Time Results:", submission);

    if (isDialogOpen) {
      submitData(Schemas.ReflexSubmission, submission);
      setIsUploading(true);
      toast.loading("We're uploading your results now.", { duration: 4000 });
    }
  }, [reactionHistory, storageKey, isDialogOpen, submitData]);

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Put your Reaction Time to the Test!
      </h1>

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
          isDialogDisabled={!isDialogOpen} // Add this line
        />

        <div className="mt-4">
          {hasEnoughResultsForSubmission &&
            (isDialogOpen ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Connected
                    </span>
                  </div>
                  {storageKey && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {truncateDid(storageKey, 6, 6)}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    {storageKey
                      ? "Your Welshare profile is connected and ready to track your reaction time results."
                      : "To proceed, switch to the Welshare Wallet window and click the Derive Storage Key button."}
                  </div>

                  <button
                    onClick={handleTrackResults}
                    disabled={!isDialogOpen || !storageKey || isUploading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      !isDialogOpen || !storageKey || isUploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Upload Results"}
                  </button>
                </div>
              </div>
            ) : (
              <ConnectWelshareButton openWallet={openWallet}>
                Connect Welshare Profile
              </ConnectWelshareButton>
            ))}
        </div>

        <Instructions />
      </div>
    </div>
  );
};

export default Game;
