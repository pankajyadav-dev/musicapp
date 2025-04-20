import React, { useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useMusic } from '../../context/MusicContext';

interface YouTubePlayerProps {
  videoId: string | null;
  onStateChange: (state: number) => void;
  volume: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onStateChange, volume }) => {
  const playerRef = useRef<any>(null);
  const { playbackProgress, setProgress, isPlaying, currentSong } = useMusic();
  const progressIntervalRef = useRef<number | null>(null);

  // Handle volume changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  // Handle progress tracking
  useEffect(() => {
    const startProgressTracking = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = window.setInterval(() => {
        if (playerRef.current && isPlaying) {
          const currentTime = playerRef.current.getCurrentTime();
          setProgress(currentTime);
        }
      }, 1000);
    };

    if (isPlaying) {
      startProgressTracking();
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, setProgress]);

  // Handle seeking
  useEffect(() => {
    if (playerRef.current && isPlaying) {
      const currentTime = playerRef.current.getCurrentTime();
      if (Math.abs(currentTime - playbackProgress) > 2) {
        playerRef.current.seekTo(playbackProgress);
      }
    }
  }, [playbackProgress, isPlaying]);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume * 100);
  };

  if (!videoId) return null;

  return (
    <div className="hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={(event: YouTubeEvent) => onStateChange(event.data)}
      />
    </div>
  );
};

export default YouTubePlayer;