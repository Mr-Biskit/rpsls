import { configureChains, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyProvider } from "wagmi/providers/alchemy";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY! }), publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new MetaMaskConnector({ chains })],
});
