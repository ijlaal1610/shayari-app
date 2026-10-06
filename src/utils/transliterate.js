// Transliteration utility for English to Urdu & Hindi

const clientCache = new Map();

// Offline fallback dictionary for poetry words
const OFFLINE_DICT = {
  ur: {
    dil: ['دل', 'ڈیل'],
    ishq: ['عشق'],
    mohabbat: ['محبت'],
    muhabat: ['محبت'],
    dard: ['درد'],
    gham: ['غم', 'گم'],
    zindagi: ['زندگی'],
    tanhai: ['تنہائی'],
    khamoshi: ['خاموشی'],
    kya: ['کیا'],
    hai: ['ہے'],
    hain: ['ہیں'],
    tha: ['تھا'],
    thi: ['تھی'],
    the: ['تھے'],
    mera: ['میرا'],
    meri: ['میری'],
    mere: ['میرے'],
    tera: ['تیرا'],
    teri: ['تیری'],
    tere: ['تیرے'],
    apna: ['اپنا'],
    apni: ['اپنی'],
    hum: ['ہم'],
    tum: ['تم'],
    aap: ['آپ'],
    woh: ['وہ'],
    wo: ['وہ'],
    yeh: ['یہ'],
    ye: ['یہ'],
    kaun: ['کون'],
    kahan: ['کہاں'],
    kyun: ['کیوں'],
    kaise: ['کیسے'],
    khwab: ['خواب'],
    aankhen: ['آنکھیں'],
    chehra: ['چہرہ'],
    zulfein: ['زلفیں'],
    sitam: ['ستم'],
    karam: ['کرم'],
    wafa: ['وفا'],
    jafa: ['جفا'],
    safar: ['سفر'],
    raasta: ['راستہ'],
    raat: ['رات'],
    shab: ['شب'],
    subah: ['صبح'],
    shaam: ['شام'],
    ghalib: ['غالب'],
    faiz: ['فیض'],
    mir: ['میر'],
    iqbal: ['اقبال'],
    jaun: ['جون'],
    eliya: ['ایلیا'],
    dawa: ['دوا'],
    dua: ['دعا'],
    sukoon: ['سکون'],
    khushi: ['خوشی'],
    aansu: ['آنسو'],
    deedar: ['دیدار'],
    baat: ['بات'],
    lafz: ['لفظ'],
    shayari: ['شاعری'],
    kalam: ['کلام'],
    sher: ['شعر'],
    ghazal: ['غزل'],
    nazm: ['نظم']
  },
  hi: {
    dil: ['दिल', 'डील'],
    ishq: ['इश्क़', 'इश्क'],
    mohabbat: ['मोहब्बत'],
    dard: ['दर्द'],
    gham: ['ग़म', 'गम'],
    zindagi: ['ज़िंदगी', 'जिंदगी'],
    tanhai: ['तन्हाई'],
    khamoshi: ['ख़ामोशी', 'खामोशी'],
    kya: ['क्या'],
    hai: ['है'],
    hain: ['हैं'],
    tha: ['था'],
    thi: ['थी'],
    the: ['थे'],
    mera: ['मेरा'],
    meri: ['मेरी'],
    mere: ['मेरे'],
    tera: ['तेरा'],
    teri: ['तेरी'],
    tere: ['तेरे'],
    apna: ['अपना'],
    apni: ['अपनी'],
    hum: ['हम'],
    tum: ['तुम'],
    aap: ['आप'],
    woh: ['वह', 'वो'],
    wo: ['वो', 'वह'],
    yeh: ['यह', 'ये'],
    ye: ['ये', 'यह'],
    khwab: ['ख़्वाब', 'ख्वाब'],
    aankhen: ['आँखें', 'आंखें'],
    raat: ['रात'],
    subah: ['सुबह'],
    shaam: ['शाम'],
    shayari: ['शायरी'],
    ghazal: ['ग़ज़ल', 'गजल'],
    sher: ['शेर']
  }
};

export async function fetchTransliterations(word, lang = 'ur') {
  if (!word || !word.trim()) return [];
  const clean = word.trim().toLowerCase();
  const cacheKey = `${lang}:${clean}`;

  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  // Check offline dictionary first for instant response
  const offlineMatch = OFFLINE_DICT[lang]?.[clean];

  try {
    // 1. Try local server endpoint
    const res = await fetch(`/api/transliterate?text=${encodeURIComponent(clean)}&lang=${lang}`, {
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.words && data.words.length > 0) {
        clientCache.set(cacheKey, data.words);
        return data.words;
      }
    }
  } catch (err) {
    // If server request fails, fallback
  }

  if (offlineMatch) {
    clientCache.set(cacheKey, offlineMatch);
    return offlineMatch;
  }

  return [word];
}

export const POETIC_SYMBOLS = {
  ur: [
    { char: '؎', label: 'She\'r (Couplet)', desc: 'Mark for She\'r' },
    { char: '؏', label: 'Misra', desc: 'Mark for single hemistich' },
    { char: 'ؔ', label: 'Takhallis', desc: 'Poet pen-name mark' },
    { char: 'ؐ', label: 'Sal-am', desc: 'Honorific' },
    { char: 'ؓ', label: 'Razi', desc: 'Honorific' },
    { char: 'ؒ', label: 'Rehma', desc: 'Honorific' },
    { char: '،', label: 'Comma', desc: 'Urdu Comma' },
    { char: '؛', label: 'Semicolon', desc: 'Urdu Semicolon' },
    { char: '؟', label: 'Question', desc: 'Urdu Question Mark' },
    { char: 'ۂ', label: 'Chhoti He Hamza', desc: 'Hamza mark' },
    { char: 'ۓ', label: 'Bari Ye Hamza', desc: 'Hamza mark' },
    { char: 'ّ', label: 'Tashdeed', desc: 'Gemination' },
    { char: 'ً', label: 'Tanween', desc: 'Tanween' },
    { char: 'ء', label: 'Hamza', desc: 'Hamza' }
  ],
  hi: [
    { char: '।', label: 'Purna Viram', desc: 'Full stop' },
    { char: '॥', label: 'Deergh Viram', desc: 'Stanza end' },
    { char: '़', label: 'Nukta', desc: 'Urdu sound dot (क़, ख़, ग़, ज़, फ़)' },
    { char: 'ँ', label: 'Chandrabindu', desc: 'Nasalization' },
    { char: 'ं', label: 'Anusvara', desc: 'Bindu' },
    { char: 'ः', label: 'Visarga', desc: 'Aspiration' },
    { char: '्', label: 'Halant', desc: 'Vowel suppressor' },
    { char: 'ऽ', label: 'Avagraha', desc: 'Elongation' }
  ]
};
