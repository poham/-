
import React, { useState, useMemo } from 'react';
import { STYLE_TAG_GROUPS, FILM_STYLES, VISUAL_STYLE_CATEGORIES } from '../../constants';
import { StyleConfig } from '../../types';
import { checkStyleCompatibility, getStyleSuggestion } from '../../utils/styleCompatibility';
import MoodTagsSection from '../lighting/MoodTagsSection';

interface StyleSectionProps {
  state: StyleConfig;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  moodCustomTags: string[];
  setMoodCustomTags: (tags: string[]) => void;
  onChange: (config: StyleConfig) => void;
}

const StyleSection: React.FC<StyleSectionProps> = ({ state, customTags, setCustomTags, moodCustomTags, setMoodCustomTags, onChange }) => {
  const [newTag, setNewTag] = useState('');
  
  // 檢查風格相容性
  const compatibilityWarnings = useMemo(() => checkStyleCompatibility(state), [state]);
  const styleSuggestion = useMemo(() => getStyleSuggestion(state), [state]);

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-step-style-light to-step-style-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
          05
        </div>
        <div className="flex-1">
          <h3 className="text-[32px] font-black text-white leading-tight mb-3">
            模擬風格
          </h3>
          <p className="text-[18px] text-slate-400 leading-relaxed">
            選擇後製風格，包含底片模擬、色調處理和視覺效果。
          </p>
        </div>
      </div>
      
      {/* 視覺風格選擇器 - 分類顯示 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[18px] uppercase font-black text-step-style tracking-wide">視覺風格</label>
          {state.visualStyle && (
            <button
              onClick={() => onChange({ ...state, visualStyle: '' })}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-wide"
            >
              清除選擇
            </button>
          )}
        </div>
        
        {/* 分類顯示視覺風格 */}
        <div className="space-y-6">
          {VISUAL_STYLE_CATEGORIES.map(category => (
            <div key={category.name} className="space-y-3">
              <p className="text-[13px] font-black text-slate-500 uppercase tracking-wide border-l-4 border-slate-800 pl-4">
                {category.name}
              </p>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                {category.styles.map(style => (
                  <button
                    key={style}
                    onClick={() => onChange({ ...state, visualStyle: style })}
                    className={`py-3 px-4 rounded-lg border text-[14px] font-bold transition-all ${
                      state.visualStyle === style
                        ? 'bg-step-style border-step-style-light text-white shadow-2xl scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-step-style/50 hover:text-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* 當前選擇提示 */}
        {state.visualStyle && (
          <div className="p-4 bg-step-style/10 border border-step-style/30 rounded-xl">
            <p className="text-[13px] font-bold text-step-style">
              已選擇：{state.visualStyle}
            </p>
          </div>
        )}
      </div>

      {/* 情緒與大氣描述區域 */}
      <MoodTagsSection
        mood={state.mood}
        customTags={moodCustomTags}
        onMoodChange={(mood) => onChange({ ...state, mood })}
        onCustomTagsChange={setMoodCustomTags}
      />

      {/* 風格相容性警告 */}
      {compatibilityWarnings.length > 0 && (
        <div className="space-y-3">
          {compatibilityWarnings.map((warning, index) => (
            <div 
              key={index}
              className={`p-5 rounded-xl border-2 ${
                warning.severity === 'high' 
                  ? 'bg-red-950/30 border-red-500/50' 
                  : warning.severity === 'medium'
                  ? 'bg-orange-950/30 border-orange-500/50'
                  : 'bg-blue-950/30 border-blue-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-[24px] ${
                  warning.severity === 'high' ? 'text-red-400' :
                  warning.severity === 'medium' ? 'text-orange-400' :
                  'text-blue-400'
                }`}>
                  {warning.severity === 'high' ? '⚠️' : warning.severity === 'medium' ? '⚡' : '💡'}
                </div>
                <div className="flex-1 space-y-2">
                  <p className={`text-[14px] font-bold ${
                    warning.severity === 'high' ? 'text-red-300' :
                    warning.severity === 'medium' ? 'text-orange-300' :
                    'text-blue-300'
                  }`}>
                    {warning.message}
                  </p>
                  <p className="text-[13px] text-slate-300">
                    {warning.suggestion}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {warning.conflictingTags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-[11px] font-bold text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 風格建議 */}
      <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-xl">
        <p className="text-[13px] font-bold text-slate-300">
          {styleSuggestion}
        </p>
      </div>

      {/* 藝術後製協定 - 全寬容器 */}
      <div className="space-y-4">
        <label className="text-[18px] uppercase font-black text-step-style tracking-wide">藝術後製協定</label>
        
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-6 shadow-2xl">
           {/* 自由填寫框 */}
           <div className="space-y-2">
             <label className="text-[15px] font-black text-step-style uppercase tracking-wide">
               自由描述
             </label>
             <textarea 
               value={state.postProcessing.join(', ')} 
               onChange={(e) => {
                 const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                 onChange({ ...state, postProcessing: tags });
               }}
               placeholder="例如：超精細, 光線追蹤, 電影顆粒..." 
               className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-[16px] font-medium text-white outline-none focus:ring-2 focus:ring-step-style focus:border-step-style h-24 shadow-inner placeholder-slate-400 transition-all hover:border-step-style/30 resize-y min-h-[96px]" 
             />
             <p className="text-[11px] text-slate-400 font-medium">
               可直接編輯，用逗號分隔多個標籤
             </p>
           </div>

           <form onSubmit={handleAddCustomTag} className="flex gap-2">
              <input 
                type="text" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="例如：新增自定義後製術語..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-5 py-2.5 text-[16px] font-bold text-white focus:ring-1 focus:ring-step-style outline-none placeholder-slate-400"
              />
              <button type="submit" className="px-5 py-2.5 bg-step-style hover:bg-step-style-light text-white rounded-lg text-[16px] font-black uppercase tracking-wide transition-all">＋ 新增</button>
           </form>

           {customTags.length > 0 && (
             <div className="space-y-4">
               <p className="text-[15px] font-black text-step-style uppercase tracking-wide border-l-4 border-step-style/30 pl-4">我的專屬風格</p>
               <div className="flex flex-wrap gap-2">
                 {customTags.map(tag => {
                   const isSelected = state.postProcessing.includes(tag);
                   return (
                     <button
                       key={tag}
                       onClick={() => handleTagToggle(tag)}
                       className={`px-5 py-2.5 border rounded-lg text-[16px] font-bold transition-all flex items-center gap-3 group ${
                         isSelected 
                         ? 'bg-step-style border-step-style-light text-white shadow-lg scale-105' 
                         : 'bg-slate-800 border-step-style/20 text-step-style-light hover:border-step-style'
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

           {/* 大師渲染術語（分組顯示，響應式網格） */}
           <div className="space-y-6">
             {STYLE_TAG_GROUPS.map(group => (
               <div key={group.name} className="space-y-4">
                 <p className="text-[15px] font-black text-slate-500 uppercase tracking-wide border-l-4 border-slate-800 pl-4">
                   {group.name}
                 </p>
                 <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                   {group.tags.map(tag => {
                     const isSelected = state.postProcessing.includes(tag);
                     return (
                       <button
                         key={tag}
                         onClick={() => handleTagToggle(tag)}
                         className={`px-5 py-2.5 rounded-lg text-[16px] font-bold transition-all border ${
                           isSelected
                           ? 'bg-step-style border-step-style-light text-white shadow-md'
                           : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                         }`}
                       >
                         {tag}
                       </button>
                     );
                   })}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSection;
