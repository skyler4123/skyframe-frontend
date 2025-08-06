'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useComponentDebug, useFormDebug } from "@/hooks/useDebugger";
import debug from "@/lib/debugger";
import { DebugPanel } from "@/components/DebugPanel";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Rails-style debugging
  const debugTools = useComponentDebug('SignIn', { formData, loading, error });
  useFormDebug(formData, 'SignIn Form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Debug form changes
    debug.inspect({ field: name, oldValue: formData[name as keyof typeof formData], newValue }, 'Form Change');
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug breakpoint - like Rails debugger
    debug.breakpoint(formData, 'Form submission started');
    
    setLoading(true);
    setError('');

    // Performance timing
    debug.time('Login Request');

    try {
      debug.api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      debug.api.response('/auth/login', response, response.data);
      debug.timeEnd('Login Request');

      // Store token
      localStorage.setItem('token', response.data.token);
      
      debug.inspect({ success: true, token: response.data.token }, 'Login Success');
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      debug.timeEnd('Login Request');
      debug.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Rails-style Debug Panel */}
      <DebugPanel data={{ formData, loading, error, renderCount: debugTools.renderCount }} />
      
      {/* component */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-black"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-black"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? 
            <a href="/sign-up" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
