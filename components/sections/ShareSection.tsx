
import React, { useState, useMemo } from 'react';
import { PromptState } from '../../types';
import { translatePromptState } from '../../utils/visualTranslators';

interface ShareSectionProps {
  config: PromptState;
  finalPrompt: string; 
  onUpdate: (newConfig: PromptState) => void;
}

const ShareSection: React.FC<ShareSectionProps> = ({ config, finalPrompt, onUpdate }) => {
  const [importText, setImportText] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [aiCopyFeedback, setAiCopyFeedback] = useState(false);
  const [promptCopyFeedback, setPromptCopyFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPromptSection, setShowPromptSection] = useState(false);

  // 技術參數 JSON（用於 UI 狀態還原）
  const technicalConfig = useMemo(() => {
    const filtered = JSON.parse(JSON.stringify(config));
    
    if (filtered.camera) {
      if (filtered.camera.roll !== 0) {
        filtered.camera.roll = `Camera roll: ${filtered.camera.roll} degrees, Dutch angle, canted perspective.`;
      }
    }

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
  }, [config]);

  // AI-Ready JSON（視覺描述，給 AI 模型使用）
  const aiReadyConfig = useMemo(() => {
    const translated = translatePromptState(config);
    
    return {
      theme: config.category,
      composition: translated.composition || 'standard framing',
      subject: translated.subject || 'main object',
      environment: translated.environment || 'neutral background',
      lighting: translated.lighting || 'natural lighting',
      mood: translated.mood || config.optics.mood,
      style: translated.style || config.style.postProcessing.join(', '),
      aspectRatio: config.camera.aspectRatio
    };
  }, [config]);

  const technicalJsonString = useMemo(() => JSON.stringify(technicalConfig, null, 2), [technicalConfig]);
  const aiReadyJsonString = useMemo(() => JSON.stringify(aiReadyConfig, null, 2), [aiReadyConfig]);

  const handleCopyTechnical = () => {
    navigator.clipboard.writeText(technicalJsonString);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleCopyAiReady = () => {
    navigator.clipboard.writeText(aiReadyJsonString);
    setAiCopyFeedback(true);
    setTimeout(() => setAiCopyFeedback(false), 2000);
  };

  const handlePromptCopy = () => {
    navigator.clipboard.writeText(finalPrompt);
    setPromptCopyFeedback(true);
    setTimeout(() => setPromptCopyFeedback(false), 2000);
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
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-gradient-to-br from-step-export-light to-step-export-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
              06
            </div>
            <div className="flex-1">
              <h3 className="text-[32px] font-black text-white leading-tight mb-3">
                協定導出
              </h3>
              <p className="text-[18px] text-slate-400 leading-relaxed">
                查看完整的提示詞，複製並用於任何 AI 圖像生成平台。
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-mono text-slate-500 uppercase">Buffer Ready</span>
        </div>
      </div>

      {/* PRIMARY: JSON Configuration Export/Import */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black text-white flex items-center gap-2">
            <span>⚙️</span> 設定檔管理 (Configuration Management)
          </h4>
          {!config.optics.useAdvancedLighting && (
            <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">LIGHTING DATA OMITTED</span>
          )}
        </div>
        
        <div className="space-y-8">
          {/* 技術參數 JSON */}
          <div className="space-y-4">
            <div className="flex justify-between items-end ml-1">
              <label className="text-[10px] uppercase font-black text-blue-400 tracking-widest">📐 技術參數 (Technical Config)</label>
              <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">UI STATE RESTORE</span>
            </div>
            <div className="relative bg-black/60 border-2 border-blue-500/30 rounded-3xl p-6 font-mono text-[11px] h-[350px] overflow-auto shadow-2xl custom-scrollbar leading-relaxed">
              <pre className="text-blue-300/80 whitespace-pre-wrap break-words">
                {technicalJsonString}
              </pre>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
              <div className="bg-blue-950/30 border border-blue-800/30 rounded-2xl p-4 flex items-center">
                <p className="text-[10px] text-blue-300/70 leading-relaxed">
                  <span className="font-black text-blue-400">用途：</span>儲存並重新載入 UI 狀態，包含所有滑桿位置、數值設定、角度參數等技術數據。
                </p>
              </div>
              <button
                onClick={handleCopyTechnical}
                className={`py-4 px-8 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 border-2 whitespace-nowrap ${
                  copyFeedback 
                  ? 'bg-green-600/20 border-green-500 text-green-400 scale-[0.98]' 
                  : 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500 hover:-translate-y-1 shadow-lg shadow-blue-500/20'
                }`}
              >
                <span className="text-xl">{copyFeedback ? '✓' : '📋'}</span>
                {copyFeedback ? '已複製！' : '複製'}
              </button>
            </div>
          </div>

          {/* AI-Ready 描述 */}
          <div className="space-y-4">
            <div className="flex justify-between items-end ml-1">
              <label className="text-[10px] uppercase font-black text-purple-400 tracking-widest">✨ AI 描述 (AI-Ready Config)</label>
              <span className="text-[9px] font-black text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">VISUAL TRANSLATION</span>
            </div>
            <div className="relative bg-black/60 border-2 border-purple-500/30 rounded-3xl p-6 font-mono text-[11px] h-[350px] overflow-auto shadow-2xl custom-scrollbar leading-relaxed">
              <pre className="text-purple-300/80 whitespace-pre-wrap break-words">
                {aiReadyJsonString}
              </pre>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
              <div className="bg-purple-950/30 border border-purple-800/30 rounded-2xl p-4 flex items-center">
                <p className="text-[10px] text-purple-300/70 leading-relaxed">
                  <span className="font-black text-purple-400">用途：</span>技術參數已轉換為視覺描述，可直接用於 AI 模型理解（如 API 整合、批次處理）。
                </p>
              </div>
              <button
                onClick={handleCopyAiReady}
                className={`py-4 px-8 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 border-2 whitespace-nowrap ${
                  aiCopyFeedback 
                  ? 'bg-green-600/20 border-green-500 text-green-400 scale-[0.98]' 
                  : 'bg-purple-600 border-purple-400 text-white hover:bg-purple-500 hover:-translate-y-1 shadow-lg shadow-purple-500/20'
                }`}
              >
                <span className="text-xl">{aiCopyFeedback ? '✓' : '🤖'}</span>
                {aiCopyFeedback ? '已複製！' : '複製'}
              </button>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">📥 匯入外部設定 (Import Config)</label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="在此貼上技術參數 JSON 以同步 UI 狀態..."
              className={`w-full bg-slate-950/80 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-3xl p-6 h-[200px] text-xs font-mono text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-700`}
            />
            {error && (
              <div className="bg-red-950/30 border border-red-800/30 rounded-2xl p-3">
                <p className="text-[10px] text-red-400 font-medium">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 flex items-center">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="font-black text-slate-300">說明：</span>貼上之前複製的「技術參數 JSON」，系統會自動還原所有 UI 控制項的狀態（僅支援技術參數格式）。
                </p>
              </div>
              <button
                disabled={!importText.trim()}
                onClick={handleImport}
                className="py-4 px-8 bg-slate-800 hover:bg-blue-600 border-2 border-slate-700 hover:border-blue-400 text-slate-400 hover:text-white rounded-2xl text-sm font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
              >
                ⚡ 同步設定
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY: Final Prompt (Collapsible) */}
      <div className="border-t border-slate-800 pt-10">
        <button
          onClick={() => setShowPromptSection(!showPromptSection)}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-orange-900/20 to-orange-800/20 hover:from-orange-900/30 hover:to-orange-800/30 border-2 border-orange-500/30 rounded-3xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="text-left">
              <h4 className="text-lg font-black text-orange-400 group-hover:text-orange-300 transition-colors">
                最終提示詞編輯器 (Final Prompt Editor)
              </h4>
              <p className="text-[10px] text-orange-500/70 mt-1">可直接編輯、大字體顯示、一鍵複製</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-orange-400 bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-500/30">推薦使用</span>
            <span className={`text-orange-500 transition-transform text-xl ${showPromptSection ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </button>

        {showPromptSection && (
          <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* 可編輯的 Prompt 區域 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase font-black text-orange-400 tracking-widest flex items-center gap-2">
                  <span>📝</span> 編輯提示詞
                </label>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">MIDJOURNEY</span>
                  <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">STABLE DIFFUSION</span>
                  <span className="text-[9px] font-black text-pink-400 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">DALL-E</span>
                  <span className="text-[9px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">GEMINI</span>
                </div>
              </div>
              
              <textarea
                value={finalPrompt}
                readOnly
                className="w-full bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-2 border-orange-500/30 rounded-3xl p-8 h-[400px] text-base text-slate-200 leading-relaxed font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none custom-scrollbar"
                placeholder="Configure your parameters to generate a prompt..."
              />
              
              <div className="bg-orange-950/20 border border-orange-800/30 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <h5 className="text-[12px] font-black text-orange-400 uppercase tracking-wider mb-2">
                      使用建議
                    </h5>
                    <ul className="space-y-2 text-[13px] text-orange-300/80 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5 font-black">1.</span>
                        <span>此提示詞由參數自動生成，已將技術設定轉換為 AI 可理解的視覺描述</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5 font-black">2.</span>
                        <span>可直接複製貼到 Midjourney、Stable Diffusion、DALL-E、Gemini 等平台</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5 font-black">3.</span>
                        <span>如需微調，建議複製後在外部編輯器（如 VS Code、Notion）中修改</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5 font-black">4.</span>
                        <span>若要重新生成，請返回前面的步驟調整參數</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 複製按鈕 */}
            <button
              onClick={handlePromptCopy}
              className={`w-full py-6 rounded-3xl text-lg font-black transition-all flex items-center justify-center gap-4 border-2 shadow-lg ${
                promptCopyFeedback 
                ? 'bg-green-600/30 border-green-500 text-green-400 scale-[0.98] shadow-green-500/20' 
                : 'bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400 text-white hover:from-orange-500 hover:to-orange-400 hover:-translate-y-1 shadow-orange-500/30'
              }`}
            >
              <span className="text-2xl">{promptCopyFeedback ? '✓' : '📋'}</span>
              {promptCopyFeedback ? '已複製到剪貼簿！' : '複製提示詞 (COPY PROMPT)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareSection;
