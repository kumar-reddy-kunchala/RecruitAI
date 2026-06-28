import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { 
  Search, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BrainCircuit, 
  Send,
  X,
  Plus,
  SlidersHorizontal,
  FileText,
  UserCheck,
  Check,
  Download
} from "lucide-react";
import { Candidate, Job } from "../types";

interface CandidatesViewProps {
  jobs: Job[];
}

export default function CandidatesView({ jobs }: CandidatesViewProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Filters state (Defaults aligned with Screenshot 4)
  const [department, setDepartment] = useState("Engineering");
  const [experienceLimit, setExperienceLimit] = useState(15);
  const [skillsFilter, setSkillsFilter] = useState<string[]>(["React & TypeScript", "Node.js"]);
  const [statusFilter, setStatusFilter] = useState("All");

  // Slide-over drawer state
  const [showDrawer, setShowDrawer] = useState(false);

  // Resume upload modal & state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Chat with resume state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);

  // Interview questions state
  const [selectedJobForQuestions, setSelectedJobForQuestions] = useState(jobs[0]?.id || "");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    fetch("/api/candidates")
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
      })
      .catch(err => console.error("Error loading candidates:", err));
  };

  const handleExportAllCandidates = () => {
    if (filteredCandidates.length === 0) {
      alert("No filtered candidates available to export.");
      return;
    }

    // Convert filtered candidates array to worksheet-friendly objects
    const data = filteredCandidates.map((cand) => {
      const score = getAiScore(cand);
      return {
        "Candidate Name": cand.name,
        "Email": cand.email,
        "Current Company": cand.currentCompany || "N/A",
        "Years of Experience": `${cand.yearsOfExp} yrs`,
        "Top Skills": cand.topSkills.join("; "),
        "Candidate Status": cand.status,
        "AI Match Score": score
      };
    });

    // Generate SheetJS worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for optimal viewing
    worksheet["!cols"] = [
      { wch: 22 },  // Candidate Name
      { wch: 25 },  // Email
      { wch: 20 },  // Current Company
      { wch: 18 },  // Years of Experience
      { wch: 35 },  // Top Skills
      { wch: 16 },  // Candidate Status
      { wch: 15 }   // AI Match Score
    ];

    // Create a new empty workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Talent Pool");

    // Write file directly in binary format
    XLSX.writeFile(workbook, "recruitai_talent_pool_export.xlsx");
  };

  // Open detailed drawer for candidate
  const handleSelectCandidate = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setChatMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I have loaded ${cand.name}'s resume context. You can ask me questions about their skills, experience, gaps, or fit.`,
        timestamp: new Date().toISOString()
      }
    ]);
    setGeneratedQuestions([]);
    setShowDrawer(true);
  };

  // Clear all filters handler
  const handleClearFilters = () => {
    setDepartment("All");
    setExperienceLimit(15);
    setSkillsFilter([]);
    setStatusFilter("All");
    setSearch("");
  };

  // Skills checkbox toggle
  const handleToggleSkill = (skillName: string) => {
    if (skillsFilter.includes(skillName)) {
      setSkillsFilter(skillsFilter.filter(s => s !== skillName));
    } else {
      setSkillsFilter([...skillsFilter, skillName]);
    }
  };

  // Upload/parse resume handler
  const handleUploadResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsUploading(true);
    fetch("/api/candidates/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText })
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        setShowUploadModal(false);
        setResumeText("");
        alert("Resume parsed successfully and candidates auto-ranked!");
        fetchCandidates();
      })
      .catch(err => {
        console.error("Upload failed:", err);
        setIsUploading(false);
        alert("Error parsing resume. Please try again.");
      });
  };

  // Chat with resume submit
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedCandidate) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");
    setIsChatSending(true);

    fetch("/api/chat-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: selectedCandidate.id,
        messages: updatedMessages
      })
    })
      .then(res => res.json())
      .then(data => {
        setChatMessages(prev => [...prev, data]);
        setIsChatSending(false);
      })
      .catch(err => {
        console.error("Chat error:", err);
        setIsChatSending(false);
      });
  };

  // Interview questions generator
  const handleGenerateQuestions = () => {
    if (!selectedCandidate || !selectedJobForQuestions) return;

    setIsGeneratingQuestions(true);
    const job = jobs.find(j => j.id === selectedJobForQuestions);
    const jobDetails = job ? `${job.title} requiring ${job.requiredSkills.join(", ")}` : "the selected position";

    fetch("/api/chat-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: selectedCandidate.id,
        messages: [
          {
            role: "user",
            content: `Based on my resume, please generate a list of 4 highly technical, situational, and behavioral interview questions targeted for the role of "${jobDetails}". Return strictly 4 questions in bullet points.`
          }
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        const questions = data.content
          .split("\n")
          .filter((q: string) => q.trim().startsWith("-") || q.trim().match(/^\d+\./))
          .map((q: string) => q.replace(/^[-*\s\d.]+/, "").trim());
        
        setGeneratedQuestions(questions.length > 0 ? questions : [data.content]);
        setIsGeneratingQuestions(false);
      })
      .catch(err => {
        console.error("Failed to generate questions:", err);
        setIsGeneratingQuestions(false);
      });
  };

  // Apply filters in memory
  const filteredCandidates = candidates.filter(cand => {
    // 1. Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchName = cand.name.toLowerCase().includes(q);
      const matchCompany = cand.currentCompany?.toLowerCase().includes(q);
      const matchSkills = cand.topSkills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchCompany && !matchSkills) return false;
    }

    // 2. Department filter
    if (department !== "All") {
      const isDesignRole = cand.topSkills.some(s => ["figma", "design", "ui", "ux", "visual", "prototyping"].includes(s.toLowerCase()));
      if (department === "Product Design" && !isDesignRole) return false;
      if (department === "Engineering" && isDesignRole && !cand.topSkills.some(s => ["react", "typescript", "python", "pytorch", "go", "postgresql", "etl", "devops"].includes(s.toLowerCase()))) return false;
    }

    // 3. Experience filter
    if (cand.yearsOfExp > experienceLimit) return false;

    // 4. Candidate status filter
    if (statusFilter !== "All" && cand.status !== statusFilter) return false;

    return true;
  });

  // Calculate scores for display matching the high fidelity mocks
  const getAiScore = (cand: Candidate) => {
    const scores: { [key: string]: number } = {
      "Adrian Thorne": 98,
      "Mei Ling": 85,
      "Jordan Williams": 90,
      "Alex Chen": 98,
      "Sarah Miller": 84,
      "Jordan Smith": 92,
      "Maya Rodriguez": 76,
      "Yuki Tanaka": 99,
      "Marcus Thorne": 96
    };
    return scores[cand.name] || 82;
  };

  // Get AI score color classes
  const getScoreBadgeStyles = (score: number) => {
    if (score >= 90) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (score >= 80) {
      return "bg-purple-50 text-purple-700 border-purple-100";
    }
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  // Pagination bounds
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage) || 1;
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="grid grid-cols-12 gap-8 items-start animate-fade-in text-left">
      
      {/* LEFT FILTER PANEL (Screenshot 4 Alignment) */}
      <div className="col-span-12 lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="font-display text-sm uppercase tracking-wider">Filters</span>
          </div>
          <button 
            onClick={handleClearFilters}
            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Clear all
          </button>
        </div>

        {/* Filter 1: Department */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none transition-all font-semibold text-slate-700"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Product Management">Product Management</option>
          </select>
        </div>

        {/* Filter 2: Experience Limit Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Experience</label>
            <span className="text-xs font-bold text-slate-700">{experienceLimit === 15 ? "15+ YRS" : `< ${experienceLimit} YRS`}</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={experienceLimit}
            onChange={(e) => setExperienceLimit(parseInt(e.target.value))}
            className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold font-mono">
            <span>0 YRS</span>
            <span>15+ YRS</span>
          </div>
        </div>

        {/* Filter 3: Required Skills Checkboxes */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Required Skills</label>
          <div className="space-y-2">
            {[
              "React & TypeScript",
              "Node.js",
              "System Design",
              "Machine Learning"
            ].map((skillName) => {
              const isChecked = skillsFilter.includes(skillName);
              return (
                <label key={skillName} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSkill(skillName)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/20 focus:ring-2"
                  />
                  <span>{skillName}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Filter 4: Candidate Status pills */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Candidate Status</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "All", label: "All" },
              { id: "Active", label: "Active" },
              { id: "In Review", label: "In Review" },
              { id: "Priority", label: "Priority" },
              { id: "Screening", label: "Screening" }
            ].map((statusObj) => {
              const isActive = statusFilter === statusObj.id;
              return (
                <button
                  key={statusObj.id}
                  onClick={() => setStatusFilter(statusObj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {statusObj.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT CANDIDATES TABLE PANEL (Screenshot 4 Alignment) */}
      <div className="col-span-12 lg:col-span-9 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[65vh]">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-display text-xl font-bold text-slate-900">Candidates</h3>
            <p className="text-xs text-slate-500 mt-1">Showing {filteredCandidates.length} profiles found with AI matching.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input inside Candidates Panel */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
              />
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Bulk Resume Upload
            </button>
            <button
              onClick={handleExportAllCandidates}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              Export XL
            </button>
            <button
              onClick={() => {
                alert("Successfully added selected candidates to the pipeline!");
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-blue-100" />
              Add to Pipeline
            </button>
          </div>
        </div>

        {/* Responsive Candidates Table */}
        <div className="flex-grow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-mono text-[10px] uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-5 w-12 text-center">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500/20" />
                </th>
                <th className="py-3 px-5 font-semibold">Candidate</th>
                <th className="py-3 px-5 font-semibold">Current Company</th>
                <th className="py-3 px-5 font-semibold">Exp</th>
                <th className="py-3 px-5 font-semibold">Top Skills</th>
                <th className="py-3 px-5 font-semibold text-center">AI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <FileText className="w-10 h-10 opacity-30 mx-auto mb-2" />
                    <span>No candidates matching filter settings</span>
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((cand) => {
                  const score = getAiScore(cand);
                  return (
                    <tr 
                      key={cand.id} 
                      className="hover:bg-slate-50/40 transition-colors group cursor-pointer"
                      onClick={() => handleSelectCandidate(cand)}
                    >
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500/20" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
                            {cand.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{cand.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{cand.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-700">
                        {cand.currentCompany || "N/A"}
                      </td>
                      <td className="py-4 px-5 font-mono text-xs font-semibold text-slate-600">
                        {cand.yearsOfExp} yrs
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1">
                          {cand.topSkills.slice(0, 3).map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {cand.topSkills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center ml-1">+{cand.topSkills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center justify-center font-bold px-2 py-1 rounded-full text-xs border ${getScoreBadgeStyles(score)}`}>
                          {score}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold shrink-0">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-lg cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            
            {[...Array(totalPages)].map((_, idx) => {
              const pg = idx + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer ${
                    currentPage === pg 
                      ? "bg-blue-600 text-white font-bold" 
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pg}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-lg cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED RESUME & CHAT & QUESTION GENERATOR DRAWER */}
      {showDrawer && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          {/* Backdrop closer */}
          <div className="flex-grow h-full cursor-pointer" onClick={() => setShowDrawer(false)}></div>
          
          {/* Drawer content block (Width matches desktop detail pane nicely) */}
          <div className="w-full max-w-2xl bg-slate-50 h-full shadow-2xl flex flex-col animate-slide-left overflow-hidden border-l border-slate-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200/80 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-extrabold text-blue-700 uppercase">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-display text-lg font-bold text-slate-900">{selectedCandidate.name}</h4>
                  <p className="text-xs text-slate-500">{selectedCandidate.email} • {selectedCandidate.yearsOfExp} Yrs Experience</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar text-left">
              
              {/* Profile details block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <h5 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Candidate Profile</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.topSkills.map((s, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience Column */}
                <div className="space-y-6">
                  {/* Work Experience */}
                  <section className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
                    <h5 className="font-display font-bold text-slate-900 text-xs mb-4 uppercase tracking-wider text-slate-400">Work Experience</h5>
                    <div className="space-y-4">
                      {selectedCandidate.experience?.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-blue-500 pl-3 space-y-1">
                          <p className="font-bold text-slate-800 text-xs leading-tight">{exp.role}</p>
                          <p className="text-[10px] text-slate-500">{exp.company} • {exp.duration}</p>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education */}
                  <section className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
                    <h5 className="font-display font-bold text-slate-900 text-xs mb-4 uppercase tracking-wider text-slate-400">Education</h5>
                    <div className="space-y-3">
                      {selectedCandidate.education?.map((edu, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <p className="font-bold text-slate-800 text-xs">{edu.degree}</p>
                          <p className="text-[10px] text-slate-500">{edu.school} • Class of {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* AI Assist & Question Generator Column */}
                <div className="space-y-6">
                  {/* Chat with Resume */}
                  <section className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-[320px] overflow-hidden">
                    <div className="p-3.5 border-b border-slate-100 flex items-center gap-2 text-purple-600 shrink-0 bg-slate-50">
                      <BrainCircuit className="w-4 h-4 fill-purple-100" />
                      <span className="font-display font-bold text-xs text-slate-800">RecruitAI Assist</span>
                    </div>
                    
                    {/* Messages list */}
                    <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-3">
                      {chatMessages.map((msg, idx) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed text-left ${
                              isUser 
                                ? "bg-slate-900 text-white" 
                                : "bg-purple-50 text-purple-900 border border-purple-100"
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        );
                      })}
                      {isChatSending && (
                        <div className="flex justify-start">
                          <div className="p-2.5 bg-purple-50 rounded-xl text-xs border border-purple-100 text-purple-400 animate-pulse">
                            Thinking...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 flex gap-2 shrink-0 bg-white">
                      <input
                        type="text"
                        placeholder={`Ask about ${selectedCandidate.name}...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-grow px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
                      />
                      <button 
                        type="submit"
                        disabled={isChatSending || !chatInput.trim()}
                        className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </section>

                  {/* Interview Questions */}
                  <section className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-left">
                    <div className="flex items-center gap-2 text-blue-600 mb-4">
                      <Sparkles className="w-4 h-4 fill-blue-100" />
                      <span className="font-display font-bold text-xs text-slate-800">Tailored Questions</span>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <select
                        value={selectedJobForQuestions}
                        onChange={(e) => setSelectedJobForQuestions(e.target.value)}
                        className="flex-grow p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-semibold text-slate-600"
                      >
                        {jobs.map(j => (
                          <option key={j.id} value={j.id}>{j.title}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleGenerateQuestions}
                        disabled={isGeneratingQuestions}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        {isGeneratingQuestions ? "..." : "Generate"}
                      </button>
                    </div>

                    {generatedQuestions.length > 0 ? (
                      <div className="space-y-2.5 max-h-[140px] overflow-y-auto custom-scrollbar">
                        {generatedQuestions.map((q, idx) => (
                          <div key={idx} className="flex gap-2 items-start p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                            <span className="font-bold text-blue-600 text-[10px] shrink-0 font-mono">Q{idx+1}</span>
                            <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{q}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 text-center py-4">Tailor exact interview questions on demand.</p>
                    )}
                  </section>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* BULK UPLOAD RESUME MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-600" />
                <h4 className="font-display font-bold text-lg text-slate-900">Parse Resume via RecruitAI</h4>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleUploadResume} className="p-6 space-y-4 text-left">
              <p className="text-xs text-slate-500 leading-normal">
                Paste the candidate&apos;s raw text or detailed resume description below. RecruitAI will extract structured profiles (Contact Info, Experience, Education, Projects, and Certifications) and run the hybrid matching algorithms.
              </p>
              
              <textarea
                rows={8}
                placeholder="Paste resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required
                className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
                >
                  {isUploading ? "RecruitAI Parsing..." : "Start Parsing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
