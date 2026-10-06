import React from 'react';
import { 
  Feather, BookOpen, PenTool, Database, Heart, Sparkles, 
  Sun, Moon, Mic2, DownloadCloud, Smartphone 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  count, 
  favoritesCount, 
  onOpenBackup, 
  penName, 
  setPenName,
  theme,
  onToggleTheme,
  onOpenMushaira,
  showInstallBtn,
  onInstallApp
}) {
  const isDaylight = theme === 'daylight';

  return (
    <header className={`border-b sticky top-0 z-30 px-4 sm:px-8 py-3.5 transition-colors duration-300 backdrop-blur-md ${
      isDaylight 
        ? 'bg-[#faf6ee]/90 border-[#e3d7c5] text-[#2c2016]' 
        : 'bg-[#120e0a]/90 border-[#26201a] text-[#ede2d0]'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-lg transition-colors ${
            isDaylight
              ? 'bg-amber-100/80 border-amber-300 text-amber-800 shadow-amber-900/10'
              : 'bg-gradient-to-br from-amber-600/30 via-rose-900/30 to-amber-900/20 border-amber-600/30 text-amber-300 shadow-amber-950/20'
          }`}>
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-display text-xl font-bold tracking-tight ${
                isDaylight ? 'text-[#1c130b]' : 'text-[#f5ede0]'
              }`}>
                Qalam & Diwan
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-nastaliq border ${
                isDaylight 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                قلم و دیوان
              </span>
            </div>
            <p className={`text-xs font-serif tracking-wide ${
              isDaylight ? 'text-[#846f5b]' : 'text-[#9d8d7b]'
            }`}>
              A sanctuary for Urdu & Hindi poetry
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center p-1 rounded-xl border transition-colors ${
          isDaylight 
            ? 'bg-[#ece3d4] border-[#ded0be]' 
            : 'bg-[#1c1611] border-[#2d251d]'
        }`}>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'write'
                ? isDaylight
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-900/30'
                : isDaylight
                  ? 'text-[#6b5845] hover:text-[#2c2016] hover:bg-[#e4d8c6]'
                  : 'text-[#ab9c8a] hover:text-[#ede2d0] hover:bg-[#261f18]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Qalam (Write)</span>
          </button>

          <button
            onClick={() => setActiveTab('diwan')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'diwan'
                ? isDaylight
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-900/30'
                : isDaylight
                  ? 'text-[#6b5845] hover:text-[#2c2016] hover:bg-[#e4d8c6]'
                  : 'text-[#ab9c8a] hover:text-[#ede2d0] hover:bg-[#261f18]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Diwan (Library)</span>
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                isDaylight ? 'bg-amber-200/80 text-amber-900' : 'bg-black/40 text-amber-200'
              }`}>
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Actions & Author Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Mushaira Mode Button */}
          <button
            onClick={onOpenMushaira}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isDaylight
                ? 'bg-amber-100 hover:bg-amber-200/80 border-amber-300 text-amber-900'
                : 'bg-gradient-to-r from-amber-600/20 to-rose-600/20 hover:from-amber-600/30 hover:to-rose-600/30 border-amber-500/30 text-amber-200'
            }`}
            title="Launch Full-Screen Mushaira Recital Stage"
          >
            <Mic2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Mushaira Mode</span>
          </button>

          {/* Theme Switcher: Daylight vs Shab-e-Gham */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDaylight
                ? 'bg-[#ede5d6] hover:bg-[#e4dac7] border-[#d8c9b2] text-amber-800'
                : 'bg-[#1a140f] hover:bg-[#261e16] border-[#332a21] text-amber-300'
            }`}
            title={isDaylight ? 'Switch to Night Velvet (Shab-e-Gham)' : 'Switch to Daylight Vintage Parchment (Roz-e-Roshan)'}
          >
            {isDaylight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* PWA Install Button (if available) */}
          {showInstallBtn && (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              title="Install Qalam & Diwan as App on your device"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Install App</span>
            </button>
          )}

          {/* Takhallis / Pen Name Display */}
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
            isDaylight 
              ? 'bg-[#ede5d6] border-[#d8c9b2] text-[#4d3d2e]' 
              : 'bg-[#18120d] border-[#2d251d] text-[#cfc1b0]'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="opacity-75">Takhallis:</span>
            <input
              type="text"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              placeholder="Your pen name"
              className={`bg-transparent border-none outline-none font-serif text-xs w-20 focus:w-28 transition-all font-semibold ${
                isDaylight ? 'text-amber-900' : 'text-amber-200'
              }`}
              title="Your poetic pseudonym (Takhallis)"
            />
          </div>

          {/* Backup / Storage */}
          <button
            onClick={onOpenBackup}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              isDaylight
                ? 'bg-[#ede5d6] hover:bg-[#e4dac7] border-[#d8c9b2] text-[#4d3d2e]'
                : 'bg-[#1a140f] hover:bg-[#261e16] border-[#332a21] text-[#cfc1b0]'
            }`}
            title="Backup, Sync & Export"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xl:inline">Storage</span>
          </button>
        </div>

      </div>
    </header>
  );
}
