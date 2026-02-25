import React, { useState } from 'react';
import { LightSource } from '../../types';
import { LIGHT_QUALITY_PRESETS } from '../../constants';

interface LightSourcePanelProps {
  lightSource: LightSource;
  label: string;
  description?: string;
  disabled?: boolean;
  elevationOnly?: boolean; // 用於 Rim Light
  onChange: (lightSource: LightSource) => void;
}

/**
 * LightSourcePanel - 單個光源的控制面板
 * 只包含：顏色選擇器 + 強度滑桿
 * 方位角和仰角控制已移至視覺化器中
 */
const LightSourcePanel: React.FC<LightSourcePanelProps> = ({
  lightSource,
  label,
  description,
  disabled = false,
  elevationOnly = false,
  onChange
}) => {
  
  const handleColorChange = (color: string) => {
    onChange({ ...lightSource, color });
  };
  
  const handleIntensityChange = (intensity: number) => {
    onChange({ ...lightSource, intensity });
  };
  
  const handleStyleDescriptionChange = (styleDescription: string) => {
    onChange({ ...lightSource, styleDescription });
  };
  
  const [showPresets, setShowPresets] = useState(false);
  
  // 根據光源類型選擇顏色主題
  const getColorTheme = () => {
    switch (label.toLowerCase()) {
      case 'key':
        return {
          accent: 'blue',
          accentClass: 'text-blue-400',
          sliderClass: 'accent-blue-500'
        };
      case 'fill':
        return {
          accent: 'indigo',
          accentClass: 'text-indigo-400',
          sliderClass: 'accent-indigo-500'
        };
      case 'rim':
        return {
          accent: 'yellow',
          accentClass: 'text-yellow-400',
          sliderClass: 'accent-yellow-500'
        };
      default:
        return {
          accent: 'slate',
          accentClass: 'text-slate-400',
          sliderClass: 'accent-slate-500'
        };
    }
  };
  
  const theme = getColorTheme();
  
  return (
    <div className={`space-y-8 animate-in fade-in duration-500 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* 顏色和強度控制 */}
      <div className="space-y-6">
        {/* 顏色選擇器 */}
        <div className="flex items-center gap-8">
          <div className="relative">
            <input 
              type="color" 
              value={lightSource.color} 
              onChange={(e) => handleColorChange(e.target.value)}
              disabled={disabled}
              className="w-24 h-24 rounded-xl bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black font-mono text-white tracking-tighter uppercase">
              {lightSource.color}
            </span>
            <span className="text-[16px] text-slate-400 font-black uppercase tracking-wide mt-1">
              {label}光色調
            </span>
          </div>
        </div>
        
        {/* 強度滑桿 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[16px] font-black text-white uppercase">
              {label}光強度
            </label>
            <span className={`text-lg font-black ${theme.accentClass} font-mono`}>
              {lightSource.intensity}%
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={lightSource.intensity} 
            onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
            disabled={disabled}
            className={`w-full h-2.5 bg-slate-800 rounded-lg appearance-none ${theme.sliderClass} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
        
        {/* 描述文字 */}
        {description && (
          <p className="text-[16px] text-slate-400 font-bold uppercase text-center">
            {description}
          </p>
        )}
      </div>
      
      {/* 光質描述區塊 */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <label className="text-[16px] font-black text-white uppercase">
            光質描述
          </label>
          <button
            onClick={() => setShowPresets(!showPresets)}
            disabled={disabled}
            className={`text-[11px] font-black uppercase tracking-wide px-3 py-1 rounded-lg transition-colors ${
              showPresets 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {showPresets ? '隱藏預設' : '顯示預設'}
          </button>
        </div>
        
        {/* Presets 選項 */}
        {showPresets && (
          <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-300">
            {LIGHT_QUALITY_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleStyleDescriptionChange(preset.description)}
                disabled={disabled}
                className="text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-[12px] font-black text-white uppercase mb-1">
                  {preset.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-relaxed">
                  {preset.description.substring(0, 40)}...
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* 可編輯的 Textarea */}
        <textarea
          value={lightSource.styleDescription || ''}
          onChange={(e) => handleStyleDescriptionChange(e.target.value)}
          disabled={disabled}
          placeholder="描述這個光源的表現特質（如：強烈飽和、柔和擴散等）"
          className="w-full h-24 p-4 bg-slate-900 border-2 border-slate-800 rounded-lg text-[13px] text-slate-300 placeholder-slate-600 focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <p className="text-[11px] text-slate-500 leading-relaxed">
          此描述會加入 Prompt 中，用於強化光源的色彩飽和度與視覺表現
        </p>
      </div>
    </div>
  );
};

export default LightSourcePanel;
