
import React, { useState, useRef, useEffect } from 'react';
import { MathResponse } from '../../types';

interface Props {
  graphData: MathResponse['graph_data'];
}

const MathGraph: React.FC<Props> = ({ graphData }) => {
  if (!graphData) return null;

  const {
    important_points,
    plot_points,
    domain_min,
    domain_max,
    range_min,
    range_max,
  } = graphData;

  const [activePoint, setActivePoint] = useState<{ x: number; y: number; label?: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 600;
  const height = 400;
  const padding = 60;

  const scaleX = (x: number) => padding + ((x - domain_min) / (domain_max - domain_min)) * (width - 2 * padding);
  const scaleY = (y: number) => height - (padding + ((y - range_min) / (range_max - range_min)) * (height - 2 * padding));

  const generatePath = () => {
    if (!plot_points || plot_points.length < 2) return '';
    let d = `M ${scaleX(plot_points[0].x)} ${scaleY(plot_points[0].y)}`;
    for (let i = 1; i < plot_points.length; i++) {
      const sx = scaleX(plot_points[i].x);
      const sy = scaleY(plot_points[i].y);
      if (sy < -height || sy > 2 * height) continue;
      d += ` L ${sx} ${sy}`;
    }
    return d;
  };

  const axisX = scaleX(0);
  const axisY = scaleY(0);
  const showAxisX = axisX >= padding && axisX <= width - padding;
  const showAxisY = axisY >= padding && axisY <= height - padding;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current || !plot_points.length) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const svgX = ((clientX - rect.left) / rect.width) * width;
    const mathX = domain_min + ((svgX - padding) / (width - 2 * padding)) * (domain_max - domain_min);

    // Find nearest point on the curve
    let nearest = plot_points[0];
    let minDist = Math.abs(plot_points[0].x - mathX);

    for (const pt of plot_points) {
      const dist = Math.abs(pt.x - mathX);
      if (dist < minDist) {
        minDist = dist;
        nearest = pt;
      }
    }

    // Check if we are close to an important point to show its specific label
    const threshold = (domain_max - domain_min) * 0.05;
    const important = important_points?.find(p => Math.abs(p.x - nearest.x) < threshold);

    setActivePoint(important ? { ...nearest, label: important.label } : nearest);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5 p-4 md:p-8 shadow-sm transition-colors animate-fade-in">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex flex-col">
          <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Graph Visualization</h4>
          <span className="text-lg font-black text-indigo-900 dark:text-indigo-400">Interactive Functional Mapping</span>
        </div>
        {activePoint && (
          <div className="hidden sm:flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 animate-fade-in">
            <span className="text-[10px] font-black theme-text uppercase tracking-widest">Active Coordinate:</span>
            <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
              ({activePoint.x.toFixed(2)}, {activePoint.y.toFixed(2)})
            </span>
          </div>
        )}
      </div>

      <div className="relative aspect-[3/2] w-full bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-white/5 p-2 touch-none overflow-visible">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair"
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={handleInteraction}
          onTouchMove={handleInteraction}
          onMouseLeave={() => setActivePoint(null)}
          onTouchEnd={() => setActivePoint(null)}
        >
          <rect x={padding} y={padding} width={width - 2 * padding} height={height - 2 * padding} fill="transparent" />

          {[...Array(11)].map((_, i) => {
            const x = padding + (i * (width - 2 * padding)) / 10;
            const y = padding + (i * (height - 2 * padding)) / 10;
            return (
              <g key={i}>
                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
              </g>
            );
          })}

          {showAxisY && (
            <g>
              <line x1={padding} y1={axisY} x2={width - padding} y2={axisY} stroke="currentColor" className="text-slate-500 dark:text-slate-400" strokeWidth="2" />
              <text x={width - padding + 5} y={axisY + 4} fontSize="12" fontWeight="bold" fill="currentColor" className="text-slate-500 dark:text-slate-400 font-mono">x</text>
            </g>
          )}
          {showAxisX && (
            <g>
              <line x1={axisX} y1={padding} x2={axisX} y2={height - padding} stroke="currentColor" className="text-slate-500 dark:text-slate-400" strokeWidth="2" />
              <text x={axisX - 4} y={padding - 10} fontSize="12" fontWeight="bold" fill="currentColor" className="text-slate-500 dark:text-slate-400 font-mono" textAnchor="middle">y</text>
            </g>
          )}

          <path d={generatePath()} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />

          {important_points?.map((pt, idx) => {
            const sx = scaleX(pt.x);
            const sy = scaleY(pt.y);
            if (sx < padding - 5 || sx > width - padding + 5 || sy < padding - 5 || sy > height - padding + 5) return null;
            return <circle key={idx} cx={sx} cy={sy} r="6" fill="#4f46e5" stroke="white" strokeWidth="2" />;
          })}

          {/* Tooltip HUD */}
          {activePoint && (
            <g className="animate-fade-in pointer-events-none">
              <line 
                x1={scaleX(activePoint.x)} y1={padding} 
                x2={scaleX(activePoint.x)} y2={height - padding} 
                stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" 
              />
              <line 
                x1={padding} y1={scaleY(activePoint.y)} 
                x2={width - padding} y2={scaleY(activePoint.y)} 
                stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" 
              />
              <circle cx={scaleX(activePoint.x)} cy={scaleY(activePoint.y)} r="8" fill="#4f46e5" opacity="0.3" className="animate-pulse" />
              <circle cx={scaleX(activePoint.x)} cy={scaleY(activePoint.y)} r="4" fill="#4f46e5" stroke="white" strokeWidth="2" />
              
              <g transform={`translate(${scaleX(activePoint.x) + 10}, ${scaleY(activePoint.y) - 45})`}>
                <rect 
                  x="0" y="0" width="120" height="40" rx="8" 
                  className="fill-white dark:fill-slate-800 stroke-indigo-100 dark:stroke-indigo-500/30" strokeWidth="1" 
                />
                {activePoint.label && (
                    <text x="8" y="14" fontSize="8" fontWeight="black" className="fill-indigo-600 dark:fill-indigo-400 uppercase tracking-widest">{activePoint.label}</text>
                )}
                <text x="8" y={activePoint.label ? "30" : "24"} fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200 font-mono">
                  x: {activePoint.x.toFixed(2)}
                </text>
                <text x="65" y={activePoint.label ? "30" : "24"} fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200 font-mono">
                  y: {activePoint.y.toFixed(2)}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
      <div className="mt-4 text-center">
          <p className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">
            {window.matchMedia("(pointer: coarse)").matches ? "Tap curve to inspect data" : "Hover curve to inspect exact coordinates"}
          </p>
      </div>
    </div>
  );
};

export default MathGraph;
