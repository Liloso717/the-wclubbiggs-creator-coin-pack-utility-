import React, { useMemo, useState, useRef } from 'react';

interface ChartProps {
  data: number[];
  color?: string;
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, color = '#a855f7', className = '' }) => {
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; value: number; index: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { pathStr, fillPathStr, points } = useMemo(() => {
    if (!data || data.length === 0) return { pathStr: '', fillPathStr: '', points: [] };
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    // Add 10% padding to top/bottom
    const paddedRange = range * 1.2;
    const padding = range * 0.1;
    
    const pts = data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      // Invert Y because SVG 0 is top
      const y = 100 - (((val - min + padding) / paddedRange) * 100); 
      return { x, y, value: val };
    });

    const line = pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const fill = `0,100 ${line} 100,100`;
    
    return { pathStr: `M ${line}`, fillPathStr: `M ${fill} Z`, points: pts };
  }, [data]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || points.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate percentage of width
    const percent = Math.max(0, Math.min(1, x / width));
    
    // Find nearest point index
    const index = Math.round(percent * (points.length - 1));
    const point = points[index];

    if (point) {
        setHoverInfo({ ...point, index });
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  return (
    <div 
        ref={containerRef} 
        className={`w-full h-full relative group cursor-crosshair ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPathStr} fill="url(#chartGradient)" />
        <path 
          d={pathStr} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          vectorEffect="non-scaling-stroke" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Hover Effects inside SVG */}
        {hoverInfo && (
            <>
                <line 
                    x1={hoverInfo.x} y1="0" 
                    x2={hoverInfo.x} y2="100" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="1" 
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="4 4"
                />
                <circle 
                    cx={hoverInfo.x} 
                    cy={hoverInfo.y} 
                    r="4" 
                    fill={color} 
                    stroke="#0f0f13" 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                />
            </>
        )}
      </svg>

      {/* HTML Tooltip */}
      {hoverInfo && (
        <div 
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3 z-10"
            style={{ left: `${hoverInfo.x}%`, top: `${hoverInfo.y}%` }}
        >
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl flex flex-col items-center relative">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Price</span>
                <span className="font-mono text-sm font-bold text-white whitespace-nowrap">
                    {hoverInfo.value.toFixed(4)} ETH
                </span>
                {/* Tooltip Arrow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-700"></div>
            </div>
        </div>
      )}
    </div>
  );
};