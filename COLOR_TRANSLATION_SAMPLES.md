# 顏色翻譯與 JSON 格式範例

## 目的
測試 Gemini 對於結構化 JSON 格式的理解能力，以及顏色翻譯的效果。

---

## Sample 1: Jaquemus 桌球組 (高調光 High Key)

### 技術參數 JSON (給 Gemini 理解用)

```json
{
  "scene_metadata": {
    "preset_name": "Jaquemus 桌球組",
    "photography_style": "極簡奢華商業攝影",
    "target_aesthetic": "柔和高調商業感"
  },
  
  "camera_setup": {
    "physical_position": {
      "azimuth_degrees": 0,
      "azimuth_description": "正面拍攝 (frontal view)",
      "elevation_degrees": 0,
      "elevation_description": "水平視角 (eye level)"
    },
    "lens_optics": {
      "focal_length": "50mm",
      "perspective_type": "標準鏡頭 (standard lens)",
      "distortion": "零變形 (zero distortion)"
    },
    "framing": {
      "shot_type": "中景 (medium shot)",
      "aspect_ratio": "4:3",
      "composition_rule": "三分法 (rule of thirds)"
    }
  },
  
  "subject": {
    "primary_object": "亞麻紋理桌球拍",
    "material_composition": ["linen texture", "light wood"],
    "key_visual_feature": "粗糙亞麻球拍表面",
    "placement": "放置在乾淨的白色底座上",
    "accessories": "配有一顆白色乒乓球",
    "branding": "手工製作的木柄上刻有 JAQUEMUS 字樣"
  },
  
  "lighting_system": {
    "preset_name": "High Key Lighting (高調光)",
    "lighting_philosophy": "明亮多光源設定，營造乾淨商業感",
    
    "key_light": {
      "technical_params": {
        "azimuth": 0,
        "elevation": 30,
        "color_hex": "#ffffff",
        "color_description": "純白色 (pure white), 中性色溫 (neutral color temperature)",
        "intensity_percent": 80
      },
      "visual_effect": "正面照明，略微從上方打下，創造柔和陰影"
    },
    
    "fill_light": {
      "technical_params": {
        "azimuth": 180,
        "elevation": 30,
        "color_hex": "#f8fafc",
        "color_description": "極淺灰白 (very pale blue-white), 冷色調 (cool tone)",
        "intensity_percent": 70
      },
      "visual_effect": "背面補光，填補陰影，確保畫面明亮均勻"
    },
    
    "rim_light": {
      "technical_params": {
        "azimuth": 180,
        "elevation": 50,
        "color_hex": "#ffffff",
        "color_description": "純白色 (pure white), 中性色溫",
        "intensity_percent": 60
      },
      "visual_effect": "背後輪廓光，創造物體邊緣的光暈效果"
    },
    
    "lighting_mood": "明亮且通風 (bright and airy), 乾淨且樂觀 (clean and optimistic), 最小對比度 (minimal contrast)"
  },
  
  "environment": {
    "background_color_hex": "#e2e8f0",
    "background_color_description": "淺灰藍色 (soft gray-blue), 中性偏冷色調 (neutral-cool tone), 像混凝土般的質感 (like concrete)",
    "scene_description": "乾淨的淺灰色攝影棚無縫牆",
    "ui_elements": "左下角有極簡 UI 文字 'The table tennis set'"
  },
  
  "post_processing": {
    "visual_style": "Commercial (商業攝影)",
    "rendering_quality": ["超精細 (Hyper-detailed)"],
    "color_grading": "高調明亮 (high-key bright)",
    "film_simulation": "None"
  },
  
  "final_prompt_assembly_order": [
    "1. Camera Setup (相機設定)",
    "2. Subject Details (主體細節)",
    "3. Lighting System (燈光系統)",
    "4. Environment (環境)",
    "5. Post-Processing (後製風格)"
  ]
}
```

---

## Sample 2: 戲劇性桌球拍 (高對比測試)

### 技術參數 JSON (測試強烈對比的顏色翻譯)

```json
{
  "scene_metadata": {
    "preset_name": "戲劇性桌球拍攝影",
    "photography_style": "電影感商業攝影",
    "target_aesthetic": "強烈對比，神秘氛圍"
  },
  
  "camera_setup": {
    "physical_position": {
      "azimuth_degrees": 45,
      "azimuth_description": "側面 45 度 (45-degree side angle)",
      "elevation_degrees": 30,
      "elevation_description": "略微俯視 (slightly elevated)"
    },
    "lens_optics": {
      "focal_length": "85mm",
      "perspective_type": "人像鏡頭 (portrait telephoto)",
      "compression": "中等壓縮感 (moderate compression)"
    },
    "framing": {
      "shot_type": "特寫 (close-up)",
      "aspect_ratio": "4:3",
      "composition_rule": "黃金比例 (golden ratio)"
    }
  },
  
  "subject": {
    "primary_object": "亞麻紋理桌球拍",
    "material_composition": ["linen texture", "dark wood handle"],
    "key_visual_feature": "粗糙亞麻表面紋理，木柄上刻有品牌字樣",
    "placement": "懸浮於黑色背景中，配有一顆白色乒乓球"
  },
  
  "lighting_system": {
    "preset_name": "Custom Backlit Setup (自訂背光設定)",
    "lighting_philosophy": "強烈背光搭配冷暖色彩對比，創造戲劇性輪廓效果",
    
    "key_light": {
      "technical_params": {
        "azimuth": 135,
        "azimuth_description": "back-side (背側)",
        "elevation": 45,
        "elevation_description": "high angle (高角度)",
        "color_hex": "#ff0000",
        "color_description": "鮮豔紅色 (vivid red), 暖色調 (warm tone), 像岩漿般 (like magma)",
        "intensity_percent": 90,
        "intensity_description": "strong intensity (強烈)"
      },
      "visual_effect": "強烈紅色背側高角度照明，創造戲劇性紅色輪廓與陰影"
    },
    
    "fill_light": {
      "technical_params": {
        "azimuth": 180,
        "azimuth_description": "back (正背面)",
        "elevation": 20,
        "elevation_description": "slightly above (略微從上)",
        "color_hex": "#0073ff",
        "color_description": "鮮豔藍色 (vivid blue), 冷色調 (cool tone), 像海洋深處 (like ocean depths)",
        "intensity_percent": 35,
        "intensity_description": "soft intensity (柔和)"
      },
      "visual_effect": "柔和藍色背光補光，與紅色主光形成冷暖對比，電影感色調分離"
    },
    
    "rim_light": {
      "technical_params": {
        "azimuth": 180,
        "azimuth_description": "back (正背面)",
        "elevation": 50,
        "elevation_description": "high angle (高角度)",
        "color_hex": "#fe6262",
        "color_description": "珊瑚粉紅 (coral pink), 暖色調 (warm tone), 像玫瑰花瓣 (like rose petals)",
        "intensity_percent": 45,
        "intensity_description": "soft intensity (柔和)"
      },
      "visual_effect": "柔和粉紅色高角度輪廓光，強調物體邊緣，創造溫暖光暈效果"
    },
    
    "lighting_mood": "戲劇性背光效果 (dramatic backlighting), 冷暖色彩對比 (cool-warm color contrast), 強烈輪廓定義 (strong edge definition), 電影感色調分離 (cinematic color grading)"
  },
  
  "environment": {
    "background_color_hex": "#0a0a0a",
    "background_color_description": "深炭黑 (deep charcoal black), 中性色調 (neutral tone), 像暴風雲般 (like storm clouds)",
    "scene_description": "黑色無縫背景，神秘氛圍，右下角有極簡 UI 文字 'The dramatic racket'",
    "atmospheric_effects": "輕微霧氣效果，增加深度感"
  },
  
  "post_processing": {
    "visual_style": "Cinematic (電影感)",
    "rendering_quality": ["超精細 (Hyper-detailed)", "光線追蹤 (Ray Tracing)"],
    "color_grading": "冷暖對比 (teal and orange)",
    "film_simulation": "Kodak Portra 400"
  }
}
```

---

## 測試目標

### 1. 顏色翻譯測試
- ✅ `#ffffff` → "純白色, 中性色溫"
- ✅ `#f8fafc` → "極淺灰白, 冷色調"
- ✅ `#e2e8f0` → "淺灰藍色, 中性偏冷, 像混凝土"
- ✅ `#ff0000` → "鮮豔紅色, 暖色調, 像岩漿" (Sample 2 主光)
- ✅ `#0073ff` → "鮮豔藍色, 冷色調, 像海洋深處" (Sample 2 補光)
- ✅ `#fe6262` → "珊瑚粉紅, 暖色調, 像玫瑰花瓣" (Sample 2 輪廓光)
- ✅ `#0a0a0a` → "深炭黑, 中性色調, 像暴風雲"

### 2. JSON 結構理解測試
- Gemini 能否理解階層式的 JSON 結構？
- Gemini 能否根據 `technical_params` 和 `visual_effect` 生成正確的圖像？
- Gemini 能否遵循 `final_prompt_assembly_order` 的順序？

### 3. 對比測試
- Sample 1 (高調光) vs Sample 2 (背光設定)
- 明亮柔和 vs 強烈背光
- 單一色溫 vs 紅藍粉三色對比
- 正面照明 vs 背面照明

---

## 下一步

請將這兩個 JSON 範例提供給 Gemini，測試：
1. Gemini 是否能正確理解顏色描述？
2. Gemini 是否能根據 JSON 生成符合預期的圖像？
3. 哪種格式（Sample 1 或 Sample 2）更適合作為標準？

測試完成後，我會根據你的反饋調整系統實作。
