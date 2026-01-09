
import React, { useState } from 'react';
import { OpticsConfig } from '../../types';
import { STUDIO_SETUPS, MOOD_TAGS } from '../../constants';
import PortraitLightingVisualizer from '../visuals/PortraitLightingVisualizer';

interface OpticsSectionProps {
  config: OpticsConfig;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (config: OpticsConfig) => void;
}

const OpticsSection: React.FC<OpticsSectionProps> = ({ config, customTags, setCustomTags, onChange }) => {
  const [activeLayer, setActiveLayer] = useState<'key' | 'fill' | 'rim' | 'ambient'>('key');
  const [newTag, setNewTag] = useState('');

  const handleRotationChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!config.useAdvancedLighting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;
    onChange({ ...config, lightRotation: Math.round(normalizedAngle), studioSetup: 'manual' });
  };

  const handleSetupSelect = (setup: typeof STUDIO_SETUPS[0]) => {
    if (!config.useAdvancedLighting) return;
    onChange({
      ...config,
      studioSetup: setup.id,
      lightRotation: setup.angle
    });
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeCustomTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomTags(customTags.filter(t => t !== tagToRemove));
  };

  const handleMoodTagClick = (tag: string) => {
    const currentMood = config.mood.trim();
    if (currentMood.includes(tag)) return;
    const newMood = currentMood === '' ? tag : `${currentMood}, ${tag}`;
    onChange({ ...config, mood: newMood });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="p-2 bg-yellow-600/20 rounded-xl text-yellow-500">💡</span> 
          STEP 05. 燈光物理
        </h3>
        <div className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full uppercase tracking-widest">Photon Control</div>
      </div>

      <div className="space-y-12">
        <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 border-l-8 border-l-orange-500/50 shadow-2xl space-y-8">
          <div className="space-y-2">
            <label className="text-[14px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">
              01. 情緒與大氣描述 (Atmospheric Mood)
            </label>
            <p className="text-[10px] text-slate-500 uppercase font-bold ml-2">影像靈魂定調 / Global Mood Definition</p>
          </div>
          
          <textarea 
            value={config.mood} 
            onChange={(e) => onChange({...config, mood: e.target.value})} 
            placeholder="例如：Ethereal Dreamy, Moody Noir, Vibrant Commercial..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-8 text-lg font-medium text-white outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32 shadow-inner placeholder-slate-900 transition-all hover:border-orange-500/30" 
          />

          <div className="space-y-8 pt-4">
             <form onSubmit={handleAddCustomTag} className="flex gap-4">
                <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="新增自定義情緒標籤..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-white focus:ring-1 focus:ring-orange-500 outline-none"
                />
                <button type="submit" className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">＋ 新增</button>
             </form>

             {customTags.length > 0 && (
               <div className="space-y-4">
                 <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest border-l-4 border-orange-500/30 pl-4">我的專屬情緒</p>
                 <div className="flex flex-wrap gap-3">
                   {customTags.map(tag => (
                     <button
                       key={tag}
                       onClick={() => handleMoodTagClick(tag)}
                       className="px-5 py-2.5 bg-slate-800 border border-orange-500/20 rounded-xl text-[12px] font-bold text-orange-200 hover:bg-orange-600/20 hover:border-orange-500 transition-all flex items-center gap-3 group"
                     >
                       + {tag}
                       <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-white transition-opacity">×</span>
                     </button>
                   ))}
                 </div>
               </div>
             )}
             
             <div className="space-y-6">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">大師庫 (Mood Tags)</span>
                {MOOD_TAGS.map(group => (
                  <div key={group.name} className="space-y-4">
                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-slate-800 pl-4">{group.name}</p>
                    <div className="flex flex-wrap gap-2.5">
                       {group.tags.map(tag => (
                         <button 
                           key={tag} 
                           onClick={() => handleMoodTagClick(tag)} 
                           className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                             config.mood.includes(tag) 
                             ? 'bg-orange-500 border-orange-400 text-white shadow-lg' 
                             : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-orange-500/50'
                           }`}
                         >
                           {tag}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl ring-1 ring-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-8 ${config.useAdvancedLighting ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-700'} rounded-full transition-all`} />
            <div className="flex flex-col">
              <label className="text-sm font-black uppercase tracking-widest text-white leading-none">02. 啟動專業佈光系統</label>
              <p className="text-[9px] text-slate-500 uppercase mt-1 font-bold">Studio Master Control</p>
            </div>
          </div>
          <button 
            onClick={() => onChange({ ...config, useAdvancedLighting: !config.useAdvancedLighting })}
            className={`w-20 h-10 rounded-full transition-all relative ${config.useAdvancedLighting ? 'bg-blue-600 shadow-2xl' : 'bg-slate-800 border border-slate-700'}`}
          >
             <div className={`absolute top-1.5 left-1.5 w-7 h-7 bg-white rounded-full transition-transform ${config.useAdvancedLighting ? 'translate-x-10' : ''} shadow-lg`} />
          </button>
        </div>

        <div className={`space-y-12 transition-all duration-1000 ${config.useAdvancedLighting ? 'opacity-100' : 'opacity-10 grayscale pointer-events-none scale-[0.98]'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {STUDIO_SETUPS.slice(0, 10).map(setup => (
              <button
                key={setup.id}
                onClick={() => handleSetupSelect(setup)}
                className={`p-6 rounded-[1.5rem] border text-left transition-all ${
                  config.studioSetup === setup.id ? 'bg-blue-600 border-blue-400 shadow-3xl scale-105' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-blue-500/50'
                }`}
              >
                <p className="text-[11px] font-black uppercase mb-1 text-white">{setup.name}</p>
                <p className="text-[8px] opacity-60 leading-tight font-medium">{setup.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-10">
              <PortraitLightingVisualizer config={config} />
              <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-slate-800 flex flex-col items-center gap-8 shadow-2xl">
                 <div className="relative w-44 h-44 rounded-full border-2 border-slate-800 flex items-center justify-center cursor-pointer shadow-inner bg-slate-950"
                   onMouseDown={(e) => {
                      const moveHandler = (m: any) => handleRotationChange(m as unknown as React.MouseEvent<HTMLDivElement>);
                      const upHandler = () => { window.removeEventListener('mousemove', moveHandler); window.removeEventListener('mouseup', upHandler); };
                      window.addEventListener('mousemove', moveHandler); window.addEventListener('mouseup', upHandler);
                      handleRotationChange(e);
                    }}
                 >
                    <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `rotate(${config.lightRotation}deg)` }}>
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.8)] border-4 border-white/30" />
                    </div>
                    <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">DRAG LIGHT</div>
                 </div>
                 <span className="text-xs font-black text-blue-400 tracking-[0.4em] uppercase">光源旋轉角度: {config.lightRotation}°</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex bg-slate-950 border border-slate-800 rounded-[1.5rem] p-2 gap-1 overflow-x-auto custom-scrollbar">
                {(['key', 'fill', 'rim', 'ambient'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveLayer(tab)} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black rounded-xl transition-all uppercase tracking-tighter ${activeLayer === tab ? 'bg-slate-800 text-white shadow-xl ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300'}`}>
                    {tab === 'key' ? '主光 Key' : tab === 'fill' ? '補光 Fill' : tab === 'rim' ? '輪廓 Rim' : '環境 Amb'}
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-950/80 p-10 rounded-[3rem] border border-slate-800 min-h-[350px] shadow-3xl flex flex-col justify-center">
                {activeLayer === 'key' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="flex items-center gap-8">
                      <input type="color" value={config.lightColor} onChange={(e) => onChange({ ...config, lightColor: e.target.value })} className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-2xl" />
                      <div className="flex flex-col">
                        <span className="text-3xl font-black font-mono text-white tracking-tighter uppercase">{config.lightColor}</span>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Key Light Tint</span>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="flex justify-between">
                         <label className="text-[10px] font-black text-slate-500 uppercase">主光強度 (Key Intensity)</label>
                         <span className="text-sm font-black text-blue-400 font-mono">{config.lightIntensity}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={config.lightIntensity} onChange={(e) => onChange({ ...config, lightIntensity: parseInt(e.target.value) })} className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none accent-blue-500 cursor-pointer" />
                    </div>
                  </div>
                )}
                
                {activeLayer === 'fill' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="flex items-center gap-8">
                      <input type="color" value={config.fillLightColor} onChange={(e) => onChange({ ...config, fillLightColor: e.target.value })} className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-2xl" />
                      <div className="flex flex-col">
                        <span className="text-3xl font-black font-mono text-white tracking-tighter uppercase">{config.fillLightColor}</span>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Fill Light Tint</span>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="flex justify-between">
                         <label className="text-[10px] font-black text-slate-500 uppercase">補光強度 (Fill Intensity)</label>
                         <span className="text-sm font-black text-indigo-400 font-mono">{config.fillLightIntensity}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={config.fillLightIntensity} onChange={(e) => onChange({ ...config, fillLightIntensity: parseInt(e.target.value) })} className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none accent-indigo-500 cursor-pointer" />
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase text-center">用於軟化陰影，減少主光產生的對比度</p>
                  </div>
                )}

                {activeLayer === 'rim' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="flex items-center gap-8">
                      <input type="color" value={config.rimLightColor} onChange={(e) => onChange({ ...config, rimLightColor: e.target.value })} className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-2xl" />
                      <div className="flex flex-col">
                        <span className="text-3xl font-black font-mono text-white tracking-tighter uppercase">{config.rimLightColor}</span>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Rim Light Tint</span>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="flex justify-between">
                         <label className="text-[10px] font-black text-slate-500 uppercase">輪廓光強度 (Rim Intensity)</label>
                         <span className="text-sm font-black text-yellow-400 font-mono">{config.rimLightIntensity}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={config.rimLightIntensity} onChange={(e) => onChange({ ...config, rimLightIntensity: parseInt(e.target.value) })} className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none accent-yellow-500 cursor-pointer" />
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase text-center">在主體邊緣產生高光，使其從背景分離</p>
                  </div>
                )}

                {activeLayer === 'ambient' && (
                  <div className="space-y-6 animate-in fade-in duration-500 text-center">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-4">環境反射光色調 (Ambient Tone)</label>
                    <input type="color" value={config.ambientColor} onChange={(e) => onChange({ ...config, ambientColor: e.target.value })} className="w-full h-40 rounded-[2.5rem] bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-3xl hover:scale-[1.02] transition-transform" />
                    <p className="text-[10px] text-slate-600 font-bold mt-4 uppercase">影響陰影處與全域氛圍的微光顏色</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpticsSection;
