
import React, { useRef, useState, useEffect } from 'react';
import { ENV_TAGS } from '../../constants';
import { translateColorHex } from '../../utils/visualTranslators';

// 預設顏色庫
const DEFAULT_COLORS = [
  '#FFFFFF', // Pure white
  '#000000', // Pure black
  '#94A3B8', // Soft gray
  '#3B82F6', // Vibrant blue
  '#10B981', // Fresh green
  '#EF4444', // Bold red
  '#F59E0B', // Warm orange
  '#8B5CF6', // Rich purple
];

interface BackgroundSectionProps {
  state: any;
  customTags: any; // 完整的 CustomTags 物件
  setCustomTags: (tags: any) => void; // 完整的 setCustomTags 函數
  onChange: (updater: any) => void;
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({ state, customTags, setCustomTags, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTag, setNewTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1e293b');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);

  const handleTagClick = (tag: string) => {
    const currentText = state.description || '';
    const newText = currentText.length > 0 
      ? `${currentText.trim()}, ${tag} ` 
      : `${tag} `;
    onChange({ ...state, description: newText });
    if (textareaRef.current) textareaRef.current.focus();
  };

  // 點擊顏色按鈕：插入顏色描述到 textarea
  const handleColorClick = (color: string) => {
    try {
      const colorDesc = translateColorHex(color);
      const colorName = colorDesc.split(',')[0].trim();
      
      const currentText = state.description || '';
      const newText = currentText.length > 0 
        ? `${currentText.trim()}, ${colorName}` 
        : colorName;
      
      onChange({ ...state, description: newText });
      
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    } catch (error) {
      console.error('Error translating color:', error);
    }
  };

  // 選擇顏色進行編輯
  const handleSelectColor = (index: number, color: string) => {
    setSelectedColorIndex(index);
    setSelectedColor(color);
  };

  // 更新選中的顏色
  const handleUpdateColor = () => {
    if (selectedColorIndex !== null && selectedColorIndex >= DEFAULT_COLORS.length) {
      // 更新自訂顏色
      const newCustomColors = [...customTags.colors];
      newCustomColors[selectedColorIndex - DEFAULT_COLORS.length] = selectedColor;
      setCustomTags({ ...customTags, colors: newCustomColors });
      setSelectedColorIndex(null);
    }
  };

  // 新增顏色到自訂庫
  const handleAddColor = () => {
    if (!customTags.colors.includes(selectedColor)) {
      setCustomTags({ ...customTags, colors: [...customTags.colors, selectedColor] });
      setSelectedColorIndex(null);
    }
  };

  // 刪除自訂顏色
  const handleRemoveColor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCustomColors = customTags.colors.filter((_, i) => i !== index);
    setCustomTags({ ...customTags, colors: newCustomColors });
    if (selectedColorIndex === DEFAULT_COLORS.length + index) {
      setSelectedColorIndex(null);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !customTags.background.includes(newTag.trim())) {
      setCustomTags({ ...customTags, background: [...customTags.background, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeCustomTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomTags({ ...customTags, background: customTags.background.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-step-scene-light to-step-scene-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
          02
        </div>
        <div className="flex-1">
          <h3 className="text-[32px] font-black text-white leading-tight mb-3">
            場景空間
          </h3>
          <p className="text-[18px] text-slate-400 leading-relaxed">
            設定拍攝環境，包含背景描述、空間深度、道具和大氣效果。
          </p>
        </div>
      </div>
      
      <div className="space-y-12">
        {/* 01. 空間細節描述 - 主要內容 */}
        <div className="space-y-4">
          <label className="text-[16px] uppercase font-black text-white tracking-[0.15em] ml-2">空間細節描述</label>
          <textarea
            ref={textareaRef}
            value={state.description}
            onChange={(e) => onChange({ ...state, description: e.target.value })}
            placeholder="例如：深度、道具、大氣效果..."
            className="w-full bg-slate-950 border border-white rounded-xl p-4 min-h-[200px] text-xl font-medium text-slate-200 focus:ring-2 focus:ring-step-scene/50 focus:border-step-scene outline-none leading-relaxed transition-all shadow-inner placeholder-slate-400 hover:border-step-scene/30 resize-y"
          />
        </div>

        {/* 02. 環境標籤庫 + 顏色管理 */}
        <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-step-scene/30" />
            <label className="text-[18px] uppercase font-black text-slate-300 tracking-widest">環境標籤庫</label>
          </div>
          
          {/* 顏色庫區塊 */}
          <div className="space-y-4">
            <p className="text-[18px] font-black text-slate-300 uppercase tracking-widest border-l-4 border-step-scene/30 pl-4">顏色庫</p>
            
            {/* 預設顏色 */}
            <div className="flex flex-wrap gap-3">
              {DEFAULT_COLORS.map((color, index) => (
                <button
                  key={`default-${color}`}
                  onClick={() => handleColorClick(color)}
                  onDoubleClick={() => handleSelectColor(index, color)}
                  className={`group relative w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
                    selectedColorIndex === index 
                      ? 'border-purple-500 ring-2 ring-purple-500/50 scale-110' 
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`點擊插入顏色，雙擊選擇編輯`}
                >
                  {color === '#FFFFFF' && <div className="absolute inset-0 border border-slate-800 rounded-xl pointer-events-none" />}
                </button>
              ))}
              
              {/* 自訂顏色 */}
              {customTags.colors.map((color, index) => (
                <button
                  key={`custom-${color}-${index}`}
                  onClick={() => handleColorClick(color)}
                  onDoubleClick={() => handleSelectColor(DEFAULT_COLORS.length + index, color)}
                  className={`group relative w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
                    selectedColorIndex === DEFAULT_COLORS.length + index 
                      ? 'border-purple-500 ring-2 ring-purple-500/50 scale-110' 
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`點擊插入顏色，雙擊選擇編輯`}
                >
                  {color === '#FFFFFF' && <div className="absolute inset-0 border border-slate-800 rounded-xl pointer-events-none" />}
                  <span 
                    onClick={(e) => handleRemoveColor(index, e)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-400"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
            
            {/* 顏色編輯工具 */}
            <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <input 
                type="color" 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)} 
                className="w-10 h-10 rounded-lg bg-slate-900 border-2 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
              />
              <span className="text-[18px] font-mono text-slate-300 flex-1">{selectedColor.toUpperCase()}</span>
              
              {selectedColorIndex !== null && selectedColorIndex >= DEFAULT_COLORS.length ? (
                <button
                  onClick={handleUpdateColor}
                  className="px-4 py-2 bg-step-scene hover:bg-step-scene-light text-white rounded-lg text-[18px] font-black uppercase tracking-widest transition-all"
                >
                  更新
                </button>
              ) : (
                <button
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-step-scene hover:bg-step-scene-light text-white rounded-lg text-[18px] font-black uppercase tracking-widest transition-all"
                >
                  + 新增
                </button>
              )}
            </div>
            
            <p className="text-[18px] text-slate-400 italic">💡 點擊顏色插入描述，雙擊選擇後可編輯</p>
          </div>
          
          <form onSubmit={handleAddCustomTag} className="flex gap-3">
             <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="新增自定義標籤..."
              className="flex-1 bg-slate-950 border border-white rounded-lg px-4 py-2 text-[18px] font-bold text-white focus:ring-1 focus:ring-step-scene outline-none"
             />
             <button type="submit" className="px-5 py-2 bg-step-scene hover:bg-step-scene-light text-white rounded-lg text-[18px] font-black uppercase tracking-widest transition-all">＋ 新增</button>
          </form>

          {customTags.background.length > 0 && (
            <div className="space-y-4">
              <p className="text-[18px] font-black text-step-scene-light uppercase tracking-widest border-l-4 border-step-scene/30 pl-4">我的專屬標籤</p>
              <div className="flex flex-wrap gap-2">
                {customTags.background.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-5 py-2.5 bg-slate-800 border border-step-scene/20 rounded-lg text-[18px] font-bold text-white hover:bg-step-scene/20 hover:border-step-scene transition-all flex items-center gap-3 group"
                  >
                    + {tag}
                    <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-step-scene hover:text-white transition-opacity">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {ENV_TAGS.map(group => (
            <div key={group.name} className="space-y-4">
              <p className="text-[18px] font-black text-slate-300 uppercase tracking-widest border-l-4 border-step-scene/30 pl-4">{group.name}</p>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-[18px] font-bold text-white hover:bg-step-scene/20 hover:border-step-scene hover:text-indigo-200 transition-all active:scale-95 shadow-sm"
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
