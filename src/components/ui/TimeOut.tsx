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
import { Loader2 } from "lucide-react";
import { CardTitle } from "./card";
import { useAccount } from "wagmi";

type TimeOutProps = {
  game: Address;
  functionName: string;
};

export const TimeOut = ({ game, functionName }: TimeOutProps) => {
  const { address } = useAccount();
  let contractConfig;

  if (functionName === "j2Timeout") {
    const { config } = usePrepareContractWrite({
      address: game,
      abi: rpslsContractAbi,
      functionName: "j2Timeout",
      chainId: sepolia.id,
      account: address,

      onError(error) {
        console.log("ERROR--------------", error);
      },
    });

    contractConfig = config;
  } else {
    const { config } = usePrepareContractWrite({
      address: game,
      abi: rpslsContractAbi,
      functionName: "j1Timeout",
      chainId: sepolia.id,
      account: address,

      onError(error) {
        console.log("ERROR--------------", error);
      },
    });
    contractConfig = config;
  }

  const { isLoading, write, isSuccess } = useContractWrite(contractConfig);

  if (!isSuccess) {
    return (
      <Button
        onClick={() => write?.()}
        className="text-sm font-medium"
        disabled={isLoading}
        variant="destructive"
      >
        {isLoading
          ? <Loader2 className="animate-spin h-5 w-5" /> + "Timing Out"
          : "Timeout"}
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
