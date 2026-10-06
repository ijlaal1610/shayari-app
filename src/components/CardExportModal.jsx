import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { 
  X, Download, Sparkles, Feather, Palette, 
  Type, Check, Loader2 
} from 'lucide-react';
import { SCRIPTS } from '../data/sampleShayaris';

const THEMES = [
  {
    id: 'shab',
    name: 'Shab-e-Gham',
    desc: 'Midnight Velvet & Gold',
    bgClass: 'bg-gradient-to-br from-[#121016] via-[#1a1420] to-[#0d0910]',
    borderClass: 'border-[#3f314d]/40',
    textClass: 'text-[#f5edfa]',
    accentClass: 'text-amber-300',
    subTextClass: 'text-[#9f8fae]',
    watermark: 'border-t border-[#342742]'
  },
  {
    id: 'parchment',
    name: 'Qalam & Parchment',
    desc: 'Antique Paper & Walnut',
    bgClass: 'bg-gradient-to-br from-[#241a12] via-[#2f2218] to-[#1a130d]',
    borderClass: 'border-[#4a3928]/50',
    textClass: 'text-[#fceed3]',
    accentClass: 'text-amber-400',
    subTextClass: 'text-[#ab9275]',
    watermark: 'border-t border-[#3e2f20]'
  },
  {
    id: 'gulabi',
    name: 'Gulabi Shaam',
    desc: 'Crimson Rosewood Sunset',
    bgClass: 'bg-gradient-to-br from-[#2a0f17] via-[#38141f] to-[#18080d]',
    borderClass: 'border-[#612435]/40',
    textClass: 'text-[#fde8ed]',
    accentClass: 'text-rose-300',
    subTextClass: 'text-[#c28e9b]',
    watermark: 'border-t border-[#4f1b29]'
  },
  {
    id: 'koyla',
    name: 'Koyla',
    desc: 'Minimalist Matte Obsidian',
    bgClass: 'bg-gradient-to-b from-[#141416] to-[#09090b]',
    borderClass: 'border-[#2d2d33]',
    textClass: 'text-[#ededf0]',
    accentClass: 'text-[#e2c18d]',
    subTextClass: 'text-[#7d7d8c]',
    watermark: 'border-t border-[#232328]'
  }
];

export default function CardExportModal({ shayari, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
  const [selectedScript, setSelectedScript] = useState(shayari.script || 'roman');
  const [customAuthor, setCustomAuthor] = useState(shayari.takhallis || shayari.poet || 'Ijlaal');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const cardRef = useRef(null);

  const themeConfig = THEMES.find(t => t.id === selectedTheme) || THEMES[0];
  const scriptConfig = SCRIPTS.find(s => s.id === selectedScript) || SCRIPTS[0];
  const isRtl = Boolean(scriptConfig.rtl);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      // Generate crisp image
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5, // High resolution for mobile/social sharing
      });

      const link = document.createElement('a');
      link.download = `shayari-${(customAuthor || 'kalam').toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export card image:', err);
      alert('Could not generate card image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const stanzas = (shayari.lines || '').split('\n\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#140f0b] border border-[#2b2118] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#241c15] mb-6">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-display text-lg font-bold text-[#f5ede0]">
                Aesthetic Shayari Card Exporter
              </h3>
              <p className="text-xs text-[#8f7f6f] font-serif">
                Design and download a social-ready poetry card
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7f6f5f] hover:text-[#e4d6c4] hover:bg-[#201811] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Controls */}
        <div className="space-y-4 mb-6">
          {/* Themes */}
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme Aesthetics</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedTheme === t.id
                      ? 'border-amber-500/80 bg-[#261f18] ring-1 ring-amber-400/50 shadow-md'
                      : 'border-[#292017] bg-[#1a140f] hover:border-[#3d2f21]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#f5ede0] truncate">{t.name}</p>
                  <p className="text-[10px] text-[#8f7f6f] truncate">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Script & Pen Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-1.5">
                Poetry Script
              </label>
              <select
                value={selectedScript}
                onChange={(e) => setSelectedScript(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1c1611] border border-[#2e241c] text-xs text-[#e4d6c4] outline-none"
              >
                {SCRIPTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-1.5">
                Author Byline / Takhallis
              </label>
              <input
                type="text"
                value={customAuthor}
                onChange={(e) => setCustomAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-3 py-2 rounded-xl bg-[#1c1611] border border-[#2e241c] text-xs text-[#e4d6c4] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Card Preview (Captured for PNG download) */}
        <div className="flex justify-center p-3 sm:p-5 bg-[#0a0806] rounded-xl border border-[#221a13] overflow-hidden">
          <div
            ref={cardRef}
            className={`w-full max-w-md p-8 sm:p-10 rounded-2xl border shadow-2xl relative transition-all duration-300 ${themeConfig.bgClass} ${themeConfig.borderClass}`}
          >
            {/* Top Emblem / Feather */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
              <span className={`text-[11px] font-serif uppercase tracking-widest ${themeConfig.subTextClass}`}>
                {shayari.mood || 'Kalam'}
              </span>
              <Feather className={`w-4 h-4 ${themeConfig.accentClass} opacity-80`} />
            </div>

            {/* Verses */}
            <div className={`my-6 space-y-4 ${scriptConfig.fontClass} ${themeConfig.textClass} ${isRtl ? 'text-right font-nastaliq' : 'text-center'}`}>
              {stanzas.map((stanza, idx) => (
                <div key={idx} className="whitespace-pre-line text-lg sm:text-xl leading-relaxed tracking-wide font-normal">
                  {stanza}
                </div>
              ))}
            </div>

            {/* Footer Watermark */}
            <div className={`mt-6 pt-4 ${themeConfig.watermark} flex items-center justify-between text-xs ${themeConfig.subTextClass}`}>
              <span className={`font-serif italic ${themeConfig.accentClass} text-sm font-semibold`}>
                ~ {customAuthor || 'Ijlaal'}
              </span>
              <span className="text-[10px] opacity-60 font-mono tracking-wider">
                Qalam & Diwan
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#241c15] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1c1611] hover:bg-[#261f18] text-xs text-[#9f8f7f] hover:text-[#ede2d0] transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              downloadSuccess
                ? 'bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#140e08]'
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Card...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Card Saved to Downloads!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Card (PNG)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
