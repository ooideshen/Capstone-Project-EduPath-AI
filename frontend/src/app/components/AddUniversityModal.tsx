'use client';

import { Modal, Box, Typography, TextField, Button, IconButton, Stack } from '@mui/material';
import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface AddUniversityModalProps {
    open: boolean;
    handleClose: () => void;
}

export default function AddUniversityModal({ open, handleClose }: AddUniversityModalProps) {

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async () => {
        const token = getCookie('accessToken');
        const response = await fetch(`${API_URL}/api/university/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: name,
                address: address,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success('Successfully create new university', {
                duration: 5000, 
            });
        } else {
            console.error(data.message);
            toast.error('University name already exists', {
                duration: 5000, 
            });
        }
        handleClose();
        setName('');
        setAddress('');
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            disableScrollLock={true}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}
        >
            <Box sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 450,
                bgcolor: '#FFFFFF',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                outline: 'none',
                maxHeight: '90vh',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                overflowY: 'auto'
            }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#1A1A1A', fontWeight: 800 }}>
                        Add New University
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: '#94A3B8', '&:hover': { bgcolor: '#F1F5F9', color: '#1A1A1A' } }}>
                        <X size={20} />
                    </IconButton>
                </Box>

                <Stack spacing={3}>
                    {/* University Name */}
                    <Box>
                        <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                            University Name
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g. University of Malaya"
                            variant="outlined"
                            sx={inputStyles}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    {/* Address */}
                    <Box>
                        <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                            Address
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Enter university location..."
                            variant="outlined"
                            sx={inputStyles}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Box>

                    {/* Actions */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'row' },
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}>
                        <Button
                            fullWidth
                            onClick={handleClose}
                            sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#F1F5F9' } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{ bgcolor: '#0062FE', color: 'white', fontWeight: 600, borderRadius: 2, textTransform: 'none', px: 3, boxShadow: '0 4px 12px rgba(0,98,254,0.2)', '&:hover': { bgcolor: '#0050D1', boxShadow: '0 6px 16px rgba(0,98,254,0.3)' } }}
                        >
                            Add
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}

const inputStyles = {
    '& .MuiOutlinedInput-root': {
        bgcolor: '#F8FAFC',
        color: '#1A1A1A',
        borderRadius: 2,
        '& fieldset': { borderColor: '#E2E8F0' },
        '&:hover fieldset': { borderColor: '#CBD5E1' },
        '&.Mui-focused fieldset': { borderColor: '#0062FE' },
    },
    '& .MuiInputBase-input': { fontSize: '0.9rem' }
};