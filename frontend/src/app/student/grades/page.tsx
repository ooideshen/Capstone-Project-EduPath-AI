'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Stack
} from '@mui/material';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

const subjectsList = [
  { label: 'Bahasa Melayu', key: 'malayGrade' },
  { label: 'English Language', key: 'englishGrade' },
  { label: 'History', key: 'historyGrade' },
  { label: 'Pendidikan Moral / Islamic Studies', key: 'moralGrade' },
  { label: 'Mathematics', key: 'mathematicGrade' },
  { label: 'Science', key: 'scienceGrade' },
  { label: 'Additional Mathematics', key: 'addMathGrade' },
  { label: 'Physics', key: 'physicGrade' },
  { label: 'Chemistry', key: 'chemistryGrade' },
  { label: 'Biology', key: 'biologyGrade' },
  { label: 'Chinese Language', key: 'chineseGrade' },
  { label: 'Business Studies', key: 'businessGrade' },
  { label: 'Principles of Accounting', key: 'accountingGrade' },
  { label: 'Economics', key: 'economicGrade' },
  { label: 'Visual Arts', key: 'artGrade' },
  { label: 'Computer Science', key: 'computerGrade' }
];

const spmGradeOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A', label: 'A' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B', label: 'B' },
  { value: 'C+', label: 'C+' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'G', label: 'G' }
];

const uecGradeOptions = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B3', label: 'B3' },
  { value: 'B4', label: 'B4' },
  { value: 'B5', label: 'B5' },
  { value: 'B6', label: 'B6' },
  { value: 'C7', label: 'C7' },
  { value: 'C8', label: 'C8' },
  { value: 'F9', label: 'F9' }
];

export default function GradesPage() {
  const [track, setTrack] = useState('SPM');
  const [budget, setBudget] = useState(50000);
  const [grades, setGrades] = useState<Record<string, string>>({
    malayGrade: '', englishGrade: '', historyGrade: '', moralGrade: '',
    mathematicGrade: '', scienceGrade: '', addMathGrade: '', physicGrade: '',
    chemistryGrade: '', biologyGrade: '', chineseGrade: '', businessGrade: '',
    accountingGrade: '', economicGrade: '', artGrade: '', computerGrade: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  const handleTrackChange = (newTrack: string) => {
    setTrack(newTrack);
    setGrades({
      malayGrade: '', englishGrade: '', historyGrade: '', moralGrade: '',
      mathematicGrade: '', scienceGrade: '', addMathGrade: '', physicGrade: '',
      chemistryGrade: '', biologyGrade: '', chineseGrade: '', businessGrade: '',
      accountingGrade: '', economicGrade: '', artGrade: '', computerGrade: ''
    });
  };

  const handleGradeChange = (subjectKey: string, grade: string) => {
    setGrades(prev => ({ ...prev, [subjectKey]: grade }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("Please login to save your academic results.");
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const token = getCookie('accessToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const payload = {
        ...grades,
        track: track
      };
      const assessRes = await axios.post(`${API_URL}/api/AcademicAssessment/add`, payload, config);
      const assessmentId = assessRes.data.id;
      await axios.post(`${API_URL}/api/StudentProfile/academic/${userId}/${assessmentId}`, {}, config);
      toast.success('Academic results saved successfully!');
      setTimeout(() => {
        router.push('/student/riasec');
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save academic results.');
      setError('Failed to save academic results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        
        <Box sx={{ mb: 5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
              Academic Results Tracker
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: 15 }}>
              Input your grades and budget limits to personalize your AI recommendations.
            </Typography>
          </Box>
          
          <ToggleButtonGroup
            value={track}
            exclusive
            onChange={(_, val) => val && handleTrackChange(val)}
            sx={{ 
              bgcolor: '#F1F5F9', 
              border: '1px solid #E2E8F0', 
              p: 0.5, 
              borderRadius: 3 
            }}
          >
            {['SPM', 'UEC'].map((t) => (
              <ToggleButton 
                key={t} 
                value={t} 
                sx={{ 
                  color: '#64748B', 
                  border: 'none', 
                  px: 3, 
                  py: 0.8, 
                  borderRadius: 2, 
                  fontWeight: 600, 
                  fontSize: 13, 
                  textTransform: 'none',
                  '&.Mui-selected': { 
                    bgcolor: 'white', 
                    color: '#0062FE', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: 'white' } 
                  } 
                }}
              >
                {t} Track
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Paper sx={{ p: { xs: 3, md: 5 }, bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          
          <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', mb: 3 }}>
            Academic Subject Grades
          </Typography>

          <Stack spacing={2}>
            {subjectsList.map((sub) => (
              <Box 
                key={sub.key}
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  gap: 2
                }}
              >
                <Typography sx={{ color: '#1A1A1A', fontSize: 15, fontWeight: 600 }}>
                  {sub.label}
                </Typography>
                
                <TextField
                  select
                  size="small"
                  value={grades[sub.key]}
                  onChange={(e) => handleGradeChange(sub.key, e.target.value)}
                  label="Select Grade"
                  InputLabelProps={{ style: { color: '#64748B', fontSize: 14 } }}
                  sx={{
                    width: { xs: '100%', sm: '200px' },
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-root': {
                      color: '#1A1A1A',
                      fontSize: 14,
                      borderRadius: '8px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#CBD5E1' },
                      '&.Mui-focused fieldset': { borderColor: '#0062FE' },
                    }
                  }}
                >
                  {(track === 'SPM' ? spmGradeOptions : uecGradeOptions).map((g) => (
                    <MenuItem key={g.value} value={g.value} sx={{ fontSize: 14 }}>{g.label}</MenuItem>
                  ))}
                </TextField>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ borderColor: '#E2E8F0', my: 5 }} />

          {/* FINANCIAL CONSTRAINTS */}
          <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', mb: 3 }}>
            Financial Constraints
          </Typography>
          
          <Box sx={{ px: 1, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'baseline' }}>
              <Typography sx={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>Maximum Tuition Threshold</Typography>
              <Typography sx={{ color: '#1A1A1A', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                RM {budget.toLocaleString()}
              </Typography>
            </Box>
            <Slider
              value={budget}
              min={10000}
              max={200000}
              step={5000}
              onChange={(_, val) => setBudget(val as number)}
              sx={{
                color: '#0062FE',
                height: 8,
                '& .MuiSlider-thumb': { 
                  width: 24, 
                  height: 24, 
                  backgroundColor: 'white', 
                  border: '3px solid #0062FE', 
                  '&:hover, &.Mui-focusVisible': { boxShadow: '0px 0px 0px 8px rgba(0, 98, 254, 0.16)' } 
                },
                '& .MuiSlider-rail': { opacity: 1, backgroundColor: '#E2E8F0' }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography sx={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>RM 10,000</Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>RM 200,000</Typography>
            </Box>
          </Box>

          {error && <Typography sx={{ color: '#EF4444', fontSize: 14, mb: 3, textAlign: 'center', fontWeight: 500 }}>{error}</Typography>}

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="contained"
            sx={{
              py: 1.6,
              borderRadius: '50px',
              bgcolor: '#0062FE',
              fontWeight: 700,
              fontSize: 15,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0050D1', boxShadow: '0 8px 20px rgba(0,98,254,0.2)' },
              '&.Mui-disabled': { bgcolor: '#94A3B8', color: 'white' }
            }}
          >
            {isSubmitting ? 'Saving Results...' : 'Save Academic Profile'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
