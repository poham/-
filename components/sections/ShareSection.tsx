
import React, { useState, useMemo } from 'react';
import { PromptState } from '../../types';

interface ShareSectionProps {
  config: PromptState;
  finalPrompt: string; 
  onUpdate: (newConfig: PromptState) => void;
}

const ShareSection: React.FC<ShareSectionProps> = ({ config, finalPrompt, onUpdate }) => {
  const [importText, setImportText] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 數據淨化邏輯
  const sanitizedConfig = useMemo(() => {
    // 建立一個深拷貝來避免污染主狀態
    const filtered = JSON.parse(JSON.stringify(config));
    
    // 1. 移除視覺輔助參數 (visualYOffset)，這不需要出現在輸出的 JSON 中
    if (filtered.camera) {
      delete filtered.camera.visualYOffset;
      
      // 2. 格式化 Roll 為術語描述字串 (若為 0 則保持原樣數字，若非 0 則轉為完整術語)
      if (filtered.camera.roll !== 0) {
        filtered.camera.roll = `Camera roll: ${filtered.camera.roll} degrees, Dutch angle, canted perspective.`;
      }
    }

    // 3. 處理進階佈光切換
    if (!config.optics.useAdvancedLighting) {
      filtered.optics = {
        ...filtered.optics,
        lightColor: "",
        lightIntensity: 0,
        lightRotation: 0,
        studioSetup: "none",
        fillLightColor: "",
        fillLightIntensity: 0,
        rimLightColor: "",
        rimLightIntensity: 0,
        source: ""
      };
    }
    
    return filtered;
  }, [config, finalPrompt]);

  const jsonString = useMemo(() => JSON.stringify(sanitizedConfig, null, 2), [sanitizedConfig]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.category && parsed.camera && parsed.subject) {
        // 如果匯入的 roll 是字串（格式化後的樣子），提取數字以還原 UI 狀態
        if (typeof parsed.camera.roll === 'string') {
          const match = parsed.camera.roll.match(/roll: (-?\d+) degrees/);
          if (match) {
            parsed.camera.roll = parseInt(match[1]);
          } else {
            parsed.camera.roll = 0;
          }
        }
        
        // 確保視覺位移有預設值
        if (parsed.camera.visualYOffset === undefined) {
          parsed.camera.visualYOffset = 0;
        }

        onUpdate(parsed as PromptState);
        setImportText('');
        setError(null);
        alert('⚡ 設定已成功同步！');
      } else {
        setError('結構不符：缺少關鍵攝影參數。');
      }
    } catch (e) {
      setError('無效的 JSON：請檢查語法錯誤。');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="p-2 bg-blue-600/20 rounded-xl text-blue-500">⚡</span> 
            STEP 07. 匯出與生成
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-tighter">Protocol Export // Multi-dimensional Data</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-mono text-slate-500 uppercase">Buffer Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex justify-between items-end ml-1">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">目前的結構化資料 (Filtered Output)</label>
            {!config.optics.useAdvancedLighting && (
              <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">LIGHTING DATA OMITTED</span>
            )}
          </div>
          <div className="relative bg-black/60 border border-slate-800 rounded-3xl p-6 font-mono text-[11px] h-[350px] overflow-auto shadow-2xl custom-scrollbar leading-relaxed">
            <pre className="text-blue-300/80">
              {jsonString}
            </pre>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full py-6 rounded-3xl text-sm font-black transition-all flex items-center justify-center gap-4 border-2 ${
              copyFeedback 
              ? 'bg-green-600/20 border-green-500 text-green-400 scale-[0.98]' 
              : 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500 hover:-translate-y-1'
            }`}
          >
            <span className="text-xl">{copyFeedback ? '✓' : '📥'}</span>
            複製匯出設定 (COPY JSON)
          </button>
        </div>

        <div className="space-y-6">
          <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">貼上外部協定 (Sync)</label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="在此貼上外部 JSON 資料以同步參數..."
            className={`w-full bg-slate-950/80 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-3xl p-6 h-[350px] text-xs font-mono text-slate-300 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-800`}
          />
          <button
            disabled={!importText.trim()}
            onClick={handleImport}
            className="w-full py-6 bg-slate-800 hover:bg-purple-600 border-2 border-slate-700 hover:border-purple-400 text-slate-400 hover:text-white rounded-3xl text-sm font-black transition-all disabled:opacity-30"
          >
            ⚡ 同步外部設定 (PASTE & SYNC)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
