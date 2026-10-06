import React, { useState, useRef } from 'react';
import { 
  X, Database, Download, Upload, Copy, Check, 
  Server, GitBranch, RefreshCw, FileText 
} from 'lucide-react';

export default function BackupModal({ 
  shayaris, 
  onImportShayaris, 
  onClose, 
  onRefreshFromServer 
}) {
  const [copyMarkdownStatus, setCopyMarkdownStatus] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shayaris, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `diwan-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy as Markdown
  const handleCopyMarkdown = () => {
    const md = shayaris.map(s => {
      return `### ${s.title || 'Kalam'}\n*Mood: ${s.mood}* | *Poet: ${s.poet || 'Ijlaal'}*\n\n${s.lines}\n\n---\n`;
    }).join('\n');

    navigator.clipboard.writeText(md);
    setCopyMarkdownStatus(true);
    setTimeout(() => setCopyMarkdownStatus(false), 2000);
  };

  // File import
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          await onImportShayaris(parsed);
          setImportStatus(`Successfully imported ${parsed.length} verses!`);
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          alert('Invalid backup format. Expected an array of shayaris.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#140f0b] border border-[#2b2118] rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#241c15] mb-6">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-display text-lg font-bold text-[#f5ede0]">
                Diwan Storage & Backup
              </h3>
              <p className="text-xs text-[#8f7f6f] font-serif">
                Manage your poetry database, export, and sync
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

        {/* Server & Status Info */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-xl bg-[#1c1611] border border-[#2d241c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-[#f5ede0]">Oracle Cloud Server</p>
                <p className="text-[10px] text-[#8f7f6f] font-mono">92.4.75.121:9000 (Persistent JSON Storage)</p>
              </div>
            </div>
            <button
              onClick={onRefreshFromServer}
              className="p-2 rounded-lg bg-[#261e17] hover:bg-[#33281e] text-amber-300 text-xs transition-colors"
              title="Sync latest from server"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1c1611] border border-[#2d241c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs font-semibold text-[#f5ede0]">GitHub Repository</p>
                <p className="text-[10px] text-[#8f7f6f] font-mono">github.com/ijlaal1610/shayari-app</p>
              </div>
            </div>
            <a
              href="https://github.com/ijlaal1610/shayari-app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#261e17] hover:bg-[#33281e] text-purple-300 text-xs transition-colors"
            >
              View Repo
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-center">
          <div className="p-3 rounded-xl bg-[#0e0b08] border border-[#221a13]">
            <p className="text-xl font-bold font-mono text-amber-300">{shayaris.length}</p>
            <p className="text-[11px] text-[#8f7f6f] font-serif">Total Verses Saved</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0e0b08] border border-[#221a13]">
            <p className="text-xl font-bold font-mono text-rose-300">
              {shayaris.filter(s => s.favorite).length}
            </p>
            <p className="text-[11px] text-[#8f7f6f] font-serif">Favorited Verses</p>
          </div>
        </div>

        {/* Export & Import Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1a140f] hover:bg-[#241c15] border border-[#2d241c] text-xs font-medium text-[#e4d6c4] transition-all"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download JSON Backup</span>
            </span>
            <span className="text-[10px] text-[#7f6f5f] font-mono">.json</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1a140f] hover:bg-[#241c15] border border-[#2d241c] text-xs font-medium text-[#e4d6c4] transition-all"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Copy All Verses as Markdown</span>
            </span>
            {copyMarkdownStatus ? (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Copied!
              </span>
            ) : (
              <span className="text-[10px] text-[#7f6f5f] font-mono">.md</span>
            )}
          </button>

          <label className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1a140f] hover:bg-[#241c15] border border-[#2d241c] text-xs font-medium text-[#e4d6c4] transition-all cursor-pointer">
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Restore / Import JSON Backup</span>
            </span>
            <span className="text-[10px] text-[#7f6f5f]">Select file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {importStatus && (
            <p className="text-xs text-emerald-400 text-center font-medium py-1">
              {importStatus}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#241c15] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1c1611] hover:bg-[#261f18] text-xs text-[#9f8f7f] hover:text-[#ede2d0] transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
