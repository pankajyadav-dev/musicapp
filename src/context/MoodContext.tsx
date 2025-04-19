import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectMood, getRandomMood, MoodAnalysisResult } from '../api/moodApi';

interface MoodContextType {
  currentMood: MoodAnalysisResult | null;
  loading: boolean;
  error: string | null;
  analyzeMood: (text: string) => Promise<void>;
  setRandomMood: () => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Set a random mood on initial load for demo purposes
  useEffect(() => {
    setRandomMood();
  }, []);

  const analyzeMood = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await detectMood(text);
      setCurrentMood(result);
    } catch (err) {
      setError('Failed to analyze mood. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setRandomMood = () => {
    setCurrentMood(getRandomMood());
  };

  return (
    <MoodContext.Provider value={{ currentMood, loading, error, analyzeMood, setRandomMood }}>
      {children}
    </MoodContext.Provider>
  );
};