import React, { useEffect, useState, useRef } from 'react';
import { Weapon, ArmorOption, AbilityPlan } from '../types/domain';
import { WEAPONS } from '../config/weapons';
import { ARMOR_OPTIONS } from '../config/armor';
import { AssetImage } from './AssetImage';
import { assetPath } from '@/utils/assetPath';
import { motion, useAnimation } from 'framer-motion';
import { Trophy, Sparkles, Target, Shield, Zap } from 'lucide-react';

export type RouletteType = 'weapon' | 'ability' | 'armor';

type CasinoRouletteProps = {
  type: RouletteType;
  winningWeapon?: Weapon | null;
  winningArmor?: ArmorOption | null;
  winningAbilityPlan?: AbilityPlan | null;
  isSpinning: boolean;
  onSpinComplete?: () => void;
  availableWeapons?: Weapon[];
  availableArmor?: ArmorOption[];
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

export const CasinoRoulette: React.FC<CasinoRouletteProps> = ({
  type,
  winningWeapon,
  winningArmor,
  winningAbilityPlan,
  isSpinning,
  onSpinComplete,
  availableWeapons = WEAPONS,
  availableArmor = ARMOR_OPTIONS,
  intensity = 'normal',
}) => {
  const [items, setItems] = useState<GenericRouletteItem[]>([]);
  const [isLanded, setIsLanded] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const cardWidth = 150; // width of card in px
  const cardGap = 14;   // gap in px
  const itemTotalWidth = cardWidth + cardGap; // 164px per card step
  const winnerIndex = 35; // index of winning card in strip

  const targetX = -(winnerIndex * itemTotalWidth + cardWidth / 2);

  // Convert winning target into generic item format based on roulette type
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
        categoryOrMode: winningArmor.id,
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
        categoryOrMode: winningAbilityPlan.mode.toUpperCase(),
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
      const pool = availableArmor.length > 0 ? availableArmor : ARMOR_OPTIONS;
      return pool.map((a) => ({
        id: a.id,
        name: a.name,
        categoryOrMode: a.id,
        cost: a.cost,
        iconPath: a.iconPath,
        selectedIconPath: a.selectedIconPath,
        description: a.description,
      }));
    }
    // Ability Strategy Pool
    return [
      { id: 'single', name: 'Single Ability Focus', categoryOrMode: 'SINGLE', iconPath: assetPath('/assets/images/uses-1.webp'), description: 'Maximize single ability value' },
      { id: 'combo', name: 'Ability Combo Synergy', categoryOrMode: 'COMBO', iconPath: assetPath('/assets/images/uses-2.webp'), description: 'Combine 2 abilities in sequence' },
      { id: 'restriction', name: 'Challenge Restriction', categoryOrMode: 'RESTRICTION', iconPath: assetPath('/assets/images/warning.webp'), description: 'Do NOT cast a specific ability' },
      { id: 'ultimate', name: 'Ultimate Focus Surge', categoryOrMode: 'ULTIMATE', iconPath: assetPath('/assets/images/uses-1.webp'), description: 'Play around Ultimate ability' },
    ];
  };

  const winningItem = getWinningItem();

  useEffect(() => {
    if (!winningItem) return;

    const pool = getPool();
    const generated: GenericRouletteItem[] = [];

    for (let i = 0; i < winnerIndex + 10; i++) {
      if (i === winnerIndex) {
        generated.push(winningItem);
      } else {
        const randomPick = pool[Math.floor(Math.random() * pool.length)];
        generated.push(randomPick);
      }
    }

    setItems(generated);

    if (isSpinning) {
      setIsLanded(false);
      const duration = intensity === 'reduced' ? 0.3 : intensity === 'high' ? 2.2 : 1.5;

      controls.set({ x: 0 });
      controls
        .start({
          x: targetX,
          transition: {
            duration,
            ease: [0.12, 0.88, 0.25, 1], // CSGO / Casino friction deceleration
          },
        })
        .then(() => {
          setIsLanded(true);
          if (onSpinComplete) onSpinComplete();
        });
    } else {
      controls.set({ x: targetX });
      setIsLanded(true);
    }
  }, [winningWeapon, winningArmor, winningAbilityPlan, isSpinning, type]);

  const getTypeTheme = () => {
    switch (type) {
      case 'weapon':
        return {
          title: 'WEAPON ROULETTE',
          icon: Target,
          accent: '#ff4655',
          border: 'border-[#ff4655]/70',
          badgeBg: 'bg-[#ff4655]/20 text-[#ff4655] border-[#ff4655]',
        };
      case 'ability':
        return {
          title: 'ABILITY STRATEGY ROULETTE',
          icon: Zap,
          accent: '#ffb400',
          border: 'border-[#ffb400]/70',
          badgeBg: 'bg-[#ffb400]/20 text-[#ffb400] border-[#ffb400]',
        };
      case 'armor':
        return {
          title: 'SHIELD & ARMOR ROULETTE',
          icon: Shield,
          accent: '#00e5ff',
          border: 'border-[#00e5ff]/70',
          badgeBg: 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]',
        };
    }
  };

  const theme = getTypeTheme();
  const TypeIcon = theme.icon;

  if (!winningItem && !isSpinning) {
    return (
      <div className={`w-full val-panel p-6 val-clip-corner border ${theme.border} flex flex-col items-center justify-center min-h-[220px] text-center text-[#8b9bb4]`}>
        <TypeIcon className="w-10 h-10 mb-2 animate-pulse" style={{ color: theme.accent }} />
        <h3 className="text-lg font-bold font-tactical uppercase text-white tracking-wider">
          {theme.title} READY
        </h3>
        <p className="text-xs text-[#8b9bb4] mt-1 max-w-sm">
          Click <span className="text-[#ff4655] font-bold">SPIN</span> to start the sequential casino roulette!
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full bg-[#0b131c] border-2 ${theme.border} val-clip-corner p-4 sm:p-5 relative overflow-hidden shadow-2xl space-y-4`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-1 text-xs font-mono">
        <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-white">
          <TypeIcon className="w-4 h-4" style={{ color: theme.accent }} />
          <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
          {theme.title}
        </span>

        <span className={`px-3 py-1 font-bold uppercase tracking-wider text-xs border ${theme.badgeBg}`}>
          {isSpinning ? 'SPINNING...' : 'RESULT REVEALED!'}
        </span>
      </div>

      {/* Roulette Strip Window */}
      <div
        ref={containerRef}
        className="relative w-full h-48 bg-[#0a1017] border border-[#1e2d3d] overflow-hidden flex items-center shadow-inner"
      >
        {/* CENTER LASER ALIGNMENT POINTER */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center justify-between py-0.5">
          <div
            className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[12px]"
            style={{ borderTopColor: theme.accent, filter: `drop-shadow(0 0 8px ${theme.accent})` }}
          />
          <div
            className="w-[2px] h-full opacity-90"
            style={{ backgroundColor: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }}
          />
          <div
            className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px]"
            style={{ borderBottomColor: theme.accent, filter: `drop-shadow(0 0 8px ${theme.accent})` }}
          />
        </div>

        {/* Side Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a1017] via-[#0a1017]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a1017] via-[#0a1017]/80 to-transparent z-20 pointer-events-none" />

        {/* Animated Horizontal Strip */}
        <motion.div
          animate={controls}
          className="flex items-center gap-[14px] absolute left-1/2"
          style={{ x: 0 }}
        >
          {items.map((item, idx) => {
            const isTarget = idx === winnerIndex;
            const showSelected = isTarget && isLanded;

            const iconToDisplay =
              showSelected && item.selectedIconPath
                ? item.selectedIconPath
                : item.iconPath;

            return (
              <div
                key={`${item.id}_${idx}`}
                className={`flex-shrink-0 w-[150px] h-40 flex flex-col justify-between p-3 transition-all duration-300 val-clip-corner border relative ${
                  showSelected
                    ? 'bg-[#1e3042] border-2 shadow-[0_0_25px_rgba(255,180,0,0.7)] scale-105 z-10'
                    : 'bg-[#121c27] border-[#1e2d3d] opacity-75'
                }`}
                style={{ borderColor: showSelected ? theme.accent : undefined }}
              >
                {/* Top Category / Mode Tag */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#8b9bb4]">
                  <span className="uppercase tracking-wider font-bold truncate max-w-[120px]">
                    {item.categoryOrMode}
                  </span>
                </div>

                {/* Center Image & Title */}
                <div className="my-auto flex flex-col items-center justify-center py-1">
                  <AssetImage
                    src={iconToDisplay}
                    alt={item.name}
                    type={type === 'weapon' ? 'weapon' : type === 'armor' ? 'armor' : 'ability'}
                    fallbackName={item.name}
                    className={`max-h-12 max-w-full object-contain transition-all duration-300 ${
                      showSelected ? 'scale-110 filter drop-shadow-[0_0_12px_rgba(255,180,0,0.8)]' : ''
                    }`}
                  />
                  <span
                    className={`text-sm font-black font-tactical uppercase tracking-wider mt-1 truncate max-w-[130px] text-center ${
                      showSelected ? 'text-white font-bold text-base' : 'text-[#ece8e1]'
                    }`}
                    style={{ color: showSelected ? theme.accent : undefined }}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Bottom Footer Details */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#1e2d3d]">
                  {item.cost !== undefined ? (
                    <>
                      <AssetImage
                        src={assetPath('/assets/images/credits.webp')}
                        alt="¤"
                        type="armor"
                        fallbackName="¤"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span className="font-bold" style={{ color: theme.accent }}>
                        {item.cost === 0 ? 'FREE' : `${item.cost} ¤`}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-[#8b9bb4] truncate">{item.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Winner Highlight Footer */}
      {isLanded && winningItem && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 px-4 bg-[#0f1a24] border-2 text-center flex flex-wrap items-center justify-between text-xs font-mono text-white rounded val-clip-corner gap-2"
          style={{ borderColor: theme.accent }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: theme.accent }} />
            <span className="text-[#8b9bb4]">REVEALED {type.toUpperCase()}:</span>
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
