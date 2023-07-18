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
