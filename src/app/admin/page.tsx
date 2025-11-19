"use client";

import { useState, useEffect } from "react";
import { Send, Image as ImageIcon, Video, DollarSign, Users, TrendingUp, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [potentialProfit, setPotentialProfit] = useState("");
  
  // Discord Configuration
  const [discordLink, setDiscordLink] = useState("https://discord.gg/seu-canal");
  const [isDiscordOnline, setIsDiscordOnline] = useState(true);
  const [discordConfigId, setDiscordConfigId] = useState<string>("");
  
  // Stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  
  // Support Messages
  const [supportMessages, setSupportMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  useEffect(() => {
    // Verificar se é admin
    const checkAdmin = async () => {
      if (!supabase) {
        router.push('/auth');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', user.email)
        .single();

      if (!userData?.is_admin) {
        router.push('/');
        return;
      }

      // Carregar configurações do Discord
      loadDiscordConfig();
      
      // Carregar estatísticas
      loadStats();
    };

    checkAdmin();
  }, [router]);

  const loadDiscordConfig = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('discord_config')
      .select('*')
      .single();

    if (data) {
      setDiscordConfigId(data.id);
      setIsDiscordOnline(data.is_online);
      setDiscordLink(data.discord_link);
    }
  };

  const loadStats = async () => {
    if (!supabase) return;

    // Contar usuários
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersCount) setTotalUsers(usersCount);

    // Contar atividades
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });

    if (activitiesCount) setTotalActivities(activitiesCount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      alert("Erro: Supabase não configurado");
      return;
    }

    try {
      // Buscar todos os usuários
      const { data: users } = await supabase
        .from('users')
        .select('id');

      if (!users || users.length === 0) {
        alert("Nenhum usuário encontrado para enviar atividade");
        return;
      }

      // Criar atividade para cada usuário
      const activities = users.map(user => ({
        user_id: user.id,
        title,
        description,
        image_url: imageUrl || null,
        video_url: videoUrl || null,
        potential_profit: parseFloat(potentialProfit),
        completed: false,
      }));

      const { error } = await supabase
        .from('activities')
        .insert(activities);

      if (error) throw error;

      // Reset form
      setTitle("");
      setDescription("");
      setImageUrl("");
      setVideoUrl("");
      setPotentialProfit("");
      
      alert(`Atividade enviada com sucesso para ${users.length} usuário(s)!`);
      
      // Recarregar estatísticas
      loadStats();
    } catch (error) {
      console.error('Erro ao enviar atividade:', error);
      alert("Erro ao enviar atividade. Tente novamente.");
    }
  };

  const handleDiscordUpdate = async () => {
    if (!supabase || !discordConfigId) {
      alert("Erro ao atualizar configurações");
      return;
    }

    try {
      const { error } = await supabase
        .from('discord_config')
        .update({
          is_online: isDiscordOnline,
          discord_link: discordLink,
          updated_at: new Date().toISOString(),
        })
        .eq('id', discordConfigId);

      if (error) throw error;

      alert(`Status do Discord atualizado!\nLink: ${discordLink}\nStatus: ${isDiscordOnline ? "Online" : "Offline"}`);
    } catch (error) {
      console.error('Erro ao atualizar Discord:', error);
      alert("Erro ao atualizar configurações do Discord");
    }
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
                <p className="text-xs text-gray-400">Envie atividades e gerencie o Discord</p>
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
              <span className="text-sm text-gray-400">Usuários Cadastrados</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{totalUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-2xl border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Atividades Enviadas</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalActivities}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-6 rounded-2xl border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Receita Estimada</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">R$ {(totalUsers * 59.90).toFixed(2)}</p>
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
                Status do Botão Discord
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
                  Ativado
                </button>
                <button
                  onClick={() => setIsDiscordOnline(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    !isDiscordOnline
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-gray-400 border border-zinc-700"
                  }`}
                >
                  Desativado
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDiscordUpdate}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Salvar Configurações do Discord
          </button>
          
          <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-400">
              💡 <strong>Dica:</strong> Quando desativado, o botão do Discord não aparecerá para os usuários. Use isso para manutenção ou quando o servidor estiver offline.
            </p>
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
              💡 <strong>Dica:</strong> A atividade será enviada automaticamente para todos os usuários cadastrados no sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
