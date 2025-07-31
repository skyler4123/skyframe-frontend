// Example: Server-side API calls in Next.js
// File: app/dashboard/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';

// Server-side API client (without interceptors since we're on server)
const serverApi = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Function to get user data on server-side
async function getUserData(token: string) {
  try {
    const response = await serverApi.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token expired on server-side, redirect to login
      redirect('/sign_in');
    }
    throw error;
  }
}

// Server Component
export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/sign_in');
  }

  try {
    const userData = await getUserData(token);
    
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {userData.name}!</p>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load user data</p>
      </div>
    );
  }
}

// Example: API Route Handler
// File: app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    // Forward request to your backend API
    const response = await axios.get(`${process.env.API_URL}/protected-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example: Middleware for protecting routes
// File: middleware.ts
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
