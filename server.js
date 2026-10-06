import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'shayaris.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default shayaris if store is empty
const INITIAL_SHAYARIS = [
  {
    id: "ghalib-1",
    title: "दिल-ए-नादाँ तुझे हुआ क्या है",
    lines: "दिल-ए-नादाँ तुझे हुआ क्या है\nआख़िर इस दर्द की दवा क्या है\n\nहम हैं मुश्ताक़ और वो बे-ज़ार\nया इलाही ये माजरा क्या है",
    poet: "मिर्ज़ा ग़ालिब",
    takhallis: "ग़ालिब",
    mood: "Dard",
    script: "urdu",
    favorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mir-1",
    title: "پتا پتا بوٹا بوٹا",
    lines: "پتا پتا بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے",
    poet: "میر تقی میر",
    takhallis: "میر",
    mood: "Ishq",
    script: "nastaliq",
    favorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "faiz-1",
    title: "Mujhse Pehli Si Mohabbat",
    lines: "Mujhse pehli si mohabbat mere mehboob na maang\nMaine samjha tha ke tu hai to darakhshaan hai hayaat\n\nAur bhi dukh hain zamaane mein mohabbat ke siwa\nRaahatein aur bhi hain vasl ki raahat ke siwa",
    poet: "Faiz Ahmad Faiz",
    takhallis: "Faiz",
    mood: "Zindagi",
    script: "roman",
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeData(INITIAL_SHAYARIS);
      return INITIAL_SHAYARIS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading shayaris.json:', err);
    return [];
  }
}

function writeData(data) {
  try {
    const tmpFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error('Error writing shayaris.json:', err);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), port: PORT });
});

// GET all shayaris
app.get('/api/shayaris', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST new shayari
app.post('/api/shayaris', (req, res) => {
  const { title, lines, poet, takhallis, mood, script, favorite } = req.body;
  if (!lines || !lines.trim()) {
    return res.status(400).json({ error: 'Lines/couplets are required' });
  }

  const data = readData();
  const newShayari = {
    id: 'sh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: (title || '').trim() || (lines.trim().split('\n')[0].substring(0, 40) + '...'),
    lines: lines.trim(),
    poet: (poet || '').trim() || 'Anonymous',
    takhallis: (takhallis || '').trim(),
    mood: mood || 'Khamoshi',
    script: script || 'roman',
    favorite: Boolean(favorite),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.unshift(newShayari);
  writeData(data);
  res.status(201).json(newShayari);
});

// PUT update shayari
app.put('/api/shayaris/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const data = readData();
  const index = data.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Shayari not found' });
  }

  data[index] = {
    ...data[index],
    ...updates,
    id: data[index].id, // protect id
    createdAt: data[index].createdAt, // protect original creation time
    updatedAt: new Date().toISOString()
  };

  writeData(data);
  res.json(data[index]);
});

// DELETE shayari
app.delete('/api/shayaris/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const filtered = data.filter(item => item.id !== id);

  if (filtered.length === data.length) {
    return res.status(404).json({ error: 'Shayari not found' });
  }

  writeData(filtered);
  res.json({ success: true, message: 'Deleted successfully', id });
});

// POST bulk import/sync
app.post('/api/shayaris/bulk-sync', (req, res) => {
  const { shayaris } = req.body;
  if (!Array.isArray(shayaris)) {
    return res.status(400).json({ error: 'Expected an array of shayaris' });
  }

  const existing = readData();
  const map = new Map(existing.map(s => [s.id, s]));

  // Merge or add incoming
  for (const s of shayaris) {
    if (s.id && map.has(s.id)) {
      map.set(s.id, { ...map.get(s.id), ...s, updatedAt: new Date().toISOString() });
    } else {
      const id = s.id || ('sh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
      map.set(id, { ...s, id, createdAt: s.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
  }

  const merged = Array.from(map.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  writeData(merged);
  res.json({ success: true, total: merged.length, shayaris: merged });
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Shayari App server running on port ${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
});
