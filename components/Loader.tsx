"use client";

import React from "react";

const Loader = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-accent-cyan/20 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-t-4 border-accent-cyan rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-t-4 border-accent-orange rounded-full animate-spin-reverse"></div>
      </div>
      {message && (
        <p className="text-accent-cyan font-mono text-sm uppercase tracking-widest neon-cyan animate-pulse">
            {message}
        </p>
      )}
      <style jsx>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
