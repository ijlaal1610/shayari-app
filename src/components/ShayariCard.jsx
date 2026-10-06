import React, { useState } from 'react';
import { 
  Heart, Copy, Check, Share2, Edit3, Trash2, 
  Sparkles, Calendar, BookMarked
} from 'lucide-react';
import { MOODS, SCRIPTS } from '../data/sampleShayaris';

export default function ShayariCard({ 
  shayari, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onExportCard 
}) {
  const [copied, setCopied] = useState(false);

  const moodConfig = MOODS.find(m => m.id === shayari.mood) || MOODS[0];
  const scriptConfig = SCRIPTS.find(s => s.id === shayari.script) || SCRIPTS[0];
  const isRtl = Boolean(scriptConfig.rtl);

  const handleCopy = () => {
    const formatted = `${shayari.lines}\n\n— ${shayari.poet || shayari.takhallis || 'Ijlaal'}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split lines into couplets/stanzas
  const stanzas = shayari.lines.split('\n\n');

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-[#18130e] to-[#120e0a] border border-[#2b2219] hover:border-amber-600/40 p-6 sm:p-7 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col justify-between">
      
      {/* Top Bar: Mood & Actions */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-[#241c15]">
        
        {/* Mood Pill */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border bg-gradient-to-r ${moodConfig.color} flex items-center gap-1.5`}>
          <span>{moodConfig.label}</span>
          <span className="font-nastaliq text-[10px] opacity-75">{moodConfig.urdu}</span>
        </div>

        {/* Favorite & Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(shayari.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              shayari.favorite
                ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                : 'text-[#6b5c4d] hover:text-[#d3c3b0] hover:bg-[#201811]'
            }`}
            title={shayari.favorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${shayari.favorite ? 'fill-rose-400' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[#6b5c4d] hover:text-[#d3c3b0] hover:bg-[#201811] transition-colors"
            title="Copy couplets to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onExportCard(shayari)}
            className="p-1.5 rounded-lg text-[#6b5c4d] hover:text-amber-300 hover:bg-[#201811] transition-colors"
            title="Export as aesthetic image card"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(shayari)}
            className="p-1.5 rounded-lg text-[#6b5c4d] hover:text-amber-300 hover:bg-[#201811] transition-colors"
            title="Edit verse"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(shayari.id)}
            className="p-1.5 rounded-lg text-[#6b5c4d] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete from Diwan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Couplets Content */}
      <div className="my-auto py-2">
        {shayari.title && (
          <h3 className="text-sm font-display font-medium text-amber-200/80 mb-3 tracking-wide">
            {shayari.title}
          </h3>
        )}

        <div className={`space-y-4 ${scriptConfig.fontClass} ${isRtl ? 'text-right font-nastaliq' : 'text-left'}`}>
          {stanzas.map((stanza, idx) => (
            <div key={idx} className="whitespace-pre-line text-[#f5ede0] leading-relaxed text-lg sm:text-xl font-normal">
              {stanza}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer: Poet signature & date */}
      <div className={`mt-6 pt-4 border-t border-[#221a14] flex items-center justify-between text-xs text-[#7d6d5d] ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500/70" />
          <span className="font-serif italic text-amber-300/90 text-sm">
            ~ {shayari.takhallis || shayari.poet || 'Ijlaal'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#6b5c4e] font-mono">
          <Calendar className="w-3 h-3" />
          <span>{new Date(shayari.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

    </div>
  );
}
