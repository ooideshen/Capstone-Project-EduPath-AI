"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Chip, InputBase, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Pagination, Container, useMediaQuery, useTheme } from "@mui/material";
import { Search, Eye } from "lucide-react";
import Cookies from "js-cookie"; 
import { API_URL } from '@/app/utils/api';

type Student = {
  student_id?: number;
  studentId?: number;
  name: string;
  email: string;
  gender?: string | null;
  ai_reality_report?: string | null;
  aiRealityReport?: string | null;
  realistic_mark?: number | null;
  realisticMark?: number | null;
  investigate_mark?: number | null;
  investigateMark?: number | null;
  artistic_mark?: number | null;
  artisticMark?: number | null;
  social_mark?: number | null;
  socialMark?: number | null;
  enterprising_mark?: number | null;
  enterprisingMark?: number | null;
  conventional_mark?: number | null;
  conventionalMark?: number | null;
};

export default function CounselorStudentsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search]);
  
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const token = Cookies.get("accessToken");

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const res = await fetch(`${API_URL}/api/counselor/students`, { headers });
        const data = await res.json();

        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Student fetch error with token:", err);
      }
    };

    fetchStudentsData();
  }, []);

  const getTotalScore = (student: Student) =>
    (student.realistic_mark ?? student.realisticMark ?? 0) +
    (student.investigate_mark ?? student.investigateMark ?? 0) +
    (student.artistic_mark ?? student.artisticMark ?? 0) +
    (student.social_mark ?? student.socialMark ?? 0) +
    (student.enterprising_mark ?? student.enterprisingMark ?? 0) +
    (student.conventional_mark ?? student.conventionalMark ?? 0);

  const getRiasecCode = (student: Student) => {
    const traits = [
      { code: "R", value: student.realistic_mark ?? student.realisticMark ?? 0 },
      { code: "I", value: student.investigate_mark ?? student.investigateMark ?? 0 },
      { code: "A", value: student.artistic_mark ?? student.artisticMark ?? 0 },
      { code: "S", value: student.social_mark ?? student.socialMark ?? 0 },
      { code: "E", value: student.enterprising_mark ?? student.enterprisingMark ?? 0 },
      { code: "C", value: student.conventional_mark ?? student.conventionalMark ?? 0 },
    ];

    if (!traits.some((t) => t.value > 0)) return "-";

    return traits
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((t) => t.code)
      .join("-");
  };

  const getRisk = (student: Student, riasec: string) => {
    if (riasec === "-") return "Pending";
    const total = getTotalScore(student);
    if (total < 350) return "High";
    if (total < 410) return "Medium";
    return "Low";
  };

  const getStatus = (risk: string) => {
    if (risk === "Pending") return "Review Needed";
    if (risk === "High") return "At Risk";
    if (risk === "Medium") return "Monitor";
    return "On Track";
  };

  const getTopMatch = (riasec: string) => {
    if (riasec === "-") return "-";
    if (riasec.includes("I") && riasec.includes("C")) return "Data Scientist";
    if (riasec.includes("I") && riasec.includes("R")) return "Software Engineer";
    if (riasec.includes("A") && riasec.includes("S")) return "UI/UX Designer";
    if (riasec.includes("A")) return "Graphic Designer";
    if (riasec.includes("E")) return "Business Analyst";
    if (riasec.includes("S")) return "Psychologist";
    if (riasec.includes("R")) return "Mechanical Engineer";
    if (riasec.includes("C")) return "Accountant";
    return "Career Advisor Review";
  };

  const getRiskStyle = (risk: string) => {
    if (risk === "High") return { bgcolor: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" };
    if (risk === "Medium") return { bgcolor: "#FFFBEB", color: "#F59E0B", border: "1px solid #FDE68A" };
    if (risk === "Pending") return { bgcolor: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" };
    return { bgcolor: "#ECFDF5", color: "#10B981", border: "1px solid #A7F3D0" };
  };

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();
    return student.name?.toLowerCase().includes(keyword);
  });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const displayedStudents = filteredStudents.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} gap={3} mb={5}>
          <Box>
            <Typography variant="h3" sx={{ color: '#1A1A1A', fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
              Cohort Directory
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: 16 }}>
              Review individual student pathways and risk status.
            </Typography>
          </Box>

          <Box sx={{ ...searchBoxStyle, width: { xs: '100%', md: 350 }, boxSizing: 'border-box' }}>
            <Search size={18} color="#94A3B8" />
            <InputBase
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ color: "#1A1A1A", width: "100%", fontSize: 14 }}
            />
          </Box>
        </Box>

        <Paper elevation={0} sx={cardStyle}>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Box sx={{ minWidth: '1000px' }}>
              <Box sx={headerRowStyle}>
                {["Student ID", "Name", "RIASEC", "Top Match", "AI Risk", "Status", "Action"].map(
                  (head) => (
                    <Typography key={head} sx={{ color: "#64748B", fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
                      {head}
                    </Typography>
                  )
                )}
              </Box>

              {displayedStudents.map((student) => {
                const riasec = getRiasecCode(student);
                const risk = getRisk(student, riasec);
                const status = getStatus(risk);
                const riskStyle = getRiskStyle(risk);

                return (
                  <Box key={student.student_id ?? student.studentId} sx={bodyRowStyle}>
                    <Typography sx={{ color: '#64748B', fontWeight: 600, fontFamily: 'monospace' }}>
                      STU-{String(student.student_id ?? student.studentId).padStart(3, "0")}
                    </Typography>

                    <Typography sx={{ color: '#1A1A1A', fontWeight: 700 }}>
                      {student.name}
                    </Typography>

                    <Chip label={riasec} sx={riasecChipStyle} />

                    <Typography sx={{ color: '#475569', fontWeight: 500 }}>
                      {getTopMatch(riasec)}
                    </Typography>

                    <Chip
                      label={risk}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        width: "fit-content",
                        bgcolor: riskStyle.bgcolor,
                        color: riskStyle.color,
                        border: riskStyle.border
                      }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: riskStyle.color }} />
                      <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: 14 }}>
                        {status}
                      </Typography>
                    </Box>

                    <Button 
                      startIcon={<Eye size={15} />} 
                      sx={viewButtonStyle}
                      onClick={() => setSelectedStudent(student)}
                    >
                      View
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" p={3} borderTop="1px solid #E2E8F0">
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_, value) => setPage(value)} 
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#64748B",
                    fontWeight: 600
                  },
                  "& .Mui-selected": {
                    bgcolor: "#EFF6FF !important",
                    color: "#0062FE",
                    fontWeight: 800
                  }
                }}
              />
            </Box>
          )}
        </Paper>

      {selectedStudent && (
          <Dialog 
            open={!!selectedStudent} 
            onClose={() => setSelectedStudent(null)}
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                bgcolor: 'white',
                border: { xs: 'none', sm: '1px solid #E2E8F0' },
                borderRadius: { xs: 0, sm: '20px' },
                width: { xs: '100%', sm: '90%', md: '500px' },
                maxWidth: '500px',
                maxHeight: { xs: '100%', sm: '90vh' },
                color: '#1A1A1A',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                m: { xs: 0, sm: 2 },
                overflowY: 'auto',
              }
            }}
          >
            <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0', pb: 2, pt: 3, px: { xs: 2.5, sm: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', fontSize: { xs: 20, sm: 24 } }}>Student Details</Typography>
              <Typography sx={{ color: '#64748B', fontSize: 14, mt: 0.5, fontWeight: 500 }}>
                STU-{String(selectedStudent.student_id ?? selectedStudent.studentId).padStart(3, "0")} | {selectedStudent.name}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ py: 3, px: { xs: 2.5, sm: 4 } }}>
            <Box mb={3}>
              <Typography sx={{ fontWeight: 800, color: "#1A1A1A", fontSize: 20 }}>
                {selectedStudent.name}
              </Typography>

              <Typography
                component="a"
                href={`mailto:${selectedStudent.email}`}
                sx={{
                  color: "#0062FE",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {selectedStudent.email}
              </Typography>
            </Box>
              <Typography sx={{ color: '#0062FE', fontWeight: 800, mb: 2, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.5px' }}>
                RIASEC Score Breakdown
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box p={2} bgcolor="#F8FAFC" borderRadius={3} border="1px solid #E2E8F0">
                  <Typography color="#64748B" fontSize={12} fontWeight={700}>Realistic (R)</Typography>
                  <Typography variant="h6" fontWeight="900" color="#1A1A1A">{selectedStudent.realistic_mark ?? selectedStudent.realisticMark ?? 0}</Typography>
                </Box>
                <Box p={2} bgcolor="#F8FAFC" borderRadius={3} border="1px solid #E2E8F0">
                  <Typography color="#64748B" fontSize={12} fontWeight={700}>Investigative (I)</Typography>
                  <Typography variant="h6" fontWeight="900" color="#1A1A1A">{selectedStudent.investigate_mark ?? selectedStudent.investigateMark ?? 0}</Typography>
                </Box>
                <Box p={2} bgcolor="#F8FAFC" borderRadius={3} border="1px solid #E2E8F0">
                  <Typography color="#64748B" fontSize={12} fontWeight={700}>Artistic (A)</Typography>
                  <Typography variant="h6" fontWeight="900" color="#1A1A1A">{selectedStudent.artistic_mark ?? selectedStudent.artisticMark ?? 0}</Typography>
                </Box>
                <Box p={2} bgcolor="#F8FAFC" borderRadius={3} border="1px solid #E2E8F0">
                  <Typography color="#64748B" fontSize={12} fontWeight={700}>Social (S)</Typography>
                  <Typography variant="h6" fontWeight="900" color="#1A1A1A">{selectedStudent.social_mark ?? selectedStudent.socialMark ?? 0}</Typography>
                </Box>
                <Box p={2} bgcolor="#F8FAFC" borderRadius={3} border="1px solid #E2E8F0">
                  <Typography color="#64748B" fontSize={12} fontWeight={700}>Enterprising (E)</Typography>
                  <Typography variant="h6" fontWeight="900" color="#1A1A1A">{selectedStudent.enterprising_mark ?? selectedStudent.enterprisingMark ?? 0}</Typography>
                </Box>
                <Box p={2} bgcolor="#F8FAFC" borderRadius={3} border="1px solid #E2E8F0">
                  <Typography color="#64748B" fontSize={12} fontWeight={700}>Conventional (C)</Typography>
                  <Typography variant="h6" fontWeight="900" color="#1A1A1A">{selectedStudent.conventional_mark ?? selectedStudent.conventionalMark ?? 0}</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0, px: { xs: 2.5, sm: 4 } }}>
              <Button 
                onClick={() => setSelectedStudent(null)}
                variant="contained"
                disableElevation
                sx={{ bgcolor: '#F1F5F9', color: '#1A1A1A', textTransform: 'none', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#E2E8F0' } }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </Box>
  );
}

const searchBoxStyle = {
  width: 350,
  bgcolor: "white",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  px: 2,
  py: 0.8,
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  transition: 'all 0.2s ease',
  '&:focus-within': {
    borderColor: '#0062FE',
    boxShadow: '0 0 0 4px rgba(0,98,254,0.1)'
  }
};

const cardStyle = {
  bgcolor: "white",
  border: "1px solid #E2E8F0",
  borderRadius: 4,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
};

const headerRowStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1.7fr 1.2fr 1.8fr 1.2fr 1.6fr 1fr",
  bgcolor: "#F8FAFC",
  px: 4,
  py: 2.5,
  borderBottom: "1px solid #E2E8F0",
};

const bodyRowStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1.7fr 1.2fr 1.8fr 1.2fr 1.6fr 1fr",
  alignItems: "center",
  px: 4,
  py: 2.5,
  borderBottom: "1px solid #F1F5F9",
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: '#F8FAFC'
  }
};

const riasecChipStyle = {
  bgcolor: "#F1F5F9",
  color: "#1A1A1A",
  width: "fit-content",
  fontWeight: 700,
  fontFamily: 'monospace',
  border: '1px solid #E2E8F0'
};

const viewButtonStyle = {
  bgcolor: "white",
  color: "#0062FE",
  textTransform: "none",
  borderRadius: "50px",
  fontWeight: 700,
  border: '1px solid #BFDBFE',
  width: "fit-content",
  px: 2,
  py: 0.5,
  "&:hover": { bgcolor: "#EFF6FF", borderColor: '#93C5FD' },
};