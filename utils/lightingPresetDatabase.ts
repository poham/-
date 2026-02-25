/**
 * 燈光預設資料庫 - 參數驅動系統
 * 
 * 將每個 Preset 拆解為：
 * 1. 幾何限制 (Geometry Constraints) - 物理座標與容許誤差
 * 2. 幾何標籤 (Geometry Tags) - 當角度改變過大時必須移除
 * 3. 風格標籤 (Style Tags) - 即使角度改變仍應保留的質感描述
 */

export interface LightingPresetDefinition {
  id: string;
  name: string;
  
  // 物理參數定義
  base_params: {
    keyLight: {
      azimuth: number;    // 基準方位角
      elevation: number;  // 基準仰角
    };
    fillLight?: {
      azimuth: number;
      elevation: number;
    };
    rimLight?: {
      azimuth: number;
      elevation: number;
    };
  };
  
  // 容許誤差（度數）
  tolerance: {
    azimuth: number;    // 方位角容許誤差
    elevation: number;  // 仰角容許誤差
  };
  
  // A類標籤：幾何特徵（角度改變過大時必須移除）
  geometry_tags: string[];
  
  // B類標籤：風格與光質（即使角度改變也應保留）
  style_tags: string[];
  
  // 產品攝影模式的替代用語（Portrait → Product 映射）
  product_mode_mapping?: {
    [key: string]: string;  // 例如 "cheek" → "surface"
  };
}

/**
 * 燈光預設資料庫
 */
export const LIGHTING_PRESET_DATABASE: Record<string, LightingPresetDefinition> = {
  
  // ========================================
  // 林布蘭光 (Rembrandt)
  // ========================================
  rembrandt: {
    id: 'rembrandt',
    name: 'Rembrandt Lighting',
    
    base_params: {
      keyLight: { azimuth: 45, elevation: 40 },
      fillLight: { azimuth: 225, elevation: 15 },
      rimLight: { azimuth: 225, elevation: 45 }
    },
    
    tolerance: {
      azimuth: 15,   // ±15° 方位角容許誤差
      elevation: 15  // ±15° 仰角容許誤差
    },
    
    geometry_tags: [
      'Rembrandt lighting style',
      'Triangle catchlight on cheek',
      'Classic 45-degree portrait setup',
      'Nose shadow reaching toward cheek'
    ],
    
    style_tags: [
      'Dramatic chiaroscuro',
      'High contrast illumination',
      'Sculptural rendering',
      'Deep defined shadows',
      'Renaissance painting quality'
    ],
    
    product_mode_mapping: {
      'cheek': 'surface',
      'nose shadow': 'volume shadow',
      'catchlight': 'reflective highlight',
      'face': 'object'
    }
  },
  
  // ========================================
  // 蝴蝶光 (Butterfly)
  // ========================================
  butterfly: {
    id: 'butterfly',
    name: 'Butterfly Lighting',
    
    base_params: {
      keyLight: { azimuth: 0, elevation: 50 },
      fillLight: { azimuth: 180, elevation: -20 },
      rimLight: { azimuth: 180, elevation: 40 }
    },
    
    tolerance: {
      azimuth: 10,
      elevation: 15
    },
    
    geometry_tags: [
      'Butterfly lighting',
      'Glamour lighting setup',
      'Centered high-angle key light',
      'Butterfly-shaped shadow under nose',
      'Beauty lighting pattern'
    ],
    
    style_tags: [
      'Soft flattering illumination',
      'Even facial modeling',
      'Glamorous aesthetic',
      'Minimal shadow depth',
      'Fashion photography quality'
    ],
    
    product_mode_mapping: {
      'nose': 'central axis',
      'facial': 'surface',
      'shadow under nose': 'shadow beneath object'
    }
  },
  
  // ========================================
  // 側光 / 分割光 (Split)
  // ========================================
  split: {
    id: 'split',
    name: 'Split Lighting',
    
    base_params: {
      keyLight: { azimuth: 90, elevation: 0 },
      fillLight: { azimuth: 0, elevation: 0 },
      rimLight: { azimuth: 270, elevation: 0 }
    },
    
    tolerance: {
      azimuth: 10,
      elevation: 10
    },
    
    geometry_tags: [
      'Split lighting',
      'Side profile illumination',
      '90-degree side light',
      'Half-lit half-shadow division',
      'Vertical light-dark split'
    ],
    
    style_tags: [
      'Mystery and drama',
      'High contrast',
      'Stark separation',
      'Film noir aesthetic',
      'Intense mood'
    ],
    
    product_mode_mapping: {
      'profile': 'side surface',
      'half-lit': 'half-illuminated'
    }
  },
  
  // ========================================
  // 環形光 (Loop)
  // ========================================
  loop: {
    id: 'loop',
    name: 'Loop Lighting',
    
    base_params: {
      keyLight: { azimuth: 30, elevation: 35 },
      fillLight: { azimuth: 210, elevation: 20 },
      rimLight: { azimuth: 210, elevation: 50 }
    },
    
    tolerance: {
      azimuth: 15,
      elevation: 15
    },
    
    geometry_tags: [
      'Loop lighting',
      'Natural portrait lighting',
      'Small loop-shaped nose shadow',
      'Subtle dimensional modeling'
    ],
    
    style_tags: [
      'Natural and approachable',
      'Soft dimensional rendering',
      'Balanced contrast',
      'Everyday portrait quality',
      'Gentle modeling'
    ],
    
    product_mode_mapping: {
      'nose shadow': 'volume shadow',
      'dimensional': 'three-dimensional'
    }
  },
  
  // ========================================
  // 輪廓光 / 背光 (Rim)
  // ========================================
  rim: {
    id: 'rim',
    name: 'Rim Lighting',
    
    base_params: {
      keyLight: { azimuth: 180, elevation: 30 },
      fillLight: { azimuth: 0, elevation: 0 },
      rimLight: { azimuth: 0, elevation: 60 }
    },
    
    tolerance: {
      azimuth: 20,
      elevation: 20
    },
    
    geometry_tags: [
      'Rim lighting',
      'Backlit setup',
      'Edge lighting from behind',
      'Silhouette emphasis',
      'Halo effect around edges'
    ],
    
    style_tags: [
      'Dramatic separation from background',
      'Glowing edge definition',
      'Ethereal quality',
      'Strong depth perception',
      'Cinematic backlighting'
    ]
  },
  
  // ========================================
  // 貝殼光 (Clamshell)
  // ========================================
  clamshell: {
    id: 'clamshell',
    name: 'Clamshell Lighting',
    
    base_params: {
      keyLight: { azimuth: 0, elevation: 45 },
      fillLight: { azimuth: 0, elevation: -30 },
      rimLight: { azimuth: 180, elevation: 0 }
    },
    
    tolerance: {
      azimuth: 10,
      elevation: 15
    },
    
    geometry_tags: [
      'Clamshell lighting',
      'Beauty lighting',
      'Vertical dual-source setup',
      'Top and bottom fill',
      'Wraparound illumination'
    ],
    
    style_tags: [
      'Soft even lighting',
      'Minimal shadows',
      'Flattering beauty aesthetic',
      'Clean commercial look',
      'Shadow-free rendering'
    ]
  },
  
  // ========================================
  // 寬光 (Broad)
  // ========================================
  broad: {
    id: 'broad',
    name: 'Broad Lighting',
    
    base_params: {
      keyLight: { azimuth: 45, elevation: 30 },
      fillLight: { azimuth: 315, elevation: 20 },
      rimLight: { azimuth: 225, elevation: 40 }
    },
    
    tolerance: {
      azimuth: 15,
      elevation: 15
    },
    
    geometry_tags: [
      'Broad lighting',
      'Wide face lighting',
      'Illuminating camera-facing side',
      'Fuller appearance setup'
    ],
    
    style_tags: [
      'Open and welcoming',
      'Expansive feel',
      'Bright and accessible',
      'Friendly portrait quality'
    ]
  },
  
  // ========================================
  // 窄光 (Short)
  // ========================================
  short: {
    id: 'short',
    name: 'Short Lighting',
    
    base_params: {
      keyLight: { azimuth: 135, elevation: 30 },
      fillLight: { azimuth: 315, elevation: 20 },
      rimLight: { azimuth: 315, elevation: 45 }
    },
    
    tolerance: {
      azimuth: 15,
      elevation: 15
    },
    
    geometry_tags: [
      'Short lighting',
      'Narrow lighting',
      'Illuminating shadow side',
      'Slimming effect setup'
    ],
    
    style_tags: [
      'Sculpted and refined',
      'Slimming aesthetic',
      'Sophisticated mood',
      'Editorial quality'
    ]
  },
  
  // ========================================
  // 平光 (Flat)
  // ========================================
  flat: {
    id: 'flat',
    name: 'Flat Lighting',
    
    base_params: {
      keyLight: { azimuth: 0, elevation: 10 },
      fillLight: { azimuth: 180, elevation: 10 },
      rimLight: { azimuth: 180, elevation: 0 }
    },
    
    tolerance: {
      azimuth: 15,
      elevation: 15
    },
    
    geometry_tags: [
      'Flat lighting',
      'Even frontal illumination',
      'Minimal shadow setup',
      'Direct camera-axis lighting'
    ],
    
    style_tags: [
      'Clean commercial aesthetic',
      'Even skin tone',
      'Minimal texture emphasis',
      'Catalog photography quality',
      'Shadow-free rendering'
    ]
  },
  
  // ========================================
  // 高調光 (High Key)
  // ========================================
  high_key: {
    id: 'high_key',
    name: 'High Key Lighting',
    
    base_params: {
      keyLight: { azimuth: 0, elevation: 30 },
      fillLight: { azimuth: 180, elevation: 30 },
      rimLight: { azimuth: 180, elevation: 50 }
    },
    
    tolerance: {
      azimuth: 20,
      elevation: 20
    },
    
    geometry_tags: [
      'High-key lighting',
      'Bright multi-source setup',
      'Overexposed background',
      'White seamless backdrop'
    ],
    
    style_tags: [
      'Bright and airy',
      'Clean and optimistic',
      'Minimal contrast',
      'Commercial advertising quality',
      'Pure white environment'
    ]
  },
  
  // ========================================
  // 戶外補光預設 (Outdoor Fill Lighting)
  // ========================================
  
  // 黃金時刻補光 (Golden Hour Fill)
  golden_hour_fill: {
    id: 'golden_hour_fill',
    name: 'Golden Hour Fill Lighting',
    
    base_params: {
      keyLight: { azimuth: 60, elevation: 20 },
      fillLight: { azimuth: 300, elevation: 10 },
      rimLight: { azimuth: 240, elevation: 30 }
    },
    
    tolerance: {
      azimuth: 20,
      elevation: 15
    },
    
    geometry_tags: [
      'Golden hour side lighting',
      'Warm directional fill',
      'Low-angle natural light',
      'Sunset-style illumination'
    ],
    
    style_tags: [
      'Warm golden glow',
      'Soft natural shadows',
      'Romantic atmosphere',
      'Outdoor portrait quality',
      'Magic hour aesthetic'
    ]
  },
  
  // 反光板補光 (Reflector Fill)
  reflector_fill: {
    id: 'reflector_fill',
    name: 'Reflector Fill Lighting',
    
    base_params: {
      keyLight: { azimuth: 0, elevation: 45 },
      fillLight: { azimuth: 0, elevation: -30 },
      rimLight: { azimuth: 180, elevation: 0 }
    },
    
    tolerance: {
      azimuth: 15,
      elevation: 20
    },
    
    geometry_tags: [
      'Reflector bounce light',
      'Bottom fill illumination',
      'Natural daylight with reflector',
      'Upward soft fill'
    ],
    
    style_tags: [
      'Soft shadow reduction',
      'Natural outdoor look',
      'Eye catchlight enhancement',
      'Flattering fill light',
      'Professional outdoor portrait'
    ]
  },
  
  // 逆光補光 (Backlight Fill)
  backlight_fill: {
    id: 'backlight_fill',
    name: 'Backlight Fill Lighting',
    
    base_params: {
      keyLight: { azimuth: 180, elevation: 40 },
      fillLight: { azimuth: 0, elevation: 10 },
      rimLight: { azimuth: 0, elevation: 50 }
    },
    
    tolerance: {
      azimuth: 20,
      elevation: 20
    },
    
    geometry_tags: [
      'Backlit with front fill',
      'Contre-jour setup',
      'Silhouette prevention lighting',
      'Balanced backlight exposure'
    ],
    
    style_tags: [
      'Glowing edge definition',
      'Preserved subject detail',
      'Dramatic yet balanced',
      'Professional backlit portrait',
      'Halo effect with detail'
    ]
  },
  
  // 夜景補光 (Night Fill)
  night_fill: {
    id: 'night_fill',
    name: 'Night Fill Lighting',
    
    base_params: {
      keyLight: { azimuth: 45, elevation: 20 },
      fillLight: { azimuth: 315, elevation: 10 },
      rimLight: { azimuth: 225, elevation: 30 }
    },
    
    tolerance: {
      azimuth: 20,
      elevation: 15
    },
    
    geometry_tags: [
      'Night portrait fill',
      'Urban street lighting supplement',
      'Low-intensity side fill',
      'Ambient light preservation'
    ],
    
    style_tags: [
      'Moody night atmosphere',
      'Subtle fill enhancement',
      'Urban night portrait',
      'Cool tone illumination',
      'Street photography aesthetic'
    ]
  }
};
