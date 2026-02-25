/**
 * Camera Angle Descriptions Module
 * 
 * 模組化攝影機角度描述系統
 * 模組一：仰角邏輯 (Elevation Module) - 決定「垂直視角」
 * 模組二：方位角邏輯 (Azimuth Module) - 決定「水平方向」
 * 模組三：組合器 (The Assembler) - 生成最終 Prompt
 */

export interface CameraAngleParams {
  azimuth: number;    // 方位角 -180° to 180° (0° 為正面，±180° 為背面)
  elevation: number;  // 仰角 -90° to 90° (垂直角度)
}

/**
 * 模組一：仰角邏輯 (Elevation Module)
 * 決定垂直視角：仰視、平視、俯視
 */
interface ElevationDescriptor {
  keyword: string;           // Prompt 關鍵字
  visualDetail: string;      // 視覺描述（輔助 AI 理解）
  connectionVerb: string;    // 連接動詞
}

/**
 * 模組二：方位角邏輯 (Azimuth Module)
 * 決定水平方向：正面、側面、背面
 */
interface AzimuthDescriptor {
  keyword: string;           // Prompt 關鍵字
  visualDetail: string;      // 視覺細節
}

/**
 * 模組一：獲取仰角描述 (Elevation Module)
 * 根據垂直角度返回標準化的攝影術語
 */
function getElevationDescriptor(elevation: number): ElevationDescriptor {
  if (elevation <= -60) {
    // -90° ~ -60°: 極端仰角
    return {
      keyword: 'EXTREME WORM\'S EYE VIEW, Camera on floor',
      visualDetail: 'Looking sharply upwards, dramatic foreshortening, lens touching the ground',
      connectionVerb: 'looking sharply up'
    };
  } else if (elevation <= -30) {
    // -60° ~ -30°: 低角度
    return {
      keyword: 'LOW ANGLE SHOT, Looking up',
      visualDetail: 'Camera positioned low, looking upward at the subject, imposing stature',
      connectionVerb: 'looking up'
    };
  } else if (elevation <= -10) {
    // -30° ~ -10°: 微仰角
    return {
      keyword: 'SLIGHTLY LOW ANGLE',
      visualDetail: 'Camera slightly below eye level, subtle upward gaze',
      connectionVerb: 'looking slightly up'
    };
  } else if (elevation <= 10) {
    // -10° ~ +10°: 水平視角
    return {
      keyword: 'EYE LEVEL SHOT, Neutral elevation',
      visualDetail: 'Camera at same height as subject, horizontal perspective, zero vertical distortion',
      connectionVerb: 'facing'
    };
  } else if (elevation <= 45) {
    // +10° ~ +45°: 高角度
    return {
      keyword: 'HIGH ANGLE SHOT, Looking down',
      visualDetail: 'Camera elevated above subject, looking downward, clear view of the top surfaces',
      connectionVerb: 'looking down'
    };
  } else if (elevation <= 80) {
    // +45° ~ +80°: 極高/俯瞰
    return {
      keyword: 'OVERHEAD SHOT, Bird\'s eye view',
      visualDetail: 'Steep downward angle, nearly top-down perspective',
      connectionVerb: 'looking steeply down'
    };
  } else {
    // +80° ~ +90°: 正頂視圖
    return {
      keyword: 'TOP DOWN FLAT LAY, Knolling',
      visualDetail: '90-degree vertical looking straight down, orthographic-like layout',
      connectionVerb: 'shooting straight down'
    };
  }
}

/**
 * 模組二：獲取方位角描述 (Azimuth Module)
 * 根據水平角度返回標準化的方位術語
 * 假設 0° 為正前方 Front
 */
function getAzimuthDescriptor(azimuth: number): AzimuthDescriptor {
  // 正規化到 -180 to 180
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  
  const absAzimuth = Math.abs(normalized);
  
  if (absAzimuth <= 22.5) {
    // 337.5° ~ 22.5°: 正視圖
    return {
      keyword: 'from the FRONT View',
      visualDetail: '(0° rotation), full frontal face visible, symmetrical alignment'
    };
  } else if (absAzimuth >= 157.5) {
    // 157.5° ~ 202.5°: 背面
    return {
      keyword: 'from the DIRECT BACK View',
      visualDetail: '(180° rotation), rear side of the product only'
    };
  } else if (normalized > 0) {
    // 右側
    if (normalized <= 67.5) {
      // 22.5° ~ 67.5°: 前側 (右)
      return {
        keyword: 'from the FRONT-RIGHT 3/4 View',
        visualDetail: 'displaying both front and right side, depth perception active'
      };
    } else if (normalized <= 112.5) {
      // 67.5° ~ 112.5°: 正側 (右)
      return {
        keyword: 'from the RIGHT SIDE PROFILE',
        visualDetail: '(90° lateral view), silhouette emphasis, emphasizing the width/thickness'
      };
    } else {
      // 112.5° ~ 157.5°: 後側 (右)
      return {
        keyword: 'from the BACK-RIGHT 3/4 View',
        visualDetail: 'looking from behind over the right shoulder'
      };
    }
  } else {
    // 左側
    if (normalized >= -67.5) {
      // -22.5° ~ -67.5°: 前側 (左)
      return {
        keyword: 'from the FRONT-LEFT 3/4 View',
        visualDetail: 'displaying both front and left side'
      };
    } else if (normalized >= -112.5) {
      // -67.5° ~ -112.5°: 正側 (左)
      return {
        keyword: 'from the LEFT SIDE PROFILE',
        visualDetail: '(90° lateral view), silhouette emphasis'
      };
    } else {
      // -112.5° ~ -157.5°: 後側 (左)
      return {
        keyword: 'from the BACK-LEFT 3/4 View',
        visualDetail: 'looking from behind over the left shoulder'
      };
    }
  }
}

/**
 * 模組三：組合器 (The Assembler)
 * 組合公式：[Elevation Keyword] + [Connection Verb] + [Azimuth Keyword]
 * 
 * @param azimuth - 方位角
 * @param elevation - 仰角
 * @param includeVisualDetails - 是否包含視覺細節（用於更詳細的 prompt）
 */
export function getCameraAngleDescription(
  azimuth: number, 
  elevation: number, 
  includeVisualDetails: boolean = false
): string {
  const elevationDesc = getElevationDescriptor(elevation);
  const azimuthDesc = getAzimuthDescriptor(azimuth);
  
  // 基本組合：[仰角] + [動詞] + [方位角]
  const basicPrompt = `${elevationDesc.keyword} ${elevationDesc.connectionVerb} ${azimuthDesc.keyword}`;
  
  if (!includeVisualDetails) {
    return basicPrompt;
  }
  
  // 完整組合：包含視覺細節
  return `${basicPrompt}. ${elevationDesc.visualDetail}. ${azimuthDesc.visualDetail}`;
}

/**
 * 進階優化：透視與鏡頭補償 (Perspective & Lens Modifier)
 * 根據極端角度自動添加透視和鏡頭建議
 * 
 * 黃金法則：極端角度必然產生透視變形，這是物理光學的必然結果
 * - 極端仰角/俯角 (> 45°)：必須使用廣角鏡頭，必然產生透視變形
 * - 標準視角 (< 30°)：可使用標準鏡頭，可達到零變形
 */
export function getPerspectiveModifier(elevation: number, azimuth: number): string {
  const absElevation = Math.abs(elevation);
  
  // 正規化方位角
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  const absAzimuth = Math.abs(normalized);
  
  const modifiers: string[] = [];
  
  // 極端角度（> 60°）：強制透視變形（物理必然）
  if (absElevation > 60) {
    modifiers.push('Wide angle lens, dramatic foreshortening, dynamic perspective');
  }
  // 高角度（45° ~ 60°）：明顯透視變形
  else if (absElevation > 45) {
    modifiers.push('Wide angle perspective, strong foreshortening, dynamic angle');
  }
  // 中等角度（30° ~ 45°）：適度透視
  else if (absElevation > 30) {
    modifiers.push('Moderate wide angle, natural foreshortening');
  }
  // 標準視角（< 30°）：可選擇零變形
  else if (absElevation <= 30) {
    // 水平視角 + 正交角度：建議平面構圖
    if (absElevation <= 10 && (absAzimuth <= 5 || absAzimuth >= 175 || Math.abs(absAzimuth - 90) <= 5)) {
      modifiers.push('Standard lens perspective, zero distortion, flat composition, symmetrical, rectilinear projection');
    } else {
      modifiers.push('Standard lens perspective, zero distortion, realistic proportions');
    }
  }
  
  return modifiers.length > 0 ? modifiers.join('. ') : '';
}

/**
 * 獲取完整的攝影機角度 Prompt（包含透視補償）
 * 這是最終輸出函數，可直接用於 Composition 欄位
 */
export function getCompleteCameraPrompt(azimuth: number, elevation: number): string {
  const angleDesc = getCameraAngleDescription(azimuth, elevation, false);
  const perspectiveModifier = getPerspectiveModifier(elevation, azimuth);
  
  if (perspectiveModifier) {
    return `${angleDesc}. ${perspectiveModifier}`;
  }
  
  return angleDesc;
}

/**
 * 獲取視覺提示文字（中文）
 * 用於 UI 顯示，幫助使用者理解角度效果
 */
export function getCameraAngleHint(elevation: number): string {
  if (elevation >= 80) {
    return '正頂視圖：90度垂直俯視，適合平鋪式商品攝影（Flat Lay）。';
  } else if (elevation >= 45) {
    return '鳥瞰視角：極高角度俯視，可看到物體頂部，營造俯瞰感。';
  } else if (elevation >= 10) {
    return '高角度：相機高於主體，展現更多背景和頂部細節。';
  } else if (elevation >= -10) {
    return '水平視角：最接近人眼視角，呈現自然真實的透視感。';
  } else if (elevation >= -30) {
    return '微仰角：相機略低於主體，增加一點力量感。';
  } else if (elevation >= -60) {
    return '低角度：仰視拍攝，主體顯得更有力量感和戲劇性。';
  } else {
    return '蟲視角：極低角度仰視，創造強烈的英雄視角效果。';
  }
}

/**
 * 獲取方位角提示文字（中文）
 */
export function getAzimuthHint(azimuth: number): string {
  // 正規化到 -180 to 180
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  
  const absAzimuth = Math.abs(normalized);
  
  if (absAzimuth <= 22.5) {
    return '正面視角：完整展示正面，對稱構圖。';
  } else if (absAzimuth >= 157.5) {
    return '背面視角：展示背部細節。';
  } else if (absAzimuth >= 67.5 && absAzimuth <= 112.5) {
    return normalized > 0 
      ? '右側視角：90度側面輪廓，強調厚度和側面線條。'
      : '左側視角：90度側面輪廓，強調厚度和側面線條。';
  } else {
    return normalized > 0
      ? '右前 3/4 視角：經典商品攝影角度，同時展示正面和右側。'
      : '左前 3/4 視角：經典商品攝影角度，同時展示正面和左側。';
  }
}

/**
 * 獲取顏色主題（根據角度類型）
 * 用於 UI 視覺化
 */
export function getCameraAngleColor(elevation: number): string {
  if (elevation >= 80) {
    return 'purple'; // 正頂視圖
  } else if (elevation >= 45) {
    return 'violet'; // 鳥瞰
  } else if (elevation >= 10) {
    return 'cyan'; // 高角度
  } else if (elevation >= -10) {
    return 'blue'; // 水平
  } else if (elevation >= -30) {
    return 'yellow'; // 微仰角
  } else if (elevation >= -60) {
    return 'orange'; // 低角度
  } else {
    return 'red'; // 蟲視
  }
}

/**
 * 獲取簡短的角度標籤（用於 UI 顯示）
 */
export function getCameraAngleLabel(elevation: number, azimuth: number): string {
  const elevationDesc = getElevationDescriptor(elevation);
  const azimuthDesc = getAzimuthDescriptor(azimuth);
  
  // 提取關鍵字的第一部分
  const elevationLabel = elevationDesc.keyword.split(',')[0];
  const azimuthLabel = azimuthDesc.keyword.replace('from the ', '').replace(' View', '');
  
  return `${elevationLabel} • ${azimuthLabel}`;
}

/**
 * 範例情境演示函數（用於測試和文檔）
 */
export function getExampleScenarios() {
  return [
    {
      name: '標準正視',
      azimuth: 0,
      elevation: 0,
      expected: 'EYE LEVEL SHOT, Neutral elevation facing from the FRONT View'
    },
    {
      name: '經典 45 度角',
      azimuth: 45,
      elevation: 20,
      expected: 'HIGH ANGLE SHOT, Looking down looking down from the FRONT-RIGHT 3/4 View'
    },
    {
      name: '英雄視角',
      azimuth: -45,
      elevation: -70,
      expected: 'EXTREME WORM\'S EYE VIEW, Camera on floor looking sharply up from the FRONT-LEFT 3/4 View'
    },
    {
      name: '鳥瞰俯視',
      azimuth: 0,
      elevation: 85,
      expected: 'TOP DOWN FLAT LAY, Knolling shooting straight down from the FRONT View'
    },
    {
      name: '側面輪廓',
      azimuth: 90,
      elevation: 0,
      expected: 'EYE LEVEL SHOT, Neutral elevation facing from the RIGHT SIDE PROFILE'
    }
  ];
}
