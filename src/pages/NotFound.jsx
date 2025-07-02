import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
          
          <div className="flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Go back
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 If you reached this page by refreshing the browser, this might be a routing issue. 
            Try navigating using the menu instead.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
