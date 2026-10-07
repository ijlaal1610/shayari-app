import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Sparkles, Feather, Play, Pause, Volume2, Type, Tag,
  Palette, Smartphone, Eye, EyeOff
} from 'lucide-react';
import { SCRIPTS } from '../data/sampleShayaris';

// All Themes: Preserves default stage presets (midnight, crimson, emerald) + Adds Mood Presets
const STAGE_THEMES = {
  // Default stage presets (preserved!)
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    urdu: 'نیم شب',
    category: 'Stage',
    bg: 'bg-gradient-to-b from-[#0e0c14] via-[#09070c] to-[#040306]',
    glow: '#d97706',
    text: 'text-[#f5edfa]',
    accent: 'text-amber-400',
    pill: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    urdu: 'سرخ گلاب',
    category: 'Stage',
    bg: 'bg-gradient-to-b from-[#1b0a12] via-[#10050a] to-[#060204]',
    glow: '#f43f5e',
    text: 'text-[#fff0f4]',
    accent: 'text-rose-400',
    pill: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    urdu: 'زمرد',
    category: 'Stage',
    bg: 'bg-gradient-to-b from-[#0a1712] via-[#050f0b] to-[#020604]',
    glow: '#10b981',
    text: 'text-[#eefbf6]',
    accent: 'text-emerald-400',
    pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },

  // Auto Mood Mode
  auto: {
    id: 'auto',
    name: '✨ Auto Mood',
    urdu: 'خودکار کیفیت',
    category: 'Smart',
    desc: 'Syncs atmosphere with each verse mood'
  },

  // Mood / Theme Presets
  ishq: {
    id: 'ishq',
    name: 'Ishq',
    urdu: 'عشق',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#280a15] via-[#16040b] to-[#080205]',
    glow: '#f43f5e',
    text: 'text-[#ffeef3]',
    accent: 'text-rose-400',
    pill: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  dard: {
    id: 'dard',
    name: 'Dard',
    urdu: 'درد',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#261307] via-[#150a03] to-[#070301]',
    glow: '#f97316',
    text: 'text-[#fff9ed]',
    accent: 'text-orange-400',
    pill: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  },
  tanhai: {
    id: 'tanhai',
    name: 'Tanhai',
    urdu: 'تنہائی',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#0c1228] via-[#060917] to-[#020309]',
    glow: '#6366f1',
    text: 'text-[#eef2ff]',
    accent: 'text-indigo-400',
    pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  },
  zindagi: {
    id: 'zindagi',
    name: 'Zindagi',
    urdu: 'زندگی',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#082218] via-[#04140e] to-[#010705]',
    glow: '#10b981',
    text: 'text-[#ecfdf5]',
    accent: 'text-emerald-400',
    pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  sufi: {
    id: 'sufi',
    name: 'Sufi',
    urdu: 'صوفی',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#1b0d2a] via-[#0e0517] to-[#050209]',
    glow: '#a855f7',
    text: 'text-[#fbf5ff]',
    accent: 'text-purple-400',
    pill: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  yaadein: {
    id: 'yaadein',
    name: 'Yaadein',
    urdu: 'یادیں',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#270e1e] via-[#160611] to-[#080206]',
    glow: '#ec4899',
    text: 'text-[#fff1f8]',
    accent: 'text-pink-400',
    pill: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  },
  khamoshi: {
    id: 'khamoshi',
    name: 'Khamoshi',
    urdu: 'خاموشی',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#131418] via-[#0a0a0d] to-[#040405]',
    glow: '#94a3b8',
    text: 'text-[#f8fafc]',
    accent: 'text-slate-300',
    pill: 'bg-slate-500/20 text-slate-300 border-slate-500/40'
  },
  falsafa: {
    id: 'falsafa',
    name: 'Falsafa',
    urdu: 'فلسفہ',
    category: 'Mood',
    bg: 'bg-gradient-to-b from-[#241a09] via-[#140e04] to-[#070501]',
    glow: '#eab308',
    text: 'text-[#fefce8]',
    accent: 'text-yellow-400',
    pill: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
  }
};

// Theme modes for filtering and atmosphere
const THEME_MODES = [
  { id: 'all', name: 'All', urdu: 'تمام کلام', icon: '✨' },
  { id: 'ishq', name: 'Ishq', urdu: 'عشق', icon: '❤️' },
  { id: 'dard', name: 'Dard', urdu: 'درد', icon: '🔥' },
  { id: 'zindagi', name: 'Zindagi', urdu: 'زندگی', icon: '🌿' },
  { id: 'tanhai', name: 'Tanhai', urdu: 'تنہائی', icon: '🌙' },
  { id: 'sufi', name: 'Sufi', urdu: 'صوفی', icon: '🔮' },
  { id: 'yaadein', name: 'Yaadein', urdu: 'یادیں', icon: '🌸' },
  { id: 'khamoshi', name: 'Khamoshi', urdu: 'خاموشی', icon: '🌫️' },
  { id: 'falsafa', name: 'Falsafa', urdu: 'فلسفہ', icon: '📜' }
];

export default function MushairaModal({ shayaris = [], initialIndex = 0, onClose }) {
  // Theme Mode Filter: 'all' (default, shows all shayaris) or specific mood ('ishq', 'dard', etc.)
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [stageLighting, setStageLighting] = useState('midnight'); // Default stage lighting for 'all' mode: midnight, crimson, emerald, auto
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fontScale, setFontScale] = useState(1.0); // Mobile responsive scale factor
  const [autoPlay, setAutoPlay] = useState(false);
  const [showControls, setShowControls] = useState(true); // Toggle controls for pure zen on phone
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch Swipe tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Filter shayaris based on selected theme mode
  const activeShayaris = React.useMemo(() => {
    if (selectedTheme === 'all') {
      return shayaris;
    }
    return shayaris.filter((s) => {
      const sMood = (s.mood || '').trim().toLowerCase();
      return sMood === selectedTheme.toLowerCase();
    });
  }, [shayaris, selectedTheme]);

  // Keep index within valid range
  const safeIndex = activeShayaris.length > 0 ? Math.min(currentIndex, activeShayaris.length - 1) : 0;
  const activeShayari = activeShayaris[safeIndex] || null;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const handleSelectTheme = (themeId) => {
    setSelectedTheme(themeId);
    setCurrentIndex(0);
    triggerHaptic();
  };

  const goToNext = () => {
    if (activeShayaris.length <= 1) return;
    triggerHaptic();
    setCurrentIndex((prev) => (prev + 1) % activeShayaris.length);
  };

  const goToPrev = () => {
    if (activeShayaris.length <= 1) return;
    triggerHaptic();
    setCurrentIndex((prev) => (prev - 1 + activeShayaris.length) % activeShayaris.length);
  };

  // Fullscreen toggle on phone/browser
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Touch gesture handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum swipe threshold: 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  // Auto-advance if play mode enabled
  useEffect(() => {
    let interval;
    if (autoPlay && activeShayaris.length > 1) {
      interval = setInterval(() => {
        goToNext();
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, activeShayaris.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeShayaris.length, onClose]);

  // Resolve visual atmosphere
  let resolvedThemeKey = 'midnight';
  if (selectedTheme === 'all') {
    if (stageLighting === 'auto' && activeShayari) {
      const moodKey = (activeShayari.mood || '').toLowerCase();
      resolvedThemeKey = STAGE_THEMES[moodKey] ? moodKey : 'midnight';
    } else {
      resolvedThemeKey = stageLighting;
    }
  } else {
    resolvedThemeKey = STAGE_THEMES[selectedTheme] ? selectedTheme : 'midnight';
  }
  const currentTheme = STAGE_THEMES[resolvedThemeKey] || STAGE_THEMES.midnight;

  const currentThemeConfig = THEME_MODES.find(m => m.id === selectedTheme) || THEME_MODES[0];
  const scriptConfig = activeShayari ? (SCRIPTS.find(s => s.id === activeShayari.script) || SCRIPTS[0]) : SCRIPTS[0];
  const isRtl = Boolean(scriptConfig?.rtl);
  const stanzas = activeShayari ? (activeShayari.lines || '').split('\n\n') : [];

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 flex flex-col justify-between ${currentTheme.bg} text-[#ede2d0] select-none backdrop-blur-2xl transition-all duration-700 overflow-hidden`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 16px)',
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }}
    >
      
      {/* Background Stage Spotlight Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full blur-[100px] sm:blur-[160px] opacity-25 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: currentTheme.glow }}
      />

      {/* TOP HEADER CONTROLS */}
      <header className={`relative z-20 px-3 sm:px-8 py-3 transition-all duration-300 border-b border-white/10 bg-black/30 backdrop-blur-md ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          {/* Brand & Recital info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Feather className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="truncate">
              <h2 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2 truncate">
                <span>بزمِ مشاعرہ</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-serif">
                  Recital Mode
                </span>
                {selectedTheme !== 'all' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    {currentThemeConfig.name} only
                  </span>
                )}
              </h2>
              <p className="text-[10px] sm:text-xs text-white/50 font-serif truncate">
                {activeShayaris.length} {activeShayaris.length === 1 ? 'verse' : 'verses'} • Swipe left / right
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Auto Play */}
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              disabled={activeShayaris.length <= 1}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                autoPlay
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 text-white/70 border-white/10 hover:text-white disabled:opacity-40'
              }`}
              title={autoPlay ? 'Pause Auto-Play' : 'Start Auto-Play (7s per verse)'}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden md:inline">{autoPlay ? 'Playing' : 'Auto Play'}</span>
            </button>

            {/* Font Scale (Mobile touch-friendly) */}
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setFontScale((s) => Math.max(0.8, s - 0.1))}
                className="px-2 py-1.5 text-white/70 hover:text-white"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontScale((s) => Math.min(1.5, s + 0.1))}
                className="px-2 py-1.5 text-white/70 hover:text-white"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Exit Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Exit Mushaira Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* THEME & MOOD FILTER STRIP (Optimized for Mobile Phone Swipe & Tap) */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono pr-1 shrink-0 flex items-center gap-1">
            <Palette className="w-3 h-3 text-amber-400" />
            Theme:
          </span>

          {THEME_MODES.map((thm) => {
            const isSelected = selectedTheme === thm.id;
            const count = thm.id === 'all' 
              ? shayaris.length 
              : shayaris.filter(s => (s.mood || '').trim().toLowerCase() === thm.id).length;

            return (
              <button
                key={thm.id}
                onClick={() => handleSelectTheme(thm.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all border flex items-center gap-1.5 touch-manipulation ${
                  isSelected
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-lg shadow-amber-950/30 font-bold scale-[1.02]'
                    : 'bg-white/5 text-white/65 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{thm.icon}</span>
                <span>{thm.name}</span>
                {thm.urdu && <span className="text-[10px] opacity-75 font-nastaliq">({thm.urdu})</span>}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-white/50'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* When 'All' mode is active, allow switching stage atmosphere preset */}
          {selectedTheme === 'all' && (
            <div className="ml-2 pl-2 border-l border-white/10 flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-white/40 font-mono pr-1">Atmosphere:</span>
              {[
                { id: 'midnight', label: 'Midnight' },
                { id: 'crimson', label: 'Crimson' },
                { id: 'emerald', label: 'Emerald' },
                { id: 'auto', label: '✨ Auto' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStageLighting(st.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
                    stageLighting === st.id
                      ? 'bg-white/20 text-white border-white/40'
                      : 'bg-transparent text-white/50 border-white/5 hover:text-white/80'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* RECITING STAGE / MOBILE TOUCH CANVAS */}
      <main 
        onClick={() => setShowControls(prev => !prev)}
        className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full text-center cursor-pointer select-none"
      >
        
        {activeShayari ? (
          <>
            {/* Title & Active Mood Pill */}
            <div className="mb-6 sm:mb-8 space-y-2 pointer-events-none animate-fade-in">
              {activeShayari.title && (
                <h3 className="font-display text-base sm:text-xl font-medium tracking-wide text-white/90">
                  {activeShayari.title}
                </h3>
              )}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] uppercase tracking-widest px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 font-serif">
                  {activeShayari.mood || 'Kalam'}
                </span>
                {selectedTheme === 'all' && stageLighting === 'auto' && (
                  <span className="text-[10px] font-mono text-amber-300/80">
                    • Atmosphere: {activeShayari.mood}
                  </span>
                )}
              </div>
            </div>

            {/* Couplets / Verses in Commanding Calligraphy (Phone Optimized) */}
            <div 
              className={`w-full space-y-5 sm:space-y-8 transition-all duration-300 pointer-events-none ${scriptConfig.fontClass} ${
                isRtl ? 'font-nastaliq text-right sm:text-center' : 'text-center'
              } ${currentTheme.text}`}
              style={{ transform: `scale(${fontScale})` }}
            >
              {stanzas.map((stanza, i) => (
                <div 
                  key={i} 
                  className="whitespace-pre-line text-xl sm:text-3xl md:text-4xl leading-[2.1] sm:leading-[2.4] font-normal drop-shadow-xl px-2"
                >
                  {stanza}
                </div>
              ))}
            </div>

            {/* Poet Byline / Takhallis */}
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 pointer-events-none">
              <Sparkles className={`w-4 h-4 ${currentTheme.accent}`} />
              <p className="font-serif italic text-base sm:text-xl font-semibold tracking-wide text-amber-300/90">
                ~ {activeShayari.takhallis || activeShayari.poet || 'Ijlaal'}
              </p>
            </div>
          </>
        ) : (
          /* Poetic Empty State when no verses exist under selected theme */
          <div className="flex flex-col items-center justify-center py-12 px-6 max-w-md mx-auto text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300/80 shadow-inner">
              <Feather className="w-8 h-8 opacity-70" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1.5">
                اس کیفیت کا کوئی کلام نہیں
              </h3>
              <p className="text-xs sm:text-sm text-white/60 font-serif leading-relaxed">
                No shayaris found under the <span className="text-amber-300 font-semibold">{currentThemeConfig.name}</span> theme in your Diwan yet.
              </p>
            </div>
            <button
              onClick={() => handleSelectTheme('all')}
              className="mt-3 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all active:scale-95 shadow-md flex items-center gap-2 touch-manipulation"
            >
              <Sparkles className="w-4 h-4" />
              <span>Show All Verses (تمام کلام)</span>
            </button>
          </div>
        )}

      </main>

      {/* BOTTOM FOOTER & MOBILE THUMB NAVIGATION */}
      <footer className={`relative z-20 px-4 sm:px-8 py-3.5 transition-all duration-300 border-t border-white/10 bg-black/30 backdrop-blur-md ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Verse Counter */}
          <div className="text-xs font-mono text-white/70 flex items-center gap-1.5">
            {activeShayaris.length > 0 ? (
              <>
                <span className="text-white font-bold">{safeIndex + 1}</span>
                <span className="text-white/40">/</span>
                <span className="text-white font-bold">{activeShayaris.length}</span>
                {selectedTheme !== 'all' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10 ml-1 font-serif hidden sm:inline-block">
                    {currentThemeConfig.name} ({currentThemeConfig.urdu})
                  </span>
                )}
              </>
            ) : (
              <span className="text-white/40">0 verses</span>
            )}
          </div>

          {/* Thumb Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={activeShayaris.length <= 1}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-medium text-xs transition-all shadow-md touch-manipulation disabled:opacity-40 disabled:pointer-events-none"
              title="Previous Kalam"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={goToNext}
              disabled={activeShayaris.length <= 1}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-[#140e08] font-bold text-xs shadow-lg shadow-amber-950/40 transition-all touch-manipulation disabled:opacity-40 disabled:pointer-events-none"
              title="Next Kalam"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Info / Tap tip */}
          <div className="text-[11px] text-white/40 font-serif hidden sm:block">
            Tap canvas to toggle toolbar • Swipe on phone
          </div>

        </div>
      </footer>

    </div>
  );
}
