'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function PhoneMockup() {
  const { currentLevelId, messages, addMessage } = useGameStore();
  const currentMessages = messages[currentLevelId] || [];

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');

    addMessage(currentLevelId, { sender: 'user', text: userMsg });
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          levelId: currentLevelId,
          userMessage: userMsg,
          chatHistory: currentMessages,
        }),
      });

      const data = await res.json();
      addMessage(currentLevelId, { sender: 'bot', text: data.response });
    } catch (error) {
      addMessage(currentLevelId, {
        sender: 'bot',
        text: '⚠️ Sunucuyla iletişim kurulurken bir hata oluştu.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[620px] bg-[#0a0d14]/90 backdrop-blur-2xl border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
          <span className="text-sm font-bold tracking-widest text-emerald-400 font-mono uppercase">
            BTLBANK <span className="text-slate-500 font-normal">/ TERMINAL</span>
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/50">
          SYSTEM ACTIVE
        </span>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-2 custom-scrollbar">
        {currentMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <p className="text-sm font-mono text-emerald-400/90 font-semibold">BTLBANK AI Security Terminal v2.5</p>
            <p className="text-xs mt-2 text-slate-400">Sohbete başlamak için komut veya mesaj gönderin.</p>
          </div>
        )}
        {currentMessages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 rounded-br-none font-sans font-medium'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-md rounded-bl-none font-mono text-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/90 text-emerald-400 border border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 text-xs font-mono animate-pulse">
              [+] Yanıt işleniyor...
            </div>
          </div>
        )}
      </div>

      {/* Input Alanı */}
      <div className="flex gap-2.5 pt-3 border-t border-slate-800/80">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="BTLBANK Asistanına mesaj yazın..."
          className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95 cursor-pointer font-mono"
        >
          GÖNDER
        </button>
      </div>
    </div>
  );
}