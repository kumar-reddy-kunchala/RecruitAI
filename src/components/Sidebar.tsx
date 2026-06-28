import React from "react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  TrendingUp, 
  BrainCircuit, 
  LineChart, 
  FilePlus2, 
  HelpCircle, 
  Bell, 
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPostJobClick: () => void;
  currentUser: { name: string; role: string; avatarUrl: string } | null;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onPostJobClick,
  currentUser,
  onLogout,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "ranking", label: "AI Ranking", icon: TrendingUp },
    { id: "semantic", label: "Semantic Search", icon: BrainCircuit },
    { id: "analytics", label: "Analytics & Logs", icon: LineChart },
  ];

  return (
    <aside 
      id="recruitai-sidebar"
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200/80 flex flex-col z-50 shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-[80px] px-3 py-6" : "w-[280px] p-6"
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm hover:shadow transition-all cursor-pointer z-50"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Header */}
      <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? "justify-center px-0" : "px-2"}`}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-display text-xl font-extrabold text-slate-900 tracking-tight leading-none">RecruitAI</h1>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enterprise Intelligence</p>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"} rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </div>
              {!isCollapsed && !isActive && (
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-400 transition-all transform translate-x-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Button & User Section */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-2">
        <button 
          id="post-job-sidebar-btn"
          onClick={onPostJobClick}
          title={isCollapsed ? "Post New Job" : undefined}
          className={`w-full bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-500/10 cursor-pointer ${
            isCollapsed ? "p-3" : "py-3"
          }`}
        >
          <FilePlus2 className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-sm">Post New Job</span>}
        </button>

        {currentUser && (
          <div className={`mt-4 bg-slate-50 rounded-xl flex ${isCollapsed ? "flex-col gap-3 p-2 items-center" : "items-center justify-between p-3"} border border-slate-100`}>
            <div className={`flex ${isCollapsed ? "flex-col items-center" : "items-center gap-3"}`}>
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
                title={isCollapsed ? `${currentUser.name} (${currentUser.role})` : undefined}
              />
              {!isCollapsed && (
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">{currentUser.role}</p>
                </div>
              )}
            </div>
            <button 
              id="logout-btn"
              onClick={onLogout}
              title="Logout"
              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
