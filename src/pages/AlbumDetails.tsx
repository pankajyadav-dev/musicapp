import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Heart } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { Album, Song, searchSongs } from '../api/saavnApi';

const AlbumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentMood } = useMood();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (id) {
      // In a real app, we would call an API endpoint to get album details
      // For now, we'll simulate it by searching for songs with the album ID
      loadAlbumSongs(id);
    }
  }, [id]);
  
  const loadAlbumSongs = async (albumId: string) => {
    setLoading(true);
    try {
      // This is a workaround since we don't have a direct API for album details
      // In a real app, you would use the getAlbumDetails API
      const albumSongs = await searchSongs(`saavn album ${albumId}`);
      
      if (albumSongs.length > 0) {
        const firstSong = albumSongs[0];
        setAlbum({
          id: albumId,
          name: firstSong.album.name,
          description: '',
          url: firstSong.album.url,
          year: firstSong.year,
          type: 'album',
          language: 'unknown',
          artists: firstSong.artists,
          image: firstSong.image,
        });
        setSongs(albumSongs);
      }
    } catch (error) {
      console.error('Error loading album details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getTotalDuration = () => {
    const totalSeconds = songs.reduce((acc, song) => acc + song.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    
    return hours > 0 
      ? `${hours} hr ${mins} min` 
      : `${mins} min`;
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="inline-block animate-spin-slow h-12 w-12 rounded-full border-4 border-gray-400 border-t-primary-500"></div>
      </div>
    );
  }
  
  if (!album) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-400">Album not found</h2>
        <Link to="/" className="text-primary-400 hover:underline mt-4 inline-block">
          Go back home
        </Link>
      </div>
    );
  }
  
  const albumImage = album.image.find(img => img.quality === '500x500')?.url || '';
  const colorClass = currentMood?.colorTheme || 'primary';
  
  return (
    <div className="fade-in">
      <Link to="/explore" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Explore
      </Link>
      
      <div className={`p-6 rounded-xl mb-8 bg-gradient-to-r from-${colorClass}-900/50 to-background-800`}>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img 
            src={albumImage} 
            alt={album.name}
            className="w-48 h-48 rounded-lg shadow-xl object-cover mb-4 md:mb-0 md:mr-6"
          />
          
          <div className="text-center md:text-left">
            <span className="text-sm font-medium uppercase tracking-wider text-gray-400">Album</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">{album.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start mt-2 text-sm text-gray-400">
              <span className="flex items-center">
                {album.artists.primary.map(artist => artist.name).join(', ')}
              </span>
              <span className="mx-2">•</span>
              <span>{album.year}</span>
              <span className="mx-2">•</span>
              <span>{songs.length} songs, {getTotalDuration()}</span>
            </div>
            
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button className={`bg-${colorClass}-500 hover:bg-${colorClass}-600 text-white rounded-full px-8 py-3 flex items-center font-medium transition-colors`}>
                <Play fill="white" className="mr-2" /> Play All
              </button>
              <button className="bg-transparent border border-gray-600 hover:border-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4 text-sm font-medium text-gray-400 grid grid-cols-12 px-4">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Title</div>
        <div className="hidden md:block col-span-5">Artists</div>
        <div className="col-span-1 text-right">
          <Clock className="h-4 w-4 inline" />
        </div>
      </div>
      
      <div>
        {songs.map((song, index) => (
          <div 
            key={song.id}
            className="grid grid-cols-12 px-4 py-3 rounded-md hover:bg-background-700 transition-colors items-center text-sm"
          >
            <div className="col-span-1 text-gray-400">{index + 1}</div>
            <div className="col-span-5 truncate font-medium">{song.name}</div>
            <div className="hidden md:block col-span-5 text-gray-400 truncate">
              {song.artists.primary.map(artist => artist.name).join(', ')}
            </div>
            <div className="col-span-1 text-gray-400 text-right">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetails;