# ValoRoll — Valorant Loadout Randomizer

<div align="center">

**A dark-tactical browser companion for Valorant players and streamers.**  
Randomizes **Weapons**, **Shields/Armor**, and **Agent Ability Combinations** round-by-round within economy constraints with casino-style radial roulettes.

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18-ff0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)

</div>

---

## ✨ Features

### 🎯 Authentic Agent Selection Roster
- **Full Roster Support**: All 25 Valorant agents (Controllers, Duelists, Initiators, Sentinels) with accurate abilities, charges, and portraits.
- **Large Splash Art Renders**: Fluid full-body character art that updates dynamically on hover/select.
- **Role Filtering & Color-Coded Themes**: Instant category filtering with custom role styling (Duelist: Crimson, Initiator: Amber, Controller: Cyan, Sentinel: Emerald).
- **Instant Search**: Real-time filtering by agent name.
- **Random Agent Selector**: One-click quick roll with suspenseful shuffling animation to randomize your agent.

### 🎰 Radial Casino Roulette Spinner
- **3-Stage Synchronized Reveal**: Smooth physics-based multi-slot spinning animation transitioning from **Weapon** ➜ **Ability Plan** ➜ **Armor/Shield** ➜ **Complete Results**.
- **Results Dock**: High-contrast tactical dock highlighting the winning loadout with direct keybinds, ability icons, and weapon tiers.
- **Keyboard Shortcut**: Press `[Spacebar]` anywhere on the randomizer screen to trigger an instant spin.
- **Auto-Scroll Focus**: Smooth automatic viewport centering when spinning on all screen resolutions.

### 💥 Dynamic Ability Combination Engine
- **Multi-Skill Combinations**: Randomizes between **Single Skill**, **Double Combo** (vertical stack layout), **Triple Combo** (pyramid layout), and **Full Utility (All 4 skills)**.
- **Randomized Skill Charges**: Assigns randomized charge counts up to the agent's maximum capability (e.g. `2x` flashes, `3x` smokes, `8x` Headhunter shots) with badge overlays.
- **Keybind & Price Mapping**: Accurate in-game default keybinds (`[C]`, `[Q]`, `[E]`, `[X]`) and ability credit costs.

### 💰 Economy & Budget Control
- **Available Credits Selector**: Input your available round funds (e.g., 800¤ Pistol, 2000¤ Eco, 3900¤ Full Buy) to ensure generated loadouts never exceed your budget.
- **Intelligent Fallback**: Guarantees free loadouts (Classic + No Shield) if credits are depleted.

### 🔄 Anti-Repeat Intelligence
- Prevents immediate consecutive weapon or armor duplicates across rounds, ensuring variety in every roll.

### ⚡ Performance & Polish
- **Stateless & Frictionless**: Quick rolls without round-tracking friction.
- **Debounced Local Storage**: Persists state without unnecessary disk/render overhead.
- **Memoized Components**: Optimized React render cycles for zero lag during high-intensity animations.
- **Asset Resiliency**: Automatic fallback system supporting subpath deployments (`/val/`).

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Valorant tactical palette
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand 5](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (or `pnpm` / `yarn`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/AlissonSiqueira/valorantrandomizer.git

# Navigate into the directory
cd valorantrandomizer

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Tests & Validation
```bash
# Run unit test suite
npm run test

# Run TypeScript type check
npm run typecheck

# Build optimized production bundle
npm run build
```

---

## 📁 Project Structure

```txt
valorantrandomizer/
├── public/
│   └── assets/
│       └── images/         # High-resolution agent, weapon, ability, & shield assets
├── src/
│   ├── app/
│   │   └── App.tsx         # Main application layout, routing & header
│   ├── components/
│   │   ├── AgentCard.tsx             # Agent card with role badges & animations
│   │   ├── AgentSelect.tsx           # Full-screen agent selection roster & search
│   │   ├── RadialCasinoRoulette.tsx  # Radial spinning wheel animation engine
│   │   ├── ResultsDock.tsx           # Multi-slot result display dock
│   │   ├── RoundControls.tsx         # Spin trigger, economy & credit controls
│   │   ├── SettingsDrawer.tsx        # Preference drawer (weapons, intensity, etc.)
│   │   ├── AssetImage.tsx            # Resilient asset loader with SVG fallback
│   │   └── EmptyState.tsx            # Budget & error warning fallback cards
│   ├── config/
│   │   ├── agents.ts       # 25 agents dataset, roles, abilities & max charges
│   │   ├── weapons.ts      # Weapons catalog, categories, costs & icon paths
│   │   ├── armor.ts        # Shield tiers (Light, Heavy, Regen, None)
│   │   └── randomizer.ts   # Default settings, weights & configuration
│   ├── lib/
│   │   ├── random.ts       # Pure randomization engine & Fisher-Yates shuffle
│   │   ├── storage.ts      # Safe localStorage persistence with debouncing
│   │   └── __tests__/
│   │       └── random.test.ts # Vitest unit test suite
│   ├── store/
│   │   └── useRandomizerStore.ts # Global Zustand state store
│   ├── styles/
│   │   └── globals.css     # Valorant dark tactical styling & animations
│   ├── types/
│   │   └── domain.ts       # TypeScript domain models & schemas
│   ├── utils/
│   │   └── assetPath.ts    # Base path resolution utility
│   └── main.tsx            # Application entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Configuration & Customization

Game data is structured in modular TypeScript configuration files under `src/config/`:

- **Agents & Abilities**: [`src/config/agents.ts`](src/config/agents.ts) — Edit agent attributes, role classifications, ability descriptions, icons, and `maxCharges`.
- **Weapons**: [`src/config/weapons.ts`](src/config/weapons.ts) — Update weapon costs, categories, and icon mappings.
- **Shields & Armor**: [`src/config/armor.ts`](src/config/armor.ts) — Configure shield options, HP absorption, and costs.
- **Randomizer Weights**: [`src/config/randomizer.ts`](src/config/randomizer.ts) — Adjust combination probability distribution.

---

## 👤 Author & Credits

- Created by **[@SlicerzzTV](https://www.tiktok.com/@SlicerzzTV)** on TikTok.
- Maintained by [Alisson Siqueira](https://github.com/AlissonSiqueira).

---

## 📄 License & Disclaimer

This project is a fan-made creation and is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by **Riot Games, Inc.**  
VALORANT and all related assets, characters, and trademarks are property of **Riot Games, Inc.**
