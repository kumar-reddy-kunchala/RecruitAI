import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { 
  Sparkles, 
  RotateCw, 
  AlertCircle, 
  BrainCircuit, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle,
  FileText,
  BadgeAlert,
  Award,
  Download
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { CandidateRanking, Job } from "../types";

interface AiRankingViewProps {
  jobs: Job[];
  activeJobId: string;
  setActiveJobId: (id: string) => void;
}

export default function AiRankingView({ 
  jobs, 
  activeJobId, 
  setActiveJobId 
}: AiRankingViewProps) {
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [selectedRankForModal, setSelectedRankForModal] = useState<any | null>(null);

  const distributionData = [
    { score: "60-70%", count: 18 },
    { score: "70-80%", count: 42 },
    { score: "80-90%", count: 86 },
    { score: "90-100%", count: 24 },
  ];

  useEffect(() => {
    fetchRankings();
  }, [activeJobId]);

  const fetchRankings = () => {
    setIsLoading(true);
    fetch(`/api/rankings/${activeJobId}`)
      .then(res => res.json())
      .then(data => {
        setRankings(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading rankings:", err);
        setIsLoading(false);
      });
  };

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    fetch(`/api/rankings/${activeJobId}/reanalyze`, { method: "POST" })
      .then(res => res.json())
      .then(() => {
        fetchRankings();
        setIsReanalyzing(false);
        alert("Pipeline successfully re-analyzed by RecruitAI!");
      })
      .catch(err => {
        console.error("Re-analysis failed:", err);
        setIsReanalyzing(false);
        alert("Failed to re-analyze pipeline.");
      });
  };

  const selectedJob = jobs.find(j => j.id === activeJobId);

  const handleExportExcel = () => {
    if (rankings.length === 0) {
      alert("No ranked candidates available to export.");
      return;
    }

    // Convert rankings array to worksheet-friendly objects
    const data = rankings.map((rank, index) => ({
      "Rank": index + 1,
      "Candidate Name": rank.candidate?.name || "",
      "Email": rank.candidate?.email || "",
      "Current Company": rank.candidate?.currentCompany || "",
      "Years of Experience": rank.candidate?.yearsOfExp || 0,
      "Fit Probability": `${Math.round(rank.overallScore * 0.96)}%`,
      "Overall Score": rank.overallScore,
      "Confidence Score": `${rank.confidenceScore || 90}%`,
      "RecruitAI Justification": rank.explanation || "",
      "Detected Skills Gap": (rank.skillsGap || []).join("; "),
      "Optimization Suggestions": (rank.resumeSuggestions || []).join("; ")
    }));

    // Generate SheetJS worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for optimal viewing inside MS Excel / Sheets
    worksheet["!cols"] = [
      { wch: 6 },   // Rank
      { wch: 22 },  // Candidate Name
      { wch: 25 },  // Email
      { wch: 20 },  // Current Company
      { wch: 18 },  // Years of Experience
      { wch: 15 },  // Fit Probability
      { wch: 14 },  // Overall Score
      { wch: 16 },  // Confidence Score
      { wch: 50 },  // RecruitAI Justification
      { wch: 30 },  // Detected Skills Gap
      { wch: 35 }   // Optimization Suggestions
    ];

    // Create a new empty workbook
    const workbook = XLSX.utils.book_new();
    
    const jobTitleClean = (selectedJob?.title || "pipeline").replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30);
    XLSX.utils.book_append_sheet(workbook, worksheet, jobTitleClean || "Rankings");

    // Write file directly in binary format
    const fileNameClean = (selectedJob?.title || "pipeline").toLowerCase().replace(/[^a-z0-9]+/g, "_");
    XLSX.writeFile(workbook, `recruitai_ranked_candidates_${fileNameClean}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Pipeline Selector & Re-run Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="text-left">
            <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Current Pipeline Evaluation</label>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={activeJobId}
                onChange={(e) => setActiveJobId(e.target.value)}
                className="font-display font-bold text-slate-900 text-lg bg-transparent border-none p-0 focus:ring-0 focus:outline-none cursor-pointer"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isReanalyzing}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <RotateCw className={`w-4 h-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
          {isReanalyzing ? "Recalculating..." : "Reanalyze Pipeline"}
        </button>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Candidates Evaluated</p>
          <h4 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
            {activeJobId === 'job-1' ? "1,240 parsed" : "84 parsed"}
          </h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Average Fit Score</p>
          <h4 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
            {activeJobId === 'job-1' ? "74%" : "68%"}
          </h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Top-Tier Recommendations</p>
          <h4 className="font-display text-2xl font-extrabold text-purple-600 mt-1">
            {rankings.filter(r => r.overallScore >= 85).length} Matches
          </h4>
        </div>
      </div>

      {/* Main Grid: Rankings Table & Insight */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Table Panel (Left 8 Columns) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-display font-bold text-slate-900 text-base">Candidate Rankings</h4>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono text-xs hidden sm:inline">Weighted Hybrid Model</span>
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-100" />
                Export XL
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Recalculating applicant vectors...</span>
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 opacity-30 mx-auto mb-2" />
              <p className="text-sm">No ranking records for this pipeline. Click Reanalyze.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 font-mono text-[10px] uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-5 font-semibold">Rank</th>
                    <th className="py-3 px-5 font-semibold">Candidate</th>
                    <th className="py-3 px-5 font-semibold">Current Employer</th>
                    <th className="py-3 px-5 font-semibold">Fit Probability</th>
                    <th className="py-3 px-5 font-semibold text-center">Score</th>
                    <th className="py-3 px-5 text-right">Decision Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {rankings.map((rank, index) => {
                    const overallScore = rank.overallScore;
                    const isAdrian = rank.candidate?.id === 'cand-1';
                    
                    let scoreBadge = "text-red-700 bg-red-50 border-red-100";
                    if (overallScore >= 90) {
                      scoreBadge = "text-purple-700 bg-purple-50 border-purple-100";
                    } else if (overallScore >= 80) {
                      scoreBadge = "text-emerald-700 bg-emerald-50 border-emerald-100";
                    } else if (overallScore >= 70) {
                      scoreBadge = "text-blue-700 bg-blue-50 border-blue-100";
                    }

                    return (
                      <tr key={rank.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-500 font-mono">
                          #{index + 1}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                              {rank.candidate?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">{rank.candidate?.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{rank.candidate?.yearsOfExp} yrs exp</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-600 font-medium">
                          {rank.candidate?.currentCompany}
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-slate-800">{Math.round(overallScore * 0.96)}%</span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`inline-flex items-center font-bold px-2.5 py-1 rounded-lg text-xs border ${scoreBadge}`}>
                            {overallScore}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedRankForModal(rank)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Explain AI Decision
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Breakdown Widget (Right 4 Columns) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left">
            <h5 className="font-display font-bold text-slate-900 text-base mb-4">Why these rankings?</h5>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                RecruitAI applies a <strong>weighted hybrid formula</strong> based on the target requirements of the <span className="font-semibold text-slate-800">{selectedJob?.title}</span> role description:
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Semantic Similarity</span>
                  <span className="font-mono text-purple-600 font-semibold">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Required Skills</span>
                  <span className="font-mono text-blue-600 font-semibold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Target Experience</span>
                  <span className="font-mono text-emerald-600 font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Projects & Portfolio</span>
                  <span className="font-mono text-amber-600 font-semibold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Others (Edu/Cert/Behavior)</span>
                  <span className="font-mono text-slate-500 font-semibold">15%</span>
                </div>
              </div>
              <p>
                Candidates like <strong className="text-slate-800">Adrian Thorne</strong> score extremely high because they have documented design tokenization workflows in Figma that map cleanly to the required skills list.
              </p>
            </div>
          </section>

          {/* Talent Distribution Card */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left">
            <h5 className="font-display font-bold text-slate-900 text-base mb-4">Talent Distribution</h5>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="score" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Explanation Alert */}
          <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-purple-900 text-xs font-mono uppercase tracking-wider">Explainable AI (XAI)</p>
              <p className="text-xs text-purple-800 mt-1 leading-normal">
                RecruitAI does not perform raw keyword searches. It generates embedding matrices to trace candidate expertise even if alternative industry terminology is used.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EXPLAINABILITY MODAL */}
      {selectedRankForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-purple-600">
                <BrainCircuit className="w-5 h-5 fill-purple-100" />
                <h4 className="font-display font-bold text-lg text-slate-900">
                  Decision Justification: {selectedRankForModal.candidate?.name}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedRankForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar text-left">
              {/* Score Breakdown Bento widgets */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Overall Radial Meter Box (4 Columns) */}
                <div className="md:col-span-4 bg-slate-900 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg relative">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Ring background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        fill="transparent" 
                        stroke="#8b5cf6" 
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - (selectedRankForModal.overallScore / 100))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-display font-extrabold text-3xl">{selectedRankForModal.overallScore}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Overall Score</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 font-semibold font-mono">Confidence rating: {selectedRankForModal.confidenceScore}%</p>
                  </div>
                </div>

                {/* Weighted scores (8 Columns) */}
                <div className="md:col-span-8 bg-slate-50 p-5 rounded-2xl border border-slate-200/50 space-y-3.5">
                  <h5 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Algorithm Weights Breakdown</h5>
                  
                  {/* Semantic */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Semantic Fit (35%)</span>
                      <span className="font-bold text-purple-600 font-mono">{selectedRankForModal.scores?.semanticSimilarity || 75}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${selectedRankForModal.scores?.semanticSimilarity || 75}%` }}></div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Skills Match (25%)</span>
                      <span className="font-bold text-blue-600 font-mono">{selectedRankForModal.scores?.skills || 75}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedRankForModal.scores?.skills || 75}%` }}></div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Experience Alignment (15%)</span>
                      <span className="font-bold text-emerald-600 font-mono">{selectedRankForModal.scores?.experience || 75}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${selectedRankForModal.scores?.experience || 75}%` }}></div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Projects Match (10%)</span>
                      <span className="font-bold text-amber-600 font-mono">{selectedRankForModal.scores?.projects || 70}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: `${selectedRankForModal.scores?.projects || 70}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recruitment Synthesis Text */}
              <section className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl">
                <h5 className="font-display font-bold text-xs uppercase tracking-wider text-purple-700 mb-2">RecruitAI Synthesis Justification</h5>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedRankForModal.explanation}
                </p>
              </section>

              {/* Skills Gaps & Resume Suggestions Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Gaps */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <h6 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BadgeAlert className="w-4 h-4 text-rose-500" />
                    Skills Gaps Detected
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {selectedRankForModal.skillsGap?.map((gap: string, idx: number) => (
                      <span key={idx} className="bg-rose-50 border border-rose-100 text-rose-700 font-semibold text-xs px-2.5 py-1 rounded-md">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <h6 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    Optimization Suggestions
                  </h6>
                  <ul className="space-y-2 list-disc pl-4 text-xs text-slate-600 leading-normal">
                    {selectedRankForModal.resumeSuggestions?.map((sug: string, idx: number) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Interview Questions */}
              <section className="border border-slate-200 p-5 rounded-2xl bg-white">
                <h5 className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 mb-3.5">Suggested Interview Questions</h5>
                <div className="space-y-3">
                  {selectedRankForModal.interviewQuestions?.map((q: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start text-sm">
                      <span className="font-bold text-purple-600 shrink-0 font-mono">Q{idx+1}.</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRankForModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
