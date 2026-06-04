'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Stack, 
  CircularProgress, 
  Button 
} from '@mui/material';
import Cookies from 'js-cookie'; 
import { API_URL } from '@/app/utils/api';

interface StudentDetails {
  id: number;
  name: string;
  email: string;
}

interface AssessmentProfile {
  id: number;
  gender: string;
  description: string;
  aiRealityReport: string;
  personalityAssessment: any;
  academicAssessment: any;
}

export default function StudentProfilePage() {
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [profile, setProfile] = useState<AssessmentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user'); 
    
    if (!storedUser) {
      setError("No student session found. Please log in first.");
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id; 

      const token = Cookies.get('accessToken');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      };

      Promise.all([
        fetch(`${API_URL}/api/user/${userId}`, requestOptions).then(res => {
          if (!res.ok) {
            if (res.status === 404) return Promise.reject('User profile not found in database. Your session might be stale from an old database. Please log out and log in again.');
            return Promise.reject('Failed to retrieve user data.');
          }
          return res.json();
        }),
        fetch(`${API_URL}/api/StudentProfile/user/${userId}`, requestOptions).then(res => res.ok ? res.json() : null)
      ])
      .then(([databaseDetails, studentProfileData]) => {
        setUser(databaseDetails);
        setProfile(studentProfileData);
        setError(null);
      })
      .catch((err) => {
        console.error("Connection/Fetch Error:", err);
        if (typeof err === 'string') {
          setError(err);
        } else {
          setError("Database connection failed. Ensure Spring Boot is running in IntelliJ.");
        }
      })
      .finally(() => {
        Loading(false);
      });
    } catch (e) {
      console.error("Session parse error", e);
      setError("Failed to read user session data.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <CircularProgress sx={{ color: '#0062FE' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F8FAFC', gap: 2 }}>
        <Typography variant="h5" sx={{ color: '#EF4444', fontWeight: 800 }}>⚠️ Connection Error</Typography>
        <Typography sx={{ color: '#64748B', maxWidth: 400, textAlign: 'center' }}>{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2, bgcolor: '#0062FE', textTransform: 'none', '&:hover': { bgcolor: '#0050D1' } }}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: 'white',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#1A1A1A',
              fontSize: { xs: 28, md: 36 },
              fontWeight: 900,
              letterSpacing: '-1px',
              borderBottom: '1px solid #E2E8F0',
              pb: 2,
              mb: 4
            }}
          >
            Student Profile Setup
          </Typography>

          {user && (
            <Stack spacing={4}>
              <Box>
                <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800, letterSpacing: '1px', mb: 0.5, textTransform: 'uppercase' }}>
                  Database User ID
                </Typography>
                <Typography sx={{ color: '#1A1A1A', fontSize: 18, fontWeight: 600 }}>
                  {user.id}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800, letterSpacing: '1px', mb: 0.5, textTransform: 'uppercase' }}>
                  Full Name
                </Typography>
                <Typography sx={{ color: '#1A1A1A', fontSize: 18, fontWeight: 600 }}>
                  {user.name}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800, letterSpacing: '1px', mb: 0.5, textTransform: 'uppercase' }}>
                  Email Address
                </Typography>
                <Typography sx={{ color: '#1A1A1A', fontSize: 18, fontWeight: 600 }}>
                  {user.email}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ color: '#10B981', fontSize: 13, fontWeight: 800, letterSpacing: '1px', mb: 0.5, textTransform: 'uppercase' }}>
                  RIASEC Personality Assessment
                </Typography>
                {profile?.personalityAssessment ? (
                  <Typography sx={{ color: '#1A1A1A', fontSize: 16, fontWeight: 500 }}>
                    <span style={{ color: '#10B981', marginRight: 8 }}>✓</span> Completed (ID: {profile.personalityAssessment.id})
                  </Typography>
                ) : (
                  <Typography sx={{ color: '#94A3B8', fontSize: 16 }}>
                    Not Taken
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography sx={{ color: '#10B981', fontSize: 13, fontWeight: 800, letterSpacing: '1px', mb: 0.5, textTransform: 'uppercase' }}>
                  Academic Assessment
                </Typography>
                {profile?.academicAssessment ? (
                  <Typography sx={{ color: '#1A1A1A', fontSize: 16, fontWeight: 500 }}>
                    <span style={{ color: '#10B981', marginRight: 8 }}>✓</span> Completed (ID: {profile.academicAssessment.id})
                  </Typography>
                ) : (
                  <Typography sx={{ color: '#94A3B8', fontSize: 16 }}>
                    Not Submitted
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
}