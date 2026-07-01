/**
 * Highly realistic context-aware client-side fallback engines for Lok Sabha Cabinet Simulator.
 * Allows the game to be completely playable and functional as a high-quality simulation
 * on static deployment environments like GitHub Pages where a Node backend is not available.
 */

export function getLocalAdvisorFallback(advisorId: string, gameState: any): string {
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

export interface SimulatedPolicyResult {
  policyName: string;
  description: string;
  fiscalCost: number;
  gdpGrowthImpact: number;
  inflationImpact: number;
  unemploymentImpact: number;
  popularityImpact: number;
  demographicsImpact: {
    farmers: number;
    youth: number;
    corporate: number;
    middleClass: number;
    rural: number;
    urban: number;
  };
  advisorReactions: Array<{
    advisorId: string;
    name: string;
    quote: string;
  }>;
}

export function getLocalPolicyFallback(policyText: string, gameState: any): SimulatedPolicyResult {
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
      { advisorId: "nirmala", name: "Smt. Nirmala Shastry", quote: `Our department will adjust the national ledger for a change of ₹${fiscalCost > 0 ? '+' : ''}${fiscalCost.toFixed(2)} Lakh Crore.` },
      { advisorId: "amit", name: "Shri Amit Dev", quote: "Law enforcement channels stand ready to secure public compliance and safety during rollout." },
      { advisorId: "somnath", name: "Dr. S. Somnath Roy", quote: "Implementing this policy utilizing standard data systems and local administration channels is recommended." }
    ]
  };
}

export function getLocalNewsFallback(gameState: any): string[] {
  const headlines: string[] = [];

  // Dynamic GDP headline
  if (gameState.gdpGrowth > 8.0) {
    headlines.push(`ECONOMIC EXPLOSION: India's GDP growth hits a staggering ${gameState.gdpGrowth.toFixed(1)}%, leading major global powers.`);
  } else if (gameState.gdpGrowth < 4.5) {
    headlines.push(`GROWTH WATCH: Economic activity cools down with GDP growth decelerating to ${gameState.gdpGrowth.toFixed(1)}%.`);
  } else {
    headlines.push(`MARKET UPDATE: Nifty and Sensex hold steady as GDP growth settles in a healthy ${gameState.gdpGrowth.toFixed(1)}% range.`);
  }

  // Dynamic Inflation headline
  if (gameState.inflation > 6.5) {
    headlines.push(`CONSUMER ALERT: Retail inflation rises to ${gameState.inflation.toFixed(1)}% on food price spikes; markets expect RBI action.`);
  } else if (gameState.inflation < 3.8) {
    headlines.push(`PRICE RELIEF: Retail inflation drops to a comfortable ${gameState.inflation.toFixed(1)}%, boosting purchasing power.`);
  } else {
    headlines.push(`FISCAL INSIGHTS: CPI Inflation stable at ${gameState.inflation.toFixed(1)}% as wholesale food arrivals match demand.`);
  }

  // Dynamic Popularity headline
  if (gameState.popularity > 70) {
    headlines.push(`MEGA SURVEY: Ruling Cabinet's approval rating hits an historic high of ${gameState.popularity.toFixed(1)}% nationwide.`);
  } else if (gameState.popularity < 45) {
    headlines.push(`POLITICAL CROSSWINDS: Cabinet under pressure from state coalition lobbies as approval dips to ${gameState.popularity.toFixed(1)}%.`);
  } else {
    headlines.push(`SANSAD DIALOGUE: Opposition and ruling party lock horns over developmental outlays; popularity holds at ${gameState.popularity.toFixed(1)}%.`);
  }

  // Focus-based or general default
  if (gameState.currentFocus === "Infrastructure") {
    headlines.push(`INFRA FOCUS: Cabinet speed-tracks construction of green expressway corridors and smart freight yards.`);
  } else if (gameState.currentFocus === "Welfare") {
    headlines.push(`WELFARE OUTLOOK: PM's direct benefit disbursements show high multiplier effect in rural state polls.`);
  } else {
    headlines.push(`SPECIAL SESSION: Parliament convenes to discuss digital governance frameworks and cooperative federalism.`);
  }

  return headlines.slice(0, 3); // Return exactly 3 relevant headlines
}
