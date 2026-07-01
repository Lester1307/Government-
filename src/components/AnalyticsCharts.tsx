import React, { useState } from "react";
import { GameState, GameHistoryPoint } from "../types";
import { TrendingUp, Users, Coins, Landmark } from "lucide-react";

interface AnalyticsChartsProps {
  gameState: GameState;
}

export default function AnalyticsCharts({ gameState }: AnalyticsChartsProps) {
  const { history, demographics } = gameState;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Render metric card helper
  const renderDemographicBar = (label: string, value: number, colorClass: string, bgClass: string) => {
    return (
      <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5" id={`demo-bar-${label.replace(/\s+/g, '-').toLowerCase()}`}>
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

  // Safe data getter
  const data: GameHistoryPoint[] = history && history.length > 0 ? history : [
    { date: "Jul", gdp: 275.4, gdpGrowth: 6.8, inflation: 4.8, unemployment: 6.2, popularity: 54.5, treasury: 6.5 }
  ];

  const N = data.length;

  // Custom Chart Generator
  const renderSvgChart = (
    metrics: Array<{ key: keyof GameHistoryPoint; color: string; label: string; strokeWidth?: number; dashed?: boolean }>,
    domain: [number, number],
    fillGradientId?: string
  ) => {
    const width = 500;
    const height = 150;
    const paddingLeft = 30;
    const paddingRight = 15;
    const paddingTop = 15;
    const paddingBottom = 20;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const [minVal, maxVal] = domain;

    // Helper to map data point to SVG coords
    const getCoords = (index: number, val: number) => {
      const x = paddingLeft + (index / Math.max(1, N - 1)) * chartWidth;
      const pct = (val - minVal) / Math.max(0.1, maxVal - minVal);
      const y = paddingTop + (1 - pct) * chartHeight;
      return { x, y };
    };

    // Build SVG paths for each metric
    const paths = metrics.map((m) => {
      let pathStr = "";
      for (let i = 0; i < N; i++) {
        const val = Number(data[i][m.key] || 0);
        const { x, y } = getCoords(i, val);
        if (i === 0) {
          pathStr += `M ${x} ${y}`;
        } else {
          pathStr += ` L ${x} ${y}`;
        }
      }
      return pathStr;
    });

    // Build Area Path for the first metric if gradient is requested
    let areaPathStr = "";
    if (fillGradientId && metrics.length > 0 && N > 0) {
      const firstMetric = metrics[0];
      const start = getCoords(0, Number(data[0][firstMetric.key] || 0));
      const end = getCoords(N - 1, Number(data[N - 1][firstMetric.key] || 0));
      
      areaPathStr = `M ${start.x} ${height - paddingBottom}`;
      for (let i = 0; i < N; i++) {
        const val = Number(data[i][firstMetric.key] || 0);
        const { x, y } = getCoords(i, val);
        areaPathStr += ` L ${x} ${y}`;
      }
      areaPathStr += ` L ${end.x} ${height - paddingBottom} Z`;
    }

    // Grid lines (3 horizontal grid lines)
    const gridYValues = [minVal, minVal + (maxVal - minVal) / 2, maxVal];

    return (
      <div className="relative w-full h-full select-none" onMouseLeave={() => setHoveredIndex(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Indigo Area Gradient */}
            <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            {/* Emerald Area Gradient */}
            <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            {/* Glow Filter */}
            <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Lines and Y-Axis Labels */}
          {gridYValues.map((gVal, idx) => {
            const pct = (gVal - minVal) / Math.max(0.1, maxVal - minVal);
            const y = paddingTop + (1 - pct) * chartHeight;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#ffffff"
                  strokeOpacity={0.06}
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  fill="#64748b"
                  fontSize={8}
                  textAnchor="end"
                  className="font-mono font-bold"
                >
                  {gVal.toFixed(idx === 1 ? 1 : 0)}
                  {metrics[0].key === "gdpGrowth" || metrics[0].key === "popularity" || metrics[0].key === "inflation" ? "%" : ""}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {fillGradientId && areaPathStr && (
            <path d={areaPathStr} fill={`url(#${fillGradientId})`} />
          )}

          {/* Metric lines */}
          {paths.map((pathStr, idx) => {
            const m = metrics[idx];
            return (
              <path
                key={m.key as string}
                d={pathStr}
                fill="none"
                stroke={m.color}
                strokeWidth={m.strokeWidth || 2}
                strokeDasharray={m.dashed ? "4 4" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#svgGlow)"
              />
            );
          })}

          {/* X Axis Labels */}
          {data.map((point, idx) => {
            // Show first, middle, last labels or every second label
            if (N > 6 && idx % 2 !== 0 && idx !== N - 1) return null;
            const { x } = getCoords(idx, 0);
            return (
              <text
                key={idx}
                x={x}
                y={height - 4}
                fill="#64748b"
                fontSize={8}
                textAnchor="middle"
                className="font-mono font-medium"
              >
                {point.date}
              </text>
            );
          })}

          {/* Vertical Dotted Indicator Line on Hover */}
          {hoveredIndex !== null && hoveredIndex < N && (
            <line
              x1={getCoords(hoveredIndex, minVal).x}
              y1={paddingTop}
              x2={getCoords(hoveredIndex, minVal).x}
              y2={height - paddingBottom}
              stroke="#daa520"
              strokeOpacity={0.6}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          )}

          {/* Circle indicators on hover */}
          {hoveredIndex !== null && hoveredIndex < N && (
            metrics.map((m) => {
              const val = Number(data[hoveredIndex][m.key] || 0);
              const { x, y } = getCoords(hoveredIndex, val);
              return (
                <g key={m.key as string}>
                  {/* Outer glowing circle */}
                  <circle cx={x} cy={y} r={5} fill={m.color} opacity={0.4} />
                  {/* Inner crisp circle */}
                  <circle cx={x} cy={y} r={3.5} fill="#0a0d14" stroke={m.color} strokeWidth={1.5} />
                </g>
              );
            })
          )}
        </svg>

        {/* Hover-receptive columns */}
        <div className="absolute inset-0 flex" style={{ paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px`, paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}>
          {Array.from({ length: N }).map((_, idx) => (
            <div
              key={idx}
              className="h-full flex-1 cursor-crosshair relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onTouchStart={() => setHoveredIndex(idx)}
            />
          ))}
        </div>

        {/* Tooltip Overlay */}
        {hoveredIndex !== null && hoveredIndex < N && (
          <div 
            className="absolute z-30 bg-[#0a0d14]/95 border border-amber-500/30 backdrop-blur-md rounded-lg p-2.5 shadow-xl text-left pointer-events-none text-[10px] space-y-1 w-32"
            style={{
              left: `${Math.min(
                width - 140,
                Math.max(10, (hoveredIndex / Math.max(1, N - 1)) * chartWidth + paddingLeft - 64)
              )}px`,
              top: "10px"
            }}
          >
            <div className="font-bold text-amber-500 border-b border-white/10 pb-1 mb-1 flex justify-between items-center">
              <span>{data[hoveredIndex].date}</span>
              <span className="text-[8px] text-slate-500 uppercase font-mono">Month Stats</span>
            </div>
            {metrics.map((m) => {
              const val = Number(data[hoveredIndex][m.key] || 0);
              return (
                <div key={m.key as string} className="flex justify-between items-center space-x-2">
                  <span className="text-slate-400 font-sans flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.label}
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {m.key === "gdp" ? "₹" : ""}
                    {val.toFixed(m.key === "gdp" ? 1 : 1)}
                    {m.key === "gdpGrowth" || m.key === "popularity" || m.key === "inflation" || m.key === "unemployment" ? "%" : ""}
                    {m.key === "gdp" ? " L Cr" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex items-center space-x-4" id="metric-card-gdp">
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
        <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex items-center space-x-4" id="metric-card-reserves">
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
        <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex items-center space-x-4" id="metric-card-approval">
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
        {/* SVG Analytics Area */}
        <div className="lg:col-span-8 bg-[#0a0d14] border border-white/10 rounded-xl p-5 space-y-6">
          <div>
            <h3 className="font-serif italic text-amber-500 text-sm">Economic Trajectory</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Historical and projected statistics of your administration. Hover/touch to scrub dates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: GDP */}
            <div className="h-60 bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col justify-between" id="chart-gdp-growth">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 font-sans">GDP Growth Rate (%)</h4>
              <div className="w-full flex-1 min-h-[170px]">
                {renderSvgChart(
                  [{ key: "gdpGrowth", color: "#6366f1", label: "GDP Growth" }],
                  [2, 10],
                  "gdpGrad"
                )}
              </div>
            </div>

            {/* Chart 2: Popularity */}
            <div className="h-60 bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col justify-between" id="chart-approval-rating">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 font-sans">Government Approval Trend (%)</h4>
              <div className="w-full flex-1 min-h-[170px]">
                {renderSvgChart(
                  [{ key: "popularity", color: "#10b981", label: "Approval" }],
                  [30, 80],
                  "popGrad"
                )}
              </div>
            </div>
          </div>

          {/* Combined Indicators Line Chart */}
          <div className="h-56 bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col justify-between" id="chart-macro-economic">
            <h4 className="text-xs font-semibold text-slate-300 mb-1 font-sans">Macro-Economic Balance (Inflation vs Unemployment)</h4>
            <div className="w-full flex-1 min-h-[150px]">
              {renderSvgChart(
                [
                  { key: "inflation", color: "#f43f5e", label: "Inflation" },
                  { key: "unemployment", color: "#eab308", label: "Unemployment" }
                ],
                [0, 10]
              )}
            </div>
            {/* Custom Legend */}
            <div className="flex justify-center items-center space-x-6 text-[10px] text-slate-400 pt-1.5 border-t border-white/5 font-sans">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                <span className="font-medium">Retail Inflation</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="font-medium">Unemployment Rate</span>
              </span>
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
