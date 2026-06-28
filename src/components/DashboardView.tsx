import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Users, 
  BrainCircuit, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FilePlus2, 
  Upload, 
  FileText,
  Calendar,
  History,
  TrendingUp,
  UserCheck
} from "lucide-react";

interface DashboardViewProps {
  onPostJobClick: () => void;
  onNavigateToCandidates: () => void;
  onNavigateToAiRanking: () => void;
  onNavigateToSemanticSearch: () => void;
}

export default function DashboardView({
  onPostJobClick,
  onNavigateToCandidates,
  onNavigateToAiRanking,
  onNavigateToSemanticSearch
}: DashboardViewProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [insightApplied, setInsightApplied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard stats:", err);
        setIsLoading(false);
      });
  }, [insightApplied]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Assembling recruitment insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, Alex</h2>
          <p className="text-slate-500 mt-1">Here is what's happening with your recruitment pipeline today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onNavigateToCandidates}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all text-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            Last 30 Days
          </button>
          <button 
            onClick={() => alert("Report generated successfully! Download started.")}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-100" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Jobs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">Total Jobs</p>
            <h3 className="font-display text-3xl font-bold text-slate-900">{stats?.totalJobs || 124}</h3>
          </div>
        </div>

        {/* Total Candidates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">+5.2k</span>
          </div>
          <div>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">Total Candidates</p>
            <h3 className="font-display text-3xl font-bold text-slate-900">{(stats?.totalCandidates || 42891).toLocaleString()}</h3>
          </div>
        </div>

        {/* AI Ranking Accuracy */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-l-purple-600 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-purple-600 font-semibold text-xs bg-purple-50 px-2.5 py-1 rounded-full">AI Powered</span>
          </div>
          <div>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">AI Ranking Accuracy</p>
            <h3 className="font-display text-3xl font-bold text-purple-600">{stats?.rankingAccuracy || "98.2"}%</h3>
          </div>
        </div>

        {/* Hired Candidates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-slate-500 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-full">This Quarter</span>
          </div>
          <div>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">Hired Candidates</p>
            <h3 className="font-display text-3xl font-bold text-slate-900">{stats?.hiredCandidates || 86}</h3>
          </div>
        </div>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Bento Column (Pipeline & Funnel) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Hiring Funnel Performance */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display text-lg font-bold text-slate-900">Hiring Funnel Performance</h4>
              <button 
                onClick={onNavigateToAiRanking}
                className="text-blue-600 font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Visual Funnel Representation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-blue-600 leading-none">4.2k</span>
                <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mt-2">Applied</span>
              </div>
              
              {/* Chevron Arrow */}
              <div className="hidden sm:flex items-center text-slate-300">
                <span className="font-display font-bold text-lg">»</span>
              </div>

              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-teal-600 leading-none">2.8k</span>
                <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mt-2">Screened</span>
              </div>

              {/* Chevron Arrow */}
              <div className="hidden sm:flex items-center text-slate-300">
                <span className="font-display font-bold text-lg">»</span>
              </div>

              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-purple-600 leading-none">940</span>
                <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mt-2">Interviewed</span>
              </div>

              {/* Chevron Arrow */}
              <div className="hidden sm:flex items-center text-slate-300">
                <span className="font-display font-bold text-lg">»</span>
              </div>

              {/* Step 4 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-slate-400 leading-none">124</span>
                <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mt-2">Offers Sent</span>
              </div>
            </div>
          </section>

          {/* Active Pipeline List & Radar Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Pipeline Summary */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-slate-900 mb-5">Active Pipeline</h4>
                <div className="space-y-4">
                  {stats?.pipeline?.map((pipe: any, idx: number) => {
                    const colors = [
                      "bg-purple-50 text-purple-600",
                      "bg-emerald-50 text-emerald-600",
                      "bg-blue-50 text-blue-600",
                      "bg-amber-50 text-amber-600"
                    ];
                    return (
                      <div 
                        key={pipe.id}
                        onClick={idx === 2 ? onNavigateToAiRanking : onNavigateToCandidates}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold ${colors[idx % colors.length]}`}>
                          {pipe.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate leading-tight">{pipe.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{pipe.candidatesCount} Candidates • {pipe.aiRankedCount} AI Ranked</p>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Radar Mimic Breakdown */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-slate-900 mb-4">Pool Skills Breakdown</h4>
                <div className="flex justify-center py-2 relative">
                  {/* Real interactive custom vector radar mockup */}
                  <svg viewBox="0 0 200 180" className="w-40 h-40">
                    {/* Background rings */}
                    <circle cx="100" cy="90" r="80" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                    <circle cx="100" cy="90" r="55" fill="none" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="100" cy="90" r="30" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                    
                    {/* Radar axes */}
                    <line x1="100" y1="10" x2="100" y2="170" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="20" y1="90" x2="180" y2="90" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Polygon Match */}
                    <polygon 
                      points="100,25 165,90 100,150 45,90" 
                      fill="rgba(37, 99, 235, 0.08)" 
                      stroke="#2563EB" 
                      strokeWidth="2" 
                      className="transition-all hover:fill-blue-500/15 cursor-pointer"
                    />
                    
                    {/* Marker Dots */}
                    <circle cx="100" cy="25" r="4.5" fill="#2563EB" />
                    <circle cx="165" cy="90" r="4.5" fill="#2563EB" />
                    <circle cx="100" cy="150" r="4.5" fill="#2563EB" />
                    <circle cx="45" cy="90" r="4.5" fill="#2563EB" />

                    {/* Radial labels */}
                    <text x="100" y="16" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-400 uppercase tracking-widest">REACT</text>
                    <text x="100" y="174" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-400 uppercase tracking-widest">TS</text>
                    <text x="186" y="94" textAnchor="start" className="text-[10px] font-mono font-bold fill-slate-400 uppercase tracking-widest">PYTHON</text>
                    <text x="14" y="94" textAnchor="end" className="text-[10px] font-mono font-bold fill-slate-400 uppercase tracking-widest">CLOUD</text>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  <span className="text-xs text-slate-700 font-semibold font-mono">Technical 88%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                  <span className="text-xs text-slate-700 font-semibold font-mono">Soft Skills 72%</span>
                </div>
              </div>
            </section>
          </div>

          {/* Recent Intelligence Activity */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="font-display text-lg font-bold text-slate-900 mb-6">Recent Intelligence Activity</h4>
            <div className="space-y-6">
              {/* Activity 1 */}
              <div className="flex gap-4 relative">
                <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-slate-100"></div>
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 z-10 border border-purple-100">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm">
                    AI completed ranking for <span className="font-semibold text-slate-900">Senior Frontend Dev</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Found 8 &quot;High Performance&quot; matches from 124 applicants.</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block uppercase tracking-wider">2 minutes ago</span>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex gap-4 relative">
                <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-slate-100"></div>
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 z-10 border border-teal-100">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm">
                    New Referral: <span className="font-semibold text-slate-900">Sarah Jenkins</span> for UI Architect
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Referred by Mark Zuckerberg (VP Engineering).</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block uppercase tracking-wider">45 minutes ago</span>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 z-10 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm">
                    Interview Confirmed with <span className="font-semibold text-slate-900">James Chen</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Scheduled for tomorrow at 10:00 AM (Technical Round 1).</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block uppercase tracking-wider">3 hours ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Bento Column (Quick Actions & Insights) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Quick Actions Widget */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="font-display text-lg font-bold text-slate-900 mb-5">Quick Actions</h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={onPostJobClick}
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <FilePlus2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-900">Post New Job</p>
                  <p className="text-xs text-slate-400">Post job descriptions with AI generation</p>
                </div>
              </button>

              <button 
                onClick={onNavigateToCandidates}
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 rounded-xl transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-teal-900">Upload Resumes</p>
                  <p className="text-xs text-slate-400">Extract fields and score instantly</p>
                </div>
              </button>

              <button 
                onClick={onNavigateToSemanticSearch}
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 hover:border-purple-500 hover:bg-purple-50/20 rounded-xl transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-purple-900">Semantic Search</p>
                  <p className="text-xs text-slate-400">Search using AI natural intent</p>
                </div>
              </button>
            </div>
          </section>

          {/* AI Insights Bento Card */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            {/* Subtle AI ambient glow */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-purple-600 mb-4">
              <Sparkles className="w-4 h-4 fill-purple-100" />
              <span className="font-mono font-bold text-xs uppercase tracking-widest">RecruitAI Insight</span>
            </div>

            <h5 className="font-display font-bold text-slate-900 text-base mb-3">Talent Market Shift Detected</h5>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              We&apos;ve noticed a <span className="text-purple-600 font-semibold font-display">15% increase</span> in <span className="font-medium text-slate-800 underline decoration-purple-400 decoration-2">Remote TypeScript Developers</span> looking for new opportunities in the Austin area.
            </p>

            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl">
              <p className="font-semibold text-purple-700 text-xs font-mono uppercase tracking-wider mb-1.5">Recommendation</p>
              <p className="text-xs text-slate-600 leading-normal">
                {insightApplied 
                  ? "Applied! The Staff Engineer posting description has been updated to 'Remote Friendly' automatically." 
                  : "Update your 'Staff Engineer' posting to include 'Remote Friendly' to capture 3x more top-tier applicants."
                }
              </p>
              <button 
                onClick={() => {
                  setInsightApplied(true);
                  alert("Insight optimization applied! 'Staff Engineer' description has been augmented.");
                }}
                disabled={insightApplied}
                className={`mt-4 w-full py-2.5 ${insightApplied ? "bg-slate-200 text-slate-500 cursor-default" : "bg-purple-600 hover:bg-purple-700 text-white"} rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer`}
              >
                {insightApplied ? "Optimized Strategy Applied" : "Apply Optimized Strategy"}
              </button>
            </div>
          </section>

          {/* Top Candidates Spotlight */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="font-display text-lg font-bold text-slate-900 mb-5">Candidate Spotlight</h4>
            <div className="space-y-4">
              {/* Spotlight 1 */}
              <div 
                onClick={onNavigateToAiRanking}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border-2 border-purple-500 p-0.5 shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-auJkYpZnluWqp_yOdGdEjRzsyrxnhfuVRik5W-tWFMnfC6FNwH0q2raokMSS5a8yflbHvZmBK3F0o6zuuqtVNLGIqUCd64kFW8EnPO4JUPR-3YmkyONSR6MS07FNoJs9UivWqAlSi9HjkmDdxoPYJhsz_Gz6YBVDAvGH4Ef5hr1_e2irRRhatKi9i3i7t1qwni_hdxDz0cliGt9if9Tw_lTvuPuCAZIbtr4pkQ84rESqPLtLEnpYZ8WOQafI8ssDWLY6537P-4hO" 
                    alt="Yuki Tanaka" 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate leading-none">Yuki Tanaka</p>
                  <p className="text-[10px] text-purple-600 font-bold uppercase mt-1">99 AI Match</p>
                </div>
                <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-600">FE DEV</div>
              </div>

              {/* Spotlight 2 */}
              <div 
                onClick={onNavigateToAiRanking}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_aFkqCNqhkvgPRnkYBaRM_hzKElTcEn8OniMjcnI4qmEcrVY1ZUdh3lgVu9_iXt_NTygtKjwfNf9_183Dk-xC76J_qYV8ZSVvMM2mX4WANnNWFFmUoANK4B8C5MmSxJ53fAdbE98cbtKRL7w5DdUCyziCiSipVGVwqMH4z70FvAcR6qj_w8mAYkSlar_eQh6YrS-uIPl-njhRai2ZtmKKs9yRNDxv3ZD4bzZRSBh5psUflJun2faEqoW2FjrEnOxTdJwoJOEr8YO5" 
                    alt="Marcus Thorne" 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate leading-none">Marcus Thorne</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">96 AI Match</p>
                </div>
                <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-600">DEVOPS</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Minimal icons matching inline use
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
