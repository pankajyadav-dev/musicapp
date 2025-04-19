import React from 'react';
import { Clock, Music, User, Heart } from 'lucide-react';
import { useMood } from '../context/MoodContext';

// This is a placeholder page since we don't have user authentication and favorites functionality
const Library: React.FC = () => {
  const { currentMood } = useMood();
  const colorClass = currentMood?.colorTheme || 'primary';
  
  return (
    <div className="fade-in">
      <div className={`p-6 rounded-xl mb-8 bg-gradient-to-r from-${colorClass}-900/50 to-background-800`}>
        <div className="flex items-center">
          <div className={`h-20 w-20 rounded-full bg-${colorClass}-900/60 flex items-center justify-center mr-6`}>
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Library</h1>
            <p className="text-gray-400 mt-1">Your favorite music in one place</p>
          </div>
        </div>
      </div>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500" /> 
          Liked Songs
        </h2>
        <div className="bg-background-800 rounded-lg p-6 text-center">
          <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium">Your liked songs will appear here</h3>
          <p className="text-gray-400 mt-2">Save songs by tapping the heart icon</p>
          <button className={`mt-6 px-6 py-2 rounded-full bg-${colorClass}-600 hover:bg-${colorClass}-700 transition-colors`}>
            Browse music
          </button>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5" /> 
          Recently Played
        </h2>
        <div className="bg-background-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">You haven't played any songs yet</p>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Mood Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Happy', 'Sad', 'Energetic', 'Chill', 'Romantic', 'Focus'].map((mood) => (
            <div 
              key={mood} 
              className="p-4 rounded-lg bg-background-800 hover:bg-background-700 transition-all cursor-pointer"
            >
              <h3 className="font-medium mb-2">{mood} Vibes</h3>
              <p className="text-sm text-gray-400">Your {mood.toLowerCase()} mood playlist</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Library;