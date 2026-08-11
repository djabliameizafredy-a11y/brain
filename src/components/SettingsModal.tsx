import React, { useState } from 'react';
import { PhysicsParams } from '../types';
import { X, Sliders, RotateCcw, Zap, Activity, Cpu, Sparkles } from 'lucide-react';
import { PRESET_DATASETS } from '../data/defaultGraph';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  physicsParams: PhysicsParams;
  setPhysicsParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  autoMorphSpeed: number;
  setAutoMorphSpeed: (val: number) => void;
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onResetPhysics: () => void;
  onGenerateCustomDataset?: (nodeCount: number, edgeCount: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  physicsParams,
  setPhysicsParams,
  autoMorphSpeed,
  setAutoMorphSpeed,
  currentPresetId,
  onSelectPreset,
  onResetPhysics,
  onGenerateCustomDataset,
}) => {
  const [customNodes, setCustomNodes] = useState<number>(10000);
  const [customEdges, setCustomEdges] = useState<number>(12000);

  if (!isOpen) return null;

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGenerateCustomDataset) {
      onGenerateCustomDataset(customNodes, customEdges);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white mono-font uppercase tracking-wider">
              Simulation & Network Controls
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Preset Selector */}
          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase tracking-wider mb-1 block">
              Ecosystem Preset
            </label>
            <div className="relative">
              <select
                value={currentPresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 mono-font px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              >
                {PRESET_DATASETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Network Generator Section */}
          <div className="p-3 bg-slate-950/90 rounded-xl border border-purple-500/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold mono-font text-[11px] uppercase">
              <Cpu className="w-3.5 h-3.5" />
              Generator (~10,000 Scale)
            </div>
            <p className="text-[11px] text-slate-400">
              Instantly construct dense scale-free graph topologies with high-performance spatial grid physics.
            </p>

            <form onSubmit={handleCustomGenerate} className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] mono-font text-slate-400 block mb-1">
                    Nodes:
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="20000"
                    step="500"
                    value={customNodes}
                    onChange={(e) => setCustomNodes(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg mono-font text-cyan-400 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] mono-font text-slate-400 block mb-1">
                    Links:
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="30000"
                    step="500"
                    value={customEdges}
                    onChange={(e) => setCustomEdges(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg mono-font text-cyan-400 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 transition-all text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate {customNodes.toLocaleString()} Nodes & {customEdges.toLocaleString()} Links
              </button>
            </form>
          </div>

          {/* Physics Sliders */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Force Repulsion
              </span>
              <span className="mono-font text-cyan-400">{physicsParams.repulsion}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="200"
              value={physicsParams.repulsion}
              onChange={(e) =>
                setPhysicsParams((prev) => ({
                  ...prev,
                  repulsion: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300">Spring Target Length</span>
              <span className="mono-font text-cyan-400">{physicsParams.springLength}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={physicsParams.springLength}
              onChange={(e) =>
                setPhysicsParams((prev) => ({
                  ...prev,
                  springLength: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" /> Signal Transmission Speed
              </span>
              <span className="mono-font text-purple-400">{physicsParams.signalSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={physicsParams.signalSpeed}
              onChange={(e) =>
                setPhysicsParams((prev) => ({
                  ...prev,
                  signalSpeed: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300">Auto-Morph Speed</span>
              <span className="mono-font text-purple-400">{autoMorphSpeed.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.002"
              max="0.02"
              step="0.001"
              value={autoMorphSpeed}
              onChange={(e) => setAutoMorphSpeed(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onResetPhysics}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
