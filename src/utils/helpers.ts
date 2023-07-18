import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

type Commands = "lpush" | "lrange";

export async function fetchRedis(
  command: Commands,
  ...args: (string | number)[]
) {
  const commandUrl = `${UPSTASH_REDIS_URL}/${command}/${args.join("/")}`;

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateEnumValue(move: string): number {
  switch (move) {
    case "rock":
      return 1;
    case "paper":
      return 2;
    case "scissors":
      return 3;
    case "spock":
      return 4;
    case "lizard":
      return 5;
    default:
      return 0;
  }
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  return `${minutes}:${remSeconds < 10 ? "0" : ""}${remSeconds}`;
}
