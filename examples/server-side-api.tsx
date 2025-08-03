// Example: Server-side API calls in Next.js
// File: app/dashboard/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Server-side API client using fetch
async function serverApiCall(endpoint: string, token?: string, options: RequestInit = {}) {
  const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      redirect('/sign_in');
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Function to get user data on server-side
async function getUserData(token: string) {
  try {
    const data = await serverApiCall('/user/profile', token);
    return data;
  } catch (error: any) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// Server Component
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/sign_in');
  }

  try {
    const userData = await getUserData(token);
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-lg mb-4">Welcome, {userData.name}!</p>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">User Data:</h3>
            <pre className="text-sm overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-800 mb-2">Error</h1>
          <p className="text-red-600">Failed to load user data. Please try again.</p>
        </div>
      </div>
    );
  }
}

// Example: API Route Handler
// File: app/api/protected/route.ts

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return Response.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    // Forward request to your backend API using fetch
    const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/protected-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return Response.json({ error: 'Token expired' }, { status: 401 });
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example: Middleware for protecting routes
// File: middleware.ts
/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/sign_in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
*/

// Note: Create this as a separate middleware.ts file in your project root
