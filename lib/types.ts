export interface MythMetadata {
    name?: string;
    description?: string;
    image?: string;
    attributes?: {
        trait_type: string;
        value: string;
    }[];
}

export interface Myth {
    tokenId: number;
    tokenURI: string;
    owner: string;
    lore: string[];
    interactions: number[];
    metadata: MythMetadata;
}

export interface MythActionResponse {
    imageUri: string;
    tokenUri: string;
}

