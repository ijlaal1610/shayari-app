import { SAMPLE_SHAYARIS } from '../data/sampleShayaris';

const STORAGE_KEY = 'shayari_collection_v1';
const DRAFT_KEY = 'shayari_current_draft';
const PEN_NAME_KEY = 'shayari_author_pen_name';

export function getLocalShayaris() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SHAYARIS));
      return SAMPLE_SHAYARIS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      // Filter out any null/undefined entries
      const clean = parsed.filter(item => item && typeof item === 'object' && item.id);
      return clean.length > 0 ? clean : SAMPLE_SHAYARIS;
    }
    return SAMPLE_SHAYARIS;
  } catch (e) {
    console.error('Failed to load local shayaris', e);
    return SAMPLE_SHAYARIS;
  }
}

export function saveLocalShayaris(items) {
  try {
    if (Array.isArray(items)) {
      const clean = items.filter(item => item && typeof item === 'object' && item.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    }
  } catch (e) {
    console.error('Failed to save local shayaris', e);
  }
}

export function getDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {}
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {}
}

export function getSavedPenName() {
  try {
    return localStorage.getItem(PEN_NAME_KEY) || 'Ijlaal';
  } catch (e) {
    return 'Ijlaal';
  }
}

export function savePenName(name) {
  try {
    localStorage.setItem(PEN_NAME_KEY, name);
  } catch (e) {}
}

// Server API Sync with graceful offline fallback
export async function fetchServerShayaris() {
  try {
    const res = await fetch('/api/shayaris');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const clean = data.filter(item => item && typeof item === 'object' && item.id);
      saveLocalShayaris(clean);
      return clean;
    }
    return getLocalShayaris();
  } catch (err) {
    console.warn('Backend API unavailable, using local cache:', err);
    return getLocalShayaris();
  }
}

export async function createShayari(shayari) {
  const local = getLocalShayaris();
  const newEntry = {
    id: shayari.id || ('sh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
    title: shayari.title || (shayari.lines ? shayari.lines.split('\n')[0].substring(0, 35) + '...' : 'Kalam'),
    lines: shayari.lines || '',
    poet: shayari.poet || 'Ijlaal',
    takhallis: shayari.takhallis || '',
    mood: shayari.mood || 'Khamoshi',
    script: shayari.script || 'roman',
    favorite: Boolean(shayari.favorite),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newEntry, ...local.filter(s => s && s.id !== newEntry.id)];
  saveLocalShayaris(updated);

  try {
    const res = await fetch('/api/shayaris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });
    if (res.ok) {
      const serverResponse = await res.json();
      return serverResponse && serverResponse.id ? serverResponse : newEntry;
    }
  } catch (e) {
    console.warn('Saved offline to local storage');
  }

  return newEntry;
}

export async function updateShayari(id, updates) {
  const local = getLocalShayaris();
  const idx = local.findIndex(s => s && s.id === id);
  let updatedItem = null;

  if (idx !== -1) {
    updatedItem = { ...local[idx], ...updates, id, updatedAt: new Date().toISOString() };
    local[idx] = updatedItem;
    saveLocalShayaris(local);
  } else {
    // If not in local cache, create it
    updatedItem = { id, ...updates, updatedAt: new Date().toISOString() };
    saveLocalShayaris([updatedItem, ...local]);
  }

  try {
    const res = await fetch(`/api/shayaris/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const serverRes = await res.json();
      if (serverRes && serverRes.item && serverRes.item.id) {
        return serverRes.item;
      }
    }
  } catch (e) {
    console.warn('Update saved locally');
  }

  return updatedItem;
}

export async function deleteShayari(id) {
  const local = getLocalShayaris();
  const updated = local.filter(s => s && s.id !== id);
  saveLocalShayaris(updated);

  try {
    await fetch(`/api/shayaris/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Deleted locally');
  }
  return true;
}
