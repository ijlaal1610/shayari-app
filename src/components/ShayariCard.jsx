import React, { useState } from 'react';
import { 
  Heart, Copy, Check, Share2, Edit3, Trash2, 
  Sparkles, Calendar, Feather, Image as ImageIcon
} from 'lucide-react';
import { MOODS, SCRIPTS } from '../data/sampleShayaris';

export default function ShayariCard({ 
  shayari, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onExportCard,
  onRecite,
  theme = 'dark'
}) {
  const [copied, setCopied] = useState(false);
  const isDaylight = theme === 'daylight';

  const moodConfig = MOODS.find(m => m.id === shayari.mood) || MOODS[0];
  const scriptConfig = SCRIPTS.find(s => s.id === shayari.script) || SCRIPTS[0];
  const isRtl = Boolean(scriptConfig.rtl);

  const handleCopy = () => {
    const formatted = `${shayari.lines}\n\n— ${shayari.takhallis || shayari.poet || 'Ijlaal'}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const formatted = `${shayari.lines}\n\n— ${shayari.takhallis || shayari.poet || 'Ijlaal'}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shayari.title || 'Shayari — ' + (shayari.takhallis || 'Ijlaal'),
          text: formatted
        });
        return;
      } catch (err) {
        // Fallback to export picture studio if user cancels or share fails
      }
    }
    // Default to Picture Studio export modal
    onExportCard(shayari);
  };

  // Split lines into couplets/stanzas
  const stanzas = (shayari.lines || '').split('\n\n');

  return (
    <div className={`group relative rounded-2xl border p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between ${
      isDaylight
        ? 'bg-[#fbf7ee] border-[#ded4c3] hover:border-amber-700/50 shadow-md hover:shadow-xl hover:shadow-amber-900/10 text-[#2c2217]'
        : 'bg-gradient-to-b from-[#18130e] to-[#120e0a] border-[#2b2219] hover:border-amber-600/40 shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 text-[#ede2d0]'
    }`}>
      
      {/* Top Bar: Mood & Actions */}
      <div className={`flex items-center justify-between gap-3 mb-5 pb-3 border-b ${
        isDaylight ? 'border-[#e8dfcf]' : 'border-[#241c15]'
      }`}>
        
        {/* Mood Pill */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border bg-gradient-to-r ${moodConfig.color} flex items-center gap-1.5`}>
          <span>{moodConfig.label}</span>
          <span className="font-nastaliq text-[10px] opacity-75">{moodConfig.urdu}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* 1-Tap Recite in Mushaira Mode */}
          {onRecite && (
            <button
              onClick={() => onRecite(shayari)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDaylight
                  ? 'text-amber-800 bg-amber-100/60 hover:bg-amber-200/70'
                  : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
              }`}
              title="Recite in Mushaira Mode (بزمِ مشاعرہ)"
            >
              <Feather className="w-4 h-4" />
            </button>
          )}

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(shayari.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              shayari.favorite
                ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20'
                : isDaylight
                  ? 'text-[#8c7965] hover:text-[#2c2217] hover:bg-[#efe7d8]'
                  : 'text-[#6b5c4d] hover:text-[#d3c3b0] hover:bg-[#201811]'
            }`}
            title={shayari.favorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${shayari.favorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition-colors ${
              isDaylight
                ? 'text-[#8c7965] hover:text-[#2c2217] hover:bg-[#efe7d8]'
                : 'text-[#6b5c4d] hover:text-[#d3c3b0] hover:bg-[#201811]'
            }`}
            title="Copy couplets to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Export Picture Modal */}
          <button
            onClick={() => onExportCard(shayari)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDaylight
                ? 'text-[#8c7965] hover:text-[#2c2217] hover:bg-[#efe7d8]'
                : 'text-[#6b5c4d] hover:text-amber-300 hover:bg-[#201811]'
            }`}
            title="Export as Instagram Story or Square Picture"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Mobile Direct Share Sheet */}
          <button
            onClick={handleShare}
            className={`p-1.5 rounded-lg transition-colors ${
              isDaylight
                ? 'text-[#8c7965] hover:text-[#2c2217] hover:bg-[#efe7d8]'
                : 'text-[#6b5c4d] hover:text-amber-300 hover:bg-[#201811]'
            }`}
            title="Share via WhatsApp / Instagram"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(shayari)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDaylight
                ? 'text-[#8c7965] hover:text-[#2c2217] hover:bg-[#efe7d8]'
                : 'text-[#6b5c4d] hover:text-amber-300 hover:bg-[#201811]'
            }`}
            title="Edit verse"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(shayari.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDaylight
                ? 'text-[#8c7965] hover:text-rose-600 hover:bg-rose-100/60'
                : 'text-[#6b5c4d] hover:text-rose-400 hover:bg-rose-500/10'
            }`}
            title="Delete from Diwan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Couplets Content */}
      <div className="my-auto py-2">
        {shayari.title && (
          <h3 className={`text-sm font-display font-medium mb-3 tracking-wide ${
            isDaylight ? 'text-[#8b4513]' : 'text-amber-200/80'
          }`}>
            {shayari.title}
          </h3>
        )}

        <div className={`space-y-4 ${scriptConfig.fontClass} ${isRtl ? 'text-right font-nastaliq' : 'text-left'}`}>
          {stanzas.map((stanza, idx) => (
            <div 
              key={idx} 
              className={`whitespace-pre-line leading-relaxed text-lg sm:text-xl font-normal ${
                isDaylight ? 'text-[#20170f]' : 'text-[#f5ede0]'
              }`}
            >
              {stanza}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer: Poet signature & date */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
        isDaylight ? 'border-[#e8dfcf] text-[#8c7965]' : 'border-[#221a14] text-[#7d6d5d]'
      } ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${isDaylight ? 'text-amber-700' : 'text-amber-500/70'}`} />
          <span className={`font-serif italic text-sm font-medium ${
            isDaylight ? 'text-[#7a3e12]' : 'text-amber-300/90'
          }`}>
            ~ {shayari.takhallis || shayari.poet || 'Ijlaal'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono opacity-80">
          <Calendar className="w-3 h-3" />
          <span>{new Date(shayari.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

    </div>
  );
}
