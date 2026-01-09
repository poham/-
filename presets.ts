
import { Preset, CategoryType } from './types';
import { DEFAULT_STATE } from './constants';

export interface PresetSeries {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  presets: Preset[];
}

export const SPECIAL_POV_DATA: Preset[] = [
  {
    id: 'pov-1',
    name: '名流與麥當勞叔叔',
    series: '特殊視角系列',
    description: '電影級超寫實融合：時尚人物與麥當勞叔叔的調皮棚拍。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.SpecialPOV,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '全身 (Full Body)', 
        aspectRatio: '1:1',
        angle: '水平視角 (Eye Level)',
        lens: '50mm 標準'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '時尚人物與麥當勞叔叔 (Ronald McDonald)', 
        description: '人物穿著淺灰色針織毛衣與高腰牛仔褲，環抱著 3D 超寫實 CGI 材質的麥當勞叔叔，雙方比例一致，接觸處有自然壓痕與遮擋陰影。', 
        key_feature: '精準臉部還原與調皮調皮的表情' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#1e293b', 
        description: '極簡乾淨的灰藍色攝影棚背景。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        studioSetup: 'clamshell', 
        lightColor: '#ffffff', 
        rimLightIntensity: 40,
        mood: '電影級柔和主光與微弱輪廓光' 
      },
      style: {
        ...DEFAULT_STATE.style,
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)', '電影顆粒 (Film Grain)']
      }
    }
  },
  {
    id: 'pov-2',
    name: '動漫大亂鬥魚眼自拍',
    series: '特殊視角系列',
    description: '極致 8mm 魚眼變形，與多位經典動漫角色的瘋狂自拍。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Anime,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '微距 (Macro Shot)', 
        aspectRatio: '9:16',
        angle: '高角度 (High Angle)',
        lens: '8mm 魚眼'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '人物與動漫英雄大集合', 
        description: '人物與哆啦A夢、鳴人、大雄、五條悟、成振宇、小智進行瘋狂自拍，表情誇張搞怪。', 
        key_feature: '極致魚眼變形 (Extreme Fisheye Distortion)' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#ffffff', 
        description: '明亮的白色調簡約客廳。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        studioSetup: 'flat', 
        lightIntensity: 90,
        mood: '明亮寫實的動畫角色光影融合' 
      },
      style: {
        ...DEFAULT_STATE.style,
        postProcessing: ['Lumen 全域光照 (Lumen Global Illumination)', '超精細 (Hyper-detailed)']
      }
    }
  },
  {
    id: 'pov-3',
    name: '螞蟻視角商務巨塔',
    series: '特殊視角系列',
    description: '從地表仰望的極端透視，西裝人士與直衝藍天的摩天大樓。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.SpecialPOV,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '遠景 (Long Shot / LS)', 
        aspectRatio: '9:16',
        angle: '蟲視 (Worm\'s Eye)',
        lens: '14mm 超廣角'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '商務人士 (Ant\'s Eye View)', 
        description: '穿著西裝的男子低頭俯視鏡頭（螞蟻），臉部在陽光下形成鮮明陰影。', 
        key_feature: '極端仰視透視與鏡頭耀光 (Lens Flare)' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        description: '背後是直衝藍天的高聳摩天大樓，陽光從建築縫隙透出。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        lightRotation: 0, 
        lightColor: '#ffedd5',
        mood: '強烈寫實陰影與自然陽光耀光' 
      },
      style: {
        ...DEFAULT_STATE.style,
        postProcessing: ['變形鏡頭光暈 (Anamorphic lens flare)', '8k 解析度 (8k Resolution)']
      }
    }
  }
];

export const LUXURY_ARTIFACTS_DATA: Preset[] = [
  {
    id: 'lux-1',
    name: 'Jaquemus 桌球組',
    series: '極簡奢華',
    description: '極簡風格的桌球組，亞麻紋理與淺色木材，JAQUEMUS 品牌標誌。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '中景 (Medium Shot / MS)', aspectRatio: '4:3', angle: '水平視角 (Eye Level)' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '亞麻紋理桌球拍', 
        description: '放置在乾淨的白色底座上，配有一顆白色乒乓球。手工製作的木柄上刻有 JAQUEMUS 字樣。', 
        key_feature: '粗糙亞麻球拍表面' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#e2e8f0', 
        description: '乾淨的淺灰色攝影棚無縫牆，左下角有極簡 UI 文字 "The table tennis set"。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'high_key', lightIntensity: 90, mood: '柔和高調商業感' }
    }
  },
  {
    id: 'lux-2',
    name: 'Tiffany & Co. 鐵鎚',
    series: '極簡奢華',
    description: '拋光鍍鉻鐵鎚，手柄包覆 Tiffany 藍皮革。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '中景 (Medium Shot / MS)', aspectRatio: '4:3' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '奢華紀念品鐵鎚', 
        description: '拋光鍍鉻鎚頭，淺色木柄包覆頂級 Tiffany 藍皮革與對比色縫線。鎚頭刻有 TIFFANY & CO. 字樣。', 
        key_feature: 'Tiffany 藍皮革手柄' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#ffffff', 
        description: '白色極簡圓形底座，懸浮陰影，右下角有 TIFFANY 標誌。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'butterfly', lightIntensity: 95, lightColor: '#ffffff' }
    }
  },
  {
    id: 'lux-3',
    name: 'The North Face 開瓶器',
    series: '極簡奢華',
    description: '軍事風格堅固開瓶器，配有功能性登山扣。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '中特寫 (Medium Close-up / MCU)', aspectRatio: '4:3' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '戰術開瓶器', 
        description: '消光橄欖綠金屬主體，橘色重型織帶配黑色登山扣。金屬上壓印 THE NORTH FACE 標誌。', 
        key_feature: '戰術橘色織帶' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#f1f5f9', 
        description: '乾淨的白色攝影棚方塊，科技裝備美學，左下角有 "01. THE BOTTLE OPENER" 文字。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'clamshell', mood: '銳利科技感光線' }
    }
  },
  {
    id: 'lux-4',
    name: 'Cadillac 摩卡壺',
    series: '極簡奢華',
    description: '拉絲鋁與銅製濃縮咖啡壺，帶有凱迪拉克品牌標誌。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '特寫 (Close-up / CU)', aspectRatio: '4:3' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '奢華摩卡壺', 
        description: '拉絲鈦金屬表面上壺身，拋光銅底座，消光黑耐熱手柄。正面刻有凱迪拉克徽章。', 
        key_feature: '銅與鈦雙金屬表面' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#cbd5e1', 
        description: '柔和灰色攝影棚背景，淺景深。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'rembrandt', lightColor: '#fff7ed', mood: '工業奢華感' }
    }
  }
];

export const EDITORIAL_SERIES_DATA: Preset[] = [
  {
    id: 'ed-1',
    name: 'Lacoste 網球紅土',
    series: '高端雜誌風',
    description: '紅色紅土球場上的白色香水，搭配網球裝備與溫暖陽光。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '頂視 / 俯視 (Top-Down)', 
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '白色 Lacoste 香水瓶', 
        description: '平放在紅色網球紅土上，正面完全可見且直立。', 
        key_feature: '鱷魚標誌' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#c2410c', 
        description: '帶有腳印的紅色紅土網球場表面，角落有一顆網球和木製球拍。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        lightRotation: 315, 
        lightColor: '#ffedd5', 
        mood: '來自左上方的自然陽光，強烈寫實陰影' 
      }
    }
  },
  {
    id: 'ed-2',
    name: 'Sprite 夏日泳池',
    series: '高端雜誌風',
    description: '玻璃汽水瓶在綠松石色水中，漂浮著檸檬和冰塊。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '頂視 / 俯視 (Top-Down)', 
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: 'Sprite 玻璃瓶', 
        description: '漂浮在泳池中央，標籤完全直立。', 
        key_feature: '凝結水珠' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#0891b2', 
        description: '綠松石色游泳池水面帶有波紋，漂浮的檸檬片和晶瑩冰塊。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        lightRotation: 315, 
        lightColor: '#ffffff', 
        mood: '明亮夏日陽光，焦散水波反光' 
      }
    }
  },
  {
    id: 'ed-3',
    name: 'Hermes 沙漠沙丘',
    series: '高端雜誌風',
    description: '波紋沙地上的奢華香水，帶有蠍子和蛇的細節。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '頂視 / 俯視 (Top-Down)', 
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '愛馬仕大地香水 (Terre d Hermes)', 
        description: '平放在細沙上，居中。', 
        key_feature: '琥珀色液體反光' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#d97706', 
        description: '細緻波紋的沙漠沙地，附近有一隻小蠍子和一條細蛇的剪影爬行。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        lightRotation: 315, 
        lightColor: '#fff7ed', 
        mood: '溫暖黃金時刻陽光，長而戲劇性的陰影' 
      }
    }
  },
  {
    id: 'ed-4',
    name: 'Nivea 亞麻生活',
    series: '高端雜誌風',
    description: '米色亞麻布上的藍色乳霜罐，搭配太陽眼鏡和竹子。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { 
        ...DEFAULT_STATE.camera, 
        shotType: '頂視 / 俯視 (Top-Down)', 
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)'
      },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: 'Nivea 藍色乳霜罐', 
        description: '經典藍色鐵罐放在柔軟布料上。', 
        key_feature: '白色浮雕標誌' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#f5f5dc', 
        description: '帶有柔和皺褶的米色亞麻布，一副太陽眼鏡和竹籤。' 
      },
      optics: { 
        ...DEFAULT_STATE.optics, 
        lightRotation: 315, 
        lightColor: '#ffffff', 
        mood: '柔和窗光，漫射寫實陰影' 
      }
    }
  }
];

export const CHICKEN_SERIES_DATA: Preset[] = [
  {
    id: 'chk-1',
    name: '塔塔醬爆發',
    series: '爆炸炸雞',
    description: '超寫實英雄照，濃稠塔塔醬猛烈爆發。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '特寫 (Close-up / CU)', aspectRatio: '3:4' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '金黃炸雞腿', 
        description: '空中懸浮，伴隨爆裂噴發的濃稠塔塔醬、酸豆與蒔蘿碎屑。', 
        key_feature: '濃稠塔塔醬飛濺' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#d9f99d', 
        description: '明亮的萊姆黃背景，帶有強烈的攝影棚背光。' 
      },
      optics: { ...DEFAULT_STATE.optics, lightColor: '#ffffff', mood: '清新美食商業感' }
    }
  },
  {
    id: 'chk-2',
    name: '白松露頂級炸雞',
    series: '爆炸炸雞',
    description: '奢華炸雞，搭配飛濺的白松露奶油醬與蘑菇碎片。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '特寫 (Close-up / CU)', aspectRatio: '3:4' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '奢華炸雞腿', 
        description: '中心懸浮，被爆發性的白松露奶油醬包圍，蘑菇碎片與牛肝菌粉末在空中交織。', 
        key_feature: '白松露奶油飛濺' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#fde68a', 
        description: '溫暖的黃紅色調，帶有電影感的柔和霧氣。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'rembrandt', lightColor: '#fff7ed', mood: '高級美食電影感' }
    }
  },
  {
    id: 'chk-3',
    name: '煙燻起司瀑布',
    series: '爆炸炸雞',
    description: '酥脆炸雞與噴發的煙燻起司鍋，金色麵包屑點綴。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '特寫 (Close-up / CU)', aspectRatio: '3:4' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '金黃酥脆炸雞', 
        description: '空中懸浮，被融化的煙燻起司鍋噴發包圍，起司液流形成戲劇性弧線，金色麵包屑飛散。', 
        key_feature: '熔岩起司噴發' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#f8fafc', 
        description: '奶油白與灰褐色霧氣交織的背景。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'split', lightIntensity: 90, mood: '濃郁起司誘惑感' }
    }
  },
  {
    id: 'chk-4',
    name: '味噌鮮味美學',
    series: '爆炸炸雞',
    description: '味噌奶油與鮮味奶油爆炸，灑上烤海苔粉與芝麻。',
    config: {
      ...DEFAULT_STATE,
      category: CategoryType.Product,
      camera: { ...DEFAULT_STATE.camera, shotType: '特寫 (Close-up / CU)', aspectRatio: '3:4' },
      subject: { 
        ...DEFAULT_STATE.subject, 
        type: '濃厚味噌炸雞', 
        description: '味噌奶油塗層，被動態飛濺的鮮味奶油包圍，烤海苔粉與芝麻在空中旋轉。', 
        key_feature: '海苔芝麻與奶油細節' 
      },
      background: { 
        ...DEFAULT_STATE.background, 
        bgColor: '#ecfccb', 
        description: '簡潔溫暖的米綠色背景。' 
      },
      optics: { ...DEFAULT_STATE.optics, studioSetup: 'clamshell', lightColor: '#ffffff', mood: '日系高級商業布光' }
    }
  }
];

export const ALL_SERIES: PresetSeries[] = [
  {
    id: 'series-pov',
    name: '特殊視角系列',
    description: '從地底到魚眼，探索極端視角與跨維度角色融合。',
    coverImage: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=800',
    presets: SPECIAL_POV_DATA
  },
  {
    id: 'series-luxury',
    name: '極簡奢華',
    description: '將日常物品重新定義為奢華工藝品。',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    presets: LUXURY_ARTIFACTS_DATA
  },
  {
    id: 'series-editorial',
    name: '高端雜誌風',
    description: '自然光、紋理表面與直接的頂視平拍。',
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    presets: EDITORIAL_SERIES_DATA
  },
  {
    id: 'series-chicken',
    name: '爆炸炸雞',
    description: '帶有液體動態的高速美食攝影。',
    coverImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    presets: CHICKEN_SERIES_DATA
  },
  {
    id: 'series-beverage',
    name: '飲品藝術',
    description: '掌握凝結水珠、飛濺和奢華容器渲染。',
    coverImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    presets: [
      {
        id: 'bev-1',
        name: '香草奶油拿鐵',
        series: '飲品系列',
        description: '消光奶油罐與金色焦 caramel 拿鐵瀑布。',
        config: {
          ...DEFAULT_STATE,
          category: CategoryType.Product,
          camera: { ...DEFAULT_STATE.camera, shotType: '中特寫 (Medium Close-up / MCU)', aspectRatio: '9:16', lens: '35mm 街拍' },
          subject: { ...DEFAULT_STATE.subject, type: '消光奶油罐', description: '帶有柔和水氣，香草莢和咖啡豆優雅地環繞在罐子周圍。', key_feature: '香草莢' },
          background: { ...DEFAULT_STATE.background, bgColor: '#f5f5dc', description: '巴黎的大理石咖啡桌，金色焦 caramel 拿鐵液體傾瀉在桌上，濺起水花。' },
          optics: { ...DEFAULT_STATE.optics, lightColor: '#fff7ed', mood: '粉彩奢華感', ambientColor: '#451a03' }
        }
      }
    ]
  }
];

export const CHICKEN_SERIES = ALL_SERIES.find(s => s.id === 'series-chicken')?.presets || [];
export const BEVERAGE_SERIES = ALL_SERIES.find(s => s.id === 'series-beverage')?.presets || [];
