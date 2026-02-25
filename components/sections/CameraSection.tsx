
import React, { useState, useEffect } from 'react';
import { SHOT_TYPES, PORTRAIT_SHOT_TYPES, PRODUCT_SHOT_TYPES, CAMERA_ANGLE_PRESETS, ASPECT_RATIOS, POV_MODES } from '../../constants';
import { CameraConfig, OpticsConfig, ShotTypeOption } from '../../types';
import CompositionGrid from '../visuals/CompositionGrid';
import LensFOV from '../visuals/LensFOV';
import DOFVisualizer from '../visuals/DOFVisualizer';
import FramingVisualizer from '../visuals/FramingVisualizer';
import Camera3DGizmo from '../visuals/Camera3DGizmo';
import { getCameraAngleDescription, getCameraAngleHint, getCameraAngleColor } from '../../utils/cameraAngleDescriptions';

interface CameraSectionProps {
  config: CameraConfig;
  opticsConfig: OpticsConfig;
  customTags: string[];
  setCustomTags: (tags: string[]) => void;
  onChange: (config: CameraConfig) => void;
  onOpticsChange: (config: OpticsConfig) => void;
}

const CameraSection: React.FC<CameraSectionProps> = ({ config, opticsConfig, customTags, setCustomTags, onChange, onOpticsChange }) => {
  const apertures = ['f/1.2', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22'];
  const [newTag, setNewTag] = useState('');

  // 初始化數值控制（如果不存在）
  const cameraAzimuth = config.cameraAzimuth ?? 0;
  const cameraElevation = config.cameraElevation ?? 0;

  // 根據 framingMode 決定使用哪組 shot types
  const isProductMode = config.framingMode === 'product';
  const isPortraitMode = config.framingMode === 'portrait';
  
  // 取得當前可用的 shot types（用於 UI 顯示）
  const getAvailableShotTypes = (): string[] => {
    if (isProductMode) {
      return PRODUCT_SHOT_TYPES.map(opt => opt.label);
    } else if (isPortraitMode) {
      return PORTRAIT_SHOT_TYPES;
    } else {
      // auto 模式：預設使用人像景別
      return PORTRAIT_SHOT_TYPES;
    }
  };

  // 從 label 取得實際的 value（用於儲存到 state）
  const getLabelFromValue = (value: string): string => {
    if (isProductMode) {
      const option = PRODUCT_SHOT_TYPES.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  // 從 value 取得 label（用於 UI 顯示）
  const getValueFromLabel = (label: string): string => {
    if (isProductMode) {
      const option = PRODUCT_SHOT_TYPES.find(opt => opt.label === label);
      return option ? option.value : label;
    }
    return label;
  };

  // 取得當前顯示的 label（從 state 的 value 轉換）
  const getCurrentLabel = (): string => {
    return getLabelFromValue(config.shotType);
  };

  // 當 framingMode 改變時，檢查當前 shotType 是否在新模式的列表中
  useEffect(() => {
    const availableTypes = getAvailableShotTypes();
    const currentLabel = getCurrentLabel();
    
    // 如果當前 label 不在可用列表中，重置為預設選項
    if (!availableTypes.includes(currentLabel)) {
      const defaultLabel = availableTypes[2] || availableTypes[0]; // 預設選擇第三個
      const defaultValue = getValueFromLabel(defaultLabel);
      onChange({ ...config, shotType: defaultValue });
    }
  }, [config.framingMode]);

  // 當數值改變時，自動更新角度描述
  useEffect(() => {
    const azimuth = config.cameraAzimuth ?? 0;
    const elevation = config.cameraElevation ?? 0;
    const description = getCameraAngleDescription(azimuth, elevation);
    
    if (description !== config.angle) {
      onChange({ ...config, angle: description });
    }
  }, [config.cameraAzimuth, config.cameraElevation]);

  const handleChange = (field: keyof CameraConfig | string, value: any) => {
    if (['rule', 'focal_point', 'alignment', 'elementPlacements'].includes(field)) {
      onChange({
        ...config,
        composition: { ...config.composition, [field]: value }
      });
    } else {
      onChange({ ...config, [field]: value });
    }
  };

  const handleAzimuthChange = (value: number) => {
    onChange({ ...config, cameraAzimuth: value });
  };

  const handleElevationChange = (value: number) => {
    onChange({ ...config, cameraElevation: value });
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

  const angleColor = getCameraAngleColor(cameraElevation);
  const angleHint = getCameraAngleHint(cameraElevation);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-step-camera-light to-step-camera-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
          03
        </div>
        <div className="flex-1">
          <h3 className="text-[32px] font-black text-white leading-tight mb-3">
            攝影設定
          </h3>
          <p className="text-[18px] text-slate-400 leading-relaxed">
            配置相機參數，包含畫面比例、取景尺度、拍攝角度、鏡頭焦距和景深效果。
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {/* 左欄：主要設定 */}
        <div className="space-y-6">
          {/* 1. Aspect Ratio - 最上面 */}
          <div className="space-y-4">
            <label className="text-[18px] uppercase font-black text-white tracking-[0.15em] ml-2">畫面寬高比</label>
            <div className="grid grid-cols-5 gap-2">
              {ASPECT_RATIOS.map(r => (
                <button
                  key={r}
                  onClick={() => handleChange('aspectRatio', r)}
                  className={`py-2.5 text-[18px] font-black rounded-xl border transition-all ${
                    config.aspectRatio === r 
                    ? 'bg-step-camera border-step-camera-light text-white shadow-xl scale-105' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 萬用構圖工具 - 第二位 */}
          <CompositionGrid 
            aspectRatio={config.aspectRatio} 
            alignment={config.composition.alignment}
            elementPlacements={config.composition.elementPlacements}
            onAlignmentChange={(val) => handleChange('alignment', val)}
            onElementPlacementsChange={(val) => handleChange('elementPlacements', val)}
          />

          {/* 3. 取景模式切換 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[18px] uppercase font-black text-white tracking-[0.15em] ml-2">取景模式</label>
              
              {/* 取景模式切換 */}
              <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleChange('framingMode', 'auto')}
                  className={`px-4 py-2 text-[18px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    (config.framingMode === 'auto' || !config.framingMode)
                      ? 'bg-step-camera text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  自動
                </button>
                <button
                  onClick={() => handleChange('framingMode', 'product')}
                  className={`px-4 py-2 text-[18px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    config.framingMode === 'product'
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  商品
                </button>
                <button
                  onClick={() => handleChange('framingMode', 'portrait')}
                  className={`px-4 py-2 text-[18px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    config.framingMode === 'portrait'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  人像
                </button>
              </div>
            </div>
            
            {/* 模式說明提示 */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <p className="text-[18px] text-slate-300 leading-relaxed">
                {(config.framingMode === 'auto' || !config.framingMode) && (
                  <span><span className="text-step-camera-light font-bold">自動模式</span>：根據主體類型自動選擇描述方式（商品使用視角描述，人像使用身體部位描述）</span>
                )}
                {config.framingMode === 'product' && (
                  <span><span className="text-orange-400 font-bold">商品模式</span>：使用商業攝影術語（如「俯視角度」、「3/4 視角」等）描述產品呈現方式</span>
                )}
                {config.framingMode === 'portrait' && (
                  <span><span className="text-purple-400 font-bold">人像模式</span>：使用身體部位描述（如「腰部以上」、「頭肩特寫」等）說明取景範圍</span>
                )}
              </p>
            </div>
          </div>

          {/* 4. 即時觀景模擬（整合取景尺度和滾轉控制） */}
          <FramingVisualizer 
            shotType={getCurrentLabel()} 
            aspectRatio={config.aspectRatio} 
            roll={config.roll}
            onShotTypeChange={(label) => {
              const value = getValueFromLabel(label);
              handleChange('shotType', value);
            }}
            onRollChange={(val) => handleChange('roll', val)}
            availableShotTypes={getAvailableShotTypes()}
          />

          {/* 4.5. 尺度模式選擇器（大遠景專用） */}
          {(getCurrentLabel().includes('大遠景') || getCurrentLabel().includes('極遠景') || getCurrentLabel().includes('Extreme Long Shot')) && (
            <div className="mt-4 p-6 bg-step-camera/15 border-2 border-step-camera-light/50 rounded-2xl shadow-xl">
              <div className="mb-5">
                <p className="text-[18px] font-black text-step-camera-light mb-2 uppercase tracking-wide">
                  大遠景模式：請選擇尺度邏輯
                </p>
                <p className="text-[18px] text-slate-300 leading-relaxed">
                  大遠景會改變主體在畫面中的比例，請選擇你想要的效果
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChange('scaleMode', 'realistic')}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    config.scaleMode === 'realistic' || !config.scaleMode
                      ? 'bg-blue-500/25 border-blue-400 shadow-xl scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-700 hover:border-slate-600 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="text-[18px] font-black text-white mb-3">
                    寫實比例
                  </div>
                  <div className="text-[18px] text-slate-300 leading-relaxed mb-2">
                    主體變小，環境遼闊
                  </div>
                  <div className="text-[18px] text-blue-300 font-bold">
                    適合：極簡、孤獨感、空間感
                  </div>
                </button>
                
                <button
                  onClick={() => handleChange('scaleMode', 'surreal')}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    config.scaleMode === 'surreal'
                      ? 'bg-purple-500/25 border-purple-400 shadow-xl scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-700 hover:border-slate-600 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="text-[18px] font-black text-white mb-3">
                    巨物模式
                  </div>
                  <div className="text-[18px] text-slate-300 leading-relaxed mb-2">
                    主體巨大化，超現實
                  </div>
                  <div className="text-[18px] text-purple-300 font-bold">
                    適合：震撼、戲劇性、概念藝術
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 5. 拍攝角度與高度 */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[18px] uppercase font-black text-white tracking-[0.15em] ml-2">拍攝角度與高度</label>

              {/* 3D Gizmo 控制器 */}
              <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 shadow-2xl space-y-4">
                {/* 特殊 POV 模式 */}
                <div className="space-y-4">
                  <label className="text-[18px] font-black text-slate-300 uppercase tracking-widest">
                    特殊拍攝視角 (POV)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {POV_MODES.map(mode => (
                      <button
                        key={mode.label}
                        onClick={() => handleChange('povMode', mode.value)}
                        className={`py-2.5 px-2 rounded-lg border text-[18px] font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
                          config.povMode === mode.value
                            ? 'bg-step-camera border-step-camera-light text-white shadow-lg'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-step-camera/50 hover:text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {mode.label.split(' (')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 分隔線 */}
                <div className="border-t border-slate-700/50"></div>

                {/* 預設角度快捷按鈕 */}
                <div className="space-y-4">
                  <label className="text-[18px] font-black text-slate-300 uppercase tracking-widest">
                    快速預設角度
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {CAMERA_ANGLE_PRESETS.map((preset) => {
                      const isActive = cameraAzimuth === preset.azimuth && cameraElevation === preset.elevation;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange({ 
                              ...config, 
                              cameraAzimuth: preset.azimuth,
                              cameraElevation: preset.elevation
                            });
                          }}
                          className={`py-2.5 px-2 rounded-lg border text-[18px] font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
                            isActive
                              ? 'bg-step-camera border-step-camera-light text-white shadow-lg'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-step-camera/50 hover:text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 攝影模式切換 */}
                <div className="space-y-3 pt-2 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <label className="text-[18px] uppercase font-black text-slate-300 tracking-wider">攝影模式</label>
                    <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-lg border border-slate-700">
                      <button
                        onClick={() => handleChange('photographyMode', 'commercial')}
                        className={`px-3 py-1.5 text-[18px] font-black uppercase tracking-wider rounded-md transition-all ${
                          (config.photographyMode === 'commercial' || !config.photographyMode)
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        商業
                      </button>
                      <button
                        onClick={() => handleChange('photographyMode', 'technical')}
                        className={`px-3 py-1.5 text-[18px] font-black uppercase tracking-wider rounded-md transition-all ${
                          config.photographyMode === 'technical'
                            ? 'bg-cyan-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        技術
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-700">
                    <p className="text-[18px] text-slate-300 leading-relaxed">
                      {(config.photographyMode === 'commercial' || !config.photographyMode) ? (
                        <span><span className="text-blue-400 font-bold">商業模式</span>：使用視覺化描述，AI 可自由優化美學效果</span>
                      ) : (
                        <span><span className="text-cyan-400 font-bold">技術模式</span>：精確控制相機角度，禁止 AI 美學優化</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* 3D Gizmo */}
                <Camera3DGizmo
                  azimuth={cameraAzimuth}
                  elevation={cameraElevation}
                  onAzimuthChange={handleAzimuthChange}
                  onElevationChange={handleElevationChange}
                />
              </div>

              {/* 自定義角度標籤（選用） */}
              {customTags.length > 0 && (
                <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
                  <p className="text-[18px] font-black text-orange-300 uppercase tracking-widest border-l-4 border-orange-500/30 pl-4">
                    自定義角度補充說明
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {customTags.map(tag => (
                      <button
                        key={tag}
                        className="px-5 py-2.5 bg-slate-800 border border-orange-500/20 rounded-lg text-[18px] font-bold text-orange-200 hover:bg-orange-600/20 hover:border-orange-500 transition-all flex items-center gap-3 group"
                      >
                        {tag}
                        <span onClick={(e) => removeCustomTag(tag, e)} className="text-orange-500 hover:text-white transition-opacity">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. FOV + 光圈整合區塊 */}
          <div className="space-y-6">
            <LensFOV 
              focalLength={config.lens} 
              onFocalLengthChange={(val) => handleChange('lens', val)} 
            />

            {/* 光圈控制（整合在 FOV 下方） */}
            <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[18px] font-black text-white uppercase tracking-[0.15em]">物理景深光圈</label>
                <span className="text-[18px] font-black text-step-camera-light font-mono bg-step-camera/10 px-6 py-2 rounded-xl border border-step-camera/20">{opticsConfig.dof}</span>
              </div>
              <DOFVisualizer aperture={opticsConfig.dof} />
              <div className="pt-6">
                <input 
                  type="range" min="0" max={apertures.length - 1} step="1"
                  value={apertures.indexOf(opticsConfig.dof)}
                  onChange={(e) => onOpticsChange({ ...opticsConfig, dof: apertures[parseInt(e.target.value)] })}
                  className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-step-camera"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSection;
