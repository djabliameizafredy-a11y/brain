import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrainNode, BrainEdge, SignalParticle, PhysicsParams } from '../types';
import {
  updateForceSimulation,
  calculateNeuralPositions,
  initializeSimulationPositions,
  interpolateNodePositions,
} from '../utils/physics';

interface BrainCanvasProps {
  nodes: BrainNode[];
  edges: BrainEdge[];
  morphFactor: number;
  physicsParams: PhysicsParams;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (node: BrainNode | null) => void;
  onHoverNode: (node: BrainNode | null, mousePos: { x: number; y: number } | null) => void;
  onUpdateFps: (fps: number) => void;
}

export const BrainCanvas: React.FC<BrainCanvasProps> = ({
  nodes,
  edges,
  morphFactor,
  physicsParams,
  selectedNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
  onUpdateFps,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pan & Zoom transform state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging individual node
  const draggedNodeRef = useRef<BrainNode | null>(null);

  // Particles state ref for continuous animation
  const particlesRef = useRef<SignalParticle[]>([]);

  // FPS calculation refs
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(performance.now());

  // Initialize capped particles pool for smooth performance
  useEffect(() => {
    const newParticles: SignalParticle[] = [];
    const edgeCount = edges.length;
    if (edgeCount === 0) {
      particlesRef.current = [];
      return;
    }

    // Cap particle count at 300 max for high performance
    const targetParticleCount = Math.min(300, Math.max(30, Math.floor(edgeCount * 0.5)));

    for (let i = 0; i < targetParticleCount; i++) {
      const edge = edges[i % edgeCount];
      newParticles.push({
        id: i,
        sourceId: edge.source,
        targetId: edge.target,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        color: '#4fd1ff',
        size: 2.5 + Math.random() * 1.5,
      });
    }
    particlesRef.current = newParticles;
  }, [edges]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // 1. Check canvas dimensions and high-DPI scaling
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      // FPS tracking
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFpsTimeRef.current >= 1000) {
        onUpdateFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      const totalNodes = nodes.length;
      const isLargeNetwork = totalNodes > 500;

      // Initialize simulation & neural target positions
      initializeSimulationPositions(nodes, width, height);
      calculateNeuralPositions(nodes, width, height);

      // Step physics simulation
      updateForceSimulation(nodes, edges, physicsParams, width, height);

      // Interpolate positions based on morphFactor
      interpolateNodePositions(nodes, morphFactor);

      // Context Setup
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // --- Background: Vignette & Tech Grid ---
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      bgGradient.addColorStop(0, '#0a0f1d');
      bgGradient.addColorStop(0.6, '#05070c');
      bgGradient.addColorStop(1, '#020306');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle Background Grid
      if (!isLargeNetwork || zoom > 0.5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        const gridSize = 40 * zoom;
        const startX = (pan.x % gridSize);
        const startY = (pan.y % gridSize);

        ctx.beginPath();
        for (let x = startX; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = startY; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      // Apply Pan & Zoom Transform
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Create Quick Node Lookup
      const nodeMap = new Map<string, BrainNode>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      const activeNodeId = hoveredNodeId || selectedNodeId;

      // --- 2. Render Edges ---
      if (isLargeNetwork) {
        // High-performance batched edge rendering for 10,000+ edges
        ctx.beginPath();
        const edgeAlpha = Math.max(0.04, Math.min(0.2, 12 / Math.sqrt(totalNodes)));
        ctx.strokeStyle = `rgba(148, 163, 184, ${edgeAlpha})`;
        ctx.lineWidth = Math.max(0.4, 0.8 / Math.sqrt(zoom));

        edges.forEach((edge) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return;

          if (activeNodeId && (activeNodeId === source.id || activeNodeId === target.id)) return;

          ctx.moveTo(source.x, source.y);
          if (morphFactor > 0.05) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const cp1x = source.x + dx * (0.25 + morphFactor * 0.25);
            const cp1y = source.y + dy * (0.05 - morphFactor * 0.2);
            const cp2x = source.x + dx * (0.75 - morphFactor * 0.25);
            const cp2y = target.y - dy * (0.05 - morphFactor * 0.2);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);
          } else {
            ctx.lineTo(target.x, target.y);
          }
        });
        ctx.stroke();

        // Active highlighted connected edges
        if (activeNodeId) {
          edges.forEach((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return;

            if (activeNodeId === source.id || activeNodeId === target.id) {
              ctx.beginPath();
              ctx.moveTo(source.x, source.y);
              if (morphFactor > 0.05) {
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const cp1x = source.x + dx * (0.25 + morphFactor * 0.25);
                const cp1y = source.y + dy * (0.05 - morphFactor * 0.2);
                const cp2x = source.x + dx * (0.75 - morphFactor * 0.25);
                const cp2y = target.y - dy * (0.05 - morphFactor * 0.2);
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);
              } else {
                ctx.lineTo(target.x, target.y);
              }
              ctx.strokeStyle = activeNodeId === source.id ? source.color : target.color;
              ctx.lineWidth = 2.2 / Math.sqrt(zoom);
              ctx.stroke();
            }
          });
        }
      } else {
        // Individual detailed edge rendering for small/medium graphs
        edges.forEach((edge) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return;

          const isConnectedToActive =
            activeNodeId === source.id || activeNodeId === target.id;

          const dx = target.x - source.x;
          const dy = target.y - source.y;

          const cp1x = source.x + dx * (0.25 + morphFactor * 0.25);
          const cp1y = source.y + dy * (0.05 - morphFactor * 0.2);
          const cp2x = source.x + dx * (0.75 - morphFactor * 0.25);
          const cp2y = target.y - dy * (0.05 - morphFactor * 0.2);

          ctx.beginPath();
          ctx.moveTo(source.x, source.y);

          if (morphFactor > 0.05) {
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);
          } else {
            ctx.lineTo(target.x, target.y);
          }

          if (isConnectedToActive) {
            ctx.strokeStyle = activeNodeId === source.id ? source.color : target.color;
            ctx.lineWidth = 2.2 / Math.sqrt(zoom);
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 10;
          } else {
            const edgeAlpha = 0.15 + morphFactor * 0.1;
            ctx.strokeStyle = `rgba(148, 163, 184, ${edgeAlpha})`;
            ctx.lineWidth = 1.0 / Math.sqrt(zoom);
            ctx.shadowBlur = 0;
          }

          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      }

      // --- 3. Render Signal Particles ---
      const particles = particlesRef.current;
      particles.forEach((p) => {
        const source = nodeMap.get(p.sourceId);
        const target = nodeMap.get(p.targetId);
        if (!source || !target) return;

        p.progress += p.speed * physicsParams.signalSpeed;
        if (p.progress > 1) p.progress -= 1;

        const t = p.progress;
        const dx = target.x - source.x;
        const dy = target.y - source.y;

        let px: number, py: number;

        if (morphFactor > 0.05) {
          const cp1x = source.x + dx * (0.25 + morphFactor * 0.25);
          const cp1y = source.y + dy * (0.05 - morphFactor * 0.2);
          const cp2x = source.x + dx * (0.75 - morphFactor * 0.25);
          const cp2y = target.y - dy * (0.05 - morphFactor * 0.2);

          const u = 1 - t;
          px =
            u * u * u * source.x +
            3 * u * u * t * cp1x +
            3 * u * t * t * cp2x +
            t * t * t * target.x;
          py =
            u * u * u * source.y +
            3 * u * u * t * cp1y +
            3 * u * t * t * cp2y +
            t * t * t * target.y;
        } else {
          px = source.x + dx * t;
          py = source.y + dy * t;
        }

        const isHighlight =
          activeNodeId === source.id || activeNodeId === target.id;
        const pSize = (isHighlight ? p.size * 1.5 : p.size) / Math.sqrt(zoom);

        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = isHighlight ? source.color : '#4fd1ff';
        if (!isLargeNetwork) {
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- 4. Render Nodes ---
      nodes.forEach((node) => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;

        const baseRadius = node.r / Math.sqrt(zoom);
        const displayRadius = isSelected || isHovered ? baseRadius * 1.4 : baseRadius;

        // Render glow aura for Layer 0/1 nodes or hovered/selected nodes
        if (!isLargeNetwork || node.layer < 2 || isSelected || isHovered) {
          const glowGrad = ctx.createRadialGradient(
            node.x,
            node.y,
            displayRadius * 0.2,
            node.x,
            node.y,
            displayRadius * 3.0
          );

          const colorHex = node.color;
          glowGrad.addColorStop(0, `${colorHex}aa`);
          glowGrad.addColorStop(0.5, `${colorHex}33`);
          glowGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x, node.y, displayRadius * 3.0, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Special pulsing ring for Layer 0 (My Brain origin)
        if (node.layer === 0) {
          const pulse = (Math.sin(performance.now() * 0.003) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, displayRadius + 6 + pulse * 6, 0, Math.PI * 2);
          ctx.strokeStyle = `${node.color}88`;
          ctx.lineWidth = 1.8 / Math.sqrt(zoom);
          ctx.stroke();
        }

        // Highlight ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, displayRadius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2.0 / Math.sqrt(zoom);
          ctx.stroke();
        }

        // Node Solid Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        if (displayRadius > 3.5) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, displayRadius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }

        // Render Labels
        const shouldShowLabel =
          !isLargeNetwork ||
          node.layer < 2 ||
          isSelected ||
          isHovered ||
          zoom > 1.2;

        if (shouldShowLabel) {
          const labelOpacity =
            zoom < 0.65 && !isHovered && !isSelected && node.layer === 2 ? 0.4 : 0.95;

          ctx.font = `${Math.max(9, Math.round(11 / Math.sqrt(zoom)))}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(241, 245, 249, ${labelOpacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const labelY = node.y + displayRadius + 4;
          const labelText = node.label;

          if (!isLargeNetwork || isHovered || isSelected) {
            const textMetrics = ctx.measureText(labelText);
            const bgPadding = 3;

            ctx.fillStyle = 'rgba(5, 7, 12, 0.8)';
            ctx.beginPath();
            ctx.roundRect(
              node.x - textMetrics.width / 2 - bgPadding,
              labelY - 1,
              textMetrics.width + bgPadding * 2,
              13 / Math.sqrt(zoom) + 2,
              4
            );
            ctx.fill();
          }

          ctx.fillStyle = isHovered || isSelected ? '#ffffff' : '#cbd5e1';
          ctx.fillText(labelText, node.x, labelY);
        }
      });

      ctx.restore(); // Restore pan/zoom
      ctx.restore(); // Restore DPR scale

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    nodes,
    edges,
    morphFactor,
    physicsParams,
    selectedNodeId,
    hoveredNodeId,
    zoom,
    pan,
    onUpdateFps,
  ]);

  // Coordinate Conversion Utility (Screen -> World)
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: (screenX - pan.x) / zoom,
        y: (screenY - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  // Fast Hit test node at screen coordinates
  const getNodeAtPosition = useCallback(
    (screenX: number, screenY: number): BrainNode | null => {
      const worldPos = screenToWorld(screenX, screenY);
      const isLarge = nodes.length > 500;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const dx = worldPos.x - node.x;
        const dy = worldPos.y - node.y;

        // Bounding box pre-check for speed
        if (Math.abs(dx) > 30 || Math.abs(dy) > 30) continue;

        const hitRadius = Math.max(node.r + (isLarge ? 6 : 8), 16);
        if (dx * dx + dy * dy <= hitRadius * hitRadius) {
          return node;
        }
      }
      return null;
    },
    [nodes, screenToWorld]
  );

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const hitNode = getNodeAtPosition(screenX, screenY);

    if (hitNode) {
      draggedNodeRef.current = hitNode;
      hitNode.pinned = true;
      onSelectNode(hitNode);
    } else {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      onSelectNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    if (draggedNodeRef.current) {
      const worldPos = screenToWorld(screenX, screenY);
      draggedNodeRef.current.simX = worldPos.x;
      draggedNodeRef.current.simY = worldPos.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (isPanningRef.current) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    const hitNode = getNodeAtPosition(screenX, screenY);
    if (hitNode) {
      onHoverNode(hitNode, { x: e.clientX, y: e.clientY });
    } else {
      onHoverNode(null, null);
    }
  };

  const handleMouseUp = () => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.pinned = false;
      draggedNodeRef.current = null;
    }
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(0.15, zoom * zoomFactor), 4.5);

    // Zoom centered on cursor position
    const worldBefore = screenToWorld(mouseX, mouseY);
    const newPanX = mouseX - worldBefore.x * newZoom;
    const newPanY = mouseY - worldBefore.y * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#05070c]">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />
    </div>
  );
};
