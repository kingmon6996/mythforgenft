"use client";

import React, { useState, useEffect } from "react";
import { forgeMythicArtifact } from "../app/actions";
import { mintMyth } from "../lib/contract";
import Loader from "./Loader";
import ForgePreview from "./ForgePreview";

type Phase = "form" | "synthesizing" | "preview" | "minting";

interface SynthesisResult {
    imageUri: string;
    tokenUri: string;
}

const CATEGORIES = ["Hero", "Weapon", "Creature", "Artifact", "God/Goddess"];

const ForgeForm = ({ onMintSuccess }: { onMintSuccess?: (txHash: string) => void }) => {
    const [story, setStory] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [phase, setPhase] = useState<Phase>("form");
    const [statusMsg, setStatusMsg] = useState("");
    const [result, setResult] = useState<SynthesisResult | null>(null);
    const [error, setError] = useState("");
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        const checkWallet = async () => {
            if (typeof window === "undefined" || !window.ethereum) return;
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
                setWalletConnected(accounts && accounts.length > 0);
            } catch {
                setWalletConnected(false);
            }
        };
        checkWallet();

        if (typeof window !== "undefined" && window.ethereum) {
            window.ethereum.on("accountsChanged", (...args: unknown[]) => {
                const accounts = args[0] as string[];
                setWalletConnected(accounts && accounts.length > 0);
            });
        }
    }, []);

    const handleForge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!story || !category) return;

        setPhase("synthesizing");
        setError("");
        setStatusMsg("Stoking the celestial fires...");

        try {
            const data = await forgeMythicArtifact(story, category);
            setResult(data);
            setPhase("preview");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Manifestation failed";
            setError(msg);
            setPhase("form");
        }
    };

    const handleMint = async () => {
        if (!result) return;
        setPhase("minting");
        setError("");

        try {
            const tx = await mintMyth(result.tokenUri);
            if (onMintSuccess && tx) onMintSuccess(tx.hash || "");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Minting failed";
            setError(msg);
            setPhase("preview");
        }
    };

    const handleDiscard = () => {
        setResult(null);
        setPhase("form");
        setError("");
    };

    if (phase === "synthesizing") {
        return (
            <div className="w-full max-w-xl glass p-12 rounded-3xl border border-mythic-purple/20 flex flex-col items-center space-y-6 glow-purple">
                <Loader message={statusMsg} />
                <div className="space-y-2 text-center">
                    <p className="text-[10px] font-mono text-accent-cyan/60 uppercase tracking-[0.3em] animate-glimmer">
                        Manifesting Vision → Etheric Anchoring → Finalizing Lore
                    </p>
                </div>
            </div>
        );
    }

    if ((phase === "preview" || phase === "minting") && result) {
        return (
            <div className="w-full max-w-xl">
                {error && (
                    <div className="mb-4 glass px-4 py-3 rounded-xl border border-red-500/30">
                        <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">{error}</p>
                    </div>
                )}
                <ForgePreview
                    imageUri={result.imageUri}
                    category={category}
                    story={story}
                    onConfirm={handleMint}
                    onDiscard={handleDiscard}
                    isMinting={phase === "minting"}
                />
            </div>
        );
    }

    return (
        <form onSubmit={handleForge} className="w-full max-w-xl space-y-8 glass p-8 rounded-3xl border border-mythic-purple/20 glow-purple relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-mythic-purple/40 to-transparent"></div>
            
            <h2 className="text-4xl font-bold text-accent-orange uppercase tracking-tighter neon-gold mythic-font">
                The Infinite Forge
            </h2>

            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-accent-cyan font-mono uppercase tracking-[0.2em] ml-1">
                        Describe your Mythic Vision
                    </label>
                    <textarea
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="e.g., A celestial knight with wings made of burning stars, wielding a sword of pure silence..."
                        className="w-full bg-background/30 border border-mythic-purple/30 rounded-xl p-4 focus:outline-none focus:border-accent-cyan transition-all min-h-[140px] shadow-inner resize-none text-foreground placeholder:text-foreground/30 font-serif italic text-lg"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-accent-cyan font-mono uppercase tracking-[0.2em] ml-1">
                        Select Essence Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`py-2 px-3 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                                    category === cat 
                                    ? "bg-accent-orange text-black border-accent-orange" 
                                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest px-1">{error}</p>
            )}

            {!walletConnected && (
                <div className="flex items-center gap-3 glass p-3 rounded-xl border border-accent-orange/30 bg-accent-orange/5 animate-pulse">
                    <span className="text-accent-orange text-sm">⚔</span>
                    <p className="text-[10px] font-mono text-accent-orange/80 uppercase tracking-wider">
                        Connect thy wallet to forge eternal artifacts on Nero Chain
                    </p>
                </div>
            )}

            <div className="flex flex-col items-center gap-4">
                <button
                    type="submit"
                    disabled={!story || !walletConnected}
                    className="w-full py-5 bg-linear-to-r from-accent-orange to-[#FF8C00] text-black font-black uppercase tracking-[0.4em] rounded-xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all active:scale-95 disabled:grayscale disabled:opacity-50 relative group overflow-hidden"
                >
                    <span className="relative z-10">✦ Forge Manifestation</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <p className="text-[9px] text-foreground/40 font-mono text-center max-w-xs leading-relaxed uppercase tracking-tighter">
                    Vision synthesized by Stability AI • Pulsed through IPFS • Eternalized on Nero Chain
                </p>
            </div>
        </form>
    );
};

export default ForgeForm;
