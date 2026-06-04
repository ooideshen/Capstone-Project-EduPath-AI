'use client';

import { useState, useEffect } from 'react';
import Pagination from '@/app/components/Pagination';
import SearchEngine from '@/app/components/SearchEngine';
import AddCareerModal from '@/app/components/AddCareerModal';
import EditCareerModal from '@/app/components/EditCareerModal';
import toast from 'react-hot-toast';
import { 
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, IconButton, Stack, Chip
} from '@mui/material';
import { Edit2, Trash2, Plus, Briefcase, Banknote, ShieldAlert } from 'lucide-react';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface CareerData {
  id: number;
  name: string;
  salary: string;
  risk: string;
  color?: string;
}

export default function MarketDataPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerData | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState<CareerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const rowsPerPage = 5;

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/career/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },

      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error("Error fetching careers:", error);
      toast.error("Failed to load career data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (career: CareerData) => {
    setSelectedCareer(career);
    setEditOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/career/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Record deleted successfully');

      const refreshResponse = await fetch(`${API_URL}/api/career/all`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const newData = await refreshResponse.json();

      const updatedFilteredData = newData.filter((item: CareerData) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const newTotalPages = Math.ceil(updatedFilteredData.length / rowsPerPage);
      if (page >= newTotalPages && page > 0) {
        setPage(Math.max(0, newTotalPages - 1));
      }

      setMarketData(newData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    const value = parseInt(risk);
    if (value < 30) return '#10B981';
    if (value < 60) return '#F59E0B';
    return '#EF4444';
  };

  const getRiskBg = (risk: string) => {
    const value = parseInt(risk);
    if (value < 30) return '#ECFDF5';
    if (value < 60) return '#FFFBEB';
    return '#FEF2F2';
  };

  const getRiskBorder = (risk: string) => {
    const value = parseInt(risk);
    if (value < 30) return '#A7F3D0';
    if (value < 60) return '#FDE68A';
    return '#FECACA';
  };

  const filteredData = marketData.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl"> 
        
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            Career Market Data
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Manage career trends, expected starting salaries, and AI replacement risks.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 4 }}>
          <SearchEngine
            placeholder="Search career name..." 
            onSearch={(val) => {
              setSearchQuery(val); 
              setPage(0);          
            }} 
          />

          <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-end', width: { xs: '100%', md: 'auto'}}}}>
            <Button 
              variant="contained" 
              onClick={() => setAddOpen(true)}
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
              Add Career Data
            </Button>
          </Stack>
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
                    <TableCell sx={{ width: '30%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', pl: 4, py: 2.5 }}>Industry / Career</TableCell>
                    <TableCell sx={{ width: '30%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none' }}>Starting Salary Range</TableCell>
                    <TableCell sx={{ width: '25%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none' }}>Ai Replacement Risk</TableCell>
                    <TableCell align="right" sx={{ width: '15%', color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, border: 'none', pr: 4 }}>Actions</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>Loading...</TableCell>
                </TableRow>
              ) : displayedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>No career data found.</TableCell>
                </TableRow>
              ) : (
                displayedData.map((row) => {
                  const displayColor = row.color || getRiskColor(row.risk);
                  const displayBg = getRiskBg(row.risk);
                  const displayBorder = getRiskBorder(row.risk);
                  return (
                    <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, borderBottom: '1px solid #F1F5F9', transition: 'all 0.2s ease' }}>
                      
                      {/* 1. Career Name */}
                      <TableCell sx={{ border: 'none', py: 3, pl: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', flexShrink: 0, width: 36, height: 36, borderRadius: '50%', bgcolor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={18} color="#0062FE" />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 700 }}>
                            {row.name || 'Unknown Career'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* 2. Salary */}
                      <TableCell sx={{ border: 'none', py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Banknote size={16} color="#10B981" />
                          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                            {row.salary}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* 3. AI Risk Chip */}
                      <TableCell sx={{ border: 'none', py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Chip 
                            label={row.risk ? (row.risk.includes('%') ? row.risk : `${row.risk}%`) : '0%'}
                            size="small" 
                            icon={<ShieldAlert size={14} color={displayColor} />}
                            sx={{ 
                              bgcolor: displayBg, 
                              color: displayColor, 
                              border: `1px solid ${displayBorder}`,
                              borderRadius: 2,
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              '& .MuiChip-icon': { ml: 1 }
                            }} 
                          />
                        </Box>
                      </TableCell>

                      {/* 4. Actions */}
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
                  );
                })
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

        <AddCareerModal 
          open={addOpen} 
          handleClose={() => { setAddOpen(false); fetchCareers(); }} 
        />
        {selectedCareer && (
          <EditCareerModal
            open={editOpen}
            handleClose={() => { setEditOpen(false); setSelectedCareer(null); }}
            careerData={selectedCareer}
            onSuccess={fetchCareers}
          />
        )} 
      </Container>
    </Box>
  );
}