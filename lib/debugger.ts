// Rails-style debugger utilities for Next.js
import { config } from './config';

export const debug = {
  // Rails-style inspect
  inspect: (obj: any, label?: string) => {
    if (!config.features.debugMode) return obj;
    
    console.group(`🔍 ${label || 'Debug Inspect'}`);
    console.log('Type:', typeof obj);
    console.log('Constructor:', obj?.constructor?.name);
    console.log('Value:', obj);
    
    // Table view for objects/arrays
    if (typeof obj === 'object' && obj !== null) {
      console.table(obj);
    }
    
    console.trace('Call stack');
    console.groupEnd();
    
    return obj; // Return for chaining
  },

  // Conditional debugging (like Rails debug if condition)
  when: (condition: boolean, ...args: any[]) => {
    if (!config.features.debugMode) return;
    
    if (condition) {
      console.log('🐛 Debug condition met:', ...args);
      debugger;
    }
  },

  // Performance timing (like Rails benchmark)
  time: (label: string) => {
    if (!config.features.debugMode) return;
    console.time(`⏱️ ${label}`);
  },

  timeEnd: (label: string) => {
    if (!config.features.debugMode) return;
    console.timeEnd(`⏱️ ${label}`);
  },

  // Break point with context (like Rails debugger)
  breakpoint: (data?: any, message?: string) => {
    if (!config.features.debugMode) return;
    
    console.log(`🛑 Breakpoint: ${message || 'Execution paused'}`);
    if (data) {
      console.log('Context data:', data);
    }
    console.trace('Stack trace');
    
    // Pause execution (like Rails debugger)
    debugger;
  },

  // Log with different levels
  info: (...args: any[]) => {
    if (!config.features.verboseLogging) return;
    console.info('ℹ️', ...args);
  },

  warn: (...args: any[]) => {
    console.warn('⚠️', ...args);
  },

  error: (...args: any[]) => {
    console.error('❌', ...args);
  },

  // API call debugging
  api: {
    request: (url: string, options?: RequestInit) => {
      if (!config.features.debugMode) return;
      
      console.group(`🌐 API Request: ${url}`);
      console.log('Method:', options?.method || 'GET');
      console.log('Headers:', options?.headers);
      if (options?.body) {
        console.log('Body:', options.body);
      }
      console.groupEnd();
    },

    response: (url: string, response: any, data?: any) => {
      if (!config.features.debugMode) return;
      
      console.group(`📡 API Response: ${url}`);
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      if (data) {
        console.log('Data:', data);
      }
      console.groupEnd();
    }
  },

  // Component rendering debug
  render: (componentName: string, props?: any) => {
    if (!config.features.debugMode) return;
    
    console.log(`🎨 Rendering: ${componentName}`, props ? { props } : '');
  },

  // Memory usage (Chrome only)
  memory: () => {
    if (!config.features.debugMode) return;
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.table({
        'Used Heap': `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        'Total Heap': `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        'Heap Limit': `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      });
    } else {
      console.log('Memory info not available');
    }
  }
};

// Rails-style console for browser (like rails console)
export class DebugConsole {
  private static instance: DebugConsole;
  private history: any[] = [];

  static getInstance() {
    if (!this.instance) {
      this.instance = new DebugConsole();
    }
    return this.instance;
  }

  // Rails-style methods
  inspect(obj: any) {
    this.history.push(obj);
    return debug.inspect(obj);
  }

  reload() {
    if (typeof window !== 'undefined') {
      console.log('♻️ Reloading application...');
      window.location.reload();
    }
  }

  clear() {
    this.history = [];
    console.clear();
    console.log('🧹 Debug console cleared');
  }

  history_log() {
    console.log('📜 Debug History:', this.history);
    return this.history;
  }

  // Show current environment
  env() {
    console.table({
      'Environment': config.env,
      'API URL': config.apiUrl,
      'Debug Mode': config.features.debugMode,
      'Verbose Logging': config.features.verboseLogging
    });
  }

  // Help command
  help() {
    console.log(`
🔧 Debug Console Commands:
  dc.inspect(obj)     - Inspect an object (like Rails inspect)
  dc.reload()         - Reload the page
  dc.clear()          - Clear console and history
  dc.history_log()    - Show debug history
  dc.env()            - Show environment info
  dc.help()           - Show this help
  
🐛 Debug Methods:
  debug.inspect(obj, label)
  debug.when(condition, data)
  debug.breakpoint(data, message)
  debug.time(label) / debug.timeEnd(label)
  debug.api.request(url, options)
  debug.memory()
    `);
  }
}

// Make debug console globally available (like Rails console)
if (typeof window !== 'undefined' && config.features.debugMode) {
  (window as any).dc = DebugConsole.getInstance();
  (window as any).debug = debug;
  
  console.log('🔧 Debug console available! Type "dc.help()" for commands');
}

export default debug;
