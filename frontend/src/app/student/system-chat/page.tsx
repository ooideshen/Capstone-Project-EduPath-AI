'use client';

import { Box, Container, Typography } from '@mui/material';
import ChatComponent from '@/app/components/ChatComponent';

export default function SystemChatPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg"> 
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            EduPath AI Engine
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Your 24/7 personalized academic advisor. Ask anything about your future pathways.
          </Typography>
        </Box>
        <Box>
          <ChatComponent />
        </Box>
      </Container>
    </Box>
  );
}