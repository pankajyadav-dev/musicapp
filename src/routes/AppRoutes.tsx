import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MoodAnalyzer from '../pages/MoodAnalyzer';
import Explore from '../pages/Explore';
import AlbumDetails from '../pages/AlbumDetails';
import Library from '../pages/Library';
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mood" element={<MoodAnalyzer />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/album/:id" element={<AlbumDetails />} />
      <Route path="/library" element={<Library />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;