import React, { useState } from 'react';
import { OpticsConfig } from '../../types';
import { migrateOpticsConfig, STUDIO_SETUPS } from '../../constants';
import { calculateRimAzimuth } from '../../utils/lightingCalculations';
import PortraitLightingVisualizer from '../visuals/PortraitLightingVisualizer';
import LightingPresetGrid from '../lighting/LightingPresetGrid';
import LightSourcePanel from '../lighting/LightSourcePanel';
import RimLightPanel from '../lighting/RimLightPanel';
import LightingDirectionIndicator from '../lighting/LightingDirectionIndicator';

interface OpticsSectionProps {
  config: OpticsConfig;
  onChange: (config: OpticsConfig) => void;
}

const OpticsSection: React.FC<OpticsSectionProps> = ({ config, onChange }) => {
  const [activeLayer, setActiveLayer] = useState<'key' | 'fill' | 'rim' | 'ambient'>('key');

  // 確保配置已遷移到新格式
  const migratedConfig = migrateOpticsConfig(config);

  const handleSetupSelect = (setupId: string, setup: typeof STUDIO_SETUPS[0]) => {
    if (!migratedConfig.useAdvancedLighting) return;
    
    // 套用完整的三光源配置
    onChange({
      ...migratedConfig,
      studioSetup: setupId,
      keyLight: setup.keyLight,
      fillLight: setup.fillLight,
      rimLight: setup.rimLight
    });
  };

  const handleKeyLightChange = (keyLight: typeof migratedConfig.keyLight) => {
    onChange({ ...migratedConfig, keyLight, studioSetup: 'manual' });
  };

  const handleFillLightChange = (fillLight: typeof migratedConfig.fillLight) => {
    onChange({ ...migratedConfig, fillLight, studioSetup: 'manual' });
  };

  const handleRimLightChange = (rimLight: typeof migratedConfig.rimLight) => {
    onChange({ ...migratedConfig, rimLight, studioSetup: 'manual' });
  };

  const handleAmbientColorChange = (ambientColor: string) => {
    onChange({ ...migratedConfig, ambientColor });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-step-light-light to-step-light-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
          04
        </div>
        <div className="flex-1">
          <h3 className="text-[32px] font-black text-white leading-tight mb-3">
            燈光物理
          </h3>
          <p className="text-[18px] text-slate-400 leading-relaxed">
            設定專業燈光系統，包含主光、補光、輪廓光的位置、顏色和強度。
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 進階燈光系統開關 */}
        <div className="flex items-center justify-between bg-slate-900/40 p-5 rounded-xl border border-slate-800 shadow-xl ring-1 ring-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-8 ${migratedConfig.useAdvancedLighting ? 'bg-step-light' : 'bg-slate-700'} rounded-full transition-all`} />
            <div className="flex flex-col">
              <label className="text-[16px] font-black uppercase tracking-[0.15em] text-white leading-none">啟動專業佈光系統</label>
              <p className="text-[16px] text-slate-400 uppercase mt-1 font-bold">三點式燈光控制</p>
            </div>
          </div>
          <button 
            onClick={() => onChange({ ...migratedConfig, useAdvancedLighting: !migratedConfig.useAdvancedLighting })}
            className={`w-20 h-10 rounded-full transition-all relative ${migratedConfig.useAdvancedLighting ? 'bg-step-light shadow-2xl' : 'bg-slate-800 border border-slate-700'}`}
          >
             <div className={`absolute top-1.5 left-1.5 w-7 h-7 bg-white rounded-full transition-transform ${migratedConfig.useAdvancedLighting ? 'translate-x-10' : ''} shadow-lg`} />
          </button>
        </div>

        {/* 進階燈光控制區域 */}
        <div className={`space-y-6 transition-all duration-1000 ${migratedConfig.useAdvancedLighting ? 'opacity-100' : 'opacity-10 grayscale pointer-events-none scale-[0.98]'}`}>
          {/* 燈光預設網格 */}
          <LightingPresetGrid
            currentSetup={migratedConfig.studioSetup}
            currentKeyLight={migratedConfig.keyLight}
            currentFillLight={migratedConfig.fillLight}
            currentRimLight={migratedConfig.rimLight}
            disabled={!migratedConfig.useAdvancedLighting}
            onSetupSelect={handleSetupSelect}
          />

          {/* 視覺化器和控制面板 */}
          <div className="space-y-6">
            {/* 視覺化器（包含內建的方位角和仰角控制） */}
            <div className="space-y-6">
              <PortraitLightingVisualizer 
                config={migratedConfig} 
                onConfigChange={onChange}
                activeLight={activeLayer}
              />
              
              {/* 燈光方向與陰影說明 */}
              {activeLayer !== 'ambient' && (
                <LightingDirectionIndicator
                  keyLight={migratedConfig.keyLight}
                  fillLight={migratedConfig.fillLight}
                  rimLight={migratedConfig.rimLight}
                  selectedPresetId={migratedConfig.studioSetup}
                  isProductMode={false}
                />
              )}
            </div>

            {/* 光源控制面板 */}
            <div className="space-y-4">
              {/* 標籤切換 */}
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-2 gap-1 overflow-x-auto custom-scrollbar">
                {(['key', 'fill', 'rim', 'ambient'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveLayer(tab)} 
                    className={`flex-1 min-w-[90px] py-2.5 px-2 text-[16px] font-black rounded-lg transition-all uppercase tracking-tight ${
                      activeLayer === tab 
                        ? 'bg-step-light text-white shadow-xl ring-1 ring-white/5' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab === 'key' ? '主光' : tab === 'fill' ? '補光' : tab === 'rim' ? '輪廓' : '環境'}
                  </button>
                ))}
              </div>
              
              {/* 控制面板內容 */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 min-h-[350px] shadow-3xl flex flex-col justify-center">
                {activeLayer === 'key' && (
                  <LightSourcePanel
                    lightSource={migratedConfig.keyLight}
                    label="主光"
                    description="主光源，決定整體光影方向和強度"
                    disabled={!migratedConfig.useAdvancedLighting}
                    onChange={handleKeyLightChange}
                  />
                )}
                
                {activeLayer === 'fill' && (
                  <LightSourcePanel
                    lightSource={migratedConfig.fillLight}
                    label="補光"
                    description="用於軟化陰影，減少主光產生的對比度"
                    disabled={!migratedConfig.useAdvancedLighting}
                    onChange={handleFillLightChange}
                  />
                )}

                {activeLayer === 'rim' && (
                  <RimLightPanel
                    rimLight={migratedConfig.rimLight}
                    keyAzimuth={migratedConfig.keyLight.azimuth}
                    disabled={!migratedConfig.useAdvancedLighting}
                    onChange={handleRimLightChange}
                  />
                )}

                {activeLayer === 'ambient' && (
                  <div className="space-y-4 animate-in fade-in duration-500 text-center">
                    <label className="text-[16px] font-black text-white uppercase tracking-[0.15em] block mb-4">
                      環境反射光色調
                    </label>
                    <input 
                      type="color" 
                      value={migratedConfig.ambientColor} 
                      onChange={(e) => handleAmbientColorChange(e.target.value)} 
                      disabled={!migratedConfig.useAdvancedLighting}
                      className="w-full h-40 rounded-xl bg-slate-900 border-4 border-slate-800 cursor-pointer shadow-3xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed" 
                    />
                    <p className="text-[16px] text-slate-300 font-bold uppercase">
                      影響陰影處與全域氛圍的微光顏色
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpticsSection;
