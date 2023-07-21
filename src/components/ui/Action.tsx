import React, { useEffect, useState } from "react";

import { Address, useAccount } from "wagmi";
import { Play } from "./Play";
import { parseEther } from "viem";
import { Solve } from "./Solve";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Outcome } from "./Outcome";
import { set } from "zod";

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
  const [gameData] = useLocalStorage({
    key: game as string,
    initialValue: null,
  });
  const [moveFromStorage, setMoveFromStorage] = useState(() => gameData?.move);
  const [saltFromStorage, setSaltFromStorage] = useState(
    () => gameData?.saltString
  );

  useEffect(() => {
    if (gameData) {
      setMoveFromStorage(gameData.move);
      setSaltFromStorage(gameData.saltString);
    }
  }, [gameData]);

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
    if (moveFromStorage && saltFromStorage) {
      return (
        <Solve game={game} move={moveFromStorage} salt={saltFromStorage} />
      );
    } else {
      setMoveFromStorage(gameData?.move);
      setSaltFromStorage(gameData?.saltString);
      return (
        <Solve game={game} move={moveFromStorage} salt={saltFromStorage} />
      );
    }
  }

  if (stake === "0") {
    return <Outcome gameAddress={game} />;
  }
};
