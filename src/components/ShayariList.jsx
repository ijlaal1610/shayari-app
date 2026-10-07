import React, { useState, useMemo } from 'react';
import { 
  Search, Heart, LayoutGrid, List, Filter, 
  PenTool, BookOpen, Sparkles, X
} from 'lucide-react';
import ShayariCard from './ShayariCard';
import { MOODS } from '../data/sampleShayaris';

export default function ShayariList({ 
  shayaris, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onExportCard, 
  onGoToWrite,
  onRecite,
  theme = 'dark'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const isDaylight = theme === 'daylight';

  const filteredShayaris = useMemo(() => {
    return shayaris.filter((item) => {
      // Favorites filter
      if (favoritesOnly && !item.favorite) return false;

      // Mood filter
      if (selectedMood !== 'ALL' && item.mood !== selectedMood) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLines = (item.lines || '').toLowerCase().includes(q);
        const matchesTitle = (item.title || '').toLowerCase().includes(q);
        const matchesPoet = (item.poet || '').toLowerCase().includes(q);
        const matchesMood = (item.mood || '').toLowerCase().includes(q);
        if (!matchesLines && !matchesTitle && !matchesPoet && !matchesMood) {
          return false;
        }
      }

      return true;
    });
  }, [shayaris, searchQuery, selectedMood, favoritesOnly]);

  const favoritesCount = useMemo(() => {
    return shayaris.filter(s => s.favorite).length;
  }, [shayaris]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Filter and Search Bar */}
      <div className={`rounded-2xl border p-5 sm:p-6 mb-8 transition-colors ${
        isDaylight
          ? 'bg-[#fbf7ee] border-[#ded4c3] shadow-md text-[#2c2217]'
          : 'bg-gradient-to-b from-[#18130e] to-[#120e0a] border-[#2b2219] shadow-xl text-[#ede2d0]'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isDaylight ? 'text-[#8c7965]' : 'text-[#7f6f5f]'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, verses, titles, or moods..."
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-sm transition-all ${
                isDaylight
                  ? 'bg-[#ede5d5] border-[#d8ccb8] focus:border-amber-700/60 text-[#22170d] placeholder-[#8c7965]'
                  : 'bg-[#0f0c09] border-[#2e241b] focus:border-amber-500/50 text-[#f5ede0] placeholder-[#6d5e4f]'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                  isDaylight ? 'text-[#8c7965] hover:text-[#22170d]' : 'text-[#7f6f5f] hover:text-[#d3c3b0]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Favorites Only Toggle */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                favoritesOnly
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 shadow-sm'
                  : isDaylight
                    ? 'bg-[#ede5d5] text-[#705c48] border-[#d8ccb8] hover:text-[#22170d]'
                    : 'bg-[#140f0b] text-[#9b8b78] border-[#292017] hover:text-[#e4d6c4]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-500' : ''}`} />
              <span>Favorites ({favoritesCount})</span>
            </button>

            {/* View Mode Toggle */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDaylight ? 'bg-[#ede5d5] border-[#d8ccb8]' : 'bg-[#140f0b] border-[#292017]'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? isDaylight ? 'bg-[#dfd3be] text-[#3e2714]' : 'bg-[#292017] text-amber-200'
                    : isDaylight ? 'text-[#8c7965] hover:text-[#22170d]' : 'text-[#7d6e5d] hover:text-[#d3c3b0]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? isDaylight ? 'bg-[#dfd3be] text-[#3e2714]' : 'bg-[#292017] text-amber-200'
                    : isDaylight ? 'text-[#8c7965] hover:text-[#22170d]' : 'text-[#7d6e5d] hover:text-[#d3c3b0]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Mood Category Pills */}
        <div className={`mt-4 pt-4 border-t flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${
          isDaylight ? 'border-[#e8dfcf]' : 'border-[#241c15]'
        }`}>
          <span className={`text-xs font-serif pr-1 flex items-center gap-1 ${
            isDaylight ? 'text-[#705c48]' : 'text-[#7f6f5f]'
          }`}>
            <Filter className={`w-3 h-3 ${isDaylight ? 'text-amber-700' : 'text-amber-500'}`} />
            Mood:
          </span>

          <button
            onClick={() => setSelectedMood('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedMood === 'ALL'
                ? isDaylight
                  ? 'bg-amber-700 text-white font-semibold shadow-sm'
                  : 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-semibold'
                : isDaylight
                  ? 'bg-[#ede5d5] text-[#705c48] border border-[#d8ccb8] hover:text-[#22170d]'
                  : 'bg-[#120e0a] text-[#8e7e6d] border border-[#241c15] hover:text-[#e4d6c4]'
            }`}
          >
            All Verses ({shayaris.length})
          </button>

          {MOODS.map(m => {
            const count = shayaris.filter(s => s.mood === m.id).length;
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 border flex items-center gap-1 ${
                  isSelected
                    ? `bg-gradient-to-r ${m.color} ring-1 ${isDaylight ? 'ring-amber-800/40 text-black font-bold' : 'ring-amber-400/50 font-semibold'}`
                    : isDaylight
                      ? 'bg-[#ede5d5] text-[#705c48] border-[#d8ccb8] hover:text-[#22170d]'
                      : 'bg-[#120e0a] text-[#8e7e6d] border-[#241c15] hover:text-[#e4d6c4]'
                }`}
              >
                <span>{m.label}</span>
                {count > 0 && <span className="opacity-75 font-mono text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className={`text-sm font-serif ${isDaylight ? 'text-[#705c48]' : 'text-[#9b8b78]'}`}>
          Showing <span className={`font-mono font-medium ${isDaylight ? 'text-[#22170d]' : 'text-[#f5ede0]'}`}>{filteredShayaris.length}</span> {filteredShayaris.length === 1 ? 'verse' : 'verses'} in Diwan
        </h2>
        <button
          onClick={onGoToWrite}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            isDaylight ? 'text-amber-800 hover:text-amber-950 font-semibold' : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Compose New Verse</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredShayaris.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center max-w-lg mx-auto ${
          isDaylight ? 'bg-[#fbf7ee] border-[#ded4c3] text-[#2c2217]' : 'bg-[#140f0b] border-[#261e16] text-[#ede2d0]'
        }`}>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className={`font-display text-lg font-bold mb-2 ${isDaylight ? 'text-[#22170d]' : 'text-[#f5ede0]'}`}>
            No verses found
          </h3>
          <p className={`text-xs font-serif leading-relaxed mb-6 ${isDaylight ? 'text-[#705c48]' : 'text-[#8f806f]'}`}>
            {searchQuery || selectedMood !== 'ALL' || favoritesOnly
              ? 'No verses match your current search or mood filters. Try resetting the filter.'
              : 'Your Diwan is currently quiet. Begin by writing your first couplet.'}
          </p>
          <button
            onClick={onGoToWrite}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#140e08] font-bold text-xs shadow-lg shadow-amber-950/40 transition-all"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Open Qalam (Compose)</span>
          </button>
        </div>
      ) : (
        /* Shayaris Grid / List */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6 max-w-3xl mx-auto'}>
          {filteredShayaris.map((item) => (
            <ShayariCard
              key={item.id}
              shayari={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onExportCard={onExportCard}
              onRecite={onRecite}
              theme={theme}
            />
          ))}
        </div>
      )}

    </div>
  );
}
