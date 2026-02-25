/**
 * Style Compatibility Module
 * 
 * 檢查底片模擬與數位渲染標籤之間的相容性
 * 提供警告和建議，幫助用戶避免風格衝突
 */

import { StyleConfig } from '../types';

/**
 * 風格衝突類型
 */
export enum StyleConflictType {
  ANALOG_VS_DIGITAL = 'analog_vs_digital',      // 類比 vs 數位
  GRAIN_VS_SHARP = 'grain_vs_sharp',            // 顆粒 vs 銳利
  VINTAGE_VS_MODERN = 'vintage_vs_modern'       // 復古 vs 現代
}

/**
 * 風格衝突警告
 */
export interface StyleConflictWarning {
  type: StyleConflictType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  conflictingTags: string[];
}

/**
 * 類比風格標籤（底片、復古）
 */
const ANALOG_TAGS = [
  'Kodak Portra 400',
  'Fujifilm Superia',
  'Ilford HP5 Plus (黑白)',
  'Cinestill 800T',
  'Polaroid SX-70 (拍立得)',
  'Technicolor V3 (特藝彩色)',
  '電影顆粒'
];

/**
 * 數位渲染標籤（高科技、現代）
 */
const DIGITAL_RENDERING_TAGS = [
  'UE5 渲染',
  '光線追蹤',
  'Lumen 全域光照',
  '8K 解析度',
  '超精細',
  '體積光',
  '次表面散射',
  '環境光遮蔽'
];

/**
 * 銳利度標籤（與顆粒感衝突）
 */
const SHARPNESS_TAGS = [
  '超精細',
  '8K 解析度',
  '銳化'
];

/**
 * 顆粒感標籤
 */
const GRAIN_TAGS = [
  '電影顆粒'
];

/**
 * 檢查風格配置的相容性
 * 
 * @param config - 風格配置
 * @returns 衝突警告列表
 */
export function checkStyleCompatibility(config: StyleConfig): StyleConflictWarning[] {
  const warnings: StyleConflictWarning[] = [];
  
  // 檢查是否同時使用底片模擬和數位渲染
  const hasFilmStyle = config.postProcessing.some(tag => ANALOG_TAGS.includes(tag));
  const hasDigitalTags = config.postProcessing.some(tag => 
    DIGITAL_RENDERING_TAGS.includes(tag)
  );
  
  if (hasFilmStyle && hasDigitalTags) {
    const conflictingFilmTags = config.postProcessing.filter(tag => ANALOG_TAGS.includes(tag));
    const conflictingDigitalTags = config.postProcessing.filter(tag => 
      DIGITAL_RENDERING_TAGS.includes(tag)
    );
    
    // 判斷衝突嚴重程度
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (conflictingDigitalTags.includes('UE5 渲染')) {
      severity = 'high'; // UE5 是遊戲引擎，與底片完全矛盾
    } else if (conflictingDigitalTags.includes('8K 解析度') || 
               conflictingDigitalTags.includes('超精細')) {
      severity = 'medium'; // 8K/超精細與底片顆粒感矛盾
    }
    
    warnings.push({
      type: StyleConflictType.ANALOG_VS_DIGITAL,
      severity,
      message: `底片模擬（${conflictingFilmTags.join(', ')}）與數位渲染標籤可能產生風格衝突`,
      suggestion: severity === 'high' 
        ? '建議移除 UE5 渲染標籤，或改用數位風格（移除底片模擬）'
        : '建議選擇類比風格（底片 + 電影顆粒）或數位風格（8K + 光追），避免混用',
      conflictingTags: [...conflictingFilmTags, ...conflictingDigitalTags]
    });
  }
  
  // 檢查是否同時使用顆粒感和銳利度
  const hasGrain = config.postProcessing.some(tag => GRAIN_TAGS.includes(tag)) ||
                   (config.grain && config.grain !== 'None');
  const hasSharpness = config.postProcessing.some(tag => SHARPNESS_TAGS.includes(tag));
  
  if (hasGrain && hasSharpness) {
    const conflictingSharpTags = config.postProcessing.filter(tag => 
      SHARPNESS_TAGS.includes(tag)
    );
    
    warnings.push({
      type: StyleConflictType.GRAIN_VS_SHARP,
      severity: 'medium',
      message: '電影顆粒與超精細/8K 標籤可能產生視覺衝突',
      suggestion: '顆粒感會降低清晰度，建議選擇其中一種風格',
      conflictingTags: ['電影顆粒', ...conflictingSharpTags]
    });
  }
  
  return warnings;
}

/**
 * 獲取風格建議（基於當前配置）
 * 
 * @param config - 風格配置
 * @returns 風格建議文字
 */
export function getStyleSuggestion(config: StyleConfig): string {
  const hasFilmStyle = config.postProcessing.some(tag => ANALOG_TAGS.includes(tag));
  const hasDigitalTags = config.postProcessing.some(tag => 
    DIGITAL_RENDERING_TAGS.includes(tag)
  );
  
  if (hasFilmStyle && !hasDigitalTags) {
    return '✅ 類比風格：建議搭配「電影顆粒」增強底片感';
  } else if (!hasFilmStyle && hasDigitalTags) {
    return '✅ 數位風格：建議搭配「光線追蹤」和「8K 解析度」';
  } else if (hasFilmStyle && hasDigitalTags) {
    return '⚠️ 混合風格：類比與數位標籤混用，可能產生風格衝突';
  } else {
    return '💡 提示：選擇底片模擬或數位渲染標籤來定義風格';
  }
}

/**
 * 推薦的風格組合（預設配置）
 */
export const RECOMMENDED_STYLE_PRESETS = {
  analog: {
    name: '類比底片風格',
    filmStyle: 'Kodak Portra 400',
    postProcessing: ['電影顆粒'],
    grain: 'Medium',
    vignette: true
  },
  digital: {
    name: '數位渲染風格',
    filmStyle: 'None',
    postProcessing: ['超精細', '光線追蹤', '8K 解析度'],
    grain: 'None',
    vignette: false
  },
  cinematic: {
    name: '電影感風格',
    filmStyle: 'Cinestill 800T',
    postProcessing: ['電影顆粒', '變形鏡頭光暈', '色彩分級'],
    grain: 'Low',
    vignette: true
  },
  commercial: {
    name: '商業攝影風格',
    filmStyle: 'None',
    postProcessing: ['超精細', '銳化', '對比度增強'],
    grain: 'None',
    vignette: false
  }
};
