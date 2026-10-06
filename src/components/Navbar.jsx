import React from 'react';
import { Feather, BookOpen, PenTool, Database, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, count, favoritesCount, onOpenBackup, penName, setPenName }) {
  return (
    <header className="border-b border-[#26201a] bg-[#120e0a]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/30 via-rose-900/30 to-amber-900/20 border border-amber-600/30 flex items-center justify-center shadow-lg shadow-amber-950/20">
            <Feather className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-[#f5ede0]">
                Qalam & Diwan
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-nastaliq">
                قلم و دیوان
              </span>
            </div>
            <p className="text-xs text-[#9d8d7b] font-serif tracking-wide">
              A sanctuary for Urdu & Hindi poetry
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#1c1611] p-1 rounded-xl border border-[#2d251d]">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'write'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-900/30'
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
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'text-[#ab9c8a] hover:text-[#ede2d0] hover:bg-[#261f18]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Diwan (Library)</span>
            {count > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/40 text-amber-200 font-mono">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Actions & Author Profile */}
        <div className="flex items-center gap-3">
          {/* Takhallis / Pen Name Display */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18120d] border border-[#2d251d] text-xs text-[#cfc1b0]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[#8e7e6d]">Takhallis:</span>
            <input
              type="text"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              placeholder="Your pen name"
              className="bg-transparent border-none outline-none font-serif text-amber-200 text-xs w-20 focus:w-28 transition-all"
              title="Your poetic pseudonym (Takhallis)"
            />
          </div>

          {/* Backup / Export */}
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a140f] hover:bg-[#261e16] border border-[#332a21] text-xs text-[#cfc1b0] transition-colors"
            title="Backup, Sync & Export"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Storage & Sync</span>
          </button>
        </div>

      </div>
    </header>
  );
}
