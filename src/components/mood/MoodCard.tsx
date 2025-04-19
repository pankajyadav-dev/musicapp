import React from 'react';
import { MoodAnalysisResult } from '../../api/moodApi';

interface MoodCardProps {
  mood: MoodAnalysisResult;
  isActive?: boolean;
  onClick?: () => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, isActive = false, onClick }) => {
  return (
    <div 
      className={`mood-card p-4 rounded-xl ${
        isActive 
          ? `bg-${mood.colorTheme}-900/60 border-2 border-${mood.colorTheme}-500` 
          : `bg-${mood.colorTheme}-900/20 hover:bg-${mood.colorTheme}-900/40`
      } cursor-pointer transition-all duration-300`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <h3 className={`text-lg font-semibold mb-2 text-${mood.colorTheme}-400`}>
          {mood.mood} Mood
        </h3>
        
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">Genres:</div>
          <div className="flex flex-wrap gap-1">
            {mood.relatedGenres.map((genre, index) => (
              <span 
                key={index}
                className={`text-xs px-2 py-0.5 rounded-full bg-${mood.colorTheme}-900/60 text-${mood.colorTheme}-300`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="w-full bg-background-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-${mood.colorTheme}-500`} 
              style={{ width: `${mood.confidence * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-right">
            {Math.round(mood.confidence * 100)}% match
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCard;