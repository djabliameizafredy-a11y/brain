import React from 'react';
import { BrainNode, BrainEdge } from '../types';

interface NodeTooltipProps {
  node: BrainNode;
  mousePos: { x: number; y: number };
  edges: BrainEdge[];
}

export const NodeTooltip: React.FC<NodeTooltipProps> = ({ node, mousePos, edges }) => {
  const connectionCount = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  ).length;

  const getRoleTitle = (layer: number) => {
    switch (layer) {
      case 0:
        return 'Hub (Core Executive)';
      case 1:
        return 'Branch (Primary Stack)';
      case 2:
        return 'Leaf (Component Detail)';
      default:
        return 'Node';
    }
  };

  // Position tooltip safely relative to viewport
  const offsetX = 18;
  const offsetY = 18;

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const left = mousePos.x + offsetX + 240 > screenWidth ? mousePos.x - 250 : mousePos.x + offsetX;
  const top = mousePos.y + offsetY + 180 > screenHeight ? mousePos.y - 190 : mousePos.y + offsetY;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-75 ease-out"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className="w-64 p-3.5 rounded-xl bg-[#0a0f1a]/95 backdrop-blur-md border border-slate-700/60 shadow-2xl text-slate-200">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: node.color }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full absolute"
              style={{ backgroundColor: node.color }}
            />
            <h3 className="font-semibold text-sm text-white truncate max-w-[150px]">
              {node.label}
            </h3>
          </div>
          <span
            className="text-[10px] mono-font font-medium uppercase px-2 py-0.5 rounded-md border"
            style={{
              borderColor: `${node.color}55`,
              color: node.color,
              backgroundColor: `${node.color}15`,
            }}
          >
            L{node.layer}
          </span>
        </div>

        <div className="space-y-1.5 text-xs mono-font text-slate-300">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">CLUSTER:</span>
            <span className="text-cyan-400 font-medium">{node.cluster}</span>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">ROLE:</span>
            <span className="text-purple-300">{getRoleTitle(node.layer)}</span>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">DEGREE:</span>
            <span className="text-emerald-400 font-medium">{connectionCount} links</span>
          </div>

          {node.description && (
            <p className="mt-2 text-[11px] font-sans text-slate-400 leading-relaxed line-clamp-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              {node.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
