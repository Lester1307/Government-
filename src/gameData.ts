import { GameState, Advisor, PreprogrammedPolicy, GameEvent } from "./types";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const INITIAL_STATE: GameState = {
  year: 2026,
  month: "July",
  monthIndex: 6, // July
  gdp: 275.4, // Lakh Crore INR (approx $3.5 Trillion USD)
  gdpGrowth: 6.8, // % annual growth
  inflation: 4.8, // % annual inflation
  unemployment: 6.2, // %
  treasury: 6.5, // Lakh Crore INR in liquid reserves
  debt: 56.4, // Debt as % of GDP
  popularity: 54.5, // % Prime Minister's approval rating
  politicalCapital: 45, // Earned through high approval and advancing months
  demographics: {
    farmers: 55,
    youth: 50,
    corporate: 52,
    middleClass: 53,
    rural: 56,
    urban: 51,
  },
  sectors: {
    defense: 6.2, // Lakh Crore INR
    infrastructure: 11.1,
    education: 1.2,
    healthcare: 0.9,
    agriculture: 2.5,
    scienceSpace: 0.3,
    socialWelfare: 4.1,
  },
  activeEvents: [],
  currentFocus: "Balanced Growth",
  history: [
    { date: "Jan 2026", gdp: 265.0, gdpGrowth: 6.5, inflation: 5.2, unemployment: 6.5, popularity: 52.0, treasury: 5.0 },
    { date: "Feb 2026", gdp: 267.0, gdpGrowth: 6.6, inflation: 5.1, unemployment: 6.4, popularity: 52.5, treasury: 5.2 },
    { date: "Mar 2026", gdp: 269.0, gdpGrowth: 6.6, inflation: 5.0, unemployment: 6.3, popularity: 53.0, treasury: 5.5 },
    { date: "Apr 2026", gdp: 271.0, gdpGrowth: 6.7, inflation: 4.9, unemployment: 6.3, popularity: 53.5, treasury: 5.8 },
    { date: "May 2026", gdp: 273.0, gdpGrowth: 6.7, inflation: 4.8, unemployment: 6.2, popularity: 54.0, treasury: 6.1 },
    { date: "Jun 2026", gdp: 275.4, gdpGrowth: 6.8, inflation: 4.8, unemployment: 6.2, popularity: 54.5, treasury: 6.5 },
  ]
};

export const ADVISORS: Advisor[] = [
  {
    id: "nirmala",
    name: "Smt. Nirmala Shastry",
    role: "Finance Minister",
    ministry: "Ministry of Finance",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    description: "Extremely pragmatic, data-driven, and highly cautious with fiscal spending. Her goal is to maintain a low fiscal deficit and keep inflation in check.",
  },
  {
    id: "amit",
    name: "Shri Amit Dev",
    role: "Home Affairs Minister",
    ministry: "Ministry of Home Affairs",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    description: "Focused on national security, domestic stability, law and order, and seamless regional integration across the states.",
  },
  {
    id: "jaishankar",
    name: "Dr. S. Jaishankar Prasad",
    role: "External Affairs Minister",
    ministry: "Ministry of External Affairs",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    description: "Sharp-witted, highly articulate global strategist. He seeks to secure India's interests in foreign trade, combat geopolitical pressures, and attract global FDI.",
  },
  {
    id: "rajnath",
    name: "General Rajnath Singh",
    role: "Defense Minister",
    ministry: "Ministry of Defence",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    description: "Patriotic and focused on modernizing the armed forces, safeguarding borders, and supporting 'Atmanirbhar Bharat' defense manufacturing.",
  },
  {
    id: "gadkari",
    name: "Shri Nitin Gokhale",
    role: "Minister of Infrastructure",
    ministry: "Ministry of Road Transport & Highways",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    description: "Enthusiastic nation-builder. Focused on speed, efficiency, and engineering excellence in modernizing India's expressways, toll networks, and logistics.",
  },
  {
    id: "piyush",
    name: "Shri Piyush Shrivastava",
    role: "Minister of Railways & Commerce",
    ministry: "Ministry of Railways & Commerce",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    description: "Commercial mastermind. Focuses on trade export volume, launching high-speed trains (Vande Bharat), and simplifying ease of doing business.",
  },
  {
    id: "dharmendra",
    name: "Shri Dharmendra Prasad",
    role: "Minister of Education",
    ministry: "Ministry of Education & Skill Dev",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
    description: "Dedicated to human capital. Passionate about reforming schools under the National Education Policy, skill-development labs, and youth research fellowships.",
  },
  {
    id: "shivraj",
    name: "Shri Shivraj Chauhan",
    role: "Minister of Agriculture",
    ministry: "Ministry of Agriculture & Farmers' Welfare",
    avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
    description: "A highly sympathetic, grassroots leader. Champions Minimum Support Prices (MSP), crop insurance, rural credit lines, and micro-irrigation projects.",
  },
  {
    id: "nadda",
    name: "Shri J. P. Narayan",
    role: "Minister of Health",
    ministry: "Ministry of Health & Family Welfare",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    description: "Focused on low-cost medicine, expanding Ayushman Bharat public health insurance, building new AIIMS hospitals, and strengthening rural clinics.",
  },
  {
    id: "bhupendra",
    name: "Shri Bhupendra Yadav",
    role: "Minister of Environment",
    ministry: "Ministry of Environment & Green Energy",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200",
    description: "Green diplomat. Leads India's carbon neutrality efforts, solar power installations, river rejuvenations, and transition to electric vehicles.",
  },
  {
    id: "somnath",
    name: "Dr. S. Somnath Roy",
    role: "Space & Technology Chief",
    ministry: "Ministry of Science & Tech (ISRO/IT)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    description: "Tech-optimist and science advocate. Believes India's future lies in space exploration, deep-tech startups, semiconductors, and green energy.",
  }
];

export const PREPROGRAMMED_POLICIES: PreprogrammedPolicy[] = [
  {
    id: "pm_kisan_boost",
    title: "PM-Kisan Income Boost Scheme",
    hindiTitle: "प्रधानमंत्री किसान सम्मान निधि संवर्धन",
    description: "Provide direct income support of ₹8,000 per year directly to farming households to counter inflation and drought pressures.",
    politicalCapitalCost: 15,
    cost: 0.65, // ₹65,000 Crore (0.65 Lakh Crore)
    impact: {
      gdpGrowth: 0.2,
      inflation: 0.15,
      unemployment: -0.1,
      popularity: 6,
      demographics: { farmers: 12, rural: 8, urban: -1, corporate: -2, middleClass: 1 }
    }
  },
  {
    id: "gati_shakti_express",
    title: "Gati Shakti Freight Corridors",
    hindiTitle: "गति शक्ति महामार्ग गलियारा",
    description: "Expedite construction of dedicated industrial rail freight corridors and multi-modal logistics hubs across West and South India.",
    politicalCapitalCost: 18,
    cost: 1.4, // ₹1.4 Lakh Crore
    impact: {
      gdpGrowth: 0.6,
      inflation: 0.1,
      unemployment: -0.4,
      popularity: 4,
      demographics: { corporate: 10, urban: 6, middleClass: 4, youth: 5, farmers: -1, rural: 1 }
    }
  },
  {
    id: "nep_vocational_fund",
    title: "NEP Vocational Training Subsidy",
    hindiTitle: "राष्ट्रीय शिक्षा नीति कौशल विकास",
    description: "Establish 10,000 modern skill labs and provide vocational training subsidies to engineering and college graduates to boost tech skills.",
    politicalCapitalCost: 12,
    cost: 0.35, // ₹35,000 Crore
    impact: {
      gdpGrowth: 0.3,
      inflation: 0.05,
      unemployment: -0.5,
      popularity: 5,
      demographics: { youth: 12, urban: 4, middleClass: 5, rural: 3 }
    }
  },
  {
    id: "atmanirbhar_semiconductor",
    title: "Atmanirbhar Semiconductor Mission",
    hindiTitle: "आत्मनिर्भर सेमीकंडक्टर प्रोत्साहन",
    description: "Provide a 50% capital subsidy match to global giants setup semiconductor fabrication foundries in Maharashtra and Gujarat.",
    politicalCapitalCost: 16,
    cost: 0.8, // ₹80,000 Crore
    impact: {
      gdpGrowth: 0.4,
      inflation: 0.0,
      unemployment: -0.2,
      popularity: 3,
      demographics: { corporate: 12, youth: 6, urban: 5, middleClass: 4, farmers: -1 }
    }
  },
  {
    id: "ayushman_rural_expansion",
    title: "Ayushman Bharat Rural Clinics",
    hindiTitle: "आयुष्मान भारत ग्रामीण आरोग्य केंद्र",
    description: "Launch 25,000 fully staffed primary healthcare sub-centers in remote rural and northeastern blocks, completely free for BPL citizens.",
    politicalCapitalCost: 14,
    cost: 0.45, // ₹45,000 Crore
    impact: {
      gdpGrowth: 0.1,
      inflation: 0.05,
      unemployment: -0.15,
      popularity: 7,
      demographics: { rural: 10, farmers: 8, middleClass: 5, urban: 2 }
    }
  },
  {
    id: "digital_panchayat_upi",
    title: "Digital India Gram Panchayat Mission",
    hindiTitle: "डिजिटल ग्राम पंचायत एवं यूपीआई विस्तार",
    description: "Equip every village panchayat with high-speed fiber internet and enable commission-free QR billing for rural local merchants.",
    politicalCapitalCost: 10,
    cost: 0.15, // ₹15,000 Crore
    impact: {
      gdpGrowth: 0.25,
      inflation: 0.0,
      unemployment: -0.2,
      popularity: 4,
      demographics: { rural: 6, youth: 8, farmers: 4, corporate: 5, urban: 2 }
    }
  },
  {
    id: "border_defense_grids",
    title: "Border Defense Infrastructure Grid",
    hindiTitle: "सीमावर्ती सामरिक बुनियादी ढांचा",
    description: "Build all-weather roads, tunnels, and troop shelters in high-altitude regions of Ladakh, Sikkim, and Arunachal Pradesh.",
    politicalCapitalCost: 15,
    cost: 0.75, // ₹75,000 Crore
    impact: {
      gdpGrowth: 0.15,
      inflation: 0.05,
      unemployment: -0.1,
      popularity: 5,
      demographics: { corporate: 4, urban: 3, middleClass: 5, rural: 2, farmers: 1 }
    }
  }
];

export const GAME_EVENTS: GameEvent[] = [
  {
    id: "monsoon_deficit",
    title: "Monsoon Deficit Warning",
    description: "The Indian Meteorological Department warns of a 15% rain deficit due to El Niño. Agrarian water storage levels are critically low.",
    category: "crisis",
    options: [
      {
        text: "Release ₹30,000 Cr in Emergency Farm Irrigation Packages",
        cost: 0.3,
        politicalCapitalCost: 5,
        impact: {
          gdpGrowth: -0.1,
          inflation: 0.2,
          popularity: 4,
          demographics: { farmers: 10, rural: 6, urban: -2, middleClass: -1 }
        },
        narrative: "Farm irrigation packages help prevent major crop failures. Farmers are extremely relieved, but food prices (inflation) tick upward due to physical deficit."
      },
      {
        text: "Keep the budget tight and import pulses/oilseeds to maintain stable city prices",
        cost: 0.08,
        politicalCapitalCost: 8,
        impact: {
          gdpGrowth: -0.3,
          inflation: -0.15,
          popularity: -3,
          demographics: { farmers: -10, rural: -6, urban: 5, middleClass: 4, corporate: 3 }
        },
        narrative: "Importing food controls inflation in metropolitan cities, pleasing urban consumers and the middle class, but rural communities feel abandoned and hold mass protests."
      }
    ]
  },
  {
    id: "border_standoff",
    title: "Geopolitical Border Standoff",
    description: "Forces encounter aggressive patrolling maneuvers along the eastern Himalayan sector. Tensions surge in national and international media.",
    category: "crisis",
    options: [
      {
        text: "Order immediate troop mobilization and fast-track a ₹25,000 Cr emergency weapon package",
        cost: 0.25,
        politicalCapitalCost: 8,
        impact: {
          gdpGrowth: 0.1,
          inflation: 0.1,
          popularity: 6,
          demographics: { middleClass: 8, youth: 6, rural: 4, urban: 4, corporate: -2 }
        },
        narrative: "Robust posture is celebrated as a major patriotic move. National morale surges. However, corporate investors feel jittery about regional instability, and treasury reserves take a hit."
      },
      {
        text: "Convene diplomatic talks through the Ministry of External Affairs without deploying extra military budget",
        cost: 0.0,
        politicalCapitalCost: 15,
        impact: {
          gdpGrowth: -0.05,
          inflation: -0.05,
          popularity: -4,
          demographics: { corporate: 5, middleClass: -3, youth: -5, farmers: 1, rural: -2 }
        },
        narrative: "Diplomats initiate calm discussions. Geopolitical tension subsides, pleasing the business sector (FDI continues). But the media accuses the cabinet of a weak security stance."
      }
    ]
  },
  {
    id: "green_energy_pact",
    title: "International Solar Alliance Tech Transfer",
    description: "A major European tech consortium offers exclusive solar cell manufacturing secrets to local Indian manufacturers if matched with a setup package.",
    category: "opportunity",
    options: [
      {
        text: "Co-invest ₹15,000 Cr to establish a green solar hub in Rajasthan",
        cost: 0.15,
        politicalCapitalCost: 10,
        impact: {
          gdpGrowth: 0.35,
          unemployment: -0.25,
          popularity: 3,
          demographics: { corporate: 8, youth: 6, urban: 5, rural: 3, farmers: 2 }
        },
        narrative: "The Rajasthan Solar Hub starts producing highly affordable local solar panels. Clean-tech investment boosts the economy and creates high-tech youth employment."
      },
      {
        text: "Decline public funding; let private companies negotiate tech transfers independently",
        cost: 0.0,
        politicalCapitalCost: 2,
        impact: {
          gdpGrowth: 0.05,
          popularity: -1,
          demographics: { corporate: -2, youth: -2, urban: -1 }
        },
        narrative: "Private companies state that capital costs are too high. Tech transfer is delayed, and India continues to import raw photovoltaic cells."
      }
    ]
  },
  {
    id: "cyber_assault",
    title: "Grid Failure & Cyber Assault",
    description: "A major national electricity grid sector in Western India encounters a sophisticated cyber attack, causing a 12-hour local power outage in industrial parks.",
    category: "crisis",
    options: [
      {
        text: "Allocate ₹10,000 Cr to build an air-gapped National Cyber Security Command",
        cost: 0.1,
        politicalCapitalCost: 6,
        impact: {
          gdpGrowth: 0.1,
          popularity: 4,
          demographics: { corporate: 8, urban: 5, middleClass: 6, youth: 4 }
        },
        narrative: "Cyber Command is established with rapid response defense teams. Tech-parks and manufacturing hubs feel highly secure, and corporate confidence returns."
      },
      {
        text: "Impose stricter server audits on local state electricity boards without extra spending",
        cost: 0.0,
        politicalCapitalCost: 10,
        impact: {
          gdpGrowth: -0.2,
          unemployment: 0.1,
          popularity: -3,
          demographics: { corporate: -5, urban: -4, middleClass: -3 }
        },
        narrative: "Server audits find several flaws but local grids lack the funding to patch them. Business associations complain of a fragile infrastructure backbone."
      }
    ]
  },
  {
    id: "rupee_oil_pressure",
    title: "Global Oil Spike Pressures Rupee",
    description: "Geopolitical turmoil in the Middle East cuts global supplies, causing Brent crude to soar to $110 per barrel. Oil imports drain India's forex reserves.",
    category: "crisis",
    options: [
      {
        text: "Absorb the blow: Cut excise taxes on fuel (₹30,000 Cr fiscal cost) to prevent inflation spikes",
        cost: 0.3,
        politicalCapitalCost: 8,
        impact: {
          gdpGrowth: 0.1,
          inflation: -0.4,
          popularity: 5,
          demographics: { middleClass: 10, urban: 8, farmers: 6, rural: 5, corporate: 4 }
        },
        narrative: "By lowering fuel excise, transport prices remain stable, preventing a massive retail inflation spike. The middle class and freight transporters praise the decision."
      },
      {
        text: "Let market forces decide: Pass the fuel price hike directly to the petrol pumps",
        cost: -0.1, // Earn tax revenue relative to high price
        politicalCapitalCost: 12,
        impact: {
          gdpGrowth: -0.4,
          inflation: 0.7,
          unemployment: 0.2,
          popularity: -8,
          demographics: { middleClass: -12, urban: -10, farmers: -8, rural: -8, corporate: -4 }
        },
        narrative: "Fuel prices cross ₹120 per liter in metro cities. Cost of vegetables, logistics, and commuting shoots up immediately. Widespread anger erupts across all demographic sections."
      }
    ]
  }
];
