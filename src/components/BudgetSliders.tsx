import React, { useState } from "react";
import { Sectors } from "../types";
import { Shield, Hammer, GraduationCap, HeartPulse, Tractor, Rocket, Landmark, Save, HelpCircle, Sparkles } from "lucide-react";

interface BudgetSlidersProps {
  currentSectors: Sectors;
  gdp: number;
  onSaveBudget: (newSectors: Sectors) => void;
  politicalCapital: number;
}

const SECTOR_METADATA = [
  {
    key: "defense",
    label: "Defense & Border Modernization",
    hindiLabel: "रक्षा एवं सीमा आधुनिकीकरण",
    icon: <Shield className="w-5 h-5 text-amber-500" />,
    description: "Army, Navy, Air Force procurement, border posts, and Atmanirbhar weaponry.",
    min: 3.0,
    max: 12.0,
    step: 0.1,
  },
  {
    key: "infrastructure",
    label: "Infrastructure & Railways",
    hindiLabel: "बुनियादी ढांचा एवं राष्ट्रीय मार्ग",
    icon: <Hammer className="w-5 h-5 text-indigo-400" />,
    description: "Highways, high-speed rail, metro lanes, cargo corridors, and shipping ports.",
    min: 5.0,
    max: 20.0,
    step: 0.1,
  },
  {
    key: "education",
    label: "Education & Skill Dev",
    hindiLabel: "शिक्षा एवं कौशल विकास",
    icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
    description: "IITs, AIIMs, central schools, student scholarships, and vocational programs.",
    min: 0.5,
    max: 5.0,
    step: 0.05,
  },
  {
    key: "healthcare",
    label: "Healthcare & Swachh Bharat",
    hindiLabel: "स्वास्थ्य सेवाएं एवं स्वच्छ भारत",
    icon: <HeartPulse className="w-5 h-5 text-rose-400" />,
    description: "Public hospitals, village health wellness centers, and sanitation campaigns.",
    min: 0.5,
    max: 4.0,
    step: 0.05,
  },
  {
    key: "agriculture",
    label: "Agriculture & Rural Irrigation",
    hindiLabel: "कृषि, सिंचाई एवं ग्रामीण विकास",
    icon: <Tractor className="w-5 h-5 text-lime-400" />,
    description: "Fertilizer subsidies, crop insurance, solar pumps, and minor canals.",
    min: 1.0,
    max: 6.0,
    step: 0.1,
  },
  {
    key: "scienceSpace",
    label: "Space (ISRO) & IT Support",
    hindiLabel: "अंतरिक्ष अनुसंधान एवं सूचना प्रौद्योगिकी",
    icon: <Rocket className="w-5 h-5 text-cyan-400" />,
    description: "ISRO planetary probes, AI research grants, supercomputing, and quantum tech.",
    min: 0.1,
    max: 2.0,
    step: 0.05,
  },
  {
    key: "socialWelfare",
    label: "Social Welfare & Subsidies",
    hindiLabel: "सामाजिक कल्याण एवं खाद्य सुरक्षा",
    icon: <Landmark className="w-5 h-5 text-violet-400" />,
    description: "Food security (PM Garib Kalyan), housing (PM Awas), and rural job guarantees (MGNREGA).",
    min: 2.0,
    max: 10.0,
    step: 0.1,
  },
];

export default function BudgetSliders({ currentSectors, gdp, onSaveBudget, politicalCapital }: BudgetSlidersProps) {
  const [sectors, setSectors] = useState<Sectors>({ ...currentSectors });
  const [isSaved, setIsSaved] = useState(false);

  const handleSliderChange = (key: keyof Sectors, val: number) => {
    setSectors((prev) => ({
      ...prev,
      [key]: val,
    }));
    setIsSaved(false);
  };

  const totalSpending = (Object.values(sectors) as number[]).reduce((acc, curr) => acc + curr, 0);
  
  // Tax revenue is modeled as roughly 15.5% of GDP annually
  const annualTaxRevenue = gdp * 0.155;
  const deficit = totalSpending - annualTaxRevenue;
  const deficitPercent = (deficit / totalSpending) * 100;

  const handleSave = () => {
    onSaveBudget(sectors);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-xl font-serif italic text-amber-500 flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-amber-500" />
            <span>Union Annual Budget Allocation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Configure target annual budgets for the Union Government. Changes apply to monthly revenue deductions immediately.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center space-x-1.5 ${
            isSaved
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
              : "bg-amber-600 hover:bg-amber-500 text-black shadow-lg shadow-amber-500/5"
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? "Budget Saved!" : "Apply Union Budget"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Sliders Area */}
        <div className="lg:col-span-8 space-y-4">
          {SECTOR_METADATA.map((meta) => {
            const val = sectors[meta.key as keyof Sectors];
            return (
              <div key={meta.key} className="bg-black/40 border border-white/5 hover:border-white/10 p-4 rounded-xl space-y-2 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-2.5">
                    <div className="mt-0.5">{meta.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
                        <span>{meta.label}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({meta.hindiLabel})</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{meta.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-slate-100">
                      ₹{val.toFixed(2)} L Cr
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">
                      {((val / gdp) * 100).toFixed(1)}% of GDP
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-1">
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={val}
                    onChange={(e) => handleSliderChange(meta.key as keyof Sectors, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="w-12 text-center text-[10px] text-slate-500 font-mono">
                    {meta.min}-{meta.max}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Budget Summary Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#080b11] border border-white/10 rounded-xl p-5 space-y-4 sticky top-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Budgetary Health Check
            </h3>

            <div className="space-y-3.5 divide-y divide-white/10">
              {/* Total Spending */}
              <div className="pt-0">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Total Proposed Budget:</span>
                  <span className="font-mono text-slate-100 font-bold">₹{totalSpending.toFixed(2)} L Cr</span>
                </div>
              </div>

              {/* Tax revenue */}
              <div className="pt-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Estimated Tax Revenue (15.5%):</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{annualTaxRevenue.toFixed(2)} L Cr</span>
                </div>
              </div>

              {/* Surplus or deficit */}
              <div className="pt-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Fiscal Balance:</span>
                  <span className={`font-mono font-bold ${deficit <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {deficit <= 0 ? "Surplus" : "Deficit"}: ₹{Math.abs(deficit).toFixed(2)} L Cr
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {deficit > 0 ? (
                    `Deficit represents ${deficitPercent.toFixed(1)}% of spending. Deficit will drain liquid treasury reserves and accumulate public debt.`
                  ) : (
                    "Surplus adds funds into the national treasury liquid reserves every month."
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="pt-3 text-[11px] text-slate-400 leading-relaxed space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Nirmala's Fiscal Advice:</span>
                </div>
                {deficitPercent > 20 ? (
                  <p className="text-rose-400/90 italic">
                    "Prime Minister, a deficit of this size is unsustainable! Moody's might downgrade our credit ranking. Squeeze infrastructure spending or cut some subsidies."
                  </p>
                ) : deficitPercent > 0 ? (
                  <p className="italic text-amber-500/90">
                    "Deficit is moderate and sustainable for a fast-growing country. Ensure we steer funds towards high-multiplier capital infrastructure."
                  </p>
                ) : (
                  <p className="italic text-emerald-400/90">
                    "Excellent fiscal rectitude, Sir. The surplus buffers us from external crude oil price hikes, but ensure sectors like health and education aren't neglected."
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
