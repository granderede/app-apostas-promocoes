"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3, Activity, Plus, Trash2 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

interface StatsDashboardProps {
  activities: Activity[];
  delayProfitEntries: DelayProfitEntry[];
  onAddDelayProfit: (amount: number) => void;
  onRemoveDelayProfit: (id: string) => void;
}

export default function StatsDashboard({ activities, delayProfitEntries, onAddDelayProfit, onRemoveDelayProfit }: StatsDashboardProps) {
  const [delayAmount, setDelayAmount] = useState("");

  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.completed).length,
    totalProfit: activities.reduce((sum, a) => sum + (a.profit || 0), 0),
    averageProfit: activities.filter(a => a.completed && a.profit).length > 0
      ? activities.reduce((sum, a) => sum + (a.profit || 0), 0) / activities.filter(a => a.completed && a.profit).length
      : 0,
    successRate: activities.length > 0 ? (activities.filter(a => a.completed).length / activities.length) * 100 : 0,
  };

  const delayProfit = delayProfitEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalProfitWithDelay = stats.totalProfit + delayProfit;

  const handleAddDelayProfit = () => {
    const amount = parseFloat(delayAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddDelayProfit(amount);
      setDelayAmount("");
    }
  };

  // Preparar dados para o gráfico
  const chartData = activities
    .filter(a => a.completed)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((activity, index) => {
      const cumulativeProfit = activities
        .filter(a => a.completed)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .slice(0, index + 1)
        .reduce((sum, a) => sum + (a.profit || 0), 0);
      
      return {
        name: new Date(activity.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        lucro: activity.profit || 0,
        acumulado: cumulativeProfit,
        atividade: activity.title.substring(0, 20) + (activity.title.length > 20 ? '...' : ''),
      };
    });

  const maxValue = Math.max(...activities.map(a => Math.abs(a.profit || a.potentialProfit)));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header com animação */}
      <div className="flex items-center justify-between animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl border border-purple-500/30 animate-pulse">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Suas Estatísticas
          </h2>
        </div>
        <div className="bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30 hover:bg-green-500/20 transition-all duration-300 hover:scale-105">
          <span className="text-sm font-medium text-green-400">
            Taxa de Participação: {stats.successRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Campo para Adicionar Lucro de Delay */}
      <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 p-6 rounded-2xl border border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 animate-in slide-in-from-top duration-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-cyan-500/20 p-3 rounded-xl">
            <Plus className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Adicionar Lucro de Delay</h3>
            <p className="text-sm text-gray-400">Registre seus lucros assistindo jogos com delay</p>
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              value={delayAmount}
              onChange={(e) => setDelayAmount(e.target.value)}
              placeholder="Digite o valor do lucro (ex: 150.00)"
              className="w-full px-4 py-3 bg-zinc-900 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddDelayProfit();
                }
              }}
            />
          </div>
          <button
            onClick={handleAddDelayProfit}
            disabled={!delayAmount || parseFloat(delayAmount) <= 0}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Adicionar
          </button>
        </div>

        {/* Lista de Registros de Lucro com Delay */}
        {delayProfitEntries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Registros de Lucro com Delay:</span>
              <span className="text-lg font-bold text-cyan-400">Total: R$ {delayProfit.toFixed(2)}</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {delayProfitEntries.slice().reverse().map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-cyan-400">R$ {entry.amount.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveDelayProfit(entry.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    title="Remover registro"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Stats Grid com animações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Profit with Delay */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 p-6 rounded-2xl border hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 animate-in slide-in-from-left duration-700 group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-xl group-hover:bg-green-500/30 transition-all duration-300 group-hover:rotate-12">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400 animate-bounce" />
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Lucro Total</h3>
          <p className="text-3xl font-bold text-green-400 transition-all duration-300 group-hover:text-4xl">
            R$ {totalProfitWithDelay.toFixed(2)}
          </p>
          <div className="mt-3 pt-3 border-t border-green-500/20">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Atividades:</span>
              <span className="text-green-400 font-medium">R$ {stats.totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
              <span>Delay:</span>
              <span className="text-cyan-400 font-medium">R$ {delayProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Participation Rate */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-2xl border border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 animate-in slide-in-from-right duration-700 group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl group-hover:bg-blue-500/30 transition-all duration-300 group-hover:rotate-12">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <Award className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Taxa de Participação</h3>
          <p className="text-3xl font-bold text-blue-400 transition-all duration-300 group-hover:text-4xl">
            {stats.successRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.completed} de {stats.total} atividades
          </p>
        </div>
      </div>

      {/* Gráfico de Linha - Evolução do Lucro */}
      {chartData.length > 0 && (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-800 hover:border-purple-500/30 transition-all duration-500 animate-in slide-in-from-bottom duration-700 hover:shadow-2xl hover:shadow-purple-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Evolução dos Resultados
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="name" 
                stroke="#71717a"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#71717a"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  padding: '12px'
                }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="acumulado" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#colorAcumulado)" 
                name="Lucro Acumulado"
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="lucro" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fill="url(#colorLucro)" 
                name="Lucro Individual"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance Chart - Barras Horizontais */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-green-500/30 transition-all duration-500 animate-in slide-in-from-bottom duration-700 delay-150 hover:shadow-2xl hover:shadow-green-500/10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
          Histórico de Resultados
        </h3>
        <div className="space-y-3">
          {activities.slice(0, 10).reverse().map((activity, index) => {
            const value = activity.profit || 0;
            const percentage = maxValue > 0 ? (Math.abs(value) / maxValue) * 100 : 0;
            const isProfit = value >= 0;
            
            return (
              <div 
                key={activity.id} 
                className="space-y-2 group hover:bg-zinc-800/50 p-2 rounded-lg transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 truncate max-w-[200px] group-hover:text-white transition-colors duration-300">
                    {activity.title}
                  </span>
                  <span className={`font-bold transition-all duration-300 ${
                    activity.completed 
                      ? isProfit ? 'text-green-400 group-hover:text-green-300' : 'text-red-400 group-hover:text-red-300'
                      : 'text-gray-600'
                  }`}>
                    {activity.completed 
                      ? `${isProfit ? 'R$ ' : '-R$ '}${Math.abs(value).toFixed(2)}` 
                      : 'Não realizada'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      activity.completed
                        ? isProfit
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50'
                          : 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50'
                        : 'bg-zinc-700'
                    }`}
                    style={{ 
                      width: activity.completed ? `${percentage}%` : '0%',
                      transitionDelay: `${index * 100}ms`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-blue-500/30 transition-all duration-500 animate-in slide-in-from-bottom duration-700 delay-300 hover:shadow-2xl hover:shadow-blue-500/10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-600 rounded-full"></div>
          Atividades Realizadas
        </h3>
        <div className="space-y-3">
          {activities.filter(a => a.completed).slice(0, 5).map((activity, index) => {
            const isProfit = (activity.profit || 0) >= 0;
            return (
              <div 
                key={activity.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isProfit 
                    ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40' 
                    : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    {isProfit ? 'R$ ' : '-R$ '}{Math.abs(activity.profit || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Message com animação */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 p-6 rounded-2xl border border-green-500/30 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-500">
        <div className="flex items-start gap-4">
          <div className="bg-green-500/20 p-3 rounded-xl animate-pulse">
            <Award className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Continue assim!</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {stats.successRate >= 80
                ? "Excelente desempenho! Você está aproveitando a maioria das oportunidades."
                : stats.successRate >= 50
                ? "Bom trabalho! Tente participar de mais atividades para aumentar seus lucros."
                : "Não perca as oportunidades! Cada atividade é uma chance de lucro."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
