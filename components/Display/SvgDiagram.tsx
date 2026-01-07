
import React, { useMemo, useEffect, useState } from 'react';
import { DiagramElement, DiagramConnection, DiagramAnimation } from '../../types';
import { generateNodeImage } from '../../services/geminiService';
import { Loader2 } from 'lucide-react';

interface Props {
  diagram: {
    type: 'flow' | 'structure' | 'cycle' | 'comparison' | 'process';
    elements: DiagramElement[];
    connections: DiagramConnection[];
    animation?: DiagramAnimation;
  };
  isAnimated?: boolean;
}

const SvgDiagram: React.FC<Props> = ({ diagram, isAnimated = false }) => {
  const [animationStep, setAnimationStep] = useState(-1);
  const [nodeImages, setNodeImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  // Handle image generation for nodes with imagePrompt
  useEffect(() => {
    let active = true;
    const triggerImageGen = async () => {
      // Find elements that need images and aren't already loading/loaded
      const elementsWithPrompt = diagram.elements.filter(el => el.imagePrompt && !nodeImages[el.id] && !loadingImages[el.id]);
      
      for (const el of elementsWithPrompt) {
        if (!active) break;
        
        setLoadingImages(prev => ({ ...prev, [el.id]: true }));
        try {
          // Add a small delay between requests to help prevent 429s from overlapping bursts
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (!active) break;
          
          const url = await generateNodeImage(el.imagePrompt!);
          if (active && url) {
            setNodeImages(prev => ({ ...prev, [el.id]: url }));
          }
        } catch (e) {
          console.error("Image gen failed for node", el.id, e);
        } finally {
          if (active) {
            setLoadingImages(prev => ({ ...prev, [el.id]: false }));
          }
        }
      }
    };

    triggerImageGen();
    return () => { active = false; };
  }, [diagram.elements]);

  // Handle animation logic
  useEffect(() => {
    if (!isAnimated || !diagram.animation) {
      setAnimationStep(-1);
      return;
    }

    const sequence = diagram.animation.sequence;
    let current = 0;
    
    const intervalTime = diagram.animation.timing === 'slow' ? 2000 : diagram.animation.timing === 'fast' ? 500 : 1000;
    
    const interval = setInterval(() => {
      setAnimationStep(current);
      current++;
      if (current >= sequence.length) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isAnimated, diagram]);

  const getElementColor = (style?: string) => {
    switch (style) {
      case 'primary': return '#4f46e5'; // Indigo-600
      case 'secondary': return '#0891b2'; // Cyan-600
      case 'accent': return '#e11d48'; // Rose-600
      default: return '#64748b'; // Slate-500
    }
  };

  const isVisible = (id: string) => {
    if (!isAnimated || !diagram.animation) return true;
    const index = diagram.animation.sequence.indexOf(id);
    if (index === -1) return true; // Elements not in sequence are always visible
    return index <= animationStep;
  };

  const renderElement = (el: DiagramElement) => {
    const color = getElementColor(el.style);
    const visible = isVisible(el.id);
    const opacityClass = visible ? 'opacity-100' : 'opacity-0 scale-90';
    const imageUrl = nodeImages[el.id];
    const isLoading = loadingImages[el.id];
    
    // Base sizes
    const boxWidth = 16; 
    const boxHeight = 8;
    const circleRadius = 5;
    const imageSize = 12; // Percentage based

    // If an image is available or being loaded, we prioritize visual representation
    if (imageUrl || isLoading) {
      return (
        <g key={el.id} className={`transition-all duration-700 ${opacityClass}`} style={{ transformOrigin: `${el.x}% ${el.y}%` }}>
          {isLoading ? (
            <foreignObject x={`${el.x - 3}%`} y={`${el.y - 3}%`} width="6%" height="6%">
               <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-gray-300" size={12} />
               </div>
            </foreignObject>
          ) : (
            <image 
              href={imageUrl} 
              x={`${el.x - (imageSize / 2)}%`} y={`${el.y - (imageSize / 2)}%`} 
              width={`${imageSize}%`} height={`${imageSize}%`} 
              className="rounded-lg shadow-sm"
              style={{ borderRadius: '8px' }}
              aria-label={`Visual representation for ${el.label}`}
            />
          )}
          <text 
            x={`${el.x}%`} y={`${el.y + (imageSize / 2) + 2}%`} textAnchor="middle" 
            fontSize="8" fontWeight="bold" fill={color}
          >
            {el.label}
          </text>
        </g>
      );
    }

    // Default geometric shapes if no image prompt
    switch (el.type) {
      case 'box':
        return (
          <g key={el.id} className={`transition-all duration-700 ${opacityClass}`} style={{ transformOrigin: `${el.x}% ${el.y}%` }}>
            <rect 
              x={`${el.x - (boxWidth / 2)}%`} y={`${el.y - (boxHeight / 2)}%`} width={`${boxWidth}%`} height={`${boxHeight}%`} 
              rx="4" fill="white" stroke={color} strokeWidth="1.5" 
            />
            <text 
              x={`${el.x}%`} y={`${el.y}%`} textAnchor="middle" alignmentBaseline="middle" 
              fontSize="10" fontWeight="bold" fill={color}
            >
              {el.label}
            </text>
          </g>
        );
      case 'circle':
        return (
          <g key={el.id} className={`transition-all duration-700 ${opacityClass}`} style={{ transformOrigin: `${el.x}% ${el.y}%` }}>
            <circle cx={`${el.x}%`} cy={`${el.y}%`} r={`${circleRadius}%`} fill="white" stroke={color} strokeWidth="1.5" />
            <text 
              x={`${el.x}%`} y={`${el.y}%`} textAnchor="middle" alignmentBaseline="middle" 
              fontSize="10" fontWeight="bold" fill={color}
            >
              {el.label}
            </text>
          </g>
        );
      case 'diamond':
        return (
          <g key={el.id} className={`transition-all duration-700 ${opacityClass}`} style={{ transformOrigin: `${el.x}% ${el.y}%` }}>
            <path 
              d={`M ${el.x}% ${el.y - 7}% L ${el.x + 10}% ${el.y}% L ${el.x}% ${el.y + 7}% L ${el.x - 10}% ${el.y}% Z`} 
              fill="white" stroke={color} strokeWidth="1.5" 
            />
            <text 
              x={`${el.x}%`} y={`${el.y}%`} textAnchor="middle" alignmentBaseline="middle" 
              fontSize="9" fontWeight="bold" fill={color}
            >
              {el.label}
            </text>
          </g>
        );
      default:
        return (
          <text 
            key={el.id} x={`${el.x}%`} y={`${el.y}%`} 
            textAnchor="middle" fontSize="11" fontWeight="bold" fill={color} className={`transition-all duration-700 ${opacityClass}`}
          >
            {el.label}
          </text>
        );
    }
  };

  return (
    <div className="w-full aspect-[16/9] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center p-4">
      <svg width="100%" height="100%" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Diagram of type ${diagram.type}`}>
        <title>{`Diagram of type ${diagram.type} showing ${diagram.elements.length} components`}</title>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="5" refX="7" refY="2.5" orientation="auto">
            <polygon points="0 0, 8 2.5, 0 5" fill="#cbd5e1" />
          </marker>
        </defs>

        {/* Render Connections First */}
        {diagram.connections.map((conn, idx) => {
          const fromEl = diagram.elements.find(e => e.id === conn.from);
          const toEl = diagram.elements.find(e => e.id === conn.to);
          if (!fromEl || !toEl) return null;
          
          const id = `conn-${idx}`;
          const visible = isVisible(id);
          const opacityClass = visible ? 'opacity-100' : 'opacity-0';

          return (
            <g key={id} className={`transition-all duration-700 ${opacityClass}`}>
              <line 
                x1={`${fromEl.x}%`} y1={`${fromEl.y}%`} x2={`${toEl.x}%`} y2={`${toEl.y}%`} 
                stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#arrowhead)" 
              />
              {conn.label && (
                <text 
                  x={`${(fromEl.x + toEl.x) / 2}%`} y={`${(fromEl.y + toEl.y) / 2 - 2}%`} 
                  textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="medium"
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Render Elements */}
        {diagram.elements.map(renderElement)}
      </svg>
    </div>
  );
};

export default SvgDiagram;
