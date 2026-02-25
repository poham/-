/**
 * Visual Translators Module
 * 
 * This module converts technical photography parameters (numerical angles, hex codes, 
 * focal lengths) into visual descriptions that AI image generation models can interpret.
 * 
 * All translation functions are pure functions with no side effects, making them
 * fully testable and deterministic.
 */

import { PromptState } from '../types';
import { getCameraAngleDescription } from './cameraAngleDescriptions';
import { checkCompatibility, applyPrioritySorting } from './lensAngleCompatibility';
import { generateCompleteLightingPrompt, generateStructuredLightingInfo } from './lightingPromptGenerator';

/**
 * 判斷是否為微距模式
 * 微距模式會徹底改變主體定義和詞序邏輯
 */
function isMacroMode(shotType: string): boolean {
  const shotLower = shotType.toLowerCase();
  return shotLower.includes('macro') || 
         shotLower.includes('微距') || 
         shotLower.includes('極致特寫') ||
         shotLower.includes('extreme close');
}

/**
 * 判斷是否為大遠景模式
 * 大遠景模式會改變主體尺度和空間邏輯，避免「哥吉拉效應」
 */
function isWideMode(shotType: string): boolean {
  const shotLower = shotType.toLowerCase();
  return shotLower.includes('大遠景') || 
         shotLower.includes('極遠景') ||
         shotLower.includes('very long shot') || 
         shotLower.includes('extreme long shot') ||
         shotLower.includes('vls') ||
         shotLower.includes('xls');
}

/**
 * 大遠景模式下的視角轉譯
 * 將普通的「看哪一面」轉換為「空間透視線」
 * 
 * @param azimuth - 方位角
 * @param elevation - 仰角
 * @param scaleMode - 尺度模式（寫實 vs 巨物）
 * @returns 大遠景專用的視角描述
 */
function translateWideAngle(
  azimuth: number, 
  elevation: number, 
  scaleMode: 'realistic' | 'surreal'
): string {
  const absElevation = Math.abs(elevation);
  
  // 正規化方位角
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  const absAzimuth = Math.abs(normalized);
  
  if (scaleMode === 'realistic') {
    // 寫實模式：強調空間的遼闊感
    if (absElevation <= 10 && absAzimuth <= 15) {
      return 'centered horizon line, symmetrical space, balanced composition, orthographic-like perspective';
    } else if (elevation < -30) {
      return 'low horizon line, endless floor surface, vast ceiling space, expansive vertical dimension';
    } else if (elevation > 60) {
      return 'high altitude aerial view, geometric floor pattern layout, map-like perspective, bird\'s eye overview';
    } else if (elevation > 30) {
      return 'elevated perspective, revealing spatial layout, architectural overview';
    } else if (elevation < -10) {
      return 'low perspective, ground-level view, emphasizing vertical space, sky dominates';
    } else {
      return 'natural horizon line, balanced spatial composition, environmental context';
    }
  } else {
    // 巨物模式：強調主體的壓迫感
    if (absElevation <= 10 && absAzimuth <= 15) {
      return 'frontal monumentality, imposing presence, centered dominance, symmetrical power';
    } else if (elevation < -30) {
      return 'low angle looking up, towering structure, dramatic scale, monumental presence looming overhead';
    } else if (elevation > 60) {
      return 'overhead view of colossal structure, dwarfing surroundings, god\'s eye perspective on giant';
    } else if (elevation > 30) {
      return 'elevated view of massive structure, revealing scale, architectural monumentality';
    } else if (elevation < -10) {
      return 'upward gaze at giant structure, imposing scale, dramatic foreshortening';
    } else {
      return 'eye-level view of monumental structure, human scale dwarfed, surreal juxtaposition';
    }
  }
}

/**
 * 大遠景模式下的主體修正
 * 根據尺度模式，將主體微小化（寫實）或巨大化（巨物）
 * 
 * @param subjectType - 原始主體類型
 * @param scaleMode - 尺度模式（寫實 vs 巨物）
 * @param subjectDescription - 自定義主體描述
 * @returns 大遠景專用的主體描述
 */
function translateWideSubject(
  subjectType: string, 
  scaleMode: 'realistic' | 'surreal',
  subjectDescription: string
): string {
  const parts: string[] = [];
  
  if (scaleMode === 'realistic') {
    // 寫實模式：強制把主體形容得「很小」
    parts.push(`a tiny, solitary ${subjectType} placed in the distance`);
    parts.push('small object in vast environment');
    parts.push('minimalist composition');
    
    // 如果有自定義描述，也要加上「遠處」的修飾
    if (subjectDescription) {
      parts.push(`distant ${subjectDescription}`);
    }
  } else {
    // 巨物模式：強制把主體形容得「很大」
    parts.push(`a colossal ${subjectType} towering like a skyscraper`);
    parts.push('monumental structure');
    parts.push('larger than life');
    parts.push('giant structure dominating the landscape');
    
    // 如果有自定義描述，也要加上「巨大」的修飾
    if (subjectDescription) {
      parts.push(`colossal ${subjectDescription}`);
    }
  }
  
  return parts.join(', ');
}

/**
 * 微距模式下的視角轉譯
 * 將普通的「看哪一面」轉換為「紋理起伏方向」
 * 
 * @param azimuth - 方位角
 * @param elevation - 仰角
 * @returns 微距專用的視角描述
 */
function translateMacroAngle(azimuth: number, elevation: number): string {
  const absElevation = Math.abs(elevation);
  
  // 正規化方位角
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  const absAzimuth = Math.abs(normalized);
  
  // 微距模式下，視角決定「光線如何呈現質感」
  if (absElevation <= 10 && absAzimuth <= 15) {
    // 正面平視 → 平面細節
    return 'flat lay detail, texture fills the frame, straight-on focus, orthographic-like perspective';
  } else if (elevation < -30) {
    // 極低角度 → 側掠光，強調表面起伏
    return 'raking light from below, exhibiting surface relief, mountain-like texture landscape, dramatic shadows across fibers';
  } else if (elevation > 60) {
    // 極高角度 → 頂視圖，平面紋理
    return 'top-down macro view, flat texture pattern, knolling-style arrangement, even illumination';
  } else if (elevation > 30) {
    // 高角度 → 俯視紋理
    return 'overhead angle, revealing texture depth, three-dimensional surface detail';
  } else if (elevation < -10) {
    // 低角度 → 側掠光
    return 'low raking angle, side-lit texture, emphasizing surface irregularities, fiber peaks catching light';
  } else {
    // 標準角度 → 自然紋理呈現
    return 'natural angle, balanced texture illumination, revealing material structure';
  }
}

/**
 * 微距模式下的主體修正
 * 將整體主體轉換為局部材質描述
 * 
 * @param subjectType - 原始主體類型
 * @param materials - 材質列表
 * @returns 微距專用的主體描述
 */
function translateMacroSubject(subjectType: string, materials: string[]): string {
  const parts: string[] = [];
  
  // 如果有材質，聚焦於材質紋理
  if (materials && materials.length > 0) {
    const materialTextures = materials.map(mat => {
      const matLower = mat.toLowerCase();
      
      // 布料類
      if (matLower.includes('linen') || matLower.includes('亞麻')) {
        return 'rough linen weave pattern, visible fiber texture, fabric grain structure';
      } else if (matLower.includes('cotton') || matLower.includes('棉')) {
        return 'soft cotton fiber detail, woven thread pattern, textile surface';
      } else if (matLower.includes('silk') || matLower.includes('絲')) {
        return 'smooth silk surface, subtle sheen, fine thread structure';
      } else if (matLower.includes('leather') || matLower.includes('皮革')) {
        return 'leather grain texture, pore detail, natural surface irregularities';
      }
      
      // 木材類
      else if (matLower.includes('wood') || matLower.includes('木')) {
        return 'wood grain pores, cellular structure, natural fiber lines';
      }
      
      // 金屬類
      else if (matLower.includes('metal') || matLower.includes('金屬')) {
        return 'metal surface micro-scratches, machining marks, reflective texture';
      } else if (matLower.includes('gold') || matLower.includes('金')) {
        return 'gold surface detail, polished texture, metallic grain';
      } else if (matLower.includes('silver') || matLower.includes('銀')) {
        return 'silver surface patina, oxidation detail, metallic texture';
      }
      
      // 玻璃/陶瓷類
      else if (matLower.includes('glass') || matLower.includes('玻璃')) {
        return 'glass surface imperfections, micro-bubbles, transparent texture';
      } else if (matLower.includes('ceramic') || matLower.includes('陶瓷')) {
        return 'ceramic glaze texture, surface crackle pattern, fired finish detail';
      }
      
      // 塑膠類
      else if (matLower.includes('plastic') || matLower.includes('塑膠')) {
        return 'plastic surface texture, molding marks, synthetic material detail';
      }
      
      // 石材類
      else if (matLower.includes('stone') || matLower.includes('石')) {
        return 'stone surface grain, mineral structure, natural rock texture';
      } else if (matLower.includes('marble') || matLower.includes('大理石')) {
        return 'marble veining detail, crystalline structure, polished stone surface';
      }
      
      // 紙張類
      else if (matLower.includes('paper') || matLower.includes('紙')) {
        return 'paper fiber texture, pulp structure, surface grain';
      }
      
      // 食物類
      else if (matLower.includes('food') || matLower.includes('食物')) {
        return 'food surface texture, cellular structure, organic detail';
      }
      
      // 預設
      return `${mat} surface texture, material detail, microscopic structure`;
    });
    
    parts.push(...materialTextures);
  } else {
    // 沒有材質時，根據主體類型推測
    const subjectLower = subjectType.toLowerCase();
    
    if (subjectLower.includes('racket') || subjectLower.includes('球拍')) {
      parts.push('focusing on the rough linen weave pattern of the racket surface, fiber texture detail');
    } else if (subjectLower.includes('bottle') || subjectLower.includes('瓶')) {
      parts.push('focusing on the glass surface texture, micro-imperfections, label fiber detail');
    } else if (subjectLower.includes('watch') || subjectLower.includes('手錶')) {
      parts.push('focusing on the metal surface micro-scratches, dial texture, material grain');
    } else {
      parts.push(`focusing heavily on the surface texture of ${subjectType}, material detail, microscopic structure`);
    }
  }
  
  return parts.join(', ');
}

/**
 * 判斷是否為商品攝影
 * 根據主體類型關鍵字來判斷
 */
function isProductPhotography(subjectType: string): boolean {
  const lowerType = subjectType.toLowerCase();
  
  // 商品相關關鍵字
  const productKeywords = [
    'product', '商品', '產品', '物件', '靜物',
    // 容器類
    '瓶', '罐', '包裝', '容器', '器皿', 'bottle', 'can', 'jar', 'container',
    // 食物飲品
    '食物', '飲品', '炸雞', '咖啡', '拿鐵', 'food', 'drink', 'beverage', 'chicken', 'coffee',
    // 常見商品
    '香水', '乳霜', '化妝品', '手錶', '鞋', '包', 'perfume', 'cream', 'watch', 'shoe', 'bag',
    // 工具器材
    '鐵鎚', '開瓶器', '摩卡壺', '球拍', 'hammer', 'opener', 'racket'
  ];
  
  return productKeywords.some(keyword => lowerType.includes(keyword));
}

/**
 * 決定取景模式（商品或人像）
 * 考慮手動設定和自動偵測
 * 
 * @param framingMode - 手動設定的取景模式 ('auto' | 'product' | 'portrait')
 * @param subjectType - 主體類型（用於自動偵測）
 * @returns true 表示商品模式，false 表示人像模式
 */
function determineProductMode(framingMode: string | undefined, subjectType: string): boolean {
  if (framingMode === 'product') return true;
  if (framingMode === 'portrait') return false;
  // framingMode === 'auto' or undefined
  return isProductPhotography(subjectType);
}

/**
 * Interface for translated prompt components organized by the golden order:
 * [Composition + Subject] + [Environment] + [Lighting/Mood] + [Style/Quality]
 */
export interface TranslatedPromptComponents {
  /** Shot type + camera angle + lens perspective description (DEPRECATED - use detailed fields below) */
  composition: string;
  
  /** Detailed composition breakdown */
  compositionDetailed?: {
    povMode?: string;           // 特殊 POV 模式
    cameraPosition: string;     // 攝影機位置與角度
    lensOptics: string;         // 鏡頭光學特性
    shotType: string;           // 景別描述
    depthOfField?: string;      // 景深效果
    compositionRule?: string;   // 構圖規則
    visualStyle?: string;       // 視覺風格
  };
  
  /** Subject description including orientation and key features */
  subject: string;
  
  /** Background/environment description */
  environment: string;
  
  /** Translated lighting setup with visual descriptions */
  lighting: string;
  
  /** Detailed lighting breakdown */
  lightingDetailed?: {
    presetName?: string;        // Preset 名稱（僅在 Perfect Match 時）
    geometry?: string;          // 幾何描述或物理位置
    keyLight?: string;          // 主光設定
    fillLight?: string;         // 補光設定
    rimLight?: string;          // 輪廓光設定
    style?: string;             // 風格描述
  };
  
  /** Mood description */
  mood: string;
  
  /** Post-processing and style tags */
  style: string;
  
  /** Compatibility check result (optional, for UI display) */
  compatibility?: import('../types').CompatibilityCheckResult;
}

/**
 * Structured composition breakdown for educational/debugging purposes
 * Separates physical spatial relationships from optical rendering effects
 */
export interface StructuredCompositionBreakdown {
  readme: string;
  composition_breakdown: {
    spatial_geometry: {
      description: string;
      camera_position: string[];
      subject_framing: string[];
    };
    optical_rendering: {
      description: string;
      lens_perspective: string[];
      depth_of_field_relationship: string[];
    };
  };
  final_prompt: string;
}

/**
 * Generic translator function type
 */
export type TranslatorFunction<T> = (input: T) => string;

/**
 * Main translation orchestrator that converts a complete PromptState
 * into visual descriptions following the golden order.
 * 
 * This is a pure function with no side effects.
 * 
 * @param state - Complete prompt state from the application
 * @returns Translated prompt components ready for assembly
 */
export function translatePromptState(state: PromptState): TranslatedPromptComponents {
  try {
    // ============================================================
    // 相容性檢查 (Compatibility Check) - Phase 2 Integration
    // ============================================================
    // 在翻譯前執行相容性檢查，獲取警告和自動修正建議
    const compatibilityResult = checkCompatibility(state);
    
    // ============================================================
    // 微距模式檢測 (Macro Override Mode Detection)
    // ============================================================
    const isMacro = isMacroMode(state.camera.shotType);
    
    // ============================================================
    // 大遠景模式檢測 (Wide Shot Override Mode Detection)
    // ============================================================
    const isWide = isWideMode(state.camera.shotType);
    
    // 判斷是否為商品攝影（考慮手動模式和自動偵測）
    const isProduct = determineProductMode(state.camera.framingMode, state.subject.type);
    
    // ============================================================
    // 微距優先模式 (Macro Override Mode)
    // ============================================================
    if (isMacro) {
      // 微距模式下的特殊詞序邏輯
      const compositionParts: string[] = [];
      
      // 第一順位（篡位者）：尺度定義 (Scale Definition)
      compositionParts.push('EXTREME MACRO CLOSE-UP, 1:1 MACRO DETAIL, MICROSCOPIC VIEW');
      
      // 第二順位：視角轉譯（光影與起伏）
      if (state.camera.cameraAzimuth !== undefined && state.camera.cameraElevation !== undefined) {
        const macroAngle = translateMacroAngle(state.camera.cameraAzimuth, state.camera.cameraElevation);
        compositionParts.push(macroAngle);
      }
      
      // 第三順位：景深效果（微距必然極淺）
      compositionParts.push('depth of field falls off rapidly, millimeter-thin focus plane, background completely dissolved');
      
      // 第四順位：視覺風格（最後）
      if (state.style.visualStyle) {
        compositionParts.push(state.style.visualStyle.toLowerCase());
      }
      
      const composition = compositionParts.join(', ');
      
      // 主體描述：強制聚焦於材質細節
      const macroSubject = translateMacroSubject(state.subject.type, state.subject.materials);
      const subjectParts: string[] = [macroSubject];
      
      // 添加自定義描述（如果有）
      if (state.subject.description) {
        subjectParts.push(state.subject.description);
      }
      
      // 添加標籤
      if (state.subject.tags && state.subject.tags.length > 0) {
        subjectParts.push(state.subject.tags.join(', '));
      }
      
      const subject = subjectParts.join(', ');
      
      // 環境描述（微距下環境通常不重要，但保留）
      const environmentParts: string[] = [];
      if (state.background.description) {
        environmentParts.push(state.background.description);
      }
      if (state.background.environment) {
        environmentParts.push(state.background.environment);
      }
      const environment = environmentParts.length > 0 ? environmentParts.join(' ') : 'neutral background, out of focus';
      
      // 燈光描述（微距下強調紋理照明）- 只在啟用進階燈光時
      let lighting = '';
      if (state.optics.useAdvancedLighting) {
        const lightingParts: string[] = [];
        lightingParts.push('controlled macro lighting, texture-revealing illumination');
        
        // 簡化的燈光描述
        if (state.optics.keyLight.intensity > 0) {
          lightingParts.push(`key light at ${state.optics.keyLight.intensity}% intensity`);
        }
        lighting = lightingParts.join(', ');
      }
      // 如果 useAdvancedLighting 為 false，lighting 保持空字串
      
      // Mood 和 Style
      const mood = state.style.mood || 'clinical precision';
      const styleParts: string[] = [];
      if (state.style.postProcessing && state.style.postProcessing.length > 0) {
        styleParts.push(...state.style.postProcessing);
      }
      const style = styleParts.length > 0 ? styleParts.join(', ') : 'ultra-sharp detail';
      
      return {
        composition,
        subject,
        environment,
        lighting,
        mood,
        style,
        compatibility: compatibilityResult,
      };
    }
    
    // ============================================================
    // 大遠景優先模式 (Wide Shot Override Mode)
    // ============================================================
    if (isWide) {
      // 大遠景模式下的特殊詞序邏輯
      const scaleMode = state.camera.scaleMode || 'realistic'; // 預設為寫實模式
      const compositionParts: string[] = [];
      
      // 第一順位（篡位者）：尺度定義 + 空間強調 (Scale Definition + Spatial Emphasis)
      if (scaleMode === 'realistic') {
        compositionParts.push('EXTREME WIDE ESTABLISHING SHOT, massive scale environment, negative space composition, realistic proportions');
      } else {
        compositionParts.push('EXTREME WIDE ESTABLISHING SHOT, surreal fantasy scale, dreamlike atmosphere, monumental composition');
      }
      
      // 第二順位：視角轉譯（空間透視線）
      if (state.camera.cameraAzimuth !== undefined && state.camera.cameraElevation !== undefined) {
        const wideAngle = translateWideAngle(
          state.camera.cameraAzimuth, 
          state.camera.cameraElevation,
          scaleMode
        );
        compositionParts.push(wideAngle);
      }
      
      // 第五順位：視覺風格（最後）
      if (state.style.visualStyle) {
        compositionParts.push(state.style.visualStyle.toLowerCase());
      }
      
      const composition = compositionParts.join(', ');
      
      // 第三順位：主體修正（尺度調整）
      const wideSubject = translateWideSubject(
        state.subject.type,
        scaleMode,
        state.subject.description
      );
      
      // 添加標籤（如果有）
      const subjectParts: string[] = [wideSubject];
      if (state.subject.tags && state.subject.tags.length > 0) {
        subjectParts.push(state.subject.tags.join(', '));
      }
      const subject = subjectParts.join(', ');
      
      // 第四順位：環境描述（空間感）
      const environmentParts: string[] = [];
      if (scaleMode === 'realistic') {
        environmentParts.push('vast empty space, expansive environment, environmental storytelling');
      } else {
        environmentParts.push('surrounding landscape dwarfed by scale, environmental context for size comparison');
      }
      
      // 添加背景描述
      if (state.background.description) {
        environmentParts.push(state.background.description);
      }
      if (state.background.environment) {
        environmentParts.push(state.background.environment);
      }
      if (state.background.tags && state.background.tags.length > 0) {
        environmentParts.push(state.background.tags.join(', '));
      }
      
      const environment = environmentParts.join(', ');
      
      // 燈光和 Mood（大遠景下通常不重要）- 只在啟用進階燈光時
      let lighting = '';
      if (state.optics.useAdvancedLighting && state.optics.source) {
        lighting = state.optics.source;
      }
      const mood = state.style.mood || 'epic scale';
      const styleParts: string[] = [];
      if (state.style.postProcessing && state.style.postProcessing.length > 0) {
        styleParts.push(...state.style.postProcessing);
      }
      const style = styleParts.length > 0 ? styleParts.join(', ') : '';
      
      return {
        composition,
        subject,
        environment,
        lighting,
        mood,
        style,
        compatibility: compatibilityResult,
      };
    }
    
    // ============================================================
    // 標準模式 (Standard Mode) - 原有邏輯
    // ============================================================
    // SLOT SYSTEM: 結構化的 Composition 組裝
    // ============================================================
    // [Slot 1: 鏡頭景別] + [Slot 2: 相機位置與角度] + [Slot 3: 鏡頭光學特性] + [Slot 4: 構圖規則與景深效果]
    
    // SLOT 1: 鏡頭景別 (Shot Scale)
    const shotTypeDesc = translateShotType(
      state.camera.shotType,
      state.subject.type,
      isProduct
    );
    
    // SLOT 1.5: 特殊 POV 模式 (Special POV Mode)
    // 如果有設定特殊 POV 模式，這會成為最優先的描述
    let povModeDesc: string | null = null;
    if (state.camera.povMode) {
      povModeDesc = state.camera.povMode;
    }
    
    // SLOT 2: 相機實體位置與角度動作 (Camera Position & Angle)
    let cameraPositionDesc: string;
    const photographyMode = state.camera.photographyMode || 'commercial';
    
    if (state.camera.cameraAzimuth !== undefined && state.camera.cameraElevation !== undefined) {
      // 使用數值化的角度描述
      cameraPositionDesc = getCameraAngleDescription(
        state.camera.cameraAzimuth, 
        state.camera.cameraElevation,
        false  // includeVisualDetails
      );
      
      // Add roll translation if roll is non-zero
      // 技術模式：只在 roll > 5° 時才提及
      // 商業模式：roll > 0° 就提及
      const rollThreshold = photographyMode === 'technical' ? 5 : 0;
      if (Math.abs(state.camera.roll) > rollThreshold) {
        const rollDescription = translateCameraRoll(state.camera.roll);
        if (rollDescription) {
          cameraPositionDesc = `${cameraPositionDesc}, ${rollDescription}`;
        }
      }
    } else {
      // 向後兼容：使用舊的文字描述
      cameraPositionDesc = translateCameraAngle(state.camera.angle, state.camera.roll);
    }
    
    // SLOT 3: 鏡頭光學特性 (Lens Optics / FOV)
    // 根據 elevation 角度動態調整鏡頭描述（應用透視補償邏輯）
    // 但尊重相容性系統的優先級：特殊光學（魚眼、微距）永遠優先
    let lensOpticsDesc: string;
    const elevation = state.camera.cameraElevation ?? 0;
    const absElevation = Math.abs(elevation);
    
    // 檢查是否為特殊光學（魚眼、微距）
    const lensLower = state.camera.lens.toLowerCase();
    const isSpecialOptics = lensLower.includes('魚眼') || 
                           lensLower.includes('fisheye') || 
                           lensLower.includes('8mm') ||
                           isMacro; // 微距模式已在上面檢測
    
    if (isSpecialOptics) {
      // 特殊光學優先：不被角度覆蓋
      lensOpticsDesc = translateFocalLength(state.camera.lens);
    } else if (absElevation > 60) {
      // 極端角度（> 60°）：強制廣角透視（僅適用於標準鏡頭）
      lensOpticsDesc = 'wide angle lens, dramatic foreshortening, dynamic perspective';
    } else if (absElevation > 45) {
      // 高角度（45° ~ 60°）：明顯透視變形
      lensOpticsDesc = 'wide angle perspective, strong foreshortening, dynamic angle';
    } else if (absElevation > 30) {
      // 中等角度（30° ~ 45°）：適度透視
      lensOpticsDesc = 'moderate wide angle, natural foreshortening';
    } else {
      // 標準視角（< 30°）：使用原始鏡頭描述
      lensOpticsDesc = translateFocalLength(state.camera.lens);
    }
    
    // SLOT 4: 構圖規則與景深效果 (Composition Rules & DOF)
    const compositionExtras: string[] = [];
    
    // Add composition rule context
    if (state.camera.composition.rule) {
      const ruleLower = state.camera.composition.rule.toLowerCase();
      if (ruleLower.includes('rule of thirds') || ruleLower.includes('三分法')) {
        compositionExtras.push('using rule of thirds grid');
      } else if (ruleLower.includes('golden ratio') || ruleLower.includes('黃金比例')) {
        compositionExtras.push('using golden ratio composition');
      } else if (ruleLower.includes('center') || ruleLower.includes('中央')) {
        compositionExtras.push('using centered composition');
      }
    }
    
    // Add depth of field (camera optical effect)
    if (state.optics.dof) {
      const dofTranslated = translateAperture(state.optics.dof, state.camera.shotType, state.camera.lens);
      compositionExtras.push(`creating ${dofTranslated}`);
    }
    
    // Add element placements if present
    if (state.camera.composition.elementPlacements && 
        state.camera.composition.elementPlacements.length > 0) {
      const placements = state.camera.composition.elementPlacements
        .map(ep => `${ep.elementName} at ${translatePosition(ep.position)}`)
        .join(', ');
      compositionExtras.push(`element placement: ${placements}`);
    }
    
    // ============================================================
    // 組裝 Composition 字串（按照黃金詞序）
    // ============================================================
    // 黃金法則：特殊 POV → 物理視角 → 鏡頭光學 → 景別構圖 → 風格氣氛
    // 原因：AI 必須先知道「拍攝方式」（POV），再「架好攝影機」（物理位置），才能決定「如何渲染」（風格）
    // 
    // 格式：[POV Mode], camera positioned at [Position & Angle], using [Lens Optics], [Shot Scale], [Composition Extras], [Visual Style]
    const compositionParts: string[] = [];
    
    // 第零順位：特殊 POV 模式（如果有）
    if (povModeDesc) {
      compositionParts.push(povModeDesc);
    }
    
    // 第一順位：相機物理位置與角度（使用 "camera positioned at" 前綴來明確區分）
    compositionParts.push(`camera positioned at ${cameraPositionDesc}`);
    
    // 第二順位：鏡頭光學特性（使用 "using" 前綴）
    compositionParts.push(`using ${lensOpticsDesc}`);
    
    // 第三順位：景別描述
    compositionParts.push(shotTypeDesc);
    
    // 第四順位：構圖規則和景深效果
    if (compositionExtras.length > 0) {
      compositionParts.push(compositionExtras.join(', '));
    }
    
    // 第五順位：視覺風格（最後才告訴 AI 用什麼風格渲染）
    if (state.style.visualStyle) {
      compositionParts.push(state.style.visualStyle);
    }
    
    // ============================================================
    // 應用優先級排序 (Apply Priority Sorting) - Phase 2 Integration
    // ============================================================
    // 根據相容性檢查結果，重新排序 composition 組件
    const sortedCompositionParts = applyPrioritySorting(
      compositionParts,
      compatibilityResult.priorityOrder
    );
    
    const composition = sortedCompositionParts.join(', ');
    
    // Subject description (includes orientation and features)
    const subjectParts: string[] = [];
    if (state.subject.type) {
      subjectParts.push(state.subject.type);
    }
    
    // Add materials with "in" preposition for clarity
    if (state.subject.materials && state.subject.materials.length > 0) {
      subjectParts.push(`in ${state.subject.materials.join(' and ')}`);
    }
    
    // Add custom description
    if (state.subject.description) {
      subjectParts.push(state.subject.description);
    }
    
    // view_angle and tags are now reference data only, not added to prompt
    // Camera angles are handled in camera section
    // Users can manually add any tags they want in the description field
    
    const subject = subjectParts.join(', ');
    
    // Environment description with clear color labeling
    const environmentParts: string[] = [];
    
    // Add scene description first
    if (state.background.description) {
      environmentParts.push(state.background.description);
    }
    if (state.background.environment) {
      environmentParts.push(state.background.environment);
    }
    if (state.background.tags && state.background.tags.length > 0) {
      environmentParts.push(state.background.tags.join(', '));
    }
    
    // Note: bgColor is no longer automatically added to prompt
    // Users can manually add color descriptions via the color picker tool in BackgroundSection
    // This allows for more flexible color descriptions (e.g., "left side blue, right side white")
    
    const environment = environmentParts.join(' ');
    
    // ============================================================
    // 燈光系統 (Lighting System) - 使用新的參數驅動系統
    // ============================================================
    let lighting = '';
    let lightingDetailed: TranslatedPromptComponents['lightingDetailed'] = undefined;
    
    // 只有在啟用進階燈光時才生成燈光描述
    if (state.optics.useAdvancedLighting) {
      // 如果有選擇 Preset，使用新的參數驅動系統
      if (state.optics.studioSetup && state.optics.studioSetup !== 'none') {
        lighting = generateCompleteLightingPrompt(
          state.optics.keyLight,
          state.optics.fillLight,
          state.optics.rimLight,
          state.optics.studioSetup,
          isProduct  // 傳入產品模式標記
        );
        
        // 生成結構化燈光資訊
        lightingDetailed = generateStructuredLightingInfo(
          state.optics.keyLight,
          state.optics.fillLight,
          state.optics.rimLight,
          state.optics.studioSetup,
          isProduct
        );
      } else {
        // 向後兼容：沒有 Preset 時使用舊系統
        const lightingParts: string[] = [];
        
        // Add lighting source if present
        if (state.optics.source) {
          lightingParts.push(state.optics.source);
        }
        
        // Add ambient color if present (labeled as ambient to distinguish from background)
        if (state.optics.ambientColor) {
          const ambientColorFull = translateColorHex(state.optics.ambientColor);
          const ambientColorName = ambientColorFull.split(',')[0];
          lightingParts.push(`${ambientColorName.toLowerCase()} ambient light`);
        }
        
        lighting = lightingParts.join(', ');
      }
    }
    // 如果 useAdvancedLighting 為 false，lighting 保持空字串
    
    // Mood description (unchanged from original)
    const mood = state.style.mood || '';
    
    // Style description (post-processing and rendering quality only)
    // Note: visualStyle is now used as Composition prefix, not here
    const styleParts: string[] = [];
    
    // Add post-processing tags (藝術後製協定)
    if (state.style.postProcessing && state.style.postProcessing.length > 0) {
      styleParts.push(...state.style.postProcessing);
    }
    
    // Add film style if not "None"
    if (state.style.filmStyle && state.style.filmStyle !== 'None') {
      styleParts.push(state.style.filmStyle);
    }
    
    // Add grain if not "None"
    if (state.style.grain && state.style.grain !== 'None') {
      styleParts.push(`${state.style.grain.toLowerCase()} grain`);
    }
    
    // Add vignette if enabled
    if (state.style.vignette) {
      styleParts.push('lens vignette');
    }
    
    const style = styleParts.length > 0 ? styleParts.join(', ') : '';
    
    // 提取景深效果（從 compositionExtras 中）
    let depthOfFieldText = '';
    if (state.optics.dof) {
      const dofTranslated = translateAperture(state.optics.dof, state.camera.shotType, state.camera.lens);
      depthOfFieldText = `creating ${dofTranslated}`;
    }
    
    // 提取構圖規則
    let compositionRuleText = '';
    if (state.camera.composition.rule) {
      const ruleLower = state.camera.composition.rule.toLowerCase();
      if (ruleLower.includes('rule of thirds') || ruleLower.includes('三分法')) {
        compositionRuleText = 'using rule of thirds grid';
      } else if (ruleLower.includes('golden ratio') || ruleLower.includes('黃金比例')) {
        compositionRuleText = 'using golden ratio composition';
      } else if (ruleLower.includes('center') || ruleLower.includes('中央')) {
        compositionRuleText = 'using centered composition';
      }
    }
    
    return {
      composition,
      compositionDetailed: {
        povMode: povModeDesc || undefined,
        cameraPosition: `camera positioned at ${cameraPositionDesc}`,
        lensOptics: `using ${lensOpticsDesc}`,
        shotType: shotTypeDesc,
        depthOfField: depthOfFieldText || undefined,
        compositionRule: compositionRuleText || undefined,
        visualStyle: state.style.visualStyle || undefined
      },
      subject,
      environment,
      lighting,
      lightingDetailed,
      mood,
      style,
      compatibility: compatibilityResult,
    };
    
  } catch (error) {
    console.error('Error translating prompt state:', error);
    
    // Fallback: return minimal descriptions to prevent complete failure
    return {
      composition: state.camera.shotType || '',
      subject: state.subject.description || '',
      environment: state.background.description || '',
      lighting: state.optics.source || '',
      mood: state.style.mood || '',
      style: state.style.postProcessing?.join(', ') || '',
    };
  }
}

/**
 * Translates focal length values to pure optical terminology.
 * Uses precise photographic lens characteristics instead of subjective descriptions.
 * 
 * @param lens - Lens string from FOCAL_LENGTHS constant (e.g., "50mm 標準")
 * @returns Optical perspective description using professional lens terminology
 * 
 * @example
 * translateFocalLength("50mm 標準") 
 * // Returns: "Standard lens perspective, zero distortion, rectilinear projection"
 * 
 * translateFocalLength("35mm 廣角")
 * // Returns: "Wide-angle lens perspective, moderate barrel distortion, expanded spatial depth"
 */
export function translateFocalLength(lens: string): string {
  try {
    // Extract numerical focal length from string (e.g., "50mm 標準" -> 50)
    const match = lens.match(/(\d+)mm/);
    if (!match) {
      console.warn(`Unable to parse focal length: ${lens}`);
      return lens; // Fallback to original
    }
    
    const focalLength = parseInt(match[1]);
    
    // Map focal length ranges to pure optical descriptions
    if (focalLength === 8) {
      // Ultra-wide fisheye (8mm)
      return 'Fisheye lens perspective, extreme barrel distortion, 180-degree field of view, spherical projection';
    } else if (focalLength >= 14 && focalLength <= 16) {
      // Ultra-wide rectilinear (14-16mm)
      return 'Ultra-wide-angle lens perspective, pronounced barrel distortion, exaggerated spatial depth, dramatic foreground emphasis';
    } else if (focalLength >= 18 && focalLength <= 24) {
      // Wide-angle (18-24mm)
      return 'Wide-angle lens perspective, noticeable barrel distortion, expanded spatial depth, environmental context';
    } else if (focalLength >= 28 && focalLength <= 35) {
      // Moderate wide-angle (28-35mm)
      return 'Moderate wide-angle lens perspective, slight barrel distortion, natural spatial relationships, documentary style';
    } else if (focalLength >= 40 && focalLength <= 50) {
      // Standard lens (40-50mm)
      return 'Standard lens perspective, zero distortion, rectilinear projection, neutral spatial rendering';
    } else if (focalLength >= 55 && focalLength <= 70) {
      // Short telephoto (55-70mm)
      return 'Short telephoto lens perspective, minimal compression, slight subject isolation, flattering proportions';
    } else if (focalLength >= 85 && focalLength <= 105) {
      // Portrait telephoto (85-105mm)
      return 'Portrait telephoto lens perspective, moderate compression, subject-background separation, flattering facial proportions';
    } else if (focalLength >= 135 && focalLength <= 180) {
      // Medium telephoto (135-180mm)
      return 'Medium telephoto lens perspective, strong compression, flattened depth planes, isolated subject';
    } else if (focalLength >= 200) {
      // Super telephoto (200mm+)
      return 'Super telephoto lens perspective, extreme compression, collapsed spatial depth, stacked background layers, narrow field of view';
    } else {
      // Fallback for unexpected values (e.g., 51-54mm, 71-84mm, 106-134mm, 201-299mm)
      console.warn(`Unexpected focal length value: ${focalLength}mm`);
      return lens;
    }
  } catch (error) {
    console.error(`Error translating focal length: ${error}`);
    return lens; // Fallback to original
  }
}

/**
 * Translates azimuth/elevation angles to directional lighting descriptions.
 * 
 * @param azimuth - Horizontal rotation angle (0-360 degrees)
 * @param elevation - Vertical angle (-90 to 90 degrees)
 * @param lightType - Type of light source (Key, Fill, or Rim)
 * @returns Directional description without numerical degree values
 * 
 * @example
 * translateLightDirection(45, 30, 'Key')
 * // Returns: "Side lighting from upper angle, dimensional shadows, sculptural quality"
 */
export function translateLightDirection(
  azimuth: number,
  elevation: number,
  lightType: 'Key' | 'Fill' | 'Rim'
): string {
  try {
    // Validate and clamp inputs
    const validAzimuth = Math.max(0, Math.min(360, azimuth));
    const validElevation = Math.max(-90, Math.min(90, elevation));
    
    // Determine elevation zone first (takes priority for extreme angles)
    let elevationDesc = '';
    if (validElevation >= 70) {
      return 'Top-down lighting, overhead illumination, downward shadows';
    } else if (validElevation <= -70) {
      return 'Upward lighting, dramatic underlighting, theatrical effect';
    }
    
    // Determine azimuth zone
    let azimuthDesc = '';
    let shadowDesc = '';
    
    // Normalize azimuth to 0-360 range
    const normalizedAzimuth = ((validAzimuth % 360) + 360) % 360;
    
    // 修正：與 UI 視覺一致 - 180° = 正前方，0° = 正後方
    if (normalizedAzimuth >= 165 && normalizedAzimuth <= 195) {
      // Front lighting (180° ± 15°)
      azimuthDesc = 'Front lighting';
      shadowDesc = 'minimal shadows, flat appearance';
    } else if (normalizedAzimuth >= 210 && normalizedAzimuth <= 240) {
      // Side from upper angle (左前方)
      azimuthDesc = 'Side lighting from upper angle';
      shadowDesc = 'dimensional shadows, sculptural quality';
    } else if (normalizedAzimuth >= 255 && normalizedAzimuth <= 285) {
      // Hard side / split lighting (270° ± 15°，左側)
      azimuthDesc = 'Hard side lighting';
      shadowDesc = 'split lighting effect, high contrast';
    } else if (normalizedAzimuth >= 300 && normalizedAzimuth <= 330) {
      // Three-quarter back (左後方)
      azimuthDesc = 'Three-quarter back lighting';
      shadowDesc = 'edge highlights, dramatic shadows';
    } else if ((normalizedAzimuth >= 345 && normalizedAzimuth <= 360) || (normalizedAzimuth >= 0 && normalizedAzimuth <= 15)) {
      // Backlit / rim lighting (0° ± 15°，正後方)
      azimuthDesc = 'Backlit';
      shadowDesc = 'rim lighting, silhouette effect, halo glow';
    } else if (normalizedAzimuth >= 30 && normalizedAzimuth <= 60) {
      // Three-quarter back (右後方)
      azimuthDesc = 'Three-quarter back lighting';
      shadowDesc = 'edge highlights, dramatic shadows';
    } else if (normalizedAzimuth >= 75 && normalizedAzimuth <= 105) {
      // Hard side (90° ± 15°，右側)
      azimuthDesc = 'Hard side lighting';
      shadowDesc = 'split lighting effect, high contrast';
    } else if (normalizedAzimuth >= 120 && normalizedAzimuth <= 150) {
      // Side from upper angle (右前方)
      azimuthDesc = 'Side lighting from upper angle';
      shadowDesc = 'dimensional shadows, sculptural quality';
    } else {
      // Default fallback
      azimuthDesc = 'Angled lighting';
      shadowDesc = 'directional shadows';
    }
    
    // Combine azimuth and elevation descriptions
    if (validElevation >= 40 && validElevation < 70) {
      elevationDesc = 'from upper angle';
    } else if (validElevation >= 20 && validElevation < 40) {
      elevationDesc = 'slightly elevated';
    } else if (validElevation >= -10 && validElevation < 20) {
      elevationDesc = 'at eye level';
    } else if (validElevation >= -30 && validElevation < -10) {
      elevationDesc = 'from low angle';
    } else if (validElevation >= -60 && validElevation < -30) {
      elevationDesc = 'from upward angle';
    }
    
    // Construct final description
    if (elevationDesc) {
      return `${azimuthDesc} ${elevationDesc}, ${shadowDesc}`;
    } else {
      return `${azimuthDesc}, ${shadowDesc}`;
    }
    
  } catch (error) {
    console.error(`Error translating light direction: ${error}`);
    return `${lightType} light at ${azimuth}° azimuth, ${elevation}° elevation`;
  }
}

/**
 * Translates hex color codes to named colors with visual associations.
 * 
 * @param hexColor - Hex color code (e.g., "#FF5733", "#1E90FF")
 * @returns Named color with visual association and temperature description
 * 
 * @example
 * translateColorHex("#FF5733")
 * // Returns: "Vivid orange-red, warm color temperature, like magma"
 */
export function translateColorHex(hexColor: string): string {
  try {
    // Remove # if present and validate hex format
    const hex = hexColor.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      console.warn(`Invalid hex color format: ${hexColor}`);
      return hexColor; // Fallback to original
    }
    
    // Parse hex to RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;
    
    // Calculate lightness
    const lightness = (max + min) / 2;
    
    // Calculate saturation
    let saturation = 0;
    if (delta !== 0) {
      saturation = delta / (1 - Math.abs(2 * lightness - 1));
    }
    
    // Calculate hue
    let hue = 0;
    if (delta !== 0) {
      if (max === rNorm) {
        hue = 60 * (((gNorm - bNorm) / delta) % 6);
      } else if (max === gNorm) {
        hue = 60 * ((bNorm - rNorm) / delta + 2);
      } else {
        hue = 60 * ((rNorm - gNorm) / delta + 4);
      }
    }
    
    // Normalize hue to 0-360 range
    if (hue < 0) {
      hue += 360;
    }
    
    // Handle white/neutral colors specially
    if (saturation < 0.1 && lightness > 0.9) {
      return 'Pure white, neutral color temperature';
    }
    
    if (saturation < 0.1 && lightness > 0.7) {
      return 'Soft light gray, neutral color temperature, like overcast sky';
    }
    
    if (saturation < 0.1 && lightness < 0.3) {
      return 'Deep charcoal gray, neutral color temperature, like storm clouds';
    }
    
    if (saturation < 0.1) {
      return 'Muted gray, neutral color temperature, like concrete';
    }
    
    // Determine color family from hue angle
    let colorName = '';
    let visualReference = '';
    let temperature = '';
    
    if (hue >= 0 && hue < 15) {
      // Red
      colorName = 'red';
      visualReference = 'like magma';
      temperature = 'warm';
    } else if (hue >= 15 && hue < 30) {
      // Red-Orange
      colorName = 'red-orange';
      visualReference = 'like sunset';
      temperature = 'warm';
    } else if (hue >= 30 && hue < 45) {
      // Orange
      colorName = 'orange';
      visualReference = 'like persimmon';
      temperature = 'warm';
    } else if (hue >= 45 && hue < 60) {
      // Orange-Yellow
      colorName = 'orange-yellow';
      visualReference = 'like autumn leaves';
      temperature = 'warm';
    } else if (hue >= 60 && hue < 75) {
      // Yellow
      colorName = 'yellow';
      visualReference = 'like sunlight';
      temperature = 'warm';
    } else if (hue >= 75 && hue < 105) {
      // Yellow-Green
      colorName = 'yellow-green';
      visualReference = 'like spring grass';
      temperature = 'neutral';
    } else if (hue >= 105 && hue < 135) {
      // Green
      colorName = 'green';
      visualReference = 'like forest canopy';
      temperature = 'cool';
    } else if (hue >= 135 && hue < 165) {
      // Green-Cyan
      colorName = 'green-cyan';
      visualReference = 'like tropical water';
      temperature = 'cool';
    } else if (hue >= 165 && hue < 195) {
      // Cyan
      colorName = 'cyan';
      visualReference = 'like shallow ocean';
      temperature = 'cool';
    } else if (hue >= 195 && hue < 225) {
      // Cyan-Blue
      colorName = 'cyan-blue';
      visualReference = 'like clear sky';
      temperature = 'cool';
    } else if (hue >= 225 && hue < 255) {
      // Blue
      colorName = 'blue';
      visualReference = 'like ocean depths';
      temperature = 'cool';
    } else if (hue >= 255 && hue < 285) {
      // Blue-Purple
      colorName = 'blue-purple';
      visualReference = 'like twilight sky';
      temperature = 'cool';
    } else if (hue >= 285 && hue < 315) {
      // Purple
      colorName = 'purple';
      visualReference = 'like lavender';
      temperature = 'cool';
    } else if (hue >= 315 && hue < 345) {
      // Purple-Magenta
      colorName = 'purple-magenta';
      visualReference = 'like orchid';
      temperature = 'cool';
    } else {
      // Magenta-Red
      colorName = 'magenta-red';
      visualReference = 'like rose petals';
      temperature = 'warm';
    }
    
    // Determine intensity descriptors from saturation
    let intensityDesc = '';
    if (saturation >= 0.8) {
      intensityDesc = 'Vivid';
    } else if (saturation >= 0.6) {
      intensityDesc = 'Intense';
    } else if (saturation >= 0.4) {
      intensityDesc = 'Saturated';
    } else if (saturation >= 0.2) {
      intensityDesc = 'Soft';
    } else {
      intensityDesc = 'Muted';
    }
    
    // Adjust for lightness extremes
    if (lightness > 0.8) {
      intensityDesc = 'Pale';
    } else if (lightness < 0.2) {
      intensityDesc = 'Deep';
    }
    
    // Construct final description
    return `${intensityDesc} ${colorName}, ${temperature} color temperature, ${visualReference}`;
    
  } catch (error) {
    console.error(`Error translating color hex: ${error}`);
    return hexColor; // Fallback to original
  }
}

/**
 * Translates cinema shot type abbreviations to body-part or view-angle descriptions.
 * 
 * @param shotType - Shot type from SHOT_TYPES constant (string or ShotTypeOption.label)
 * @param subjectType - Subject type (person, product, etc.)
 * @param isProduct - Optional explicit product mode flag (overrides auto-detection)
 * @returns Body-part description for people or view-angle description for products
 * 
 * @example
 * translateShotType("中景/腰上 (Chest Shot)", "person")
 * // Returns: "Waist-up shot, torso and arms visible"
 * 
 * translateShotType("標準商品視角 (Standard Product View)", "product", true)
 * // Returns: "Standard Product View, Full product fits comfortably within the frame boundaries..."
 */
export function translateShotType(shotType: string, subjectType: string, isProduct?: boolean): string {
  try {
    // 如果明確提供 isProduct 參數，使用它；否則使用自動偵測
    const useProductMode = isProduct !== undefined ? isProduct : isProductPhotography(subjectType);
    
    // For products, map shot types to view angles
    if (useProductMode) {
      // 新的商品景別格式：檢查是否包含完整的 prompt 描述
      // 如果 shotType 包含特定關鍵字，表示是新格式，直接返回
      const lowerShotType = shotType.toLowerCase();
      if (lowerShotType.includes('composition') || 
          lowerShotType.includes('frame boundaries') || 
          lowerShotType.includes('negative space') ||
          lowerShotType.includes('environmental') ||
          lowerShotType.includes('extreme macro detail') ||
          lowerShotType.includes('wide-angle perspective') ||
          lowerShotType.includes('cropped composition') ||
          lowerShotType.includes('breathing room')) {
        // 這是新格式的完整 prompt，直接返回
        return shotType;
      }
      
      // 舊格式的商品景別翻譯（向後兼容）
      // Map shot types to product-specific view descriptions
      // Check more specific patterns first to avoid false matches
      if (shotType.includes('微距') || shotType.includes('Macro')) {
        return 'Extreme close-up, magnified details, shallow depth of field';
      } else if (shotType.includes('極致特寫') || shotType.includes('ECU') || shotType.includes('Extreme Close-up')) {
        return 'Extreme close-up, product details, tight framing';
      } else if (shotType.includes('頂視') || shotType.includes('俯視') || shotType.includes('Top-Down')) {
        return 'Flat lay, top-down view, knolling arrangement';
      } else if (shotType.includes('中特寫') || shotType.includes('Bust')) {
        return 'Medium close-up, product centered, key features visible';
      } else if (shotType.includes('中遠景') || shotType.includes('Knee')) {
        return 'Medium shot, product with context, environmental elements';
      } else if (shotType.includes('中景') || shotType.includes('Chest')) {
        return 'Medium shot, product fully visible, balanced composition';
      } else if (shotType.includes('極遠景') || shotType.includes('XLS') || shotType.includes('Extreme Long Shot')) {
        return 'Wide environmental shot, product in context, lifestyle setting';
      } else if (shotType.includes('大遠景') || shotType.includes('VLS') || shotType.includes('Very Long Shot')) {
        return 'Full product view, complete form visible, environmental context';
      } else if (shotType.includes('遠景') || shotType.includes('Full Body')) {
        return 'Full product view, complete form visible, environmental context';
      } else if (shotType.includes('特寫') || shotType.includes('Close-up') || shotType.includes('CU')) {
        return 'Close-up, product details prominent, tight framing';
      } else {
        // Fallback for unknown product shot types
        console.warn(`Unknown product shot type: ${shotType}`);
        return 'Product view, centered composition';
      }
    }
    
    // For people, map shot types to body-part descriptions
    // Check more specific patterns first to avoid false matches
    if (shotType.includes('微距') || shotType.includes('Macro')) {
      return 'Extreme close-up, magnified details, shallow depth of field';
    } else if (shotType.includes('極致特寫') || shotType.includes('ECU') || shotType.includes('Extreme Close-up')) {
      return 'Eyes and facial features only, intimate framing';
    } else if (shotType.includes('頂視') || shotType.includes('俯視') || shotType.includes('Top-Down')) {
      return 'Top-down view, overhead perspective, bird\'s eye angle';
    } else if (shotType.includes('中特寫') || shotType.includes('Bust')) {
      return 'Head and shoulders portrait, upper chest visible';
    } else if (shotType.includes('中遠景') || shotType.includes('Knee')) {
      return 'Three-quarter body shot, from knees up';
    } else if (shotType.includes('中景') || shotType.includes('Chest')) {
      return 'Waist-up shot, torso and arms visible';
    } else if (shotType.includes('極遠景') || shotType.includes('XLS') || shotType.includes('Extreme Long Shot')) {
      return 'Distant view, subject small in frame, vast environment';
    } else if (shotType.includes('大遠景') || shotType.includes('VLS') || shotType.includes('Very Long Shot')) {
      return 'Full figure with surrounding environment, establishing shot';
    } else if (shotType.includes('遠景') || shotType.includes('Full Body')) {
      return 'Full body shot, head to toe, showing shoes';
    } else if (shotType.includes('特寫') || shotType.includes('Close-up') || shotType.includes('CU')) {
      return 'Face filling frame, from chin to forehead';
    } else {
      // Fallback for unknown shot types
      console.warn(`Unknown shot type: ${shotType}`);
      return shotType;
    }
  } catch (error) {
    console.error(`Error translating shot type: ${error}`);
    return shotType; // Fallback to original
  }
}

/**
 * Translates camera roll degrees to AI-friendly visual descriptions.
 * Maps numerical roll values to natural language keywords that AI models understand.
 * 
 * @param roll - Camera roll in degrees (-180 to 180)
 * @returns Visual description of the roll effect, or empty string if roll is 0
 * 
 * @example
 * translateCameraRoll(0) // Returns: ""
 * translateCameraRoll(10) // Returns: "slightly tilted, off-axis, off-balance"
 * translateCameraRoll(45) // Returns: "Dutch angle, canted angle, diagonal composition"
 * translateCameraRoll(90) // Returns: "sideways, rotated 90 degrees, vertical orientation"
 * translateCameraRoll(180) // Returns: "upside down, inverted"
 * translateCameraRoll(-30) // Returns: "Dutch angle, canted angle, diagonal composition, counter-clockwise"
 */
export function translateCameraRoll(roll: number): string {
  try {
    // Normalize roll to -180 to 180 range
    let normalizedRoll = roll % 360;
    if (normalizedRoll > 180) {
      normalizedRoll -= 360;
    } else if (normalizedRoll < -180) {
      normalizedRoll += 360;
    }
    
    // No roll = no description needed (check after normalization)
    if (normalizedRoll === 0) {
      return '';
    }
    
    // Get absolute value for range checking
    const absRoll = Math.abs(normalizedRoll);
    
    // Determine directional keyword
    const direction = normalizedRoll > 0 ? 'clockwise' : 'counter-clockwise';
    
    // Map degree ranges to AI-friendly keywords
    let rollDescription = '';
    
    if (absRoll >= 170 && absRoll <= 180) {
      // Inverted (180° ± 10°)
      rollDescription = 'upside down, inverted';
    } else if (absRoll >= 80 && absRoll <= 100) {
      // Strong tilt / 90° rotation (90° ± 10°)
      rollDescription = 'sideways, rotated 90 degrees, vertical orientation';
    } else if (absRoll >= 30 && absRoll < 80) {
      // Medium tilt / Dutch angle (30-79°)
      rollDescription = `Dutch angle, canted angle, diagonal composition, ${direction}`;
    } else if (absRoll > 100 && absRoll < 170) {
      // Between 90° and 180° (100-169°)
      rollDescription = `Dutch angle, canted angle, diagonal composition, ${direction}`;
    } else if (absRoll >= 5 && absRoll < 30) {
      // Micro tilt (5-29°)
      rollDescription = `slightly tilted, off-axis, off-balance, ${direction}`;
    } else {
      // Very small tilt (1-4°) - barely noticeable
      rollDescription = `subtle tilt, ${direction}`;
    }
    
    return rollDescription;
    
  } catch (error) {
    console.error(`Error translating camera roll: ${error}`);
    return `tilted at ${roll} degrees`; // Fallback to numerical description
  }
}

/**
 * Translates camera angle selections to visual viewpoint descriptions.
 * 
 * @param angle - Camera angle from CAMERA_ANGLE_TAGS
 * @param roll - Camera roll in degrees
 * @returns Viewpoint description, with roll translation if roll is non-zero
 * 
 * @example
 * translateCameraAngle("High Angle", 0)
 * // Returns: "High angle view, looking down, subject appears smaller"
 * 
 * translateCameraAngle("Eye Level", 15)
 * // Returns: "Eye-level perspective, neutral viewpoint, natural horizon, slightly tilted, off-axis, off-balance, clockwise"
 */
export function translateCameraAngle(angle: string, roll: number): string {
  try {
    let baseDescription = '';
    
    // Map camera angle selections to viewpoint descriptions
    // Check for specific angle patterns (case-insensitive, handle both English and Chinese)
    const angleLower = angle.toLowerCase();
    
    if (angleLower.includes('eye level') || angleLower.includes('水平視角')) {
      baseDescription = 'Eye-level perspective, neutral viewpoint, natural horizon';
    } else if (angleLower.includes('high angle') || angleLower.includes('高角度')) {
      baseDescription = 'High angle view, looking down, subject appears smaller';
    } else if (angleLower.includes('low angle') || angleLower.includes('低角度')) {
      baseDescription = 'Low angle view, looking up, subject appears powerful';
    } else if (angleLower.includes('bird') || angleLower.includes('鳥瞰')) {
      baseDescription = 'Bird\'s eye view, directly overhead, top-down perspective';
    } else if (angleLower.includes('worm') || angleLower.includes('蟲視')) {
      baseDescription = 'Worm\'s eye view, extreme low angle, dramatic upward perspective';
    } else if (angleLower.includes('top-down') || angleLower.includes('垂直俯視')) {
      baseDescription = 'Top-down view, directly overhead, flat perspective';
    } else if (angleLower.includes('ground level') || angleLower.includes('地面視角')) {
      baseDescription = 'Ground level view, low perspective, immersive viewpoint';
    } else if (angleLower.includes('waist level') || angleLower.includes('腰部高度')) {
      baseDescription = 'Waist-level perspective, mid-height viewpoint';
    } else if (angleLower.includes('knee level') || angleLower.includes('膝蓋高度')) {
      baseDescription = 'Knee-level perspective, low viewpoint, child\'s eye view';
    } else if (angleLower.includes('shoulder height') || angleLower.includes('肩膀高度')) {
      baseDescription = 'Shoulder-height perspective, natural standing viewpoint';
    } else if (angleLower.includes('chest level') || angleLower.includes('胸部高度')) {
      baseDescription = 'Chest-level perspective, comfortable viewpoint';
    } else if (angleLower.includes('over-the-shoulder') || angleLower.includes('過肩鏡頭')) {
      baseDescription = 'Over-the-shoulder perspective, following viewpoint';
    } else if (angleLower.includes('handheld') || angleLower.includes('手持感')) {
      baseDescription = 'Handheld perspective, dynamic natural movement';
    } else if (angleLower.includes('looking up') || angleLower.includes('仰視')) {
      baseDescription = 'Looking up perspective, upward gaze, subject appears dominant';
    } else if (angleLower.includes('looking down') || angleLower.includes('俯視')) {
      baseDescription = 'Looking down perspective, downward gaze, subject appears diminished';
    } else if (angleLower.includes('drone view') || angleLower.includes('無人機視角')) {
      baseDescription = 'Drone view, aerial perspective, elevated overview';
    } else if (angleLower.includes('dutch angle') || angleLower.includes('荷蘭式傾斜') || 
               angleLower.includes('canted') || angleLower.includes('傾斜') || 
               angleLower.includes('tilted') || angleLower.includes('微傾')) {
      // If the angle itself mentions Dutch/canted/tilted, include that in base description
      baseDescription = 'Tilted perspective, canted frame, dynamic composition';
    } else {
      // Fallback for unknown angles
      console.warn(`Unknown camera angle: ${angle}`);
      baseDescription = angle;
    }
    
    // Add roll translation if roll is non-zero
    const rollDescription = translateCameraRoll(roll);
    if (rollDescription) {
      return `${baseDescription}, ${rollDescription}`;
    }
    
    return baseDescription;
    
  } catch (error) {
    console.error(`Error translating camera angle: ${error}`);
    return angle; // Fallback to original
  }
}

/**
 * Translates studio lighting preset IDs to visual characteristic descriptions.
 * 
 * @param setupId - Studio setup ID from STUDIO_SETUPS constant
 * @returns Visual lighting pattern description
 * 
 * @example
 * translateStudioSetup("rembrandt")
 * // Returns: "Rembrandt lighting, triangle catchlight on cheek, dramatic chiaroscuro"
 */
export function translateStudioSetup(setupId: string): string {
  try {
    // Map studio setup IDs to visual characteristic descriptions
    // Based on classic portrait lighting patterns
    const setupMap: Record<string, string> = {
      'rembrandt': 'Rembrandt lighting, triangle catchlight on cheek, dramatic chiaroscuro',
      'butterfly': 'Butterfly lighting, nose shadow, glamour beauty lighting',
      'split': 'Split lighting, half-lit face, high contrast, dramatic shadows',
      'loop': 'Loop lighting, small nose shadow, natural dimensional portrait',
      'rim': 'Rim lighting, backlit edge glow, silhouette effect, halo',
      'clamshell': 'Clamshell lighting, soft even illumination, minimal shadows',
      'high_key': 'High-key lighting, bright overexposed background, clean airy feel',
      'broad': 'Broad lighting, wide face lighting, fuller appearance',
      'short': 'Short lighting, narrow lighting, slimming effect, shadow side facing camera',
      'flat': 'Flat lighting, even lighting, minimal shadows, commercial photography',
      'manual': 'Custom manual lighting setup'
    };
    
    // Normalize setupId to lowercase for case-insensitive matching
    const normalizedId = setupId.toLowerCase().trim();
    
    // Return mapped description or fallback to original
    if (setupMap[normalizedId]) {
      return setupMap[normalizedId];
    } else {
      console.warn(`Unknown studio setup ID: ${setupId}`);
      return setupId; // Fallback to original
    }
    
  } catch (error) {
    console.error(`Error translating studio setup: ${error}`);
    return setupId; // Fallback to original
  }
}

/**
 * Translates light intensity percentages to qualitative brightness descriptions.
 * 
 * @param intensity - Intensity percentage (0-100)
 * @param lightType - Type of light (Key, Fill, Rim)
 * @returns Qualitative brightness description without numerical percentage
 * 
 * @example
 * translateLightIntensity(80, "Key")
 * // Returns: "Strong Key light, prominent illumination, clear shadows"
 */
export function translateLightIntensity(intensity: number, lightType: string): string {
  try {
    // Validate and clamp intensity to 0-100 range
    const validIntensity = Math.max(0, Math.min(100, intensity));
    
    // Map intensity ranges to qualitative descriptions
    if (validIntensity >= 0 && validIntensity <= 20) {
      return `Subtle ${lightType}, barely visible, ambient level`;
    } else if (validIntensity >= 21 && validIntensity <= 40) {
      return `Soft ${lightType}, gentle illumination, low contrast`;
    } else if (validIntensity >= 41 && validIntensity <= 60) {
      return `Moderate ${lightType}, balanced lighting, natural appearance`;
    } else if (validIntensity >= 61 && validIntensity <= 80) {
      return `Strong ${lightType}, prominent illumination, clear shadows`;
    } else {
      // 81-100
      return `Intense ${lightType}, powerful lighting, high contrast, dramatic`;
    }
  } catch (error) {
    console.error(`Error translating light intensity: ${error}`);
    return `${lightType} at ${intensity}%`; // Fallback to original
  }
}

/**
 * Translates f-stop values to visual depth of field descriptions.
 * Now considers shot type and lens focal length for context-aware descriptions.
 * 
 * @param aperture - Aperture string (e.g., "f/2.8", "f/11")
 * @param shotType - Shot type (optional, for context)
 * @param lens - Lens focal length (optional, for context)
 * @returns Depth of field description without f-stop number
 * 
 * @example
 * translateAperture("f/2.8", "微距 (Macro Shot)", "85mm 人像")
 * // Returns: "Extremely shallow depth of field, millimeter-thin focus plane, subject isolation, background completely dissolved"
 * 
 * translateAperture("f/11", "遠景 (Long Shot / LS)", "24mm 廣角")
 * // Returns: "Deep depth of field, sharp throughout scene, environmental storytelling, everything in focus"
 */
export function translateAperture(aperture: string, shotType?: string, lens?: string): string {
  try {
    // Extract f-stop value from aperture string (e.g., "f/2.8" -> 2.8)
    const match = aperture.match(/f\/(\d+\.?\d*)/i);
    if (!match) {
      console.warn(`Unable to parse aperture value: ${aperture}`);
      return aperture; // Fallback to original
    }
    
    const fStop = parseFloat(match[1]);
    
    // Determine shot distance context from shot type
    let distanceContext: 'macro' | 'close' | 'medium' | 'far' = 'medium';
    if (shotType) {
      const shotLower = shotType.toLowerCase();
      if (shotLower.includes('macro') || shotLower.includes('微距') || 
          shotLower.includes('extreme close') || shotLower.includes('極致特寫')) {
        distanceContext = 'macro';
      } else if (shotLower.includes('close') || shotLower.includes('特寫') || 
                 shotLower.includes('bust') || shotLower.includes('中特寫')) {
        distanceContext = 'close';
      } else if (shotLower.includes('long shot') || shotLower.includes('遠景') || 
                 shotLower.includes('extreme long') || shotLower.includes('極遠景') ||
                 shotLower.includes('very long') || shotLower.includes('大遠景')) {
        distanceContext = 'far';
      }
    }
    
    // Determine focal length context from lens
    let focalContext: 'wide' | 'normal' | 'tele' = 'normal';
    if (lens) {
      const focalMatch = lens.match(/(\d+)mm/);
      if (focalMatch) {
        const focalLength = parseInt(focalMatch[1]);
        if (focalLength <= 35) {
          focalContext = 'wide';
        } else if (focalLength >= 85) {
          focalContext = 'tele';
        }
      }
    }
    
    // Map aperture ranges to depth of field descriptions with context awareness
    if (fStop >= 1.2 && fStop <= 2.0) {
      // Ultra-wide aperture
      if (distanceContext === 'macro') {
        return 'Extremely shallow depth of field, millimeter-thin focus plane, subject isolation, background completely dissolved';
      } else if (distanceContext === 'close') {
        return 'Extremely shallow depth of field, creamy bokeh, eyes sharp while nose softens, dreamy background blur';
      } else if (distanceContext === 'far') {
        return 'Shallow depth of field, subject separation from environment, soft background blur, cinematic look';
      } else {
        return 'Extremely shallow depth of field, creamy bokeh, subject isolation';
      }
    } else if (fStop >= 2.8 && fStop <= 4.0) {
      // Wide aperture
      if (distanceContext === 'macro') {
        return 'Very shallow depth of field, product details sharp, background melts away, premium commercial look';
      } else if (distanceContext === 'close') {
        return 'Shallow depth of field, face sharp with soft background, portrait separation, professional look';
      } else if (distanceContext === 'far') {
        return 'Moderate depth of field, subject clear with environmental context, balanced sharpness';
      } else {
        return 'Shallow depth of field, soft background blur, subject separation';
      }
    } else if (fStop >= 5.6 && fStop <= 8.0) {
      // Medium aperture
      if (distanceContext === 'macro') {
        return 'Moderate depth of field, product fully sharp, background softly blurred, e-commerce photography';
      } else if (distanceContext === 'close') {
        return 'Moderate depth of field, entire face sharp, natural portrait look, commercial photography';
      } else if (distanceContext === 'far') {
        return 'Deep depth of field, subject and environment both sharp, storytelling context, documentary style';
      } else {
        return 'Moderate depth of field, balanced sharpness, natural focus falloff';
      }
    } else if (fStop >= 11 && fStop <= 16) {
      // Narrow aperture
      if (distanceContext === 'macro') {
        return 'Deep depth of field, entire product sharp front to back, technical photography, catalog quality';
      } else if (distanceContext === 'close') {
        return 'Deep depth of field, face and shoulders all sharp, group portrait clarity, editorial style';
      } else if (distanceContext === 'far') {
        return 'Maximum depth of field, sharp from foreground to infinity, landscape photography, architectural clarity';
      } else {
        return 'Deep depth of field, sharp foreground and background, landscape focus';
      }
    } else if (fStop >= 22) {
      // Very narrow aperture
      if (distanceContext === 'macro') {
        return 'Maximum depth of field, microscopic sharpness throughout, scientific photography, extreme detail';
      } else if (distanceContext === 'close') {
        return 'Maximum depth of field, everything tack sharp, technical portrait, maximum clarity';
      } else if (distanceContext === 'far') {
        return 'Hyperfocal depth of field, infinite sharpness, landscape photography, everything in focus from near to far';
      } else {
        return 'Maximum depth of field, everything in focus, tack sharp throughout';
      }
    } else {
      // Handle edge cases (f-stops between ranges or below f/1.2)
      if (fStop < 1.2) {
        return 'Extremely shallow depth of field, creamy bokeh, subject isolation';
      } else if (fStop > 2.0 && fStop < 2.8) {
        return 'Shallow depth of field, soft background blur, subject separation';
      } else if (fStop > 4.0 && fStop < 5.6) {
        return 'Moderate depth of field, balanced sharpness, natural focus falloff';
      } else if (fStop > 8.0 && fStop < 11) {
        return 'Moderate depth of field, balanced sharpness, natural focus falloff';
      } else if (fStop > 16 && fStop < 22) {
        return 'Deep depth of field, sharp foreground and background, landscape focus';
      } else {
        console.warn(`Unexpected aperture value: f/${fStop}`);
        return aperture; // Fallback to original
      }
    }
  } catch (error) {
    console.error(`Error translating aperture: ${error}`);
    return aperture; // Fallback to original
  }
}

/**
 * Translates position identifiers to natural language descriptions.
 * 
 * @param position - Position identifier (e.g., "top_left_region", "center", "bottom_right_intersection")
 * @returns Natural language position description
 * 
 * @example
 * translatePosition("top_left_region")
 * // Returns: "upper left area"
 * 
 * translatePosition("center")
 * // Returns: "center"
 * 
 * translatePosition("bottom_right_intersection")
 * // Returns: "lower right power point"
 */
export function translatePosition(position: string): string {
  try {
    // Map position identifiers to natural language descriptions
    const positionMap: Record<string, string> = {
      // Regions (九宮格區域)
      'top_left_region': 'upper left area',
      'top_center_region': 'upper center area',
      'top_right_region': 'upper right area',
      'middle_left_region': 'middle left area',
      'center': 'center',
      'middle_right_region': 'middle right area',
      'bottom_left_region': 'lower left area',
      'bottom_center_region': 'lower center area',
      'bottom_right_region': 'lower right area',
      
      // Intersections (三分法交點 - 視覺焦點)
      'top_left_intersection': 'upper left power point',
      'top_right_intersection': 'upper right power point',
      'bottom_left_intersection': 'lower left power point',
      'bottom_right_intersection': 'lower right power point',
    };
    
    // Normalize position to lowercase for case-insensitive matching
    const normalizedPosition = position.toLowerCase().trim();
    
    // Return mapped description or fallback to cleaned-up original
    if (positionMap[normalizedPosition]) {
      return positionMap[normalizedPosition];
    } else {
      console.warn(`Unknown position identifier: ${position}`);
      // Fallback: clean up underscores and make it readable
      return position.replace(/_/g, ' ').toLowerCase();
    }
    
  } catch (error) {
    console.error(`Error translating position: ${error}`);
    return position.replace(/_/g, ' ').toLowerCase(); // Fallback to cleaned-up original
  }
}

/**
 * Generates a structured breakdown of the composition for educational/debugging purposes.
 * Separates physical spatial relationships from optical rendering effects.
 * 
 * This function is designed for UI display to help users understand how the prompt is structured,
 * NOT for direct AI consumption.
 * 
 * @param state - Complete prompt state from the application
 * @returns Structured breakdown with spatial geometry and optical rendering separated
 */
export function generateStructuredBreakdown(state: PromptState): StructuredCompositionBreakdown {
  const translated = translatePromptState(state);
  const isProduct = determineProductMode(state.camera.framingMode, state.subject.type);
  
  // Extract individual components for structured display
  const shotTypeDesc = translateShotType(state.camera.shotType, state.subject.type, isProduct);
  const lensDesc = translateFocalLength(state.camera.lens);
  
  // Camera position description
  let cameraPositionDesc: string;
  if (state.camera.cameraAzimuth !== undefined && state.camera.cameraElevation !== undefined) {
    cameraPositionDesc = getCameraAngleDescription(
      state.camera.cameraAzimuth,
      state.camera.cameraElevation,
      isProduct
    );
  } else {
    cameraPositionDesc = translateCameraAngle(state.camera.angle, state.camera.roll);
  }
  
  // DOF description
  const dofDesc = state.optics.dof 
    ? translateAperture(state.optics.dof, state.camera.shotType, state.camera.lens)
    : '';
  
  // Parse camera position into components
  const positionParts = cameraPositionDesc.split(',').map(p => p.trim());
  const elevationPart = positionParts[0] || '';
  const azimuthPart = positionParts[1] || '';
  
  // Parse lens description into components
  const lensParts = lensDesc.split(',').map(p => p.trim());
  const lensType = lensParts[0] || '';
  const distortion = lensParts[1] || '';
  const spatialRendering = lensParts.slice(2).join(', ') || '';
  
  // Parse DOF description into components
  const dofParts = dofDesc.split(',').map(p => p.trim());
  const dofSetting = dofParts[0] || '';
  const focusState = dofParts[1] || '';
  const backgroundState = dofParts[2] || '';
  const separation = dofParts[3] || '';
  
  return {
    readme: "此結構將原始提示詞拆解為'物理空間設定'與'光學成像效果'，以釐清攝影機、主體與背景的關係。",
    composition_breakdown: {
      spatial_geometry: {
        description: "物理空間中的幾何關係（東西擺在哪裡）",
        camera_position: [
          `高度關係: ${elevationPart}`,
          `水平角度: ${azimuthPart || '正面朝向'}`,
          `指向: 鏡頭正面朝向主體中心`
        ].filter(p => !p.endsWith(': ')),
        subject_framing: [
          `景別: ${shotTypeDesc}`,
          `構圖: ${state.camera.composition.rule || '自由構圖'}`
        ]
      },
      optical_rendering: {
        description: "鏡頭如何呈現上述空間關係（看起來的效果）",
        lens_perspective: [
          `視角特性: ${lensType}`,
          distortion ? `空間變形: ${distortion}` : '',
          spatialRendering ? `空間感: ${spatialRendering}` : ''
        ].filter(p => p && !p.endsWith(': ')),
        depth_of_field_relationship: [
          dofSetting ? `景深設定: ${dofSetting}` : '',
          focusState ? `焦點狀態: ${focusState}` : '',
          backgroundState ? `背景狀態: ${backgroundState}` : '',
          separation ? `前後關係: ${separation}` : ''
        ].filter(p => p && !p.endsWith(': '))
      }
    },
    final_prompt: translated.composition
  };
}
