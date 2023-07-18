"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { CardTitle } from "./ui/card";
import { deployContract, hashMove } from "@/lib/viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn, generateEnumValue } from "@/utils/helpers";
import { generateSalt } from "@/utils/salt";
import { db } from "@/lib/db";
import useLocalStorage from "@/hooks/useLocalStorage";

// Input Form Schema
const formSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Address must be a valid Ethereum address.",
  }),
  bet: z
    .number()
    .min(0.001, {
      message: "Bet amount must be greater than 0.",
    })
    .max(10, {
      message: "Bet amount must be less than or equal to 10.",
    }),
  move: z.enum(["rock", "paper", "scissors", "lizard", "spock"], {
    invalid_type_error: "Select a move",
    required_error: "Please select a move.",
  }),
});

export function ChallengeForm() {
  const { address: connectedAddress } = useAccount();
  const publicClient = usePublicClient();
  const { data } = useWalletClient();
  const [receipt, setReceipt] = useState<any>(null);
  const { toast } = useToast();
  const [state, setSaltAndMove] = useLocalStorage({
    key: "",
    initialValue: null,
  });

  //   Toast Notification
  useEffect(() => {
    if (receipt) {
      toast({
        className: "bg-transparent border border-white text-white",
        title: "Challenge Sent",
        description: "Contract address: " + receipt.contractAddress,
      });
    }
  }, [receipt]);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      bet: 0.001,
      move: "rock",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Clean Data
    const move = generateEnumValue(values.move);
    const salt = generateSalt();
    const address = values.address;
    const bet = values.bet;
    const hash = await hashMove(move!, salt, publicClient);
    console.log(hash);
    console.log(address);
    const walletClient = data!;

    // Deploy Contract
    try {
      const receipt = await deployContract(
        walletClient,
        [hash, address],
        publicClient,
        bet
      );
      if (receipt) {
        await db.lpush(connectedAddress!, receipt.contractAddress);
        await db.lpush(address, receipt.contractAddress);
      }
      setReceipt(receipt);

      const saltString = salt.toString();
      console.log(saltString);
      setSaltAndMove(receipt!.contractAddress as string, {
        saltString,
        move,
      });
    } catch (e) {
      console.log(e);
    }

    // Add Salt and Move to Local Storage
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 p-8 border rounded-md"
      >
        {" "}
        <CardTitle className=" text-3xl">Challenge a friend</CardTitle>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oponents Address</FormLabel>
              <FormControl>
                <Input placeholder="0x02..." {...field} />
              </FormControl>
              <FormDescription>
                This is your opponents ethereum address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How much would you like to bet</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormDescription>This is your bet amount.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="move"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your move?</FormLabel>
              <div className="relative  text-white">
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full appearance-none bg-transparent font-normal"
                    )}
                    {...field}
                  >
                    <option value="rock">Rock</option>
                    <option value="paper">Paper</option>
                    <option value="scissors">Scissors</option>
                    <option value="lizard">Lizard</option>
                    <option value="spock">Spock</option>
                  </select>
                </FormControl>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>This is your move</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full " type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
