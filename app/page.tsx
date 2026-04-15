"use client";

import React from "react";
import Link from "next/link";
import WalletConnect from "../components/WalletConnect";

const LandingPage = () => {
    return (
        <main className="min-h-screen flex flex-col items-center justify-between p-8 relative overflow-hidden">
            {/* Celestial Background */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-accent-cyan to-transparent animate-pulse opacity-40"></div>
            <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] bg-mythic-purple/10 rounded-full blur-[120px] animate-float opacity-40"></div>
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-accent-orange/10 rounded-full blur-[120px] animate-float opacity-30"></div>

            {/* Header */}
            <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center z-10 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border-2 border-mythic-purple rotate-45 flex items-center justify-center animate-glimmer shadow-[0_0_20px_rgba(157,78,221,0.3)]">
                        <span className="text-accent-orange -rotate-45 font-black text-2xl mythic-font">M</span>
                    </div>
                    <span className="text-3xl font-black tracking-widest uppercase text-white hover:text-accent-orange transition-colors mythic-font">
                        MythForge<span className="text-mythic-purple">NFT</span>
                    </span>
                </div>
                <WalletConnect />
            </header>

            {/* Hero Section */}
            <section className="flex flex-col items-center text-center max-w-5xl space-y-16 z-20 py-24">
                <div className="space-y-8">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase mythic-font">
                        Forge Your<br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-orange via-mythic-purple to-accent-cyan bg-size-[200%_auto] animate-nebula neon-gold">Legend.</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-foreground/60 font-serif italic max-w-3xl mx-auto leading-relaxed">
                        Inscribe your visions into the eternal scrolls of the Nero Chain. Turn mere thoughts into sentient myths, artifacts of power, and celestial beings.
                    </p>
                </div>

                <div className="w-full h-px bg-linear-to-r from-transparent via-mythic-purple/40 to-transparent"></div>

                {/* Pipeline Flow */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                    {[
                        { step: "I", title: "Envision", desc: "Whisper your mythic story into the forge." },
                        { step: "II", title: "Manifest", desc: "Stability AI weaves the threads of reality." },
                        { step: "III", title: "Inscribe", desc: "Anchor the manifestation in eternal IPFS." },
                        { step: "IV", title: "Eternalize", desc: "The myth is born on the Nero Chain." }
                    ].map((item, idx) => (
                        <div key={idx} className="group glass p-8 rounded-3xl border-mythic-purple/20 hover:border-accent-cyan/40 transition-all hover:-translate-y-2 glow-purple/10">
                            <span className="text-4xl font-black text-accent-orange/30 group-hover:text-accent-orange transition-colors mythic-font">{item.step}</span>
                            <h3 className="text-xl font-bold uppercase mt-4 text-white tracking-widest">{item.title}</h3>
                            <p className="text-[11px] uppercase font-mono text-foreground/40 mt-3 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-8 pt-12">
                    <Link href="/create">
                        <button className="px-12 py-6 bg-linear-to-r from-accent-orange to-[#FF8C00] text-black font-black uppercase tracking-[0.5em] rounded-full hover:scale-110 transition-all hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] active:scale-95 group relative overflow-hidden">
                           <span className="relative z-10">Enter The Forge</span>
                           <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </Link>
                    <Link href="/feed">
                        <button className="px-12 py-6 glass border border-accent-cyan/50 text-accent-cyan font-black uppercase tracking-[0.5em] rounded-full hover:bg-accent-cyan/10 transition-all active:scale-95 neon-cyan">
                            View Universe
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center py-10 gap-6 text-[10px] text-foreground/30 font-mono uppercase z-10 border-t border-white/5 mt-16">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></div>
                    <span>Aether Link: Stable [99.9%]</span>
                </div>
                <span className="mythic-font tracking-widest opacity-50 italic">Forged on the Nero Chain Testnet</span>
                <div className="flex gap-8">
                    <span>Powered by Stability AI</span>
                    <span>Pinata Cloud Storage</span>
                </div>
            </footer>
        </main>
    );
};

export default LandingPage;

