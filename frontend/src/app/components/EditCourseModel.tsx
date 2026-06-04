'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Typography, TextField, Button, IconButton, Stack, MenuItem, Select, FormControl } from '@mui/material';
import { X, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCookie, useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface Subject {
  id: string | number;
  track: string;
  name: string;
  grade: string;
}

interface CourseData {
  id: number | string;
  courseName: string;
  riasecCategory: string;
  scores: string[];
}

interface EditCourseModalProps {
  open: boolean;
  handleClose: () => void;
  courseData: CourseData | null; 
  onSuccess: () => void;
}

// 样式定义
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

export default function EditCourseModal({ open, handleClose, courseData, onSuccess }: EditCourseModalProps) {
  const [courseName, setCourseName] = useState('');
  const [riasecCategory, setRiasecCategory] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (open && courseData) {
      setCourseName(courseData.courseName || '');
      setRiasecCategory(courseData.riasecCategory || '');

      if (courseData.scores) {
        const parsedSubjects: Subject[] = courseData.scores.map((s, index) => {
          const match = s.match(/^(?:\[(.*?)\]\s*)?(.*?):\s*(.*)$/);
          if (match) {
            return { id: `existing-${index}`, track: match[1] || 'SPM', name: match[2]?.trim() || '', grade: match[3]?.trim() || '' };
          }
          const [name, grade] = s.split(': ');
          return { id: `existing-${index}`, track: 'SPM', name: name?.trim() || '', grade: grade?.trim() || '' };
        });
        setSubjects(parsedSubjects);
      }
    }
  }, [open, courseData]);

  const handleSubjectChange = (id: string | number, field: keyof Omit<Subject, 'id'>, value: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddSubject = () => {
    setSubjects(prev =>[...prev, { id: Date.now(), track: 'SPM', name: 'Malay', grade: 'A+' }]);
  };

  const handleRemoveSubject = (id: string | number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    } else {
      toast.error("At least one subject is required");
    }
  };

  const handleUpdate = async () => {
    if (!courseName.trim()) {
      toast.error('Course name cannot be empty');
      return;
    }
    
    const subjectNames = subjects.map(s => s.name);
    const duplicateName = subjectNames.find((name, index) => subjectNames.indexOf(name) !== index);

    if (duplicateName) {
      toast.error(`Subject "${duplicateName}" is selected more than once. Please remove duplicates.`);
      return;
    }

    if (!courseData) return;

    try {
      const payload = {
        courseName: courseName,
        riasecCategory: riasecCategory,
        subjects: subjects.map(s => ({
          track: s.track,
          name: s.name,
          grade: s.grade
        }))
      };

      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/subject/update/${courseData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update course');
      }

      toast.success('Course updated successfully!');
      onSuccess(); 
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      console.error('Update Error:', error);
      toast.error(`${errorMessage}. Check console for details.`);
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
          bgcolor: '#FFFFFF', 
          borderRadius: 3, 
          color: '#1A1A1A',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>Edit MQA Requirements</Typography>
          <IconButton onClick={handleClose} sx={{ color: '#94A3B8', '&:hover': { bgcolor: '#F1F5F9', color: '#1A1A1A' } }}><X size={20} /></IconButton>
        </Box>

        <Stack spacing={2.5}>
          <Box>
            <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>Course Name</Typography>
            <TextField 
              fullWidth 
              sx={inputSx} 
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>RIASEC Category</Typography>
            <FormControl fullWidth>
              <Select value={riasecCategory} onChange={(e) => setRiasecCategory(e.target.value)} sx={selectSx}>
                {['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'].map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 700 }}>MQA Minimum Scores</Typography>
            <Button startIcon={<Plus size={16}/>} size="small" onClick={handleAddSubject} sx={{ color: '#0062FE', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#EFF6FF' } }}>
              Add Subject
            </Button>
          </Box>

          {subjects.map((subject) => (
            <Box key={subject.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: '100%', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <FormControl sx={{ width: 100 }}>
                <Select
                  value={subject.track}
                  onChange={(e) => {
                    const newTrack = e.target.value;
                    const firstGrade = newTrack === 'SPM' ? spmGrades[0] : uecGrades[0];
                    handleSubjectChange(subject.id, 'track', newTrack);
                    handleSubjectChange(subject.id, 'grade', firstGrade);
                  }}
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
          <Button 
            variant="contained" 
            onClick={handleUpdate} 
            startIcon={<Save size={18} />} 
            sx={{ 
              bgcolor: '#0062FE', 
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,98,254,0.2)',
              '&:hover': { bgcolor: '#0050D1', boxShadow: '0 6px 16px rgba(0,98,254,0.3)' } 
            }}
          >
            Update Changes
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}