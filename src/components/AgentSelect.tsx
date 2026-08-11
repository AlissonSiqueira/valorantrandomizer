import React, { useState, useMemo } from 'react';
import { AgentRole } from '../types/domain';
import { AGENTS } from '../config/agents';
import { AgentCard } from './AgentCard';
import { AssetImage } from './AssetImage';
import { Search, Users } from 'lucide-react';

type AgentSelectProps = {
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
};

export const AgentSelect: React.FC<AgentSelectProps> = ({
  selectedAgentId,
  onSelectAgent,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AgentRole | 'all'>('all');

  const filteredAgents = useMemo(() => {
    return AGENTS.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || agent.role === roleFilter;
      return matchesSearch && matchesRole;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [search, roleFilter]);

  const handleSelect = (agentId: string) => {
    onSelectAgent(agentId);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 val-panel val-clip-corner border-l-4 border-l-[#ff4655] shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-wider font-tactical uppercase text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[#ff4655]" />
            Agent Selection (Alphabetical Roster)
          </h1>
          <p className="text-sm text-[#8b9bb4] mt-1">
            Choose your active Valorant agent to launch the 3-stage casino roulette match randomizer.
          </p>
        </div>

        {selectedAgentId && (
          <div className="flex items-center gap-3 bg-[#0f1923] p-3 px-5 border border-[#ff4655]/50 rounded val-clip-corner">
            <span className="text-xs font-mono text-[#8b9bb4]">ACTIVE AGENT:</span>
            <span className="text-base font-bold text-[#ff4655] uppercase tracking-wider font-tactical">
              {AGENTS.find((a) => a.id === selectedAgentId)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#152230] p-4 border border-[#2a3e52] val-clip-corner">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4]" />
          <input
            type="text"
            placeholder="Search agent (A-Z)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0f1923] border border-[#2a3e52] focus:border-[#ff4655] text-sm text-white placeholder-[#8b9bb4] outline-none transition-colors"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All Roles', roleIcon: null },
              { id: 'duelist', label: 'Duelist', roleIcon: '/assets/images/role-duelist.webp' },
              { id: 'initiator', label: 'Initiator', roleIcon: '/assets/images/role-initiator.webp' },
              { id: 'controller', label: 'Controller', roleIcon: '/assets/images/role-controller.webp' },
              { id: 'sentinel', label: 'Sentinel', roleIcon: '/assets/images/role-sentinel.webp' },
            ] as const
          ).map((tab) => {
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap val-clip-corner ${
                  isActive
                    ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.5)]'
                    : 'bg-[#0f1923] text-[#8b9bb4] border border-[#2a3e52] hover:border-[#ff4655]/50 hover:text-white'
                }`}
              >
                {tab.roleIcon ? (
                  <AssetImage
                    src={tab.roleIcon}
                    alt={tab.label}
                    type="ability"
                    fallbackName={tab.label}
                    className="w-4 h-4 object-contain"
                  />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Agents */}
      {filteredAgents.length === 0 ? (
        <div className="p-12 text-center bg-[#152230] border border-[#2a3e52] text-[#8b9bb4] val-clip-corner">
          No agents found matching "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={agent.id === selectedAgentId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
