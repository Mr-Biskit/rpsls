import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const config = {
  apiKey: ALCHEMY_API_KEY!,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

export const getInternalTransactions = async (gameAddress: string) => {
  const res = await alchemy.core.getAssetTransfers({
    fromAddress: gameAddress,
    category: [AssetTransfersCategory.INTERNAL],
  });

  if (res.transfers.length === 2) {
    return gameAddress;
  }
  if (res.transfers.length === 1) {
    return res.transfers[0].to;
  }
};
