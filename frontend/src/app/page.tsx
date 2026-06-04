'use client';

import { Box, Typography, Button, Container, Stack, Grid, Paper } from '@mui/material';
import Link from 'next/link';
import Header from './components/Header'; 
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function Home() {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', color: '#1A1A1A', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Header />
      
      <main>
        {/* HERO SECTION */}
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: 8, textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', md: '4.5rem' }, 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
              mx: 'auto',
              mb: 3,
              color: '#1A1A1A'
            }}
          >
            Seamless Career Setup and Professional Planning for Optimal Student Growth
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748B', 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
              mb: 5
            }}
          >
            EduPath AI is your objective, data-backed Virtual Industry Senior. We map your actual grades to real university requirements and provide the true starting salaries of your dream major.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={6}>
            <Button 
              variant="contained" 
              component={Link}
              href="/signup"
              sx={{ 
                bgcolor: '#0062FE', 
                color: 'white', 
                borderRadius: '50px', 
                px: 5, 
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#0050d1', boxShadow: 'none' }
              }}
            >
              Get Started for Free
            </Button>
          </Stack>

          {/* Hero Image Cards */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mt={6}>
            <Box sx={{ 
              flex: { xs: 'none', md: 1 },
              width: '100%',
              minHeight: '340px', 
              borderRadius: '24px', 
              backgroundImage: 'url("/Card 1.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 16, 
                left: 16, 
                width: '85%',
                maxWidth: '360px',
                bgcolor: '#0062FE', 
                p: 2.5, 
                borderRadius: '16px',
                color: 'white',
                textAlign: 'left',
                zIndex: 2,
                boxShadow: '0 10px 20px rgba(0, 98, 254, 0.3)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>Find Your True Path</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Discover your core personality and working style through our advanced RIASEC assessment tailored for students.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" size="small" component={Link} href="/signup" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '50px', textTransform: 'none', px: 2, py: 0.5, fontSize: '0.8rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>Take Assessment</Button>
                </Stack>
              </Box>
            </Box>

            <Box sx={{ 
              flex: { xs: 'none', md: 1 },
              width: '100%',
              minHeight: '340px', 
              borderRadius: '24px', 
              backgroundImage: 'url("/Card 2.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 16, 
                left: 16, 
                width: '85%',
                maxWidth: '360px',
                bgcolor: '#0062FE', 
                p: 2.5, 
                borderRadius: '16px',
                color: 'white',
                textAlign: 'left',
                zIndex: 2,
                boxShadow: '0 10px 20px rgba(0, 98, 254, 0.3)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>Data-Driven Counseling</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Get expert counseling based on DOSM data, real university requirements, and AI-replacement risk analysis.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" size="small" component={Link} href="/signup" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '50px', textTransform: 'none', px: 2, py: 0.5, fontSize: '0.8rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>Meet Counselor</Button>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Container>

        {/* WHO WE HELP SECTION (DARK) */}
        <Box id="features" sx={{ bgcolor: '#1A1A1A', color: 'white', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Typography variant="overline" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 1 }}>WHO WE HELP</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, maxWidth: '800px', mt: 2, mb: 8, lineHeight: 1.2 }}>
              Empowering Students, Counselors, and Educational Institutions
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
              {[
                { 
                  img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop", 
                  text: "High School Students discovering their true passion and finding the perfect university major that matches their personality and grades."
                },
                { 
                  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop", 
                  text: "Educational Counselors streamlining administrative tasks and providing data-driven, objective advice to students instantly."
                },
                { 
                  img: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop", 
                  text: "Universities connecting with the right students and showcasing programs to candidates who genuinely fit their requirements."
                }
              ].map((card, idx) => (
                <Box key={idx} sx={{ flex: 1 }}>
                  <Box sx={{ 
                    height: '420px', 
                    borderRadius: '20px', 
                    mb: 3,
                    backgroundImage: `url(${card.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.5, color: '#F8FAFC' }}>
                    {card.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>

        {/* WHY CHOOSE US SECTION */}
        <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={10}>
              <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: 1 }}>WHY CHOOSE US</Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, maxWidth: '800px', mx: 'auto', mt: 2, color: '#1A1A1A', lineHeight: 1.2 }}>
                From Assessment to Application, We Guide You
              </Typography>
            </Box>

            <Stack id="pathways" direction={{ xs: 'column', md: 'row' }} spacing={8} alignItems="center" mb={10}>
              <Box sx={{ flex: 1, width: '100%' }}>
                <Box sx={{ 
                  height: '400px', 
                  borderRadius: '24px', 
                  backgroundImage: 'url("/data_counseling.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: '2rem', color: '#1A1A1A' }}>
                  Data-Driven Insights for Your Career Path
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', mb: 4, lineHeight: 1.7 }}>
                  We take a proactive approach to help you make informed educational decisions. By leveraging DOSM data and AI risk analysis, we ensure you choose a major with a bright future.
                </Typography>
                <Button variant="outlined" component={Link} href="/signup" sx={{ borderRadius: '50px', textTransform: 'none', color: '#0062FE', borderColor: '#E2E8F0', px: 3, '&:hover': { borderColor: '#0062FE' } }}>
                  Learn more →
                </Button>
              </Box>
            </Stack>

            <Stack id="assessments" direction={{ xs: 'column', md: 'row' }} spacing={8} alignItems="center">
              <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: '2rem', color: '#1A1A1A' }}>
                  Comprehensive Personality & Academic Assessments
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', mb: 4, lineHeight: 1.7 }}>
                  Our advanced RIASEC test maps your core working style, while our academic calculator automatically matches your actual grades to real university requirements.
                </Typography>
                <Button variant="outlined" component={Link} href="/signup" sx={{ borderRadius: '50px', textTransform: 'none', color: '#0062FE', borderColor: '#E2E8F0', px: 3, '&:hover': { borderColor: '#0062FE' } }}>
                  Take Assessment →
                </Button>
              </Box>
              <Box sx={{ flex: 1, width: '100%', order: { xs: 1, md: 2 } }}>
                <Box sx={{ 
                  height: '400px', 
                  borderRadius: '24px', 
                  backgroundImage: 'url("/assessment_illustration.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                </Box>
              </Box>
            </Stack>

          </Container>
        </Box>

        {/* STATS SECTION (DARK) */}
        <Box id="testimonials" sx={{ bgcolor: '#1A1A1A', color: 'white', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 1 }}>REAL DATA, REAL RESULT</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mx: 'auto', mt: 2, mb: 4, lineHeight: 1.2, maxWidth: '800px' }}>
              Exemplifying Excellence Through Numbers
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.7, mx: 'auto', maxWidth: '700px', mb: 8 }}>
              Hear from real students who made the switch to the leading career management software. Join the ranks of thriving students that trust EduPath AI.
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              {[
                { stat: "50k+", label: "Students assessed globally*" },
                { stat: "98%", label: "Accuracy in university requirement matching*" },
                { stat: "2,000+", label: "Individual career pathways generated*" },
                { stat: "150+", label: "Partnered universities & institutions" }
              ].map((item, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>{item.stat}</Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>{item.label}</Typography>
                </Grid>
              ))}
            </Grid>
            
            {/* Logos placeholder */}
            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center', opacity: 0.5, flexWrap: 'wrap', gap: { xs: 4, md: 8 } }}>
               <Typography variant="h5" fontWeight="bold">Oxford</Typography>
               <Typography variant="h5" fontWeight="bold">Harvard</Typography>
               <Typography variant="h5" fontWeight="bold">Stanford</Typography>
               <Typography variant="h5" fontWeight="bold">Cambridge</Typography>
               <Typography variant="h5" fontWeight="bold">MIT</Typography>
            </Box>
          </Container>
        </Box>

      </main>
    </Box>
  );
}