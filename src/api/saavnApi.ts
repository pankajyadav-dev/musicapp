import axios from 'axios';

const API_BASE_URL = 'https://saavn.dev/api';

// Types
export interface Song {
  id: string;
  name: string;
  type: string;
  year: string;
  duration: number;
  url: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  artists: {
    primary: Array<{
      id: string;
      name: string;
      role: string;
      type: string;
      url: string;
    }>;
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    url: string;
  }>;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  url: string;
  year: string;
  type: string;
  language: string;
  artists: {
    primary: Array<{
      id: string;
      name: string;
      role: string;
      type: string;
      url: string;
    }>;
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
}

export interface SearchResponse<T> {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: T[];
  };
}

// API functions
export const searchSongs = async (query: string, limit = 20): Promise<Song[]> => {
  try {
    const response = await axios.get<SearchResponse<Song>>(`${API_BASE_URL}/search/songs`, {
      params: { query, limit }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
};

export const searchAlbums = async (query: string, limit = 20): Promise<Album[]> => {
  try {
    const response = await axios.get<SearchResponse<Album>>(`${API_BASE_URL}/search/albums`, {
      params: { query, limit }
    });
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
};

export const getMoodBasedSongs = async (mood: string, limit = 20): Promise<Song[]> => {
  // Map mood to appropriate search terms
  const moodSearchMap: Record<string, string> = {
    happy: 'happy upbeat',
    sad: 'sad emotional',
    energetic: 'energetic dance',
    chill: 'chill relax',
    romantic: 'romantic love',
    focus: 'focus concentration',
  };

  const searchTerm = moodSearchMap[mood.toLowerCase()] || mood;
  return searchSongs(searchTerm, limit);
};

export const getMoodBasedAlbums = async (mood: string, limit = 20): Promise<Album[]> => {
  // Map mood to appropriate search terms
  const moodSearchMap: Record<string, string> = {
    happy: 'happy',
    sad: 'sad',
    energetic: 'party',
    chill: 'chill',
    romantic: 'love',
    focus: 'meditation',
  };

  const searchTerm = moodSearchMap[mood.toLowerCase()] || mood;
  return searchAlbums(searchTerm, limit);
};