import React from "react";
import { Address, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "./button";
import { solveGame } from "@/lib/viem";

type SolveProps = {
  game: Address;
  salt: string;
  move: number;
};

// This component provides the ability to solve the game by revealing the player's move.
export const Solve = ({ game, salt, move }: SolveProps) => {
  const publicClient = usePublicClient();
  const { data } = useWalletClient();

  const onSubmit = async () => {
    const walletClient = data!;
    const account: Address = walletClient.account.address;
    const moveSalt = BigInt(salt);

    const hash = await solveGame(
      game,
      account,
      moveSalt,
      move,
      walletClient,
      publicClient
    );
  };

  // The Solve component renders a Button that, when clicked, calls the onSubmit function, revealing the user's move in the game.

  return <Button onClick={() => onSubmit()}>Reveal</Button>;
};
