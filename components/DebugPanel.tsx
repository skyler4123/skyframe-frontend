'use client';

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';
import debug from '@/lib/debugger';

interface DebugPanelProps {
  data?: any;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function DebugPanel({ data, position = 'bottom-right' }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inspect');
  const [logs, setLogs] = useState<any[]>([]);

  // Don't show in production
  if (!config.features.debugMode) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const panelPositionClasses = {
    'bottom-right': 'bottom-12 right-0',
    'bottom-left': 'bottom-12 left-0',
    'top-right': 'top-12 right-0',
    'top-left': 'top-12 left-0'
  };

  useEffect(() => {
    // Intercept console logs for debug panel
    const originalLog = console.log;
    console.log = (...args) => {
      setLogs(prev => [...prev.slice(-50), { type: 'log', args, time: new Date() }]);
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const clearLogs = () => setLogs([]);

  const executeCommand = (command: string) => {
    try {
      // Simple command execution
      if (command === 'dc.env()') {
        debug.inspect(config, 'Environment Config');
      } else if (command === 'dc.memory()') {
        debug.memory();
      } else if (command === 'dc.clear()') {
        clearLogs();
        console.clear();
      } else {
        // Try to evaluate the command
        const result = eval(command);
        console.log('Command result:', result);
      }
    } catch (error) {
      console.error('Command error:', error);
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg font-mono text-sm flex items-center gap-2"
        title="Open Debug Panel (Rails-style debugger)"
      >
        🐛 Debug
        {logs.length > 0 && (
          <span className="bg-red-800 text-xs px-2 py-1 rounded-full">
            {logs.length}
          </span>
        )}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className={`absolute ${panelPositionClasses[position]} bg-white border shadow-2xl rounded-lg w-96 max-h-96 overflow-hidden`}>
          {/* Header */}
          <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
            <h3 className="font-bold text-sm">Rails-style Debugger</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              {[
                { id: 'inspect', label: '🔍 Inspect', title: 'Inspect data' },
                { id: 'console', label: '💻 Console', title: 'Console logs' },
                { id: 'commands', label: '⚡ Commands', title: 'Debug commands' },
                { id: 'env', label: '🌍 Env', title: 'Environment' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.title}
                  className={`px-3 py-2 text-xs font-medium ${
                    activeTab === tab.id 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-3 max-h-64 overflow-auto">
            {/* Inspect Tab */}
            {activeTab === 'inspect' && (
              <div>
                <div className="mb-2">
                  <button
                    onClick={() => debug.inspect(data, 'Panel Data')}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-2"
                  >
                    Inspect Data
                  </button>
                  <button
                    onClick={() => debug.memory()}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Memory Info
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {data ? JSON.stringify(data, null, 2) : 'No data provided'}
                </pre>
              </div>
            )}

            {/* Console Tab */}
            {activeTab === 'console' && (
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-xs text-gray-600">Console Logs</span>
                  <button
                    onClick={clearLogs}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono bg-gray-100 p-1 rounded">
                      <span className="text-gray-500">
                        {log.time.toLocaleTimeString()}
                      </span>
                      <span className="ml-2">
                        {log.args.map((arg: any) => 
                          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                        ).join(' ')}
                      </span>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-xs text-gray-500">No logs yet</div>
                  )}
                </div>
              </div>
            )}

            {/* Commands Tab */}
            {activeTab === 'commands' && (
              <div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 mb-2">Quick Commands:</div>
                  {[
                    { cmd: 'dc.env()', desc: 'Show environment' },
                    { cmd: 'dc.memory()', desc: 'Memory usage' },
                    { cmd: 'dc.clear()', desc: 'Clear console' },
                    { cmd: 'dc.help()', desc: 'Show help' }
                  ].map((command) => (
                    <button
                      key={command.cmd}
                      onClick={() => executeCommand(command.cmd)}
                      className="block w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded text-xs"
                    >
                      <code className="text-blue-600">{command.cmd}</code>
                      <div className="text-gray-600">{command.desc}</div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-1">Custom Command:</div>
                  <input
                    type="text"
                    placeholder="Enter debug command..."
                    className="w-full text-xs border rounded px-2 py-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        executeCommand((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Environment Tab */}
            {activeTab === 'env' && (
              <div>
                <div className="space-y-2 text-xs">
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>Environment:</strong> {config.env}
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>API URL:</strong> {config.apiUrl}
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>Debug Mode:</strong> {config.features.debugMode ? '✅' : '❌'}
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>Verbose Logging:</strong> {config.features.verboseLogging ? '✅' : '❌'}
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>Node Version:</strong> {process.version || 'Unknown'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-3 py-2 border-t">
            <div className="text-xs text-gray-600">
              💡 Open browser console for more debug tools
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
