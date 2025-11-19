"use client";

import { MessageCircle, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DiscordStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [discordLink, setDiscordLink] = useState("https://discord.gg/seu-servidor");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Carregar configurações do Discord
    const loadDiscordConfig = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('discord_config')
        .select('*')
        .single();

      if (data) {
        setIsOnline(data.is_online);
        setDiscordLink(data.discord_link);
        setIsVisible(data.is_online); // Só mostra se estiver online
      }
    };

    loadDiscordConfig();

    // Atualizar em tempo real
    const channel = supabase
      ?.channel('discord_config_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'discord_config' },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as { is_online: boolean; discord_link: string };
            setIsOnline(newData.is_online);
            setDiscordLink(newData.discord_link);
            setIsVisible(newData.is_online);
          }
        }
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  const handleDiscordClick = () => {
    window.open(discordLink, "_blank");
  };

  // Não renderizar se estiver desativado
  if (!isVisible) {
    return null;
  }

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
