"use client";
import { Button } from "./button";
import React from "react";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  sepolia,
} from "wagmi";
import { rpslsContractAbi } from "@/contract";
import { CardTitle } from "./card";
import { useAccount } from "wagmi";

type TimeOutProps = {
  game: Address;
  functionName: string;
};

// This component allows players to timeout their opponent if the game isn't progressing.

export const TimeOut = ({ game, functionName }: TimeOutProps) => {
  const { address } = useAccount();

  // Determine the actual function to be called based on the passed in functionName
  const actualFunctionName =
    functionName === "j2Timeout" ? "j2Timeout" : "j1Timeout";

  const { config: contractConfig } = usePrepareContractWrite({
    address: game,
    abi: rpslsContractAbi,
    functionName: actualFunctionName,
    chainId: sepolia.id,
    account: address,

    onError(error) {
      console.log("ERROR--------------", error);
    },
  });

  const { isLoading, write, isSuccess } = useContractWrite(contractConfig);

  // If the write action is not yet successful, show a button allowing the user to timeout the game.
  // If the button is clicked, the write function is triggered, and the button is disabled while the action is in progress.
  // Once the action is successful, a message is displayed instead of the button.
  if (!isSuccess) {
    return (
      <Button
        onClick={() => write?.()}
        className="text-sm font-medium"
        disabled={isLoading}
        variant="destructive"
      >
        {isLoading ? "Timing Out" : "Timeout"}
      </Button>
    );
  } else {
    return (
      <CardTitle className="text-sm font-medium">
        Timeout Successful <br /> Stake Withdrawn
      </CardTitle>
    );
  }
};
