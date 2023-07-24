import React, { useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";
import { Play } from "./Play";
import { parseEther } from "viem";
import { Solve } from "./Solve";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Outcome } from "./Outcome";
import { Loader2 } from "lucide-react";
import { CardTitle } from "./card";
import { get } from "http";

type ActionProps = {
  c2: number;
  gameStarter: string;
  gameJoiner: string;
  game: Address;
  stake: string;
  lastAction: number;
};

export const Action = ({
  c2,
  gameStarter,
  gameJoiner,
  game,
  stake,
  lastAction,
}: ActionProps) => {
  const { address } = useAccount();

  if (
    (c2 === 0 && gameStarter === address) ||
    (c2 > 0 && gameJoiner === address && parseEther(stake) > 0)
  ) {
    return (
      <div className="text-center font-bold">
        Opponents <br />
        Turn
      </div>
    );
  }

  if (c2 === 0 && gameJoiner === address && parseEther(stake) > 0) {
    return <Play game={game} stake={stake} />;
  }

  if (c2 > 0 && gameStarter === address && parseEther(stake) > 0) {
    return <Solve game={game} />;
  }

  if (stake === "0") {
    return <Outcome gameAddress={game} />;
  }
};
