import React, { useState, useEffect } from 'react';
import { Search, Music, Album as AlbumIcon } from 'lucide-react';
import SongCard from '../components/music/SongCard';
import AlbumCard from '../components/music/AlbumCard';
import { searchSongs, searchAlbums, Song, Album } from '../api/saavnApi';
import { useMood } from '../context/MoodContext';

const Explore: React.FC = () => {
  const { currentMood } = useMood();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{
    songs: Song[];
    albums: Album[];
  }>({ songs: [], albums: [] });
  const [searchType, setSearchType] = useState<'all' | 'songs' | 'albums'>('all');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const delayDebounceFn = setTimeout(() => {
        performSearch(searchQuery);
      }, 500);
      
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, searchType]);
  
  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      let songResults: Song[] = [];
      let albumResults: Album[] = [];
      
      if (searchType === 'all' || searchType === 'songs') {
        songResults = await searchSongs(query);
      }
      
      if (searchType === 'all' || searchType === 'albums') {
        albumResults = await searchAlbums(query);
      }
      
      setSearchResults({
        songs: songResults,
        albums: albumResults,
      });
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };
  
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs, albums, or artists..."
            className="w-full bg-background-700 border border-background-600 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex mt-4 space-x-2">
          <button
            type="button"
            onClick={() => setSearchType('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              searchType === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-background-700 text-gray-300 hover:bg-background-600'
            } transition-colors`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSearchType('songs')}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${
              searchType === 'songs' 
                ? 'bg-primary-600 text-white' 
                : 'bg-background-700 text-gray-300 hover:bg-background-600'
            } transition-colors`}
          >
            <Music className="h-4 w-4 mr-1" /> Songs
          </button>
          <button
            type="button"
            onClick={() => setSearchType('albums')}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${
              searchType === 'albums' 
                ? 'bg-primary-600 text-white' 
                : 'bg-background-700 text-gray-300 hover:bg-background-600'
            } transition-colors`}
          >
            <AlbumIcon className="h-4 w-4 mr-1" /> Albums
          </button>
        </div>
      </form>
      
      {isSearching ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin-slow h-12 w-12 rounded-full border-4 border-gray-400 border-t-primary-500"></div>
          <p className="mt-4 text-gray-400">Searching...</p>
        </div>
      ) : searchQuery.trim().length === 0 ? (
        <div className="py-12 text-center">
          <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl text-gray-400">Search for your favorite music</h2>
          <p className="text-gray-500 mt-2">Find songs, albums, and artists</p>
        </div>
      ) : (
        <>
          {/* Albums results */}
          {(searchType === 'all' || searchType === 'albums') && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <AlbumIcon className="mr-2 h-5 w-5" /> 
                Albums
              </h2>
              {searchResults.albums.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.albums.slice(0, 8).map((album) => (
                    <AlbumCard 
                      key={album.id} 
                      album={album} 
                      colorClass={currentMood?.colorTheme || 'primary'}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-4">No albums found for "{searchQuery}"</p>
              )}
            </section>
          )}
          
          {/* Songs results */}
          {(searchType === 'all' || searchType === 'songs') && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Music className="mr-2 h-5 w-5" /> 
                Songs
              </h2>
              {searchResults.songs.length > 0 ? (
                <div>
                  {searchResults.songs.slice(0, 10).map((song, index) => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      index={index} 
                      colorClass={currentMood?.colorTheme || 'primary'}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-4">No songs found for "{searchQuery}"</p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;