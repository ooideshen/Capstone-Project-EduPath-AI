'use client';

import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, TextField, Button, InputAdornment } from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';import { LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import CounselorTab from './CounselorTab';
import { API_URL } from '@/app/utils/api';

export default function CounselorHeader() {
    const { logout } = useAuth();
    const [userName, setUserName] = useState('Counselor');
    const [openProfile, setOpenProfile] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.name || parsedUser.username || 'Counselor');
                setEmail(parsedUser.email || '');
                setProfilePhoto(parsedUser.profilePhoto || '');
            } catch (e) {}
        }
    }, []);

const saveProfile = async () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  await fetch(`${API_URL}/api/counselor/profile/${storedUser.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userName,
      email: email,
      password: password,
    }),
  });

  const updatedUser = {
    ...storedUser,
    name: userName,
    email: email,
    profilePhoto: profilePhoto,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  setOpenProfile(false);
  window.location.reload();
};

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
                    EduPath <span style={{ color: '#0062FE' }}>Counselor</span>
                </Typography>

                {/* Right: Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box 
                        onClick={() => setOpenProfile(true)}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            cursor: 'pointer'
                        }}
                        >
                        <Avatar
                        src={profilePhoto}
                        sx={{ width: 36, height: 36, bgcolor: '#DBEAFE', color: '#0062FE', fontSize: '0.9rem', fontWeight: 700 }}
                        >
                        {userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{ color: '#1A1A1A', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{userName}</Typography>
                            <Typography sx={{ color: '#64748B', fontSize: 11 }}>Counselor</Typography>
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
                <CounselorTab />
            </Box>


        <Dialog
            open={openProfile}
            onClose={() => setOpenProfile(false)}
            PaperProps={{
                sx: {
                borderRadius: 4,
                minWidth: 400,
                p: 1
                }
            }}
            >
            <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Counselor Settings

                <IconButton onClick={() => setOpenProfile(false)}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>

                <TextField
                    label="Counselor Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                />

                <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                />

                <Button
                variant="outlined"
                component="label"
                sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    borderColor: "#0062FE",
                    color: "#0062FE"
                }}
                >
                Choose Profile Photo
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();

                        reader.onloadend = () => {
                        setProfilePhoto(reader.result as string);
                        };

                        reader.readAsDataURL(file);
                    }
                    }}
                />
                </Button>

                <Button
                    onClick={saveProfile}
                    variant="contained"
                    sx={{
                    bgcolor: '#0062FE',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700
                    }}
                >

                    Save Changes
                </Button>

                </Box>
            </DialogContent>
        </Dialog>

        </AppBar>
    );
}
