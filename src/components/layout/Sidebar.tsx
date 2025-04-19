import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Radio, Library, Music, BarChart, Heart } from 'lucide-react';
import { useMood } from '../../context/MoodContext';

const Sidebar: React.FC = () => {
  const { currentMood } = useMood();
  
  return (
    <aside className="hidden md:flex flex-col w-60 bg-background-800 text-white p-6 h-full">
      <div className="flex items-center gap-2 mb-8">
        <Music className="h-8 w-8 text-primary-400" />
        <h1 className="text-2xl font-bold">Moodify</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive ? 'bg-background-700 text-primary-400' : 'text-gray-300 hover:bg-background-700'
                }`
              }
            >
              <Home size={20} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive ? 'bg-background-700 text-primary-400' : 'text-gray-300 hover:bg-background-700'
                }`
              }
            >
              <Search size={20} />
              <span>Explore</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/mood" 
              className={({ isActive }) => 
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive ? 'bg-background-700 text-primary-400' : 'text-gray-300 hover:bg-background-700'
                }`
              }
            >
              <BarChart size={20} />
              <span>Mood Analyzer</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/library" 
              className={({ isActive }) => 
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive ? 'bg-background-700 text-primary-400' : 'text-gray-300 hover:bg-background-700'
                }`
              }
            >
              <Library size={20} />
              <span>Your Library</span>
            </NavLink>
          </li>
        </ul>
        
        <hr className="my-6 border-background-700" />
        
        <div className="space-y-2">
          <h3 className="text-sm uppercase text-gray-400 font-semibold px-2">Your Moods</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                className={`flex items-center gap-3 p-2 rounded-md transition-colors bg-${currentMood?.colorTheme || 'primary'}-900/30 hover:bg-${currentMood?.colorTheme || 'primary'}-900/50`}
              >
                <Radio size={20} className={`text-${currentMood?.colorTheme || 'primary'}-400`} />
                <span>{currentMood?.mood || 'Happy'} Vibes</span>
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-300 hover:bg-background-700"
              >
                <Heart size={20} />
                <span>Favorites</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="mt-auto pt-6">
        <div className="p-4 rounded-lg bg-background-700/50">
          <p className="text-sm text-gray-400">Discover new music based on your mood with our AI-powered recommendations.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;