import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRandomizerStore } from '../store/useRandomizerStore';
import { AGENTS } from '../config/agents';
import { AgentSelect } from '../components/AgentSelect';
import { RoundControls } from '../components/RoundControls';
import { RadialCasinoRoulette } from '../components/RadialCasinoRoulette';
import { ResultsDock } from '../components/ResultsDock';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { EmptyState } from '../components/EmptyState';
import { getAvailableWeapons } from '../lib/random';
import { Dices, UserCheck, Settings } from 'lucide-react';

const AGENTS_BY_ID = new Map(AGENTS.map((agent) => [agent.id, agent]));

export const App: React.FC = () => {
  const selectedAgentId = useRandomizerStore((s) => s.selectedAgentId);
  const availableCredits = useRandomizerStore((s) => s.availableCredits);
  const currentResult = useRandomizerStore((s) => s.currentResult);
  const previousResult = useRandomizerStore((s) => s.previousResult);
  const settings = useRandomizerStore((s) => s.settings);
  const isSpinning = useRandomizerStore((s) => s.isSpinning);
  const spinStage = useRandomizerStore((s) => s.spinStage);
  const isSettingsOpen = useRandomizerStore((s) => s.isSettingsOpen);
  const error = useRandomizerStore((s) => s.error);
  const selectAgent = useRandomizerStore((s) => s.selectAgent);
  const setAvailableCredits = useRandomizerStore((s) => s.setAvailableCredits);
  const spinRound = useRandomizerStore((s) => s.spinRound);
  const updateSettings = useRandomizerStore((s) => s.updateSettings);
  const clearAllData = useRandomizerStore((s) => s.clearAllData);
  const setIsSettingsOpen = useRandomizerStore((s) => s.setIsSettingsOpen);

  const selectedAgent = selectedAgentId ? AGENTS_BY_ID.get(selectedAgentId) ?? null : null;

  const availableWeaponsPool = useMemo(
    () => getAvailableWeapons(settings, previousResult, availableCredits),
    [settings, previousResult, availableCredits]
  );
  const rouletteRef = useRef<HTMLDivElement>(null);

  const handleSpin = useCallback(() => {
    spinRound();
    window.setTimeout(() => {
      if (rouletteRef.current) {
        const headerOffset = 90;
        const elementPosition = rouletteRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  }, [spinRound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && selectedAgent && !isSpinning && !isSettingsOpen) {
        e.preventDefault();
        handleSpin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAgent, isSpinning, isSettingsOpen, handleSpin]);



  return (
    <div className="min-h-screen bg-[#0f1923] text-[#ece8e1] flex flex-col font-sans selection:bg-[#ff4655] selection:text-white">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentResult
          ? `Result: Weapon ${currentResult.weapon.name}, Armor ${currentResult.armor.name}, Strategy ${currentResult.abilityPlan.title}`
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
              <h1 className="text-2xl sm:text-3xl font-black font-tactical uppercase tracking-wider text-white leading-none">
                Valo<span className="text-[#ff4655]">Roll</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedAgent && (
              <button
                type="button"
                onClick={() => selectAgent('')}
                className="flex items-center gap-2 px-4 py-2 bg-[#0f1923] border border-[#2a3e52] hover:border-[#ff4655] text-xs font-mono text-[#ece8e1] transition-colors rounded-lg"
              >
                <UserCheck className="w-4 h-4 text-[#ff4655]" />
                Change Agent
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f1923] border border-[#2a3e52] hover:border-[#ff4655] text-xs font-mono text-[#ece8e1] transition-colors rounded-lg"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-[#8b9bb4]" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 max-w-[1650px] w-full mx-auto flex flex-col min-h-[calc(100vh-120px)] ${!selectedAgent ? '' : 'p-4 sm:p-6 lg:p-8 space-y-6'}`}>
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
            <div ref={rouletteRef} className="space-y-4">
              <div className="w-full bg-[#0a1017] rounded-2xl border border-[#2a3e52] shadow-2xl relative overflow-hidden flex flex-col items-center pb-6 gap-6">

                {/* The Radial Roulette Spinner */}
                <RadialCasinoRoulette
                  currentStage={spinStage}
                  winningWeapon={currentResult?.weapon || null}
                  winningArmor={currentResult?.armor || null}
                  winningAbilityPlan={currentResult?.abilityPlan || null}
                  availableWeapons={availableWeaponsPool}
                  intensity={settings.animationIntensity}
                  agent={selectedAgent}
                />

                {/* Results Dock - Nudged up by another 20px */}
                <div className="w-full max-w-5xl z-30 -mt-36 sm:-mt-28 relative px-4 sm:px-6">
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
                onSpin={handleSpin}
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
        onClearAllData={clearAllData}
      />

      {/* Footer */}
      <footer className="w-full py-3 mt-auto border-t border-[#2a3e52]/40 bg-[#0b121a]/80 text-center text-[11px] font-mono text-[#8b9bb4]/80 z-10 px-4">
        <p>
          Created by{' '}
          <a
            href="https://www.tiktok.com/@SlicerzzTV"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff4655] hover:text-[#ff6b77] hover:underline transition-colors font-bold"
          >
            @SlicerzzTV
          </a>{' '}
          on TikTok <span className="hidden sm:inline">• ValoRoll is a fan project and not affiliated with Riot Games.</span>
        </p>
      </footer>
    </div>
  );
};
