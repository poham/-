/**
 * 攝影機-主體對齊系統
 * 
 * 當用戶調整攝影機角度時，自動修正主體朝向描述，
 * 避免「攝影機在下方仰拍，但主體卻俯視鏡頭」的物理矛盾。
 * 
 * 核心原則：攝影機位置決定主體朝向
 */

/**
 * 根據攝影機角度自動對齊主體朝向
 * 
 * @param cameraElevation - 攝影機仰角（-90° 到 90°）
 * @param cameraAzimuth - 攝影機方位角（-180° 到 180°）
 * @param currentViewAngle - 當前的主體視角描述
 * @returns 修正後的主體朝向描述
 * 
 * @example
 * // 仰視拍攝：攝影機在下方
 * alignSubjectToCamera(-60, 0, "Front View")
 * // Returns: "facing downwards towards the lens, towering over camera"
 * 
 * @example
 * // 俯視拍攝：攝影機在上方
 * alignSubjectToCamera(75, 0, "Front View")
 * // Returns: "facing upwards towards the lens, viewed from above"
 */
export function alignSubjectToCamera(
  cameraElevation: number,
  cameraAzimuth: number,
  currentViewAngle: string
): string {
  // ============================================================
  // 極端仰視（蟲視）：-90° 到 -45°
  // ============================================================
  if (cameraElevation <= -45) {
    return "facing downwards towards the lens, towering over camera, subject positioned above viewpoint";
  }
  
  // ============================================================
  // 低角度（仰視）：-45° 到 -15°
  // ============================================================
  if (cameraElevation < -15) {
    return "facing downwards towards the lens, elevated above camera position";
  }
  
  // ============================================================
  // 平視：-15° 到 15°
  // ============================================================
  if (cameraElevation >= -15 && cameraElevation <= 15) {
    // 平視時，根據方位角調整正面/側面/背面
    // 如果當前描述已經包含方向性（如 "Front View"），則進行轉換
    if (currentViewAngle && 
        (currentViewAngle.toLowerCase().includes('view') || 
         currentViewAngle.toLowerCase().includes('視'))) {
      return alignSubjectAzimuth(cameraAzimuth, currentViewAngle);
    }
    // 否則保持原樣
    return currentViewAngle;
  }
  
  // ============================================================
  // 高角度（俯視）：15° 到 60°
  // ============================================================
  if (cameraElevation > 15 && cameraElevation <= 60) {
    return "facing upwards towards the lens, camera positioned above subject";
  }
  
  // ============================================================
  // 極端俯視（鳥瞰）：60° 到 90°
  // ============================================================
  if (cameraElevation > 60) {
    return "facing upwards towards the lens, overhead view, camera directly above subject";
  }
  
  // 預設：保持原樣
  return currentViewAngle;
}

/**
 * 根據方位角調整主體朝向（平視時使用）
 * 
 * @param cameraAzimuth - 攝影機方位角（-180° 到 180°）
 * @param currentViewAngle - 當前的主體視角描述
 * @returns 修正後的主體朝向描述
 */
function alignSubjectAzimuth(
  cameraAzimuth: number,
  currentViewAngle: string
): string {
  // 正面：-30° 到 30°
  if (cameraAzimuth >= -30 && cameraAzimuth <= 30) {
    return "facing towards camera, front view";
  }
  
  // 右側面：30° 到 75°
  if (cameraAzimuth > 30 && cameraAzimuth <= 75) {
    return "facing right, three-quarter view from left side";
  }
  
  // 右側面：75° 到 105°
  if (cameraAzimuth > 75 && cameraAzimuth <= 105) {
    return "facing right, profile view from left side";
  }
  
  // 背面：105° 到 180° 或 -180° 到 -105°
  if (cameraAzimuth > 105 || cameraAzimuth < -105) {
    return "facing away from camera, back view";
  }
  
  // 左側面：-105° 到 -75°
  if (cameraAzimuth >= -105 && cameraAzimuth < -75) {
    return "facing left, profile view from right side";
  }
  
  // 左側面：-75° 到 -30°
  if (cameraAzimuth >= -75 && cameraAzimuth < -30) {
    return "facing left, three-quarter view from right side";
  }
  
  // 預設：保持原樣
  return currentViewAngle;
}

/**
 * 檢查當前配置是否存在視角矛盾
 * 
 * @param cameraElevation - 攝影機仰角
 * @param subjectViewAngle - 主體視角描述
 * @returns 是否存在矛盾
 * 
 * @example
 * hasViewAngleConflict(-60, "Top View")  // true（仰視但主體俯視）
 * hasViewAngleConflict(-60, "facing downwards")  // false（一致）
 */
export function hasViewAngleConflict(
  cameraElevation: number,
  subjectViewAngle: string
): boolean {
  const viewLower = subjectViewAngle.toLowerCase();
  
  // 仰視（攝影機在下方）但主體描述為「俯視」或「Top View」
  if (cameraElevation < -15) {
    return viewLower.includes('top view') || 
           viewLower.includes('俯視') ||
           viewLower.includes('looking down') ||
           viewLower.includes('overhead');
  }
  
  // 俯視（攝影機在上方）但主體描述為「仰視」或「Bottom View」
  if (cameraElevation > 60) {
    return viewLower.includes('bottom view') || 
           viewLower.includes('仰視') ||
           viewLower.includes('looking up') ||
           viewLower.includes('from below');
  }
  
  return false;
}

/**
 * 獲取視角矛盾的警告訊息
 * 
 * @param cameraElevation - 攝影機仰角
 * @param subjectViewAngle - 主體視角描述
 * @returns 警告訊息（如果有矛盾）
 */
export function getViewAngleConflictWarning(
  cameraElevation: number,
  subjectViewAngle: string
): string | null {
  if (!hasViewAngleConflict(cameraElevation, subjectViewAngle)) {
    return null;
  }
  
  if (cameraElevation < -15) {
    return "⚠️ 視角矛盾：攝影機在下方仰拍，但主體描述為俯視。系統將自動修正為「主體朝下看鏡頭」。";
  }
  
  if (cameraElevation > 60) {
    return "⚠️ 視角矛盾：攝影機在上方俯拍，但主體描述為仰視。系統將自動修正為「主體朝上看鏡頭」。";
  }
  
  return null;
}
