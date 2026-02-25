import React, { useState } from 'react';
import { MOOD_TAGS } from '../../constants';

interface MoodTagsSectionProps {
  mood: string;
  customTags: string[];
  onMoodChange: (mood: string) => void;
  onCustomTagsChange: (tags: string[]) => void;
}

/**
 * MoodTagsSection - 情緒標籤管理區域
 * 包含：情緒描述文字區域 + 自定義標籤管理 + 預設標籤選擇
 */
const MoodTagsSection: React.FC<MoodTagsSectionProps> = ({
  mood,
  customTags,
  onMoodChange,
  onCustomTagsChange
}) => {
  const [newTag, setNewTag] = useState('');
  
  const handleMoodTagClick = (tag: string) => {
    const currentMood = mood.trim();
    if (currentMood.includes(tag)) return; // 防止重複
    const newMood = currentMood === '' ? tag : `${currentMood}, ${tag}`;
    onMoodChange(newMood);
  };
  
  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      onCustomTagsChange([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeCustomTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCustomTagsChange(customTags.filter(t => t !== tagToRemove));
  };
  
  return (
    <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 shadow-2xl space-y-6">
      <div className="space-y-2">
        <label className="text-[18px] font-black text-step-style uppercase tracking-[0.15em]">
          情緒與大氣描述
        </label>
        <p className="text-[15px] text-slate-400 font-medium">
          影像靈魂定調
        </p>
      </div>
      
      {/* 情緒描述文字區域 */}
      <textarea 
        value={mood} 
        onChange={(e) => onMoodChange(e.target.value)} 
        placeholder="例如：空靈夢幻、憂鬱黑色、活力商業..." 
        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-lg font-medium text-white outline-none focus:ring-2 focus:ring-step-style focus:border-step-style h-32 shadow-inner placeholder-slate-400 transition-all hover:border-step-style/30 resize-y min-h-[120px]" 
      />

      <div className="space-y-6 pt-2">
        {/* 自定義標籤輸入 */}
        <form onSubmit={handleAddCustomTag} className="flex gap-2">
          <input 
            type="text" 
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="例如：新增自定義情緒標籤..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-5 py-2.5 text-[16px] font-bold text-white focus:ring-1 focus:ring-step-style outline-none placeholder-slate-400"
          />
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-step-style hover:bg-step-style-light text-white rounded-lg text-[16px] font-black uppercase tracking-wide transition-all"
          >
            ＋ 新增
          </button>
        </form>

        {/* 自定義標籤顯示 */}
        {customTags.length > 0 && (
          <div className="space-y-4">
            <p className="text-[15px] font-black text-step-style uppercase tracking-wide border-l-4 border-step-style/30 pl-4">
              我的專屬情緒
            </p>
            <div className="flex flex-wrap gap-2">
              {customTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleMoodTagClick(tag)}
                  className="px-5 py-2.5 bg-slate-800 border border-step-style/20 rounded-lg text-[16px] font-bold text-step-style-light hover:bg-step-style/20 hover:border-step-style transition-all flex items-center gap-3 group"
                >
                  + {tag}
                  <span 
                    onClick={(e) => removeCustomTag(tag, e)} 
                    className="opacity-0 group-hover:opacity-100 text-step-style hover:text-white transition-opacity"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 預設標籤組 */}
        <div className="space-y-4">
          <span className="text-[15px] font-black text-slate-500 uppercase tracking-wide">
            大師庫
          </span>
          {MOOD_TAGS.map(group => (
            <div key={group.name} className="space-y-4">
              <p className="text-[15px] font-black text-slate-600 uppercase tracking-wide border-l-4 border-slate-800 pl-4">
                {group.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => handleMoodTagClick(tag)} 
                    className={`px-5 py-2.5 rounded-lg text-[16px] font-bold transition-all border ${
                      mood.includes(tag) 
                      ? 'bg-step-style border-step-style-light text-white shadow-lg' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-step-style/50'
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
  );
};

export default MoodTagsSection;
