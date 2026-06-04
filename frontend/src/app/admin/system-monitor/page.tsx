'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper, Chip, Stack, LinearProgress, CircularProgress, Skeleton } from '@mui/material';
import { Activity, BookOpen, Database, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import Pagination from '@/app/components/Pagination';
import { getCookie } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface LatencyData {
  dbLatency: number | null;
  aiLatency: number | null;
  aiUsage: number | null;
  loading: boolean;
  error: boolean;
}

interface SystemLogData {
  id: number;
  timestamp: string; 
  level: string;    
  message: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, bg, statusLabel, statusColor, statusBg, progress, loading }: any) => (
  <Paper elevation={0} sx={{ 
    p: 3, 
    bgcolor: 'white', 
    border: '1px solid #E2E8F0', 
    borderRadius: 4,
    width: { xs: '100%', sm: '280px' },
    height: '165px', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#CBD5E1',
      boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
    }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: iconColor }}>
      <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B' }}>{title}</Typography>
    </Box>

    {loading ? (
      <CircularProgress size={24} sx={{ color: iconColor, mt: 1.5, mb: 1 }} />
    ) : (
      <Typography variant="h4" sx={{ mt: 1, fontWeight: 900, color: '#1A1A1A' }}>{value}</Typography>
    )}

    {subtitle && !loading && (
      <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5, fontWeight: 600 }}>
        {subtitle}
      </Typography>
    )}

    {progress !== undefined && !loading && (
      <Box sx={{ my: 1, width: '100%', px: 2 }}> 
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6, 
            borderRadius: 5,
            bgcolor: '#F1F5F9', 
            '& .MuiLinearProgress-bar': {
              bgcolor: iconColor,
              borderRadius: 5
            }
          }} 
        />
      </Box>
    )}

    {statusLabel && !loading &&(
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, color: statusColor || '#10B981', bgcolor: statusBg || '#ECFDF5', px: 1.5, py: 0.5, borderRadius: 2 }}>
        <CheckCircle size={14} /> 
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{statusLabel}</Typography>
      </Box>
    )}
  </Paper>
);


const LogLevelChip = ({ label, color, bg, border }: { label: string, color: string, bg: string, border: string }) => (
  <Chip 
    label={label} 
    size="small" 
    sx={{ 
      bgcolor: bg, 
      color: color, 
      border: `1px solid ${border}`, 
      borderRadius: 1.5,
      fontWeight: 800,
      fontSize: '0.65rem',
      height: '22px',
      fontFamily: 'monospace',
      '& .MuiChip-label': { px: 1 } 
    }} 
  />
);

export default function SystemMonitor() {
  const [metrics, setMetrics] = useState<LatencyData>({
    dbLatency: null,
    aiLatency: null,
    aiUsage: null,
    loading: true,
    error: false
  });

  const [logs, setLogs] = useState<SystemLogData[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const getLogStyle = (level: string) => {
    switch(level) {
      case 'INFO': return { color: '#0062FE', bg: '#EFF6FF', border: '#BFDBFE' };  
      case 'WARN': return { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' };  
      case 'ERROR': return { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }; 
      default: return { color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' };      
    }
  };

  const formatLogTime = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return timestampStr;
    }
  };

  const fetchLatencyMetrics = async () => {
    setMetrics(prev => ({ ...prev, loading: true, error: false }));
    try {
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/open-router/latency/measurement`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      setMetrics({
        dbLatency: data.dbLatency,
        aiLatency: data.aiLatency,
        aiUsage: data.aiUsage,
        loading: false,
        error: false
      });
    } catch (err) {
      console.error('Failed to fetch system metrics:', err);
      setMetrics(prev => ({ ...prev, loading: false, error: true }));
    }
  };

  const fetchSystemLogs = async () => {
    setLogsLoading(true);
    try {
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/system-log/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 204) {
        setLogs([]); 
      } else if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(sortedData); 
        setPage(0);
      }
    } catch (err) {
      console.error('Failed to fetch system logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleRefreshAll = () => {
    fetchLatencyMetrics();
    fetchSystemLogs();
  };

  useEffect(() => {
    handleRefreshAll();
    
    // Set to automatically poll and refresh every 5 minutes
    const interval = setInterval(handleRefreshAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (latency: number | null, type: 'db' | 'ai') => {
    if (latency === null || latency === -1) return { label: 'Unavailable', color: '#64748B', bg: '#F1F5F9' };
    
    if (type === 'db') {
      return latency < 50 ? { label: 'Optimal', color: '#10B981', bg: '#ECFDF5' } : { label: 'Degraded', color: '#F59E0B', bg: '#FFFBEB' };
    } else {
      return latency < 500 ? { label: 'Optimal', color: '#10B981', bg: '#ECFDF5' } : { label: 'High Latency', color: '#F59E0B', bg: '#FFFBEB' };
    }
  };

  const dbStatus = getStatusConfig(metrics.dbLatency, 'db');
  const aiStatus = getStatusConfig(metrics.aiLatency, 'ai');

  const displayedLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">

        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            System Monitor
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Real-time monitoring of API latency, database health, and system logs.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 4, md: 4 },
            mb: 4, 
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center' 
          }}>
            <StatCard 
              title="AI API Latency" 
              value={metrics.error ? "Error" : (metrics.aiLatency === -1 ? "N/A" : `${metrics.aiLatency ?? 0}ms`)}
              icon={BookOpen} 
              iconColor="#0062FE"
              bg="#EFF6FF" 
              statusLabel={metrics.error ? "Unavailable" : aiStatus.label}
              statusColor={metrics.error ? "#EF4444" : aiStatus.color} 
              statusBg={metrics.error ? "#FEF2F2" : aiStatus.bg}
              loading={metrics.loading}
            />
            
            <StatCard 
              title="PostgreSQL Latency" 
              value={metrics.error ? "Error" : `${metrics.dbLatency ?? 0}ms`}
              icon={Database} 
              iconColor="#10B981" 
              bg="#ECFDF5"
              statusLabel={metrics.error ? "Unavailable" : dbStatus.label} 
              statusColor={metrics.error ? "#EF4444" : dbStatus.color}
              statusBg={metrics.error ? "#FEF2F2" : dbStatus.bg}
              loading={metrics.loading}
            />
            
            <StatCard 
              title="AI API Usage" 
              value={metrics.error ? "Error" : (metrics.aiUsage?.toLocaleString() ?? "0")}
              subtitle="requests total" 
              icon={Activity} 
              iconColor="#F59E0B"
              bg="#FFFBEB"
              loading={metrics.loading}
            />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', px: { xs: 2, sm: 0 }, mb: 2 }}>
            <Chip
              icon={<RefreshCw size={14} className={metrics.loading ? 'animate-spin' : ''} style={{ color: '#64748B' }} />}
              label="Click to Refresh"
              onClick={fetchLatencyMetrics}
              size="small"
              sx={{ color: '#64748B', bgcolor: 'white', border: '1px solid #E2E8F0', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' } }}
            />
          </Box>
        </Grid>

        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            pb: 3, 
            bgcolor: 'white', 
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#1A1A1A' }}>
              <Clock size={20} color="#0062FE" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Live System Logs</Typography>
            </Box>
            
            <Chip 
              label="Live" 
              size="small" 
              sx={{ 
                bgcolor: '#ECFDF5', 
                color: '#10B981',
                border: '1px solid #A7F3D0',
                borderRadius: 4,
                fontWeight: 700,
                fontSize: '0.7rem',
                height: '24px',
                '& .MuiChip-label': { 
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': { 
                    content: '""',
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    mr: 0.75
                  }
                }
              }} 
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={0}>
              {logsLoading ? (
                [1, 2, 3].map((n) => (
                  <Box key={n} sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid #F1F5F9' }}>
                    <Skeleton variant="text" sx={{ bgcolor: '#F1F5F9', width: '80px' }} />
                    <Skeleton variant="rounded" sx={{ bgcolor: '#F1F5F9', width: '50px', height: '20px' }} />
                    <Skeleton variant="text" sx={{ bgcolor: '#F1F5F9', flex: 1 }} />
                  </Box>
                ))
              ) : logs.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', py: 4, fontWeight: 600 }}>
                  No logs recorded yet.
                </Typography>
              ) : (
                displayedLogs.map((log, index) => {
                  const style = getLogStyle(log.level);
                  return (
                    <Box 
                      key={log.id || index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        py: 2, 
                        borderBottom: index !== displayedLogs.length - 1 ? '1px solid #F1F5F9' : 'none' 
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#64748B', width: { xs: '80px', sm: '100px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontFamily: "'Monospace', sans-serif", fontWeight: 600 }}>
                        {formatLogTime(log.timestamp)}
                      </Typography>
                      
                      <Box sx={{ width: '70px', display: 'flex', justifyContent: 'center' }}>
                        <LogLevelChip label={log.level} color={style.color} bg={style.bg} border={style.border} />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: '#1A1A1A', flex: 1, lineHeight: 1.6, fontWeight: 500 }}>
                        {log.message}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Stack>
          </Box>

          {!logsLoading && logs.length > 0 && (
            <Box sx={{ mt: 2, pt: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid #E2E8F0' }}>
              <Pagination
                totalPages={Math.ceil(logs.length / rowsPerPage)}
                currentPage={page}
                onPageChange={(newPage) => setPage(newPage)}
                theme="light"
              />
            </Box>
          )}
        </Paper>

      </Container>
    </Box>
  );
}