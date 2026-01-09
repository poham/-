
import { CategoryType, TagGroup, PromptState } from './types';

export const CATEGORIES = Object.values(CategoryType);

export const STUDIO_SETUPS = [
  { id: 'rembrandt', name: '林布蘭光 (Rembrandt)', angle: 45, desc: '臉頰處形成三角形光斑，經典戲劇感' },
  { id: 'butterfly', name: '蝴蝶光 (Butterfly)', angle: 0, desc: '鼻子下方形成蝴蝶狀陰影，美化五官' },
  { id: 'split', name: '側光 / 分割光 (Split)', angle: 90, desc: '半臉亮半臉暗，高對比度' },
  { id: 'loop', name: '環形光 (Loop)', angle: 30, desc: '鼻子旁有小環狀陰影，立體感' },
  { id: 'rim', name: '輪廓光 / 背光 (Rim)', angle: 180, desc: '邊緣發光，主體與背景分離' },
  { id: 'clamshell', name: '貝殼光 (Clamshell)', angle: 0, desc: '上下柔和補光，消除陰影' },
  { id: 'broad', name: '寬光 (Broad)', angle: 45, desc: '照亮面向相機的一側' },
  { id: 'short', name: '窄光 (Short)', angle: 45, desc: '照亮背向相機的一側，顯瘦' },
  { id: 'flat', name: '平光 (Flat)', angle: 0, desc: '陰影極少，膚色均勻' },
  { id: 'high_key', name: '高調光 (High Key)', angle: 0, desc: '明亮，純白背景' }
];

export const LIGHTING_TAGS: TagGroup[] = [
  { 
    name: '自然與時間 (Natural & Time)', 
    tags: ['黃金時刻 (Golden hour)', '藍調時刻 (Blue hour)', '陽光 (Sunlight)', '日光 (Daylight)', '多雲光線 (Cloudy lighting)', '月光 (Moonlight)', '黎明 (Dawn)', '黃昏 (Dusk)', '自然光 (Natural lighting)'] 
  },
  { 
    name: '人造與攝影棚 (Artificial)', 
    tags: ['攝影棚燈光 (Studio lighting)', '螢光燈 (Fluorescent)', '霓虹燈 (Neon light)', '聚光燈 (Spotlight)', '主光 (Key light)', '補光 (Fill light)', '環境光 (Ambient light)', '閃光燈 (Flash)'] 
  },
  { 
    name: '電影與特效 (Cinematic)', 
    tags: ['變形鏡頭光暈 (Anamorphic lens flare)', '體積光 (Volumetric lighting)', '耶穌光 (God rays)', '散景 (Bokeh)', '全息光 (Holographic)', '發光效果 (Glowing effect)', '鏡頭光暈 (Lens flare)', '電影感打光 (Cinematic lighting)'] 
  },
  { 
    name: '光線質感 (Quality)', 
    tags: ['柔光 (Soft lighting)', '硬光 (Hard lighting)', '漫射光 (Diffused light)', '強烈光線 (Harsh light)', '戲劇性光線 (Dramatic lighting)', '高對比 (High-contrast)'] 
  }
];

export const MOOD_TAGS: TagGroup[] = [
  {
    name: '商業與簡潔 (Commercial)',
    tags: ['高調商業 (High-Key Commercial)', '極簡主義 (Minimalist)', '奢華 (Luxury)', '乾淨俐落 (Clean & Crisp)', '產品英雄照 (Product Hero)', '鮮豔 (Vibrant)']
  },
  {
    name: '電影與氛圍 (Moody)',
    tags: ['黑色電影 (Film Noir)', '陰鬱黑暗 (Moody & Dark)', '戲劇性對比 (Dramatic Contrast)', '史詩感 (Epic)', '憂鬱 (Melancholic)', '賽博龐克 (Cyberpunk Noir)']
  },
  {
    name: '藝術與夢幻 (Artistic)',
    tags: ['空靈 (Ethereal)', '超 surreal', '柔和夢境 (Soft Dream)', '復古 (Retro Vintage)', '粉彩流行 (Pastel Pop)', '朦朧氛圍 (Hazy Atmosphere)']
  }
];

export const SHOT_TYPES = [
  '極致特寫 (Extreme Close-up / ECU)',
  '特寫 (Close-up / CU)',
  '中特寫 (Medium Close-up / MCU)',
  '中景 (Medium Shot / MS)',
  '中遠景 (Medium Long Shot / MLS)',
  '遠景 (Long Shot / LS)',
  '全身 (Full Body)',
  '微距 (Macro Shot)'
];

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
  '正面 (Facing Front)',
  '左側 3/4 (Facing 3/4 Left)',
  '右側 3/4 (Facing 3/4 Right)',
  '左側面 90° (Profile Left)',
  '右側面 90° (Profile Right)',
  '背面 (Facing Away)',
  '頂視 / 俯視 (Top-Down)'
];

export const FILM_STYLES = [
  'Kodak Portra 400',
  'Fujifilm Superia',
  'Ilford HP5 Plus (黑白)',
  'Cinestill 800T',
  'Polaroid SX-70 (拍立得)',
  'Technicolor V3 (特藝彩色)'
];

export const STYLE_TAGS = [
  '超精細 (Hyper-detailed)',
  'UE5 渲染 (Unreal Engine 5 Render)',
  '光線追蹤 (Ray Tracing)',
  'Lumen 全域光照 (Lumen Global Illumination)',
  '電影顆粒 (Film Grain)',
  '變形鏡頭光暈 (Anamorphic lens flare)',
  '柔和暗角 (Soft Vignette)',
  '8k 解析度 (8k Resolution)',
  '透視校正 (Perspective Correction)', 
  '魚眼變形 (Fisheye Distortion)',      
  '移軸微縮 (Tilt-Shift Miniature)',   
  '垂直線條校正 (Straight Vertical Lines)' 
];

export const SUBJECT_TAGS: TagGroup[] = [
  { name: '材質 (Materials)', tags: ['絲綢 (Silk)', '皮革 (Leather)', '碳纖維 (Carbon Fiber)', '霧面塑膠 (Matte Plastic)', '磨砂玻璃 (Frosted Glass)', '拋光鉻 (Polished Chrome)', '亞麻 (Linen)', '陶瓷 (Ceramic)'] },
  { name: '時尚穿著 (Clothing)', tags: ['單寧牛仔 (Denim)', '工裝感 (Techwear)', '寬鬆帽T (Oversized Hoodie)', '修身西裝 (Tailored Suit)', '刺繡細節 (Embroidery)', '皮夾克 (Leather Jacket)', '針織毛衣 (Knit Sweater)', '絲質長裙 (Silk Dress)'] },
  { name: '食品細節 (Food)', tags: ['光澤淋醬 (Glistening Glaze)', '冒蒸汽 (Steam)', '酥脆紋理 (Crumb Texture)', '融化起司 (Melted Cheese)', '焦糖金黃 (Golden Crust)', '新鮮香草 (Fresh Herbs)', '糖粉 (Powdered Sugar)', '冷凝水珠 (Condensation)'] },
  { name: '微觀細節 (Micro)', tags: ['水珠 (Water Droplets)', '微塵 (Micro-dust)', '毛孔 (Pores)', '表面刮痕 (Surface Scratches)', '蒸汽 (Steam)', '霜 (Frost)', '露水 (Dew)'] }
];

export const ENV_TAGS: TagGroup[] = [
  { name: '攝影棚 (Studio)', tags: ['無限灰 (Infinite Grey)', '專業攝影棚 (Photography Studio)', '無縫牆 (Cyclorama Wall)', '高調照明 (High-Key Lighting)', '低調照明 (Low-Key Lighting)', '柔光箱 (Softbox)'] },
  { name: '自然 (Natural)', tags: ['茂密森林 (Dense Forest)', '山頂 (Mountain Peak)', '迷霧湖泊 (Misty Lake)', '沙漠沙丘 (Desert Dunes)', '海底 (Ocean Floor)', '熱帶花園 (Tropical Garden)'] },
  { name: '城市 (Urban)', tags: ['霓虹街道 (Neon Streets)', '粗野主義混凝土 (Brutalist Concrete)', '現代頂層公寓 (Modern Penthouse)', '廢棄工廠 (Abandoned Factory)', '東京夜景 (Tokyo Night)'] }
];

export const DEFAULT_STATE: PromptState = {
  category: CategoryType.SpecialPOV,
  camera: {
    shotType: '中特寫 (Medium Close-up / MCU)',
    angle: '水平視角 (Eye Level)',
    aspectRatio: '1:1',
    lens: '50mm 標準',
    roll: 0, // 新增
    composition: {
      rule: 'rule_of_thirds',
      focal_point: 'subject',
      alignment: 'center'
    },
    visualYOffset: 0
  },
  subject: {
    type: '',
    description: '',
    materials: [],
    tags: [],
    view_angle: '正面 (Facing Front)',
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
    lightColor: '#ffffff',
    ambientColor: '#1a1a1a',
    lightIntensity: 80,
    lightRotation: 45,
    studioSetup: 'rembrandt',
    source: '',
    mood: '柔和電影感 (soft_cinematic)',
    useAdvancedLighting: true,
    fillLightColor: '#cbd5e1',
    fillLightIntensity: 30,
    rimLightColor: '#ffffff',
    rimLightIntensity: 50
  },
  style: {
    postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)'],
    filmStyle: 'None',
    grain: 'Low',
    vignette: true
  }
};
