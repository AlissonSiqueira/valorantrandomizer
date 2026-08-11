import { create } from 'zustand';
import { AppState, RandomizerSettings } from '../types/domain';
import { AGENTS } from '../config/agents';
import { DEFAULT_SETTINGS } from '../config/randomizer';
import { generateRoundResult } from '../lib/random';
import { loadStoredState, saveStateToStorage, clearStoredState } from '../lib/storage';

type StoreActions = {
  selectAgent: (agentId: string) => void;
  setAvailableCredits: (credits: number) => void;
  spinRound: () => void;
  nextRound: () => void;
  reSpinRound: () => void;
  resetMatch: () => void;
  updateSettings: (newSettings: Partial<RandomizerSettings>) => void;
  clearAllData: () => void;
  setIsSpinning: (spinning: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setSpinStage: (stage: 'idle' | 'weapon' | 'ability' | 'armor' | 'complete') => void;
};

export type SpinStage = 'idle' | 'weapon' | 'ability' | 'armor' | 'complete';

type RandomizerStore = AppState &
  StoreActions & {
    isSpinning: boolean;
    spinStage: SpinStage;
    isSettingsOpen: boolean;
    error: string | null;
  };

const loaded = loadStoredState();

// Helper to determine default credit preset based on round number
export function getDefaultCreditsForRound(_roundNum: number): number {
  return 9000;
}

const initialState: AppState = {
  selectedAgentId: loaded?.selectedAgentId ?? null,
  currentRound: loaded?.currentRound ?? 1,
  availableCredits: loaded?.availableCredits ?? getDefaultCreditsForRound(loaded?.currentRound ?? 1),
  currentResult: loaded?.currentResult ?? null,
  previousResult: loaded?.previousResult ?? null,
  settings: loaded?.settings ?? DEFAULT_SETTINGS,
};

export const useRandomizerStore = create<RandomizerStore>((set, get) => ({
  ...initialState,
  isSpinning: false,
  spinStage: loaded?.currentResult ? 'complete' : 'idle',
  isSettingsOpen: false,
  error: null,

  selectAgent: (agentId: string) => {
    set({
      selectedAgentId: agentId,
      currentRound: 1,
      availableCredits: 9000,
      currentResult: null,
      previousResult: null,
      spinStage: 'idle',
      error: null,
    });
    saveStateToStorage(get());
  },

  setAvailableCredits: (credits: number) => {
    const validCredits = Math.max(0, Math.min(16000, Number.isNaN(credits) ? 0 : credits));
    set({ availableCredits: validCredits });
    saveStateToStorage(get());
  },

  setSpinStage: (stage: SpinStage) => {
    set({ spinStage: stage });
  },

  spinRound: () => {
    const { selectedAgentId, currentRound, settings, currentResult, availableCredits, isSpinning } = get();

    if (isSpinning) return;

    const agent = AGENTS.find((a) => a.id === selectedAgentId);
    if (!agent) {
      set({ error: 'Please select a Valorant agent first.' });
      return;
    }

    try {
      const nextResult = generateRoundResult({
        roundNumber: currentRound,
        agent,
        settings,
        previousResult: currentResult,
        availableCredits,
      });

      set({
        isSpinning: true,
        spinStage: 'weapon',
        previousResult: currentResult,
        currentResult: nextResult,
        error: null,
      });

      const stageDuration =
        settings.animationIntensity === 'reduced'
          ? 1000
          : settings.animationIntensity === 'high'
          ? 6500
          : 4500;

      // Stage 1: Weapon (4.5s) -> Stage 2: Ability
      setTimeout(() => {
        set({ spinStage: 'ability' });

        // Stage 2: Ability (4.5s) -> Stage 3: Armor
        setTimeout(() => {
          set({ spinStage: 'armor' });

          // Stage 3: Armor (4.5s) -> Complete
          setTimeout(() => {
            set((state) => {
              const newState = {
                isSpinning: false,
                spinStage: 'complete' as SpinStage,
                error: null,
              };
              saveStateToStorage({ ...state, ...newState });
              return newState;
            });
          }, stageDuration);
        }, stageDuration);
      }, stageDuration);
    } catch (err: any) {
      set({
        isSpinning: false,
        spinStage: 'idle',
        error: err.message || 'Failed to generate spin result.',
      });
    }
  },

  nextRound: () => {
    const { currentRound } = get();
    const nextRoundNum = currentRound + 1;
    const defaultCredits = getDefaultCreditsForRound(nextRoundNum);

    set({
      currentRound: nextRoundNum,
      availableCredits: defaultCredits,
      currentResult: null,
      spinStage: 'idle',
      error: null,
    });
    saveStateToStorage(get());
  },

  reSpinRound: () => {
    const { isSpinning } = get();
    if (isSpinning) return;

    set({ currentResult: null, spinStage: 'idle' });
    get().spinRound();
  },

  resetMatch: () => {
    set((state) => {
      const newState = {
        currentRound: 1,
        availableCredits: 9000,
        currentResult: null,
        previousResult: null,
        spinStage: 'idle' as SpinStage,
        error: null,
      };
      saveStateToStorage({ ...state, ...newState });
      return newState;
    });
  },

  updateSettings: (newSettings: Partial<RandomizerSettings>) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      const newState = { settings: updated };
      saveStateToStorage({ ...state, ...newState });
      return newState;
    });
  },

  clearAllData: () => {
    clearStoredState();
    set({
      selectedAgentId: null,
      currentRound: 1,
      availableCredits: 9000,
      currentResult: null,
      previousResult: null,
      spinStage: 'idle',
      settings: DEFAULT_SETTINGS,
      error: null,
    });
  },

  setIsSpinning: (spinning: boolean) => set({ isSpinning: spinning }),
  setIsSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),
}));
