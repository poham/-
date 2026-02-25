/**
 * Lighting Migration Utility
 * 處理舊格式到新格式的數據遷移
 */

import { OpticsConfig, LightSource } from '../types';

/**
 * 檢查 OpticsConfig 是否使用新格式
 */
export function isNewFormat(config: OpticsConfig): boolean {
  return !!(config.keyLight && config.fillLight && config.rimLight);
}

/**
 * 檢查 OpticsConfig 是否使用舊格式
 */
export function isLegacyFormat(config: OpticsConfig): boolean {
  return !!(
    config.lightRotation !== undefined &&
    config.lightColor !== undefined &&
    config.lightIntensity !== undefined
  );
}

/**
 * 將舊格式的 OpticsConfig 遷移到新格式
 * @param config 舊格式的配置
 * @returns 新格式的配置
 */
export function migrateLegacyConfig(config: OpticsConfig): OpticsConfig {
  // 如果已經是新格式，直接返回
  if (isNewFormat(config)) {
    return config;
  }
  
  // 從舊格式提取數據
  const lightRotation = config.lightRotation ?? 45;
  const lightColor = config.lightColor ?? '#ffffff';
  const lightIntensity = config.lightIntensity ?? 80;
  const fillLightColor = config.fillLightColor ?? '#cbd5e1';
  const fillLightIntensity = config.fillLightIntensity ?? 30;
  const rimLightColor = config.rimLightColor ?? '#ffffff';
  const rimLightIntensity = config.rimLightIntensity ?? 50;
  
  // 創建新格式的光源配置
  const keyLight: LightSource = {
    azimuth: lightRotation,
    elevation: 30, // 預設仰角
    color: lightColor,
    intensity: lightIntensity
  };
  
  const fillLight: LightSource = {
    azimuth: (lightRotation + 180) % 360, // 對側
    elevation: 15, // 較低的仰角
    color: fillLightColor,
    intensity: fillLightIntensity
  };
  
  const rimLight = {
    azimuth: 0,  // 預設方位角（將由 calculateRimAzimuth 計算）
    elevation: 45, // 預設仰角
    color: rimLightColor,
    intensity: rimLightIntensity
  };
  
  // 返回遷移後的配置
  return {
    ...config,
    keyLight,
    fillLight,
    rimLight,
    // 保留舊欄位以支援向後兼容
    lightRotation,
    lightColor,
    lightIntensity,
    fillLightColor,
    fillLightIntensity,
    rimLightColor,
    rimLightIntensity
  };
}

/**
 * 確保 OpticsConfig 使用新格式
 * 如果是舊格式，自動遷移；如果是新格式，直接返回
 * @param config 任意格式的配置
 * @returns 新格式的配置
 */
export function ensureNewFormat(config: OpticsConfig): OpticsConfig {
  if (isNewFormat(config)) {
    return config;
  }
  
  return migrateLegacyConfig(config);
}

/**
 * 將新格式同步回舊格式欄位（用於向後兼容）
 * @param config 新格式的配置
 * @returns 包含舊欄位的配置
 */
export function syncToLegacyFields(config: OpticsConfig): OpticsConfig {
  if (!isNewFormat(config)) {
    return config;
  }
  
  return {
    ...config,
    lightRotation: config.keyLight.azimuth,
    lightColor: config.keyLight.color,
    lightIntensity: config.keyLight.intensity,
    fillLightColor: config.fillLight.color,
    fillLightIntensity: config.fillLight.intensity,
    rimLightColor: config.rimLight.color,
    rimLightIntensity: config.rimLight.intensity
  };
}

/**
 * 從攝影棚預設創建光源配置
 * @param presetId 預設 ID
 * @param presetAngle 預設角度
 * @returns 光源配置
 */
export function createLightingFromPreset(
  presetId: string,
  presetAngle: number
): {
  keyLight: LightSource;
  fillLight: LightSource;
  rimLight: { elevation: number; color: string; intensity: number };
} {
  // 根據不同預設調整仰角
  const elevationMap: Record<string, number> = {
    'rembrandt': 45,
    'butterfly': 60,
    'split': 0,
    'loop': 30,
    'rim': -15,
    'clamshell': 45,
    'broad': 30,
    'short': 30,
    'flat': 0,
    'high_key': 60
  };
  
  const keyElevation = elevationMap[presetId] ?? 30;
  
  return {
    keyLight: {
      azimuth: presetAngle,
      elevation: keyElevation,
      color: '#ffffff',
      intensity: 80
    },
    fillLight: {
      azimuth: (presetAngle + 180) % 360,
      elevation: keyElevation * 0.5,
      color: '#cbd5e1',
      intensity: 30
    },
    rimLight: {
      elevation: 45,
      color: '#ffffff',
      intensity: 50
    }
  };
}
