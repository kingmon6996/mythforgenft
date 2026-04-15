"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Myth } from "../lib/types";
import { addLore, interact } from "../lib/contract";

const MythCard = ({ myth }: { myth: Myth }) => {
    const { tokenId, owner, lore, interactions, metadata } = myth;
    const [newLore, setNewLore] = useState("");
    const [targetId, setTargetId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLore, setShowLore] = useState(false);

    const imageUrl = metadata?.image ?? "";
    const category = metadata?.attributes?.find(a => a.trait_type === "Category")?.value || "Artifact";

    const handleAddLore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLore) return;
        setIsSubmitting(true);
        try {
            await addLore(tokenId, newLore);
            setNewLore("");
            alert("Lore successfully inscribed in the eternal records!");
        } catch (err) {
            console.error(err);
            alert("The scribes failed to record your lore.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInteract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetId) return;
        setIsSubmitting(true);
        try {
            await interact(tokenId, Number(targetId));
            setTargetId("");
            alert("The myths have intertwined! A new thread in the universe is born.");
        } catch (err) {
            console.error(err);
            alert("The interaction was rejected by the cosmic forces.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="group relative overflow-hidden glass rounded-3xl border border-mythic-purple/20 hover:border-mythic-purple/50 transition-all duration-700 glow-purple/10 flex flex-col">
            {/* Image Container */}
            <div className="aspect-square w-full overflow-hidden relative bg-black/60">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={`Myth #${tokenId}`}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl opacity-20">📜</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80"></div>

                {/* Category Tag */}
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full border border-accent-orange/30 shadow-lg">
                    <span className="text-[10px] font-black text-accent-orange uppercase tracking-widest">{category}</span>
                </div>

                {/* ID Tag */}
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full border border-accent-cyan/30 shadow-lg">
                    <span className="text-[10px] font-mono text-accent-cyan uppercase italic">ID: {tokenId}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white mythic-font uppercase tracking-tight group-hover:neon-gold transition-colors">
                        {metadata?.name || `Mythic Artifact #${tokenId}`}
                    </h3>
                    <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-[0.2em] truncate">
                        Guardian: {owner.slice(0, 6)}...{owner.slice(-4)}
                    </p>
                </div>

                <p className="text-xs text-foreground/70 font-serif italic line-clamp-2 min-h-10">
                    {metadata?.description || "No vision recorded for this artifact..."}
                </p>

                {/* Interaction Stats */}
                <div className="flex gap-4 py-2 border-y border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-accent-cyan font-mono uppercase">Lore Entries</span>
                        <span className="text-sm font-bold text-white">{lore.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-accent-orange font-mono uppercase">Threads</span>
                        <span className="text-sm font-bold text-white">{interactions.length}</span>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                    <button 
                        onClick={() => setShowLore(!showLore)}
                        className="py-2 px-3 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white/70"
                    >
                        {showLore ? "Close Records" : "Read Lore"}
                    </button>
                    <div className="flex gap-1">
                        <input
                            type="number"
                            placeholder="Target ID"
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="w-16 bg-white/5 border border-white/10 rounded-l-lg text-[10px] px-2 focus:outline-none focus:border-mythic-purple/50 text-white"
                        />
                        <button 
                            onClick={handleInteract}
                            disabled={isSubmitting || !targetId}
                            className="flex-1 py-2 px-1 bg-mythic-purple text-white rounded-r-lg text-[9px] font-bold uppercase tracking-tighter hover:bg-mythic-purple/80 transition-all disabled:opacity-30 disabled:grayscale"
                        >
                            🔗 Interact
                        </button>
                    </div>
                </div>

                {/* Lore Input */}
                <form onSubmit={handleAddLore} className="flex gap-1">
                    <input
                        type="text"
                        placeholder="Add new lore..."
                        value={newLore}
                        onChange={(e) => setNewLore(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-l-lg text-[10px] px-3 py-2 focus:outline-none focus:border-accent-cyan/50 text-white/80"
                    />
                    <button 
                        type="submit"
                        disabled={isSubmitting || !newLore}
                        className="px-3 bg-accent-cyan text-black rounded-r-lg text-[9px] font-bold uppercase hover:bg-accent-cyan/80 transition-all disabled:opacity-30"
                    >
                        Inscribe
                    </button>
                </form>

                {/* Lore Overlay/Expanded */}
                {showLore && (
                    <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-[9px] font-bold text-mythic-purple uppercase tracking-[0.3em] border-b border-white/10 pb-1">Historical Records</h4>
                        {lore.length > 0 ? (
                            <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {lore.map((entry, i) => (
                                    <p key={i} className="text-[10px] text-foreground/60 font-serif border-l border-mythic-purple/30 pl-2 py-1 leading-relaxed italic">
                                        &ldquo;{entry}&rdquo;
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] text-foreground/30 font-mono uppercase text-center py-4">No lore inscribed yet.</p>
                        )}
                        {interactions.length > 0 && (
                            <div className="mt-4 space-y-1">
                                <h4 className="text-[9px] font-bold text-accent-orange uppercase tracking-[0.3em] border-b border-white/10 pb-1">Universe Threads</h4>
                                <div className="flex flex-wrap gap-1 pt-1 text-[8px] font-mono text-accent-orange/60">
                                    Linked to: {interactions.join(", ")}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-full bg-linear-to-r from-transparent via-mythic-purple to-transparent opacity-30"></div>
        </div>
    );
};

export default MythCard;
