'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Button, LinearProgress, Fade, Stack, CircularProgress } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/app/utils/api';

const questions = [
  { question: 'I enjoy assembling and testing electronic components or hardware equipment.', type: 'Realistic', course: 'Software Engineering or Computer Engineering' },
  { question: 'I like formulating statistical structures and complex mathematical data models.', type: 'Investigative', course: 'Data Science or Artificial Intelligence' },
  { question: 'I enjoy creating interactive user interfaces and digital multimedia artwork designs.', type: 'Artistic', course: 'UI/UX Design or Interactive Media' },
  { question: 'I like helping people solve problems and guiding project teams smoothly.', type: 'Social', course: 'Information Technology Management' },
  { question: 'I prefer pitching business ideas and early-stage tech plans to executives.', type: 'Enterprising', course: 'Business Information Systems' },
  { question: 'I like structuring nested database schemas and organizing schedules systematically.', type: 'Conventional', course: 'Database Management or Cyber Security' },
  { question: 'I enjoy configuring computer network infrastructure and server host nodes.', type: 'Realistic', course: 'Network Computing or Cloud Architecture' },
  { question: 'I enjoy researching security breaches, data encryptions, and system flaws.', type: 'Investigative', course: 'Cyber Security & Forensic Computing' },
  { question: 'I like scripting creative software concepts, layouts, and front-end blueprints.', type: 'Artistic', course: 'Web Development & Creative Computing' },
  { question: 'I enjoy coordinating technical group projects and mentoring junior students.', type: 'Social', course: 'Information Technology Systems Support' },
  { question: 'I like managing product milestones, finances, and leading operational structures.', type: 'Enterprising', course: 'Tech Entrepreneurship or E-Commerce' },
  { question: 'I prefer updating software API logic logs and running clear system documentation.', type: 'Conventional', course: 'Systems Analysis or Software Quality Assurance' },
  { question: 'I like dealing with mechanical automation tools and computer hardware architecture.', type: 'Realistic', course: 'Robotics & Intelligent Systems' },
  { question: 'I prefer parsing high-velocity data records to find hidden user trends.', type: 'Investigative', course: 'Data Analytics or Big Data Science' },
  { question: 'I enjoy organizing marketing campaigns and client presentations for new tech systems.', type: 'Enterprising', course: 'Digital Marketing & IT Business Solutions' }
];

export default function RiasecPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ Realistic: 0, Investigative: 0, Artistic: 0, Social: 0, Enterprising: 0, Conventional: 0 });
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [dominantType, setDominantType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleAnswer = async (value: number) => {
    const currentType = questions[currentQuestion].type;
    setScores((prev) => ({
      ...prev,
      [currentType]: prev[currentType as keyof typeof prev] + value,
    }));

    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
      submitAssessment(newAnswers);
    }
  };

  const getHighestType = () => {
    if (dominantType) return dominantType;
    return Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  };

  const getRecommendedCourse = () => {
    const highestType = getHighestType();
    const match = questions.find(q => q.type === highestType);
    return match ? match.course : 'Computer Science';
  };

  const submitAssessment = async (finalAnswers: number[]) => {
    setIsSubmitting(true);
    try {
      const token = Cookies.get('accessToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/api/PersonalityAssessment/add`, {
        answers: finalAnswers
      }, config);
      
      const data = response.data;
      const results = {
        Realistic: data.realisticMark,
        Investigative: data.investigateMark,
        Artistic: data.artisticMark,
        Social: data.socialMark,
        Enterprising: data.enterprisingMark,
        Conventional: data.conventionalMark
      };
      
      const highest = Object.entries(results).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      setDominantType(highest);

      if (userId && data.id) {
        await axios.post(`${API_URL}/api/StudentProfile/personality/${userId}/${data.id}`, {}, config);
      }
      setTimeout(() => {
        router.push('/student/report');
      }, 3000);
    } catch (error) {
      console.error("Error submitting assessment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        
        <Box sx={{ mb: 5, pb: 3, borderBottom: '1px solid #E2E8F0' }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            Personality Assessment
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Take this comprehensive RIASEC questionnaire to identify your vocational traits.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 3, md: 6 }, bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          
          {!completed ? (
            <Fade in={true} timeout={400} key={currentQuestion}>
              <Box>
                <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 800, mb: 2, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
                <Typography sx={{ color: '#1A1A1A', fontSize: { xs: 20, md: 24 }, fontWeight: 700, mb: 5, lineHeight: 1.5, minHeight: 80 }}>
                  "{questions[currentQuestion].question}"
                </Typography>

                <Stack spacing={2}>
                  {[
                    { label: 'Strongly Agree', val: 4, color: '#0062FE', bg: 'white' },
                    { label: 'Agree', val: 3, color: '#0062FE', bg: 'white' },
                    { label: 'Neutral / Indifferent', val: 2, color: '#64748B', bg: 'white' },
                    { label: 'Disagree', val: 1, color: '#EF4444', bg: 'white' },
                    { label: 'Strongly Disagree', val: 0, color: '#EF4444', bg: 'white' }
                  ].map((btn) => (
                    <Button
                      key={btn.label}
                      fullWidth
                      variant="outlined"
                      onClick={() => handleAnswer(btn.val)}
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        textTransform: 'none',
                        color: '#1A1A1A',
                        fontWeight: 600,
                        fontSize: 15,
                        borderColor: '#E2E8F0',
                        background: btn.bg,
                        transition: 'all 0.2s ease',
                        justifyContent: 'center',
                        '&:hover': {
                          borderColor: btn.color,
                          bgcolor: 'rgba(0, 98, 254, 0.02)',
                          color: btn.color,
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }
                      }}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </Stack>

                <Box sx={{ mt: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ color: '#64748B', fontSize: 12, fontWeight: 700 }}>PROGRESS</Typography>
                    <Typography sx={{ color: '#0062FE', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((currentQuestion + 1) / questions.length) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#F1F5F9',
                      '& .MuiLinearProgress-bar': { bgcolor: '#0062FE', borderRadius: 4 }
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          ) : isSubmitting ? (
            <Fade in={true}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#0062FE', mb: 4 }} size={48} />
                <Typography variant="h5" sx={{ color: '#1A1A1A', fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
                  Analyzing Results...
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: 15 }}>
                  Please wait while our AI determines your vocational traits and recommended path.
                </Typography>
              </Box>
            </Fade>
          ) : (
            <Fade in={true}>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </Box>

                <Typography variant="h4" sx={{ color: '#1A1A1A', fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>
                  Assessment Completed
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: 15, mb: 5 }}>
                  Your answers have been analyzed and saved to your academic profile successfully.
                  <br/><span style={{ color: '#0062FE', fontWeight: 600 }}>Redirecting to your AI Reality Report in 3 seconds...</span>
                </Typography>

                {/* CSS GRID TO REPLACE MUI GRID */}
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                    gap: 3,
                    mb: 2 
                  }}
                >
                  <Box sx={{ p: 4, bgcolor: '#F8FAFC', borderRadius: 4, border: '1px solid #E2E8F0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
                      Dominant Trait
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#0062FE', fontWeight: 900 }}>
                      {getHighestType()}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 4, bgcolor: '#EFF6FF', borderRadius: 4, border: '1px solid #BFDBFE', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ color: '#0062FE', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
                      Recommended Field
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#1E3A8A', fontWeight: 800, textAlign: 'center' }}>
                      {getRecommendedCourse()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}

        </Paper>
      </Container>
    </Box>
  );
}
