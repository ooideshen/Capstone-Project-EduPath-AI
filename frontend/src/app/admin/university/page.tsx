'use client';

import { useState, useEffect } from 'react';
import AddUniversityModal from '@/app/components/AddUniversityModal';
import EditUniversityModal from '@/app/components/EditUniversityModal';
import Pagination from '@/app/components/Pagination';
import SearchEngine from '@/app/components/SearchEngine';
import toast from 'react-hot-toast';
import { 
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, IconButton, Stack
} from '@mui/material';
import { Edit2, Trash2, Plus, Building2, MapPin } from 'lucide-react';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface University {
  id: number;
  name: string;
  address: string;
}

export default function UniversityPage() {
  const [uniOpen, setUniOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/university/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (university: University) => {
    setSelectedUni(university);
    setEditOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/university/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Please delete all related courses before deleting this university.');

      toast.success('University deleted successfully');

      const refreshResponse = await fetch(`${API_URL}/api/university/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      const newData = await refreshResponse.json();

      const updatedFilteredData = newData.filter((item: University) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const newTotalPages = Math.ceil(updatedFilteredData.length / rowsPerPage);

      if (page >= newTotalPages && page > 0) {
        setPage(newTotalPages - 1);
      }

      setUniversities(newData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = universities.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowsPerPage = 5;
  const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl"> 
        
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            University Database
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Manage university entities, locations, and institutional details.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 4 }}>
          <SearchEngine
            placeholder="Search university name..." 
            onSearch={(val) => {
              setSearchQuery(val); 
              setPage(0);          
            }} 
          />

          <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-end', width: { xs: '100%', md: 'auto'}}}}>
            <Button 
              variant="contained" 
              onClick={() => setUniOpen(true)}
              startIcon={<Plus size={18} />} 
              sx={{ 
                flex: { xs: 1, md: 'none' },
                bgcolor: '#0062FE', 
                color: 'white', 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 700,
                px: 3,
                boxShadow: '0 4px 12px rgba(0,98,254,0.2)',
                '&:hover': { bgcolor: '#0050D1', boxShadow: '0 6px 16px rgba(0,98,254,0.3)' } 
              }}
            >
              Add University
            </Button>
          </Stack>

          <AddUniversityModal open={uniOpen} handleClose={() => { setUniOpen(false); fetchUniversities(); }} />
        </Box>

        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            bgcolor: 'white',
            border: '1px solid #E2E8F0', 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
                <TableRow sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ width: '19%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', pl: 4, py: 2.5 }}>University Name</TableCell>
                    <TableCell sx={{ width: '45%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none' }}>Address</TableCell>
                    <TableCell align="right" sx={{ width: '15%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', pr: 4 }}>Actions</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>
                    No university data found.
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, borderBottom: '1px solid #F1F5F9', transition: 'all 0.2s ease' }}>
                    
                    {/* 1. University Name */}
                    <TableCell sx={{ border: 'none', py: 3, pl: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', flexShrink: 0, width: 36, height: 36, borderRadius: '50%', bgcolor: '#FFFBEB', alignItems: 'center', justifyContent: 'center' }}>
                          <Building2 size={18} color="#F59E0B" />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 700 }}>
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* 2. Address */}
                    <TableCell sx={{ border: 'none', py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <MapPin size={16} color="#94A3B8" />
                        <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                          {row.address}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* 3. Actions */}
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
                          onClick={() => handleDelete(row.id, row.name)}
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
        {selectedUni && (
          <EditUniversityModal
            open={editOpen}
            handleClose={() => {
              setEditOpen(false);
              setSelectedUni(null);
            }}
            uniData={selectedUni}
            onSuccess={() => {
              fetchUniversities();
            }}
          />
        )}
      </Container>
    </Box>
  );
}