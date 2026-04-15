import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { mythForgeNFTAbi } from "@/lib/abi";

export const CONTRACT_ADDRESS = "0x6058cE4C2884586b4BBB60dA6Cb905cD500A656B";
const NERO_RPC = "https://rpc-testnet.nerochain.io";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

function resolveIpfs(uri: string): string {
    if (!uri) return "";
    if (uri.startsWith("ipfs://")) {
        return `${PINATA_GATEWAY}/${uri.replace("ipfs://", "")}`;
    }
    return uri;
}

export async function GET() {
    try {
        const provider = new ethers.JsonRpcProvider(NERO_RPC);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, mythForgeNFTAbi, provider);

        const totalCounter = await contract.tokenCounter();
        const total = Number(totalCounter);

        if (total === 0) {
            return NextResponse.json({ myths: [] });
        }

        const ids = Array.from({ length: total }, (_, i) => i + 1);

        const myths = await Promise.all(
            ids.map(async (tokenId) => {
                try {
                    const [tokenURI, owner, lore, interactions] = await Promise.all([
                        contract.tokenURI(tokenId),
                        contract.ownerOf(tokenId),
                        contract.getLore(tokenId),
                        contract.getInteractions(tokenId),
                    ]);

                    let metadata: Record<string, unknown> = {};
                    const metadataUrl = resolveIpfs(tokenURI as string);
                    if (metadataUrl) {
                        try {
                            const res = await fetch(metadataUrl, {
                                next: { revalidate: 3600 },
                            });
                            if (res.ok) {
                                metadata = await res.json();
                            }
                        } catch {
                            // Ignored
                        }
                    }

                    const rawImage = metadata.image as string | undefined;
                    const imageUrl = resolveIpfs(rawImage ?? "");

                    return {
                        tokenId,
                        tokenURI: tokenURI as string,
                        owner: owner as string,
                        lore: lore as string[],
                        interactions: interactions.map((id: bigint) => Number(id)),
                        metadata: {
                            ...metadata,
                            image: imageUrl,
                        },
                    };
                } catch (err) {
                    console.error(`Error fetching myth ${tokenId}:`, err);
                    return null;
                }
            })
        );

        const validMyths = myths.filter(Boolean).reverse();

        return NextResponse.json({ myths: validMyths });
    } catch (err) {
        console.error("Feed API error:", err);
        return NextResponse.json(
            { error: "Failed to fetch myths from Nero Chain" },
            { status: 500 }
        );
    }
}

