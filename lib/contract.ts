import { ethers } from "ethers";
import { mythForgeNFTAbi } from "./abi";

export const CONTRACT_ADDRESS = "0x6058cE4C2884586b4BBB60dA6Cb905cD500A656B";
const NERO_RPC = "https://rpc-testnet.nerochain.io";

export const getContract = async (signerOrProvider: ethers.Signer | ethers.Provider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, mythForgeNFTAbi, signerOrProvider);
};

export const mintMyth = async (tokenURI: string) => {
    if (typeof window === "undefined" || !window.ethereum) throw new Error("Wallet not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);

    const tx = await contract.mintMyth(tokenURI);
    return await tx.wait();
};

export const addLore = async (tokenId: number, loreText: string) => {
    if (typeof window === "undefined" || !window.ethereum) throw new Error("Wallet not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);

    const tx = await contract.addLore(tokenId, loreText);
    return await tx.wait();
};

export const interact = async (fromTokenId: number, toTokenId: number) => {
    if (typeof window === "undefined" || !window.ethereum) throw new Error("Wallet not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);

    const tx = await contract.interact(fromTokenId, toTokenId);
    return await tx.wait();
};

export const getLore = async (tokenId: number) => {
    const provider = new ethers.JsonRpcProvider(NERO_RPC);
    const contract = await getContract(provider);
    return await contract.getLore(tokenId);
};

export const getInteractions = async (tokenId: number) => {
    const provider = new ethers.JsonRpcProvider(NERO_RPC);
    const contract = await getContract(provider);
    return await contract.getInteractions(tokenId);
};

export const getTokenCounter = async () => {
    const provider = new ethers.JsonRpcProvider(NERO_RPC);
    const contract = await getContract(provider);
    return await contract.tokenCounter();
};

export const fetchAllMyths = async () => {
    const provider = new ethers.JsonRpcProvider(NERO_RPC);
    const contract = await getContract(provider);

    const totalCounter = await contract.tokenCounter();
    const total = Number(totalCounter);
    const myths = [];

    // Resolve IPFS helper (client-side)
    const resolveIpfs = (uri: string) => {
        if (!uri) return "";
        if (uri.startsWith("ipfs://")) {
            return `https://gateway.pinata.cloud/ipfs/${uri.replace("ipfs://", "")}`;
        }
        return uri;
    };

    for (let i = 1; i <= total; i++) {
        try {
            const uri = await contract.tokenURI(i);
            const owner = await contract.ownerOf(i);
            const lore = await contract.getLore(i);
            const interactions = await contract.getInteractions(i);

            let metadata = {};
            const res = await fetch(resolveIpfs(uri));
            if (res.ok) {
                metadata = await res.json();
            }

            myths.push({
                tokenId: i,
                tokenURI: uri,
                owner,
                lore,
                interactions: interactions.map((id: bigint) => Number(id)),
                metadata
            });
        } catch (e) {
            console.error(`Error fetching myth ${i}:`, e);
        }
    }

    return myths.reverse();
};

