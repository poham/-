
import React, { useRef, useState } from 'react';
import { SUBJECT_ORIENTATIONS, SUBJECT_TAGS } from '../../constants';

interface SubjectSectionProps {
  state: any;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (updater: any) => void;
}

const SubjectSection: React.FC<SubjectSectionProps> = ({ state, customTags, setCustomTags, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTag, setNewTag] = useState('');

  const handleTagClick = (tag: string) => {
    const currentText = state.description || '';
    const newText = currentText.length > 0 
      ? `${currentText.trim()}, ${tag} ` 
      : `${tag} `;
    
    onChange({ ...state, description: newText });
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
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
          <span className="p-3 bg-blue-600/20 rounded-2xl text-blue-500">💎</span> 
          STEP 02. 主體細節
        </h3>
        <div className="text-[12px] font-mono text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full uppercase tracking-widest">Master Object</div>
      </div>
      
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[13px] uppercase font-black text-orange-500 tracking-[0.2em] ml-2">物件類別 (Object Class)</label>
            <input 
              type="text"
              value={state.type}
              onChange={(e) => onChange({ ...state, type: e.target.value })}
              placeholder="例如：Fashion Model, Wagyu Steak, Watch..."
              className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-lg font-bold text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all hover:border-orange-500/30 placeholder-slate-800 shadow-inner"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[13px] uppercase font-black text-orange-500 tracking-[0.2em] ml-2">核心特徵 (Hero Feature)</label>
            <input 
              type="text"
              value={state.key_feature}
              onChange={(e) => onChange({ ...state, key_feature: e.target.value })}
              placeholder="例如：Intense Gaze, Melted Texture, Dial Detail..."
              className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-lg font-bold text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all hover:border-orange-500/30 placeholder-slate-800 shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-5">
          <label className="text-[13px] uppercase font-black text-slate-500 tracking-widest ml-2">主體觀看角度 (Orientation)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SUBJECT_ORIENTATIONS.map(orientation => (
              <button
                key={orientation}
                onClick={() => onChange({ ...state, view_angle: orientation })}
                className={`px-4 py-6 text-[12px] font-black rounded-2xl border transition-all text-center leading-tight h-full flex items-center justify-center ${
                  state.view_angle === orientation 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-900/40 scale-105' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-blue-500/50'
                }`}
              >
                {orientation}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <label className="text-[13px] uppercase font-black text-orange-500 tracking-[0.2em] ml-2">主體描述 (Physical Protocol)</label>
          <textarea
            ref={textareaRef}
            value={state.description}
            onChange={(e) => onChange({ ...state, description: e.target.value })}
            placeholder="描述外觀、材質、細節、服裝或食材質感..."
            className="w-full bg-slate-950 border border-slate-800 rounded-[3rem] p-10 h-64 text-lg font-medium text-slate-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder-slate-800 leading-relaxed shadow-inner hover:border-orange-500/30"
          />
        </div>

        <div className="bg-slate-900/30 p-12 rounded-[4rem] border border-slate-800 space-y-10">
          <div className="flex items-center gap-4">
             <span className="w-12 h-px bg-blue-500/30" />
             <label className="text-[13px] uppercase font-black text-slate-500 tracking-widest">特徵庫 (快捷輸入)</label>
          </div>

          <form onSubmit={handleAddCustomTag} className="flex gap-4">
             <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="新增自定義標籤..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-white focus:ring-1 focus:ring-blue-500 outline-none"
             />
             <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">＋ 新增</button>
          </form>

          {customTags.length > 0 && (
            <div className="space-y-6">
              <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest border-l-4 border-orange-500/30 pl-4">我的專屬標籤 (Personal Tags)</p>
              <div className="flex flex-wrap gap-3">
                {customTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-6 py-3 bg-slate-800 border border-orange-500/20 rounded-xl text-[13px] font-bold text-orange-200 hover:bg-orange-600/20 hover:border-orange-500 transition-all flex items-center gap-3 group"
                  >
                    + {tag}
                    <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-white transition-opacity">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {SUBJECT_TAGS.map(group => (
            <div key={group.name} className="space-y-6">
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest border-l-4 border-blue-500/30 pl-4">{group.name}</p>
              <div className="flex flex-wrap gap-3">
                {group.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-[13px] font-bold text-slate-400 hover:bg-blue-600/20 hover:border-blue-500 hover:text-blue-200 transition-all active:scale-95 shadow-sm"
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

export default SubjectSection;
