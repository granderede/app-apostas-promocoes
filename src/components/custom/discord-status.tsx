"use client";

import { MessageCircle, Radio } from "lucide-react";

interface DiscordStatusProps {
  isOnline: boolean;
}

export default function DiscordStatus({ isOnline }: DiscordStatusProps) {
  const handleDiscordClick = () => {
    // Aqui você pode adicionar o link do seu servidor Discord
    window.open("https://discord.gg/seu-servidor", "_blank");
  };

  return (
    <button
      onClick={handleDiscordClick}
      className={`w-full relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
        isOnline
          ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
          : "bg-gradient-to-r from-gray-600 to-gray-700"
      }`}
    >
      {/* Animated Background Effect */}
      {isOnline && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`relative ${isOnline ? "animate-bounce" : ""}`}>
            <MessageCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            {isOnline && (
              <div className="absolute -top-1 -right-1">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
            )}
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white mb-1">
              {isOnline ? "🔴 AO VIVO NO DISCORD" : "Discord Offline"}
            </h3>
            <p className="text-sm text-white/90">
              {isOnline
                ? "Estou ensinando agora! Clique para entrar"
                : "Nenhuma transmissão no momento"}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {isOnline && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-white">ONLINE</span>
            </div>
          )}
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Pulse Effect when Online */}
      {isOnline && (
        <div className="absolute inset-0 rounded-2xl border-4 border-white/30 animate-ping" />
      )}
    </button>
  );
}
