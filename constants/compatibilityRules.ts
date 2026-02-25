/**
 * 鏡頭-角度相容性規則定義
 * 
 * 這個檔案定義了所有鏡頭和角度組合的相容性規則，
 * 包含檢測規則、必須添加/移除的關鍵字、衝突檢測等。
 */

import { WarningType, PromptPriorityLevel } from '../types';

// ============================================================
// 鏡頭檢測規則
// ============================================================

/**
 * 鏡頭類型檢測關鍵字
 * 用於從焦距字串中識別鏡頭類型
 */
export const LENS_DETECTION_RULES = {
  fisheye: ['fisheye', '魚眼', '8mm', '10mm'],
  wide: ['wide angle', '廣角', '14mm', '16mm', '18mm', '24mm', '28mm'],
  normal: ['35mm', '50mm', 'normal', '標準'],
  telephoto: ['telephoto', '長焦', '85mm', '100mm', '135mm', '200mm', '300mm'],
  macro: ['macro', '微距', 'extreme close']
};

/**
 * 角度檢測規則（基於 elevation）
 * 返回函數用於判斷角度類型
 */
export const ANGLE_DETECTION_RULES = {
  'worms-eye': (elevation: number) => elevation < -45,
  'low': (elevation: number) => elevation >= -45 && elevation < -15,
  'eye-level': (elevation: number) => elevation >= -15 && elevation <= 15,
  'high': (elevation: number) => elevation > 15 && elevation <= 60,
  'birds-eye': (elevation: number) => elevation > 60
};


// ============================================================
// 魚眼鏡頭相容性規則
// ============================================================

export const FISHEYE_RULES = {
  /**
   * 必須添加的關鍵字
   */
  mustAdd: [
    'centered composition',
    'distorted edges',
    'sphere projection'
  ],
  
  /**
   * 必須移除的關鍵字（物理衝突）
   */
  mustRemove: [
    'architectural',
    'straight lines',
    'zero distortion',
    'perspective correction'
  ],
  
  /**
   * 衝突檢測規則
   */
  conflicts: [
    {
      condition: 'architectural',
      warning: '魚眼鏡頭會產生嚴重變形，不適合建築攝影',
      type: WarningType.CONFLICT
    },
    {
      condition: 'straight lines',
      warning: '魚眼鏡頭無法保持直線，會產生球面扭曲',
      type: WarningType.CONFLICT
    }
  ],
  
  /**
   * 推薦組合
   */
  recommendations: [
    {
      angle: 'worms-eye',
      message: '魚眼 + 蟲視 = 極具張力的視覺效果（90年代饒舌 MV 風格）',
      type: WarningType.SUGGESTION
    },
    {
      angle: 'birds-eye',
      message: '魚眼 + 鳥瞰 = 監視器畫面或大頭狗風格',
      type: WarningType.SUGGESTION
    }
  ]
};


// ============================================================
// 長焦鏡頭相容性規則
// ============================================================

export const TELEPHOTO_RULES = {
  /**
   * 必須添加的關鍵字
   */
  mustAdd: [
    'compressed perspective',
    'flat distinct layers',
    'zero distortion'
  ],
  
  /**
   * 必須移除的關鍵字（物理衝突）
   */
  mustRemove: [
    'dynamic perspective',
    'foreshortening',
    'wide angle',
    'exaggerated depth'
  ],
  
  /**
   * 特殊組合處理
   */
  specialCombinations: [
    {
      angle: 'worms-eye',
      warning: '長焦 + 蟲視會削弱仰角張力，產生「狙擊手視角」',
      type: WarningType.SUBOPTIMAL,
      suggestion: '建議切換為廣角鏡頭以增強透視感',
      autoAdd: ['flattened perspective', 'isometric-like low angle', 'graphic composition']
    },
    {
      angle: 'birds-eye',
      warning: '長焦 + 鳥瞰會產生「衛星地圖視角」',
      type: WarningType.SUGGESTION,
      suggestion: '適合 SimCity 風格的遊戲圖或等距視角',
      autoAdd: ['graphic composition', 'map-like perspective', 'isometric feel']
    }
  ]
};


// ============================================================
// 廣角鏡頭相容性規則
// ============================================================

export const WIDE_ANGLE_RULES = {
  /**
   * 必須添加的關鍵字
   */
  mustAdd: [
    'dynamic perspective',
    'foreshortening',
    'exaggerated depth'
  ],
  
  /**
   * 必須移除的關鍵字（物理衝突）
   */
  mustRemove: [
    'compressed perspective',
    'flat layers',
    'zero distortion'
  ],
  
  /**
   * 推薦組合
   */
  recommendations: [
    {
      angle: 'worms-eye',
      message: '廣角 + 蟲視 = 最佳英雄感與張力',
      type: WarningType.SUGGESTION
    },
    {
      angle: 'birds-eye',
      message: '廣角 + 鳥瞰 = 戲劇性俯視效果',
      type: WarningType.SUGGESTION
    }
  ]
};


// ============================================================
// 微距模式特殊規則
// ============================================================

export const MACRO_RULES = {
  /**
   * 角度轉譯規則
   * 微距模式下，角度的意義從「透視」轉變為「光影與質感起伏」
   */
  angleTranslation: {
    'eye-level': 'flat lay macro, texture pattern scan, orthographic-like perspective',
    'low': 'macro landscape, raking light showing surface relief, mountains of texture, dramatic shadows across fibers',
    'worms-eye': 'raking light from below, exhibiting surface relief, mountain-like texture landscape',
    'high': 'overhead angle, revealing texture depth, three-dimensional surface detail',
    'birds-eye': 'top-down macro view, flat texture pattern, knolling-style arrangement, even illumination'
  },
  
  /**
   * 景深處理規則
   */
  depthOfField: {
    /**
     * 預設行為（物理現實）
     */
    default: [
      'razor thin DoF',
      'millimeter-thin focus plane',
      'background completely dissolved'
    ],
    
    /**
     * 深景深模式（需要焦點合成）
     */
    deepFocus: [
      'f/22 aperture',
      'deep depth of field',
      'focus stacking',
      'entire subject in focus',
      'no blur'
    ]
  }
};


// ============================================================
// 優先級排序規則
// ============================================================

/**
 * 定義每個優先級層級包含的關鍵字
 * 用於排序 Prompt 組件
 */
export const PRIORITY_SORTING_RULES: Record<PromptPriorityLevel, string[]> = {
  [PromptPriorityLevel.SPECIAL_OPTICS]: [
    'EXTREME MACRO',
    'FISHEYE LENS',
    'MICROSCOPIC VIEW',
    '1:1 MACRO DETAIL'
  ],
  [PromptPriorityLevel.EXTREME_DISTANCE]: [
    'EXTREME WIDE SHOT',
    'ESTABLISHING SHOT',
    'VERY LONG SHOT'
  ],
  [PromptPriorityLevel.PHYSICAL_ANGLE]: [
    'WORM\'S EYE',
    'BIRD\'S EYE',
    'OVERHEAD',
    'camera positioned at'
  ],
  [PromptPriorityLevel.LENS_FOCAL]: [
    'telephoto',
    'wide angle',
    '35mm',
    '50mm',
    'using'
  ],
  [PromptPriorityLevel.SUBJECT_STYLE]: [
    'subject',
    'cinematic',
    'lighting',
    'mood'
  ]
};
