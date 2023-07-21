import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { cn, generateEnumValue } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  Address,
  WalletClient,
} from "wagmi";
import { playMove } from "@/lib/viem";

type PlayProps = {
  game: Address;
  stake: string;
};

const formSchema = z.object({
  move: z.enum(["rock", "paper", "scissors", "lizard", "spock"], {
    invalid_type_error: "Select a move",
    required_error: "Please select a move.",
  }),
});

// This component provides the ability to make a move in a game.
export function Play({ game, stake }: PlayProps) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data } = useWalletClient();

  // The form is setup using the useForm hook and is initially set to "rock".
  // The form requires that the user input a move, which must be one of "rock", "paper", "scissors", "lizard", or "spock".
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      move: "rock",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const gameAddress: Address = game;
    const move = generateEnumValue(values.move);
    const walletClient: WalletClient = data!;
    const account: Address = address!;

    const hash = await playMove(
      gameAddress,
      move,
      walletClient,
      account,
      publicClient,
      stake
    );
  };

  // The Play component renders a sheet that asks the user if they would like to accept the challenge.
  // The sheet includes a form that the user can use to submit their move.
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Play</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Challenge</SheetTitle>
          <SheetDescription>
            Would you like to accept the challenge?
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="move"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your move?</FormLabel>
                  <div className="relative ">
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
                  <Button type="submit">Submit</Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
