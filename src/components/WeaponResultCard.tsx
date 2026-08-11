import React from 'react';
import { Weapon } from '../types/domain';
import { AssetImage } from './AssetImage';
import { motion } from 'framer-motion';
import { Target, Coins, Trophy } from 'lucide-react';

type WeaponResultCardProps = {
  weapon: Weapon | null;
  isSpinning?: boolean;
  intensity?: 'reduced' | 'normal' | 'high';
};

export const WeaponResultCard: React.FC<WeaponResultCardProps> = ({
  weapon,
  isSpinning = false,
  intensity = 'normal',
}) => {
  if (isSpinning) {
    return (
      <div className="val-panel p-5 val-clip-corner border-t-2 border-t-[#ff4655] flex flex-col justify-between h-56 animate-pulse">
        <div className="flex items-center justify-between text-xs text-[#8b9bb4] uppercase tracking-wider font-mono">
          <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-[#ff4655]" /> Weapon</span>
          <span>Spinning...</span>
        </div>
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#ff4655] border-r-transparent border-b-[#ff4655] border-l-transparent animate-spin mb-2" />
          <span className="text-xs text-[#8b9bb4] font-mono">SPINNING ROULETTE...</span>
        </div>
      </div>
    );
  }

  if (!weapon) {
    return (
      <div className="val-panel p-5 val-clip-corner border border-[#2a3e52] flex flex-col justify-between h-56 text-[#8b9bb4]">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
          <Target className="w-4 h-4 text-[#8b9bb4]" /> Weapon
        </div>
        <div className="text-center my-auto">
          <p className="text-sm">No spin result yet</p>
          <p className="text-xs text-[#8b9bb4]/70 mt-1">Press Spin to reveal weapon</p>
        </div>
      </div>
    );
  }

  const activeIcon = weapon.selectedIconPath || weapon.iconPath;

  return (
    <motion.div
      initial={intensity === 'reduced' ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: intensity === 'high' ? 0.4 : 0.25 }}
      className="val-panel p-5 val-clip-corner border-t-2 border-t-[#ff4655] flex flex-col justify-between h-56 relative group hover:border-[#ff4655]"
    >
      {/* Top Meta */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#8b9bb4]">
          <Target className="w-4 h-4 text-[#ff4655]" /> Weapon
        </span>
        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#ff4655]/10 text-[#ff4655] border border-[#ff4655]/30 flex items-center gap-1">
          <Trophy className="w-3 h-3 text-[#ffb400]" />
          {weapon.category.replace('_', ' ')}
        </span>
      </div>

      {/* Center Display: Shows weapon-selected.png once landed! */}
      <div className="flex flex-col items-center justify-center my-auto text-center py-2">
        <AssetImage
          src={activeIcon}
          alt={weapon.name}
          type="weapon"
          fallbackName={weapon.name}
          className="h-20 max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(255,180,0,0.5)] group-hover:scale-110 transition-transform duration-300"
        />
        <h3 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-tactical mt-2">
          {weapon.name}
        </h3>
      </div>

      {/* Bottom Cost */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2a3e52]/60 text-xs font-mono">
        <span className="text-[#8b9bb4]">COST</span>
        <span className="flex items-center gap-1 text-[#ffb400] font-bold text-sm">
          <Coins className="w-3.5 h-3.5" />
          {weapon.cost === 0 ? 'FREE' : `${weapon.cost} ¤`}
        </span>
      </div>
    </motion.div>
  );
};
