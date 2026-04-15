
const HADITH_API_BASE = '/api/hadiths';

import { Hadith } from '../types';

export interface HadithBook {
  id: string;
  name: string;
  totalHadiths: number;
}

// Simple in-memory cache
const cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3, backoff = 1000): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0 && (response.status === 429 || response.status >= 500)) {
      console.warn(`Retrying fetch for ${url}. Status: ${response.status}. Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying fetch for ${url} due to error:`, error);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const hadithService = {
  async fetchBooks(): Promise<HadithBook[]> {
    const cacheKey = 'books_list';
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }

    try {
      const url = `/api/books`;
      const response = await fetchWithRetry(url);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      
      if (data?.books) {
        const books = data.books
          .filter((b: any) => {
            const slug = (b.bookSlug || '').toLowerCase();
            const name = (b.bookName || '').toLowerCase();
            return !slug.includes('ahmad') && 
                   !slug.includes('ahmed') && 
                   !slug.includes('silsila') &&
                   !name.includes('musnad ahmad') &&
                   !name.includes('silsila sahiha');
          })
          .map((b: any) => {
            // Ensure we have a valid slug for the ID
            const slug = b.bookSlug || b.bookName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return {
              id: slug,
              name: b.bookName,
              totalHadiths: parseInt(b.hadiths_count) || 0
            };
          });
        
        cache[cacheKey] = { data: books, timestamp: Date.now() };
        return books;
      }
      return [];
    } catch (error) {
      console.error('Error in fetchBooks:', error);
      return [];
    }
  },

  getBooks(): HadithBook[] {
    return [
      { id: 'sahih-bukhari', name: 'Sahih al-Bukhari', totalHadiths: 7563 },
      { id: 'sahih-muslim', name: 'Sahih Muslim', totalHadiths: 3033 },
      { id: 'sunan-nasai', name: 'Sunan an-Nasa\'i', totalHadiths: 5758 },
      { id: 'sunan-abu-dawood', name: 'Sunan Abi Dawud', totalHadiths: 5274 },
      { id: 'sunan-tirmidhi', name: 'Jami` at-Tirmidhi', totalHadiths: 3956 },
      { id: 'sunan-ibn-majah', name: 'Sunan Ibn Majah', totalHadiths: 4341 },
      { id: 'muwatta-malik', name: 'Muwatta Malik', totalHadiths: 1851 },
      { id: 'mishkat-al-masabih', name: 'Mishkat al-Masabih', totalHadiths: 6285 },
      { id: 'al-adab-al-mufrad', name: 'Al-Adab al-Mufrad', totalHadiths: 1322 },
      { id: 'bulugh-al-maram', name: 'Bulugh al-Maram', totalHadiths: 1358 },
      { id: 'riyad-us-salihin', name: 'Riyad us-Salihin', totalHadiths: 1896 },
    ];
  },

  normalizeHadiths(data: any, book: string): Hadith[] {
    let hadithData = [];
    if (data?.hadiths?.data) {
      hadithData = data.hadiths.data;
    } else if (data?.data) {
      hadithData = data.data;
    } else if (Array.isArray(data)) {
      hadithData = data;
    }
    
    return hadithData.map((h: any) => ({
      id: h.id,
      hadithNumber: h.hadithNumber || h.hadith_number || '',
      englishNarrator: h.englishNarrator || h.english_narrator || h.narrator_english || 'Unknown',
      hadithArabic: h.hadithArabic || h.hadith_arabic || h.arabic_text || '',
      hadithEnglish: h.hadithEnglish || h.hadith_english || h.english_text || '',
      hadithUrdu: h.hadithUrdu || h.hadith_urdu || '',
      bookSlug: h.bookSlug || h.book_slug || book,
      status: h.status || ''
    }));
  },

  async getHadiths(book: string, page: number = 1): Promise<Hadith[]> {
    const cacheKey = `hadiths_${book}_${page}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }

    try {
      console.log(`Fetching hadiths for book slug: ${book}, page: ${page}`);
      let currentBook = book;
      
      // Normalize slugs for common books
      const lowerBook = book.toLowerCase();
      if (lowerBook.includes('bukhari')) currentBook = 'sahih-bukhari';
      else if (lowerBook.includes('muslim')) currentBook = 'sahih-muslim';
      else if (lowerBook.includes('nasai')) currentBook = 'sunan-nasai';
      else if (lowerBook.includes('dawud') || lowerBook.includes('dawood')) currentBook = 'sunan-abu-dawood';
      else if (lowerBook.includes('tirmidhi')) currentBook = 'sunan-tirmidhi';
      else if (lowerBook.includes('majah')) currentBook = 'sunan-ibn-majah';
      else if (lowerBook.includes('malik')) currentBook = 'muwatta-malik';
      else if (lowerBook.includes('ahmad') || lowerBook.includes('ahmed')) currentBook = 'musnad-ahmad';
      else if (lowerBook.includes('mishkat')) currentBook = 'mishkat-al-masabih';
      else if (lowerBook.includes('adab')) currentBook = 'al-adab-al-mufrad';
      else if (lowerBook.includes('bulugh')) currentBook = 'bulugh-al-maram';
      else if (lowerBook.includes('riyad')) currentBook = 'riyad-us-salihin';
      
      const url = `${HADITH_API_BASE}?book=${encodeURIComponent(currentBook)}&paginate=20&page=${page}`;
      console.log(`Fetching hadiths from: ${url}`);
      const response = await fetchWithRetry(url);
      
      if (!response.ok) {
        throw new Error(`Hadith Proxy responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Hadith API response for ${book}:`, data);
      
      if (data.status && data.status !== 200) {
        if (data.status === 401) {
          throw new Error("Invalid Hadith API Key. Please ensure you have set HADITH_API_KEY in your environment variables/secrets.");
        }
        
        if (data.message?.includes('Hadiths not found')) {
          // Try a few more fallbacks if it's Musnad Ahmad
          if (currentBook === 'musnad-ahmad') {
            const fallbacks = ['musnad-ahmed', 'ahmad', 'musnad-ahmad-bin-hanbal'];
            for (const fallback of fallbacks) {
              const fallbackUrl = `${HADITH_API_BASE}?book=${fallback}&paginate=20&page=${page}`;
              const fallbackResponse = await fetchWithRetry(fallbackUrl);
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                if (fallbackData.status === 200) {
                  const result = this.normalizeHadiths(fallbackData, fallback);
                  cache[cacheKey] = { data: result, timestamp: Date.now() };
                  return result;
                }
              }
            }
          }
          throw new Error(`No hadiths found for "${book}" on page ${page}. This collection might have fewer pages or the book slug is incorrect.`);
        }
        throw new Error(data.message || `API Error: ${data.status}`);
      }
      
      const result = this.normalizeHadiths(data, currentBook);
      cache[cacheKey] = { data: result, timestamp: Date.now() };
      return result;
    } catch (error) {
      console.error('Error in getHadiths:', error);
      throw error;
    }
  },

  async searchHadith(query: string): Promise<Hadith[]> {
    try {
      const url = `${HADITH_API_BASE}?paginate=20&search=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Hadith Proxy responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.normalizeHadiths(data, '');
    } catch (error) {
      console.error('Error in searchHadith:', error);
      throw error;
    }
  }
};
