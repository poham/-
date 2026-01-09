
import React from 'react';

interface LensFOVProps {
  focalLength: string;
  onFocalLengthChange: (val: string) => void;
}

const LensFOV: React.FC<LensFOVProps> = ({ focalLength, onFocalLengthChange }) => {
  const mm = parseInt(focalLength) || 50;
  const fovSteps = [8, 14, 24, 35, 50, 85, 135, 200];
  const labels = ['8mm', '14mm', '24mm', '35mm', '50mm', '85mm', '135mm', '200mm'];

  const getAngle = (val: number) => {
    if (val <= 8) return 160; 
    if (val <= 14) return 114;
    if (val <= 24) return 84;
    if (val <= 35) return 63;
    if (val <= 50) return 46;
    if (val <= 85) return 28;
    if (val <= 135) return 18;
    return 12;
  };

  const getDistortion = (val: number) => {
    if (val <= 8) return 100;
    if (val <= 14) return 70;
    if (val <= 24) return 40;
    if (val <= 35) return 15;
    if (val <= 50) return 0;
    if (val <= 85) return -10;
    if (val <= 135) return -25;
    return -40;
  };

  const angle = getAngle(mm);
  const distortion = getDistortion(mm);
  const isFisheye = mm <= 8;
  const isTiltShift = focalLength.includes('移軸') || focalLength.includes('Tilt-Shift');

  return (
    <div className="space-y-10 p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] shadow-2xl ring-1 ring-white/5">
      <div className="flex justify-between items-center">
        <label className="text-[14px] font-black text-slate-500 uppercase tracking-widest">FOV 視角與物理變形 (Physics)</label>
        <span className={`text-2xl font-black font-mono px-6 py-2 rounded-2xl ${isTiltShift ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/10 text-blue-400'} border border-white/5 shadow-xl`}>
          {focalLength}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="col-span-2 relative h-64 w-full bg-slate-950 rounded-[2.5rem] flex items-end justify-center pb-8 overflow-hidden shadow-inner border border-slate-800">
          <div className={`z-20 text-5xl mb-[-4px] transition-transform duration-700 ${isFisheye ? 'scale-150' : 'scale-100'}`}>
            {isTiltShift ? '🏢' : '📷'}
          </div>
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fovGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isTiltShift ? "#6366f1" : "#3b82f6"} stopOpacity="0.5" />
                <stop offset="100%" stopColor={isTiltShift ? "#6366f1" : "#3b82f6"} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {isFisheye ? (
              <path 
                d={`M 50 90 Q 50 50, 5 20 L 95 20 Q 50 50, 50 90`}
                className="fill-[url(#fovGrad)] stroke-blue-400/50 transition-all duration-700 ease-out"
                strokeWidth="0.5"
              />
            ) : (
              <path 
                d={`M 50 90 L ${50 - angle/2} 10 L ${50 + angle/2} 10 Z`}
                className="fill-[url(#fovGrad)] stroke-blue-400 transition-all duration-700 ease-out"
                strokeWidth="0.5"
              />
            )}
            <line x1="50" y1="90" x2="50" y2="10" stroke="#1e293b" strokeDasharray="5,5" />
          </svg>

          <div className="absolute top-8 flex flex-col items-center">
            <span className={`text-[12px] font-black tracking-[0.4em] uppercase mb-2 ${isFisheye ? 'text-yellow-500' : isTiltShift ? 'text-indigo-400' : 'text-slate-500'}`}>
              {isFisheye ? '魚眼變形' : isTiltShift ? '建築透視校正' : mm < 35 ? '超廣角' : mm < 70 ? '標準視野' : '長焦壓縮感'}
            </span>
            <div className={`h-1.5 w-20 rounded-full ${isFisheye ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-blue-500/50'}`} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-8 p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 shadow-inner">
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">透視變形率</span>
                <span className={`text-lg font-black font-mono ${distortion > 0 ? 'text-orange-400' : distortion < 0 ? 'text-blue-400' : 'text-green-400'}`}>
                   {distortion > 0 ? `+${distortion}%` : `${distortion}%`}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full relative overflow-hidden">
                 <div 
                   className={`h-full absolute transition-all duration-700 ${distortion > 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                   style={{ 
                     width: `${Math.abs(distortion)}%`, 
                     left: distortion >= 0 ? '50%' : `${50 - Math.abs(distortion)}%` 
                   }}
                 />
                 <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-white/30 z-10" />
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                 <span>桶狀變形</span>
                 <span>物理標準</span>
                 <span>空間壓縮</span>
              </div>
           </div>
           <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                 {mm < 35 ? '短焦距會導致畫面邊緣向外擴張，適合表現張力。' : mm > 70 ? '長焦距會壓縮背景與主體的空間深度。' : '50mm 最接近人眼真實透視，變形率極低。'}
              </p>
           </div>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <input 
          type="range" 
          min="0" 
          max={fovSteps.length - 1} 
          step="1"
          value={fovSteps.indexOf(mm)}
          onChange={(e) => {
             const index = parseInt(e.target.value);
             const lensLabels = [
               '8mm 魚眼', '14mm 超廣角', '24mm 移軸', 
               '35mm 街拍', '50mm 標準', '85mm 人像', 
               '135mm 長焦', '200mm 特寫'
             ];
             onFocalLengthChange(lensLabels[index]);
          }}
          className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between px-2">
          {labels.map((label, idx) => (
            <span key={idx} className={`text-[12px] font-black font-mono transition-all ${mm === fovSteps[idx] ? 'text-blue-400 scale-125' : 'text-slate-600'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LensFOV;
