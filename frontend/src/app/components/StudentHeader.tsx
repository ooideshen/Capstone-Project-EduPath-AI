'use client';

import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Tooltip } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import StudentTab from './StudentTab';

export default function StudentHeader() {
    const { logout } = useAuth();
    const router = useRouter();
    const [userName, setUserName] = useState('Student');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.name || parsedUser.username || 'Student');
            } catch (e) {}
        }
    }, []);

    return (
        <AppBar 
            position="sticky" 
            elevation={0} 
            sx={{ 
                bgcolor: 'white',
                borderBottom: '1px solid #E2E8F0',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1 }}>
                {/* Left: Logo */}
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '-0.5px' }}>
                    EduPath <span style={{ color: '#0062FE' }}>Student</span>
                </Typography>

                {/* Right: Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {/* User Profile Link */}
                    <Box 
                        onClick={() => router.push('/student/profile')}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5, 
                            cursor: 'pointer',
                            p: 0.5,
                            pr: 2,
                            borderRadius: '50px',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#F1F5F9' }
                        }}
                    >
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#DBEAFE', color: '#0062FE', fontSize: '0.9rem', fontWeight: 700 }}>
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{ color: '#1A1A1A', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{userName}</Typography>
                            <Typography sx={{ color: '#64748B', fontSize: 11 }}>Student &gt;</Typography>
                        </Box>
                    </Box>

                    {/* Logout */}
                    <Tooltip title="Log Out">
                        <IconButton 
                            onClick={logout} 
                            sx={{ color: '#94A3B8', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2', borderColor: '#FECACA' } }}
                        >
                            <LogOut size={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
            
            {/* Horizontal Tabs */}
            <Box sx={{ px: { xs: 2, md: 4 }, bgcolor: 'white' }}>
                <StudentTab />
            </Box>
        </AppBar>
    );
}
