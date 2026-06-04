"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Box, Container, Paper, Typography, Button, IconButton } from "@mui/material";
import { Users, TrendingUp, BookOpen, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { Close } from "@mui/icons-material";
import { API_URL } from '@/app/utils/api';

const ExportPDFButton = dynamic(() => import("./ExportPDFButton"), { ssr: false });

export default function CounselorOverviewPage() {
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hi Counselor, please choose one option below or ask about EduPath database records.",
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("accessToken");

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const [summaryRes, studentsRes] = await Promise.all([
          fetch(`${API_URL}/api/counselor/analytics/summary`, { headers }),
          fetch(`${API_URL}/api/counselor/students`, { headers })
        ]);

        const summaryData = await summaryRes.json();
        const studentsData = await studentsRes.json();

        setSummary(summaryData);
        setStudents(Array.isArray(studentsData) ? studentsData : []);

      } catch (error) {
        console.error("Failed to fetch dashboard data with token:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const sendMessage = async (presetMessage?: string) => {
    const userMessage = presetMessage || chatInput;
    if (!userMessage.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");

    const token = Cookies.get("accessToken");

    const res = await fetch(`${API_URL}/api/counselor/ai-chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message: userMessage }),
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { reply: "Error connecting to server or unauthorized." };
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: "ai", text: data.reply || "No response found." },
    ]);
  };

  const cards = [
    {
      title: "Personality Assessments",
      value: summary?.totalAssessments ?? 0,
      desc: "+12% this week",
      icon: <Users size={24} />,
      color: "#0062FE",
      bg: "#EFF6FF",
    },
    {
      title: "Top RIASEC Trait",
      value: summary?.topRIASECTrait ?? "-",
      desc: "24.7% of cohort",
      icon: <TrendingUp size={24} />,
      color: "#A855F7",
      bg: "#FAF5FF",
    },
    {
      title: "Most Popular Course",
      value: summary?.mostPopularCourse ?? "-",
      desc: "37% interest",
      icon: <BookOpen size={24} />,
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      title: "At-Risk Students",
      value: summary?.atRiskStudents ?? 0,
      desc: "MQA mismatch detected",
      icon: <ShieldAlert size={24} />,
      color: "#EF4444",
      bg: "#FEF2F2",
      danger: true,
    },
  ];

  const options = [
    "how many students",
    "how many universities",
    "how many courses",
    "how many subjects",
    "how many counselors",
    "how many admin",
    "show at risk students",
    "students without assessment",
    "top riasec",
    "popular course",
  ];

  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0062FE", textDecoration: "underline", fontWeight: 700 }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="h3" sx={{ color: "#1A1A1A", fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: "-1px", mb: 1 }}>
              Counselor Dashboard
            </Typography>
            <Typography sx={{ color: "#64748B", fontSize: 16 }}>
              Manage your student cohort and view AI-driven insights.
            </Typography>
          </Box>

          <Box>
            <ExportPDFButton summary={summary} students={students} />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "white",
            border: "1px solid #E2E8F0",
            borderRadius: 4,
            p: 5,
            mb: 5,
            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
          }}
        >
          <Typography variant="h4" sx={{ color: "#1A1A1A", fontWeight: 800 }}>
            Welcome back, Counselor.
          </Typography>

          <Typography sx={{ color: "#64748B", fontSize: 16, maxWidth: 800, lineHeight: 1.6, mt: 2 }}>
            Your cohort is making progress.{" "}
            <strong style={{ color: "#0062FE" }}>{summary?.totalAssessments ?? 0} students</strong>{" "}
            have completed their RIASEC assessments this week. Navigate to the Analytics tab to view
            cohort trends, or check the Directory to review individual student pathways.
          </Typography>
        </Paper>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
          {cards.map((card, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                bgcolor: card.danger ? "#FEF2F2" : "white",
                borderRadius: 4,
                p: 3,
                border: card.danger ? "1px solid #FECACA" : "1px solid #E2E8F0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: card.bg, color: card.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                {card.icon}
              </Box>

              <Typography sx={{ color: "#64748B", fontSize: 13, fontWeight: 600, mb: 1 }}>
                {card.title}
              </Typography>

              <Typography variant="h4" sx={{ color: "#1A1A1A", fontWeight: 800, mb: 1, fontSize: 28 }}>
                {card.value}
              </Typography>

              <Typography sx={{ color: card.danger ? "#EF4444" : "#94A3B8", fontSize: 13, fontWeight: 600 }}>
                {card.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>


      <Box
        onClick={() => setChatOpen(true)}
        sx={{
          position: "fixed",
          right: 30,
          bottom: 30,
          bgcolor: "#0062FE",
          color: "white",
          px: 3,
          py: 1.5,
          borderRadius: 999,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,98,254,0.3)",
          zIndex: 999,
        }}
      >
        Data Assistant
      </Box>

      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            right: 30,
            bottom: 90,
            width: 380,
            height: 520,
            bgcolor: "white",
            border: "1px solid #E2E8F0",
            borderRadius: 4,
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ bgcolor: "#0062FE", color: "white", p: 2, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Counselor Data Assistant</span>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: "white", p: 0 }}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#F8FAFC" }}>
            {chatMessages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1.5, display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <Box
                  sx={{
                    maxWidth: "82%",
                    bgcolor: msg.sender === "user" ? "#0062FE" : "white",
                    color: msg.sender === "user" ? "white" : "#1A1A1A",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    fontSize: 14,
                    whiteSpace: "pre-line",
                    border: msg.sender === "ai" ? "1px solid #E2E8F0" : "none",
                  }}
                >
                  {renderMessageWithLinks(msg.text)}
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, pt: 1, borderTop: "1px solid #E2E8F0", bgcolor: "white" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748B", mb: 1 }}>
              Choose database option:
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {options.map((q) => (
                <Button
                  key={q}
                  size="small"
                  onClick={() => sendMessage(q)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    bgcolor: "#EFF6FF",
                    color: "#0062FE",
                    fontWeight: 700,
                    fontSize: 12,
                    "&:hover": { bgcolor: "#DBEAFE" },
                  }}
                >
                  {q}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask about database..."
                style={{
                  flex: 1,
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "10px",
                  outline: "none",
                }}
              />

              <button
                onClick={() => sendMessage()}
                style={{
                  background: "#0062FE",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}