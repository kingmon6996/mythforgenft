import { ethers } from "ethers";

export const NERO_CHAIN_ID = "0x2b1"; // 689 decimal — Nero Chain Testnet
export const NERO_CHAIN_NAME = "Nero Chain Testnet";
export const NERO_RPC_URL = "https://rpc-testnet.nerochain.io";
export const NERO_SYMBOL = "NERO";
export const NERO_EXPLORER = "https://testnet.neroscan.io";

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install MetaMask.");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Check if on Nero Chain
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (chainId !== NERO_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NERO_CHAIN_ID }],
        });
      } catch (switchError: unknown) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (typeof switchError === 'object' && switchError !== null && 'code' in switchError && (switchError as {code: number}).code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: NERO_CHAIN_ID,
                chainName: NERO_CHAIN_NAME,
                nativeCurrency: {
                  name: "NERO",
                  symbol: NERO_SYMBOL,
                  decimals: 18,
                },
                rpcUrls: [NERO_RPC_URL],
                blockExplorerUrls: [NERO_EXPLORER],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error: unknown) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

export const getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider(NERO_RPC_URL);
};

export const getSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
};

export const getAddress = async () => {
    const signer = await getSigner();
    return await signer.getAddress();
};

export const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
