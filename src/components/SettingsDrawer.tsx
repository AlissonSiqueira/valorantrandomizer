import React from 'react';
import { RandomizerSettings, WeaponCategory } from '../types/domain';
import { ALL_WEAPON_CATEGORIES } from '../config/randomizer';
import { X, Settings as SettingsIcon, Trash2, Check, Sparkles } from 'lucide-react';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  settings: RandomizerSettings;
  onUpdateSettings: (newSettings: Partial<RandomizerSettings>) => void;
  onClearAllData: () => void;
};

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  const toggleWeaponCategory = (category: WeaponCategory) => {
    const current = settings.enabledWeaponCategories || [];
    let updated: WeaponCategory[];

    if (current.includes(category)) {
      // Don't allow disabling all categories
      if (current.length <= 1) return;
      updated = current.filter((c) => c !== category);
    } else {
      updated = [...current, category];
    }

    onUpdateSettings({ enabledWeaponCategories: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md h-full bg-[#0f1923] border-l border-[#2a3e52] p-6 space-y-6 overflow-y-auto flex flex-col justify-between"
        role="dialog"
        aria-modal="true"
        aria-label="Randomizer Settings"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2a3e52]">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-[#ff4655]" />
              <h2 className="text-xl font-bold font-tactical uppercase text-white tracking-wider">
                Randomizer Settings
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#8b9bb4] hover:text-white transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Repeat Avoidance Rules */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-[#ff4655] tracking-wider">
              Repeat Avoidance Rules
            </h3>

            <label className="flex items-center justify-between p-3 bg-[#152230] border border-[#2a3e52] cursor-pointer hover:border-[#2a3e52]/90">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Avoid Consecutive Weapon Repeats
                </span>
                <span className="text-xs text-[#8b9bb4]">
                  Prevents rolling the exact same weapon twice in a row when alternatives exist.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.avoidImmediateWeaponRepeats}
                onChange={(e) =>
                  onUpdateSettings({ avoidImmediateWeaponRepeats: e.target.checked })
                }
                className="w-4 h-4 accent-[#ff4655] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#152230] border border-[#2a3e52] cursor-pointer hover:border-[#2a3e52]/90">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Avoid Consecutive Armor Repeats
                </span>
                <span className="text-xs text-[#8b9bb4]">
                  Prevents rolling the exact same armor twice in a row when alternatives exist.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.avoidImmediateArmorRepeats}
                onChange={(e) =>
                  onUpdateSettings({ avoidImmediateArmorRepeats: e.target.checked })
                }
                className="w-4 h-4 accent-[#ff4655] cursor-pointer"
              />
            </label>
          </div>

          {/* Enabled Weapon Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-[#ff4655] tracking-wider">
              Enabled Weapon Categories
            </h3>
            <p className="text-xs text-[#8b9bb4]">
              Select which weapon types are allowed in the randomizer pool:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {ALL_WEAPON_CATEGORIES.map((cat) => {
                const isChecked = settings.enabledWeaponCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleWeaponCategory(cat)}
                    className={`flex items-center justify-between p-2.5 px-3 border text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
                      isChecked
                        ? 'bg-[#1e3042] border-[#ff4655] text-white'
                        : 'bg-[#152230] border-[#2a3e52] text-[#8b9bb4]'
                    }`}
                  >
                    <span>{cat.replace('_', ' ')}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-[#ff4655]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animation Intensity */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-[#ff4655] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Animation Intensity
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'reduced', label: 'Fast (Reduced)' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'high', label: 'Dramatic' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ animationIntensity: opt.id })}
                  className={`p-2 border text-xs font-mono text-center transition-colors ${
                    settings.animationIntensity === opt.id
                      ? 'bg-[#ff4655] border-[#ff4655] text-white font-bold'
                      : 'bg-[#152230] border-[#2a3e52] text-[#8b9bb4] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#2a3e52] space-y-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all saved data and settings completely?')) {
                onClearAllData();
                onClose();
              }
            }}
            className="w-full py-2.5 px-4 bg-[#152230] border border-red-500/50 hover:bg-red-500/10 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All Local Data
          </button>
        </div>
      </div>
    </div>
  );
};
