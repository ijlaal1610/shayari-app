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
  onGoToWrite 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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
      <div className="rounded-2xl bg-gradient-to-b from-[#18130e] to-[#120e0a] border border-[#2b2219] p-5 sm:p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f6f5f]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, verses, titles, or moods..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0f0c09] border border-[#2e241b] focus:border-amber-500/50 outline-none text-sm text-[#f5ede0] placeholder-[#6d5e4f] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7f6f5f] hover:text-[#d3c3b0]"
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
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-[#140f0b] text-[#9b8b78] border-[#292017] hover:text-[#e4d6c4]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-300' : ''}`} />
              <span>Favorites ({favoritesCount})</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#140f0b] p-1 rounded-xl border border-[#292017]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-[#292017] text-amber-200' : 'text-[#7d6e5d] hover:text-[#d3c3b0]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-[#292017] text-amber-200' : 'text-[#7d6e5d] hover:text-[#d3c3b0]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Mood Category Pills */}
        <div className="mt-4 pt-4 border-t border-[#241c15] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-[#7f6f5f] font-serif pr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-500" />
            Mood:
          </span>

          <button
            onClick={() => setSelectedMood('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedMood === 'ALL'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-semibold'
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
                    ? `bg-gradient-to-r ${m.color} ring-1 ring-amber-400/50 font-semibold`
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
        <h2 className="text-sm font-serif text-[#9b8b78]">
          Showing <span className="text-[#f5ede0] font-mono font-medium">{filteredShayaris.length}</span> {filteredShayaris.length === 1 ? 'verse' : 'verses'} in Diwan
        </h2>
        <button
          onClick={onGoToWrite}
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Compose New Verse</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredShayaris.length === 0 ? (
        <div className="rounded-2xl bg-[#140f0b] border border-[#261e16] p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-[#f5ede0] mb-2">
            No verses found
          </h3>
          <p className="text-xs text-[#8f806f] font-serif leading-relaxed mb-6">
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
            />
          ))}
        </div>
      )}

    </div>
  );
}
