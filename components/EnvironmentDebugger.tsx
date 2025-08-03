'use client';

import { useEffect, useState } from 'react';
import { config, logger } from '@/lib/config';

export function EnvironmentDebugger() {
  const [clientVars, setClientVars] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // This runs on the client side
    const clientEnvVars = {
      // These work on client (NEXT_PUBLIC_ prefix)
      'NEXT_PUBLIC_APP_ENV': process.env.NEXT_PUBLIC_APP_ENV,
      'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
      'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
      
      // These will be undefined on client (no NEXT_PUBLIC_ prefix)
      'NODE_ENV': process.env.NODE_ENV,
      'DATABASE_URL': process.env.DATABASE_URL,
      'JWT_SECRET': process.env.JWT_SECRET,
      
      // Process info (limited on client)
      'process.platform': typeof process !== 'undefined' ? process.platform : 'undefined',
      'process.version': typeof process !== 'undefined' ? process.version : 'undefined',
      'typeof window': typeof window,
      'typeof document': typeof document,
    };

    setClientVars(clientEnvVars);
    logger.debug('Client-side environment check:', clientEnvVars);
  }, []);

  if (!config.features.debugMode) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 m-4">
        <p className="text-yellow-800">
          Environment debugger only shows in development mode.
        </p>
      </div>
    );
  }

  // If closed, show a small toggle button
  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          title="Show Environment Debug Info"
        >
          🔍
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 m-4 relative">
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-1"
        title="Close Environment Debug Info"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
      
      <h2 className="text-xl font-bold mb-4">🔍 Environment Debug Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Config Object */}
        <div>
          <h3 className="font-semibold mb-2">📋 Config Object:</h3>
          <pre className="bg-white p-3 rounded border text-sm overflow-auto">
{JSON.stringify(config, null, 2)}
          </pre>
        </div>

        {/* Client Environment Variables */}
        <div>
          <h3 className="font-semibold mb-2">🌐 Client-Side process.env:</h3>
          <div className="bg-white p-3 rounded border">
            {Object.entries(clientVars).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-mono text-sm">
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {key}:
                  </span>
                  <span className="ml-2">
                    {value || 'undefined'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environment Explanation */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 How it works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Green values:</strong> Available on client (NEXT_PUBLIC_ prefix)</li>
          <li>• <strong>Red values:</strong> Server-only or not set</li>
          <li>• <strong>process.env:</strong> Node.js environment variables</li>
          <li>• <strong>Build-time:</strong> NEXT_PUBLIC_ vars replaced during build</li>
          <li>• <strong>Runtime:</strong> Server vars only available in API routes/server components</li>
        </ul>
      </div>

      {/* Current Environment */}
      <div className="mt-4 p-4 bg-white border rounded">
        <h3 className="font-semibold mb-2">📍 Current Environment:</h3>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded text-sm font-medium ${
            config.isDev ? 'bg-red-100 text-red-800' :
            config.isStaging ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {config.env.toUpperCase()}
          </span>
          <span className="text-sm text-gray-600">
            Node.js: {process.version || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
}
