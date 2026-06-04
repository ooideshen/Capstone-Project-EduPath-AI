"use client";

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function DownloadPdfButton({ targetId }: { targetId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      alert("Could not find the report to download.");
      return;
    }
    
    setLoading(true);
    try {
      const opt = {
        margin:       12,
        filename:     'EduPath_AI_Reality_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, windowWidth: 1280 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'], before: '.force-page-break', avoid: '.pdf-avoid-break' }
      };
      
      // @ts-ignore
      await html2pdf().set(opt).from(targetElement).save();
    } catch (e: any) {
      console.error("Failed to generate PDF", e);
      alert("Failed to generate PDF: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-50 hover:bg-blue-100 text-[#0062FE] font-bold py-2 px-4 rounded-full transition-all border border-blue-200 text-sm flex items-center shadow-sm"
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
      {loading ? 'Downloading...' : 'Download PDF'}
    </button>
  );
}
