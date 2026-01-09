
import React, { useState } from 'react';
import { SHOT_TYPES, CAMERA_ANGLE_TAGS, ASPECT_RATIOS } from '../../constants';
import { CameraConfig, OpticsConfig } from '../../types';
import CompositionGrid from '../visuals/CompositionGrid';
import LensFOV from '../visuals/LensFOV';
import DOFVisualizer from '../visuals/DOFVisualizer';
import FramingVisualizer from '../visuals/FramingVisualizer';

interface CameraSectionProps {
  config: CameraConfig;
  opticsConfig: OpticsConfig;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (config: CameraConfig) => void;
  onOpticsChange: (config: OpticsConfig) => void;
}

const CameraSection: React.FC<CameraSectionProps> = ({ config, opticsConfig, customTags, setCustomTags, onChange, onOpticsChange }) => {
  const apertures = ['f/1.2', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22'];
  const [newTag, setNewTag] = useState('');

  const handleChange = (field: keyof CameraConfig | string, value: any) => {
    if (['rule', 'focal_point', 'alignment'].includes(field)) {
      onChange({
        ...config,
        composition: { ...config.composition, [field]: value }
      });
    } else {
      onChange({ ...config, [field]: value });
    }
  };

  const handleAngleTagClick = (tag: string) => {
    if (config.angle.includes(tag)) return;
    const newAngle = config.angle === 'Eye Level' || config.angle === '' 
      ? tag 
      : `${config.angle.trim()}, ${tag}`;
    handleChange('angle', newAngle);
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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <h3 className="text-3xl font-black text-white flex items-center gap-4">
          <span className="p-3 bg-blue-600/20 rounded-2xl text-blue-500">📷</span> 
          STEP 04. 光學參數
        </h3>
        <div className="text-[12px] font-mono text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full uppercase tracking-widest">Physics Core</div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-6">
            <FramingVisualizer 
              shotType={config.shotType} 
              aspectRatio={config.aspectRatio} 
              manualYOffset={config.visualYOffset}
              roll={config.roll}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-900/40 border border-slate-800 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-xl">
                  <div className="flex flex-col min-w-[60px]">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">垂直校準</label>
                     <span className="text-xs font-mono font-black text-blue-400">{config.visualYOffset}%</span>
                  </div>
                  <input 
                     type="range" min="-50" max="50" step="1"
                     value={config.visualYOffset}
                     onChange={(e) => handleChange('visualYOffset', parseInt(e.target.value))}
                     className="flex-1 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                  <button onClick={() => handleChange('visualYOffset', 0)} className="text-[8px] font-black text-slate-600 hover:text-white uppercase px-2 py-1 bg-slate-800 rounded-lg">ZERO</button>
               </div>

               <div className="bg-slate-900/40 border border-slate-800 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-xl">
                  <div className="flex flex-col min-w-[60px]">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">滾轉 (Roll)</label>
                     <span className={`text-xs font-mono font-black ${config.roll !== 0 ? 'text-orange-400' : 'text-slate-600'}`}>{config.roll}°</span>
                  </div>
                  <input 
                     type="range" min="-45" max="45" step="1"
                     value={config.roll}
                     onChange={(e) => handleChange('roll', parseInt(e.target.value))}
                     className="flex-1 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                  />
                  <button onClick={() => handleChange('roll', 0)} className="text-[8px] font-black text-slate-600 hover:text-white uppercase px-2 py-1 bg-slate-800 rounded-lg">ZERO</button>
               </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <label className="text-[14px] uppercase font-black text-blue-400 tracking-widest ml-2">取景尺度 (Shot Scale)</label>
              <select 
                value={config.shotType}
                onChange={(e) => handleChange('shotType', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-8 text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all hover:border-slate-700 shadow-inner"
              >
                {SHOT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <label className="text-[14px] uppercase font-black text-blue-400 tracking-widest ml-2">拍攝角度與高度 (Camera Angles)</label>
                <button 
                  onClick={() => handleChange('angle', '')}
                  className="text-[11px] font-black text-slate-600 hover:text-red-400 uppercase tracking-tighter"
                >
                  重置協定
                </button>
              </div>
              <input 
                type="text"
                value={config.angle}
                onChange={(e) => handleChange('angle', e.target.value)}
                placeholder="例如：Looking up, Drone view..."
                className="w-full bg-slate-950 border border-blue-500/30 rounded-[2rem] p-8 text-xl font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-800 shadow-inner"
              />
              
              <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 space-y-8 shadow-2xl">
                 <form onSubmit={handleAddCustomTag} className="flex gap-4">
                    <input 
                      type="text" 
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="新增自定義角度..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">＋ 新增</button>
                 </form>

                 {customTags.length > 0 && (
                   <div className="space-y-4">
                     <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest border-l-4 border-orange-500/30 pl-4">我的自定義角度</p>
                     <div className="flex flex-wrap gap-3">
                       {customTags.map(tag => (
                         <button
                           key={tag}
                           onClick={() => handleAngleTagClick(tag)}
                           className="px-5 py-2.5 bg-slate-800 border border-orange-500/20 rounded-xl text-[12px] font-bold text-orange-200 hover:bg-orange-600/20 hover:border-orange-500 transition-all flex items-center gap-3 group"
                         >
                           + {tag}
                           <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-white transition-opacity">×</span>
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 {CAMERA_ANGLE_TAGS.map(group => (
                   <div key={group.name} className="space-y-4">
                     <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest border-l-4 border-blue-500/30 pl-4">{group.name}</p>
                     <div className="flex flex-wrap gap-3">
                       {group.tags.map(tag => (
                         <button
                          key={tag}
                          onClick={() => handleAngleTagClick(tag)}
                          className={`px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-tighter border transition-all ${
                            config.angle.includes(tag)
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
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

          <LensFOV 
            focalLength={config.lens} 
            onFocalLengthChange={(val) => handleChange('lens', val)} 
          />
        </div>

        <div className="space-y-14">
          <CompositionGrid 
            aspectRatio={config.aspectRatio} 
            alignment={config.composition.alignment}
            onAlignmentChange={(val) => handleChange('alignment', val)}
          />

          <div className="space-y-8">
            <label className="text-[14px] uppercase font-black text-slate-500 tracking-widest ml-2">畫面寬高比 (Aspect)</label>
            <div className="grid grid-cols-5 gap-5">
              {ASPECT_RATIOS.map(r => (
                <button
                  key={r}
                  onClick={() => handleChange('aspectRatio', r)}
                  className={`py-8 text-[14px] font-black rounded-[2rem] border transition-all ${
                    config.aspectRatio === r 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-3xl scale-105' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 p-14 rounded-[4rem] border border-slate-800 border-l-8 border-l-yellow-500/50 shadow-3xl">
            <div className="flex justify-between items-center mb-12">
              <label className="text-[14px] font-black text-slate-500 uppercase tracking-widest">物理景深光圈 (Aperture)</label>
              <span className="text-3xl font-black text-yellow-500 font-mono bg-yellow-500/10 px-8 py-3 rounded-2xl border border-yellow-500/20">{opticsConfig.dof}</span>
            </div>
            <DOFVisualizer aperture={opticsConfig.dof} />
            <div className="pt-14">
              <input 
                type="range" min="0" max={apertures.length - 1} step="1"
                value={apertures.indexOf(opticsConfig.dof)}
                onChange={(e) => onOpticsChange({ ...opticsConfig, dof: apertures[parseInt(e.target.value)] })}
                className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSection;
