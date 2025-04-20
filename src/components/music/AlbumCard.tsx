import React, { useState } from 'react';
import { Play, Loader } from 'lucide-react';
import { Album, Song, searchSongs } from '../../api/saavnApi';
import { useMusic } from '../../context/MusicContext';

interface AlbumCardProps {
  album: Album;
  colorClass?: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, colorClass = 'primary' }) => {
  const imageUrl = album.image.find(img => img.quality === '500x500')?.url || '';
  const { play } = useMusic();
  const [loading, setLoading] = useState(false);
  
  const handlePlayAlbum = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      // Search for songs by album name and artist
      const searchQuery = `${album.name} ${album.artists.primary[0]?.name || ''}`;
      const songs = await searchSongs(searchQuery, 10);
      
      // Play the first song if available
      if (songs && songs.length > 0) {
        play(songs[0]);
      }
    } catch (error) {
      console.error('Error playing album:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`album-card group relative flex flex-col rounded-lg overflow-hidden bg-background-800 hover:bg-background-700 transition-all duration-300`}>
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={album.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-background-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
          <button 
            onClick={handlePlayAlbum}
            className={`bg-${colorClass}-500 text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg`}
          >
            {loading ? <Loader className="animate-spin" /> : <Play fill="white" />}
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium truncate">{album.name}</h3>
        <p className="text-sm text-gray-400 truncate">
          {album.artists.primary.map(artist => artist.name).join(', ')}
        </p>
        <div className="mt-2 flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full bg-${colorClass}-900/30 text-${colorClass}-400`}>
            {album.year}
          </span>
          <span className="text-xs text-gray-500 ml-2 capitalize">
            {album.language}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;