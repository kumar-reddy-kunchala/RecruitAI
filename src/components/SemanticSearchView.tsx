import React, { useState } from "react";
import { 
  BrainCircuit, 
  Search, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  UserCheck, 
  HelpCircle 
} from "lucide-react";

export default function SemanticSearchView() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (searchQuery: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsSearching(true);
    setSearched(true);

    fetch("/api/semantic-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q })
    })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setIsSearching(false);
      })
      .catch(err => {
        console.error("Semantic search failed:", err);
        setIsSearching(false);
      });
  };

  const sampleQueries = [
    "Figma design system tokens and auto-layouts",
    "Senior Frontend dev with React, Vite and Tailwind",
    "ETL pipelines and database transactional schemas",
    "Machine learning, transformers and Python PyTorch models",
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header Greeting */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">AI Semantic Search</h2>
        <p className="text-slate-500 mt-1">Search your candidate talent pool using natural human language context instead of strict keyword matches.</p>
      </div>

      {/* Main Search Workspace */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute -right-16 -top-16 w-44 h-44 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-md">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-display font-extrabold text-slate-900 text-lg">What are you looking for?</h4>
            <p className="text-xs text-slate-400 mt-1">Type complete profiles, skills packages, or engineering values.</p>
          </div>

          {/* Interactive Search Box */}
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch("")}
                placeholder="e.g. creative frontend developer who understands Figma tokens and Framer animations"
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            <button
              onClick={() => handleSearch("")}
              disabled={isSearching || !query.trim()}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSearching ? "Searching..." : "Search"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sample Pills */}
          <div className="space-y-2.5">
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest text-center">Suggested queries</p>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    handleSearch(q);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-full transition-all cursor-pointer border border-slate-200/50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results list */}
      {searched && (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h5 className="font-display font-bold text-slate-900 text-sm">Semantic Matching Candidates</h5>
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Matched by RecruitAI Embedding Engine</span>
          </div>

          {isSearching ? (
            <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm mt-1">Analyzing candidate matrix vectors...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <FileText className="w-10 h-10 opacity-30 mx-auto mb-2" />
              <p className="text-sm font-medium">No results found matching that query context.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {results.map((res, idx) => (
                <div key={res.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/45 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 font-bold text-slate-600 flex items-center justify-center shrink-0 uppercase mt-0.5">
                      {res.name.charAt(0)}
                    </div>
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{res.name}</span>
                        <span className="text-xs text-slate-500">• {res.currentCompany} • {res.yearsOfExp} Yrs exp</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {res.resumeText}
                      </p>
                      
                      {res.aiMatchReason && (
                        <div className="bg-blue-50 border border-blue-100/50 p-3 rounded-xl flex items-start gap-2 mt-1">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800 leading-normal font-semibold">
                            <strong>AI Match Reason:</strong> {res.aiMatchReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 justify-between h-full min-h-[50px]">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 text-purple-700 rounded-lg text-xs font-bold font-mono shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 fill-purple-100" />
                      {res.aiMatchScore}% Match
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-2">Score Confidence: High</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
