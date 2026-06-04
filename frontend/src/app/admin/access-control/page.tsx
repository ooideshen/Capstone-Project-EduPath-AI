'use client';

import { useState, useEffect } from 'react';
import SearchEngine from '@/app/components/SearchEngine';
import Pagination from '@/app/components/Pagination';
import EditUserModal from '@/app/components/EditUserModal';
import { 
  Box, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip, Typography, Stack
} from '@mui/material';
import { Shield, Lock, CheckCircle, UserCircle } from 'lucide-react';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AccessControlPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return '#10B981'; 
      case 'SUSPENDED':
      case 'SUSPEND':
        return '#EF4444'; 
      case 'INACTIVE':
        return '#F59E0B'; 
      default:
        return '#94A3B8';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return '#ECFDF5'; 
      case 'SUSPENDED':
      case 'SUSPEND':
        return '#FEF2F2'; 
      case 'INACTIVE':
        return '#FFFBEB'; 
      default:
        return '#F1F5F9';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return '#A7F3D0'; 
      case 'SUSPENDED':
      case 'SUSPEND':
        return '#FECACA'; 
      case 'INACTIVE':
        return '#FDE68A'; 
      default:
        return '#E2E8F0';
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/user/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.MouseEvent, userId: number, newStatus: string) => {
    e.stopPropagation();
    try {
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/user/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }), 
      });

      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl"> 
        
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            Access Control
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Manage user roles, system access, and monitor account statuses.
          </Typography>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <SearchEngine 
            placeholder="Search user name..." 
            onSearch={(val) => {
              setSearchQuery(val);
              setPage(0); 
            }} 
          />
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ width: '25%', color: '#64748B', fontWeight: 700, border: 'none', pl: 4, py: 2.5, fontSize: '0.75rem', textTransform: 'uppercase' }}>User Name</TableCell>
                <TableCell sx={{ width: '30%', color: '#64748B', fontWeight: 700, border: 'none', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</TableCell>
                <TableCell sx={{ width: '15%', color: '#64748B', fontWeight: 700, border: 'none', fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</TableCell>
                <TableCell sx={{ width: '15%', color: '#64748B', fontWeight: 700, border: 'none', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                <TableCell align="right" sx={{ width: '15%', color: '#64748B', fontWeight: 700, border: 'none', pr: 4, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  onClick={() => handleRowClick(user)} 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: '#F8FAFC' },
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TableCell sx={{ border: 'none', py: 3, pl: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', flexShrink: 0, width: 36, height: 36, borderRadius: '50%', bgcolor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCircle size={18} color="#64748B" />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 700 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ border: 'none', color: '#475569', fontWeight: 500 }}>{user.email}</TableCell>

                  <TableCell sx={{ border: 'none' }}>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      sx={{ bgcolor: '#EFF6FF', color: '#0062FE', border: '1px solid #BFDBFE', fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                  </TableCell>

                  <TableCell sx={{ border: 'none' }}>
                    <Chip 
                      label={user.status.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        bgcolor: getStatusBg(user.status), 
                        color: getStatusColor(user.status), 
                        border: `1px solid ${getStatusBorder(user.status)}`, 
                        fontWeight: 700 
                      }} 
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ border: 'none', pr: 4 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleUpdateStatus(e, user.id, 'INACTIVE')}
                        sx={{ color: '#94A3B8', '&:hover': { color: '#F59E0B', bgcolor: '#FFFBEB' } }}
                        title="Set Inactive"
                      >
                        <Shield size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleUpdateStatus(e, user.id, 'SUSPEND')}
                        sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' } }}
                        title="Suspend"
                      >
                        <Lock size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleUpdateStatus(e, user.id, 'ACTIVE')}
                        sx={{ color: '#94A3B8', '&:hover': { color: '#10B981', bgcolor: '#ECFDF5' } }}
                        title="Set Active"
                      >
                        <CheckCircle size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>

                </TableRow>
              ))}
              {displayedUsers.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: '#64748B', textAlign: 'center', py: 10, borderBottom: 'none' }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!isLoading && filteredUsers.length > 0 && (
            <Pagination
              totalPages={Math.ceil(filteredUsers.length / rowsPerPage)}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
              theme="light"
            />
          )}
        </TableContainer>
        <EditUserModal 
          open={isModalOpen}
          userData={selectedUser}
          handleClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchUsers()} 
        />
      </Container>
    </Box>
  );
}