'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Box, IconButton, Typography 
} from '@mui/material';
import { X } from 'lucide-react';
import { getCookie, useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface EditUserModalProps {
  open: boolean;
  handleClose: () => void;
  userData: User | null;
  onSuccess: () => void;
}

export default function EditUserModal({ open, handleClose, userData, onSuccess }: EditUserModalProps) {
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      setRole(userData.role);
    }
  }, [userData]);

  const handleSave = async () => {
    if (!userData) return;
    setIsSubmitting(true);
    try {
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/user/update/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role: role }), 
      });

      if (response.ok) {
        onSuccess();
        handleClose();
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledInputStyle = {
    '& .MuiOutlinedInput-root': { 
      bgcolor: '#f1f5f9', 
      borderRadius: 2,
    },
    '& .MuiOutlinedInput-input.Mui-disabled': {
      color: '#64748b',
      WebkitTextFillColor: '#64748b',
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      disableScrollLock={true}
      PaperProps={{
        sx: { bgcolor: '#ffffff', color: '#0f172a', borderRadius: 4, width: '100%', maxWidth: 400, border: '1px solid #e2e8f0', boxShadow: 24 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Edit User</Typography>
        <IconButton onClick={handleClose} sx={{ color: 'grey.500' }}><X size={20} /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* User Name*/}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 500 }}>User Name</Typography>
            <TextField 
              fullWidth 
              value={userData?.name || ''} 
              disabled 
              sx={disabledInputStyle}
            />
          </Box>

          {/* Email */}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 500 }}>Email Address</Typography>
            <TextField 
              fullWidth 
              value={userData?.email || ''} 
              disabled 
              sx={disabledInputStyle}
            />
          </Box>

          {/* Role*/}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontWeight: 500 }}>User Role</Typography>
            <TextField
              select
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', borderRadius: 2, color: '#0f172a' },
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#0062FE' },
                '& .MuiSvgIcon-root': { color: '#64748b' }
              }}
              SelectProps={{
                MenuProps: { PaperProps: { sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' } } }
              }}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="STUDENT">STUDENT</MenuItem>
              <MenuItem value="COUNSELOR">COUNSELOR</MenuItem>
            </TextField>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: '#64748b', textTransform: 'none', '&:hover': { bgcolor: '#f1f5f9' } }}>Cancel</Button>
        <Button 
          onClick={handleSave}
          disabled={isSubmitting}
          variant="contained" 
          sx={{ bgcolor: '#0062FE', color: 'white', borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#0052d4', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#cbd5e1', color: 'white' } }}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}