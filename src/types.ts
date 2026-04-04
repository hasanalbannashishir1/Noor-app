export interface Surah {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface Ayah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface Recitation {
  id: number;
  chapter_id: number;
  audio_url: string;
}

export interface Tafsir {
  resource_id: number;
  text: string;
}

export interface SurahInfo {
  chapter_id: number;
  text: string;
  short_text: string;
  source: string;
}

export type SalahCategory = 'Fardh' | 'Wajib' | 'Sunnah Muakkadah' | 'Sunnah Ghair Muakkadah' | 'Nafl';

export interface RakatDetail {
  id: string;
  count: number;
  category: SalahCategory;
  label: string;
}

export interface PrayerRequirement {
  name: string;
  rakats: RakatDetail[];
}

export interface DailySalahProgress {
  date: string;
  completed: string[]; // Array of RakatDetail IDs
}

export interface Bookmark {
  id: number;
  name: string;
  type: 'surah' | 'dua';
}

export interface Hadith {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithArabic: string;
  hadithEnglish: string;
  bookSlug: string;
  status: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  category: string;
}

export interface DashboardStats {
  date: string;
  completedRakats: number;
  totalRakats: number;
  surahListens: number;
  missedPrayers: number;
}
