import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "./ui/card";

import Link from "next/link";
import { cn } from "@/utils/helpers";
import Image from "next/image";

type CardProps = React.ComponentProps<typeof Card>;

export const Welcome = ({ className, ...props }: CardProps) => {
  return (
    <Card
      className={cn(
        "w-[600px] justify-center items-center flex flex-col",
        (className = "bg-transparent border border-gray-400 mx-auto")
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-center">
          Welcome to
          <br /> Rock, Paper, <br />
          Scissor, <br />
          Lizard, Spock
        </CardTitle>
        <CardDescription className="text-center">
          Connect your wallet to start playing
        </CardDescription>
        <Link
          className="text-center"
          href="https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons"
        >
          Learn the Rules
        </Link>
      </CardHeader>
      <CardContent>
        <Image
          alt="Rock, Paper, Scissor, Lizard, Spock"
          className="rounded-md"
          src="/rpsls.png"
          width={600}
          height={200}
        />
        <p className="text-center font-bold">
          Please make sure you are connected to Sepolia Testnet
        </p>
        <p className="text-center font-bold">
          This Dapp does not update in realtime. After a game is created and you
          see a toast notfcation click the refresh button
        </p>
      </CardContent>
    </Card>
  );
};
