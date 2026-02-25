
import React, { useRef, useState } from 'react';
import { SUBJECT_ORIENTATIONS, SUBJECT_TAGS } from '../../constants';

interface SubjectSectionProps {
  state: any;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (updater: any) => void;
  cameraConfig?: any; // 新增：用於顯示大遠景警告
}

const SubjectSection: React.FC<SubjectSectionProps> = ({ state, customTags, setCustomTags, onChange, cameraConfig }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newTag, setNewTag] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['產品物件', '人物年齡'])); // 預設展開前兩個

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const handleTagClick = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentText = state.description || '';
    const cursorPosition = textarea.selectionStart || 0;
    
    // 如果文字為空，直接插入標籤
    if (currentText.length === 0) {
      onChange({ ...state, description: `${tag} ` });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(tag.length + 1, tag.length + 1);
      }, 0);
      return;
    }
    
    // 在游標位置插入標籤
    const beforeCursor = currentText.slice(0, cursorPosition);
    const afterCursor = currentText.slice(cursorPosition);
    
    // 判斷是否需要在前面加逗號和空格
    const needsCommaPrefix = beforeCursor.length > 0 && !beforeCursor.endsWith(', ') && !beforeCursor.endsWith(' ');
    const prefix = needsCommaPrefix ? ', ' : '';
    
    // 判斷是否需要在後面加逗號和空格
    const needsCommaSuffix = afterCursor.length > 0 && !afterCursor.startsWith(', ') && !afterCursor.startsWith(' ');
    const suffix = needsCommaSuffix ? ', ' : ' ';
    
    const newText = `${beforeCursor}${prefix}${tag}${suffix}${afterCursor}`;
    const newCursorPosition = cursorPosition + prefix.length + tag.length + suffix.length;
    
    onChange({ ...state, description: newText });
    
    // 設定新的游標位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
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
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-step-subject-light to-step-subject-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
          01
        </div>
        <div className="flex-1">
          <h3 className="text-[32px] font-black text-white leading-tight mb-3">
            定義主體物件
          </h3>
          <p className="text-[18px] text-slate-400 leading-relaxed">
            描述你要拍攝的主體，包含物件類別、特徵和觀看角度。
          </p>
        </div>
      </div>
      
      <div className="space-y-12">
        {/* 只保留「物件類別」 */}
        <div className="space-y-4">
          <label className="text-[16px] uppercase font-black text-white tracking-[0.15em] ml-2">物件類別</label>
          <input 
            type="text"
            value={state.type}
            onChange={(e) => onChange({ ...state, type: e.target.value })}
            placeholder="例如：時尚模特兒、和牛牛排、手錶..."
            className="w-full bg-slate-950 border border-white rounded-xl p-4 text-xl font-bold text-white focus:ring-2 focus:ring-step-subject/50 focus:border-step-subject outline-none transition-all hover:border-step-subject/30 placeholder-slate-400 shadow-inner"
          />
        </div>

        {/* 主體描述 - 可調整高度的 textarea */}
        <div className="space-y-4">
          <label className="text-[16px] uppercase font-black text-white tracking-[0.15em] ml-2">主體描述</label>
          
          {/* 大遠景寫實模式警告 */}
          {cameraConfig && 
           (cameraConfig.shotType === '大遠景' || cameraConfig.shotType === '極遠景') && 
           (cameraConfig.scaleMode === 'realistic' || !cameraConfig.scaleMode) && (
            <div className="mb-4 p-4 bg-blue-500/15 border-2 border-blue-400/50 rounded-xl shadow-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-[14px] font-black text-blue-300 mb-2 uppercase tracking-wide">
                    寫實大遠景模式
                  </p>
                  <p className="text-[13px] text-slate-300 leading-relaxed">
                    主體會在畫面中顯得很小，細節描述（如文字、紋理）可能不會被 AI 呈現。
                    建議簡化主體描述，專注於「形狀」和「顏色」。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 攝影角度可見性提示 */}
          {cameraConfig && (
            <>
              {/* 背面視角提示 */}
              {(cameraConfig.cameraAzimuth >= 135 && cameraConfig.cameraAzimuth <= 225) && (
                <div className="mb-4 p-3 bg-orange-500/15 border-2 border-orange-400/50 rounded-xl">
                  <p className="text-[13px] font-black text-orange-300 mb-1 uppercase tracking-wide">背面視角</p>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    攝影機在主體背後，正面細節（表情、胸前文字、正面圖案）將不可見。建議描述背部特徵。
                  </p>
                </div>
              )}

              {/* 鳥瞰視角提示 */}
              {cameraConfig.cameraElevation >= 60 && (
                <div className="mb-4 p-3 bg-purple-500/15 border-2 border-purple-400/50 rounded-xl">
                  <p className="text-[13px] font-black text-purple-300 mb-1 uppercase tracking-wide">鳥瞰視角</p>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    從上往下拍攝，側面和底部細節較不明顯。建議描述頂部特徵（頭頂、肩膀、物體上表面）。
                  </p>
                </div>
              )}

              {/* 蟲視視角提示 */}
              {cameraConfig.cameraElevation <= -60 && (
                <div className="mb-4 p-3 bg-green-500/15 border-2 border-green-400/50 rounded-xl">
                  <p className="text-[13px] font-black text-green-300 mb-1 uppercase tracking-wide">蟲視視角</p>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    從下往上拍攝，頂部細節較不明顯。建議描述底部特徵（下巴、鞋底、物體底座）。
                  </p>
                </div>
              )}
            </>
          )}
          
          <textarea
            ref={textareaRef}
            value={state.description}
            onChange={(e) => onChange({ ...state, description: e.target.value })}
            placeholder="例如：強烈眼神、融化質感、錶盤細節、絲綢質地、金屬光澤、木紋紋理..."
            className="w-full bg-slate-950 border border-white rounded-xl p-4 min-h-[200px] text-xl font-medium text-slate-200 focus:ring-2 focus:ring-step-subject/50 focus:border-step-subject outline-none transition-all placeholder-slate-400 leading-relaxed shadow-inner hover:border-step-subject/30 resize-y"
          />
        </div>

        {/* 特徵庫 */}
        <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-4">
             <span className="w-12 h-px bg-step-subject/30" />
             <label className="text-[18px] uppercase font-black text-slate-300 tracking-widest">特徵庫</label>
          </div>

          <form onSubmit={handleAddCustomTag} className="flex gap-3">
             <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="新增自定義標籤..."
              className="flex-1 bg-slate-950 border border-white rounded-lg px-4 py-2 text-[18px] font-bold text-white focus:ring-1 focus:ring-step-subject outline-none"
             />
             <button type="submit" className="px-5 py-2 bg-step-subject hover:bg-step-subject-light text-white rounded-lg text-[18px] font-black uppercase tracking-widest transition-all">＋ 新增</button>
          </form>

          {customTags.length > 0 && (
            <div className="space-y-4">
              <p className="text-[18px] font-black text-step-subject-light uppercase tracking-widest border-l-4 border-step-subject/30 pl-4">我的專屬標籤</p>
              <div className="flex flex-wrap gap-2">
                {customTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-5 py-2.5 bg-slate-800 border border-step-subject/20 rounded-lg text-[18px] font-bold text-white hover:bg-step-subject/20 hover:border-step-subject transition-all flex items-center gap-3 group"
                  >
                    + {tag}
                    <span onClick={(e) => removeCustomTag(tag, e)} className="opacity-0 group-hover:opacity-100 text-step-subject hover:text-white transition-opacity">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 新增「旋轉主體」區塊 */}
          <div className="space-y-3">
            <button
              onClick={() => toggleGroup('旋轉主體')}
              className="w-full flex items-center justify-between text-[18px] font-black text-slate-300 uppercase tracking-widest border-l-4 border-step-subject/30 pl-4 hover:text-white hover:border-step-subject/50 transition-all"
            >
              <span>旋轉主體</span>
              <span className="text-[20px] text-step-subject">{expandedGroups.has('旋轉主體') ? '−' : '+'}</span>
            </button>
            {expandedGroups.has('旋轉主體') && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {SUBJECT_ORIENTATIONS.map(orientation => (
                  <button
                    key={orientation}
                    onClick={() => handleTagClick(`主體${orientation}向攝影機`)}
                    className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-[18px] font-bold text-white hover:bg-step-subject/20 hover:border-step-subject hover:text-emerald-200 transition-all active:scale-95 shadow-sm"
                  >
                    + {orientation}
                  </button>
                ))}
              </div>
            )}
          </div>

          {SUBJECT_TAGS.map(group => (
            <div key={group.name} className="space-y-3">
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between text-[18px] font-black text-slate-300 uppercase tracking-widest border-l-4 border-step-subject/30 pl-4 hover:text-white hover:border-step-subject/50 transition-all"
              >
                <span>{group.name}</span>
                <span className="text-[20px] text-step-subject">{expandedGroups.has(group.name) ? '−' : '+'}</span>
              </button>
              {expandedGroups.has(group.name) && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {group.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-[18px] font-bold text-white hover:bg-step-subject/20 hover:border-step-subject hover:text-emerald-200 transition-all active:scale-95 shadow-sm"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSection;
