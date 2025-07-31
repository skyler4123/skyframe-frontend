'use client';

import { config } from '@/lib/config';

export function EnvironmentBanner() {
  // Don't show banner in production
  if (config.isProd) return null;
  
  const getBannerStyle = () => {
    if (config.isStaging) {
      return 'bg-yellow-600 border-yellow-700 text-yellow-100';
    }
    return 'bg-red-600 border-red-700 text-red-100';
  };
  
  const getEnvironmentIcon = () => {
    if (config.isStaging) return '🚧';
    return '🛠️';
  };
  
  return (
    <div className={`
      w-full text-center py-2 text-sm font-medium border-b-2
      ${getBannerStyle()}
    `}>
      {getEnvironmentIcon()} {config.env.toUpperCase()} Environment {getEnvironmentIcon()}
      <span className="ml-2 text-xs opacity-75">
        API: {config.apiUrl}
      </span>
    </div>
  );
}
