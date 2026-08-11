import React from 'react';
import { Agent } from '../types/domain';
import { AssetImage } from './AssetImage';
import { Dices, FastForward, RotateCcw, Settings, RefreshCw, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

type RoundControlsProps = {
  agent: Agent;
  currentRound: number;
  availableCredits: number;
  isSpinning: boolean;
  onSpin: () => void;
  onNextRound: () => void;
  onReSpin: () => void;
  onResetMatch: () => void;
  onChangeAgent: () => void;
  onOpenSettings: () => void;
  onCreditsChange: (credits: number) => void;
};

export const RoundControls: React.FC<RoundControlsProps> = ({
  agent,
  currentRound,
  availableCredits,
  isSpinning,
  onSpin,
  onNextRound,
  onReSpin,
  onResetMatch,
  onChangeAgent,
  onOpenSettings,
  onCreditsChange,
}) => {
  const presets = [
    { label: 'PISTOL ROUND', value: 800, icon: '🔫', tag: 'Round 1' },
    { label: 'ECO ROUND', value: 1500, icon: '🍃', tag: 'Round 2' },
    { label: 'HALF BUY', value: 2500, icon: '🛡️', tag: 'Mid Buy' },
    { label: 'FULL BUY', value: 3900, icon: '⚡', tag: 'Round 3+' },
    { label: 'MAX CREDITS', value: 9000, icon: '👑', tag: 'Max Buy' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 1. PRIMARY SPIN ACTION BAR (POSITIONED DIRECTLY UNDER ROULETTES) */}
      <div className="w-full bg-[#111c27] border-2 border-[#ff4655]/80 val-clip-corner p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Main Big Spin Button & Quick Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.button
            type="button"
            onClick={onSpin}
            disabled={isSpinning}
            whileHover={{ scale: isSpinning ? 1 : 1.02 }}
            whileTap={{ scale: isSpinning ? 1 : 0.98 }}
            className={`w-full md:flex-1 py-5 px-8 font-tactical font-black text-3xl tracking-widest uppercase text-white flex items-center justify-center gap-3 val-clip-btn transition-all ${
              isSpinning
                ? 'bg-[#2a3e52] cursor-not-allowed opacity-75'
                : 'bg-[#ff4655] hover:bg-[#e03e4d] shadow-[0_0_30px_rgba(255,70,85,0.7)] cursor-pointer active:bg-[#c02e3c]'
            }`}
            aria-live="polite"
          >
            <Dices className={`w-8 h-8 ${isSpinning ? 'animate-spin text-slate-300' : 'text-white'}`} />
            {isSpinning ? 'SPINNING ROULETTES...' : `SPIN ROUND ${currentRound}`}
          </motion.button>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={onNextRound}
              disabled={isSpinning}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-4 bg-[#0f1923] border-2 border-[#ff4655]/50 hover:border-[#ff4655] text-white font-tactical font-bold text-lg uppercase tracking-wider transition-all disabled:opacity-50 val-clip-corner"
            >
              <FastForward className="w-5 h-5 text-[#ff4655]" />
              Next (+1)
            </button>
            <button
              type="button"
              onClick={onReSpin}
              disabled={isSpinning}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-4 bg-[#0f1923] border-2 border-[#00e5ff]/50 hover:border-[#00e5ff] text-white font-tactical font-bold text-lg uppercase tracking-wider transition-all disabled:opacity-50 val-clip-corner"
            >
              <RefreshCw className="w-5 h-5 text-[#00e5ff]" />
              Re-Spin
            </button>
          </div>
        </div>

        {/* HIGH-VISIBILITY PRESET TABS (Pistol, Eco, Full Buy) */}
        <div className="space-y-2 pt-2 border-t border-[#2a3e52]">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-[#8b9bb4]">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              ROUND STRATEGY PRESETS & CREDITS BUDGET:
            </span>
            <span className="text-[#ffb400] font-bold">
              CURRENT: {availableCredits} ¤
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {presets.map((p) => {
              const isSelected = availableCredits === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onCreditsChange(p.value)}
                  className={`p-3 border-2 text-left transition-all flex flex-col justify-between val-clip-corner ${
                    isSelected
                      ? 'bg-[#1e3042] border-[#ffb400] text-white shadow-[0_0_20px_rgba(255,180,0,0.5)] scale-105'
                      : 'bg-[#0a1017] border-[#2a3e52] text-[#8b9bb4] hover:border-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-base">{p.icon}</span>
                    <span
                      className={`px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                        isSelected ? 'bg-[#ffb400] text-black' : 'bg-[#152230] text-[#8b9bb4]'
                      }`}
                    >
                      {p.tag}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div
                      className={`text-sm font-black font-tactical uppercase tracking-wider ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {p.label}
                    </div>
                    <div className="text-xs font-mono font-bold text-[#ffb400] flex items-center gap-1 mt-0.5">
                      <AssetImage
                        src="/assets/images/credits.webp"
                        alt="¤"
                        type="armor"
                        fallbackName="¤"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span>{p.value} ¤</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. AGENT DETAILS & MATCH INFO (POSITIONED FURTHER DOWN SEPARATELY) */}
      <div className="w-full bg-[#152230] border border-[#2a3e52] val-clip-corner p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Agent Info */}
        <div className="flex items-center gap-4">
          <AssetImage
            src={agent.portraitPath}
            alt={agent.name}
            type="agent"
            fallbackName={agent.name}
            className="w-12 h-12 rounded object-cover border-2 border-[#2a3e52]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-white font-tactical tracking-wide uppercase">
                {agent.name}
              </span>
              <span className="px-2 py-0.5 text-xs font-mono uppercase bg-[#2a3e52] text-[#8b9bb4] flex items-center gap-1.5 rounded">
                <AssetImage
                  src={`/assets/images/role-${agent.role}.webp`}
                  alt={agent.role}
                  type="ability"
                  fallbackName={agent.role}
                  className="w-3.5 h-3.5 object-contain"
                />
                {agent.role}
              </span>
            </div>
            <button
              type="button"
              onClick={onChangeAgent}
              className="text-xs text-[#ff4655] hover:underline flex items-center gap-1 font-mono mt-1 font-bold"
            >
              <UserCheck className="w-3.5 h-3.5" /> Change Agent Roster
            </button>
          </div>
        </div>

        {/* Round Counter */}
        <div className="flex items-center gap-3 bg-[#0f1923] px-5 py-2.5 border-2 border-[#ff4655]/50 val-clip-corner">
          <span className="text-xs font-mono text-[#8b9bb4] font-bold">MATCH ROUND</span>
          <span className="text-3xl font-black text-[#ff4655] font-tactical">{currentRound}</span>
        </div>

        {/* Manual Credits Input & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0f1923] px-3 py-2 border border-[#2a3e52] rounded">
            <label htmlFor="credits-input-manual" className="text-xs font-mono text-[#8b9bb4] font-bold">
              MANUAL CREDIT:
            </label>
            <input
              id="credits-input-manual"
              type="number"
              min="0"
              max="16000"
              step="50"
              value={availableCredits}
              onChange={(e) => onCreditsChange(parseInt(e.target.value, 10) || 0)}
              className="w-20 bg-transparent text-right font-mono font-bold text-base text-[#ffb400] outline-none"
            />
            <span className="text-xs font-mono text-[#ffb400]">¤</span>
          </div>

          <button
            type="button"
            onClick={onResetMatch}
            disabled={isSpinning}
            className="p-2.5 bg-[#0f1923] border border-[#2a3e52] hover:border-red-500 text-[#8b9bb4] hover:text-red-400 transition-colors rounded"
            title="Reset Match"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 bg-[#0f1923] border border-[#2a3e52] hover:border-[#ff4655] text-[#8b9bb4] hover:text-white transition-colors rounded"
            title="Open Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
