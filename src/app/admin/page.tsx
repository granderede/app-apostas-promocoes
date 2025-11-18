"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Video, DollarSign, Users, TrendingUp, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [potentialProfit, setPotentialProfit] = useState("");
  
  // Discord Configuration
  const [discordLink, setDiscordLink] = useState("https://discord.gg/seu-canal");
  const [isDiscordOnline, setIsDiscordOnline] = useState(true);
  
  // Support Messages
  const [supportMessages, setSupportMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([
    {
      id: "1",
      userId: "user123",
      userName: "João Silva",
      message: "Olá! Tenho uma dúvida sobre o método da última atividade.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      userId: "user456",
      userName: "Maria Santos",
      message: "Consegui R$ 300 com a última tip! Obrigada!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de envio para o backend
    console.log({
      title,
      description,
      imageUrl,
      videoUrl,
      potentialProfit: parseFloat(potentialProfit),
      timestamp: new Date(),
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setImageUrl("");
    setVideoUrl("");
    setPotentialProfit("");
    
    alert("Atividade enviada com sucesso! Todos os usuários receberão notificação.");
  };

  const handleDiscordUpdate = () => {
    alert(`Status do Discord atualizado!\nLink: ${discordLink}\nStatus: ${isDiscordOnline ? "Online" : "Offline"}`);
  };

  const unreadCount = supportMessages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-green-400">Painel Admin</h1>
                <p className="text-xs text-gray-400">Envie atividades para seus usuários</p>
              </div>
            </div>
            <div className="bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
              <span className="text-sm text-green-400 font-medium">Modo Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 rounded-2xl border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Usuários Ativos</span>
            </div>
            <p className="text-3xl font-bold text-green-400">247</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-2xl border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Atividades Enviadas</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">156</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-6 rounded-2xl border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Receita Mensal</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">R$ 14.794,30</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-6 rounded-2xl border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Mensagens Suporte</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-purple-400">{supportMessages.length}</p>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Discord Configuration */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Configuração do Discord
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link do Canal Discord
              </label>
              <input
                type="url"
                value={discordLink}
                onChange={(e) => setDiscordLink(e.target.value)}
                placeholder="https://discord.gg/seu-canal"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status do Discord
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDiscordOnline(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    isDiscordOnline
                      ? "bg-green-500 text-black"
                      : "bg-zinc-800 text-gray-400 border border-zinc-700"
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => setIsDiscordOnline(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    !isDiscordOnline
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-gray-400 border border-zinc-700"
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDiscordUpdate}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Atualizar Configurações do Discord
          </button>
        </div>

        {/* Support Messages */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-400" />
              Mensagens de Suporte
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h2>
          
          <div className="space-y-3">
            {supportMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma mensagem de suporte ainda</p>
              </div>
            ) : (
              supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-zinc-800 rounded-xl p-4 border ${
                    msg.read ? "border-zinc-700" : "border-purple-500/50 bg-purple-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-white">{msg.userName}</h4>
                      <p className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {!msg.read && (
                      <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Nova
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{msg.message}</p>
                  <button className="bg-green-500 hover:bg-green-600 text-black text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Responder
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Enviar Nova Atividade</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título da Atividade *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Método Casa de Apostas X - Odd 2.5"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição / Instruções *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o método, dicas e instruções detalhadas..."
                required
                rows={5}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
              />
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-400" />
                    URL da Imagem
                  </span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-green-400" />
                    URL do Vídeo
                  </span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Potential Profit */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Lucro Potencial (R$) *
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={potentialProfit}
                onChange={(e) => setPotentialProfit(e.target.value)}
                placeholder="250.00"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                Estimativa de lucro que o usuário pode obter com esta atividade
              </p>
            </div>

            {/* Preview */}
            {(title || description) && (
              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Preview da Atividade</h3>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  {imageUrl && (
                    <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <h4 className="text-lg font-bold text-white mb-2">
                    {title || "Título da atividade"}
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    {description || "Descrição da atividade"}
                  </p>
                  {potentialProfit && (
                    <div className="bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/30 inline-block">
                      <span className="text-sm text-green-400 font-bold">
                        Lucro Potencial: R$ {parseFloat(potentialProfit).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              Enviar Atividade para Todos os Usuários
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-400">
              💡 <strong>Dica:</strong> Todos os usuários ativos receberão uma notificação instantânea quando você enviar uma nova atividade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
