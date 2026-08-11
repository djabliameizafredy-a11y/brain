import React from 'react';
import { ViewMode, PhysicsParams } from '../types';
import { Play, Pause, RotateCcw, Sliders, Database, Layers, Sparkles } from 'lucide-react';
import { PRESET_DATASETS } from '../data/defaultGraph';

interface ControlPanelProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  morphFactor: number;
  setMorphFactor: (val: number) => void;
  autoMorphSpeed: number;
  setAutoMorphSpeed: (val: number) => void;
  physicsParams: PhysicsParams;
  setPhysicsParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onResetLayout: () => void;
  onToggleSettingsModal: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  viewMode,
  setViewMode,
  morphFactor,
  setMorphFactor,
  autoMorphSpeed,
  setAutoMorphSpeed,
  physicsParams,
  setPhysicsParams,
  currentPresetId,
  onSelectPreset,
  onResetLayout,
  onToggleSettingsModal,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl bg-[#0a0f1a]/90 backdrop-blur-xl border border-slate-800/80 rounded-full p-2 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between gap-3 px-2">
        
        {/* Preset Selector */}
        <div className="hidden sm:flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <select
            value={currentPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-slate-950/90 text-xs text-slate-200 mono-font px-2.5 py-1.5 rounded-full border border-slate-800 focus:outline-none focus:border-cyan-500"
          >
            {PRESET_DATASETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Morph Slider */}
        <div className="flex-1 flex items-center gap-3 px-2">
          <span className="text-[11px] mono-font text-cyan-400 font-semibold tracking-wider">
            GRAPH
          </span>
          
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={morphFactor}
              onChange={(e) => {
                if (viewMode === 'automorph') setViewMode('graph');
                setMorphFactor(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300 transition-all"
            />
          </div>

          <span className="text-[11px] mono-font text-purple-400 font-semibold tracking-wider">
            NEURAL
          </span>
        </div>

        {/* Controls Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetLayout}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 transition-all"
            title="Reset Simulation Positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleSettingsModal}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-500/30 transition-all"
            title="Physics & Network Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
