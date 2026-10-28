'use client';

import { useState } from 'react';
import { useGameStore, LEVELS } from '@/store/useGameStore';

export default function ControlPanel() {
  const { currentLevelId, setLevel } = useGameStore();
  const [flagInput, setFlagInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const currentLevel = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  const handleCheckFlag = () => {
    if (!flagInput.trim()) return;

    const cleanInput = flagInput.trim().toUpperCase().replace(/['"]/g, '');
    const cleanTarget = currentLevel.secretCode.toUpperCase().replace(/['"]/g, '');

    if (cleanInput === cleanTarget || cleanInput.includes(cleanTarget)) {
      setStatusMessage({ text: '🎉 TEBRİKLER! ŞİFRE DOĞRU. BİR SONRAKİ SEVİYEYE GEÇEBİLİRSİNİZ!', type: 'success' });
    } else {
      setStatusMessage({ text: '❌ ERİŞİM ENGELLENDİ: GİRİLEN ŞİFRE YANLIŞ!', type: 'error' });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl max-w-xl mx-auto">
      {/* Seviye Seçimi */}
      <div className="flex gap-2 mb-6">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => {
              setLevel(lvl.id);
              setStatusMessage({ text: '', type: '' });
              setFlagInput('');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              currentLevelId === lvl.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {lvl.name}
          </button>
        ))}
      </div>

      {/* Seviye Bilgisi */}
      <div className="mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800/80">
        <h2 className="text-xl font-bold text-emerald-400 mb-2">{currentLevel.title}</h2>
        <p className="text-slate-300 text-sm mb-3">{currentLevel.description}</p>
        <div className="bg-slate-900/80 p-3 rounded border border-slate-800 text-xs text-amber-300">
          💡 {currentLevel.hint}
        </div>
      </div>

      {/* Şifre Girişi */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          ELE GEÇİRİLEN ŞİFREYİ (FLAG) GİRİN:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            placeholder="Şifreyi buraya girin..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            onClick={handleCheckFlag}
            className="bg-emerald-600 hover:bg-emerald-500 font-bold px-6 py-2 rounded-lg transition-colors"
          >
            DOĞRULA
          </button>
        </div>

        {/* Sonuç Mesajı */}
        {statusMessage.text && (
          <div
            className={`p-3 rounded-lg text-sm font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                : 'bg-red-950/80 border border-red-800 text-red-300'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
