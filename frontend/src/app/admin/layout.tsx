'use client';

import AdminHeader from '../components/AdminHeader';
import { Box } from '@mui/material';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AdminHeader />
      
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}