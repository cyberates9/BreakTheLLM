'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore, Message } from '@/store/useGameStore';

export default function PhoneMockup() {
  const { currentLevelId, messages, addMessage } = useGameStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Doğrudan mesaj kapsayıcısını yakalıyoruz
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages[currentLevelId] || [];

  // Mesaj eklendikçe veya yüklenme durumu değiştikçe konteyneri en alta kaydır
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentMessages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    addMessage(currentLevelId, { sender: 'user', text: userMsg });
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          levelId: currentLevelId,
          messages: [...currentMessages, { sender: 'user', text: userMsg }]
        })
      });

      const data = await res.json();

      if (res.ok && data.response) {
        addMessage(currentLevelId, { sender: 'bot', text: data.response });
      } else {
        addMessage(currentLevelId, {
          sender: 'system',
          text: data.error || 'Bir hata oluştu, lütfen tekrar deneyin.'
        });
      }
    } catch (err) {
      addMessage(currentLevelId, {
        sender: 'system',
        text: 'Sunucu ile bağlantı kurulamadı.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-4 shadow-2xl flex flex-col h-[600px] relative overflow-hidden">
      {/* Telefon Üst Ahize Detayı */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-b-xl z-10 flex justify-center items-center">
        <div className="w-12 h-1 bg-slate-900 rounded-full"></div>
      </div>

      {/* Mesaj Alanı (ref doğrudan buraya bağlı) */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pt-6 pb-2 pr-1 scroll-smooth"
      >
        {currentMessages.length === 0 ? (
          <div className="text-center text-slate-500 text-xs mt-10">
            Sohbeti başlatmak için bir mesaj yazın...
          </div>
        ) : (
          currentMessages.map((m: Message, idx: number) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : m.sender === 'bot'
                    ? 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    : 'bg-red-900/50 text-red-200 border border-red-800 text-xs w-full text-center'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}

        {/* Yükleniyor Göstergesi */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 rounded-2xl px-4 py-2 text-xs border border-slate-700 animate-pulse">
              Yapay zeka yanıt yazıyor...
            </div>
          </div>
        )}
      </div>

      {/* Mesaj Yazma Kutusu */}
      <div className="pt-2 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Mesajınızı yazın..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
