"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getInternalTransactions } from "@/lib/alchemy";

type OutcomeProps = {
  gameAddress: string;
};

// This component determines and displays the outcome of a game.

export function Outcome({ gameAddress }: OutcomeProps) {
  const { address } = useAccount();
  const [gameOutcome, setGameOutcome] = useState<string | "Draw">("");

  // The getOutcome function is used to fetch the game's outcome using the getInternalTransactions function.
  // Uses Alchemy API to fetch internal asset transfers for a given contract
  const getOutcome = async () => {
    const outcome = await getInternalTransactions(gameAddress);
    setGameOutcome(outcome!);
  };

  useEffect(() => {
    getOutcome();
  }, [gameAddress]);

  // The following if-else structure renders a different message depending on the game's outcome.
  if (gameOutcome === gameAddress) {
    return <div className="text-center font-bold">Draw!</div>;
  } else if (gameOutcome === address?.toLowerCase()) {
    return (
      <div className="text-center font-bold bg-green-700 rounded-lg p-3">
        You Won!
      </div>
    );
  }
  if (gameOutcome !== address?.toLowerCase()) {
    return (
      <div className="text-center font-bold bg-red-700  rounded-lg p-3">
        You Lost!
      </div>
    );
  }
}
