'use client';

import { Box, IconButton, Pagination as MUIPagination } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number; 
  onPageChange: (newPage: number) => void;
  theme?: 'light' | 'dark';
}

export default function Pagination({ totalPages, currentPage, onPageChange, theme = 'dark' }: CustomPaginationProps) {
    if (totalPages <= 1) return null;
    
    const isLight = theme === 'light';
    
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, width: '100%' }}>
        <MUIPagination
            count={totalPages}
            page={currentPage + 1}
            onChange={(e, value) => onPageChange(value - 1)}
            siblingCount={totalPages}
            boundaryCount={1}
            renderItem={(item) => (
            <IconButton 
                disabled={item.disabled}
                onClick={item.onClick}
                sx={{ 
                color: isLight ? (item.selected ? 'white' : '#64748b') : 'white', 
                mx: 0.5,
                width: 32, 
                height: 32,
                fontSize: '1rem',
                borderRadius: '50%', 
                bgcolor: item.selected ? (isLight ? '#0062FE' : '#333') : 'transparent',
                '&:hover': { bgcolor: isLight ? (item.selected ? '#0052d4' : '#f1f5f9') : '#222' },
                '&.Mui-disabled': { color: isLight ? '#cbd5e1' : '#555', cursor: 'not-allowed' }
                }}
            >
                {item.type === 'previous' && <ChevronLeft size={18} />}
                {item.type === 'next' && <ChevronRight size={18} />}
                {item.type === 'page' && item.page}
            </IconButton>
            )}
        />
        </Box>
    );
}