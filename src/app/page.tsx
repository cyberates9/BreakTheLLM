'use client';

import { useState } from 'react';
import PhoneMockup from '@/components/PhoneMockup';
import ControlPanel from '@/components/ControlPanel';

export default function Home() {
  const [gameState, setGameState] = useState<'landing' | 'loading' | 'game'>('landing');

  const handleStartGame = () => {
    setGameState('loading');
    setTimeout(() => {
      setGameState('game');
    }, 2000);
  };

  const LogoIcon = ({ className = 'w-full h-full' }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-emerald-500/50 fill-emerald-950/30" />
      <path d="M12 8v8" className="stroke-cyan-400 stroke-[2]" />
      <path d="M8 12h8" className="stroke-cyan-400 stroke-[2]" />
      <circle cx="12" cy="12" r="2.5" className="fill-emerald-400 stroke-emerald-200" />
      <path d="M9 9l-2 3 2 3" className="stroke-indigo-300 stroke-[2]" />
      <path d="M15 9l2 3-2 3" className="stroke-indigo-300 stroke-[2]" />
    </svg>
  );

  return (
    <main className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col justify-between items-center p-6 md:p-10 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* 1. KARŞILAMA EKRANI (LANDING) */}
      {gameState === 'landing' && (
        <div className="w-full max-w-6xl my-auto flex flex-col lg:flex-row items-center justify-between gap-12 py-8 transition-all duration-700 ease-out">
          
          {/* Sol Taraf: Büyük Logo ve İsim */}
          <div className="flex-1 flex flex-col items-start gap-6">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative w-36 h-36 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl p-7">
                <LogoIcon />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-6xl font-black tracking-tighter text-white font-mono uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                BreakTheLLM
              </h1>
              <p className="text-sm font-mono text-emerald-400 tracking-widest uppercase font-semibold">
                AI Red-Teaming & Social Engineering Lab
              </p>
            </div>
          </div>

          {/* Sağ Taraf: Oyun Amacı & Oyuna Başla */}
          <div className="flex-1 w-full bg-[#0a0d14]/80 border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎯</span> Oyunun Amacı ve Vizyonu
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                <strong>BreakTheLLM</strong>, büyük dil modellerinin (LLM) güvenlik sınırlarını zorlamak ve sosyal mühendislik saldırı senaryolarını simüle etmek amacıyla tasarlanmış siber güvenlik eğitim platformudur.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs text-amber-300/90 leading-relaxed font-sans">
              💡 <strong>YARATICI NOTU:</strong> Bu oyun sayesinde siber güvenlik alanının sosyal mühendislik kısmında kendinizi deneyimleyin ve kendinize yetkinlik kazandırın.
            </div>

            <button
              onClick={handleStartGame}
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all duration-300 active:scale-98 cursor-pointer font-mono tracking-wider uppercase"
            >
              OYUNA BAŞLA ➔
            </button>
          </div>
        </div>
      )}

      {/* 2. GEÇİŞ ANIMASYONU (2 Saniye) */}
      {gameState === 'loading' && (
        <div className="fixed inset-0 z-50 bg-[#05070a] flex flex-col items-center justify-center gap-6">
          <div className="relative animate-bounce">
            <div className="absolute -inset-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 rounded-full blur-3xl opacity-80 animate-pulse"></div>
            <div className="relative w-36 h-36 rounded-3xl bg-slate-950 border border-emerald-500/50 flex items-center justify-center p-7 shadow-2xl">
              <LogoIcon />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-mono font-bold text-white tracking-widest animate-pulse uppercase">
              LAB SİSTEMİ YÜKLENİYOR...
            </h3>
            <p className="text-xs font-mono text-slate-500">Güvenlik protokolleri hazırlanıyor</p>
          </div>
        </div>
      )}

      {/* 3. OYUN EKRANI */}
      {gameState === 'game' && (
        <div className="w-full flex flex-col justify-between items-center transition-all duration-700 ease-in-out">
          {/* Header */}
          <header className="w-full max-w-6xl flex flex-col items-center text-center gap-3 py-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 p-2 shadow-lg">
                <LogoIcon />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                BreakTheLLM
              </h1>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 px-5 py-2 rounded-full text-xs text-slate-300 flex items-center justify-center gap-2 max-w-2xl shadow-inner font-sans">
              <span className="text-amber-400">💡</span>
              <span>
                <strong>YARATICI NOTU:</strong> Bu oyun sayesinde siber güvenlik alanının sosyal mühendislik kısmında kendinizi deneyimleyin ve kendinize yetkinlik kazandırın.
              </span>
            </div>
          </header>

          {/* Paneller */}
          <section className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-stretch justify-center gap-6 my-auto">
            <div className="flex-1 w-full max-w-xl flex justify-center">
              <PhoneMockup />
            </div>
            <div className="flex-1 w-full max-w-xl flex justify-center">
              <ControlPanel />
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-6xl pt-6 mt-6 border-t border-slate-800/40 text-center text-xs text-slate-500 font-sans">
        <span>🛡️ BreakTheLLM Security Challenge — Siber Güvenlik Dersleri İçin Tasarlanmıştır.</span>
      </footer>
    </main>
  );
}