import {
  Abi,
  Address,
  BaseError,
  ContractFunctionRevertedError,
  parseEther,
  stringify,
  parseAbi,
} from "viem";
import { sepolia } from "viem/chains";
import "viem/window";
import { PublicClient, WalletClient } from "wagmi";
import { rpslsContractAbi, hasherContract, rpslsBytecode } from "@/contract";

export const deployContract = async (
  walletClient: WalletClient,
  args: any,
  publicClient: PublicClient,
  value: number
) => {
  const [address] = await walletClient.requestAddresses();
  console.log(`Deploying contract from address ${address}`);
  console.log(
    `Deploying contract with args ${stringify(args)} and value ${value}`
  );
  try {
    const hash = await walletClient.deployContract({
      abi: rpslsContractAbi,
      bytecode: rpslsBytecode,
      account: address,
      args,
      value: await parseEther(value.toString()),
      chain: sepolia,
    });
    console.log(`Deploying contract with hash ${hash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Contract deployed at ${receipt.contractAddress}`);
    return receipt;
  } catch (error) {
    console.error(error);
  }
};

export async function hashMove(
  move: number,
  salt: bigint,
  publicClient: PublicClient
) {
  const hash = await publicClient.readContract({
    address: "0x62324118bC9ccfE7A4516488A25FC883A07B6dC8",
    abi: hasherContract.abi,
    functionName: "hash",
    args: [move, salt],
  });

  return hash;
}

export async function readGameContract(
  address: Address,
  publicClient: PublicClient
) {
  try {
    const gameStarter = await publicClient.readContract({
      address,
      abi: rpslsContractAbi,
      functionName: "j1",
    });
    const gameJoiner = await publicClient.readContract({
      address,
      abi: rpslsContractAbi,
      functionName: "j2",
    });
    const stake = await publicClient.readContract({
      address,
      abi: rpslsContractAbi,
      functionName: "stake",
    });
    const lastAction = await publicClient.readContract({
      address,
      abi: rpslsContractAbi,
      functionName: "lastAction",
    });
    const c2 = await publicClient.readContract({
      address,
      abi: rpslsContractAbi,
      functionName: "c2",
    });
    return {
      gameStarter,
      gameJoiner,
      stake,
      lastAction,
      c2,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function playMove(
  address: Address,
  move: number,
  walletClient: WalletClient,
  account: Address,
  publicClient: PublicClient,
  stake: string
) {
  let request;
  // Simulate the Contract Function Call
  try {
    console.log("Simulating contract function call");
    const simulateContractResponse = await publicClient.simulateContract({
      address: address,
      abi: rpslsContractAbi,
      functionName: "play",
      account,
      args: [move],
      value: parseEther(stake),
      chain: sepolia,
    });

    request = simulateContractResponse.request;
  } catch (err) {
    console.log(err);
    return;
  }
  try {
    const hash = await walletClient.writeContract(request!);
    console.log(`Transaction hash: ${hash}`);
  } catch (err) {
    console.error("Error while executing contract:", err);
  }
}

export async function solveGame(
  address: Address,
  account: Address,
  salt: any,
  move: number,
  walletClient: WalletClient,
  publicClient: PublicClient
) {
  let request;
  // Simulate the Contract Function Call
  try {
    console.log("Simulating contract function call");
    const simulateContractResponse = await publicClient.simulateContract({
      address: address,
      abi: rpslsContractAbi,
      functionName: "solve",
      account: account,
      args: [move, salt],
      chain: sepolia,
    });
    console.log(simulateContractResponse.request);
    request = simulateContractResponse.request;
  } catch (err) {
    console.log(err);
    return;
  }
  try {
    const hash = await walletClient.writeContract(request!);
    const tx = await publicClient.getTransaction({ hash });
    console.log(tx);

    console.log(`Transaction hash: ${hash}`);
    return hash;
  } catch (err) {
    console.error("Error while executing contract:", err);
  }
}
