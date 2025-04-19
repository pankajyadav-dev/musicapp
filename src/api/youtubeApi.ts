import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyB1fVKntZPLFZCSCm5u0VBmSkXgQqfA52A'; 
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export const searchYoutubeVideo = async (query: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 1,
        q: `${query} official audio`,
        type: 'video',
        videoCategoryId: '10', // Music category
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error('Error searching YouTube video:', error);
    return null;
  }
};