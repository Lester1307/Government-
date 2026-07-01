import React from "react";
import { GameState, Demographics } from "../types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Users, TrendingDown, Coins, Percent, Landmark } from "lucide-react";

interface AnalyticsChartsProps {
  gameState: GameState;
}

export default function AnalyticsCharts({ gameState }: AnalyticsChartsProps) {
  const { history, demographics } = gameState;

  // Render metric card helper
  const renderDemographicBar = (label: string, value: number, colorClass: string, bgClass: string) => {
    return (
      <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-semibold">{label}</span>
          <span className={`font-mono font-bold ${value >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
            {value.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClass} rounded-full transition-all duration-1000`}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 font-medium tracking-wide">
          <span>Discontent</span>
          <span>Approval</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">GDP Output</div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">₹{gameState.gdp.toFixed(2)} L Cr</div>
            <div className="text-xs text-indigo-400 font-medium">Growth rate: +{gameState.gdpGrowth.toFixed(1)}%</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">National Reserves</div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">₹{gameState.treasury.toFixed(2)} L Cr</div>
            <div className="text-xs text-slate-400">Public Debt: <span className="font-mono text-amber-400 font-medium">{gameState.debt.toFixed(1)}% of GDP</span></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cabinet Popularity</div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">{gameState.popularity.toFixed(1)}%</div>
            <div className="text-xs text-emerald-400">Status: {gameState.popularity >= 50 ? "Stable Majority" : "Fragile Coalition"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Analytics Area */}
        <div className="lg:col-span-8 bg-[#0a0d14] border border-white/10 rounded-xl p-5 space-y-6">
          <div>
            <h3 className="font-serif italic text-amber-500 text-sm">Economic Trajectory</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Historical and projected statistics of your administration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: GDP & Treasury */}
            <div className="h-60 bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 font-sans">GDP Growth Rate (%)</h4>
              <div className="w-full flex-1 min-h-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} domain={[3, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0a0d14", borderColor: "#ffffff15", fontSize: 10 }} />
                    <Area type="monotone" dataKey="gdpGrowth" name="GDP Growth" stroke="#6366f1" fillOpacity={1} fill="url(#colorGdp)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Popularity */}
            <div className="h-60 bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 font-sans">Government Approval Trend (%)</h4>
              <div className="w-full flex-1 min-h-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} domain={[35, 75]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0a0d14", borderColor: "#ffffff15", fontSize: 10 }} />
                    <Line type="monotone" dataKey="popularity" name="Approval" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Combined Indicators Line Chart */}
          <div className="h-56 bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
            <h4 className="text-xs font-semibold text-slate-300 mb-1 font-sans">Macro-Economic Balance (Inflation vs Unemployment)</h4>
            <div className="w-full flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} domain={[2, 8]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0a0d14", borderColor: "#ffffff15", fontSize: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="inflation" name="Inflation" stroke="#f43f5e" strokeWidth={2} />
                  <Line type="monotone" dataKey="unemployment" name="Unemployment" stroke="#eab308" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Demographics Area */}
        <div className="lg:col-span-4 bg-[#0a0d14] border border-white/10 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="font-serif italic text-amber-500 text-sm">Voter Demographics</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Constituency segments that vote in Lok Sabha general elections.</p>
          </div>

          <div className="space-y-3.5">
            {renderDemographicBar("Farmers (Kisan)", demographics.farmers, "bg-amber-500", "bg-amber-950/20")}
            {renderDemographicBar("Youth & Students", demographics.youth, "bg-indigo-500", "bg-indigo-950/20")}
            {renderDemographicBar("Corporate / Businesses", demographics.corporate, "bg-cyan-500", "bg-cyan-950/20")}
            {renderDemographicBar("Middle Class Taxpayers", demographics.middleClass, "bg-rose-500", "bg-rose-950/20")}
            {renderDemographicBar("Rural Communities", demographics.rural, "bg-emerald-500", "bg-emerald-950/20")}
            {renderDemographicBar("Urban Citizens", demographics.urban, "bg-violet-500", "bg-violet-950/20")}
          </div>

          <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-[10px] text-slate-400 leading-relaxed font-sans">
            <div className="font-bold text-slate-300 flex items-center space-x-1 mb-1">
              <Landmark className="w-3.5 h-3.5 text-amber-500" />
              <span>General Election Standard:</span>
            </div>
            You must maintain average approval **above 40%** to avoid parliamentary vote of no-confidence. Maintaining **above 50%** ensures stable majority victory. Next election is in **April 2029**.
          </div>
        </div>
      </div>
    </div>
  );
}
