import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { type } from "os";
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

export function Play({ game, stake }: PlayProps) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data } = useWalletClient();
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

    console.log("Move initiated");

    const hash = await playMove(
      gameAddress,
      move,
      walletClient,
      account,
      publicClient,
      stake
    );
    console.log(hash);
  };

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

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
