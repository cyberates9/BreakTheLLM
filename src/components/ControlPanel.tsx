'use client';

import { useState } from 'react';
import { useGameStore, LEVELS } from '@/store/useGameStore';

export default function ControlPanel() {
  const { currentLevelId, setLevel } = useGameStore();
  const [flagInput, setFlagInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const currentLevel = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  const handleCheckFlag = () => {
    if (flagInput.trim().toUpperCase() === currentLevel.secretCode.toUpperCase()) {
      setStatusMessage({
        text: '🎉 TEBRİKLER! Şifre doğrulandı. Sonraki seviyeye geçiyorsunuz.',
        isError: false,
      });
      if (currentLevelId < LEVELS.length) {
        setTimeout(() => {
          setLevel(currentLevelId + 1);
          setFlagInput('');
          setShowHint(false);
          setStatusMessage(null);
        }, 1500);
      }
    } else {
      setStatusMessage({
        text: '❌ ERİŞİM ENGELLENDİ: Girilen şifre yanlış!',
        isError: true,
      });
    }
  };

  return (
    <div className="w-full h-[620px] bg-[#0a0d14]/90 backdrop-blur-2xl border border-slate-800/80 hover:border-blue-500/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase font-bold">
            SEVİYE {currentLevel.id} / {LEVELS.length}
          </span>
          <h2 className="text-lg font-bold text-white mt-1">{currentLevel.title}</h2>
        </div>
        <span className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          CHALLENGE
        </span>
      </div>

      {/* Görev & İpucu İçeriği */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 custom-scrollbar">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            Görev Tanımı
          </label>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl font-sans">
            {currentLevel.description}
          </p>
        </div>

        {/* İpucu */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Seviye İpucu
            </label>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer font-medium"
            >
              {showHint ? 'İpucunu Gizle' : 'İpucunu Göster'}
            </button>
          </div>
          {showHint && (
            <div className="bg-amber-950/40 border border-amber-900/60 p-4 rounded-2xl text-xs text-amber-200 leading-relaxed font-sans shadow-inner">
              {currentLevel.hint}
            </div>
          )}
        </div>

        {/* Yasaklı Kelimeler (Seviye 2 Uyarısı) */}
        {currentLevel.forbiddenKeywords && currentLevel.forbiddenKeywords.length > 0 && (
          <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block font-mono">
              ⚠️ Güvenlik Duvarı Engeli (Yasaklı Kelimeler)
            </span>
            <p className="text-xs text-rose-300 font-mono">
              {currentLevel.forbiddenKeywords.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          Elde Edilen Şifreyi (FLAG) Girin
        </label>
        <div className="flex gap-2.5">
          <input
            type="text"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckFlag()}
            placeholder="Örn: FLAG_LEVEL_1_EASY"
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 font-mono uppercase tracking-wider"
          />
          <button
            onClick={handleCheckFlag}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer font-mono"
          >
            DOĞRULA
          </button>
        </div>

        {statusMessage && (
          <p
            className={`text-xs p-3 rounded-xl border mt-1 font-mono text-center font-semibold ${
              statusMessage.isError
                ? 'bg-rose-950/50 border-rose-900/60 text-rose-300'
                : 'bg-emerald-950/50 border-emerald-900/60 text-emerald-300'
            }`}
          >
            {statusMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}