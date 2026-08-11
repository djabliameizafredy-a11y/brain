import { PresetDataset, BrainNode, BrainEdge } from '../types';
import { COLOR_HUB, COLOR_SECTION, COLOR_SUBSECTION, COLOR_CATEGORY, COLOR_LEAF } from '../data/defaultGraph';

const SECTION_DOMAINS = [
  { name: 'AI & Neural Systems', prefix: 'Neural' },
  { name: 'Software Architecture', prefix: 'System' },
  { name: 'Cognitive Memory Vault', prefix: 'Memory' },
  { name: 'Executive Function', prefix: 'Executive' },
  { name: 'Language & Semantics', prefix: 'Semantic' },
  { name: 'Scientific Principles', prefix: 'Science' },
  { name: 'Creative & Design', prefix: 'Creative' },
  { name: 'Mathematics & Physics', prefix: 'Math' },
  { name: 'Philosophy & Logic', prefix: 'Logic' },
  { name: 'Perception & Senses', prefix: 'Perception' },
  { name: 'Action & Workflows', prefix: 'Action' },
  { name: 'Vector & Embeddings', prefix: 'Vector' }
];

const SUBSECTION_PREFIXES = [
  'Pipeline', 'Sub-Graph', 'Cluster', 'Module',
  'Encoder', 'Repository', 'Stream', 'Array',
  'Engine', 'Network', 'Matrix', 'Framework'
];

const CATEGORY_PREFIXES = [
  'Layer', 'Process', 'Component', 'Sub-Routine',
  'Transformer', 'Indexer', 'Filter', 'Buffer',
  'Handler', 'Controller', 'Optimizer', 'Agent'
];

const LEAF_PREFIXES = [
  'Neuron', 'Concept', 'Vector', 'Feature', 'Synapse',
  'Token', 'Weight', 'Bias', 'Spike', 'Activation',
  'Data Point', 'Record', 'Link', 'Node'
];

/**
 * Generates a high-performance single-root hierarchical graph starting from "My Brain"
 * that multiplies across multiple sections and layers.
 */
export function generateLargeDataset(
  id: string,
  name: string,
  description: string,
  targetNodeCount: number,
  targetEdgeCount: number
): PresetDataset {
  const nodes: Omit<BrainNode, 'x' | 'y' | 'simX' | 'simY' | 'vx' | 'vy' | 'neuralX' | 'neuralY'>[] = [];
  const edges: Omit<BrainEdge, 'id'>[] = [];

  // --- 1. Layer 0: EXACTLY ONE Root Node: "My Brain" ---
  const rootId = 'my-brain';
  nodes.push({
    id: rootId,
    label: 'My Brain',
    cluster: 'My Brain Core',
    layer: 0,
    color: COLOR_HUB,
    r: targetNodeCount > 1000 ? 16 : 22,
    description: 'The single central cognitive origin node where all sections of thought, memory, and reasoning branch out.'
  });

  // --- 2. Calculate Tier Allocations ---
  const sectionCount = Math.min(SECTION_DOMAINS.length, Math.max(8, Math.round(targetNodeCount * 0.05)));
  const remainingCount = targetNodeCount - 1 - sectionCount;

  const subsectionCount = Math.max(12, Math.round(remainingCount * 0.20));
  const categoryCount = Math.max(20, Math.round(remainingCount * 0.35));
  const leafCount = Math.max(0, remainingCount - subsectionCount - categoryCount);

  const sectionIds: string[] = [];
  const subsectionIds: string[] = [];
  const categoryIds: string[] = [];
  const leafIds: string[] = [];

  // Edge Tracking Set
  const edgeSet = new Set<string>();
  const addEdge = (src: string, tgt: string) => {
    if (src === tgt) return;
    const pairKey = src < tgt ? `${src}:${tgt}` : `${tgt}:${src}`;
    if (!edgeSet.has(pairKey)) {
      edgeSet.add(pairKey);
      edges.push({ source: src, target: tgt });
    }
  };

  // --- 3. Create Layer 1: Primary Domain Sections & Connect directly to "My Brain" ---
  for (let i = 0; i < sectionCount; i++) {
    const secId = `section-${i}`;
    sectionIds.push(secId);
    const domain = SECTION_DOMAINS[i % SECTION_DOMAINS.length];

    nodes.push({
      id: secId,
      label: domain.name,
      cluster: domain.name,
      layer: 1,
      color: COLOR_SECTION,
      r: targetNodeCount > 1000 ? 10 : 14,
      description: `Primary Section #${i + 1} branching from My Brain for ${domain.name}.`
    });

    // Every Section connects directly to the single root "My Brain"
    addEdge(rootId, secId);
  }

  // --- 4. Create Layer 2: Sub-Sections & Connect to Layer 1 Sections ---
  for (let i = 0; i < subsectionCount; i++) {
    const subId = `subsection-${i}`;
    subsectionIds.push(subId);
    const parentSecIdx = i % sectionIds.length;
    const parentSecId = sectionIds[parentSecIdx];
    const parentCluster = nodes.find(n => n.id === parentSecId)?.cluster || 'Core Section';
    const prefix = SUBSECTION_PREFIXES[i % SUBSECTION_PREFIXES.length];

    nodes.push({
      id: subId,
      label: `${prefix} ${parentCluster.split(' ')[0]} #${i + 1}`,
      cluster: parentCluster,
      layer: 2,
      color: COLOR_SUBSECTION,
      r: targetNodeCount > 1000 ? 6 : 9,
      description: `Layer 2 sub-section grouped under ${parentCluster}.`
    });

    addEdge(parentSecId, subId);
  }

  // --- 5. Create Layer 3: Categories & Connect to Layer 2 Sub-Sections ---
  for (let i = 0; i < categoryCount; i++) {
    const catId = `category-${i}`;
    categoryIds.push(catId);
    const parentSubIdx = i % subsectionIds.length;
    const parentSubId = subsectionIds[parentSubIdx];
    const parentCluster = nodes.find(n => n.id === parentSubId)?.cluster || 'Section';
    const prefix = CATEGORY_PREFIXES[i % CATEGORY_PREFIXES.length];

    nodes.push({
      id: catId,
      label: `${prefix} #${i + 1}`,
      cluster: parentCluster,
      layer: 3,
      color: COLOR_CATEGORY,
      r: targetNodeCount > 1000 ? 4 : 6,
      description: `Layer 3 category node under ${parentCluster}.`
    });

    addEdge(parentSubId, catId);
  }

  // --- 6. Create Layer 4: Leaves & Connect to Layer 3 Categories ---
  for (let i = 0; i < leafCount; i++) {
    const leafId = `leaf-${i}`;
    leafIds.push(leafId);
    const parentCatIdx = i % categoryIds.length;
    const parentCatId = categoryIds[parentCatIdx];
    const parentCluster = nodes.find(n => n.id === parentCatId)?.cluster || 'Section';
    const prefix = LEAF_PREFIXES[i % LEAF_PREFIXES.length];

    nodes.push({
      id: leafId,
      label: `${prefix} #${i + 1}`,
      cluster: parentCluster,
      layer: 4,
      color: COLOR_LEAF,
      r: targetNodeCount > 1000 ? 2.5 : 4,
      description: `Layer 4 detail leaf unit in ${parentCluster}.`
    });

    addEdge(parentCatId, leafId);
  }

  // --- 7. Fill remaining cross-links to reach targetEdgeCount ---
  let attempts = 0;
  const maxAttempts = targetEdgeCount * 3;
  const nonRootNodes = nodes.filter(n => n.id !== rootId);

  while (edges.length < targetEdgeCount && attempts < maxAttempts) {
    attempts++;
    const srcIdx = Math.floor(Math.random() * nonRootNodes.length);
    const srcNode = nonRootNodes[srcIdx];

    // Pick a target nearby in index or layer
    const tgtOffset = Math.floor((Math.random() - 0.5) * 40);
    const tgtIdx = Math.max(0, Math.min(nonRootNodes.length - 1, srcIdx + tgtOffset));
    const tgtNode = nonRootNodes[tgtIdx];

    addEdge(srcNode.id, tgtNode.id);
  }

  return {
    id,
    name,
    description,
    nodes,
    edges
  };
}
