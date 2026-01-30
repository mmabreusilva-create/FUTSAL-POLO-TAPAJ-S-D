
import React, { useState } from 'react';
import { Plus, Minus, Edit2, Shield, Bell } from 'lucide-react';
import { TeamState } from '../types';

interface TeamSectionProps {
  side: 'left' | 'right';
  team: TeamState;
  onScoreChange: (delta: number) => void;
  onFoulToggle: (index: number) => void;
  onTimeoutToggle: () => void;
  onNameChange: (newName: string) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ 
  side, 
  team, 
  onScoreChange, 
  onFoulToggle, 
  onTimeoutToggle,
  onNameChange
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(team.name);

  const handleNameSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tempName.trim()) {
      onNameChange(tempName.toUpperCase());
    } else {
      setTempName(team.name);
    }
    setIsEditingName(false);
  };

  return (
    <div className={`flex flex-col space-y-2 md:space-y-4 ${side === 'right' ? 'landscape:order-3' : 'landscape:order-1'}`}>
      
      {/* Team Header - Editable Name and Logo */}
      <div 
        className="rounded-xl md:rounded-2xl p-2 md:p-4 border-b-2 md:border-b-4 text-center transition-all group relative cursor-pointer min-h-[60px] md:min-h-[100px] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: `${team.color}15`, borderBottomColor: team.color }}
        onClick={() => !isEditingName && setIsEditingName(true)}
      >
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="w-full">
            <input
              autoFocus
              type="text"
              className="bg-transparent border-b-2 border-white/20 text-lg md:text-2xl font-black uppercase tracking-tight text-center w-full focus:outline-none focus:border-white/50"
              style={{ color: team.color }}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => handleNameSubmit()}
            />
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 md:gap-4 w-full">
            {team.logo ? (
              <img src={team.logo} alt="Logo" className="w-8 h-8 md:w-14 md:h-14 object-contain" />
            ) : (
              <Shield size={24} className="md:size-32 opacity-20" style={{ color: team.color }} />
            )}
            
            <h2 className="text-lg md:text-3xl font-black uppercase tracking-tight truncate px-1 md:px-2 flex-1" style={{ color: team.color }}>
              {team.name}
            </h2>
            <Edit2 size={12} className="opacity-0 group-hover:opacity-50 transition-opacity absolute right-2" style={{ color: team.color }} />
          </div>
        )}
      </div>

      {/* Score and Controls */}
      <div className="bg-slate-900 rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center space-y-2 md:space-y-4 shadow-xl relative overflow-hidden flex-1 justify-center min-h-[140px] md:min-h-[200px]">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: team.color }}></div>
        
        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Gols</span>
        
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={(e) => { e.stopPropagation(); onScoreChange(-1); }}
            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full transition-transform active:scale-95"
          >
            <Minus size={16} />
          </button>
          
          <div className="text-6xl md:text-9xl font-digital text-white font-bold min-w-[70px] md:min-w-[120px] text-center">
            {team.score}
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onScoreChange(1); }}
            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full transition-transform active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Fouls and Timeout Container */}
      <div className="grid grid-cols-[1fr_0.6fr] gap-2 md:gap-4">
        {/* Fouls */}
        <div className="bg-slate-900 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col items-center space-y-1 md:space-y-2">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Faltas</span>
          <div className="flex gap-1 md:gap-1.5">
            {team.fouls.map((isSet, i) => (
              <div 
                key={i}
                onClick={() => onFoulToggle(i)}
                className={`w-3 h-5 md:w-5 md:h-8 rounded cursor-pointer transition-all ${
                  isSet 
                    ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' 
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timeout - Single Button per period */}
        <div className="bg-slate-900 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col items-center space-y-1 md:space-y-2">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">T. Técnico</span>
          <button 
            onClick={onTimeoutToggle}
            className={`w-full flex-1 rounded-lg md:rounded-xl flex items-center justify-center gap-1 transition-all border-2 ${
              team.timeoutUsed 
                ? 'bg-amber-600 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Bell size={14} className={team.timeoutUsed ? 'animate-bounce' : 'opacity-40'} />
            <span className="text-[10px] font-bold md:block hidden">PEDIR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
