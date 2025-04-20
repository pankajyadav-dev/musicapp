import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Repeat, Shuffle } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import YouTubePlayer from './YouTubePlayer';

const Player: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    playbackProgress,
    currentVideoId,
    pause, 
    resume, 
    next, 
    previous, 
    setVolume,
    setProgress,
    onYouTubeStateChange
  } = useMusic();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  
  // Keep local progress in sync with global progress when not dragging
  useEffect(() => {
    if (!isDraggingProgress) {
      setLocalProgress(playbackProgress);
    }
  }, [playbackProgress, isDraggingProgress]);
  
  const togglePlay = () => {
    if (currentSong) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(volume);
    } else {
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };
  
  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
    setProgress(localProgress);
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLocalProgress(value);
    if (!isDraggingProgress) {
      setProgress(value);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (value > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };
  
  return (
    <>
      <YouTubePlayer
        videoId={currentVideoId}
        onStateChange={onYouTubeStateChange}
        volume={isMuted ? 0 : volume}
      />
      
      <div className="flex items-center p-4 bg-background-800 border-t border-background-700">
        {/* Song Info */}
        <div className="flex items-center w-1/4">
          {currentSong ? (
            <>
              <img 
                src={currentSong.image.find(img => img.quality === '150x150')?.url || ''} 
                alt={currentSong.name}
                className="h-14 w-14 rounded mr-3 object-cover"
              />
              <div className="truncate">
                <h4 className="text-sm font-medium truncate">{currentSong.name}</h4>
                <p className="text-xs text-gray-400 truncate">
                  {currentSong.artists.primary.map(artist => artist.name).join(', ')}
                </p>
              </div>
              <button 
                onClick={toggleLike}
                className="ml-4 focus:outline-none"
              >
                <Heart 
                  size={18} 
                  className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </button>
            </>
          ) : (
            <div className="text-gray-400 text-sm">No song selected</div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <Shuffle size={18} />
            </button>
            <button 
              onClick={previous}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <SkipBack size={22} />
            </button>
            <button 
              onClick={togglePlay}
              className="bg-white rounded-full p-2 text-black hover:scale-105 transition-transform focus:outline-none disabled:opacity-50"
              disabled={!currentSong}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
              onClick={next}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <SkipForward size={22} />
            </button>
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <Repeat size={18} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-3 mt-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(isDraggingProgress ? localProgress : playbackProgress)}
            </span>
            <input
              type="range"
              min="0"
              max={currentSong?.duration || 100}
              value={isDraggingProgress ? localProgress : playbackProgress}
              onChange={handleProgressChange}
              onMouseDown={handleProgressMouseDown}
              onMouseUp={handleProgressMouseUp}
              onTouchStart={handleProgressMouseDown}
              onTouchEnd={handleProgressMouseUp}
              className="flex-1 h-1 bg-background-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(currentSong?.duration || 0)}
            </span>
          </div>
        </div>
        
        {/* Volume */}
        <div className="w-1/4 flex justify-end items-center space-x-3">
          <button 
            onClick={toggleMute}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-background-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
    </>
  );
};

export default Player;