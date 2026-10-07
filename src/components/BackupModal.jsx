import React, { useState, useRef } from 'react';
import { 
  X, Database, Download, Upload, Copy, Check, 
  Server, GitBranch, RefreshCw, FileText, FileCode,
  AlertCircle, Sparkles, Clipboard, ArrowDownCircle
} from 'lucide-react';

export default function BackupModal({ 
  shayaris = [], 
  onImportShayaris, 
  onClose, 
  onRefreshFromServer,
  theme = 'dark'
}) {
  const [copyMarkdownStatus, setCopyMarkdownStatus] = useState(false);
  const [copyJsonStatus, setCopyJsonStatus] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [importError, setImportError] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const fileInputRef = useRef(null);

  const isDaylight = theme === 'daylight';

  // Helper to trigger browser file download via Blob
  const downloadFile = (content, filename, type) => {
    try {
      const blob = new Blob([content], { type: `${type};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      }, 150);
      return true;
    } catch (err) {
      console.error('Download error:', err);
      // Fallback
      window.open("data:" + type + ";charset=utf-8," + encodeURIComponent(content));
      return false;
    }
  };

  // Safe clipboard writer with robust fallback
  const safeCopyToClipboard = async (text) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn('navigator.clipboard failed, using fallback', err);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackErr) {
      console.error('Fallback clipboard error:', fallbackErr);
      return false;
    }
  };

  // Generate clean, formatted Markdown document of the Diwan
  const generateMarkdownDocument = () => {
    const today = new Date().toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    let doc = `# دیوانِ شعر — Diwan Poetry Collection\n`;
    doc += `> Exported on ${today} • Total Verses: ${shayaris.length}\n\n`;
    doc += `---\n\n`;

    shayaris.forEach((s, idx) => {
      const title = s.title ? `${idx + 1}. ${s.title}` : `Kalam #${idx + 1}`;
      const poet = s.takhallis || s.poet || 'Ijlaal';
      const mood = s.mood || 'Kalam';
      const fav = s.favorite ? ' ⭐' : '';
      
      doc += `### ${title}${fav}\n`;
      doc += `*کیفیت / Mood:* **${mood}** | *شاعر / Poet:* **${poet}**\n\n`;
      doc += `${s.lines}\n\n`;
      doc += `---\n\n`;
    });

    return doc;
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const jsonStr = JSON.stringify(shayaris, null, 2);
    downloadFile(jsonStr, `diwan-backup-${dateStr}.json`, 'application/json');
  };

  // Export Markdown (.md) file
  const handleExportMarkdownFile = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const md = generateMarkdownDocument();
    downloadFile(md, `diwan-poetry-${dateStr}.md`, 'text/markdown');
  };

  // Copy as Markdown
  const handleCopyMarkdown = async () => {
    const md = generateMarkdownDocument();
    const success = await safeCopyToClipboard(md);
    if (success) {
      setCopyMarkdownStatus(true);
      setTimeout(() => setCopyMarkdownStatus(false), 2200);
    } else {
      alert('Unable to access clipboard. Please use "Download Markdown File" instead.');
    }
  };

  // Copy raw JSON
  const handleCopyJSON = async () => {
    const jsonStr = JSON.stringify(shayaris, null, 2);
    const success = await safeCopyToClipboard(jsonStr);
    if (success) {
      setCopyJsonStatus(true);
      setTimeout(() => setCopyJsonStatus(false), 2200);
    }
  };

  // Robust parser for JSON and Markdown
  const parseContent = (content) => {
    if (!content || typeof content !== 'string') return [];
    const trimmed = content.trim();

    // 1. Try parsing JSON
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        let items = [];
        if (Array.isArray(parsed)) {
          items = parsed;
        } else if (parsed && Array.isArray(parsed.shayaris)) {
          items = parsed.shayaris;
        } else if (parsed && Array.isArray(parsed.data)) {
          items = parsed.data;
        } else if (parsed && Array.isArray(parsed.verses)) {
          items = parsed.verses;
        }

        if (items.length > 0) {
          return items.map((item, idx) => ({
            id: item.id || `sh_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`,
            title: item.title || '',
            lines: item.lines || item.text || item.body || item.couplet || '',
            poet: item.poet || item.takhallis || 'Ijlaal',
            takhallis: item.takhallis || item.poet || 'Ijlaal',
            mood: item.mood || 'Ishq',
            script: item.script || (item.lines && /[\u0600-\u06FF]/.test(item.lines) ? 'nastaliq' : 'urdu'),
            favorite: Boolean(item.favorite),
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })).filter(s => s.lines && s.lines.trim());
        }
      } catch (e) {
        // Fall through to markdown parser if JSON parse fails
      }
    }

    // 2. Parse Markdown or plain text sections
    const sections = trimmed.split(/\n\s*---\s*\n+/).filter(s => s.trim().length > 0);
    const result = [];

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i].trim();
      if (!sec || sec.startsWith('# دیوانِ')) continue;

      const lines = sec.split('\n');
      let title = '';
      let mood = 'Ishq';
      let poet = 'Ijlaal';
      let bodyLines = [];

      for (const line of lines) {
        const l = line.trim();
        if (l.startsWith('#')) {
          title = l.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '').replace(/⭐/g, '').trim();
        } else if (l.toLowerCase().includes('mood') || l.includes('کیفیت')) {
          const mMatch = l.match(/Mood[:\*]*\s*([A-Za-z]+)/i);
          if (mMatch) mood = mMatch[1];
          const pMatch = l.match(/Poet[:\*]*\s*([^\*\|]+)/i);
          if (pMatch) poet = pMatch[1].trim();
        } else {
          bodyLines.push(line);
        }
      }

      const bodyText = bodyLines.join('\n').trim();
      if (bodyText) {
        result.push({
          id: `md_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
          title: title || `Kalam #${i + 1}`,
          lines: bodyText,
          poet: poet || 'Ijlaal',
          takhallis: poet || 'Ijlaal',
          mood: mood || 'Ishq',
          script: /[\u0600-\u06FF]/.test(bodyText) ? 'nastaliq' : /[\u0900-\u097F]/.test(bodyText) ? 'hindi' : 'roman',
          favorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return result;
  };

  // File import handler
  const handleFileChange = (e) => {
    setImportError('');
    setImportStatus('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        const parsed = parseContent(content);
        if (parsed.length > 0) {
          await onImportShayaris(parsed);
          setImportStatus(`✨ Successfully restored ${parsed.length} verses into your Diwan!`);
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportError('No valid verses could be recognized in this file.');
        }
      } catch (err) {
        setImportError('Failed to read file. Please ensure it is valid JSON or Markdown.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so re-selecting same file works
  };

  // Direct paste import handler
  const handlePasteImport = async () => {
    setImportError('');
    setImportStatus('');
    if (!pastedContent.trim()) {
      setImportError('Please paste your JSON or Markdown text first.');
      return;
    }

    const parsed = parseContent(pastedContent);
    if (parsed.length > 0) {
      await onImportShayaris(parsed);
      setImportStatus(`✨ Successfully imported ${parsed.length} verses!`);
      setPastedContent('');
      setShowPasteBox(false);
      setTimeout(() => setImportStatus(''), 4000);
    } else {
      setImportError('Could not recognize any valid verses from pasted text. Please verify formatting.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-lg border rounded-2xl shadow-2xl p-5 sm:p-7 transition-colors my-auto max-h-[92vh] overflow-y-auto ${
        isDaylight
          ? 'bg-[#fbf7ee] border-[#ded4c3] text-[#2c2217]'
          : 'bg-[#140f0b] border-[#2b2118] text-[#ede2d0]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b mb-5 ${
          isDaylight ? 'border-[#e8dfcf]' : 'border-[#241c15]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDaylight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/10 text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-display text-base sm:text-lg font-bold ${
                isDaylight ? 'text-[#22170d]' : 'text-[#f5ede0]'
              }`}>
                Diwan Backup & Storage
              </h3>
              <p className={`text-xs font-serif ${isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'}`}>
                Export, backup, or restore your verses safely
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDaylight
                ? 'text-[#8c7965] hover:text-[#22170d] hover:bg-[#ede5d5]'
                : 'text-[#7f6f5f] hover:text-[#e4d6c4] hover:bg-[#201811]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud & Sync Status Card */}
        <div className="space-y-2.5 mb-5">
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isDaylight
              ? 'bg-[#ede5d5] border-[#d8ccb8]'
              : 'bg-[#1c1611] border-[#2d241c]'
          }`}>
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-emerald-500" />
              <div>
                <p className={`text-xs font-semibold ${isDaylight ? 'text-[#22170d]' : 'text-[#f5ede0]'}`}>
                  Cloud Server Persistent Storage
                </p>
                <p className={`text-[10px] font-mono ${isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'}`}>
                  92.4.75.121:9000 • data/shayaris.json
                </p>
              </div>
            </div>
            <button
              onClick={onRefreshFromServer}
              className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                isDaylight
                  ? 'bg-[#dfd3be] hover:bg-[#d0c1a8] text-[#3e2714]'
                  : 'bg-[#261e17] hover:bg-[#33281e] text-amber-300'
              }`}
              title="Sync latest from server"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isDaylight
              ? 'bg-[#ede5d5] border-[#d8ccb8]'
              : 'bg-[#1c1611] border-[#2d241c]'
          }`}>
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <div>
                <p className={`text-xs font-semibold ${isDaylight ? 'text-[#22170d]' : 'text-[#f5ede0]'}`}>
                  GitHub Repository
                </p>
                <p className={`text-[10px] font-mono ${isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'}`}>
                  github.com/ijlaal1610/shayari-app
                </p>
              </div>
            </div>
            <a
              href="https://github.com/ijlaal1610/shayari-app"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                isDaylight
                  ? 'bg-[#dfd3be] hover:bg-[#d0c1a8] text-purple-900'
                  : 'bg-[#261e17] hover:bg-[#33281e] text-purple-300'
              }`}
            >
              View Repo
            </a>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-center">
          <div className={`p-3 rounded-xl border ${
            isDaylight ? 'bg-[#ede5d5] border-[#d8ccb8]' : 'bg-[#0e0b08] border-[#221a13]'
          }`}>
            <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-300">{shayaris.length}</p>
            <p className={`text-[11px] font-serif ${isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'}`}>
              Total Verses Preserved
            </p>
          </div>
          <div className={`p-3 rounded-xl border ${
            isDaylight ? 'bg-[#ede5d5] border-[#d8ccb8]' : 'bg-[#0e0b08] border-[#221a13]'
          }`}>
            <p className="text-xl font-bold font-mono text-rose-500">
              {shayaris.filter(s => s.favorite).length}
            </p>
            <p className={`text-[11px] font-serif ${isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'}`}>
              Favorited Verses
            </p>
          </div>
        </div>

        {/* Download & Copy Actions */}
        <div className="space-y-2 mb-4">
          <p className={`text-[10px] font-mono uppercase tracking-wider ${
            isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'
          }`}>
            Export & Backup
          </p>

          {/* 1. Download JSON File */}
          <button
            onClick={handleExportJSON}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
              isDaylight
                ? 'bg-[#ede5d5] hover:bg-[#e2d7c4] border-[#d8ccb8] text-[#22170d]'
                : 'bg-[#1a140f] hover:bg-[#241c15] border-[#2d241c] text-[#e4d6c4]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-amber-500" />
              <span>Download JSON Backup</span>
            </span>
            <span className="text-[10px] font-mono opacity-60">.json file</span>
          </button>

          {/* 2. Download Markdown (.md) File */}
          <button
            onClick={handleExportMarkdownFile}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
              isDaylight
                ? 'bg-[#ede5d5] hover:bg-[#e2d7c4] border-[#d8ccb8] text-[#22170d]'
                : 'bg-[#1a140f] hover:bg-[#241c15] border-[#2d241c] text-[#e4d6c4]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-teal-500" />
              <span>Download Markdown File (.md)</span>
            </span>
            <span className="text-[10px] font-mono opacity-60">.md file</span>
          </button>

          {/* 3. Copy All Verses as Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
              isDaylight
                ? 'bg-[#ede5d5] hover:bg-[#e2d7c4] border-[#d8ccb8] text-[#22170d]'
                : 'bg-[#1a140f] hover:bg-[#241c15] border-[#2d241c] text-[#e4d6c4]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Copy All Verses as Markdown</span>
            </span>
            {copyMarkdownStatus ? (
              <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="text-[10px] font-mono opacity-60">Copy to Clipboard</span>
            )}
          </button>

          {/* 4. Copy raw JSON */}
          <button
            onClick={handleCopyJSON}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
              isDaylight
                ? 'bg-[#ede5d5] hover:bg-[#e2d7c4] border-[#d8ccb8] text-[#22170d]'
                : 'bg-[#1a140f] hover:bg-[#241c15] border-[#2d241c] text-[#e4d6c4]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Copy className="w-4 h-4 text-amber-500" />
              <span>Copy Raw JSON Data</span>
            </span>
            {copyJsonStatus ? (
              <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="text-[10px] font-mono opacity-60">JSON Text</span>
            )}
          </button>
        </div>

        {/* Restore & Import Section */}
        <div className="space-y-2 pt-2 border-t border-dashed border-neutral-700/40">
          <p className={`text-[10px] font-mono uppercase tracking-wider ${
            isDaylight ? 'text-[#705c48]' : 'text-[#8f7f6f]'
          }`}>
            Restore & Import
          </p>

          {/* Upload File Button */}
          <label className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isDaylight
              ? 'bg-[#ede5d5] hover:bg-[#e2d7c4] border-[#d8ccb8] text-[#22170d]'
              : 'bg-[#1a140f] hover:bg-[#241c15] border-[#2d241c] text-[#e4d6c4]'
          }`}>
            <span className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Restore from File (.json or .md)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">
              Browse File
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.md,.txt,text/plain,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Direct Paste Toggle */}
          <button
            onClick={() => setShowPasteBox(!showPasteBox)}
            className={`w-full text-left text-xs py-1.5 px-1 font-serif underline hover:opacity-80 transition-opacity ${
              isDaylight ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            {showPasteBox ? '▾ Hide direct paste box' : '▸ Or paste JSON/Markdown text directly (Phone friendly)'}
          </button>

          {/* Direct Paste Area */}
          {showPasteBox && (
            <div className="space-y-2 pt-1 animate-fade-in">
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your JSON or Markdown backup here..."
                rows={4}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none ${
                  isDaylight
                    ? 'bg-[#f4ebe0] border-[#d8ccb8] text-[#22170d]'
                    : 'bg-[#0f0c09] border-[#2e241c] text-[#ede2d0]'
                }`}
              />
              <button
                onClick={handlePasteImport}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Import Pasted Text</span>
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {importStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{importStatus}</span>
            </div>
          )}

          {importError && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{importError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-5 pt-3 border-t flex justify-end ${
          isDaylight ? 'border-[#e8dfcf]' : 'border-[#241c15]'
        }`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-medium transition-colors ${
              isDaylight
                ? 'bg-[#ede5d5] hover:bg-[#dfd3be] text-[#22170d]'
                : 'bg-[#1c1611] hover:bg-[#261f18] text-[#9f8f7f] hover:text-[#ede2d0]'
            }`}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
