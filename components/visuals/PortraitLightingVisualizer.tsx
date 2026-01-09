
import React from 'react';
import { OpticsConfig } from '../../types';

interface PortraitLightingVisualizerProps {
  config: OpticsConfig;
}

const PortraitLightingVisualizer: React.FC<PortraitLightingVisualizerProps> = ({ config }) => {
  const { studioSetup, lightRotation, lightColor, lightIntensity, fillLightColor, fillLightIntensity, rimLightColor, rimLightIntensity } = config;

  const getShadowMask = () => {
    switch (studioSetup) {
      case 'split':
        return 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.8) 50%)';
      case 'rembrandt':
        return 'radial-gradient(ellipse at 35% 45%, transparent 15%, rgba(0,0,0,0.7) 35%)';
      case 'butterfly':
        return 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(0,0,0,0.6) 80%)';
      case 'loop':
        return 'radial-gradient(circle at 40% 40%, transparent 20%, rgba(0,0,0,0.7) 50%)';
      case 'rim':
        return 'rgba(0,0,0,0.9)'; 
      case 'high_key':
        return 'rgba(255,255,255,0.05)'; 
      default:
        return `linear-gradient(${lightRotation + 90}deg, transparent 30%, rgba(0,0,0,0.7) 90%)`;
    }
  };

  const maskStyle = getShadowMask();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">人像光影動態預覽 (Live Engine)</label>
        <span className="text-[10px] text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded uppercase border border-yellow-500/20">{studioSetup.replace('_', ' ')}</span>
      </div>

      <div className="relative h-72 w-full bg-slate-950 rounded-[2.5rem] border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Ambient Layer */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: config.ambientColor }} />
        
        {/* Rim Light Glow (Behind) */}
        <div 
           className="absolute w-44 h-60 blur-3xl rounded-full transition-all duration-700"
           style={{ 
             backgroundColor: rimLightColor, 
             opacity: (rimLightIntensity / 100) * 0.4,
             transform: 'scale(1.2)'
           }} 
        />

        {/* Head Silhouette */}
        <div className="relative w-36 h-52 z-10 transition-transform duration-700">
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <defs>
               <filter id="fillGlow">
                 <feGaussianBlur stdDeviation="2" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
            </defs>

            {/* Base Face Shape with Fill Light Influence */}
            <path 
              d="M50 10 C30 10, 20 40, 20 80 C20 120, 35 140, 50 140 C65 140, 80 120, 80 80 C80 40, 70 10, 50 10 Z" 
              className="transition-colors duration-700"
              style={{ 
                fill: studioSetup === 'high_key' ? '#e2e8f0' : '#475569',
                filter: fillLightIntensity > 50 ? 'url(#fillGlow)' : 'none'
              }}
            />

            {/* Fill Light Tint Layer */}
            <path 
              d="M50 10 C30 10, 20 40, 20 80 C20 120, 35 140, 50 140 C65 140, 80 120, 80 80 C80 40, 70 10, 50 10 Z" 
              className="transition-all duration-700 mix-blend-soft-light"
              style={{ 
                fill: fillLightColor,
                opacity: (fillLightIntensity / 100) * 0.6
              }}
            />

            {/* Neck */}
            <rect x="40" y="130" width="20" height="20" className="fill-slate-700" />
          </svg>

          {/* Key Light Color Influence */}
          <div 
             className="absolute inset-0 mix-blend-overlay transition-all duration-1000 ease-in-out pointer-events-none opacity-40 rounded-full"
             style={{ 
               background: `radial-gradient(circle at ${50 + Math.cos(lightRotation * Math.PI / 180) * 30}% ${50 + Math.sin(lightRotation * Math.PI / 180) * 30}%, ${lightColor}, transparent)`,
               maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 10 C30 10, 20 40, 20 80 C20 120, 35 140, 50 140 C65 140, 80 120, 80 80 C80 40, 70 10, 50 10 Z\' fill=\'black\' /%3E%3C/svg%3E")',
               WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 10 C30 10, 20 40, 20 80 C20 120, 35 140, 50 140 C65 140, 80 120, 80 80 C80 40, 70 10, 50 10 Z\' fill=\'black\' /%3E%3C/svg%3E")',
               maskSize: 'contain',
               WebkitMaskSize: 'contain',
               maskRepeat: 'no-repeat',
               WebkitMaskRepeat: 'no-repeat'
             }}
          />

          {/* Dynamic Shadow Overlay (Main Shadow) */}
          <div 
            className="absolute inset-0 mix-blend-multiply transition-all duration-1000 ease-in-out pointer-events-none"
            style={{ 
              background: maskStyle,
              opacity: 1 - (fillLightIntensity / 250), // Fill light softens the shadow
              maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 10 C30 10, 20 40, 20 80 C20 120, 35 140, 50 140 C65 140, 80 120, 80 80 C80 40, 70 10, 50 10 Z\' fill=\'black\' /%3E%3C/svg%3E")',
              WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 10 C30 10, 20 40, 20 80 C20 120, 35 140, 50 140 C65 140, 80 120, 80 80 C80 40, 70 10, 50 10 Z\' fill=\'black\' /%3E%3C/svg%3E")',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat'
            }}
          />

          {/* Rim Light Highlight Edge (Visualized as a white-ish border on one side) */}
          <div 
             className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700 blur-[2px]"
             style={{ 
               boxShadow: `inset -10px 0 15px -5px ${rimLightColor}`,
               opacity: (rimLightIntensity / 100) * 0.8
             }}
          />

          {/* Eye Catchlight */}
          {(studioSetup === 'rembrandt' || studioSetup === 'butterfly') && (
            <div className="absolute top-[35%] left-[35%] w-1.5 h-1.5 bg-white rounded-full opacity-80 shadow-[0_0_5px_white]" />
          )}
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-6 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
           <span className="text-[7px] font-black text-white tracking-widest uppercase">REALTIME PHOTON TRACE</span>
        </div>
      </div>
      <p className="text-[9px] text-slate-500 text-center italic">
        物理引擎已校準：補光強度 {fillLightIntensity}% 正在平衡主體陰影，輪廓光 {rimLightIntensity}% 強化空間層次。
      </p>
    </div>
  );
};

export default PortraitLightingVisualizer;
