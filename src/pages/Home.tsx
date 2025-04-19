import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Sparkles, BarChart } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useMusic } from '../context/MusicContext';
import AlbumCard from '../components/music/AlbumCard';
import SongCard from '../components/music/SongCard';
import { Album, getMoodBasedAlbums } from '../api/saavnApi';
import { availableMoods } from '../api/moodApi';

const Home: React.FC = () => {
  const { currentMood } = useMood();
  const { recommendedSongs, loadingRecommendations } = useMusic();
  const [moodAlbums, setMoodAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(false);
  
  useEffect(() => {
    if (currentMood) {
      loadMoodBasedAlbums(currentMood.mood);
    }
  }, [currentMood]);
  
  const loadMoodBasedAlbums = async (mood: string) => {
    setLoadingAlbums(true);
    try {
      const albums = await getMoodBasedAlbums(mood);
      setMoodAlbums(albums.slice(0, 8));
    } catch (error) {
      console.error('Error loading mood albums:', error);
    } finally {
      setLoadingAlbums(false);
    }
  };
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <div className="fade-in">
      <div className={`p-6 rounded-xl mb-8 bg-gradient-to-r from-${currentMood?.colorTheme || 'primary'}-900/50 to-background-800`}>
        <h1 className="text-3xl font-bold mb-2">{greeting()}</h1>
        
        {currentMood && (
          <div className="flex items-center mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 mr-4">
              <Sparkles className={`h-8 w-8 text-${currentMood.colorTheme}-400`} />
            </div>
            <div>
              <p className="text-lg">Your current mood</p>
              <h2 className={`text-2xl font-bold text-${currentMood.colorTheme}-400`}>
                {currentMood.mood} Vibes
              </h2>
            </div>
            <Link 
              to="/mood" 
              className={`ml-auto px-4 py-2 rounded-full border border-${currentMood.colorTheme}-500 text-${currentMood.colorTheme}-400 hover:bg-${currentMood.colorTheme}-900/30 transition-colors`}
            >
              Change Mood
            </Link>
          </div>
        )}
      </div>
      
      {/* Mood Selection */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BarChart className="mr-2 h-5 w-5" /> 
          Select a Mood
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {availableMoods.map((mood, index) => (
            <Link 
              key={index} 
              to="/mood"
              className={`p-3 rounded-lg bg-gradient-to-br from-${mood.colorTheme}-900/40 to-${mood.colorTheme}-900/10 hover:from-${mood.colorTheme}-800/40 border border-${mood.colorTheme}-800/50 transition-all group`}
            >
              <h3 className={`text-${mood.colorTheme}-400 font-medium group-hover:scale-105 transition-transform`}>
                {mood.mood}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {mood.relatedGenres.slice(0, 2).join(', ')}
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recommendations based on mood */}
      {currentMood && (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Music className={`mr-2 h-5 w-5 text-${currentMood.colorTheme}-400`} /> 
              {currentMood.mood} Albums
            </h2>
            {loadingAlbums ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-background-800 aspect-square loading-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {moodAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} colorClass={currentMood.colorTheme} />
                ))}
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Sparkles className={`mr-2 h-5 w-5 text-${currentMood.colorTheme}-400`} /> 
              {currentMood.mood} Songs For You
            </h2>
            {loadingRecommendations ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded-md bg-background-800 loading-pulse"></div>
                ))}
              </div>
            ) : (
              <div>
                {recommendedSongs.slice(0, 5).map((song, index) => (
                  <SongCard 
                    key={song.id} 
                    song={song} 
                    index={index} 
                    colorClass={currentMood.colorTheme}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Home;