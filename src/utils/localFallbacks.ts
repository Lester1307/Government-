/**
 * Highly realistic context-aware client-side fallback engines for Lok Sabha Cabinet Simulator.
 * Allows the game to be completely playable and functional as a high-quality simulation
 * on static deployment environments like GitHub Pages where a Node backend is not available.
 */

export function getLocalAdvisorFallback(advisorId: string, gameState: any, userQuery?: string): string {
  const query = (userQuery || "").toLowerCase();
  
  // Deterministic randomize helper based on query content and game month
  const getRandomItem = (arr: string[]) => {
    let sum = 0;
    for (let i = 0; i < query.length; i++) {
      sum += query.charCodeAt(i);
    }
    const seed = sum + (gameState.month ? gameState.month.length : 12);
    const index = Math.abs(seed) % arr.length;
    return arr[index];
  };

  let thinking = "";
  let spoken = "";

  // 1. Finance Minister (Smt. Nirmala Shastry)
  if (advisorId === "nirmala") {
    if (query.includes("tax") || query.includes("gst") || query.includes("slab") || query.includes("corporate") || query.includes("income") || query.includes("revenue")) {
      thinking = `Analyzing fiscal revenue models. Current national Treasury is ₹${gameState.treasury.toFixed(1)} L Cr. GDP growth is steady at +${gameState.gdpGrowth.toFixed(1)}%. Increasing tax slabs will depress corporate investments (Corporate: ${gameState.demographics.corporate}%) and irritate the middle class (${gameState.demographics.middleClass}%), whereas lowering taxes will expand the fiscal deficit. Strategic focus must be on tax base compliance.`;
      spoken = getRandomItem([
        `Prime Minister, adjusting tax slabs or GST rates is a double-edged sword. While it could bolster our national Treasury of ₹${gameState.treasury.toFixed(1)} Lakh Crore, higher tax burdens might depress private corporate investments and anger the middle class (+${gameState.demographics.middleClass}% approval).`,
        `Sir, tweaking corporate and income tax structures is complex. We must protect our current GDP growth of +${gameState.gdpGrowth.toFixed(1)}% while ensuring our liquid Treasury stays healthy to finance capital investments.`,
        `PM Sahib, any sudden upward alteration in direct tax brackets will invite severe pushback from corporate lobbies. We must proceed cautiously and focus on expanding the tax base rather than raising tax rates.`
      ]);
    } else if (query.includes("gdp") || query.includes("growth") || query.includes("recession") || query.includes("economy")) {
      thinking = `Evaluating macroeconomic growth. GDP growth rate stands at +${gameState.gdpGrowth.toFixed(1)}%. Inflation is ${gameState.inflation.toFixed(1)}%. To accelerate growth sustainably, we must focus resources on high-multiplier asset creation (expressways, freight rails, smart grids) and curb unproductive recurring populist transfer credits.`;
      spoken = getRandomItem([
        `Sir, our current GDP growth stands at +${gameState.gdpGrowth.toFixed(1)}%. To accelerate this sustainably, we must increase high-quality capital expenditure rather than expanding recurring populist subsidies, which leads to fiscal slippage.`,
        `Prime Minister, keeping our growth rate robust requires bolstering our manufacturing capacity. We should facilitate ease of capital access and prioritize Gati-Shakti transport hubs to boost trade efficiency.`,
        `Sir, the Indian economy is fundamentally sound. Our core target is maintaining double-digit nominal growth. Reducing compliance bottlenecks and supporting credit lines for MSMEs will yield the highest returns.`
      ]);
    } else if (query.includes("inflation") || query.includes("price") || query.includes("cost") || query.includes("petrol") || query.includes("diesel")) {
      thinking = `Reviewing consumer price index pressure. Current inflation is at ${gameState.inflation.toFixed(1)}%. Fuel and crop costs directly impact Middle Class (${gameState.demographics.middleClass}%) and Rural (${gameState.demographics.rural}%) voter pools. Collaborating with RBI on open market liquidity operations and adjusting customs duties on food imports.`;
      spoken = getRandomItem([
        `Prime Minister, inflation is currently at ${gameState.inflation.toFixed(1)}%. We are working in close tandem with the RBI to manage systemic liquidity, but we must also address supply-side logistics bottlenecks to bring permanent relief to consumers.`,
        `Sir, fuel and food price stabilization is our top concern. We must adjust custom duties on raw materials and improve cold-chain transit systems to shield the lower income segments from price spikes.`,
        `PM Sahib, to manage our inflation of ${gameState.inflation.toFixed(1)}%, our department advises against raising fuel excise duties. We need to maintain stable transport costs to prevent cascading retail prices.`
      ]);
    } else if (query.includes("deficit") || query.includes("debt") || query.includes("borrow") || query.includes("spending") || query.includes("treasury") || query.includes("fund") || query.includes("money")) {
      thinking = `Reviewing public debt sustainability. National Treasury has ₹${gameState.treasury.toFixed(1)} L Cr. High borrowing risks driving up sovereign bond yields. Restricting non-essential revenue outlays.`;
      spoken = getRandomItem([
        `Sir, our liquid Treasury stands at ₹${gameState.treasury.toFixed(1)} Lakh Crore. We must exercise absolute fiscal discipline and resist calls for unbudgeted expenditures, otherwise we risk widening the fiscal deficit and driving inflation.`,
        `Prime Minister, fiscal prudence is our strongest shield against global credit downgrades. Sourcing non-tax revenues and implementing targeted subsidy transfers will help preserve our ₹${gameState.treasury.toFixed(1)} L Cr reserves.`,
        `Sir, while social outlays are necessary, maintaining a sustainable debt-to-GDP ratio is non-negotiable. I recommend that any new spending packages be strictly linked to immediate growth-generating assets.`
      ]);
    } else if (query.includes("job") || query.includes("unemployment") || query.includes("employment") || query.includes("work")) {
      thinking = `Analyzing unemployment metric, currently at ${gameState.unemployment.toFixed(1)}%. Youth approval sits at ${gameState.demographics.youth}%. Need massive push in textiles, footwear, electronic assemblies, and construction to absorb rural labor.`;
      spoken = getRandomItem([
        `Prime Minister, to tackle the unemployment rate of ${gameState.unemployment.toFixed(1)}%, our upcoming budget will incentivize labor-intensive manufacturing sectors and expand credit guarantees for small MSMEs.`,
        `Sir, youth skills development is critical to harness our demographic dividend. We are collaborating with international tech partners to establish advanced engineering workshops in tier-2 hubs.`,
        `PM Sahib, job creation requires robust private investments. By simplifying regulatory permissions and expanding the PLI schemes, we can encourage major corporate entities to rapidly scale up hiring.`
      ]);
    } else {
      thinking = `General briefing on fiscal health. Treasury is ₹${gameState.treasury.toFixed(1)} L Cr. GDP growth is +${gameState.gdpGrowth.toFixed(1)}%. Inflation is ${gameState.inflation.toFixed(1)}%. Unifying cabinet strategies for national advancement.`;
      spoken = getRandomItem([
        `Prime Minister, regarding your inquiry, our department is running a complete audit. With our Treasury at ₹${gameState.treasury.toFixed(1)} L Cr, any fiscal changes must protect GDP growth (+${gameState.gdpGrowth.toFixed(1)}%) while keeping inflation (${gameState.inflation.toFixed(1)}%) under tight control.`,
        `Sir, the Ministry of Finance is monitoring all sector allocations closely. We must ensure that our capital outlays continue to empower rural infrastructure while preserving macroeconomic stability.`,
        `PM Sahib, as we head into this cycle, balancing development goals with financial resilience is key. I am preparing a comprehensive briefing paper for our next Cabinet committee meeting.`
      ]);
    }
  }

  // 2. Home Affairs Minister (Shri Amit Dev)
  else if (advisorId === "amit") {
    if (query.includes("police") || query.includes("force") || query.includes("security") || query.includes("riot") || query.includes("crime") || query.includes("law") || query.includes("order") || query.includes("safety")) {
      thinking = `Reviewing law enforcement metrics and public order. Urban approval is ${gameState.demographics.urban}%, Rural approval is ${gameState.demographics.rural}%. Police modernization, digital forensic laboratories, and tactical gear procurement are required to prevent civic riots and lower crime indices.`;
      spoken = getRandomItem([
        `Sir, police modernization remains our department's highest priority. We must ensure state police forces are fully equipped with advanced tactical communication gear and crowd-control training to secure domestic peace.`,
        `Prime Minister, public safety is paramount. We are rolling out a nationwide digital crime-reporting grid to speed up emergency responses and suppress organized crime syndicates.`,
        `Sir, we are funding state-level cyber-forensic units to combat digital fraud. Safe streets are the bedrock of economic activity, and we will not permit any disruption to public order.`
      ]);
    } else if (query.includes("state") || query.includes("border") || query.includes("friction") || query.includes("coalition") || query.includes("opposition") || query.includes("election")) {
      thinking = `Assessing federal-state coordination. Our general popularity is ${gameState.popularity.toFixed(1)}%. State elections approaching. Managing coordination with coalition partners while asserting federal authority over law enforcement in troubled zones.`;
      spoken = getRandomItem([
        `Prime Minister, local state administrations require cooperative federalism, but we will not compromise on national integrity. Regional political factions must respect federal laws, or face firm administrative responses.`,
        `Sir, state-border integration is progressing. We are coordinating closely with border state governors to upgrade logistics checkposts while maintaining strict surveillance against illegal trade corridors.`,
        `PM Sahib, electoral security preparation is complete. We have deployed Central Armed Police Forces in sensitive districts to ensure peaceful, free, and completely democratic polling environments.`
      ]);
    } else if (query.includes("terror") || query.includes("extremis") || query.includes("kashmir") || query.includes("naxal") || query.includes("maoist")) {
      thinking = `Reviewing anti-terror operations. Zero-tolerance policy is in place. Security indices are improving. Deep forest operations in central India and intelligence grids in sensitive zones are active.`;
      spoken = getRandomItem([
        `Sir, our stance is zero-tolerance. Central security agencies are conducting precise, intelligence-led operations to dismantle extremist networks and ensure complete stability in sensitive border and forest zones.`,
        `Prime Minister, our security forces have successfully neutralized several major cross-border infiltrations. We are maintaining a high operational tempo to completely wipe out extremist hideouts.`,
        `Sir, deep-rooted intelligence networks have preempted several major security threats. The security of every citizen is our absolute commitment.`
      ]);
    } else {
      thinking = `General briefing on domestic affairs. Public approval stands at ${gameState.popularity.toFixed(1)}%. Internal security grid is fully alert. Strategic policing reforms are under implementation.`;
      spoken = getRandomItem([
        `Prime Minister, internal security is stable and under control. With our national popularity at ${gameState.popularity.toFixed(1)}%, our intelligence grid is fully alert. We will continue to maintain firm administrative law to support development.`,
        `Sir, the Ministry of Home Affairs is coordinating seamlessly with all state police directors. We are prepared to manage any contingency and secure public peace.`,
        `PM Sahib, domestic stability is solid. We have reinforced surveillance grids across all major industrial clusters to ensure smooth economic functioning.`
      ]);
    }
  }

  // 3. External Affairs Minister (Dr. S. Jaishankar Prasad)
  else if (advisorId === "jaishankar") {
    if (query.includes("china") || query.includes("border") || query.includes("pakistan") || query.includes("lac") || query.includes("loc") || query.includes("neighbor")) {
      thinking = `Formulating regional diplomatic postures. Countering territorial expansionism. Border infrastructure must be paired with trade counter-measures. Strategic multi-alignment allows us to navigate neighbor-state pressures.`;
      spoken = getRandomItem([
        `Prime Minister, our diplomatic stance is resolute: peace and tranquility at our borders are non-negotiable prerequisites for normalized bilateral relations. We are actively countering expansionism while maintaining structured diplomatic dialogues.`,
        `Sir, we are making it clear to global forums that territorial sovereignty is absolute. Our diplomatic missions are successfully isolating hostile neighbors on multilateral platforms.`,
        `PM Sahib, we are reinforcing our strategic partnerships with global powers to build a robust deterrent ring around our land and maritime borders.`
      ]);
    } else if (query.includes("usa") || query.includes("america") || query.includes("russia") || query.includes("europe") || query.includes("global") || query.includes("un") || query.includes("world")) {
      thinking = `Navigating superpower rivalry. Strategic autonomy must be maintained. Current GDP is ₹${gameState.gdp.toFixed(1)} L Cr. Balancing Western high-tech cooperation with traditional defense and energy partnerships.`;
      spoken = getRandomItem([
        `Sir, India's foreign policy is anchored in strategic autonomy. We maintain productive, multi-aligned relations with both Western nations and traditional partners to secure our own energy and technology interests first.`,
        `Prime Minister, our voice is highly respected in Washington, Moscow, and Brussels alike. We do not choose sides; we choose India's sovereign interest in every international vote.`,
        `Sir, our diplomatic strategy has positioned India as a crucial, indispensable swing power in the Indo-Pacific region, yielding massive strategic leverage.`
      ]);
    } else if (query.includes("fdi") || query.includes("investment") || query.includes("trade") || query.includes("export") || query.includes("tariff") || query.includes("import")) {
      thinking = `Driving trade diplomacy. Current GDP growth: +${gameState.gdpGrowth.toFixed(1)}%. Corporate approval: ${gameState.demographics.corporate}%. Pitching India as the preeminent global manufacturing alternative ("China+1" policy). Negotiating bilateral Free Trade Agreements (FTAs).`;
      spoken = getRandomItem([
        `Prime Minister, expanding trade access and attracting foreign direct investments are top priorities. We are engaging global industrial leaders to present India as the premier resilient alternative in global high-tech supply chains.`,
        `Sir, we are negotiating comprehensive free-trade agreements with European and Middle Eastern partners to slash tariffs on Indian engineering and textile exports.`,
        `PM Sahib, our embassies are active in showcasing India's digital public infrastructure and stable business policies to attract major long-term sovereign wealth funds.`
      ]);
    } else {
      thinking = `Evaluating overall geopolitical alignment. India's global influence is rising. Leveraging multilateral platforms (G20, Quad, BRICS) to anchor our leadership in the Global South.`;
      spoken = getRandomItem([
        `Prime Minister, our diplomatic missions are actively advancing India's national interest. We are navigating complex geopolitical alignments to secure trade agreements that directly support our GDP growth of +${gameState.gdpGrowth.toFixed(1)}%.`,
        `Sir, India's geopolitical clout is at an all-time high. The global community recognizes that no major international challenge—from climate finance to digital public goods—can be resolved without New Delhi.`,
        `PM Sahib, I am preparing for the upcoming international summit. We will champion the interests of developing economies while securing our domestic tech and food supply chains.`
      ]);
    }
  }

  // 4. Defence Minister (General Rajnath Singh)
  else if (advisorId === "rajnath") {
    if (query.includes("army") || query.includes("navy") || query.includes("air") || query.includes("military") || query.includes("weapon") || query.includes("soldier") || query.includes("force")) {
      thinking = `Assessing combat readiness and military modernization. Coordinating with armed forces chiefs. Procuring next-generation fighters, missile systems, and submarines. Ensuring border security is robust.`;
      spoken = getRandomItem([
        `Sir, our armed forces are in a state of high combat readiness. We are speeding up procurement of next-generation fighter aircraft and stealth submarines to safeguard our maritime and territorial sovereignty.`,
        `Prime Minister, our strike divisions are fully prepared for any emergency. We are reinforcing border sensor grids and upgrading tactical missile defense nets to guard against multi-front surprises.`,
        `Sir, we have finalized a series of joint combat drills to test our tri-services integration. Our forces are highly motivated and possess overwhelming retaliatory capabilities.`
      ]);
    } else if (query.includes("atmanirbhar") || query.includes("indigenous") || query.includes("domestic") || query.includes("drdo") || query.includes("make") || query.includes("manufacture")) {
      thinking = `Shifting defense acquisitions to domestic defense corridors in UP and TN. Supporting MSMEs in high-tech defense hardware. Aiming to cut foreign arms import bills.`;
      spoken = getRandomItem([
        `Prime Minister, defense self-reliance is vital. We are actively shifting defense acquisitions to domestic private and public vendors, aiming to build a self-sustaining defense manufacturing base that reduces import costs.`,
        `Sir, our 'Make in India' defense initiative is breaking records. We are exporting high-tech radar and missile systems to friendly nations, proving that our domestic design capabilities are world-class.`,
        `PM Sahib, our state-of-the-art defense corridors are attracting massive aerospace investments, boosting youth technical skills (+${gameState.demographics.youth}% approval).`
      ]);
    } else if (query.includes("cyber") || query.includes("space") || query.includes("threat") || query.includes("intelligence")) {
      thinking = `Reviewing multi-domain hybrid warfare challenges. Cyber commands must safeguard electrical grids, space assets, and banking databases from state-sponsored malware arrays.`;
      spoken = getRandomItem([
        `Sir, modern battles are multi-domain. We have operationalized dedicated Cyber and Space defense commands to shield our critical infrastructure from state-sponsored cyber offensives.`,
        `Prime Minister, electronic and space security is being treated as a high-alert domain. We are coordinating with local tech startups to design military-grade encryption systems.`,
        `Sir, cyber-security exercises are complete. Our strategic satellite network is fully insulated from external interference.`
      ]);
    } else {
      thinking = `General briefing on defence readiness. National borders are secure. Arms production is expanding. Tri-services synergy is at an all-time high.`;
      spoken = getRandomItem([
        `Prime Minister, the nation's defense shield is secure. We are modernizing our divisions and supporting 'Atmanirbhar Bharat' in defense production to counter multi-front strategic challenges.`,
        `Sir, we are maintaining strict vigilance along our entire border. Our response mechanisms are highly agile, and we are modernizing our logistics supply paths.`,
        `PM Sahib, our military-industrial complex is expanding. By utilizing dual-use technology, we are strengthening both our national security and our industrial base.`
      ]);
    }
  }

  // 5. Infrastructure Minister (Shri Nitin Gokhale)
  else if (advisorId === "gadkari") {
    if (query.includes("highway") || query.includes("road") || query.includes("expressway") || query.includes("path") || query.includes("construction")) {
      thinking = `Highway building is the ultimate economic multiplier. Boosting GDP growth (+${gameState.gdpGrowth.toFixed(1)}%). Constructing economic corridors, high-speed road paths, and state-border expressways.`;
      spoken = getRandomItem([
        `Prime Minister, highway construction is running at record speed. We are building 10,000 km of new green expressways to link farm and factory nodes, which will boost GDP growth (+${gameState.gdpGrowth.toFixed(1)}%) across all states.`,
        `Sir, we are constructing state-of-the-art economic road corridors. This high-density highway grid will accelerate commerce and unlock land value across hundreds of rural towns.`,
        `PM Sahib, our road construction rate has hit 40 kilometers per day. This is directly generating lakhs of construction jobs and lifting rural household incomes.`
      ]);
    } else if (query.includes("toll") || query.includes("fee") || query.includes("gps") || query.includes("fastag")) {
      thinking = `Transitioning to satellite GPS tolling. Reducing logistics bottlenecks. Aiming to increase toll revenues while saving thousands of crores in truck idling fuel.`;
      spoken = getRandomItem([
        `Sir, we are transitioning to satellite-based GPS tolling, which will eliminate physical toll plazas entirely. This will save thousands of crores in fuel waste and logistics transit delays annually.`,
        `Prime Minister, automated barrierless tolling is under pilot test. This will allow vehicles to zip through highway corridors without halting, boosting fuel efficiency and logistics speed.`,
        `Sir, the FASTag system is generating steady non-tax revenues. We are investing these funds directly into backward regional road connectivity projects.`
      ]);
    } else if (query.includes("logistics") || query.includes("cost") || query.includes("freight") || query.includes("truck") || query.includes("transport")) {
      thinking = `Logistics cost reduction is non-negotiable to compete with East Asia. Lowering logistics drag from 14% of GDP to under 9%. Setting up multi-modal cargo parks.`;
      spoken = getRandomItem([
        `Prime Minister, our goal is to lower India's logistics costs from 14% of GDP to under 9%. This structural shift will make our domestic manufacturing exports highly competitive on the global stage.`,
        `Sir, by constructing multi-modal logistics parks at key rail-road intersections, we are slashing warehouse transfer delays and boosting cargo speeds.`,
        `PM Sahib, reducing freight transport friction is the best support we can offer to our corporate and small exporting MSME sectors.`
      ]);
    } else {
      thinking = `General briefing on infrastructure. Unlocking economic prosperity via Gati-Shakti grids. Financing projects through non-budgetary PPP models.`;
      spoken = getRandomItem([
        `Prime Minister, high-speed infrastructure is the primary engine of India's growth. We are focused on removing bureaucratic bottlenecks to accelerate expressway and logistics terminal completions.`,
        `Sir, our infrastructure projects are running in full gear. We are actively utilizing asset monetization to secure capital, ensuring we don't drain our liquid Treasury (₹${gameState.treasury.toFixed(1)} L Cr).`,
        `PM Sahib, connecting rural agricultural districts to main ports is our primary focus. High-quality roads represent India's future prosperity.`
      ]);
    }
  }

  // 6. Railways & Commerce Minister (Shri Piyush Shrivastava)
  else if (advisorId === "piyush") {
    if (query.includes("rail") || query.includes("train") || query.includes("vande") || query.includes("bullet") || query.includes("station") || query.includes("track")) {
      thinking = `Modernizing rail network. Rolling out Vande Bharat, Amrit Bharat fleets. Expanding dedicated freight corridors to move coal, steel, and agricultural cargo at high speeds.`;
      spoken = getRandomItem([
        `Prime Minister, railways modernization is on track. We are rolling out Vande Bharat and Amrit Bharat fleets weekly, and our high-capacity dedicated freight corridors are reducing industrial transit times by 40%.`,
        `Sir, we are redeveloping hundreds of major railway stations under the Amrit Bharat scheme, providing world-class travel amenities to our middle-class commuters.`,
        `PM Sahib, the high-speed bullet train track work is progressing at double-speed. This will establish high-tech regional growth clusters along the entire route.`
      ]);
    } else if (query.includes("export") || query.includes("trade") || query.includes("import") || query.includes("msme") || query.includes("tariff") || query.includes("commerce")) {
      thinking = `Boosting export volumes. Aiming for $1 Trillion in merchandise exports. Easing trade barriers and helping small businesses access global buyers.`;
      spoken = getRandomItem([
        `Sir, we are targeting $1 Trillion in merchandise exports by expanding trade promotion offices in strategic global capitals and easing credit access for exporting MSMEs.`,
        `Prime Minister, our export promotion councils are seeing strong international demands. We are slashing red-tape barriers to make export clearance completely online and instantaneous.`,
        `PM Sahib, domestic trade is expanding. Our digital e-commerce network (ONDC) is helping rural artisans and small shops sell directly to urban buyers without middleman cuts.`
      ]);
    } else if (query.includes("industry") || query.includes("factory") || query.includes("manufacturing") || query.includes("production") || query.includes("pli")) {
      thinking = `Industrial growth index must be elevated. PLI schemes are attracting manufacturing lines. Elevating Corporate approval (${gameState.demographics.corporate}%).`;
      spoken = getRandomItem([
        `Prime Minister, domestic manufacturing is gaining immense momentum. Our Production Linked Incentive (PLI) schemes have successfully brought international electronic and solar assembly lines directly to Indian soil.`,
        `Sir, we are establishing multi-state industrial townships equipped with pre-cleared environmental permits to allow corporates to setup factories instantly.`,
        `PM Sahib, the manufacturing sector is crucial for absorbing our young labor force. We are seeing major private investments in chip assemblies and clean energy equipment.`
      ]);
    } else {
      thinking = `General commerce and transit review. GDP growth: +${gameState.gdpGrowth.toFixed(1)}%. Ensuring business confidence remains high.`;
      spoken = getRandomItem([
        `Prime Minister, railways and domestic commerce are performing steadily. We are expanding trade channels and modernizing cargo transit systems to maintain strong momentum in our GDP growth (+${gameState.gdpGrowth.toFixed(1)}%).`,
        `Sir, our domestic commercial index is reflecting strong business optimism. We are working closely with the finance ministry to support industrial growth.`,
        `PM Sahib, our railway freight volumes have hit historic highs this quarter. This indicates that industrial output and domestic demand are extremely robust.`
      ]);
    }
  }

  // 7. Education Minister (Shri Dharmendra Prasad)
  else if (advisorId === "dharmendra") {
    if (query.includes("school") || query.includes("college") || query.includes("education") || query.includes("nep") || query.includes("university")) {
      thinking = `Rolling out National Education Policy (NEP). Focusing on skill integration, mother-tongue primary learning, and upgrading universities. High youth approval (${gameState.demographics.youth}%).`;
      spoken = getRandomItem([
        `Prime Minister, the National Education Policy (NEP) is being rolled out rapidly. We are focusing on mother-tongue primary instruction and establishing multidisciplinary higher education institutions.`,
        `Sir, we are upgrading thousands of primary schools into PM-SHRI model institutions, equipped with smart classrooms and modern science laboratories.`,
        `PM Sahib, we are facilitating international university campuses to open centers in India, allowing our students access to global standards right here.`
      ]);
    } else if (query.includes("skill") || query.includes("vocational") || query.includes("job") || query.includes("training") || query.includes("unemployment")) {
      thinking = `Aligning student degrees with industry needs. Current unemployment is ${gameState.unemployment.toFixed(1)}%. Need vocational training modules to prepare youth for electronics, logistics, and IT careers.`;
      spoken = getRandomItem([
        `Sir, to lower the youth unemployment rate of ${gameState.unemployment.toFixed(1)}%, we are launching thousands of modern skill-development labs in tier-2 and tier-3 districts to match actual corporate requirements.`,
        `Prime Minister, vocational skill integration is now a mandatory part of secondary school curricula. We want our youth to be job-ready the day they graduate.`,
        `Sir, we have launched a national internship portal linking top companies with tier-3 college students, ensuring fair pay and high-quality exposure.`
      ]);
    } else {
      thinking = `General briefing on human resource development. Youth approval: ${gameState.demographics.youth}%. Aligning academic infrastructure with digital public goods.`;
      spoken = getRandomItem([
        `Prime Minister, educational and skill-development reforms are progressing. We are focused on updating academic curricula and expanding vocational centers to prepare our youth (${gameState.demographics.youth}% approval) for the future.`,
        `Sir, we are expanding digital education apps to offer free high-quality lectures to rural students, bridging the urban-rural academic divide.`,
        `PM Sahib, our focus is on building a modern, skill-anchored knowledge society that turns our vast youth demographic into a powerful global asset.`
      ]);
    }
  }

  // 8. Agriculture Minister (Shri Shivraj Chauhan)
  else if (advisorId === "shivraj") {
    if (query.includes("farmer") || query.includes("kisan") || query.includes("agriculture") || query.includes("crop") || query.includes("farming")) {
      thinking = `Supporting our kisans. Farmer approval is ${gameState.demographics.farmers}%, Rural is ${gameState.demographics.rural}%. Ensuring timely credit, crop insurance, and direct cash transfers.`;
      spoken = getRandomItem([
        `Prime Minister, our kisans require steady support. We are ensuring the timely distribution of fertilizer subsidies and expanding access to interest-free agricultural credit (Farmer approval: ${gameState.demographics.farmers}%).`,
        `Sir, our crop insurance scheme is delivering swift payouts directly to crop-failure-affected farmers, preventing rural distress.`,
        `PM Sahib, PM-Kisan direct benefit transfers are being credited quarterly without any administrative delays, supporting millions of small farming families.`
      ]);
    } else if (query.includes("msp") || query.includes("price") || query.includes("market") || query.includes("wheat") || query.includes("rice")) {
      thinking = `Managing Minimum Support Price (MSP) demands. Balancing farmer income expectations with consumer inflation constraints (Inflation: ${gameState.inflation.toFixed(1)}%).`;
      spoken = getRandomItem([
        `Sir, we are expanding our MSP procurement mechanism to cover wider pulse and oilseed varieties, ensuring fair prices are paid directly into farmers' bank accounts without middleman leaks.`,
        `Prime Minister, our grains procurement is running at record volumes. This secures both national food security and stable, guaranteed returns for our farmers.`,
        `Sir, we are modernizing local APMC market grids with digital trading platforms, enabling farmers to sell to distant wholesale buyers at competitive rates.`
      ]);
    } else if (query.includes("irrigation") || query.includes("drought") || query.includes("water") || query.includes("monsoon") || query.includes("canal")) {
      thinking = `Water conservation is critical for crop insurance resilience. Micro-irrigation, solar pumps, and minor canals shield crops from weak monsoons.`;
      spoken = getRandomItem([
        `Prime Minister, water security is food security. We are scaling up micro-irrigation systems and constructing check-dams in rain-deficient districts to shield crops from erratic monsoon trends.`,
        `Sir, our solar-pump scheme (PM-KUSUM) is helping farmers irrigate fields during daytime using free, clean solar power, cutting diesel costs.`,
        `PM Sahib, we are completing multi-state river-linking projects to divert excess water into drought-prone zones, stabilizing national crop yields.`
      ]);
    } else {
      thinking = `General rural and farming sector briefing. Farmers approval: ${gameState.demographics.farmers}%. Rural approval: ${gameState.demographics.rural}%. Promoting allied sectors like dairy and fisheries.`;
      spoken = getRandomItem([
        `Prime Minister, the agricultural sector is the absolute lifeblood of India. We must continue to support rural household incomes through crop insurance and direct transfer benefits to keep our food inflation low.`,
        `Sir, we are seeing massive growth in allied sectors like dairy, organic farming, and cold-chains. This is successfully diversifying rural incomes beyond traditional crops.`,
        `PM Sahib, agricultural output is stable. We are encouraging youth-led agritech startups to bring drone-spraying and soil-testing to remote villages.`
      ]);
    }
  }

  // 9. Health Minister (Shri J. P. Narayan)
  else if (advisorId === "nadda") {
    if (query.includes("health") || query.includes("hospital") || query.includes("clinic") || query.includes("doctor") || query.includes("medical")) {
      thinking = `Upgrading national healthcare grid. Setting up regional AIIMS medical colleges, upgrading community health clinics. Low doctor-to-patient ratio in rural zones is being addressed.`;
      spoken = getRandomItem([
        `Prime Minister, we are constructing state-of-the-art AIIMS medical institutes in multiple regions and upgrading rural health centers with digital telemedicine equipment to improve rural doctor access.`,
        `Sir, we are expanding MBBS and nursing college seats across all states to permanently solve our medical workforce deficit.`,
        `PM Sahib, our rural health wellness clinics are delivering basic diagnostics and immunization to over 20 crore families right at their doorsteps.`
      ]);
    } else if (query.includes("ayushman") || query.includes("insurance") || query.includes("card") || query.includes("free")) {
      thinking = `Evaluating Ayushman Bharat public health insurance outlays. Safeguarding Middle Class (${gameState.demographics.middleClass}%) and Rural (${gameState.demographics.rural}%) segments from catastrophic medical bills.`;
      spoken = getRandomItem([
        `Sir, Ayushman Bharat has provided cashless secondary and tertiary hospitalization to over 50 crore citizens. We are considering expanding coverage to all senior citizens regardless of income.`,
        `Prime Minister, we have successfully authorized over 3 crore free surgeries under Ayushman cards, saving poor households from severe debt traps.`,
        `Sir, we are integrating private hospitals into our public insurance panels to ensure premium quality medical care is accessible to all citizens.`
      ]);
    } else if (query.includes("medicine") || query.includes("drug") || query.includes("pharmacy") || query.includes("cheap")) {
      thinking = `Lowering out-of-pocket healthcare bills. Expanding generic drug stores (Jan Aushadhi) to slash retail medicine costs by up to 90%.`;
      spoken = getRandomItem([
        `Prime Minister, our network of Jan Aushadhi pharmacies is delivering high-quality generic essential medicines at a 50% to 90% discount, bringing vast financial relief to middle-class households.`,
        `Sir, we are mandating doctors to prescribe chemical generic names rather than expensive branded drugs to protect patient finances.`,
        `PM Sahib, we are establishing bulk drug manufacturing parks to reduce our dependency on foreign active pharmaceutical ingredients (APIs).`
      ]);
    } else {
      thinking = `General public health briefing. Ensuring healthcare outlays are utilized efficiently. Public health safety is the foundation of economic productivity.`;
      spoken = getRandomItem([
        `Prime Minister, we are expanding public healthcare facilities and lowering out-of-pocket expenses to ensure robust health coverage for both urban and rural families.`,
        `Sir, our national disease surveillance programs are on alert. We are focusing on preventive health campaigns to build a fitter, healthier nation.`,
        `PM Sahib, public medical infrastructure is stable. We are digitizing health records to make patient histories easily transferable across hospitals.`
      ]);
    }
  }

  // 10. Environment Minister (Shri Bhupendra Yadav)
  else if (advisorId === "bhupendra") {
    if (query.includes("solar") || query.includes("power") || query.includes("energy") || query.includes("coal") || query.includes("grid")) {
      thinking = `Driving renewable energy transition. Expanding rooftop solar installations. Minimizing carbon footprint while securing baseload grid power for industries.`;
      spoken = getRandomItem([
        `Prime Minister, solar generation is expanding exponentially. Our rooftop solar subsidy scheme is helping millions of households generate free electricity while taking load off coal-fired thermal grids.`,
        `Sir, we are setting up ultra-mega solar parks in desert regions to feed clean, low-cost power directly into our national transmission grids.`,
        `PM Sahib, balancing green energy with industrial coal requirements is key. We are rapidly building green hydrogen and battery storage capacities.`
      ]);
    } else if (query.includes("ev") || query.includes("electric") || query.includes("car") || query.includes("scooter") || query.includes("charge")) {
      thinking = `Promoting electric mobility. Decreasing oil import bills. Upgrading urban charging grids to boost EV two-wheeler and four-wheeler adoption.`;
      spoken = getRandomItem([
        `Sir, the green mobility transition is crucial. We are funding public charging infrastructure and providing tax exemptions on electric two-wheelers to accelerate urban EV adoption.`,
        `Prime Minister, we are seeing massive private investments in domestic lithium-ion battery factories, which will slash localized EV prices by 30%.`,
        `Sir, transitioning public transport fleets to electric buses is our priority. This is successfully improving city air quality indices.`
      ]);
    } else if (query.includes("pollution") || query.includes("air") || query.includes("clean") || query.includes("water") || query.includes("smog")) {
      thinking = `Combating urban air pollution. Stricter emission standards, waste recycling, and forestation. Urban approval is ${gameState.demographics.urban}%.`;
      spoken = getRandomItem([
        `Prime Minister, combating metro air pollution is a high priority. We are mandating stricter industrial emission standards and establishing green buffer belts surrounding high-traffic cities.`,
        `Sir, we are expanding our national clean air action plans to tier-2 cities, financing mechanical sweepers and water-sprinkler systems.`,
        `PM Sahib, cleaning our major river basins is progressing. We are setting up mandatory sewage treatment plants in all riverside industrial districts.`
      ]);
    } else {
      thinking = `General environmental briefing. Balancing fast economic growth with sustainability targets. Protecting biodiversity while facilitating major infrastructure clearances.`;
      spoken = getRandomItem([
        `Prime Minister, we are balancing high economic growth with carbon reduction targets. Supporting solar grids and EV networks is crucial to ensuring sustainable development for future generations.`,
        `Sir, we are increasing India's forest cover through structured community-led plantation drives, which is boosting rural livelihoods.`,
        `PM Sahib, our green policies are receiving massive praise on international forums. India is on track to hit its net-zero carbon pledges.`
      ]);
    }
  }

  // 11. Space & Technology Chief (Dr. S. Somnath Roy)
  else if (advisorId === "somnath") {
    if (query.includes("space") || query.includes("isro") || query.includes("satellite") || query.includes("rocket") || query.includes("moon")) {
      thinking = `Reviewing ISRO's strategic space programs. Launching human spaceflights, planetary probes, and commercial satellite systems. Enhancing agricultural weather models via earth observation arrays.`;
      spoken = getRandomItem([
        `Prime Minister, ISRO is finalizing preparations for our manned Gaganyaan space mission and our national space station. Our satellite array is also delivering hyper-local weather models for our agricultural sectors.`,
        `Sir, our commercial rocket launches are attracting global satellite companies, generating valuable foreign exchange for our national space board.`,
        `PM Sahib, we are building a second rocket launch center to handle the massive rise in private commercial satellite demands, cementing India's space dominance.`
      ]);
    } else if (query.includes("semiconductor") || query.includes("chip") || query.includes("fab") || query.includes("electronics")) {
      thinking = `Establishing national semiconductor fabrication ecosystem. Guarding technology sovereignty. Corporate approval: ${gameState.demographics.corporate}%.`;
      spoken = getRandomItem([
        `Sir, establishing national semiconductor design and fabrication plants is key to our tech sovereignty. Our central incentives have successfully attracted major international foundries to construct local fabs.`,
        `Prime Minister, local electronic chip packaging units are now operational. This will insulate our automotive and defense industries from global supply shortages.`,
        `Sir, our semiconductor skill programs are training thousands of students in VLSI design, creating high-paying tech jobs (+${gameState.demographics.youth}% youth approval).`
      ]);
    } else if (query.includes("ai") || query.includes("tech") || query.includes("software") || query.includes("startup") || query.includes("quantum")) {
      thinking = `Leveraging deep-tech. Deploying local LLMs for administrative efficiency. Funding quantum computing testbeds and tech startup incubators.`;
      spoken = getRandomItem([
        `Prime Minister, our startup ecosystem is expanding. We are financing deep-tech hardware incubators and deploying secure, localized AI models to optimize administrative workflows and civic service delivery.`,
        `Sir, our national supercomputing grid has been upgraded. We are providing free research access to academic institutes working on quantum materials and climate models.`,
        `PM Sahib, supporting technical startups is our key strategy to absorb skilled youth. Our digital payment models are being exported to multiple nations.`
      ]);
    } else {
      thinking = `General science and technology briefing. Tech self-reliance is the primary engine of modern sovereign power. GDP growth is at +${gameState.gdpGrowth.toFixed(1)}%.`;
      spoken = getRandomItem([
        `Prime Minister, technology and scientific self-reliance are our ultimate levers for progress. We are supporting local software clusters, deep-tech research, and aerospace innovations to build a digital India.`,
        `Sir, scientific innovation is receiving a massive boost. We are coordinating with the education ministry to fund advanced physics and AI laboratories.`,
        `PM Sahib, India is transitioning from a consumer of technology to a primary creator of global standards. Our digital and space assets are highly resilient.`
      ]);
    }
  }

  // 12. Fallback default
  else {
    thinking = `Assessing general cabinet portfolios. Liquid treasury: ₹${gameState.treasury.toFixed(1)} L Cr. Popular approval: ${gameState.popularity.toFixed(1)}%. Coordinating inter-ministerial efforts to guard national borders and maintain GDP momentum.`;
    spoken = getRandomItem([
      `Prime Minister, I am currently reviewing our departmental data. We must coordinate closely across all ministries to maintain economic stability (+${gameState.gdpGrowth.toFixed(1)}% GDP growth) and secure our national borders.`,
      `Sir, the Cabinet is working in full unison to execute your directives. We are monitoring economic indices closely to shield the economy from external commodity shocks.`,
      `PM Sahib, our team is aligned across all developmental domains. I am preparing a coordinated action summary for the upcoming Parliament session.`
    ]);
  }

  return `<thinking>${thinking}</thinking>\n${spoken}`;
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
