import React, { useMemo, useState } from 'react';
import { CameraConfig, PromptState } from '../../types';
import SidebarToggleButton from './SidebarToggleButton';
import { translatePromptState, generateStructuredBreakdown } from '../../utils/visualTranslators';
import { translateCategorizedParts } from '../../utils/chineseTranslations';

interface ProtocolDeckProps {
  promptParts: { label: string; text: string }[];
  finalPrompt: string;
  cameraConfig: CameraConfig;
  promptState: PromptState;
  isOpen: boolean;
  onToggle: () => void;
  onCopy: () => void;
  copyFeedback: boolean;
}

const ProtocolDeck: React.FC<ProtocolDeckProps> = ({
  promptParts,
  finalPrompt,
  cameraConfig,
  promptState,
  isOpen,
  onToggle,
  onCopy,
  copyFeedback
}) => {
  // 視圖模式切換：linear（線性）或 structured（結構化）
  const [viewMode, setViewMode] = useState<'linear' | 'structured'>('linear');
  
  // 生成結構化數據
  const structuredData = useMemo(() => {
    return generateStructuredBreakdown(promptState);
  }, [promptState]);
  // 將翻譯後的組件轉換為分類顯示（新的清晰結構）
  // 英文版本用於導出，中文版本用於 UI 顯示
  const categorizedParts = useMemo(() => {
    const translated = translatePromptState(promptState);
    
    const parts: { label: string; text: string; color: string }[] = [];
    
    // 主題（紫色 - 整體風格）
    if (promptState.category) {
      parts.push({ 
        label: 'THEME', 
        text: promptState.category,
        color: 'purple'
      });
    }
    
    // 攝影機設定 - 拆分為多個子區段
    if (translated.compositionDetailed) {
      const detailed = translated.compositionDetailed;
      
      // 1. 特殊 POV 模式（紫色 - 特殊拍攝方式）
      if (detailed.povMode) {
        parts.push({
          label: 'POV MODE',
          text: detailed.povMode,
          color: 'purple'
        });
      }
      
      // 2. 攝影機位置與角度（藍色 - 相機物理）
      parts.push({
        label: 'CAMERA POSITION',
        text: detailed.cameraPosition,
        color: 'blue'
      });
      
      // 3. 鏡頭光學特性（天藍色 - 鏡頭特性）
      parts.push({
        label: 'LENS OPTICS',
        text: detailed.lensOptics,
        color: 'sky'
      });
      
      // 4. 景別描述（靛藍色 - 取景尺度）
      parts.push({
        label: 'SHOT TYPE',
        text: detailed.shotType,
        color: 'indigo'
      });
      
      // 5. 景深效果（青色 - 光圈景深）
      if (detailed.depthOfField) {
        parts.push({
          label: 'DEPTH OF FIELD',
          text: detailed.depthOfField,
          color: 'cyan'
        });
      }
      
      // 6. 構圖規則（藍綠色 - 構圖法則）
      if (detailed.compositionRule) {
        parts.push({
          label: 'COMPOSITION RULE',
          text: detailed.compositionRule,
          color: 'teal'
        });
      }
    }
    
    // 主體細節 + 朝向（綠色 - 主體內容）
    if (translated.subject) {
      parts.push({ 
        label: 'SUBJECT DETAILS', 
        text: translated.subject,
        color: 'green'
      });
    }
    
    // 環境 + 背景顏色（翠綠色 - 場景空間）
    if (translated.environment) {
      parts.push({ 
        label: 'ENVIRONMENT', 
        text: translated.environment,
        color: 'emerald'
      });
    }
    
    // 燈光設定（黃色 - 光線照明）- 只在啟用進階燈光時顯示
    if (translated.lighting && promptState.optics.useAdvancedLighting) {
      // 如果有結構化燈光資訊，拆分顯示
      if (translated.lightingDetailed) {
        const ld = translated.lightingDetailed;
        
        // 1. Preset 名稱（如果有）- 只在 Perfect Match 時顯示
        if (ld.presetName) {
          parts.push({
            label: 'LIGHTING PRESET',
            text: ld.presetName,
            color: 'yellow'
          });
        }
        
        // 2. 幾何描述（如果有且不包含 Preset 名稱）
        if (ld.geometry && ld.presetName) {
          // 如果 geometry 包含 preset 名稱的關鍵字，就不顯示
          const presetKeywords = ld.presetName.toLowerCase().split(' ');
          const geometryLower = ld.geometry.toLowerCase();
          const containsPresetName = presetKeywords.some(keyword => 
            keyword.length > 3 && geometryLower.includes(keyword)
          );
          
          if (!containsPresetName) {
            parts.push({
              label: 'LIGHTING SETUP',
              text: ld.geometry,
              color: 'yellow'
            });
          }
        } else if (ld.geometry && !ld.presetName) {
          // 沒有 preset 名稱時，直接顯示幾何描述
          parts.push({
            label: 'LIGHTING SETUP',
            text: ld.geometry,
            color: 'yellow'
          });
        }
        
        // 3. Key Light
        if (ld.keyLight) {
          parts.push({
            label: 'KEY LIGHT',
            text: ld.keyLight,
            color: 'amber'
          });
        }
        
        // 4. Fill Light
        if (ld.fillLight) {
          parts.push({
            label: 'FILL LIGHT',
            text: ld.fillLight,
            color: 'amber'
          });
        }
        
        // 5. Rim Light
        if (ld.rimLight) {
          parts.push({
            label: 'RIM LIGHT',
            text: ld.rimLight,
            color: 'amber'
          });
        }
        
        // 6. Style（風格描述）- 只在有額外風格標籤時顯示
        if (ld.style && !ld.presetName) {
          parts.push({
            label: 'LIGHTING STYLE',
            text: ld.style,
            color: 'yellow'
          });
        }
      } else {
        // 沒有結構化資訊，使用原本的單一區塊
        parts.push({ 
          label: 'LIGHTING SETUP', 
          text: translated.lighting,
          color: 'yellow'
        });
      }
    }
    
    // 氛圍（粉色 - 情緒氣氛）
    if (translated.mood) {
      parts.push({ 
        label: 'MOOD', 
        text: translated.mood,
        color: 'pink'
      });
    }
    
    // 風格與後製（橙色 - 渲染風格）
    if (translated.style) {
      parts.push({ 
        label: 'RENDERING STYLE', 
        text: translated.style,
        color: 'orange'
      });
    }
    
    return parts;
  }, [promptState]);
  
  // 中文版本的 categorizedParts（僅用於 UI 顯示）
  const categorizedPartsZH = useMemo(() => {
    return translateCategorizedParts(categorizedParts);
  }, [categorizedParts]);
  // 顏色映射函數
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { label: string; text: string; line: string }> = {
      purple: {
        label: 'text-purple-400',
        text: 'text-purple-100',
        line: 'bg-purple-500/50'
      },
      blue: {
        label: 'text-blue-400',
        text: 'text-blue-100',
        line: 'bg-blue-500/50'
      },
      sky: {
        label: 'text-sky-400',
        text: 'text-sky-100',
        line: 'bg-sky-500/50'
      },
      indigo: {
        label: 'text-indigo-400',
        text: 'text-indigo-100',
        line: 'bg-indigo-500/50'
      },
      cyan: {
        label: 'text-cyan-400',
        text: 'text-cyan-100',
        line: 'bg-cyan-500/50'
      },
      teal: {
        label: 'text-teal-400',
        text: 'text-teal-100',
        line: 'bg-teal-500/50'
      },
      green: {
        label: 'text-green-400',
        text: 'text-green-100',
        line: 'bg-green-500/50'
      },
      emerald: {
        label: 'text-emerald-400',
        text: 'text-emerald-100',
        line: 'bg-emerald-500/50'
      },
      yellow: {
        label: 'text-yellow-400',
        text: 'text-yellow-100',
        line: 'bg-yellow-500/50'
      },
      amber: {
        label: 'text-amber-400',
        text: 'text-amber-100',
        line: 'bg-amber-500/50'
      },
      pink: {
        label: 'text-pink-400',
        text: 'text-pink-100',
        line: 'bg-pink-500/50'
      },
      orange: {
        label: 'text-orange-400',
        text: 'text-orange-100',
        line: 'bg-orange-500/50'
      }
    };
    return colorMap[color] || colorMap.blue;
  };
  
  return (
    <aside className={`
      w-full md:w-[500px] 
      bg-[#050914] 
      border-l border-slate-800 
      p-8 md:p-10 
      pb-32 sm:pb-36 md:pb-40 xl:pb-10
      flex flex-col gap-8 md:gap-10 
      shadow-inner 
      overflow-y-auto 
      custom-scrollbar
      transition-all duration-300 ease-in-out
      fixed xl:relative
      h-full
      right-0
      z-50
      ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="text-base md:text-lg font-bold text-blue-500 uppercase tracking-wide">
            Live Protocol Deck
          </h4>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-xs md:text-sm font-mono text-slate-500 uppercase tracking-wider font-bold">
              Linked
            </span>
          </div>
        </div>
        
        {/* 視圖模式切換按鈕 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('linear')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                viewMode === 'linear'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="線性視圖 - AI 可用格式"
            >
              線性
            </button>
            <button
              onClick={() => setViewMode('structured')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                viewMode === 'structured'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="結構化視圖 - 教學用途"
            >
              結構
            </button>
          </div>
          
          {/* 關閉按鈕 - 只在手機和平板模式下顯示 */}
          <button
            onClick={onToggle}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all"
            aria-label="關閉預覽面板"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-10">
        {/* 線性視圖 - AI 可用格式 */}
        {viewMode === 'linear' && (
          <div className="bg-[#0f172a] rounded-[3rem] p-10 border border-slate-800/60 shadow-3xl relative group overflow-hidden flex flex-col gap-8">
            {categorizedPartsZH.map((part, idx) => {
              const colors = getColorClasses(part.color);
              return (
                <div 
                  key={part.label} 
                  className="space-y-2 animate-in fade-in duration-500" 
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-px ${colors.line}`} />
                    <p className={`text-[11px] font-black ${colors.label} uppercase tracking-[0.3em]`}>
                      {part.label}
                    </p>
                  </div>
                  <p className={`text-2xl font-black ${colors.text} leading-relaxed tracking-tight selection:bg-orange-500 selection:text-white`}>
                    {part.text}
                  </p>
                </div>
              );
            })}
            <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-white/[0.01] pointer-events-none select-none italic">
              {/* Decorative background number */}
            </div>
          </div>
        )}

        {/* 結構化視圖 - 教學用途 */}
        {viewMode === 'structured' && (
          <div className="space-y-6">
            {/* README 說明 */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-5">
              <p className="text-[11px] text-purple-300 leading-relaxed">
                💡 {structuredData.readme}
              </p>
            </div>

            {/* 物理空間設定 */}
            <div className="bg-[#0f172a] rounded-[3rem] p-8 border border-slate-800/60 shadow-3xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📐</span>
                <div>
                  <h5 className="text-[14px] font-black text-orange-400 uppercase tracking-widest">
                    物理空間設定 (Spatial Geometry)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {structuredData.composition_breakdown.spatial_geometry.description}
                  </p>
                </div>
              </div>

              {/* 相機位置 */}
              <div className="space-y-3 pl-11">
                <p className="text-[12px] font-black text-blue-300 uppercase tracking-wider">
                  相機位置 (Camera Position)
                </p>
                {structuredData.composition_breakdown.spatial_geometry.camera_position.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-slate-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              {/* 主體取景 */}
              <div className="space-y-3 pl-11">
                <p className="text-[12px] font-black text-blue-300 uppercase tracking-wider">
                  主體取景 (Subject Framing)
                </p>
                {structuredData.composition_breakdown.spatial_geometry.subject_framing.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-slate-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 光學成像效果 */}
            <div className="bg-[#0f172a] rounded-[3rem] p-8 border border-slate-800/60 shadow-3xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔬</span>
                <div>
                  <h5 className="text-[14px] font-black text-purple-400 uppercase tracking-widest">
                    光學成像效果 (Optical Rendering)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {structuredData.composition_breakdown.optical_rendering.description}
                  </p>
                </div>
              </div>

              {/* 鏡頭透視 */}
              <div className="space-y-3 pl-11">
                <p className="text-[12px] font-black text-purple-300 uppercase tracking-wider">
                  鏡頭透視 (Lens Perspective)
                </p>
                {structuredData.composition_breakdown.optical_rendering.lens_perspective.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-slate-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              {/* 景深關係 */}
              {structuredData.composition_breakdown.optical_rendering.depth_of_field_relationship.length > 0 && (
                <div className="space-y-3 pl-11">
                  <p className="text-[12px] font-black text-purple-300 uppercase tracking-wider">
                    景深關係 (Depth of Field)
                  </p>
                  {structuredData.composition_breakdown.optical_rendering.depth_of_field_relationship.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-[13px] text-slate-200 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 最終提示詞 */}
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-px bg-green-500/50" />
                <p className="text-[11px] font-black text-green-400 uppercase tracking-[0.3em]">
                  最終提示詞 (Final Prompt for AI)
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {structuredData.final_prompt}
              </p>
            </div>
          </div>
        )}

        <div className="bg-slate-900/30 p-6 md:p-8 rounded-2xl border border-slate-800/50 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-wide">
                Core Metadata
              </span>
              <p className="text-[11px] text-slate-400">
                點擊「Copy String」導出英文版 Prompt
              </p>
            </div>
            <button 
              onClick={onCopy}
              className="text-sm font-bold text-blue-500 hover:text-white uppercase transition-colors px-4 py-2 bg-blue-500/5 rounded-lg border border-blue-500/20 hover:bg-blue-600 hover:border-blue-400"
            >
              {copyFeedback ? 'Copied ✓' : 'Copy String'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-1">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                Aspect
              </p>
              <p className="text-sm font-bold text-blue-400 font-mono">
                {cameraConfig.aspectRatio}
              </p>
            </div>
            <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-1">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                Lens
              </p>
              <p className="text-sm font-bold text-blue-400 font-mono">
                {cameraConfig.lens.split(' ')[0]}
              </p>
            </div>
            <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-1">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                Aperture
              </p>
              <p className="text-sm font-bold text-yellow-400 font-mono">
                {promptState.optics.dof}
              </p>
            </div>
            <div className="p-4 bg-black/60 rounded-xl border border-white/5 space-y-1">
              <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                Roll
              </p>
              <p className={`text-sm font-bold font-mono ${cameraConfig.roll !== 0 ? 'text-orange-400' : 'text-blue-400'}`}>
                {cameraConfig.roll}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProtocolDeck;
