
import React from 'react';
import { OpticsConfig } from '../../types';
import { calculate3DPosition, projectTo2D, calculateShadowOpacity, calculateRimAzimuth } from '../../utils/lightingCalculations';
import { migrateOpticsConfig } from '../../constants';
import './PortraitLightingVisualizer.css';

interface PortraitLightingVisualizerProps {
  config: OpticsConfig;
  onConfigChange?: (config: OpticsConfig) => void;
  activeLight?: 'key' | 'fill' | 'rim' | 'ambient'; // 新增：當前選中的光源
}

const PortraitLightingVisualizer: React.FC<PortraitLightingVisualizerProps> = ({ config, onConfigChange, activeLight = 'key' }) => {
  // 確保配置已遷移到新格式
  const migratedConfig = migrateOpticsConfig(config);
  
  const { studioSetup, keyLight, fillLight, rimLight, ambientColor } = migratedConfig;

  // 動態陰影遮罩生成 - 完全基於實際光源位置
  // 確保預覽與輸出參數一致（WYSIWYG）
  const getShadowMask = () => {
    // 根據主光源的方位角動態生成陰影
    // 陰影方向與光源方向相反
    const shadowAngle = (keyLight.azimuth + 90) % 360;
    
    // 根據主光源的仰角調整陰影強度
    // 仰角越高，陰影越柔和
    const elevationFactor = Math.abs(keyLight.elevation) / 90;
    const shadowIntensity = 0.75 - (elevationFactor * 0.2);
    
    return `linear-gradient(${shadowAngle}deg, transparent 25%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,${shadowIntensity}) 95%)`;
  };

  // 使用新的 3D 計算工具計算光源位置
  const keyLight3D = calculate3DPosition(keyLight.azimuth, keyLight.elevation);
  const keyLight2D = projectTo2D(keyLight3D);
  
  const fillLight3D = calculate3DPosition(fillLight.azimuth, fillLight.elevation);
  const fillLight2D = projectTo2D(fillLight3D, 50, 50, 25);
  
  // 使用 rimLight 自己的 azimuth，不再自動計算
  const rimLight3D = calculate3DPosition(rimLight.azimuth, rimLight.elevation);
  const rimLight2D = projectTo2D(rimLight3D, 50, 50, 30);

  const maskStyle = getShadowMask();
  const shadowOpacity = calculateShadowOpacity(fillLight.intensity);

  // 處理方位角 slider
  const handleAzimuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onConfigChange || activeLight === 'ambient') return;
    
    // 反轉 slider 方向：slider 往右 = 燈光往右
    // 原本：slider 值增加 → azimuth 增加 → 燈光往左（逆時針）
    // 現在：slider 值增加 → azimuth 減少 → 燈光往右（順時針）
    const sliderValue = parseInt(e.target.value);
    const azimuth = (360 - sliderValue) % 360;
    
    if (activeLight === 'key') {
      onConfigChange({
        ...migratedConfig,
        keyLight: { ...keyLight, azimuth },
        studioSetup: 'manual'
      });
    } else if (activeLight === 'fill') {
      onConfigChange({
        ...migratedConfig,
        fillLight: { ...fillLight, azimuth },
        studioSetup: 'manual'
      });
    } else if (activeLight === 'rim') {
      onConfigChange({
        ...migratedConfig,
        rimLight: { ...rimLight, azimuth },
        studioSetup: 'manual'
      });
    }
  };

  // 處理仰角 slider
  const handleElevationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onConfigChange || activeLight === 'ambient') return;
    
    const elevation = parseInt(e.target.value);
    
    if (activeLight === 'key') {
      onConfigChange({
        ...migratedConfig,
        keyLight: { ...keyLight, elevation },
        studioSetup: 'manual'
      });
    } else if (activeLight === 'fill') {
      onConfigChange({
        ...migratedConfig,
        fillLight: { ...fillLight, elevation },
        studioSetup: 'manual'
      });
    } else if (activeLight === 'rim') {
      onConfigChange({
        ...migratedConfig,
        rimLight: { ...rimLight, elevation },
        studioSetup: 'manual'
      });
    }
  };

  // 根據當前選中的光源獲取對應的數據
  const getCurrentLight = () => {
    if (activeLight === 'key') return { ...keyLight };
    if (activeLight === 'fill') return { ...fillLight };
    if (activeLight === 'rim') return { ...rimLight };
    return keyLight;
  };

  const currentLight = getCurrentLight();

  // 根據方位角計算光源指示點的大小和透明度
  const getLightIndicatorStyle = (azimuth: number) => {
    const normalized = ((azimuth % 360) + 360) % 360;
    
    // 計算與正前方（180°）的距離
    let distanceFrom180 = Math.abs(normalized - 180);
    if (distanceFrom180 > 180) distanceFrom180 = 360 - distanceFrom180;
    
    // 大小：180° 時最大（1.0），0° 時最小（0.5）
    // 使用餘弦函數讓過渡更平滑
    const sizeFactor = 0.5 + 0.5 * Math.cos((distanceFrom180 / 180) * Math.PI);
    const size = 24 + sizeFactor * 12; // 24px (最小) 到 36px (最大)
    
    // 透明度：180° 時最亮（1.0），0° 時最淡（0.4）
    const opacityFactor = 0.4 + 0.6 * Math.cos((distanceFrom180 / 180) * Math.PI);
    
    return {
      size,
      opacity: opacityFactor
    };
  };

  const indicatorStyle = getLightIndicatorStyle(currentLight.azimuth);
  
  // 根據當前選中的光源獲取對應的 2D 位置
  const getCurrentLight2D = () => {
    if (activeLight === 'key') return keyLight2D;
    if (activeLight === 'fill') return fillLight2D;
    if (activeLight === 'rim') return rimLight2D;
    return keyLight2D;
  };
  
  const currentLight2D = getCurrentLight2D();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <label className="text-[16px] font-black text-white uppercase tracking-wide">人像光影動態預覽</label>
        <span className="text-[16px] text-yellow-500 font-mono bg-yellow-500/10 px-3 py-1.5 rounded uppercase border border-yellow-500/20">{studioSetup.replace('_', ' ')}</span>
      </div>

      <div className="relative h-72 w-full bg-slate-950 rounded-[2.5rem] border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Ambient Layer - Base environmental color */}
        <div 
          className="absolute inset-0 transition-colors duration-700" 
          data-component="環境光底色層"
          data-description="Ambient Layer - 環境色調背景（膠囊型容器）"
          style={{ backgroundColor: ambientColor, opacity: 0.25 }} 
        />

        {/* Main Face Container */}
        <div 
          className="relative w-52 h-52 transition-transform duration-700" 
          style={{ zIndex: 5 }}
          data-component="主體容器"
          data-description="Main Face Container - 圓形主體容器"
        >
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <defs>
              {/* Advanced SVG Filters for realistic lighting */}
              <filter id="softShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="1" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="fillGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="rimGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Key Light Gradient - Dynamic based on 3D position */}
              <radialGradient 
                id="keyLightGrad" 
                cx={`${keyLight2D.x}%`}
                cy={`${keyLight2D.y}%`}
                r="60%"
              >
                <stop offset="0%" stopColor={keyLight.color} stopOpacity={keyLight.intensity / 100} />
                <stop offset="50%" stopColor={keyLight.color} stopOpacity={(keyLight.intensity / 100) * 0.4} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              
              {/* Fill Light Gradient - Based on 3D position */}
              <radialGradient 
                id="fillLightGrad"
                cx={`${fillLight2D.x}%`}
                cy={`${fillLight2D.y}%`}
                r="70%"
              >
                <stop offset="0%" stopColor={fillLight.color} stopOpacity={(fillLight.intensity / 100) * 0.6} />
                <stop offset="60%" stopColor={fillLight.color} stopOpacity={(fillLight.intensity / 100) * 0.2} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Rim Light Gradient - Edge highlight */}
              <radialGradient 
                id="rimLightGrad"
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="70%" stopColor="transparent" />
                <stop offset="85%" stopColor={rimLight.color} stopOpacity={(rimLight.intensity / 100) * 0.4} />
                <stop offset="100%" stopColor={rimLight.color} stopOpacity={(rimLight.intensity / 100) * 0.8} />
              </radialGradient>

              {/* Face shape - Perfect circle for clearer visualization */}
              <circle 
                id="faceShape"
                cx="50" 
                cy="75" 
                r="40"
              />
            </defs>

            {/* Layer 1: Base Face Shape with ambient influence */}
            <use 
              href="#faceShape"
              className="transition-all duration-700"
              style={{ 
                fill: studioSetup === 'high_key' ? '#cbd5e1' : '#475569',
              }}
              filter="url(#softShadow)"
            />

            {/* Layer 2: Ambient Color Tint */}
            <use 
              href="#faceShape"
              className="transition-all duration-700"
              style={{ 
                fill: ambientColor,
                opacity: 0.15,
                mixBlendMode: 'overlay'
              }}
            />

            {/* Layer 3: Fill Light - Soft illumination on shadow side */}
            <use 
              href="#faceShape"
              className="transition-all duration-700"
              style={{ 
                fill: 'url(#fillLightGrad)',
                mixBlendMode: 'soft-light'
              }}
              filter={fillLight.intensity > 40 ? 'url(#fillGlow)' : undefined}
            />

            {/* Layer 4: Key Light - Primary light source */}
            <use 
              href="#faceShape"
              className="transition-all duration-700"
              style={{ 
                fill: 'url(#keyLightGrad)',
                mixBlendMode: 'screen',
                opacity: 0.9
              }}
            />

            {/* Layer 5: Rim Light - Edge highlight */}
            <use 
              href="#faceShape"
              className="transition-all duration-700"
              style={{ 
                fill: 'url(#rimLightGrad)',
                mixBlendMode: 'overlay'
              }}
              filter={rimLight.intensity > 50 ? 'url(#rimGlow)' : undefined}
            />
          </svg>

          {/* Rim Light Edge Enhancement - 輪廓光邊緣高光 */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700 mix-blend-screen"
            data-component="輪廓光邊緣高光"
            data-description="Rim Light Edge - 根據輪廓光強度在邊緣產生高光（旋轉 90 度，反向）"
            style={{ 
              // Rim Light 高光位置：因為 rimLight.azimuth 已經是反向的，所以這裡要用負號來反轉回來
              boxShadow: `inset ${Math.cos((-rimLight.azimuth + 90) * Math.PI / 180) * 20}px ${-Math.sin((-rimLight.azimuth + 90) * Math.PI / 180) * 20}px 30px -5px ${rimLight.color}`,
              opacity: (rimLight.intensity / 100) * 0.9
            }}
          />

        </div>

        {/* Light Direction Indicators - Show all light sources with depth sorting */}
        {(
          <>
            {/* Arrows behind the face (z < 0) - rendered first so they appear behind */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="keyArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill={keyLight.color} />
                </marker>
                <marker id="fillArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill={fillLight.color} />
                </marker>
                <marker id="rimArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill={rimLight.color} />
                </marker>
              </defs>
              
              {/* Key Light Arrow - only if behind (z < 0) */}
              {keyLight.intensity > 0 && keyLight3D.z < 0 && (
                <line 
                  x1={`${keyLight2D.x}%`}
                  y1={`${keyLight2D.y}%`}
                  x2="50%" 
                  y2="50%" 
                  stroke={keyLight.color}
                  strokeWidth="2.5" 
                  markerEnd="url(#keyArrow)"
                  className="transition-all duration-300"
                  opacity={0.3}
                  strokeDasharray="4,4"
                />
              )}
              
              {/* Fill Light Arrow - only if behind (z < 0) */}
              {fillLight.intensity > 0 && fillLight3D.z < 0 && (
                <line 
                  x1={`${fillLight2D.x}%`}
                  y1={`${fillLight2D.y}%`}
                  x2="50%" 
                  y2="50%" 
                  stroke={fillLight.color}
                  strokeWidth="2" 
                  markerEnd="url(#fillArrow)"
                  className="transition-all duration-300"
                  opacity={0.25}
                  strokeDasharray="4,4"
                />
              )}
              
              {/* Rim Light Arrow - only if behind (z < 0) */}
              {rimLight.intensity > 0 && rimLight3D.z < 0 && (
                <line 
                  x1={`${rimLight2D.x}%`}
                  y1={`${rimLight2D.y}%`}
                  x2="50%" 
                  y2="50%" 
                  stroke={rimLight.color}
                  strokeWidth="1.5" 
                  markerEnd="url(#rimArrow)"
                  className="transition-all duration-300"
                  opacity={0.2}
                  strokeDasharray="4,4"
                />
              )}
            </svg>
            
            {/* Face is rendered here in the middle layer */}
            
            {/* Arrows in front of the face (z >= 0) - rendered last so they appear in front */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              {/* Key Light Arrow - only if in front (z >= 0) */}
              {keyLight.intensity > 0 && keyLight3D.z >= 0 && (
                <line 
                  x1={`${keyLight2D.x}%`}
                  y1={`${keyLight2D.y}%`}
                  x2="50%" 
                  y2="50%" 
                  stroke={keyLight.color}
                  strokeWidth="2.5" 
                  markerEnd="url(#keyArrow)"
                  className="transition-all duration-300"
                  opacity={0.8}
                />
              )}
              
              {/* Fill Light Arrow - only if in front (z >= 0) */}
              {fillLight.intensity > 0 && fillLight3D.z >= 0 && (
                <line 
                  x1={`${fillLight2D.x}%`}
                  y1={`${fillLight2D.y}%`}
                  x2="50%" 
                  y2="50%" 
                  stroke={fillLight.color}
                  strokeWidth="2" 
                  markerEnd="url(#fillArrow)"
                  className="transition-all duration-300"
                  opacity={0.6}
                />
              )}
              
              {/* Rim Light Arrow - only if in front (z >= 0) */}
              {rimLight.intensity > 0 && rimLight3D.z >= 0 && (
                <line 
                  x1={`${rimLight2D.x}%`}
                  y1={`${rimLight2D.y}%`}
                  x2="50%" 
                  y2="50%" 
                  stroke={rimLight.color}
                  strokeWidth="1.5" 
                  markerEnd="url(#rimArrow)"
                  className="transition-all duration-300"
                  opacity={0.5}
                />
              )}
            </svg>
          </>
        )}

        {/* 燈光位置指示點（僅顯示，不可互動） */}
        {onConfigChange && activeLight !== 'ambient' && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 20 }}
          >
            {/* 參考線 */}
            <svg className="absolute w-[90%] h-[90%]" viewBox="0 0 200 200">
              {/* 垂直中心線 */}
              <line 
                x1="100" 
                y1="10" 
                x2="100" 
                y2="190" 
                stroke="#60a5fa" 
                strokeWidth="2"
                strokeDasharray="6,6"
                opacity="0.15"
                className="transition-all duration-300"
              />
              
              {/* 水平中心線 */}
              <line 
                x1="10" 
                y1="100" 
                x2="190" 
                y2="100" 
                stroke="#60a5fa" 
                strokeWidth="2"
                strokeDasharray="6,6"
                opacity="0.15"
                className="transition-all duration-300"
              />
            </svg>
            
            {/* 當前光源位置指示點（僅顯示） */}
            <div
              className="absolute rounded-full border-3 border-white/80 transition-all duration-300"
              data-component="燈光位置指示器"
              data-light-type={activeLight}
              style={{
                backgroundColor: currentLight.color,
                boxShadow: `0 0 ${15 * indicatorStyle.opacity}px ${currentLight.color}${Math.round(indicatorStyle.opacity * 170).toString(16).padStart(2, '0')}`,
                left: `${currentLight2D.x}%`,
                top: `${currentLight2D.y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: indicatorStyle.opacity,
                width: `${indicatorStyle.size}px`,
                height: `${indicatorStyle.size}px`
              }}
            />
          </div>
        )}

        {/* Status Labels */}
        <div 
          className="absolute top-4 left-6 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm" 
          style={{ zIndex: 25 }}
          data-component="即時追蹤狀態標籤"
        >
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-white tracking-widest uppercase">即時光子追蹤</span>
        </div>

        {/* Depth Indicators - Show which lights are behind the subject */}
        <div className="absolute top-4 right-6 flex flex-col gap-1" style={{ zIndex: 25 }}>
          {keyLight.intensity > 0 && keyLight3D.z < 0 && (
            <div 
              className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-full border border-yellow-500/20 backdrop-blur-sm"
              data-component="燈光深度指示標籤"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: keyLight.color }} />
              <span className="text-[13px] font-mono font-bold text-yellow-400">主光背後</span>
            </div>
          )}
          {fillLight.intensity > 0 && fillLight3D.z < 0 && (
            <div 
              className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-full border border-blue-500/20 backdrop-blur-sm"
              data-component="燈光深度指示標籤"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fillLight.color }} />
              <span className="text-[13px] font-mono font-bold text-blue-400">補光背後</span>
            </div>
          )}
          {rimLight.intensity > 0 && rimLight3D.z < 0 && (
            <div 
              className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm"
              data-component="燈光深度指示標籤"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rimLight.color }} />
              <span className="text-[13px] font-mono font-bold text-white/80">輪廓背後</span>
            </div>
          )}
        </div>

        {/* Light Intensity Indicators */}
        <div className="absolute bottom-4 right-6 flex flex-col gap-1" style={{ zIndex: 25 }}>
          {keyLight.intensity > 0 && (
            <div 
              className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm"
              data-component="燈光強度指示標籤"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: keyLight.color }} />
              <span className="text-[13px] font-mono font-bold text-white">主光 {keyLight.intensity}%</span>
            </div>
          )}
          {fillLight.intensity > 0 && (
            <div 
              className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm"
              data-component="燈光強度指示標籤"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fillLight.color }} />
              <span className="text-[13px] font-mono font-bold text-white">補光 {fillLight.intensity}%</span>
            </div>
          )}
          {rimLight.intensity > 0 && (
            <div 
              className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm"
              data-component="燈光強度指示標籤"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rimLight.color }} />
              <span className="text-[13px] font-mono font-bold text-white">輪廓 {rimLight.intensity}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 方位角控制 Slider */}
      {onConfigChange && activeLight !== 'ambient' && (
        <div className="space-y-4">
          {/* 方位角滑桿 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[16px] font-black text-white uppercase tracking-wide">
                方位角
                {activeLight === 'key' && ' - 主光'}
                {activeLight === 'fill' && ' - 補光'}
                {activeLight === 'rim' && ' - 輪廓光'}
              </label>
              <span className="text-[16px] font-mono font-black" style={{ color: currentLight.color }}>
                {currentLight.azimuth}°
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="360"
                value={(360 - currentLight.azimuth) % 360}
                onChange={handleAzimuthChange}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer elevation-slider"
                data-component="方位角控制滑桿"
                data-light-type={activeLight}
                data-light-color={currentLight.color}
                style={{
                  background: `linear-gradient(to right, 
                    #1e293b 0%, 
                    ${currentLight.color} ${((360 - currentLight.azimuth) % 360 / 360) * 100}%, 
                    #1e293b ${((360 - currentLight.azimuth) % 360 / 360) * 100}%)`,
                  accentColor: currentLight.color,
                  ['--slider-thumb-color' as any]: currentLight.color,
                  ['--slider-thumb-shadow' as any]: `0 0 20px ${currentLight.color}cc`
                }}
              />
              
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1 px-1">
                <span>0° 後</span>
                <span>90° 左</span>
                <span className="text-blue-400">180° 前</span>
                <span>270° 右</span>
              </div>
            </div>
          </div>

          {/* 仰角滑桿 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[16px] font-black text-white uppercase tracking-wide">
                仰角
                {activeLight === 'key' && ' - 主光'}
                {activeLight === 'fill' && ' - 補光'}
                {activeLight === 'rim' && ' - 輪廓光'}
              </label>
              <span className="text-[16px] font-mono font-black" style={{ color: currentLight.color }}>
                {currentLight.elevation}°
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="-90"
                max="90"
                value={currentLight.elevation}
                onChange={handleElevationChange}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer elevation-slider"
                data-component="仰角控制滑桿"
                data-light-type={activeLight}
                data-light-color={currentLight.color}
                style={{
                  background: `linear-gradient(to right, 
                    #1e293b 0%, 
                    ${currentLight.color} ${((currentLight.elevation + 90) / 180) * 100}%, 
                    #1e293b ${((currentLight.elevation + 90) / 180) * 100}%)`,
                  accentColor: currentLight.color,
                  ['--slider-thumb-color' as any]: currentLight.color,
                  ['--slider-thumb-shadow' as any]: `0 0 20px ${currentLight.color}cc`
                }}
              />
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-blue-400 pointer-events-none" />
              
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1 px-1">
                <span>-90° 下</span>
                <span className="text-blue-400">0° 平</span>
                <span>+90° 上</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-[13px] text-slate-400 text-center italic">
        物理引擎已校準：補光強度 {fillLight.intensity}% 正在平衡主體陰影，輪廓光 {rimLight.intensity}% 強化空間層次。
      </p>
    </div>
  );
};

export default PortraitLightingVisualizer;
