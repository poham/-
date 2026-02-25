/**
 * 鏡頭-角度聯動建議系統
 * 
 * 根據攝影機角度和當前鏡頭配置，提供最佳鏡頭建議，
 * 確保用戶能獲得最強烈的視覺效果。
 */

export interface LensSuggestion {
  suggestedLens: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  currentIssue?: string;
}

/**
 * 根據攝影機角度建議最佳鏡頭
 * 
 * @param cameraElevation - 攝影機仰角（-90° 到 90°）
 * @param currentLens - 當前鏡頭設定
 * @param shotType - 取景類型
 * @returns 鏡頭建議（如果當前配置不理想）
 * 
 * @example
 * // 極端仰視 + 標準鏡頭 → 建議廣角
 * suggestOptimalLens(-60, "50mm", "Medium Shot")
 * // Returns: { suggestedLens: "Wide Angle (24mm)", reason: "...", priority: "high" }
 */
export function suggestOptimalLens(
  cameraElevation: number,
  currentLens: string,
  shotType: string
): LensSuggestion | null {
  const lensLower = currentLens.toLowerCase();
  const shotLower = shotType.toLowerCase();
  
  // ============================================================
  // 規則 1：極端角度（蟲視/鳥瞰）建議廣角
  // ============================================================
  if (Math.abs(cameraElevation) > 45) {
    // 如果當前不是廣角或魚眼
    if (!lensLower.includes('wide') && 
        !lensLower.includes('廣角') && 
        !lensLower.includes('fisheye') &&
        !lensLower.includes('魚眼') &&
        !lensLower.includes('14mm') &&
        !lensLower.includes('16mm') &&
        !lensLower.includes('24mm')) {
      
      // 如果是長焦，優先級更高
      const isTelepho = lensLower.includes('telephoto') || 
                        lensLower.includes('長焦') ||
                        lensLower.includes('85mm') ||
                        lensLower.includes('135mm') ||
                        lensLower.includes('200mm');
      
      return {
        suggestedLens: "Wide Angle (24mm)",
        reason: "極端角度搭配廣角鏡頭能產生強烈的透視變形和視覺衝擊力（Foreshortening）。當前鏡頭會削弱仰視/俯視的張力。",
        priority: isTelepho ? 'high' : 'medium',
        currentIssue: isTelepho 
          ? "長焦鏡頭會壓縮透視，讓極端角度失去戲劇性" 
          : "標準鏡頭的透視感不夠強烈"
      };
    }
  }
  
  // ============================================================
  // 規則 2：微距模式不應該使用廣角/長焦
  // ============================================================
  if (shotLower.includes('macro') || 
      shotLower.includes('微距') || 
      shotLower.includes('extreme close')) {
    
    if (lensLower.includes('wide') || 
        lensLower.includes('廣角') ||
        lensLower.includes('telephoto') ||
        lensLower.includes('長焦')) {
      
      return {
        suggestedLens: "Macro Lens (100mm Macro)",
        reason: "微距攝影需要專用的微距鏡頭，才能在極近距離下對焦並呈現細節。",
        priority: 'high',
        currentIssue: "當前鏡頭無法在極近距離下對焦"
      };
    }
  }
  
  // ============================================================
  // 規則 3：大遠景建議廣角（除非刻意要望遠鏡效果）
  // ============================================================
  if (shotLower.includes('大遠景') || 
      shotLower.includes('極遠景') ||
      shotLower.includes('very long shot') || 
      shotLower.includes('extreme long shot')) {
    
    const isTelepho = lensLower.includes('telephoto') || 
                      lensLower.includes('長焦');
    
    if (isTelepho) {
      return {
        suggestedLens: "Wide Angle (24mm)",
        reason: "大遠景通常使用廣角鏡頭來展現空間感和環境。長焦會產生「望遠鏡視角」，失去空間深度。",
        priority: 'medium',
        currentIssue: "長焦會壓縮空間，讓遠景失去深度感"
      };
    }
  }
  
  // ============================================================
  // 規則 4：特寫 + 長焦 = 最佳組合（人像）
  // ============================================================
  if ((shotLower.includes('close') || shotLower.includes('特寫')) &&
      !shotLower.includes('macro')) {
    
    if (!lensLower.includes('telephoto') && 
        !lensLower.includes('長焦') &&
        !lensLower.includes('85mm') &&
        !lensLower.includes('100mm') &&
        !lensLower.includes('135mm')) {
      
      return {
        suggestedLens: "Telephoto (85mm)",
        reason: "特寫鏡頭搭配長焦能產生柔美的背景虛化和壓縮透視，適合人像和產品攝影。",
        priority: 'low',
        currentIssue: undefined
      };
    }
  }
  
  // 沒有建議
  return null;
}

/**
 * 檢查鏡頭-角度組合是否為「次優組合」
 * 
 * @param cameraElevation - 攝影機仰角
 * @param currentLens - 當前鏡頭
 * @returns 是否為次優組合
 */
export function isSuboptimalCombination(
  cameraElevation: number,
  currentLens: string
): boolean {
  const lensLower = currentLens.toLowerCase();
  
  // 極端角度 + 長焦 = 次優
  if (Math.abs(cameraElevation) > 45) {
    return lensLower.includes('telephoto') || 
           lensLower.includes('長焦') ||
           lensLower.includes('85mm') ||
           lensLower.includes('135mm') ||
           lensLower.includes('200mm');
  }
  
  return false;
}

/**
 * 獲取當前鏡頭-角度組合的評分
 * 
 * @param cameraElevation - 攝影機仰角
 * @param currentLens - 當前鏡頭
 * @param shotType - 取景類型
 * @returns 評分（0-100，100 為最佳）
 */
export function rateLensAngleCombination(
  cameraElevation: number,
  currentLens: string,
  shotType: string
): number {
  const lensLower = currentLens.toLowerCase();
  const shotLower = shotType.toLowerCase();
  
  let score = 70; // 基礎分數
  
  // ============================================================
  // 加分項目
  // ============================================================
  
  // 極端角度 + 廣角/魚眼 = +30 分
  if (Math.abs(cameraElevation) > 45) {
    if (lensLower.includes('wide') || 
        lensLower.includes('廣角') ||
        lensLower.includes('fisheye') ||
        lensLower.includes('魚眼')) {
      score += 30;
    }
  }
  
  // 微距 + 微距鏡頭 = +30 分
  if (shotLower.includes('macro') || shotLower.includes('微距')) {
    if (lensLower.includes('macro') || lensLower.includes('微距')) {
      score += 30;
    }
  }
  
  // 特寫 + 長焦 = +20 分
  if (shotLower.includes('close') && !shotLower.includes('macro')) {
    if (lensLower.includes('telephoto') || 
        lensLower.includes('長焦') ||
        lensLower.includes('85mm')) {
      score += 20;
    }
  }
  
  // ============================================================
  // 扣分項目
  // ============================================================
  
  // 極端角度 + 長焦 = -40 分
  if (Math.abs(cameraElevation) > 45) {
    if (lensLower.includes('telephoto') || lensLower.includes('長焦')) {
      score -= 40;
    }
  }
  
  // 微距 + 廣角/長焦 = -30 分
  if (shotLower.includes('macro') || shotLower.includes('微距')) {
    if (lensLower.includes('wide') || 
        lensLower.includes('廣角') ||
        lensLower.includes('telephoto') ||
        lensLower.includes('長焦')) {
      score -= 30;
    }
  }
  
  // 確保分數在 0-100 之間
  return Math.max(0, Math.min(100, score));
}
