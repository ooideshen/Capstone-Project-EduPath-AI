'use client';

import { useState, useEffect } from 'react';
import AddCourseModal from '@/app/components/AddCourseModel';
import EditCourseModal from '@/app/components/EditCourseModel';
import Pagination from '@/app/components/Pagination';
import SearchEngine from '@/app/components/SearchEngine';
import { 
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, IconButton, Chip, Stack
} from '@mui/material';
import { Edit2,Trash2, Plus, BookOpen, Building2} from 'lucide-react';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

const DarkChip = ({ label }: { label: string }) => (
  <Chip 
    label={label} 
    size="small" 
    sx={{ 
      bgcolor: '#F1F5F9',
      color: '#475569', 
      border: '1px solid #E2E8F0', 
      borderRadius: 1.5,
      fontWeight: 600,
      fontFamily: 'monospace',
      '& .MuiChip-label': { px: 1, fontSize: '0.75rem' } 
    }} 
  />
);

interface GroupedCourse {
  id: number;
  courseName: string;
  riasecCategory: string;
  universityName: string;
  scores: string[];
}

interface CourseResponse {
  id: number;
  courseName: string;
  riasecCategory: string;
  university: {
    name: string;
  };
  subject: { 
    track: string;
    name: string;
    grade: string;
  }[];
}

export default function MQAPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<GroupedCourse | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEditClick = (course: GroupedCourse) => {
    setSelectedCourse(course);
    setEditOpen(true);
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/course/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId: number, courseName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/subject/delete/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the course');
      }

      alert('Course deleted successfully!');

      const res = await fetch(`${API_URL}/api/course/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      const latestData: CourseResponse[] = await res.json();

      const latestCourseList = latestData.map(item => ({
        id: item.id,
        courseName: item.courseName,
        riasecCategory: item.riasecCategory,
        universityName: item.university?.name || 'N/A',
        scores: item.subject?.map((s: any) => `${s.track ? `[${s.track}] ` : ''}${s.name}: ${s.grade}`) || []
      }));
      

      const latestFilteredData = latestCourseList.filter((item) =>
        item.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const newTotalPages = Math.ceil(latestFilteredData.length / rowsPerPage);

      if (page >= newTotalPages && page > 0) {
        setPage(newTotalPages - 1);
      }

      setCourses(latestData);
    } catch (error) {
      console.error("Delete error:", error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const courseList: GroupedCourse[] = courses.map(item => ({
    id: item.id,
    courseName: item.courseName,
    riasecCategory: item.riasecCategory,
    universityName: item.university?.name || 'N/A',
    scores: item.subject?.map((s: any) => `${s.track ? `[${s.track}] ` : ''}${s.name}: ${s.grade}`) || []
  }));

  const filteredData = courseList.filter((item) =>
    item.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowsPerPage = 5;
  const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>

      <Container maxWidth="xl"> 

        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            MQA Database
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Manage the central registry of Malaysian Qualifications Agency courses and academic requirements.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 4 }}>
          <SearchEngine 
            placeholder="Search course name..." 
            onSearch={(val) => {
              setSearchQuery(val); 
              setPage(0);          
            }} 
          />

          <Stack 
            direction="row" 
            spacing={2}
            sx={{ 
              justifyContent: { xs: 'center', md: 'flex-end' }, 
              width: { xs: '100%', md: 'auto' } 
            }}
          >
            <Button 
              variant="contained" 
              onClick={() => setOpen(true)}
              startIcon={<Plus size={18} />} 
              sx={{ 
                flex: { xs: 1, md: 'none' },
                bgcolor: '#0062FE', 
                color: 'white', 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 700,
                whiteSpace: 'nowrap',
                px: 3,
                boxShadow: '0 4px 12px rgba(0,98,254,0.2)',
                '&:hover': { bgcolor: '#0050D1', boxShadow: '0 6px 16px rgba(0,98,254,0.3)' } 
              }}
            >
              Add Course
            </Button>
          </Stack>

          <AddCourseModal open={open} handleClose={() => { setOpen(false); fetchCourses(); }} />
        </Box>

        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            bgcolor: 'white',
            border: '1px solid #E2E8F0', 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
                <TableRow sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ width: '22%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', pl: 4, py: 2.5 }}>Course Name</TableCell>
                    <TableCell sx={{ width: '20%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none' }}>University</TableCell>
                    <TableCell sx={{ color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', width: '14%' }}>RIASEC Category</TableCell>
                    <TableCell sx={{ color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none' }}>Mqa Min Scores</TableCell>
                    <TableCell sx={{ color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', align: 'right', pr: 4 }}>Actions</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, borderBottom: '1px solid #F1F5F9', transition: 'all 0.2s ease' }}>
                    
                    {/* 1. Course Name */}
                    <TableCell sx={{ border: 'none', py: 3, pl: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', flexShrink: 0, width: 36, height: 36, borderRadius: '50%', bgcolor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={18} color="#0062FE" />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 700, lineHeight: 1.4 }}>
                          {row.courseName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* 2. University */}
                    <TableCell sx={{ border: 'none', py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Building2 size={18} color="#94A3B8" />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500, fontSize: 13 }}>
                          {row.universityName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* 3. RIASEC */}
                    <TableCell sx={{ border: 'none', py: 3 }}>
                      <Chip label={row.riasecCategory} size="small" sx={{ bgcolor: '#F5F3FF', color: '#8B5CF6', fontWeight: 700, border: '1px solid #EDE9FE' }} />
                    </TableCell>

                    {/* 4. MQA Scores */}
                    <TableCell sx={{ border: 'none', py: 3 }}>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        {row.scores.map((score: string, index: number) => (
                          <DarkChip key={index} label={score} />
                        ))}
                      </Stack>
                    </TableCell>

                    {/* 5. Actions */}
                    <TableCell align="right" sx={{ border: 'none', py: 3, pr: 4 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditClick(row)} 
                          sx={{ color: '#94A3B8', '&:hover': { color: '#0062FE', bgcolor: '#EFF6FF' } }}
                        >
                          <Edit2 size={16} />
                        </IconButton>

                        <IconButton 
                          size="small" 
                          sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' } }}
                          onClick={() => handleDelete(row.id, row.courseName)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            currentPage={page} 
            onPageChange={(newPage) => setPage(newPage)}
            theme="light"
          />

        </TableContainer>

        {selectedCourse && (
          <EditCourseModal 
            open={editOpen} 
            handleClose={() => {
              setEditOpen(false);
              setSelectedCourse(null);
            }} 
            courseData={selectedCourse}
            onSuccess={() => {
              fetchCourses(); 
            }}
          />
        )}
      </Container>
    </Box>
  );
}
