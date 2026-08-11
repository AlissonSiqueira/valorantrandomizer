import React, { useEffect } from 'react';
import { useRandomizerStore } from '../store/useRandomizerStore';
import { AGENTS } from '../config/agents';
import { AgentSelect } from '../components/AgentSelect';
import { RoundControls } from '../components/RoundControls';
import { VerticalCasinoRoulette } from '../components/VerticalCasinoRoulette';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { EmptyState } from '../components/EmptyState';
import { getAvailableWeapons } from '../lib/random';
import { Dices, UserCheck, Settings, Sparkles, Target, Zap, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const {
    selectedAgentId,
    currentRound,
    availableCredits,
    currentResult,
    previousResult,
    settings,
    isSpinning,
    spinStage,
    isSettingsOpen,
    error,
    selectAgent,
    setAvailableCredits,
    spinRound,
    nextRound,
    reSpinRound,
    resetMatch,
    updateSettings,
    clearAllData,
    setIsSettingsOpen,
  } = useRandomizerStore();

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId) || null;

  const availableWeaponsPool = getAvailableWeapons(
    settings,
    previousResult,
    availableCredits
  );



  // Keyboard shortcut listener: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && selectedAgent && !isSpinning && !isSettingsOpen) {
        e.preventDefault();
        spinRound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAgent, isSpinning, isSettingsOpen, spinRound]);

  // Determine exactly when each column has completed its spin (No spoilers!)
  const weaponHasSpun =
    spinStage === 'ability' || spinStage === 'armor' || spinStage === 'complete';

  const abilityHasSpun =
    spinStage === 'armor' || spinStage === 'complete';

  const armorHasSpun =
    spinStage === 'complete';

  return (
    <div className="min-h-screen bg-[#0f1923] text-[#ece8e1] flex flex-col font-sans selection:bg-[#ff4655] selection:text-white">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentResult
          ? `Round ${currentResult.roundNumber} Result: Weapon ${currentResult.weapon.name}, Armor ${currentResult.armor.name}, Strategy ${currentResult.abilityPlan.title}`
          : 'No spin result generated.'}
      </div>

      {/* Main Top Header Bar */}
      <header className="w-full bg-[#152230]/95 border-b border-[#2a3e52] sticky top-0 z-40 backdrop-blur-md shadow-2xl">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#ff4655] flex items-center justify-center text-white shadow-val-glow">
              <Dices className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-tactical uppercase tracking-wider text-white leading-none flex items-center gap-2">
                VALORANT <span className="text-[#ff4655]">CASINO RANDOMIZER</span>
                <span className="px-2.5 py-0.5 text-xs font-mono uppercase bg-[#ffb400]/20 text-[#ffb400] border border-[#ffb400] rounded hidden md:inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> STREAMER EDITION
                </span>
              </h1>
              <p className="text-xs text-[#8b9bb4] font-mono tracking-widest hidden sm:block mt-0.5">
                3 SEQUENTIAL VERTICAL ROULETTES (1. WEAPON → 2. ABILITY → 3. SHIELD)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedAgent && (
              <button
                type="button"
                onClick={() => selectAgent('')}
                className="flex items-center gap-2 px-4 py-2 bg-[#0f1923] border border-[#2a3e52] hover:border-[#ff4655] text-xs font-mono text-[#ece8e1] transition-colors rounded val-clip-corner"
              >
                <UserCheck className="w-4 h-4 text-[#ff4655]" />
                Agent: <span className="font-bold text-[#ff4655] uppercase">{selectedAgent.name}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f1923] border border-[#2a3e52] hover:border-[#ff4655] text-xs font-mono text-[#ece8e1] transition-colors rounded val-clip-corner"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-[#8b9bb4]" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - ROULETTES AT TOP (HERO STAGE) */}
      <main className="flex-1 max-w-[1650px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {!selectedAgent ? (
          /* Step 1: Agent Select Screen */
          <AgentSelect
            selectedAgentId={selectedAgentId}
            onSelectAgent={selectAgent}
          />
        ) : (
          /* Step 2: Main Streamer Casino Stage */
          <div className="space-y-6">
            {/* Error Banner if filter or budget issue */}
            {error && (
              <EmptyState
                title="Randomizer Error"
                message={error}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onResetSettings={() =>
                  updateSettings({
                    enabledWeaponCategories: [
                      'sidearm',
                      'smg',
                      'shotgun',
                      'rifle',
                      'sniper',
                      'machine_gun',
                      'melee',
                    ],
                  })
                }
              />
            )}

            {/* TOP / HERO STAGE: 3 INDEPENDENT SIDE-BY-SIDE VERTICAL CASINO ROULETTES (33% / 33% / 33%) */}
            <div className="space-y-3">
              {/* Stage Progress Bar */}
              <div className="flex items-center justify-between px-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-[#8b9bb4] uppercase tracking-wider font-bold">SEQUENTIAL SPIN ORDER:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 font-bold rounded uppercase border flex items-center gap-1.5 transition-all ${
                        spinStage === 'weapon'
                          ? 'bg-[#ff4655] text-white border-[#ff4655] shadow-val-glow scale-105'
                          : 'bg-[#152230] text-[#8b9bb4] border-[#2a3e52]'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" /> 1. WEAPON
                    </span>
                    <span className="text-[#8b9bb4]">→</span>
                    <span
                      className={`px-3 py-1 font-bold rounded uppercase border flex items-center gap-1.5 transition-all ${
                        spinStage === 'ability'
                          ? 'bg-[#ffb400] text-black border-[#ffb400] shadow-[0_0_15px_#ffb400] scale-105'
                          : 'bg-[#152230] text-[#8b9bb4] border-[#2a3e52]'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" /> 2. ABILITY
                    </span>
                    <span className="text-[#8b9bb4]">→</span>
                    <span
                      className={`px-3 py-1 font-bold rounded uppercase border flex items-center gap-1.5 transition-all ${
                        spinStage === 'armor'
                          ? 'bg-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_15px_#00e5ff] scale-105'
                          : 'bg-[#152230] text-[#8b9bb4] border-[#2a3e52]'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" /> 3. SHIELD
                    </span>
                  </div>
                </div>

                <span className="text-[#8b9bb4] hidden sm:block">
                  Press <kbd className="px-2 py-0.5 bg-[#152230] border border-[#2a3e52] text-white font-bold">Space</kbd> to spin
                </span>
              </div>

              {/* 3 SIDE-BY-SIDE VERTICAL CASINO ROULETTES (33% EACH) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 33% Column 1: WEAPON VERTICAL ROULETTE */}
                <VerticalCasinoRoulette
                  type="weapon"
                  winningWeapon={currentResult?.weapon || null}
                  isSpinning={isSpinning && spinStage === 'weapon'}
                  hasSpun={weaponHasSpun}
                  availableWeapons={availableWeaponsPool}
                  intensity={settings.animationIntensity}
                />

                {/* 33% Column 2: ABILITY STRATEGY VERTICAL ROULETTE */}
                <VerticalCasinoRoulette
                  type="ability"
                  winningAbilityPlan={currentResult?.abilityPlan || null}
                  isSpinning={isSpinning && spinStage === 'ability'}
                  hasSpun={abilityHasSpun}
                  intensity={settings.animationIntensity}
                />

                {/* 33% Column 3: SHIELD VERTICAL ROULETTE */}
                <VerticalCasinoRoulette
                  type="armor"
                  winningArmor={currentResult?.armor || null}
                  isSpinning={isSpinning && spinStage === 'armor'}
                  hasSpun={armorHasSpun}
                  intensity={settings.animationIntensity}
                />
              </div>
            </div>

            {/* BOTTOM AREA: ROUND CONTROLS & CREDITS BUDGET (DIRECTLY UNDER ROULETTES) */}
            <div className="pt-2">
              <RoundControls
                agent={selectedAgent}
                currentRound={currentRound}
                availableCredits={availableCredits}
                isSpinning={isSpinning}
                onSpin={spinRound}
                onNextRound={nextRound}
                onReSpin={reSpinRound}
                onResetMatch={resetMatch}
                onChangeAgent={() => selectAgent('')}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onCreditsChange={setAvailableCredits}
              />
            </div>
          </div>
        )}
      </main>

      {/* Settings Drawer Modal */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetMatch={resetMatch}
        onClearAllData={clearAllData}
      />

      {/* Footer */}
      <footer className="w-full bg-[#0b131c] border-t border-[#2a3e52]/60 py-4 mt-auto text-center text-xs text-[#8b9bb4] font-mono">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VALORANT CASINO RANDOMIZER • Streamer Edition</span>
          <span className="text-[#8b9bb4]">Local Storage Active • Version 1.0</span>
        </div>
      </footer>
    </div>
  );
};
