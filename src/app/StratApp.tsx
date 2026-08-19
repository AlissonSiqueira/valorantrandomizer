import React, { useState, useCallback, useEffect } from 'react';
import { StratRoulette } from '../components/StratRoulette';
import { STRATS, Strat } from '../config/strats';
import { Dices, ArrowLeft, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

type StratAppProps = {
  onBack: () => void;
};

const ACCENT = '#39ff14';

export const StratApp: React.FC<StratAppProps> = ({ onBack }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [winningStrat, setWinningStrat] = useState<Strat | null>(null);

  const [hasLanded, setHasLanded] = useState(false);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    // Pick a truly random strat — avoid immediate repeat
    let pick: Strat;
    do {
      pick = STRATS[Math.floor(Math.random() * STRATS.length)];
    } while (STRATS.length > 1 && pick.id === winningStrat?.id);

    setWinningStrat(pick);
    setIsSpinning(true);
    setHasSpun(true);
    setHasLanded(false);
  }, [isSpinning, winningStrat]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    setHasLanded(true);
  }, []);

  // Space bar shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' && !isSpinning) {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, handleSpin]);

  return (
    <div className="min-h-screen bg-[#0f1923] text-[#ece8e1] flex flex-col font-sans selection:bg-[#39ff14] selection:text-black">
      {/* Header */}
      <header className="w-full bg-[#152230]/95 border-b border-[#2a3e52] sticky top-0 z-40 backdrop-blur-md shadow-2xl">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-[#0f1923] border border-[#2a3e52] hover:border-[#39ff14] text-xs font-mono text-[#ece8e1] transition-colors rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: ACCENT }} />
              <span className="hidden sm:inline">BACK</span>
            </button>

            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-black shadow-lg"
                style={{ backgroundColor: ACCENT }}
              >
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-tactical uppercase tracking-wider text-white leading-none">
                  Valo<span style={{ color: ACCENT }}>Strat</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Beta badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{
              color: ACCENT,
              borderColor: ACCENT,
              backgroundColor: 'rgba(57, 255, 20, 0.08)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            BETA
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1650px] w-full mx-auto flex flex-col p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Roulette & Results Stage */}
        <div className="space-y-4">
          <div className="w-full bg-[#0a1017] rounded-2xl border border-[#2a3e52] shadow-2xl relative overflow-hidden flex flex-col items-center pb-6 gap-6">
            
            <StratRoulette
              isSpinning={isSpinning}
              hasSpun={hasSpun}
              winningStrat={winningStrat}
              onSpinComplete={handleSpinComplete}
              intensity="normal"
            />
            
            {/* Dock for Results (mirrors the ResultsDock spacing) */}
            <div className="w-full max-w-5xl z-30 -mt-36 sm:-mt-28 relative px-4 sm:px-6">
              {hasLanded && winningStrat ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-[#152230]/95 backdrop-blur-xl border-t border-[#39ff14] shadow-[0_-10px_40px_rgba(57,255,20,0.15)] rounded-2xl p-6"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <span className="text-[11px] font-mono text-[#39ff14] font-extrabold uppercase tracking-widest bg-[#39ff14]/10 px-3 py-1 rounded-full border border-[#39ff14]/30">
                      STRAT REVEALED
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black font-tactical uppercase tracking-wider text-white">
                      {winningStrat.title}
                    </h3>
                    <p className="text-[#8b9bb4] text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                      {winningStrat.description}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center opacity-50">
                  <p className="text-sm font-mono uppercase tracking-widest text-[#8b9bb4]">
                    {isSpinning ? 'SPINNING...' : 'WAITING FOR SPIN...'}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Spin Button */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <motion.button
            type="button"
            onClick={handleSpin}
            disabled={isSpinning}
            whileHover={{ scale: isSpinning ? 1 : 1.05 }}
            whileTap={{ scale: isSpinning ? 1 : 0.95 }}
            className={`w-full max-w-2xl py-6 px-10 font-tactical font-black text-3xl tracking-widest uppercase text-black flex items-center justify-center gap-4 rounded-2xl transition-all duration-300 shadow-2xl ${
              isSpinning
                ? 'bg-[#152230] border border-[#2a3e52] cursor-not-allowed opacity-50 grayscale text-white'
                : 'cursor-pointer'
            }`}
            style={
              !isSpinning
                ? {
                    background: `linear-gradient(135deg, ${ACCENT}, #2acc0a)`,
                    boxShadow: `0 10px 40px rgba(57, 255, 20, 0.45)`,
                  }
                : undefined
            }
          >
            <Dices className={`w-8 h-8 ${isSpinning ? 'animate-spin text-slate-500' : 'text-black'}`} />
            {isSpinning ? 'SPINNING...' : 'SPIN STRAT'}
          </motion.button>

          <p className="text-xs text-[#8b9bb4] font-mono">
            Press <kbd className="px-1.5 py-0.5 bg-[#152230] border border-[#2a3e52] rounded text-[#ece8e1] text-[10px]">SPACE</kbd> to spin
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 mt-auto border-t border-[#2a3e52]/40 bg-[#0b121a]/80 text-center text-[11px] font-mono text-[#8b9bb4]/80 z-10 px-4">
        <p>
          Created by{' '}
          <a
            href="https://www.tiktok.com/@SlicerzzTV"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors font-bold"
            style={{ color: ACCENT }}
          >
            @SlicerzzTV
          </a>{' '}
          on TikTok <span className="hidden sm:inline">• ValoRoll is a fan project and not affiliated with Riot Games.</span>
        </p>
      </footer>
    </div>
  );
};
