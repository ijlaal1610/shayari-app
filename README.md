# Qalam & Diwan (قلم و دیوان) ✒️
### A Distraction-Free Shayari Writing, Reading & Preserving App

*Qalam & Diwan* is a minimalist and elegant web sanctuary tailored specifically for writing, reading, organizing, and sharing Urdu, Hindi, and Roman poetry (*Shayari*, *Ghazals*, *Nazms*, *Rubais*).

---

## ✨ Features

- **✒️ Distraction-Free Editor (Qalam)**:
  - Focused writing environment with auto-expanding canvas.
  - Couplet / Stanza formatting (Misra-e-Ula, Misra-e-Sani).
  - Multi-script typography switcher:
    - **نستعلیق (Nastaliq)** — *Noto Nastaliq Urdu*
    - **اردو (Urdu Calligraphy)** — *Amiri*
    - **हिंदी (Devanagari)** — *Rozha One*
    - **Roman / English** — *Cormorant Garamond* & *Playfair Display*
  - Poet pen name (*Takhallis*) signature.
  - Quick Mood categorization: *Ishq, Dard, Tanhai, Zindagi, Sufi, Yaadein, Khamoshi, Falsafa*.

- **📖 The Diwan (Library & Search)**:
  - Instant real-time keyword search across verses, titles, and poets.
  - Filter by mood categories or favorites.
  - Switch between Card Grid and Elegant List views.
  - One-click copy formatted verses to clipboard with author byline.

- **🎨 Aesthetic Card Exporter**:
  - Export any shayari into high-resolution social media cards (Instagram / WhatsApp status ready).
  - 4 tailored themes: *Shab-e-Gham* (Midnight Velvet), *Qalam & Parchment* (Warm Sepia), *Gulabi Shaam* (Rosewood Sunset), *Koyla* (Matte Obsidian).

- **💾 Dual-Layer Storage & Sync**:
  - Offline-first local storage for zero-latency writing.
  - Server-side persistence with REST API on Oracle Cloud server (`Port 9000`).
  - Full backup and restore capabilities (JSON export/import & Markdown copy).

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development mode
npm run dev

# 3. Build for production
npm run build

# 4. Run production server (Port 9000)
npm start
```

---

## 🏛️ Deployment & Hosting

Hosted 24/7 on Oracle Cloud Server on **Port 9000** (`http://92.4.75.121:9000`) with systemd supervision.
