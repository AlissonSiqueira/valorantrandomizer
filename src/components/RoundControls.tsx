import React from 'react';
import { AssetImage } from './AssetImage';
import { Dices } from 'lucide-react';
import { motion } from 'framer-motion';

type RoundControlsProps = {
  availableCredits: number;
  isSpinning: boolean;
  onSpin: () => void;
  onCreditsChange: (credits: number) => void;
};

export const RoundControls: React.FC<RoundControlsProps> = ({
  availableCredits,
  isSpinning,
  onSpin,
  onCreditsChange,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
      
      {/* Main Big Spin Button - Free Floating */}
      <motion.button
        type="button"
        onClick={onSpin}
        disabled={isSpinning}
        whileHover={{ scale: isSpinning ? 1 : 1.05 }}
        whileTap={{ scale: isSpinning ? 1 : 0.95 }}
        className={`w-full max-w-2xl py-6 px-10 font-tactical font-black text-3xl tracking-widest uppercase text-white flex items-center justify-center gap-4 rounded-2xl transition-all duration-300 shadow-2xl ${
          isSpinning
            ? 'bg-[#152230] border border-[#2a3e52] cursor-not-allowed opacity-50 grayscale'
            : 'bg-gradient-to-r from-[#ff4655] to-[#d63c48] shadow-[0_10px_40px_rgba(255,70,85,0.5)] cursor-pointer hover:shadow-[0_15px_50px_rgba(255,70,85,0.7)]'
        }`}
      >
        <Dices className={`w-8 h-8 ${isSpinning ? 'animate-spin text-slate-500' : 'text-white'}`} />
        {isSpinning ? 'SPINNING...' : 'SPIN ROULETTE'}
      </motion.button>

      {/* Manual Credits Input - Free Floating */}
      <div className="flex items-center gap-4">
        <label htmlFor="credits-input-manual" className="text-sm font-mono text-slate-400 font-bold uppercase tracking-wider">
          AVAILABLE CREDITS:
        </label>
        <div className="flex items-center gap-2 bg-[#152230]/60 backdrop-blur border border-[#2a3e52] px-4 py-2 rounded-xl">
          <input
            id="credits-input-manual"
            type="number"
            min="0"
            max="9000"
            step="50"
            value={availableCredits}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10);
              if (isNaN(val)) val = 0;
              if (val > 9000) val = 9000;
              onCreditsChange(val);
            }}
            className="w-24 bg-transparent text-center font-mono font-bold text-2xl text-[#ffb400] outline-none"
          />
          <AssetImage
            src="/assets/images/credits.webp"
            alt="¤"
            type="armor"
            fallbackName="¤"
            className="w-6 h-6 object-contain"
          />
        </div>
      </div>

    </div>
  );
};
