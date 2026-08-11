import React, { useState } from 'react';
import { BrainNode, BrainEdge } from '../types';
import { X, Network, Trash2, Edit3, Check, Link, Tag, Layers, Sparkles } from 'lucide-react';

interface NodeInspectorProps {
  node: BrainNode;
  nodes: BrainNode[];
  edges: BrainEdge[];
  onClose: () => void;
  onUpdateNode: (updatedNode: BrainNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onSelectNodeById: (id: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  nodes,
  edges,
  onClose,
  onUpdateNode,
  onDeleteNode,
  onSelectNodeById,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(node.label);
  const [cluster, setCluster] = useState(node.cluster);
  const [description, setDescription] = useState(node.description);

  // Connected Edges & Nodes
  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  );

  const connectedNodes = connectedEdges.map((edge) => {
    const otherId = edge.source === node.id ? edge.target : edge.source;
    return nodes.find((n) => n.id === otherId);
  }).filter(Boolean) as BrainNode[];

  const handleSave = () => {
    onUpdateNode({
      ...node,
      label,
      cluster,
      description,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed top-16 right-4 z-40 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto bg-[#0a0f1a]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-200 transition-all">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: node.color }}
          />
          <span className="text-xs mono-font text-slate-400 uppercase tracking-widest">
            Node Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Form / Info */}
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase">Cluster</label>
            <input
              type="text"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] mono-font text-slate-400 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              {node.label}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                title="Edit Node"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] mono-font px-2 py-0.5 rounded border"
                style={{
                  borderColor: `${node.color}55`,
                  color: node.color,
                  backgroundColor: `${node.color}15`,
                }}
              >
                Layer {node.layer}
              </span>
              <span className="text-xs text-slate-400 font-mono">{node.cluster}</span>
            </div>
          </div>

          {node.description && (
            <p className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
              {node.description}
            </p>
          )}

          {/* Connections Section */}
          <div className="pt-2">
            <h4 className="text-[11px] mono-font text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Link className="w-3 h-3 text-cyan-400" /> Connected Nodes ({connectedNodes.length})
            </h4>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {connectedNodes.map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => onSelectNodeById(conn.id)}
                  className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 text-xs transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: conn.color }}
                    />
                    <span className="text-slate-200">{conn.label}</span>
                  </span>
                  <span className="text-[10px] mono-font text-slate-500">L{conn.layer}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delete Action */}
          <div className="pt-3 border-t border-slate-800/80 flex justify-end">
            <button
              onClick={() => onDeleteNode(node.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 border border-rose-800/50 text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
