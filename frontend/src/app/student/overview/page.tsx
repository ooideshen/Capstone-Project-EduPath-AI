'use client';

import { Box, Container, Typography, Paper } from '@mui/material';
import { useAuth } from '@/app/context/AuthContext';
import { Activity, Star, Award, BookOpen, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/app/utils/api';

const RIASEC_LABELS: Record<string, string> = {
  realisticMark: 'Realistic',
  investigateMark: 'Investigative',
  artisticMark: 'Artistic',
  socialMark: 'Social',
  enterprisingMark: 'Enterprising',
  conventionalMark: 'Conventional',
};

export default function StudentOverview() {
  const { user } = useAuth();
  const [savedCount, setSavedCount] = useState<number | string>('...');
  const [profileCompletion, setProfileCompletion] = useState<string>('...');
  const [riasecDominance, setRiasecDominance] = useState<string>('...');
  const [academicMatch, setAcademicMatch] = useState<string>('...');

  useEffect(() => {
    if (user?.id) {
      const token = Cookies.get('accessToken');

      axios
        .get(`${API_URL}/api/StudentProfile/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const profile = res.data;

          // --- Saved Pathways count ---
          if (profile.savedPathways) {
            try {
              const pathways = JSON.parse(profile.savedPathways);
              setSavedCount(pathways.length);
            } catch {
              setSavedCount(0);
            }
          } else {
            setSavedCount(0);
          }

          // --- Profile Completion ---
          const hasPersonality = !!profile.personalityAssessment;
          const hasAcademic = !!profile.academicAssessment;
          const hasProfile = !!(profile.gender && profile.description);
          const completedSteps = [hasProfile, hasPersonality, hasAcademic].filter(Boolean).length;
          const pct = Math.round((completedSteps / 3) * 100);
          setProfileCompletion(`${pct}%`);

          // --- RIASEC Dominance ---
          if (profile.personalityAssessment) {
            const pa = profile.personalityAssessment;
            const scores: Record<string, number> = {
              realisticMark: pa.realisticMark ?? 0,
              investigateMark: pa.investigateMark ?? 0,
              artisticMark: pa.artisticMark ?? 0,
              socialMark: pa.socialMark ?? 0,
              enterprisingMark: pa.enterprisingMark ?? 0,
              conventionalMark: pa.conventionalMark ?? 0,
            };
            const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
            setRiasecDominance(RIASEC_LABELS[dominant] ?? 'N/A');
          } else {
            setRiasecDominance('Pending');
          }

          // --- Academic Match ---
          if (profile.matchedCourses && profile.matchedCourses.length > 0) {
            const count = profile.matchedCourses.length;
            if (count >= 5) setAcademicMatch('High');
            else if (count >= 2) setAcademicMatch('Medium');
            else setAcademicMatch('Low');
          } else if (!profile.academicAssessment) {
            setAcademicMatch('Pending');
          } else {
            setAcademicMatch('Low');
          }
        })
        .catch((err) => {
          console.error('Failed to fetch profile', err);
          setSavedCount(0);
          setProfileCompletion('N/A');
          setRiasecDominance('N/A');
          setAcademicMatch('N/A');
        });
    }
  }, [user]);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#1A1A1A',
              fontSize: { xs: 28, md: 36 },
              fontWeight: 900,
              letterSpacing: '-1px',
              mb: 1,
            }}
          >
            Welcome back, <span style={{ color: '#0062FE' }}>{user?.username || 'Student'}</span>!
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16, maxWidth: 650, lineHeight: 1.6 }}>
            Here's a quick summary of your EduPath AI journey. Use the tabs above to navigate to
            your assessments, matrix, and AI reports.
          </Typography>
        </Box>

        {/* Summary Dashboard */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 6,
          }}
        >
          {[
            { title: 'Profile Completion', value: profileCompletion, icon: <User />, color: '#0062FE', bg: '#EFF6FF' },
            { title: 'RIASEC Dominance', value: riasecDominance, icon: <Star />, color: '#A855F7', bg: '#FAF5FF' },
            { title: 'Academic Match', value: academicMatch, icon: <Award />, color: '#10B981', bg: '#ECFDF5' },
            { title: 'Saved Pathways', value: `${savedCount} Courses`, icon: <BookOpen />, color: '#F59E0B', bg: '#FFFBEB' },
          ].map((stat, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 3,
                  bgcolor: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography sx={{ color: '#64748B', fontSize: 13, fontWeight: 600, mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography sx={{ color: '#1A1A1A', fontSize: 20, fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Main Content Area */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 5,
            border: '1px solid #E2E8F0',
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Activity size={48} color="#CBD5E1" style={{ margin: '0 auto', marginBottom: 16 }} />
            <Typography sx={{ color: '#1A1A1A', fontSize: 20, fontWeight: 700, mb: 1 }}>
              Your personalized dashboard is ready
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
              Navigate through the top menu to complete your assessments and generate your AI
              report.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}