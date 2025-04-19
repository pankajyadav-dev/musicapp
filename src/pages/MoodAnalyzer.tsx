import React, { useState } from 'react';
import { Search, Sparkles, BarChart, Music } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useMusic } from '../context/MusicContext';
import MoodCard from '../components/mood/MoodCard';
import SongCard from '../components/music/SongCard';
import { availableMoods } from '../api/moodApi';

const MoodAnalyzer: React.FC = () => {
  const { currentMood, loading, error, analyzeMood, setRandomMood } = useMood();
  const { recommendedSongs, loadingRecommendations } = useMusic();
  const [moodText, setMoodText] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (moodText.trim()) {
      analyzeMood(moodText);
    }
  };
  
  return (
    <div className="fade-in">
      <div className={`p-6 rounded-xl mb-8 ${
        currentMood 
          ? `bg-gradient-to-r from-${currentMood.colorTheme}-900/50 to-background-800` 
          : 'bg-background-800'
      }`}>
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <BarChart className="mr-3 h-7 w-7" /> 
          Mood Analyzer
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="Describe how you're feeling today..."
              className="w-full bg-background-700 border border-background-600 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="submit"
              disabled={loading || !moodText.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-4 py-1.5 flex items-center transition-colors ${
                loading || !moodText.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Sparkles className="mr-1 h-4 w-4" />
              Analyze
            </button>
          </div>
        </form>
        
        {error && (
          <div className="p-4 mb-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        {currentMood && (
          <div className="flex items-center p-4 rounded-lg bg-background-800/60">
            <div className={`h-12 w-12 rounded-full bg-${currentMood.colorTheme}-900 flex items-center justify-center mr-4`}>
              <Sparkles className={`h-6 w-6 text-${currentMood.colorTheme}-400`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Your detected mood is</p>
              <h2 className={`text-xl font-bold text-${currentMood.colorTheme}-400`}>
                {currentMood.mood}
              </h2>
            </div>
            <button
              onClick={setRandomMood}
              className="ml-auto px-4 py-2 bg-background-700 hover:bg-background-600 rounded-full text-sm transition-colors"
            >
              Try Another Mood
            </button>
          </div>
        )}
      </div>
      
      {/* Mood Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Choose Your Mood</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMoods.map((mood, index) => (
            <MoodCard 
              key={index} 
              mood={mood} 
              isActive={currentMood?.mood === mood.mood}
              onClick={() => analyzeMood(mood.mood)}
            />
          ))}
        </div>
      </section>
      
      {/* Song Recommendations */}
      {currentMood && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Music className={`mr-2 h-5 w-5 text-${currentMood.colorTheme}-400`} /> 
            Music For Your {currentMood.mood} Mood
          </h2>
          {loadingRecommendations ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-background-800 loading-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="slide-up">
              {recommendedSongs.map((song, index) => (
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
      )}
    </div>
  );
};

export default MoodAnalyzer;