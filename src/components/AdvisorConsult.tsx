import React, { useState, useEffect, useRef } from "react";
import { Advisor, GameState } from "../types";
import { ADVISORS } from "../gameData";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  ShieldAlert,
  Radio,
  HelpCircle,
  Loader2,
  Send,
  Trash2,
  Key,
  Brain,
  Users,
  Play,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { getLocalAdvisorFallback } from "../utils/localFallbacks";
import { getClientApiKey, setClientApiKey, clientGeminiAdvisor } from "../utils/clientGemini";

interface Message {
  role: "user" | "assistant";
  text: string;
  proposal?: {
    id: string;
    title: string;
    description: string;
    cost: number;
    politicalCapitalCost: number;
    targetSector: string;
    impacts: {
      gdp?: number;
      inflation?: number;
      unemployment?: number;
      popularity?: number;
      demographics?: Record<string, number>;
    };
  };
  proposalStatus?: "pending" | "approved" | "rejected";
  allottedBudget?: number;
}

interface AdvisorConsultProps {
  gameState: GameState;
  setGameState?: React.Dispatch<React.SetStateAction<GameState>>;
  setPassedPolicies?: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    title: string;
    description: string;
    cost: number;
    date: string;
    custom: boolean;
  }>>>;
}

interface DebateMessage {
  advisorId: string;
  text: string;
}

export default function AdvisorConsult({ gameState, setGameState, setPassedPolicies }: AdvisorConsultProps) {
  // General view states
  const [activeTab, setActiveTab] = useState<"consult" | "debate">("consult");
  const [clientApiKey, setClientApiKeyLocal] = useState<string>(getClientApiKey() || "");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 1-on-1 Consultation states
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>("nirmala");
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Cabinet Debate Room states
  const [debateProposal, setDebateProposal] = useState<string>("");
  const [selectedDebaters, setSelectedDebaters] = useState<string[]>(["nirmala", "amit", "somnath"]);
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>([]);
  const [debateLoading, setDebateLoading] = useState<boolean>(false);
  const [debateActiveAdvisorId, setDebateActiveAdvisorId] = useState<string>("");

  const activeAdvisor = ADVISORS.find((a) => a.id === selectedAdvisorId) || ADVISORS[0];
  const chatEndRef = useRef<HTMLDivElement>(null);
  const debateEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selectedAdvisorId, loading, activeTab]);

  // Auto-scroll for debate
  useEffect(() => {
    debateEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debateMessages, debateLoading, debateActiveAdvisorId, activeTab]);

  // Load chats from localStorage
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem("loksabha_advisor_chats_v2");
      if (savedChats) {
        setChats(JSON.parse(savedChats));
      }
    } catch (e) {
      console.error("Failed to load saved chats", e);
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (Object.keys(chats).length === 0) return;
    try {
      localStorage.setItem("loksabha_advisor_chats_v2", JSON.stringify(chats));
    } catch (e) {
      console.error("Failed to save chats", e);
    }
  }, [chats]);

  const currentMessages = chats[selectedAdvisorId] || [];

  // Helper to parse <thinking>...</thinking> tags
  const parseThinking = (text: string) => {
    const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/i;
    const match = text.match(thinkingRegex);
    if (match) {
      const thinkingContent = match[1].trim();
      const mainContent = text.replace(thinkingRegex, "").trim();
      return { thinking: thinkingContent, speech: mainContent };
    }
    return { thinking: null, speech: text };
  };

  // 1-on-1 Message Submission Handler
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const updatedHistory: Message[] = [...currentMessages, { role: "user", text: textToSend }];

    // Optimistically update local chat state
    setChats((prev) => ({
      ...prev,
      [selectedAdvisorId]: updatedHistory,
    }));
    setInput("");
    setLoading(true);
    setError("");

    try {
      let adviceText = "";

      // Check if we can use client-side Gemini directly
      if (clientApiKey) {
        try {
          adviceText = await clientGeminiAdvisor(selectedAdvisorId, gameState, updatedHistory);
        } catch (clientGeminiErr: any) {
          console.warn("Client-side direct Gemini call failed, falling back to local simulation.", clientGeminiErr);
          adviceText = getLocalAdvisorFallback(selectedAdvisorId, gameState, textToSend);
        }
      } else {
        // Fallback to server route
        try {
          const response = await fetch("/api/game/advisor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              advisorId: selectedAdvisorId,
              gameState: {
                year: gameState.year,
                month: gameState.month,
                gdp: gameState.gdp,
                gdpGrowth: gameState.gdpGrowth,
                inflation: gameState.inflation,
                unemployment: gameState.unemployment,
                treasury: gameState.treasury,
                popularity: gameState.popularity,
                demographics: gameState.demographics,
                currentFocus: gameState.currentFocus,
                activeEvents: gameState.activeEvents,
              },
              messages: updatedHistory,
            }),
          });

          const contentType = response.headers.get("content-type") || "";
          const isJson = contentType.includes("application/json");

          if (response.ok && isJson) {
            const data = await response.json();
            adviceText = data.advice;
          } else {
            console.warn(`Advisor API response not OK. Status: ${response.status}`);
            adviceText = getLocalAdvisorFallback(selectedAdvisorId, gameState, textToSend);
          }
        } catch (fetchErr) {
          console.warn("Advisor API fetch failed. Using client-side fallback.", fetchErr);
          adviceText = getLocalAdvisorFallback(selectedAdvisorId, gameState, textToSend);
        }
      }

      let cleanAdviceText = adviceText;
      let parsedProposal: any = null;

      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const jsonMatch = adviceText.match(jsonRegex);
      if (jsonMatch) {
        try {
          const rawJson = JSON.parse(jsonMatch[1].trim());
          if (rawJson.proposal) {
            parsedProposal = rawJson.proposal;
            if (!parsedProposal.id) {
              parsedProposal.id = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
            }
            cleanAdviceText = adviceText.replace(jsonRegex, "").trim();
          }
        } catch (e) {
          console.error("Failed to parse proposal JSON from advisor response", e);
        }
      }

      setChats((prev) => ({
        ...prev,
        [selectedAdvisorId]: [
          ...updatedHistory, 
          { 
            role: "assistant", 
            text: cleanAdviceText,
            proposal: parsedProposal,
            proposalStatus: parsedProposal ? "pending" : undefined,
            allottedBudget: parsedProposal ? parsedProposal.cost : undefined
          }
        ],
      }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to contact cabinet. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setChats((prev) => ({
      ...prev,
      [selectedAdvisorId]: [],
    }));
    setError("");
  };

  const handlePassProposal = (messageIndex: number, prop: any, customBudget: number) => {
    if (!setGameState) {
      setError("Game state engine is currently disconnected.");
      return;
    }

    if (gameState.treasury < customBudget) {
      setError(`Fiscal deficit warning! India's National Treasury (₹${gameState.treasury.toFixed(2)} L Cr) has insufficient reserves to cover this ₹${customBudget.toFixed(2)} L Cr budget allotment.`);
      return;
    }

    if (gameState.politicalCapital < prop.politicalCapitalCost) {
      setError(`Political deadlock! You do not have enough Political Capital (${gameState.politicalCapital} / ${prop.politicalCapitalCost} PC) to enact this directive.`);
      return;
    }

    // Update state variables
    setGameState((prev) => {
      const updatedSectors = { ...prev.sectors };
      const sectorKey = prop.targetSector as keyof typeof prev.sectors;
      if (sectorKey && sectorKey in updatedSectors) {
        updatedSectors[sectorKey] = Number((updatedSectors[sectorKey] + customBudget).toFixed(2));
      }

      const updatedDemographics = { ...prev.demographics };
      if (prop.impacts?.demographics) {
        for (const [key, change] of Object.entries(prop.impacts.demographics)) {
          const typedKey = key as keyof typeof prev.demographics;
          if (typedKey in updatedDemographics) {
            updatedDemographics[typedKey] = Math.max(0, Math.min(100, updatedDemographics[typedKey] + (change as number)));
          }
        }
      }

      const nextGdpGrowth = Math.max(0, prev.gdpGrowth + (prop.impacts?.gdp || 0));
      const nextInflation = Math.max(0.1, prev.inflation + (prop.impacts?.inflation || 0));
      const nextUnemployment = Math.max(0.1, prev.unemployment + (prop.impacts?.unemployment || 0));
      const nextPopularity = Math.max(0, Math.min(100, prev.popularity + (prop.impacts?.popularity || 0)));

      return {
        ...prev,
        treasury: Number((prev.treasury - customBudget).toFixed(2)),
        politicalCapital: Math.max(0, prev.politicalCapital - prop.politicalCapitalCost),
        sectors: updatedSectors,
        demographics: updatedDemographics,
        gdpGrowth: Number(nextGdpGrowth.toFixed(2)),
        inflation: Number(nextInflation.toFixed(2)),
        unemployment: Number(nextUnemployment.toFixed(2)),
        popularity: Number(nextPopularity.toFixed(2)),
      };
    });

    if (setPassedPolicies) {
      setPassedPolicies((prev) => [
        ...prev,
        {
          id: prop.id,
          title: prop.title,
          description: prop.description,
          cost: customBudget,
          date: `${gameState.month} ${gameState.year}`,
          custom: true,
        },
      ]);
    }

    setChats((prev) => {
      const activeChats = [...(prev[selectedAdvisorId] || [])];
      if (activeChats[messageIndex]) {
        activeChats[messageIndex] = {
          ...activeChats[messageIndex],
          proposalStatus: "approved",
          allottedBudget: customBudget,
        };
      }
      return {
        ...prev,
        [selectedAdvisorId]: activeChats,
      };
    });

    setError("");
  };

  const handleDeclineProposal = (messageIndex: number) => {
    setChats((prev) => {
      const activeChats = [...(prev[selectedAdvisorId] || [])];
      if (activeChats[messageIndex]) {
        activeChats[messageIndex] = {
          ...activeChats[messageIndex],
          proposalStatus: "rejected",
        };
      }
      return {
        ...prev,
        [selectedAdvisorId]: activeChats,
      };
    });
    setError("");
  };

  const handleUpdateAllottedBudget = (messageIndex: number, budget: number) => {
    setChats((prev) => {
      const activeChats = [...(prev[selectedAdvisorId] || [])];
      if (activeChats[messageIndex]) {
        activeChats[messageIndex] = {
          ...activeChats[messageIndex],
          allottedBudget: budget,
        };
      }
      return {
        ...prev,
        [selectedAdvisorId]: activeChats,
      };
    });
  };

  // Sequential Multi-Agent Cabinet Committee Debate Handler
  const handleConveneDebate = async (customTopic?: string) => {
    const topic = customTopic || debateProposal;
    if (!topic.trim()) {
      setError("Please write or select a strategic policy proposal first.");
      return;
    }
    if (selectedDebaters.length !== 3) {
      setError("Please select exactly 3 Cabinet Ministers to participate in the debate committee.");
      return;
    }

    setDebateMessages([]);
    setDebateLoading(true);
    setError("");

    // Initialize the chronological running transcript for multi-agent review
    const currentDebateHistory: { role: "user" | "assistant"; text: string }[] = [
      {
        role: "user",
        text: `Prime Minister's Strategic Proposal for Cabinet Committee Debate: "${topic}"\n\nMinisters present in this Committee: ${selectedDebaters
          .map((id) => ADVISORS.find((a) => a.id === id)?.name || id)
          .join(", ")}.\n\nPlease evaluate this proposal from your individual portfolio stances, engage in realistic debate, and challenge or build on each other's points.`
      }
    ];

    try {
      // Loop through each selected minister sequentially to simulate interactive debate
      for (let i = 0; i < selectedDebaters.length; i++) {
        const advId = selectedDebaters[i];
        setDebateActiveAdvisorId(advId);

        let adviceText = "";

        if (clientApiKey) {
          try {
            adviceText = await clientGeminiAdvisor(advId, gameState, currentDebateHistory);
          } catch (clientGeminiErr) {
            console.warn(`Direct Gemini debate failed for ${advId}, falling back.`, clientGeminiErr);
            adviceText = getLocalAdvisorFallback(advId, gameState, topic);
          }
        } else {
          try {
            const response = await fetch("/api/game/advisor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                advisorId: advId,
                gameState: {
                  year: gameState.year,
                  month: gameState.month,
                  gdp: gameState.gdp,
                  gdpGrowth: gameState.gdpGrowth,
                  inflation: gameState.inflation,
                  unemployment: gameState.unemployment,
                  treasury: gameState.treasury,
                  popularity: gameState.popularity,
                  demographics: gameState.demographics,
                  currentFocus: gameState.currentFocus,
                  activeEvents: gameState.activeEvents,
                },
                messages: currentDebateHistory,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              adviceText = data.advice;
            } else {
              adviceText = getLocalAdvisorFallback(advId, gameState, topic);
            }
          } catch (err) {
            console.warn(`Server debate failed for ${advId}, falling back.`, err);
            adviceText = getLocalAdvisorFallback(advId, gameState, topic);
          }
        }

        // Add this speaker's contribution to the UI stream
        setDebateMessages((prev) => [...prev, { advisorId: advId, text: adviceText }]);

        // Prepend speaker name to the running history so subsequent agents are fully aware
        const ministerName = ADVISORS.find((a) => a.id === advId)?.name || advId;
        currentDebateHistory.push({
          role: "assistant",
          text: `[${ministerName}]: ${adviceText}`
        });

        // Add a slight delay for realistic, turn-based pacing
        if (i < selectedDebaters.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (err: any) {
      console.error("Cabinet committee session failed:", err);
      setError("Cabinet Committee Session was interrupted: " + (err.message || "Unknown error"));
    } finally {
      setDebateLoading(false);
      setDebateActiveAdvisorId("");
    }
  };

  // Rolling selection of up to 3 debaters
  const handleToggleDebater = (id: string) => {
    if (debateLoading) return;
    setSelectedDebaters((prev) => {
      if (prev.includes(id)) {
        return prev.filter((d) => d !== id);
      } else {
        if (prev.length >= 3) {
          // Keep the last 2 and append the new one
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };

  // Preset debate topics with their tailored, pre-selected relevant Ministers
  const DEBATE_PRESETS = [
    {
      title: "💰 Tax Reform",
      topic: "Slash personal income tax rates by 5% to boost middle class spending power and spur manufacturing assembly demand.",
      ministers: ["nirmala", "piyush", "amit"]
    },
    {
      title: "🛡️ Border Security",
      topic: "Double capital budget allocations for next-generation tri-service stealth submarine fleets and high-altitude border sensors.",
      ministers: ["rajnath", "nirmala", "amit"]
    },
    {
      title: "🌾 Agrarian Relief",
      topic: "Raise crop Minimum Support Prices (MSP) by 15% to shield marginal farmer incomes from erratic monsoon trends.",
      ministers: ["shivraj", "nirmala", "amit"]
    },
    {
      title: "🛣️ Gati-Shakti Logistics",
      topic: "Erect 5 major multi-state inland freight corridors to lower shipping drag to under 9% of national GDP.",
      ministers: ["gadkari", "piyush", "nirmala"]
    },
    {
      title: "🏥 Rural Health Grid",
      topic: "Construct 10 new regional AIIMS medical hospitals and deploy digital telemedicine towers across tier-3 districts.",
      ministers: ["nadda", "somnath", "nirmala"]
    }
  ];

  const applyPreset = (preset: typeof DEBATE_PRESETS[0]) => {
    if (debateLoading) return;
    setDebateProposal(preset.topic);
    setSelectedDebaters(preset.ministers);
    setError("");
  };

  const getSuggestions = (advisorId: string): string[] => {
    switch (advisorId) {
      case "nirmala":
        return [
          "Provide a complete budget & deficit review.",
          "How can we curb inflation without hurting GDP growth?",
          "Should we raise taxes on high-income corporates?"
        ];
      case "amit":
        return [
          "What is the status of internal law and order?",
          "How can we lower social friction across state boundaries?",
          "Brief me on local state police reforms."
        ];
      case "jaishankar":
        return [
          "How is our standing with global superpowers?",
          "How can we attract higher Foreign Direct Investment (FDI)?",
          "Should we sign new bilateral trade agreements?"
        ];
      case "rajnath":
        return [
          "Assess our defense readiness on borders.",
          "How is the progress on 'Atmanirbhar Bharat' arms production?",
          "Should we increase cybersecurity spend?"
        ];
      case "gadkari":
        return [
          "What are our main highway infrastructure bottlenecks?",
          "How can we speed up freight corridor construction?",
          "Is public-private partnership viable for green expressway tolls?"
        ];
      case "piyush":
        return [
          "How can we double our electronics and software exports?",
          "What is the timeline for new high-speed Vande Bharat tracks?",
          "Can we ease compliance burdens for small retail MSMEs?"
        ];
      case "dharmendra":
        return [
          "How are skill-development labs impacting youth unemployment?",
          "Status of National Education Policy (NEP) school implementation?",
          "Can we subsidize research fellowships in deep tech?"
        ];
      case "shivraj":
        return [
          "What are the farmers' primary demands regarding MSP?",
          "How are we mitigating agricultural drought risks this quarter?",
          "Can we offer direct interest-free credit to smallholders?"
        ];
      case "nadda":
        return [
          "How can we expand Ayushman Bharat insurance coverage?",
          "What is the status of the new AIIMS medical colleges?",
          "Are we stocked on generic essential medicines for rural clinics?"
        ];
      case "bhupendra":
        return [
          "Are we on track for our national net-zero carbon goals?",
          "How is the solar grid expansion in Rajasthan progressing?",
          "Can we subsidize EV charging networks in tier-2 cities?"
        ];
      case "somnath":
        return [
          "Brief me on the upcoming Gaganyaan space mission.",
          "What incentives do chip manufacturers need to set up fabs here?",
          "How are local AI and quantum computing startups performing?"
        ];
      default:
        return [
          "What are our primary challenges?",
          "How can we optimize our ministry's budget?",
          "What policy should we execute next?"
        ];
    }
  };

  const suggestions = getSuggestions(selectedAdvisorId);

  return (
    <div className="bg-[#0a0d14] border border-white/10 rounded-xl p-5 shadow-lg">
      {/* Header Container */}
      <div className="mb-4 pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif italic text-amber-500 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
            <span>Cabinet Briefing Chamber</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Summon your key Ministers to hold realistic, interactive 1-on-1 strategic dialogues or convene multi-minister committee debates.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 border text-xs rounded-lg transition-all ${
              clientApiKey
                ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/20"
                : "bg-amber-950/20 border-amber-900/30 text-amber-400 hover:bg-amber-900/10"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{clientApiKey ? "Gemini Key: Configured" : "Configure Gemini Key"}</span>
          </button>
          {activeTab === "consult" && currentMessages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:bg-rose-900/20 text-xs rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Dialogue</span>
            </button>
          )}
          {activeTab === "debate" && debateMessages.length > 0 && (
            <button
              onClick={() => {
                setDebateMessages([]);
                setError("");
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:bg-rose-900/20 text-xs rounded-lg transition-all"
              disabled={debateLoading}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Boardroom</span>
            </button>
          )}
        </div>
      </div>

      {/* Client-Side API Key Configuration Panel */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row items-center gap-3 overflow-hidden"
          >
            <div className="flex-1 text-xs text-slate-300">
              <span className="font-bold text-amber-500 block mb-1">🔑 Static Hosting/GitHub Pages Custom API Key</span>
              Paste your personal Gemini API Key here to use real-time AI conversations directly from your browser.
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={clientApiKey}
                onChange={(e) => {
                  setClientApiKeyLocal(e.target.value);
                  setClientApiKey(e.target.value);
                }}
                className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-56"
              />
              <button
                onClick={() => {
                  setShowKeyInput(false);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              >
                Apply Key
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          onClick={() => {
            if (!debateLoading) setActiveTab("consult");
          }}
          className={`flex-1 md:flex-none px-6 py-3 text-xs md:text-sm font-semibold tracking-wider uppercase border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === "consult"
              ? "border-amber-500 text-amber-500 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
          } ${debateLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>👤 1-on-1 Consultations</span>
        </button>
        <button
          onClick={() => {
            if (!loading) setActiveTab("debate");
          }}
          className={`flex-1 md:flex-none px-6 py-3 text-xs md:text-sm font-semibold tracking-wider uppercase border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === "debate"
              ? "border-amber-500 text-amber-500 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Users className="w-4 h-4" />
          <span>⚔️ Cabinet Debate Room</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl text-xs font-sans">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CONDITIONAL TABS RENDER */}
      {activeTab === "consult" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          {/* Ministers Selector List */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 mb-2 flex justify-between items-center">
              <span>Cabinet Members</span>
              <span className="text-[10px] text-amber-500/80 font-mono normal-case">{ADVISORS.length} Portfolio Chiefs</span>
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {ADVISORS.map((adv) => {
                const isSelected = adv.id === selectedAdvisorId;
                const hasActiveChat = chats[adv.id] && chats[adv.id].length > 0;
                return (
                  <button
                    key={adv.id}
                    onClick={() => {
                      setSelectedAdvisorId(adv.id);
                      setError("");
                    }}
                    className={`w-full text-left rounded-xl p-3 border transition-all flex items-center space-x-3 focus:outline-none ${
                      isSelected
                        ? "bg-white/5 border-amber-500 shadow-md shadow-amber-500/5"
                        : "bg-black/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <img
                      src={adv.avatar}
                      alt={adv.name}
                      className="w-10 h-10 rounded-full border border-white/10 object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-200 text-xs truncate">
                          {adv.name}
                        </h4>
                        {hasActiveChat && (
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" title="Active dialogue" />
                        )}
                      </div>
                      <p className="text-[10px] text-amber-500 font-medium tracking-wide truncate uppercase">
                        {adv.role}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate leading-relaxed">
                        {adv.ministry}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Minister Interactive Briefing Interface */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#080b11] border border-white/10 rounded-xl p-5 relative min-h-[500px]">
            {/* Decorative Grid Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col flex-1">
              {/* Header profile */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeAdvisor.avatar}
                    alt={activeAdvisor.name}
                    className="w-12 h-12 rounded-full border-2 border-amber-500/85 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm md:text-base">{activeAdvisor.name}</h3>
                    <p className="text-xs text-amber-500 tracking-wide font-medium">
                      {activeAdvisor.role} • <span className="text-slate-400 font-normal">{activeAdvisor.ministry}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleSendMessage(
                      `Minister, as the head of the ${activeAdvisor.ministry}, please formulate and propose a formal new strategic plan or public policy initiative for my immediate approval. Give me a detailed justification with a budget breakdown of pros and cons, and output the proposal parameters in the standard JSON template format.`
                    );
                  }}
                  disabled={loading}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/15 transition-all cursor-pointer select-none"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black animate-spin-slow" />
                  <span>Request Initiative</span>
                </button>
              </div>

              {/* Scrollable conversation logs */}
              <div className="flex-1 overflow-y-auto max-h-[380px] min-h-[300px] mt-4 space-y-3.5 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {/* Minister description as default sticky first bubble */}
                <div className="flex items-start space-x-2.5">
                  <img
                    src={activeAdvisor.avatar}
                    alt={activeAdvisor.name}
                    className="w-6 h-6 rounded-full border border-white/10 object-cover mt-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-black/30 border border-white/5 p-3 rounded-2xl rounded-tl-none text-slate-400 text-xs leading-relaxed max-w-[85%]">
                    <p className="font-semibold text-amber-500/90 mb-1 text-[10px] uppercase tracking-wider">
                      Ministerial Overview
                    </p>
                    "{activeAdvisor.description}"
                  </div>
                </div>

                {/* Chat messages */}
                <AnimatePresence initial={false}>
                  {currentMessages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start ${isUser ? "justify-end" : "justify-start"} space-x-2.5`}
                      >
                        {!isUser && (
                          <img
                            src={activeAdvisor.avatar}
                            alt={activeAdvisor.name}
                            className="w-6 h-6 rounded-full border border-white/10 object-cover mt-1"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                            isUser
                              ? "bg-amber-600/10 border border-amber-500/20 text-slate-200 ml-auto max-w-[85%] rounded-tr-none"
                              : "bg-[#0b0f19] border border-white/10 text-slate-200 max-w-[85%] rounded-tl-none border-l-2 border-l-amber-500"
                          }`}
                        >
                          {isUser ? (
                            <div className="whitespace-pre-line">{msg.text}</div>
                          ) : (
                            (() => {
                              const { thinking, speech } = parseThinking(msg.text);
                              return (
                                <>
                                  {thinking && (
                                    <div className="mb-2 p-2.5 bg-amber-500/5 border border-amber-500/10 border-l-2 border-l-amber-500/50 rounded text-[11px] text-slate-400 font-mono leading-relaxed">
                                      <span className="text-[10px] text-amber-500 font-bold block mb-1 uppercase tracking-wider flex items-center gap-1">
                                        <Brain className="w-3 h-3 animate-pulse" />
                                        Ministerial Cognitive Analysis
                                      </span>
                                      {thinking}
                                    </div>
                                  )}
                                  <div className="whitespace-pre-line text-xs md:text-sm">{speech}</div>

                                  {msg.proposal && (
                                    <div className="mt-4 p-4 bg-slate-950/60 border border-amber-500/20 rounded-xl space-y-3 font-sans shadow-lg relative overflow-hidden">
                                      {/* Visual gradient banner */}
                                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
                                      
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            📜 Official Executive Initiative
                                          </span>
                                          <h4 className="font-bold text-slate-100 mt-1.5 text-xs md:text-sm">
                                            {msg.proposal.title}
                                          </h4>
                                        </div>
                                        {msg.proposalStatus === "approved" && (
                                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded font-extrabold uppercase tracking-widest flex items-center gap-1 shrink-0">
                                            ✓ Approved & Enacted
                                          </span>
                                        )}
                                        {msg.proposalStatus === "rejected" && (
                                          <span className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-1 rounded font-extrabold uppercase tracking-widest shrink-0">
                                            ✕ Declined
                                          </span>
                                        )}
                                      </div>

                                      <p className="text-xs text-slate-300 leading-relaxed italic">
                                        "{msg.proposal.description}"
                                      </p>

                                      {/* Metrics Grid */}
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] md:text-xs">
                                        <div className="bg-white/5 p-2 rounded-lg">
                                          <span className="text-slate-400 block uppercase text-[8px] tracking-wide">Proposed Cost</span>
                                          <span className="font-semibold text-amber-500">₹{msg.proposal.cost} L Cr</span>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg">
                                          <span className="text-slate-400 block uppercase text-[8px] tracking-wide">PC Required</span>
                                          <span className="font-semibold text-slate-200">{msg.proposal.politicalCapitalCost} PC</span>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg">
                                          <span className="text-slate-400 block uppercase text-[8px] tracking-wide">Target Ministry</span>
                                          <span className="font-semibold text-slate-300 capitalize">{msg.proposal.targetSector}</span>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg">
                                          <span className="text-slate-400 block uppercase text-[8px] tracking-wide">GDP Impact</span>
                                          <span className="font-semibold text-emerald-400">+{msg.proposal.impacts?.gdp || 0}%</span>
                                        </div>
                                      </div>

                                      {/* Projected Demographics Impact */}
                                      {msg.proposal.impacts?.demographics && (
                                        <div className="bg-white/5 p-2.5 rounded-lg">
                                          <span className="text-slate-400 block uppercase text-[8px] tracking-wide mb-1.5">Projected Approval Gains</span>
                                          <div className="flex flex-wrap gap-2">
                                            {Object.entries(msg.proposal.impacts.demographics).map(([demo, val]) => {
                                              const typedVal = val as number;
                                              if (typedVal === 0) return null;
                                              return (
                                                <span key={demo} className={`text-[9px] px-2 py-0.5 rounded font-medium ${typedVal > 0 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" : "bg-rose-950/40 text-rose-400 border border-rose-900/30"}`}>
                                                  {demo}: {typedVal > 0 ? "+" : ""}{typedVal}%
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Interactive Enactment controls */}
                                      {msg.proposalStatus === "pending" ? (
                                        <div className="pt-2 border-t border-white/5 space-y-3">
                                          {/* Allot Budget slider/input */}
                                          <div className="flex items-center justify-between text-xs bg-black/40 p-2 rounded-lg">
                                            <span className="text-slate-400">Adjust Budget Allotment:</span>
                                            <div className="flex items-center space-x-2">
                                              <span className="text-slate-500">₹</span>
                                              <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-xs text-amber-500 font-bold w-20 text-center focus:outline-none focus:border-amber-500"
                                                value={msg.allottedBudget !== undefined ? msg.allottedBudget : msg.proposal.cost}
                                                onChange={(e) => {
                                                  const val = parseFloat(e.target.value);
                                                  if (!isNaN(val)) {
                                                    handleUpdateAllottedBudget(index, val);
                                                  }
                                                }}
                                              />
                                              <span className="text-slate-400 font-medium text-[10px]">L Cr</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center space-x-2.5">
                                            <button
                                              onClick={() => handlePassProposal(index, msg.proposal, msg.allottedBudget !== undefined ? msg.allottedBudget : msg.proposal.cost)}
                                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-[10px] md:text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                                            >
                                              Pass & Allot Budget
                                            </button>
                                            <button
                                              onClick={() => handleDeclineProposal(index)}
                                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[10px] md:text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                                            >
                                              Decline
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-[10px] text-slate-500 italic pt-1 flex items-center justify-between">
                                          <span>Budget Allotted: ₹{(msg.allottedBudget ?? msg.proposal.cost).toFixed(2)} Lakh Crores</span>
                                          <span>Resolution Locked</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            })()
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2.5">
                      <img
                        src={activeAdvisor.avatar}
                        alt={activeAdvisor.name}
                        className="w-6 h-6 rounded-full border border-white/10 object-cover animate-pulse"
                        referrerPolicy="no-referrer"
                      />
                      <div className="bg-black/20 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2">
                        <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                        <span className="text-xs text-slate-400 animate-pulse font-mono tracking-wider">
                          Drafting Response...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Drawer when chat is fresh */}
              {currentMessages.length === 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center space-x-1">
                    <HelpCircle className="w-3 h-3 text-amber-500/80" />
                    <span>Suggested Ministerial Inquiries</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleSendMessage(
                          "Minister, please provide an official department briefing and strategic recommendation based on our current economic and national situation."
                        )
                      }
                      className="bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/20 hover:border-amber-500/40 text-[11px] text-amber-500 font-semibold px-3 py-2 rounded-xl transition-all text-left block w-full focus:outline-none"
                    >
                      📋 Request Standard Briefing
                    </button>
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/10 text-[11px] text-slate-300 px-3 py-2 rounded-xl transition-all text-left block w-full focus:outline-none truncate"
                      >
                        💬 {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Input controls */}
            <div className="pt-4 border-t border-white/10 relative z-10 mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Type a policy question or message to ${activeAdvisor.name.split(" ")[1]}...`}
                  disabled={loading}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 disabled:text-slate-600 text-black rounded-lg transition-all focus:outline-none flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* CABINET COMMITTEE DEBATE TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          {/* Left Column: Debate Parameters Setup */}
          <div className="lg:col-span-5 space-y-5">
            {/* Speaker Panel Selection */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex justify-between items-center">
                <span>1. Convene 3 Speakers</span>
                <span className="text-[10px] text-amber-500 font-mono tracking-wider">
                  {selectedDebaters.length}/3 Convened
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-500 mb-3 leading-relaxed">
                Click to add/remove ministers. If you select a fourth, it drops the oldest to maintain a rolling trio.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {ADVISORS.map((adv) => {
                  const isChecked = selectedDebaters.includes(adv.id);
                  const speakerIndex = selectedDebaters.indexOf(adv.id) + 1;
                  return (
                    <button
                      key={adv.id}
                      onClick={() => handleToggleDebater(adv.id)}
                      disabled={debateLoading}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center space-x-2 ${
                        isChecked
                          ? "bg-amber-500/10 border-amber-500 text-slate-200"
                          : "bg-black/30 border-white/5 text-slate-400 hover:border-white/10 hover:bg-black/40"
                      } ${debateLoading ? "opacity-50" : ""}`}
                    >
                      <div className="relative">
                        <img
                          src={adv.avatar}
                          alt={adv.name}
                          className="w-7 h-7 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isChecked && (
                          <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0a0d14]">
                            {speakerIndex}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-[11px]">{adv.name.split(" ").slice(-2).join(" ")}</div>
                        <div className="text-[9px] text-slate-500 truncate uppercase tracking-wider">{adv.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Formulation & Presets */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Formulate Policy Directive</span>
              </h3>

              {/* Presets List */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block">
                  Interactive Committee Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEBATE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      disabled={debateLoading}
                      className="px-2.5 py-1 bg-white/5 hover:bg-amber-500/10 hover:text-amber-400 text-slate-300 border border-white/5 rounded-lg text-[10.5px] font-medium transition-all"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Input text area */}
              <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 block">
                  Custom Directive Draft
                </span>
                <textarea
                  value={debateProposal}
                  onChange={(e) => setDebateProposal(e.target.value)}
                  placeholder="Draft your executive directive or legislative decree here..."
                  disabled={debateLoading}
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50 font-sans"
                />
              </div>

              {/* Initiate Trigger Button */}
              <button
                onClick={() => handleConveneDebate()}
                disabled={debateLoading || !debateProposal.trim() || selectedDebaters.length !== 3}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 disabled:text-slate-600 text-black py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {debateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Committee Debating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Convene Cabinet Committee</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Debate Log Boardroom View */}
          <div className="lg:col-span-7 bg-[#080b11] border border-white/10 rounded-xl p-5 flex flex-col justify-between relative min-h-[480px]">
            {/* Boardroom Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] rounded-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">Cabinet Committee Boardroom</h3>
                    <p className="text-[10px] text-slate-500 tracking-wider">CHRONOLOGICAL TESTIMONY FEED</p>
                  </div>
                </div>
                {debateLoading && (
                  <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded-full font-mono flex items-center gap-1 animate-pulse">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Live Session
                  </span>
                )}
              </div>

              {/* Debate Feed Viewport */}
              <div className="flex-1 overflow-y-auto max-h-[440px] min-h-[300px] mt-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {debateMessages.length === 0 && !debateLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                    <div className="p-3.5 bg-white/5 rounded-full border border-white/10 mb-3 text-amber-500/85">
                      <Users className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-slate-300 text-xs uppercase tracking-widest mb-1">
                      Boardroom Vacant
                    </h4>
                    <p className="text-[10.5px] text-slate-500 max-w-xs leading-relaxed">
                      Please formulate an executive directive on the left side, select your preferred trio of ministers, and tap the convene button to commence simulated debate.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* The Initial Proposal Stamp */}
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-xs flex gap-2 font-mono">
                      <span className="text-amber-500 font-bold">PM DIRECTIVE:</span>
                      <span className="text-slate-300 italic">"{debateProposal}"</span>
                    </div>

                    {/* Speeches Stack */}
                    <AnimatePresence initial={false}>
                      {debateMessages.map((msg, index) => {
                        const minister = ADVISORS.find((a) => a.id === msg.advisorId);
                        if (!minister) return null;
                        const { thinking, speech } = parseThinking(msg.text);

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0b0f19] border border-white/10 rounded-xl p-4 space-y-2.5 relative border-l-4 border-l-amber-500"
                          >
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={minister.avatar}
                                alt={minister.name}
                                className="w-8 h-8 rounded-full border border-white/10 object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-200 text-xs leading-none flex items-center gap-1.5">
                                  <span>{minister.name}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-600" />
                                  <span className="text-[10px] text-amber-500/85 bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                                    Speaker {index + 1}
                                  </span>
                                </h4>
                                <p className="text-[9.5px] text-slate-400 font-medium tracking-wide mt-1 uppercase">
                                  {minister.role} • <span className="text-slate-500 capitalize">{minister.ministry}</span>
                                </p>
                              </div>
                            </div>

                            {/* Render Cognitive Thinking Block */}
                            {thinking && (
                              <div className="p-3 bg-amber-500/5 border border-amber-500/10 border-l-2 border-l-amber-500/40 rounded text-[11px] text-slate-400 font-mono leading-relaxed">
                                <span className="text-[10px] text-amber-500 font-bold block mb-1 uppercase tracking-wider flex items-center gap-1">
                                  <Brain className="w-3.5 h-3.5 animate-pulse" />
                                  Portfolio Cognitive Analysis
                                </span>
                                {thinking}
                              </div>
                            )}

                            {/* Main Spoken response */}
                            <p className="text-xs md:text-sm text-slate-200 font-sans leading-relaxed pt-1 whitespace-pre-line">
                              {speech}
                            </p>
                          </motion.div>
                        );
                      })}

                      {/* Debating Active Speaker Loader */}
                      {debateLoading && debateActiveAdvisorId && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-black/30 border border-white/5 border-dashed rounded-xl p-4 flex flex-col items-center justify-center py-6 text-center"
                        >
                          {(() => {
                            const activeM = ADVISORS.find((a) => a.id === debateActiveAdvisorId);
                            if (!activeM) return null;
                            return (
                              <div className="space-y-3">
                                <div className="relative mx-auto w-12 h-12">
                                  <img
                                    src={activeM.avatar}
                                    alt={activeM.name}
                                    className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover animate-pulse"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute bottom-0 right-0 bg-black border border-amber-500 w-4 h-4 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-2.5 h-2.5 text-amber-500 animate-spin" />
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-xs text-slate-300">
                                    {activeM.name} is assessing proposal...
                                  </h4>
                                  <p className="text-[9.5px] text-slate-500 uppercase tracking-widest font-mono">
                                    Confronting Portfolio Indicators & Budget Models
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={debateEndRef} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
