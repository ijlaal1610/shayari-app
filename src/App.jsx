import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Editor from './components/Editor';
import ShayariList from './components/ShayariList';
import CardExportModal from './components/CardExportModal';
import BackupModal from './components/BackupModal';
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
  const [penName, setPenName] = useState('Ijlaal');
  const [toastMessage, setToastMessage] = useState('');

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

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#ede2d0] flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-200">
      
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

      {/* Subtle Poetic Footer */}
      <footer className="border-t border-[#1c1712] py-6 px-4 text-center text-xs text-[#706050] font-serif">
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
