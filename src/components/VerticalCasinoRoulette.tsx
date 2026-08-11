import React, { useEffect, useState, useRef } from 'react';
import { Weapon, ArmorOption, AbilityPlan } from '../types/domain';
import { WEAPONS } from '../config/weapons';
import { AssetImage } from './AssetImage';
import { assetPath } from '@/utils/assetPath';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Trophy, Sparkles, Target, Shield, Zap } from 'lucide-react';
import { shuffleArray } from '../lib/random';

export type RouletteType = 'weapon' | 'ability' | 'armor';

type VerticalCasinoRouletteProps = {
  type: RouletteType;
  winningWeapon?: Weapon | null;
  winningArmor?: ArmorOption | null;
  winningAbilityPlan?: AbilityPlan | null;
  isSpinning: boolean;
  hasSpun: boolean;
  onSpinComplete?: () => void;
  availableWeapons?: Weapon[];
  intensity?: 'reduced' | 'normal' | 'high';
};

type GenericRouletteItem = {
  id: string;
  name: string;
  categoryOrMode: string;
  cost?: number;
  iconPath: string;
  selectedIconPath?: string;
  description?: string;
  abilities?: any[];
};

export const VerticalCasinoRoulette: React.FC<VerticalCasinoRouletteProps> = ({
  type,
  winningWeapon,
  winningArmor,
  winningAbilityPlan,
  isSpinning,
  hasSpun,
  onSpinComplete,
  availableWeapons = WEAPONS,
  intensity = 'normal',
}) => {
  const [items, setItems] = useState<GenericRouletteItem[]>([]);
  const [isLanded, setIsLanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const yMotion = useMotionValue(0);

  const cardHeight = 88;
  const cardGap = 10;
  const itemTotalHeight = cardHeight + cardGap; // 98px per step
  const winnerIndex = 42;

  const targetY = -(winnerIndex * itemTotalHeight + cardHeight / 2);

  const getWinningItem = (): GenericRouletteItem | null => {
    if (type === 'weapon' && winningWeapon) {
      return {
        id: winningWeapon.id,
        name: winningWeapon.name,
        categoryOrMode: winningWeapon.category.replace('_', ' '),
        cost: winningWeapon.cost,
        iconPath: winningWeapon.iconPath,
        selectedIconPath: winningWeapon.selectedIconPath,
      };
    }
    if (type === 'armor' && winningArmor) {
      return {
        id: winningArmor.id,
        name: winningArmor.name,
        categoryOrMode: winningArmor.id === 'none' ? 'DENIED' : winningArmor.id,
        cost: winningArmor.cost,
        iconPath: winningArmor.iconPath,
        selectedIconPath: winningArmor.selectedIconPath,
        description: winningArmor.description,
      };
    }
    if (type === 'ability' && winningAbilityPlan) {
      return {
        id: winningAbilityPlan.mode,
        name: winningAbilityPlan.title,
        categoryOrMode: 'ALLOWED SKILLS',
        iconPath: winningAbilityPlan.abilities[0]?.iconPath || assetPath('/assets/images/uses-1.webp'),
        description: winningAbilityPlan.description,
        abilities: winningAbilityPlan.abilities,
      };
    }
    return null;
  };

  const getPool = (): GenericRouletteItem[] => {
    if (type === 'weapon') {
      const pool = availableWeapons.length > 0 ? availableWeapons : WEAPONS;
      return pool.map((w) => ({
        id: w.id,
        name: w.name,
        categoryOrMode: w.category.replace('_', ' '),
        cost: w.cost,
        iconPath: w.iconPath,
        selectedIconPath: w.selectedIconPath,
      }));
    }
    if (type === 'armor') {
      return [
        { id: 'none', name: 'No Shield (Denied)', categoryOrMode: 'DENIED', cost: 0, iconPath: assetPath('/assets/images/warning.webp'), description: 'No armor allowed' },
        { id: 'light', name: 'Light Shield', categoryOrMode: 'LIGHT', cost: 400, iconPath: assetPath('/assets/images/light-armor.png'), description: '25 HP shield protection' },
        { id: 'regen', name: 'Regen Shield', categoryOrMode: 'REGEN', cost: 500, iconPath: assetPath('/assets/images/regen-shield.png'), description: '50 HP recharging shield' },
        { id: 'heavy', name: 'Heavy Shield', categoryOrMode: 'HEAVY', cost: 1000, iconPath: assetPath('/assets/images/heavy-armor.png'), description: '50 HP full protection' },
        { id: 'eco_save', name: 'Full Eco Save', categoryOrMode: 'DENIED', cost: 0, iconPath: assetPath('/assets/images/warning.webp'), description: 'Save 100% credits' },
        { id: 'tactical_light', name: 'Tactical Light Guard', categoryOrMode: 'LIGHT', cost: 400, iconPath: assetPath('/assets/images/light-armor.png'), description: 'Light mobility shield' },
        { id: 'combat_regen', name: 'Energy Surge Shield', categoryOrMode: 'REGEN', cost: 500, iconPath: assetPath('/assets/images/regen-shield.png'), description: 'Self-repairing shield' },
        { id: 'titan_heavy', name: 'Titan Heavy Plate', categoryOrMode: 'HEAVY', cost: 1000, iconPath: assetPath('/assets/images/heavy-armor.png'), description: 'Max damage reduction' },
      ];
    }
    return [
      { id: 'single', name: 'Single Skill Focus', categoryOrMode: 'ALLOWED SKILLS', iconPath: assetPath('/assets/images/uses-1.webp'), description: 'Allowed to cast 1 specific skill' },
      { id: 'combo', name: 'Skill Combo Synergy', categoryOrMode: 'ALLOWED SKILLS', iconPath: assetPath('/assets/images/uses-2.webp'), description: 'Allowed to combine 2 skills' },
      { id: 'all', name: 'Full Utility: All Skills', categoryOrMode: 'ALLOWED SKILLS', iconPath: assetPath('/assets/images/uses-1.webp'), description: 'All agent skills allowed this round' },
      { id: 'ultimate', name: 'Ultimate Focus Surge', categoryOrMode: 'ALLOWED SKILLS', iconPath: assetPath('/assets/images/uses-2.webp'), description: 'Focus on Ultimate ability' },
    ];
  };

  const winningItem = getWinningItem();

  // Track Y position to highlight active center card
  useEffect(() => {
    const unsubscribe = yMotion.on('change', (latestY) => {
      const idx = Math.round((-latestY - cardHeight / 2) / itemTotalHeight);
      if (idx >= 0 && idx < items.length) {
        setActiveIndex(idx);
      }
    });
    return () => unsubscribe();
  }, [items, itemTotalHeight, yMotion]);

  // Generate strip with Fisher-Yates pre-shuffle and NO consecutive repeats
  useEffect(() => {
    const pool = shuffleArray(getPool());
    const generated: GenericRouletteItem[] = [];
    const fallbackItem = winningItem || pool[0];
    let lastId = '';

    for (let i = 0; i < winnerIndex + 12; i++) {
      if (i === winnerIndex) {
        generated.push(fallbackItem);
        lastId = fallbackItem.id;
      } else {
        const validPicks = pool.filter((p) => p.id !== lastId);
        const pickPool = validPicks.length > 0 ? validPicks : pool;
        const shuffledPickPool = shuffleArray(pickPool);
        const randomPick = shuffledPickPool[0];
        generated.push(randomPick);
        lastId = randomPick.id;
      }
    }

    setItems(generated);

    if (isSpinning) {
      setIsLanded(false);
      const duration = intensity === 'reduced' ? 1.0 : intensity === 'high' ? 6.0 : 4.5;

      controls.set({ y: 0 });
      yMotion.set(0);

      controls
        .start({
          y: targetY,
          transition: {
            duration,
            ease: [0.08, 0.92, 0.15, 1], // Deep friction deceleration curve
          },
        })
        .then(() => {
          setIsLanded(true);
          setActiveIndex(winnerIndex);
          if (onSpinComplete) onSpinComplete();
        });
    } else if (hasSpun && winningItem) {
      controls.set({ y: targetY });
      yMotion.set(targetY);
      setIsLanded(true);
      setActiveIndex(winnerIndex);
    } else {
      controls.set({ y: 0 });
      yMotion.set(0);
      setIsLanded(false);
      setActiveIndex(-1);
    }
  }, [winningWeapon, winningArmor, winningAbilityPlan, isSpinning, hasSpun, type]);

  const getTypeTheme = () => {
    switch (type) {
      case 'weapon':
        return {
          title: 'WEAPON ROULETTE',
          icon: Target,
          accent: '#ff4655',
          border: 'border-[#ff4655]',
          glow: 'rgba(255, 70, 85, 0.6)',
          badgeBg: 'bg-[#ff4655]/20 text-[#ff4655] border-[#ff4655]',
        };
      case 'ability':
        return {
          title: 'ABILITY ROULETTE',
          icon: Zap,
          accent: '#ffb400',
          border: 'border-[#ffb400]',
          glow: 'rgba(255, 180, 0, 0.6)',
          badgeBg: 'bg-[#ffb400]/20 text-[#ffb400] border-[#ffb400]',
        };
      case 'armor':
        return {
          title: 'SHIELD ROULETTE',
          icon: Shield,
          accent: '#00e5ff',
          border: 'border-[#00e5ff]',
          glow: 'rgba(0, 229, 255, 0.6)',
          badgeBg: 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]',
        };
    }
  };

  const theme = getTypeTheme();
  const TypeIcon = theme.icon;

  const showWinnerFooter = isLanded && hasSpun && winningItem;

  return (
    <div
      className={`w-full bg-[#0a1017] border-2 ${theme.border} val-clip-corner p-4 relative overflow-hidden shadow-2xl space-y-3 flex flex-col h-[680px]`}
      style={{ boxShadow: isSpinning ? `0 0 30px ${theme.glow}` : undefined }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 text-xs font-mono pb-2 border-b border-[#1e2d3d]">
        <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-white">
          <TypeIcon className="w-4 h-4" style={{ color: theme.accent }} />
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
          {theme.title}
        </span>

        <span className={`px-3 py-1 font-bold uppercase tracking-wider text-[11px] border ${theme.badgeBg}`}>
          {isSpinning ? 'SPINNING...' : showWinnerFooter ? 'REVEALED' : 'WAITING'}
        </span>
      </div>

      {/* Vertical Slot Machine Reel Window (Displays 5+ visible cards) */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 h-[560px] bg-[#060a0f] border border-[#1e2d3d] overflow-hidden flex justify-center items-center shadow-inner rounded"
      >
        {/* SIDE BRACKET POINTERS */}
        <div className="absolute top-1/2 left-1 -translate-y-1/2 z-30 pointer-events-none">
          <div
            className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px]"
            style={{ borderLeftColor: theme.accent, filter: `drop-shadow(0 0 10px ${theme.accent})` }}
          />
        </div>
        <div className="absolute top-1/2 right-1 -translate-y-1/2 z-30 pointer-events-none">
          <div
            className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px]"
            style={{ borderRightColor: theme.accent, filter: `drop-shadow(0 0 10px ${theme.accent})` }}
          />
        </div>

        {/* Minimal Top & Bottom Shadow Gradients */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#060a0f] to-transparent z-20 pointer-events-none opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#060a0f] to-transparent z-20 pointer-events-none opacity-80" />

        {/* Animated Vertical Reel Strip */}
        <motion.div
          animate={controls}
          style={{ y: yMotion }}
          className="flex flex-col items-center gap-[10px] absolute top-1/2 w-full px-3"
        >
          {items.map((item, idx) => {
            const isWinner = idx === winnerIndex;
            const isCurrentlyActive = idx === activeIndex;
            const showSelected = isWinner && isLanded && hasSpun;

            const isHighlighted = showSelected || (isCurrentlyActive && (isSpinning || hasSpun));

            const iconToDisplay =
              showSelected && item.selectedIconPath
                ? item.selectedIconPath
                : item.iconPath;

            return (
              <div
                key={`${item.id}_${idx}_${iconToDisplay}`}
                className={`flex-shrink-0 w-full h-[88px] flex items-center justify-between p-3 val-clip-corner border relative transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-[#1a2938] border-2 z-20 scale-105 opacity-100 shadow-2xl filter-none'
                    : 'bg-[#0d151f] border-[#182535] opacity-35 scale-90 filter blur-[3.5px] grayscale-[50%]'
                }`}
                style={{
                  borderColor: isHighlighted ? theme.accent : undefined,
                  boxShadow: isHighlighted ? `0 0 30px ${theme.glow}` : undefined,
                }}
              >
                {/* Left Side: Icon */}
                <div className="flex items-center justify-center w-24 h-14 px-1">
                  <AssetImage
                    src={iconToDisplay}
                    alt={item.name}
                    type={type === 'weapon' ? 'weapon' : type === 'armor' ? 'armor' : 'ability'}
                    fallbackName={item.name}
                    className={`max-w-full object-contain transition-all duration-300 ${type === 'weapon' ? 'max-h-10' : 'max-h-12'} ${
                      isHighlighted
                        ? 'scale-110 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]'
                        : ''
                    }`}
                  />
                </div>

                {/* Center / Right: Details */}
                <div className="flex-1 pl-3 flex flex-col justify-center text-left">
                  <span
                    className="text-[9px] font-mono uppercase tracking-wider font-bold"
                    style={{ color: isHighlighted ? theme.accent : '#8b9bb4' }}
                  >
                    {item.categoryOrMode}
                  </span>
                  <h4
                    className={`text-xs font-black font-tactical uppercase tracking-wider truncate max-w-[170px] ${
                      isHighlighted ? 'text-white text-sm font-bold' : 'text-[#ece8e1]'
                    }`}
                    style={{ color: isHighlighted ? theme.accent : undefined }}
                  >
                    {item.name}
                  </h4>

                  {/* Cost or Description */}
                  {item.cost !== undefined ? (
                    <div
                      className="flex items-center gap-1 mt-0.5 text-xs font-mono font-bold"
                      style={{ color: theme.accent }}
                    >
                      <AssetImage
                        src={assetPath('/assets/images/credits.webp')}
                        alt="¤"
                        type="armor"
                        fallbackName="¤"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span>{item.cost === 0 ? 'FREE' : `${item.cost} ¤`}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#8b9bb4] line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}

                  {/* Allowed Ability Icons */}
                  {item.abilities && item.abilities.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {item.abilities.map((ab: any) => (
                        <div
                          key={ab.id}
                          className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0a1017] border border-[#2a3e52] text-[9px] text-white rounded"
                        >
                          <AssetImage
                            src={ab.iconPath}
                            alt={ab.name}
                            type="ability"
                            fallbackName={ab.name}
                            className="w-3 h-3 object-contain"
                          />
                          <span className="truncate max-w-[60px] font-mono">{ab.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Result Card Footer inside Container */}
      {showWinnerFooter && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-[#0f1a24] border-2 flex items-center justify-between text-xs font-mono text-white rounded val-clip-corner"
          style={{ borderColor: theme.accent }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: theme.accent }} />
            <span className="text-[#8b9bb4]">REVEALED:</span>
            <span className="font-black text-sm tracking-wider uppercase font-tactical" style={{ color: theme.accent }}>
              {winningItem.name}
            </span>
          </div>

          {winningItem.cost !== undefined && (
            <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: theme.accent }}>
              <AssetImage
                src={assetPath('/assets/images/credits.webp')}
                alt="¤"
                type="armor"
                fallbackName="¤"
                className="w-4 h-4 object-contain"
              />
              <span>{winningItem.cost === 0 ? 'FREE' : `${winningItem.cost} ¤`}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
