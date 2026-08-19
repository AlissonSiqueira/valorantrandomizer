import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Trophy, Sparkles, Swords } from 'lucide-react';
import { STRATS, Strat } from '../config/strats';

type StratRouletteProps = {
  isSpinning: boolean;
  hasSpun: boolean;
  winningStrat: Strat | null;
  onSpinComplete?: () => void;
  intensity?: 'reduced' | 'normal' | 'high';
};

const ACCENT = '#39ff14';
const GLOW = 'rgba(57, 255, 20, 0.6)';

export const StratRoulette: React.FC<StratRouletteProps> = ({
  isSpinning,
  hasSpun,
  winningStrat,
  onSpinComplete,
  intensity = 'normal',
}) => {
  const [items, setItems] = useState<Strat[]>([]);
  const [isLanded, setIsLanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const yMotion = useMotionValue(0);

  const cardHeight = 96;
  const cardGap = 10;
  const itemTotalHeight = cardHeight + cardGap;
  const winnerIndex = 42;

  const targetY = -(winnerIndex * itemTotalHeight + cardHeight / 2);

  // Highlight the active card as it scrolls by
  useEffect(() => {
    const unsubscribe = yMotion.on('change', (latestY) => {
      const idx = Math.round((-latestY - cardHeight / 2) / itemTotalHeight);
      if (idx >= 0 && idx < items.length) {
        setActiveIndex(idx);
      }
    });
    return () => unsubscribe();
  }, [items, itemTotalHeight, yMotion]);

  // Build strip and trigger animation
  useEffect(() => {
    if (!winningStrat && !isSpinning) return;

    const pool = [...STRATS];
    const generated: Strat[] = [];
    const fallback = winningStrat || pool[0];
    let lastId = '';

    for (let i = 0; i < winnerIndex + 12; i++) {
      if (i === winnerIndex) {
        generated.push(fallback);
        lastId = fallback.id;
      } else {
        const valid = pool.filter((s) => s.id !== lastId);
        const pick = valid[Math.floor(Math.random() * valid.length)];
        generated.push(pick);
        lastId = pick.id;
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
            ease: [0.08, 0.92, 0.15, 1],
          },
        })
        .then(() => {
          setIsLanded(true);
          setActiveIndex(winnerIndex);
          if (onSpinComplete) onSpinComplete();
        });
    } else if (hasSpun && winningStrat) {
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
  }, [winningStrat, isSpinning, hasSpun]);

  const showWinnerFooter = isLanded && hasSpun && winningStrat;

  if (!winningStrat && !isSpinning) {
    return (
      <div
        className="w-full bg-[#0a1017] border-2 val-clip-corner p-6 flex flex-col items-center justify-center min-h-[320px] text-center"
        style={{ borderColor: ACCENT }}
      >
        <Swords className="w-12 h-12 mb-3 animate-pulse" style={{ color: ACCENT }} />
        <h3 className="text-xl font-black font-tactical uppercase tracking-wider text-white">
          STRAT ROULETTE READY
        </h3>
        <p className="text-xs text-[#8b9bb4] mt-2 max-w-sm">
          Click <span className="font-bold" style={{ color: ACCENT }}>SPIN STRAT</span> to roll a random round strategy!
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[#0a1017] border-2 val-clip-corner p-4 relative overflow-hidden shadow-2xl space-y-3 flex flex-col"
      style={{
        borderColor: ACCENT,
        boxShadow: isSpinning ? `0 0 30px ${GLOW}` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1 text-xs font-mono pb-2 border-b border-[#1e2d3d]">
        <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-white">
          <Swords className="w-4 h-4" style={{ color: ACCENT }} />
          <Sparkles className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          STRAT ROULETTE
        </span>

        <span
          className="px-3 py-1 font-bold uppercase tracking-wider text-[11px] border"
          style={{
            color: ACCENT,
            borderColor: ACCENT,
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
          }}
        >
          {isSpinning ? 'SPINNING...' : showWinnerFooter ? 'REVEALED' : 'WAITING'}
        </span>
      </div>

      {/* Vertical Slot Machine Reel */}
      <div
        ref={containerRef}
        className="relative w-full h-[520px] bg-[#060a0f] border border-[#1e2d3d] overflow-hidden flex justify-center items-center shadow-inner rounded"
      >
        {/* Side pointer brackets */}
        <div className="absolute top-1/2 left-1 -translate-y-1/2 z-30 pointer-events-none">
          <div
            className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px]"
            style={{ borderLeftColor: ACCENT, filter: `drop-shadow(0 0 10px ${ACCENT})` }}
          />
        </div>
        <div className="absolute top-1/2 right-1 -translate-y-1/2 z-30 pointer-events-none">
          <div
            className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px]"
            style={{ borderRightColor: ACCENT, filter: `drop-shadow(0 0 10px ${ACCENT})` }}
          />
        </div>

        {/* Top & Bottom fade */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#060a0f] to-transparent z-20 pointer-events-none opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#060a0f] to-transparent z-20 pointer-events-none opacity-90" />

        {/* Animated Strip */}
        <motion.div
          animate={controls}
          style={{ y: yMotion }}
          className="flex flex-col items-center gap-[10px] absolute top-1/2 w-full px-4"
        >
          {items.map((strat, idx) => {
            const isWinner = idx === winnerIndex;
            const isCurrentlyActive = idx === activeIndex;
            const showSelected = isWinner && isLanded && hasSpun;
            const isHighlighted = showSelected || (isCurrentlyActive && (isSpinning || hasSpun));

            return (
              <div
                key={`${strat.id}_${idx}`}
                className={`flex-shrink-0 w-full h-[96px] flex flex-col justify-center px-5 val-clip-corner border relative transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-[#0f1f0a] border-2 z-20 scale-[1.02] opacity-100 shadow-2xl'
                    : 'bg-[#0d151f] border-[#182535] opacity-30 scale-95 filter blur-[3px] grayscale-[60%]'
                }`}
                style={{
                  borderColor: isHighlighted ? ACCENT : undefined,
                  boxShadow: isHighlighted ? `0 0 28px ${GLOW}` : undefined,
                }}
              >
                {/* Tag */}
                <span
                  className="text-[9px] font-mono uppercase tracking-widest font-bold mb-1"
                  style={{ color: isHighlighted ? ACCENT : '#8b9bb4' }}
                >
                  STRAT
                </span>

                {/* Title (shown during spin) */}
                <h4
                  className={`font-black font-tactical uppercase tracking-wider leading-tight ${
                    isHighlighted ? 'text-white text-base' : 'text-[#ece8e1] text-sm'
                  }`}
                  style={{ color: isHighlighted ? ACCENT : undefined }}
                >
                  {strat.title}
                </h4>

                {/* Description revealed only when winner is landed */}
                {showSelected && (
                  <p className="text-xs text-[#c8d6e5] mt-1.5 leading-snug line-clamp-2">
                    {strat.description}
                  </p>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Winner Footer */}
      {showWinnerFooter && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#071408] border-2 flex flex-col gap-2 text-xs font-mono text-white rounded val-clip-corner"
          style={{ borderColor: ACCENT }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: ACCENT }} />
            <span className="text-[#8b9bb4]">STRAT REVEALED:</span>
            <span
              className="font-black text-sm tracking-wider uppercase font-tactical"
              style={{ color: ACCENT }}
            >
              {winningStrat!.title}
            </span>
          </div>
          <p className="text-[#c8d6e5] leading-relaxed text-[13px] border-t border-[#1a2e1a] pt-2">
            {winningStrat!.description}
          </p>
        </motion.div>
      )}
    </div>
  );
};
