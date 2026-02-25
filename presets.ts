
import { Preset } from './types';
import { DEFAULT_STATE, migrateOpticsConfig } from './constants';

export interface PresetSeries {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  presets: Preset[];
}

// ============================================
// 特殊視角系列 (Special POV)
// ============================================
export const SPECIAL_POV_DATA: Preset[] = [
  {
    id: 'pov-1',
    name: '街頭時尚蟲視',
    series: '特殊視角系列',
    description: '魚眼鏡頭極端低角度,厚底球鞋主導前景,城市摩天大樓背景的街頭時尚攝影。',
    thumbnail: '/preset-thumbnails/special-pov/pov-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '遠景/全身',
        aspectRatio: '9:16',
        angle: '蟲視 (Worm\'s Eye)',
        lens: '8mm 魚眼',
        cameraAzimuth: 0,
        cameraElevation: -85
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '街頭時尚模特',
        description: '年輕女性,棕色齊肩髮,穿著亮紅色運動外套（袖子有白色條紋）、亮紅色緊身褲、巨大白色厚底球鞋（紅色鞋底紋路）。坐在現代極簡平台邊緣,一腿伸向鏡頭,自信放鬆地俯視相機。巨大白色厚底球鞋主導前景,極端透視變形。',
        key_feature: '',
        materials: [],
        tags: ['街頭時尚', '厚底球鞋', '運動風', '城市探索'],
        view_angle: '俯視鏡頭,自信表情'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#87ceeb',
        description: '城市屋頂或高處觀景點,背景是高聳的玻璃摩天大樓與現代建築,光滑的淺色混凝土或金屬平台,乾淨的現代質感。強烈日光從左上方照射,產生太陽光芒與鏡頭耀光效果。',
        environment: '城市屋頂高處',
        tags: ['摩天大樓', '現代建築', '玻璃幕牆', '屋頂平台']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightRotation: 315,
        lightColor: '#ffffff',
        ambientColor: '#87ceeb',
        dof: 'f/16',
        mood: '強烈日光,高對比陰影,鏡頭耀光',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '充滿活力、年輕、都市街頭風格,動感且略帶扭曲的透視',
        postProcessing: ['超精細 (Hyper-detailed)', '魚眼變形 (Fisheye Distortion)', '鏡頭耀光 (Lens Flare)', '鮮豔色彩 (Vibrant Colors)'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'pov-2',
    name: '動漫大亂鬥魚眼自拍',
    series: '特殊視角系列',
    description: '極致 8mm 魚眼變形,與多位經典動漫角色的瘋狂自拍。',
    thumbnail: '/preset-thumbnails/special-pov/pov-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '9:16',
        angle: '高角度 (High Angle)',
        lens: '8mm 魚眼',
        cameraAzimuth: 0,
        cameraElevation: 30,
        povMode: 'handheld selfie'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '人物與動漫角色群像',
        description: '人物手持相機自拍,與哆啦A夢、鳴人、大雄、五條悟、成振宇、小智一起擠入畫面,表情誇張搞怪,動作活潑。極致魚眼變形效果,所有角色臉部被誇張拉伸。',
        key_feature: '',
        materials: [],
        tags: ['動漫角色', '群體自拍', '誇張表情', '手持相機'],
        view_angle: '正面朝向鏡頭,所有角色面向相機'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#f5f5f5',
        description: '明亮的白色調簡約客廳,自然窗光與室內照明（Pale cyan）從窗戶灑入,營造柔和明亮的氛圍。',
        environment: '室內居家環境',
        tags: ['簡約', '明亮', '居家']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'flat',
        lightIntensity: 85,
        lightColor: '#ffffff',
        ambientColor: '#e8f4f8',
        dof: 'f/8',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Anime (動漫風格)',
        mood: '明亮歡樂的動畫風格,充滿活力與趣味',
        postProcessing: ['Lumen 全域光照 (Lumen Global Illumination)', '超精細 (Hyper-detailed)', '魚眼變形 (Fisheye Distortion)', '鮮豔色彩 (Vibrant Colors)'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'pov-3',
    name: '螞蟻視角商務巨塔',
    series: '特殊視角系列',
    description: '從地表仰望的極端透視,西裝人士與直衝藍天的摩天大樓。',
    thumbnail: '/preset-thumbnails/special-pov/pov-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '遠景/全身',
        aspectRatio: '9:16',
        angle: '蟲視 (Worm\'s Eye)',
        lens: '14mm 超廣角',
        cameraAzimuth: 0,
        cameraElevation: -85
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '商務人士 (Ant\'s Eye View)',
        description: '穿著西裝的男子低頭俯視鏡頭（螞蟻）,臉部在陽光下形成鮮明陰影。極端仰視透視與鏡頭耀光 (Lens Flare)。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        description: '背後是直衝藍天的高聳摩天大樓,陽光從建築縫隙透出。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightRotation: 0,
        lightColor: '#ffedd5',
        mood: '強烈寫實陰影與自然陽光耀光',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Cinematic (電影感)',
        postProcessing: ['變形鏡頭光暈 (Anamorphic lens flare)', '8k 解析度 (8k Resolution)']
      }
    }
  }
];

// ============================================
// 極簡奢華系列 (Luxury Artifacts)
// ============================================
export const LUXURY_ARTIFACTS_DATA: Preset[] = [
  {
    id: 'lux-1',
    name: 'TML mediagene 桌球組',
    series: '極簡奢華',
    description: '極簡風格的桌球組,亞麻紋理與淺色木材,TML mediagene 品牌標誌。',
    thumbnail: '/preset-thumbnails/luxury-products/lux-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中景/腰上',
        aspectRatio: '4:3',
        angle: '水平視角 (Eye Level)',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '亞麻紋理桌球拍',
        description: '放置在乾淨的白色底座上,配有一顆白色乒乓球。手工製作的木柄上刻有 TML mediagene 字樣。粗糙亞麻球拍表面。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#e2e8f0',
        description: '乾淨的淺灰色攝影棚無縫牆,左下角有極簡 UI 文字 "The table tennis set"。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'high_key',
        lightIntensity: 90,
        mood: '柔和高調商業感'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)']
      }
    }
  },
  {
    id: 'lux-2',
    name: 'TML mediagene 鐵鎚',
    series: '極簡奢華',
    description: '拋光鍍鉻鐵鎚,手柄包覆品牌藍皮革。',
    thumbnail: '/preset-thumbnails/luxury-products/lux-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中景/腰上',
        aspectRatio: '4:3',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '奢華紀念品鐵鎚',
        description: '拋光鍍鉻鎚頭,淺色木柄包覆頂級品牌藍皮革與對比色縫線。鎚頭刻有 TML mediagene 字樣。品牌藍皮革手柄。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#ffffff',
        description: '白色極簡圓形底座,懸浮陰影,右下角有 TML mediagene 標誌。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'butterfly',
        lightIntensity: 95,
        lightColor: '#ffffff'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)']
      }
    }
  },
  {
    id: 'lux-3',
    name: 'TML mediagene 開瓶器',
    series: '極簡奢華',
    description: '軍事風格堅固開瓶器,配有功能性登山扣。',
    thumbnail: '/preset-thumbnails/luxury-products/lux-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '4:3',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '戰術開瓶器',
        description: '消光橄欖綠金屬主體,橘色重型織帶配黑色登山扣。金屬上壓印 TML mediagene 標誌。戰術橘色織帶。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#f1f5f9',
        description: '乾淨的白色攝影棚方塊,科技裝備美學,左下角有 "01. THE BOTTLE OPENER" 文字。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'clamshell',
        mood: '銳利科技感光線'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)']
      }
    }
  },
  {
    id: 'lux-4',
    name: 'TML mediagene 摩卡壺',
    series: '極簡奢華',
    description: '拉絲鋁與銅製濃縮咖啡壺,帶有品牌標誌。',
    thumbnail: '/preset-thumbnails/luxury-products/lux-4.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '4:3',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '奢華摩卡壺',
        description: '拉絲鈦金屬表面上壺身,拋光銅底座,消光黑耐熱手柄。正面刻有 TML mediagene 徽章。銅與鈦雙金屬表面。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#cbd5e1',
        description: '柔和灰色攝影棚背景,淺景深。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'high_key',
        lightIntensity: 90,
        mood: '工業奢華感'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)']
      }
    }
  }
];


// ============================================
// 高端雜誌風系列 (Editorial)
// ============================================
export const EDITORIAL_SERIES_DATA: Preset[] = [
  {
    id: 'ed-1',
    name: 'Lacoste 網球紅土',
    series: '高端雜誌風',
    description: '紅色紅土球場上的白色香水,搭配網球裝備與溫暖陽光。',
    thumbnail: '/preset-thumbnails/editorial-layouts/ed-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '頂視/俯視',
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)',
        cameraAzimuth: 0,
        cameraElevation: 90
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '白色 Lacoste 香水瓶',
        description: '平放在紅色網球紅土上,正面完全可見且直立。鱷魚標誌。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#c2410c',
        description: '帶有腳印的紅色紅土網球場表面,角落有一顆網球和木製球拍。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightRotation: 315,
        lightColor: '#ffedd5',
        mood: '來自左上方的自然陽光,強烈寫實陰影'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Editorial (編輯攝影)',
        postProcessing: ['超精細 (Hyper-detailed)']
      }
    }
  },
  {
    id: 'ed-2',
    name: 'Sprite 夏日泳池',
    series: '高端雜誌風',
    description: '玻璃汽水瓶在綠松石色水中,漂浮著檸檬和冰塊。',
    thumbnail: '/preset-thumbnails/editorial-layouts/ed-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '頂視/俯視',
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)',
        cameraAzimuth: 0,
        cameraElevation: 90
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: 'Sprite 玻璃瓶',
        description: '漂浮在泳池中央,標籤完全直立。凝結水珠。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#0891b2',
        description: '綠松石色游泳池水面帶有波紋,漂浮的檸檬片和晶瑩冰塊。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightRotation: 315,
        lightColor: '#ffffff',
        mood: '明亮夏日陽光,焦散水波反光'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Editorial (編輯攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)']
      }
    }
  },
  {
    id: 'ed-3',
    name: 'Hermes 沙漠沙丘',
    series: '高端雜誌風',
    description: '波紋沙地上的奢華香水,帶有蠍子和蛇的細節。',
    thumbnail: '/preset-thumbnails/editorial-layouts/ed-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '頂視/俯視',
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)',
        cameraAzimuth: 0,
        cameraElevation: 90
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '愛馬仕大地香水 (Terre d Hermes)',
        description: '平放在細沙上,居中。琥珀色液體反光。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#d97706',
        description: '細緻波紋的沙漠沙地,附近有一隻小蠍子和一條細蛇的剪影爬行。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightRotation: 315,
        lightColor: '#fff7ed',
        mood: '溫暖黃金時刻陽光,長而戲劇性的陰影'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Editorial (編輯攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '電影顆粒 (Film Grain)']
      }
    }
  },
  {
    id: 'ed-4',
    name: 'Nivea 亞麻生活',
    series: '高端雜誌風',
    description: '米色亞麻布上的藍色乳霜罐,搭配太陽眼鏡和竹子。',
    thumbnail: '/preset-thumbnails/editorial-layouts/ed-4.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '頂視/俯視',
        aspectRatio: '1:1',
        angle: '垂直俯視 (Top-down)',
        cameraAzimuth: 0,
        cameraElevation: 90
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: 'Nivea 藍色乳霜罐',
        description: '經典藍色鐵罐放在柔軟布料上。白色浮雕標誌。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#f5f5dc',
        description: '帶有柔和皺褶的米色亞麻布,一副太陽眼鏡和竹籤。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightRotation: 315,
        lightColor: '#ffffff',
        mood: '柔和窗光,漫射寫實陰影'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Editorial (編輯攝影)',
        postProcessing: ['超精細 (Hyper-detailed)']
      }
    }
  }
];


// ============================================
// 爆炸炸雞系列 (Chicken)
// ============================================
export const CHICKEN_SERIES_DATA: Preset[] = [
  {
    id: 'chk-1',
    name: '塔塔醬爆發',
    series: '爆炸炸雞',
    description: '超寫實英雄照,濃稠塔塔醬猛烈爆發。',
    thumbnail: '/preset-thumbnails/food-photography/chk-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '3:4',
        cameraAzimuth: 0,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '金黃炸雞腿',
        description: '空中懸浮,伴隨爆裂噴發的濃稠塔塔醬、酸豆與蒔蘿碎屑。濃稠塔塔醬飛濺。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#d9f99d',
        description: '明亮的萊姆黃背景,帶有強烈的攝影棚背光。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        lightColor: '#ffffff',
        mood: '清新美食商業感'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)']
      }
    }
  },
  {
    id: 'chk-2',
    name: '白松露頂級炸雞',
    series: '爆炸炸雞',
    description: '奢華炸雞,搭配飛濺的白松露奶油醬與蘑菇碎片。',
    thumbnail: '/preset-thumbnails/food-photography/chk-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '3:4',
        cameraAzimuth: 0,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '奢華炸雞腿',
        description: '中心懸浮,被爆發性的白松露奶油醬包圍,蘑菇碎片與牛肝菌粉末在空中交織。白松露奶油飛濺。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#fde68a',
        description: '溫暖的黃紅色調,帶有電影感的柔和霧氣。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'rembrandt',
        lightColor: '#fff7ed',
        mood: '高級美食電影感'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)', '電影顆粒 (Film Grain)']
      }
    }
  },
  {
    id: 'chk-3',
    name: '煙燻起司瀑布',
    series: '爆炸炸雞',
    description: '酥脆炸雞與噴發的煙燻起司鍋,金色麵包屑點綴。',
    thumbnail: '/preset-thumbnails/food-photography/chk-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '3:4',
        cameraAzimuth: 0,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '金黃酥脆炸雞',
        description: '空中懸浮,被融化的煙燻起司鍋噴發包圍,起司液流形成戲劇性弧線,金色麵包屑飛散。熔岩起司噴發。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#f8fafc',
        description: '奶油白與灰褐色霧氣交織的背景。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 90,
        mood: '濃郁起司誘惑感'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)']
      }
    }
  },
  {
    id: 'chk-4',
    name: '味噌鮮味美學',
    series: '爆炸炸雞',
    description: '味噌奶油與鮮味奶油爆炸,灑上烤海苔粉與芝麻。',
    thumbnail: '/preset-thumbnails/food-photography/chk-4.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '3:4',
        cameraAzimuth: 0,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '濃厚味噌炸雞',
        description: '味噌奶油塗層,被動態飛濺的鮮味奶油包圍,烤海苔粉與芝麻在空中旋轉。海苔芝麻與奶油細節。',
        key_feature: ''
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#ecfccb',
        description: '簡潔溫暖的米綠色背景。'
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'clamshell',
        lightColor: '#ffffff',
        mood: '日系高級商業布光'
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)']
      }
    }
  }
];


// ============================================
// 解構美食系列 (Deconstructed Cuisine)
// ============================================
export const DECONSTRUCTED_CUISINE_DATA: Preset[] = [
  {
    id: 'decon-1',
    name: '義大利千層麵地質圖',
    series: '解構美食',
    description: '完美橫切面展示千層麵的內部層次結構,如同風味的地質圖。',
    thumbnail: '/preset-thumbnails/deconstructed-cuisine/decon-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '4:3',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '義大利千層麵橫切面',
        description: '完美電影感的義大利千層麵橫切面,乾淨俐落地從中間切開,展現所有內部層次。切面正對鏡頭,宛如風味的地質圖。每個可見層次都有細線向右延伸標記——大寫無襯體標註成分名稱,下方附帶斜體描述。熔岩起司拉絲、波隆那肉醬油脂與麵皮氣孔的極致真實質地。',
        key_feature: '',
        materials: ['起司', '波隆那肉醬', '義大利麵皮', '白醬'],
        tags: ['千層麵', '橫切面', '層次結構', '起司拉絲'],
        view_angle: '切面正對鏡頭'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#8b0000',
        description: '平坦啞光深番茄紅背景,上方有大號優雅字體「LASAGNA」,副標題「A symphony of pasta and ragù」。',
        environment: '攝影棚',
        tags: ['番茄紅', '極簡', '文字標註']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#fff7ed',
        ambientColor: '#451a03',
        dof: 'f/4',
        mood: '左側戲劇性側光投射長影,暖色聚光燈照射切面',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '建築攝影遇上科學插圖,韋斯·安德森對稱美學遇上米其林廚房',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)', '4K 解析度 (4K Resolution)'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'decon-2',
    name: '威靈頓牛排建築學',
    series: '解構美食',
    description: '展示酥皮、蘑菇泥與粉嫩菲力牛排的完美熟度與層次。',
    thumbnail: '/preset-thumbnails/deconstructed-cuisine/decon-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '4:3',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '威靈頓牛排橫切面',
        description: '完美電影感的威靈頓牛排橫切面,乾淨俐落地從中間切開,展現所有內部層次。切面正對鏡頭,宛如風味的地質圖。每個可見層次都有細線向右延伸標記——大寫無襯體標註成分名稱,下方附帶斜體描述。酥脆的金黃餅皮、濕潤的蘑菇醬與三分熟牛排纖維的極致真實質地。',
        key_feature: '',
        materials: ['酥皮', '蘑菇泥', '菲力牛排', '火腿片'],
        tags: ['威靈頓牛排', '橫切面', '酥皮', '三分熟'],
        view_angle: '切面正對鏡頭'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#2d5016',
        description: '平坦啞光森林綠背景,上方有大號優雅字體「BEEF WELLINGTON」,副標題「The ultimate culinary masterpiece」。',
        environment: '攝影棚',
        tags: ['森林綠', '極簡', '文字標註']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#fff7ed',
        ambientColor: '#365314',
        dof: 'f/4',
        mood: '左側戲劇性側光投射長影,暖色聚光燈照射切面',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '建築攝影遇上科學插圖,韋斯·安德森對稱美學遇上米其林廚房',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)', '4K 解析度 (4K Resolution)'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'decon-3',
    name: '日式厚切豬排極簡主義',
    series: '解構美食',
    description: '極簡主義的極致,厚實豬排與吐司的完美對比。',
    thumbnail: '/preset-thumbnails/deconstructed-cuisine/decon-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '4:3',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '日式厚切豬排三明治橫切面',
        description: '完美電影感的日式厚切豬排三明治橫切面,乾淨俐落地從中間切開,展現所有內部層次。切面正對鏡頭,宛如風味的地質圖。每個可見層次都有細線向右延伸標記——大寫無襯體標註成分名稱,下方附帶斜體描述。鬆軟的白吐司、金黃酥脆的炸衣與多汁的豬排斷面的極致真實質地。',
        key_feature: '',
        materials: ['白吐司', '炸豬排', '高麗菜絲', '豬排醬'],
        tags: ['豬排三明治', '橫切面', '日式', '極簡'],
        view_angle: '切面正對鏡頭'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#f5f5dc',
        description: '平坦啞光淺米色背景,上方有大號優雅字體「KATSU SANDO」,副標題「Simplicity in every bite」。',
        environment: '攝影棚',
        tags: ['米色', '極簡', '文字標註']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#ffffff',
        ambientColor: '#d4d4d4',
        dof: 'f/4',
        mood: '左側戲劇性側光投射長影,暖色聚光燈照射切面',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '建築攝影遇上科學插圖,韋斯·安德森對稱美學遇上米其林廚房',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)', '4K 解析度 (4K Resolution)'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'decon-4',
    name: '台灣滷肉飯解構藝術',
    series: '解構美食',
    description: '將滷肉、酸菜、半熟蛋與白飯垂直分層,做成藝術品般的解構展示。',
    thumbnail: '/preset-thumbnails/deconstructed-cuisine/decon-4.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '4:3',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '解構版滷肉飯垂直圓柱',
        description: '完美電影感的解構版滷肉飯橫切面,呈垂直圓柱狀切開,展現所有內部層次。切面正對鏡頭,宛如風味的地質圖。每個可見層次（滷肉、酸菜、半熟蛋、晶瑩米飯）都有細線向右延伸標記——大寫無襯體標註成分名稱,下方附帶斜體描述。閃亮的滷汁、半熟流動的蛋黃與飽滿米粒的極致真實質地。',
        key_feature: '',
        materials: ['滷肉', '酸菜', '半熟蛋', '白飯', '滷汁'],
        tags: ['滷肉飯', '解構', '垂直分層', '台灣美食'],
        view_angle: '切面正對鏡頭'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#a0522d',
        description: '平坦啞光暖赭石色背景,上方有大號優雅字體「LU ROU FAN」,副標題「Taiwan\'s soul in a bowl」。',
        environment: '攝影棚',
        tags: ['赭石色', '極簡', '文字標註']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#fff7ed',
        ambientColor: '#78350f',
        dof: 'f/4',
        mood: '左側戲劇性側光投射長影,暖色聚光燈照射切面',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '建築攝影遇上科學插圖,韋斯·安德森對稱美學遇上米其林廚房',
        postProcessing: ['超精細 (Hyper-detailed)', '光線追蹤 (Ray Tracing)', '4K 解析度 (4K Resolution)'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  }
];

// ============================================
// ASCII 藝術人像系列 (ASCII Art Portraits)
// ============================================
export const ASCII_ART_SERIES_DATA: Preset[] = [
  {
    id: 'ascii-1',
    name: 'Keanu Reeves 經典白字側臉',
    series: 'ASCII 藝術人像',
    description: '深藍背景上的白色 ASCII 字符側臉肖像,高對比向量風格。',
    thumbnail: '/preset-thumbnails/ascii-art/ascii-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '4:5',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: -90,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: 'Keanu Reeves',
        description: '左側面輪廓,標誌性的鬍鬚與髮型清晰可辨,深邃的輪廓線條。',
        key_feature: '',
        materials: [],
        tags: ['Keanu Reeves', '側臉', '好萊塢明星', '輪廓清晰'],
        view_angle: '完美側面 90 度'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#1a2332',
        description: '深海軍藍純色背景,完全平坦無紋理無漸層。',
        environment: '純色背景',
        tags: ['深藍', '純色', '極簡']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'flat',
        lightIntensity: 100,
        lightColor: '#ffffff',
        ambientColor: '#1a2332',
        dof: 'f/16',
        mood: '均勻平面照明,無陰影無漸層',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Graphic Design (平面設計)',
        mood: '乾淨銳利的向量藝術美學,數位藝術風格',
        postProcessing: [
          'NOT A PHOTOGRAPH',
          'pure typographic ASCII art portrait',
          'entire face and hair made of white ASCII text characters',
          'visible individual characters: @ # $ % & * + = - : .',
          'each character clearly readable and distinct',
          'EXTREME HIGH CONTRAST between character and background',
          'bright highlight areas: LARGE bold heavy characters like @ # $ % &',
          'mid-tone areas: MEDIUM SIZE medium weight characters like * + =',
          'shadow dark areas: SMALL thin light characters like - : .',
          'use VARIABLE CHARACTER SIZE: larger characters for bright areas, smaller for shadows',
          'combine size variation with weight variation for maximum depth',
          'NO solid white blocks, always show individual characters',
          'characters follow facial contours and create shading through size, density and weight',
          'monospace-style arrangement but with size and weight variations',
          'vector art style with clean sharp edges',
          'flat graphic design aesthetic',
          'no photorealistic elements',
          'no actual face texture, only text characters',
          'maximum contrast',
          'no gradients, no blur, no textures',
          'no watermark',
          '8K quality'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'ascii-2',
    name: 'Scarlett Johansson 霓虹賽博側臉',
    series: 'ASCII 藝術人像',
    description: '賽博龐克風格的 ASCII 人像,霓虹色字符與深色背景。',
    thumbnail: '/preset-thumbnails/ascii-art/ascii-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '4:5',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: -90,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: 'Scarlett Johansson',
        description: '左側面輪廓,優雅的鼻樑線條與飽滿的唇形,短髮造型。',
        key_feature: '',
        materials: [],
        tags: ['Scarlett Johansson', '側臉', '好萊塢明星', '賽博龐克'],
        view_angle: '完美側面 90 度'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#0a0a0a',
        description: '純黑背景,強調霓虹字符的發光效果。',
        environment: '純色背景',
        tags: ['純黑', '極簡']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'flat',
        lightIntensity: 100,
        lightColor: '#00ffff',
        ambientColor: '#ff00ff',
        dof: 'f/16',
        mood: '霓虹發光效果,賽博龐克氛圍',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Cyberpunk (賽博龐克)',
        mood: '未來主義數位藝術,霓虹發光美學',
        postProcessing: [
          'NOT A PHOTOGRAPH',
          'NOT A GRAYSCALE IMAGE',
          'pure typographic ASCII art portrait',
          'entire face and hair made ONLY of neon colored ASCII text characters',
          'visible individual characters: @ # $ % & * + = - : .',
          'each character clearly readable and distinct',
          'EXTREME HIGH CONTRAST between glowing characters and pure black background',
          'NO gray tones, NO photographic shading, NO color fills',
          'bright highlight areas: LARGE bold heavy 100% opacity cyan/magenta characters like @ # $ % &',
          'mid-tone areas: MEDIUM SIZE medium weight 60% opacity cyan/magenta characters like * + =',
          'shadow dark areas: SMALL thin 30% opacity cyan/magenta characters like - : .',
          'use ONLY character size + weight + opacity variations to create depth',
          'use VARIABLE CHARACTER SIZE: larger characters for bright areas, smaller for shadows',
          'combine size variation with weight variation and opacity variation for maximum depth',
          'NO solid color blocks, NO gray fills, always show individual characters on black',
          'pure black background with NO gray gradients',
          'cyan and magenta neon glow on characters only',
          'characters follow facial contours through size, density, weight and opacity ONLY',
          'monospace-style arrangement but with size, weight and opacity variations',
          'vector art style with clean sharp edges',
          'flat graphic design aesthetic',
          'cyberpunk digital art style',
          'no photorealistic elements',
          'no actual face texture, only glowing text characters',
          'no gray tones between characters',
          'maximum contrast',
          'no blur, no textures, no gradients',
          '8K quality'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'ascii-3',
    name: 'Tom Cruise 復古綠屏終端機',
    series: 'ASCII 藝術人像',
    description: '80 年代電腦終端機風格,綠色 ASCII 字符與黑色背景。',
    thumbnail: '/preset-thumbnails/ascii-art/ascii-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '4:5',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: -90,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: 'Tom Cruise',
        description: '左側面輪廓,標誌性的堅毅下顎線條與整齊髮型。',
        key_feature: '',
        materials: [],
        tags: ['Tom Cruise', '側臉', '好萊塢明星', '復古'],
        view_angle: '完美側面 90 度'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#000000',
        description: '純黑背景,模擬 CRT 螢幕效果。',
        environment: '純色背景',
        tags: ['純黑', '復古']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'flat',
        lightIntensity: 100,
        lightColor: '#00ff00',
        ambientColor: '#000000',
        dof: 'f/16',
        mood: '復古 CRT 螢幕發光效果',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Retro (復古風格)',
        mood: '80 年代電腦終端機美學,懷舊數位風格',
        postProcessing: [
          'NOT A PHOTOGRAPH',
          'NOT A GRAYSCALE IMAGE',
          'pure typographic ASCII art portrait',
          'entire face and hair made ONLY of green phosphor ASCII text characters',
          'visible individual characters: @ # $ % & * + = - : .',
          'each character clearly readable and distinct',
          'EXTREME HIGH CONTRAST between green characters and pure black background',
          'NO gray tones, NO photographic shading, NO color fills',
          'bright highlight areas: LARGE bold heavy 100% opacity green characters like @ # $ % &',
          'mid-tone areas: MEDIUM SIZE medium weight 60% opacity green characters like * + =',
          'shadow dark areas: SMALL thin 30% opacity green characters like - : .',
          'use ONLY character size + weight + opacity variations to create depth',
          'use VARIABLE CHARACTER SIZE: larger characters for bright areas, smaller for shadows',
          'combine size variation with weight variation and opacity variation for maximum depth',
          'NO solid green blocks, NO gray fills, always show individual characters on black',
          'pure black background with NO gray gradients',
          'CRT monitor green phosphor glow effect on characters only',
          'characters follow facial contours through size, density, weight and opacity ONLY',
          'monospace-style arrangement but with size, weight and opacity variations',
          'vector art style with clean sharp edges',
          'flat graphic design aesthetic',
          'retro computer terminal aesthetic',
          'no photorealistic elements',
          'no actual face texture, only green glowing text characters',
          'no gray tones between characters',
          'maximum contrast green on pure black',
          'no blur, no textures, no gradients',
          '8K quality'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'ascii-4',
    name: 'Margot Robbie 彩虹漸層側臉',
    series: 'ASCII 藝術人像',
    description: '側面肖像,ASCII 字符呈現彩虹漸層色彩。',
    thumbnail: '/preset-thumbnails/ascii-art/ascii-4.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '特寫/肩上',
        aspectRatio: '4:5',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: -90,
        cameraElevation: 0
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: 'Margot Robbie',
        description: '左側面輪廓,標誌性的明亮笑容與金色長髮。',
        key_feature: '',
        materials: [],
        tags: ['Margot Robbie', '側臉', '好萊塢明星', '彩虹色'],
        view_angle: '完美側面 90 度'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#1a1a2e',
        description: '深紫藍色背景,襯托彩虹字符。',
        environment: '純色背景',
        tags: ['深藍', '純色']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'butterfly',
        lightIntensity: 100,
        lightColor: '#ffffff',
        ambientColor: '#1a1a2e',
        dof: 'f/16',
        mood: '均勻照明,強調彩虹色彩',
        useAdvancedLighting: false
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Pop Art (普普藝術)',
        mood: '活潑繽紛的數位藝術風格',
        postProcessing: [
          'NOT A PHOTOGRAPH',
          'NOT A GRAYSCALE IMAGE',
          'pure typographic ASCII art portrait',
          'entire face and hair made ONLY of rainbow gradient ASCII text characters',
          'visible individual characters: @ # $ % & * + = - : .',
          'each character clearly readable and distinct',
          'EXTREME HIGH CONTRAST between colorful characters and dark background',
          'NO gray tones, NO photographic shading, NO color fills',
          'bright highlight areas: LARGE bold heavy 100% opacity colorful characters like @ # $ % &',
          'mid-tone areas: MEDIUM SIZE medium weight 60% opacity colorful characters like * + =',
          'shadow dark areas: SMALL thin 30% opacity colorful characters like - : .',
          'use ONLY character size + weight + opacity variations to create depth',
          'use VARIABLE CHARACTER SIZE: larger characters for bright areas, smaller for shadows',
          'combine size variation with weight variation and opacity variation for maximum depth',
          'NO solid color blocks, NO gray fills, always show individual characters on dark background',
          'dark background with NO gray gradients',
          'rainbow gradient from purple (top) to red (bottom) on characters only',
          'characters follow facial contours through size, density, weight and opacity ONLY',
          'monospace-style arrangement but with size, weight and opacity variations',
          'vector art style with clean sharp edges',
          'flat graphic design aesthetic',
          'vibrant pop art colors',
          'no photorealistic elements',
          'no actual face texture, only colorful text characters',
          'no gray tones between characters',
          'maximum contrast',
          'no blur, no textures, no gradients',
          '8K quality'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  }
];

// ============================================
// 能量飲品系列 (Energy Drink)
// ============================================
export const ENERGY_DRINK_SERIES_DATA: Preset[] = [
  {
    id: 'energy-1',
    name: '霓虹能量罐爆炸',
    series: '能量飲品',
    description: '黑色罐身配發光綠色字體,檸檬片與液體飛濺凍結於空中,未來科幻商業美學。',
    thumbnail: '/preset-thumbnails/energy-drink/energy-1.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '3:4',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '能量飲料罐',
        description: '黑色罐身懸浮於空中,罐身上有發光的綠色霓虹字體,字體帶有 RGB 色彩分離與故障藝術效果。周圍環繞著爆炸性的檸檬片切片與酸綠色液體飛濺,動態凍結於瞬間。藍綠色電流閃電穿梭於畫面中。蒸氣煙霧從罐頂升起。超精細的液體水珠清晰可見。',
        key_feature: '',
        materials: ['金屬罐身', '霓虹發光字體', '液體', '電流'],
        tags: ['能量飲料', '懸浮', '爆炸效果', '檸檬片', '液體飛濺', 'glitch 效果', '電流'],
        view_angle: '正面平視,罐身居中'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#0a0a0a',
        description: '未來科幻賽博網格背景,深黑色調配霓虹綠色網格線條與電路板紋理。右側有駭客任務風格的綠色代碼雨與程式碼條紋,營造數位故障美學。藍綠色電流閃電穿梭於空間中。',
        environment: '賽博空間',
        tags: ['科幻', '網格', '未來感', '黑色背景', '代碼雨', 'glitch', '電路板']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#00ff00',
        ambientColor: '#0a0a0a',
        dof: 'f/4',
        mood: '高對比戲劇性照明,霓虹綠色主光源,強調產品發光效果',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '未來科幻商業美學,充滿活力與能量感,賽博龐克氛圍,數位故障藝術風格',
        postProcessing: [
          '超精細 (Hyper-detailed)',
          '光線追蹤 (Ray Tracing)',
          '3D 渲染質感 (3D Render)',
          '銳利對焦 (Sharp Focus)',
          '高飽和度 (High Saturation)',
          '霓虹發光效果 (Neon Glow)',
          '電影級產品攝影 (Cinematic Product Photography)',
          'RGB 色差效果 (RGB Chromatic Aberration)',
          '故障藝術 (Glitch Art)',
          '數位扭曲 (Digital Distortion)',
          '色彩分離 (Color Separation)',
          '電流閃電 (Electric Lightning Bolts)',
          '駭客任務代碼雨 (Matrix-style Code Rain)',
          '賽博龐克故障效果 (Cyberpunk Glitch)'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'energy-2',
    name: 'VOLT RUSH 電壓衝擊',
    series: '能量飲品',
    description: '霓虹綠能量罐斜角穿透檸檬片與電火花,凍結的果汁飛濺與冰晶碎片,電影級廣告風格。',
    thumbnail: '/preset-thumbnails/energy-drink/energy-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '3:4',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 15,
        cameraElevation: 0,
        framingMode: 'product',
        roll: 25
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '能量飲料罐',
        description: '霓虹綠色能量飲料罐,罐身標示「VOLT RUSH」,以銳利的對角線傾斜角度穿透發光的柑橘切片與電火花。凍結的檸檬汁飛濺與冰晶碎片懸浮於空中,微小水珠清晰可見。光滑的鋁質金屬質感,罐身覆蓋凝結水珠。',
        key_feature: '',
        materials: ['拋光鋁罐', '凝結水珠', '金屬質感'],
        tags: ['能量飲料', 'VOLT RUSH', '斜角構圖', '檸檬片', '冰晶', '電火花', '飛濺'],
        view_angle: '斜角傾斜,動態構圖'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#000000',
        description: '前景：反光的濕潤表面,水波紋與罐身、冰塊、檸檬的清晰倒影。背景：深色散景背景中,發光的綠色霓虹幾何框架與結構（立方體、線條）創造出深度與層次感。霓虹標誌的戲劇性照明突出水面、罐身與檸檬片的質感細節。',
        environment: '未來感攝影棚',
        tags: ['濕潤反光表面', '水波紋', '倒影', '霓虹幾何框架', '散景', '深度感', '戲劇性照明']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#00ff00',
        ambientColor: '#000000',
        dof: 'f/2.8',
        mood: '高對比攝影棚照明,綠色霓虹輪廓光,強調金屬質感與液體細節',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '超電影感產品攝影,頂級廣告風格,充滿動態與能量',
        postProcessing: [
          '超精細 (Hyper-detailed)',
          '光線追蹤 (Ray Tracing)',
          '照片寫實 (Photorealistic)',
          '8K 解析度 (8K Resolution)',
          '銳利對焦 (Sharp Focus)',
          '淺景深 (Shallow Depth of Field)',
          '霓虹輪廓光 (Neon Rim Light)',
          '頂級廣告風格 (Premium Ad Style)',
          '微距水珠細節 (Micro Droplet Details)',
          '凍結動態 (Frozen Motion)',
          '電火花效果 (Electric Sparks)'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'energy-3',
    name: '藍色閃電能量罐',
    series: '能量飲品',
    description: '銀色金屬罐配藍色閃電圖案,電流特效與冰晶飛濺,冷色調科技感。',
    thumbnail: '/preset-thumbnails/energy-drink/energy-2.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '3:4',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '能量飲料罐',
        description: '銀色金屬罐身懸浮於空中,罐身上有發光的藍色閃電圖案與字體。周圍環繞著電流特效、冰晶碎片與藍色液體飛濺。凝結的水珠覆蓋罐身表面。',
        key_feature: '',
        materials: ['拋光金屬', '霓虹藍光', '冰晶', '液體'],
        tags: ['能量飲料', '閃電', '冰晶', '電流特效', '冷色調'],
        view_angle: '正面平視,罐身居中'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#001a33',
        description: '深藍色科技背景,帶有電路板紋理與藍色光線,營造冷冽科技感。',
        environment: '科技空間',
        tags: ['深藍', '電路板', '科技感']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'rembrandt',
        lightIntensity: 90,
        lightColor: '#00bfff',
        ambientColor: '#001a33',
        dof: 'f/4',
        mood: '冷色調戲劇性照明,藍色主光源,強調金屬質感與電流效果',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '冷冽科技感,充滿電力與速度感',
        postProcessing: [
          '超精細 (Hyper-detailed)',
          '光線追蹤 (Ray Tracing)',
          '3D 渲染質感 (3D Render)',
          '銳利對焦 (Sharp Focus)',
          '高飽和度 (High Saturation)',
          '霓虹發光效果 (Neon Glow)'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'energy-4',
    name: '紅色火焰能量罐',
    series: '能量飲品',
    description: '黑紅配色罐身,火焰特效與辣椒片飛濺,暖色調爆發力美學。',
    thumbnail: '/preset-thumbnails/energy-drink/energy-3.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '3:4',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '能量飲料罐',
        description: '黑色罐身配紅色火焰圖案懸浮於空中,罐身上有發光的紅橙色字體。周圍環繞著火焰特效、辣椒片與紅色液體飛濺。熱氣蒸騰效果。',
        key_feature: '',
        materials: ['消光黑金屬', '火焰特效', '辣椒', '液體'],
        tags: ['能量飲料', '火焰', '辣椒', '爆發力', '暖色調'],
        view_angle: '正面平視,罐身居中'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#1a0000',
        description: '深紅黑色背景,帶有火焰紋理與紅橙色光暈,營造熱力與爆發感。',
        environment: '火焰空間',
        tags: ['深紅', '火焰', '熱力']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'split',
        lightIntensity: 95,
        lightColor: '#ff4500',
        ambientColor: '#1a0000',
        dof: 'f/4',
        mood: '暖色調戲劇性照明,紅橙色主光源,強調火焰與熱力效果',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '熱力爆發感,充滿激情與力量',
        postProcessing: [
          '超精細 (Hyper-detailed)',
          '光線追蹤 (Ray Tracing)',
          '3D 渲染質感 (3D Render)',
          '銳利對焦 (Sharp Focus)',
          '高飽和度 (High Saturation)',
          '火焰發光效果 (Fire Glow)'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  },
  {
    id: 'energy-5',
    name: '紫色星雲能量罐',
    series: '能量飲品',
    description: '深紫色罐身配星空圖案,星雲粒子與紫色液體飛濺,宇宙神秘美學。',
    thumbnail: '/preset-thumbnails/energy-drink/energy-4.webp',
    config: {
      ...DEFAULT_STATE,
      camera: {
        ...DEFAULT_STATE.camera,
        shotType: '中特寫/胸上',
        aspectRatio: '3:4',
        angle: '水平視角 (Eye Level)',
        lens: '85mm 人像',
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product'
      },
      subject: {
        ...DEFAULT_STATE.subject,
        type: '能量飲料罐',
        description: '深紫色罐身配星空圖案懸浮於空中,罐身上有發光的紫色與粉色漸層字體。周圍環繞著星雲粒子特效、藍莓與紫色液體飛濺。神秘光暈效果。',
        key_feature: '',
        materials: ['金屬罐身', '星雲特效', '藍莓', '液體'],
        tags: ['能量飲料', '星雲', '宇宙', '神秘感', '紫色'],
        view_angle: '正面平視,罐身居中'
      },
      background: {
        ...DEFAULT_STATE.background,
        bgColor: '#0d001a',
        description: '深紫黑色宇宙背景,帶有星雲紋理與紫粉色光點,營造神秘宇宙感。',
        environment: '宇宙空間',
        tags: ['深紫', '星雲', '宇宙', '神秘']
      },
      optics: migrateOpticsConfig({
        ...DEFAULT_STATE.optics,
        studioSetup: 'butterfly',
        lightIntensity: 90,
        lightColor: '#9d4edd',
        ambientColor: '#0d001a',
        dof: 'f/4',
        mood: '神秘夢幻照明,紫色主光源配粉色補光,強調星雲與宇宙效果',
        useAdvancedLighting: true
      }),
      style: {
        ...DEFAULT_STATE.style,
        visualStyle: 'Commercial (商業攝影)',
        mood: '神秘宇宙美學,充滿夢幻與未知感',
        postProcessing: [
          '超精細 (Hyper-detailed)',
          '光線追蹤 (Ray Tracing)',
          '3D 渲染質感 (3D Render)',
          '銳利對焦 (Sharp Focus)',
          '高飽和度 (High Saturation)',
          '星雲發光效果 (Nebula Glow)'
        ],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    }
  }
];

// ============================================
// 系列集合與導出
// ============================================
export const ALL_PRESET_SERIES: PresetSeries[] = [
  {
    id: 'special-pov',
    name: '特殊視角系列',
    description: '從地底到魚眼,探索極端視角與跨維度角色融合。',
    coverImage: '/images/covers/G01.jpg',
    presets: SPECIAL_POV_DATA
  },
  {
    id: 'luxury',
    name: '極簡奢華',
    description: '將日常物品重新定義為奢華工藝品。',
    coverImage: '/images/covers/G02.jpg',
    presets: LUXURY_ARTIFACTS_DATA
  },
  {
    id: 'editorial',
    name: '高端雜誌風',
    description: '自然光、紋理表面與直接的頂視平拍。',
    coverImage: '/images/covers/G03.jpg',
    presets: EDITORIAL_SERIES_DATA
  },
  {
    id: 'food',
    name: '爆炸炸雞',
    description: '帶有液體動態的高速美食攝影。',
    coverImage: '/images/covers/G04.jpg',
    presets: CHICKEN_SERIES_DATA
  },
  {
    id: 'energy-drink',
    name: '能量飲品',
    description: '霓虹發光、液體爆炸與未來科幻美學的能量飲料商業攝影。',
    coverImage: '/images/covers/G05.jpg',
    presets: ENERGY_DRINK_SERIES_DATA
  },
  {
    id: 'deconstructed',
    name: '解構美食',
    description: '將經典料理橫切面化為建築藝術,展現層次與質地的科學美學。',
    coverImage: '/images/covers/G06.jpg',
    presets: DECONSTRUCTED_CUISINE_DATA
  },
  {
    id: 'ascii-art',
    name: 'ASCII 藝術人像',
    description: '將人像轉化為 ASCII 字符藝術,探索數位時代的文字肖像美學。',
    coverImage: '/images/covers/G07.jpg',
    presets: ASCII_ART_SERIES_DATA
  }
];

// 別名導出以保持向後兼容
export const ALL_SERIES = ALL_PRESET_SERIES;
export const ENERGY_DRINK_SERIES = ALL_PRESET_SERIES.find(s => s.id === 'energy-drink');
export const CHICKEN_SERIES = CHICKEN_SERIES_DATA;
