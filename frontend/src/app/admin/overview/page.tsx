'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Skeleton } from '@mui/material';
import { Users, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface DashboardStats {
  totalCourses: number;
  activeUsers: number; 
  totalUniversities: number; 
  totalCareers: number;
  apiUsage?: string;
  alerts?: number;
}

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, bg, isLoading }: any) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 3, 
      bgcolor: 'white', 
      border: '1px solid #E2E8F0', 
      borderRadius: 4, 
      height: '165px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#CBD5E1',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: bg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} />
      </Box>
      <Typography sx={{ fontWeight: 600, color: '#64748B', fontSize: 14 }}>{title}</Typography>
    </Box>

    {isLoading ? (
      <Skeleton variant="text" sx={{ bgcolor: '#F1F5F9', fontSize: '2.5rem', width: '60%' }} />
    ) : (
      <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, color: '#1A1A1A' }}>{value}</Typography>
    )}

    <Typography sx={{ color: '#94A3B8', fontSize: 13, mt: 1, fontWeight: 500 }}>{subtitle}</Typography>
  </Paper>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getCookie('accessToken');
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">

        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            System Administrator
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Manage database rules, access control, and monitor system health.
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: 5, 
            mb: 5, 
            bgcolor: 'white', 
            border: '1px solid #E2E8F0', 
            borderRadius: 4, 
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h4" sx={{ color: '#1A1A1A', fontWeight: 800 }}>
            System Overview
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16, lineHeight: 1.6, maxWidth: 800 }}>
            Welcome to the EduPath AI Admin Portal. The system is currently <strong style={{color: '#10B981'}}>running optimally</strong>. <br />
            Monitor database health, manage access control, and update MQA requirements from this dashboard.
          </Typography>
        </Paper>

        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
            gap: 3 
          }}
        >
          <StatCard 
            title="Total Courses" 
            value={stats?.totalCourses ?? 0} 
            subtitle="Active in MQA Database" 
            icon={BookOpen} 
            iconColor="#0062FE" 
            bg="#EFF6FF"
            isLoading={isLoading}
          />
          <StatCard 
            title="Active Users" 
            value={stats?.activeUsers ?? 0}
            subtitle="Across all roles" 
            icon={Users} 
            iconColor="#10B981"
            bg="#ECFDF5"
            isLoading={isLoading}
          />
          <StatCard 
            title="Total University" 
            value={stats?.totalUniversities ?? 0}
            subtitle="Active in University Database" 
            icon={GraduationCap}
            iconColor="#F59E0B"
            bg="#FFFBEB"
            isLoading={isLoading}
          />
          <StatCard 
            title="Total Career" 
            value={stats?.totalCareers ?? 0}
            subtitle="Active in Career Database" 
            icon={Briefcase}
            iconColor="#EF4444" 
            bg="#FEF2F2"
            isLoading={isLoading}
          />
        </Box>

      </Container>
    </Box>
  );
}