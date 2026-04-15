"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WalletConnect from "../../components/WalletConnect";
import MythCard from "../../components/MythCard";
import Loader from "../../components/Loader";
import { Myth } from "../../lib/types";

const UniversePage = () => {
    const [myths, setMyths] = useState<Myth[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [essenceStats, setEssenceStats] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadUniverse = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/feed");
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
                }
                const { myths: data } = await res.json() as { myths: Myth[] };
                setMyths(data);

                const stats: Record<string, number> = {};
                data.forEach((myth) => {
                    const category = myth.metadata?.attributes?.find(a => a.trait_type === "Category")?.value || "Artifact";
                    stats[category] = (stats[category] || 0) + 1;
                });
                setEssenceStats(stats);
            } catch (err: unknown) {
                console.error("Universe loading failed:", err);
                setError(err instanceof Error ? err.message : "The cosmic records are unreachable.");
            } finally {
                setLoading(false);
            }
        };

        loadUniverse();
    }, []);

    const topEssences = Object.entries(essenceStats)
        .sort((a, b) => b[1] - a[1]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-between p-8 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-mythic-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-accent-orange/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center z-10 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 border-2 border-mythic-purple rotate-45 flex items-center justify-center animate-glimmer shadow-[0_0_15px_rgba(157,78,221,0.3)]">
                            <span className="text-accent-orange -rotate-45 font-black text-xl mythic-font">M</span>
                        </div>
                        <span className="text-2xl font-black tracking-widest uppercase text-white mythic-font">
                            MythForge<span className="text-mythic-purple">NFT</span>
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/create" className="text-[10px] font-mono text-accent-cyan hover:text-white transition-colors uppercase tracking-[0.4em] font-bold">
                        Enter The Forge
                    </Link>
                    <WalletConnect />
                </div>
            </header>

            {/* Universe Content */}
            <section className="flex flex-col items-center max-w-7xl w-full space-y-12 z-20 py-10">
                <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Sidebar — Essence Activity */}
                    <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
                        <div className="glass p-8 rounded-4xl border border-mythic-purple/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent-orange to-transparent opacity-30"></div>
                            <h2 className="text-sm font-black text-accent-orange uppercase tracking-[0.2em] mb-8 neon-gold mythic-font">
                                Active Essences
                            </h2>
                            <div className="space-y-6">
                                {topEssences.length > 0 ? topEssences.map(([essence, count], idx) => (
                                    <div key={idx} className="flex flex-col gap-2 font-mono text-[9px] uppercase">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/80 tracking-widest">{essence}</span>
                                            <span className="text-accent-cyan">{count} Manifested</span>
                                        </div>
                                        <div className="h-px w-full bg-white/5 relative">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-linear-to-r from-mythic-purple to-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.5)]"
                                                style={{ width: `${Math.min((count / myths.length) * 100 || 0, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-[10px] text-accent-cyan/40 font-mono uppercase tracking-widest">
                                        {loading ? "Scanning Void..." : "No myths manifested yet"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-mythic-purple/10 bg-mythic-purple/5 relative group">
                            <p className="text-[10px] font-mono uppercase text-accent-cyan/80 leading-relaxed mb-6 italic">
                                &ldquo;Every myth is a thread in the collective tapestry of the universe.&rdquo;
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-accent-orange uppercase tracking-widest italic opacity-60">
                                    Reality Sync: {loading ? "Decoding..." : "Harmonized"}
                                </span>
                                <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                            </div>
                        </div>

                        {/* Stats summary */}
                        <div className="glass p-6 rounded-2xl border border-white/5 text-center group hover:border-mythic-purple/30 transition-colors">
                            <p className="text-4xl font-black text-white mythic-font group-hover:neon-gold transition-all">{myths.length}</p>
                            <p className="text-[9px] font-mono text-foreground/40 uppercase tracking-[0.3em] mt-2">
                                Eternal Artifacts
                            </p>
                        </div>
                    </aside>

                    {/* Main Universe Grid */}
                    <div className="lg:col-span-3 space-y-12 order-1 lg:order-2">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                            <div className="space-y-3">
                                <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mythic-font">
                                    The Universal <span className="text-accent-orange neon-gold">Mythos</span>
                                </h1>
                                <p className="text-[11px] text-accent-cyan/60 font-mono uppercase tracking-[0.3em] font-bold">
                                    Echoes of manifestations from across the Nero Chain
                                </p>
                            </div>
                            <div className="flex items-center gap-6 text-[9px] font-mono uppercase text-foreground/40 font-bold tracking-widest">
                                <span className="text-accent-cyan">Chronological Order</span>
                                <div className="w-px h-4 bg-white/10" />
                                <span>{myths.length} Records Manifested</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-24 flex justify-center w-full">
                                <Loader message="Harmonizing universe frequencies..." />
                            </div>
                        ) : error ? (
                            <div className="py-24 text-center glass rounded-4xl border border-red-500/20 p-12 glow-purple">
                                <p className="text-red-400 font-mono text-sm uppercase tracking-widest mb-4 font-bold">
                                    Cosmic Resonance Lost
                                </p>
                                <p className="text-red-400/60 font-mono text-[10px] uppercase mb-8 max-w-md mx-auto">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-[10px] font-mono text-accent-cyan uppercase hover:text-white transition-all border border-accent-cyan/30 px-8 py-3 rounded-full hover:bg-accent-cyan/10"
                                >
                                    Re-align Consciousness
                                </button>
                            </div>
                        ) : myths.length === 0 ? (
                            <div className="py-40 text-center glass rounded-4xl border border-white/5 p-16 relative group">
                                <div className="absolute inset-0 bg-radial-to-c from-mythic-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <p className="text-7xl mb-8 animate-float">🏺</p>
                                <p className="text-foreground/30 font-mono text-sm uppercase tracking-[0.4em] mb-10">
                                    The Void awaits your creation
                                </p>
                                <Link href="/create">
                                    <button className="px-12 py-4 bg-accent-orange text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-full hover:scale-110 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                                        Forge The First Myth
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
                                {myths.map((myth, idx) => (
                                    <MythCard key={idx} myth={myth} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center py-10 gap-6 text-[10px] text-foreground/20 font-mono uppercase z-10 border-t border-white/5 mt-16 font-bold">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></div>
                    <span className="tracking-widest">Resonance: Stable [99%]</span>
                </div>
                <span className="mythic-font tracking-[0.3em] opacity-40">Witnessing the birth of a new reality</span>
                <span className="tracking-widest">Transmitted via Nero-Node-01</span>
            </footer>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </main>
    );
};

export default UniversePage;
