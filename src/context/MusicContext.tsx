import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Song, getMoodBasedSongs } from '../api/saavnApi';
import { searchYoutubeVideo } from '../api/youtubeApi';
import { useMood } from './MoodContext';

interface MusicContextType {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  playbackProgress: number;
  currentVideoId: string | null;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  recommendedSongs: Song[];
  loadingRecommendations: boolean;
  onYouTubeStateChange: (state: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const { currentMood } = useMood();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  
  const youtubePlayerRef = useRef<any>(null);
  const playerStateRef = useRef<number>(-1);

  useEffect(() => {
    if (currentMood) {
      loadRecommendedSongs(currentMood.mood);
    }
  }, [currentMood]);

  const loadRecommendedSongs = async (mood: string) => {
    setLoadingRecommendations(true);
    try {
      const songs = await getMoodBasedSongs(mood);
      setRecommendedSongs(songs);
    } catch (error) {
      console.error('Error loading recommended songs:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const loadYouTubeVideo = async (song: Song) => {
    try {
      const searchQuery = `${song.name} ${song.artists.primary.map(a => a.name).join(' ')}`;
      const videoId = await searchYoutubeVideo(searchQuery);
      setCurrentVideoId(videoId);
    } catch (error) {
      console.error('Error loading YouTube video:', error);
    }
  };

  const play = async (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setPlaybackProgress(0);
    await loadYouTubeVideo(song);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    if (currentSong) {
      setIsPlaying(true);
    }
  };

  const next = async () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      
      setQueue(newQueue);
      await play(nextSong);
    } else if (recommendedSongs.length > 0 && currentSong) {
      const currentIndex = recommendedSongs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % recommendedSongs.length;
      await play(recommendedSongs[nextIndex]);
    }
  };

  const previous = async () => {
    if (playbackProgress > 5 && currentSong) {
      setPlaybackProgress(0);
      setSeekTo(0);
    } else if (recommendedSongs.length > 0 && currentSong) {
      const currentIndex = recommendedSongs.findIndex(song => song.id === currentSong.id);
      const prevIndex = (currentIndex - 1 + recommendedSongs.length) % recommendedSongs.length;
      await play(recommendedSongs[prevIndex]);
    }
  };

  const setProgress = (progress: number) => {
    if (progress >= 0 && progress <= (currentSong?.duration || 0)) {
      setPlaybackProgress(progress);
      setSeekTo(progress);
    }
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const onYouTubeStateChange = (state: number) => {
    // Store current player state
    playerStateRef.current = state;
    
    // YouTube player states:
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    switch (state) {
      case 0: // ended
        next();
        break;
      case 1: // playing
        setIsPlaying(true);
        break;
      case 2: // paused
        setIsPlaying(false);
        break;
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        volume,
        playbackProgress,
        currentVideoId,
        play,
        pause,
        resume,
        next,
        previous,
        setVolume,
        setProgress,
        addToQueue,
        clearQueue,
        recommendedSongs,
        loadingRecommendations,
        onYouTubeStateChange,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};