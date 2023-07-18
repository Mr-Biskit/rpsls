import React from "react";
import { Address, usePublicClient, useWalletClient } from "wagmi";
import { Button } from "./button";
import { solveGame } from "@/lib/viem";

type SolveProps = {
  game: Address;
  salt: string;
  move: number;
};

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
    console.log(hash);
  };

  return <Button onClick={() => onSubmit()}>Reveal</Button>;
};
