
import React from 'react';

interface FramingVisualizerProps {
  shotType: string;
  aspectRatio: string;
  manualYOffset?: number; 
  roll?: number; // 新增：滾轉角度
}

const FramingVisualizer: React.FC<FramingVisualizerProps> = ({ shotType, aspectRatio, manualYOffset = 0, roll = 0 }) => {
  const ratioMap: Record<string, number> = {
    '1:1': 1,
    '4:3': 0.75,
    '3:4': 1.33,
    '16:9': 0.56,
    '9:16': 1.77,
  };

  const currentRatio = ratioMap[aspectRatio] || 1;

  const getTransform = () => {
    let scale = 1;
    let baseY = 0;
    
    if (shotType.includes('Macro Shot') || shotType.includes('微距')) {
      scale = 25;
      baseY = -48;
    } else if (shotType.includes('Extreme Close-up') || shotType.includes('極致特寫')) {
      scale = 20;
      baseY = -42;
    } else if (shotType.includes('Close-up') || shotType.includes('特寫')) {
      scale = 8;
      baseY = -35;
    } else if (shotType.includes('Medium Close-up') || shotType.includes('中特寫')) {
      scale = 3.5;
      baseY = -18; 
    } else if (shotType.includes('Medium Shot') || shotType.includes('中景')) {
      scale = 1.8;
      baseY = -8;
    } else if (shotType.includes('Medium Long Shot') || shotType.includes('中遠景')) {
      scale = 1.3;
      baseY = -4;
    } else if (shotType.includes('Long Shot') || shotType.includes('遠景')) {
      scale = 0.8;
      baseY = 0;
    }
    
    const finalY = baseY + manualYOffset;
    
    return { scale, y: `${finalY}%`, x: '0%', rotate: `${roll}deg` };
  };

  const { scale, y, x, rotate } = getTransform();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="text-[14px] font-black text-slate-500 uppercase tracking-widest">即時觀景窗模擬 (Live Viewfinder)</label>
        <div className="flex items-center gap-3">
           <span className="text-[11px] text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 font-black">MAG: {scale.toFixed(1)}x</span>
           {roll !== 0 && (
             <span className="text-[11px] text-orange-400 font-mono bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20 font-black">ROLL: {roll}°</span>
           )}
           <span className="text-[11px] text-white/50 font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10 font-black">{aspectRatio}</span>
        </div>
      </div>

      <div className="relative h-[500px] w-full bg-[#020617] rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group ring-1 ring-white/5">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div 
          className="relative border-2 border-blue-500/30 bg-slate-900/40 transition-all duration-700 shadow-3xl overflow-hidden rounded-xl"
          style={{ 
            width: '320px', 
            height: `${320 * currentRatio}px`,
            maxHeight: '440px',
            minHeight: '180px'
          }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute top-1/3 w-full h-px bg-blue-400" />
             <div className="absolute top-2/3 w-full h-px bg-blue-400" />
             <div className="absolute left-1/3 h-full w-px bg-blue-400" />
             <div className="absolute left-2/3 h-full w-px bg-blue-400" />
          </div>

          <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-white/60 pointer-events-none z-30" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/60 pointer-events-none z-30" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/60 pointer-events-none z-30" />
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-white/60 pointer-events-none z-30" />

          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
            style={{ 
              transform: `scale(${scale}) translate(${x}, ${y}) rotate(${rotate})`,
              transformOrigin: 'center center'
            }}
          >
            <svg width="100" height="160" viewBox="0 0 100 160" fill="none" className="drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
              <circle cx="50" cy="25" r="12" className="fill-slate-800" />
              <rect x="47" y="35" width="6" height="5" className="fill-slate-800" />
              <path d="M35 40 H65 L70 80 H30 L35 40 Z" className="fill-slate-800" />
              <path d="M35 40 L25 80" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
              <path d="M65 40 L75 80" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
              <path d="M35 80 L35 150" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
              <path d="M65 80 L65 150" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className={`w-16 h-16 border rounded-full flex items-center justify-center animate-pulse transition-colors ${roll !== 0 ? 'border-orange-400/40' : 'border-blue-400/40'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${roll !== 0 ? 'bg-orange-400' : 'bg-blue-400'}`} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-black/80 backdrop-blur-2xl border border-slate-700 rounded-2xl z-50 shadow-3xl">
           <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">{shotType}</p>
        </div>

        <div className="absolute top-8 left-10 flex items-center gap-4">
           <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
           <span className="text-[11px] font-black text-white uppercase tracking-widest font-mono">REC // {aspectRatio}</span>
        </div>
      </div>
    </div>
  );
};

export default FramingVisualizer;
