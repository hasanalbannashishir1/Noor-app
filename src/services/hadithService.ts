
import { Hadith } from '../types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const SUNNAH_API_URL = 'https://api.sunnah.com/v1';

// Fallback API key if not provided in environment
// NOTE: Sunnah.com requires an API key. Users should get their own from sunnah.com
const DEFAULT_API_KEY = ''; 

const getApiKey = () => {
  // Use VITE_ prefix for client-side environment variables in Vite
  const key = import.meta.env.VITE_SUNNAH_API_KEY || DEFAULT_API_KEY;
  return key.trim();
};

export interface HadithBook {
  id: string;
  name: string;
  totalHadiths: number;
}

// Simple in-memory cache
const cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3, backoff = 1000): Promise<Response> => {
  try {
    console.log(`[HadithService] Fetching: ${url}`);
    const response = await fetch(url, options);
    
    if (response.status === 403) {
      console.error(`[HadithService] 403 Forbidden error. This usually means the API key is invalid or missing.`);
      throw new Error("Access Forbidden (403). Please check your Sunnah.com API Key in Vercel environment variables (VITE_SUNNAH_API_KEY).");
    }

    if (!response.ok && retries > 0 && (response.status === 429 || response.status >= 500)) {
      console.warn(`[HadithService] Retrying fetch for ${url}. Status: ${response.status}. Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) throw error;
    
    if (retries > 0) {
      console.warn(`[HadithService] Retrying fetch for ${url} due to error:`, error);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const hadithService = {
  async fetchBooks(): Promise<HadithBook[]> {
    const cacheKey = 'sunnah_books_list';
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }

    try {
      const apiKey = getApiKey();
      const targetUrl = `${SUNNAH_API_URL}/collections?limit=50`;
      const url = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
      
      const response = await fetchWithRetry(url, {
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Failed to fetch books: ${response.status}`);
      const data = await response.json();
      
      if (data?.data) {
        const books = data.data.map((b: any) => ({
          id: b.name, // e.g., 'bukhari'
          name: b.collection.find((c: any) => c.lang === 'en')?.title || b.name,
          totalHadiths: b.totalHadiths || 0
        }));
        
        cache[cacheKey] = { data: books, timestamp: Date.now() };
        return books;
      }
      return this.getBooks(); // Fallback to static list
    } catch (error) {
      console.error('[HadithService] Error in fetchBooks:', error);
      return this.getBooks();
    }
  },

  getBooks(): HadithBook[] {
    return [
      { id: 'bukhari', name: 'Sahih al-Bukhari', totalHadiths: 7563 },
      { id: 'muslim', name: 'Sahih Muslim', totalHadiths: 3033 },
      { id: 'nasai', name: 'Sunan an-Nasa\'i', totalHadiths: 5758 },
      { id: 'abudawud', name: 'Sunan Abi Dawud', totalHadiths: 5274 },
      { id: 'tirmidhi', name: 'Jami` at-Tirmidhi', totalHadiths: 3956 },
      { id: 'ibnmajah', name: 'Sunan Ibn Majah', totalHadiths: 4341 },
      { id: 'malik', name: 'Muwatta Malik', totalHadiths: 1851 },
      { id: 'riyadussalihin', name: 'Riyad us-Salihin', totalHadiths: 1896 },
      { id: 'adab', name: 'Al-Adab al-Mufrad', totalHadiths: 1322 },
      { id: 'bulugh', name: 'Bulugh al-Maram', totalHadiths: 1358 },
      { id: 'forty', name: '40 Hadith Nawawi', totalHadiths: 42 },
    ];
  },

  normalizeHadiths(data: any, collection: string): Hadith[] {
    let hadithData = [];
    if (data?.data) {
      hadithData = data.data;
    } else if (Array.isArray(data)) {
      hadithData = data;
    }
    
    return hadithData.map((h: any) => {
      const englishData = h.hadith.find((item: any) => item.lang === 'en') || {};
      const arabicData = h.hadith.find((item: any) => item.lang === 'ar') || {};
      
      return {
        id: h.hadithNumber || Math.random(),
        hadithNumber: h.hadithNumber || '',
        englishNarrator: englishData.narrator || 'Unknown',
        hadithArabic: arabicData.body || '',
        hadithEnglish: englishData.body || '',
        hadithUrdu: '',
        bookSlug: collection,
        status: ''
      };
    });
  },

  async getHadiths(collection: string, page: number = 1): Promise<Hadith[]> {
    const cacheKey = `sunnah_hadiths_${collection}_${page}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }

    try {
      const apiKey = getApiKey();
      // Sunnah.com API uses limit and offset for pagination
      const limit = 20;
      const offset = (page - 1) * limit;
      const targetUrl = `${SUNNAH_API_URL}/collections/${collection}/hadiths?limit=${limit}&offset=${offset}`;
      const url = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
      
      const response = await fetchWithRetry(url, {
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Sunnah.com API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      const result = this.normalizeHadiths(data, collection);
      cache[cacheKey] = { data: result, timestamp: Date.now() };
      return result;
    } catch (error) {
      console.error('[HadithService] Error in getHadiths:', error);
      throw error;
    }
  },

  async searchHadith(query: string): Promise<Hadith[]> {
    try {
      const apiKey = getApiKey();
      // Sunnah.com search endpoint
      const targetUrl = `${SUNNAH_API_URL}/search?query=${encodeURIComponent(query)}&limit=20`;
      const url = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
      
      const response = await fetchWithRetry(url, {
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Sunnah.com API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      // Search results might have a different structure
      return this.normalizeHadiths(data, 'search');
    } catch (error) {
      console.error('[HadithService] Error in searchHadith:', error);
      throw error;
    }
  }
};
