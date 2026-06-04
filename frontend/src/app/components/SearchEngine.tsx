'use client';

import { InputBase, Box } from '@mui/material';
import { Search } from 'lucide-react';

interface SearchEngineProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export default function SearchEngine({ onSearch, placeholder = "Search..." }: SearchEngineProps) {
    return (
        <Box sx={{
            width: { xs: '100%', md: 350 },
            bgcolor: "white",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            px: 2,
            py: 0.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            '&:focus-within': {
                borderColor: '#0062FE',
                boxShadow: '0 0 0 4px rgba(0,98,254,0.1)'
            }
        }}>
            <Search size={18} color="#94A3B8" />
            <InputBase
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value)}
                sx={{ color: "#1A1A1A", width: "100%", fontSize: 14 }}
            />
        </Box>
    );
}