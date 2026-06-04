"use client";

import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase, AlertTriangle, BrainCircuit, GraduationCap, ChevronRight, Target, Zap, ShieldAlert, Rocket, Clock, Loader2, FileBarChart } from 'lucide-react';
import axios from 'axios';
import { getCookie } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import { API_URL } from '@/app/utils/api';

const DownloadPdfButton = dynamic(() => import('@/app/components/DownloadPdfButton'), { ssr: false });

export default function StudentReportDashboard() { 
  const [reportData, setReportData] = useState<any>(null);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build radar chart data from raw RIASEC scores
  const buildRadarData = (scores: any) => {
    const maxPossible = 9; // 3 questions * max 3 points each
    return [
      { subject: 'Realistic', A: Math.round((scores.realisticMark / maxPossible) * 100), fullMark: 100 },
      { subject: 'Investigative', A: Math.round((scores.investigateMark / maxPossible) * 100), fullMark: 100 },
      { subject: 'Artistic', A: Math.round((scores.artisticMark / maxPossible) * 100), fullMark: 100 },
      { subject: 'Social', A: Math.round((scores.socialMark / maxPossible) * 100), fullMark: 100 },
      { subject: 'Enterprising', A: Math.round((scores.enterprisingMark / maxPossible) * 100), fullMark: 100 },
      { subject: 'Conventional', A: Math.round((scores.conventionalMark / maxPossible) * 100), fullMark: 100 },
    ];
  };

  const fetchRealReport = async (forceRegenerate = false) => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem('user');
      let userId = null;
      if (storedUser) {
        try {
          userId = JSON.parse(storedUser).id;
        } catch (e) {}
      }
      
      if (!userId) {
        throw new Error("User ID not found in session. Please login again.");
      }

      const token = getCookie('accessToken');
      const authConfig = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_URL}/api/StudentProfile/user/${userId}`,
        authConfig
      );
      const profile = response.data;

      // Build radar chart from the profile's personality assessment scores
      if (profile?.personalityAssessment) {
        setRadarData(buildRadarData(profile.personalityAssessment));
      }
      
      if (profile?.aiRealityReport && !forceRegenerate) {
        // Parse existing report from database
        const parsedReport = JSON.parse(profile.aiRealityReport);
        setReportData(parsedReport);
      } else if (profile?.personalityAssessment) {
        // No existing report — trigger Gemini AI generation
        console.log("No existing report found. Triggering Gemini AI generation...");
        const scores = profile.personalityAssessment;
        const riasecScoresStr = `Realistic:${scores.realisticMark}, Investigative:${scores.investigateMark}, Artistic:${scores.artisticMark}, Social:${scores.socialMark}, Enterprising:${scores.enterprisingMark}, Conventional:${scores.conventionalMark}`;
        
        // Build dynamic course list from backend's matched courses
        let filteredCoursesStr = "None provided"; // fallback to let AI freely recommend
        if (profile.matchedCourses && profile.matchedCourses.length > 0) {
          filteredCoursesStr = profile.matchedCourses
            .map((c: any) => `${c.courseName} (${c.universityName})`)
            .join(", ");
        }

        const genResponse = await axios.post(`${API_URL}/api/open-router/generate-report`, {
           riasecScores: riasecScoresStr,
           filteredCourses: filteredCoursesStr,
           studentProfileId: profile.id.toString(),
           track: profile.academicAssessment?.track || 'SPM'
        }, authConfig); 
        
        setReportData(genResponse.data);
      } else {
        setError("No assessment data found. Please complete the RIASEC assessment first.");
      }
    } catch (err: any) {
      console.error("Failed to fetch report from backend", err);
      setError(`Failed to load report: ${err.message}. Please ensure the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center p-4 py-16">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <FileBarChart className="w-16 h-16 text-[#0062FE] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Assessment Completed!</h2>
          <p className="text-slate-500 mb-6">Click below to let EduPath AI Senior generate your deep reality report.</p>
          {error && <p className="text-rose-600 text-sm mb-4 bg-rose-50 p-3 rounded-lg">{error}</p>}
          <button 
            onClick={() => fetchRealReport(false)}
            disabled={loading}
            className="w-full bg-[#0062FE] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Premium Report...</> : 'Generate My Exclusive Report'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8" id="report-container">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <div className="inline-block bg-[#0062FE] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">VIP Talent Report</div>
              <h1 className="text-[28px] md:text-[36px] font-black tracking-tight text-[#1A1A1A]">Talent & Industry Reality Report</h1>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3" data-html2canvas-ignore="true">
              <button 
                onClick={() => fetchRealReport(true)} 
                disabled={loading}
                className="text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-full transition-all flex items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Regenerating...</> : 'Regenerate'}
              </button>
              <DownloadPdfButton targetId="report-container" />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 items-center w-full max-w-4xl mx-auto">
          <section className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-800 w-full mb-4 flex items-center justify-center"><Target className="w-5 h-5 mr-2 text-[#0062FE]"/> RIASEC Talent Profile</h2>
            <div className="w-full max-w-[340px] h-[300px] mx-auto flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="55%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip />
                  <Radar name="Score" dataKey="A" stroke="#0062FE" strokeWidth={3} fill="#0062FE" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Dominant Profile Type</p>
              <p className="text-2xl font-black text-[#0062FE] mt-1">{reportData.primary_profile}</p>
            </div>
          </section>

          <div className="force-page-break w-full"></div>

          <section className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col mt-4">
            <div className="bg-[#1A1A1A] px-6 py-4 flex items-center"><BrainCircuit className="w-6 h-6 text-[#0062FE] mr-3" /><h2 className="text-xl font-bold text-white">AI Senior Deep Analysis</h2></div>
            <div className="p-6 space-y-6 grow">
              <p className="text-slate-700 text-lg leading-relaxed italic border-l-4 border-[#0062FE] pl-4 bg-blue-50/50 py-3 pr-3 rounded-r-lg">"{reportData.student_overview}"</p>
              {reportData.deep_analysis && (
                <>
                  <div className="mt-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-emerald-700 mb-3 flex items-center pdf-avoid-break"><Zap className="w-4 h-4 mr-2" /> Core Strengths</h3>
                      <ul className="space-y-2">{reportData.deep_analysis.core_strengths.map((item: string, i: number) => <li key={i} className="flex items-start text-sm text-slate-700 pdf-avoid-break"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0"></div>{item}</li>)}</ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-rose-700 mb-3 flex items-center pdf-avoid-break"><ShieldAlert className="w-4 h-4 mr-2" /> Blind Spots & Challenges</h3>
                      <ul className="space-y-2">{reportData.deep_analysis.blind_spots.map((item: string, i: number) => <li key={i} className="flex items-start text-sm text-slate-700 pdf-avoid-break"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 shrink-0"></div>{item}</li>)}</ul>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 pdf-avoid-break">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center text-sm"><Briefcase className="w-4 h-4 mr-2 text-slate-500" /> Ideal Work Environments</h3>
                    <p className="text-sm text-slate-600">{reportData.deep_analysis.ideal_environments}</p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        <div className="force-page-break mt-12"></div>
        <section>
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center">Customized Pathways & Industry Reality<ChevronRight className="w-6 h-6 ml-1 text-slate-400" /></h2>
          <div className="grid grid-cols-1 gap-6">
            {reportData.recommended_pathways?.map((pathway: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors pdf-avoid-break">
                <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex items-center justify-between"><h3 className="text-lg font-bold text-blue-900 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-[#0062FE]" />{pathway.course_name}</h3></div>
                <div className="p-5 md:flex gap-6 items-start">
                  <div className="md:w-1/3 space-y-4 shrink-0">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100"><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Malaysia Starting Salary</div><div className="text-2xl font-black text-emerald-600">{pathway.industry_reality.starting_salary_rm}</div></div>
                    <div>
                      <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1"><span>AI Replacement Risk</span><span className={pathway.industry_reality.ai_replacement_risk_percentage > 30 ? 'text-rose-600' : 'text-amber-600'}>{pathway.industry_reality.ai_replacement_risk_percentage}%</span></div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${pathway.industry_reality.ai_replacement_risk_percentage > 30 ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: `${pathway.industry_reality.ai_replacement_risk_percentage}%` }}></div></div>
                    </div>
                  </div>
                  <div className="md:w-2/3 mt-4 md:mt-0 bg-amber-50 rounded-lg p-4 border border-amber-200 relative">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center text-sm"><AlertTriangle className="w-4 h-4 mr-1" /> Trap Avoidance Guide</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">{pathway.industry_reality.pitfall_avoidance_guide}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {reportData.action_roadmap && (
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 pdf-avoid-break">
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 flex items-center"><Rocket className="w-6 h-6 mr-3 text-[#0062FE]" />Personalized Action Roadmap</h2>
            <div className="relative border-l-2 border-blue-100 ml-3 space-y-8 pb-4">
              {reportData.action_roadmap.map((plan: any, index: number) => (
                <div key={index} className="relative pl-8 pdf-avoid-break">
                  <div className="absolute w-4 h-4 bg-[#0062FE] rounded-full -left-[9px] top-1 ring-4 ring-white"></div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center mb-2"><Clock className="w-4 h-4 mr-2 text-[#0062FE]" />{plan.phase}</h3>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">{plan.action}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}