/**
 * 燈光 Prompt 生成器 - 參數驅動系統
 * 
 * 核心邏輯：
 * 1. 讀取使用者當前的燈光角度與選中的 Preset
 * 2. 計算偏差 (Deviation)
 * 3. 判定模式 (Perfect Match vs Style Inheritance)
 * 4. 組裝最終 Prompt
 */

import { LightSource } from '../types';
import { LIGHTING_PRESET_DATABASE, LightingPresetDefinition } from './lightingPresetDatabase';

/**
 * 計算兩個角度之間的最短距離（考慮 360° 循環）
 */
function calculateAngleDifference(angle1: number, angle2: number): number {
  let diff = Math.abs(angle1 - angle2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * 檢查當前燈光設定是否符合 Preset 的幾何限制
 */
function checkGeometryMatch(
  currentLight: LightSource,
  baseParams: { azimuth: number; elevation: number },
  tolerance: { azimuth: number; elevation: number }
): { isMatch: boolean; azimuthDiff: number; elevationDiff: number } {
  
  const azimuthDiff = calculateAngleDifference(currentLight.azimuth, baseParams.azimuth);
  const elevationDiff = Math.abs(currentLight.elevation - baseParams.elevation);
  
  const isMatch = azimuthDiff <= tolerance.azimuth && elevationDiff <= tolerance.elevation;
  
  return { isMatch, azimuthDiff, elevationDiff };
}

/**
 * 生成物理描述（當不符合 Preset 幾何限制時使用）
 */
function generatePhysicalDescription(light: LightSource, lightType: 'key' | 'fill' | 'rim'): string {
  const lightNames = {
    key: 'Key light',
    fill: 'Fill light',
    rim: 'Rim light'
  };
  
  // 方位角描述（修正：與 UI 視覺一致 - 180° = 正前方，0° = 正後方）
  let azimuthDesc = '';
  const normalizedAzimuth = ((light.azimuth % 360) + 360) % 360;
  
  if (normalizedAzimuth >= 165 && normalizedAzimuth < 195) {
    // 180° ± 15° = 正前方
    azimuthDesc = 'frontal';
  } else if (normalizedAzimuth >= 195 && normalizedAzimuth < 225) {
    // 210° ± 15° = 左前方
    azimuthDesc = 'front-left';
  } else if (normalizedAzimuth >= 225 && normalizedAzimuth < 255) {
    // 240° ± 15° = 左前側
    azimuthDesc = 'left front-side';
  } else if (normalizedAzimuth >= 255 && normalizedAzimuth < 285) {
    // 270° ± 15° = 左側
    azimuthDesc = 'left side';
  } else if (normalizedAzimuth >= 285 && normalizedAzimuth < 315) {
    // 300° ± 15° = 左後側
    azimuthDesc = 'left back-side';
  } else if (normalizedAzimuth >= 315 && normalizedAzimuth < 345) {
    // 330° ± 15° = 左後方
    azimuthDesc = 'back-left';
  } else if ((normalizedAzimuth >= 345 && normalizedAzimuth <= 360) || (normalizedAzimuth >= 0 && normalizedAzimuth < 15)) {
    // 0° ± 15° = 正後方
    azimuthDesc = 'back';
  } else if (normalizedAzimuth >= 15 && normalizedAzimuth < 45) {
    // 30° ± 15° = 右後方
    azimuthDesc = 'back-right';
  } else if (normalizedAzimuth >= 45 && normalizedAzimuth < 75) {
    // 60° ± 15° = 右後側
    azimuthDesc = 'right back-side';
  } else if (normalizedAzimuth >= 75 && normalizedAzimuth < 105) {
    // 90° ± 15° = 右側
    azimuthDesc = 'right side';
  } else if (normalizedAzimuth >= 105 && normalizedAzimuth < 135) {
    // 120° ± 15° = 右前側
    azimuthDesc = 'right front-side';
  } else if (normalizedAzimuth >= 135 && normalizedAzimuth < 165) {
    // 150° ± 15° = 右前方
    azimuthDesc = 'front-right';
  } else {
    azimuthDesc = 'angled';
  }
  
  // 仰角描述
  let elevationDesc = '';
  if (light.elevation < -60) {
    elevationDesc = 'very low angle';
  } else if (light.elevation < -30) {
    elevationDesc = 'low angle';
  } else if (light.elevation < -10) {
    elevationDesc = 'slightly below';
  } else if (light.elevation <= 10) {
    elevationDesc = 'eye-level';
  } else if (light.elevation <= 30) {
    elevationDesc = 'slightly above';
  } else if (light.elevation <= 60) {
    elevationDesc = 'high angle';
  } else {
    elevationDesc = 'very high angle';
  }
  
  // 強度描述
  let intensityDesc = '';
  if (light.intensity >= 80) {
    intensityDesc = 'strong';
  } else if (light.intensity >= 50) {
    intensityDesc = 'moderate';
  } else if (light.intensity >= 20) {
    intensityDesc = 'soft';
  } else {
    intensityDesc = 'subtle';
  }
  
  return `${lightNames[lightType]} positioned at ${azimuthDesc} ${elevationDesc} with ${intensityDesc} intensity`;
}

/**
 * 顏色轉換為描述性文字
 */
function colorToDescription(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#ffffff': 'neutral white',
    '#fff5e6': 'warm white',
    '#e6f2ff': 'cool white',
    '#ffd700': 'golden',
    '#ff6b35': 'warm orange',
    '#ff4500': 'vivid red-orange',
    '#4169e1': 'cool blue',
    '#cbd5e1': 'soft gray-blue',
    '#e0e7ff': 'pale blue',
    '#f0f4ff': 'very pale blue'
  };
  
  return colorMap[hexColor.toLowerCase()] || `custom ${hexColor} tone`;
}

/**
 * 產品模式映射：將人像用語轉換為產品用語
 */
function applyProductModeMapping(text: string, mapping?: Record<string, string>): string {
  if (!mapping) return text;
  
  let result = text;
  // Sort by length (longest first) to avoid partial replacements
  const sortedEntries = Object.entries(mapping).sort((a, b) => b[0].length - a[0].length);
  
  for (const [portraitTerm, productTerm] of sortedEntries) {
    // Use word boundary for more precise matching
    const regex = new RegExp(`\\b${portraitTerm}\\b`, 'gi');
    result = result.replace(regex, productTerm);
  }
  
  return result;
}

/**
 * 生成模式判定結果
 */
export interface LightingPromptResult {
  mode: 'perfect_match' | 'style_inheritance' | 'custom' | 'product_lighting';
  presetName?: string;
  geometryTags: string[];
  styleTags: string[];
  physicalDescription: string;
  colorDescription: string;
  deviationInfo: {
    azimuthDiff: number;
    elevationDiff: number;
  };
}

/**
 * 核心函式：生成燈光 Prompt
 * 
 * @param keyLight - 當前主光設定
 * @param fillLight - 當前補光設定
 * @param rimLight - 當前輪廓光設定
 * @param selectedPresetId - 使用者選中的 Preset ID
 * @param isProductMode - 是否為產品攝影模式（會替換人像用語）
 * @returns 燈光 Prompt 生成結果
 */
export function generateLightingPrompt(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  selectedPresetId: string,
  isProductMode: boolean = false
): LightingPromptResult {
  
  // Step 1: 獲取 Preset 定義
  const preset = LIGHTING_PRESET_DATABASE[selectedPresetId];
  
  if (!preset) {
    // 如果沒有 Preset，直接生成物理描述
    return {
      mode: 'custom',
      geometryTags: [],
      styleTags: [],
      physicalDescription: generatePhysicalDescription(keyLight, 'key'),
      colorDescription: `in ${colorToDescription(keyLight.color)} color`,
      deviationInfo: { azimuthDiff: 0, elevationDiff: 0 }
    };
  }
  
  // Step 2: 計算偏差
  const keyLightMatch = checkGeometryMatch(
    keyLight,
    preset.base_params.keyLight,
    preset.tolerance
  );
  
  // Step 3: 判定模式
  if (keyLightMatch.isMatch) {
    // ========================================
    // Case A: Perfect Match
    // ========================================
    // 使用者幾乎沒動，或是微調
    
    let geometryTags = [...preset.geometry_tags];
    let styleTags = [...preset.style_tags];
    
    // 產品模式特殊處理
    if (isProductMode) {
      // 產品模式：完全移除幾何標籤（避免人像用語）
      // 只保留風格標籤和物理描述
      return {
        mode: 'product_lighting',
        presetName: preset.name,  // 僅供 UI 顯示，不輸出到 Prompt
        geometryTags: [],  // 移除所有幾何標籤
        styleTags,
        physicalDescription: generatePhysicalDescription(keyLight, 'key'),
        colorDescription: `in ${colorToDescription(keyLight.color)} color`,
        deviationInfo: {
          azimuthDiff: keyLightMatch.azimuthDiff,
          elevationDiff: keyLightMatch.elevationDiff
        }
      };
    }
    
    // 人像模式：正常輸出
    // 如果是產品模式，替換用語（這段代碼現在不會執行，因為上面已經 return）
    if (isProductMode && preset.product_mode_mapping) {
      geometryTags = geometryTags.map(tag => 
        applyProductModeMapping(tag, preset.product_mode_mapping)
      );
    }
    
    return {
      mode: 'perfect_match',
      presetName: preset.name,
      geometryTags,
      styleTags,
      physicalDescription: '',
      colorDescription: `in ${colorToDescription(keyLight.color)} color`,
      deviationInfo: {
        azimuthDiff: keyLightMatch.azimuthDiff,
        elevationDiff: keyLightMatch.elevationDiff
      }
    };
    
  } else {
    // ========================================
    // Case B: Style Inheritance
    // ========================================
    // 使用者大幅移動了燈光，已經不是原本的 Preset 了
    // Action: 移除 geometry_tags，保留 style_tags，並插入當前的物理描述
    
    let styleTags = [...preset.style_tags];
    
    // 產品模式映射（僅針對 style_tags，因為 geometry_tags 已被移除）
    if (isProductMode && preset.product_mode_mapping) {
      styleTags = styleTags.map(tag => 
        applyProductModeMapping(tag, preset.product_mode_mapping)
      );
    }
    
    return {
      mode: 'style_inheritance',
      presetName: preset.name,
      geometryTags: [],  // 移除幾何標籤
      styleTags,         // 保留風格標籤
      physicalDescription: generatePhysicalDescription(keyLight, 'key'),
      colorDescription: `in ${colorToDescription(keyLight.color)} color`,
      deviationInfo: {
        azimuthDiff: keyLightMatch.azimuthDiff,
        elevationDiff: keyLightMatch.elevationDiff
      }
    };
  }
}

/**
 * 組裝最終的燈光 Prompt 字串
 * 
 * 結構：
 * (Geometry) [幾何描述], (Key Light) [主光描述 + 方向 + 顏色], (Fill Light) [補光描述], (Style) [風格描述]
 * 
 * 重要：即使在 Perfect Match 模式下，也應該包含方向資訊，
 * 因為 UI 上的視覺化顯示了明確的方向，使用者需要知道燈光的實際位置。
 */
export function assembleLightingPromptString(
  result: LightingPromptResult,
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource
): string {
  const parts: string[] = [];
  
  // Part 1: Geometry（如果有）
  if (result.geometryTags.length > 0) {
    parts.push(`(Geometry) ${result.geometryTags.join(', ')}`);
  } else if (result.physicalDescription) {
    parts.push(`(Geometry) ${result.physicalDescription}`);
  }
  
  // Part 2: Key Light - 包含方向和顏色
  // 即使是 Perfect Match，也要說明方向，因為 UI 上有視覺化顯示
  const keyLightParts: string[] = [];
  
  // 方向描述
  const keyDirection = generatePhysicalDescription(keyLight, 'key');
  keyLightParts.push(keyDirection);
  
  // 顏色描述
  if (result.colorDescription) {
    keyLightParts.push(result.colorDescription);
  }
  
  // 自訂光質描述（如果有）
  if (keyLight.styleDescription && keyLight.styleDescription.trim()) {
    keyLightParts.push(keyLight.styleDescription.trim());
  }
  
  parts.push(`(Key Light) ${keyLightParts.join(', ')}`);
  
  // Part 3: Fill Light - 如果強度 > 0
  if (fillLight.intensity > 0) {
    const fillLightParts: string[] = [];
    const fillDirection = generatePhysicalDescription(fillLight, 'fill');
    fillLightParts.push(fillDirection);
    
    const fillColor = colorToDescription(fillLight.color);
    fillLightParts.push(`in ${fillColor} color`);
    
    // 自訂光質描述（如果有）
    if (fillLight.styleDescription && fillLight.styleDescription.trim()) {
      fillLightParts.push(fillLight.styleDescription.trim());
    }
    
    parts.push(`(Fill Light) ${fillLightParts.join(', ')}`);
  }
  
  // Part 4: Rim Light - 如果強度 > 0
  if (rimLight.intensity > 0) {
    const rimLightParts: string[] = [];
    const rimDirection = generatePhysicalDescription(rimLight, 'rim');
    rimLightParts.push(rimDirection);
    
    const rimColor = colorToDescription(rimLight.color);
    rimLightParts.push(`in ${rimColor} color`);
    
    // 自訂光質描述（如果有）
    if (rimLight.styleDescription && rimLight.styleDescription.trim()) {
      rimLightParts.push(rimLight.styleDescription.trim());
    }
    
    parts.push(`(Rim Light) ${rimLightParts.join(', ')}`);
  }
  
  // Part 5: Style
  if (result.styleTags.length > 0) {
    parts.push(`(Style) Rendering with ${result.styleTags.join(', ')}`);
  }
  
  return parts.join(', ') + '.';
}

/**
 * 便捷函式：一次性生成完整的燈光 Prompt 字串
 */
export function generateCompleteLightingPrompt(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  selectedPresetId: string,
  isProductMode: boolean = false
): string {
  const result = generateLightingPrompt(
    keyLight,
    fillLight,
    rimLight,
    selectedPresetId,
    isProductMode
  );
  
  return assembleLightingPromptString(result, keyLight, fillLight, rimLight);
}

/**
 * 生成結構化的燈光資訊（用於 Protocol Deck 顯示）
 */
export interface StructuredLightingInfo {
  presetName?: string;
  geometry?: string;
  keyLight?: string;
  fillLight?: string;
  rimLight?: string;
  style?: string;
}

export function generateStructuredLightingInfo(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  selectedPresetId: string,
  isProductMode: boolean = false
): StructuredLightingInfo {
  const result = generateLightingPrompt(
    keyLight,
    fillLight,
    rimLight,
    selectedPresetId,
    isProductMode
  );
  
  const info: StructuredLightingInfo = {};
  
  // Preset 名稱（僅在 Perfect Match 時顯示）
  if (result.mode === 'perfect_match' && result.presetName) {
    info.presetName = result.presetName;
  }
  
  // 幾何描述
  if (result.geometryTags.length > 0) {
    info.geometry = result.geometryTags.join(', ');
  } else if (result.physicalDescription) {
    info.geometry = result.physicalDescription;
  }
  
  // Key Light
  const keyLightParts: string[] = [];
  const keyDirection = generatePhysicalDescription(keyLight, 'key');
  keyLightParts.push(keyDirection);
  if (result.colorDescription) {
    keyLightParts.push(result.colorDescription);
  }
  if (keyLight.styleDescription && keyLight.styleDescription.trim()) {
    keyLightParts.push(keyLight.styleDescription.trim());
  }
  info.keyLight = keyLightParts.join(', ');
  
  // Fill Light（如果強度 > 0）
  if (fillLight.intensity > 0) {
    const fillLightParts: string[] = [];
    const fillDirection = generatePhysicalDescription(fillLight, 'fill');
    fillLightParts.push(fillDirection);
    const fillColor = colorToDescription(fillLight.color);
    fillLightParts.push(`in ${fillColor} color`);
    if (fillLight.styleDescription && fillLight.styleDescription.trim()) {
      fillLightParts.push(fillLight.styleDescription.trim());
    }
    info.fillLight = fillLightParts.join(', ');
  }
  
  // Rim Light（如果強度 > 0）
  if (rimLight.intensity > 0) {
    const rimLightParts: string[] = [];
    const rimDirection = generatePhysicalDescription(rimLight, 'rim');
    rimLightParts.push(rimDirection);
    const rimColor = colorToDescription(rimLight.color);
    rimLightParts.push(`in ${rimColor} color`);
    if (rimLight.styleDescription && rimLight.styleDescription.trim()) {
      rimLightParts.push(rimLight.styleDescription.trim());
    }
    info.rimLight = rimLightParts.join(', ');
  }
  
  // Style
  if (result.styleTags.length > 0) {
    info.style = `Rendering with ${result.styleTags.join(', ')}`;
  }
  
  return info;
}
