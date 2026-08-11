import React, { useState, useMemo } from 'react';
import { AgentRole, Agent } from '../types/domain';
import { AGENTS } from '../config/agents';
import { AgentCard } from './AgentCard';
import { AssetImage } from './AssetImage';
import { Search, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetPath } from '@/utils/assetPath';

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
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const filteredAgents = useMemo(() => {
    return AGENTS.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || agent.role === roleFilter;
      return matchesSearch && matchesRole;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [search, roleFilter]);

  const displayAgent = useMemo(() => {
    const id = hoveredAgentId || selectedAgentId || filteredAgents[0]?.id;
    return AGENTS.find(a => a.id === id);
  }, [hoveredAgentId, selectedAgentId, filteredAgents]);

  const handleSelect = (agentId: string) => {
    if (isRandomizing) return;
    onSelectAgent(agentId);
  };

  const handleRandomize = () => {
    if (isRandomizing || filteredAgents.length === 0) return;
    setIsRandomizing(true);
    let duration = 3000;
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      const randomAgent = filteredAgents[Math.floor(Math.random() * filteredAgents.length)];
      setHoveredAgentId(randomAgent.id);
      elapsed += intervalTime;
      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRandomizing(false);
          const finalAgent = filteredAgents[Math.floor(Math.random() * filteredAgents.length)];
          setHoveredAgentId(finalAgent.id);
          
          // Wait 2.5 seconds before transitioning to the roulette
          setTimeout(() => {
            onSelectAgent(finalAgent.id);
          }, 2500);
        }, 300);
      }
    }, intervalTime);
  };

  const roleColors: Record<Agent['role'], string> = {
    duelist: 'text-[#ff4655]',
    controller: 'text-[#00e5ff]',
    initiator: 'text-[#ffb400]',
    sentinel: 'text-[#00ff88]',
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden bg-[#0f1923] flex flex-col justify-between">
      
      {/* BACKGROUND LARGE RENDER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center lg:justify-end lg:pr-20">
        <AnimatePresence mode="wait">
          {displayAgent && (
            <motion.div
              key={isRandomizing ? 'randomizing' : displayAgent.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-[80%] lg:h-[95%] opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <img 
                src={displayAgent.fullPortraitPath} 
                alt={displayAgent.name}
                className="h-full w-auto object-contain object-bottom"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = displayAgent.portraitPath; // fallback
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOP/LEFT AGENT INFO OVERLAY */}
      <div className="relative z-10 p-6 lg:p-12 max-w-2xl pointer-events-none mt-10">
        <AnimatePresence mode="wait">
          {displayAgent && (
            <motion.div
              key={isRandomizing ? 'info-randomizing' : `info-${displayAgent.id}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <AssetImage
                  src={assetPath(`/assets/images/role-${displayAgent.role}.webp`)}
                  alt={displayAgent.role}
                  type="ability"
                  className="w-6 h-6"
                />
                <span className={`text-sm font-mono font-bold uppercase tracking-[0.2em] ${roleColors[displayAgent.role]}`}>
                  {displayAgent.role}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase font-tactical text-transparent bg-clip-text bg-gradient-to-br from-white to-[#8b9bb4] tracking-wider mb-8 drop-shadow-lg">
                {displayAgent.name}
              </h1>

              {/* Abilities preview */}
              <div className="flex flex-col gap-4 pointer-events-auto">
                <p className="text-[#8b9bb4] text-xs font-mono uppercase tracking-widest border-b border-[#2a3e52] pb-1 w-max">
                  Abilities
                </p>
                <div className="flex flex-col gap-2">
                  {displayAgent.abilities.map((ability) => {
                    const getAbilityKey = (slot: string) => {
                      switch (slot) {
                        case 'basic_1': return 'C';
                        case 'basic_2': return 'Q';
                        case 'signature': return 'E';
                        case 'ultimate': return 'X - ULTIMATE';
                        default: return slot;
                      }
                    };
                    
                    return (
                      <div 
                        key={ability.id} 
                        className="flex items-center gap-3 bg-[#152230]/80 backdrop-blur border border-[#2a3e52] p-2 pr-4 rounded-lg hover:border-[#ff4655]/50 transition-colors group cursor-help w-full max-w-[280px]"
                        title={ability.description}
                      >
                        <div className="w-10 h-10 shrink-0 bg-[#0f1923] flex items-center justify-center border border-[#2a3e52] group-hover:border-[#ff4655] transition-colors relative">
                          <AssetImage
                            src={ability.iconPath}
                            alt={ability.name}
                            type="ability"
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm tracking-wide">{ability.name}</span>
                          <span className="text-[#8b9bb4] text-[10px] font-mono uppercase tracking-wider font-bold">
                            KEY: {getAbilityKey(ability.slot)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM ROSTER & FILTERS */}
      <div className="relative z-10 w-full p-4 lg:p-8 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/90 to-transparent pt-32">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 items-center">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#152230]/80 backdrop-blur p-2 border border-[#2a3e52] rounded-lg w-full sm:w-auto shadow-xl">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4]" />
              <input
                type="text"
                placeholder="Search agent (A-Z)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0f1923] border border-[#2a3e52] focus:border-[#ff4655] text-sm text-white placeholder-[#8b9bb4] outline-none transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
              {(
                [
                  { id: 'all', label: 'All', roleIcon: null },
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
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap rounded-md ${
                      isActive
                        ? 'bg-[#ff4655] text-white shadow-[0_0_10px_rgba(255,70,85,0.4)]'
                        : 'bg-[#0f1923] text-[#8b9bb4] hover:text-white'
                    }`}
                  >
                    {tab.roleIcon ? (
                      <AssetImage
                        src={assetPath(tab.roleIcon)}
                        alt={tab.label}
                        type="ability"
                        className="w-4 h-4 object-contain opacity-70"
                      />
                    ) : (
                      <Users className="w-4 h-4 opacity-70" />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roster Grid */}
          {filteredAgents.length === 0 ? (
            <div className="p-8 text-center text-[#8b9bb4] font-mono">
              No agents found matching "{search}".
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 lg:gap-4 max-w-[1200px]">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={agent.id === selectedAgentId}
                  isSimulatedHover={agent.id === hoveredAgentId && isRandomizing}
                  onSelect={handleSelect}
                  onHover={setHoveredAgentId}
                />
              ))}

              {/* Random Agent Button */}
              <button
                type="button"
                onClick={handleRandomize}
                disabled={isRandomizing}
                className={`group relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] transition-all duration-200 rounded-lg cursor-pointer overflow-hidden border border-[#2a3e52] hover:border-[#ff4655]/60 hover:scale-105 flex items-center justify-center bg-[#152230] ${isRandomizing ? 'animate-pulse shadow-[0_0_15px_rgba(255,70,85,0.4)] border-[#ff4655]' : ''}`}
                title="Random Agent"
              >
                <span className="text-4xl font-tactical text-[#8b9bb4] group-hover:text-white transition-colors">?</span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase text-center block w-full drop-shadow-md">
                    RANDOM
                  </span>
                </div>
              </button>
            </div>
          )}

          {selectedAgentId && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-8 py-3 bg-[#ff4655] text-white font-bold tracking-widest uppercase font-tactical text-xl rounded-lg shadow-[0_0_20px_rgba(255,70,85,0.5)] border border-white/20"
            >
              LOCKED IN: {AGENTS.find((a) => a.id === selectedAgentId)?.name}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
