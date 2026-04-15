"use client";

import React, { useState, useEffect, useCallback } from "react";
import { connectWallet, truncateAddress, NERO_CHAIN_ID } from "../lib/ethers";

const WalletConnect = () => {
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    const restoreSession = useCallback(async () => {
        if (typeof window === "undefined" || !window.ethereum) {
            setLoading(false);
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
            if (accounts && accounts.length > 0) {
                const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;
                if (chainId !== NERO_CHAIN_ID) {
                    setWrongNetwork(true);
                } else {
                    setWrongNetwork(false);
                    setAddress(accounts[0]);
                }
            }
        } catch {
            // Stay disconnected
        } finally {
            setLoading(false);
        }
    }, []);

    const handleConnect = async () => {
        setLoading(true);
        setError("");
        setWrongNetwork(false);
        try {
            const { address: userAddress } = await connectWallet();
            setAddress(userAddress);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to connect";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        restoreSession();

        if (typeof window === "undefined" || !window.ethereum) return;

        const handleAccountsChanged = (...args: unknown[]) => {
            const accounts = args[0] as string[];
            if (!accounts || accounts.length === 0) {
                setAddress("");
                setWrongNetwork(false);
            } else {
                setAddress(accounts[0]);
            }
        };

        const handleChainChanged = (...args: unknown[]) => {
            const chainId = args[0] as string;
            if (chainId !== NERO_CHAIN_ID) {
                setWrongNetwork(true);
                setAddress("");
            } else {
                setWrongNetwork(false);
                restoreSession();
            }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, [restoreSession]);

    if (!mounted) {
        return (
            <button
                disabled
                className="glass px-6 py-2 rounded-full border border-white/10 text-white/20 font-bold uppercase tracking-widest text-[10px]"
            >
                Invoke Signer
            </button>
        );
    }

    if (loading) {
        return (
            <div className="glass px-5 py-2 rounded-full border border-white/10 animate-pulse">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
                    Aligning Aether...
                </span>
            </div>
        );
    }

    if (wrongNetwork) {
        return (
            <button
                onClick={handleConnect}
                className="glass px-5 py-2 rounded-full border border-accent-orange text-accent-orange text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange/10 transition-all animate-glimmer"
            >
                ⚠ Use Nero Chain
            </button>
        );
    }

    if (address) {
        return (
            <div className="flex items-center gap-3 glass px-4 py-2 rounded-full border border-mythic-purple/30 shadow-lg group">
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                <span className="font-mono text-sm text-accent-cyan tracking-tight group-hover:text-white transition-colors">
                    {truncateAddress(address)}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                onClick={handleConnect}
                disabled={loading}
                className="mythic-border px-8 py-2 rounded-full text-white font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 text-[11px] shadow-xl"
            >
                Invoke Signer
            </button>
            {error && (
                <span className="text-[9px] text-red-400 font-mono uppercase px-1">{error}</span>
            )}
        </div>
    );
};

export default WalletConnect;

