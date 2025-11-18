"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, TrendingUp, DollarSign, CheckCircle2, XCircle, BarChart3, LogOut } from "lucide-react";
import DiscordStatus from "@/components/custom/discord-status";
import ActivityCard from "@/components/custom/activity-card";
import StatsDashboard from "@/components/custom/stats-dashboard";
import SupportButton from "@/components/custom/support-button";
import { supabase, signOut } from "@/lib/supabase";

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

interface DelayProfitEntry {
  id: string;
  amount: number;
  date: Date;
}

export default function Home() {
  const router = useRouter();
  const [view, setView] = useState<"feed" | "stats">("feed");
  const [delayProfitEntries, setDelayProfitEntries] = useState<DelayProfitEntry[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Método Casa de Apostas X - Odd 2.5",
      description: "Aproveite a promoção de cashback de 100% na primeira aposta. Método testado com 85% de assertividade.",
      imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&h=400&fit=crop",
      potentialProfit: 250,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completed: true,
      profit: 250,
    },
    {
      id: "2",
      title: "Tip Especial - Jogo do Dia",
      description: "Análise completa do jogo com estatísticas detalhadas. Entrada segura com gestão de banca.",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
      potentialProfit: 180,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      completed: false,
    },
    {
      id: "3",
      title: "Promoção Relâmpago - Bônus 200%",
      description: "Aproveite agora! Bônus de 200% no primeiro depósito + 50 rodadas grátis. Válido por 24h.",
      imageUrl: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800&h=400&fit=crop",
      potentialProfit: 400,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      completed: true,
      profit: 420,
    },
  ]);

  useEffect(() => {
    // Verificar usuário logado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário');
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  const handleToggleComplete = (id: string, profit?: number) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === id
          ? { ...act, completed: !act.completed, profit: !act.completed ? profit : undefined }
          : act
      )
    );
  };

  const handleAddDelayProfit = (amount: number) => {
    const newEntry: DelayProfitEntry = {
      id: Date.now().toString(),
      amount,
      date: new Date(),
    };
    setDelayProfitEntries(prev => [...prev, newEntry]);
  };

  const handleRemoveDelayProfit = (id: string) => {
    setDelayProfitEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const delayProfit = delayProfitEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const stats = {
    completed: activities.filter(a => a.completed).length,
    missed: activities.filter(a => !a.completed).length,
    totalProfit: activities.reduce((sum, a) => sum + (a.profit || 0), 0) + delayProfit,
    potentialLost: activities
      .filter(a => !a.completed)
      .reduce((sum, a) => sum + a.potentialProfit, 0),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-400">FalcaoPro Metodos</h1>
                <p className="text-xs text-gray-400">Olá, {userName}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Plano Ativo</span>
              </div>
              <button className="relative p-2 hover:bg-green-500/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-green-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Discord Status - Destacado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DiscordStatus isOnline={true} />
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-green-500/20">
          <button
            onClick={() => setView("feed")}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              view === "feed"
                ? "bg-green-500 text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Atividades
            </span>
          </button>
          <button
            onClick={() => setView("stats")}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              view === "stats"
                ? "bg-green-500 text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Realizadas</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 p-4 rounded-xl border border-red-500/30">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Perdidas</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.missed}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Lucro Total</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              R$ {stats.totalProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {view === "feed" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Feed de Atividades</h2>
              <span className="text-sm text-gray-400">{activities.length} ativas</span>
            </div>
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        ) : (
          <StatsDashboard 
            activities={activities} 
            delayProfitEntries={delayProfitEntries}
            onAddDelayProfit={handleAddDelayProfit}
            onRemoveDelayProfit={handleRemoveDelayProfit}
          />
        )}
      </main>

      {/* Support Button */}
      <SupportButton />

      {/* Footer */}
      <footer className="border-t border-green-500/20 bg-zinc-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2024 FalcaoPro Metodos - Dinheiro no bolso, sem risco
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Plano Premium:</span>
              <span className="text-green-400 font-bold">R$ 59,90/mês</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
