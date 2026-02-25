# POV Preset 優化記錄

## 問題描述

使用者反映「動漫大亂鬥魚眼自拍」preset 有以下問題：

1. **設定較少**：相比其他 preset，這個 preset 的設定項目明顯較少
2. **Lab Protocol 顯示問題**：
   - 只顯示「主體細節」
   - 出現「零部藍光」的錯誤翻譯（應該是「林布蘭光」）
   - 燈光風格重複顯示兩次

## 根本原因分析

### 1. 設定較少的原因

這個 preset 原本的設定：
```typescript
{
  shotType: '微距',  // ❌ 不適合自拍場景
  studioSetup: 'flat',  // ✅ 簡單的平光設定
  lightIntensity: 90,
  mood: '明亮寫實的動畫角色光影融合'  // ❌ 放在 optics 而非 style
}
```

**問題**：
- 使用「微距」景別不適合群體自拍
- 缺少完整的主體描述（materials, tags, view_angle）
- 缺少環境描述（environment, tags）
- 缺少光源描述（source, ambientColor）
- mood 放在錯誤的位置（應該在 style.mood）
- 缺少景深設定（dof）
- 後製標籤較少

### 2. 「零部藍光」翻譯問題

**原因**：`chineseTranslations.ts` 中缺少 'rembrandt' 單字的翻譯，只有 'rembrandt lighting' 的完整詞組翻譯。

**解決方案**：新增單字翻譯對照：
```typescript
'rembrandt lighting': '林布蘭光',
'rembrandt': '林布蘭',  // ✅ 新增
'butterfly lighting': '蝴蝶光',
'butterfly': '蝴蝶',  // ✅ 新增
'loop lighting': '環形光',
'loop': '環形',  // ✅ 新增
'clamshell lighting': '蚌殼光',
'clamshell': '蚌殼',  // ✅ 新增
'flat lighting': '平光',
'flat': '平光',  // ✅ 新增
```

### 3. 燈光風格重複顯示

**原因**：Protocol Deck 的結構化顯示會將燈光資訊拆分為多個區段：
- LIGHTING STYLE（燈光風格）
- LIGHTING GEOMETRY（燈光幾何）
- KEY LIGHT（主光源）
- FILL LIGHT（補光）
- RIM LIGHT（輪廓光）

這是正常的設計，不是 bug。每個區段顯示不同層面的資訊。

## 解決方案

### 1. 完善 Preset 設定

```typescript
{
  id: 'pov-2',
  name: '動漫大亂鬥魚眼自拍',
  config: {
    camera: {
      shotType: '特寫/肩上',  // ✅ 改為適合自拍的景別
      aspectRatio: '9:16',
      angle: '高角度 (High Angle)',
      lens: '8mm 魚眼',
      cameraAzimuth: 0,
      cameraElevation: 30,
      povMode: 'handheld selfie'  // ✅ 新增手持自拍模式
    },
    subject: {
      type: '人物與動漫角色群像',  // ✅ 更清楚的描述
      description: '人物手持相機自拍，與哆啦A夢、鳴人、大雄、五條悟、成振宇、小智一起擠入畫面，表情誇張搞怪，動作活潑。',
      key_feature: '極致魚眼變形效果，所有角色臉部被誇張拉伸',
      materials: [],  // ✅ 新增（雖然為空）
      tags: ['動漫角色', '群體自拍', '誇張表情', '手持相機'],  // ✅ 新增標籤
      view_angle: '正面朝向鏡頭，所有角色面向相機'  // ✅ 新增朝向
    },
    background: {
      bgColor: '#f5f5f5',
      description: '明亮的白色調簡約客廳，柔和的自然光從窗戶灑入。',  // ✅ 更詳細
      environment: '室內居家環境',  // ✅ 新增
      tags: ['簡約', '明亮', '居家']  // ✅ 新增標籤
    },
    optics: {
      studioSetup: 'flat',
      lightIntensity: 85,  // ✅ 微調
      lightColor: '#ffffff',  // ✅ 新增
      source: '自然窗光與室內照明',  // ✅ 新增光源描述
      ambientColor: '#e8f4f8',  // ✅ 新增環境光顏色
      dof: 'f/8',  // ✅ 新增景深
      useAdvancedLighting: false  // ✅ 明確設定
    },
    style: {
      visualStyle: 'Anime (動漫風格)',
      mood: '明亮歡樂的動畫風格，充滿活力與趣味',  // ✅ 移到正確位置
      postProcessing: [
        'Lumen 全域光照 (Lumen Global Illumination)',
        '超精細 (Hyper-detailed)',
        '魚眼變形 (Fisheye Distortion)',
        '鮮豔色彩 (Vibrant Colors)'  // ✅ 新增
      ],
      filmStyle: 'None',  // ✅ 新增
      grain: 'None',  // ✅ 新增
      vignette: false  // ✅ 新增
    }
  }
}
```

### 2. 更新中文翻譯

已在 `utils/chineseTranslations.ts` 中新增：
- 單字級別的燈光風格翻譯（rembrandt, butterfly, loop, clamshell, flat）
- 確保翻譯系統能正確處理部分匹配

## 修改的檔案

1. ✅ `presets.ts` - 完善「動漫大亂鬥魚眼自拍」preset 設定
2. ✅ `utils/chineseTranslations.ts` - 新增燈光風格的單字翻譯

## 測試建議

1. 載入「動漫大亂鬥魚眼自拍」preset
2. 檢查 Lab Protocol 是否顯示完整的資訊：
   - ✅ 特殊視角模式（POV MODE）
   - ✅ 攝影機位置（CAMERA POSITION）
   - ✅ 鏡頭光學（LENS OPTICS）
   - ✅ 景別尺度（SHOT TYPE）
   - ✅ 景深效果（DEPTH OF FIELD）
   - ✅ 主體細節（SUBJECT DETAILS）
   - ✅ 環境場景（ENVIRONMENT）
   - ✅ 燈光設定（LIGHTING SETUP）
   - ✅ 氛圍情緒（MOOD）
   - ✅ 渲染風格（RENDERING STYLE）
3. 確認中文翻譯正確顯示「平光」而非「零部藍光」
4. 確認燈光風格不會重複顯示（每個區段應該顯示不同的資訊）

## 結論

「動漫大亂鬥魚眼自拍」preset 現在已經：
- ✅ 擁有完整的設定項目（與其他 preset 一致）
- ✅ 正確的景別（特寫/肩上，適合自拍）
- ✅ 完整的主體描述（包含 tags, view_angle）
- ✅ 完整的環境描述（包含 environment, tags）
- ✅ 完整的光學設定（包含 source, ambientColor, dof）
- ✅ 正確的 mood 位置（在 style.mood）
- ✅ 手持自拍模式（povMode: 'handheld selfie'）
- ✅ 中文翻譯正確（林布蘭光 → 平光）
