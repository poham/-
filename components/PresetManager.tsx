
import React, { useState } from 'react';
import { PromptState, Preset } from '../types';
import { ALL_SERIES, PresetSeries } from '../presets';

interface PresetManagerProps {
  currentConfig: PromptState;
  userPresets: Preset[];
  setUserPresets: (presets: Preset[]) => void;
  onLoadPreset: (config: PromptState) => void;
}

const PresetThumbnail = ({ config, size = 'md' }: { config: PromptState, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const ratio = config.camera.aspectRatio;
  const bgColor = config.background.bgColor || '#1e293b';
  
  if (config.thumbnail) {
    return (
      <div className={`${size === 'xl' ? 'w-full aspect-[4/3]' : size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-12 h-12' : 'w-20 h-20'} rounded-2xl overflow-hidden border border-white/10 shadow-xl shrink-0`}>
        <img src={config.thumbnail} className="w-full h-full object-cover" alt="Preset thumb" />
      </div>
    );
  }

  const getAspectStyle = () => {
    if (ratio === '9:16') return { width: '35%', height: '70%' };
    if (ratio === '16:9') return { width: '70%', height: '40%' };
    if (ratio === '3:4') return { width: '45%', height: '70%' };
    if (ratio === '4:3') return { width: '70%', height: '52%' };
    return { width: '55%', height: '55%' }; 
  };

  const containerSize = size === 'xl' ? 'w-full aspect-[4/3]' : size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-12 h-12' : 'w-20 h-20';

  return (
    <div className={`${containerSize} bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden relative shadow-inner shrink-0`}>
      <div 
        className="rounded-sm shadow-2xl transition-all duration-500"
        style={{ 
          ...getAspectStyle(),
          backgroundColor: bgColor,
          backgroundImage: `radial-gradient(circle at 30% 30%, ${config.optics.lightColor}55, transparent), 
                            radial-gradient(circle at 70% 70%, ${config.optics.ambientColor}44, transparent)`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

const PresetManager: React.FC<PresetManagerProps> = ({ currentConfig, userPresets, setUserPresets, onLoadPreset }) => {
  const [selectedSeries, setSelectedSeries] = useState<PresetSeries | null>(null);

  const handleSaveCurrent = () => {
    const name = prompt("輸入預設集名稱 (Enter preset name):");
    if (!name) return;
    const newPreset: Preset = {
      id: `user-${Date.now()}`,
      name,
      description: `已儲存: ${new Date().toLocaleDateString()}`,
      config: JSON.parse(JSON.stringify(currentConfig))
    };
    setUserPresets([newPreset, ...userPresets]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("確定刪除此預設集? (Delete?)")) setUserPresets(userPresets.filter(p => p.id !== id));
  };

  if (selectedSeries) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedSeries(null)}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-2 group"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-[10px] font-black uppercase tracking-widest px-1">返回 (Back)</span>
            </button>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedSeries.name}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedSeries.description}</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-mono text-blue-500 uppercase font-black">{selectedSeries.presets.length} 種變化</span>
            <div className="flex gap-1 mt-1">
              {selectedSeries.presets.map((_, i) => <div key={i} className="w-1 h-1 bg-blue-500/30 rounded-full" />)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedSeries.presets.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onLoadPreset(p.config)} 
              className="group cursor-pointer bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden transition-all hover:-translate-y-2 shadow-xl hover:shadow-blue-900/10"
            >
              <div className="p-1">
                <PresetThumbnail config={p.config} size="xl" />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-white uppercase text-sm tracking-tight group-hover:text-blue-400 transition-colors">{p.name}</h4>
                  <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{p.config.camera.aspectRatio}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2">{p.description}</p>
                <div className="pt-4 flex items-center justify-between">
                   <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-[0.2em]">選擇此設定</span>
                   <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <span className="text-xs">→</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">預設集藝廊 (Gallery)</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">精選電影與產品攝影協定</p>
        </div>
        <button 
          onClick={handleSaveCurrent} 
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black transition-all shadow-xl shadow-blue-900/30 uppercase tracking-widest border border-blue-400/30"
        >
          + 儲存目前設定 (Capture)
        </button>
      </div>

      {/* SERIES GALLERIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ALL_SERIES.map((series) => (
          <div 
            key={series.id} 
            onClick={() => setSelectedSeries(series)}
            className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02]"
          >
            {/* Background Image */}
            <img 
              src={series.coverImage} 
              alt={series.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                   <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">大師收藏系列</h4>
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{series.name}</h2>
                <p className="text-sm text-slate-300 font-medium max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{series.description}</p>
                <div className="pt-6 flex gap-3">
                   <div className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">探索 {series.presets.length} 組預設</div>
                </div>
              </div>
            </div>

            {/* Corner Decorative Element */}
            <div className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white text-xl">📁</span>
            </div>
          </div>
        ))}
      </div>

      {/* USER ARCHIVES (Simplified for Main View) */}
      {userPresets.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-800/50">
          <div className="flex items-center gap-4">
             <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                個人存檔 (Personal Archive)
             </label>
             <div className="h-px flex-1 bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userPresets.map(p => (
              <div key={p.id} onClick={() => onLoadPreset(p.config)} className="p-4 border border-slate-800 hover:border-blue-500/40 rounded-3xl bg-slate-900/40 hover:bg-blue-600/5 transition-all flex items-center gap-4 cursor-pointer group">
                <PresetThumbnail config={p.config} size="sm" />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-white uppercase text-[10px] tracking-tight truncate">{p.name}</h4>
                    <button onClick={(e) => handleDelete(p.id, e)} className="text-slate-700 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetManager;
