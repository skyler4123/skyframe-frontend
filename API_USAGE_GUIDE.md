# API Usage Guide

Your API client in `/lib/api.ts` automatically handles token management and redirects. Here's how to use it:

## Basic Usage Examples

### 1. Simple GET Request
```typescript
import api from '@/lib/api';

// In a component or function
const fetchUserData = async () => {
  try {
    const response = await api.get('/users/me');
    console.log('User data:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. POST Request (Create data)
```typescript
const createPost = async (postData: any) => {
  try {
    const response = await api.post('/posts', {
      title: 'My Post',
      content: 'Post content here'
    });
    console.log('Created post:', response.data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
};
```

### 3. PUT Request (Update data)
```typescript
const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    console.log('Updated user:', response.data);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
```

### 4. DELETE Request
```typescript
const deletePost = async (postId: string) => {
  try {
    await api.delete(`/posts/${postId}`);
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};
```

## React Component Examples

### Login Component
```typescript
'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error: any) {
      alert('Login failed: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Data Fetching Component
```typescript
'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Custom Hook for API Calls
```typescript
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url);
        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage:
// const { data: posts, loading, error } = useApi('/posts');
```

## How Token Expiry is Handled

Your API client automatically:

1. **Adds token to requests**: Gets token from `localStorage.getItem('token')`
2. **Detects 401 errors**: When server returns 401 (unauthorized)
3. **Clears invalid token**: Removes token from localStorage
4. **Redirects to login**: Automatically redirects to `/sign_in`

## Setting Up Authentication

### After successful login:
```typescript
// Store the token
localStorage.setItem('token', responseData.token);
```

### To logout:
```typescript
// Clear token and redirect
localStorage.removeItem('token');
window.location.href = '/sign_in';
```

## Error Handling

The interceptor handles token expiry automatically, but you can also handle other errors:

```typescript
try {
  const response = await api.get('/some-endpoint');
  // Handle success
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Resource not found');
  } else if (error.response?.status === 500) {
    console.log('Server error');
  } else {
    console.log('Other error:', error.message);
  }
}
```

The 401 errors are handled automatically by redirecting to `/sign_in`, so you don't need to handle them manually in your components.
