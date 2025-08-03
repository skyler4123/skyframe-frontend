import { useEffect, useRef, useCallback } from 'react';
import { debug } from '@/lib/debugger';
import { config } from '@/lib/config';

// Rails-style debugging hooks for React components

export function useDebugger(value: any, label?: string) {
  const prevValue = useRef(value);
  
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    if (prevValue.current !== value) {
      console.log(`🔄 ${label || 'Value'} changed:`, {
        from: prevValue.current,
        to: value,
        type: typeof value
      });
      prevValue.current = value;
    }
  }, [value, label]);
  
  return value;
}

export function useRenderCount(componentName?: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    renderCount.current++;
    console.log(`🔢 ${componentName || 'Component'} render #${renderCount.current}`);
  });
  
  return renderCount.current;
}

export function useBreakpoint(condition: boolean, data?: any, message?: string) {
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    if (condition) {
      debug.breakpoint(data, message);
    }
  }, [condition, data, message]);
}

export function useApiDebug() {
  const logRequest = useCallback((url: string, options?: RequestInit) => {
    debug.api.request(url, options);
  }, []);
  
  const logResponse = useCallback((url: string, response: any, data?: any) => {
    debug.api.response(url, response, data);
  }, []);
  
  return { logRequest, logResponse };
}

export function useComponentDebug(componentName: string, props?: any) {
  const renderCount = useRenderCount(componentName);
  
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    debug.render(componentName, props);
  }, [componentName, props]);
  
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    return () => {
      console.log(`🗑️ ${componentName} unmounted after ${renderCount} renders`);
    };
  }, [componentName, renderCount]);
  
  return {
    renderCount,
    inspect: (data: any, label?: string) => debug.inspect(data, `${componentName}: ${label}`),
    breakpoint: (condition: boolean, data?: any) => {
      if (condition) debug.breakpoint(data, `${componentName} breakpoint`);
    }
  };
}

export function useDebugEffect(callback: () => void, deps: any[], label?: string) {
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    console.log(`⚡ Effect triggered: ${label || 'useDebugEffect'}`, deps);
    callback();
  }, deps);
}

// Performance debugging hook
export function usePerformanceDebug(componentName: string) {
  const startTime = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    startTime.current = performance.now();
    
    return () => {
      if (startTime.current) {
        const renderTime = performance.now() - startTime.current;
        console.log(`⏱️ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}

// Debug form state changes
export function useFormDebug<T>(formState: T, formName?: string) {
  const prevState = useRef<T>(formState);
  
  useEffect(() => {
    if (!config.features.debugMode) return;
    
    const changes: Record<string, { from: any; to: any }> = {};
    
    if (typeof formState === 'object' && formState !== null && typeof prevState.current === 'object' && prevState.current !== null) {
      Object.keys(formState as Record<string, any>).forEach(key => {
        const currentValue = (formState as Record<string, any>)[key];
        const prevValue = (prevState.current as Record<string, any>)[key];
        
        if (currentValue !== prevValue) {
          changes[key] = { from: prevValue, to: currentValue };
        }
      });
      
      if (Object.keys(changes).length > 0) {
        console.group(`📝 Form changes: ${formName || 'Form'}`);
        console.table(changes);
        console.groupEnd();
      }
    }
    
    prevState.current = formState;
  }, [formState, formName]);
}

export default {
  useDebugger,
  useRenderCount,
  useBreakpoint,
  useApiDebug,
  useComponentDebug,
  useDebugEffect,
  usePerformanceDebug,
  useFormDebug
};
