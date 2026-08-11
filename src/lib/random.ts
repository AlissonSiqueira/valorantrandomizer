import {
  Agent,
  AbilityPlan,
  ArmorOption,
  RandomizerSettings,
  RoundResult,
  Weapon,
} from '../types/domain';
import { WEAPONS } from '../config/weapons';
import { ARMOR_OPTIONS } from '../config/armor';
import { DEFAULT_ABILITY_PLAN_WEIGHTS } from '../config/randomizer';

/**
 * Fisher-Yates array shuffle for true un-biased randomization.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns a weighted random item from an array with Fisher-Yates pre-shuffle.
 */
export function getWeightedRandomItem<T extends { weight?: number }>(items: T[]): T {
  if (!items || items.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }

  const shuffled = shuffleArray(items);

  const validItems = shuffled.map((item) => ({
    item,
    weight: Math.max(1, item.weight ?? 1),
  }));

  const totalWeight = validItems.reduce((sum, entry) => sum + entry.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (const entry of validItems) {
    if (randomNum < entry.weight) {
      return entry.item;
    }
    randomNum -= entry.weight;
  }

  return shuffled[0];
}

/**
 * Gets available weapons respecting settings, credits, and strict repeat avoidance.
 */
export function getAvailableWeapons(
  settings: RandomizerSettings,
  previousResult?: RoundResult | null,
  availableCredits: number = Infinity,
  allWeapons: Weapon[] = WEAPONS
): Weapon[] {
  let pool = allWeapons.filter((w) => w.enabled);

  if (settings.enabledWeaponCategories && settings.enabledWeaponCategories.length > 0) {
    pool = pool.filter((w) => settings.enabledWeaponCategories.includes(w.category));
  }

  let budgetPool = pool.filter((w) => w.cost <= availableCredits);
  if (budgetPool.length > 0) {
    pool = budgetPool;
  } else {
    const freeWeapons = pool.filter((w) => w.cost === 0);
    if (freeWeapons.length > 0) {
      pool = freeWeapons;
    }
  }

  // Strict anti-repeat: If previous weapon exists and alternatives exist, filter out previous weapon!
  if (previousResult?.weapon?.id) {
    const lastWeaponId = previousResult.weapon.id;
    const nonRepeatPool = pool.filter((w) => w.id !== lastWeaponId);
    if (nonRepeatPool.length > 0) {
      pool = nonRepeatPool;
    }
  }

  return shuffleArray(pool);
}

/**
 * Gets available armor options respecting settings, credits, and strict repeat avoidance.
 */
export function getAvailableArmorOptions(
  _settings: RandomizerSettings,
  previousResult?: RoundResult | null,
  availableCredits: number = Infinity,
  allArmor: ArmorOption[] = ARMOR_OPTIONS
): ArmorOption[] {
  let pool = allArmor.filter((a) => a.enabled);

  let budgetPool = pool.filter((a) => a.cost <= availableCredits);
  if (budgetPool.length > 0) {
    pool = budgetPool;
  } else {
    const freeArmor = pool.filter((a) => a.cost === 0);
    if (freeArmor.length > 0) {
      pool = freeArmor;
    }
  }

  // Strict anti-repeat: If previous armor exists and alternatives exist, filter out previous armor!
  if (previousResult?.armor?.id) {
    const lastArmorId = previousResult.armor.id;
    const nonRepeatPool = pool.filter((a) => a.id !== lastArmorId);
    if (nonRepeatPool.length > 0) {
      pool = nonRepeatPool;
    }
  }

  return shuffleArray(pool);
}

/**
 * Generates an ability plan listing ONLY ALLOWED ABILITIES with Fisher-Yates shuffling.
 */
export function generateAbilityPlan(agent: Agent): AbilityPlan {
  if (!agent || !agent.abilities) {
    return {
      mode: 'single',
      title: 'No Abilities Available',
      description: 'No agent selected or configuration is invalid.',
      abilities: [],
    };
  }

  const enabledAbilities = agent.abilities.filter((a) => a.enabled);

  if (enabledAbilities.length === 0) {
    return {
      mode: 'single',
      title: 'No Abilities Enabled',
      description: `All abilities for ${agent.name} are currently disabled in configuration.`,
      abilities: [],
    };
  }

  if (enabledAbilities.length === 1) {
    const single = enabledAbilities[0];
    return {
      mode: 'single',
      title: `Allowed Skill: ${single.name}`,
      description: `You are allowed to cast ${single.name} this round.`,
      abilities: [single],
    };
  }

  const maxAbilities = enabledAbilities.length;
  const modePool: { mode: AbilityPlan['mode']; weight: number }[] = [];

  if (maxAbilities >= 1) modePool.push({ mode: 'single', weight: DEFAULT_ABILITY_PLAN_WEIGHTS.single });
  if (maxAbilities >= 2) modePool.push({ mode: 'double', weight: DEFAULT_ABILITY_PLAN_WEIGHTS.double });
  if (maxAbilities >= 3) modePool.push({ mode: 'triple', weight: DEFAULT_ABILITY_PLAN_WEIGHTS.triple });
  if (maxAbilities >= 4) modePool.push({ mode: 'all', weight: DEFAULT_ABILITY_PLAN_WEIGHTS.all });

  const selectedModeEntry = getWeightedRandomItem(modePool);
  const mode = selectedModeEntry.mode;

  const shuffledSkills = shuffleArray(enabledAbilities);

  if (mode === 'all') {
    return {
      mode: 'all',
      title: 'Full Utility',
      description: `All abilities are allowed.`,
      abilities: shuffledSkills.slice(0, 4),
    };
  }

  if (mode === 'triple') {
    const picked = shuffledSkills.slice(0, 3);
    return {
      mode: 'triple',
      title: `Triple Combo`,
      description: `Allowed skills: ${picked.map(a => a.name).join(', ')}`,
      abilities: picked,
    };
  }

  if (mode === 'double') {
    const picked = shuffledSkills.slice(0, 2);
    return {
      mode: 'double',
      title: `Double Combo`,
      description: `Allowed skills: ${picked.map(a => a.name).join(' + ')}`,
      abilities: picked,
    };
  }

  const single = shuffledSkills[0];
  return {
    mode: 'single',
    title: `Single Skill`,
    description: `Allowed skill: ${single.name}`,
    abilities: [single],
  };
}

/**
 * Generates a complete round result with 100% fair randomization and anti-repeat guarantees.
 */
export function generateRoundResult(params: {
  agent: Agent;
  settings: RandomizerSettings;
  previousResult?: RoundResult | null;
  availableCredits: number;
}): RoundResult {
  const { agent, settings, previousResult, availableCredits } = params;

  const availableWeapons = getAvailableWeapons(settings, previousResult, availableCredits);
  if (availableWeapons.length === 0) {
    throw new Error('No enabled weapons are available under current filters.');
  }

  const selectedWeapon = getWeightedRandomItem(availableWeapons);

  const remainingCredits = Math.max(0, availableCredits - selectedWeapon.cost);
  const availableArmor = getAvailableArmorOptions(settings, previousResult, remainingCredits);

  let selectedArmor: ArmorOption;
  if (availableArmor.length > 0) {
    selectedArmor = getWeightedRandomItem(availableArmor);
  } else {
    const noneArmor = ARMOR_OPTIONS.find((a) => a.id === 'none') || {
      id: 'none',
      name: 'No Shield (Denied)',
      description: 'No armor allowed this round.',
      cost: 0,
      iconPath: '/assets/images/warning.webp',
      enabled: true,
    };
    selectedArmor = noneArmor;
  }

  const abilityPlan = generateAbilityPlan(agent);
  const totalCost = selectedWeapon.cost + selectedArmor.cost;

  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    agentId: agent.id,
    weapon: selectedWeapon,
    armor: selectedArmor,
    abilityPlan,
    creditsSpent: totalCost,
    availableCreditsAtSpin: availableCredits,
    createdAt: new Date().toISOString(),
  };
}
