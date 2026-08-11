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
    <div className="relative w-full h-full flex-1 overflow-hidden bg-[#0f1923] flex flex-col justify-between">
      
      {/* BACKGROUND LARGE RENDER */}
      <div className="hidden sm:flex absolute inset-0 pointer-events-none overflow-hidden items-center justify-end pr-4 lg:items-end lg:justify-end lg:pr-20 pb-40 lg:pb-0">
        <AnimatePresence mode="wait">
          {displayAgent && (
            <motion.div
              key={isRandomizing ? 'randomizing' : displayAgent.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-[55%] sm:h-[70%] lg:h-[95%] opacity-40 sm:opacity-75 lg:opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-end"
            >
              <img 
                src={displayAgent.fullPortraitPath} 
                alt={displayAgent.name}
                className="h-full w-auto object-contain object-right lg:object-bottom"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = displayAgent.portraitPath; // fallback
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOP/LEFT AGENT INFO OVERLAY */}
      <div className="hidden sm:block relative z-10 p-4 lg:p-12 max-w-2xl pointer-events-none lg:mt-4">
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
              <h1 className="text-5xl md:text-8xl font-black uppercase font-tactical text-transparent bg-clip-text bg-gradient-to-br from-white to-[#8b9bb4] tracking-wider mb-4 lg:mb-8 drop-shadow-lg">
                {displayAgent.name}
              </h1>

              {/* Abilities preview */}
              <div className="flex flex-col gap-2 lg:gap-4 pointer-events-auto">
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
                        className="flex items-center gap-2 lg:gap-3 bg-[#152230]/80 backdrop-blur border border-[#2a3e52] p-1.5 lg:p-2 lg:pr-4 rounded-lg hover:border-[#ff4655]/50 transition-colors group cursor-help w-full max-w-[220px] lg:max-w-[280px]"
                        title={ability.description}
                      >
                        <div className="w-8 h-8 lg:w-10 lg:h-10 shrink-0 bg-[#0f1923] flex items-center justify-center border border-[#2a3e52] group-hover:border-[#ff4655] transition-colors relative">
                          <AssetImage
                            src={ability.iconPath}
                            alt={ability.name}
                            type="ability"
                            className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-xs lg:text-sm tracking-wide leading-tight">{ability.name}</span>
                          <span className="text-[#8b9bb4] text-[9px] lg:text-[10px] font-mono uppercase tracking-wider font-bold">
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
      <div className="relative z-10 w-full p-2 sm:p-4 lg:p-8 pt-4 sm:pt-8 lg:pt-16 my-auto">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 lg:gap-6 items-center px-4">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#152230]/80 backdrop-blur p-3 border border-[#2a3e52] rounded-xl w-full shadow-xl">
            <div className="hidden sm:block relative w-full md:max-w-xs lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4]" />
              <input
                type="text"
                placeholder="Search agent (A-Z)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0f1923] border border-[#2a3e52] focus:border-[#ff4655] text-sm text-white placeholder-[#8b9bb4] outline-none transition-colors rounded-lg"
              />
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide justify-start md:justify-end">
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

          {/* MOBILE ONLY SELECTED / HOVERED AGENT BANNER */}
          <div className="block sm:hidden w-full text-center my-1">
            <AnimatePresence mode="wait">
              {displayAgent && (
                <motion.div
                  key={displayAgent.id}
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center justify-center gap-3 px-5 py-2.5 bg-[#152230]/95 backdrop-blur border border-[#ff4655] rounded-xl shadow-[0_0_20px_rgba(255,70,85,0.4)]"
                >
                  <AssetImage
                    src={displayAgent.portraitPath}
                    alt={displayAgent.name}
                    type="ability"
                    className="w-9 h-9 rounded-lg border border-[#ff4655] object-cover bg-[#0f1923]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-[#ff4655] font-extrabold uppercase tracking-widest leading-none">
                      {isRandomizing ? 'RANDOMIZING...' : 'SELECTED AGENT'}
                    </span>
                    <span className="text-xl font-black font-tactical text-white uppercase tracking-wider leading-none mt-1">
                      {displayAgent.name}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                className={`group relative w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] lg:w-[84px] lg:h-[84px] transition-all duration-200 rounded-lg cursor-pointer overflow-hidden border border-[#2a3e52] hover:border-[#ff4655]/60 hover:scale-105 flex items-center justify-center bg-[#152230] ${isRandomizing ? 'animate-pulse shadow-[0_0_15px_rgba(255,70,85,0.4)] border-[#ff4655]' : ''}`}
                title="Random Agent"
              >
                <span className="text-3xl lg:text-4xl font-tactical text-[#8b9bb4] group-hover:text-white transition-colors">?</span>
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
