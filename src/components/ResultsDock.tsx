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
      <div className="flex-1 flex flex-col gap-1 sm:gap-2 min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: isRevealed || isSpinning ? accent : undefined }} />
          <span className="truncate">{label}</span>
        </div>
        
        <div 
          className={`
            relative w-full h-24 sm:h-32 rounded-lg border flex flex-col items-center justify-center p-1.5 sm:p-3 transition-all duration-300
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
              <div className="h-10 sm:h-16 flex items-center justify-center gap-2 sm:gap-3 w-full mb-1 sm:mb-2">
                {type === 'ability' && item.abilities && item.abilities.length > 0 ? (
                  item.abilities.map((ab: any, idx: number) => (
                    <div key={ab.id || idx} className="relative flex items-center justify-center">
                      <AssetImage
                        src={ab.iconPath}
                        alt={ab.name}
                        type="ability"
                        fallbackName={ab.name}
                        className="max-w-[22px] max-h-[22px] sm:max-w-[40px] sm:max-h-[40px] object-contain drop-shadow-md"
                      />
                      {ab.assignedCharges && ab.assignedCharges > 1 && (
                        <span className="absolute -top-1.5 -right-2 bg-[#ffb400] text-slate-950 font-black text-[8px] sm:text-[10px] px-1 rounded-full leading-tight shadow-md border border-slate-900">
                          {ab.assignedCharges}x
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <AssetImage
                    src={type === 'weapon' ? item.selectedIconPath : type === 'armor' ? item.iconPath : item.abilities[0]?.iconPath}
                    alt={type === 'ability' ? item.title : item.name}
                    type={type}
                    className={`max-w-full object-contain drop-shadow-md ${type === 'weapon' ? 'max-h-[70%] sm:max-h-[85%]' : 'max-h-full'}`}
                  />
                )}
              </div>
              <span className="font-tactical font-black text-[10px] sm:text-sm uppercase tracking-wide text-white text-center w-full truncate px-0.5" style={{ color: accent }}>
                {type === 'ability'
                  ? item.abilities && item.abilities.length === 1 && item.abilities[0]?.assignedCharges && item.abilities[0].assignedCharges > 1
                    ? `${item.abilities[0].name} (${item.abilities[0].assignedCharges}x)`
                    : item.title
                  : item.name}
              </span>
            </motion.div>
          ) : isSpinning ? (
            <div className="flex flex-col items-center text-slate-400 animate-pulse scale-90 sm:scale-100">
              <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin mb-1 sm:mb-2" style={{ color: accent }} />
              <span className="text-[9px] sm:text-xs font-mono">SPINNING</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-600 scale-90 sm:scale-100">
              <HelpCircle className="w-5 h-5 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-50" />
              <span className="text-[9px] sm:text-xs font-mono">PENDING</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0a1017]/80 backdrop-blur-md border border-[#2a3e52] rounded-xl p-3 sm:p-6 shadow-2xl">
      <div className="flex flex-row items-stretch gap-2.5 sm:gap-6 w-full">
        {renderSlot('Weapon', Target, isWeaponRevealed, isWeaponSpinning, weapon, '#ff4655', 'weapon')}
        {renderSlot('Ability', Zap, isAbilityRevealed, isAbilitySpinning, abilityPlan, '#ffb400', 'ability')}
        {renderSlot('Shield', Shield, isArmorRevealed, isArmorSpinning, armor, '#00e5ff', 'armor')}
      </div>
    </div>
  );
};
