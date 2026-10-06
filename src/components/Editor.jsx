import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Save, RotateCcw, Maximize2, Minimize2, 
  Check, Tag, BookOpen, Quote, Keyboard, Globe,
  ArrowRight, X, Languages, Smartphone
} from 'lucide-react';
import { MOODS, SCRIPTS } from '../data/sampleShayaris';
import { fetchTransliterations, POETIC_SYMBOLS } from '../utils/transliterate';

export default function Editor({ 
  onSave, 
  editingShayari, 
  onCancelEdit, 
  penName, 
  onViewDiwan,
  onExportCurrent 
}) {
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState('');
  const [mood, setMood] = useState('Ishq');
  const [script, setScript] = useState('roman');
  const [isZenMode, setIsZenMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved
  
  // Auto Keyboard (Transliteration) States: 'off' | 'ur' | 'hi'
  const [autoKeyboard, setAutoKeyboard] = useState('off');
  const [candidates, setCandidates] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeWordInfo, setActiveWordInfo] = useState(null); // { word, start, end }
  
  const textareaRef = useRef(null);

  // Initialize or populate if editing
  useEffect(() => {
    if (editingShayari) {
      setTitle(editingShayari.title || '');
      setLines(editingShayari.lines || '');
      setMood(editingShayari.mood || 'Ishq');
      setScript(editingShayari.script || 'roman');
      if (editingShayari.script === 'nastaliq' || editingShayari.script === 'urdu') {
        setAutoKeyboard('ur');
      } else if (editingShayari.script === 'hindi') {
        setAutoKeyboard('hi');
      }
    }
  }, [editingShayari]);

  // Sync script change with auto-keyboard suggestion
  const handleScriptChange = (newScript) => {
    setScript(newScript);
    if (newScript === 'nastaliq' || newScript === 'urdu') {
      if (autoKeyboard === 'off') setAutoKeyboard('ur');
    } else if (newScript === 'hindi') {
      if (autoKeyboard === 'off') setAutoKeyboard('hi');
    }
  };

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(220, textareaRef.current.scrollHeight)}px`;
    }
  }, [lines]);

  // Current active script config
  const currentScriptConfig = SCRIPTS.find(s => s.id === script) || SCRIPTS[0];
  const isRtl = Boolean(currentScriptConfig.rtl) || autoKeyboard === 'ur';

  // Check word under cursor for transliteration
  const checkTransliteration = async (text, cursorPos) => {
    if (autoKeyboard === 'off') {
      setCandidates([]);
      setActiveWordInfo(null);
      return;
    }

    const beforeCursor = text.substring(0, cursorPos);
    const match = beforeCursor.match(/([a-zA-Z]+)$/);

    if (match) {
      const word = match[1];
      const start = cursorPos - word.length;
      const end = cursorPos;
      setActiveWordInfo({ word, start, end });

      const results = await fetchTransliterations(word, autoKeyboard);
      if (results && results.length > 0) {
        setCandidates(results);
        setSelectedIndex(0);
      } else {
        setCandidates([]);
      }
    } else {
      setCandidates([]);
      setActiveWordInfo(null);
    }
  };

  const applyCandidate = (replacement, appendChar = '') => {
    if (!activeWordInfo || !textareaRef.current) return;
    const { start, end } = activeWordInfo;

    const newLines = lines.substring(0, start) + replacement + appendChar + lines.substring(end);
    setLines(newLines);

    const newCursorPos = start + replacement.length + appendChar.length;
    setCandidates([]);
    setActiveWordInfo(null);

    // Reposition cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  const handleKeyDown = (e) => {
    // Keyboard shortcut Ctrl+Enter / Cmd+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
      return;
    }

    // Auto Keyboard interception
    if (autoKeyboard !== 'off' && candidates.length > 0) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        applyCandidate(candidates[selectedIndex] || candidates[0], e.key === ' ' ? ' ' : '\n');
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % candidates.length);
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setCandidates([]);
        setActiveWordInfo(null);
        return;
      }

      // Check numbers 1-5 to pick specific candidate
      if (['1', '2', '3', '4', '5'].includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const idx = parseInt(e.key, 10) - 1;
        if (candidates[idx]) {
          e.preventDefault();
          applyCandidate(candidates[idx], ' ');
          return;
        }
      }
    }
  };

  const handleKeyUp = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      if (textareaRef.current) {
        checkTransliteration(lines, textareaRef.current.selectionStart);
      }
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    setLines(val);
    checkTransliteration(val, pos);
  };

  // Insert Poetic Symbol at cursor
  const insertSymbol = (char) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const updated = lines.substring(0, start) + char + lines.substring(end);
    setLines(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + char.length, start + char.length);
      }
    }, 10);
  };

  const handleQuickInstaStory = () => {
    if (!lines.trim()) {
      alert('Please write at least one line or couplet first.');
      return;
    }
    if (onExportCurrent) {
      onExportCurrent({
        title: title.trim() || 'Kalam',
        lines: lines.trim(),
        poet: penName || 'Ijlaal',
        takhallis: penName || 'Ijlaal',
        mood,
        script,
        favorite: editingShayari ? editingShayari.favorite : false
      });
    }
  };

  const handleInsertCoupletBreak = () => {
    setLines(prev => prev + '\n\n');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClear = () => {
    if (lines.trim() && !window.confirm('Clear current draft?')) {
      return;
    }
    setTitle('');
    setLines('');
    setCandidates([]);
    setActiveWordInfo(null);
    if (editingShayari && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSave = async () => {
    if (!lines.trim()) {
      alert('Please write at least one line or couplet first.');
      return;
    }

    setSaveStatus('saving');
    const payload = {
      id: editingShayari ? editingShayari.id : undefined,
      title: title.trim() || lines.trim().split('\n')[0].substring(0, 35) + '...',
      lines: lines.trim(),
      poet: penName || 'Ijlaal',
      takhallis: penName || 'Ijlaal',
      mood,
      script,
      favorite: editingShayari ? editingShayari.favorite : false
    };

    await onSave(payload);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);

    if (!editingShayari) {
      setTitle('');
      setLines('');
    }
  };

  const lineArray = lines.split('\n').filter(l => l.trim().length > 0);
  const coupletCount = Math.ceil(lineArray.length / 2);

  // Active symbols list based on autoKeyboard or script
  const activeSymbols = autoKeyboard === 'ur' || script === 'urdu' || script === 'nastaliq'
    ? POETIC_SYMBOLS.ur
    : autoKeyboard === 'hi' || script === 'hindi'
    ? POETIC_SYMBOLS.hi
    : [];

  return (
    <div className={`transition-all duration-300 ${isZenMode ? 'fixed inset-0 z-50 bg-[#0a0806] p-6 sm:p-12 overflow-y-auto' : 'max-w-4xl mx-auto py-8 px-4 sm:px-6'}`}>
      
      {/* Editor Container Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#18130e] to-[#120e0a] border border-[#2b2219] shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
        
        {/* Top Header / Mode Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#261f18]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#f2e8dc] flex items-center gap-2">
                {editingShayari ? 'Edit Kalam' : 'Naya Kalam (Compose)'}
                {editingShayari && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Editing Mode
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#9d8b77] font-serif">
                Pour your thoughts into couplets and verses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickInstaStory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600/25 via-rose-600/25 to-amber-600/20 hover:from-pink-600/40 hover:to-rose-600/40 text-pink-200 border border-pink-500/35 text-xs font-semibold shadow-sm transition-all"
              title="Instantly generate an Instagram Story or Spotify-style Lyric picture"
            >
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span>Insta Story / Picture</span>
            </button>

            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className="p-2 rounded-lg bg-[#221b14] hover:bg-[#2d241b] text-[#c9baa7] transition-all border border-[#33281d]"
              title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Focus Mode (Distraction-Free)'}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleInsertCoupletBreak}
              className="px-3 py-1.5 rounded-lg bg-[#221b14] hover:bg-[#2d241b] text-xs font-serif text-amber-300/90 border border-[#382d21] transition-all"
              title="Add spacing between couplets / stanzas"
            >
              + Couplet Gap
            </button>
          </div>
        </div>

        {/* Toolbar: Script & Auto Keyboard Controls */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Script / Font Selector */}
          <div className="flex items-center gap-1.5 bg-[#140f0b] p-1 rounded-xl border border-[#261e16] overflow-x-auto">
            {SCRIPTS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleScriptChange(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  script === s.id
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-[#8f806f] hover:text-[#e4d6c4] hover:bg-[#1f1812]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Auto Keyboard (Phonetic Transliteration) Switch */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#16110c] px-2.5 py-1.5 rounded-xl border border-[#2e241b]">
            <Keyboard className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-[#9d8d7b] font-serif hidden md:inline">Auto Keyboard:</span>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAutoKeyboard('off')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  autoKeyboard === 'off'
                    ? 'bg-[#292017] text-[#e4d6c4] font-semibold'
                    : 'text-[#7d6e5d] hover:text-[#c4b5a2]'
                }`}
                title="Standard keyboard without transliteration"
              >
                Off
              </button>

              <button
                onClick={() => {
                  setAutoKeyboard('ur');
                  if (script === 'roman') setScript('nastaliq');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  autoKeyboard === 'ur'
                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                    : 'text-[#7d6e5d] hover:text-[#c4b5a2]'
                }`}
                title="Type in English letters (e.g. 'dil') and press space to convert to Urdu (دل)"
              >
                <span>Eng ➔ اردو</span>
              </button>

              <button
                onClick={() => {
                  setAutoKeyboard('hi');
                  if (script === 'roman') setScript('hindi');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  autoKeyboard === 'hi'
                    ? 'bg-amber-900/40 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                    : 'text-[#7d6e5d] hover:text-[#c4b5a2]'
                }`}
                title="Type in English letters (e.g. 'dil') and press space to convert to Hindi (दिल)"
              >
                <span>Eng ➔ हिंदी</span>
              </button>
            </div>
          </div>

        </div>

        {/* Poetic Symbols Bar */}
        {activeSymbols.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-[#7d6d5d] font-serif shrink-0 flex items-center gap-1 pr-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Poetic Marks:
            </span>
            {activeSymbols.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertSymbol(sym.char)}
                title={sym.desc}
                className="px-2 py-0.5 rounded-lg bg-[#18130e] hover:bg-[#292017] border border-[#2d241c] text-[#dfcdb1] hover:text-amber-200 text-xs font-medium font-nastaliq shrink-0 transition-colors"
              >
                <span className="text-sm">{sym.char}</span>
                <span className="text-[10px] ml-1 text-[#8c7b6a] opacity-75">{sym.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Inputs */}
        <div className="mt-5 space-y-4">
          {/* Optional Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Unwan (Title / Subject) — optional..."
            className="w-full bg-transparent px-4 py-2.5 rounded-xl border border-[#2b2118] focus:border-amber-500/50 outline-none text-base font-display text-[#f5ede0] placeholder-[#6b5d4f] transition-all"
          />

          {/* Main Poetry Textarea with Transliteration Strip */}
          <div className="relative rounded-2xl bg-[#0f0c09] border border-[#2e241b] focus-within:border-amber-600/60 p-5 sm:p-8 transition-all shadow-inner">
            
            {/* Live Transliteration Candidates Bar */}
            {autoKeyboard !== 'off' && candidates.length > 0 && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#1e1711] border border-amber-500/40 shadow-xl flex flex-wrap items-center gap-2 animate-fade-in">
                <span className="text-xs text-[#a89582] font-serif flex items-center gap-1 pl-1">
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  Suggestions for <strong className="text-amber-300 font-mono">"{activeWordInfo?.word}"</strong>:
                </span>
                
                <div className="flex flex-wrap items-center gap-1.5">
                  {candidates.map((cand, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyCandidate(cand, ' ')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                        selectedIndex === i
                          ? 'bg-amber-600 text-white shadow-md font-semibold'
                          : 'bg-[#292017] text-[#e7dbce] hover:bg-[#382c20]'
                      }`}
                    >
                      <span className="text-xs opacity-60 font-mono">{i + 1}.</span>
                      <span className="font-nastaliq text-base">{cand}</span>
                    </button>
                  ))}
                </div>

                <div className="ml-auto text-[11px] text-[#8e7e6d] font-mono hidden sm:flex items-center gap-2">
                  <span>Press <kbd className="px-1 py-0.5 rounded bg-black/40 text-amber-200">Space</kbd> to select</span>
                  <span><kbd className="px-1 py-0.5 rounded bg-black/40 text-amber-200">Esc</kbd> to keep English</span>
                </div>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={lines}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              dir={isRtl ? 'rtl' : 'ltr'}
              placeholder={
                autoKeyboard === 'ur'
                  ? 'English mein likhein, Space dabate hi Urdu ban jayega...\n(Misal: "dil" likhein aur Space dabayein -> "دل")'
                  : autoKeyboard === 'hi'
                  ? 'English mein likhein, Space dabate hi Hindi ban jayega...\n(Misal: "dil" likhein aur Space dabayein -> "दिल")'
                  : script === 'nastaliq' || script === 'urdu'
                  ? 'یہاں اپنا شعر یا غزل تحریر فرمائیں...\nمثال: دلِ ناداں تجھے ہوا کیا ہے\nآخر اس درد کی دوا کیا ہے'
                  : script === 'hindi'
                  ? 'यहाँ अपनी शायरी या पंक्तियाँ लिखें...\nउदाहरण:\nदिल-ए-नादाँ तुझे हुआ क्या है\nआख़िर इस दर्द की दवा क्या है'
                  : 'Write your couplets or ghazal here...\n\nLine 1: Misra-e-Ula\nLine 2: Misra-e-Sani\n\n(Press Ctrl+Enter to save to Diwan)'
              }
              className={`w-full bg-transparent text-[#f9f2e7] outline-none resize-none placeholder-[#584c3f] transition-all ${
                currentScriptConfig.fontClass
              } ${
                script === 'nastaliq' || autoKeyboard === 'ur'
                  ? 'text-2xl leading-[2.6]'
                  : script === 'urdu'
                  ? 'text-xl leading-[2.3]'
                  : script === 'hindi' || autoKeyboard === 'hi'
                  ? 'text-xl leading-[2.1]'
                  : 'text-xl sm:text-2xl leading-relaxed tracking-wide'
              }`}
            />

            {/* Footer Watermark */}
            <div className={`mt-4 pt-4 border-t border-[#1f1812] flex items-center justify-between text-xs text-[#7e6e5e] font-serif ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span>Takhallis: <strong className="text-amber-300 font-semibold">{penName || 'Ijlaal'}</strong></span>
              <span className="italic">
                {autoKeyboard !== 'off' 
                  ? `Auto Keyboard Active (${autoKeyboard === 'ur' ? 'Urdu' : 'Hindi'})` 
                  : 'Auto-formatted for poetry reading'}
              </span>
            </div>
          </div>
        </div>

        {/* Mood / Category Selector */}
        <div className="mt-6">
          <label className="block text-xs font-serif uppercase tracking-wider text-[#9d8a76] mb-2.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Mood / Theme (Kafiyat)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const isSelected = mood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? `bg-gradient-to-r ${m.color} ring-1 ring-amber-400/50 font-semibold shadow-md`
                      : 'bg-[#18130e] border-[#292017] text-[#9b8b78] hover:border-[#423425] hover:text-[#e4d6c4]'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="text-[10px] font-nastaliq opacity-70">({m.urdu})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-[#261f18] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1c1611] hover:bg-[#281f18] border border-[#2e241c] text-xs font-medium text-[#ab9b88] hover:text-[#ede2d0] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{editingShayari ? 'Cancel Edit' : 'Clear Canvas'}</span>
            </button>

            <span className="text-[11px] text-[#6d5e4f] hidden sm:inline">
              Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-[#1f1913] border border-[#33281e] text-amber-200 font-mono">Ctrl + Enter</kbd>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onViewDiwan && (
              <button
                onClick={onViewDiwan}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#211a13] hover:bg-[#2e241a] border border-[#382d20] text-xs font-medium text-[#c9b9a6] transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Diwan</span>
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${
                saveStatus === 'saved'
                  ? 'bg-emerald-700 text-white shadow-emerald-900/30'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#140e08] font-bold shadow-amber-950/40 hover:shadow-amber-900/50'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Diwan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingShayari ? 'Update Verse' : 'Save to Diwan'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
