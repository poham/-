
import React, { useRef, useState } from 'react';
import { ENV_TAGS } from '../../constants';

interface BackgroundSectionProps {
  state: any;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (updater: any) => void;
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({ state, customTags, setCustomTags, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTag, setNewTag] = useState('');

  const handleTagClick = (tag: string) => {
    const currentText = state.description || '';
    const newText = currentText.length > 0 
      ? `${currentText.trim()}, ${tag} ` 
      : `${tag} `;
    onChange({ ...state, description: newText });
    if (textareaRef.current) textareaRef.current.focus();
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
          <span className="p-3 bg-indigo-600/20 rounded-2xl text-indigo-500">🏙️</span> 
          STEP 03. 場景空間
        </h3>
        <div className="text-[12px] font-mono text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full uppercase tracking-widest">Space Definition</div>
      </div>
      
      <div className="space-y-12">
        <div className="space-y-8">
          <label className="text-[14px] uppercase font-black text-slate-500 tracking-[0.2em] ml-2">01. 環境底色 (Background Tint)</label>
          <div className="bg-slate-950/50 p-12 rounded-[4rem] border border-slate-800 flex items-center gap-14 shadow-2xl">
            <input 
              type="color" value={state.bgColor || '#1e293b'} 
              onChange={(e) => onChange({ ...state, bgColor: e.target.value })} 
              className="w-32 h-32 rounded-[3rem] bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-3xl hover:scale-105 transition-transform"
            />
            <div className="flex-1">
               <p className="text-5xl font-black font-mono text-white tracking-tighter">{(state.bgColor || '#1E293B').toUpperCase()}</p>
               <div className="flex flex-wrap gap-4 mt-8">
                  {['#ffffff', '#000000', '#1e293b', '#f472b6', '#3b82f6', '#10b981', '#f59e0b', '#7c3aed'].map(c => (
                    <button key={c} onClick={() => onChange({...state, bgColor: c})} className="w-14 h-14 rounded-full border border-white/10 hover:scale-125 transition-all shadow-xl" style={{ backgroundColor: c }} />
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <label className="text-[14px] uppercase font-black text-orange-500 tracking-[0.2em] ml-2">02. 空間細節描述 (Space Narrative)</label>
          <textarea
            ref={textareaRef}
            value={state.description}
            onChange={(e) => onChange({ ...state, description: e.target.value })}
            placeholder="描述深度、道具、大氣效果..."
            className="w-full bg-slate-950 border border-slate-800 rounded-[3rem] p-12 h-72 text-xl font-medium text-slate-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none leading-relaxed transition-all shadow-inner placeholder-slate-800 hover:border-orange-500/30"
          />
        </div>

        <div className="bg-slate-900/30 p-14 rounded-[4rem] border border-slate-800 space-y-12 shadow-2xl">
          <label className="text-[14px] uppercase font-black text-slate-500 tracking-widest ml-2">環境標籤庫 (Quick Tags)</label>
          
          <form onSubmit={handleAddCustomTag} className="flex gap-4">
             <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="新增自定義場景標籤..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500 outline-none"
             />
             <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">＋ 新增</button>
          </form>

          {customTags.length > 0 && (
            <div className="space-y-8">
              <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest border-l-4 border-orange-500/30 pl-4">我的專屬場景 (Personal Env)</p>
              <div className="flex flex-wrap gap-5">
                {customTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-8 py-4 bg-slate-800 border border-orange-500/20 rounded-2xl text-[14px] font-bold text-orange-200 hover:bg-orange-600/20 hover:border-orange-500 transition-all flex items-center gap-4 group"
                  >
                    + {tag}
                    <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-white transition-opacity">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {ENV_TAGS.map(group => (
            <div key={group.name} className="space-y-8">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest border-l-4 border-indigo-500 pl-4">{group.name}</p>
              <div className="flex flex-wrap gap-5">
                {group.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-[14px] font-bold text-slate-400 hover:bg-indigo-600/20 hover:border-indigo-500 hover:text-indigo-200 transition-all active:scale-95 shadow-sm"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSection;
