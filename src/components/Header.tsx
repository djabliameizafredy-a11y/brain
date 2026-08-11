import React from 'react';
import { ViewMode } from '../types';
import { Network, GitGraph, RefreshCw, Plus, Info, Settings2, Sparkles } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  morphFactor: number;
  nodeCount: number;
  edgeCount: number;
  fps: number;
  presetName: string;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
  onOpenAddNode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  morphFactor,
  nodeCount,
  edgeCount,
  fps,
  presetName,
  onOpenInfo,
  onOpenSettings,
  onOpenAddNode,
}) => {
  const morphPercentage = Math.round(morphFactor * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 py-3 bg-[#05070c]/85 backdrop-blur-md border-b border-slate-800/60 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Title & Concept Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 glow-cyan">
              <Network className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Second Brain
                <span className="text-[10px] mono-font tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  Dual Topo
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Knowledge Graph ⇄ Neural Network: The exact same data structure in two geometric layouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenInfo}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Concept Explained"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Layout Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-full border border-slate-800/80 shadow-lg">
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium mono-font transition-all ${
              viewMode === 'graph'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GitGraph className="w-3.5 h-3.5" />
            Graph (0%)
          </button>

          <button
            onClick={() => setViewMode('neural')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium mono-font transition-all ${
              viewMode === 'neural'
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/20 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Neural (100%)
          </button>

          <button
            onClick={() => setViewMode('automorph')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium mono-font transition-all ${
              viewMode === 'automorph'
                ? 'bg-gradient-to-r from-coral-500 via-pink-500 to-purple-600 text-white shadow-md shadow-rose-500/20 border border-rose-400/40 bg-[#ff6b4a]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            style={viewMode === 'automorph' ? { backgroundColor: '#ff6b4a' } : {}}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${viewMode === 'automorph' ? 'animate-spin' : ''}`} />
            Auto-Morph
          </button>
        </div>

        {/* Metrics & Desktop Quick Actions */}
        <div className="hidden lg:flex items-center gap-3 text-xs mono-font text-slate-400">
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
            <span>NODES: <strong className="text-cyan-400">{nodeCount}</strong></span>
            <span className="text-slate-700">|</span>
            <span>LINKS: <strong className="text-cyan-400">{edgeCount}</strong></span>
            <span className="text-slate-700">|</span>
            <span>MORPH: <strong className="text-purple-400">{morphPercentage}%</strong></span>
            <span className="text-slate-700">|</span>
            <span>FPS: <strong className="text-emerald-400">{fps}</strong></span>
          </div>

          <button
            onClick={onOpenAddNode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 transition-all text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Node
          </button>

          <button
            onClick={onOpenInfo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-xs"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Concept
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            title="Controls & Presets"
          >
            <Settings2 className="w-4 h-4 text-purple-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
