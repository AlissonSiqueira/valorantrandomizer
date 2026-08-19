import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Swords } from 'lucide-react';
import { STRATS, Strat } from '../config/strats';

type StratRouletteProps = {
  isSpinning: boolean;
  hasSpun: boolean;
  winningStrat: Strat | null;
  onSpinComplete?: () => void;
  intensity?: 'reduced' | 'normal' | 'high';
};

const ACCENT = '#39ff14';

export const StratRoulette: React.FC<StratRouletteProps> = ({
  isSpinning,
  hasSpun,
  winningStrat,
  onSpinComplete,
  intensity = 'normal',
}) => {
  const [items, setItems] = useState<Strat[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const controls = useAnimation();
  const rotateMotion = useMotionValue(0);

  // Geometry configurations for the radial wheel (Matches RadialCasinoRoulette)
  const radius = 1200; // pixels
  const cardAngle = 13; // degrees per card
  const winnerIndex = 48;
  const targetRotation = -(winnerIndex * cardAngle);

  // Update items array
  useEffect(() => {
    const pool = [...STRATS];
    const fallbackItem = winningStrat || pool[0];
    const generated: Strat[] = [];
    let lastId = '';

    const pickRandom = (excludeId: string): Strat => {
      let pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick.id === excludeId && pool.length > 1) {
        pick = pool[(pool.indexOf(pick) + 1) % pool.length];
      }
      return pick;
    };

    for (let i = 0; i < winnerIndex + 15; i++) {
      if (i === winnerIndex) {
        generated.push(fallbackItem);
        lastId = fallbackItem.id;
      } else {
        const pick = pickRandom(lastId);
        generated.push(pick);
        lastId = pick.id;
      }
    }

    setItems(generated);

    // Trigger spin
    const duration = intensity === 'reduced' ? 1.0 : intensity === 'high' ? 6.0 : 4.5;
    
    if (!isSpinning && !hasSpun) {
      controls.set({ rotate: 0 });
      rotateMotion.set(0);
      setHasLanded(false);
    } else if (isSpinning) {
      controls.set({ rotate: 0 });
      rotateMotion.set(0);
      setHasLanded(false);

      controls
        .start({
          rotate: targetRotation,
          transition: {
            duration: duration,
            ease: [0.08, 0.92, 0.15, 1], // Custom deep friction decelerator
          },
        }).then(() => {
          setHasLanded(true);
          if (onSpinComplete) onSpinComplete();
        });
    } else if (hasSpun) {
      controls.set({ rotate: targetRotation });
      rotateMotion.set(targetRotation);
      setHasLanded(true);
    }

  }, [isSpinning, hasSpun, winningStrat]);

  // Track active index for visual popping during spin
  useEffect(() => {
    const unsubscribe = rotateMotion.on('change', (latestRotate) => {
      const idx = Math.round(-latestRotate / cardAngle);
      if (idx >= 0 && idx < items.length) {
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      }
    });
    return () => unsubscribe();
  }, [items, cardAngle, rotateMotion]);

  return (
    <div className="relative w-full h-[400px] sm:h-[635px] flex justify-center overflow-hidden bg-transparent perspective-[1000px] select-none">
      
      {/* Background soft glow */}
      {(isSpinning || hasSpun) && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 transition-colors duration-500" 
          style={{ background: `radial-gradient(circle at top center, ${ACCENT}, transparent 60%)` }}
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
                      `0 0 25px ${ACCENT}60`,
                      `0 0 60px ${ACCENT}FF`,
                      `0 0 35px ${ACCENT}80`
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
                    borderColor: isActive ? ACCENT : '#2a3e52',
                  }}
                >
                  <span className="text-xs sm:text-base font-mono font-bold text-slate-400 uppercase w-full text-center truncate">
                    STRATEGY
                  </span>
                  
                  <div className="flex-1 flex flex-col items-center justify-center w-full my-3 gap-6">
                    <Swords 
                      className={`w-16 h-16 sm:w-24 sm:h-24 transition-all ${isActive ? 'drop-shadow-[0_0_20px_rgba(57,255,20,0.6)] scale-110' : 'grayscale-[40%]'}`}
                      style={{ color: isActive ? ACCENT : '#8b9bb4' }}
                    />
                    
                    <span 
                      className="text-2xl sm:text-3xl font-black font-tactical uppercase tracking-wider text-center w-full px-2"
                      style={{ 
                        color: isActive ? '#fff' : '#ece8e1',
                        textShadow: isActive ? `0 0 10px ${ACCENT}80` : 'none',
                        lineHeight: '1.1'
                      }}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div className="flex flex-col items-center w-full">
                    {/* Placeholder to keep alignment matching RadialCasinoRoulette */}
                    <div className="h-6"></div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Center Marker Pointer */}
      {(isSpinning || hasSpun) && (
        <div className="absolute top-[44px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none drop-shadow-xl">
          <div 
            className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px]"
            style={{ borderTopColor: ACCENT, filter: `drop-shadow(0 0 8px ${ACCENT})` }}
          />
        </div>
      )}

      {/* Bottom fade mask to softly blend with the container */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a1017] to-transparent pointer-events-none z-20" />
    </div>
  );
};
