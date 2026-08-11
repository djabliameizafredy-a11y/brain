import React, { useState } from 'react';
import { BrainNode } from '../types';
import { COLOR_HUB, COLOR_SECTION, COLOR_SUBSECTION, COLOR_CATEGORY, COLOR_LEAF } from '../data/defaultGraph';
import { X, Plus, Link, Sparkles } from 'lucide-react';

interface AddNodeModalProps {
  isOpen: boolean;
  nodes: BrainNode[];
  onClose: () => void;
  onAddNode: (
    newNode: Omit<BrainNode, 'x' | 'y' | 'simX' | 'simY' | 'vx' | 'vy' | 'neuralX' | 'neuralY'>,
    connectedTargetIds: string[]
  ) => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  nodes,
  onClose,
  onAddNode,
}) => {
  const [label, setLabel] = useState('');
  const [cluster, setCluster] = useState('Custom Topic');
  const [layer, setLayer] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const id = `custom-${Date.now()}`;
    let color = COLOR_LEAF;
    let r = 5;
    if (layer === 0) {
      color = COLOR_HUB;
      r = 20;
    } else if (layer === 1) {
      color = COLOR_SECTION;
      r = 14;
    } else if (layer === 2) {
      color = COLOR_SUBSECTION;
      r = 9;
    } else if (layer === 3) {
      color = COLOR_CATEGORY;
      r = 6;
    }

    onAddNode(
      {
        id,
        label: label.trim(),
        cluster: cluster.trim() || 'General',
        layer,
        color,
        r,
        description: description.trim() || 'Custom user created knowledge node.',
      },
      selectedConnections
    );

    // Reset form
    setLabel('');
    setDescription('');
    setSelectedConnections([]);
    onClose();
  };

  const toggleConnection = (nodeId: string) => {
    setSelectedConnections((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white mono-font uppercase tracking-wider">
              Add Knowledge Node
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase tracking-wider block mb-1">
              Node Label *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Graph Convolutional Net"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] mono-font text-slate-400 uppercase tracking-wider block mb-1">
                Cluster Group
              </label>
              <input
                type="text"
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] mono-font text-slate-400 uppercase tracking-wider block mb-1">
                Hierarchy Layer
              </label>
              <select
                value={layer}
                onChange={(e) => setLayer(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 mono-font"
              >
                <option value={0}>Layer 0 (My Brain Core Root)</option>
                <option value={1}>Layer 1 (Major Section)</option>
                <option value={2}>Layer 2 (Sub-Section)</option>
                <option value={3}>Layer 3 (Category)</option>
                <option value={4}>Layer 4 (Detail Leaf)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary or role of this node in your second brain..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Connect to Existing Nodes */}
          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Link className="w-3 h-3 text-cyan-400" /> Connect To Existing Nodes ({selectedConnections.length})
            </label>

            <div className="max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              {nodes.map((n) => {
                const isSelected = selectedConnections.includes(n.id);
                return (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => toggleConnection(n.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                        : 'hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: n.color }} />
                      <span>{n.label}</span>
                    </span>
                    <span className="text-[10px] mono-font text-slate-500">L{n.layer}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:opacity-90"
            >
              Create Node
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
