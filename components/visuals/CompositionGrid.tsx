
import React from 'react';

interface CompositionGridProps {
  aspectRatio: string;
  alignment: string;
  onAlignmentChange: (alignment: string) => void;
}

const CompositionGrid: React.FC<CompositionGridProps> = ({ aspectRatio, alignment, onAlignmentChange }) => {
  const ratioMap: Record<string, number> = {
    '1:1': 1,
    '4:3': 0.75,
    '3:4': 1.33,
    '16:9': 0.56,
    '9:16': 1.77,
  };

  const regions = [
    'top_left_region', 'top_center_region', 'top_right_region',
    'middle_left_region', 'center', 'middle_right_region',
    'bottom_left_region', 'bottom_center_region', 'bottom_right_region'
  ];

  const intersections = [
    { id: 'top_left_intersection', top: '33.33%', left: '33.33%' },
    { id: 'top_right_intersection', top: '33.33%', left: '66.66%' },
    { id: 'bottom_left_intersection', top: '66.66%', left: '33.33%' },
    { id: 'bottom_right_intersection', top: '66.66%', left: '66.66%' },
  ];

  const currentRatio = ratioMap[aspectRatio] || 1;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <label className="text-[14px] font-black text-slate-500 uppercase tracking-widest">萬用構圖工具 (Composition Grid)</label>
        <span className="text-[12px] text-blue-400 font-mono bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 font-black">{alignment}</span>
      </div>
      
      <div className="w-full flex justify-center py-10 bg-slate-950/40 rounded-[3rem] border border-slate-800 shadow-inner">
        <div 
          className="relative border border-slate-700 bg-slate-900 transition-all duration-500 overflow-hidden rounded-2xl shadow-3xl"
          style={{ 
            width: '320px', 
            height: `${320 * currentRatio}px`,
            maxHeight: '480px',
            minHeight: '180px'
          }}
        >
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1 gap-1">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => onAlignmentChange(region)}
                className={`w-full h-full rounded-lg transition-all flex items-center justify-center group ${
                  alignment === region 
                  ? 'bg-blue-600/40 border border-blue-400/50 shadow-2xl scale-[0.98]' 
                  : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span className={`text-[11px] font-black font-mono transition-opacity ${alignment === region ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-40 text-slate-500'}`}>
                  {region.replace('_region', '').toUpperCase()}
                </span>
              </button>
            ))}

            <div className="absolute inset-0 pointer-events-none flex flex-col">
              <div className="flex-1 border-b border-white/5 flex">
                <div className="flex-1 border-r border-white/5" />
                <div className="flex-1 border-r border-white/5" />
                <div className="flex-1" />
              </div>
              <div className="flex-1 border-b border-white/5 flex">
                <div className="flex-1 border-r border-white/5" />
                <div className="flex-1 border-r border-white/5" />
                <div className="flex-1" />
              </div>
              <div className="flex-1 flex" />
            </div>

            {intersections.map(point => (
              <button
                key={point.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onAlignmentChange(point.id);
                }}
                className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 transition-all z-20 shadow-3xl ${
                  alignment === point.id 
                  ? 'bg-yellow-400 border-white scale-110 shadow-yellow-500/60' 
                  : 'bg-slate-700/80 border-slate-500 hover:scale-125 hover:bg-slate-600'
                }`}
                style={{ top: point.top, left: point.left }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[12px] text-slate-500 text-center italic leading-relaxed font-medium">提示：點擊格點以鎖定主體對齊位移 ({aspectRatio})。</p>
    </div>
  );
};

export default CompositionGrid;
