/**
 * Highly realistic context-aware client-side fallback engines for Lok Sabha Cabinet Simulator.
 * Allows the game to be completely playable and functional as a high-quality simulation
 * on static deployment environments like GitHub Pages where a Node backend is not available.
 */

export function getLocalAdvisorFallback(advisorId: string, gameState: any, userQuery?: string): string {
  const query = (userQuery || "").toLowerCase();

  // 1. Finance Minister (Nirmala Shastry)
  if (advisorId === "nirmala") {
    if (query.includes("tax") || query.includes("gst") || query.includes("slab") || query.includes("corporate") || query.includes("income") || query.includes("revenue")) {
      return `Prime Minister, adjusting tax slabs or GST rates is a double-edged sword. While it could bolster our national Treasury of ₹${gameState.treasury.toFixed(1)} Lakh Crore, higher tax burdens might depress private corporate investments and anger the middle class (+${gameState.demographics.middleClass}% approval).`;
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
      return `Sir, we have simplified multiple commercial laws and set up a single-window portal to boost corporate confidence. Corporate approval stands at ${gameState.demographics.corporate}%, showing strong business optimism.`;
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
    return `Prime Minister, educational and skill-development reforms are progressing. We are focused on updating academic curricula and expanding vocational centers to prepare our youth (${gameState.demographics.youth}% approval) for the future.`;
  }

  // 8. Agriculture Minister (Shri Shivraj)
  if (advisorId === "shivraj") {
    if (query.includes("farmer") || query.includes("kisan") || query.includes("agriculture") || query.includes("crop") || query.includes("farming")) {
      return `Prime Minister, our kisans require steady support. We are ensuring the timely distribution of fertilizer subsidies and expanding access to interest-free agricultural credit (Farmer approval: ${gameState.demographics.farmers}%).`;
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

  // 12. Fallback default
  return "Prime Minister, I am currently reviewing our departmental data. We must coordinate closely across all ministries to maintain economic stability (+${gameState.gdpGrowth.toFixed(1)}% GDP growth) and secure our national borders.";
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
