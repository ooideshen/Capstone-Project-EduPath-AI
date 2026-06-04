'use client';

import StudentHeader from '../components/StudentHeader';
import { Box, Tooltip, IconButton } from '@mui/material';
import { MessageSquareText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <StudentHeader />
      
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>

      {/* Global AI Floating Chat Button */}
      <Box sx={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1000 }}>
        <Tooltip title="Talk to EduPath AI" placement="left" arrow>
          <IconButton
            onClick={() => router.push('/student/system-chat')}
            sx={{
              bgcolor: '#0062FE',
              color: 'white',
              width: 65,
              height: 65,
              borderRadius: '50%',
              boxShadow: '0px 10px 30px rgba(0, 98, 254, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#0050D1',
                transform: 'scale(1.08)',
                boxShadow: '0px 15px 35px rgba(0, 98, 254, 0.5)',
              }
            }}
          >
            <MessageSquareText size={32} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
