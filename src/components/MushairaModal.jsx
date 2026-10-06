import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Sparkles, Feather, Play, Pause, Volume2, Type, Tag
} from 'lucide-react';
import { SCRIPTS } from '../data/sampleShayaris';

export default function MushairaModal({ shayaris, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fontScale, setFontScale] = useState(1.15); // Scale factor for stage recital
  const [autoPlay, setAutoPlay] = useState(false);
  const [stageTheme, setStageTheme] = useState('midnight'); // 'midnight' | 'crimson' | 'emerald'

  const activeShayari = shayaris[currentIndex] || shayaris[0];

  // Auto-advance if play mode enabled
  useEffect(() => {
    let interval;
    if (autoPlay && shayaris.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % shayaris.length);
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, shayaris.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % shayaris.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + shayaris.length) % shayaris.length);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [shayaris.length, onClose]);

  if (!activeShayari) return null;

  const scriptConfig = SCRIPTS.find(s => s.id === activeShayari.script) || SCRIPTS[0];
  const isRtl = Boolean(scriptConfig.rtl);
  const stanzas = (activeShayari.lines || '').split('\n\n');

  const themes = {
    midnight: {
      bg: 'bg-gradient-to-b from-[#0e0c14] via-[#09070c] to-[#040306]',
      glow: '#d97706',
      cardBg: 'bg-[#15111c]/60 border-[#2a2236]',
      text: 'text-[#f5edfa]',
      accent: 'text-amber-400'
    },
    crimson: {
      bg: 'bg-gradient-to-b from-[#1b0a12] via-[#10050a] to-[#060204]',
      glow: '#f43f5e',
      cardBg: 'bg-[#220c17]/60 border-[#47172f]',
      text: 'text-[#fff0f4]',
      accent: 'text-rose-400'
    },
    emerald: {
      bg: 'bg-gradient-to-b from-[#0a1712] via-[#050f0b] to-[#020604]',
      glow: '#10b981',
      cardBg: 'bg-[#0f2119]/60 border-[#1f4233]',
      text: 'text-[#eefbf6]',
      accent: 'text-emerald-400'
    }
  };

  const currentTheme = themes[stageTheme];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between ${currentTheme.bg} text-[#ede2d0] select-none backdrop-blur-2xl transition-all duration-700 p-4 sm:p-10 overflow-hidden`}>
      
      {/* Background Stage Spotlight Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: currentTheme.glow }}
      />

      {/* TOP STAGE HEADER */}
      <header className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span>بزمِ مشاعرہ</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-serif">
                Mushaira Recital Mode
              </span>
            </h2>
            <p className="text-xs text-white/50 font-serif">
              Full-screen stage for poetry performance
            </p>
          </div>
        </div>

        {/* Stage Controls */}
        <div className="flex items-center gap-2.5">
          {/* Stage Themes */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {['midnight', 'crimson', 'emerald'].map((thm) => (
              <button
                key={thm}
                onClick={() => setStageTheme(thm)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all ${
                  stageTheme === thm
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {thm}
              </button>
            ))}
          </div>

          {/* Font scale */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setFontScale((s) => Math.max(0.9, s - 0.1))}
              className="px-2 py-1 text-white/70 hover:text-white"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontScale((s) => Math.min(1.6, s + 0.1))}
              className="px-2 py-1 text-white/70 hover:text-white"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Auto Advance */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              autoPlay
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
            }`}
            title="Auto-advance couplets every 7 seconds"
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{autoPlay ? 'Auto Playing' : 'Auto Play'}</span>
          </button>

          {/* Exit Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Exit Mushaira Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* CENTER RECITING STAGE */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 px-4 max-w-4xl mx-auto w-full text-center">
        
        {/* Title & Mood */}
        <div className="mb-8 space-y-2">
          {activeShayari.title && (
            <h3 className="font-display text-lg sm:text-xl font-medium tracking-wide opacity-80 text-amber-200">
              {activeShayari.title}
            </h3>
          )}
          <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 font-serif">
            {activeShayari.mood || 'Kalam'}
          </span>
        </div>

        {/* Couplets / Verses in Commanding Calligraphy */}
        <div 
          className={`space-y-6 sm:space-y-8 transition-all duration-300 ${scriptConfig.fontClass} ${
            isRtl ? 'font-nastaliq text-right sm:text-center' : 'text-center'
          } ${currentTheme.text}`}
          style={{ transform: `scale(${fontScale})` }}
        >
          {stanzas.map((stanza, i) => (
            <div 
              key={i} 
              className="whitespace-pre-line text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-[2.4] font-normal drop-shadow-xl"
            >
              {stanza}
            </div>
          ))}
        </div>

        {/* Poet Byline / Takhallis */}
        <div className="mt-10 sm:mt-12 flex items-center justify-center gap-2">
          <Sparkles className={`w-4 h-4 ${currentTheme.accent}`} />
          <p className="font-serif italic text-lg sm:text-xl font-semibold tracking-wide text-amber-300/90">
            ~ {activeShayari.takhallis || activeShayari.poet || 'Ijlaal'}
          </p>
        </div>

      </main>

      {/* BOTTOM STAGE FOOTER & NAVIGATION */}
      <footer className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Slide Counter */}
        <div className="text-xs font-mono text-white/50">
          Kalam <span className="text-white font-bold">{currentIndex + 1}</span> of <span className="text-white font-bold">{shayaris.length}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + shayaris.length) % shayaris.length)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all"
            title="Previous Kalam (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Pichla (Prev)</span>
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % shayaris.length)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#140e08] font-bold text-xs shadow-lg shadow-amber-950/40 transition-all"
            title="Next Kalam (Right Arrow / Space)"
          >
            <span>Agla (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Hint */}
        <div className="text-xs text-white/40 font-serif hidden md:block">
          Navigate with <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">→</kbd> keys
        </div>

      </footer>

    </div>
  );
}
