import React, { useState } from "react";
import { Sectors } from "../types";
import { 
  Shield, 
  Hammer, 
  GraduationCap, 
  HeartPulse, 
  Tractor, 
  Rocket, 
  Landmark, 
  Save, 
  HelpCircle, 
  Sparkles, 
  MapPin, 
  Coins, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";

interface BudgetSlidersProps {
  currentSectors: Sectors;
  gdp: number;
  onSaveBudget: (newSectors: Sectors) => void;
  politicalCapital: number;
  treasury: number;
  demographics: any;
  onApplyRegionalAllocation: (
    cost: number,
    pcCost: number,
    demographicImpact: Record<string, number>,
    stateName: string
  ) => void;
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
    description: "IITs, AIIMS, central schools, student scholarships, and vocational programs.",
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

const STATES_METADATA = [
  {
    id: "uttar_pradesh",
    name: "Uttar Pradesh",
    hindiName: "उत्तर प्रदेश",
    zone: "North-Central",
    demographics: "Rural Heavy (Farmers, Youth)",
    description: "India's most populous state. High priority for rural irrigation, village road links, farming seeds, and youth skills.",
    primaryImpact: { rural: 1.4, farmers: 1.2, youth: 0.6, middleClass: -0.1, corporate: -0.2, urban: 0.2 },
    defaultAllocation: 0.5,
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    hindiName: "महाराष्ट्र",
    zone: "West",
    demographics: "Urban Heavy (Corporate, Middle Class)",
    description: "Financial engine of India. Demands metro networks, corporate office corridors, technology hubs, and urban planning.",
    primaryImpact: { urban: 1.5, corporate: 1.4, middleClass: 0.8, farmers: -0.1, youth: 0.4, rural: -0.2 },
    defaultAllocation: 0.6,
  },
  {
    id: "tamil_nadu",
    name: "Tamil Nadu",
    hindiName: "तमिलनाडु",
    zone: "South",
    demographics: "Industrialized (Youth, Corporate)",
    description: "Major electronics and vehicle manufacturing hub. Focuses on vocational institutions, cargo links, and coastal development.",
    primaryImpact: { youth: 1.3, corporate: 1.2, urban: 0.6, middleClass: 0.5, rural: 0.1, farmers: 0.1 },
    defaultAllocation: 0.4,
  },
  {
    id: "west_bengal",
    name: "West Bengal",
    hindiName: "पश्चिम बंगाल",
    zone: "East",
    demographics: "Mixed Rural-Urban (Farmers, Middle Class)",
    description: "Gateway to the East. Heavily demands food distribution outlays, local MSME support, and water canal grids.",
    primaryImpact: { rural: 1.1, farmers: 1.0, middleClass: 0.6, corporate: -0.2, youth: 0.4, urban: 0.3 },
    defaultAllocation: 0.35,
  },
  {
    id: "punjab_haryana",
    name: "Punjab & Haryana",
    hindiName: "पंजाब एवं हरियाणा",
    zone: "North",
    demographics: "Agricultural Heartland (Farmers, Rural)",
    description: "India's prime farming granary. Essential demands for fertilizer supply, tube-well power, and direct credit lines.",
    primaryImpact: { farmers: 1.8, rural: 1.4, middleClass: 0.2, youth: -0.1, corporate: -0.4, urban: -0.1 },
    defaultAllocation: 0.45,
  },
  {
    id: "assam_ne",
    name: "Assam & Northeast States",
    hindiName: "असम एवं पूर्वोत्तर राज्य",
    zone: "Northeast",
    demographics: "Fragile Eco-Zone (Rural, Youth)",
    description: "Strategically critical border states. Demands national highway networks, organic agriculture support, and eco-tourism.",
    primaryImpact: { rural: 1.4, youth: 1.0, middleClass: 0.4, farmers: 0.4, urban: 0.1, corporate: -0.1 },
    defaultAllocation: 0.25,
  }
];

export default function BudgetSliders({ 
  currentSectors, 
  gdp, 
  onSaveBudget, 
  politicalCapital,
  treasury,
  demographics,
  onApplyRegionalAllocation
}: BudgetSlidersProps) {
  const [activeSubTab, setActiveSubTab] = useState<"union" | "regional">("union");
  const [sectors, setSectors] = useState<Sectors>({ ...currentSectors });
  const [isSaved, setIsSaved] = useState(false);

  // Regional Allocations State
  const [regionalAllocations, setRegionalAllocations] = useState<Record<string, number>>(() =>
    STATES_METADATA.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.defaultAllocation }), {})
  );

  const handleSliderChange = (key: keyof Sectors, val: number) => {
    setSectors((prev) => ({
      ...prev,
      [key]: val,
    }));
    setIsSaved(false);
  };

  const handleRegionalSliderChange = (stateId: string, val: number) => {
    setRegionalAllocations((prev) => ({
      ...prev,
      [stateId]: val,
    }));
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

  const handleDispatchRegional = (stateId: string) => {
    const meta = STATES_METADATA.find(s => s.id === stateId);
    if (!meta) return;

    const val = regionalAllocations[stateId];
    if (treasury < val) return;
    if (politicalCapital < 2) return;

    // Calculate dynamic demographic gains
    const stateImpact = {
      farmers: Number((val * meta.primaryImpact.farmers).toFixed(2)),
      youth: Number((val * meta.primaryImpact.youth).toFixed(2)),
      corporate: Number((val * meta.primaryImpact.corporate).toFixed(2)),
      middleClass: Number((val * meta.primaryImpact.middleClass).toFixed(2)),
      rural: Number((val * meta.primaryImpact.rural).toFixed(2)),
      urban: Number((val * meta.primaryImpact.urban).toFixed(2)),
    };

    onApplyRegionalAllocation(val, 2, stateImpact, meta.name);
  };

  return (
    <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 shadow-lg font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-xl font-serif italic text-amber-500 flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-amber-500" />
            <span>Fiscal Allocation center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure ministerial budgets or dispatch regional development funds to target specific states and demographics.
          </p>
        </div>

        {/* Toggle between Union Ministerial Sectors and State Regional Budgets */}
        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveSubTab("union")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === "union"
                ? "bg-amber-600 text-black shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Union Portfolios</span>
          </button>
          <button
            onClick={() => setActiveSubTab("regional")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === "regional"
                ? "bg-amber-600 text-black shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>State Regional Funds</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE SLIDERS OR STATES LIST */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* TAB 1: UNION MINISTRY SECTOR SLIDERS */}
          {activeSubTab === "union" && (
            <>
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ministerial Budget Sectors</span>
                <button
                  onClick={handleSave}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 ${
                    isSaved
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 hover:bg-amber-500 text-black"
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? "Budget Saved!" : "Apply Union Budget"}</span>
                </button>
              </div>

              <div className="space-y-4">
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
            </>
          )}

          {/* TAB 2: STATE-BY-STATE REGIONAL FUNDS ALLOCATION */}
          {activeSubTab === "regional" && (
            <>
              <div className="mb-2 px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">State-by-State Regional Allocations</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Allocate specific regional development funds directly to individual states. Dispatching funds increases public approval among regional target demographics, but requires <span className="text-amber-500 font-semibold">2 Political Capital</span> for central-state coordination.
                </p>
              </div>

              <div className="space-y-5">
                {STATES_METADATA.map((meta) => {
                  const val = regionalAllocations[meta.id];
                  
                  // Compute live estimated gains
                  const farmerGain = (val * meta.primaryImpact.farmers);
                  const youthGain = (val * meta.primaryImpact.youth);
                  const corporateGain = (val * meta.primaryImpact.corporate);
                  const middleClassGain = (val * meta.primaryImpact.middleClass);
                  const ruralGain = (val * meta.primaryImpact.rural);
                  const urbanGain = (val * meta.primaryImpact.urban);

                  const canAfford = treasury >= val;
                  const hasPC = politicalCapital >= 2;

                  return (
                    <div key={meta.id} className="bg-black/40 border border-white/5 hover:border-white/10 p-4 rounded-xl space-y-3 transition-all">
                      
                      {/* State Title & Info Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-200 text-sm">{meta.name}</h4>
                            <span className="text-[10px] text-slate-500 font-normal">({meta.hindiName})</span>
                            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">
                              {meta.zone} Zone
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{meta.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Priority Demographics</span>
                          <span className="text-[10px] text-amber-500 font-medium font-mono">{meta.demographics}</span>
                        </div>
                      </div>

                      {/* Slider and Demographics Impact Preview Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        
                        {/* The slider control */}
                        <div className="md:col-span-7 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Target Fund Allocation:</span>
                            <span className="font-mono text-slate-200 font-bold">₹{val.toFixed(2)} L Cr</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="0.1"
                              max="5.0"
                              step="0.05"
                              value={val}
                              onChange={(e) => handleRegionalSliderChange(meta.id, parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <span className="text-[10px] text-slate-500 font-mono">0.1-5.0</span>
                          </div>
                        </div>

                        {/* Approval Impacts preview */}
                        <div className="md:col-span-5 bg-black/30 border border-white/5 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Estimated Approval Uplift:</span>
                          <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
                            {farmerGain !== 0 && (
                              <div className={farmerGain > 0 ? "text-emerald-400" : "text-rose-400"}>
                                🌾 Farmers ({farmerGain > 0 ? "+" : ""}{farmerGain.toFixed(1)}%)
                              </div>
                            )}
                            {youthGain !== 0 && (
                              <div className={youthGain > 0 ? "text-emerald-400" : "text-rose-400"}>
                                🎓 Youth ({youthGain > 0 ? "+" : ""}{youthGain.toFixed(1)}%)
                              </div>
                            )}
                            {corporateGain !== 0 && (
                              <div className={corporateGain > 0 ? "text-emerald-400" : "text-rose-400"}>
                                💼 Corp ({corporateGain > 0 ? "+" : ""}{corporateGain.toFixed(1)}%)
                              </div>
                            )}
                            {middleClassGain !== 0 && (
                              <div className={middleClassGain > 0 ? "text-emerald-400" : "text-rose-400"}>
                                🏢 Mid ({middleClassGain > 0 ? "+" : ""}{middleClassGain.toFixed(1)}%)
                              </div>
                            )}
                            {ruralGain !== 0 && (
                              <div className={ruralGain > 0 ? "text-emerald-400" : "text-rose-400"}>
                                🏘️ Rural ({ruralGain > 0 ? "+" : ""}{ruralGain.toFixed(1)}%)
                              </div>
                            )}
                            {urbanGain !== 0 && (
                              <div className={urbanGain > 0 ? "text-emerald-400" : "text-rose-400"}>
                                🏙️ Urban ({urbanGain > 0 ? "+" : ""}{urbanGain.toFixed(1)}%)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Dispatch Button */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                          <span className="flex items-center space-x-0.5">
                            <Coins className="w-3 h-3 text-amber-500/80" />
                            <span>Cost: ₹{val.toFixed(2)} L Cr</span>
                          </span>
                          <span>•</span>
                          <span>Coordination: 2 PC</span>
                        </div>

                        <button
                          disabled={!canAfford || !hasPC}
                          onClick={() => handleDispatchRegional(meta.id)}
                          className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                            !canAfford 
                              ? "bg-rose-950/20 border border-rose-900/30 text-rose-400 cursor-not-allowed"
                              : !hasPC
                              ? "bg-amber-950/20 border border-amber-900/20 text-amber-500 cursor-not-allowed"
                              : "bg-amber-600 hover:bg-amber-500 text-black shadow-md shadow-amber-600/10"
                          }`}
                        >
                          {!canAfford 
                            ? "Insufficient Treasury" 
                            : !hasPC 
                            ? "Need 2 Political Capital" 
                            : `Dispatch ${meta.name} Funds`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: BUDGETARY HEALTH CHECK SIDEBAR */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#080b11] border border-white/10 rounded-xl p-5 space-y-4 sticky top-4">
            
            {activeSubTab === "union" ? (
              <>
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
                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
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
              </>
            ) : (
              <>
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  Regional Treasury Controls
                </h3>

                <div className="space-y-3.5 divide-y divide-white/10 font-mono text-xs">
                  
                  {/* Treasury status */}
                  <div className="pt-0 flex justify-between items-center py-2">
                    <span className="text-slate-400">Treasury Balance:</span>
                    <span className="text-emerald-400 font-bold font-mono">₹{treasury.toFixed(2)} L Cr</span>
                  </div>

                  {/* Political Capital status */}
                  <div className="pt-3 flex justify-between items-center py-2">
                    <span className="text-slate-400">Political Capital:</span>
                    <span className="text-amber-500 font-bold font-mono">{politicalCapital} PC</span>
                  </div>

                  {/* Information block */}
                  <div className="pt-3 font-sans text-[11px] text-slate-400 leading-relaxed space-y-2">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-300">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                      <span>Strategy Insights:</span>
                    </div>
                    <p className="italic text-slate-400">
                      "Prime Minister, state-by-state funding is our ultimate leverage to win over specific segments before national elections. Increasing outlays to agricultural states like Punjab elevates farmer approvals instantly, while corporate centers like Maharashtra boost urban corporate approvals!"
                    </p>
                    <div className="flex items-start space-x-1.5 text-slate-500 text-[10px] mt-2">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span>Dispatching is instantaneous. All demographic approval gains apply immediately.</span>
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
