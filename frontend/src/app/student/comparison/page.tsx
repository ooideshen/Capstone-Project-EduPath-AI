'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  InputBase,
  Pagination
} from '@mui/material';
import { Bookmark, BookmarkCheck, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { API_URL } from '@/app/utils/api';

const searchBoxStyle = {
  width: { xs: '100%', sm: 330 },
  bgcolor: "white",
  border: "1px solid #E2E8F0",
  borderRadius: "50px",
  px: 2.5,
  py: 1,
  display: "flex",
  alignItems: "center",
  gap: 1,
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  '&:hover': { borderColor: '#CBD5E1' },
  '&:focus-within': { border: '1px solid #0062FE', boxShadow: '0 4px 15px rgba(0,98,254,0.1)' }
};

export default function ComparisonPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [savedPathways, setSavedPathways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');

  const getAuthConfig = () => {
    const token = Cookies.get('accessToken'); 
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  };

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
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/StudentProfile/user/${userId}`, 
        getAuthConfig()
      );
      const profile = response.data;

      if (profile.aiRealityReport) {
        setReportData(JSON.parse(profile.aiRealityReport));
      }

      if (profile.savedPathways) {
        setSavedPathways(JSON.parse(profile.savedPathways));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (pathway: any) => {
    if (!userId) return;

    const isSaved = savedPathways.some(p => p.course_name === pathway.course_name);
    if (isSaved) {
      setSavedPathways(prev => prev.filter(p => p.course_name !== pathway.course_name));
    } else {
      setSavedPathways(prev => [...prev, pathway]);
    }

    try {
      await axios.post(
        `${API_URL}/api/StudentProfile/toggle-pathway/${userId}`, 
        pathway,
        getAuthConfig()
      );
    } catch (err) {
      console.error("Failed to toggle save", err);
      fetchData();
    }
  };

  const parseCourseName = (fullName: string) => {
    const match = fullName.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return { course: match[1].trim(), university: match[2].trim() };
    }
    return { course: fullName, university: "Top Tier University" };
  };

  const generateTuition = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const fee = 60000 + (Math.abs(hash) % 50000);
    return `RM ${Math.round(fee / 1000) * 1000}`;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const pathways = reportData?.recommended_pathways || [];
  const filteredPathways = pathways.filter((p: any) => 
    p.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPathways.length / rowsPerPage);
  const paginatedPathways = filteredPathways.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">

        <Box sx={{ mb: 5, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
              Comparison Matrix
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: 16 }}>
              High-fidelity analytical comparison across your AI recommended institution options.
            </Typography>
          </Box>

          <Box sx={searchBoxStyle}>
            <Search size={18} color="#64748B" />
            <InputBase
              placeholder="Search by course or university..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ color: "#1A1A1A", width: "100%", fontSize: 14 }}
            />
          </Box>
        </Box>

        <Paper
          sx={{
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
          }}
        >
          {loading ? (
             <Box sx={{ p: 10, textAlign: 'center' }}>
               <CircularProgress sx={{ color: '#0062FE' }} />
               <Typography sx={{ color: '#64748B', mt: 2 }}>Loading comparison data...</Typography>
             </Box>
          ) : !reportData || !reportData.recommended_pathways ? (
             <Box sx={{ p: 10, textAlign: 'center' }}>
               <Typography sx={{ color: '#64748B' }}>No AI Reality Report found. Please complete the assessment and generate your report first.</Typography>
             </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5 }}>University</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5 }}>Specialized Pathway</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5 }}>Duration</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5 }}>Tuition</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5 }}>Starting Salary</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5 }}>Match Status</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px', py: 2.5, align: 'right' }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedPathways.length > 0 ? paginatedPathways.map((pathway: any, index: number) => {
                    const parsed = parseCourseName(pathway.course_name);
                    const isSaved = savedPathways.some(p => p.course_name === pathway.course_name);
                    const tuition = generateTuition(parsed.course);
                    const originalIndex = pathways.findIndex((p: any) => p.course_name === pathway.course_name);
                    const isOptimal = originalIndex === 0;

                    return (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, borderBottom: '1px solid #F1F5F9' }}>
                        <TableCell sx={{ color: '#1A1A1A', fontWeight: 800, fontSize: 15, py: 3 }}>{parsed.university}</TableCell>
                        <TableCell sx={{ color: '#475569', fontSize: 14, fontWeight: 500 }}>{parsed.course}</TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: 14 }}>3 Academic Years</TableCell>
                        <TableCell sx={{ color: '#1A1A1A', fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>{tuition}</TableCell>
                        <TableCell sx={{ color: '#10B981', fontSize: 14, fontWeight: 800, fontFamily: 'monospace' }}>{pathway.industry_reality.starting_salary_rm}</TableCell>
                        <TableCell>
                          {isOptimal ? (
                            <Chip label="Optimal Match" size="small" sx={{ bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#0062FE', fontWeight: 700, fontSize: 11, borderRadius: 1.5 }} />
                          ) : (
                            <Chip label="Good Fit" size="small" sx={{ bgcolor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', fontWeight: 700, fontSize: 11, borderRadius: 1.5 }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleToggleSave(pathway)}
                            sx={{ 
                              color: isSaved ? '#0062FE' : '#94A3B8',
                              bgcolor: isSaved ? '#EFF6FF' : 'transparent',
                              '&:hover': { bgcolor: isSaved ? '#DBEAFE' : '#F1F5F9' }
                            }}
                          >
                            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#64748B' }}>
                        No courses found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" p={3} borderTop="1px solid #E2E8F0">
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(_, value) => setPage(value)} 
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "#64748B",
                        fontWeight: 600
                      },
                      "& .Mui-selected": {
                        bgcolor: "#0062FE !important",
                        color: "white",
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

      </Container>
    </Box>
  );
}