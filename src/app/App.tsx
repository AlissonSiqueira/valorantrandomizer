import React, { useEffect } from 'react';
import { useRandomizerStore } from '../store/useRandomizerStore';
import { AGENTS } from '../config/agents';
import { AgentSelect } from '../components/AgentSelect';
import { RoundControls } from '../components/RoundControls';
import { RadialCasinoRoulette } from '../components/RadialCasinoRoulette';
import { ResultsDock } from '../components/ResultsDock';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { EmptyState } from '../components/EmptyState';
import { getAvailableWeapons } from '../lib/random';


export const App: React.FC = () => {
  const {
    selectedAgentId,
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



  return (
    <div className="min-h-screen bg-[#0f1923] text-[#ece8e1] flex flex-col font-sans selection:bg-[#ff4655] selection:text-white">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentResult
          ? `Round ${currentResult.roundNumber} Result: Weapon ${currentResult.weapon.name}, Armor ${currentResult.armor.name}, Strategy ${currentResult.abilityPlan.title}`
          : 'No spin result generated.'}
      </div>

      {/* Main Top Header Bar (Removed for now) */}

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
            {/* TOP / HERO STAGE: RADIAL CASINO ROULETTE & RESULTS */}
            <div className="space-y-4">
              <div className="w-full bg-[#0a1017] rounded-2xl border border-[#2a3e52] shadow-2xl relative overflow-hidden flex flex-col items-center pb-6 gap-6">

                {/* The Radial Roulette Spinner */}
                <RadialCasinoRoulette
                  currentStage={spinStage}
                  winningWeapon={currentResult?.weapon || null}
                  winningArmor={currentResult?.armor || null}
                  winningAbilityPlan={currentResult?.abilityPlan || null}
                  availableWeapons={availableWeaponsPool}
                  intensity={settings.animationIntensity}
                />

                {/* Results Dock - Nudged up by another 20px */}
                <div className="w-full max-w-5xl z-30 -mt-24 sm:-mt-32 relative">
                  <ResultsDock
                    currentStage={spinStage}
                    weapon={currentResult?.weapon || null}
                    abilityPlan={currentResult?.abilityPlan || null}
                    armor={currentResult?.armor || null}
                  />
                </div>
              </div>
            </div>

            {/* BOTTOM AREA: ROUND CONTROLS & CREDITS BUDGET (DIRECTLY UNDER ROULETTES) */}
            <div className="pt-2">
              <RoundControls
                availableCredits={availableCredits}
                isSpinning={isSpinning}
                onSpin={spinRound}
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

      {/* Footer (Removed for now) */}
    </div>
  );
};
