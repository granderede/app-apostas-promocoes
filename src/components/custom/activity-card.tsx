"use client";

import { useState } from "react";
import { Check, Clock, DollarSign, TrendingUp, TrendingDown, X } from "lucide-react";
import Image from "next/image";

interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  potentialProfit: number;
  timestamp: Date;
  completed: boolean;
  profit?: number;
}

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (id: string, profit?: number) => void;
}

export default function ActivityCard({ activity, onToggleComplete }: ActivityCardProps) {
  const [showProfitInput, setShowProfitInput] = useState(false);
  const [profitValue, setProfitValue] = useState("");
  const [resultType, setResultType] = useState<"profit" | "loss">("profit");

  const handleComplete = () => {
    if (!activity.completed) {
      setShowProfitInput(true);
    } else {
      onToggleComplete(activity.id);
    }
  };

  const handleSaveProfit = () => {
    const value = parseFloat(profitValue) || 0;
    const profit = resultType === "loss" ? -Math.abs(value) : Math.abs(value);
    onToggleComplete(activity.id, profit);
    setShowProfitInput(false);
    setProfitValue("");
    setResultType("profit");
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Agora mesmo";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    return `${Math.floor(seconds / 86400)}d atrás`;
  };

  return (
    <div
      className={`bg-zinc-900 rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
        activity.completed
          ? "border-green-500/50 shadow-green-500/20"
          : "border-zinc-800 hover:border-green-500/30"
      }`}
    >
      {/* Image/Video Preview */}
      {activity.imageUrl && (
        <div className="relative w-full h-48 sm:h-64 bg-zinc-800">
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover"
          />
          {activity.completed && (
            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px] flex items-center justify-center">
              <div className="bg-green-500 rounded-full p-4">
                <Check className="w-8 h-8 text-black" strokeWidth={3} />
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white font-medium">{timeAgo(activity.timestamp)}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">{activity.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{activity.description}</p>
          </div>
          {activity.completed && (
            <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>

        {/* Profit Info */}
        <div className="flex items-center gap-4 mb-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Lucro Potencial</span>
            </div>
            <p className="text-xl font-bold text-green-400">
              R$ {activity.potentialProfit.toFixed(2)}
            </p>
          </div>
          {activity.completed && activity.profit !== undefined && (
            <div className="flex-1 border-l border-zinc-700 pl-4">
              <div className="flex items-center gap-2 mb-1">
                {activity.profit >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-gray-400">Resultado</span>
              </div>
              <p className={`text-xl font-bold ${activity.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {activity.profit >= 0 ? 'R$ ' : '-R$ '}{Math.abs(activity.profit).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Profit Input */}
        {showProfitInput && (
          <div className="mb-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <label className="block text-sm font-medium text-white mb-3">
              Qual foi o resultado desta atividade?
            </label>
            
            {/* Result Type Selector */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setResultType("profit")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  resultType === "profit"
                    ? "bg-green-500 text-black"
                    : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Lucro
                </div>
              </button>
              <button
                onClick={() => setResultType("loss")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  resultType === "loss"
                    ? "bg-red-500 text-white"
                    : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Prejuízo
                </div>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={profitValue}
                  onChange={(e) => setProfitValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <button
                onClick={handleSaveProfit}
                className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-2.5 rounded-lg transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setShowProfitInput(false);
                  setProfitValue("");
                  setResultType("profit");
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleComplete}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
            activity.completed
              ? "bg-zinc-800 hover:bg-zinc-700 text-gray-400"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black shadow-lg shadow-green-500/30"
          }`}
        >
          {activity.completed ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Atividade Realizada
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Marcar como Realizada
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
