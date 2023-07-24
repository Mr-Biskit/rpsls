import React from "react";
import { Address, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "./button";
import { solveGame } from "@/lib/viem";
import useLocalStorage from "@/hooks/useLocalStorage";

type SolveProps = {
  game: Address;
};

// This component provides the ability to solve the game by revealing the player's move.
export const Solve = ({ game }: SolveProps) => {
  const publicClient = usePublicClient();
  const { data } = useWalletClient();
  const [gameData] = useLocalStorage({
    key: game as string,
    initialValue: null,
  });
  console.log(gameData);

  const onSubmit = async () => {
    const { saltString, move } = gameData!;
    const walletClient = data!;
    const account: Address = walletClient.account.address;
    const moveSalt = BigInt(saltString);

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
