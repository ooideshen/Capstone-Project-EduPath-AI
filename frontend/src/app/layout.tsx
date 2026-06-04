'use client'; 

import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from '@/app/context/AuthContext';
import { createTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0062FE' },
    secondary: { main: '#1A1A1A' },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#64748B',
    }
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicRoutes = ['/login', '/signup', '/forgot-password'];
  const isPublicPage = publicRoutes.includes(pathname);

  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {!isPublicPage}
            <main>
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}