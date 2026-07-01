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

// Robust Retry Helper for Gemini API calls
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries <= 0) {
      throw err;
    }
    console.warn(`Gemini API call failed. Retrying in ${delay}ms... (${retries} retries remaining). Error:`, err.message || err);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return callWithRetry(fn, retries - 1, delay * 1.5);
  }
}

// Highly realistic context-aware local fallback responses for cabinet members when API is experiencing high demand/downtime
function getLocalAdvisorFallback(advisorId: string, gameState: any, userQuery?: string): string {
  const query = (userQuery || "").toLowerCase();

  // 1. Finance Minister (Nirmala Shastry)
  if (advisorId === "nirmala") {
    if (query.includes("tax") || query.includes("gst") || query.includes("slab") || query.includes("corporate") || query.includes("income") || query.includes("revenue")) {
      return `Prime Minister, adjusting tax slabs or GST rates is a double-edged sword. While it could bolster our national Treasury of ₹${gameState.treasury.toFixed(1)} Lakh Crore, higher tax burdens might depress private corporate investments and anger the middle class (+${gameState.demographics.middleClass || 50}% approval).`;
    }
    if (query.includes("gdp") || query.includes("growth") || query.includes("recession") || query.includes("economy")) {
      return `Sir, our current GDP growth stands at +${gameState.gdpGrowth.toFixed(1)}%. To accelerate this sustainably, we must increase high-quality capital expenditure rather than expanding recurring populist subsidies, which leads to fiscal slippage.`;
    }
    if (query.includes("inflation") || query.includes("price") || query.includes("cost") || query.includes("petrol") || query.includes("diesel")) {
      return `Prime Minister, inflation is currently at ${gameState.inflation.toFixed(1)}%. We are working in close tandem with the RBI to manage systemic liquidity, but we must also address supply-side logistics bottlenecks to bring permanent relief to consumers.`;
    }
    if (query.includes("deficit") || query.includes("debt") || query.includes("borrow") || query.includes("spending") || query.includes("treasury") || query.includes("fund") || query.includes("money")) {
      return `Sir, our liquid Treasury stands at ₹${gameState.treasury.toFixed(1)} Lakh Crore. We must exercise absolute fiscal discipline and resist calls for unbudgeted expenditures, otherwise we risk widening the fiscal deficit and driving inflation.`;
    }
    if (query.includes("job") || query.includes("unemployment") || query.includes("employment") || query.includes("work")) {
      return `Prime Minister, to tackle the unemployment rate of ${gameState.unemployment.toFixed(1)}%, our upcoming budget will incentivize labor-intensive manufacturing sectors and expand credit guarantees for small MSMEs.`;
    }
    return `Prime Minister, regarding your inquiry, our department is running a complete audit. With our Treasury at ₹${gameState.treasury.toFixed(1)} L Cr, any fiscal changes must protect GDP growth (+${gameState.gdpGrowth.toFixed(1)}%) while keeping inflation (${gameState.inflation.toFixed(1)}%) under tight control.`;
  }

  // 2. Home Affairs Minister (Amit Dev)
  if (advisorId === "amit") {
    if (query.includes("police") || query.includes("force") || query.includes("security") || query.includes("riot") || query.includes("crime") || query.includes("law") || query.includes("order") || query.includes("safety")) {
      return `Sir, police modernization remains our department's highest priority. We must ensure state police forces are fully equipped with advanced tactical communication gear and crowd-control training to secure domestic peace.`;
    }
    if (query.includes("state") || query.includes("border") || query.includes("friction") || query.includes("coalition") || query.includes("opposition") || query.includes("election")) {
      return `Prime Minister, local state administrations require cooperative federalism, but we will not compromise on national integrity. Regional political factions must respect federal laws, or face firm administrative responses.`;
    }
    if (query.includes("terror") || query.includes("extremis") || query.includes("kashmir") || query.includes("naxal") || query.includes("maoist")) {
      return `Sir, our stance is zero-tolerance. Central security agencies are conducting precise, intelligence-led operations to dismantle extremist networks and ensure complete stability in sensitive border and forest zones.`;
    }
    if (query.includes("popular") || query.includes("vote") || query.includes("approval") || query.includes("public")) {
      return `Prime Minister, our popular approval is healthy at ${gameState.popularity.toFixed(1)}%. To build on this trust for the upcoming April 2029 mandate, we must continue communicating our strong, uncompromising stance on national security and internal law and order.`;
    }
    return `Prime Minister, internal security is stable and under control. With our national popularity at ${gameState.popularity.toFixed(1)}%, our intelligence grid is fully alert. We will continue to maintain firm administrative law to support development.`;
  }

  // 3. External Affairs Minister (Dr. Jaishankar)
  if (advisorId === "jaishankar") {
    if (query.includes("china") || query.includes("border") || query.includes("pakistan") || query.includes("lac") || query.includes("loc") || query.includes("neighbor")) {
      return `Prime Minister, our diplomatic stance is resolute: peace and tranquility at our borders are non-negotiable prerequisites for normalized bilateral relations. We are actively countering expansionism while maintaining structured diplomatic dialogues.`;
    }
    if (query.includes("usa") || query.includes("america") || query.includes("russia") || query.includes("europe") || query.includes("global") || query.includes("un") || query.includes("world")) {
      return `Sir, India's foreign policy is anchored in strategic autonomy. We maintain productive, multi-aligned relations with both Western nations and traditional partners to secure our own energy and technology interests first.`;
    }
    if (query.includes("fdi") || query.includes("investment") || query.includes("trade") || query.includes("export") || query.includes("tariff") || query.includes("import")) {
      return `Prime Minister, expanding trade access and attracting foreign direct investments are top priorities. We are engaging global industrial leaders to present India as the premier resilient alternative in global high-tech supply chains.`;
    }
    if (query.includes("g20") || query.includes("standing") || query.includes("influence") || query.includes("power")) {
      return `Sir, India's global standing has reached unprecedented heights. Our voice is respected as the leading bridge-builder for the Global South, enabling us to shape international agendas on commerce and climate.`;
    }
    return `Prime Minister, our diplomatic missions are actively advancing India's national interest. We are navigating complex geopolitical alignments to secure trade agreements that directly support our GDP growth of +${gameState.gdpGrowth.toFixed(1)}%.`;
  }

  // 4. Defense Minister (General Rajnath)
  if (advisorId === "rajnath") {
    if (query.includes("army") || query.includes("navy") || query.includes("air") || query.includes("military") || query.includes("weapon") || query.includes("soldier") || query.includes("force")) {
      return `Sir, our armed forces are in a state of high combat readiness. We are speeding up procurement of next-generation fighter aircraft and stealth submarines to safeguard our maritime and territorial sovereignty.`;
    }
    if (query.includes("atmanirbhar") || query.includes("indigenous") || query.includes("domestic") || query.includes("drdo") || query.includes("make") || query.includes("manufacture")) {
      return `Prime Minister, defense self-reliance is vital. We are actively shifting defense acquisitions to domestic private and public vendors, aiming to build a self-sustaining defense manufacturing base that reduces import costs.`;
    }
    if (query.includes("cyber") || query.includes("space") || query.includes("threat") || query.includes("intelligence")) {
      return `Sir, modern battles are multi-domain. We have operationalized dedicated Cyber and Space defense commands to shield our critical infrastructure from state-sponsored cyber offensives.`;
    }
    if (query.includes("border") || query.includes("china") || query.includes("pakistan") || query.includes("lac") || query.includes("loc")) {
      return `Prime Minister, our border infrastructure development is progressing at double-speed. Any hostile misadventure along our LAC or LoC will be met with a swift, decisive, and crushing counter-response from our armed forces.`;
    }
    return `Prime Minister, the nation's defense shield is secure. We are modernizing our divisions and supporting 'Atmanirbhar Bharat' in defense production to counter multi-front strategic challenges.`;
  }

  // 5. Infrastructure Minister (Shri Nitin Gadkari)
  if (advisorId === "gadkari") {
    if (query.includes("highway") || query.includes("road") || query.includes("expressway") || query.includes("path") || query.includes("construction")) {
      return `Prime Minister, highway construction is running at record speed. We are building 10,000 km of new green expressways to link farm and factory nodes, which will boost GDP growth (+${gameState.gdpGrowth.toFixed(1)}%) across all states.`;
    }
    if (query.includes("toll") || query.includes("fee") || query.includes("gps") || query.includes("fastag")) {
      return `Sir, we are transitioning to satellite-based GPS tolling, which will eliminate physical toll plazas entirely. This will save thousands of crores in fuel waste and logistics transit delays annually.`;
    }
    if (query.includes("logistics") || query.includes("cost") || query.includes("freight") || query.includes("truck") || query.includes("transport")) {
      return `Prime Minister, our goal is to lower India's logistics costs from 14% of GDP to under 9%. This structural shift will make our domestic manufacturing exports highly competitive on the global stage.`;
    }
    if (query.includes("ppp") || query.includes("fund") || query.includes("money") || query.includes("private") || query.includes("treasury")) {
      return `Sir, we cannot rely solely on the national Treasury (₹${gameState.treasury.toFixed(1)} L Cr). We are actively leveraging public-private partnerships and asset monetization models to secure non-budgetary capital.`;
    }
    return `Prime Minister, high-speed infrastructure is the primary engine of India's growth. We are focused on removing bureaucratic bottlenecks to accelerate expressway and logistics terminal completions.`;
  }

  // 6. Railways & Commerce Minister (Shri Piyush)
  if (advisorId === "piyush") {
    if (query.includes("rail") || query.includes("train") || query.includes("vande") || query.includes("bullet") || query.includes("station") || query.includes("track")) {
      return `Prime Minister, railways modernization is on track. We are rolling out Vande Bharat and Amrit Bharat fleets weekly, and our high-capacity dedicated freight corridors are reducing industrial transit times by 40%.`;
    }
    if (query.includes("export") || query.includes("trade") || query.includes("import") || query.includes("msme") || query.includes("tariff") || query.includes("commerce")) {
      return `Sir, we are targeting $1 Trillion in merchandise exports by expanding trade promotion offices in strategic global capitals and easing credit access for exporting MSMEs.`;
    }
    if (query.includes("industry") || query.includes("factory") || query.includes("manufacturing") || query.includes("production") || query.includes("pli")) {
      return `Prime Minister, domestic manufacturing is gaining immense momentum. Our Production Linked Incentive (PLI) schemes have successfully brought international electronic and solar assembly lines directly to Indian soil.`;
    }
    if (query.includes("business") || query.includes("ease") || query.includes("license") || query.includes("permit") || query.includes("corporate")) {
      return `Sir, we have simplified multiple commercial laws and set up a single-window portal to boost corporate confidence. Corporate approval stands at ${gameState.demographics?.corporate || 50}%, showing strong business optimism.`;
    }
    return `Prime Minister, railways and domestic commerce are performing steadily. We are expanding trade channels and modernizing cargo transit systems to maintain strong momentum in our GDP growth (+${gameState.gdpGrowth.toFixed(1)}%).`;
  }

  // 7. Education Minister (Shri Dharmendra)
  if (advisorId === "dharmendra") {
    if (query.includes("school") || query.includes("college") || query.includes("education") || query.includes("nep") || query.includes("university")) {
      return `Prime Minister, the National Education Policy (NEP) is being rolled out rapidly. We are focusing on mother-tongue primary instruction and establishing multidisciplinary higher education institutions.`;
    }
    if (query.includes("skill") || query.includes("vocational") || query.includes("job") || query.includes("training") || query.includes("unemployment")) {
      return `Sir, to lower the youth unemployment rate of ${gameState.unemployment.toFixed(1)}%, we are launching thousands of modern skill-development labs in tier-2 and tier-3 districts to match actual corporate requirements.`;
    }
    if (query.includes("research") || query.includes("fellowship") || query.includes("scientist") || query.includes("phd") || query.includes("science")) {
      return `Prime Minister, we are introducing competitive national research fellowships in AI, quantum computing, and clean energy to encourage innovation and retain our top scientific minds.`;
    }
    return `Prime Minister, educational and skill-development reforms are progressing. We are focused on updating academic curricula and expanding vocational centers to prepare our youth (${gameState.demographics?.youth || 50}% approval) for the future.`;
  }

  // 8. Agriculture Minister (Shri Shivraj)
  if (advisorId === "shivraj") {
    if (query.includes("farmer") || query.includes("kisan") || query.includes("agriculture") || query.includes("crop") || query.includes("farming")) {
      return `Prime Minister, our kisans require steady support. We are ensuring the timely distribution of fertilizer subsidies and expanding access to interest-free agricultural credit (Farmer approval: ${gameState.demographics?.farmers || 50}%).`;
    }
    if (query.includes("msp") || query.includes("price") || query.includes("market") || query.includes("wheat") || query.includes("rice")) {
      return `Sir, we are expanding our MSP procurement mechanism to cover wider pulse and oilseed varieties, ensuring fair prices are paid directly into farmers' bank accounts without middleman leaks.`;
    }
    if (query.includes("irrigation") || query.includes("drought") || query.includes("water") || query.includes("monsoon") || query.includes("canal")) {
      return `Prime Minister, water security is food security. We are scaling up micro-irrigation systems and constructing check-dams in rain-deficient districts to shield crops from erratic monsoon trends.`;
    }
    return `Prime Minister, the agricultural sector is the absolute lifeblood of India. We must continue to support rural household incomes through crop insurance and direct transfer benefits to keep our food inflation low.`;
  }

  // 9. Health Minister (Shri J. P. Nadda)
  if (advisorId === "nadda") {
    if (query.includes("health") || query.includes("hospital") || query.includes("clinic") || query.includes("doctor") || query.includes("medical")) {
      return `Prime Minister, we are constructing state-of-the-art AIIMS medical institutes in multiple regions and upgrading rural health centers with digital telemedicine equipment to improve rural doctor access.`;
    }
    if (query.includes("ayushman") || query.includes("insurance") || query.includes("card") || query.includes("free")) {
      return `Sir, Ayushman Bharat has provided cashless secondary and tertiary hospitalization to over 50 crore citizens. We are considering expanding coverage to all senior citizens regardless of income.`;
    }
    if (query.includes("medicine") || query.includes("drug") || query.includes("pharmacy") || query.includes("cheap")) {
      return `Prime Minister, our network of Jan Aushadhi pharmacies is delivering high-quality generic essential medicines at a 50% to 90% discount, bringing vast financial relief to middle-class households.`;
    }
    return `Prime Minister, we are expanding public healthcare facilities and lowering out-of-pocket expenses to ensure robust health coverage for both urban and rural families.`;
  }

  // 10. Environment Minister (Shri Bhupendra)
  if (advisorId === "bhupendra") {
    if (query.includes("solar") || query.includes("power") || query.includes("energy") || query.includes("coal") || query.includes("grid")) {
      return `Prime Minister, solar generation is expanding exponentially. Our rooftop solar subsidy scheme is helping millions of households generate free electricity while taking load off coal-fired thermal grids.`;
    }
    if (query.includes("ev") || query.includes("electric") || query.includes("car") || query.includes("scooter") || query.includes("charge")) {
      return `Sir, the green mobility transition is crucial. We are funding public charging infrastructure and providing tax exemptions on electric two-wheelers to accelerate urban EV adoption.`;
    }
    if (query.includes("pollution") || query.includes("air") || query.includes("clean") || query.includes("water") || query.includes("smog")) {
      return `Prime Minister, combating metro air pollution is a high priority. We are mandating stricter industrial emission standards and establishing green buffer belts surrounding high-traffic cities.`;
    }
    return `Prime Minister, we are balancing high economic growth with carbon reduction targets. Supporting solar grids and EV networks is crucial to ensuring sustainable development for future generations.`;
  }

  // 11. Space & Technology Chief (Dr. Somnath)
  if (advisorId === "somnath") {
    if (query.includes("space") || query.includes("isro") || query.includes("satellite") || query.includes("rocket") || query.includes("moon")) {
      return `Prime Minister, ISRO is finalizing preparations for our manned Gaganyaan space mission and our national space station. Our satellite array is also delivering hyper-local weather models for our agricultural sectors.`;
    }
    if (query.includes("semiconductor") || query.includes("chip") || query.includes("fab") || query.includes("electronics")) {
      return `Sir, establishing national semiconductor design and fabrication plants is key to our tech sovereignty. Our central incentives have successfully attracted major international foundries to construct local fabs.`;
    }
    if (query.includes("ai") || query.includes("tech") || query.includes("software") || query.includes("startup") || query.includes("quantum")) {
      return `Prime Minister, our startup ecosystem is expanding. We are financing deep-tech hardware incubators and deploying secure, localized AI models to optimize administrative workflows and civic service delivery.`;
    }
    return `Prime Minister, technology and scientific self-reliance are our ultimate levers for progress. We are supporting local software clusters, deep-tech research, and aerospace innovations to build a digital India.`;
  }

  const nameMap: Record<string, string> = {
    nirmala: `Prime Minister, looking at our current National Treasury of ₹${gameState.treasury.toFixed(1)} Lakh Crore and inflation at ${gameState.inflation.toFixed(1)}%, we must exercise absolute fiscal discipline. Unchecked spending will lead to higher inflation, which we cannot afford.`,
    amit: `Sir, internal security and domestic harmony are paramount. With our current popularity at ${gameState.popularity.toFixed(1)}%, we must ensure that administrative reforms are carried out firmly and state police forces are fully equipped.`,
    jaishankar: `Prime Minister, in the current global climate, we must balance domestic demands with our geopolitical interests. Enhancing foreign trade and securing foreign direct investments remains our top diplomatic priority.`,
    rajnath: `Sir, defense preparedness along our borders cannot be compromised. Modernization of the armed forces and supporting 'Atmanirbhar Bharat' in defense manufacturing must go hand in hand.`,
    gadkari: `Prime Minister, infrastructure is the engine of our growth. Speeding up highway construction and optimizing tolls will directly lower our logistics costs and boost overall GDP growth.`,
    piyush: `Sir, to reach our economic goals, we must expand our export volume and accelerate railways modernization. The Vande Bharat networks must be scaled up to link key commerce hubs.`,
    dharmendra: `Prime Minister, our youth require modern skills and research opportunities. We should focus on establishing vocational labs and rolling out the National Education Policy swiftly.`,
    shivraj: `Sir, our farmers need direct support and assurance. Implementing micro-irrigation and strengthening crop insurance are vital to safeguarding the rural economy.`,
    nadda: `Prime Minister, expanding Ayushman Bharat public health insurance and building new clinics in rural sectors will ensure affordable medical care for all citizens.`,
    bhupendra: `Sir, balancing industrial growth with environmental standards is crucial. We must incentivize solar installations and support electric vehicle transitions in our major cities.`,
    somnath: `Prime Minister, space exploration and semiconductor manufacturing are the frontiers of self-reliance. Promoting local tech startups is critical for our digital sovereignty.`
  };
  return nameMap[advisorId] || "Prime Minister, I am currently reviewing the state files. We must coordinate carefully across departments to maintain a balanced and stable government.";
}

// Highly realistic local fallback responses for custom policies when API is experiencing high demand/downtime
function getLocalPolicyFallback(policyText: string, gameState: any) {
  const lowercase = policyText.toLowerCase();
  
  let policyName = "Pradhan Mantri Special Initiative";
  let description = `The government has announced a special initiative regarding: "${policyText}". Initial reports suggest cautious optimism across major urban and rural sectors.`;
  let fiscalCost = 0.5; // Lakh Crore
  let gdpGrowthImpact = 0.1;
  let inflationImpact = 0.05;
  let unemploymentImpact = -0.1;
  let popularityImpact = 2;
  const demographicsImpact = { farmers: 1, youth: 1, corporate: 1, middleClass: 1, rural: 1, urban: 1 };
  
  if (lowercase.includes("tax") || lowercase.includes("gst") || lowercase.includes("corporate")) {
    policyName = "National Revenue & Taxation Reforms Act";
    fiscalCost = -0.8; 
    gdpGrowthImpact = -0.1;
    inflationImpact = 0.1;
    popularityImpact = -2;
    demographicsImpact.corporate = -8;
    demographicsImpact.middleClass = -4;
    demographicsImpact.farmers = 2;
    demographicsImpact.rural = 1;
    description = `New taxation adjustments aimed at balancing the fiscal deficit have been implemented. Corporate lobbies have voiced concerns about the cost of business.`;
  } else if (lowercase.includes("farmer") || lowercase.includes("agriculture") || lowercase.includes("msp") || lowercase.includes("crop")) {
    policyName = "Krishi Vikas and PM-Kisan Samriddhi Yojana";
    fiscalCost = 1.2;
    gdpGrowthImpact = 0.15;
    inflationImpact = 0.2;
    unemploymentImpact = -0.15;
    popularityImpact = 5;
    demographicsImpact.farmers = 12;
    demographicsImpact.rural = 8;
    demographicsImpact.corporate = -2;
    description = `A major agricultural aid package was announced, expanding crop insurance and direct interest-free credit lines. Rural sectors erupted in celebration.`;
  } else if (lowercase.includes("infrastructure") || lowercase.includes("highway") || lowercase.includes("road") || lowercase.includes("rail") || lowercase.includes("bridge")) {
    policyName = "Pradhan Mantri National Infrastructure Gati-Shakti Corridor";
    fiscalCost = 1.8;
    gdpGrowthImpact = 0.4;
    inflationImpact = 0.15;
    unemploymentImpact = -0.3;
    popularityImpact = 4;
    demographicsImpact.urban = 6;
    demographicsImpact.corporate = 8;
    demographicsImpact.middleClass = 3;
    description = `An ambitious logistics upgrade program has been launched, connecting industrial zones with modern expressways. Employment in logistics has surged.`;
  } else if (lowercase.includes("education") || lowercase.includes("student") || lowercase.includes("school") || lowercase.includes("college") || lowercase.includes("skill")) {
    policyName = "Rashtriya Shiksha and Skill-Dev Upgradation Mission";
    fiscalCost = 0.9;
    gdpGrowthImpact = 0.2;
    unemploymentImpact = -0.4;
    popularityImpact = 4;
    demographicsImpact.youth = 10;
    demographicsImpact.middleClass = 5;
    description = `The ministry announced a massive funding increase for vocational laboratories and modern school curricula, bringing wide relief to the youth.`;
  } else if (lowercase.includes("military") || lowercase.includes("defense") || lowercase.includes("army") || lowercase.includes("border") || lowercase.includes("cyber")) {
    policyName = "National Security & Border Shield Upgradation";
    fiscalCost = 1.5;
    gdpGrowthImpact = 0.1;
    unemploymentImpact = -0.1;
    popularityImpact = 3;
    demographicsImpact.middleClass = 4;
    description = `Procurement of advanced defense hardware and border infrastructure reinforcements has begun under self-reliant manufacturing parameters.`;
  } else if (lowercase.includes("space") || lowercase.includes("isro") || lowercase.includes("satellite") || lowercase.includes("tech") || lowercase.includes("ai")) {
    policyName = "Gaganyaan & National Deep-Tech Innovation Initiative";
    fiscalCost = 0.7;
    gdpGrowthImpact = 0.3;
    unemploymentImpact = -0.2;
    popularityImpact = 3;
    demographicsImpact.youth = 6;
    demographicsImpact.corporate = 7;
    description = `A new sovereign semiconductor design seed fund and aerospace program were authorized, marking a milestone in tech-independence.`;
  }

  return {
    policyName,
    description,
    fiscalCost,
    gdpGrowthImpact,
    inflationImpact,
    unemploymentImpact,
    popularityImpact,
    demographicsImpact,
    advisorReactions: [
      { advisorId: "nirmala", name: "Smt. Nirmala Shastry", quote: "We must ensure this does not stretch our fiscal balance sheet too thin, Prime Minister." },
      { advisorId: "amit", name: "Shri Amit Dev", quote: "Our department will verify that implementation runs smoothly without any internal bottlenecks." },
      { advisorId: "somnath", name: "Dr. S. Somnath Roy", quote: "This is a step in the right direction. Direct research and infrastructure upgrades yield high multiplier effects." }
    ]
  };
}

// API Routes

// Endpoint 1: Consult an Advisor (Supports Interactive Two-Way Conversation)
app.post("/api/game/advisor", async (req, res) => {
  try {
    const { advisorId, gameState, messages } = req.body;
    if (!advisorId || !gameState) {
      return res.status(400).json({ error: "Missing advisorId or gameState" });
    }

    const userQuery = messages && messages.length > 0 ? messages[messages.length - 1].text : "";

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using local advisor fallback response.");
      const fallbackAdvice = getLocalAdvisorFallback(advisorId, gameState, userQuery);
      return res.json({ advice: fallbackAdvice });
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
1. ALWAYS prefix your response with a highly detailed, realistic thinking and understanding process wrapped in <thinking>...</thinking> XML tags. This block represents your internal, unvarnished cognitive reasoning as a policy architect.
2. Inside the <thinking>...</thinking> block, perform a concise but deep cognitive analysis of the Prime Minister's prompt:
   - Critically evaluate the financial cost and impact on your department (e.g. Budget/Revenue, Law & Order, Defence procurement) referencing actual values like Treasury (₹${gameState.treasury.toFixed(1)} L Cr) and GDP Growth (+${gameState.gdpGrowth.toFixed(1)}%).
   - Evaluate public approval, noting specific gains or risks for targeted demographics (Farmers: ${gameState.demographics.farmers}%, Youth: ${gameState.demographics.youth}%, Corporate: ${gameState.demographics.corporate}%, Middle Class: ${gameState.demographics.middleClass}%, Rural: ${gameState.demographics.rural}%, Urban: ${gameState.demographics.urban}%).
   - If other ministers have already spoken in this debate (indicated by transcripts like "[Minister Name]: Speech..."), assess their arguments. Note where your portfolio interests clash (e.g., Agriculture's demand for subsidies vs. Finance's fiscal deficit constraints, or Infrastructure's capital needs vs. Environment's carbon limits) and formulate a calculated strategic counter-response or compromise posture.
3. AFTER the </thinking> closing tag, write your direct spoken dialogue responding to the Prime Minister. Always address the user directly as "Prime Minister" or "Sir".
4. Stay completely in-character according to your portfolio, focus, and tone. Be helpful, concise, and direct. Your direct spoken dialogue MUST be 2-4 sentences maximum. Do not use markdown headers, lists, or bullets in the spoken dialogue. Maintain a natural, conversational tone. Acknowledge and politely challenge or support preceding ministers if appropriate to simulate realistic cabinet decision-making.`;

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

    try {
      const response = await callWithRetry(() => 
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
          }
        })
      );
      res.json({ advice: response.text });
    } catch (apiError: any) {
      console.warn("Advisor Gemini API failed (using robust local fallback):", apiError.message || apiError);
      const fallbackAdvice = getLocalAdvisorFallback(advisorId, gameState, userQuery);
      res.json({ advice: fallbackAdvice });
    }
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

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using local custom policy fallback response.");
      const fallbackPolicy = getLocalPolicyFallback(policyText, gameState);
      return res.json(fallbackPolicy);
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

    try {
      const response = await callWithRetry(() => 
        ai.models.generateContent({
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
        })
      );
      const parsedData = JSON.parse(response.text.trim());
      res.json(parsedData);
    } catch (apiError: any) {
      console.warn("Custom policy Gemini API failed (using robust local fallback):", apiError.message || apiError);
      const fallbackPolicy = getLocalPolicyFallback(policyText, gameState);
      res.json(fallbackPolicy);
    }
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

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using local news flash fallback response.");
      return res.json({ headlines: [
        `BREAKING: Parliament session resumes to discuss national developmental goals.`,
        `MARKET UPDATE: Sensex fluctuates amid local fiscal budget discussions.`,
        `WEATHER UPDATE: Indian Meteorological Department issues regional rainfall outlook.`
      ]});
    }

    const ai = getAi();
    
    const prompt = `You are a major national news anchor in India (e.g., DD News or NDTV style).
Generate 3 distinct, highly realistic news flash tickers/headlines reflecting this current state:
- GDP Growth: ${gameState.gdpGrowth.toFixed(1)}%, Inflation: ${gameState.inflation.toFixed(1)}%, Unemployment: ${gameState.unemployment.toFixed(1)}%
- Popularity: ${gameState.popularity.toFixed(1)}%
- Active Crises: ${gameState.activeEvents?.join(", ") || 'None'}
- Year/Month: ${gameState.year} ${gameState.month}

Return a JSON array of strings containing 3 distinct ticker headlines. Make them sound urgent, realistic, and highly relevant to India (mentioning places like New Delhi, Mumbai, Bengaluru, or rural sectors).`;

    const response = await callWithRetry(() => 
      ai.models.generateContent({
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
      })
    );

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
