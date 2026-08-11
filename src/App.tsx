import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrainNode, BrainEdge, ViewMode, PhysicsParams } from './types';
import { PRESET_DATASETS } from './data/defaultGraph';
import { DEFAULT_PHYSICS, initializeSimulationPositions } from './utils/physics';
import { generateLargeDataset } from './utils/generator';
import { Header } from './components/Header';
import { BrainCanvas } from './components/BrainCanvas';
import { NodeTooltip } from './components/NodeTooltip';
import { ControlPanel } from './components/ControlPanel';
import { NodeInspector } from './components/NodeInspector';
import { SettingsModal } from './components/SettingsModal';
import { InfoModal } from './components/InfoModal';
import { AddNodeModal } from './components/AddNodeModal';

export default function App() {
  const [currentPresetId, setCurrentPresetId] = useState<string>('second-brain-ai');

  // Network Nodes & Edges State
  const [nodes, setNodes] = useState<BrainNode[]>([]);
  const [edges, setEdges] = useState<BrainEdge[]>([]);

  // View Mode & Morphing State
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [morphFactor, setMorphFactor] = useState<number>(0);
  const [autoMorphSpeed, setAutoMorphSpeed] = useState<number>(0.005);

  // Physics Parameters State
  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>(DEFAULT_PHYSICS);

  // Hover & Selection State
  const [selectedNode, setSelectedNode] = useState<BrainNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<BrainNode | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Performance FPS
  const [fps, setFps] = useState<number>(60);

  // Modals state
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState<boolean>(false);

  // Auto-morph time ref
  const autoMorphTimeRef = useRef<number>(0);

  // Load Preset Dataset
  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESET_DATASETS.find((p) => p.id === presetId) || PRESET_DATASETS[0];
    setCurrentPresetId(preset.id);

    // Build raw nodes
    const rawNodes: BrainNode[] = preset.nodes.map((n) => ({
      ...n,
      x: 0,
      y: 0,
      simX: 0,
      simY: 0,
      vx: 0,
      vy: 0,
      neuralX: 0,
      neuralY: 0,
    }));

    // Build raw edges with unique IDs
    const rawEdges: BrainEdge[] = preset.edges.map((e, idx) => ({
      ...e,
      id: `edge-${idx}`,
    }));

    setNodes(rawNodes);
    setEdges(rawEdges);
    setSelectedNode(null);
    setHoveredNode(null);
  }, []);

  // Generate Custom Scale Dataset (e.g. 10,000 Nodes, 12,000 Edges)
  const handleGenerateCustomDataset = (nodeCount: number, edgeCount: number) => {
    const customPreset = generateLargeDataset(
      `custom-${Date.now()}`,
      `Custom Brain (${nodeCount.toLocaleString()} Nodes & ${edgeCount.toLocaleString()} Links)`,
      `User-configured scale dataset with ${nodeCount} nodes and ${edgeCount} links.`,
      nodeCount,
      edgeCount
    );

    setCurrentPresetId(customPreset.id);

    const rawNodes: BrainNode[] = customPreset.nodes.map((n) => ({
      ...n,
      x: 0,
      y: 0,
      simX: 0,
      simY: 0,
      vx: 0,
      vy: 0,
      neuralX: 0,
      neuralY: 0,
    }));

    const rawEdges: BrainEdge[] = customPreset.edges.map((e, idx) => ({
      ...e,
      id: `edge-${idx}`,
    }));

    setNodes(rawNodes);
    setEdges(rawEdges);
    setSelectedNode(null);
    setHoveredNode(null);
  };

  // Initialize dataset on mount (defaulting to mega-10000)
  useEffect(() => {
    loadPreset('mega-10000');
  }, [loadPreset]);

  // Handle Mode & Morph Factor Transitions
  useEffect(() => {
    if (viewMode === 'graph') {
      setMorphFactor(0);
    } else if (viewMode === 'neural') {
      setMorphFactor(1);
    }
  }, [viewMode]);

  // Auto-morph animation loop
  useEffect(() => {
    if (viewMode !== 'automorph') return;

    let animId: number;
    const step = () => {
      autoMorphTimeRef.current += autoMorphSpeed;
      const targetMorph = (1 + Math.sin(autoMorphTimeRef.current)) / 2;
      setMorphFactor(targetMorph);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, autoMorphSpeed]);

  // Reset simulation positions
  const handleResetLayout = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    setNodes((prevNodes) => {
      const reset = prevNodes.map((n) => ({
        ...n,
        simX: 0,
        simY: 0,
        pinned: false,
      }));
      initializeSimulationPositions(reset, w, h);
      return reset;
    });
  };

  // Add custom node
  const handleAddNode = (
    newNodeData: Omit<BrainNode, 'x' | 'y' | 'simX' | 'simY' | 'vx' | 'vy' | 'neuralX' | 'neuralY'>,
    connectedTargetIds: string[]
  ) => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    const newNode: BrainNode = {
      ...newNodeData,
      x: w / 2 + (Math.random() - 0.5) * 100,
      y: h / 2 + (Math.random() - 0.5) * 100,
      simX: w / 2 + (Math.random() - 0.5) * 100,
      simY: h / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      neuralX: w / 2,
      neuralY: h / 2,
    };

    const newEdges: BrainEdge[] = connectedTargetIds.map((targetId, idx) => ({
      id: `edge-${Date.now()}-${idx}`,
      source: newNode.id,
      target: targetId,
    }));

    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, ...newEdges]);
  };

  // Delete node and its edges
  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
    if (hoveredNode?.id === nodeId) setHoveredNode(null);
  };

  // Update node
  const handleUpdateNode = (updatedNode: BrainNode) => {
    setNodes((prev) => prev.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
    if (selectedNode?.id === updatedNode.id) setSelectedNode(updatedNode);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05070c] text-slate-100 font-sans select-none">
      
      {/* Top Navigation Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        morphFactor={morphFactor}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        fps={fps}
        presetName={
          PRESET_DATASETS.find((p) => p.id === currentPresetId)?.name ||
          `Custom Scale (${nodes.length.toLocaleString()} Nodes)`
        }
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddNode={() => setIsAddNodeOpen(true)}
      />

      {/* Main 2D Canvas Engine */}
      <BrainCanvas
        nodes={nodes}
        edges={edges}
        morphFactor={morphFactor}
        physicsParams={physicsParams}
        selectedNodeId={selectedNode?.id || null}
        hoveredNodeId={hoveredNode?.id || null}
        onSelectNode={(node) => setSelectedNode(node)}
        onHoverNode={(node, pos) => {
          setHoveredNode(node);
          setMousePos(pos);
        }}
        onUpdateFps={(currentFps) => setFps(currentFps)}
      />

      {/* Floating Tooltip on Mouse Hover */}
      {hoveredNode && mousePos && (
        <NodeTooltip node={hoveredNode} mousePos={mousePos} edges={edges} />
      )}

      {/* Floating Bottom Control Panel */}
      <ControlPanel
        viewMode={viewMode}
        setViewMode={setViewMode}
        morphFactor={morphFactor}
        setMorphFactor={setMorphFactor}
        autoMorphSpeed={autoMorphSpeed}
        setAutoMorphSpeed={setAutoMorphSpeed}
        physicsParams={physicsParams}
        setPhysicsParams={setPhysicsParams}
        currentPresetId={currentPresetId}
        onSelectPreset={loadPreset}
        onResetLayout={handleResetLayout}
        onToggleSettingsModal={() => setIsSettingsOpen(true)}
      />

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <NodeInspector
          node={selectedNode}
          nodes={nodes}
          edges={edges}
          onClose={() => setSelectedNode(null)}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onSelectNodeById={(id) => {
            const target = nodes.find((n) => n.id === id);
            if (target) setSelectedNode(target);
          }}
        />
      )}

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        physicsParams={physicsParams}
        setPhysicsParams={setPhysicsParams}
        autoMorphSpeed={autoMorphSpeed}
        setAutoMorphSpeed={setAutoMorphSpeed}
        currentPresetId={currentPresetId}
        onSelectPreset={loadPreset}
        onResetPhysics={() => setPhysicsParams(DEFAULT_PHYSICS)}
        onGenerateCustomDataset={handleGenerateCustomDataset}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      <AddNodeModal
        isOpen={isAddNodeOpen}
        nodes={nodes}
        onClose={() => setIsAddNodeOpen(false)}
        onAddNode={handleAddNode}
      />

    </div>
  );
}
