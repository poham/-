
// CategoryType 已移除 - 視覺風格現在由 StyleConfig.visualStyle 控制

export interface ElementPlacement {
  id: string;
  elementName: string;  // "頭部", "左手", "Logo" 等
  position: string;     // "top_center_region", "bottom_left_intersection" 等
}

export interface CompositionConfig {
  rule: string;
  focal_point: string;
  alignment: string;
  elementPlacements?: ElementPlacement[];  // 元素配置陣列
}

export interface CameraConfig {
  shotType: string;
  angle: string;
  aspectRatio: string;
  lens: string;
  roll: number;
  composition: CompositionConfig;
  // 新增：數值化的攝影機角度控制
  cameraAzimuth?: number;   // 方位角 -180° to 180° (0° 為正面，±180° 為背面)
  cameraElevation?: number; // 仰角 -90° to 90° (垂直角度)
  // 新增：取景模式（自動偵測、商品模式、人像模式）
  framingMode?: 'auto' | 'product' | 'portrait';  // 預設為 'auto'
  // 新增：攝影模式（商業攝影 vs 技術攝影）
  photographyMode?: 'commercial' | 'technical';  // 預設為 'commercial'
  // 新增：尺度模式（大遠景專用：寫實 vs 巨物）
  scaleMode?: 'realistic' | 'surreal';  // 預設為 'realistic'
  // 新增：特殊 POV 模式（自拍、手持等特殊拍攝方式）
  povMode?: string;  // 'selfie', 'handheld', 'first-person', 'gopro', 等
}

export interface LightSource {
  azimuth: number;      // 方位角 0-360° (水平旋轉，正視圖)
  elevation: number;    // 仰角 -90° to 90° (垂直高度，側視圖)
  color: string;        // 顏色 (hex)
  intensity: number;    // 強度 0-100
  styleDescription?: string;  // 自訂光質描述（可選）
}

export interface OpticsConfig {
  dof: string;
  
  // 新的獨立光源控制
  keyLight: LightSource;
  fillLight: LightSource;
  rimLight: LightSource;  // 改為完整的 LightSource，可以手動控制方位角
  
  ambientColor: string;
  studioSetup: string;
  source: string;
  mood: string;
  useAdvancedLighting: boolean;
  
  // 向後兼容的舊欄位（保留以支援現有預設）
  lightColor?: string;
  lightIntensity?: number;
  lightRotation?: number;
  fillLightColor?: string;
  fillLightIntensity?: number;
  rimLightColor?: string;
  rimLightIntensity?: number;
}

export interface StyleConfig {
  visualStyle: string;  // 新增：視覺風格（Cinematic, Hyper-Realistic, Anime 等）
  mood: string;         // 從 OpticsConfig 移過來：情緒與大氣描述
  postProcessing: string[];
  filmStyle: string;
  grain: string;
  vignette: boolean;
}

export interface PromptState {
  camera: CameraConfig;
  subject: {
    type: string;
    description: string;
    materials: string[];
    tags: string[];
    view_angle: string;
    key_feature: string;
  };
  background: {
    description: string;
    environment: string;
    tags: string[];
    bgColor?: string; 
  };
  optics: OpticsConfig;
  style: StyleConfig;
  thumbnail?: string; 
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: PromptState;
  series?: string;
  thumbnail?: string;
}

export interface TagGroup {
  name: string;
  tags: string[];
}

export interface ShotTypeOption {
  label: string;  // 顯示在 UI 的名稱（中英文）
  value: string;  // 實際送給 AI 的 Prompt 描述
}

export interface CustomTags {
  subject: string[];
  background: string[];
  cameraAngle: string[];
  mood: string[];
  style: string[];
  colors: string[]; // 自訂顏色庫（hex 格式）
}

export interface SidebarState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
}

// ============================================================
// 鏡頭-角度相容性系統類型定義
// ============================================================

/**
 * Prompt 優先級層級
 * 定義 Prompt 組件的排序順序，越小的數字優先級越高
 */
export enum PromptPriorityLevel {
  SPECIAL_OPTICS = 1,      // 特殊光學（魚眼、微距）
  EXTREME_DISTANCE = 2,    // 極端距離（大遠景）
  PHYSICAL_ANGLE = 3,      // 物理視角（蟲視、鳥瞰）
  LENS_FOCAL = 4,          // 鏡頭焦段（長焦、廣角）
  SUBJECT_STYLE = 5        // 主體與風格
}

/**
 * 警告類型
 */
export enum WarningType {
  CONFLICT = 'conflict',        // 物理衝突（紅色）
  SUBOPTIMAL = 'suboptimal',    // 效果不佳（橘色）
  SUGGESTION = 'suggestion'     // 建議（藍色）
}

/**
 * 相容性警告
 */
export interface CompatibilityWarning {
  type: WarningType;
  message: string;
  suggestion?: string;
  affectedParams: string[];
}

/**
 * 自動修正動作
 */
export interface AutoCorrection {
  action: 'add' | 'remove' | 'replace';
  target: string;
  value?: string;
  reason: string;
}

/**
 * 相容性檢查結果
 */
export interface CompatibilityCheckResult {
  isCompatible: boolean;
  warnings: CompatibilityWarning[];
  autoCorrections: AutoCorrection[];
  priorityOrder: PromptPriorityLevel[];
}

/**
 * 鏡頭類型
 */
export type LensType = 'fisheye' | 'wide' | 'normal' | 'telephoto' | 'macro';

/**
 * 角度類型（基於 elevation）
 */
export type AngleType = 'worms-eye' | 'low' | 'eye-level' | 'high' | 'birds-eye';
