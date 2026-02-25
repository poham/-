import React from 'react';

interface LightingPresetIconProps {
  setupId: string;
  keyLight: { azimuth: number; elevation: number; intensity: number; color: string };
  fillLight: { azimuth: number; elevation: number; intensity: number; color: string };
  rimLight: { azimuth: number; elevation: number; intensity: number; color: string };
}

/**
 * LightingPresetIcon - 燈光預設的 SVG 視覺化圖示
 * 顯示光源方向、強度和顏色的簡化示意圖
 */
const LightingPresetIcon: React.FC<LightingPresetIconProps> = ({
  keyLight,
  fillLight,
  rimLight
}) => {
  
  // 將方位角和仰角轉換為 2D 座標（簡化版）
  const getLightPosition = (azimuth: number, elevation: number, radius: number = 35) => {
    const angleRad = (azimuth - 90) * Math.PI / 180;
    const elevationFactor = Math.cos(elevation * Math.PI / 180);
    return {
      x: 50 + Math.cos(angleRad) * radius * elevationFactor,
      y: 50 + Math.sin(angleRad) * radius * elevationFactor
    };
  };
  
  const keyPos = getLightPosition(keyLight.azimuth, keyLight.elevation);
  const fillPos = getLightPosition(fillLight.azimuth, fillLight.elevation);
  const rimPos = getLightPosition(rimLight.azimuth, rimLight.elevation);
  
  // 計算光線的漸層方向（從光源到中心）
  const getGradientAngle = (azimuth: number) => {
    return azimuth + 90; // 調整角度使光線指向中心
  };
  
  const keyGradientAngle = getGradientAngle(keyLight.azimuth);
  const fillGradientAngle = getGradientAngle(fillLight.azimuth);
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        {/* 主光源漸層 */}
        <radialGradient id={`key-gradient`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={keyLight.color} stopOpacity={keyLight.intensity / 200} />
          <stop offset="100%" stopColor={keyLight.color} stopOpacity="0" />
        </radialGradient>
        
        {/* 補光漸層 */}
        <radialGradient id={`fill-gradient`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={fillLight.color} stopOpacity={fillLight.intensity / 300} />
          <stop offset="100%" stopColor={fillLight.color} stopOpacity="0" />
        </radialGradient>
        
        {/* 輪廓光漸層 */}
        <radialGradient id={`rim-gradient`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={rimLight.color} stopOpacity={rimLight.intensity / 250} />
          <stop offset="100%" stopColor={rimLight.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* 背景圓形（代表主體） */}
      <circle cx="50" cy="50" r="20" fill="#1e293b" />
      
      {/* 主光源光暈效果 */}
      {keyLight.intensity > 0 && (
        <>
          <circle cx="50" cy="50" r="40" fill="url(#key-gradient)" />
          <line 
            x1={keyPos.x} 
            y1={keyPos.y} 
            x2="50" 
            y2="50" 
            stroke={keyLight.color} 
            strokeWidth="1.5" 
            strokeOpacity={keyLight.intensity / 150}
            strokeDasharray="2,2"
          />
          <circle 
            cx={keyPos.x} 
            cy={keyPos.y} 
            r="3" 
            fill={keyLight.color} 
            opacity={keyLight.intensity / 100}
          />
        </>
      )}
      
      {/* 補光光暈效果 */}
      {fillLight.intensity > 0 && (
        <>
          <circle cx="50" cy="50" r="35" fill="url(#fill-gradient)" />
          <line 
            x1={fillPos.x} 
            y1={fillPos.y} 
            x2="50" 
            y2="50" 
            stroke={fillLight.color} 
            strokeWidth="1" 
            strokeOpacity={fillLight.intensity / 200}
            strokeDasharray="2,2"
          />
          <circle 
            cx={fillPos.x} 
            cy={fillPos.y} 
            r="2" 
            fill={fillLight.color} 
            opacity={fillLight.intensity / 120}
          />
        </>
      )}
      
      {/* 輪廓光光暈效果 */}
      {rimLight.intensity > 0 && (
        <>
          <circle cx="50" cy="50" r="30" fill="url(#rim-gradient)" />
          <line 
            x1={rimPos.x} 
            y1={rimPos.y} 
            x2="50" 
            y2="50" 
            stroke={rimLight.color} 
            strokeWidth="1" 
            strokeOpacity={rimLight.intensity / 180}
            strokeDasharray="1,3"
          />
          <circle 
            cx={rimPos.x} 
            cy={rimPos.y} 
            r="2" 
            fill={rimLight.color} 
            opacity={rimLight.intensity / 120}
          />
        </>
      )}
      
      {/* 主體圓形（最上層） */}
      <circle 
        cx="50" 
        cy="50" 
        r="18" 
        fill="#0f172a" 
        stroke="#334155" 
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default LightingPresetIcon;
