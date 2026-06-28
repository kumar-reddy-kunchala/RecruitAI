import React, { useState, useEffect } from "react";
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  LineChart, 
  History, 
  Database, 
  CheckCircle2, 
  TrendingUp, 
  UserCheck, 
  FileText 
} from "lucide-react";
import { AuditLog } from "../types";

export default function AnalyticsView() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading audit logs:", err);
        setIsLoading(false);
      });
  }, []);

  const funnelData = [
    { name: "Applied", candidates: 4200, fill: "#3B82F6" },
    { name: "Screened", candidates: 2800, fill: "#0D9488" },
    { name: "Interviewed", candidates: 940, fill: "#8B5CF6" },
    { name: "Offer", candidates: 124, fill: "#10B981" }
  ];

  const matchDistributionData = [
    { name: "60-65%", count: 12 },
    { name: "66-70%", count: 24 },
    { name: "71-75%", count: 42 },
    { name: "76-80%", count: 85 },
    { name: "81-85%", count: 110 },
    { name: "86-90%", count: 145 },
    { name: "91-95%", count: 98 },
    { name: "96-100%", count: 32 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header Greeting */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & System Logs</h2>
        <p className="text-slate-500 mt-1">Real-time system transaction tracking, audit logging, and hiring pipeline distribution.</p>
      </div>

      {/* Recharts Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Funnel chart */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h4 className="font-display font-bold text-slate-900 text-base mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Hiring Funnel (Total Volume)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
                <Bar dataKey="candidates" radius={[6, 6, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Talent Match Distribution Area chart */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h4 className="font-display font-bold text-slate-900 text-base mb-6 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-600" />
            Talent Match Score Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={matchDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>

      {/* Audit Logs Database Table */}
      <section className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800">
            <Database className="w-4 h-4 text-slate-500" />
            <h5 className="font-display font-bold text-sm">PostgreSQL DB Audit Log</h5>
          </div>
          <span className="text-[10px] font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Immutable Trace</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Fetching system transaction records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm">No transaction audit entries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-mono text-[9px] uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-5 font-semibold">Event ID</th>
                  <th className="py-3 px-5 font-semibold">Action</th>
                  <th className="py-3 px-5 font-semibold">User</th>
                  <th className="py-3 px-5 font-semibold">Timestamp</th>
                  <th className="py-3 px-5 font-semibold">Transaction Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-mono text-[11px] text-slate-600">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-5 font-semibold text-slate-400">
                      {log.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        log.action === 'JOB_CREATED' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                          : log.action === 'AI_RANKING_COMPLETE'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-semibold text-slate-700">
                      {log.user}
                    </td>
                    <td className="py-3 px-5 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-5 text-slate-700 text-left">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
