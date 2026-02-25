/**
 * Chinese Translations for Live Protocol Deck
 * 
 * 此模組提供 Live Protocol Deck 的中文翻譯對照表
 * 用於將英文的技術描述轉換為中文，讓使用者更容易理解
 * 
 * 注意：這些翻譯僅用於 UI 顯示，實際導出的 prompt 仍保持英文
 */

/**
 * 標籤名稱的中文翻譯
 */
export const LABEL_TRANSLATIONS: Record<string, string> = {
  'THEME': '主題風格',
  'POV MODE': '特殊視角模式',
  'CAMERA POSITION': '攝影機位置',
  'LENS OPTICS': '鏡頭光學',
  'SHOT TYPE': '景別尺度',
  'DEPTH OF FIELD': '景深效果',
  'COMPOSITION RULE': '構圖法則',
  'SUBJECT DETAILS': '主體細節',
  'ENVIRONMENT': '環境場景',
  'LIGHTING PRESET': '燈光預設',
  'LIGHTING SETUP': '燈光設定',
  'LIGHTING STYLE': '燈光風格',
  'LIGHTING GEOMETRY': '燈光幾何',
  'KEY LIGHT': '主光源',
  'FILL LIGHT': '補光',
  'RIM LIGHT': '輪廓光',
  'MOOD': '氛圍情緒',
  'RENDERING STYLE': '渲染風格',
};

/**
 * 常見攝影術語的中文翻譯
 */
const PHOTOGRAPHY_TERMS: Record<string, string> = {
  // Camera positions - 攝影機位置
  'camera positioned at': '攝影機位於',
  'eye-level': '平視',
  'high angle': '高角度',
  'low angle': '低角度',
  'overhead': '頂視',
  'bird\'s eye': '鳥瞰',
  'worm\'s eye': '蟲視',
  'ground level': '地面視角',
  'looking down': '俯視',
  'looking up': '仰視',
  'frontal view': '正面視角',
  'side view': '側面視角',
  'three-quarter view': '四分之三視角',
  'back view': '背面視角',
  
  // Lens types - 鏡頭類型
  'using': '使用',
  'fisheye lens': '魚眼鏡頭',
  'ultra-wide-angle lens': '超廣角鏡頭',
  'wide-angle lens': '廣角鏡頭',
  'moderate wide-angle lens': '中廣角鏡頭',
  'standard lens': '標準鏡頭',
  'short telephoto lens': '短焦望遠鏡頭',
  'portrait telephoto lens': '人像望遠鏡頭',
  'medium telephoto lens': '中焦望遠鏡頭',
  'super telephoto lens': '超望遠鏡頭',
  'macro lens': '微距鏡頭',
  'perspective': '透視',
  
  // Distortion - 變形
  'extreme barrel distortion': '極端桶狀變形',
  'pronounced barrel distortion': '明顯桶狀變形',
  'noticeable barrel distortion': '可見桶狀變形',
  'slight barrel distortion': '輕微桶狀變形',
  'zero distortion': '無變形',
  'minimal compression': '最小壓縮',
  'moderate compression': '適度壓縮',
  'strong compression': '強烈壓縮',
  'extreme compression': '極端壓縮',
  'rectilinear projection': '直線投影',
  'spherical projection': '球面投影',
  
  // Field of view - 視野
  '180-degree field of view': '180度視野',
  'wide field of view': '寬廣視野',
  'narrow field of view': '窄視野',
  'exaggerated spatial depth': '誇張的空間深度',
  'expanded spatial depth': '擴展的空間深度',
  'natural spatial relationships': '自然的空間關係',
  'neutral spatial rendering': '中性空間渲染',
  'subject isolation': '主體隔離',
  'subject-background separation': '主體背景分離',
  'flattened depth planes': '平面化深度層次',
  'collapsed spatial depth': '壓縮的空間深度',
  'stacked background layers': '堆疊的背景層次',
  'environmental context': '環境背景',
  'dramatic foreground emphasis': '戲劇性前景強調',
  'flattering proportions': '討喜的比例',
  'flattering facial proportions': '討喜的臉部比例',
  
  // Shot types - 景別
  'extreme close-up': '極致特寫',
  'close-up': '特寫',
  'medium close-up': '中特寫',
  'medium shot': '中景',
  'medium long shot': '中遠景',
  'long shot': '遠景',
  'very long shot': '大遠景',
  'extreme long shot': '極遠景',
  'full body shot': '全身鏡頭',
  'waist-up shot': '腰部以上',
  'head and shoulders': '頭肩',
  'face filling frame': '臉部填滿畫面',
  'eyes and facial features': '眼睛與臉部特徵',
  'intimate framing': '親密取景',
  'tight framing': '緊湊取景',
  'balanced composition': '平衡構圖',
  'centered composition': '中央構圖',
  
  // Depth of field - 景深
  'creating': '創造',
  'extremely shallow depth of field': '極淺景深',
  'very shallow depth of field': '非常淺的景深',
  'shallow depth of field': '淺景深',
  'moderate depth of field': '中等景深',
  'deep depth of field': '深景深',
  'maximum depth of field': '最大景深',
  'hyperfocal depth of field': '超焦距景深',
  'creamy bokeh': '奶油般的散景',
  'soft background blur': '柔和的背景模糊',
  'background blur': '背景模糊',
  'balanced sharpness': '平衡的銳利度',
  'sharp throughout scene': '整個場景清晰',
  'everything in focus': '全部對焦',
  'tack sharp': '極度銳利',
  'millimeter-thin focus plane': '毫米級薄焦平面',
  'background completely dissolved': '背景完全溶解',
  'dreamy background blur': '夢幻般的背景模糊',
  'cinematic look': '電影感',
  'premium commercial look': '高級商業感',
  'professional look': '專業感',
  'natural portrait look': '自然人像感',
  'documentary style': '紀錄片風格',
  'editorial style': '編輯風格',
  'catalog quality': '目錄品質',
  'technical photography': '技術攝影',
  'scientific photography': '科學攝影',
  'landscape photography': '風景攝影',
  'architectural clarity': '建築清晰度',
  'infinite sharpness': '無限銳利',
  'maximum clarity': '最大清晰度',
  
  // Composition - 構圖
  'using rule of thirds grid': '使用三分法構圖',
  'using golden ratio composition': '使用黃金比例構圖',
  'using centered composition': '使用中央構圖',
  'diagonal composition': '對角線構圖',
  'symmetrical composition': '對稱構圖',
  'dynamic composition': '動態構圖',
  'minimalist composition': '極簡構圖',
  'negative space composition': '負空間構圖',
  
  // Lighting - 燈光
  'natural lighting': '自然光',
  'studio lighting': '攝影棚燈光',
  'soft lighting': '柔光',
  'hard lighting': '硬光',
  'dramatic lighting': '戲劇性燈光',
  'ambient light': '環境光',
  'directional light': '方向光',
  'diffused light': '漫射光',
  'key light': '主光',
  'fill light': '補光',
  'rim light': '輪廓光',
  'backlight': '背光',
  'side lighting': '側光',
  'front lighting': '正面光',
  'top-down lighting': '頂光',
  'upward lighting': '底光',
  'three-quarter back lighting': '四分之三背光',
  'split lighting': '分割光',
  'rembrandt lighting': '林布蘭光',
  'rembrandt': '林布蘭',
  'butterfly lighting': '蝴蝶光',
  'butterfly': '蝴蝶',
  'loop lighting': '環形光',
  'loop': '環形',
  'clamshell lighting': '蚌殼光',
  'clamshell': '蚌殼',
  'flat lighting': '平光',
  'flat': '平光',
  'loop lighting': '環形光',
  'clamshell lighting': '蚌殼光',
  'high-key lighting': '高調光',
  'low-key lighting': '低調光',
  'broad lighting': '寬光',
  'short lighting': '窄光',
  'flat lighting': '平光',
  'dimensional shadows': '立體陰影',
  'sculptural quality': '雕塑質感',
  'minimal shadows': '最小陰影',
  'clear shadows': '清晰陰影',
  'dramatic shadows': '戲劇性陰影',
  'edge highlights': '邊緣高光',
  'silhouette effect': '剪影效果',
  'halo glow': '光暈',
  'high contrast': '高對比',
  'low contrast': '低對比',
  'even illumination': '均勻照明',
  'soft even illumination': '柔和均勻照明',
  'controlled lighting': '控制光線',
  'natural ambient lighting': '自然環境光',
  
  // Mood - 氛圍
  'dramatic': '戲劇性',
  'moody': '情緒化',
  'bright': '明亮',
  'dark': '黑暗',
  'mysterious': '神秘',
  'elegant': '優雅',
  'energetic': '充滿活力',
  'calm': '平靜',
  'serene': '寧靜',
  'intense': '強烈',
  'soft': '柔和',
  'warm': '溫暖',
  'cool': '冷調',
  'clinical precision': '臨床精準',
  'epic scale': '史詩規模',
  
  // Style - 風格
  'cinematic': '電影感',
  'commercial': '商業',
  'editorial': '編輯風格',
  'documentary': '紀錄片',
  'artistic': '藝術',
  'minimalist': '極簡',
  'vintage': '復古',
  'modern': '現代',
  'clean': '乾淨',
  'airy': '通透',
  'ultra-sharp detail': '超銳利細節',
  'extreme detail': '極致細節',
  
  // Camera roll - 相機滾轉
  'tilted': '傾斜',
  'slightly tilted': '輕微傾斜',
  'dutch angle': '荷蘭角',
  'canted angle': '傾斜角度',
  'off-axis': '偏軸',
  'off-balance': '失衡',
  'sideways': '側向',
  'upside down': '上下顛倒',
  'inverted': '倒置',
  'rotated': '旋轉',
  'vertical orientation': '垂直方向',
  'clockwise': '順時針',
  'counter-clockwise': '逆時針',
  'subtle tilt': '微妙傾斜',
  
  // Product photography - 商品攝影
  'product view': '商品視角',
  'product centered': '商品置中',
  'product details': '商品細節',
  'key features visible': '主要特徵可見',
  'product with context': '商品與背景',
  'product fully visible': '商品完全可見',
  'complete form visible': '完整形態可見',
  'full product view': '完整商品視角',
  'standard product view': '標準商品視角',
  'flat lay': '平鋪',
  'top-down view': '頂視圖',
  'knolling arrangement': '整齊排列',
  'lifestyle setting': '生活場景',
  'environmental elements': '環境元素',
  
  // Macro photography - 微距攝影
  'macro detail': '微距細節',
  'microscopic view': '顯微視角',
  'magnified details': '放大細節',
  'texture detail': '質感細節',
  'surface texture': '表面質感',
  'material detail': '材質細節',
  'fiber texture': '纖維質感',
  'revealing surface detail': '呈現表面細節',
  'texture-revealing illumination': '質感呈現照明',
  'controlled macro lighting': '控制微距照明',
  
  // Wide shot - 大遠景
  'establishing shot': '建立鏡頭',
  'vast environment': '廣闊環境',
  'massive scale environment': '大規模環境',
  'expansive environment': '擴展環境',
  'environmental storytelling': '環境敘事',
  'vast empty space': '廣闊空白空間',
  'negative space': '負空間',
  'realistic proportions': '寫實比例',
  'surreal fantasy scale': '超現實幻想規模',
  'dreamlike atmosphere': '夢幻氛圍',
  'monumental composition': '紀念碑式構圖',
  
  // Common descriptors - 常見描述詞
  'natural': '自然',
  'neutral': '中性',
  'balanced': '平衡',
  'dynamic': '動態',
  'powerful': '強大',
  'immersive': '沉浸式',
  'comfortable': '舒適',
  'following': '跟隨',
  'elevated': '提升',
  'aerial': '空中',
  'overview': '總覽',
  'viewpoint': '視點',
  'angle': '角度',
  'horizon': '地平線',
  'natural horizon': '自然地平線',
  'subject appears smaller': '主體顯得較小',
  'subject appears powerful': '主體顯得強大',
  'subject appears dominant': '主體顯得主導',
  'subject appears diminished': '主體顯得縮小',
  'directly overhead': '正上方',
  'extreme low angle': '極低角度',
  'dramatic upward perspective': '戲劇性向上透視',
  'downward gaze': '向下凝視',
  'upward gaze': '向上凝視',
};

/**
 * 將英文描述翻譯成中文
 * 使用智能匹配，支援部分匹配和多詞組合
 * 
 * @param text - 英文描述文字
 * @returns 中文翻譯（如果找不到對應翻譯則返回原文）
 */
export function translateToChineseUI(text: string): string {
  if (!text) return text;
  
  let translated = text;
  
  // 先嘗試完整匹配（不區分大小寫）
  const lowerText = text.toLowerCase();
  for (const [english, chinese] of Object.entries(PHOTOGRAPHY_TERMS)) {
    if (lowerText === english.toLowerCase()) {
      return chinese;
    }
  }
  
  // 部分匹配：替換所有找到的術語
  // 按照長度排序，優先匹配較長的詞組（避免部分匹配覆蓋完整匹配）
  const sortedTerms = Object.entries(PHOTOGRAPHY_TERMS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [english, chinese] of sortedTerms) {
    // 使用正則表達式進行不區分大小寫的替換
    const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    translated = translated.replace(regex, chinese);
  }
  
  return translated;
}

/**
 * 翻譯標籤名稱
 * 
 * @param label - 英文標籤名稱
 * @returns 中文標籤名稱
 */
export function translateLabel(label: string): string {
  return LABEL_TRANSLATIONS[label] || label;
}

/**
 * 批量翻譯 categorizedParts
 * 
 * @param parts - 原始的 categorizedParts 陣列
 * @returns 翻譯後的陣列
 */
export function translateCategorizedParts(
  parts: { label: string; text: string; color: string }[]
): { label: string; text: string; color: string }[] {
  return parts.map(part => ({
    ...part,
    label: translateLabel(part.label),
    text: translateToChineseUI(part.text),
  }));
}
