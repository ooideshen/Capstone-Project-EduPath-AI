'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Typography, TextField, Button, IconButton, Stack, MenuItem, Select, FormControl } from '@mui/material';
import { X, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#F8FAFC',
    color: '#1A1A1A',
    borderRadius: 2,
    '& fieldset': { borderColor: '#E2E8F0' },
    '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#0062FE' },
  },
  '& .MuiInputBase-input': { padding: '12px 14px' },
};

const selectSx = {
  bgcolor: '#F8FAFC',
  color: '#1A1A1A',
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0062FE' },
  '& .MuiSvgIcon-root': { color: '#64748B' }
};

const spmGrades = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E', 'G'];
const uecGrades = ['A1', 'A2', 'B3', 'B4', 'B5', 'B6', 'C7', 'C8', 'F9'];

interface AddCourseModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddCourseModal({ open, handleClose }: AddCourseModalProps) {
  const [universities, setUniversities] = useState<{ id: number, name: string }[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [riasecCategory, setRiasecCategory] = useState('Realistic');
  const [subjects, setSubjects] = useState([{ id: Date.now(), track: 'SPM', name: 'Malay', grade: 'A+' }]);

  useEffect(() => {
    if (open) {
      const fetchUniversities = async () => {
        try {
          const token = getCookie('accessToken');
          const response = await fetch(`${API_URL}/api/university/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          setUniversities(data);
        } catch (error) {
          console.error("Failed to fetch universities:", error);
        }
      };
      fetchUniversities();
    }
  }, [open]);

  const handleSubjectChange = (id: number, field: string, value: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Update track and reset grade atomically to avoid stale state
  const handleTrackChange = (id: number, newTrack: string) => {
    const firstGrade = newTrack === 'SPM' ? spmGrades[0] : uecGrades[0];
    setSubjects(prev => prev.map(s =>
      s.id === id ? { ...s, track: newTrack, grade: firstGrade } : s
    ));
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { id: Date.now(), track: 'SPM', name: 'Malay', grade: 'A+' }]);
  };

  const handleRemoveSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!selectedUniversityId || !courseName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // (Validation for duplicate subjects)
    const subjectNames = subjects.map(s => s.name);
    const hasDuplicates = subjectNames.some((name, index) => subjectNames.indexOf(name) !== index);

    if (hasDuplicates) {
      const duplicateName = subjectNames.filter((name, index) => subjectNames.indexOf(name) !== index)[0];
      toast.error(`Duplicate subject found: "${duplicateName}". Please select different subjects.`);
      return; 
    }

    try {
      const requestBody = {
        universityId: parseInt(selectedUniversityId),
        courseName: courseName,
        riasecCategory: riasecCategory,
        subjects: subjects.map(s => ({
          track: s.track,
          name: s.name,
          grade: s.grade
        }))
      };

      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/course/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      toast.success('Course and MQA requirements saved successfully!');

      setCourseName('');
      setSelectedUniversityId('');
      setSubjects([{ id: Date.now(), track: 'SPM', name: 'Malay', grade: 'A+' }]);
      handleClose();

    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || 'Operation failed. Please check backend logs.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableScrollLock={true}
      PaperProps={{
        sx: {
          width: 650,
          maxHeight: '90vh',
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          color: '#1A1A1A',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
            Add New Course & MQA Requirements
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#94A3B8', '&:hover': { bgcolor: '#F1F5F9', color: '#1A1A1A' } }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>University Name</Typography>
            <FormControl fullWidth>
              <Select
                value={selectedUniversityId}
                onChange={(e) => setSelectedUniversityId(e.target.value)}
                displayEmpty
                sx={selectSx}
              >
                <MenuItem value="" disabled><em>Select University</em></MenuItem>
                {universities.map((uni) => (
                  <MenuItem key={uni.id} value={uni.id.toString()}>{uni.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>Course Name</Typography>
            <TextField
              fullWidth
              placeholder="e.g. BSc Computer Science"
              sx={inputSx}
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>RIASEC Category</Typography>
          <FormControl fullWidth>
            <Select
              value={riasecCategory}
              onChange={(e) => setRiasecCategory(e.target.value)}
              sx={selectSx}
            >
              {['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'].map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 700 }}>MQA Minimum Scores</Typography>
          <Button startIcon={<Plus size={16} />} size="small" onClick={handleAddSubject} sx={{ color: '#0062FE', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#EFF6FF' } }}>
            Add Subject
          </Button>
        </Box>

        {subjects.map((subject) => (
          <Box key={subject.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: '100%', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <FormControl sx={{ width: 100 }}>
              <Select
                value={subject.track}
                onChange={(e) => handleTrackChange(subject.id, e.target.value)}
                sx={selectSx}
              >
                {['SPM', 'UEC'].map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <Select
                value={subject.name}
                onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)}
                sx={selectSx}
              >
                {['Malay', 'English', 'Moral', 'History', 'Mathematic', 'Science', 'Physic', 'Chemistry', 'Biology', 'Chinese', 'Business', 'Accounting', 'Economic', 'Art', 'Additional Mathematics', 'Computer Science'].map(sub => (
                  <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: 120 }}>
              <Select
                value={subject.grade}
                onChange={(e) => handleSubjectChange(subject.id, 'grade', e.target.value)}
                sx={selectSx}
              >
                {(subject.track === 'SPM' ? spmGrades : uecGrades).map(g => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton color="error" onClick={() => handleRemoveSubject(subject.id)} sx={{ '&:hover': { bgcolor: '#FEF2F2' } }}>
              <Trash2 size={18} />
            </IconButton>
          </Box>
        ))}
        </Stack>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleClose} sx={{ color: '#64748B', fontWeight: 600, '&:hover': { bgcolor: '#F1F5F9' } }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} startIcon={<Save size={18} />} sx={{ bgcolor: '#0062FE', color: 'white', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,98,254,0.2)', '&:hover': { bgcolor: '#0050D1', boxShadow: '0 6px 16px rgba(0,98,254,0.3)' } }}>
            Save Course
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}