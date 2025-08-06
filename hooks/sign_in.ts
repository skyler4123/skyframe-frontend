import axios from "axios";
import { useState } from "react";

export const useSignIn = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signIn = async (email: string, password: string) => {
    const signInUrl = '/auth/login';
    
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const response = await axios.post(signInUrl, { email, password });
      setData(response.data);
      localStorage.setItem('token', response.data.token);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { signIn, data, loading, error };
};