import React, { useState, useEffect, useRef } from "react";
import { Advisor, GameState } from "../types";
import { ADVISORS } from "../gameData";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, ShieldAlert, Radio, HelpCircle, Loader2, Send, Trash2, Key, Brain } from "lucide-react";
import { getLocalAdvisorFallback } from "../utils/localFallbacks";
import { getClientApiKey, setClientApiKey, clientGeminiAdvisor } from "../utils/clientGemini";

interface AdvisorConsultProps {
  gameState: GameState;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AdvisorConsult({ gameState }: AdvisorConsultProps) {
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>("nirmala");
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [clientApiKey, setClientApiKeyLocal] = useState<string>(getClientApiKey() || "");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

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

  const activeAdvisor = ADVISORS.find((a) => a.id === selectedAdvisorId) || ADVISORS[0];
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selectedAdvisorId, loading]);

  const currentMessages = chats[selectedAdvisorId] || [];

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
            // If not ok or not json, trigger the local fallback directly
            console.warn(`Advisor API response was not OK or not JSON. Using client-side fallback. Status: ${response.status}`);
            adviceText = getLocalAdvisorFallback(selectedAdvisorId, gameState, textToSend);
          }
        } catch (fetchErr) {
          console.warn("Advisor API fetch failed. Using client-side fallback.", fetchErr);
          adviceText = getLocalAdvisorFallback(selectedAdvisorId, gameState, textToSend);
        }
      }

      setChats((prev) => ({
        ...prev,
        [selectedAdvisorId]: [...updatedHistory, { role: "assistant", text: adviceText }],
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
      <div className="mb-6 pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif italic text-amber-500 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
            <span>Cabinet Briefing Chamber</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Summon your key Ministers to hold realistic, interactive, two-way strategic dialogues on economic, security, and development issues.
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
          {currentMessages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:bg-rose-900/20 text-xs rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Dialogue</span>
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
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <img
                  src={activeAdvisor.avatar}
                  alt={activeAdvisor.name}
                  className="w-12 h-12 rounded-full border-2 border-amber-500/85 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm md:text-base">{activeAdvisor.name}</h3>
                  <p className="text-xs text-amber-500 tracking-wide font-medium">{activeAdvisor.role} • <span className="text-slate-400 font-normal">{activeAdvisor.ministry}</span></p>
                </div>
              </div>
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
                  <p className="font-semibold text-amber-500/90 mb-1 text-[10px] uppercase tracking-wider">Ministerial Overview</p>
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
                                <div className="whitespace-pre-line">{speech}</div>
                              </>
                            );
                          })()
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2.5"
                  >
                    <img
                      src={activeAdvisor.avatar}
                      alt={activeAdvisor.name}
                      className="w-6 h-6 rounded-full border border-white/10 object-cover animate-pulse"
                      referrerPolicy="no-referrer"
                    />
                    <div className="bg-black/20 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2">
                      <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      <span className="text-xs text-slate-400 animate-pulse font-mono tracking-wider">Drafting Response...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl text-xs">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                    onClick={() => handleSendMessage("Minister, please provide an official department briefing and strategic recommendation based on our current economic and national situation.")}
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
    </div>
  );
}
