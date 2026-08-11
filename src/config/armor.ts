import { ArmorOption } from '../types/domain';
import { assetPath } from '@/utils/assetPath';

export const ARMOR_OPTIONS: ArmorOption[] = [
  {
    id: 'none',
    name: 'No Shield (Denied)',
    description: 'No armor allowed this round. Save 100% credits.',
    cost: 0,
    iconPath: assetPath('/assets/images/warning.webp'),
    selectedIconPath: assetPath('/assets/images/warning.webp'),
    enabled: true,
    weight: 1,
  },
  {
    id: 'light',
    name: 'Light Shield',
    description: 'Adds 25 HP shield absorbing 66% damage.',
    cost: 400,
    iconPath: assetPath('/assets/images/light-armor.png'),
    selectedIconPath: assetPath('/assets/images/light-armor.png'),
    enabled: true,
    weight: 1,
  },
  {
    id: 'regenerative',
    name: 'Regen Shield',
    description: 'Adds 50 HP shield that recharges out of combat.',
    cost: 650,
    iconPath: assetPath('/assets/images/regen-shield.png'),
    selectedIconPath: assetPath('/assets/images/regen-shield.png'),
    enabled: true,
    weight: 1,
  },
  {
    id: 'heavy',
    name: 'Heavy Shield',
    description: 'Full body protection. Adds 50 HP shield absorbing 66% damage.',
    cost: 1000,
    iconPath: assetPath('/assets/images/heavy-armor.png'),
    selectedIconPath: assetPath('/assets/images/heavy-armor.png'),
    enabled: true,
    weight: 1,
  },
];
