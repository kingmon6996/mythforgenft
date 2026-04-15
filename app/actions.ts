"use server";

import axios from "axios";
import { MythActionResponse } from "@/lib/types";

const STABILITY_API_KEY = process.env.NEXT_STABILITY_API;
const PINATA_JWT = process.env.NEXT_PINATA_JWT;

/**
 * Single server action that:
 * 1. Generates image via Stability AI (Mythic theme)
 * 2. Uploads image to IPFS via Pinata
 * 3. Uploads metadata to IPFS via Pinata
 * 4. Returns tokenURI
 */
export async function forgeMythicArtifact(
    story: string,
    category: string
): Promise<MythActionResponse> {
    if (!STABILITY_API_KEY) throw new Error("Stability API Key is missing");
    if (!PINATA_JWT) throw new Error("Pinata JWT is missing");

    // Step 1: Generate image via Stability AI
    let base64Image: string;
    try {
        const engineId = "stable-diffusion-xl-1024-v1-0";
        const url = `https://api.stability.ai/v1/generation/${engineId}/text-to-image`;

        const response = await axios.post(
            url,
            {
                text_prompts: [
                    {
                        text: `Mythological ${category}, high-fantasy art, cinematic lighting, ethereal, magical atmosphere, intricate detail, professional concept art, ${story}`,
                        weight: 1,
                    },
                    {
                        text: "blurry, low quality, distorted, modern technology, cars, buildings, text, watermark",
                        weight: -1
                    }
                ],
                cfg_scale: 8,
                height: 1024,
                width: 1024,
                steps: 40,
                samples: 1,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${STABILITY_API_KEY}`,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`Stability AI Error: ${response.statusText}`);
        }

        base64Image = response.data.artifacts[0].base64;
    } catch (error: unknown) {
        console.error("AI Generation failed:", error);
        throw new Error("The Forge failed to manifest your vision. Try again.");
    }

    // Step 2 & 3: Upload image and metadata to IPFS
    try {
        const imageBuffer = Buffer.from(base64Image, "base64");
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: "image/png" });
        formData.append("file", blob, "myth.png");
        formData.append("pinataMetadata", JSON.stringify({ name: `MythForge-${category}-${Date.now()}` }));

        const imgRes = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const imageUri = `ipfs://${imgRes.data.IpfsHash}`;

        // Upload metadata JSON to Pinata
        const metadata = {
            name: `Mythic ${category} #${Date.now().toString().slice(-4)}`,
            description: story,
            image: imageUri,
            attributes: [
                { trait_type: "Category", value: category },
                { trait_type: "Origin", value: "The Infinite Forge" },
            ],
        };

        const jsonRes = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            metadata,
            {
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            imageUri,
            tokenUri: `ipfs://${jsonRes.data.IpfsHash}`,
        };
    } catch (error: unknown) {
        console.error("IPFS Upload failed:", error);
        throw new Error("Failed to anchor your myth in the eternal scrolls (IPFS).");
    }
}

