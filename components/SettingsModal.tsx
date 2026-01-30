
import React, { useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { TeamState } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leftTeam: TeamState;
  rightTeam: TeamState;
  onUpdateLeft: (updates: Partial<TeamState>) => void;
  onUpdateRight: (updates: Partial<TeamState>) => void;
}

const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#f97316', // Orange
  '#ffffff', // White
  '#000000', // Black
];

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  onClose, 
  leftTeam, 
  rightTeam, 
  onUpdateLeft, 
  onUpdateRight 
}) => {
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (side === 'left') {
          onUpdateLeft({ logo: base64String });
        } else {
          onUpdateRight({ logo: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const TeamConfig = ({ team, onUpdate, inputRef, side }: { team: TeamState, onUpdate: (u: Partial<TeamState>) => void, inputRef: React.RefObject<HTMLInputElement>, side: 'left' | 'right' }) => (
    <div className="space-y-6 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Equipe {side === 'left' ? 'Lado Esquerdo' : 'Lado Direito'}</h3>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs mb-1 text-slate-400">Nome da Equipe</label>
          <input 
            type="text" 
            value={team.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs mb-2 text-slate-400">Escudo da Equipe</label>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              {team.logo ? (
                <img src={team.logo} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="text-slate-500" size={24} />
              )}
            </div>
            <button 
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
            >
              <Upload size={14} />
              Carregar Imagem
            </button>
            <input 
              type="file" 
              ref={inputRef}
              hidden 
              accept="image/*"
              onChange={(e) => handleImageUpload(side, e)}
            />
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-xs mb-2 text-slate-400">Cor Principal</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button 
                key={c}
                onClick={() => onUpdate({ color: c })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${team.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">Configurações das Equipes</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 overflow-y-auto">
          <TeamConfig side="left" team={leftTeam} onUpdate={onUpdateLeft} inputRef={leftInputRef} />
          <TeamConfig side="right" team={rightTeam} onUpdate={onUpdateRight} inputRef={rightInputRef} />
        </div>

        <div className="p-6 bg-slate-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 w-full md:w-auto"
          >
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
