
import { TagGroup, PromptState, OpticsConfig, ShotTypeOption } from './types';

// 視覺風格選項（原 CategoryType 的風格部分移到這裡）
// 分為兩類：全局風格（影響整體色調/氛圍）和局部風格（渲染品質/攝影類型）

/**
 * 全局風格：影響整體色調、對比、氛圍
 * 這些風格會在 prompt 中優先放置，因為它們定義了整體視覺基調
 */
export const GLOBAL_VISUAL_STYLES = [
  // 電影風格
  'Film Noir (黑色電影)',
  'Sin City (罪惡之城)',
  'Blade Runner (銀翼殺手)',
  'Wes Anderson (魏斯安德森)',
  'Wong Kar-wai (王家衛)',
  'Tarantino (塔倫提諾)',
  
  // 藝術運動
  'Cyberpunk (賽博龐克)',
  'Steampunk (蒸汽龐克)',
  'Vaporwave (蒸氣波)',
  'Art Nouveau (新藝術)',
  'Brutalism (粗野主義)',
  
  // 視覺質感
  'Monochrome (黑白)',
  'Sepia Tone (棕褐色調)',
  'Neon Noir (霓虹黑色)',
  'Pastel Dream (粉彩夢境)'
];

/**
 * 局部風格：渲染品質、攝影類型、後製效果
 * 這些風格會在 prompt 中較後放置，作為「如何渲染」的指令
 */
export const LOCAL_VISUAL_STYLES = [
  // 渲染品質
  'Hyper-Realistic (超寫實)',
  'Cinematic (電影感)',
  'Ethereal (空靈氛圍)',
  'Anime Style (動漫風格)',
  'Conceptual Art (概念藝術)',
  
  // 攝影類型
  'Commercial Photography (商業攝影)',
  'Editorial Photography (編輯攝影)',
  'Fashion Photography (時尚攝影)',
  'Lifestyle Photography (生活風格)',
  'Documentary Style (紀實風格)'
];

/**
 * 完整視覺風格列表（向後兼容）
 */
export const VISUAL_STYLES = [
  ...GLOBAL_VISUAL_STYLES,
  ...LOCAL_VISUAL_STYLES
];

/**
 * 視覺風格分類（用於 UI 顯示）
 */
export const VISUAL_STYLE_CATEGORIES = [
  {
    name: '電影風格',
    styles: [
      'Film Noir (黑色電影)',
      'Sin City (罪惡之城)',
      'Blade Runner (銀翼殺手)',
      'Wes Anderson (魏斯安德森)',
      'Wong Kar-wai (王家衛)',
      'Tarantino (塔倫提諾)'
    ]
  },
  {
    name: '藝術運動',
    styles: [
      'Cyberpunk (賽博龐克)',
      'Steampunk (蒸汽龐克)',
      'Vaporwave (蒸氣波)',
      'Art Nouveau (新藝術)',
      'Brutalism (粗野主義)'
    ]
  },
  {
    name: '視覺質感',
    styles: [
      'Monochrome (黑白)',
      'Sepia Tone (棕褐色調)',
      'Neon Noir (霓虹黑色)',
      'Pastel Dream (粉彩夢境)',
      'Ethereal (空靈氛圍)'
    ]
  },
  {
    name: '攝影類型',
    styles: [
      'Hyper-Realistic (超寫實)',
      'Cinematic (電影感)',
      'Commercial Photography (商業攝影)',
      'Editorial Photography (編輯攝影)',
      'Fashion Photography (時尚攝影)',
      'Lifestyle Photography (生活風格)',
      'Documentary Style (紀實風格)',
      'Anime Style (動漫風格)',
      'Conceptual Art (概念藝術)'
    ]
  }
];

// 預設攝影機角度（快捷按鈕用）
export const CAMERA_ANGLE_PRESETS = [
  { name: '正面平視', azimuth: 0, elevation: 0 },
  { name: '正面俯視', azimuth: 0, elevation: 45 },
  { name: '正面仰視', azimuth: 0, elevation: -45 },
  { name: '側面平視', azimuth: 90, elevation: 0 },
  { name: '背面平視', azimuth: 180, elevation: 0 },
  { name: '鳥瞰', azimuth: 0, elevation: 90 },
  { name: '蟲視', azimuth: 0, elevation: -90 },
  { name: '3/4 俯視', azimuth: 45, elevation: 30 }
];

// 燈光預設使用情境分類
export type LightingScenario = 'studio' | 'outdoor_fill' | 'hybrid';

export const STUDIO_SETUPS = [
  { 
    id: 'rembrandt', 
    name: '林布蘭光 (Rembrandt)', 
    desc: '臉頰處形成三角形光斑，經典戲劇感',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 室內人像',
    promptTags: 'dramatic lighting, Rembrandt lighting, chiaroscuro, triangle catchlight',
    keyLight: { azimuth: 45, elevation: 40, intensity: 85, color: '#ffffff' },
    fillLight: { azimuth: 225, elevation: 15, intensity: 25, color: '#cbd5e1' },
    rimLight: { azimuth: 225, elevation: 45, intensity: 50, color: '#ffffff' }
  },
  { 
    id: 'butterfly', 
    name: '蝴蝶光 (Butterfly)', 
    desc: '鼻子下方形成蝴蝶狀陰影，美化五官',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 美妝人像',
    promptTags: 'butterfly lighting, glamour lighting, beauty lighting, soft shadows under nose',
    keyLight: { azimuth: 0, elevation: 50, intensity: 90, color: '#ffffff' },
    fillLight: { azimuth: 180, elevation: -20, intensity: 30, color: '#e0e7ff' },
    rimLight: { azimuth: 180, elevation: 40, intensity: 40, color: '#ffffff' }
  },
  { 
    id: 'split', 
    name: '側光 / 分割光 (Split)', 
    desc: '半臉亮半臉暗，高對比度',
    scenario: 'hybrid' as LightingScenario,
    scenarioDesc: '攝影棚 / 夜景補光',
    promptTags: 'split lighting, high contrast, dramatic shadows, half-lit face',
    keyLight: { azimuth: 90, elevation: 0, intensity: 95, color: '#ffffff' },
    fillLight: { azimuth: 0, elevation: 0, intensity: 0, color: '#cbd5e1' },
    rimLight: { azimuth: 270, elevation: 0, intensity: 0, color: '#ffffff' }
  },
  { 
    id: 'loop', 
    name: '環形光 (Loop)', 
    desc: '鼻子旁有小環狀陰影,立體感',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 自然人像',
    promptTags: 'loop lighting, natural portrait lighting, dimensional, subtle nose shadow',
    keyLight: { azimuth: 30, elevation: 35, intensity: 80, color: '#ffffff' },
    fillLight: { azimuth: 210, elevation: 20, intensity: 35, color: '#cbd5e1' },
    rimLight: { azimuth: 210, elevation: 50, intensity: 45, color: '#ffffff' }
  },
  { 
    id: 'rim', 
    name: '輪廓光 / 背光 (Rim)', 
    desc: '邊緣發光，主體與背景分離',
    scenario: 'hybrid' as LightingScenario,
    scenarioDesc: '攝影棚 / 戶外逆光',
    promptTags: 'rim lighting, backlit, edge lighting, silhouette, halo effect',
    keyLight: { azimuth: 180, elevation: 30, intensity: 40, color: '#ffffff' },
    fillLight: { azimuth: 0, elevation: 0, intensity: 0, color: '#cbd5e1' },
    rimLight: { azimuth: 0, elevation: 60, intensity: 90, color: '#ffffff' }
  },
  { 
    id: 'clamshell', 
    name: '貝殼光 (Clamshell)', 
    desc: '上下柔和補光，消除陰影',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 美妝特寫',
    promptTags: 'clamshell lighting, beauty lighting, soft even lighting, minimal shadows',
    keyLight: { azimuth: 0, elevation: 45, intensity: 75, color: '#ffffff' },
    fillLight: { azimuth: 0, elevation: -30, intensity: 50, color: '#f0f4ff' },
    rimLight: { azimuth: 180, elevation: 0, intensity: 0, color: '#ffffff' }
  },
  { 
    id: 'broad', 
    name: '寬光 (Broad)', 
    desc: '照亮面向相機的一側',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 商業人像',
    promptTags: 'broad lighting, wide face lighting, fuller appearance',
    keyLight: { azimuth: 45, elevation: 30, intensity: 85, color: '#ffffff' },
    fillLight: { azimuth: 315, elevation: 20, intensity: 20, color: '#cbd5e1' },
    rimLight: { azimuth: 225, elevation: 40, intensity: 35, color: '#ffffff' }
  },
  { 
    id: 'short', 
    name: '窄光 (Short)', 
    desc: '照亮背向相機的一側，顯瘦',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 時尚人像',
    promptTags: 'short lighting, narrow lighting, slimming effect, shadow side facing camera',
    keyLight: { azimuth: 135, elevation: 30, intensity: 85, color: '#ffffff' },
    fillLight: { azimuth: 315, elevation: 20, intensity: 25, color: '#cbd5e1' },
    rimLight: { azimuth: 315, elevation: 45, intensity: 40, color: '#ffffff' }
  },
  { 
    id: 'flat', 
    name: '平光 (Flat)', 
    desc: '陰影極少，膚色均勻',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 商品目錄',
    promptTags: 'flat lighting, even lighting, minimal shadows, commercial photography',
    keyLight: { azimuth: 0, elevation: 10, intensity: 70, color: '#ffffff' },
    fillLight: { azimuth: 180, elevation: 10, intensity: 60, color: '#e0e7ff' },
    rimLight: { azimuth: 180, elevation: 0, intensity: 0, color: '#ffffff' }
  },
  { 
    id: 'high_key', 
    name: '高調光 (High Key)', 
    desc: '明亮，純白背景',
    scenario: 'studio' as LightingScenario,
    scenarioDesc: '攝影棚 / 商業廣告',
    promptTags: 'high-key lighting, bright lighting, white background, overexposed background, clean and airy',
    keyLight: { azimuth: 0, elevation: 30, intensity: 80, color: '#ffffff' },
    fillLight: { azimuth: 180, elevation: 30, intensity: 70, color: '#f8fafc' },
    rimLight: { azimuth: 180, elevation: 50, intensity: 60, color: '#ffffff' }
  },
  
  // ========================================
  // 戶外補光預設 (Outdoor Fill Lighting)
  // ========================================
  { 
    id: 'golden_hour_fill', 
    name: '黃金時刻補光', 
    desc: '模擬日出日落的暖色側光',
    scenario: 'outdoor_fill' as LightingScenario,
    scenarioDesc: '戶外 / 黃金時刻',
    promptTags: 'golden hour lighting, warm side fill, natural outdoor light, sunset glow, soft warm illumination',
    keyLight: { azimuth: 60, elevation: 20, intensity: 70, color: '#ffd700' },
    fillLight: { azimuth: 300, elevation: 10, intensity: 40, color: '#fff5e6' },
    rimLight: { azimuth: 240, elevation: 30, intensity: 50, color: '#ff6b35' }
  },
  { 
    id: 'reflector_fill', 
    name: '反光板補光', 
    desc: '模擬反光板從下方柔化陰影',
    scenario: 'outdoor_fill' as LightingScenario,
    scenarioDesc: '戶外 / 白天補光',
    promptTags: 'reflector fill light, bounce light from below, soft shadow fill, natural daylight with fill',
    keyLight: { azimuth: 0, elevation: 45, intensity: 60, color: '#ffffff' },
    fillLight: { azimuth: 0, elevation: -30, intensity: 50, color: '#fff5e6' },
    rimLight: { azimuth: 180, elevation: 0, intensity: 0, color: '#ffffff' }
  },
  { 
    id: 'backlight_fill', 
    name: '逆光補光', 
    desc: '背光環境正面補光，避免剪影',
    scenario: 'outdoor_fill' as LightingScenario,
    scenarioDesc: '戶外 / 逆光場景',
    promptTags: 'backlit with front fill, contre-jour lighting, silhouette prevention, balanced exposure',
    keyLight: { azimuth: 180, elevation: 40, intensity: 80, color: '#ffffff' },
    fillLight: { azimuth: 0, elevation: 10, intensity: 60, color: '#e6f2ff' },
    rimLight: { azimuth: 0, elevation: 50, intensity: 70, color: '#ffffff' }
  },
  { 
    id: 'night_fill', 
    name: '夜景補光', 
    desc: '夜間街拍側面補光，保留環境光',
    scenario: 'outdoor_fill' as LightingScenario,
    scenarioDesc: '戶外 / 夜間街拍',
    promptTags: 'night portrait fill, street lighting supplement, urban night fill, ambient light preservation',
    keyLight: { azimuth: 45, elevation: 20, intensity: 65, color: '#e6f2ff' },
    fillLight: { azimuth: 315, elevation: 10, intensity: 30, color: '#cbd5e1' },
    rimLight: { azimuth: 225, elevation: 30, intensity: 40, color: '#4169e1' }
  }
];

export const LIGHTING_TAGS: TagGroup[] = [
  { 
    name: '自然與時間', 
    tags: ['黃金時刻', '藍調時刻', '陽光', '日光', '多雲光線', '月光', '黎明', '黃昏', '自然光'] 
  },
  { 
    name: '人造與攝影棚', 
    tags: ['攝影棚燈光', '螢光燈', '霓虹燈', '聚光燈', '主光', '補光', '環境光', '閃光燈'] 
  },
  { 
    name: '電影與特效', 
    tags: ['變形鏡頭光暈', '體積光', '耶穌光', '散景', '全息光', '發光效果', '鏡頭光暈', '電影感打光'] 
  },
  { 
    name: '光線質感', 
    tags: ['柔光', '硬光', '漫射光', '強烈光線', '戲劇性光線', '高對比'] 
  }
];

// 光質描述 Presets - 用於描述光的表現特質
export const LIGHT_QUALITY_PRESETS = [
  {
    name: '強烈飽和',
    description: 'vivid saturated illumination, rich color depth, intense chromatic presence'
  },
  {
    name: '柔和擴散',
    description: 'soft diffused glow, gentle color wash, subtle tonal presence'
  },
  {
    name: '戲劇性對比',
    description: 'dramatic high-contrast lighting, bold color saturation, striking visual impact'
  },
  {
    name: '自然真實',
    description: 'natural realistic lighting, authentic color rendering, true-to-life illumination'
  },
  {
    name: '電影感',
    description: 'cinematic color grading, film-like saturation, professional color depth'
  },
  {
    name: '霓虹強光',
    description: 'neon-bright illumination, hyper-saturated colors, electric color intensity'
  },
  {
    name: '柔焦夢幻',
    description: 'soft-focus ethereal glow, dreamy color diffusion, gentle luminous quality'
  },
  {
    name: '高飽和度',
    description: 'highly saturated color cast, vibrant chromatic intensity, bold color presence'
  },
  {
    name: '微妙色調',
    description: 'subtle color tint, delicate chromatic nuance, refined tonal quality'
  },
  {
    name: '強烈色彩',
    description: 'powerful color projection, dominant chromatic influence, assertive color presence'
  }
];

export const MOOD_TAGS: TagGroup[] = [
  {
    name: '商業與簡潔',
    tags: ['高調商業', '極簡主義', '奢華', '乾淨俐落', '產品英雄照', '鮮豔']
  },
  {
    name: '電影與氛圍',
    tags: ['黑色電影', '陰鬱黑暗', '戲劇性對比', '史詩感', '憂鬱', '賽博龐克']
  },
  {
    name: '藝術與夢幻',
    tags: ['空靈', '超現實', '柔和夢境', '復古', '粉彩流行', '朦朧氛圍']
  }
];

// ============================================================
// Shot Types - 景別設定
// ============================================================

/**
 * 人像攝影景別（Portrait Shot Types）
 * 基於人體部位的傳統電影景別術語
 */
export const PORTRAIT_SHOT_TYPES = [
  '微距',
  '極致特寫',
  '特寫/肩上',
  '中特寫/胸上',
  '中景/腰上',
  '中遠景/膝上',
  '遠景/全身',
  '大遠景',
  '極遠景'
];

/**
 * 商品攝影景別（Product Shot Types）
 * 基於幾何描述、畫面佔比和留白/裁切指令
 * 這些描述經過測試，能有效控制 AI 模型的構圖輸出
 */
export const PRODUCT_SHOT_TYPES: ShotTypeOption[] = [
  {
    label: '微距材質 (Macro Texture)',
    value: 'Extreme Macro detail focus on surface texture, abstract composition, millimeter-thin depth of field, filling the entire frame with material pattern'
  },
  {
    label: '局部特寫 (Detail Shot)',
    value: 'Tight close-up on a specific feature or part, cropped composition (product partially cut off by frame edge), emphasizing craftsmanship and specific design elements'
  },
  {
    label: '標準商品視角 (Standard Product View)',
    value: 'Standard Product View, Full product fits comfortably within the frame boundaries, balanced hero shot composition, zero cropping of the main subject, maximizing screen real estate'
  },
  {
    label: '寬鬆構圖 (Loose Framing)',
    value: 'Loose Framing, Full product visible but positioned with significant negative space around it, creating breathing room, minimalist and airy composition'
  },
  {
    label: '廣角環境 (Wide Environmental)',
    value: 'Wide Environmental, Wide-angle perspective, the product appears smaller within an expansive environment, establishing context and mood, high ratio of background versus subject'
  },
  {
    label: '極遠景氛圍 (Extreme Long Shot)',
    value: 'Extreme Long Shot, Subject is very small in the frame, positioned as a tiny element within a vast landscape or large architectural space, emphasizing scale and isolation'
  }
];

/**
 * 向後兼容：預設使用人像景別
 * 在 CameraSection 中會根據 framingMode 動態切換
 */
export const SHOT_TYPES = PORTRAIT_SHOT_TYPES;

export const CAMERA_ANGLE_TAGS: TagGroup[] = [
  { 
    name: '高度 (Elevation)', 
    tags: ['水平視角 (Eye Level)', '鳥瞰 (Bird\'s Eye)', '蟲視 (Worm\'s Eye)', '高角度 (High Angle)', '低角度 (Low Angle)', '垂直俯視 (Top-down)', '地面視角 (Ground Level)'] 
  },
  { 
    name: '位置 (Positioning)', 
    tags: ['腰部高度 (Waist Level)', '膝蓋高度 (Knee Level)', '肩膀高度 (Shoulder Height)', '過肩鏡頭 (Over-the-shoulder)', '手持感 (Handheld)', '胸部高度 (Chest Level)'] 
  },
  { 
    name: '風格與傾斜 (Style)', 
    tags: ['荷蘭式傾斜 (Dutch Angle)', '傾斜 (Canted)', '仰視 (Looking Up)', '俯視 (Looking Down)', '無人機視角 (Drone View)', '微傾 (Slightly Tilted)'] 
  }
];

/**
 * 特殊 POV 模式選項
 * 用於描述特殊的拍攝方式（自拍、手持、第一人稱等）
 * 這些描述會在提示詞中優先出現，影響整體拍攝視角
 */
export const POV_MODES: ShotTypeOption[] = [
  { label: '無 (None)', value: '' },
  { label: '自拍 (Selfie)', value: 'selfie perspective, arm extended holding camera' },
  { label: '手持鏡頭 (Handheld)', value: 'handheld camera perspective, natural movement' },
  { label: '第一人稱 (First-Person)', value: 'first-person POV, subjective camera' },
  { label: 'GoPro 視角', value: 'GoPro perspective, action camera mounted view' },
  { label: '胸前相機 (Chest Mount)', value: 'chest-mounted camera perspective' },
  { label: '頭戴相機 (Head Mount)', value: 'head-mounted camera perspective' },
  { label: '肩扛攝影 (Shoulder Cam)', value: 'shoulder-mounted camera, documentary style' }
];

export const ASPECT_RATIOS = ['1:1', '4:3', '3:4', '16:9', '9:16'];
export const FOCAL_LENGTHS = ['8mm 魚眼', '14mm 超廣角', '24mm 移軸', '35mm 街拍', '50mm 標準', '85mm 人像', '135mm 長焦', '200mm 特寫'];
export const COMPOSITION_RULES = ['無 (None)', '三分法 (rule_of_thirds)', '黃金比例 (golden_ratio)', '居中 (centered)', '引導線 (leading_lines)'];

export const ALIGNMENTS = [
  'top_left_region', 'top_center_region', 'top_right_region',
  'middle_left_region', 'center', 'middle_right_region',
  'bottom_left_region', 'bottom_center_region', 'bottom_right_region',
  'top_left_intersection', 'top_right_intersection',
  'bottom_left_intersection', 'bottom_right_intersection'
];

export const SUBJECT_ORIENTATIONS = [
  '正面',
  '左側 3/4',
  '右側 3/4',
  '左側面 90°',
  '右側面 90°',
  '背面',
  '頂視 / 俯視'
];

export const FILM_STYLES = [
  'Kodak Portra 400',
  'Fujifilm Superia',
  'Ilford HP5 Plus (黑白)',
  'Cinestill 800T',
  'Polaroid SX-70 (拍立得)',
  'Technicolor V3 (特藝彩色)'
];

// 風格標籤（分組管理，方便 UI 呈現）
export const STYLE_TAG_GROUPS: TagGroup[] = [
  {
    name: '渲染品質',
    tags: [
      '超精細',
      'UE5 渲染',
      '光線追蹤',
      'Lumen 全域光照',
      '8K 解析度',
      '體積光',
      '次表面散射',
      '環境光遮蔽'
    ]
  },
  {
    name: '光學效果',
    tags: [
      '變形鏡頭光暈',
      '鏡頭耀斑',
      '色差',
      '散景',
      '光暈效果'
    ]
  },
  {
    name: '後製處理',
    tags: [
      '電影顆粒',
      '色彩分級',
      '銳化',
      '對比度增強',
      'HDR 色調映射',
      '鏡頭暗角'
    ]
  },
  {
    name: '底片模擬',
    tags: [
      'Kodak Portra 400',
      'Fujifilm Superia',
      'Ilford HP5 Plus (黑白)',
      'Cinestill 800T',
      'Polaroid SX-70 (拍立得)',
      'Technicolor V3 (特藝彩色)'
    ]
  }
];

// 向後兼容：扁平化的標籤列表（供舊代碼使用）
export const STYLE_TAGS = STYLE_TAG_GROUPS.flatMap(group => group.tags);

export const SUBJECT_TAGS: TagGroup[] = [
  { name: '產品物件', tags: ['酒瓶', '手錶', '利樂包裝', '寶特瓶', '化妝品瓶', '香水瓶', '罐頭', '玻璃杯', '陶瓷杯', '金屬罐', '皮革包', '運動鞋'] },
  { name: '材質', tags: ['絲綢', '皮革', '碳纖維', '霧面塑膠', '磨砂玻璃', '拋光鉻', '亞麻', '陶瓷', '木紋', '金屬光澤'] },
  { name: '時尚穿著', tags: ['單寧牛仔', '工裝感', '寬鬆帽T', '修身西裝', '刺繡細節', '皮夾克', '針織毛衣', '絲質長裙'] },
  { name: '食品細節', tags: ['光澤淋醬', '冒蒸汽', '酥脆紋理', '融化起司', '焦糖金黃', '新鮮香草', '糖粉', '冷凝水珠'] },
  { name: '微觀細節', tags: ['水珠', '微塵', '毛孔', '表面刮痕', '蒸汽', '霜', '露水'] },
  { name: '人物年齡', tags: ['兒童 (5-12歲)', '青少年 (13-19歲)', '青年 (20-35歲)', '中年 (36-55歲)', '老年 (56歲以上)'] },
  { name: '人物職業', tags: ['商務人士', '藝術家', '運動員', '廚師', '醫護人員', '工程師', '時尚模特兒', '街頭藝人', '學生', '音樂家'] },
  { name: '人物動作', tags: ['奔跑', '跳躍', '坐姿', '站立', '行走', '揮手', '微笑', '思考姿態', '伸展', '彎腰', '轉身', '凝視遠方'] },
  { name: '人物表情', tags: ['微笑', '大笑', '嚴肅', '驚訝', '沉思', '自信', '溫柔', '專注', '放鬆', '興奮'] }
];

export const ENV_TAGS: TagGroup[] = [
  { name: '攝影棚', tags: ['無限灰', '專業攝影棚', '無縫牆', '高調照明', '低調照明', '柔光箱'] },
  { name: '自然', tags: ['茂密森林', '山頂', '迷霧湖泊', '沙漠沙丘', '海底', '熱帶花園'] },
  { name: '城市', tags: ['霓虹街道', '粗野主義混凝土', '現代頂層公寓', '廢棄工廠', '東京夜景'] }
];

export const DEFAULT_STATE: PromptState = {
  camera: {
    shotType: '中特寫/胸上',  // 預設使用人像景別
    angle: 'Eye Level',
    aspectRatio: '1:1',
    lens: '50mm 標準',
    roll: 0,
    composition: {
      rule: 'rule_of_thirds',
      focal_point: 'subject',
      alignment: 'center',
      elementPlacements: []
    },
    cameraAzimuth: 0,
    cameraElevation: 0,
    framingMode: 'auto',  // 預設為自動偵測
    povMode: ''  // 預設無特殊 POV 模式
  },
  subject: {
    type: '',
    description: '',
    materials: [],
    tags: [],
    view_angle: '',
    key_feature: ''
  },
  background: {
    description: '',
    environment: 'None',
    tags: [],
    bgColor: '#1e293b'
  },
  optics: {
    dof: 'f/2.8',
    // 新的獨立光源控制
    keyLight: {
      azimuth: 45,      // 方位角（正視圖）
      elevation: 30,    // 仰角（側視圖）
      color: '#ffffff',
      intensity: 80
    },
    fillLight: {
      azimuth: 225,     // 對側
      elevation: 15,
      color: '#cbd5e1',
      intensity: 30
    },
    rimLight: {
      azimuth: 225,     // 背後位置（keyLight 的反向）
      elevation: 45,    // 只控制高度，方位自動鎖定背後
      color: '#ffffff',
      intensity: 50
    },
    ambientColor: '#1a1a1a',
    studioSetup: 'rembrandt',
    source: '',
    mood: '',  // mood 已移到 StyleConfig，這裡保留空字串以保持向後兼容
    useAdvancedLighting: true,
    // 向後兼容的舊欄位
    lightColor: '#ffffff',
    lightIntensity: 80,
    lightRotation: 45,
    fillLightColor: '#cbd5e1',
    fillLightIntensity: 30,
    rimLightColor: '#ffffff',
    rimLightIntensity: 50
  },
  style: {
    visualStyle: '',  // 預設為空，讓用戶選擇
    mood: '',  // 預設為空，讓用戶選擇
    postProcessing: [],  // 預設為空，讓用戶選擇
    filmStyle: 'None',
    grain: 'Low',
    vignette: true
  }
};


// 遷移函數：將舊格式的 OpticsConfig 轉換為新格式
export function migrateOpticsConfig(config: OpticsConfig): OpticsConfig {
  // 如果已經有新格式的數據，直接返回
  if (config.keyLight && config.fillLight && config.rimLight) {
    return config;
  }
  
  // 從舊格式遷移到新格式
  return {
    ...config,
    keyLight: {
      azimuth: config.lightRotation || 45,
      elevation: 30, // 預設仰角
      color: config.lightColor || '#ffffff',
      intensity: config.lightIntensity || 80
    },
    fillLight: {
      azimuth: ((config.lightRotation || 45) + 180) % 360, // 對側
      elevation: 15,
      color: config.fillLightColor || '#cbd5e1',
      intensity: config.fillLightIntensity || 30
    },
    rimLight: {
      azimuth: ((config.lightRotation || 45) + 180) % 360, // 背後位置
      elevation: 45,
      color: config.rimLightColor || '#ffffff',
      intensity: config.rimLightIntensity || 50
    }
  };
}
