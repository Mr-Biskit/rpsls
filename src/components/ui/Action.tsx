import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Address, useAccount } from "wagmi";
import { Play } from "./Play";
import { parseEther } from "viem";
import { Solve } from "./Solve";
import useLocalStorage from "@/hooks/useLocalStorage";

type ActionProps = {
  c2: number;
  gameStarter: string;
  gameJoiner: string;
  game: Address;
  stake: string;
};

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

  useEffect(() => {
    if (gameData) {
      setMoveFromStorage(gameData.move);
      setSaltFromStorage(gameData.saltString);
    }
  }, [gameData]);

  const [moveFromStorage, setMoveFromStorage] = useState();
  const [saltFromStorage, setSaltFromStorage] = useState();

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
      // Handle the case where salt and move are not available.
      return <div>No move and/or salt from storage found!</div>;
    }
  }

  if (stake === "0") {
    return <div className="text-center font-bold">Game Concluded</div>;
  }
};