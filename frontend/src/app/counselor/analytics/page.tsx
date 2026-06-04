"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import Cookies from "js-cookie";
import { API_URL } from '@/app/utils/api';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type AnalyticsItem = {
  label: string;
  value: number;
};

type PipelineItem = {
  month: string;
  completed: number;
  pending: number;
  notattempted?: number;
  notAttempted?: number;
};

export default function CounselorAnalyticsPage() {
  const [riasecApiData, setRiasecApiData] = useState<AnalyticsItem[]>([]);
  const [courseApiData, setCourseApiData] = useState<AnalyticsItem[]>([]);
  const [pipelineApiData, setPipelineApiData] = useState<PipelineItem[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = Cookies.get("accessToken"); 
        
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };

        const [riasecRes, courseRes, pipelineRes] = await Promise.all([
          fetch(`${API_URL}/api/counselor/analytics/riasec`, { headers }),
          fetch(`${API_URL}/api/counselor/analytics/courses`, { headers }),
          fetch(`${API_URL}/api/counselor/analytics/academic-pipeline-monthly`, { headers })
        ]);

        const riasecData = await riasecRes.json();
        const courseData = await courseRes.json();
        const pipelineData = await pipelineRes.json();

        setRiasecApiData(Array.isArray(riasecData) ? riasecData : []);
        setCourseApiData(Array.isArray(courseData) ? courseData : []);
        setPipelineApiData(Array.isArray(pipelineData) ? pipelineData : []);

      } catch (error) {
        console.error("Error fetching analytics data with token:", error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const toPercentLabels = (labels: string[], data: number[]) => {
    const total = data.reduce((sum, value) => sum + value, 0);

    return labels.map((label, index) => {
      const percent = total === 0 ? 0 : ((data[index] / total) * 100).toFixed(1);
      return `${label} (${percent}%)`;
    });
  };

  const riasecData = {
    labels: toPercentLabels(
      riasecApiData.map((item) => item.label),
      riasecApiData.map((item) => item.value)
    ),
    datasets: [
      {
        data: riasecApiData.map((item) => item.value),
        backgroundColor: ["#0062FE", "#10B981", "#A855F7", "#F59E0B", "#EF4444", "#eb56b2"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const courseData = {
    labels: toPercentLabels(
      courseApiData.map((item) => item.label),
      courseApiData.map((item) => item.value)
    ),
    datasets: [
      {
        data: courseApiData.map((item) => item.value),
        backgroundColor: [
          "#0062FE", "#3B82F6", "#60A5FA", "#93C5FD",
          "#10B981", "#34D399", "#6EE7B7",
          "#A855F7", "#C084FC", "#D8B4FE",
          "#F59E0B", "#FCD34D"
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const pipelineData = {
    labels: pipelineApiData.map((item) => item.month),
    datasets: [
      {
        label: "Completed Assessment",
        data: pipelineApiData.map((item) => item.completed),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.4,
        pointRadius: 5,
      },
      {
        label: "Pending Assessment",
        data: pipelineApiData.map((item) => item.pending),
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
        pointRadius: 5,
      },
      {
        label: "Not Attempted",
        data: pipelineApiData.map((item) => item.notattempted ?? item.notAttempted),
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#64748B", font: { size: 11 } }, grid: { color: "#F1F5F9" } },
      y: { beginAtZero: true, ticks: { color: "#64748B", stepSize: 1 }, grid: { color: "#F1F5F9" } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { color: "#475569", padding: 18, font: { size: 12 } },
      },
    },
  };

  const pipelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#475569", font: { size: 12 } },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Month", color: "#64748B" },
        ticks: { color: "#64748B" },
        grid: { color: "#F1F5F9" },
      },
      y: {
        title: { display: true, text: "Number of Students", color: "#64748B" },
        beginAtZero: true,
        ticks: { color: "#64748B", stepSize: 5 },
        grid: { color: "#F1F5F9" },
      },
    },
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box mb={5}>
          <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
            Cohort Analytics
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 16 }}>
            Deep dive into population trends and academic pipelines.
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
            gap: 4 
          }}
        >
          <Paper elevation={0} sx={cardStyle}>
            <Typography variant="h5" sx={{ color: '#1A1A1A', fontWeight: 800, mb: 3 }}>
              RIASEC Demographics
            </Typography>
            <Box sx={{ height: 380 }}>
              <Pie data={riasecData} options={pieOptions} />
            </Box>
          </Paper>

          <Paper elevation={0} sx={cardStyle}>
            <Typography variant="h5" sx={{ color: '#1A1A1A', fontWeight: 800, mb: 3 }}>
              Course Popularity
            </Typography>
            <Box sx={{ height: 380 }}>
              <Bar data={courseData} options={chartOptions} />
            </Box>
          </Paper>
        </Box>

        <Paper elevation={0} sx={{ ...cardStyle, mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#1A1A1A', fontWeight: 800, mb: 3 }}>
            Academic Eligibility Pipeline
          </Typography>
          <Box sx={{ height: 400 }}>
            <Line data={pipelineData} options={pipelineOptions} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const cardStyle = {
  bgcolor: "white",
  borderRadius: 4,
  p: 4,
  border: "1px solid #E2E8F0",
  boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
};