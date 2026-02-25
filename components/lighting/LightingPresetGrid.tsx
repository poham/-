import React from 'react';
import { STUDIO_SETUPS } from '../../constants';
import LightingPresetIcon from './LightingPresetIcon';
import { generateLightingPrompt } from '../../utils/lightingPromptGenerator';
import { LightSource } from '../../types';

interface LightingPresetGridProps {
  currentSetup: string;
  disabled?: boolean;
  currentKeyLight?: LightSource;
  currentFillLight?: LightSource;
  currentRimLight?: LightSource;
  onSetupSelect: (setupId: string, setup: typeof STUDIO_SETUPS[0]) => void;
}

/**
 * LightingPresetGrid - 燈光預設選擇網格（簡化版）
 * 分為兩個區塊：攝影棚佈光 + 混合模式
 */
const LightingPresetGrid: React.FC<LightingPresetGridProps> = ({
  currentSetup,
  disabled = false,
  currentKeyLight,
  currentFillLight,
  currentRimLight,
  onSetupSelect
}) => {
  
  const handleSetupClick = (setup: typeof STUDIO_SETUPS[0]) => {
    if (disabled) return;
    onSetupSelect(setup.id, setup);
  };
  
  // 判斷當前燈光狀態
  const getLightingStatus = (setup: typeof STUDIO_SETUPS[0]) => {
    if (currentSetup !== setup.id) return 'inactive';
    if (!currentKeyLight) return 'active';
    
    const result = generateLightingPrompt(
      currentKeyLight,
      currentFillLight || setup.fillLight,
      currentRimLight || setup.rimLight,
      setup.id,
      false
    );
    
    if (result.mode === 'perfect_match') return 'perfect';
    if (result.mode === 'style_inheritance') return 'modified';
    return 'active';
  };
  
  // 分類預設
  const studioSetups = STUDIO_SETUPS.filter(s => s.scenario === 'studio');
  const hybridSetups = STUDIO_SETUPS.filter(s => s.scenario === 'hybrid');
  const outdoorSetups = STUDIO_SETUPS.filter(s => s.scenario === 'outdoor_fill');
  
  // 渲染預設卡片
  const renderPresetCard = (setup: typeof STUDIO_SETUPS[0]) => {
    const status = getLightingStatus(setup);
    const isActive = currentSetup === setup.id;
    
    return (
      <button
        key={setup.id}
        onClick={() => handleSetupClick(setup)}
        className={`group relative rounded-xl border transition-all hover:scale-[1.02] overflow-hidden ${
          isActive
            ? 'bg-step-light border-step-light-light shadow-lg' 
            : 'bg-slate-900/50 border-slate-800 hover:border-step-light/50'
        }`}
        title={setup.desc} // Hover 顯示說明
      >
        {/* 燈光圖示（放大，移除 padding） */}
        <div className="w-full aspect-square bg-slate-950/50">
          <LightingPresetIcon
            setupId={setup.id}
            keyLight={setup.keyLight}
            fillLight={setup.fillLight}
            rimLight={setup.rimLight}
          />
        </div>
        
        {/* 名稱（簡化，移除英文，減少 padding） */}
        <div className="px-2 py-2 text-center">
          <p className={`text-[14px] font-black leading-tight transition-colors ${
            isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
          }`}>
            {setup.name.split(' ')[0]} {/* 只取中文部分 */}
          </p>
        </div>
        
        {/* 狀態指示器（簡化，小圓點） */}
        {isActive && status === 'perfect' && (
          <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full shadow-lg" />
        )}
        {isActive && status === 'modified' && (
          <div className="absolute top-2 left-2 w-2 h-2 bg-orange-400 rounded-full shadow-lg" />
        )}
      </button>
    );
  };
  
  return (
    <div className={`space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* 攝影棚佈光區塊 */}
      <div className="space-y-3">
        <h4 className="text-[16px] font-black text-slate-300 uppercase tracking-wide">
          攝影棚佈光 <span className="text-[16px] text-slate-300 font-bold normal-case tracking-normal">— 適合室內、可控光源環境</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3">
          {studioSetups.map(renderPresetCard)}
        </div>
      </div>
      
      {/* 戶外補光區塊 */}
      {outdoorSetups.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[16px] font-black text-slate-300 uppercase tracking-wide">
            戶外補光 <span className="text-[16px] text-slate-300 font-bold normal-case tracking-normal">— 配合自然光使用，加強主體光影</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3">
            {outdoorSetups.map(renderPresetCard)}
          </div>
        </div>
      )}
      
      {/* 混合模式區塊 */}
      {hybridSetups.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[16px] font-black text-slate-300 uppercase tracking-wide">
            混合模式 <span className="text-[16px] text-slate-300 font-bold normal-case tracking-normal">— 攝影棚或戶外都可使用</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3">
            {hybridSetups.map(renderPresetCard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LightingPresetGrid;
