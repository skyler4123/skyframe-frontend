'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

// Define types for better type safety
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Example 1: Basic GET request in a component with proper typing
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.avatar && <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />}
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}

// Example 2: POST request with form submission - properly typed
export function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post<ApiResponse<Post>>('/posts', {
        title,
        content,
      });
      
      console.log('Post created:', response.data);
      // Reset form
      setTitle('');
      setContent('');
      alert('Post created successfully!');
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={submitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {submitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}

// Example 3: Custom hook for API calls
export function useApiCall<T>(url: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(url);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Define types for better type safety
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

// Example 4: Using the custom hook with proper typing
export function PostsList() {
  const { data: posts, loading, error, refetch } = useApiCall<Post[]>('/posts');

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Posts</h1>
        <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Refresh
        </button>
      </div>
      <div className="space-y-4">
        {posts && Array.isArray(posts) ? posts.map((post: Post) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="font-bold">{post.title}</h2>
            <p>{post.content}</p>
          </div>
        )) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  );
}

// Example 5: Update/Delete operations
export function PostActions({ postId }: { postId: string }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updatePost = async () => {
    setUpdating(true);
    try {
      await api.put(`/posts/${postId}`, {
        title: 'Updated Title',
        content: 'Updated content',
      });
      alert('Post updated successfully!');
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeleting(true);
    try {
      await api.delete(`/posts/${postId}`);
      alert('Post deleted successfully!');
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-x-2">
      <button 
        onClick={updatePost} 
        disabled={updating}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        {updating ? 'Updating...' : 'Update'}
      </button>
      <button 
        onClick={deletePost} 
        disabled={deleting}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
