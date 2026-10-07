import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Editor from './components/Editor';
import ShayariList from './components/ShayariList';
import CardExportModal from './components/CardExportModal';
import BackupModal from './components/BackupModal';
import MushairaModal from './components/MushairaModal';
import { 
  getLocalShayaris, 
  saveLocalShayaris, 
  fetchServerShayaris, 
  createShayari, 
  updateShayari, 
  deleteShayari,
  getSavedPenName,
  savePenName
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'diwan'
  const [shayaris, setShayaris] = useState([]);
  const [editingShayari, setEditingShayari] = useState(null);
  const [exportingShayari, setExportingShayari] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isMushairaOpen, setIsMushairaOpen] = useState(false);
  const [penName, setPenName] = useState('Ijlaal');
  const [toastMessage, setToastMessage] = useState('');
  
  // Theme: 'dark' (Shab-e-Gham) or 'daylight' (Vintage Parchment)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shayari_theme') || 'dark';
  });

  // PWA Install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
        showToast('App installed successfully!');
      }
    } else {
      alert('To install on your phone:\n• iPhone (Safari): Tap the Share icon ➔ "Add to Home Screen"\n• Android (Chrome): Tap the three dots ➔ "Install App" or "Add to Home Screen"');
    }
  };

  // Theme effect on body
  useEffect(() => {
    localStorage.setItem('shayari_theme', theme);
    if (theme === 'daylight') {
      document.body.className = 'bg-[#fcf9f2] text-[#241a12] antialiased selection:bg-amber-300 selection:text-amber-950 transition-colors duration-300';
    } else {
      document.body.className = 'bg-[#0c0a08] text-[#ede2d0] antialiased selection:bg-amber-600/30 selection:text-amber-200 transition-colors duration-300';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'daylight' : 'dark');
  };

  // Initial load
  useEffect(() => {
    const savedName = getSavedPenName();
    setPenName(savedName);

    // Initial load from local, then try server
    const local = getLocalShayaris();
    setShayaris(local);

    fetchServerShayaris().then((serverData) => {
      if (Array.isArray(serverData) && serverData.length > 0) {
        setShayaris(serverData);
      }
    }).catch(() => {});
  }, []);

  // Update pen name
  const handlePenNameChange = (name) => {
    setPenName(name);
    savePenName(name);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Save / Update Handler
  const handleSave = async (data) => {
    if (editingShayari) {
      const updated = await updateShayari(editingShayari.id, data);
      setShayaris(prev => prev.map(s => s.id === updated.id ? updated : s));
      setEditingShayari(null);
      showToast('Verse updated in Diwan');
      setActiveTab('diwan');
    } else {
      const created = await createShayari(data);
      setShayaris(prev => [created, ...prev.filter(s => s.id !== created.id)]);
      showToast('Verse preserved in Diwan');
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this verse from your Diwan?')) {
      await deleteShayari(id);
      setShayaris(prev => prev.filter(s => s.id !== id));
      showToast('Verse deleted');
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id) => {
    const item = shayaris.find(s => s.id === id);
    if (!item) return;
    const newFav = !item.favorite;
    await updateShayari(id, { favorite: newFav });
    setShayaris(prev => prev.map(s => s.id === id ? { ...s, favorite: newFav } : s));
  };

  // Edit action
  const handleEdit = (item) => {
    setEditingShayari(item);
    setActiveTab('write');
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingShayari(null);
  };

  // Import Shayaris
  const handleImportShayaris = async (importedList) => {
    const combined = [...importedList, ...shayaris];
    const uniqueMap = new Map();
    combined.forEach(s => {
      if (s.id) uniqueMap.set(s.id, s);
    });
    const result = Array.from(uniqueMap.values());
    setShayaris(result);
    saveLocalShayaris(result);

    try {
      await fetch('/api/shayaris/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shayaris: result })
      });
    } catch (e) {}

    showToast(`Imported ${importedList.length} verses successfully`);
  };

  const handleRefreshFromServer = async () => {
    const fresh = await fetchServerShayaris();
    setShayaris(fresh);
    showToast('Synced latest verses from server');
  };

  const favoritesCount = shayaris.filter(s => s.favorite).length;
  const isDaylight = theme === 'daylight';
  const [mushairaTarget, setMushairaTarget] = useState({ index: 0, theme: 'all' });

  // Recite a specific shayari in Mushaira mode
  const handleReciteShayari = (item) => {
    const idx = shayaris.findIndex(s => s.id === item.id);
    setMushairaTarget({
      index: idx >= 0 ? idx : 0,
      theme: item.mood ? item.mood.toLowerCase() : 'all'
    });
    setIsMushairaOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDaylight ? 'bg-[#fcf9f2] text-[#241a12]' : 'bg-[#0c0a08] text-[#ede2d0]'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-amber-600/90 text-white font-medium text-xs shadow-2xl backdrop-blur-md animate-fade-in border border-amber-400/30 flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        count={shayaris.length}
        favoritesCount={favoritesCount}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        penName={penName}
        setPenName={handlePenNameChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMushaira={() => {
          setMushairaTarget({ index: 0, theme: 'all' });
          setIsMushairaOpen(true);
        }}
        showInstallBtn={true}
        onInstallApp={handleInstallApp}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'write' ? (
          <Editor
            onSave={handleSave}
            editingShayari={editingShayari}
            onCancelEdit={handleCancelEdit}
            penName={penName}
            onViewDiwan={() => setActiveTab('diwan')}
            onExportCurrent={(draft) => setExportingShayari(draft)}
          />
        ) : (
          <ShayariList
            shayaris={shayaris}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            onExportCard={(item) => setExportingShayari(item)}
            onGoToWrite={() => {
              setEditingShayari(null);
              setActiveTab('write');
            }}
            onRecite={handleReciteShayari}
            theme={theme}
          />
        )}
      </main>

      {/* Aesthetic Card Export Modal */}
      {exportingShayari && (
        <CardExportModal
          shayari={exportingShayari}
          onClose={() => setExportingShayari(null)}
        />
      )}

      {/* Backup & Storage Modal */}
      {isBackupModalOpen && (
        <BackupModal
          shayaris={shayaris}
          onImportShayaris={handleImportShayaris}
          onClose={() => setIsBackupModalOpen(false)}
          onRefreshFromServer={handleRefreshFromServer}
        />
      )}

      {/* Mushaira Stage Recital Modal */}
      {isMushairaOpen && (
        <MushairaModal
          shayaris={shayaris}
          initialIndex={mushairaTarget.index}
          initialTheme={mushairaTarget.theme}
          onClose={() => setIsMushairaOpen(false)}
        />
      )}

      {/* Subtle Poetic Footer */}
      <footer className={`border-t py-6 px-4 text-center text-xs font-serif transition-colors ${
        isDaylight ? 'border-[#ded4c3] text-[#786450] bg-[#f7f2e7]' : 'border-[#1c1712] text-[#706050] bg-[#0c0a08]'
      }`}>
        <p className="flex items-center justify-center gap-2">
          <span>سخن شناسی و سخن سنجی</span>
          <span>•</span>
          <span>Dedicated to the timeless beauty of poetry</span>
          <span>•</span>
          <span>~ {penName}</span>
        </p>
      </footer>

    </div>
  );
}
