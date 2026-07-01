export interface Demographics {
  farmers: number;
  youth: number;
  corporate: number;
  middleClass: number;
  rural: number;
  urban: number;
}

export interface Sectors {
  defense: number; // in Lakh Crore
  infrastructure: number;
  education: number;
  healthcare: number;
  agriculture: number;
  scienceSpace: number;
  socialWelfare: number;
}

export interface GameState {
  year: number;
  month: string;
  monthIndex: number; // 0 for July, 1 for August, etc.
  gdp: number; // in Lakh Crore
  gdpGrowth: number; // annual %
  inflation: number; // annual %
  unemployment: number; // %
  treasury: number; // in Lakh Crore
  debt: number; // as % of GDP
  popularity: number; // % approval
  politicalCapital: number;
  demographics: Demographics;
  sectors: Sectors;
  activeEvents: string[];
  currentFocus: string;
  history: GameHistoryPoint[];
}

export interface GameHistoryPoint {
  date: string;
  gdp: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  popularity: number;
  treasury: number;
}

export interface Advisor {
  id: string;
  name: string;
  role: string;
  ministry: string;
  avatar: string;
  description: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: "crisis" | "opportunity" | "normal";
  options: EventOption[];
}

export interface EventOption {
  text: string;
  cost: number; // Lakh Crore impact
  politicalCapitalCost: number;
  impact: {
    gdpGrowth?: number;
    inflation?: number;
    unemployment?: number;
    popularity?: number;
    treasury?: number;
    demographics?: Partial<Demographics>;
  };
  narrative: string;
}

export interface PreprogrammedPolicy {
  id: string;
  title: string;
  hindiTitle?: string;
  description: string;
  politicalCapitalCost: number;
  cost: number; // Lakh Crore
  impact: {
    gdpGrowth: number;
    inflation: number;
    unemployment: number;
    popularity: number;
    demographics: Partial<Demographics>;
  };
}
