"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "./ui/card";
import { Address, useAccount } from "wagmi";
import { GameCard } from "./GameCard";
import { useState } from "react";
import { fetchRedis } from "@/utils/helpers";
import { RotateCw } from "lucide-react";
import { Button } from "./ui/button";

// This component displays the current games for a user in a card format.

export const Dashboard = () => {
  const [games, setGames] = useState<Address[]>([]);
  const { address } = useAccount();

  const getGames = async () => {
    const games = await fetchRedis("lrange", address!.toString(), 0, -1);
    setGames(games);
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Games</CardTitle>
          <CardDescription>Current Games</CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            getGames();
          }}
        >
          <RotateCw />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex-col flex items-center space-y-2 rounded-md border p-2">
          {games.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
