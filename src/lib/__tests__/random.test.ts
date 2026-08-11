import { describe, it, expect } from 'vitest';
import {
  getWeightedRandomItem,
  getAvailableWeapons,
  getAvailableArmorOptions,
  generateAbilityPlan,
  generateRoundResult,
} from '../random';
import { DEFAULT_SETTINGS } from '../../config/randomizer';
import { AGENTS } from '../../config/agents';
import { WEAPONS } from '../../config/weapons';
import { ARMOR_OPTIONS } from '../../config/armor';
import { Agent } from '../../types/domain';

describe('Randomization Engine Pure Utilities', () => {
  it('getWeightedRandomItem selects valid item from list', () => {
    const items = [
      { id: 'a', weight: 1 },
      { id: 'b', weight: 10 },
    ];
    const picked = getWeightedRandomItem(items);
    expect(picked).toBeDefined();
    expect(['a', 'b']).toContain(picked.id);
  });

  it('getAvailableWeapons respects enabled categories and available credits budget', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      enabledWeaponCategories: ['sidearm' as const],
    };

    const weapons = getAvailableWeapons(settings, null, 500, WEAPONS);
    expect(weapons.every((w) => w.category === 'sidearm')).toBe(true);
    expect(weapons.every((w) => w.cost <= 500)).toBe(true);
    expect(weapons.some((w) => w.id === 'ghost')).toBe(true);
    expect(weapons.some((w) => w.id === 'sheriff')).toBe(false);
  });

  it('getAvailableWeapons avoids immediate repeat when alternatives exist', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      avoidImmediateWeaponRepeats: true,
    };
    const mockPrevious = {
      id: 'r1',
      roundNumber: 1,
      agentId: 'jett',
      weapon: WEAPONS.find((w) => w.id === 'vandal')!,
      armor: ARMOR_OPTIONS[0],
      abilityPlan: { mode: 'single' as const, title: 't', description: 'd', abilities: [] },
      creditsSpent: 2900,
      availableCreditsAtSpin: 9000,
      createdAt: new Date().toISOString(),
    };

    const available = getAvailableWeapons(settings, mockPrevious, 9000, WEAPONS);
    expect(available.some((w) => w.id === 'vandal')).toBe(false);
    expect(available.some((w) => w.id === 'phantom')).toBe(true);
  });

  it('getAvailableArmorOptions respects budget limits', () => {
    const settings = DEFAULT_SETTINGS;
    const armor = getAvailableArmorOptions(settings, null, 450, ARMOR_OPTIONS);
    expect(armor.some((a) => a.id === 'heavy')).toBe(false);
    expect(armor.some((a) => a.id === 'light')).toBe(true);
    expect(armor.some((a) => a.id === 'none')).toBe(true);
  });

  it('generateAbilityPlan handles agent with single ability', () => {
    const singleAbilityAgent: Agent = {
      id: 'custom',
      name: 'Custom Agent',
      role: 'duelist',
      portraitPath: '',
      iconPath: '',
      enabled: true,
      abilities: [
        {
          id: 'ab1',
          name: 'Flash',
          slot: 'basic_1',
          iconPath: '',
          enabled: true,
        },
      ],
    };

    const plan = generateAbilityPlan(singleAbilityAgent);
    expect(plan.mode).toBe('single');
    expect(plan.abilities.length).toBe(1);
    expect(plan.abilities[0].id).toBe('ab1');
  });

  it('generateRoundResult produces full round result object', () => {
    const jett = AGENTS.find((a) => a.id === 'jett')!;
    const result = generateRoundResult({
      roundNumber: 1,
      agent: jett,
      settings: DEFAULT_SETTINGS,
      previousResult: null,
      availableCredits: 4000,
    });

    expect(result.roundNumber).toBe(1);
    expect(result.agentId).toBe('jett');
    expect(result.weapon).toBeDefined();
    expect(result.armor).toBeDefined();
    expect(result.abilityPlan).toBeDefined();
    expect(result.creditsSpent).toBe(result.weapon.cost + result.armor.cost);
    expect(result.creditsSpent).toBeLessThanOrEqual(4000);
  });
});
