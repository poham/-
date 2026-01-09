
import React from 'react';

interface DOFVisualizerProps {
  aperture: string; 
}

const DOFVisualizer: React.FC<DOFVisualizerProps> = ({ aperture }) => {
  const fValue = parseFloat(aperture.replace('f/', '')) || 2.8;
  
  // f/1.2 -> very narrow (~8%)
  // f/22 -> very wide (~85%)
  const focusWidth = Math.min(Math.max((fValue / 22) * 100, 8), 85);

  // Helper to render a consistent professional sphere
  const Sphere = ({ size, glow, blur }: { size: string, glow?: boolean, blur?: string }) => (
    <div 
      className={`rounded-full transition-all duration-700 bg-gradient-to-br from-blue-400 to-blue-800 shadow-2xl ${glow ? 'shadow-blue-500/50 border border-blue-300/30' : 'opacity-40'}`}
      style={{ 
        width: size, 
        height: size, 
        filter: blur ? `blur(${blur})` : 'none',
      }}
    />
  );

  return (
    <div className="space-y-2">
      <div className="relative h-28 w-full bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800/50 shadow-inner">
        {/* Sky/Atmosphere Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

        {/* Far Background Object (Blurred Sphere) */}
        <div className="absolute right-[15%] bottom-10 transition-all duration-700">
          <Sphere 
            size="24px" 
            blur={`${Math.max(0, (22-fValue)/2.5)}px`} 
          />
        </div>
        
        {/* Ground Line */}
        <div className="absolute bottom-8 left-0 right-0 h-px bg-slate-800/60" />
        
        {/* Camera Indicator Line */}
        <div className="absolute left-6 bottom-8 h-2 w-[2px] bg-slate-700" />
        
        {/* Focus Area (The blue highlighted band - DOF) */}
        <div 
          className="absolute h-full bg-blue-500/10 transition-all duration-500 ease-out flex flex-col items-center"
          style={{ width: `${focusWidth}%`, left: '55%', transform: 'translateX(-50%)' }}
        >
          {/* Top DOF indicator */}
          <div className="w-full flex justify-between px-1 pt-1">
             <div className="h-1.5 w-px bg-blue-400/50" />
             <div className="text-[7px] font-black text-blue-400/40 uppercase tracking-tighter">DOF RANGE</div>
             <div className="h-1.5 w-px bg-blue-400/50" />
          </div>

          <div className="flex-1 flex items-center justify-center relative w-full">
            {/* Center Focus Line */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10" />
            
            {/* Focal Point Sphere */}
            <div className="z-20 transform transition-all duration-500">
              <Sphere size="36px" glow={true} />
            </div>
            
            {/* Label */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mt-10 text-[7px] font-black text-blue-400/60 bg-slate-950/80 px-2 py-0.5 rounded border border-blue-500/10 whitespace-nowrap tracking-widest">
              清晰平面 (SHARP PLANE)
            </div>
          </div>

          {/* Bottom DOF indicator */}
          <div className="w-full flex justify-between px-1 pb-1">
             <div className="h-2 w-2 border-l border-b border-blue-400/50" />
             <div className="h-2 w-2 border-r border-b border-blue-400/50" />
          </div>
        </div>

        {/* Foreground Object (Blurred Sphere) */}
        <div className="absolute left-[30%] bottom-8 transition-all duration-700">
          <Sphere 
            size="20px" 
            blur={`${Math.max(0, (22-fValue)/5)}px`} 
          />
        </div>

        {/* Distance Scale Labels */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-around text-[6px] font-mono text-slate-700 uppercase tracking-[0.3em] px-10">
           <span>近景 (Near)</span>
           <span>最佳焦點 (Optimal)</span>
           <span>無限遠 (Infinity)</span>
        </div>
      </div>
    </div>
  );
};

export default DOFVisualizer;