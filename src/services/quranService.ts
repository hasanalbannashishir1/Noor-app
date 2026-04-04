import { Surah, Recitation, Tafsir, SurahInfo } from '../types';

const QURAN_COM_API = 'https://api.quran.com/api/v4';
const ALQURAN_CLOUD_API = 'https://api.alquran.cloud/v1';

export const quranService = {
  async getSurahs(): Promise<Surah[]> {
    const response = await fetch(`${QURAN_COM_API}/chapters?language=en`);
    const data = await response.json();
    return data.chapters;
  },

  async getSurahTranslation(number: number): Promise<any> {
    const response = await fetch(`${ALQURAN_CLOUD_API}/surah/${number}/en.sahih`);
    const data = await response.json();
    return data.data;
  },

  async getSurahAudio(number: number): Promise<Recitation> {
    // Using Mishary Rashid Alafasy (ID 7)
    const response = await fetch(`${QURAN_COM_API}/chapter_recitations/7/${number}`);
    const data = await response.json();
    return data.audio_file;
  },

  async getSurahTafsir(number: number): Promise<Tafsir[]> {
    // Using Tafsir Ibn Kathir (ID 169)
    // Correct endpoint for chapter-level tafsir: /tafsirs/{id}/by_chapter/{number}
    const response = await fetch(`${QURAN_COM_API}/tafsirs/169/by_chapter/${number}`);
    const data = await response.json();
    return data.tafsirs;
  },

  async getArabicText(number: number): Promise<any> {
    const response = await fetch(`${ALQURAN_CLOUD_API}/surah/${number}`);
    const data = await response.json();
    return data.data;
  },

  async getSurahInfo(number: number): Promise<SurahInfo> {
    const response = await fetch(`${QURAN_COM_API}/chapters/${number}/info?language=en`);
    const data = await response.json();
    return data.chapter_info;
  }
};
