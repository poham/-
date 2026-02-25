import React from 'react';

interface CameraPositionVisualizerProps {
  angle: string;
  roll: number;
}

const CameraPositionVisualizer: React.FC<CameraPositionVisualizerProps> = ({ angle, roll }) => {
  // 解析角度字串，判斷攝影機位置
  const angleLower = angle.toLowerCase();
  
  // 預設位置（水平視角）
  let cameraX = 50; // 水平位置 (%)
  let cameraY = 50; // 垂直位置 (%)
  let cameraRotation = 0; // 攝影機旋轉角度
  let viewLabel = '水平視角';
  let viewColor = 'text-blue-400';
  
  // 根據角度關鍵字判斷攝影機位置
  if (angleLower.includes('bird') || angleLower.includes('鳥瞰') || angleLower.includes('top-down') || angleLower.includes('垂直俯視')) {
    cameraY = 10;
    cameraRotation = 90;
    viewLabel = '鳥瞰視角';
    viewColor = 'text-purple-400';
  } else if (angleLower.includes('worm') || angleLower.includes('蟲視')) {
    cameraY = 90;
    cameraRotation = -90;
    viewLabel = '蟲視角';
    viewColor = 'text-green-400';
  } else if (angleLower.includes('high angle') || angleLower.includes('高角度')) {
    cameraY = 25;
    cameraRotation = 45;
    viewLabel = '高角度';
    viewColor = 'text-cyan-400';
  } else if (angleLower.includes('low angle') || angleLower.includes('低角度')) {
    cameraY = 75;
    cameraRotation = -45;
    viewLabel = '低角度';
    viewColor = 'text-orange-400';
  } else if (angleLower.includes('looking up') || angleLower.includes('仰視')) {
    cameraY = 80;
    cameraRotation = -60;
    viewLabel = '仰視';
    viewColor = 'text-yellow-400';
  } else if (angleLower.includes('looking down') || angleLower.includes('俯視')) {
    cameraY = 20;
    cameraRotation = 60;
    viewLabel = '俯視';
    viewColor = 'text-indigo-400';
  } else if (angleLower.includes('ground level') || angleLower.includes('地面視角')) {
    cameraY = 95;
    cameraRotation = -15;
    viewLabel = '地面視角';
    viewColor = 'text-red-400';
  } else if (angleLower.includes('drone') || angleLower.includes('無人機')) {
    cameraY = 15;
    cameraRotation = 70;
    viewLabel = '無人機視角';
    viewColor = 'text-pink-400';
  }

  return (
    <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <label className="text-[14px] font-black text-slate-500 uppercase tracking-widest">攝影機位置視覺化</label>
        <span className={`text-sm font-black ${viewColor} bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5`}>
          {viewLabel}
        </span>
      </div>

      <div className="relative w-full h-80 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        {/* 背景網格 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* 地平線 */}
        <div className="absolute left-0 right-0 h-px bg-slate-700" style={{ top: '50%' }} />
        <div className="absolute top-1/2 left-4 text-[10px] text-slate-600 font-black uppercase tracking-wider -translate-y-1/2">
          Horizon
        </div>

        {/* 主體（人形圖示） */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
          style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="text-6xl opacity-60">🧍</div>
        </div>

        {/* 攝影機圖示 */}
        <div 
          className="absolute transition-all duration-700 ease-out"
          style={{ 
            left: `${cameraX}%`, 
            top: `${cameraY}%`,
            transform: `translate(-50%, -50%) rotate(${cameraRotation + roll}deg)`
          }}
        >
          {/* 攝影機本體 */}
          <div className="relative">
            <div className={`text-4xl ${viewColor} drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]`}>
              📷
            </div>
            
            {/* 視線指示線 */}
            <svg 
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{ 
                width: '200px', 
                height: '200px',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <defs>
                <linearGradient id="viewLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line 
                x1="100" 
                y1="100" 
                x2="180" 
                y2="100" 
                stroke="url(#viewLineGrad)" 
                strokeWidth="2"
                className={viewColor}
              />
              {/* 視野範圍扇形 */}
              <path
                d="M 100 100 L 180 80 L 180 120 Z"
                fill="currentColor"
                fillOpacity="0.1"
                className={viewColor}
              />
            </svg>
          </div>
        </div>

        {/* Roll 角度指示器（如果有傾斜） */}
        {roll !== 0 && (
          <div className="absolute bottom-4 right-4 bg-orange-500/20 border border-orange-500/50 px-4 py-2 rounded-xl">
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-wider">
              Roll: {roll}°
            </div>
          </div>
        )}

        {/* 高度標記 */}
        <div className="absolute right-4 top-4 bottom-4 w-1 bg-slate-800 rounded-full">
          <div 
            className={`absolute right-0 w-3 h-3 rounded-full ${viewColor.replace('text-', 'bg-')} border-2 border-white shadow-lg transition-all duration-700`}
            style={{ top: `${cameraY}%`, transform: 'translate(50%, -50%)' }}
          />
          <div className="absolute -right-12 top-0 text-[9px] text-slate-600 font-black">HIGH</div>
          <div className="absolute -right-12 bottom-0 text-[9px] text-slate-600 font-black">LOW</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {cameraY < 30 && '高角度拍攝會讓主體顯得較小，適合展現環境或營造俯視感。'}
          {cameraY >= 30 && cameraY < 70 && '水平視角最接近人眼視角，呈現自然真實的透視感。'}
          {cameraY >= 70 && '低角度拍攝會讓主體顯得更有力量感和戲劇性。'}
        </p>
      </div>
    </div>
  );
};

export default CameraPositionVisualizer;
