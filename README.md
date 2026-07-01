# 🏛️ Lok Sabha Cabinet Simulator — PM Executive Simulation

An immersive, full-stack cabinet roleplaying and economic strategy simulator where you step into the shoes of the **Prime Minister of India**. Navigate complex national policies, manage a multi-trillion rupee budget, resolve sudden national crises, and lead your administration through an entire electoral term. 

Utilizing the **Google Gemini API**, your Cabinet Ministers are real-time conversational agents who offer domain-expert policy analysis, debate each other, and directly approach you with fully-structured executive schemes that you can custom-allot budgets to and enact into law.

---

## 🌟 Core Gameplay Features

### 1. 📊 Executive Command Dashboard
* **Dynamic Macroeconomic Indicators**: Monitor the pulse of the nation with six critical real-time indicators:
  * **National Treasury**: Capital reserves in **Lakh Crores (₹ L Cr)**. Running out of funds triggers a fiscal deficit crisis.
  * **Popularity (Approval %)**: The average confidence of the electorate. Directly dictates your seat share in the upcoming Lok Sabha elections.
  * **GDP Growth (%)**: Annualized economic expansion rate, driven by structural infrastructure, science, and educational spending.
  * **Inflation (%) & Unemployment (%)**: Dual macro pressures that you must keep in a healthy balance. High levels of either erode public support and trigger structural crises.
  * **Political Capital (PC)**: Your legislative leverage, earned by stable administration and spent on enacting major bills and resolving crises.
* **Sectoral Allocation Map**: Visualizes current budget allotments across **Defense, Infrastructure, Education, Healthcare, Agriculture, Science & Space, and Social Welfare**.

### 2. 💬 AI-Powered Cabinet Consultations (`Consult Cabinet`)
* **Expert Ministerial Portfolios**: Consult with specialized cabinet advisors, each possessing distinct personalities, professional tones, and portfolio mandates (e.g., Finance, Road Transport & Highways, External Affairs, Defence, Agriculture, and Environment).
* **Conversational Policy Inquiries**: Ask any factual, technical, or philosophical policy questions (e.g., *"Is E20 fuel safe to implement immediately?"*, *"Should we increase capital outlay for semiconductors?"*). 
* **Detailed Policy Breakdowns**: Ministers leverage Gemini to reply with structured, realistic **pros & cons** alongside **granular budget calculations** (costs, procurement overheads, and logistics savings) grounded in modern Indian data.
* **No Cognitive Noise**: The UI delivers clean, pristine dialog from the ministers, automatically filtering raw algorithmic chain-of-thought processing.

### 3. 📜 Dynamic Ministerial Initiatives (`Request Initiative`)
* **Proactive Public Proposals**: Ask any minister to draft a formal executive scheme.
* **Structured Legislative Proposals**: Ministers formulate custom schemes (complete with creative titles, descriptions, fiscal costs, and political capital requirements) and present them inside the chat as interactive executive orders.
* **Custom Budget Allotment**: Review the proposal, adjust the **Allotted Budget (₹ L Cr)** dynamically, and click **Pass & Allot Budget** to deduct funds from the treasury and immediately apply structural gains. Alternatively, you can decline the bill to preserve political capital.

### 4. 🗣️ Cabinet Committee Debates
* **Sequential Multi-Agent Conversations**: Convene emergency cabinet meetings and direct-order debates on custom issues (e.g., *"Should we implement a carbon tax on diesel vehicles?"*).
* **Inter-Ministerial Friction**: Watch your ministers debate the issue sequentially from their respective portfolio perspectives (e.g., the Environment Minister clashing with the Heavy Industries Minister over industrial carbon limits, while the Finance Minister mediates the tax revenue benefits).

### 5. 🛠️ Custom Bill Drafting Sandbox (`Draft Bills`)
* **Generative Policy Simulation**: Draft any bill in natural language (e.g., *"National Quantum Computing Grid"* or *"Direct Farmer Income Support"*).
* **Prospective Impact Analysis**: The Gemini-driven policy engine simulates your custom text to predict immediate percentage adjustments on GDP, inflation, unemployment, public approval, and specific regional/demographic segments.
* **Legislative Enactment**: Enact custom drafted bills directly into active policies, writing them to the state archive and dynamically updating the nation's stats.

### 6. 📰 Live Economic & Crisis Ticker
* **Generative Media Reports**: A dynamic news ticker continuously feeds breaking news and economic briefs based on your latest legislative decisions.
* **Crises & Opportunities**: Face randomized domestic, environmental, and geopolitical events (e.g., monsoon failure, border standoffs, healthcare breakthroughs) where you must choose between multiple resolution pathways.

### 7. 🗳️ Lok Sabha General Election (Endgame)
* **Demographic Target Metrics**: Your performance is tracked across six pivotal voting groups: **Farmers, Youth, Corporate Leaders, Middle Class, Rural Citizens, and Urban Dwellers**.
* **Electoral Seat Allocation**: After progressing through the months, stand before the electorate. The simulator calculates your final seat allocation out of **543 Lok Sabha seats** based on demographic support and economic stability:
  * **Absolute Majority (272+ Seats)**: Secure a historic, stable mandate.
  * **Coalition Government (200-271 Seats)**: Govern via unstable alliances.
  * **Opposition Bench (<200 Seats)**: Concede the election.

---

## 🛠️ Simulation Mechanics & Mathematics

### Demographic Group Affinities
Each policy or executive initiative has tailored demographic affinities. To win an absolute majority, you must balance competing demands:
* **Infrastructure / Corporate Spending**: Satisfies Corporate and Urban classes, boosts GDP growth, but risks increasing inflation if deficit-financed.
* **Agriculture Subsidies**: Boosts Rural and Farmer approval, but drains Treasury reserves and increases national debt pressure.
* **Social Welfare Outlays**: Heavily improves Rural and Middle Class approval while directly lowering unemployment statistics.

---

## 🎨 Visual Identity & Styling

* **Aesthetic**: **Aero Slate Dark Theme** — Utilizing a deep dark slate canvas (`bg-slate-950`) combined with high-contrast amber (`text-amber-400`), emerald (`text-emerald-400`), and indigo highlights.
* **Micro-interactions**: Hand-crafted staggered entrances and route transitions powered by **`motion` (Framer Motion)** to create an premium, responsive executive software feel.
* **Clean Typographic Hierarchy**: Space Grotesk/Inter headers paired with clean JetBrains Mono numbers to present data blocks cleanly.

---

## 🚀 Technical Configuration & Deployment

### Environment Setup
Create a `.env` file in the root directory (based on `.env.example`) and insert your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Dependency Installation
To install the package dependencies:
```bash
npm install
```

### Dev Server
To start the interactive development server:
```bash
npm run dev
```

### Production Build & Assembly
To build and bundle the full-stack system:
```bash
npm run build
```
The application will be compiled into the `dist` directory, with the custom Express server bundled into `dist/server.cjs` for highly responsive, cold-start optimized container executions on port `3000`.
