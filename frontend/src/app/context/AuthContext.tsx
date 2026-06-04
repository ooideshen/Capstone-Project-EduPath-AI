'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/app/utils/api';

interface User {
  id: number;
  username: string;
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setCookie = (name: string, value: string, expiresIn: number) => {
  const date = new Date();
  date.setTime(date.getTime() + expiresIn);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  setCookie(name, '', -1);
};

/**
 * Decode JWT token and extract expiration time
 * 
 * JWT Structure: header.payload.signature
 * Payload contains 'exp' claim (expiration timestamp in seconds)
 * 
 * @param token - JWT access token
 * @returns Expiration time in milliseconds, or null if invalid
 */
const getTokenExpiration = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload (second part)
    const decoded = JSON.parse(atob(parts[1]));

    // 'exp' is in seconds, convert to milliseconds
    if (!decoded.exp) {
      console.error('No expiration in token');
      return null;
    }

    return decoded.exp * 1000;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get all claims from JWT token (for debugging/learning)
 */
const getTokenClaims = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  let refreshTimeout: NodeJS.Timeout;

  // Load user from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = getCookie('accessToken');

      if (storedUser && accessToken) {
        try {
          setUser(JSON.parse(storedUser));

          // Schedule refresh based on token's actual expiration
          scheduleTokenRefresh(accessToken);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          logout();
        }
      }

      setIsLoading(false);
    };

    checkAuth();

    return () => {
      // Cleanup on unmount
      if (refreshTimeout) clearTimeout(refreshTimeout);
    };
  }, []);

  /**
   * Schedule token refresh based on token's expiration time
   * 
   * Algorithm:
   * 1. Read the 'exp' claim from the token
   * 2. Calculate how long until expiration
   * 3. Refresh at 80% of the token's lifetime
   * 
   * Example (with 30 second token):
   * - Token expires at: 30 seconds
   * - Refresh at 80%: 24 seconds
   * - So refresh happens 6 seconds before expiry
   * 
   * This works for ANY token duration!
   */
  const scheduleTokenRefresh = (accessToken: string) => {
    if (refreshTimeout) clearTimeout(refreshTimeout);

    // Read expiration time from token itself
    const expirationTime = getTokenExpiration(accessToken);

    if (!expirationTime) {
      console.error('❌ Cannot read token expiration');
      return;
    }

    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;

    // Refresh at 80% of token lifetime
    // This means: refresh when 20% of token life remains
    const refreshAt = Math.floor(timeUntilExpiry * 0.8);

    const currentTime = new Date(now).toLocaleTimeString();
    const expiryTime = new Date(expirationTime).toLocaleTimeString();
    const refreshTime = new Date(now + refreshAt).toLocaleTimeString();

    // Create countdown timeline
    const countdownTimeline = Array.from({ length: 10 }, (_, i) => {
      const percent = (i + 1) * 10;
      const msAtPercent = Math.floor(timeUntilExpiry * (percent / 100));
      const secAtPercent = (msAtPercent / 1000).toFixed(1);
      return `     ${percent}% → ${secAtPercent}s remaining`;
    }).join('\n  ');

    console.log(`
╔════════════════════════════════════════════════════════════╗
║ 🔐 TOKEN EXPIRATION SCHEDULE
╚════════════════════════════════════════════════════════════╝
  Current time:           ${currentTime}
  Token expires at:       ${expiryTime}
  Time until expiry:      ${timeUntilExpiry}ms (${(timeUntilExpiry / 1000).toFixed(1)}s)
  
  Refresh strategy:       At 80% of lifetime
  Will refresh in:        ${refreshAt}ms (${(refreshAt / 1000).toFixed(1)}s)
  Refresh time:           ${refreshTime}
  
  ⏰ Countdown Timeline:
  ${countdownTimeline}
╚════════════════════════════════════════════════════════════╝
    `);

    if (refreshAt > 0) {
      refreshTimeout = setTimeout(() => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║ 🔄 TOKEN REFRESH TRIGGERED
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  Reason: Token is 80% expired (20% life remaining)
  Status: Attempting to refresh with refresh token...
╚════════════════════════════════════════════════════════════╝
        `);
        refreshAccessToken();
      }, refreshAt);
    } else {
      console.warn('⚠️ Token expiration time is in the past');
    }
  };

  /**
   * Refresh access token using refresh token
   * 
   * This is called automatically by the scheduler
   */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = getCookie('refreshToken');

      if (!refreshToken) {
        console.error('❌ No refresh token available');
        logout();
        return;
      }

      console.log(`
╔════════════════════════════════════════════════════════════╗
║ 📡 REFRESH REQUEST
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  Endpoint: POST /api/auth/refresh
  Status: Sending refresh token to backend...
╚════════════════════════════════════════════════════════════╝
      `);

      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`
╔════════════════════════════════════════════════════════════╗
║ ❌ REFRESH FAILED
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  Error: ${data.message}
  Status: Logging out user...
╚════════════════════════════════════════════════════════════╝
        `);
        logout();
        return;
      }

      // Store new access token
      setCookie('accessToken', data.accessToken, data.expiresIn);

      // Get claims from new token for debugging
      const claims = getTokenClaims(data.accessToken);
      console.log(`
╔════════════════════════════════════════════════════════════╗
║ ✅ TOKEN REFRESH SUCCESSFUL
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  User ID: ${claims?.sub}
  Username: ${claims?.username}
  Email: ${claims?.email}
  
  New token valid for: ${data.expiresIn}ms (${(data.expiresIn / 1000).toFixed(1)}s)
  
  Status: Scheduling next refresh...
╚════════════════════════════════════════════════════════════╝
      `);

      // Schedule next refresh based on new token's expiration
      scheduleTokenRefresh(data.accessToken);
    } catch (error) {
      console.error(`
╔════════════════════════════════════════════════════════════╗
║ ❌ REFRESH ERROR
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  Error: ${error}
  Status: Logging out user...
╚════════════════════════════════════════════════════════════╝
      `);
      logout();
    }
  };

  /**
   * Login with username and password
   */
  const login = async (username: string, password: string) => {
    try {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║ 🔓 LOGIN ATTEMPT
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  Username: ${username}
  Status: Sending credentials to backend...
╚════════════════════════════════════════════════════════════╝
      `);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens in cookies
      setCookie('accessToken', data.token, data.expiresIn);
      setCookie('refreshToken', data.refreshToken, data.expiresIn * 7);

      // Store user info in localStorage (non-sensitive)
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        username: data.username,
        role: data.role
      }));

      setUser({
        id: data.userId,
        username: data.username,
      });

      // Get claims from token for debugging
      const claims = getTokenClaims(data.token);
      console.log(`
╔════════════════════════════════════════════════════════════╗
║ ✅ LOGIN SUCCESSFUL
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  
  👤 User Details:
  - User ID: ${claims?.sub}
  - Username: ${claims?.username}
  - Email: ${claims?.email}
  
  🎫 Token Details:
  - Access token valid for: ${data.expiresIn}ms (${(data.expiresIn / 1000).toFixed(1)}s)
  - Refresh token valid for: ${data.expiresIn * 7}ms (${(data.expiresIn * 7 / 1000).toFixed(1)}s)
  
  Status: Scheduling token refresh...
╚════════════════════════════════════════════════════════════╝
      `);

      // Schedule token refresh based on token's expiration
      scheduleTokenRefresh(data.token);

      setTimeout(() => {
        const role = data.role?.toLowerCase();
        if (role === 'admin') {
          router.push('/admin/overview');
        } else if (role === 'student') {
          router.push('/student/overview');
        } else if (role === 'counselor') {
          router.push('/counselor/overview');
        } else {
          router.push('/');
        }
      }, 3000);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    if (refreshTimeout) clearTimeout(refreshTimeout);

    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    console.log(`
╔════════════════════════════════════════════════════════════╗
║ 🚪 USER LOGGED OUT
╚════════════════════════════════════════════════════════════╝
  Time: ${new Date().toLocaleTimeString()}
  Status: All tokens cleared, redirecting to login...
╚════════════════════════════════════════════════════════════╝
    `);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};