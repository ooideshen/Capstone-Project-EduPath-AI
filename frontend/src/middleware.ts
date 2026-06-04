// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/utils/api';

/**
 * Simplified middleware: checks cookie existence + decodes JWT payload (without
 * cryptographic verification) for RBAC routing.  Full token validation is
 * performed server-side by the Spring Boot backend on every API call.
 *
 * Why no crypto verification here?
 *  - The JWT secret lives only on the backend (Render).  Exposing it via
 *    NEXT_PUBLIC_* would leak it to the browser.
 *  - The middleware's job is UX route-guarding, not security enforcement.
 */

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  const exp = payload.exp as number | undefined;
  if (!exp) return true;
  // exp is in seconds, Date.now() in ms
  return Date.now() >= exp * 1000;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/', '/login', '/signup', '/forgot-password'];
  const isPublicPage = publicRoutes.includes(pathname);

  let payload: Record<string, unknown> | null = null;
  let isTokenValid = false;

  if (token) {
    payload = decodeTokenPayload(token);
    if (payload && !isTokenExpired(payload)) {
      isTokenValid = true;
    }
  }

  // --- 1. IF TOKEN IS VALID, ENFORCE RBAC DIRECTLY ---
  if (isTokenValid && payload) {
    const role = ((payload.role as string) || '').toLowerCase();

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
      const newPayload = decodeTokenPayload(data.accessToken);
      if (newPayload) {
        newRole = ((newPayload.role as string) || '').toLowerCase();
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
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
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
