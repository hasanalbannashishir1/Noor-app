
const HADITH_API_BASE = '/api/hadiths';

import { Hadith } from '../types';

export interface HadithBook {
  id: string;
  name: string;
  totalHadiths: number;
}

export const hadithService = {
  async fetchBooks(): Promise<HadithBook[]> {
    try {
      const url = `/api/books`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      
      if (data?.books) {
        console.log('Books fetched from API:', data.books.map((b: any) => b.bookSlug));
        return data.books.map((b: any) => {
          // Ensure we have a valid slug for the ID
          const slug = b.bookSlug || b.bookName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return {
            id: slug,
            name: b.bookName,
            totalHadiths: parseInt(b.hadiths_count) || 0
          };
        });
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
      { id: 'sahih-muslim', name: 'Sahih Muslim', totalHadiths: 7563 },
      { id: 'sunan-nasai', name: 'Sunan an-Nasa\'i', totalHadiths: 5758 },
      { id: 'sunan-abi-dawud', name: 'Sunan Abi Dawud', totalHadiths: 5274 },
      { id: 'jami-tirmidhi', name: 'Jami` at-Tirmidhi', totalHadiths: 3956 },
      { id: 'sunan-ibn-majah', name: 'Sunan Ibn Majah', totalHadiths: 4341 },
      { id: 'muwatta-malik', name: 'Muwatta Malik', totalHadiths: 1851 },
    ];
  },

  async getHadiths(book: string, page: number = 1): Promise<Hadith[]> {
    try {
      console.log(`Fetching hadiths for book slug: ${book}, page: ${page}`);
      const url = `${HADITH_API_BASE}?book=${encodeURIComponent(book)}&paginate=20&page=${page}`;
      console.log(`Fetching hadiths from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Hadith Proxy responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Hadith API response for ${book}:`, data);
      
      if (data.status && data.status !== 200) {
        throw new Error(data.message || `API Error: ${data.status}`);
      }
      
      // The API structure might vary, let's be flexible
      let hadithData = [];
      if (data?.hadiths?.data) {
        hadithData = data.hadiths.data;
      } else if (data?.data) {
        hadithData = data.data;
      } else if (Array.isArray(data)) {
        hadithData = data;
      }
      
      if (hadithData.length === 0 && data.status === 200) {
        console.warn(`No hadiths found for book: ${book}`);
      }
      
      return hadithData;
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
      
      if (data?.hadiths?.data) {
        return data.hadiths.data;
      } else if (data?.data) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      }
      
      return [];
    } catch (error) {
      console.error('Error in searchHadith:', error);
      throw error;
    }
  }
};
