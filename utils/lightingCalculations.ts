/**
 * Lighting Calculations Utility
 * 處理所有光源位置計算、角度標準化、3D 到 2D 投影等邏輯
 */

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Position2D {
  x: number;
  y: number;
}

/**
 * 標準化角度到 0-360° 範圍
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * 標準化仰角到 -90° to 90° 範圍
 */
export function normalizeElevation(elevation: number): number {
  return Math.max(-90, Math.min(90, elevation));
}

/**
 * 根據方位角和仰角計算 3D 空間中的光源位置
 * 
 * 座標系定義（從攝影機正視角度）：
 * - X 軸：左右（正值 = 右側，負值 = 左側）
 * - Y 軸：上下（正值 = 上方，負值 = 下方）
 * - Z 軸：前後（正值 = 前方，負值 = 後方）
 * 
 * @param azimuth 方位角 (0-360°) - 實際視覺：180° = 正前方，0° = 正後方，90° = 右側，270° = 左側
 * @param elevation 仰角 (-90° to 90°) - 0° = 水平，正值向上，負值向下
 * @param distance 距離（預設 1.0）
 * @returns 3D 位置座標
 */
export function calculate3DPosition(
  azimuth: number,
  elevation: number,
  distance: number = 1.0
): Position3D {
  const azimuthRad = (azimuth - 90) * Math.PI / 180; // 轉換為數學座標系
  const elevationRad = elevation * Math.PI / 180;
  
  // 球面座標轉笛卡爾座標
  const horizontalDistance = distance * Math.cos(elevationRad);
  
  // 修正：Z 軸應該由方位角決定（前後關係）
  // 0° (正前方) → z = +1 (前方)
  // 180° (正後方) → z = -1 (後方)
  // Y 軸由仰角決定（上下關係）
  return {
    x: horizontalDistance * Math.cos(azimuthRad),  // 左右
    y: -distance * Math.sin(elevationRad),          // 上下（負號是因為螢幕座標 Y 軸向下）
    z: horizontalDistance * Math.sin(azimuthRad)   // 前後（由方位角決定）
  };
}

/**
 * 將 3D 位置投影到 2D 平面（正視圖）
 * 用於在視覺化器中顯示光源位置
 * @param position3D 3D 位置
 * @param centerX 中心點 X 座標（預設 50）
 * @param centerY 中心點 Y 座標（預設 50）
 * @param scale 縮放比例（預設 35）
 * @returns 2D 位置座標（百分比）
 */
export function projectTo2D(
  position3D: Position3D,
  centerX: number = 50,
  centerY: number = 50,
  scale: number = 35
): Position2D {
  return {
    x: centerX + position3D.x * scale,
    y: centerY + position3D.y * scale
  };
}

/**
 * 計算對側光源的位置（用於 Fill Light）
 * @param azimuth 主光源的方位角
 * @param elevation 主光源的仰角
 * @returns 對側光源的方位角和仰角
 */
export function calculateOppositePosition(
  azimuth: number,
  elevation: number
): { azimuth: number; elevation: number } {
  return {
    azimuth: normalizeAngle(azimuth + 180),
    elevation: elevation * 0.5 // 對側光源通常較低
  };
}

/**
 * 計算背後光源的位置（用於 Rim Light）
 * Rim Light 的方位角總是在主光源的背後
 * @param keyAzimuth 主光源的方位角
 * @returns Rim Light 的方位角
 */
export function calculateRimAzimuth(keyAzimuth: number): number {
  // 反向移動：主光 +5° → Rim Light -5°
  return normalizeAngle(-keyAzimuth);
}

/**
 * 根據滑鼠位置計算圓形控制器的角度
 * @param mouseX 滑鼠 X 座標
 * @param mouseY 滑鼠 Y 座標
 * @param centerX 控制器中心 X 座標
 * @param centerY 控制器中心 Y 座標
 * @returns 標準化的角度 (0-360°)
 */
export function calculateAngleFromMouse(
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number
): number {
  const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
  return normalizeAngle(angle + 90);
}

/**
 * 計算光源強度對陰影的影響
 * @param fillIntensity 補光強度 (0-100)
 * @returns 陰影透明度 (0-1)
 */
export function calculateShadowOpacity(fillIntensity: number): number {
  return Math.max(0.3, 1 - (fillIntensity / 200));
}
