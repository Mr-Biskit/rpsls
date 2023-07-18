"use client";
import React, { Suspense, useRef } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "./ui/card";
import { readGameContract } from "@/lib/viem";
import { Address, usePublicClient, useAccount } from "wagmi";
import { formatEther, formatUnits } from "viem";
import { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { TimeOut } from "./ui/TimeOut";
import { Action } from "./ui/Action";
import { Loader2 } from "lucide-react";

type GameCardProps = {
  game: Address;
};

const TIMEOUT_MINUTES = 350000;

export const GameCard = ({ game }: GameCardProps) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [gameDetails, setGameDetails] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [timeOutFunction, setTimeOutFunction] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastAction, setLastAction] = useState<number>(0);

  // Game details set up. Allows the player to see their opponent address and what time out function needs to
  // be called for the player connected. Sets lastAction to show countdown timer.

  async function getGameDetails() {
    try {
      const gameDetails = await readGameContract(game, publicClient);
      if (gameDetails!.gameStarter === address) {
        setOpponent(gameDetails!.gameJoiner);
        setTimeOutFunction("j2Timeout");
      } else {
        setOpponent(gameDetails!.gameStarter);
        setTimeOutFunction("j1Timeout");
      }
      const lastAction = formatUnits(gameDetails!.lastAction, 0);
      setLastAction(parseInt(lastAction) * 1000);

      setGameDetails(gameDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getGameDetails();
    const intervalId = setInterval(getGameDetails, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex justify-between space-y-6 pb-2">
          <Loader2 className="animate-spin text-center" />
          <CardTitle className="text-sm font-medium text-center">
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex w-full">
      <Card className="w-3/4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {gameDetails.stake > 0 ? (
              <span className="text-sm font-medium">
                Stake: {formatEther(gameDetails.stake)}
              </span>
            ) : (
              <span className="text-sm font-medium">Stake Distributed</span>
            )}
          </CardTitle>
          {gameDetails.stake > 0 ? (
            // Countdown timer for the player to see how long they have left to make a move.
            // Conditional logic to show the TiemOut component if it is relevant to the player.
            <Countdown
              date={lastAction + TIMEOUT_MINUTES}
              renderer={(props) => {
                if (props.total > 0 && gameDetails.stake > 0) {
                  return (
                    <span>
                      Time left: {props.minutes}:{props.seconds < 10 ? "0" : ""}
                      {props.seconds}
                    </span>
                  );
                } else if (
                  gameDetails.c2 === 0 &&
                  address === gameDetails.gameStarter &&
                  gameDetails.stake > 0
                ) {
                  return <TimeOut game={game} functionName={timeOutFunction} />;
                } else if (
                  gameDetails.c2 > 0 &&
                  address === gameDetails.gameJoiner &&
                  gameDetails.stake > 0
                ) {
                  return <TimeOut game={game} functionName={timeOutFunction} />;
                } else {
                  return <span>Timeout Reached</span>;
                }
              }}
            />
          ) : (
            <span></span>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Opponent</div>
          <p className="text-xs text-muted-foreground">{opponent}</p>
        </CardContent>
      </Card>
      <Card className="flex items-center justify-center ml-2 p-4 w-1/4">
        <CardContent className=" flex items-center justify-center p-0 mx-auto">
          <Action
            c2={gameDetails.c2}
            gameJoiner={gameDetails.gameJoiner}
            gameStarter={gameDetails.gameStarter}
            game={game}
            stake={formatEther(gameDetails.stake)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
