import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import CandidatesView from "./components/CandidatesView";
import AiRankingView from "./components/AiRankingView";
import SemanticSearchView from "./components/SemanticSearchView";
import AnalyticsView from "./components/AnalyticsView";
import LoginView from "./components/LoginView";
import { Job } from "./types";
import { BrainCircuit, Bell, Sparkles, FilePlus2, X, Search } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; avatarUrl: string } | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobId, setActiveJobId] = useState("job-1");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Adrian Thorne scored 98% for Senior Product Designer",
    "AI complete evaluation of 1,240 candidate profiles",
    "System completed secure backup to encrypted storage"
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Form states for posting a job
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("Engineering");
  const [newJobExp, setNewJobExp] = useState(4);
  const [newJobDesc, setNewJobDesc] = useState("");
  const [useAIForJob, setUseAIForJob] = useState(true);
  const [isPostingJob, setIsPostingJob] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchJobs();
    }
  }, [currentUser]);

  const fetchJobs = () => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        if (data.length > 0) {
          setActiveJobId(data[0].id);
        }
      })
      .catch(err => console.error("Error loading jobs:", err));
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    setIsPostingJob(true);
    fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newJobTitle,
        department: newJobDept,
        experienceYears: newJobExp,
        description: newJobDesc,
        useAI: useAIForJob
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsPostingJob(false);
        setShowPostJobModal(false);
        setNewJobTitle("");
        setNewJobDesc("");
        alert(`Job '${data.title}' posted successfully! RecruitAI generated comprehensive criteria.`);
        
        // Add a notification
        setNotifications(prev => [
          `New Job posted: ${data.title}`,
          ...prev
        ]);
        
        fetchJobs();
      })
      .catch(err => {
        console.error("Failed to post job:", err);
        setIsPostingJob(false);
        alert("Error posting job.");
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("dashboard");
  };

  // Render correct view based on active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView 
            onPostJobClick={() => setShowPostJobModal(true)}
            onNavigateToCandidates={() => setActiveTab("candidates")}
            onNavigateToAiRanking={() => setActiveTab("ranking")}
            onNavigateToSemanticSearch={() => setActiveTab("semantic")}
          />
        );
      case "candidates":
        return <CandidatesView jobs={jobs} />;
      case "ranking":
        return (
          <AiRankingView 
            jobs={jobs}
            activeJobId={activeJobId}
            setActiveJobId={setActiveJobId}
          />
        );
      case "semantic":
        return <SemanticSearchView />;
      case "analytics":
        return <AnalyticsView />;
      default:
        return <DashboardView 
          onPostJobClick={() => setShowPostJobModal(true)}
          onNavigateToCandidates={() => setActiveTab("candidates")}
          onNavigateToAiRanking={() => setActiveTab("ranking")}
          onNavigateToSemanticSearch={() => setActiveTab("semantic")}
        />;
    }
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div id="recruitai-app-root" className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPostJobClick={() => setShowPostJobModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className={`flex-grow p-8 min-h-screen flex flex-col gap-6 relative transition-all duration-300 ${
        isSidebarCollapsed ? "pl-[80px]" : "pl-[280px]"
      }`}>
        
        {/* Global Application Header bar */}
        <header id="recruitai-global-header" className="flex items-center justify-between border-b border-slate-200/60 pb-4 shrink-0 gap-4">
          {/* Left: Global Search box */}
          <div className="relative flex-1 max-w-xs md:max-w-md">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search talent, jobs, or AI insights..." 
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all text-slate-800 font-medium placeholder-slate-400"
            />
          </div>

          {/* Center: Top Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => setActiveTab("candidates")}
              className={`text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer transition-all ${
                activeTab === "candidates" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-slate-400 hover:text-slate-700 border-b-2 border-transparent"
              }`}
            >
              Talent Pool
            </button>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer transition-all ${
                activeTab === "dashboard" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-slate-400 hover:text-slate-700 border-b-2 border-transparent"
              }`}
            >
              Interviews
            </button>
            <button 
              onClick={() => setActiveTab("ranking")}
              className={`text-xs font-bold uppercase tracking-wider pb-1 cursor-pointer transition-all ${
                activeTab === "ranking" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-slate-400 hover:text-slate-700 border-b-2 border-transparent"
              }`}
            >
              Referrals
            </button>
          </div>

          {/* Right: Notifications & User Profile Card */}
          <div className="flex items-center gap-4 relative shrink-0">
            {/* Notification bell widget */}
            <button 
              id="header-notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notification dropdown menu */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-left animate-slide-up">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">Notifications</h5>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer">Clear all</button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No unread notifications</p>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs leading-normal border border-slate-100">
                        {notif}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Subtle Divider */}
            <div className="h-6 w-px bg-slate-200"></div>

            {/* User Avatar & Name block */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">Alex Rivera</p>
                <p className="text-[9px] text-slate-400 uppercase font-mono tracking-widest font-semibold">Senior Recruiter</p>
              </div>
              <img 
                src={currentUser.avatarUrl} 
                alt="Alex Rivera" 
                className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Dynamic active view widget */}
        <div className="flex-grow pb-12">
          {renderActiveView()}
        </div>

      </main>

      {/* POST NEW JOB MODAL WITH AI GENERATOR ASSIST */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilePlus2 className="w-5 h-5 text-blue-600" />
                <h4 className="font-display font-bold text-lg text-slate-900">Post New Role</h4>
              </div>
              <button 
                onClick={() => setShowPostJobModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePostJob} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Android Architect"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Department</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="DevOps">DevOps & Infra</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Target Experience (Years)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newJobExp}
                  onChange={(e) => setNewJobExp(parseInt(e.target.value) || 4)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Custom Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Leave empty to let RecruitAI generate complete role descriptions automatically..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Use AI Assist Toggle box */}
              <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-bold text-blue-950 text-xs">AI Completion Assistant</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Automatically generate optimal lists of required skills, responsibilities, and seniority targets based on title.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useAIForJob}
                  onChange={(e) => setUseAIForJob(e.target.checked)}
                  className="w-4.5 h-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPostingJob}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer disabled:opacity-75"
                >
                  {isPostingJob ? "Posting with AI..." : "Post Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
