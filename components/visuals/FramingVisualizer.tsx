
import React from 'react';
import HumanFigureSVG from './assets/human-figure.svg?react';

interface FramingVisualizerProps {
  shotType: string;
  aspectRatio: string;
  roll?: number;
  onShotTypeChange?: (shotType: string) => void;
  onRollChange?: (roll: number) => void;
  availableShotTypes?: string[];
}

const FramingVisualizer: React.FC<FramingVisualizerProps> = ({ 
  shotType, 
  aspectRatio, 
  roll = 0,
  onShotTypeChange,
  onRollChange,
  availableShotTypes = []
}) => {
  const ratioMap: Record<string, number> = {
    '1:1': 1,
    '4:3': 0.75,
    '3:4': 1.33,
    '16:9': 0.56,
    '9:16': 1.77,
  };

  const currentRatio = ratioMap[aspectRatio] || 1;
  
  // 固定基準尺寸（以 1:1 為標準）
  const baseSize = 320;

  const getTransform = () => {
    let scale = 1;
    let baseY = 0;
    
    // SVG viewBox: 0 0 100.73 236.53
    // 關鍵位置參考：
    // - eyes (眼睛): y ≈ 37.9 (16%)
    // - head (頭部): y ≈ 20-51 (8.5%-21.5%)
    // - shoulders (肩膀): y ≈ 56 (23.7%)
    // - chest (胸部): y ≈ 80 (33.8%)
    // - waist (腰部): y ≈ 134 (56.7%)
    // - full body center (全身中心): y ≈ 118 (50%)
    
    if (shotType.includes('微距')) {
      scale = 25;
      baseY = 30;  // 極端特寫細節
    } else if (shotType.includes('極致特寫')) {
      scale = 15;
      baseY = 28;  // 臉部特寫
    } else if (shotType.includes('特寫/肩上')) {
      scale = 7.7;
      baseY = 25;  // 頭部到肩膀
    } else if (shotType.includes('中特寫') || shotType.includes('胸上')) {
      scale = 5;
      baseY = 22;  // 頭部到肩膀下方
    } else if (shotType.includes('中景/腰上')) {
      scale = 2.8;
      baseY = 18;  // 頭部到胸部
    } else if (shotType.includes('中遠景/膝上')) {
      scale = 1.6;
      baseY = 8;   // 頭部到膝蓋
    } else if (shotType.includes('遠景/全身')) {
      scale = 1.2;
      baseY = 0;   // 完整全身
    } else if (shotType.includes('大遠景')) {
      scale = 0.6;
      baseY = -5;  // 全身 + 環境
    } else if (shotType.includes('極遠景')) {
      scale = 0.4;
      baseY = -9;  // 人物在環境中
    } else if (shotType.includes('頂視') || shotType.includes('俯視')) {
      scale = 1.2;
      baseY = 0;   // 俯視視角
    }
    
    return { scale, y: `${baseY}%`, x: '0%', rotate: `${roll}deg` };
  };

  const { scale, y, x, rotate } = getTransform();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="text-[18px] font-black text-white uppercase tracking-[0.15em]">即時觀景窗模擬</label>
        <div className="flex items-center gap-3">
           <span className="text-[13px] text-step-camera-light font-mono bg-step-camera/10 px-3 py-1 rounded-lg border border-step-camera/20 font-black">放大: {scale.toFixed(1)}x</span>
           {roll !== 0 && (
             <span className="text-[13px] text-orange-400 font-mono bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20 font-black">滾轉: {roll}°</span>
           )}
           <span className="text-[13px] text-white/50 font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10 font-black">{aspectRatio}</span>
        </div>
      </div>

      {/* 整合框：觀景窗 + 控制器 */}
      <div className="bg-[#020617] rounded-[3rem] border border-slate-800 shadow-2xl ring-1 ring-white/5 p-6 space-y-6">
        {/* 觀景窗區域 */}
        <div className="relative h-[420px] w-full bg-[#020617] rounded-[2rem] border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center group">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* 固定 1:1 參照容器（始終保持 320x320） */}
          <div 
            className="relative bg-slate-900/40 transition-all duration-700 shadow-3xl overflow-hidden rounded-xl"
            style={{ 
              width: `${baseSize}px`, 
              height: `${baseSize}px`
            }}
          >
            {/* 寬高比裁切框（顯示實際拍攝範圍） */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-step-camera/50 bg-black/20 overflow-hidden"
              style={{ 
                width: `${baseSize}px`, 
                height: `${baseSize * currentRatio}px`,
                maxHeight: `${baseSize}px`
              }}
            >
              {/* 三分法網格線（僅在裁切框內顯示） */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/3 w-full h-px bg-step-camera-light" />
                <div className="absolute top-2/3 w-full h-px bg-step-camera-light" />
                <div className="absolute left-1/3 h-full w-px bg-step-camera-light" />
                <div className="absolute left-2/3 h-full w-px bg-step-camera-light" />
              </div>

              {/* 取景框角標（僅在裁切框內） */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/60 pointer-events-none z-30" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/60 pointer-events-none z-30" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/60 pointer-events-none z-30" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/60 pointer-events-none z-30" />

              {/* 中心對焦點 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <div className={`w-12 h-12 border rounded-full flex items-center justify-center animate-pulse transition-colors ${roll !== 0 ? 'border-orange-400/40' : 'border-step-camera/40'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${roll !== 0 ? 'bg-orange-400' : 'bg-step-camera'}`} />
                </div>
              </div>
            </div>

            {/* 旋轉容器（以畫面中心為基準旋轉） */}
            <div 
              className="absolute inset-0 transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `rotate(${rotate})`,
                transformOrigin: 'center center'
              }}
            >
              {/* 人物圖示（在旋轉容器內進行縮放和位移） */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
                style={{ 
                  transform: `scale(${scale}) translate(${x}, ${y})`,
                  transformOrigin: 'center center'
                }}
              >
                <HumanFigureSVG className="w-[100px] h-auto drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]" />
              </div>
            </div>

            {/* 1:1 參照框線（灰色虛線，顯示完整參照範圍） */}
            <div className="absolute inset-0 border-2 border-dashed border-slate-700/50 pointer-events-none rounded-xl" />
          </div>

          <div className="absolute top-6 left-8 flex items-center gap-4 max-w-[250px]">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)] flex-shrink-0" />
            <span className="text-[13px] font-black text-white uppercase tracking-widest font-mono">錄製 // {aspectRatio}</span>
          </div>

          {/* 寬高比說明 */}
          <div className="absolute top-6 right-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700 px-4 py-2 rounded-xl max-w-[200px]">
            <p className="text-[13px] font-black text-slate-300 uppercase tracking-wider leading-relaxed text-center">
              參照標準: 1:1 {currentRatio !== 1 && `→ 裁切至 ${aspectRatio}`}
            </p>
          </div>
        </div>

        {/* 取景尺度選擇器 */}
        {onShotTypeChange && availableShotTypes.length > 0 && (
          <select 
            value={shotType}
            onChange={(e) => onShotTypeChange(e.target.value)}
            className="w-full bg-slate-900/90 backdrop-blur-2xl border border-slate-700 rounded-2xl px-6 py-4 text-[18px] font-black text-white uppercase tracking-[0.1em] text-center focus:ring-2 focus:ring-step-camera/50 outline-none transition-all hover:border-step-camera/50 shadow-xl cursor-pointer"
          >
            {availableShotTypes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        
        {/* 滾轉控制 */}
        {onRollChange && (
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700 rounded-2xl px-6 py-3 shadow-xl flex items-center gap-4">
            <div className="flex flex-col min-w-[90px]">
              <label className="text-[18px] font-black text-slate-300 uppercase tracking-wider">滾轉</label>
              <span className={`text-[18px] font-mono font-black ${roll !== 0 ? 'text-orange-400' : 'text-slate-600'}`}>{roll}°</span>
            </div>
            <input 
              type="range" min="-45" max="45" step="1"
              value={roll}
              onChange={(e) => onRollChange(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
            <button 
              onClick={() => onRollChange(0)} 
              className="text-[18px] font-black text-slate-500 hover:text-white uppercase px-4 py-2 bg-slate-800 rounded-lg transition-colors"
            >
              歸零
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FramingVisualizer;
