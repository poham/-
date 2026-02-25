import { PromptState } from '../types';
import { STUDIO_SETUPS, GLOBAL_VISUAL_STYLES } from '../constants';
import { formatLightingSection } from './lightingFormatters';
import { migrateOpticsConfig } from '../constants';
import { translatePromptState } from './visualTranslators';
import { sanitizePromptState, needsSanitization } from './promptSanitizer';

/**
 * 提示詞區段介面
 */
export interface PromptPart {
  label: string;
  text: string;
}

/**
 * 將 PromptState 組裝成結構化的提示詞區段
 * 每個區段包含標籤和文字內容
 * 
 * @deprecated This function is deprecated. Use assembleFinalPrompt(state: PromptState) instead.
 * @param state - 完整的提示詞配置狀態
 * @returns 提示詞區段陣列
 */
export function assemblePromptParts(state: PromptState): PromptPart[] {
  const { camera, subject, background, optics, style } = state;
  
  // 確保 optics 配置已遷移到新格式
  const migratedOptics = migrateOpticsConfig(optics);
  
  const parts: PromptPart[] = [];
  
  // VISUAL STYLE 區段（取代原本的 THEME）
  if (style.visualStyle) {
    parts.push({ 
      label: 'VISUAL STYLE', 
      text: `${style.visualStyle}.` 
    });
  }
  
  // SUBJECT 區段
  parts.push({ 
    label: 'SUBJECT', 
    text: `${subject.type || 'main object'} (${subject.description}). Feature: ${subject.key_feature}. View: ${subject.view_angle}.` 
  });
  
  // SCENE 區段
  let bgText = `Scene: ${background.description || 'clean environment'}.`;
  if (background.bgColor) {
    bgText += ` BG tint: ${background.bgColor}.`;
  }
  parts.push({ 
    label: 'SCENE', 
    text: bgText 
  });
  
  // OPTICS 區段
  let camText = `${camera.shotType}, ${camera.lens} lens, ${camera.angle}.`;
  if (camera.roll !== 0) {
    camText += ` Camera roll: ${camera.roll} degrees, Dutch angle, canted perspective.`;
  }
  camText += ` Aperture ${migratedOptics.dof}.`;
  parts.push({ 
    label: 'OPTICS', 
    text: camText 
  });
  
  // COMPOSITION 區段
  parts.push({ 
    label: 'COMPOSITION', 
    text: `${camera.composition.rule} aligned ${camera.composition.alignment}.` 
  });
  
  // MOOD 區段
  parts.push({ 
    label: 'MOOD', 
    text: `Global mood: ${style.mood}.` 
  });

  // LIGHTING 區段（僅在進階燈光啟用時）
  if (migratedOptics.useAdvancedLighting) {
    const setup = STUDIO_SETUPS.find(s => s.id === migratedOptics.studioSetup);
    
    // 偵測是否為產品攝影模式
    const isProductMode = camera.framingMode === 'product' || 
                          camera.photographyMode === 'commercial' ||
                          subject.type.toLowerCase().includes('product') ||
                          subject.type.toLowerCase().includes('bottle') ||
                          subject.type.toLowerCase().includes('watch') ||
                          subject.type.toLowerCase().includes('jewelry');
    
    const lightingDesc = formatLightingSection(
      migratedOptics.keyLight,
      migratedOptics.fillLight,
      migratedOptics.rimLight,
      setup?.id,
      setup?.promptTags,
      isProductMode  // 傳入產品模式標記
    );
    parts.push({ 
      label: 'LIGHTING', 
      text: lightingDesc 
    });
  }
  
  // PROCESSING 區段（僅在有後製標籤時）
  if (style.postProcessing.length > 0) {
    parts.push({ 
      label: 'PROCESSING', 
      text: style.postProcessing.join(', ') + '.' 
    });
  }
  
  return parts;
}

/**
 * 將 PromptState 組裝成最終的完整提示詞字串
 * 使用視覺翻譯層將技術參數轉換為視覺描述
 * 
 * 新的清晰結構（強烈風格優先）：
 * [Global Visual Style] [Mood] [Camera Setup + DOF] of [Subject + Orientation] in [Environment] lit by [Lighting] with [Processing]. --ar
 * 
 * 優先級邏輯：
 * - 全局風格（Global Visual Style）：如 Sin City, Film Noir, Cyberpunk 等，定義整體色調和氛圍，必須放在最前面
 * - 情緒（Mood）：整體氛圍描述，緊隨全局風格
 * - 相機設定（Camera Setup）：物理設定（鏡頭、角度、景別）
 * - 主體（Subject）：拍攝對象
 * - 環境（Environment）：場景和背景
 * - 燈光（Lighting）：光線設定
 * - 後製（Processing）：局部風格和後製效果
 * 
 * 淨化流程（新增）：
 * 1. 檢查是否需要淨化（視角矛盾、鏡頭衝突等）
 * 2. 執行淨化：修正視角、移除衝突關鍵字、添加補償描述
 * 3. 使用淨化後的 state 進行翻譯和組裝
 * 
 * @param state - 完整的提示詞配置狀態
 * @returns 完整的提示詞字串（清晰分段，無歧義，包含 --ar 參數）
 * 
 * @example
 * // 案例 1：魚眼 + Sin City + 林布蘭光
 * assembleFinalPrompt(state)
 * // Returns: "Sin City style, high contrast black and white, graphic novel aesthetic, 
 * // moody atmosphere, Fisheye lens perspective using extreme barrel distortion, 
 * // medium shot of detective in trench coat, in dark alley, 
 * // lit by Rembrandt lighting with dramatic chiaroscuro. --ar 1:1"
 * 
 * @example
 * // 案例 2：標準鏡頭 + Hyper-Realistic（局部風格）
 * assembleFinalPrompt(state)
 * // Returns: "Standard lens perspective using zero distortion, portrait shot 
 * // of elderly man, in studio environment, lit by soft key light, 
 * // with rendered in hyper-realistic style with ray tracing. --ar 1:1"
 * 
 * @example
 * // 案例 3：仰視 + 標準鏡頭（自動修正視角矛盾）
 * assembleFinalPrompt({ camera: { cameraElevation: -60, ... }, subject: { view_angle: "Top View", ... } })
 * // 淨化後：subject.view_angle 自動修正為 "facing downwards towards the lens"
 */
export function assembleFinalPrompt(state: PromptState): string {
  try {
    // ========================================
    // STEP 0: Prompt 淨化（新增）
    // ========================================
    // 檢查是否需要淨化（視角矛盾、鏡頭衝突等）
    let workingState = state;
    
    if (needsSanitization(state)) {
      const sanitizationResult = sanitizePromptState(state);
      workingState = sanitizationResult.sanitizedState;
      
      // 在開發環境中記錄淨化過程（可選）
      if (process.env.NODE_ENV === 'development') {
        console.group('🧹 Prompt 淨化');
        console.log('應用的修正:', sanitizationResult.appliedCorrections);
        console.log('移除的衝突:', sanitizationResult.removedConflicts);
        console.log('警告訊息:', sanitizationResult.warnings);
        console.groupEnd();
      }
    }
    
    // ========================================
    // STEP 1: Translate all technical parameters to visual descriptions
    // ========================================
    const translated = translatePromptState(workingState);
    
    // ========================================
    // STEP 2: Check if visual style is a global style (strong style that affects overall tone)
    // ========================================
    const isGlobalStyle = workingState.style.visualStyle && 
                          GLOBAL_VISUAL_STYLES.some(gs => workingState.style.visualStyle.includes(gs.split(' (')[0]));
    
    // ========================================
    // STEP 3: Assemble in clear, unambiguous structure with priority order
    // ========================================
    const parts: string[] = [];
    
    // ========================================
    // SECTION 0: Global Visual Style (如果有)
    // ========================================
    // 全局風格（如 Sin City, Film Noir, Cyberpunk）必須放在最前面
    // 因為它們定義了整體色調、對比、氛圍，會影響所有後續元素的呈現
    if (isGlobalStyle && workingState.style.visualStyle) {
      parts.push(workingState.style.visualStyle);
    }
    
    // ========================================
    // SECTION 0.5: Mood (如果有)
    // ========================================
    // 情緒描述緊隨全局風格，進一步定義氛圍
    if (translated.mood) {
      parts.push(`${translated.mood} mood`);
    }
    
    // ========================================
    // SECTION 1: Camera Setup + Depth of Field
    // ========================================
    // Includes: shot type, camera angle, lens, composition rule, DOF
    // Purpose: Establish the camera's perspective and optical effects
    if (translated.composition) {
      // 如果是全局風格，從 composition 中移除視覺風格（已經在前面加過了）
      let compositionText = translated.composition;
      if (isGlobalStyle && workingState.style.visualStyle) {
        // 簡單移除視覺風格文字（避免重複）
        compositionText = compositionText.replace(new RegExp(`,?\\s*${workingState.style.visualStyle}\\s*,?`, 'gi'), '');
        compositionText = compositionText.replace(/,\s*,/g, ',').trim();
        if (compositionText.endsWith(',')) {
          compositionText = compositionText.slice(0, -1);
        }
      }
      parts.push(compositionText);
    }
    
    // ========================================
    // SECTION 2: Subject Details + Orientation
    // ========================================
    // Includes: subject type, materials, orientation, key features
    // Purpose: Describe what we're photographing and how it's positioned
    if (translated.subject) {
      parts.push(`of ${translated.subject}`);
    }
    
    // ========================================
    // SECTION 3: Environment + Background
    // ========================================
    // Includes: scene description, background color (clearly labeled)
    // Purpose: Set the context and background WITHOUT color bleeding
    if (translated.environment) {
      parts.push(`in ${translated.environment}`);
    }
    
    // ========================================
    // SECTION 4: Lighting Setup
    // ========================================
    // Includes: light direction, intensity, color (clearly labeled as light color)
    // Purpose: Describe illumination WITHOUT confusing with background colors
    if (translated.lighting) {
      parts.push(`lit by ${translated.lighting}`);
    }
    
    // ========================================
    // SECTION 5: Processing + Local Style
    // ========================================
    // Includes: post-processing effects and local style (rendering quality)
    // Purpose: Add rendering quality and post-processing effects
    const finalParts: string[] = [];
    
    // 局部風格（如 Hyper-Realistic, Commercial Photography）放在最後
    // 因為它們是「如何渲染」的指令，不影響整體色調
    if (!isGlobalStyle && translated.style) {
      finalParts.push(`rendered in ${translated.style}`);
    } else if (translated.style) {
      // 如果有全局風格，但 translated.style 還有其他內容（如後製標籤），也要加上
      finalParts.push(translated.style);
    }
    
    if (finalParts.length > 0) {
      parts.push(`with ${finalParts.join(', ')}`);
    }
    
    // Join all sections with commas and add period
    let prompt = parts.filter(p => p && p.trim()).join(', ') + '.';
    
    // ========================================
    // STEP 4: Add aspect ratio parameter at the end
    // ========================================
    if (workingState.camera.aspectRatio) {
      prompt += ` --ar ${workingState.camera.aspectRatio}`;
    }
    
    return prompt;
    
  } catch (error) {
    console.error('Error assembling final prompt:', error);
    
    // Fallback to basic assembly if translation fails
    const fallbackParts: string[] = [];
    
    // 全局風格優先
    if (state.style.visualStyle && GLOBAL_VISUAL_STYLES.some(gs => state.style.visualStyle.includes(gs.split(' (')[0]))) {
      fallbackParts.push(state.style.visualStyle);
    }
    
    if (state.camera.shotType) {
      fallbackParts.push(state.camera.shotType);
    }
    if (state.subject.description) {
      fallbackParts.push(`of ${state.subject.description}`);
    }
    if (state.background.description) {
      fallbackParts.push(`in ${state.background.description}`);
    }
    if (state.style.mood) {
      fallbackParts.push(`with ${state.style.mood} mood`);
    }
    if (state.style.postProcessing.length > 0) {
      fallbackParts.push(`rendered in ${state.style.postProcessing.join(', ')}`);
    }
    
    let fallbackPrompt = fallbackParts.join(', ') + '.';
    
    // Add aspect ratio even in fallback
    if (state.camera.aspectRatio) {
      fallbackPrompt += ` --ar ${state.camera.aspectRatio}`;
    }
    
    return fallbackPrompt;
  }
}
