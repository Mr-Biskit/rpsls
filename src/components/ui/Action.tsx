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
};

// This component manages the different states of a game.

export const Action = ({
  c2,
  gameStarter,
  gameJoiner,
  game,
  stake,
}: ActionProps) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gameData] = useLocalStorage({
    key: game as string,
    initialValue: null,
  });
  const [moveFromStorage, setMoveFromStorage] = useState();
  const [saltFromStorage, setSaltFromStorage] = useState();

  const getLocalStorage = async () => {
    try {
      setIsLoading((prevIsLoading) => true);
      setMoveFromStorage(gameData.move);
      setSaltFromStorage(gameData.saltString);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prevIsLoading) => false);
    }
  };

  useEffect(() => {
    if (c2 > 0 && gameStarter === address && parseEther(stake) > 0) {
      if (gameData) {
        getLocalStorage();
      }
    }
  }, [gameData, c2, gameStarter, address, stake]);

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
    if (isLoading) {
      return (
        <>
          <Loader2 className="animate-spin text-center" />
          <CardTitle className="text-sm font-medium text-center">
            Loading...
          </CardTitle>
        </>
      );
    } else {
      return (
        <Solve game={game} move={moveFromStorage!} salt={saltFromStorage!} />
      );
    }
  }

  if (stake === "0") {
    return <Outcome gameAddress={game} />;
  }
};
