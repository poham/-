import React from 'react';

interface DualAxisControllerProps {
  azimuth: number;        // 方位角 0-360°
  elevation: number;      // 仰角 -90° to 90°
  color: string;          // 光源顏色
  label: string;          // 標籤（Key/Fill/Rim）
  disabled?: boolean;     // 是否禁用
  elevationOnly?: boolean; // 只控制仰角（用於 Rim Light）
  onAzimuthChange: (azimuth: number) => void;
  onElevationChange: (elevation: number) => void;
}

const DualAxisController: React.FC<DualAxisControllerProps> = ({
  azimuth,
  elevation,
  color,
  label,
  disabled = false,
  elevationOnly = false,
  onAzimuthChange,
  onElevationChange
}) => {
  
  // 方位角控制器的拖曳處理 - 直接跟隨滑鼠位置
  const handleAzimuthDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || elevationOnly) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 計算滑鼠相對於中心的角度
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // 轉換為我們的座標系統：0° = 上方，順時針增加
    const normalizedAngle = (angle + 90 + 360) % 360;
    onAzimuthChange(Math.round(normalizedAngle));
  };
  
  // 仰角控制器的拖曳處理 - 直接跟隨滑鼠位置
  const handleElevationDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 計算滑鼠相對於中心的角度
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // 仰角：右側 = 0°，上方 = 90°，下方 = -90°
    // 將角度映射到 -90° to 90° 範圍
    let elevationAngle = angle;
    if (elevationAngle > 90) {
      elevationAngle = 90 - (elevationAngle - 90);
    } else if (elevationAngle < -90) {
      elevationAngle = -90 - (elevationAngle + 90);
    }
    
    const normalizedAngle = Math.max(-90, Math.min(90, elevationAngle));
    onElevationChange(Math.round(normalizedAngle));
  };

  return (
    <div className="flex gap-6 items-center">
      {/* 方位角控制器（正視圖） */}
      {!elevationOnly && (
        <div className="flex flex-col items-center gap-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            方位角 Azimuth
          </label>
          <div 
            className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
            onMouseDown={(e) => {
              const moveHandler = (m: MouseEvent) => {
                const syntheticEvent = {
                  clientX: m.clientX,
                  clientY: m.clientY,
                  currentTarget: e.currentTarget
                } as React.MouseEvent<HTMLDivElement>;
                handleAzimuthDrag(syntheticEvent);
              };
              const upHandler = () => { 
                window.removeEventListener('mousemove', moveHandler); 
                window.removeEventListener('mouseup', upHandler); 
              };
              window.addEventListener('mousemove', moveHandler); 
              window.addEventListener('mouseup', upHandler);
              handleAzimuthDrag(e);
            }}
          >
            {/* Background circle */}
            <div className={`absolute inset-0 rounded-full border-2 ${disabled ? 'border-slate-800' : 'border-slate-700'} bg-slate-950 shadow-inner`} />
            
            {/* Cardinal directions */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 text-[8px] font-black text-slate-600 pointer-events-none">0°</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 text-[8px] font-black text-slate-600 pointer-events-none">90°</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5 text-[8px] font-black text-slate-600 pointer-events-none">180°</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 text-[8px] font-black text-slate-600 pointer-events-none">270°</div>
            
            {/* Dashed guide circle */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 128 128">
              <circle 
                cx="64" 
                cy="64" 
                r="56" 
                fill="none" 
                stroke="rgba(100, 116, 139, 0.3)" 
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </svg>
            
            {/* Light indicator - positioned based on angle */}
            <div 
              className="absolute w-6 h-6 rounded-full border-2 border-white/30 transition-all hover:scale-110 pointer-events-none"
              style={{ 
                backgroundColor: color,
                boxShadow: `0 0 15px ${color}80`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${azimuth}deg) translateY(-56px)`
              }}
            />
            
            {/* Center label */}
            <div className="text-[8px] font-black text-slate-700 uppercase tracking-wider pointer-events-none">
              {label}
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{azimuth}°</span>
        </div>
      )}
      
      {/* 仰角控制器（側視圖） */}
      <div className="flex flex-col items-center gap-3">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
          仰角 Elevation
        </label>
        <div 
          className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
          onMouseDown={(e) => {
            const moveHandler = (m: MouseEvent) => {
              const syntheticEvent = {
                clientX: m.clientX,
                clientY: m.clientY,
                currentTarget: e.currentTarget
              } as React.MouseEvent<HTMLDivElement>;
              handleElevationDrag(syntheticEvent);
            };
            const upHandler = () => { 
              window.removeEventListener('mousemove', moveHandler); 
              window.removeEventListener('mouseup', upHandler); 
            };
            window.addEventListener('mousemove', moveHandler); 
            window.addEventListener('mouseup', upHandler);
            handleElevationDrag(e);
          }}
        >
          {/* Background circle */}
          <div className={`absolute inset-0 rounded-full border-2 ${disabled ? 'border-slate-800' : 'border-slate-700'} bg-slate-950 shadow-inner`} />
          
          {/* Elevation markers */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 text-[8px] font-black text-slate-600 pointer-events-none">90°</div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 text-[8px] font-black text-slate-600 pointer-events-none">0°</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5 text-[8px] font-black text-slate-600 pointer-events-none">-90°</div>
          
          {/* Horizon line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 128 128">
            <line x1="8" y1="64" x2="120" y2="64" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="1" strokeDasharray="4,4" />
            <circle 
              cx="64" 
              cy="64" 
              r="56" 
              fill="none" 
              stroke="rgba(100, 116, 139, 0.3)" 
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          </svg>
          
          {/* Light indicator - positioned based on elevation angle */}
          <div 
            className="absolute w-6 h-6 rounded-full border-2 border-white/30 transition-all hover:scale-110 pointer-events-none"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 15px ${color}80`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${elevation}deg) translateX(56px)`
            }}
          />
          
          {/* Center label */}
          <div className="text-[8px] font-black text-slate-700 uppercase tracking-wider pointer-events-none">
            {elevationOnly ? 'RIM' : label}
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">{elevation}°</span>
      </div>
    </div>
  );
};

export default DualAxisController;
