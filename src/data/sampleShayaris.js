export const SAMPLE_SHAYARIS = [
  {
    id: "sample-1",
    title: "दिल-ए-नादाँ तुझे हुआ क्या है",
    lines: "दिल-ए-नादाँ तुझे हुआ क्या है\nआख़िर इस दर्द की दवा क्या है\n\nहम हैं मुश्ताक़ और वो बे-ज़ार\nया इलाही ये माजरा क्या है",
    poet: "मिर्ज़ा ग़ालिब",
    takhallis: "ग़ालिब",
    mood: "Dard",
    script: "urdu",
    favorite: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "sample-2",
    title: "پتا پتا بوٹا بوٹا",
    lines: "پتا پتا بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے",
    poet: "میر تقی میر",
    takhallis: "میر",
    mood: "Ishq",
    script: "nastaliq",
    favorite: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "sample-3",
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

export const MOODS = [
  { id: "Ishq", label: "Ishq", urdu: "عشق", color: "from-rose-500/20 to-red-500/10 text-rose-300 border-rose-500/30" },
  { id: "Dard", label: "Dard", urdu: "درد", color: "from-amber-600/20 to-orange-500/10 text-amber-300 border-amber-600/30" },
  { id: "Tanhai", label: "Tanhai", urdu: "تنہائی", color: "from-indigo-500/20 to-blue-500/10 text-indigo-300 border-indigo-500/30" },
  { id: "Zindagi", label: "Zindagi", urdu: "زندگی", color: "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30" },
  { id: "Sufi", label: "Sufi", urdu: "صوفی", color: "from-purple-500/20 to-violet-500/10 text-purple-300 border-purple-500/30" },
  { id: "Yaadein", label: "Yaadein", urdu: "یادیں", color: "from-pink-500/20 to-rose-400/10 text-pink-300 border-pink-500/30" },
  { id: "Khamoshi", label: "Khamoshi", urdu: "خاموشی", color: "from-slate-500/20 to-zinc-500/10 text-slate-300 border-slate-500/30" },
  { id: "Falsafa", label: "Falsafa", urdu: "فلسفہ", color: "from-yellow-500/20 to-amber-500/10 text-yellow-300 border-yellow-500/30" }
];

export const SCRIPTS = [
  { id: "roman", name: "Roman / English", fontClass: "font-roman", desc: "Serif Poetry Font" },
  { id: "urdu", name: "اردو (Amiri)", fontClass: "font-urdu", desc: "Naskh Calligraphy", rtl: true },
  { id: "nastaliq", name: "نستعلیق (Nastaliq)", fontClass: "font-nastaliq", desc: "Classic Urdu Script", rtl: true },
  { id: "hindi", name: "हिंदी (Devanagari)", fontClass: "font-hindi", desc: "Classic Hindi Script" }
];
