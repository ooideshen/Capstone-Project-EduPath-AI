'use client';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Link from 'next/link';

export default function Header() {
    return (
        <AppBar 
            position="sticky" 
            sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',       
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: 'none',
                py: 1
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
                    
                    {/* Logo Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: '#0062FE', 
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Box sx={{ width: 16, height: 16, border: '2px solid white', borderRadius: '2px', transform: 'rotate(45deg)' }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
                            EduPathAI
                        </Typography>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                        {[
                            { name: 'Features', id: 'features' },
                            { name: 'Assessments', id: 'assessments' },
                            { name: 'Pathways', id: 'pathways' },
                            { name: 'Testimonials', id: 'testimonials' }
                        ].map((item) => (
                            <Button 
                                key={item.name}
                                color="inherit" 
                                component="a"
                                href={`#${item.id}`}
                                sx={{ 
                                    textTransform: 'none', 
                                    color: '#64748B', 
                                    fontWeight: 600,
                                    '&:hover': { color: '#1A1A1A', bgcolor: 'transparent' },
                                    fontSize: '0.9rem'
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Right Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            href="/login"
                            sx={{ 
                                textTransform: 'none', 
                                color: '#1A1A1A',
                                fontWeight: 600,
                                display: { xs: 'none', sm: 'block' } 
                            }}
                        >
                            Log In
                        </Button>
                        <Button 
                            variant="contained" 
                            component={Link} 
                            href="/signup"
                            sx={{ 
                                textTransform: 'none', 
                                borderRadius: '50px', 
                                bgcolor: '#0062FE',
                                color: 'white',
                                px: 3,
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#0050d1' },
                                boxShadow: 'none'
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
}