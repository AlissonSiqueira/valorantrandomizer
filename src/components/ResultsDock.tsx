import React from 'react';
import { Weapon, ArmorOption, AbilityPlan } from '../types/domain';
import { AssetImage } from './AssetImage';
import { Target, Zap, Shield, HelpCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpinStage } from '../store/useRandomizerStore';

type ResultsDockProps = {
  currentStage: SpinStage;
  weapon: Weapon | null;
  abilityPlan: AbilityPlan | null;
  armor: ArmorOption | null;
};

export const ResultsDock: React.FC<ResultsDockProps> = ({
  currentStage,
  weapon,
  abilityPlan,
  armor
}) => {
  
  const isWeaponRevealed = currentStage === 'ability' || currentStage === 'armor' || currentStage === 'complete';
  const isAbilityRevealed = currentStage === 'armor' || currentStage === 'complete';
  const isArmorRevealed = currentStage === 'complete';

  const isWeaponSpinning = currentStage === 'weapon';
  const isAbilitySpinning = currentStage === 'ability';
  const isArmorSpinning = currentStage === 'armor';

  const renderSlot = (
    label: string, 
    Icon: any, 
    isRevealed: boolean, 
    isSpinning: boolean, 
    item: any, 
    accent: string,
    type: 'weapon' | 'ability' | 'armor'
  ) => {
    
    return (
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
          <Icon className="w-4 h-4" style={{ color: isRevealed || isSpinning ? accent : undefined }} />
          {label}
        </div>
        
        <div 
          className={`
            relative w-full h-32 rounded-lg border flex flex-col items-center justify-center p-3 transition-all duration-300
            ${isRevealed ? 'bg-[#152230] opacity-100 shadow-xl' : isSpinning ? 'bg-[#0f1923] border-dashed opacity-80' : 'bg-[#0a1017] opacity-40'}
          `}
          style={{ 
            borderColor: isRevealed ? accent : isSpinning ? accent : '#2a3e52',
            boxShadow: isRevealed ? `0 4px 20px ${accent}20` : undefined
          }}
        >
          {isRevealed && item ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="flex flex-col items-center w-full"
            >
              <div className="h-16 flex items-center justify-center gap-2 w-full mb-2">
                {type === 'ability' && item.abilities && item.abilities.length > 1 ? (
                  item.abilities.map((ab: any, idx: number) => (
                    <AssetImage
                      key={ab.id || idx}
                      src={ab.iconPath}
                      alt={ab.name}
                      type="ability"
                      fallbackName={ab.name}
                      className="max-w-[40px] max-h-[40px] object-contain drop-shadow-md"
                    />
                  ))
                ) : (
                  <AssetImage
                    src={type === 'weapon' ? item.selectedIconPath : type === 'armor' ? item.iconPath : item.abilities[0]?.iconPath}
                    alt={type === 'ability' ? item.title : item.name}
                    type={type}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                )}
              </div>
              <span className="font-tactical font-black text-sm uppercase tracking-wide text-white text-center w-full truncate" style={{ color: accent }}>
                {type === 'ability' ? item.title : item.name}
              </span>
            </motion.div>
          ) : isSpinning ? (
            <div className="flex flex-col items-center text-slate-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin mb-2" style={{ color: accent }} />
              <span className="text-xs font-mono">SPINNING...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-600">
              <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-mono">PENDING</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0a1017]/80 backdrop-blur-md border border-[#2a3e52] rounded-xl p-4 sm:p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {renderSlot('Weapon', Target, isWeaponRevealed, isWeaponSpinning, weapon, '#ff4655', 'weapon')}
        {renderSlot('Ability', Zap, isAbilityRevealed, isAbilitySpinning, abilityPlan, '#ffb400', 'ability')}
        {renderSlot('Shield', Shield, isArmorRevealed, isArmorSpinning, armor, '#00e5ff', 'armor')}
      </div>
    </div>
  );
};
