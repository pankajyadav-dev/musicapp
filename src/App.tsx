import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/layout/Sidebar';
import Player from './components/player/Player';
import { MusicProvider } from './context/MusicContext';
import { MoodProvider } from './context/MoodContext';
import './App.css';

function App() {
  return (
    <MoodProvider>
      <MusicProvider>
        <Router>
          <div className="flex flex-col h-screen bg-gradient-to-b from-background-900 to-background-800 text-white">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <AppRoutes />
              </main>
            </div>
            <Player />
          </div>
        </Router>
      </MusicProvider>
    </MoodProvider>
  );
}

export default App;