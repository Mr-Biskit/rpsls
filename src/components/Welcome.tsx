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

type CardProps = React.ComponentProps<typeof Card>;

export const Welcome = ({ className, ...props }: CardProps) => {
  return (
    <Card
      className={cn(
        "w-[600px]",
        (className = "bg-transparent border border-gray-400 mx-auto")
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>
          Welcome to
          <br /> Rock, Paper, <br />
          Scissor, <br />
          Lizard, Spock
        </CardTitle>
        <CardDescription>Connect your wallet to start playing</CardDescription>
        <Link href="https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons">
          Learn the Rules
        </Link>
      </CardHeader>
      <CardContent>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
