import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <Music className="h-20 w-20 text-primary-500 mb-6" />
      <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
      >
        <Home className="mr-2 h-5 w-5" />
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;