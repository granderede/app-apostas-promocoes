"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "admin"; timestamp: Date }>>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        text: message,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setMessage("");

    // Simulação de resposta automática (você pode integrar com backend real)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: "Obrigado pela mensagem! Vou responder em breve.",
          sender: "admin",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black p-4 rounded-full shadow-2xl shadow-green-500/50 transition-all duration-300 hover:scale-110"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-green-500/30 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <h3 className="text-lg font-bold text-black">Suporte Direto</h3>
              <p className="text-xs text-black/80">Fale comigo em tempo real</p>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-black">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-sm text-gray-400">
                    Envie uma mensagem e vou te responder o mais rápido possível!
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-green-500 text-black"
                          : "bg-zinc-800 text-white border border-zinc-700"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
