/**
 * Lighting Formatters Utility
 * 處理燈光參數格式化為 Prompt 字串的邏輯
 * 
 * 新增：參數驅動系統整合
 * - 使用 lightingPromptGenerator 進行智能 Preset 檢測
 * - 自動判定 Perfect Match vs Style Inheritance
 * - 支援產品攝影模式的用語轉換
 */

import { LightSource } from '../types';
import { 
  translateLightDirection, 
  translateLightIntensity, 
  translateColorHex 
} from './visualTranslators';
import { 
  generateCompleteLightingPrompt,
  generateLightingPrompt 
} from './lightingPromptGenerator';

/**
 * 格式化單個光源為 Prompt 字串
 * @param lightSource 光源配置
 * @param lightType 光源類型 ('Key' | 'Fill' | 'Rim')
 * @returns 格式化的字串
 */
export function formatLightSourceForPrompt(
  lightSource: LightSource,
  lightType: 'Key' | 'Fill' | 'Rim'
): string {
  const parts: string[] = [];
  
  // Translate light direction (azimuth + elevation)
  const directionDesc = translateLightDirection(
    lightSource.azimuth,
    lightSource.elevation,
    lightType
  );
  parts.push(directionDesc);
  
  // Translate light intensity
  const intensityDesc = translateLightIntensity(
    lightSource.intensity,
    `${lightType} light`
  );
  parts.push(intensityDesc);
  
  // Translate color (if not white)
  if (lightSource.color.toLowerCase() !== '#ffffff') {
    const colorDesc = translateColorHex(lightSource.color);
    parts.push(colorDesc);
  }
  
  return parts.join(', ');
}

/**
 * 格式化 Rim Light 為 Prompt 字串
 * Rim Light 只有仰角，方位角自動鎖定在背後
 * @param rimLight Rim Light 配置
 * @param keyAzimuth 主光源的方位角（用於計算背後位置）
 * @returns 格式化的字串
 */
export function formatRimLightForPrompt(
  rimLight: { elevation: number; color: string; intensity: number },
  keyAzimuth: number
): string {
  const parts: string[] = [];
  
  // Calculate backlit azimuth (opposite of key light)
  const rimAzimuth = (keyAzimuth + 180) % 360;
  
  // Translate light direction
  const directionDesc = translateLightDirection(
    rimAzimuth,
    rimLight.elevation,
    'Rim'
  );
  parts.push(directionDesc);
  
  // Translate light intensity
  const intensityDesc = translateLightIntensity(
    rimLight.intensity,
    'Rim light'
  );
  parts.push(intensityDesc);
  
  // Translate color (if not white)
  if (rimLight.color.toLowerCase() !== '#ffffff') {
    const colorDesc = translateColorHex(rimLight.color);
    parts.push(colorDesc);
  }
  
  return parts.join(', ');
}

/**
 * 格式化完整的燈光系統為 Prompt 字串（新版：參數驅動）
 * 
 * 核心邏輯：
 * 1. 如果選中了 Preset，使用智能檢測系統
 * 2. 檢查當前燈光角度是否符合 Preset 的幾何限制
 * 3. Perfect Match：輸出 Preset 的幾何標籤 + 風格標籤
 * 4. Style Inheritance：移除幾何標籤，保留風格標籤，加入物理描述
 * 5. 如果是產品攝影模式，自動替換人像用語
 * 
 * @param keyLight 主光源
 * @param fillLight 補光
 * @param rimLight 輪廓光
 * @param studioSetup 攝影棚預設 ID（如 'rembrandt', 'butterfly'）
 * @param promptTags 預設的特色標籤（向後兼容，已不使用）
 * @param isProductMode 是否為產品攝影模式（預設 false）
 * @returns 完整的燈光描述字串
 */
export function formatLightingSection(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  studioSetup?: string,
  promptTags?: string,
  isProductMode: boolean = false
): string {
  
  // 如果有選中 Preset（且不是 manual），使用新的參數驅動系統
  if (studioSetup && studioSetup !== 'manual') {
    try {
      const smartPrompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        studioSetup,
        isProductMode
      );
      
      return smartPrompt;
    } catch (error) {
      console.warn('Failed to generate smart lighting prompt, falling back to legacy format:', error);
      // Fallback to legacy format
    }
  }
  
  // Fallback：手動模式或錯誤時使用舊格式
  const lines: string[] = [];
  
  if (studioSetup && studioSetup !== 'manual' && promptTags) {
    lines.push(`${studioSetup}: ${promptTags}`);
  } else if (studioSetup && studioSetup !== 'manual') {
    lines.push(`Studio Setup: ${studioSetup}`);
  }
  
  // 格式化各個光源
  if (studioSetup === 'manual' || !promptTags) {
    lines.push(formatLightSourceForPrompt(keyLight, 'Key'));
    lines.push(formatLightSourceForPrompt(fillLight, 'Fill'));
    lines.push(formatRimLightForPrompt(rimLight, keyLight.azimuth));
  }
  
  return lines.join(', ');
}

/**
 * 格式化完整的燈光系統為 Prompt 字串（舊版：向後兼容）
 * @deprecated 請使用 formatLightingSection 的新版本
 */
export function formatLightingSectionLegacy(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: { elevation: number; color: string; intensity: number },
  studioSetup?: string,
  promptTags?: string
): string {
  const lines: string[] = [];
  
  if (studioSetup && studioSetup !== 'manual' && promptTags) {
    lines.push(`${studioSetup}: ${promptTags}`);
  } else if (studioSetup && studioSetup !== 'manual') {
    lines.push(`Studio Setup: ${studioSetup}`);
  }
  
  if (studioSetup === 'manual' || !promptTags) {
    lines.push(formatLightSourceForPrompt(keyLight, 'Key'));
    lines.push(formatLightSourceForPrompt(fillLight, 'Fill'));
    lines.push(formatRimLightForPrompt(rimLight, keyLight.azimuth));
  }
  
  return lines.join(', ');
}

/**
 * 格式化光源顏色為可讀的名稱
 * @param hexColor 十六進位顏色碼
 * @returns 顏色名稱
 */
export function formatColorName(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#ffffff': 'White',
    '#fff': 'White',
    '#fbbf24': 'Warm',
    '#cbd5e1': 'Cool',
    '#60a5fa': 'Blue',
    '#1a1a1a': 'Dark'
  };
  
  return colorMap[hexColor.toLowerCase()] || hexColor;
}

/**
 * 生成燈光系統的簡短摘要
 * @param keyLight 主光源
 * @param fillLight 補光
 * @param rimLight 輪廓光
 * @returns 簡短摘要字串
 */
export function generateLightingSummary(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: { elevation: number; color: string; intensity: number }
): string {
  const keyDesc = `Key ${keyLight.intensity}%`;
  const fillDesc = `Fill ${fillLight.intensity}%`;
  const rimDesc = `Rim ${rimLight.intensity}%`;
  
  return `${keyDesc} | ${fillDesc} | ${rimDesc}`;
}
