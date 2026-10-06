import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { 
  X, Download, Sparkles, Feather, Palette, 
  Type, Check, Loader2, Music, Copy, Smartphone, 
  Square, Layout, AlignLeft, AlignCenter, AlignRight,
  Sliders, SlidersHorizontal, Disc, Play, Share2,
  Image as ImageIcon, Trash2, Sliders as SliderIcon
} from 'lucide-react';
import { SCRIPTS } from '../data/sampleShayaris';

const FORMATS = [
  { id: 'story', name: 'Story (9:16)', icon: Smartphone, desc: 'Perfect for Instagram & WhatsApp Status', width: 'w-[360px]', minH: 'min-h-[640px]' },
  { id: 'square', name: 'Square (1:1)', icon: Square, desc: 'Instagram Feed Post', width: 'w-[420px]', minH: 'min-h-[420px]' },
  { id: 'compact', name: 'Card (Auto)', icon: Layout, desc: 'Compact Spotify Snippet', width: 'w-[380px]', minH: 'min-h-[300px]' },
];

const STYLES = [
  { id: 'spotify', name: 'Spotify Lyrics', desc: 'Music player with audio bar & highlighted lyrics' },
  { id: 'classic', name: 'Royal Calligraphy', desc: 'Poetic parchment with ornate seals & gold' },
  { id: 'minimal', name: 'Minimalist Editorial', desc: 'Clean typography with modern lines' },
];

const THEMES = [
  {
    id: 'spotify-dark',
    name: 'Spotify Velvet',
    bg: 'bg-[#121214]',
    gradient: 'from-[#1a1a24] via-[#121214] to-[#0a0a0d]',
    accent: '#1db954',
    text: 'text-[#f5f5f7]',
    subText: 'text-[#9b9ba8]',
    border: 'border-[#26262e]',
    cardBg: 'bg-[#18181c]/90',
    barColor: 'bg-[#1db954]',
  },
  {
    id: 'shab',
    name: 'Shab-e-Gham',
    bg: 'bg-[#0f0c13]',
    gradient: 'from-[#22162b] via-[#140e1b] to-[#0a070e]',
    accent: '#f59e0b',
    text: 'text-[#fceed3]',
    subText: 'text-[#a895b8]',
    border: 'border-[#3a274c]/50',
    cardBg: 'bg-[#181220]/90',
    barColor: 'bg-amber-500',
  },
  {
    id: 'gulabi',
    name: 'Gulabi Shaam',
    bg: 'bg-[#1c0a13]',
    gradient: 'from-[#3a1324] via-[#240b17] to-[#12050b]',
    accent: '#f43f5e',
    text: 'text-[#fff1f4]',
    subText: 'text-[#d494a8]',
    border: 'border-[#581c34]/50',
    cardBg: 'bg-[#290d1b]/90',
    barColor: 'bg-rose-500',
  },
  {
    id: 'parchment',
    name: 'Walnut Parchment',
    bg: 'bg-[#1f1710]',
    gradient: 'from-[#2c2016] via-[#1c140d] to-[#120c08]',
    accent: '#d97706',
    text: 'text-[#fcedd7]',
    subText: 'text-[#b0967a]',
    border: 'border-[#453222]/60',
    cardBg: 'bg-[#261b11]/90',
    barColor: 'bg-amber-600',
  },
  {
    id: 'neelam',
    name: 'Neelam Indigo',
    bg: 'bg-[#0a121c]',
    gradient: 'from-[#112438] via-[#091524] to-[#050b12]',
    accent: '#38bdf8',
    text: 'text-[#f0f9ff]',
    subText: 'text-[#8cb4d2]',
    border: 'border-[#1b3957]/50',
    cardBg: 'bg-[#0e1e30]/90',
    barColor: 'bg-sky-400',
  },
  {
    id: 'koyla',
    name: 'Matte Obsidian',
    bg: 'bg-[#080809]',
    gradient: 'from-[#141416] via-[#080809] to-[#040405]',
    accent: '#e5e5e5',
    text: 'text-[#ffffff]',
    subText: 'text-[#7e7e8a]',
    border: 'border-[#222226]',
    cardBg: 'bg-[#111114]/90',
    barColor: 'bg-zinc-200',
  }
];

export default function CardExportModal({ shayari, onClose }) {
  const [selectedFormat, setSelectedFormat] = useState('story'); // 'story' | 'square' | 'compact'
  const [selectedStyle, setSelectedStyle] = useState('spotify'); // 'spotify' | 'classic' | 'minimal'
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
  const [selectedScript, setSelectedScript] = useState(shayari.script || 'roman');
  
  // Custom Background Photo
  const [customBgImage, setCustomBgImage] = useState(null);
  const [bgDarkness, setBgDarkness] = useState(55); // 0 to 90
  const [bgBlur, setBgBlur] = useState(6); // 0 to 25
  const photoInputRef = useRef(null);
  
  // Customization controls
  const [title, setTitle] = useState(shayari.title || 'Kalam');
  const [author, setAuthor] = useState(shayari.takhallis || shayari.poet || 'Ijlaal');
  const [fontSize, setFontSize] = useState('lg'); // 'sm' | 'md' | 'lg' | 'xl'
  const [textAlign, setTextAlign] = useState('center'); // 'left' | 'center' | 'right'
  const [showPlayerBar, setShowPlayerBar] = useState(true);
  const [showBlurBackdrop, setShowBlurBackdrop] = useState(true);
  const [highlightLineIdx, setHighlightLineIdx] = useState(0); // which line is glowing
  
  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState('');
  const cardContainerRef = useRef(null);

  const themeConfig = THEMES.find(t => t.id === selectedTheme) || THEMES[0];
  const formatConfig = FORMATS.find(f => f.id === selectedFormat) || FORMATS[0];
  const scriptConfig = SCRIPTS.find(s => s.id === selectedScript) || SCRIPTS[0];
  const isRtl = Boolean(scriptConfig.rtl) || textAlign === 'right';

  const linesArray = (shayari.lines || '').split('\n').filter(l => l.trim().length > 0);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomBgImage(event.target?.result);
      showToastMsg('📸 Photo loaded as background!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setCustomBgImage(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
    showToastMsg('Reset to color atmosphere.');
  };

  // Instant Download PNG
  const handleDownload = async () => {
    if (!cardContainerRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardContainerRef.current, {
        quality: 1,
        pixelRatio: 3, // Ultra-sharp 1080p+ rendering
      });

      const link = document.createElement('a');
      const filename = `shayari-${selectedFormat}-${(author || 'poet').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      showToastMsg('✨ Image downloaded in HD for Instagram!');
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not generate image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image to Clipboard (paste straight into Instagram web or chats)
  const handleCopyImage = async () => {
    if (!cardContainerRef.current) return;
    try {
      setIsExporting(true);
      const blob = await toBlob(cardContainerRef.current, {
        pixelRatio: 2.5,
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToastMsg('📋 Image copied to clipboard! Paste directly anywhere.');
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (err) {
      console.error('Copy image error:', err);
      // Fallback
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  // Font size classes
  const fontSizes = {
    sm: 'text-base sm:text-lg leading-relaxed',
    md: 'text-lg sm:text-xl leading-relaxed',
    lg: 'text-xl sm:text-2xl leading-relaxed',
    xl: 'text-2xl sm:text-3xl leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#120e0a] border border-[#2d2218] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#241c15] bg-[#17110c]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#f5ede0] flex items-center gap-2">
                Instagram Picture & Story Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                  Spotify-Style
                </span>
              </h3>
              <p className="text-xs text-[#8f7f6f] font-serif">
                Design shareable lyrics & poetry cards in 9:16 or 1:1 format
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7f6f5f] hover:text-[#e4d6c4] hover:bg-[#221811] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content: Controls on Left, Live Canvas on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#261d16] space-y-5 bg-[#140f0a] overflow-y-auto">
            
            {/* Format Selector (Story 9:16 vs Square 1:1) */}
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Aspect Ratio / Format</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FORMATS.map((f) => {
                  const Icon = f.icon;
                  const isSel = selectedFormat === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFormat(f.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSel
                          ? 'border-amber-500 bg-amber-500/10 text-amber-200 font-semibold shadow-md'
                          : 'border-[#292017] bg-[#1a140f] text-[#8e7e6d] hover:border-[#3d2f21] hover:text-[#e4d6c4]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{f.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Style (Spotify vs Classic vs Minimal) */}
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-2 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visual Layout</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                      selectedStyle === s.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200 shadow-sm'
                        : 'border-[#292017] bg-[#1a140f] text-[#8e7e6d] hover:border-[#3d2f21]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Presets */}
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Color Atmosphere</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedTheme === t.id
                        ? 'border-amber-500/80 bg-[#261f18] ring-1 ring-amber-400/40 shadow-sm'
                        : 'border-[#292017] bg-[#1a140f] hover:border-[#3d2f21]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                      <span className="text-xs font-medium text-[#ede2d0] truncate">{t.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Photo Upload (LyricPost style) */}
            <div className="p-3.5 rounded-2xl bg-[#18130e] border border-[#2b2118] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif uppercase tracking-wider text-[#9f8f7f] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Custom Background Photo</span>
                </label>
                {customBgImage && (
                  <button
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {!customBgImage ? (
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#3d2f21] hover:border-pink-500/50 bg-[#120e0a] hover:bg-[#1c1510] cursor-pointer text-xs text-[#b8a795] transition-all">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  <span>Upload Photo / Wallpaper</span>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {/* Photo Darkness Overlay Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-[#8e7e6e] mb-1">
                      <span>Darkness Tint (Contrast)</span>
                      <span className="font-mono text-amber-200">{bgDarkness}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={bgDarkness}
                      onChange={(e) => setBgDarkness(Number(e.target.value))}
                      className="w-full accent-pink-500 h-1.5 bg-[#292017] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Photo Blur Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-[#8e7e6e] mb-1">
                      <span>Background Blur</span>
                      <span className="font-mono text-amber-200">{bgBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={bgBlur}
                      onChange={(e) => setBgBlur(Number(e.target.value))}
                      className="w-full accent-pink-500 h-1.5 bg-[#292017] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Typography & Script */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-1.5">
                  Poetry Font
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
                  Text Size
                </label>
                <div className="flex items-center bg-[#1c1611] p-1 rounded-xl border border-[#2e241c]">
                  {['sm', 'md', 'lg', 'xl'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`flex-1 py-1 rounded-lg text-xs font-mono uppercase transition-all ${
                        fontSize === sz ? 'bg-amber-600 text-white font-bold' : 'text-[#8e7e6d]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Title & Author */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-1.5">
                  Track / Verse Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title / Ghazal"
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1611] border border-[#2e241c] text-xs text-[#e4d6c4] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#9f8f7f] mb-1.5">
                  Poet Byline
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1611] border border-[#2e241c] text-xs text-[#e4d6c4] outline-none"
                />
              </div>
            </div>

            {/* Toggles & Options */}
            <div className="pt-2 border-t border-[#241c15] space-y-2 text-xs text-[#cfc1b0]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#a89887]">
                  <Music className="w-3.5 h-3.5 text-emerald-400" />
                  Spotify Audio Progress Bar
                </span>
                <input
                  type="checkbox"
                  checked={showPlayerBar}
                  onChange={(e) => setShowPlayerBar(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#a89887]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Atmospheric Blur Backdrop
                </span>
                <input
                  type="checkbox"
                  checked={showBlurBackdrop}
                  onChange={(e) => setShowBlurBackdrop(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#a89887]">Text Alignment</span>
                <div className="flex items-center gap-1 bg-[#1a140f] p-1 rounded-lg border border-[#292017]">
                  <button
                    onClick={() => setTextAlign('left')}
                    className={`p-1 rounded ${textAlign === 'left' ? 'bg-[#2f241a] text-amber-300' : 'text-[#7e6e5e]'}`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTextAlign('center')}
                    className={`p-1 rounded ${textAlign === 'center' ? 'bg-[#2f241a] text-amber-300' : 'text-[#7e6e5e]'}`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTextAlign('right')}
                    className={`p-1 rounded ${textAlign === 'right' ? 'bg-[#2f241a] text-amber-300' : 'text-[#7e6e5e]'}`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#7a6a5a] font-serif italic pt-1">
              Tip: Click any couplet line in the preview to highlight it like an active Spotify lyric!
            </p>

          </div>

          {/* Live Preview Canvas Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-[#080605] flex flex-col items-center justify-center overflow-y-auto">
            
            {/* The Export Container captured by html-to-image */}
            <div
              ref={cardContainerRef}
              className={`relative overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                formatConfig.width
              } ${
                formatConfig.minH
              } ${
                selectedFormat === 'story'
                  ? 'aspect-[9/16] p-8 sm:p-10 rounded-[32px]'
                  : selectedFormat === 'square'
                  ? 'aspect-square p-8 sm:p-10 rounded-3xl'
                  : 'p-7 sm:p-8 rounded-2xl'
              } ${
                showBlurBackdrop
                  ? `bg-gradient-to-b ${themeConfig.gradient}`
                  : themeConfig.bg
              }`}
              style={{
                boxShadow: `0 25px 60px -15px rgba(0,0,0,0.8), 0 0 50px 0 ${themeConfig.accent}20`
              }}
            >
              
              {/* Custom Photo Background Layer */}
              {customBgImage && (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center pointer-events-none scale-105 transition-all duration-300"
                    style={{
                      backgroundImage: `url(${customBgImage})`,
                      filter: `blur(${bgBlur}px)`,
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                    style={{ backgroundColor: `rgba(0,0,0, ${bgDarkness / 100})` }}
                  />
                </>
              )}

              {/* Optional Background Glow Orb (Spotify Canvas style) */}
              {!customBgImage && showBlurBackdrop && (
                <div 
                  className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
                  style={{ backgroundColor: themeConfig.accent }}
                />
              )}

              {/* CARD HEADER */}
              <div className="relative z-10">
                {selectedStyle === 'spotify' ? (
                  /* Spotify Lyrics Header */
                  <div className="flex items-center gap-3 pb-5 border-b border-white/10">
                    {/* Vinyl/Cover Avatar */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden shrink-0 border border-white/15"
                      style={{ background: `linear-gradient(135deg, ${themeConfig.accent}40, #000000)` }}
                    >
                      <Disc className="w-6 h-6 text-white/90 animate-spin-slow" />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-base text-white truncate tracking-wide">
                        {title || 'Ghazal'}
                      </h4>
                      <p className="text-xs text-white/70 font-serif truncate">
                        ~ {author || 'Ijlaal'}
                      </p>
                    </div>

                    {/* Spotify Pill / Music Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-white/90 font-mono tracking-wider border border-white/10 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
                      <span>LYRICS</span>
                    </div>
                  </div>
                ) : selectedStyle === 'classic' ? (
                  /* Royal Calligraphy Header */
                  <div className="text-center pb-4 border-b border-white/10">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="h-[1px] w-8 bg-amber-500/50" />
                      <Feather className="w-4 h-4 text-amber-400" />
                      <span className="h-[1px] w-8 bg-amber-500/50" />
                    </div>
                    <h4 className="font-display font-bold text-base text-amber-200 tracking-wider">
                      {title || 'Diwan-e-Kalam'}
                    </h4>
                  </div>
                ) : (
                  /* Minimalist Header */
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/60 font-mono">
                    <span>{title || 'VERSES'}</span>
                    <span>~ {author || 'IJLAAL'}</span>
                  </div>
                )}
              </div>

              {/* MAIN LYRICS / COUPLETS BODY */}
              <div 
                className={`relative z-10 my-auto py-6 space-y-4 ${scriptConfig.fontClass} ${
                  isRtl ? 'text-right font-nastaliq' : textAlign === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {linesArray.map((line, idx) => {
                  const isHighlighted = idx === highlightLineIdx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setHighlightLineIdx(idx)}
                      className={`cursor-pointer transition-all duration-200 px-2 py-1 rounded-xl font-normal ${fontSizes[fontSize]} ${
                        selectedStyle === 'spotify'
                          ? isHighlighted
                            ? `${themeConfig.text} font-semibold scale-[1.02] drop-shadow-md`
                            : 'text-white/45 hover:text-white/80'
                          : themeConfig.text
                      }`}
                      style={{
                        textShadow: isHighlighted && selectedStyle === 'spotify' 
                          ? `0 0 20px ${themeConfig.accent}60` 
                          : 'none'
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>

              {/* CARD FOOTER */}
              <div className="relative z-10 pt-4 border-t border-white/10">
                {/* Spotify-style Audio Progress Bar */}
                {showPlayerBar && selectedStyle === 'spotify' && (
                  <div className="mb-4 space-y-1.5">
                    <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${themeConfig.barColor} rounded-full`}
                        style={{ width: '42%' }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
                      <span>1:14</span>
                      <span className="flex items-center gap-1 text-[9px] tracking-widest">
                        <span>●</span>
                        <span>QALAM & DIWAN</span>
                      </span>
                      <span>2:58</span>
                    </div>
                  </div>
                )}

                {/* Footer Brand & Author */}
                <div className="flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                    <span className="font-serif italic font-medium">
                      ~ {author || 'Ijlaal'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
                    <span className="tracking-widest">ılılıllı</span>
                    <span>QALAM</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-4 border-t border-[#241c15] bg-[#17110c] flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            {toast ? (
              <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" /> {toast}
              </span>
            ) : (
              <span className="text-[#8f7f6f] font-serif text-[11px]">
                Ready for Instagram Story, WhatsApp Status & Feed posts
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#221a13] hover:bg-[#2d2219] border border-[#382a1e] text-xs font-semibold text-[#f5ede0] transition-colors"
              title="Copy high-res image to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Copy Image</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering HD Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download for Insta Story ({selectedFormat === 'story' ? '9:16' : '1:1'})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
