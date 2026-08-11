export type NodeLayer = number;

export interface BrainNode {
  id: string;
  label: string;
  cluster: string;
  layer: NodeLayer;
  color: string;
  r: number;
  description: string;
  // Simulation & rendering coordinates
  x: number;
  y: number;
  simX: number;
  simY: number;
  vx: number;
  vy: number;
  neuralX: number;
  neuralY: number;
  pinned?: boolean;
}

export interface BrainEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

export interface SignalParticle {
  id: number;
  sourceId: string;
  targetId: string;
  progress: number; // 0 to 1
  speed: number;
  color: string;
  size: number;
}

export type ViewMode = 'graph' | 'neural' | 'automorph';

export interface PresetDataset {
  id: string;
  name: string;
  description: string;
  nodes: Omit<BrainNode, 'x' | 'y' | 'simX' | 'simY' | 'vx' | 'vy' | 'neuralX' | 'neuralY'>[];
  edges: Omit<BrainEdge, 'id'>[];
}

export interface PhysicsParams {
  repulsion: number;   // Coulomb factor (default ~ 4000)
  springLength: number;// Target edge distance (default ~ 90)
  springStiffness: number; // Spring constant (default ~ 0.04)
  damping: number;     // Velocity damping factor (default ~ 0.82)
  gravity: number;     // Center pull factor (default ~ 0.015)
  signalSpeed: number; // Speed multiplier for particles (default ~ 1.0)
}
