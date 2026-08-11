import { PresetDataset } from '../types';
import { generateLargeDataset } from '../utils/generator';

export const COLOR_HUB = '#ff4b4b';        // Bright Red/Coral (Layer 0 - My Brain Single Root)
export const COLOR_SECTION = '#f59e0b';    // Amber Gold (Layer 1 - Major Sections)
export const COLOR_SUBSECTION = '#38bdf8'; // Sky Cyan (Layer 2 - Sub-Sections)
export const COLOR_CATEGORY = '#a855f7';   // Vibrant Violet (Layer 3 - Categories)
export const COLOR_LEAF = '#10b981';       // Emerald Green (Layer 4 - Leaves)

const CURATED_AI_PRESET: PresetDataset = {
  id: 'second-brain-ai',
  name: 'My Brain (AI & Knowledge - 30 Nodes)',
  description: 'Single origin starting point "My Brain" multiplying across 7 specialized cognitive sections and multi-tier sub-branches.',
  nodes: [
    // Layer 0: EXACTLY ONE Single Starting Origin
    {
      id: 'my-brain',
      label: 'My Brain',
      cluster: 'Brain Core',
      layer: 0,
      color: COLOR_HUB,
      r: 22,
      description: 'Single central origin point synthesizing memory, reasoning, engineering, and artificial intelligence.'
    },

    // Layer 1: Primary Sections branching out directly from "My Brain"
    {
      id: 'sec-ai-models',
      label: '1. AI & Foundation Models',
      cluster: 'AI Architecture',
      layer: 1,
      color: COLOR_SECTION,
      r: 14,
      description: 'Large language models, multimodal transformers, and generative inference pipelines.'
    },
    {
      id: 'sec-ui-engine',
      label: '2. Interactive UI Engine',
      cluster: 'System Stack',
      layer: 1,
      color: COLOR_SECTION,
      r: 14,
      description: 'Real-time Canvas 2D graphics, reactive state management, and ergonomic web presentation.'
    },
    {
      id: 'sec-vector-db',
      label: '3. Vector & Semantic DB',
      cluster: 'Data Systems',
      layer: 1,
      color: COLOR_SECTION,
      r: 14,
      description: 'High-dimensional embeddings storage for semantic search and Retrieval-Augmented Generation.'
    },
    {
      id: 'sec-prompt-eng',
      label: '4. Prompt Orchestration',
      cluster: 'AI Architecture',
      layer: 1,
      color: COLOR_SECTION,
      r: 13,
      description: 'Context window optimization, agentic chain-of-thought, and system tool invocations.'
    },
    {
      id: 'sec-graph-theory',
      label: '5. Graph Topology & Math',
      cluster: 'Core Knowledge',
      layer: 1,
      color: COLOR_SECTION,
      r: 13,
      description: 'Mathematical graph algorithms, adjacency matrices, and force-directed spatial layouts.'
    },
    {
      id: 'sec-cognition',
      label: '6. Memory & Knowledge Vault',
      cluster: 'Core Knowledge',
      layer: 1,
      color: COLOR_SECTION,
      r: 13,
      description: 'Associative memory engine structured for retrieval, notes, and concept mapping.'
    },

    // Layer 2: Sub-Sections branching from Layer 1 Sections
    {
      id: 'sub-gemini',
      label: 'Gemini Multimodal LLM',
      cluster: 'AI Architecture',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: 'High-speed multimodal LLM powering real-time intent analysis and code synthesis.'
    },
    {
      id: 'sub-transformer',
      label: 'Transformer Core',
      cluster: 'AI Architecture',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: 'Multi-head self-attention mechanism computing query, key, and value dot products.'
    },
    {
      id: 'sub-react',
      label: 'React 19 & State',
      cluster: 'System Stack',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: 'Declarative component rendering hierarchy with optimized reconciliation hooks.'
    },
    {
      id: 'sub-canvas',
      label: 'Canvas 2D Graphics',
      cluster: 'System Stack',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: '60fps hardware-accelerated raster rendering loop for particle and vector graphics.'
    },
    {
      id: 'sub-embeddings',
      label: 'Dense Embeddings',
      cluster: 'Data Systems',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: 'High-dimensional normalized floating-point vectors representing semantic concepts.'
    },
    {
      id: 'sub-physics',
      label: 'Force Simulation Engine',
      cluster: 'Core Knowledge',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: 'Simulated Coulomb repulsion and Hooke spring forces for self-organizing layouts.'
    },
    {
      id: 'sub-notes',
      label: 'Wikilink Notes Network',
      cluster: 'Core Knowledge',
      layer: 2,
      color: COLOR_SUBSECTION,
      r: 9,
      description: 'Local file-based Markdown notes with bi-directional wikilinks.'
    },

    // Layer 3: Categories & Details
    {
      id: 'cat-attention',
      label: 'Self-Attention Layer',
      cluster: 'AI Architecture',
      layer: 3,
      color: COLOR_CATEGORY,
      r: 6,
      description: 'Soft-max normalized token weight matrix capturing long-range contextual dependencies.'
    },
    {
      id: 'cat-latent',
      label: 'Latent Space Manifold',
      cluster: 'AI Architecture',
      layer: 3,
      color: COLOR_CATEGORY,
      r: 6,
      description: 'Continuous vector manifold where semantic concepts cluster by topological proximity.'
    },
    {
      id: 'cat-typescript',
      label: 'TypeScript 5.8 Strict',
      cluster: 'System Stack',
      layer: 3,
      color: COLOR_CATEGORY,
      r: 6,
      description: 'Strict static type system ensuring robust graph interfaces and compile-time correctness.'
    },
    {
      id: 'cat-cosine',
      label: 'Cosine Similarity',
      cluster: 'Data Systems',
      layer: 3,
      color: COLOR_CATEGORY,
      r: 6,
      description: 'Dot product distance metric quantifying directional alignment between feature vectors.'
    },
    {
      id: 'cat-weights',
      label: 'Synaptic Weight Matrix',
      cluster: 'AI Architecture',
      layer: 3,
      color: COLOR_CATEGORY,
      r: 6,
      description: 'Adjustable network connection strength parameters trained via gradient backpropagation.'
    },

    // Layer 4: Specific Knowledge Leaves
    {
      id: 'leaf-loss',
      label: 'Loss Minimization',
      cluster: 'AI Architecture',
      layer: 4,
      color: COLOR_LEAF,
      r: 5,
      description: 'Objective function measuring deviation between predicted distribution and target ground truth.'
    },
    {
      id: 'leaf-context',
      label: 'Context Window Buffer',
      cluster: 'AI Architecture',
      layer: 4,
      color: COLOR_LEAF,
      r: 5,
      description: 'Active memory capacity buffer available for prompt comprehension during inference.'
    }
  ],
  edges: [
    // Layer 0 ("My Brain") -> Layer 1 Sections
    { source: 'my-brain', target: 'sec-ai-models' },
    { source: 'my-brain', target: 'sec-ui-engine' },
    { source: 'my-brain', target: 'sec-vector-db' },
    { source: 'my-brain', target: 'sec-prompt-eng' },
    { source: 'my-brain', target: 'sec-graph-theory' },
    { source: 'my-brain', target: 'sec-cognition' },

    // Layer 1 Sections -> Layer 2 Sub-Sections
    { source: 'sec-ai-models', target: 'sub-gemini' },
    { source: 'sec-ai-models', target: 'sub-transformer' },
    { source: 'sec-ui-engine', target: 'sub-react' },
    { source: 'sec-ui-engine', target: 'sub-canvas' },
    { source: 'sec-vector-db', target: 'sub-embeddings' },
    { source: 'sec-graph-theory', target: 'sub-physics' },
    { source: 'sec-cognition', target: 'sub-notes' },

    // Layer 2 Sub-Sections -> Layer 3 Categories
    { source: 'sub-transformer', target: 'cat-attention' },
    { source: 'sub-transformer', target: 'cat-latent' },
    { source: 'sub-react', target: 'cat-typescript' },
    { source: 'sub-embeddings', target: 'cat-cosine' },
    { source: 'sub-gemini', target: 'cat-weights' },

    // Layer 3 Categories -> Layer 4 Leaves
    { source: 'cat-weights', target: 'leaf-loss' },
    { source: 'sub-gemini', target: 'leaf-context' },

    // Inter-branch cross links
    { source: 'sub-physics', target: 'sub-canvas' },
    { source: 'sub-embeddings', target: 'cat-latent' },
    { source: 'sub-notes', target: 'sec-prompt-eng' }
  ]
};

const CURATED_BIO_PRESET: PresetDataset = {
  id: 'neuroscience-cognition',
  name: 'My Brain (Neuroscience Network - 20 Nodes)',
  description: 'Single biological origin "My Brain" branching into cortex, limbic, motor, sensory, and synaptic sections.',
  nodes: [
    { id: 'my-brain-bio', label: 'My Brain', cluster: 'Brain Core', layer: 0, color: COLOR_HUB, r: 22, description: 'Central biological starting point of human neural processing.' },
    { id: 'sec-cortex', label: 'Cerebral Cortex Section', cluster: 'Cortex', layer: 1, color: COLOR_SECTION, r: 14, description: 'High-level executive processing center overseeing perception and reasoning.' },
    { id: 'sec-limbic', label: 'Limbic Memory Section', cluster: 'Memory', layer: 1, color: COLOR_SECTION, r: 14, description: 'Emotional memory encoder and contextual association hub.' },
    { id: 'sec-sensory', label: 'Sensory Perception Section', cluster: 'Perception', layer: 1, color: COLOR_SECTION, r: 14, description: 'Input layer receiving external environmental signals.' },
    { id: 'sec-motor', label: 'Motor Control Section', cluster: 'Action', layer: 1, color: COLOR_SECTION, r: 14, description: 'Output layer executing physical actions and motor responses.' },
    
    { id: 'sub-hippocampus', label: 'Hippocampal Index', cluster: 'Memory', layer: 2, color: COLOR_SUBSECTION, r: 9, description: 'Short-term to long-term memory consolidation mechanism.' },
    { id: 'sub-visual', label: 'Visual Cortex (V1)', cluster: 'Perception', layer: 2, color: COLOR_SUBSECTION, r: 9, description: 'Edge detection and spatial frequency filtering.' },
    { id: 'sub-auditory', label: 'Auditory Cortex (A1)', cluster: 'Perception', layer: 2, color: COLOR_SUBSECTION, r: 9, description: 'Acoustic pattern recognition and language processing.' },
    
    { id: 'cat-plasticity', label: 'Long-Term Potentiation', cluster: 'Memory', layer: 3, color: COLOR_CATEGORY, r: 6, description: 'Hebbian learning: neurons that fire together, wire together.' },
    { id: 'cat-dendrites', label: 'Dendritic Spine Array', cluster: 'Synapses', layer: 3, color: COLOR_CATEGORY, r: 6, description: 'Membrane protrusions receiving postsynaptic inputs.' },
    { id: 'leaf-neurotransmitters', label: 'Dopamine & Glutamate', cluster: 'Synapses', layer: 4, color: COLOR_LEAF, r: 5, description: 'Chemical messengers tuning synaptic plasticity rates.' }
  ],
  edges: [
    { source: 'my-brain-bio', target: 'sec-cortex' },
    { source: 'my-brain-bio', target: 'sec-limbic' },
    { source: 'my-brain-bio', target: 'sec-sensory' },
    { source: 'my-brain-bio', target: 'sec-motor' },
    { source: 'sec-limbic', target: 'sub-hippocampus' },
    { source: 'sec-sensory', target: 'sub-visual' },
    { source: 'sec-sensory', target: 'sub-auditory' },
    { source: 'sub-hippocampus', target: 'cat-plasticity' },
    { source: 'sub-visual', target: 'cat-dendrites' },
    { source: 'cat-plasticity', target: 'leaf-neurotransmitters' }
  ]
};

export const PRESET_DATASETS: PresetDataset[] = [
  CURATED_AI_PRESET,
  CURATED_BIO_PRESET,
  generateLargeDataset(
    'large-1000',
    'Medium Brain (1,000 Nodes branching from My Brain)',
    '1,000 nodes branching from a single "My Brain" origin into multiple primary sections.',
    1000,
    1200
  ),
  generateLargeDataset(
    'large-3000',
    'Cortical Brain (3,000 Nodes branching from My Brain)',
    '3,000 nodes branching from "My Brain" across multiple sections and dense sub-networks.',
    3000,
    4000
  ),
  generateLargeDataset(
    'mega-10000',
    '🔥 Mega Brain — 10,000 Nodes branching from My Brain!',
    'Massive 10,000 node network with a single "My Brain" root multiplying across 12 domain sections.',
    10000,
    12000
  ),
];
