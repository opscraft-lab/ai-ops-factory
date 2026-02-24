"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

// ========== DEMO DATA ==========
const kpiData = {
  healthScore: 62,
  industryAvg: 70,
  topPerformers: 85,
  annualSavings: 57600,
  saasWaste: 31200,
  processHours: 38,
  totalTools: 47,
  monthlySpend: 23400,
  monthlyWaste: 4800,
  flaggedTools: 12,
};

const wasteBreakdown = [
  { name: "Unused SaaS Licenses", amount: 18400, percent: 78, color: "#dc3545", detail: "8 tools with <10% usage in last 90 days" },
  { name: "Manual Process Waste", amount: 14400, percent: 61, color: "#1a73e8", detail: "~38h/week of automatable admin work identified" },
  { name: "Duplicate Tools", amount: 12800, percent: 54, color: "#e8710a", detail: "3 pairs of overlapping functionality detected" },
  { name: "Overpriced Subscriptions", amount: 8200, percent: 35, color: "#7c3aed", detail: "4 tools above market benchmark pricing" },
  { name: "Cost Anomalies", amount: 3800, percent: 16, color: "#f59e0b", detail: "2 unexpected billing increases detected" },
];

const quickWins = [
  { action: "Cancel unused Miro Enterprise licenses (28 seats, 4 active)", category: "Unused License", categoryColor: "red", savings: 9600, effort: 1, status: "Pending" },
  { action: "Consolidate Slack + MS Teams (duplicate communication tools)", category: "Duplicate Tool", categoryColor: "orange", savings: 7200, effort: 2, status: "Pending" },
  { action: "Automate weekly client reporting (currently 12h/week manual)", category: "Process", categoryColor: "blue", savings: 6400, effort: 3, status: "Pending" },
  { action: "Downgrade Adobe CC (18 full licenses, 6 need full suite)", category: "Overpriced", categoryColor: "purple", savings: 5400, effort: 1, status: "Pending" },
  { action: "Replace Notion + Confluence with single knowledge base", category: "Duplicate Tool", categoryColor: "orange", savings: 3800, effort: 2, status: "Pending" },
];

const saasTools = [
  { name: "Slack Business+", abbr: "Sl", color: "#4A154B", category: "Communication", cost: 1020, users: 34, usage: 92, status: "warning", finding: "Duplicate with Teams", findingColor: "orange" },
  { name: "Microsoft Teams", abbr: "Te", color: "#5059C9", category: "Communication", cost: 580, users: 34, usage: 34, status: "warning", finding: "Duplicate with Slack", findingColor: "orange" },
  { name: "Miro Enterprise", abbr: "Mr", color: "#FF3366", category: "Collaboration", cost: 800, users: 28, usage: 14, status: "danger", finding: "4 of 28 seats active", findingColor: "red" },
  { name: "Adobe Creative Cloud", abbr: "Ad", color: "#FF0000", category: "Design", cost: 1260, users: 18, usage: 33, status: "warning", finding: "Only 6 need full suite", findingColor: "purple" },
  { name: "Notion Team", abbr: "No", color: "#000000", category: "Knowledge Base", cost: 340, users: 34, usage: 78, status: "warning", finding: "Overlaps Confluence", findingColor: "orange" },
  { name: "Confluence", abbr: "Co", color: "#0052CC", category: "Knowledge Base", cost: 275, users: 34, usage: 22, status: "danger", finding: "Overlaps Notion", findingColor: "orange" },
  { name: "HubSpot Pro", abbr: "Hu", color: "#F4511E", category: "CRM", cost: 890, users: 12, usage: 68, status: "active", finding: "Active", findingColor: "green" },
  { name: "Figma Organization", abbr: "Fg", color: "#6B52AE", category: "Design", cost: 675, users: 15, usage: 87, status: "active", finding: "Active", findingColor: "green" },
  { name: "Jira Software", abbr: "Jr", color: "#2684FF", category: "Project Mgmt", cost: 510, users: 34, usage: 91, status: "active", finding: "Active", findingColor: "green" },
  { name: "Todoist Business", abbr: "To", color: "#E44332", category: "Task Mgmt", cost: 170, users: 34, usage: 8, status: "danger", finding: "Virtually unused", findingColor: "red" },
];

const savingsCategories = [
  { name: "Unused\nLicenses", amount: 18400, percent: 75, color: "#dc3545" },
  { name: "Process\nWaste", amount: 14400, percent: 60, color: "#1a73e8" },
  { name: "Duplicate\nTools", amount: 12800, percent: 52, color: "#e8710a" },
  { name: "Overpriced\nSubs", amount: 8200, percent: 33, color: "#7c3aed" },
  { name: "Cost\nAnomalies", amount: 3800, percent: 15, color: "#f59e0b" },
];

const timeline = [
  { title: "Week 1-2: Cancel unused licenses", desc: "Miro, Todoist, 3 other tools with <15% usage", amount: "€14,800", color: "#0d9f6e" },
  { title: "Week 3-4: Consolidate duplicate tools", desc: "Choose Slack or Teams, Notion or Confluence", amount: "€11,000", color: "#1a73e8" },
  { title: "Week 5-6: Renegotiate overpriced contracts", desc: "Adobe CC downgrade, HubSpot annual switch", amount: "€8,200", color: "#7c3aed" },
  { title: "Week 7-10: Automate manual processes", desc: "Client reporting, invoice processing, onboarding", amount: "€14,400", color: "#e8710a" },
  { title: "Ongoing: Monitor & optimize", desc: "Monthly reviews, new tool requests, spending alerts", amount: "Recurring", color: "#f59e0b" },
];

// ========== HELPER COMPONENTS ==========
function EffortDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-blue-500" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

function UsageBar({ percent }: { percent: number }) {
  const color = percent >= 60 ? "bg-green-500" : percent >= 30 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-gray-500">{percent}%</span>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { active: "bg-green-500", warning: "bg-orange-500", danger: "bg-red-500" };
  const labels: Record<string, string> = { active: "OK", warning: "Review", danger: "Critical" };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${colors[status]}`} />
      <span className="text-xs">{labels[status]}</span>
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  const styles: Record<string, string> = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${styles[color]}`}>{children}</span>;
}

// ========== HEALTH SCORE RING ==========
function HealthScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);
  const circumference = 2 * Math.PI * 80;
  const offset = animated ? circumference - (circumference * score) / 100 : circumference;

  return (
    <div className="flex flex-col items-center py-5">
      <div className="relative w-44 h-44">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke="#f1f3f5" strokeWidth="10" />
          <circle cx="90" cy="90" r="80" fill="none" stroke="#1a73e8" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-[1500ms] ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tracking-tight">{score}</span>
          <span className="text-xs text-gray-400 font-medium mt-1">out of 100</span>
        </div>
      </div>
      <div className="w-full mt-5 space-y-0">
        {[
          { label: "Your Score", value: score.toString(), color: "text-orange-500" },
          { label: "Industry Average", value: kpiData.industryAvg.toString(), color: "text-gray-900" },
          { label: "Top Performers", value: `${kpiData.topPerformers}+`, color: "text-green-500" },
        ].map((b) => (
          <div key={b.label} className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
            <span className="text-gray-500">{b.label}</span>
            <span className={`font-semibold font-mono text-xs ${b.color}`}>{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== SIDEBAR NAV ITEM ==========
function NavItem({ icon, label, active, badge, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; badge?: number; onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13.5px] mb-0.5 transition-all
      ${active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
      <div className={`w-[18px] h-[18px] ${active ? "opacity-100" : "opacity-60"}`}>{icon}</div>
      {label}
      {badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

// ========== MAIN DASHBOARD ==========
export default function DashboardPage() {
  const [activePage, setActivePage] = useState("overview");
  const [documents, setDocuments] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDocuments(data);
    };
    fetchDocuments();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const fmt = (n: number) => n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : `€${n}`;
  const fmtFull = (n: number) => `€${n.toLocaleString("de-DE")}`;

  return (
    <div className="flex min-h-screen bg-[#fafbfc]" style={{ fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ===== SIDEBAR ===== */}
      <aside className="w-[260px] bg-white border-r border-gray-200 p-6 flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <Link href="/" className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-[10px] flex items-center justify-center text-white font-bold text-sm">Ai</div>
          <div>
            <div className="text-[15px] font-semibold text-gray-900 tracking-tight">AI Ops Factory</div>
            <div className="text-[11px] text-gray-400">Operations Intelligence</div>
          </div>
        </Link>

        <nav className="flex-1">
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Overview</div>
            <NavItem active={activePage === "overview"} onClick={() => setActivePage("overview")} label="Dashboard"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>} />
            <NavItem active={activePage === "saas"} onClick={() => setActivePage("saas")} label="SaaS Overview" badge={7}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
            <NavItem active={activePage === "actions"} onClick={() => setActivePage("actions")} label="Action Plan"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
          </div>
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Analysis</div>
            <NavItem active={activePage === "savings"} onClick={() => setActivePage("savings")} label="Savings Map"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
            <NavItem label="Reports"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>} />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Settings</div>
            <NavItem label="Settings"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>} />
          </div>
        </nav>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">ST</div>
            <div className="text-xs leading-tight">
              <div className="font-semibold text-gray-900">AI Ops Factory</div>
              <div className="text-gray-400 text-[11px]">Free Plan</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all">
            Abmelden
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 ml-[260px] p-7 max-w-[1400px]">

        {/* ===== OVERVIEW PAGE ===== */}
        {activePage === "overview" && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-7">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Operations Health</h1>
                <p className="text-sm text-gray-500 mt-1">Last scan: February 21, 2026 · Demo Tech GmbH · 34 employees</p>
              </div>
              <div className="flex gap-2.5">
                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 hover:border-gray-300 hover:text-gray-900 transition-all flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export PDF
                </button>
                <Link href="/upload" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  New Scan
                </Link>
              </div>
            </div>

            {/* Company Banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-5 px-6 mb-6 flex items-center justify-between text-white">
              <div>
                <h3 className="text-base font-semibold mb-1">Demo Tech GmbH — Ops Waste Scan Results</h3>
                <p className="text-xs opacity-70">Digital agency · Berlin, Germany · 34 employees · Scan period: Aug 2025 – Jan 2026</p>
              </div>
              <div className="flex gap-8">
                {[
                  { val: "47", lbl: "SaaS Tools" },
                  { val: "€23.4k", lbl: "Monthly Spend" },
                  { val: "€4.8k", lbl: "Monthly Waste" },
                ].map((m) => (
                  <div key={m.lbl} className="text-center">
                    <div className="text-xl font-bold tracking-tight">{m.val}</div>
                    <div className="text-[10px] opacity-60 uppercase tracking-wider mt-0.5">{m.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 px-4 flex items-center gap-2.5 mb-5 text-sm text-red-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span><strong>7 critical findings</strong> identified — estimated annual savings potential: <strong>€57,600</strong></span>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Ops Health Score", value: "62", suffix: "/100", valueClass: "text-blue-600", change: "8 pts below industry avg", changeType: "negative" },
                { label: "Annual Savings Potential", value: "€57.6k", valueClass: "text-green-500", change: "20.5% of total ops spend", changeType: "positive" },
                { label: "SaaS Waste Found", value: "€31.2k", valueClass: "text-orange-500", change: "12 tools flagged", changeType: "negative" },
                { label: "Process Efficiency", value: "38h", suffix: "/week", valueClass: "text-gray-900", change: "Automatable manual work", changeType: "negative" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
                  <div className="text-xs font-medium text-gray-400 mb-2">{kpi.label}</div>
                  <div className={`text-[28px] font-bold tracking-tight leading-none ${kpi.valueClass}`}>
                    {kpi.value}<span className="text-base font-normal text-gray-400">{kpi.suffix || ""}</span>
                  </div>
                  <div className={`text-xs mt-2 flex items-center gap-1 ${kpi.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Health Score + Breakdown */}
            <div className="grid grid-cols-[1fr_2fr] gap-4 mb-6">
              {/* Health Score */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-sm font-semibold">Ops Health Score</div>
                    <div className="text-xs text-gray-400 mt-0.5">Compared to DACH industry benchmark</div>
                  </div>
                  <Tag color="orange">Below Average</Tag>
                </div>
                <HealthScoreRing score={kpiData.healthScore} />
              </div>

              {/* Waste Breakdown */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-sm font-semibold">Waste Breakdown by Category</div>
                    <div className="text-xs text-gray-400 mt-0.5">Annual savings potential per area</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {wasteBreakdown.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-gray-900">{item.name}</span>
                        <span className="text-xs font-semibold font-mono text-gray-900">{fmtFull(item.amount)}/yr</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Wins */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-sm font-semibold">Top 5 Quick Wins</div>
                  <div className="text-xs text-gray-400 mt-0.5">Highest impact, lowest effort — implement these first</div>
                </div>
                <Tag color="green">€32,400/yr potential</Tag>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3 w-8"></th>
                    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3">Action</th>
                    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3">Category</th>
                    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3">Est. Savings</th>
                    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3">Effort</th>
                    <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quickWins.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 pr-2">
                        <div className={`w-2 h-2 rounded-full ${i < 3 ? "bg-red-500" : "bg-orange-500"}`} />
                      </td>
                      <td className="py-3.5 text-sm font-medium text-gray-900">{item.action}</td>
                      <td className="py-3.5"><Tag color={item.categoryColor}>{item.category}</Tag></td>
                      <td className="py-3.5 text-xs font-semibold font-mono text-green-500">{fmtFull(item.savings)}/yr</td>
                      <td className="py-3.5"><EffortDots level={item.effort} /></td>
                      <td className="py-3.5"><Tag color="orange">{item.status}</Tag></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== SAAS OVERVIEW PAGE ===== */}
        {activePage === "saas" && (
          <div>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SaaS Overview</h1>
                <p className="text-sm text-gray-500 mt-1">47 tools detected · €23,400/month total spend · 12 flagged</p>
              </div>
              <div className="flex gap-2.5">
                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 hover:border-gray-300 transition-all">Filter</button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all">Export CSV</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Total Monthly SaaS Spend", value: "€23,400", change: "↑ 18% vs. last year", changeType: "negative" },
                { label: "Optimized Monthly Spend", value: "€18,600", valueClass: "text-green-500", change: "Save €4,800/month", changeType: "positive" },
                { label: "Tools Flagged", value: "12", valueClass: "text-red-500", change: "of 47 total tools", changeType: "negative" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
                  <div className="text-xs font-medium text-gray-400 mb-2">{kpi.label}</div>
                  <div className={`text-[28px] font-bold tracking-tight leading-none ${kpi.valueClass || "text-gray-900"}`}>{kpi.value}</div>
                  <div className={`text-xs mt-2 ${kpi.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>{kpi.change}</div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold">All SaaS Subscriptions</div>
                <Tag color="red">12 issues found</Tag>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Tool", "Cost/mo", "Users", "Usage", "Status", "Finding"].map((h) => (
                      <th key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {saasTools.map((tool) => (
                    <tr key={tool.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: tool.color }}>{tool.abbr}</div>
                          <div>
                            <div className="text-xs font-medium text-gray-900">{tool.name}</div>
                            <div className="text-[11px] text-gray-400">{tool.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-xs font-mono font-medium">{fmtFull(tool.cost)}</td>
                      <td className="py-3 text-xs">{tool.users}</td>
                      <td className="py-3"><UsageBar percent={tool.usage} /></td>
                      <td className="py-3"><StatusDot status={tool.status} /></td>
                      <td className="py-3"><Tag color={tool.findingColor}>{tool.finding}</Tag></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== ACTION PLAN PAGE ===== */}
        {activePage === "actions" && (
          <div>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Action Plan</h1>
                <p className="text-sm text-gray-500 mt-1">14 recommendations · sorted by impact/effort ratio</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Impact vs Effort Matrix */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="text-sm font-semibold mb-5">Impact vs. Effort Matrix</div>
                <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-56 bg-gray-100 rounded-lg overflow-hidden">
                  {[
                    { count: 5, label: "Quick Wins", sub: "High Impact · Low Effort", bg: "bg-green-50", color: "text-green-600" },
                    { count: 4, label: "Strategic", sub: "High Impact · High Effort", bg: "bg-blue-50", color: "text-blue-600" },
                    { count: 3, label: "Nice to Have", sub: "Low Impact · Low Effort", bg: "bg-gray-50", color: "text-gray-400" },
                    { count: 2, label: "Avoid", sub: "Low Impact · High Effort", bg: "bg-red-50", color: "text-red-500" },
                  ].map((cell) => (
                    <div key={cell.label} className={`${cell.bg} p-3.5 flex flex-col items-center justify-center`}>
                      <div className={`text-3xl font-bold ${cell.color}`}>{cell.count}</div>
                      <div className={`text-[10px] font-semibold uppercase tracking-wider mt-1 ${cell.color}`}>{cell.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{cell.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="text-sm font-semibold mb-5">Implementation Timeline</div>
                <div className="space-y-0">
                  {timeline.map((item) => (
                    <div key={item.title} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900">{item.title}</div>
                        <div className="text-[11.5px] text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== SAVINGS MAP PAGE ===== */}
        {activePage === "savings" && (
          <div>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Savings Map</h1>
                <p className="text-sm text-gray-500 mt-1">Total annual savings potential: €57,600</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Savings by Category */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="text-sm font-semibold mb-5">Savings by Category</div>
                <div className="flex items-end gap-2 h-40 px-1 mt-3">
                  {savingsCategories.map((cat) => (
                    <div key={cat.name} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-semibold font-mono text-gray-500">€{(cat.amount / 1000).toFixed(1)}k</span>
                      <div className="w-full rounded-t cursor-pointer hover:opacity-85 transition-all"
                        style={{ height: `${cat.percent}%`, backgroundColor: cat.color }} />
                      <span className="text-[10px] text-gray-400 font-medium text-center leading-tight whitespace-pre-line">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spend Distribution */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="text-sm font-semibold mb-5">Spend Distribution</div>
                <div className="flex items-center gap-6 py-2.5">
                  <svg className="flex-shrink-0" width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#e8eaed" strokeWidth="16"/>
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#0d9f6e" strokeWidth="16" strokeDasharray="218 121" strokeDashoffset="85" strokeLinecap="round"/>
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#dc3545" strokeWidth="16" strokeDasharray="67 272" strokeDashoffset="-133" strokeLinecap="round"/>
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#e8710a" strokeWidth="16" strokeDasharray="37 302" strokeDashoffset="-200" strokeLinecap="round"/>
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#7c3aed" strokeWidth="16" strokeDasharray="17 322" strokeDashoffset="-237" strokeLinecap="round"/>
                    <text x="70" y="66" textAnchor="middle" fontFamily="DM Sans" fontSize="18" fontWeight="700" fill="#1a1d21">€23.4k</text>
                    <text x="70" y="82" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#9aa0a6">/month</text>
                  </svg>
                  <div className="flex-1 space-y-1.5">
                    {[
                      { color: "#0d9f6e", label: "Efficient Spend", value: "€18,600" },
                      { color: "#dc3545", label: "Unused Licenses", value: "€1,533" },
                      { color: "#e8710a", label: "Duplicate Tools", value: "€1,067" },
                      { color: "#7c3aed", label: "Overpriced", value: "€683" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs py-1.5">
                        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="flex-1 text-gray-500">{item.label}</span>
                        <span className="font-semibold font-mono text-[11px] text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Projection */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="mb-5">
                <div className="text-sm font-semibold">ROI Projection</div>
                <div className="text-xs text-gray-400 mt-0.5">If all recommendations are implemented</div>
              </div>
              <div className="grid grid-cols-4 gap-0">
                {[
                  { label: "Current Annual Ops Cost", value: "€280,800", color: "text-gray-900" },
                  { label: "Optimized Annual Cost", value: "€223,200", color: "text-green-500" },
                  { label: "Annual Savings", value: "€57,600", color: "text-blue-600" },
                  { label: "Savings Rate", value: "20.5%", color: "text-green-500" },
                ].map((item) => (
                  <div key={item.label} className="text-center py-4">
                    <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                    <div className={`text-2xl font-bold tracking-tight ${item.color}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}