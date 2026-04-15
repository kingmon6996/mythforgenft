"use client";

import React from "react";
import Image from "next/image";

interface ForgePreviewProps {
    imageUri: string;
    category: string;
    story: string;
    onConfirm: () => void;
    onDiscard: () => void;
    isMinting: boolean;
}

const ForgePreview = ({
    imageUri,
    category,
    story,
    onConfirm,
    onDiscard,
    isMinting
}: ForgePreviewProps) => {
    // Helper to resolve IPFS for the preview image
    const imageUrl = imageUri.startsWith("ipfs://") 
        ? `https://gateway.pinata.cloud/ipfs/${imageUri.replace("ipfs://", "")}`
        : imageUri;

    return (
        <div className="w-full glass rounded-3xl overflow-hidden border border-mythic-purple/30 glow-purple animate-in fade-in zoom-in duration-500">
            <div className="relative aspect-square w-full group">
                <Image
                    src={imageUrl}
                    alt="Mythic Manifestation"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-4 right-4 bg-accent-orange text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {category}
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white mythic-font uppercase tracking-tight">
                        Manifestation Result
                    </h3>
                    <p className="text-sm text-foreground/70 font-serif italic line-clamp-3">
                        &ldquo;{story}&rdquo;
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onDiscard}
                        disabled={isMinting}
                        className="flex-1 py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        Discard Vision
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isMinting}
                        className="flex-2 py-3 bg-accent-cyan text-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all disabled:opacity-50 relative overflow-hidden group"
                    >
                        <span className="relative z-10">
                            {isMinting ? "Eternalizing..." : "✦ Eternalize Myth"}
                        </span>
                        {isMinting && (
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        )}
                    </button>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-center text-foreground/30 font-mono uppercase tracking-widest leading-relaxed">
                        By eternalizing, you record this manifestation on the Nero Chain for all eons.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgePreview;
