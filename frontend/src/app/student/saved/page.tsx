'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '@/app/context/AuthContext'; 
import { API_URL } from '@/app/utils/api';

export default function SavedPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [savedPathways, setSavedPathways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchSavedPathways();
    }
  }, [userId]);

  const fetchSavedPathways = async () => {
    setLoading(true);
    try {

      const token = getCookie('accessToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get(`${API_URL}/api/StudentProfile/user/${userId}`, config);
      if (response.data.savedPathways) {
        setSavedPathways(JSON.parse(response.data.savedPathways));
      }
    } catch (err) {
      console.error("Failed to fetch saved pathways", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async (pathway: any) => {
    if (!userId) return;

    setSavedPathways(prev => prev.filter(p => p.course_name !== pathway.course_name));

    try {
      const token = getCookie('accessToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(`${API_URL}/api/StudentProfile/toggle-pathway/${userId}`, pathway, config);
    } catch (err) {
      console.error("Failed to purge saved pathway", err);
      fetchSavedPathways();
    }
  };

  const parseCourseName = (fullName: string) => {
    const match = fullName.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return { course: match[1].trim(), university: match[2].trim() };
    }
    return { course: fullName, university: "Top Tier University" };
  };

  const generateCode = (name: string) => {
    return name.substring(0, 3).toUpperCase() + '-' + name.length + '-01';
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">

        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
              Saved Pathways
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: 16 }}>
              Track, review, or clear your chosen core academic pipelines.
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', px: 2, py: 0.8, borderRadius: 50 }}>
             <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800 }}>
               {savedPathways.length} SAVED
             </Typography>
          </Box>
        </Box>

        {loading ? (
           <Box sx={{ p: 5, textAlign: 'center' }}>
             <CircularProgress sx={{ color: '#0062FE' }} />
           </Box>
        ) : savedPathways.length === 0 ? (
           <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'white', border: '2px dashed #E2E8F0', borderRadius: 4, boxShadow: 'none' }}>
             <Typography sx={{ color: '#64748B', fontSize: 16, fontWeight: 500 }}>No pathways saved yet.</Typography>
             <Typography sx={{ color: '#94A3B8', fontSize: 14, mt: 1 }}>Go to the Comparison Matrix to bookmark your favorites!</Typography>
           </Paper>
        ) : (
          <Stack spacing={3}>
            {savedPathways.map((pathway, index) => {
              const parsed = parseCourseName(pathway.course_name);
              const code = generateCode(parsed.course);
              return (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#0062FE', boxShadow: '0 15px 40px rgba(0,98,254,0.06)' }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      <Typography variant="h5" sx={{ color: '#1A1A1A', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
                        {parsed.course}
                      </Typography>
                      <Box sx={{ px: 1.5, py: 0.3, bgcolor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 50 }}>
                        <Typography sx={{ color: '#475569', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>{code}</Typography>
                      </Box>
                    </Box>

                    <Stack spacing={1} sx={{ color: '#64748B', fontSize: 14 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography sx={{ color: '#475569', fontWeight: 700 }}>Institution:</Typography>
                        <Typography sx={{ color: '#1A1A1A', fontWeight: 500 }}>{parsed.university}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography sx={{ color: '#475569', fontWeight: 700 }}>Location:</Typography>
                        <Typography sx={{ color: '#64748B' }}>Kuala Lumpur / Selangor</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', mt: 0.5 }}>
                        <Typography sx={{ color: '#475569', fontWeight: 700 }}>Starting Salary (Est):</Typography>
                        <Typography sx={{ color: '#10B981', fontWeight: 800, fontFamily: 'monospace', fontSize: 15 }}>{pathway.industry_reality?.starting_salary_rm || 'RM 3,500'} / month</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box>
                    <Button
                      onClick={() => handlePurge(pathway)}
                      variant="outlined"
                      sx={{
                        py: 1,
                        px: 3,
                        borderRadius: 50,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: 13,
                        borderColor: '#E2E8F0',
                        color: '#EF4444',
                        bgcolor: 'white',
                        '&:hover': {
                          bgcolor: '#FEF2F2',
                          borderColor: '#FECACA',
                          color: '#DC2626'
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}

      </Container>
    </Box>
  );
}