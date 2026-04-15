"use client";

import React, { useState } from "react";
import Link from "next/link";
import WalletConnect from "../../components/WalletConnect";
import ForgeForm from "../../components/ForgeForm";

const ForgePage = () => {
    const [mintedTx, setMintedTx] = useState<string | null>(null);

    return (
        <main className="min-h-screen flex flex-col items-center justify-between p-8 relative overflow-hidden">
            {/* Celestial Background */}
            <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-mythic-purple/10 rounded-full blur-[150px] animate-pulse opacity-30"></div>
            <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-accent-orange/10 rounded-full blur-[150px] animate-float opacity-20"></div>

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
                    <Link href="/feed" className="text-[10px] font-mono text-accent-cyan hover:text-accent-orange transition-colors uppercase tracking-[0.4em] font-bold">
                        View Universe
                    </Link>
                    <WalletConnect />
                </div>
            </header>

            {/* Forge Content */}
            <section className="flex flex-col items-center max-w-4xl w-full space-y-12 z-20 py-10">
                {!mintedTx ? (
                    <div className="w-full flex flex-col items-center space-y-10 animate-fade-in">
                        <div className="text-center space-y-4">
                            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mythic-font">
                                Divine <span className="neon-gold text-accent-orange">Manifestation</span>
                            </h1>
                            <p className="text-[11px] text-accent-cyan/60 font-mono uppercase tracking-[0.3em] font-bold">
                                Shape the ether into eternal artifacts of the Nero Chain
                            </p>
                        </div>
                        <ForgeForm 
                            onMintSuccess={(hash) => {
                                setMintedTx(hash);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                        />
                    </div>
                ) : (
                    <div className="w-full max-w-2xl glass p-12 rounded-4xl border-accent-orange/20 glow-purple animate-enter-success flex flex-col items-center text-center space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent-orange to-transparent"></div>
                        
                        <div className="w-32 h-32 rounded-full border-2 border-accent-orange flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(255,215,0,0.4)] relative">
                            <span className="text-6xl">✨</span>
                            <div className="absolute inset-0 rounded-full border border-accent-cyan animate-ping opacity-20"></div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-5xl font-black tracking-tight uppercase text-accent-orange mythic-font neon-gold">
                                Myth Eternalized
                            </h2>
                            <p className="text-sm font-serif italic text-foreground/70 max-w-lg">
                                Your vision has achieved physical form on the Nero Chain. It shall remain inscribed in the eternal scrolls for all eons.
                            </p>
                        </div>

                        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex flex-col gap-6 w-full">
                           <a 
                             href={`https://testnet.neroscan.io/tx/${mintedTx}`} 
                             target="_blank" 
                             className="text-[11px] font-mono text-accent-cyan hover:text-white transition-all uppercase tracking-[0.2em] bg-white/5 py-4 rounded-xl border border-white/10 hover:border-accent-cyan/40"
                           >
                             Scroll of Transaction: {mintedTx.slice(0, 12)}...{mintedTx.slice(-12)}
                           </a>
                           
                           <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => setMintedTx(null)}
                                    className="flex-1 py-5 glass border border-accent-orange text-accent-orange font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:bg-accent-orange/10 transition-all hover:shadow-lg"
                                >
                                    New Manifestation
                                </button>
                                <Link href="/feed" className="flex-1">
                                    <button className="w-full py-5 bg-linear-to-r from-accent-cyan to-blue-500 text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                                        Enter Universe
                                    </button>
                                </Link>
                           </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center py-10 text-[10px] text-foreground/20 font-mono uppercase z-10 border-t border-white/5 mt-16">
                <span>Eternal Archive Node: Active</span>
                <span className="text-accent-cyan animate-glimmer tracking-[0.5em]">Transcending Reality...</span>
                <span>Stability AI • Pinata Cloud</span>
            </footer>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes enter-success {
                    from { opacity: 0; scale: 0.95; }
                    to { opacity: 1; scale: 1; }
                }
                .animate-enter-success {
                    animation: enter-success 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </main>
    );
};

export default ForgePage;

