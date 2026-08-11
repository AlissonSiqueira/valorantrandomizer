import React from 'react';
import { ArmorOption } from '../types/domain';
import { AssetImage } from './AssetImage';
import { assetPath } from '@/utils/assetPath';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

type ArmorResultCardProps = {
  armor: ArmorOption | null;
  isSpinning?: boolean;
  intensity?: 'reduced' | 'normal' | 'high';
};

export const ArmorResultCard: React.FC<ArmorResultCardProps> = ({
  armor,
  isSpinning = false,
  intensity = 'normal',
}) => {
  if (isSpinning) {
    return (
      <div className="val-panel p-5 val-clip-corner border-t-2 border-t-[#00e5ff] flex flex-col justify-between h-56 animate-pulse">
        <div className="flex items-center justify-between text-xs text-[#8b9bb4] uppercase tracking-wider font-mono">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#00e5ff]" /> Armor</span>
          <span>Spinning...</span>
        </div>
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#00e5ff] border-r-transparent border-b-[#00e5ff] border-l-transparent animate-spin mb-2" />
          <span className="text-xs text-[#8b9bb4] font-mono">SELECTING SHIELD...</span>
        </div>
      </div>
    );
  }

  if (!armor) {
    return (
      <div className="val-panel p-5 val-clip-corner border border-[#2a3e52] flex flex-col justify-between h-56 text-[#8b9bb4]">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
          <Shield className="w-4 h-4 text-[#8b9bb4]" /> Armor
        </div>
        <div className="text-center my-auto">
          <p className="text-sm">No spin result yet</p>
          <p className="text-xs text-[#8b9bb4]/70 mt-1">Press Spin to select armor</p>
        </div>
      </div>
    );
  }

  const activeIcon = armor.selectedIconPath || armor.iconPath;

  return (
    <motion.div
      initial={intensity === 'reduced' ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: intensity === 'high' ? 0.4 : 0.25, delay: 0.05 }}
      className="val-panel p-5 val-clip-corner border-t-2 border-t-[#00e5ff] flex flex-col justify-between h-56 relative group hover:border-[#00e5ff]"
    >
      {/* Top Meta */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#8b9bb4]">
          <Shield className="w-4 h-4 text-[#00e5ff]" /> Armor
        </span>
        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
          {armor.id}
        </span>
      </div>

      {/* Center Display */}
      <div className="flex flex-col items-center justify-center my-auto text-center py-1">
        <AssetImage
          src={activeIcon}
          alt={armor.name}
          type="armor"
          fallbackName={armor.name}
          className="h-16 max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-110 transition-transform duration-300"
        />
        <h3 className="text-xl font-bold tracking-wider text-white uppercase font-tactical mt-1">
          {armor.name}
        </h3>
        <p className="text-xs text-[#8b9bb4] line-clamp-2 px-2 mt-0.5">
          {armor.description}
        </p>
      </div>

      {/* Bottom Cost */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2a3e52]/60 text-xs font-mono">
        <span className="text-[#8b9bb4]">COST</span>
        <span className="flex items-center gap-1 text-[#ffb400] font-bold text-sm">
          <AssetImage
            src={assetPath('/assets/images/credits.webp')}
            alt="¤"
            type="armor"
            fallbackName="¤"
            className="w-4 h-4 object-contain"
          />
          {armor.cost === 0 ? 'FREE' : `${armor.cost} ¤`}
        </span>
      </div>
    </motion.div>
  );
};
