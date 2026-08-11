# Valorant Round Randomizer (MVP)

A polished, dark-tactical browser companion web application for Valorant players. Designed to run client-side on a secondary monitor during live matches, it randomizes **Weapons**, **Armor**, and **Agent Ability Playstyles** round-by-round within player budget constraints.

---

## Features

- **Agent Selection**: Complete roster of Valorant agents categorized by role (Controller, Duelist, Initiator, Sentinel) with role tabs and instant search.
- **Round Randomizer**: Spin button with roulette animation revealing weapon, armor tier, and custom ability strategy instructions.
- **Budget Credit Constraints**: Interactive "Available Credits" input ensuring randomized loadouts fit round eco/buy budgets (e.g. 800¤ Pistol, 2000¤ Eco, 3900¤ Full Buy).
- **Ability Plan Generator**: Generates 4 strategy playstyle modes:
  - **Single Focus**: Maximize value from one specific ability.
  - **Ability Combo**: Synergize two abilities together.
  - **Restriction**: Challenge mode forbidding casting a specific ability.
  - **Ultimate Focus**: Build economy or play aggressively to unlock and unleash Ultimate.
- **Repeat Avoidance Rules**: Toggles to prevent immediate consecutive weapon or armor repeats across rounds.
- **Match History**: Persistent round history log with detailed view of previous buys & strategy instructions.
- **Tactical Dark UI**: Built with a Valorant-inspired aesthetic (`#0f1923` dark background, `#ff4655` crimson accents, sharp clipped paneling, glowing states, and full keyboard accessibility).
- **Self-Contained Persistence**: Uses `localStorage` with version migration key (`STORAGE_VERSION = 1`).
- **Asset Resiliency**: Automatic styled SVG/CSS fallback placeholders if local image assets are absent or broken.

---

## Quick Start & Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Unit Tests

```bash
npm run test
```

### 4. Run Typecheck & Build

```bash
npm run typecheck
npm run build
```

---

## Project Structure

```txt
valorant-round-randomizer/
  public/
    assets/
      agents/        # Agent portraits and role icons
      weapons/       # Weapon icons
      abilities/     # Agent ability icons
      armor/         # Shield option icons
  src/
    app/
      App.tsx        # Main application dashboard layout
    components/
      AgentCard.tsx          # Agent selection grid item
      AgentSelect.tsx        # Agent roster view with filters
      WeaponResultCard.tsx   # Weapon spin reveal card
      ArmorResultCard.tsx    # Armor option reveal card
      AbilityResultCard.tsx   # Ability plan strategy card
      RoundControls.tsx      # Spin button, Credits input & round controls
      HistoryPanel.tsx       # Round log sidebar
      SettingsDrawer.tsx     # Randomizer rule settings drawer
      EmptyState.tsx         # Edge-case alert card
      AssetImage.tsx         # Resilient image component with fallback
    config/
      agents.ts      # Agent roster dataset & ability configurations
      weapons.ts     # Weapon catalog & cost structures
      armor.ts       # Armor options & shield stats
      randomizer.ts  # Default weights, storage keys & settings
    lib/
      random.ts      # Pure randomization engine utilities
      storage.ts     # Safe localStorage versioning & error recovery
      validation.ts  # State schema validation guards
      __tests__/
        random.test.ts # Vitest unit tests for randomization engine
    store/
      useRandomizerStore.ts # Zustand global store
    styles/
      globals.css    # Valorant design system & utility classes
    types/
      domain.ts      # TypeScript interfaces and domain types
    main.tsx
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
  README.md
```

---

## How Content & Assets Work

All game content is defined in pure TypeScript configuration files in `src/config/`:

- **Agents**: Edit `src/config/agents.ts` to adjust agent roster, roles, or abilities.
- **Weapons**: Edit `src/config/weapons.ts` to adjust weapon names, categories, costs, or weights.
- **Armor**: Edit `src/config/armor.ts` to configure shield tiers and descriptions.

### Adding Real Valorant Visual Assets

Place images in `public/assets/` following these paths:

- Agent Portrait: `/assets/agents/jett.png`
- Weapon Icon: `/assets/weapons/vandal.png`
- Armor Icon: `/assets/armor/heavy.png`
- Ability Icon: `/assets/abilities/jett-dash.png`

If an asset file does not exist, `AssetImage` automatically displays a styled tactical placeholder badge with category icon and item initials.

---

## Randomization Algorithm

1. **Weapon Selection**: Filters enabled weapons in configured categories where `weapon.cost <= availableCredits`. Filters out previous round weapon if repeat avoidance is active (unless no alternative exists). Picks weighted item from pool.
2. **Armor Selection**: Calculates remaining credit budget (`availableCredits - weapon.cost`). Filters armor options fitting budget and repeat avoidance rules.
3. **Ability Plan**: Filters enabled abilities for selected agent. Selects strategy mode (`single`, `combo`, `restriction`, `ultimate_focus`) based on configurable weights in `src/config/randomizer.ts`.

---

## MVP Limitations & Non-Goals

- No real-time game hook / Valorant API connection (manual input for match flow).
- No backend database or user accounts required.
- Fully local client-side state.

---

## Future Enhancements

- Hotkey / Stream Deck overlay triggers.
- Custom challenge modifier presets (e.g. Pistol Only, Shotgun Rush).
- sound effects on spin.
- Export / Import match history stats.
