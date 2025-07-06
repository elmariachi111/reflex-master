import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useReactionGame } from "../hooks/useReactionGame";
import { ReactionTime } from "../types/game";
import { truncateEthAddress } from "../utils/dids";
import Instructions from "./Instructions";
import ReactionButton from "./ReactionButton";
import Stats from "./Stats";

const WELSHARE_WALLET_URL = `${
  import.meta.env.VITE_HEALTH_WALLET_BASE_URL
}/wallet-external`;

interface DialogMessage {
  type: string;
  payload?: any;
  id?: string;
}

interface ReactionTimeSubmission {
  totalAttempts: number;
  averageTime: number;
  bestTime: number;
  allTimes: number[];
  timestamp: number; //unix time
  reactionHistory: ReactionTime[];
}

interface SignedPayload {
  msgHash: string;
  serializedSubmission: string;
  signature: string;
  recoveryBit: number;
  timestamp: number;
}

const Game: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogWindow, setDialogWindow] = useState<Window | null>(null);
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [sessionPubKey, setSessionPubKey] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  const {
    gameState,
    reactionTime,
    reactionHistory,
    earlyClick,
    handleClick,
    clearHistory,
  } = useReactionGame();

  const hasEnoughResultsForSubmission = reactionHistory.length >= 3;

  const submitDataToWelshare = async (payload: SignedPayload) => {
    const result = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(`Failed to upload data: ${errorData.error}`);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent<DialogMessage>) => {
      // Verify origin for security
      if (event.origin !== new URL(WELSHARE_WALLET_URL).origin) {
        return;
      }

      const message = event.data;
      let errorMessage = "";
      switch (message.type) {
        case "ERROR":
          errorMessage = message.payload.error || "An unknown error occurred";
          console.error("remote app signals an error:", errorMessage);
          setIsUploading(false);
          toast.error(errorMessage, {
            duration: 4000,
            style: {
              background: "#f44336",
              color: "#fff",
            },
          });
          break;
        case "DIALOG_READY":
          setIsDialogOpen(true);
          console.log("Dialog is ready");
          break;

        case "SESSION_READY":
          setSessionPubKey(message.payload.sessionPublicKey);
          break;

        case "DIALOG_CLOSING":
          setIsDialogOpen(false);
          setDialogWindow(null);
          console.log("Dialog is closing");
          break;

        case "DATA_SIGNED":
          console.log("Data signed, starting upload:", message.payload);

          submitDataToWelshare(message.payload)
            .then(() => {
              toast.success("The results were uploaded.", { duration: 4000 });
            })
            .catch((error) => {
              toast.error(error.message, {
                duration: 4000,
              });
            })
            .finally(() => {
              // Clear the results after tracking
              setIsUploading(false);
              clearHistory();
            });
          /*
            hash: toHex(msgHash),
            signature: signatureHex,
            uploadResult: uploadResult,
            timestamp: Date.now(),
          */
          
          break;
        default:
          console.log("Received message from dialog:", message);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [clearHistory]);

  const openDialog = useCallback(() => {
    const width = 800;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const newWindow = window.open(
      WELSHARE_WALLET_URL,
      "Welshare Wallet",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (newWindow) {
      setDialogWindow(newWindow);
      // Note: We'll set isDialogOpen when we receive DIALOG_READY event
    }
  }, []);

  const handleTrackResults = useCallback(() => {
    const times = reactionHistory.map((item) => item.time);
    const averageTime =
      times.reduce((acc, time) => acc + time, 0) / times.length;
    const bestTime = Math.min(...times);

    if (!sessionPubKey) {
      toast("session is not ready, check your health wallet");
    }

    const resultsData: ReactionTimeSubmission = {
      totalAttempts: reactionHistory.length,
      averageTime: Math.round(averageTime),
      bestTime: bestTime,
      allTimes: times,
      timestamp: Math.floor(new Date().getTime() / 1000),
      reactionHistory: reactionHistory,
    };

    // If dialog is open, send the results
    if (isDialogOpen && sessionPubKey && dialogWindow) {
      const message: DialogMessage = {
        type: "SUBMIT_DATA",
        payload: resultsData,
        id: String(messageIdCounter),
      };

      dialogWindow.postMessage(message, WELSHARE_WALLET_URL);
      setIsUploading(true);
      setMessageIdCounter((prev) => prev + 1);
    }
    toast.loading("We're uploading your results now.", { duration: 4000 });
    console.log("🎯 Reaction Time Results:", resultsData);
    console.log("📊 Summary:", {
      "Total Attempts": resultsData.totalAttempts,
      "Average Time": `${resultsData.averageTime}ms`,
      "Best Time": `${resultsData.bestTime}ms`,
      "Performance Level":
        resultsData.averageTime < 250
          ? "Excellent"
          : resultsData.averageTime < 350
          ? "Good"
          : resultsData.averageTime < 450
          ? "Average"
          : "Needs Practice",
    });
  }, [
    reactionHistory,
    sessionPubKey,
    isDialogOpen,
    dialogWindow,
    messageIdCounter,
  ]);

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
              <div className="flex flex-col items-center">
                <button
                  onClick={handleTrackResults}
                  disabled={!isDialogOpen || !sessionPubKey || isUploading} // Add this line
                  className={`w-full py-2 px-4 rounded transition-colors ${
                    !isDialogOpen
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {sessionPubKey
                    ? `Track My Results`
                    : "Create session key in wallet"}
                </button>
                {sessionPubKey && (
                  <span className="text-sm text-gray-500">
                    {truncateEthAddress(sessionPubKey)}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-[3px] bg-gradient-to-br from-[#0198ff]/80 to-[#16ffef]/80 rounded-lg">
                <button
                  onClick={openDialog}
                  className="bg-black text-white px-6 py-3 rounded-lg w-full"
                >
                  Connect Welshare Profile
                </button>
              </div>
            ))}
        </div>

        <Instructions />
      </div>
    </div>
  );
};

export default Game;
