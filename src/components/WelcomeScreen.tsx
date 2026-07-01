import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Flame, ShieldCheck, Landmark, Users, RefreshCw } from "lucide-react";

interface WelcomeScreenProps {
  onStartGame: (pmName: string, focusId: string) => void;
  onContinueGame: () => void;
}

export default function WelcomeScreen({ onStartGame, onContinueGame }: WelcomeScreenProps) {
  const [pmName, setPmName] = useState("");
  const [selectedFocus, setSelectedFocus] = useState("balanced");
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [savedInfo, setSavedInfo] = useState<{ pmName: string; month: string; year: number } | null>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("loksabha_cabinet_simulator_save_v1");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.pmName && parsed.gameState) {
          setHasSavedGame(true);
          setSavedInfo({
            pmName: parsed.pmName,
            month: parsed.gameState.month,
            year: parsed.gameState.year
          });
        }
      }
    } catch (e) {
      console.error("Error checking saved game in WelcomeScreen", e);
    }
  }, []);

  const ideologicalFocuses = [
    {
      id: "balanced",
      title: "Balanced Growth",
      icon: <Landmark className="w-6 h-6 text-indigo-500" />,
      description: "Focus on balancing economic deregulation, technology investments, and target welfare support.",
      bonus: "+10 Initial Political Capital, +5% starting Middle Class approval",
    },
    {
      id: "nationalist",
      title: "Atmanirbhar Nationalists",
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      description: "Prioritize military modernization, heavy border infrastructure, and home-grown local manufacturing.",
      bonus: "+15% starting Defense & Corporate approval, Atmanirbhar bonus",
    },
    {
      id: "socialist",
      title: "Welfare Socialists",
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      description: "Direct massive public funding to farming subsidies, village roads, rural electrification, and health coverage.",
      bonus: "+15% starting Kisan & Rural approval, higher popularity boost",
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pmName.trim()) return;
    onStartGame(pmName.trim(), selectedFocus);
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid dots background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
      
      {/* Dynamic Saffron, White, Green atmospheric glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-[#0a0d14]/90 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl z-10"
      >
        {/* National Tricolor Top Line */}
        <div className="flex h-1.5 w-full rounded-t-lg overflow-hidden -mt-6 md:-mt-10 -mx-6 md:-mx-10 mb-8">
          <div className="bg-amber-500 flex-1" />
          <div className="bg-slate-100 flex-1" />
          <div className="bg-emerald-600 flex-1" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 shadow-inner mb-4">
            <Landmark className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-serif italic text-amber-500 tracking-wider">
            Satyameva Jayate
          </h1>
          <p className="text-slate-400 font-sans text-xs uppercase tracking-widest mt-2 font-bold">
            Indian Government Simulator
          </p>
          <p className="text-slate-400 mt-4 text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed">
            Take oath as the Prime Minister of India. Steer the fate of 1.4 billion citizens, manage states, negotiate geopolitical crises, and draft historic laws.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PM Name Input */}
          <div className="space-y-2">
            <label htmlFor="pmName" className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
              Prime Minister Name
            </label>
            <input
              type="text"
              id="pmName"
              placeholder="e.g. Narendra Shastri, Arjun Mehta, Indira Sen"
              value={pmName}
              onChange={(e) => setPmName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 rounded-lg py-3 px-4 focus:outline-none transition-colors text-base font-sans"
              maxLength={40}
              required
            />
          </div>

          {/* Cabinet Focus Ideology Select */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
              Cabinet Ideological Focus
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ideologicalFocuses.map((focus) => (
                <div
                  key={focus.id}
                  onClick={() => setSelectedFocus(focus.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    selectedFocus === focus.id
                      ? "bg-white/5 border-amber-500/80 shadow-md shadow-amber-500/5"
                      : "bg-black/40 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {focus.icon}
                      <h3 className="font-bold text-slate-200 text-sm font-sans">{focus.title}</h3>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">{focus.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-semibold text-amber-500 tracking-wide font-sans">
                    {focus.bonus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oath Action */}
          <div className="pt-4 text-center space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {hasSavedGame && savedInfo && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onContinueGame}
                  className="w-full md:w-auto md:px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/10 font-extrabold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <RefreshCw className="w-4 h-4 text-amber-500 animate-[spin_4s_linear_infinite]" />
                  <span>Resume Game: PM {savedInfo.pmName} ({savedInfo.month} {savedInfo.year})</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!pmName.trim()}
                className="w-full md:w-auto md:px-12 py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-amber-600/10 transition-all flex items-center justify-center space-x-2"
              >
                <Flame className="w-5 h-5 fill-black" />
                <span>Take Oath of Office</span>
              </motion.button>
            </div>
            <p className="text-slate-500 text-[10px] mt-3 font-sans">
              By taking oath, you agree to protect the sovereignty, unity, and integrity of India.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
