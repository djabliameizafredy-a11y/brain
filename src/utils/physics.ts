import { BrainNode, BrainEdge, PhysicsParams } from '../types';

export const DEFAULT_PHYSICS: PhysicsParams = {
  repulsion: 4500,
  springLength: 95,
  springStiffness: 0.035,
  damping: 0.80,
  gravity: 0.015,
  signalSpeed: 1.0,
};

/**
 * Calculates target neural network coordinates (multi-layered layout)
 * Layer 0 ("My Brain") -> Layer 1 (Sections) -> Layer 2 (Sub-sections) -> Layer 3 (Categories) -> Layer 4 (Leaves)
 */
export function calculateNeuralPositions(
  nodes: BrainNode[],
  width: number,
  height: number
): void {
  const cx = width / 2;
  const cy = height / 2;

  // Group nodes by layer (0, 1, 2, 3, 4...)
  const layerGroups: Map<number, BrainNode[]> = new Map();
  nodes.forEach((node) => {
    const list = layerGroups.get(node.layer) || [];
    list.push(node);
    layerGroups.set(node.layer, list);
  });

  const layers = Array.from(layerGroups.keys()).sort((a, b) => a - b);
  const totalLayers = layers.length;

  if (totalLayers === 0) return;

  const columnWidth = Math.min(width * 0.22, 280);
  const startX = cx - ((totalLayers - 1) / 2) * columnWidth;

  layers.forEach((layerIndex, lIdx) => {
    const colX = startX + lIdx * columnWidth;
    const groupNodes = layerGroups.get(layerIndex) || [];
    const nodeCount = groupNodes.length;

    if (nodeCount <= 80) {
      // Single line vertical alignment
      const verticalPadding = 80;
      const availableHeight = height - verticalPadding * 2;
      const rowSpacing = Math.min(65, Math.max(14, availableHeight / Math.max(nodeCount, 1)));
      const startY = cy - ((nodeCount - 1) / 2) * rowSpacing;

      groupNodes.forEach((node, nIdx) => {
        node.neuralX = colX;
        node.neuralY = startY + nIdx * rowSpacing;
      });
    } else {
      // Dense multi-subcolumn block layout for high node count per layer
      const subCols = Math.min(25, Math.ceil(Math.sqrt(nodeCount / 20)));
      const subColWidth = 12;
      const startSubX = colX - ((subCols - 1) / 2) * subColWidth;

      const nodesPerSubCol = Math.ceil(nodeCount / subCols);
      const verticalPadding = 60;
      const availableHeight = height - verticalPadding * 2;
      const rowSpacing = Math.max(3, Math.min(12, availableHeight / nodesPerSubCol));
      const startY = cy - ((nodesPerSubCol - 1) / 2) * rowSpacing;

      groupNodes.forEach((node, nIdx) => {
        const subC = Math.floor(nIdx / nodesPerSubCol);
        const subR = nIdx % nodesPerSubCol;
        node.neuralX = startSubX + subC * subColWidth;
        node.neuralY = startY + subR * rowSpacing;
      });
    }
  });
}

/**
 * Initializes simulation positions in a radial tree originating from "My Brain"
 */
export function initializeSimulationPositions(
  nodes: BrainNode[],
  width: number,
  height: number
): void {
  const cx = width / 2;
  const cy = height / 2;
  const isLarge = nodes.length > 500;

  // Map to store parent positions if tree-based layout is desired
  const posMap = new Map<string, { x: number; y: number }>();

  nodes.forEach((node, index) => {
    if (node.simX === undefined || node.simX === 0) {
      if (node.layer === 0) {
        // Place single root "My Brain" exactly in center
        node.simX = cx;
        node.simY = cy;
      } else if (node.layer === 1) {
        // Place Layer 1 sections in radial ring around "My Brain"
        const layer1Nodes = nodes.filter(n => n.layer === 1);
        const idx1 = layer1Nodes.indexOf(node);
        const total1 = Math.max(1, layer1Nodes.length);
        const angle = (idx1 / total1) * Math.PI * 2;
        const radius = isLarge ? 180 : 160;

        node.simX = cx + Math.cos(angle) * radius;
        node.simY = cy + Math.sin(angle) * radius;
      } else {
        // Outer layers 2, 3, 4 placed in expanding concentric circles
        const angle = (index / nodes.length) * Math.PI * 2;
        const layerRadius = node.layer * (isLarge ? 70 : 110) + (Math.random() - 0.5) * 40;
        node.simX = cx + Math.cos(angle) * layerRadius;
        node.simY = cy + Math.sin(angle) * layerRadius;
      }

      node.x = node.simX;
      node.y = node.simY;
      node.vx = (Math.random() - 0.5) * 1.5;
      node.vy = (Math.random() - 0.5) * 1.5;

      posMap.set(node.id, { x: node.simX, y: node.simY });
    }
  });
}

/**
 * Step force-directed simulation.
 * Uses spatial grid binning for high scale (10,000+ nodes) at 60fps.
 */
export function updateForceSimulation(
  nodes: BrainNode[],
  edges: BrainEdge[],
  params: PhysicsParams,
  width: number,
  height: number
): void {
  const nodeCount = nodes.length;
  const cx = width / 2;
  const cy = height / 2;

  if (nodeCount === 0) return;

  const nodeMap = new Map<string, BrainNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  if (nodeCount <= 200) {
    // Standard O(N^2) Repulsion
    for (let i = 0; i < nodeCount; i++) {
      const nodeA = nodes[i];
      let fx = 0;
      let fy = 0;

      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        const nodeB = nodes[j];

        let dx = nodeA.simX - nodeB.simX;
        let dy = nodeA.simY - nodeB.simY;
        let distSq = dx * dx + dy * dy + 100;
        let dist = Math.sqrt(distSq);

        const force = params.repulsion / distSq;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }

      // Root node ("My Brain") stays near center
      if (nodeA.layer === 0) {
        fx += (cx - nodeA.simX) * params.gravity * 3.0;
        fy += (cy - nodeA.simY) * params.gravity * 3.0;
      } else {
        fx += (cx - nodeA.simX) * params.gravity;
        fy += (cy - nodeA.simY) * params.gravity;
      }

      nodeA.vx = (nodeA.vx + fx) * params.damping;
      nodeA.vy = (nodeA.vy + fy) * params.damping;
    }
  } else {
    // Spatial Grid Binning for high node count
    const cellSize = nodeCount > 2000 ? 120 : 160;
    const cols = Math.max(1, Math.ceil(width / cellSize));
    const rows = Math.max(1, Math.ceil(height / cellSize));

    const grid: BrainNode[][][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => [])
    );

    for (let i = 0; i < nodeCount; i++) {
      const n = nodes[i];
      const c = Math.max(0, Math.min(cols - 1, Math.floor(n.simX / cellSize)));
      const r = Math.max(0, Math.min(rows - 1, Math.floor(n.simY / cellSize)));
      grid[c][r].push(n);
    }

    const repulsionFactor = nodeCount > 2000 ? params.repulsion * 0.3 : params.repulsion;

    for (let i = 0; i < nodeCount; i++) {
      const nodeA = nodes[i];
      let fx = 0;
      let fy = 0;

      const cellC = Math.max(0, Math.min(cols - 1, Math.floor(nodeA.simX / cellSize)));
      const cellR = Math.max(0, Math.min(rows - 1, Math.floor(nodeA.simY / cellSize)));

      for (let dc = -1; dc <= 1; dc++) {
        const nc = cellC + dc;
        if (nc < 0 || nc >= cols) continue;

        for (let dr = -1; dr <= 1; dr++) {
          const nr = cellR + dr;
          if (nr < 0 || nr >= rows) continue;

          const cellNodes = grid[nc][nr];
          const sampleLimit = Math.min(cellNodes.length, nodeCount > 2000 ? 8 : 15);

          for (let k = 0; k < sampleLimit; k++) {
            const nodeB = cellNodes[k];
            if (nodeA === nodeB) continue;

            let dx = nodeA.simX - nodeB.simX;
            let dy = nodeA.simY - nodeB.simY;
            let distSq = dx * dx + dy * dy + 80;
            if (distSq > 25000) continue;

            let dist = Math.sqrt(distSq);
            const force = repulsionFactor / distSq;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }
      }

      // Root gravity pull
      if (nodeA.layer === 0) {
        fx += (cx - nodeA.simX) * params.gravity * 2.5;
        fy += (cy - nodeA.simY) * params.gravity * 2.5;
      } else {
        fx += (cx - nodeA.simX) * params.gravity * 0.5;
        fy += (cy - nodeA.simY) * params.gravity * 0.5;
      }

      nodeA.vx = (nodeA.vx + fx) * params.damping;
      nodeA.vy = (nodeA.vy + fy) * params.damping;
    }
  }

  // Hooke Spring attraction along edges
  const springMult = nodeCount > 2000 ? 0.3 : 1.0;
  edges.forEach((edge) => {
    const nodeA = nodeMap.get(edge.source);
    const nodeB = nodeMap.get(edge.target);
    if (!nodeA || !nodeB) return;

    let dx = nodeB.simX - nodeA.simX;
    let dy = nodeB.simY - nodeA.simY;
    let dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;

    const delta = dist - params.springLength;
    const springForce = delta * params.springStiffness * springMult;

    const fx = (dx / dist) * springForce;
    const fy = (dy / dist) * springForce;

    if (!nodeA.pinned) {
      nodeA.vx += fx;
      nodeA.vy += fy;
    }
    if (!nodeB.pinned) {
      nodeB.vx -= fx;
      nodeB.vy -= fy;
    }
  });

  // Apply velocities
  const padding = 40;
  nodes.forEach((node) => {
    if (!node.pinned) {
      node.simX += node.vx;
      node.simY += node.vy;

      if (node.simX < padding) node.vx += 1.0;
      if (node.simX > width - padding) node.vx -= 1.0;
      if (node.simY < padding) node.vy += 1.0;
      if (node.simY > height - padding) node.vy -= 1.0;
    }
  });
}

export function cubicEaseInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function interpolateNodePositions(nodes: BrainNode[], morphFactor: number): void {
  const eased = cubicEaseInOut(Math.max(0, Math.min(1, morphFactor)));

  nodes.forEach((node) => {
    node.x = node.simX * (1 - eased) + node.neuralX * eased;
    node.y = node.simY * (1 - eased) + node.neuralY * eased;
  });
}
