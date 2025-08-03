// Environment configuration helper
export const config = {
  // Environment info
  env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  nodeEnv: process.env.NODE_ENV,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Environment flags
  isDev: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isStaging: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  isProd: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  
  // Feature flags based on environment
  features: {
    // Analytics only in production
    analytics: process.env.NEXT_PUBLIC_APP_ENV === 'production',
    
    // Debug mode in development
    debugMode: process.env.NEXT_PUBLIC_APP_ENV === 'development',
    
    // Beta features in staging
    betaFeatures: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
    
    // Logging levels
    verboseLogging: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
  },
  
  // External services
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
};

// Helper functions
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

// Logging helper
export const logger = {
  debug: (...args: any[]) => {
    if (config.features.debugMode) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (config.features.verboseLogging) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

// Export environment info for debugging
if (config.features.debugMode) {
  logger.debug('Environment Config:', {
    env: config.env,
    nodeEnv: config.nodeEnv,
    apiUrl: config.apiUrl,
    appUrl: config.appUrl,
    features: config.features,
    isClient,
    isServer,
  });
  
  // Show what process.env variables are available
  logger.debug('Available NEXT_PUBLIC_ vars:', 
    Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .reduce((acc, key) => ({ ...acc, [key]: process.env[key] }), {})
  );
}
