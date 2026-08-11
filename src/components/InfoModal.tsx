import React from 'react';
import { X, Network, GitGraph, Sparkles, Binary, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#0a0f1a] border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white mono-font">
                Topological Identity Thesis
              </h2>
              <p className="text-xs text-slate-400">
                Knowledge Graph (Obsidian) ≡ Neural Network Layer Layout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <h3 className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> What is "Second Brain"?
            </h3>
            <p>
              This visualization proves that an organic knowledge graph (popularized by personal knowledge management tools like <strong>Obsidian</strong>) and an artificial neural network are <strong>the exact same topological structure</strong> G = (V, E) — consisting of nodes (neurons/concepts) and directed or undirected links (synapses/edges).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mono-font">
                <GitGraph className="w-4 h-4" /> 1. Mode "Graph"
              </div>
              <p className="text-[11px] text-slate-400">
                Force-directed physics with Coulomb repulsion and Hooke springs. Nodes self-organize organically by clustering semantic proximity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-400 font-semibold mono-font">
                <Network className="w-4 h-4" /> 2. Mode "Neural"
              </div>
              <p className="text-[11px] text-slate-400">
                Layered column projection (Layer 0 → Layer 1 → Layer 2). The exact same adjacency matrix rendered as an artificial feedforward neural network with signal pulses.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white mono-font text-[11px] uppercase tracking-wider">
              Math & Transformation Properties
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Homomorphism:</strong> The node degree distribution and adjacency weights remain invariant during morphing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Continuous Morph:</strong> Easing curves continuously interpolate each node’s coordinate: X(t) = X_graph · (1 - t) + X_neural · t.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Signal Transmission:</strong> Particles model neural activation spikes flowing across connections.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
            >
              Explore Dual Topo Engine
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
