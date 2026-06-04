'use client';

import { Modal, Box, Typography, TextField, Button, IconButton, Stack, InputAdornment} from '@mui/material';
import { X, Briefcase, Banknote, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCookie, useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface CareerData {
    id: number;
    name: string;   
    salary: string;
    risk: string;
}

interface EditCareerModalProps {
    open: boolean;
    handleClose: () => void;
    careerData: CareerData | null;
    onSuccess: () => void;
}

export default function EditCareerModal({ open, handleClose, careerData, onSuccess }: EditCareerModalProps) {
    const [name, setName] = useState('');
    const [salary, setSalary] = useState('');
    const [risk, setRisk] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (careerData) {
            setName(careerData.name);
            setSalary(careerData.salary);
            setRisk(careerData.risk ? careerData.risk.replace('%', '') : '');
        }
    }, [careerData, open]);

    const handleSubmit = async () => {
        if (!careerData?.id) {
            toast.error("Invalid career data");
            return;
        }

        if (!name.trim()) {
            toast.error("Career name cannot be empty");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = getCookie('accessToken');
            const response = await fetch(`${API_URL}/api/career/update/${careerData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    name: name.trim(),
                    salary: salary.trim(),
                    risk: risk.trim()
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            toast.success('Career name updated successfully');
            onSuccess(); 
            handleClose(); 
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
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
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                outline: 'none',
            }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 600 }}>
                        Edit Career Information
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'grey.500' }}>
                        <X size={20} />
                    </IconButton>
                </Box>

                <Stack spacing={3}>
                    {/* Career Name*/}
                    <Box>
                        <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                            <Briefcase size={14} color="#3b82f6" /> Career Name
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    {/* Salary Range*/}
                    <Box>
                        <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                            <Banknote size={14} color="#10b981"/> Starting Salary Range
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                            value={salary}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val !== '' && /[^0-9\s\-,]/.test(val)) {
                                    toast.error('Starting Salary Range only accepts numbers (and symbols like - or ,)');
                                    return;
                                }
                                setSalary(val);
                            }}
                        />
                    </Box>

                    {/* AI Risk - cannot edit */}
                    <Box>
                        <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                            <ShieldAlert size={14} color="#f59e0b"/> AI Replacement Risk
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                            value={risk}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val !== '' && /[^0-9]/.test(val)) {
                                    toast.error('AI Replacement Risk only accepts numbers');
                                    return;
                                }
                                setRisk(val);
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end" sx={{ '& .MuiTypography-root': { color: 'grey.500' } }}>%</InputAdornment>,
                            }}
                        />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            onClick={handleClose}
                            sx={{ color: '#64748b', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#f1f5f9' } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            variant="contained"
                            sx={{ 
                                bgcolor: '#0062FE', 
                                color: 'white', 
                                fontWeight: 600, 
                                borderRadius: 2, 
                                textTransform: 'none', 
                                px: 4,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#0052d4', boxShadow: 'none' },
                                '&.Mui-disabled': { bgcolor: '#cbd5e1', color: 'white' }
                            }}
                        >
                            {isSubmitting ? 'Saving...' : 'Update'}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}

const inputStyles = {
    '& .MuiOutlinedInput-root': {
        bgcolor: '#f8fafc',
        color: '#0f172a',
        borderRadius: 2,
        '& fieldset': { borderColor: '#e2e8f0' },
        '&:hover fieldset': { borderColor: '#cbd5e1' },
        '&.Mui-focused fieldset': { borderColor: '#0062FE' },
    },
    '& .MuiInputBase-input': { fontSize: '0.9rem' }
};