export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  responsibilities: string[];
  education: string;
  industry: string;
  seniority: string;
  status: 'Active' | 'Closed' | 'Draft';
  createdAt: string;
}

export interface ExperienceRecord {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationRecord {
  degree: string;
  school: string;
  year: string;
}

export interface ProjectRecord {
  name: string;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  currentCompany: string;
  yearsOfExp: number;
  topSkills: string[];
  resumeText: string;
  status: 'Active' | 'In Review' | 'Priority' | 'Screening' | 'Offered';
  education: EducationRecord[];
  experience: ExperienceRecord[];
  projects: ProjectRecord[];
  certifications: string[];
  avatarUrl?: string;
  createdAt: string;
}

export interface RankingScores {
  semanticSimilarity: number; // 35%
  skills: number;             // 25%
  experience: number;         // 15%
  projects: number;           // 10%
  education: number;          // 5%
  certifications: number;     // 5%
  behavioral: number;         // 5%
}

export interface CandidateRanking {
  id: string;
  jobId: string;
  candidateId: string;
  overallScore: number;
  confidenceScore: number;
  scores: RankingScores;
  explanation: string;
  skillsGap: string[];
  resumeSuggestions: string[];
  interviewQuestions: string[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
