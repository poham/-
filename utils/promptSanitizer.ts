/**
 * Prompt 淨化系統
 * 
 * 在組裝最終 Prompt 之前，先過濾掉互斥的參數和描述，
 * 確保生成的 Prompt 沒有物理矛盾和語義衝突。
 * 
 * 核心功能：
 * 1. 修正視角矛盾（攝影機位置 vs 主體朝向）
 * 2. 移除鏡頭衝突關鍵字（如：魚眼 + 直線）
 * 3. 添加必要的補償描述（如：長焦 + 極端角度）
 * 4. 過濾重複和稀釋的形容詞
 */

import { PromptState } from '../types';
import { checkCompatibility } from './lensAngleCompatibility';
import { alignSubjectToCamera, hasViewAngleConflict } from './cameraSubjectAlignment';

/**
 * 淨化結果介面
 */
export interface SanitizationResult {
  sanitizedState: PromptState;
  appliedCorrections: string[];
  removedConflicts: string[];
  warnings: string[];
}

/**
 * 執行完整的 Prompt 淨化流程
 * 
 * @param state - 原始的 PromptState
 * @returns 淨化後的 PromptState 和修正記錄
 * 
 * @example
 * const result = sanitizePromptState(state);
 * console.log(result.appliedCorrections);  // ["修正視角矛盾", "移除魚眼衝突關鍵字"]
 * const cleanPrompt = assembleFinalPrompt(result.sanitizedState);
 */
export function sanitizePromptState(state: PromptState): SanitizationResult {
  const sanitized: PromptState = JSON.parse(JSON.stringify(state)); // Deep clone
  const appliedCorrections: string[] = [];
  const removedConflicts: string[] = [];
  const warnings: string[] = [];
  
  // ============================================================
  // Step 1: 修正視角矛盾（攝影機位置 vs 主體朝向）
  // ============================================================
  if (sanitized.camera.cameraElevation !== undefined) {
    const hasConflict = hasViewAngleConflict(
      sanitized.camera.cameraElevation,
      sanitized.subject.view_angle
    );
    
    if (hasConflict) {
      const originalViewAngle = sanitized.subject.view_angle;
      sanitized.subject.view_angle = alignSubjectToCamera(
        sanitized.camera.cameraElevation,
        sanitized.camera.cameraAzimuth ?? 0,
        sanitized.subject.view_angle
      );
      
      appliedCorrections.push(
        `修正視角矛盾：「${originalViewAngle}」→「${sanitized.subject.view_angle}」`
      );
      
      warnings.push(
        `攝影機角度（${sanitized.camera.cameraElevation.toFixed(0)}°）與主體朝向不一致，已自動修正`
      );
    } else {
      // 沒有矛盾時，檢查是否需要標準化描述（將 "Front View" 轉為 "facing towards camera"）
      const elevation = sanitized.camera.cameraElevation;
      const isEyeLevel = elevation >= -15 && elevation <= 15;
      const hasViewKeyword = sanitized.subject.view_angle && 
        (sanitized.subject.view_angle.toLowerCase().includes('view') || 
         sanitized.subject.view_angle.toLowerCase().includes('視'));
      
      if (isEyeLevel && hasViewKeyword) {
        const originalViewAngle = sanitized.subject.view_angle;
        sanitized.subject.view_angle = alignSubjectToCamera(
          sanitized.camera.cameraElevation,
          sanitized.camera.cameraAzimuth ?? 0,
          sanitized.subject.view_angle
        );
        
        appliedCorrections.push(
          `標準化視角描述：「${originalViewAngle}」→「${sanitized.subject.view_angle}」`
        );
      }
    }
  }
  
  // ============================================================
  // Step 2: 執行鏡頭-角度相容性檢查
  // ============================================================
  const compatResult = checkCompatibility(sanitized);
  
  // ============================================================
  // Step 3: 應用自動修正
  // ============================================================
  compatResult.autoCorrections.forEach(correction => {
    switch (correction.action) {
      case 'remove':
        // 從相關欄位中移除衝突關鍵字
        const removed = removeConflictKeyword(sanitized, correction.target);
        if (removed) {
          removedConflicts.push(correction.target);
          appliedCorrections.push(
            `移除衝突關鍵字：「${correction.target}」（${correction.reason}）`
          );
        }
        break;
        
      case 'add':
        // 添加必要的補償描述
        const added = addCompensationKeyword(sanitized, correction.target, correction.value || '');
        if (added) {
          appliedCorrections.push(
            `添加補償描述：「${correction.value}」到 ${correction.target}（${correction.reason}）`
          );
        }
        break;
        
      case 'replace':
        // 替換描述
        const replaced = replaceDescription(sanitized, correction.target, correction.value || '');
        if (replaced) {
          appliedCorrections.push(
            `替換描述：${correction.target} →「${correction.value}」（${correction.reason}）`
          );
        }
        break;
    }
  });
  
  // ============================================================
  // Step 4: 過濾重複和稀釋的形容詞
  // ============================================================
  sanitized.subject.description = deduplicateAdjectives(sanitized.subject.description);
  sanitized.background.description = deduplicateAdjectives(sanitized.background.description);
  sanitized.style.mood = deduplicateAdjectives(sanitized.style.mood);
  
  // ============================================================
  // Step 5: 收集警告訊息
  // ============================================================
  compatResult.warnings.forEach(warning => {
    warnings.push(`${warning.type.toUpperCase()}: ${warning.message}`);
  });
  
  return {
    sanitizedState: sanitized,
    appliedCorrections,
    removedConflicts,
    warnings
  };
}

/**
 * 從 PromptState 中移除衝突關鍵字
 */
function removeConflictKeyword(state: PromptState, keyword: string): boolean {
  const keywordLower = keyword.toLowerCase();
  let removed = false;
  
  // 從主體描述中移除
  if (state.subject.description.toLowerCase().includes(keywordLower)) {
    state.subject.description = state.subject.description
      .replace(new RegExp(keyword, 'gi'), '')
      .replace(/\s+/g, ' ')
      .trim();
    removed = true;
  }
  
  // 從背景描述中移除
  if (state.background.description.toLowerCase().includes(keywordLower)) {
    state.background.description = state.background.description
      .replace(new RegExp(keyword, 'gi'), '')
      .replace(/\s+/g, ' ')
      .trim();
    removed = true;
  }
  
  // 從風格標籤中移除
  state.style.postProcessing = state.style.postProcessing.filter(
    tag => !tag.toLowerCase().includes(keywordLower)
  );
  
  // 從主體標籤中移除
  state.subject.tags = state.subject.tags.filter(
    tag => !tag.toLowerCase().includes(keywordLower)
  );
  
  return removed;
}

/**
 * 添加補償關鍵字到指定目標
 */
function addCompensationKeyword(
  state: PromptState, 
  target: string, 
  value: string
): boolean {
  if (!value) return false;
  
  switch (target) {
    case 'composition':
      // 添加到構圖規則描述（暫存在 tags 中）
      if (!state.subject.tags.includes(value)) {
        state.subject.tags.push(value);
        return true;
      }
      break;
      
    case 'lens_description':
      // 添加到主體描述中（鏡頭特性）
      if (!state.subject.description.toLowerCase().includes(value.toLowerCase())) {
        state.subject.description = `${value}, ${state.subject.description}`;
        return true;
      }
      break;
      
    case 'angle_description':
      // 添加到主體視角描述中
      if (!state.subject.view_angle.toLowerCase().includes(value.toLowerCase())) {
        state.subject.view_angle = `${state.subject.view_angle}, ${value}`;
        return true;
      }
      break;
      
    case 'depth_of_field':
      // 添加到後製標籤中（景深相關）
      if (!state.style.postProcessing.includes(value)) {
        state.style.postProcessing.push(value);
        return true;
      }
      break;
  }
  
  return false;
}

/**
 * 替換描述
 */
function replaceDescription(
  state: PromptState, 
  target: string, 
  value: string
): boolean {
  if (!value) return false;
  
  switch (target) {
    case 'angle_description':
      state.subject.view_angle = value;
      return true;
      
    case 'subject_orientation':
      state.subject.view_angle = value;
      return true;
  }
  
  return false;
}

/**
 * 去除重複的形容詞，避免 Prompt 稀釋
 * 
 * @param text - 原始文字
 * @returns 去重後的文字
 * 
 * @example
 * deduplicateAdjectives("clean minimal clean background")
 * // Returns: "clean minimal background"
 */
function deduplicateAdjectives(text: string): string {
  if (!text) return text;
  
  const words = text.split(/\s+/);
  const seen = new Set<string>();
  const result: string[] = [];
  
  words.forEach(word => {
    const wordLower = word.toLowerCase();
    
    // 保留非形容詞（如名詞、動詞）
    // 只去重形容詞
    if (!seen.has(wordLower)) {
      seen.add(wordLower);
      result.push(word);
    }
  });
  
  return result.join(' ');
}

/**
 * 檢查 Prompt 是否包含稀釋關鍵字（過多重複）
 * 
 * @param text - 要檢查的文字
 * @returns 重複的關鍵字列表
 */
export function detectDilutedKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const counts = new Map<string, number>();
  
  words.forEach(word => {
    counts.set(word, (counts.get(word) || 0) + 1);
  });
  
  const diluted: string[] = [];
  counts.forEach((count, word) => {
    if (count > 2) {
      diluted.push(`"${word}" (出現 ${count} 次)`);
    }
  });
  
  return diluted;
}

/**
 * 快速檢查：是否需要淨化
 * 
 * @param state - PromptState
 * @returns 是否需要淨化
 */
export function needsSanitization(state: PromptState): boolean {
  // 檢查視角矛盾
  if (state.camera.cameraElevation !== undefined) {
    if (hasViewAngleConflict(
      state.camera.cameraElevation,
      state.subject.view_angle
    )) {
      return true;
    }
    
    // 檢查是否需要根據方位角調整（平視時）
    if (state.camera.cameraElevation >= -15 && 
        state.camera.cameraElevation <= 15 &&
        state.subject.view_angle &&
        (state.subject.view_angle.toLowerCase().includes('view') || 
         state.subject.view_angle.toLowerCase().includes('視'))) {
      return true;
    }
  }
  
  // 檢查相容性問題
  const compatResult = checkCompatibility(state);
  if (!compatResult.isCompatible || compatResult.autoCorrections.length > 0) {
    return true;
  }
  
  return false;
}
