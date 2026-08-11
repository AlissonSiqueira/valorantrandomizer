export type WeaponCategory =
  | 'sidearm'
  | 'smg'
  | 'shotgun'
  | 'rifle'
  | 'sniper'
  | 'machine_gun'
  | 'melee';

export type Weapon = {
  id: string;
  name: string;
  category: WeaponCategory;
  cost: number;
  iconPath: string;
  selectedIconPath?: string;
  enabled: boolean;
  weight?: number;
};

export type ArmorId = 'none' | 'light' | 'regenerative' | 'heavy';

export type ArmorOption = {
  id: ArmorId;
  name: string;
  description: string;
  cost: number;
  iconPath: string;
  selectedIconPath?: string;
  enabled: boolean;
  weight?: number;
};

export type AbilitySlot = 'basic_1' | 'basic_2' | 'signature' | 'ultimate';

export type Ability = {
  id: string;
  name: string;
  slot: AbilitySlot;
  iconPath: string;
  description?: string;
  enabled: boolean;
  cost?: number;
  maxCharges?: number;
  assignedCharges?: number;
};

export type AgentRole = 'duelist' | 'controller' | 'initiator' | 'sentinel';

export type Agent = {
  id: string;
  name: string;
  role: AgentRole;
  portraitPath: string;
  fullPortraitPath: string;
  iconPath: string;
  enabled: boolean;
  abilities: Ability[];
};

export type AbilityPlanMode = 'single' | 'double' | 'triple' | 'all';

export type AbilityPlan = {
  mode: AbilityPlanMode;
  title: string;
  description: string;
  abilities: Ability[];
};

export type RoundResult = {
  id: string;
  agentId: string;
  weapon: Weapon;
  armor: ArmorOption;
  abilityPlan: AbilityPlan;
  creditsSpent: number;
  availableCreditsAtSpin: number;
  createdAt: string;
};

export type AnimationIntensity = 'reduced' | 'normal' | 'high';

export type RandomizerSettings = {
  avoidImmediateWeaponRepeats: boolean;
  avoidImmediateArmorRepeats: boolean;
  enabledWeaponCategories: WeaponCategory[];
  animationIntensity: AnimationIntensity;
};

export type AppState = {
  selectedAgentId: string | null;
  availableCredits: number;
  currentResult: RoundResult | null;
  previousResult: RoundResult | null;
  settings: RandomizerSettings;
};
