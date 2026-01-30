
import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw, Play, Pause, Plus, Minus, TimerReset } from 'lucide-react';
import { TeamState, TeamSide } from './types';
import TeamSection from './components/TeamSection';
import TimerDisplay from './components/TimerDisplay';
import SettingsModal from './components/SettingsModal';

const INITIAL_TEAM_LEFT: TeamState = {
  name: 'EQUIPE A',
  color: '#ef4444', // Red
  score: 0,
  fouls: Array(5).fill(false),
  timeoutUsed: false,
};

const INITIAL_TEAM_RIGHT: TeamState = {
  name: 'EQUIPE B',
  color: '#3b82f6', // Blue
  score: 0,
  fouls: Array(5).fill(false),
  timeoutUsed: false,
};

const App: React.FC = () => {
  const [leftTeam, setLeftTeam] = useState<TeamState>(INITIAL_TEAM_LEFT);
  const [rightTeam, setRightTeam] = useState<TeamState>(INITIAL_TEAM_RIGHT);
  const [time, setTime] = useState(1200); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Reset timeouts when period changes
  useEffect(() => {
    setLeftTeam(prev => ({ ...prev, timeoutUsed: false }));
    setRightTeam(prev => ({ ...prev, timeoutUsed: false }));
  }, [period]);

  useEffect(() => {
    let interval: number;
    if (isRunning && time > 0) {
      interval = window.setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = useCallback(() => {
    setTime(1200);
    setIsRunning(false);
  }, []);

  const resetBoard = useCallback(() => {
    if (confirm('Tem certeza que deseja resetar TUDO (placar, faltas e tempo)?')) {
      setLeftTeam(INITIAL_TEAM_LEFT);
      setRightTeam(INITIAL_TEAM_RIGHT);
      setTime(1200);
      setIsRunning(false);
      setPeriod(1);
    }
  }, []);

  const updateTeam = (side: TeamSide, updates: Partial<TeamState>) => {
    if (side === 'left') {
      setLeftTeam((prev) => ({ ...prev, ...updates }));
    } else {
      setRightTeam((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleFoulToggle = (side: TeamSide, index: number) => {
    const team = side === 'left' ? leftTeam : rightTeam;
    const newFouls = [...team.fouls];
    newFouls[index] = !newFouls[index];
    updateTeam(side, { fouls: newFouls });
  };

  const handleTimeoutToggle = (side: TeamSide) => {
    const team = side === 'left' ? leftTeam : rightTeam;
    updateTeam(side, { timeoutUsed: !team.timeoutUsed });
  };

  const changeScore = (side: TeamSide, delta: number) => {
    const team = side === 'left' ? leftTeam : rightTeam;
    const newScore = Math.max(0, team.score + delta);
    updateTeam(side, { score: newScore });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 md:p-8 bg-slate-950 text-white select-none overflow-y-auto landscape:overflow-y-hidden">
      {/* Header / Brand - Hidden in mobile landscape to save space */}
      <div className="mb-4 md:mb-6 text-center landscape:hidden lg:landscape:block">
        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-blue-500 italic flex items-center justify-center gap-2">
          FUTSAL <span className="text-white">TAPAJÓS</span>
        </h1>
        <p className="text-slate-400 text-[10px] md:text-sm uppercase tracking-widest mt-1">Placar Eletrônico Oficial</p>
      </div>

      {/* Main Scoreboard Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 landscape:grid-cols-[1fr_0.8fr_1fr] lg:grid-cols-[1fr_0.8fr_1fr] gap-2 md:gap-6 items-stretch">
        
        {/* Left Team */}
        <TeamSection 
          side="left"
          team={leftTeam}
          onScoreChange={(d) => changeScore('left', d)}
          onFoulToggle={(i) => handleFoulToggle('left', i)}
          onTimeoutToggle={() => handleTimeoutToggle('left')}
          onNameChange={(newName) => updateTeam('left', { name: newName })}
        />

        {/* Center: Clock & Controls */}
        <div className="flex flex-col items-center justify-between py-3 md:py-4 space-y-4 md:space-y-6 bg-slate-900/50 rounded-2xl md:rounded-3xl p-3 md:p-6 border border-slate-800 neon-border landscape:order-2">
          <div className="text-center w-full">
            <span className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] md:text-xs">Período</span>
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-1 md:mt-2">
              <button 
                onClick={() => setPeriod(Math.max(1, period - 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 transition"
              ><Minus size={14}/></button>
              <span className="text-2xl md:text-4xl font-digital text-yellow-500">{period}º</span>
              <button 
                onClick={() => setPeriod(period + 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 transition"
              ><Plus size={14}/></button>
            </div>
          </div>

          <TimerDisplay time={time} onTimeChange={setTime} onReset={resetTimer} />

          <div className="flex flex-col items-center gap-2 md:gap-4 w-full">
            <button 
              onClick={toggleTimer}
              className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/20' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
              }`}
            >
              {isRunning ? <Pause size={20}/> : <Play size={20}/>}
              {isRunning ? 'PAUSAR' : 'INICIAR'}
            </button>

            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={resetTimer}
                className="p-2 md:p-3 bg-slate-800 rounded-full hover:bg-slate-700 active:bg-yellow-900/20 transition group flex items-center gap-2 border border-yellow-500/20"
                title="Resetar Tempo"
              >
                <TimerReset size={18} className="text-yellow-500 group-hover:rotate-[-45deg] transition-transform" />
                <span className="text-[10px] hidden md:block">Reset Tempo</span>
              </button>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 md:p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition border border-slate-700"
                title="Configurações"
              >
                <Settings size={18} />
              </button>
              
              <button 
                onClick={resetBoard}
                className="p-2 md:p-3 bg-slate-800 rounded-full hover:bg-red-900/30 border border-red-500/20 transition group flex items-center gap-2"
                title="Resetar Tudo"
              >
                <RefreshCw size={18} className="text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] hidden md:block">Tudo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Team */}
        <TeamSection 
          side="right"
          team={rightTeam}
          onScoreChange={(d) => changeScore('right', d)}
          onFoulToggle={(i) => handleFoulToggle('right', i)}
          onTimeoutToggle={() => handleTimeoutToggle('right')}
          onNameChange={(newName) => updateTeam('right', { name: newName })}
        />
      </div>

      {/* Modals */}
      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          leftTeam={leftTeam}
          rightTeam={rightTeam}
          onUpdateLeft={(u) => updateTeam('left', u)}
          onUpdateRight={(u) => updateTeam('right', u)}
        />
      )}
    </div>
  );
};

export default App;
