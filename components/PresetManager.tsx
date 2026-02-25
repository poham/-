
import React, { useState } from 'react';
import { PromptState, Preset } from '../types';
import { ALL_SERIES, PresetSeries } from '../presets';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

interface PresetManagerProps {
  currentConfig: PromptState;
  userPresets: Preset[];
  setUserPresets: (presets: Preset[]) => void;
  onLoadPreset: (config: PromptState) => void;
  onNavigate?: (section: ActiveTab) => void;
}

const PresetThumbnail = ({ config, thumbnail, size = 'md' }: { config: PromptState, thumbnail?: string, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const ratio = config.camera.aspectRatio;
  const bgColor = config.background.bgColor || '#1e293b';
  
  // 優先使用傳入的 thumbnail，否則檢查 config.thumbnail
  const thumbSrc = thumbnail || config.thumbnail;
  
  // 只有當 thumbnail 存在且不是空字串時才顯示圖片
  if (thumbSrc && thumbSrc.trim() !== '') {
    return (
      <div className={`${size === 'xl' ? 'w-full aspect-[4/3]' : size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-12 h-12' : 'w-20 h-20'} rounded-2xl overflow-hidden border border-white/10 shadow-xl shrink-0`}>
        <img src={thumbSrc} className="w-full h-full object-cover" alt="Preset thumbnail" />
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

const SeriesCover = ({ series }: { series: PresetSeries }) => {
  // 收集系列中有縮圖的 preset（最多 4 張）
  const thumbnails = series.presets
    .filter(p => p.thumbnail && p.thumbnail.trim() !== '')
    .slice(0, 4)
    .map(p => p.thumbnail!);

  // 如果沒有縮圖，使用灰白色漸層
  if (thumbnails.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
    );
  }

  // 根據縮圖數量決定網格佈局
  const getGridClass = (total: number) => {
    if (total === 1) return 'grid-cols-1 grid-rows-1';
    if (total === 2) return 'grid-cols-2 grid-rows-1';
    return 'grid-cols-2 grid-rows-2'; // 3-4 張用 2x2 網格
  };

  return (
    <>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
      {/* Grid 容器 - 直接填滿 */}
      <div className="absolute inset-0">
        <div className={`grid ${getGridClass(thumbnails.length)} gap-0 w-full h-full`}>
          {thumbnails.map((thumb, index) => (
            <div 
              key={index}
              className="relative overflow-hidden bg-slate-900"
            >
              <img 
                src={thumb} 
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* 輕微的漸層遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const PresetManager: React.FC<PresetManagerProps> = ({ currentConfig, userPresets, setUserPresets, onLoadPreset, onNavigate }) => {
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

  const handleNavigateToSettings = () => {
    if (onNavigate) {
      onNavigate('settings');
    }
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
              <span className="text-[18px] font-black uppercase tracking-widest px-1">返回 (Back)</span>
            </button>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedSeries.name}</h3>
              <p className="text-[18px] text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedSeries.description}</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[18px] font-mono text-blue-500 uppercase font-black">{selectedSeries.presets.length} 種變化</span>
            <div className="flex gap-1 mt-1">
              {selectedSeries.presets.map((_, i) => <div key={i} className="w-1 h-1 bg-blue-500/30 rounded-full" />)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {selectedSeries.presets.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onLoadPreset(p.config)} 
              className="group cursor-pointer bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden transition-all hover:-translate-y-2 shadow-xl hover:shadow-blue-900/10"
            >
              <div className="p-1">
                <PresetThumbnail config={p.config} thumbnail={p.thumbnail} size="xl" />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-white uppercase text-sm tracking-tight group-hover:text-blue-400 transition-colors">{p.name}</h4>
                  <span className="text-[18px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{p.config.camera.aspectRatio}</span>
                </div>
                <p className="text-[18px] text-slate-400 font-medium leading-relaxed line-clamp-2">{p.description}</p>
                <div className="pt-4 flex items-center justify-between">
                   <span className="text-[18px] font-black text-blue-500/60 uppercase tracking-[0.2em]">選擇此設定</span>
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
      {/* 使用標準 SectionHeader 格式 - 編號 00 */}
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl shadow-blue-500/30">
          00
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[32px] font-black tracking-tight text-white leading-tight">藝廊預設</h2>
          <p className="text-[18px] text-slate-400 font-medium">精選電影與產品攝影協定</p>
        </div>
      </div>

      {/* 說明文字與儲存按鈕 */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <p className="text-[18px] text-slate-300 leading-relaxed">
          完成流程設定後，點擊下方按鈕保存您的配置。儲存後的預設集會出現在本頁面最下方的「個人存檔」區域。前往{' '}
          <button 
            onClick={handleNavigateToSettings}
            className="text-blue-400 hover:text-blue-300 underline font-bold transition-colors"
          >
            系統設定
          </button>
          {' '}頁面可進行「輸出」及「匯入」操作，透過此功能與他人交換預設集，或在更換主機時匯入使用。
        </p>
        <button 
          onClick={handleSaveCurrent} 
          className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[18px] font-black transition-all uppercase tracking-widest border border-blue-400/30"
        >
          + 儲存目前設定
        </button>
      </div>

      {/* SERIES GALLERIES */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
        {ALL_SERIES.map((series) => (
          <div 
            key={series.id} 
            onClick={() => setSelectedSeries(series)}
            className="group relative h-80 rounded-[2.5rem] cursor-pointer shadow-2xl border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] bg-gradient-to-br from-slate-800 to-slate-900"
          >
            {/* Dynamic Cover with Preset Thumbnails */}
            <div className="absolute inset-0 rounded-[2.5rem] overflow-visible">
              <SeriesCover series={series} />
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{series.name}</h2>
                <p className="text-sm text-slate-300 font-medium max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{series.description}</p>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            {userPresets.map(p => (
              <div key={p.id} onClick={() => onLoadPreset(p.config)} className="p-4 border border-slate-800 hover:border-blue-500/40 rounded-3xl bg-slate-900/40 hover:bg-blue-600/5 transition-all flex items-center gap-4 cursor-pointer group">
                <PresetThumbnail config={p.config} thumbnail={p.thumbnail} size="sm" />
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
