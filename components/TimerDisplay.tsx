
import React, { useState } from 'react';
import { Edit2, TimerReset } from 'lucide-react';

interface TimerDisplayProps {
  time: number;
  onTimeChange: (newTime: number) => void;
  onReset?: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, onTimeChange, onReset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = editValue.split(':');
    let m = 0, s = 0;
    
    if (parts.length === 2) {
      m = Number(parts[0]);
      s = Number(parts[1]);
    } else if (parts.length === 1) {
      m = Number(parts[0]);
      s = 0;
    }

    if (!isNaN(m) && !isNaN(s)) {
      onTimeChange(m * 60 + Math.min(59, s));
    }
    setIsEditing(false);
  };

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(formatTime(time));
    setIsEditing(true);
  };

  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReset) onReset();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Cronômetro</span>
      {isEditing ? (
        <form onSubmit={handleManualEdit} className="relative">
          <input
            autoFocus
            type="text"
            className="bg-transparent border-b-2 border-yellow-500 text-4xl md:text-7xl font-digital text-yellow-500 text-center w-32 md:w-56 focus:outline-none"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleManualEdit(new Event('submit') as any)}
            placeholder="20:00"
          />
        </form>
      ) : (
        <div className="flex flex-col items-center group">
          <div 
            onClick={startEdit}
            className="text-4xl md:text-8xl font-digital text-yellow-500 cursor-pointer hover:opacity-80 transition-opacity drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]"
          >
            {formatTime(time)}
          </div>
          <div className="flex items-center gap-4 mt-1">
            <button 
              onClick={startEdit}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 hover:text-yellow-500 transition-colors py-1 px-2"
            >
              <Edit2 size={12} />
              Editar
            </button>
            {onReset && (
              <button 
                onClick={handleResetClick}
                className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 hover:text-yellow-500 transition-colors py-1 px-2"
              >
                <TimerReset size={12} />
                Reiniciar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
