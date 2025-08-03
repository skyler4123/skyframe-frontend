# Next.js Debugging Guide - Rails-style Debugger Alternatives

## 🔍 Rails `debugger` vs Next.js Debugging

### Rails Debugger:
```ruby
# In Rails
def some_method
  debugger  # Stops execution, opens interactive console
  # ... rest of code
end
```

### Next.js Equivalents:

## 1. 🟢 **Node.js Built-in Debugger**

### **Server-Side Debugging (API Routes/Server Components):**

```typescript
// app/api/debug/route.ts
export async function GET() {
  const data = { user: 'john', age: 30 };
  
  // Rails-style debugger equivalent
  debugger; // Stops execution when DevTools is open
  
  // Alternative: console-based debugging
  console.log('Debug point reached');
  console.table(data);
  
  return Response.json(data);
}
```

### **How to use:**
```bash
# Start with debugging enabled
node --inspect-brk=0.0.0.0:9229 node_modules/.bin/next dev

# Or add to package.json:
"dev:debug": "node --inspect node_modules/.bin/next dev"
```

## 2. 🔧 **VS Code Integrated Debugger**

### **Setup `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 3. 🚀 **Interactive Debugging with `console` Methods**

### **Advanced Console Debugging:**
```typescript
// lib/debugger.ts
export const debug = {
  // Rails-style inspect
  inspect: (obj: any, label?: string) => {
    console.group(`🔍 ${label || 'Debug'}`);
    console.log('Type:', typeof obj);
    console.log('Value:', obj);
    console.table(obj);
    console.trace('Call stack');
    console.groupEnd();
  },
  
  // Conditional debugging
  when: (condition: boolean, ...args: any[]) => {
    if (condition) {
      console.log('🐛 Debug condition met:', ...args);
    }
  },
  
  // Performance debugging
  time: (label: string) => console.time(label),
  timeEnd: (label: string) => console.timeEnd(label),
  
  // Break point simulation
  breakpoint: (data?: any) => {
    console.log('🛑 Breakpoint reached');
    if (data) console.log('Data:', data);
    // Use browser's debugger statement
    debugger;
  }
};
```

## 4. 🎯 **Interactive REPL (Rails console equivalent)**

### **Custom Debug Console:**
```typescript
// lib/repl.ts
export class DebugConsole {
  private static instance: DebugConsole;
  private history: any[] = [];
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new DebugConsole();
    }
    return this.instance;
  }
  
  // Rails-style inspect
  inspect(obj: any) {
    this.history.push(obj);
    console.log('Inspecting:', obj);
    return obj;
  }
  
  // Rails-style rails console commands
  reload() {
    console.log('♻️ Reloading...');
    window.location.reload();
  }
  
  // Show history
  history_log() {
    console.log('📜 Debug History:', this.history);
  }
  
  // Clear history
  clear() {
    this.history = [];
    console.clear();
  }
}

// Global access (like Rails console)
if (typeof window !== 'undefined') {
  (window as any).dc = DebugConsole.getInstance();
}
```

## 5. 🔥 **Hot Debugging with React Dev Tools**

### **Custom Debug Hooks:**
```typescript
// hooks/useDebugger.ts
import { useEffect, useRef } from 'react';

export function useDebugger(value: any, label?: string) {
  const prevValue = useRef(value);
  
  useEffect(() => {
    if (prevValue.current !== value) {
      console.log(`🔄 ${label || 'Value'} changed:`, {
        from: prevValue.current,
        to: value
      });
      prevValue.current = value;
    }
  }, [value, label]);
}

export function useRenderCount(label?: string) {
  const renderCount = useRef(0);
  renderCount.current++;
  
  console.log(`🔢 ${label || 'Component'} render count:`, renderCount.current);
}

export function useBreakpoint(condition: boolean, data?: any) {
  useEffect(() => {
    if (condition) {
      console.log('🛑 Breakpoint triggered');
      if (data) console.log('Data:', data);
      debugger;
    }
  }, [condition, data]);
}
```

## 6. 🌐 **Browser-based Interactive Debugging**

### **Chrome DevTools Integration:**
```typescript
// lib/chrome-debugger.ts
export const chromeDebug = {
  // Step-by-step debugging
  step: (message: string, data?: any) => {
    console.group(`👣 Step: ${message}`);
    if (data) console.log('Data:', data);
    console.trace();
    console.groupEnd();
    
    // Pause execution
    debugger;
  },
  
  // Conditional breakpoints
  breakIf: (condition: boolean, message?: string) => {
    if (condition) {
      console.log(`🛑 Conditional break: ${message || 'Condition met'}`);
      debugger;
    }
  },
  
  // Memory usage
  memory: () => {
    if ('memory' in performance) {
      console.log('💾 Memory:', (performance as any).memory);
    }
  }
};
```

## 7. 🎨 **Visual Debugging Component**

### **Debug Panel (like Rails debug bar):**
```typescript
// components/DebugPanel.tsx
'use client';

import { useState } from 'react';

export function DebugPanel({ data }: { data?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inspect');
  
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        🐛 Debug
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border shadow-xl rounded-lg w-96 max-h-96 overflow-auto">
          <div className="border-b">
            <div className="flex">
              {['inspect', 'console', 'network'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm ${
                    activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            {activeTab === 'inspect' && (
              <pre className="text-xs overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
            
            {activeTab === 'console' && (
              <div>
                <button
                  onClick={() => console.log('Debug data:', data)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                >
                  Log Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 8. 📊 **Package.json Debug Scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:debug": "node --inspect node_modules/.bin/next dev",
    "dev:debug-brk": "node --inspect-brk node_modules/.bin/next dev",
    "debug:client": "next dev --experimental-debug",
    "debug:server": "NODE_OPTIONS='--inspect' next dev"
  }
}
```

## 9. 🔧 **Usage Examples**

### **In API Routes:**
```typescript
import { debug } from '@/lib/debugger';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Rails-style debugging
  debug.inspect(data, 'Incoming request');
  debug.breakpoint(data);
  
  return Response.json({ success: true });
}
```

### **In Components:**
```typescript
import { useDebugger, useBreakpoint } from '@/hooks/useDebugger';

export function MyComponent({ user }) {
  // Debug value changes
  useDebugger(user, 'User prop');
  
  // Conditional breakpoint
  useBreakpoint(user?.id === 123, { user });
  
  return <div>...</div>;
}
```

### **Global Debug Access:**
```typescript
// In browser console (like Rails console):
dc.inspect(someObject);
dc.history_log();
dc.reload();
```

## 🎯 **Best Practices**

1. **Development Only**: Always wrap debug code in environment checks
2. **Performance**: Remove debug statements in production builds
3. **Security**: Never expose sensitive data in debug output
4. **Chrome DevTools**: Use Sources tab for breakpoints
5. **Network Tab**: Debug API calls and responses

Your `EnvironmentDebugger` component is already a great start! These additional tools give you Rails-like debugging capabilities in Next.js.
