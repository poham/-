/**
 * 鏡頭-角度相容性檢查系統
 * 
 * 這個模組負責檢測鏡頭和角度組合的相容性，
 * 自動修正不合理的組合，並提供警告和建議。
 */

import { 
  PromptState, 
  LensType, 
  AngleType, 
  CompatibilityCheckResult,
  CompatibilityWarning,
  AutoCorrection,
  WarningType,
  PromptPriorityLevel
} from '../types';

import {
  LENS_DETECTION_RULES,
  ANGLE_DETECTION_RULES,
  FISHEYE_RULES,
  TELEPHOTO_RULES,
  WIDE_ANGLE_RULES,
  MACRO_RULES,
  PRIORITY_SORTING_RULES
} from '../constants/compatibilityRules';

// ============================================================
// 檢測函數
// ============================================================

/**
 * 檢測鏡頭類型
 * @param focalLength - 焦距字串（如 "35mm", "Telephoto"）
 * @param shotType - 取景類型（用於檢測微距）
 * @returns 鏡頭類型
 */
export function detectLensType(
  focalLength: string, 
  shotType: string
): LensType {
  const lensLower = (focalLength || '').toLowerCase();
  const shotLower = (shotType || '').toLowerCase();
  
  // 優先檢測特殊鏡頭：微距
  if (shotLower.includes('macro') || 
      shotLower.includes('微距') || 
      shotLower.includes('extreme close')) {
    return 'macro';
  }
  
  // 檢測其他鏡頭類型
  for (const [type, keywords] of Object.entries(LENS_DETECTION_RULES)) {
    if (keywords.some(keyword => lensLower.includes(keyword.toLowerCase()))) {
      return type as LensType;
    }
  }
  
  return 'normal';
}

/**
 * 檢測角度類型
 * @param elevation - 仰角（-90 到 90）
 * @returns 角度類型
 */
export function detectAngleType(elevation: number): AngleType {
  for (const [type, checkFn] of Object.entries(ANGLE_DETECTION_RULES)) {
    if (checkFn(elevation)) {
      return type as AngleType;
    }
  }
  return 'eye-level';
}


// ============================================================
// 相容性檢查函數
// ============================================================

/**
 * 檢查魚眼鏡頭相容性
 */
function checkFisheyeCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 檢查衝突關鍵字
  const promptText = JSON.stringify(state).toLowerCase();
  
  FISHEYE_RULES.conflicts.forEach(conflict => {
    if (promptText.includes(conflict.condition)) {
      warnings.push({
        type: conflict.type,
        message: conflict.warning,
        affectedParams: ['lens', 'style']
      });
      
      // 自動移除衝突關鍵字
      corrections.push({
        action: 'remove',
        target: conflict.condition,
        reason: '魚眼鏡頭與此參數物理衝突'
      });
    }
  });
  
  // 自動添加必要關鍵字
  FISHEYE_RULES.mustAdd.forEach(keyword => {
    corrections.push({
      action: 'add',
      target: 'composition',
      value: keyword,
      reason: '魚眼鏡頭必須包含此特性'
    });
  });
  
  // 推薦組合提示
  const recommendation = FISHEYE_RULES.recommendations.find(
    rec => rec.angle === angleType
  );
  
  if (recommendation) {
    warnings.push({
      type: recommendation.type,
      message: recommendation.message,
      suggestion: '這是推薦的組合，無需調整',
      affectedParams: ['lens', 'angle']
    });
  }
  
  return { warnings, corrections };
}


/**
 * 檢查長焦鏡頭相容性
 */
function checkTelephotoCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 自動移除衝突關鍵字
  TELEPHOTO_RULES.mustRemove.forEach(keyword => {
    corrections.push({
      action: 'remove',
      target: keyword,
      reason: '長焦鏡頭會產生壓縮透視，與此關鍵字衝突'
    });
  });
  
  // 自動添加必要關鍵字
  TELEPHOTO_RULES.mustAdd.forEach(keyword => {
    corrections.push({
      action: 'add',
      target: 'lens_description',
      value: keyword,
      reason: '長焦鏡頭的特性描述'
    });
  });
  
  // 檢查特殊組合
  const specialCombo = TELEPHOTO_RULES.specialCombinations.find(
    combo => combo.angle === angleType
  );
  
  if (specialCombo) {
    warnings.push({
      type: specialCombo.type,
      message: specialCombo.warning,
      suggestion: specialCombo.suggestion,
      affectedParams: ['lens', 'angle']
    });
    
    // 自動添加補償關鍵字
    specialCombo.autoAdd.forEach(keyword => {
      corrections.push({
        action: 'add',
        target: 'angle_description',
        value: keyword,
        reason: '補償長焦 + 極端角度的視覺效果'
      });
    });
  }
  
  return { warnings, corrections };
}


/**
 * 檢查廣角鏡頭相容性
 */
function checkWideAngleCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 自動移除衝突關鍵字
  WIDE_ANGLE_RULES.mustRemove.forEach(keyword => {
    corrections.push({
      action: 'remove',
      target: keyword,
      reason: '廣角鏡頭會產生動態透視，與此關鍵字衝突'
    });
  });
  
  // 自動添加必要關鍵字
  WIDE_ANGLE_RULES.mustAdd.forEach(keyword => {
    corrections.push({
      action: 'add',
      target: 'lens_description',
      value: keyword,
      reason: '廣角鏡頭的特性描述'
    });
  });
  
  // 推薦組合提示
  const recommendation = WIDE_ANGLE_RULES.recommendations.find(
    rec => rec.angle === angleType
  );
  
  if (recommendation) {
    warnings.push({
      type: recommendation.type,
      message: recommendation.message,
      affectedParams: ['lens', 'angle']
    });
  }
  
  return { warnings, corrections };
}


/**
 * 檢查微距模式相容性
 */
function checkMacroCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 角度轉譯
  const angleTranslation = MACRO_RULES.angleTranslation[angleType];
  if (angleTranslation) {
    corrections.push({
      action: 'replace',
      target: 'angle_description',
      value: angleTranslation,
      reason: '微距模式下，角度描述轉換為光影與質感起伏'
    });
  }
  
  // 景深處理
  const wantsDeepFocus = state.optics.dof && 
    (state.optics.dof === 'f/16' || state.optics.dof === 'f/22');
  
  if (wantsDeepFocus) {
    // 使用者想要深景深
    MACRO_RULES.depthOfField.deepFocus.forEach(keyword => {
      corrections.push({
        action: 'add',
        target: 'depth_of_field',
        value: keyword,
        reason: '微距深景深需要焦點合成技術'
      });
    });
    
    warnings.push({
      type: WarningType.SUGGESTION,
      message: '微距模式下，深景深需要「焦點合成」技術',
      suggestion: '已自動添加 Focus stacking 關鍵字',
      affectedParams: ['dof', 'lens']
    });
  } else {
    // 預設淺景深
    MACRO_RULES.depthOfField.default.forEach(keyword => {
      corrections.push({
        action: 'add',
        target: 'depth_of_field',
        value: keyword,
        reason: '微距模式的物理特性'
      });
    });
  }
  
  return { warnings, corrections };
}


// ============================================================
// 主檢查函數
// ============================================================

/**
 * 判斷是否為微距模式
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
 * 判斷是否為特寫模式
 */
function isCloseUpMode(shotType: string): boolean {
  const shotLower = shotType.toLowerCase();
  return shotLower.includes('close') ||
         shotLower.includes('特寫') ||
         shotLower.includes('ecu') ||
         shotLower.includes('極致特寫');
}

/**
 * 執行完整的相容性檢查
 * @param state - 完整的 PromptState
 * @returns 檢查結果，包含警告和自動修正
 */
export function checkCompatibility(
  state: PromptState
): CompatibilityCheckResult {
  const lensType = detectLensType(state.camera.lens, state.camera.shotType);
  const angleType = detectAngleType(state.camera.cameraElevation ?? 0);
  
  const warnings: CompatibilityWarning[] = [];
  const autoCorrections: AutoCorrection[] = [];
  
  // ============================================================
  // 模式衝突檢測（高優先級）
  // ============================================================
  
  const isMacro = isMacroMode(state.camera.shotType);
  const isWide = isWideMode(state.camera.shotType);
  const isCloseUp = isCloseUpMode(state.camera.shotType);
  
  // 衝突 1：微距 + 大遠景（邏輯矛盾：極近 vs 極遠）
  if (isMacro && isWide) {
    warnings.push({
      type: WarningType.CONFLICT,
      message: '微距模式（極近）與大遠景模式（極遠）互斥',
      suggestion: '請選擇其中一種模式：微距適合拍攝細節，大遠景適合拍攝環境',
      affectedParams: ['shotType', 'scaleMode']
    });
  }
  
  // 衝突 2：大遠景 + 特寫（邏輯矛盾：極遠 vs 近）
  if (isWide && isCloseUp) {
    warnings.push({
      type: WarningType.CONFLICT,
      message: '大遠景模式與特寫鏡頭互斥',
      suggestion: '大遠景應該使用遠景（Long Shot）或全景（Full Body）',
      affectedParams: ['shotType', 'scaleMode']
    });
  }
  
  // 次優組合：大遠景 + 長焦（邏輯怪異：通常遠景用廣角）
  if (isWide && lensType === 'telephoto') {
    warnings.push({
      type: WarningType.SUBOPTIMAL,
      message: '大遠景通常使用廣角鏡頭，長焦會產生「望遠鏡視角」',
      suggestion: '如果想要遠距離觀察效果，這個組合可以使用，但會失去空間感',
      affectedParams: ['lens', 'shotType']
    });
    
    // 自動添加補償描述
    autoCorrections.push({
      action: 'add',
      target: 'lens_description',
      value: 'look from extremely far away distance, zoom lens view, telephoto compression',
      reason: '補償大遠景 + 長焦的特殊視角'
    });
  }
  
  // ============================================================
  // 鏡頭相容性檢測
  // ============================================================
  
  // 檢查魚眼相容性
  if (lensType === 'fisheye') {
    const fisheyeResult = checkFisheyeCompatibility(state, angleType);
    warnings.push(...fisheyeResult.warnings);
    autoCorrections.push(...fisheyeResult.corrections);
  }
  
  // 檢查長焦相容性
  if (lensType === 'telephoto') {
    const telephotoResult = checkTelephotoCompatibility(state, angleType);
    warnings.push(...telephotoResult.warnings);
    autoCorrections.push(...telephotoResult.corrections);
  }
  
  // 檢查廣角相容性
  if (lensType === 'wide') {
    const wideResult = checkWideAngleCompatibility(state, angleType);
    warnings.push(...wideResult.warnings);
    autoCorrections.push(...wideResult.corrections);
  }
  
  // 檢查微距特殊邏輯
  if (lensType === 'macro') {
    const macroResult = checkMacroCompatibility(state, angleType);
    warnings.push(...macroResult.warnings);
    autoCorrections.push(...macroResult.corrections);
  }
  
  return {
    isCompatible: warnings.filter(w => w.type === WarningType.CONFLICT).length === 0,
    warnings,
    autoCorrections,
    priorityOrder: determinePriorityOrder(lensType, state)
  };
}


// ============================================================
// 優先級排序
// ============================================================

/**
 * 決定 Prompt 組件的優先級順序
 * @param lensType - 鏡頭類型
 * @param state - 完整狀態
 * @returns 優先級順序陣列
 */
function determinePriorityOrder(
  lensType: LensType,
  state: PromptState
): PromptPriorityLevel[] {
  const order: PromptPriorityLevel[] = [];
  
  // Level 1: 特殊光學（魚眼、微距）
  if (lensType === 'fisheye' || lensType === 'macro') {
    order.push(PromptPriorityLevel.SPECIAL_OPTICS);
  }
  
  // Level 2: 極端距離（大遠景）
  const shotLower = state.camera.shotType.toLowerCase();
  if (shotLower.includes('大遠景') || 
      shotLower.includes('極遠景') ||
      shotLower.includes('very long shot') || 
      shotLower.includes('extreme long shot')) {
    order.push(PromptPriorityLevel.EXTREME_DISTANCE);
  }
  
  // Level 3: 物理視角
  order.push(PromptPriorityLevel.PHYSICAL_ANGLE);
  
  // Level 4: 鏡頭焦段
  order.push(PromptPriorityLevel.LENS_FOCAL);
  
  // Level 5: 主體與風格
  order.push(PromptPriorityLevel.SUBJECT_STYLE);
  
  return order;
}

/**
 * 應用優先級排序到 Prompt 組件
 * @param components - 原始 Prompt 組件陣列
 * @param priorityOrder - 優先級順序
 * @returns 排序後的 Prompt 組件陣列
 */
export function applyPrioritySorting(
  components: string[],
  priorityOrder: PromptPriorityLevel[]
): string[] {
  const sorted: string[] = [];
  const used = new Set<string>();
  
  // 按照優先級順序處理
  priorityOrder.forEach(level => {
    const keywords = PRIORITY_SORTING_RULES[level];
    components.forEach(component => {
      if (used.has(component)) return;
      
      // 檢查組件是否包含此層級的關鍵字
      if (keywords.some(keyword => 
        component.toLowerCase().includes(keyword.toLowerCase())
      )) {
        sorted.push(component);
        used.add(component);
      }
    });
  });
  
  // 添加未匹配的組件（保持原順序）
  components.forEach(component => {
    if (!used.has(component)) {
      sorted.push(component);
    }
  });
  
  return sorted;
}
