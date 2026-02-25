import React from 'react';

interface Camera3DGizmoProps {
  azimuth: number;      // 方位角 0-360°
  elevation: number;    // 仰角 -90° to 90°
  onAzimuthChange: (value: number) => void;
  onElevationChange: (value: number) => void;
}

const Camera3DGizmo: React.FC<Camera3DGizmoProps> = ({ 
  azimuth, 
  elevation, 
  onAzimuthChange, 
  onElevationChange 
}) => {
  const size = 280;
  const center = size / 2;
  const radius = size / 2 - 30;

  // 3D 投影設定
  const viewAngleX = 15; // 視角 X 軸旋轉（度）
  const viewAngleY = -20; // 視角 Y 軸旋轉（度）
  
  /**
   * 3D 點投影到 2D 平面
   * @param x, y, z - 3D 座標
   * @returns {x, y} - 2D 螢幕座標
   */
  const project3DTo2D = (x: number, y: number, z: number) => {
    // 視角旋轉矩陣
    const viewAngleXRad = (viewAngleX * Math.PI) / 180;
    const viewAngleYRad = (viewAngleY * Math.PI) / 180;
    
    // 繞 X 軸旋轉
    const cosX = Math.cos(viewAngleXRad);
    const sinX = Math.sin(viewAngleXRad);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    
    // 繞 Y 軸旋轉
    const cosY = Math.cos(viewAngleYRad);
    const sinY = Math.sin(viewAngleYRad);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    
    // 透視投影（簡化版，z2 影響縮放）
    const perspective = 1 / (1 + z2 / (radius * 3));
    
    return {
      x: center + x2 * perspective,
      y: center - y1 * perspective
    };
  };
  
  /**
   * 計算球面上的 3D 點
   * @param azimuth - 方位角（度）
   * @param elevation - 仰角（度）
   * @returns {x, y, z} - 3D 座標
   */
  const sphericalTo3D = (azimuth: number, elevation: number) => {
    const azimuthRad = (azimuth * Math.PI) / 180;
    const elevationRad = (elevation * Math.PI) / 180;
    
    // 球面座標轉笛卡爾座標
    const x = radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
    const y = radius * Math.sin(elevationRad);
    const z = radius * Math.cos(elevationRad) * Math.cos(azimuthRad);
    
    return { x, y, z };
  };
  
  // 計算攝影機位置（3D -> 2D）
  const camera3D = sphericalTo3D(azimuth, elevation);
  const camera2D = project3DTo2D(camera3D.x, camera3D.y, camera3D.z);
  
  // 計算視線向量終點
  const vectorEnd2D = project3DTo2D(camera3D.x * 0.3, camera3D.y * 0.3, camera3D.z * 0.3);
  
  /**
   * 生成橢圓路徑（3D 圓投影到 2D）
   * @param axis - 旋轉軸 ('x', 'y', 'z')
   * @param segments - 分段數量
   */
  const generate3DCirclePath = (axis: 'x' | 'y' | 'z', segments: number = 64) => {
    const points: string[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      let x = 0, y = 0, z = 0;
      
      if (axis === 'x') {
        // 繞 X 軸的圓（藍色 - Elevation）
        y = radius * Math.sin(angle);
        z = radius * Math.cos(angle);
      } else if (axis === 'y') {
        // 繞 Y 軸的圓（紅色 - Azimuth）
        x = radius * Math.sin(angle);
        z = radius * Math.cos(angle);
      } else {
        // 繞 Z 軸的圓（綠色 - 輔助）
        x = radius * Math.sin(angle);
        y = radius * Math.cos(angle);
      }
      
      const point2D = project3DTo2D(x, y, z);
      points.push(`${point2D.x},${point2D.y}`);
    }
    
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="space-y-6">
      {/* 3D Gizmo 視覺化 */}
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full h-full"
        >
          <defs>
            {/* 漸層定義 */}
            <radialGradient id="sphereGradient">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.4" />
            </radialGradient>
            
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            
            <linearGradient id="blueGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* 外圈球體 */}
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="url(#sphereGradient)" 
            stroke="#334155" 
            strokeWidth="2"
            opacity="0.6"
          />

          {/* 赤道圈（紅色 - Azimuth 水平旋轉）- 使用 3D 投影 */}
          <path
            d={generate3DCirclePath('y')}
            fill="none"
            stroke="url(#redGradient)"
            strokeWidth="3"
            opacity="0.8"
          />

          {/* 經線圈（藍色 - Elevation 垂直角度）- 使用 3D 投影 */}
          <path
            d={generate3DCirclePath('x')}
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="3"
            opacity="0.8"
          />

          {/* 對角經線（綠色 - 輔助參考）- 使用 3D 投影 */}
          <path
            d={generate3DCirclePath('z')}
            fill="none"
            stroke="url(#greenGradient)"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* 中心點（主體位置） */}
          <circle 
            cx={center} 
            cy={center} 
            r="8" 
            fill="#64748b" 
            stroke="#94a3b8" 
            strokeWidth="2"
          />
          <circle 
            cx={center} 
            cy={center} 
            r="4" 
            fill="#cbd5e1"
          />

          {/* 視線向量（從攝影機指向中心） */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#fbbf24" />
            </marker>
          </defs>
          
          <line
            x1={camera2D.x}
            y1={camera2D.y}
            x2={vectorEnd2D.x}
            y2={vectorEnd2D.y}
            stroke="#fbbf24"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            opacity="0.9"
          />

          {/* 攝影機位置點 */}
          <circle 
            cx={camera2D.x} 
            cy={camera2D.y} 
            r="10" 
            fill="#fbbf24" 
            stroke="#fef3c7" 
            strokeWidth="2"
            className="cursor-pointer transition-all hover:r-12"
          />
          <circle 
            cx={camera2D.x} 
            cy={camera2D.y} 
            r="5" 
            fill="#fef3c7"
          />

          {/* 軸標籤 */}
          <text x={center + radius + 15} y={center + 5} fill="#ef4444" fontSize="14" fontWeight="bold">
            方位角
          </text>
          <text x={center - 5} y={20} fill="#3b82f6" fontSize="14" fontWeight="bold">
            仰角
          </text>
        </svg>
      </div>

      {/* 數值控制器 */}
      <div className="space-y-6">
        {/* 方位角控制 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-black text-red-400 uppercase tracking-widest">
              方位角
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black font-mono text-red-400 bg-red-500/10 px-4 py-1 rounded-xl border border-red-500/20">
                {azimuth > 0 ? `+${azimuth}` : azimuth}°
              </span>
              <button
                onClick={() => onAzimuthChange(0)}
                className="text-[11px] font-black text-slate-600 hover:text-red-400 uppercase px-3 py-1 bg-slate-800 rounded-lg transition-colors"
              >
                歸零
              </button>
            </div>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={azimuth}
            onChange={(e) => onAzimuthChange(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-[13px] font-black text-slate-400 uppercase">
            <span>左側 (-180°)</span>
            <span>正面 (0°)</span>
            <span>右側 (+180°)</span>
          </div>
          <p className="text-[13px] text-slate-300 text-center mt-2 leading-relaxed">
            💡 提示：0° 為正面，±180° 為背面（左右兩端相同位置）
          </p>
        </div>

        {/* 仰角控制 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-black text-blue-400 uppercase tracking-widest">
              仰角
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black font-mono text-blue-400 bg-blue-500/10 px-4 py-1 rounded-xl border border-blue-500/20">
                {elevation}°
              </span>
              <button
                onClick={() => onElevationChange(0)}
                className="text-[11px] font-black text-slate-600 hover:text-blue-400 uppercase px-3 py-1 bg-slate-800 rounded-lg transition-colors"
              >
                歸零
              </button>
            </div>
          </div>
          <input
            type="range"
            min="-90"
            max="90"
            step="1"
            value={elevation}
            onChange={(e) => onElevationChange(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[13px] font-black text-slate-400 uppercase">
            <span>蟲視 (-90°)</span>
            <span>平視 (0°)</span>
            <span>鳥瞰 (90°)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera3DGizmo;
