
import React, { useState } from 'react';
import { STYLE_TAGS, FILM_STYLES } from '../../constants';
import { StyleConfig } from '../../types';

interface StyleSectionProps {
  state: StyleConfig;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (config: StyleConfig) => void;
}

const StyleSection: React.FC<StyleSectionProps> = ({ state, customTags, setCustomTags, onChange }) => {
  const [newTag, setNewTag] = useState('');

  const handleTagToggle = (tag: string) => {
    const isSelected = state.postProcessing.includes(tag);
    onChange({
      ...state,
      postProcessing: isSelected 
        ? state.postProcessing.filter(t => t !== tag) 
        : [...state.postProcessing, tag]
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
    // 同時從選中的列表中移除
    if (state.postProcessing.includes(tagToRemove)) {
      onChange({
        ...state,
        postProcessing: state.postProcessing.filter(t => t !== tagToRemove)
      });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="p-2 bg-purple-600/20 rounded-xl text-purple-500">🎞️</span> 
          STEP 06. 模擬風格
        </h3>
        <div className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full uppercase tracking-widest">Analog Logic</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-10">
          <div className="space-y-8">
            <label className="text-[12px] uppercase font-black text-purple-400 tracking-widest ml-1">藝術後製協定 (Processing Tags)</label>
            
            <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 space-y-10 shadow-2xl">
               <form onSubmit={handleAddCustomTag} className="flex gap-4">
                  <input 
                    type="text" 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新增自定義後製術語..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-white focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                  <button type="submit" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">＋ 新增</button>
               </form>

               {customTags.length > 0 && (
                 <div className="space-y-4">
                   <p className="text-[11px] font-black text-purple-400 uppercase tracking-widest border-l-4 border-purple-500/30 pl-4">我的專屬風格</p>
                   <div className="flex flex-wrap gap-3">
                     {customTags.map(tag => {
                       const isSelected = state.postProcessing.includes(tag);
                       return (
                         <button
                           key={tag}
                           onClick={() => handleTagToggle(tag)}
                           className={`px-5 py-2.5 border rounded-xl text-[12px] font-bold transition-all flex items-center gap-3 group ${
                             isSelected 
                             ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-105' 
                             : 'bg-slate-800 border-purple-500/20 text-purple-200 hover:border-purple-500'
                           }`}
                         >
                           {tag}
                           <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-opacity">×</span>
                         </button>
                       );
                     })}
                   </div>
                 </div>
               )}

               <div className="space-y-4">
                 <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest border-l-4 border-slate-800 pl-4">大師渲染術語</p>
                 <div className="flex flex-wrap gap-3">
                    {STYLE_TAGS.map(tag => {
                      const isSelected = state.postProcessing.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                            isSelected
                            ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-orange-500 tracking-[0.2em] ml-1">底片模擬 (Film Selection)</label>
            <select 
              value={state.filmStyle}
              onChange={(e) => onChange({ ...state, filmStyle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-500/30 shadow-inner"
            >
              <option value="None">無 (Digital Core)</option>
              {FILM_STYLES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="space-y-5">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">顆粒感強度 (Texture Grain)</label>
            <div className="grid grid-cols-2 gap-3">
              {['None', 'Low', 'Medium', 'Heavy'].map(g => (
                <button
                  key={g}
                  onClick={() => onChange({ ...state, grain: g })}
                  className={`py-4 rounded-2xl border text-[11px] font-black uppercase transition-all ${
                    state.grain === g 
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-purple-500/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 shadow-2xl group transition-colors hover:border-purple-500/30">
             <div className="space-y-1">
                <p className="text-[12px] font-black text-slate-200 uppercase tracking-widest group-hover:text-purple-400 transition-colors">鏡頭暗角 (Lens Vignette)</p>
                <p className="text-[10px] text-slate-500 font-medium">縮減邊角亮度</p>
             </div>
             <button 
              onClick={() => onChange({ ...state, vignette: !state.vignette })}
              className={`w-16 h-8 rounded-full transition-all relative ${state.vignette ? 'bg-purple-600 shadow-lg' : 'bg-slate-800 border border-slate-700'}`}
             >
               <div className={`absolute top-1.5 left-1.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${state.vignette ? 'translate-x-8' : ''}`} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSection;
