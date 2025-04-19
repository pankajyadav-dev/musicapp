import React, { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useMusic } from '../../context/MusicContext';

interface YouTubePlayerProps {
  videoId: string | null;
  onStateChange: (state: number) => void;
  volume: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onStateChange, volume }) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

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

  const onReady = (event: any) => {
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
        onStateChange={(event) => onStateChange(event.data)}
      />
    </div>
  );
};

export default YouTubePlayer;