import { AppState } from '../types/domain';
import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_SETTINGS, DEFAULT_AVAILABLE_CREDITS } from '../config/randomizer';
import { isValidAppState } from './validation';

type PersistedState = AppState & {
  _version: number;
};

export function loadStoredState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedState;

    if (!parsed || typeof parsed !== 'object' || parsed._version !== STORAGE_VERSION) {
      console.warn(`[ValoRoll] Outdated storage version. Resetting.`);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (!isValidAppState(parsed)) {
      console.warn(`[ValoRoll] Invalid state schema. Cleaning up.`);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      selectedAgentId: parsed.selectedAgentId ?? null,
      currentRound: parsed.currentRound ?? 1,
      availableCredits: parsed.availableCredits ?? DEFAULT_AVAILABLE_CREDITS,
      currentResult: parsed.currentResult ?? null,
      previousResult: parsed.previousResult ?? null,
      settings: parsed.settings ?? DEFAULT_SETTINGS,
    };
  } catch (err) {
    console.error(`[ValoRoll] Error reading localStorage:`, err);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

export function saveStateToStorage(state: AppState): void {
  try {
    const dataToSave: PersistedState = {
      _version: STORAGE_VERSION,
      selectedAgentId: state.selectedAgentId,
      currentRound: state.currentRound,
      availableCredits: state.availableCredits,
      currentResult: state.currentResult,
      previousResult: state.previousResult,
      settings: state.settings,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.error(`[ValoRoll] Failed to write to localStorage:`, err);
  }
}

export function clearStoredState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error(`[ValoRoll] Failed to clear localStorage:`, err);
  }
}
