import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Landmark, Users, TrendingUp, DollarSign, Award, Clock, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Newspaper, AlertTriangle, 
  Sparkles, Zap, ShieldAlert, CheckCircle2, HelpCircle, RefreshCw, LogOut, FileText
} from "lucide-react";

import { GameState, GameEvent, PreprogrammedPolicy, Sectors, Demographics } from "./types";
import { INITIAL_STATE, MONTHS, PREPROGRAMMED_POLICIES, GAME_EVENTS } from "./gameData";
import WelcomeScreen from "./components/WelcomeScreen";
import BudgetSliders from "./components/BudgetSliders";
import AdvisorConsult from "./components/AdvisorConsult";
import AnalyticsCharts from "./components/AnalyticsCharts";

export default function App() {
  // Game Setup State
  const [pmName, setPmName] = useState<string>("");
  const [cabinetFocus, setCabinetFocus] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>({ ...INITIAL_STATE });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverResult, setGameOverResult] = useState<{
    victory: boolean;
    seats: number;
    title: string;
    narrative: string;
  } | null>(null);

  // Active Turn State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [eventResult, setEventResult] = useState<{ optionText: string; narrative: string } | null>(null);

  // Policy sandboxing
  const [customPolicyText, setCustomPolicyText] = useState<string>("");
  const [isSimulatingPolicy, setIsSimulatingPolicy] = useState<boolean>(false);
  const [simulatedPolicyResult, setSimulatedPolicyResult] = useState<any | null>(null);
  const [simulationError, setSimulationError] = useState<string>("");
  const [passedPolicies, setPassedPolicies] = useState<Array<{
    id: string;
    title: string;
    description: string;
    cost: number;
    date: string;
    custom: boolean;
  }>>([]);

  // News ticker state
  const [newsHeadlines, setNewsHeadlines] = useState<string[]>([
    "BREAKING: New cabinet takes oath of office at Rashtrapati Bhavan.",
    "ECONOMIC PULSE: Sensex registers stable openings amid high national growth outlook.",
    "MONSOON HIGHLIGHTS: Weather bureau predicts normal rainfall patterns for peninsula."
  ]);
  const [newsLoading, setNewsLoading] = useState<boolean>(false);

  // Effect to apply starting focus benefits
  const handleStartGame = (name: string, focusId: string) => {
    setPmName(name);
    setCabinetFocus(focusId);

    // Clone initial state and apply bonuses
    const state = JSON.parse(JSON.stringify(INITIAL_STATE)) as GameState;
    if (focusId === "balanced") {
      state.politicalCapital += 10;
      state.demographics.middleClass += 5;
    } else if (focusId === "nationalist") {
      state.sectors.defense += 1.5;
      state.demographics.corporate += 15;
      state.demographics.farmers -= 5;
    } else if (focusId === "socialist") {
      state.demographics.farmers += 15;
      state.demographics.rural += 15;
      state.demographics.corporate -= 5;
    }

    setGameState(state);
    
    // Trigger initial event right away to get the action started
    setActiveEvent(GAME_EVENTS[0]);
  };

  // Turn calculation logic
  const handleNextMonth = () => {
    if (activeEvent && !eventResult) {
      alert("A critical national crisis is unfolding! Please resolve the active event first.");
      return;
    }

    // Reset turn-specific narrative and results
    setEventResult(null);
    setActiveEvent(null);
    setSimulatedPolicyResult(null);

    // Update state month by month
    setGameState((prev) => {
      let nextMonthIdx = prev.monthIndex + 1;
      let nextYear = prev.year;
      if (nextMonthIdx >= 12) {
        nextMonthIdx = 0;
        nextYear += 1;
      }
      const nextMonthStr = MONTHS[nextMonthIdx];
      const dateStr = `${nextMonthStr.substring(0, 3)} ${nextYear}`;

      // Tax revenue: rough annual 15.5% of GDP. Monthly is total/12.
      const monthlyTaxRevenue = (prev.gdp * 0.155) / 12;

      // Expenditures: Annual sectors. Monthly is sum / 12.
      const totalSectorSpend = (Object.values(prev.sectors) as number[]).reduce((a, b) => a + b, 0);
      const monthlySpend = totalSectorSpend / 12;

      const netMonthlyDelta = monthlyTaxRevenue - monthlySpend;
      let newTreasury = prev.treasury + netMonthlyDelta;
      let newDebt = prev.debt;

      if (newTreasury < 0) {
        // Deficit prints new debt
        const deficitDebtAddition = (Math.abs(newTreasury) / prev.gdp) * 100;
        newDebt += deficitDebtAddition;
        newTreasury = 0.05; // minimum liquidity
      }

      // Grow GDP output
      const gdpGrowthRate = prev.gdpGrowth;
      const newGdp = prev.gdp * (1 + (gdpGrowthRate / 12) / 100);

      // Settle political capital based on popularity
      const capitalEarned = Math.max(2, Math.round(prev.popularity / 9));
      const newPoliticalCapital = prev.politicalCapital + capitalEarned;

      // Economic simulation parameters nudges
      let targetGdpGrowth = 6.2;
      let targetInflation = 4.5;
      let targetUnemployment = 6.0;

      // Dynamic impact of sector budgets
      if (prev.sectors.infrastructure > 13) {
        targetGdpGrowth += 0.9;
        targetUnemployment -= 0.8;
      } else if (prev.sectors.infrastructure < 9) {
        targetGdpGrowth -= 0.6;
        targetUnemployment += 0.4;
      }

      if (prev.sectors.scienceSpace > 0.8) {
        targetGdpGrowth += 0.5;
      }

      if (prev.sectors.socialWelfare > 5.5) {
        targetInflation += 0.5;
      }

      if (prev.sectors.education < 1.0) {
        targetGdpGrowth -= 0.3;
        targetUnemployment += 0.3;
      }

      if (newDebt > 60) {
        targetInflation += 0.6;
      }

      const nudge = (curr: number, target: number, speed = 0.1) => curr + (target - curr) * speed;
      const nextGdpGrowth = Math.max(1.5, Math.min(12.0, nudge(prev.gdpGrowth, targetGdpGrowth)));
      const nextInflation = Math.max(1.0, Math.min(15.0, nudge(prev.inflation, targetInflation)));
      const nextUnemployment = Math.max(3.0, Math.min(15.0, nudge(prev.unemployment, targetUnemployment)));

      // Recalculate approvals average
      const d = prev.demographics;
      const calculatedPopularity = (
        d.farmers * 0.25 +
        d.rural * 0.25 +
        d.youth * 0.15 +
        d.middleClass * 0.15 +
        d.urban * 0.12 +
        d.corporate * 0.08
      );

      // Assemble history
      const newHistoryPoint = {
        date: dateStr,
        gdp: newGdp,
        gdpGrowth: nextGdpGrowth,
        inflation: nextInflation,
        unemployment: nextUnemployment,
        popularity: calculatedPopularity,
        treasury: newTreasury
      };

      const newHistory = [...prev.history, newHistoryPoint];
      if (newHistory.length > 12) {
        newHistory.shift();
      }

      return {
        ...prev,
        year: nextYear,
        month: nextMonthStr,
        monthIndex: nextMonthIdx,
        gdp: newGdp,
        gdpGrowth: nextGdpGrowth,
        inflation: nextInflation,
        unemployment: nextUnemployment,
        treasury: newTreasury,
        debt: newDebt,
        popularity: calculatedPopularity,
        politicalCapital: newPoliticalCapital,
        history: newHistory,
      };
    });

    // Check for Election trigger: April 2029
    // Starting July 2026, April 2029 marks Turn 33
    // Which is year 2029, monthIndex = 3 (April)
    setGameState((current) => {
      if (current.year === 2029 && current.monthIndex === 3) {
        triggerElectionOutcome(current.popularity);
      }
      return current;
    });

    // Roll for a random event (approx 35% chance, if not election year)
    // Make sure we don't trigger if it's already election
    setTimeout(() => {
      setGameState((current) => {
        if (!(current.year === 2029 && current.monthIndex === 3)) {
          if (Math.random() < 0.4) {
            const availableEvents = GAME_EVENTS;
            const chosen = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            setActiveEvent(chosen);
            setEventResult(null);
          }
        }
        return current;
      });
    }, 100);
  };

  const triggerElectionOutcome = (popularity: number) => {
    setIsGameOver(true);
    if (popularity >= 52) {
      // Landslide victory
      const seats = Math.round(290 + (popularity - 52) * 5);
      setGameOverResult({
        victory: true,
        seats: Math.min(543, seats),
        title: "Absolute Majority Mandate!",
        narrative: `Incredible achievement, Prime Minister ${pmName}! The Indian electorate has voted overwhelmingly in favor of your developmental policies. With a robust majority in the Lok Sabha, your government is re-elected for a historical second term. Under your stewardship, India remains on path to become a developed powerhouse.`
      });
    } else if (popularity >= 40) {
      // Coalition victory
      const seats = Math.round(230 + (popularity - 40) * 4);
      setGameOverResult({
        victory: true,
        seats: Math.min(271, seats),
        title: "Coalition Cabinet Formed",
        narrative: `You have secured a tough legislative footprint. While your party fell short of the 272 absolute majority mark, your coalition partners have agreed to support you as Prime Minister. Your second term will require active political balancing and state-to-state negotiations, but you remain the leader of India.`
      });
    } else {
      // Lost
      const seats = Math.round(110 + popularity * 1.5);
      setGameOverResult({
        victory: false,
        seats: seats,
        title: "Lok Sabha Election Defeat",
        narrative: `The results are in, and the ruling cabinet has suffered a sharp setback. Widespread public discontent and low approval ratings have led to a decisive victory for the opposition coalition. You have formally submitted your resignation to the President of India. This concludes your administration's simulation.`
      });
    }
  };

  // Option select for crises events
  const handleResolveEvent = (option: any) => {
    if (gameState.politicalCapital < option.politicalCapitalCost) {
      alert("You do not have enough Political Capital to choose this solution!");
      return;
    }

    setGameState((prev) => {
      // Modify financials & metrics
      const newTreasury = Math.max(0.1, prev.treasury - option.cost);
      const newPC = prev.politicalCapital - option.politicalCapitalCost;
      
      const newFarmers = Math.max(0, Math.min(100, prev.demographics.farmers + (option.impact.demographics?.farmers || 0)));
      const newYouth = Math.max(0, Math.min(100, prev.demographics.youth + (option.impact.demographics?.youth || 0)));
      const newCorp = Math.max(0, Math.min(100, prev.demographics.corporate + (option.impact.demographics?.corporate || 0)));
      const newMiddle = Math.max(0, Math.min(100, prev.demographics.middleClass + (option.impact.demographics?.middleClass || 0)));
      const newRural = Math.max(0, Math.min(100, prev.demographics.rural + (option.impact.demographics?.rural || 0)));
      const newUrban = Math.max(0, Math.min(100, prev.demographics.urban + (option.impact.demographics?.urban || 0)));

      return {
        ...prev,
        treasury: newTreasury,
        politicalCapital: newPC,
        gdpGrowth: Math.max(1, prev.gdpGrowth + (option.impact.gdpGrowth || 0)),
        inflation: Math.max(1, prev.inflation + (option.impact.inflation || 0)),
        unemployment: Math.max(2, prev.unemployment + (option.impact.unemployment || 0)),
        popularity: Math.max(10, Math.min(100, prev.popularity + (option.impact.popularity || 0))),
        demographics: {
          farmers: newFarmers,
          youth: newYouth,
          corporate: newCorp,
          middleClass: newMiddle,
          rural: newRural,
          urban: newUrban
        }
      };
    });

    setEventResult({
      optionText: option.text,
      narrative: option.narrative
    });
  };

  // Draft pre-programmed bills
  const handleDraftPreprogrammed = (policy: PreprogrammedPolicy) => {
    if (gameState.politicalCapital < policy.politicalCapitalCost) {
      alert("Insufficient Political Capital!");
      return;
    }
    if (gameState.treasury < policy.cost) {
      alert("The National Treasury lacks the liquid funds to finance this scheme! Free up sector budgets or wait for tax surpluses.");
      return;
    }

    setGameState((prev) => {
      const newTreasury = Math.max(0.1, prev.treasury - policy.cost);
      const newPC = prev.politicalCapital - policy.politicalCapitalCost;

      const d = prev.demographics;
      const pi = policy.impact.demographics;

      return {
        ...prev,
        treasury: newTreasury,
        politicalCapital: newPC,
        gdpGrowth: Math.max(1, prev.gdpGrowth + policy.impact.gdpGrowth),
        inflation: Math.max(1, prev.inflation + policy.impact.inflation),
        unemployment: Math.max(1, prev.unemployment + policy.impact.unemployment),
        popularity: Math.max(10, Math.min(100, prev.popularity + policy.impact.popularity)),
        demographics: {
          farmers: Math.max(0, Math.min(100, d.farmers + (pi.farmers || 0))),
          youth: Math.max(0, Math.min(100, d.youth + (pi.youth || 0))),
          corporate: Math.max(0, Math.min(100, d.corporate + (pi.corporate || 0))),
          middleClass: Math.max(0, Math.min(100, d.middleClass + (pi.middleClass || 0))),
          rural: Math.max(0, Math.min(100, d.rural + (pi.rural || 0))),
          urban: Math.max(0, Math.min(100, d.urban + (pi.urban || 0)))
        }
      };
    });

    // Add to logged policies
    setPassedPolicies((prevLog) => [
      ...prevLog,
      {
        id: policy.id,
        title: policy.title,
        description: policy.description,
        cost: policy.cost,
        date: `${gameState.month} ${gameState.year}`,
        custom: false
      }
    ]);

    alert(`Successfully enacted into Law: ${policy.title}!`);
  };

  // Custom Policy AI Sandbox simulator
  const handleSimulateCustomPolicy = async () => {
    if (!customPolicyText.trim()) return;
    setIsSimulatingPolicy(true);
    setSimulationError("");
    setSimulatedPolicyResult(null);

    try {
      const response = await fetch("/api/game/custom-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyText: customPolicyText,
          gameState: {
            gdp: gameState.gdp,
            gdpGrowth: gameState.gdpGrowth,
            inflation: gameState.inflation,
            unemployment: gameState.unemployment,
            treasury: gameState.treasury,
            popularity: gameState.popularity,
            demographics: gameState.demographics,
          }
        })
      });

      let data;
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!response.ok) {
        let errorMsg = "Custom policy simulation failed.";
        if (isJson) {
          try {
            data = await response.json();
            errorMsg = data.error || errorMsg;
          } catch {
            // ignore JSON parsing fallback error
          }
        } else {
          errorMsg = `Server error (Status ${response.status})`;
        }
        throw new Error(errorMsg);
      }

      if (isJson) {
        data = await response.json();
      } else {
        throw new Error("Invalid response format from server.");
      }

      setSimulatedPolicyResult(data);
    } catch (err: any) {
      console.error(err);
      setSimulationError(err.message || "Failed to reach policy evaluation servers. Ensure Gemini API key is valid.");
    } finally {
      setIsSimulatingPolicy(false);
    }
  };

  // Incorporate AI custom policy into active law
  const handleEnactCustomPolicy = () => {
    if (!simulatedPolicyResult) return;

    const cost = simulatedPolicyResult.fiscalCost;
    // Require at least 15 PC for custom draft
    if (gameState.politicalCapital < 15) {
      alert("Drafting unique custom bills requires at least 15 Political Capital!");
      return;
    }
    if (gameState.treasury < cost) {
      alert("Insufficient national funds to support this budget allocation!");
      return;
    }

    setGameState((prev) => {
      const newTreasury = Math.max(0.1, prev.treasury - cost);
      const newPC = prev.politicalCapital - 15;

      const d = prev.demographics;
      const pi = simulatedPolicyResult.demographicsImpact;

      return {
        ...prev,
        treasury: newTreasury,
        politicalCapital: newPC,
        gdpGrowth: Math.max(1, prev.gdpGrowth + simulatedPolicyResult.gdpGrowthImpact),
        inflation: Math.max(1, prev.inflation + simulatedPolicyResult.inflationImpact),
        unemployment: Math.max(1, prev.unemployment + simulatedPolicyResult.unemploymentImpact),
        popularity: Math.max(10, Math.min(100, prev.popularity + simulatedPolicyResult.popularityImpact)),
        demographics: {
          farmers: Math.max(0, Math.min(100, d.farmers + (pi.farmers || 0))),
          youth: Math.max(0, Math.min(100, d.youth + (pi.youth || 0))),
          corporate: Math.max(0, Math.min(100, d.corporate + (pi.corporate || 0))),
          middleClass: Math.max(0, Math.min(100, d.middleClass + (pi.middleClass || 0))),
          rural: Math.max(0, Math.min(100, d.rural + (pi.rural || 0))),
          urban: Math.max(0, Math.min(100, d.urban + (pi.urban || 0)))
        }
      };
    });

    setPassedPolicies((prevLog) => [
      ...prevLog,
      {
        id: "custom_" + Date.now(),
        title: simulatedPolicyResult.policyName,
        description: simulatedPolicyResult.description,
        cost: cost,
        date: `${gameState.month} ${gameState.year}`,
        custom: true
      }
    ]);

    alert(`Successfully signed and gazetted: ${simulatedPolicyResult.policyName}!`);
    setSimulatedPolicyResult(null);
    setCustomPolicyText("");
  };

  // Fetch live news flash headlines
  const handleFetchNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch("/api/game/news-flash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameState }),
      });
      if (!response.ok) {
        throw new Error(`Server error (Status ${response.status})`);
      }
      const data = await response.json();
      if (data.headlines) {
        setNewsHeadlines(data.headlines);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNewsLoading(false);
    }
  };

  // Helper reset
  const handleReset = () => {
    setPmName("");
    setCabinetFocus("");
    setGameState({ ...INITIAL_STATE });
    setIsGameOver(false);
    setGameOverResult(null);
    setActiveTab("dashboard");
    setActiveEvent(null);
    setEventResult(null);
    setPassedPolicies([]);
    setCustomPolicyText("");
    setSimulatedPolicyResult(null);
  };

  // If no name entered, render Oath / Welcome Screen
  if (!pmName) {
    return <WelcomeScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans relative flex flex-col justify-between">
      {/* Subtle grid dots background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
      
      {/* Glow overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Desk */}
      <header className="bg-[#0a0d14] border-b border-white/10 sticky top-0 z-40 shadow-md">
        {/* National Tricolor Accented top line */}
        <div className="flex h-[3px] w-full">
          <div className="bg-amber-500 flex-1" />
          <div className="bg-slate-100 flex-1" />
          <div className="bg-emerald-600 flex-1" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-2xl font-serif italic text-amber-500 tracking-wider">
              RAJNITI
            </h1>
            <div className="h-6 w-[1px] bg-white/20 hidden md:block" />
            <div>
              <div className="text-xs text-slate-400 font-sans tracking-wide">
                Prime Minister's Office • India
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                PM: <span className="text-amber-500 font-bold">{pmName}</span> • Focus:{" "}
                <span className="text-slate-300 capitalize font-semibold">{cabinetFocus}</span>
              </div>
            </div>
          </div>

          {/* Quick stats ribbon */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs bg-black/40 p-1.5 px-3 rounded-lg border border-white/10">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-200">{gameState.month} {gameState.year}</span>
            </div>
            <div className="w-px h-3.5 bg-white/10 hidden sm:block" />
            <div className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-400">PC:</span>
              <span className="font-mono font-bold text-slate-200">{gameState.politicalCapital}</span>
            </div>
            <div className="w-px h-3.5 bg-white/10 hidden sm:block" />
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Approval:</span>
              <span className="font-mono font-bold text-slate-200">{gameState.popularity.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Game Body Layout */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Navigation Links */}
        <nav className="lg:col-span-3 space-y-4">
          <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-3 shadow-sm space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1 mb-1 font-sans">
              Command Deck
            </div>
            {[
              { id: "dashboard", label: "PM Desk & Crises", icon: <FileText className="w-4 h-4" /> },
              { id: "advisors", label: "Cabinet Briefings", icon: <Sparkles className="w-4 h-4" /> },
              { id: "policies", label: "Policy Drafts", icon: <Award className="w-4 h-4" /> },
              { id: "budget", label: "Union Budget", icon: <Landmark className="w-4 h-4" /> },
              { id: "analytics", label: "Economic Data", icon: <TrendingUp className="w-4 h-4" /> },
              { id: "news", label: "News Room", icon: <Newspaper className="w-4 h-4" /> },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 transition-all ${
                    isSelected
                      ? "bg-white/5 text-amber-500 border-l-2 border-l-amber-500"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Election Timer widget */}
          <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 space-y-2.5 shadow-sm font-sans">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
              Lok Sabha General Elections
            </h4>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-serif italic text-slate-100">
                {gameState.year === 2029 && gameState.monthIndex === 3 ? "0" : (
                  (2029 - gameState.year) * 12 + (3 - gameState.monthIndex)
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Months remaining</span>
            </div>
            <div className="w-full h-1 bg-black rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      ((33 - ((2029 - gameState.year) * 12 + (3 - gameState.monthIndex))) / 33) * 100
                    )
                  )}%`
                }}
              />
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed">
              Mandate scheduled for **April 2029**. Maintain average approval above **50%** to lock in an absolute parliamentary majority!
            </p>
          </div>

          {/* Advance Month Button */}
          <button
            onClick={handleNextMonth}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-amber-600/10 transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-black animate-pulse" />
            <span>Govern Next Month</span>
          </button>
        </nav>

        {/* Right Side: Active Workspace */}
        <div className="lg:col-span-9 space-y-6">
          {/* Main Workspace content */}
          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* 1. News Ticker Banner */}
                <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-3 flex items-center space-x-3 overflow-hidden shadow-sm font-sans">
                  <div className="bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-amber-500 flex-shrink-0 animate-pulse">
                    National Wire
                  </div>
                  <div className="flex-1 min-w-0 text-xs font-medium text-slate-300 truncate font-mono">
                    {newsHeadlines[0]}
                  </div>
                </div>

                {/* 2. Top-level economic summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
                  <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GDP Growth</span>
                    <div className="text-xl font-bold font-mono text-slate-100">+{gameState.gdpGrowth.toFixed(1)}%</div>
                    <span className="text-[9px] text-indigo-400 font-medium">Target: +6.5%</span>
                  </div>

                  <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inflation</span>
                    <div className={`text-xl font-bold font-mono ${gameState.inflation > 5.5 ? "text-rose-400" : "text-emerald-400"}`}>
                      {gameState.inflation.toFixed(1)}%
                    </div>
                    <span className="text-[9px] text-slate-500">RBI Comfort: 4.0%</span>
                  </div>

                  <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unemployment</span>
                    <div className="text-xl font-bold font-mono text-slate-100">{gameState.unemployment.toFixed(1)}%</div>
                    <span className="text-[9px] text-slate-500">Historical: 6.0%</span>
                  </div>

                  <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Treasury</span>
                    <div className="text-xl font-bold font-mono text-slate-100">₹{gameState.treasury.toFixed(2)} L Cr</div>
                    <span className="text-[9px] text-slate-500 font-semibold uppercase">Liquidity Cushion</span>
                  </div>
                </div>

                {/* 3. Crisis or Active event focus */}
                {activeEvent ? (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl space-y-4 relative overflow-hidden font-sans">
                    {/* Atmospheric warning glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center space-x-2 text-amber-500">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="font-extrabold text-xs uppercase tracking-widest">CRISIS ALERT</h3>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-lg font-serif italic text-slate-100">{activeEvent.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {activeEvent.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <AnimatePresence mode="wait">
                        {eventResult ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-2"
                          >
                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                              Resolution Implemented
                            </div>
                            <p className="text-xs text-slate-400 font-medium italic">
                              "{eventResult.optionText}"
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed mt-2 pt-2 border-t border-white/5">
                              {eventResult.narrative}
                            </p>
                          </motion.div>
                        ) : (
                          <div className="space-y-2.5">
                            {activeEvent.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleResolveEvent(opt)}
                                className="w-full text-left bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                              >
                                <div className="flex-1 space-y-1">
                                  <div className="text-xs font-bold text-slate-200">
                                    Option {idx + 1}: {opt.text}
                                  </div>
                                  {/* Demographics hints */}
                                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                                    {Object.entries(opt.impact.demographics || {}).map(([key, val]) => {
                                      const numVal = val as number;
                                      return (
                                        <span key={key} className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded capitalize ${numVal >= 0 ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
                                          {key}: {numVal >= 0 ? "+" : ""}{numVal}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold text-right flex-shrink-0">
                                  <div className="text-amber-500 font-mono">
                                    PC: -{opt.politicalCapitalCost}
                                  </div>
                                  <div className="text-rose-400 font-mono">
                                    Cost: ₹{opt.cost} L Cr
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-6 text-center space-y-3 shadow-sm py-12 font-sans">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="font-bold text-slate-200 text-sm">Domestic Security Stable</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      No active security or regional emergency warrants the PM's desk right now. Work on budget structures, cabinet feedback, or draft custom welfare schemes.
                    </p>
                  </div>
                )}

                {/* Demographic micro overview block */}
                <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 space-y-4 font-sans">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <h4 className="font-bold text-slate-100 text-xs uppercase tracking-widest">Demographics Pulse</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">Average approval dictates overall popularity</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                    {Object.entries(gameState.demographics).map(([key, val]) => {
                      const scoreVal = val as number;
                      return (
                        <div key={key} className="bg-black/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-slate-500 capitalize font-medium">{key}</div>
                          <div className={`text-sm font-extrabold mt-1 font-mono ${scoreVal >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                            {scoreVal.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cabinet Advisors Tab */}
            {activeTab === "advisors" && (
              <motion.div
                key="advisors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AdvisorConsult gameState={gameState} />
              </motion.div>
            )}

            {/* Scheme and Policies Tab */}
            {activeTab === "policies" && (
              <motion.div
                key="policies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* 1. Custom Policy Builder */}
                <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 shadow-lg space-y-4 relative overflow-hidden font-sans">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <h3 className="font-serif italic text-amber-500 text-base flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>AI Custom Policy Draft Bench</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Type any policy idea you wish to implement in India (e.g., specific taxes, high-speed rail, regional subsidies). Server-side Gemini simulates the realistic economic, fiscal, and public reaction.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <textarea
                      placeholder="e.g. Introduce a 20% solar installation subsidy for urban households to decrease coal dependency, or Draft a ₹20,000 Crore credit relief fund for small sugarcane farmers in Uttar Pradesh."
                      value={customPolicyText}
                      onChange={(e) => setCustomPolicyText(e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 rounded-xl py-3 px-4 focus:outline-none transition-all text-xs"
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-[10px] text-slate-500 font-semibold">
                        *Drafting simulated customs costs 15 PC on enactment.
                      </div>
                      <button
                        onClick={handleSimulateCustomPolicy}
                        disabled={isSimulatingPolicy || !customPolicyText.trim()}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-extrabold rounded-lg text-xs uppercase tracking-widest flex items-center space-x-1.5"
                      >
                        {isSimulatingPolicy ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Simulating in Lok Sabha...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            <span>Simulate Bill Impact</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {simulationError && (
                    <div className="text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg text-xs flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <span>{simulationError}</span>
                    </div>
                  )}

                  {/* Custom Policy Simulation Output */}
                  {simulatedPolicyResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/40 border border-white/10 p-5 rounded-xl space-y-4"
                    >
                      <div className="flex justify-between items-start pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                            Simulated Legislative Draft
                          </span>
                          <h4 className="text-base font-bold text-slate-100 mt-1 font-serif italic">
                            {simulatedPolicyResult.policyName}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 uppercase block font-semibold">Estimated cost</span>
                          <span className="font-mono text-slate-200 text-xs font-bold">
                            ₹{simulatedPolicyResult.fiscalCost.toFixed(2)} Lakh Crore
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {simulatedPolicyResult.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3.5 bg-black/40 rounded-xl border border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 uppercase">GDP Impact</span>
                          <div className={`font-mono text-xs font-bold ${simulatedPolicyResult.gdpGrowthImpact >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {simulatedPolicyResult.gdpGrowthImpact >= 0 ? "+" : ""}{simulatedPolicyResult.gdpGrowthImpact}%
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 uppercase">Inflation Impact</span>
                          <div className={`font-mono text-xs font-bold ${simulatedPolicyResult.inflationImpact <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {simulatedPolicyResult.inflationImpact >= 0 ? "+" : ""}{simulatedPolicyResult.inflationImpact}%
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 uppercase">Job Impact</span>
                          <div className={`font-mono text-xs font-bold ${simulatedPolicyResult.unemploymentImpact <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {simulatedPolicyResult.unemploymentImpact >= 0 ? "+" : ""}{simulatedPolicyResult.unemploymentImpact}%
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 uppercase">Popularity Impact</span>
                          <div className={`font-mono text-xs font-bold ${simulatedPolicyResult.popularityImpact >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {simulatedPolicyResult.popularityImpact >= 0 ? "+" : ""}{simulatedPolicyResult.popularityImpact}%
                          </div>
                        </div>
                      </div>

                      {/* Advisor reactions block */}
                      <div className="space-y-2.5">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Cabinet Advisor Debates:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {simulatedPolicyResult.advisorReactions?.map((r: any, idx: number) => (
                            <div key={idx} className="bg-black/50 p-2.5 rounded-lg border border-white/5 text-[11px] leading-relaxed">
                              <div className="font-bold text-amber-500">{r.name}</div>
                              <p className="text-slate-400 italic mt-1">"{r.quote}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                        <button
                          onClick={() => setSimulatedPolicyResult(null)}
                          className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-400 rounded-lg text-xs uppercase font-bold tracking-wider"
                        >
                          Veto Draft
                        </button>
                        <button
                          onClick={handleEnactCustomPolicy}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs uppercase tracking-widest"
                        >
                          Enact into Indian Law
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Core Preprogrammed policies */}
                <div className="space-y-3 font-sans">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
                    Standard Union Bills & Welfare Initiatives
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PREPROGRAMMED_POLICIES.map((policy) => {
                      const alreadyPassed = passedPolicies.some((p) => p.id === policy.id);
                      return (
                        <div key={policy.id} className="bg-[#0a0d14] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-slate-200 text-sm">{policy.title}</h4>
                                <span className="text-[10px] text-slate-500 italic font-semibold">{policy.hindiTitle}</span>
                              </div>
                              {alreadyPassed && (
                                <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                                  Enacted
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {policy.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
                            <div className="space-y-0.5 text-slate-500 font-medium">
                              <div>PC Cost: <span className="font-mono text-slate-300 font-bold">{policy.politicalCapitalCost}</span></div>
                              <div>Fiscal Cost: <span className="font-mono text-rose-400 font-bold">₹{policy.cost} L Cr</span></div>
                            </div>
                            <button
                              onClick={() => handleDraftPreprogrammed(policy)}
                              disabled={alreadyPassed}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-amber-500 hover:text-amber-400 font-extrabold uppercase tracking-widest rounded-lg text-[10px] border border-white/10"
                            >
                              {alreadyPassed ? "In Law" : "Draft Bill"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Budget Sliders Tab */}
            {activeTab === "budget" && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <BudgetSliders
                  currentSectors={gameState.sectors}
                  gdp={gameState.gdp}
                  politicalCapital={gameState.politicalCapital}
                  onSaveBudget={(newSectors) => {
                    setGameState((prev) => ({
                      ...prev,
                      sectors: newSectors,
                    }));
                  }}
                />
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AnalyticsCharts gameState={gameState} />
              </motion.div>
            )}

            {/* News and Logs Room Tab */}
            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* News Room Ticker Generator */}
                <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 shadow-lg space-y-4 font-sans">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <div>
                      <h3 className="font-serif italic text-amber-500 text-base">Doordarshan Live broadcast</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Simulate current TV news coverage in English & Hindi regarding your cabinet's decisions.</p>
                    </div>
                    <button
                      onClick={handleFetchNews}
                      disabled={newsLoading}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-amber-500 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center space-x-1.5 border border-white/10"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? "animate-spin" : ""}`} />
                      <span>{newsLoading ? "Broadcasting..." : "Refresh Coverage"}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newsLoading ? (
                      <div className="text-center py-6 text-xs text-slate-500 animate-pulse font-mono uppercase tracking-widest">
                        Generating Real-time News Feeds...
                      </div>
                    ) : (
                      newsHeadlines.map((headline, idx) => (
                        <div key={idx} className="bg-black/40 p-4 border border-white/5 rounded-xl text-xs font-semibold leading-relaxed flex items-start space-x-3 font-mono">
                          <span className="text-amber-500 font-bold flex-shrink-0">[TICKER {idx + 1}]</span>
                          <span className="text-slate-300">{headline}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Log of legislations passed */}
                <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 shadow-lg space-y-4 font-sans">
                  <div>
                    <h3 className="font-serif italic text-amber-500 text-base">Cabinet Legislative Registry</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Chronological record of bills, packages, and decrees enacted into law by your administration.</p>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {passedPolicies.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500 italic">
                        No custom or standard legislative bills passed yet. Head over to Policy Drafts to sign initiatives.
                      </div>
                    ) : (
                      passedPolicies.map((p, idx) => (
                        <div key={idx} className="bg-black/40 p-3.5 border border-white/5 rounded-lg text-xs flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-200">{p.title}</h4>
                            <p className="text-[11px] text-slate-400">{p.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0 font-mono text-[10px] space-y-1">
                            <div className="text-slate-500 font-semibold">{p.date}</div>
                            <div className="text-rose-400 font-bold">₹{p.cost} L Cr</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 3. Footer credits */}
      <footer className="bg-[#05070a] border-t border-white/10 py-6 mt-12 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Indian Government Simulator. Satyameva Jayate. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Resign / Restart Simulator</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Game Over Election Modal */}
      <AnimatePresence>
        {isGameOver && gameOverResult && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0a0d14] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl space-y-6"
            >
              {/* National Tricolor header */}
              <div className="flex h-1.5 w-full rounded-t-lg overflow-hidden -mt-6 md:-mt-10 -mx-6 md:-mx-10 mb-6">
                <div className="bg-amber-500 flex-1" />
                <div className="bg-slate-100 flex-1" />
                <div className="bg-emerald-600 flex-1" />
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 shadow-inner">
                  <Landmark className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-extrabold font-sans">
                    Lok Sabha Election Result
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif italic text-slate-100 mt-1">
                    {gameOverResult.title}
                  </h2>
                </div>
              </div>

              <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-center space-y-2">
                <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Seats Secured in Lok Sabha</div>
                <div className="text-5xl font-serif italic text-amber-500">
                  {gameOverResult.seats} <span className="text-xl text-slate-500 font-sans">/ 543</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Majority line requires **272 seats** to form a government.
                </p>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                {gameOverResult.narrative}
              </p>

              {/* Economic scorecard summary */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-black/40 border border-white/5 rounded-lg text-center font-mono text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase">GDP Size</span>
                  <div className="font-bold text-slate-200 mt-0.5">₹{gameState.gdp.toFixed(1)} L Cr</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase">Avg inflation</span>
                  <div className="font-bold text-slate-200 mt-0.5">{gameState.inflation.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase">Final Popularity</span>
                  <div className="font-bold text-slate-200 mt-0.5">{gameState.popularity.toFixed(1)}%</div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={handleReset}
                  className="px-10 py-3.5 bg-amber-600 hover:bg-amber-500 text-black font-extrabold uppercase tracking-widest rounded-lg text-xs"
                >
                  Draft New Cabinet / Play Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
