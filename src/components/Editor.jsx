import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Save, RotateCcw, Maximize2, Minimize2, 
  AlignRight, AlignLeft, Check, Tag, BookOpen, Quote, 
  HelpCircle, Eye
} from 'lucide-react';
import { MOODS, SCRIPTS } from '../data/sampleShayaris';

export default function Editor({ 
  onSave, 
  editingShayari, 
  onCancelEdit, 
  penName, 
  onViewDiwan 
}) {
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState('');
  const [mood, setMood] = useState('Ishq');
  const [script, setScript] = useState('roman');
  const [isZenMode, setIsZenMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved
  const textareaRef = useRef(null);

  // Initialize or populate if editing
  useEffect(() => {
    if (editingShayari) {
      setTitle(editingShayari.title || '');
      setLines(editingShayari.lines || '');
      setMood(editingShayari.mood || 'Ishq');
      setScript(editingShayari.script || 'roman');
    }
  }, [editingShayari]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(220, textareaRef.current.scrollHeight)}px`;
    }
  }, [lines]);

  // Current active script config
  const currentScriptConfig = SCRIPTS.find(s => s.id === script) || SCRIPTS[0];
  const isRtl = Boolean(currentScriptConfig.rtl);

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
      // Clear after new save
      setTitle('');
      setLines('');
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to save
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  // Compute verse statistics
  const lineArray = lines.split('\n').filter(l => l.trim().length > 0);
  const coupletCount = Math.ceil(lineArray.length / 2);

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
            {/* Zen Mode Button */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className="p-2 rounded-lg bg-[#221b14] hover:bg-[#2d241b] text-[#c9baa7] transition-all border border-[#33281d]"
              title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Focus Mode (Distraction-Free)'}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Quick helper button */}
            <button
              onClick={handleInsertCoupletBreak}
              className="px-3 py-1.5 rounded-lg bg-[#221b14] hover:bg-[#2d241b] text-xs font-serif text-amber-300/90 border border-[#382d21] transition-all"
              title="Add spacing between couplets / stanzas"
            >
              + Couplet Gap
            </button>
          </div>
        </div>

        {/* Script & Typography Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-[#140f0b] p-1 rounded-xl border border-[#261e16]">
            {SCRIPTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScript(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  script === s.id
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-[#8f806f] hover:text-[#e4d6c4] hover:bg-[#1f1812]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Quick Verse / Couplet Meter */}
          <div className="flex items-center gap-3 text-xs text-[#8f806f] font-mono">
            <span>{lineArray.length} {lineArray.length === 1 ? 'line' : 'lines'}</span>
            <span>•</span>
            <span>{coupletCount} {coupletCount === 1 ? 'couplet (she\'r)' : 'couplets'}</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-6 space-y-4">
          {/* Optional Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Unwan (Title / Subject) — optional..."
            className="w-full bg-transparent px-4 py-2.5 rounded-xl border border-[#2b2118] focus:border-amber-500/50 outline-none text-base font-display text-[#f5ede0] placeholder-[#6b5d4f] transition-all"
          />

          {/* Main Poetry Textarea */}
          <div className="relative rounded-2xl bg-[#0f0c09] border border-[#2e241b] focus-within:border-amber-600/60 p-5 sm:p-8 transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              value={lines}
              onChange={(e) => setLines(e.target.value)}
              onKeyDown={handleKeyDown}
              dir={isRtl ? 'rtl' : 'ltr'}
              placeholder={
                script === 'nastaliq' || script === 'urdu'
                  ? 'یہاں اپنا شعر یا غزل تحریر فرمائیں...\nمثال: دلِ ناداں تجھے ہوا کیا ہے\nآخر اس درد کی دوا کیا ہے'
                  : script === 'hindi'
                  ? 'यहाँ अपनी शायरी या पंक्तियाँ लिखें...\nउदाहरण:\nदिल-ए-नादाँ तुझे हुआ क्या है\nआख़िर इस दर्द की दवा क्या है'
                  : 'Write your couplets or ghazal here...\n\nLine 1: Misra-e-Ula\nLine 2: Misra-e-Sani\n\n(Press Ctrl+Enter to save to Diwan)'
              }
              className={`w-full bg-transparent text-[#f9f2e7] outline-none resize-none placeholder-[#584c3f] transition-all ${
                currentScriptConfig.fontClass
              } ${
                script === 'nastaliq'
                  ? 'text-2xl leading-[2.6]'
                  : script === 'urdu'
                  ? 'text-xl leading-[2.3]'
                  : script === 'hindi'
                  ? 'text-xl leading-[2.1]'
                  : 'text-xl sm:text-2xl leading-relaxed tracking-wide'
              }`}
            />

            {/* Pen Name Watermark / Signature */}
            <div className={`mt-4 pt-4 border-t border-[#1f1812] flex items-center justify-between text-xs text-[#7e6e5e] font-serif ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span>Takhallis: <strong className="text-amber-300 font-semibold">{penName || 'Ijlaal'}</strong></span>
              <span className="italic">Auto-formatted for poetry reading</span>
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
