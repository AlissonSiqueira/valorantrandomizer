import React from 'react';
import { AbilityPlan } from '../types/domain';
import { AssetImage } from './AssetImage';
import { assetPath } from '@/utils/assetPath';
import { motion } from 'framer-motion';
import { Zap, Flame, Sparkles, Award } from 'lucide-react';

type AbilityResultCardProps = {
  abilityPlan: AbilityPlan | null;
  isSpinning?: boolean;
  intensity?: 'reduced' | 'normal' | 'high';
};

export const AbilityResultCard: React.FC<AbilityResultCardProps> = ({
  abilityPlan,
  isSpinning = false,
  intensity = 'normal',
}) => {
  if (isSpinning) {
    return (
      <div className="val-panel p-5 val-clip-corner border-t-2 border-t-[#ffb400] flex flex-col justify-between h-52 animate-pulse">
        <div className="flex items-center justify-between text-xs text-[#8b9bb4] uppercase tracking-wider font-mono">
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#ffb400]" /> Strategy</span>
          <span>Spinning...</span>
        </div>
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#ffb400] border-r-transparent border-b-[#ffb400] border-l-transparent animate-spin mb-2" />
          <span className="text-xs text-[#8b9bb4] font-mono">FORMULATING STRATEGY</span>
        </div>
      </div>
    );
  }

  if (!abilityPlan) {
    return (
      <div className="val-panel p-5 val-clip-corner border border-[#2a3e52] flex flex-col justify-between h-52 text-[#8b9bb4]">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
          <Zap className="w-4 h-4 text-[#8b9bb4]" /> Strategy
        </div>
        <div className="text-center my-auto">
          <p className="text-sm">No spin result yet</p>
          <p className="text-xs text-[#8b9bb4]/70 mt-1">Press Spin to get an ability playstyle</p>
        </div>
      </div>
    );
  }

  const getModeMeta = (mode: AbilityPlan['mode']) => {
    switch (mode) {
      case 'combo':
        return { icon: Flame, color: 'text-[#ff4655]', bg: 'bg-[#ff4655]/10', label: 'COMBO' };
      case 'all':
        return { icon: Sparkles, color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10', label: 'FULL UTILITY' };
      case 'ultimate_focus':
        return { icon: Sparkles, color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10', label: 'ULTIMATE' };
      default:
        return { icon: Award, color: 'text-[#ffb400]', bg: 'bg-[#ffb400]/10', label: 'SINGLE FOCUS' };
    }
  };

  const modeMeta = getModeMeta(abilityPlan.mode);
  const ModeIcon = modeMeta.icon;

  return (
    <motion.div
      initial={intensity === 'reduced' ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: intensity === 'high' ? 0.4 : 0.25, delay: 0.1 }}
      className="val-panel p-5 val-clip-corner border-t-2 border-t-[#ffb400] flex flex-col justify-between h-52 relative group"
    >
      {/* Top Meta */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#8b9bb4]">
          <Zap className="w-4 h-4 text-[#ffb400]" /> Strategy
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase border border-current ${modeMeta.bg} ${modeMeta.color}`}
        >
          <ModeIcon className="w-3 h-3" />
          {modeMeta.label}
        </span>
      </div>

      {/* Center Details */}
      <div className="my-auto py-1">
        <h3 className="text-lg font-bold tracking-wide text-white font-tactical line-clamp-1">
          {abilityPlan.title}
        </h3>
        <p className="text-xs text-[#8b9bb4] line-clamp-2 mt-1 leading-relaxed">
          {abilityPlan.description}
        </p>

        {/* Ability Icons List */}
        {abilityPlan.abilities && abilityPlan.abilities.length > 0 && (
          <div className="flex items-center gap-2 mt-2.5">
            {abilityPlan.abilities.map((ab) => (
              <div
                key={ab.id}
                className="flex items-center gap-1.5 px-2 py-1 bg-[#0f1923] border border-[#2a3e52] rounded text-xs text-[#ece8e1]"
                title={`${ab.name} (${ab.slot})`}
              >
                <AssetImage
                  src={ab.iconPath}
                  alt={ab.name}
                  type="ability"
                  fallbackName={ab.name}
                  className="w-4 h-4 object-contain"
                />
                <span className="font-semibold text-[11px] truncate max-w-[100px]">{ab.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2a3e52]/60 text-[11px] font-mono text-[#8b9bb4]">
        <span className="flex items-center gap-1">
          <AssetImage
            src={abilityPlan.abilities.length === 2 ? assetPath('/assets/images/uses-2.webp') : assetPath('/assets/images/uses-1.webp')}
            alt="Charges"
            type="ability"
            fallbackName="USE"
            className="w-4 h-4 object-contain"
          />
          ABILITY INSTRUCTION
        </span>
        <span className="text-[#ffb400] font-semibold">{abilityPlan.abilities.length} ABILITY REF</span>
      </div>
    </motion.div>
  );
};
