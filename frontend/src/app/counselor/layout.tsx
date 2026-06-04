'use client';

import CounselorHeader from '../components/CounselorHeader';
import { Box } from '@mui/material';

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <CounselorHeader />
      
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
