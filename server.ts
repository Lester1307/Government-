import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes

// Endpoint 1: Consult an Advisor (Supports Interactive Two-Way Conversation)
app.post("/api/game/advisor", async (req, res) => {
  try {
    const { advisorId, gameState, messages } = req.body;
    if (!advisorId || !gameState) {
      return res.status(400).json({ error: "Missing advisorId or gameState" });
    }

    const ai = getAi();

    const ministerProfiles: Record<string, string> = {
      nirmala: "Smt. Nirmala Shastry (Finance Minister) - extremely pragmatic, data-driven, cautious with spending, focuses on inflation, fiscal deficit, GDP. Tone is analytical, firm, and conservative.",
      amit: "Shri Amit Dev (Home Affairs Minister) - stern, focuses on domestic law & order, national security, internal stability, states integration. Tone is serious, direct, and authoritative.",
      jaishankar: "Dr. S. Jaishankar Prasad (External Affairs Minister) - highly articulate global strategist, focuses on foreign trade, bilateral relations, global standing, and foreign direct investment (FDI). Tone is diplomatic, sharp, poised, and eloquent.",
      rajnath: "General Rajnath Singh (Defence Minister) - patriotic, focuses on military modernization, border guards, defense factories, self-reliance ('Atmanirbhar Bharat'). Tone is disciplined, respectful, and patriotic.",
      gadkari: "Shri Nitin Gokhale (Infrastructure Minister) - enthusiastic builder, focuses on highways, expressways, public-private partnerships, smart toll gates, and reducing logistics costs. Tone is optimistic, practical, and action-oriented.",
      piyush: "Shri Piyush Shrivastava (Railways & Commerce Minister) - commercial genius, focuses on manufacturing exports, Vande Bharat tracks, cargo transit speeds, and trade policies. Tone is business-like, professional, and efficient.",
      dharmendra: "Shri Dharmendra Prasad (Education Minister) - dedicated reformer, focuses on vocational colleges, digital skills, student research fellowships, and the National Education Policy. Tone is academic, inspiring, and encouraging.",
      shivraj: "Shri Shivraj Chauhan (Agriculture Minister) - empathetic farming champion, focuses on crop prices, Minimum Support Prices (MSP), micro-irrigation, and rural household welfare. Tone is humble, rural-focused, and compassionate.",
      nadda: "Shri J. P. Narayan (Health Minister) - focused on expanding hospital access, low-cost generic drugs (Jan Aushadhi), clean rural clinics, and public health insurance (Ayushman Bharat). Tone is compassionate, service-minded, and administrative.",
      bhupendra: "Shri Bhupendra Yadav (Environment Minister) - green diplomat, focuses on solar energy installations, EV transitions, cleaning water bodies, and carbon footprint standards. Tone is environmental, forward-thinking, and strategic.",
      somnath: "Dr. S. Somnath Roy (Space & Technology Chief) - visionary scientist, focuses on space achievements (ISRO), semiconductor fabrication incentives, software exports, and deep-tech innovation. Tone is futuristic, tech-optimistic, and logical."
    };

    const activeProfile = ministerProfiles[advisorId] || ministerProfiles.nirmala;

    const systemInstruction = `You are roleplaying as a real Cabinet Minister of India in an interactive simulator game.
Your identity profile: ${activeProfile}

Current Indian Government State (Context):
- Year & Month: ${gameState.year} ${gameState.month}
- GDP: ₹${gameState.gdp.toFixed(1)} Lakh Crore (Growth: ${gameState.gdpGrowth.toFixed(1)}%)
- Inflation: ${gameState.inflation.toFixed(1)}%
- Unemployment: ${gameState.unemployment.toFixed(1)}%
- National Treasury: ₹${gameState.treasury.toFixed(1)} Lakh Crore
- Public Approval (Popularity): ${gameState.popularity.toFixed(1)}%
- Demographic Approvals: Farmers: ${gameState.demographics.farmers}%, Youth: ${gameState.demographics.youth}%, Corporate: ${gameState.demographics.corporate}%, Middle Class: ${gameState.demographics.middleClass}%, Rural: ${gameState.demographics.rural}%, Urban: ${gameState.demographics.urban}%
- Current Focus: ${gameState.currentFocus || 'Balanced Growth'}
- Active Events/Crises: ${gameState.activeEvents?.join(", ") || 'None'}

Roleplay instructions:
1. Always address the user directly as "Prime Minister" or "Sir".
2. Stay completely in-character according to your portfolio, focus, and tone.
3. Be helpful, concise, and direct. Your answers or statements MUST be 2-4 sentences maximum.
4. Base your feedback and opinions on the current economic state of India. If a metric relevant to your department is doing poorly, speak up about it.
5. If the user asks a question, answer it realistically inside your 2-4 sentence limit. Do not use markdown headers, lists, or bullets. Maintain a natural, conversational dialogue.`;

    let contents;
    if (messages && Array.isArray(messages) && messages.length > 0) {
      contents = messages.map(m => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }]
      }));
    } else {
      contents = [
        {
          role: "user",
          parts: [{ text: "Minister, please provide an official briefing and strategic recommendation based on our current economic and national situation." }]
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Advisor consult error:", error);
    res.status(500).json({ error: error.message || "Failed to consult advisor." });
  }
});

// Endpoint 2: Evaluate a custom typed policy
app.post("/api/game/custom-policy", async (req, res) => {
  try {
    const { policyText, gameState } = req.body;
    if (!policyText || !gameState) {
      return res.status(400).json({ error: "Missing policyText or gameState" });
    }

    const ai = getAi();

    const prompt = `You are a policy simulator for the "Indian Government Simulator" game.
The Prime Minister of India wants to implement the following custom policy:
"${policyText}"

Here is the current state of India before this policy:
- GDP: ₹${gameState.gdp.toFixed(1)} Lakh Crore (Growth: ${gameState.gdpGrowth.toFixed(1)}%)
- Inflation: ${gameState.inflation.toFixed(1)}%
- Unemployment: ${gameState.unemployment.toFixed(1)}%
- Treasury: ₹${gameState.treasury.toFixed(1)} Lakh Crore
- General Approval: ${gameState.popularity.toFixed(1)}%
- Demographic Approvals (0-100): Farmers: ${gameState.demographics.farmers}%, Youth: ${gameState.demographics.youth}%, Corporate: ${gameState.demographics.corporate}%, Middle Class: ${gameState.demographics.middleClass}%, Rural: ${gameState.demographics.rural}%, Urban: ${gameState.demographics.urban}%

Analyze this policy realistically in the context of contemporary India. Calculate its fiscal, economic, and social consequences.
Return a structured JSON object representing the consequences. You must follow the exact schema requested below.

Provide:
1. An elegant, official formatted title for the policy.
2. A summary narrative (2-3 sentences) detailing the policy's implementation, the public's reaction, and media highlights.
3. Fiscal cost to the National Treasury (in Lakh Crores of Rupees). Use a positive number for spending, or a negative number if it raises revenue (e.g. higher taxes or tariff). A reasonable range is usually ₹0.05 Lakh Crore to ₹3.0 Lakh Crore depending on scale.
4. Impact on GDP Growth Rate (percentage points, e.g. +0.4 or -0.2).
5. Impact on Inflation (percentage points, e.g. +0.2 or -0.3).
6. Impact on Unemployment (percentage points, e.g. -0.5 or +0.1).
7. Impact on overall General Popularity (range -10 to +10).
8. Impact on specific Demographics (points to add/subtract, range -15 to +15): farmers, youth, corporate, middleClass, rural, urban.
9. Interactive short quotes (1-2 sentences each) reacting to this policy from at least 3 of these cabinet ministers:
   - Nirmala (Finance)
   - Amit (Home)
   - Jaishankar (External Affairs)
   - Rajnath (Defense)
   - Gadkari (Infrastructure)
   - Piyush (Railways & Commerce)
   - Dharmendra (Education)
   - Shivraj (Agriculture)
   - Nadda (Health)
   - Bhupendra (Environment)
   - Somnath (ISRO/Science)

Make sure the numbers are realistic. High spending stimulates growth but increases inflation and drains the treasury. High business taxes please the rural/farmers but anger the corporate/middleClass. Social welfare pleases farmers and rural, but can cause fiscal strain. Border actions please patriots/defense but might affect external relations or corporate FDI.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["policyName", "description", "fiscalCost", "gdpGrowthImpact", "inflationImpact", "unemploymentImpact", "popularityImpact", "demographicsImpact", "advisorReactions"],
          properties: {
            policyName: { type: Type.STRING, description: "Official, elegant title of the policy in English/Hindi transliterated (e.g. 'Pradhan Mantri High-Speed Rail Mission')" },
            description: { type: Type.STRING, description: "Narrative summary of the outcome, media headlines, and overall sentiment." },
            fiscalCost: { type: Type.NUMBER, description: "Cost in Lakh Crores of Rupees. Spending is positive, revenue generation is negative." },
            gdpGrowthImpact: { type: Type.NUMBER, description: "Effect on GDP Growth Rate in percentage points (e.g., 0.3 for +0.3%, -0.1 for -0.1%)." },
            inflationImpact: { type: Type.NUMBER, description: "Effect on Inflation rate in percentage points (e.g., 0.15 for +0.15%)." },
            unemploymentImpact: { type: Type.NUMBER, description: "Effect on Unemployment rate in percentage points (e.g., -0.2 for -0.2%)." },
            popularityImpact: { type: Type.NUMBER, description: "Overall general approval effect (points, e.g. 4.5 or -3.0)." },
            demographicsImpact: {
              type: Type.OBJECT,
              required: ["farmers", "youth", "corporate", "middleClass", "rural", "urban"],
              properties: {
                farmers: { type: Type.NUMBER, description: "Impact on Farmer approval (points)" },
                youth: { type: Type.NUMBER, description: "Impact on Youth approval (points)" },
                corporate: { type: Type.NUMBER, description: "Impact on Corporate approval (points)" },
                middleClass: { type: Type.NUMBER, description: "Impact on Middle Class approval (points)" },
                rural: { type: Type.NUMBER, description: "Impact on Rural approval (points)" },
                urban: { type: Type.NUMBER, description: "Impact on Urban approval (points)" }
              }
            },
            advisorReactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["advisorId", "name", "quote"],
                properties: {
                  advisorId: { type: Type.STRING, description: "One of: nirmala, amit, jaishankar, rajnath, gadkari, piyush, dharmendra, shivraj, nadda, bhupendra, somnath" },
                  name: { type: Type.STRING, description: "Display name e.g. Nirmala Shastry" },
                  quote: { type: Type.STRING, description: "Advisor's direct quote reacting to the policy." }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Custom policy simulation error:", error);
    res.status(500).json({ error: error.message || "Failed to simulate custom policy." });
  }
});

// Endpoint 3: Create dynamic news flash headlines based on current events and state
app.post("/api/game/news-flash", async (req, res) => {
  try {
    const { gameState } = req.body;
    if (!gameState) {
      return res.status(400).json({ error: "Missing gameState" });
    }

    const ai = getAi();
    
    const prompt = `You are a major national news anchor in India (e.g., DD News or NDTV style).
Generate 3 distinct, highly realistic news flash tickers/headlines reflecting this current state:
- GDP Growth: ${gameState.gdpGrowth.toFixed(1)}%, Inflation: ${gameState.inflation.toFixed(1)}%, Unemployment: ${gameState.unemployment.toFixed(1)}%
- Popularity: ${gameState.popularity.toFixed(1)}%
- Active Crises: ${gameState.activeEvents?.join(", ") || 'None'}
- Year/Month: ${gameState.year} ${gameState.month}

Return a JSON array of strings containing 3 distinct ticker headlines. Make them sound urgent, realistic, and highly relevant to India (mentioning places like New Delhi, Mumbai, Bengaluru, or rural sectors).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    res.json({ headlines: JSON.parse(response.text.trim()) });
  } catch (error: any) {
    console.error("News flash error:", error);
    res.json({ headlines: [
      `BREAKING: Parliament session resumes to discuss national developmental goals.`,
      `MARKET UPDATE: Sensex fluctuates amid local fiscal budget discussions.`,
      `WEATHER UPDATE: Indian Meteorological Department issues regional rainfall outlook.`
    ]});
  }
});


// Serve Static Assets in Production, handle Vite in Development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode with static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Indian Government Simulator server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
