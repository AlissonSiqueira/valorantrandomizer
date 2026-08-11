import React, { useEffect, useState } from 'react';
import { Weapon, ArmorOption, AbilityPlan } from '../types/domain';
import { WEAPONS } from '../config/weapons';
import { AssetImage } from './AssetImage';
import { assetPath } from '@/utils/assetPath';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { shuffleArray } from '../lib/random';
import { Target, Zap, Shield } from 'lucide-react';

export type SpinStage = 'idle' | 'weapon' | 'ability' | 'armor' | 'complete';

type RadialCasinoRouletteProps = {
  currentStage: SpinStage;
  winningWeapon?: Weapon | null;
  winningArmor?: ArmorOption | null;
  winningAbilityPlan?: AbilityPlan | null;
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
  abilities?: any[];
};

export const RadialCasinoRoulette: React.FC<RadialCasinoRouletteProps> = ({
  currentStage,
  winningWeapon,
  winningArmor,
  winningAbilityPlan,
  availableWeapons = WEAPONS,
  intensity = 'normal',
}) => {
  const [items, setItems] = useState<GenericRouletteItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const controls = useAnimation();
  const rotateMotion = useMotionValue(0);

  // Geometry configurations for the radial wheel
  const radius = 1200; // pixels
  const cardAngle = 13; // degrees per card - increased for generous spacing
  const winnerIndex = 48;
  const targetRotation = -(winnerIndex * cardAngle);



  const getWinningItem = (stage: SpinStage): GenericRouletteItem | null => {
    const effectiveStage = stage === 'complete' ? 'armor' : stage;
    if (effectiveStage === 'weapon' && winningWeapon) {
      return {
        id: winningWeapon.id,
        name: winningWeapon.name,
        categoryOrMode: winningWeapon.category.replace('_', ' '),
        cost: winningWeapon.cost,
        iconPath: winningWeapon.iconPath,
        selectedIconPath: winningWeapon.selectedIconPath,
      };
    }
    if (effectiveStage === 'ability' && winningAbilityPlan) {
      return {
        id: winningAbilityPlan.mode,
        name: winningAbilityPlan.title,
        categoryOrMode: 'ABILITY',
        iconPath: winningAbilityPlan.abilities[0]?.iconPath || assetPath('/assets/images/uses-1.webp'),
        abilities: winningAbilityPlan.abilities,
      };
    }
    if (effectiveStage === 'armor' && winningArmor) {
      return {
        id: winningArmor.id,
        name: winningArmor.name,
        categoryOrMode: 'SHIELD',
        cost: winningArmor.cost,
        iconPath: winningArmor.iconPath,
      };
    }
    return null;
  };

  const getPool = (stage: SpinStage): GenericRouletteItem[] => {
    // If idle, default to weapons. If complete, hold on armor.
    const currentPoolStage = stage === 'idle' ? 'weapon' : (stage === 'complete' ? 'armor' : stage);
    
    if (currentPoolStage === 'weapon') {
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
    if (currentPoolStage === 'ability') {
      return [
        { id: 'single', name: 'Single Skill', categoryOrMode: 'ABILITY', iconPath: assetPath('/assets/images/uses-1.webp') },
        { id: 'combo', name: 'Skill Combo', categoryOrMode: 'ABILITY', iconPath: assetPath('/assets/images/uses-2.webp') },
        { id: 'all', name: 'Full Utility', categoryOrMode: 'ABILITY', iconPath: assetPath('/assets/images/uses-1.webp') },
        { id: 'ultimate', name: 'Ultimate Focus', categoryOrMode: 'ABILITY', iconPath: assetPath('/assets/images/uses-2.webp') },
      ];
    }
    if (currentPoolStage === 'armor') {
      return [
        { id: 'none', name: 'No Shield', categoryOrMode: 'DENIED', cost: 0, iconPath: assetPath('/assets/images/warning.webp') },
        { id: 'light', name: 'Light Shield', categoryOrMode: 'LIGHT', cost: 400, iconPath: assetPath('/assets/images/light-armor.png') },
        { id: 'regen', name: 'Regen Shield', categoryOrMode: 'REGEN', cost: 500, iconPath: assetPath('/assets/images/regen-shield.png') },
        { id: 'heavy', name: 'Heavy Shield', categoryOrMode: 'HEAVY', cost: 1000, iconPath: assetPath('/assets/images/heavy-armor.png') },
      ];
    }
    return [];
  };

  // Update items array when stage changes
  useEffect(() => {
    // Always generate items even when idle so the wheel is never empty
    const pool = shuffleArray(getPool(currentStage));
    const fallbackItem = getWinningItem(currentStage) || pool[0];
    const generated: GenericRouletteItem[] = [];
    let lastId = '';

    for (let i = 0; i < winnerIndex + 15; i++) {
      if (i === winnerIndex) {
        generated.push(fallbackItem);
        lastId = fallbackItem.id;
      } else {
        const validPicks = pool.filter((p) => p.id !== lastId);
        const pickPool = validPicks.length > 0 ? validPicks : pool;
        const shuffledPickPool = shuffleArray(pickPool);
        generated.push(shuffledPickPool[0]);
        lastId = shuffledPickPool[0].id;
      }
    }

    setItems(generated);

    // Trigger spin
    const duration = intensity === 'reduced' ? 1.0 : intensity === 'high' ? 6.0 : 4.5;
    
    if (currentStage === 'idle' || currentStage === 'complete') {
      // Just set it to the target immediately or leave it at 0
      controls.set({ rotate: currentStage === 'complete' ? targetRotation : 0 });
      rotateMotion.set(currentStage === 'complete' ? targetRotation : 0);
      if (currentStage === 'complete') setHasLanded(true);
    } else {
      // Reset to start instantly without animation
      controls.set({ rotate: 0 });
      rotateMotion.set(0);
      setHasLanded(false);

      // Spin!
      controls
        .start({
          rotate: targetRotation,
          transition: {
            duration: duration - 0.2, // Leave a little buffer before next stage
            ease: [0.08, 0.92, 0.15, 1], // Custom deep friction decelerator
          },
        }).then(() => {
          setHasLanded(true);
        });
    }

  }, [currentStage, winningWeapon, winningArmor, winningAbilityPlan]);

  // Track active index for sound or visual popping during spin
  useEffect(() => {
    const unsubscribe = rotateMotion.on('change', (latestRotate) => {
      const idx = Math.round(-latestRotate / cardAngle);
      if (idx >= 0 && idx < items.length) {
        setActiveIndex(idx);
      }
    });
    return () => unsubscribe();
  }, [items, cardAngle, rotateMotion]);

  // Theme helper
  const getTheme = () => {
    if (currentStage === 'weapon') return { accent: '#ff4655', icon: Target, label: 'WEAPON PHASE' };
    if (currentStage === 'ability') return { accent: '#ffb400', icon: Zap, label: 'ABILITY PHASE' };
    if (currentStage === 'armor') return { accent: '#00e5ff', icon: Shield, label: 'SHIELD PHASE' };
    return { accent: '#8b9bb4', icon: null, label: 'WAITING...' };
  };

  const theme = getTheme();
  const isSpinning = currentStage === 'weapon' || currentStage === 'ability' || currentStage === 'armor';

  return (
    <div className="relative w-full h-[635px] flex justify-center overflow-hidden bg-transparent perspective-[1000px] select-none">
      
      {/* Background soft glow */}
      {isSpinning && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 transition-colors duration-500" 
          style={{ background: `radial-gradient(circle at top center, ${theme.accent}, transparent 60%)` }}
        />
      )}

      {/* Main Wheel Container */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-full h-full flex justify-center pointer-events-none">
        
        {/* The rotating anchor */}
        <motion.div
          animate={controls}
          style={{ 
            rotate: rotateMotion,
            transformOrigin: `50% ${radius}px`,
            position: 'absolute',
            top: 0,
            left: '50%',
            translateX: '-50%'
          }}
          className="w-0 h-0"
        >
          {items.map((item, i) => {
            const angle = i * cardAngle;
            const isActive = i === activeIndex;

            const distance = Math.abs(i - activeIndex);
            if (distance > 15) return null;

            const iconToDisplay = item.iconPath;

            return (
              <div
                key={`${item.id}_${i}`}
                className="absolute"
                style={{
                  transformOrigin: `50% ${radius}px`,
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  top: 0,
                  left: '50%',
                }}
              >
                {/* The Card */}
                <motion.div 
                  animate={isActive && hasLanded ? {
                    boxShadow: [
                      `0 0 25px ${theme.accent}60`,
                      `0 0 60px ${theme.accent}FF`,
                      `0 0 35px ${theme.accent}80`
                    ],
                    scale: [1.1, 1.14, 1.1]
                  } : isActive ? {
                    scale: 1.1,
                    boxShadow: '0 0 0px transparent'
                  } : { 
                    scale: 0.8, 
                    boxShadow: '0 0 0px transparent' 
                  }}
                  transition={isActive && hasLanded ? { duration: 0.6 } : { duration: 0.3 }}
                  className={`
                    w-64 h-84 sm:w-76 sm:h-[400px]
                    flex flex-col items-center justify-between p-5 sm:p-7
                    transition-colors duration-300 rounded-2xl
                    ${isActive 
                      ? 'bg-[#1a2938] border-2 border-opacity-100 z-20 opacity-100' 
                      : 'bg-[#0f1923]/40 border-opacity-20 z-10 opacity-30 blur-[4px] grayscale-[70%]'
                    }
                  `}
                  style={{
                    borderColor: isActive ? theme.accent : '#2a3e52',
                  }}
                >
                  <span className="text-xs sm:text-base font-mono font-bold text-slate-400 uppercase w-full text-center truncate">
                    {item.categoryOrMode}
                  </span>
                  
                  <div className="flex-1 flex flex-wrap items-center justify-center gap-3 w-full my-3">
                    {item.abilities && item.abilities.length > 1 ? (
                      item.abilities.map((ab: any, idx: number) => (
                        <AssetImage
                          key={ab.id || idx}
                          src={ab.iconPath}
                          alt={ab.name}
                          type="ability"
                          fallbackName={ab.name}
                          className={`max-w-[56px] max-h-[56px] sm:max-w-[64px] sm:max-h-[64px] object-contain transition-all ${isActive ? 'drop-shadow-md' : 'grayscale-[40%]'}`}
                        />
                      ))
                    ) : (
                      <AssetImage
                        src={iconToDisplay}
                        alt={item.name}
                        type="weapon"
                        fallbackName={item.name}
                        className={`max-w-full max-h-36 sm:max-h-44 object-contain transition-all ${isActive ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''}`}
                      />
                    )}
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <span 
                      className="text-xs sm:text-sm font-black font-tactical uppercase tracking-wider text-white text-center w-full truncate"
                      style={{ color: isActive ? theme.accent : undefined }}
                    >
                      {item.name}
                    </span>
                    {item.cost !== undefined && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-bold text-slate-300">
                        <AssetImage
                          src={assetPath('/assets/images/credits.webp')}
                          alt="¤"
                          type="armor"
                          fallbackName="¤"
                          className="w-3.5 h-3.5 object-contain opacity-70"
                        />
                        <span>{item.cost === 0 ? 'FREE' : `${item.cost}`}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Center Marker Pointer */}
      {isSpinning && (
        <div className="absolute top-[44px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none drop-shadow-xl">
          <div 
            className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px]"
            style={{ borderTopColor: theme.accent, filter: `drop-shadow(0 0 8px ${theme.accent})` }}
          />
        </div>
      )}

      {/* Bottom fade mask to softly blend with the container */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a1017] to-transparent pointer-events-none z-20" />
    </div>
  );
};
