"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Download, Users, TrendingUp, BookOpen, ShieldAlert, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Cookies from "js-cookie"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { API_URL } from '@/app/utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ExportPDFButton({ summary, students }: { summary: any, students: any[] }) {
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [courseApiData, setCourseApiData] = useState<any[]>([]);
  const [pipelineApiData, setPipelineApiData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = Cookies.get("accessToken");

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const [courseRes, pipelineRes] = await Promise.all([
          fetch(`${API_URL}/api/counselor/analytics/courses`, { headers }),
          fetch(`${API_URL}/api/counselor/analytics/academic-pipeline-monthly`, { headers })
        ]);

        const courseData = await courseRes.json();
        const pipelineData = await pipelineRes.json();

        setCourseApiData(Array.isArray(courseData) ? courseData : []);
        setPipelineApiData(Array.isArray(pipelineData) ? pipelineData : []);

      } catch (error) {
        console.error("Failed to load analytics for PDF export:", error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#F4F7F9" });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;

      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.setFillColor(244, 247, 249);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight; 
        pdf.addPage();
        pdf.setFillColor(244, 247, 249);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save("EduPathAI_Counselor_Report.pdf");
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Data Calculations for Charts
  let onTrack = 0;
  let atRisk = 0;
  let pending = 0;
  let traits = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  const studentList = Array.isArray(students)
  ? students
  : (students as any)?.students || (students as any)?.data || (students as any)?.content || [];

  studentList.forEach((s: any) => {
    let r = s.realistic_mark || 0;
    let i = s.investigate_mark || 0;
    let a = s.artistic_mark || 0;
    let soc = s.social_mark || 0;
    let e = s.enterprising_mark || 0;
    let c = s.conventional_mark || 0;
    
    let total = r + i + a + soc + e + c;
    if(total === 0) pending++;
    else if(total < 350) atRisk++;
    else onTrack++;

    let max = Math.max(r, i, a, soc, e, c);
    if (max > 0) {
      if (max === r) traits.R++;
      else if (max === i) traits.I++;
      else if (max === a) traits.A++;
      else if (max === soc) traits.S++;
      else if (max === e) traits.E++;
      else if (max === c) traits.C++;
    }
  });

  const statusData = {
    labels: ['On Track', 'At Risk', 'Pending'],
    datasets: [
      {
        data: [onTrack, atRisk, pending],
        backgroundColor: ['#10B981', '#F43F5E', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  const traitData = {
    labels: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
    datasets: [
      {
        label: 'Number of Students',
        data: [traits.R, traits.I, traits.A, traits.S, traits.E, traits.C],
        backgroundColor: '#6366F1',
        borderRadius: 6,
      },
    ],
  };

  const courseData = {
    labels: courseApiData.map((item) => item.label),
    datasets: [
      {
        label: "Number of Students",
        data: courseApiData.map((item) => item.value),
        backgroundColor: "#10B981",
        borderRadius: 6,
      },
    ],
  };

  const pipelineData = {
    labels: pipelineApiData.map((item) => item.month),
    datasets: [
      {
        label: "Completed",
        data: pipelineApiData.map((item) => item.completed),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.4,
      },
      {
        label: "Pending",
        data: pipelineApiData.map((item) => item.pending),
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
      },
      {
        label: "Not Attempted",
        data: pipelineApiData.map((item) => item.notattempted ?? item.notAttempted),
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <Button
        onClick={handleExport}
        disabled={isExporting}
        startIcon={isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        sx={{
          bgcolor: "#262626",
          color: "white",
          px: 3,
          py: 1.5,
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#333" },
        }}
      >
        {isExporting ? "Generating PDF..." : "Export Report"}
      </Button>

      {/* Hidden Report Container */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
         <div ref={reportRef} className="bg-[#F4F7F9] p-10 text-slate-800 font-sans w-[800px] min-h-[1122px] flex flex-col">
            
            <header className="border-b border-slate-300 pb-6 mb-8 mt-4">
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4f46e5', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: '9999px', paddingLeft: '14px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '4px', marginBottom: '16px' }}>
                Official Report
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                Counselor Cohort Analytics
              </h1>
              <p className="text-slate-500 font-medium text-sm">Generated on: {new Date().toLocaleString()}</p>
            </header>

            <section className="mb-10">
              <div className="bg-slate-900 px-6 py-4 flex items-center rounded-t-2xl">
                <h2 className="text-xl font-bold text-white tracking-wide">Executive Summary</h2>
              </div>
              <div className="bg-white p-8 rounded-b-2xl border-x border-b border-slate-200 shadow-sm grid grid-cols-2 gap-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center">
                  <Users className="w-12 h-12 text-indigo-500 mr-5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Students</p>
                    <p className="text-4xl font-black text-slate-800">{summary?.totalStudents ?? 0}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center">
                  <BookOpen className="w-12 h-12 text-emerald-500 mr-5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Personality Tests</p>
                    <p className="text-4xl font-black text-slate-800">{summary?.totalAssessments ?? 0}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center">
                  <TrendingUp className="w-12 h-12 text-blue-500 mr-5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Dominant Trait</p>
                    <p className="text-3xl font-black text-slate-800">{summary?.topRIASECTrait ?? "N/A"}</p>
                  </div>
                </div>

                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center">
                  <ShieldAlert className="w-12 h-12 text-rose-500 mr-5" />
                  <div>
                    <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">At-Risk (MQA Mismatch)</p>
                    <p className="text-4xl font-black text-rose-700">{summary?.atRiskStudents ?? 0}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex-grow">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Cohort Analytics Distribution</h2>
              <div className="grid grid-cols-2 gap-8">
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider text-sm">Risk Status Overview</h3>
                  <div className="w-[280px] h-[280px]">
                    <Pie 
                      data={statusData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 12 }, padding: 20 } },
                          tooltip: {
                            callbacks: {
                              label: (ctx: any) => {
                                const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
                                return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                              }
                            }
                          }
                        }
                      }}
                      plugins={[{
                        id: 'pieLabels',
                        afterDraw(chart: any) {
                          const { ctx } = chart;
                          const dataset = chart.data.datasets[0];
                          const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
                          if (total === 0) return;
                          chart.getDatasetMeta(0).data.forEach((arc: any, i: number) => {
                            const value = dataset.data[i];
                            if (value === 0) return;
                            const pct = ((value / total) * 100).toFixed(0) + '%';
                            const { x, y } = arc.tooltipPosition();
                            ctx.save();
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 13px Inter, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(pct, x, y);
                            ctx.restore();
                          });
                        }
                      }]}
                    />
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider text-sm">Top RIASEC Traits</h3>
                  <div className="w-full h-[280px]">
                    <Bar 
                      data={traitData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                          y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
                          x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45, font: { size: 11, weight: 'bold' } } }
                        }
                      }} 
                    />
                  </div>
                </div>

              </div>
            </section>
            
            <section className="flex-grow mt-10">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Academic & Course Insights</h2>
              <div className="grid grid-cols-2 gap-8">
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider text-sm">Course Popularity</h3>
                  <div className="w-full h-[280px]">
                    <Bar 
                      data={courseData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                          y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
                          x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45, font: { size: 11, weight: 'bold' } } }
                        }
                      }} 
                    />
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-wider text-sm">Eligibility Pipeline</h3>
                  <div className="w-full h-[280px]">
                    <Line 
                      data={pipelineData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 10 }, padding: 10 } } },
                        scales: { 
                          y: { beginAtZero: true, ticks: { stepSize: 5, precision: 0 } },
                          x: { grid: { display: false } }
                        }
                      }} 
                    />
                  </div>
                </div>

              </div>
            </section>
            
            <div className="mt-12 text-center text-slate-400 text-sm font-medium pt-8 border-t border-slate-200">
               --- End of EduPath AI Counselor Report ---
            </div>
         </div>
      </div>
    </>
  );
}