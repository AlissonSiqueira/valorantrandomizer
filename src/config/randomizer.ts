import { RandomizerSettings, WeaponCategory } from '../types/domain';

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'valorant_round_randomizer_v1';

export const DEFAULT_ABILITY_PLAN_WEIGHTS = {
  single: 4,
  double: 4,
  triple: 3,
  all: 2,
};

export const ALL_WEAPON_CATEGORIES: WeaponCategory[] = [
  'sidearm',
  'smg',
  'shotgun',
  'rifle',
  'sniper',
  'machine_gun',
  'melee',
];

export const DEFAULT_SETTINGS: RandomizerSettings = {
  avoidImmediateWeaponRepeats: true,
  avoidImmediateArmorRepeats: false,
  enabledWeaponCategories: [...ALL_WEAPON_CATEGORIES],
  animationIntensity: 'normal',
};

export const DEFAULT_AVAILABLE_CREDITS = 9000;
