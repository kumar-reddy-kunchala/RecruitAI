import React, { useState } from "react";
import { BrainCircuit, Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string; avatarUrl: string }) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("alex.rivera@recruitai.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "alex.rivera@recruitai.com" && password === "password") {
      onLoginSuccess({
        name: "Alex Rivera",
        role: "Senior Recruiter",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_auJkYpZnluWqp_yOdGdEjRzsyrxnhfuVRik5W-tWFMnfC6FNwH0q2raokMSS5a8yflbHvZmBK3F0o6zuuqtVNLGIqUCd64kFW8EnPO4JUPR-3YmkyONSR6MS07FNoJs9UivWqAlSi9HjkmDdxoPYJhsz_Gz6YBVDAvGH4Ef5hr1_e2irRRhatKi9i3i7t1qwni_hdxDz0cliGt9if9Tw_lTvuPuCAZIbtr4pkQ84rESqPLtLEnpYZ8WOQafI8ssDWLY6537P-4hO"
      });
    } else {
      setError("Invalid credential combination. Use the Demo credentials provided.");
    }
  };

  const triggerFastPass = () => {
    onLoginSuccess({
      name: "Alex Rivera",
      role: "Senior Recruiter",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_auJkYpZnluWqp_yOdGdEjRzsyrxnhfuVRik5W-tWFMnfC6FNwH0q2raokMSS5a8yflbHvZmBK3F0o6zuuqtVNLGIqUCd64kFW8EnPO4JUPR-3YmkyONSR6MS07FNoJs9UivWqAlSi9HjkmDdxoPYJhsz_Gz6YBVDAvGH4Ef5hr1_e2irRRhatKi9i3i7t1qwni_hdxDz0cliGt9if9Tw_lTvuPuCAZIbtr4pkQ84rESqPLtLEnpYZ8WOQafI8ssDWLY6537P-4hO"
    });
  };

  return (
    <div id="login-root-container" className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT FORM PANEL (5 Columns) */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-white border-r border-slate-200 text-left">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-slate-900 tracking-tight leading-none">RecruitAI</h1>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enterprise Intelligence</p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500 leading-normal">Enter your credentials to access the Recruitment Intelligence Suite.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              Log in to Suite
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Pass box */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 text-xs">RecruitAI Demo Credentials</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Email: <code className="bg-white px-1 py-0.5 border border-slate-200 rounded text-slate-700 font-bold font-mono">alex.rivera@recruitai.com</code><br/>
                  Password: <code className="bg-white px-1 py-0.5 border border-slate-200 rounded text-slate-700 font-bold font-mono">password</code>
                </p>
              </div>
            </div>
            <button
              onClick={triggerFastPass}
              className="w-full py-2 bg-white border border-blue-200 text-blue-600 font-bold text-xs rounded-lg shadow-sm hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Demo Fast-Pass (One-Click Entry)
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT GRAPHICS PANEL (7 Columns) */}
      <div className="hidden md:flex flex-1 bg-slate-900 text-white p-12 md:p-24 flex-col justify-between relative overflow-hidden text-left">
        {/* Decorative dynamic ambient circles */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2 text-blue-400 relative z-10">
          <Sparkles className="w-4.5 h-4.5 fill-blue-500/10 animate-pulse" />
          <span className="font-mono font-bold text-xs uppercase tracking-widest">RecruitAI Hybrid Match Matrix</span>
        </div>

        {/* Big display headline */}
        <div className="max-w-xl space-y-6 relative z-10">
          <h3 className="font-display text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome back to the future of hiring
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Configure target profiles, auto-parse CV text in microseconds using Gemini API, and rank applicants objectively using our weighted hybrid suitability algorithms.
          </p>

          {/* Interactive stats widgets inside the graphic section */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-800/40 p-4 border border-slate-700/50 rounded-2xl">
              <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Candidate Capacity</p>
              <h5 className="font-display font-bold text-2xl mt-1">42,891</h5>
            </div>
            <div className="bg-slate-800/40 p-4 border border-slate-700/50 rounded-2xl">
              <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Ranking Precision</p>
              <h5 className="font-display font-bold text-2xl text-teal-400 mt-1">98.2%</h5>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-slate-800 pt-8 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Google AI Studio • Antigravity Enterprise</p>
          <span className="text-xs text-slate-500 font-mono">v1.4.2</span>
        </div>

      </div>

    </div>
  );
}
