import { Demographics, GameState } from "../types";

export function getClientApiKey(): string | null {
  return localStorage.getItem("rajniti_user_gemini_api_key") || null;
}

export function setClientApiKey(key: string) {
  if (key) {
    localStorage.setItem("rajniti_user_gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("rajniti_user_gemini_api_key");
  }
}

export async function clientGeminiAdvisor(
  advisorId: string,
  gameState: GameState,
  messages: { role: "user" | "assistant"; text: string }[]
): Promise<string> {
  const apiKey = getClientApiKey();
  if (!apiKey) throw new Error("No API key configured");

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
1. ALWAYS prefix your response with a highly detailed, realistic thinking and understanding process wrapped in <thinking>...</thinking> XML tags. This block represents your internal, unvarnished cognitive reasoning as a policy architect.
2. Inside the <thinking>...</thinking> block, perform a concise but deep cognitive analysis of the Prime Minister's prompt:
   - Critically evaluate the financial cost and impact on your department (e.g. Budget/Revenue, Law & Order, Defence procurement) referencing actual values like Treasury (₹${gameState.treasury.toFixed(1)} L Cr) and GDP Growth (+${gameState.gdpGrowth.toFixed(1)}%).
   - Evaluate public approval, noting specific gains or risks for targeted demographics (Farmers: ${gameState.demographics.farmers}%, Youth: ${gameState.demographics.youth}%, Corporate: ${gameState.demographics.corporate}%, Middle Class: ${gameState.demographics.middleClass}%, Rural: ${gameState.demographics.rural}%, Urban: ${gameState.demographics.urban}%).
   - If other ministers have already spoken in this debate (indicated by transcripts like "[Minister Name]: Speech..."), assess their arguments. Note where your portfolio interests clash (e.g., Agriculture's demand for subsidies vs. Finance's fiscal deficit constraints, or Infrastructure's capital needs vs. Environment's carbon limits) and formulate a calculated strategic counter-response or compromise posture.
3. AFTER the </thinking> closing tag, write your direct spoken dialogue responding to the Prime Minister. Always address the user directly as "Prime Minister" or "Sir".
4. Stay completely in-character according to your portfolio, focus, and tone. Be highly knowledgeable, helpful, and professional:
   - If the Prime Minister asks a factual, policy-oriented, or technical question (such as "is E20 safe to implement?", space exploration, healthcare, or tax policies), you MUST reply with a comprehensive, professional explanation. Detail the key pros and cons (what is good and what is not), coupled with a full, realistic budget calculation (e.g., raw procurement costs, tax revenues, infrastructural layout, or logistics savings in Lakh Crores) based on contemporary Indian data and actual implementation challenges. Use clean formatting like bullet points or bold terms for readability.
   - If the Prime Minister explicitly requests a new plan, scheme, or initiative (or clicks the 'Request New Initiative' button), you must formulate a creative and realistic department scheme. In addition to describing it in your spoken dialogue, you MUST append a structured JSON block at the very end of your message in the following format:
\`\`\`json
{
  "proposal": {
    "title": "A highly elegant, official name for your scheme (e.g. Pradhan Mantri Gati-Shakti Expressway Corridor)",
    "description": "A precise 1-2 sentence description of the initiative's focus and scope.",
    "cost": 2.5, // Estimated fiscal cost in Lakh Crore rupees (must be a number, e.g. 1.5, 0.75, etc.)
    "politicalCapitalCost": 12, // Suggested Political Capital required (must be an integer, e.g., 5 to 20)
    "targetSector": "infrastructure", // Must be one of: "defense", "infrastructure", "education", "healthcare", "agriculture", "scienceSpace", "socialWelfare"
    "impacts": {
      "gdp": 0.4, // Estimated GDP growth change in percentage points (e.g., 0.2, -0.1)
      "inflation": 0.1, // Estimated inflation change in percentage points
      "unemployment": -0.3, // Estimated unemployment change in percentage points
      "popularity": 4.5, // Public approval popularity gain/loss percentage (e.g., 3.5, -2.0)
      "demographics": { // Map of impact on demographics (-10 to 10 points per demographic)
        "farmers": 0,
        "youth": 2.5,
        "corporate": 3.0,
        "middleClass": 1.5,
        "rural": 1.0,
        "urban": 2.0
      }
    }
  }
}
\`\`\`
   - Do not include the JSON block for basic questions or casual hellos, ONLY when a new plan, scheme, or initiative is requested.`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API failed with status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error("No response content from Gemini API.");
  return reply;
}

export async function clientGeminiPolicy(policyText: string, gameState: GameState): Promise<any> {
  const apiKey = getClientApiKey();
  if (!apiKey) throw new Error("No API key configured");

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
Return a structured JSON object representing the consequences. You must follow the exact JSON format requested below.

JSON Schema:
{
  "policyName": "Official elegant title of the policy",
  "description": "Narrative summary of the outcome, media headlines, and overall sentiment.",
  "fiscalCost": 1.5, // Lakh Crores of Rupees. Spending is positive, revenue generation is negative.
  "gdpGrowthImpact": 0.3, // Effect on GDP Growth Rate in percentage points
  "inflationImpact": 0.15, // Effect on Inflation in percentage points
  "unemploymentImpact": -0.2, // Effect on Unemployment in percentage points
  "popularityImpact": 4.5, // Overall general approval effect
  "demographicsImpact": {
    "farmers": 2.0,
    "youth": 1.5,
    "corporate": -1.0,
    "middleClass": 0.5,
    "rural": 1.0,
    "urban": 0.5
  },
  "advisorReactions": [
    {
      "advisorId": "nirmala",
      "name": "Nirmala Shastry",
      "quote": "Advisor's quote reacting to the policy."
    }
  ]
}

Only return raw JSON. No markdown wrappers, no backticks.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API failed with status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini API.");
  return JSON.parse(text.trim());
}

export async function clientGeminiNews(gameState: GameState): Promise<string[]> {
  const apiKey = getClientApiKey();
  if (!apiKey) throw new Error("No API key configured");

  const prompt = `You are a major national news anchor in India.
Generate 3 distinct, highly realistic news flash tickers/headlines reflecting this current state:
- GDP Growth: ${gameState.gdpGrowth.toFixed(1)}%, Inflation: ${gameState.inflation.toFixed(1)}%, Unemployment: ${gameState.unemployment.toFixed(1)}%
- Popularity: ${gameState.popularity.toFixed(1)}%
- Active Crises: ${gameState.activeEvents?.join(", ") || 'None'}
- Year/Month: ${gameState.year} ${gameState.month}

Return a JSON array of strings containing exactly 3 distinct ticker headlines. Sound urgent and realistic. Only return raw JSON array.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json"
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API status ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text response");
  return JSON.parse(text.trim());
}
