// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { API_URL } from '@/app/utils/api';

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "0edddeea31fc1daebc1a6814311a5c2a9bc6e860b7e6a8d79428d0e98d055306");

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/', '/login', '/signup', '/forgot-password'];
  const isPublicPage = publicRoutes.includes(pathname);

  let isTokenValid = false;
  let decodedPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      isTokenValid = true;
      decodedPayload = payload;
    } catch {
      isTokenValid = false;
    }
  }

  // --- 1. IF TOKEN IS VALID, ENFORCE RBAC DIRECTLY ---
  if (isTokenValid && decodedPayload) {
    const role = (decodedPayload.role || '').toLowerCase();
    
    // If they have a role, redirect away from public pages
    if (isPublicPage && role) {
      return NextResponse.redirect(new URL(`/${role}/overview`, request.url));
    }
    
    // If they have a token but NO role, let them stay on public pages (like /login)
    // to prevent infinite loops. If they are on a protected page, force them to login.
    if (!role) {
       if (isPublicPage) return NextResponse.next();
       return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/${role}/overview`, request.url));
    }
    if (pathname.startsWith('/counselor') && role !== 'counselor') {
      return NextResponse.redirect(new URL(`/${role}/overview`, request.url));
    }
    if (pathname.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL(`/${role}/overview`, request.url));
    }

    return NextResponse.next();
  }

  // --- 2. ALLOW PUBLIC PAGES ---
  if (isPublicPage) {
    return NextResponse.next();
  }

  // --- 3. NO TOKEN AT ALL => LOGIN ---
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // --- 4. TOKEN EXPIRED => REFRESH & ENFORCE RBAC ---
  if (!isTokenValid) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const data = await refreshResponse.json();
      
      // Parse new token to get role
      let newRole = '';
      try {
        const payloadStr = atob(data.accessToken.split('.')[1]);
        const responsePayload = JSON.parse(payloadStr);
        newRole = (responsePayload.role || '').toLowerCase();
      } catch (e) {
        console.error('Failed to parse refreshed token', e);
      }

      const fallbackUrl = newRole ? `/${newRole}/overview` : '/login';
      let redirectUrl = null;

      if (pathname.startsWith('/admin') && newRole !== 'admin') {
        redirectUrl = new URL(fallbackUrl, request.url);
      } else if (pathname.startsWith('/counselor') && newRole !== 'counselor') {
        redirectUrl = new URL(fallbackUrl, request.url);
      } else if (pathname.startsWith('/student') && newRole !== 'student') {
        redirectUrl = new URL(fallbackUrl, request.url);
      }

      const response = redirectUrl ? NextResponse.redirect(redirectUrl) : NextResponse.next();
      
      response.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: data.expiresIn / 1000,
      });

      return response;
    } catch (refreshError) {
      console.error('Refresh failed:', refreshError);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};