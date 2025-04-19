import React from 'react';
import { Play, Pause, Clock, MoreHorizontal, Plus } from 'lucide-react';
import { Song } from '../../api/saavnApi';
import { useMusic } from '../../context/MusicContext';

interface SongCardProps {
  song: Song;
  index: number;
  colorClass?: string;
}

const SongCard: React.FC<SongCardProps> = ({ song, index, colorClass = 'primary' }) => {
  const { currentSong, isPlaying, play, pause, resume, addToQueue } = useMusic();
  
  const isCurrentSong = currentSong?.id === song.id;
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handlePlayClick = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      play(song);
    }
  };
  
  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
  };
  
  return (
    <div 
      className={`track-item group flex items-center p-2 rounded-md ${
        isCurrentSong ? `bg-${colorClass}-900/40` : 'hover:bg-background-700'
      } transition-colors cursor-pointer`}
      onClick={handlePlayClick}
    >
      <div className="flex items-center justify-center w-8 text-gray-400 group-hover:text-white">
        {isCurrentSong && isPlaying ? (
          <Pause size={18} className={`text-${colorClass}-400`} />
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <Play size={18} className="hidden group-hover:block" />
          </>
        )}
      </div>
      
      <div className="flex items-center flex-1 min-w-0">
        <img 
          src={song.image.find(img => img.quality === '50x50')?.url || ''} 
          alt={song.name}
          className="h-10 w-10 mr-3 rounded"
          loading="lazy"
        />
        <div className="truncate pr-2">
          <h4 className={`font-medium truncate ${isCurrentSong ? `text-${colorClass}-400` : ''}`}>
            {song.name}
          </h4>
          <p className="text-sm text-gray-400 truncate">
            {song.artists.primary.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>
      
      <div className="hidden md:block flex-shrink-0 text-sm text-gray-400 w-32 truncate">
        {song.album.name}
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm text-gray-400">{formatDuration(song.duration)}</span>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleAddToQueue}
            className="p-1.5 text-gray-400 hover:text-white focus:outline-none"
          >
            <Plus size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white focus:outline-none">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;