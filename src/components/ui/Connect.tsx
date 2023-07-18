"use client";

import React from "react";
import { Address, BaseError } from "viem";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { Button } from "./button";
import { InjectedConnector } from "wagmi/connectors/injected";

export function Connect() {
  const { connector, isConnected, address } = useAccount();
  const { data, isError } = useBalance({ address: address! });
  const { connect, error, isLoading } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const shortenAddress = (address: any) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="">
      {isConnected ? (
        <div className="p-2 space-y-2 max-w-[500px]">
          <div className="border-2  p-x4 py-3 text-center">
            Connected to: {shortenAddress(address!)}
          </div>
          <div className="flex justify-between space-x-1">
            <Button
              size="lg"
              variant="destructive"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
            <div className="  items-center justify-center m-auto h-11 rounded-md px-8 inline-flex border ">
              {data?.symbol} : {shortenAddress(data?.formatted)}
            </div>
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          className="bg-transparent border-2  "
          disabled={isLoading}
          onClick={() => connect()}
          variant="secondary"
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}

      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  );
}
