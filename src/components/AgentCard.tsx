import React from 'react';
import { Agent } from '../types/domain';
import { AssetImage } from './AssetImage';

type AgentCardProps = {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agentId: string) => void;
  onHover?: (agentId: string) => void;
  onLeave?: () => void;
};

export const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  isSelected, 
  onSelect,
  onHover,
  onLeave 
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      onMouseEnter={() => onHover?.(agent.id)}
      onMouseLeave={() => onLeave?.()}
      className={`group relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] transition-all duration-200 rounded-lg cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-2 border-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.4)] scale-105 z-10'
          : 'border border-[#2a3e52] hover:border-[#ff4655]/60 hover:scale-105 z-0'
      }`}
      aria-pressed={isSelected}
      aria-label={`Select agent ${agent.name}, ${agent.role}`}
    >
      <div className={`absolute inset-0 bg-[#152230] transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'opacity-40 group-hover:opacity-10'}`} />
      
      <AssetImage
        src={agent.portraitPath}
        alt={agent.name}
        type="agent"
        fallbackName={agent.name}
        className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0'}`}
      />

      {/* Name Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase text-center block w-full drop-shadow-md">
          {agent.name}
        </span>
      </div>
    </button>
  );
};
