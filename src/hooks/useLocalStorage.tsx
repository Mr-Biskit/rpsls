import { useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";

type LocalStorageProps = {
  key: string;
  initialValue?: { salt: string; move: number } | null;
};

type CustomEthereumWindow = typeof window & {
  ethereum: {
    request: (request: { method: string }) => Promise<string[]>;
  };
};

const useLocalStorage = ({ key, initialValue }: LocalStorageProps) => {
  const { address } = useAccount();

  const [windowAddress, setWindowAddress] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      (window as CustomEthereumWindow).ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => setWindowAddress(accounts[0]))
        .catch((err) => console.log(err));
    }
  }, []);

  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setSaltAndMove = async (
    key: string,
    value: { salt: string; move: number }
  ) => {
    const normalizedWindowAddress = windowAddress?.toLowerCase().trim();
    const normalizedAddress = address?.toLowerCase().trim();
    try {
      if (windowAddress && normalizedWindowAddress !== normalizedAddress) {
        throw new Error("Unauthorized account access detected");
      }

      window.localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setSaltAndMove];
};

export default useLocalStorage;
