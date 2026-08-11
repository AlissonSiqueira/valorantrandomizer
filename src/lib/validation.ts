import { AppState } from '../types/domain';

export function isValidAppState(data: any): data is AppState {
  if (!data || typeof data !== 'object') return false;

  const validRound = typeof data.currentRound === 'number' && data.currentRound >= 1;
  const validAgent = data.selectedAgentId === null || typeof data.selectedAgentId === 'string';
  const validSettings = data.settings && typeof data.settings === 'object';

  return validRound && validAgent && validSettings;
}
