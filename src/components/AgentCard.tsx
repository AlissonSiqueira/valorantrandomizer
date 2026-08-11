import React from 'react';
import { Agent } from '../types/domain';
import { AssetImage } from './AssetImage';

type AgentCardProps = {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agentId: string) => void;
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isSelected, onSelect }) => {
  const getRoleIcon = (role: Agent['role']) => {
    return (
      <AssetImage
        src={`/assets/images/role-${role}.webp`}
        alt={role}
        type="ability"
        fallbackName={role}
        className="w-3.5 h-3.5 object-contain"
      />
    );
  };

  const roleColors: Record<Agent['role'], string> = {
    duelist: 'border-[#ff4655]/40 text-[#ff4655] bg-[#ff4655]/10',
    controller: 'border-[#00e5ff]/40 text-[#00e5ff] bg-[#00e5ff]/10',
    initiator: 'border-[#ffb400]/40 text-[#ffb400] bg-[#ffb400]/10',
    sentinel: 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10',
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      className={`group relative flex flex-col justify-between p-3.5 text-left transition-all duration-200 val-clip-corner cursor-pointer ${
        isSelected
          ? 'bg-[#1e3042] border-2 border-[#ff4655] shadow-val-glow scale-[1.02]'
          : 'bg-[#152230]/90 border border-[#2a3e52] hover:border-[#ff4655]/60 hover:bg-[#1a2b3c]'
      }`}
      aria-pressed={isSelected}
      aria-label={`Select agent ${agent.name}, ${agent.role}`}
    >
      {/* Top Header: Role badge & Status */}
      <div className="flex items-center justify-between w-full mb-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
            roleColors[agent.role]
          }`}
        >
          {getRoleIcon(agent.role)}
          {agent.role}
        </span>
        {isSelected && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff4655] shadow-[0_0_8px_#ff4655] animate-pulse" />
        )}
      </div>

      {/* Center: Agent Portrait & Name */}
      <div className="flex items-center gap-3 my-2">
        <AssetImage
          src={agent.portraitPath}
          alt={agent.name}
          type="agent"
          fallbackName={agent.name}
          className="w-12 h-12 rounded object-cover border border-[#2a3e52] group-hover:border-[#ff4655]/50 transition-colors"
        />
        <div>
          <h3 className="font-bold text-base tracking-wide text-[#ece8e1] group-hover:text-white transition-colors">
            {agent.name}
          </h3>
          <p className="text-xs text-[#8b9bb4]">
            {agent.abilities.filter((a) => a.enabled).length} Abilities
          </p>
        </div>
      </div>

      {/* Bottom: Ability slots */}
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#2a3e52]/60">
        {agent.abilities.map((ability) => (
          <div
            key={ability.id}
            className="group/ab relative w-6 h-6 rounded bg-[#0f1923] border border-[#2a3e52] flex items-center justify-center text-[10px] font-mono text-[#8b9bb4]"
            title={`${ability.name} (${ability.slot})`}
          >
            <AssetImage
              src={ability.iconPath}
              alt={ability.name}
              type="ability"
              fallbackName={ability.name}
              className="w-4 h-4 object-contain"
            />
          </div>
        ))}
      </div>
    </button>
  );
};
