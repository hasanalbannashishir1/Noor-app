
export const quranUserService = {
  async getAuthUrl() {
    const response = await fetch('/api/auth/quran/url');
    if (!response.ok) throw new Error('Failed to get auth URL');
    return response.json();
  },

  async syncBookmarks(token: string) {
    const response = await fetch('/api/quran/member/bookmarks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to sync bookmarks');
    return response.json();
  },

  async saveProgress(token: string, surahId: number, ayahId: number) {
    // This uses the Reading Sessions API from Quran Foundation
    const response = await fetch('/api/quran/member/reading_sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ surah_id: surahId, ayah_id: ayahId })
    });
    return response.json();
  }
};
