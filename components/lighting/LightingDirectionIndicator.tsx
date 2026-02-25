import React from 'react';
import { LightSource } from '../../types';
import { generateLightingPrompt } from '../../utils/lightingPromptGenerator';

interface LightingDirectionIndicatorProps {
  keyLight: LightSource;
  fillLight: LightSource;
  rimLight: LightSource;
  selectedPresetId: string;
  isProductMode?: boolean;
}

/**
 * LightingDirectionIndicator - 燈光方向與陰影說明組件（簡化版）
 * 
 * 功能：
 * 1. 顯示當前燈光的精確方向描述
 * 2. 說明陰影的位置和方向
 * 3. 顯示 Perfect Match vs Style Inheritance 狀態
 * 
 * 控制方式說明：
 * - 即時光子追蹤：純視覺預覽，顯示燈光位置和光影效果
 * - 方位角滑桿：控制燈光的水平方向（180° 前 → 270° 左 → 0° 後 → 90° 右）
 * - 仰角滑桿：控制燈光的垂直角度（-90° 下 → 0° 平 → +90° 上）
 */
const LightingDirectionIndicator: React.FC<LightingDirectionIndicatorProps> = ({
  keyLight,
  fillLight,
  rimLight,
  selectedPresetId,
  isProductMode = false
}) => {
  
  // 生成燈光 Prompt 結果
  const result = generateLightingPrompt(
    keyLight,
    fillLight,
    rimLight,
    selectedPresetId,
    isProductMode
  );
  
  // 方位角轉換為方向描述（根據實際視覺表現）
  const getAzimuthDirection = (azimuth: number): string => {
    const normalized = ((azimuth % 360) + 360) % 360;
    
    // 實際視覺：180° = 正前方，0° = 正後方
    if (normalized >= 157.5 && normalized < 202.5) return '正前方';
    if (normalized >= 202.5 && normalized < 247.5) return '左前方';
    if (normalized >= 247.5 && normalized < 292.5) return '左側';
    if (normalized >= 292.5 && normalized < 337.5) return '左後方';
    if (normalized >= 337.5 || normalized < 22.5) return '正後方';
    if (normalized >= 22.5 && normalized < 67.5) return '右後方';
    if (normalized >= 67.5 && normalized < 112.5) return '右側';
    return '右前方';
  };
  
  // 仰角轉換為高度描述
  const getElevationDescription = (elevation: number): string => {
    if (elevation > 60) return '極高角度';
    if (elevation > 30) return '高角度';
    if (elevation > 10) return '略高於水平';
    if (elevation >= -10) return '水平視線';
    if (elevation >= -30) return '略低於水平';
    if (elevation >= -60) return '低角度';
    return '極低角度';
  };
  
  // 計算陰影方向（與主光相反）
  const getShadowDirection = (azimuth: number): string => {
    const shadowAzimuth = (azimuth + 180) % 360;
    return getAzimuthDirection(shadowAzimuth);
  };
  
  // 模式顏色
  const getModeColor = () => {
    if (result.mode === 'perfect_match') return 'text-green-400';
    if (result.mode === 'style_inheritance') return 'text-orange-400';
    if (result.mode === 'product_lighting') return 'text-purple-400';
    return 'text-slate-400';
  };
  
  const getModeBadgeColor = () => {
    if (result.mode === 'perfect_match') return 'bg-green-500/20 border-green-500/40';
    if (result.mode === 'style_inheritance') return 'bg-orange-500/20 border-orange-500/40';
    if (result.mode === 'product_lighting') return 'bg-purple-500/20 border-purple-500/40';
    return 'bg-slate-500/20 border-slate-500/40';
  };
  
  const getModeLabel = () => {
    if (result.mode === 'perfect_match') return '✓ 精準匹配';
    if (result.mode === 'style_inheritance') return '~ 風格繼承';
    if (result.mode === 'product_lighting') return '◆ 產品模式';
    return '◇ 手動調整';
  };
  
  return null;
};

export default LightingDirectionIndicator;
