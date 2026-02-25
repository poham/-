# Preset 規格化需求表

本文件定義如何將外部 Prompt 轉換為泡泡龍系統的標準化 Preset 格式。

## 一、基本資訊收集

### 1.1 Preset 識別資訊

| 欄位 | 必填 | 說明 | 範例 |
|------|------|------|------|
| `id` | ✓ | 唯一識別碼（小寫英文+連字號） | `luxury-watch-hero` |
| `name` | ✓ | 顯示名稱（中文） | `奢侈品手錶英雄鏡頭` |
| `description` | ✓ | 簡短描述（1-2 句話） | `經典產品攝影，強調金屬質感與工藝細節` |
| `category` | ✓ | 所屬類別 | `product` / `portrait` / `editorial` / `food` / `pov` |
| `tags` | ✓ | 搜尋標籤（陣列） | `['luxury', 'product', 'commercial']` |

### 1.2 預覽資訊

| 欄位 | 必填 | 說明 |
|------|------|------|
| `thumbnail` | ✗ | 縮圖 URL 或路徑 |
| `previewImage` | ✗ | 預覽圖片 URL |

---

## 二、主體配置 (Subject)

### 2.1 主體描述

從原始 Prompt 中提取主體相關資訊：

| 參數 | 對應欄位 | 提取規則 | 範例 |
|------|----------|----------|------|
| 主體類型 | `subject.type` | 識別主要拍攝對象 | `luxury watch` |
| 材質描述 | `subject.materials` | 提取材質關鍵字（陣列） | `['polished steel', 'sapphire crystal']` |
| 細節描述 | `subject.details` | 提取細節特徵（陣列） | `['intricate dial', 'roman numerals']` |
| 自訂標籤 | `subject.customTags` | 其他主體相關描述 | `['swiss movement', 'leather strap']` |

### 2.2 提取範例

```
原始 Prompt: "A luxury Swiss watch with polished steel case, 
sapphire crystal, intricate dial with roman numerals, 
brown leather strap"

↓ 轉換為

subject: {
  type: "luxury watch",
  materials: ["polished steel", "sapphire crystal", "leather"],
  details: ["intricate dial", "roman numerals"],
  customTags: ["swiss movement"]
}
```

---

## 三、背景配置 (Background)

### 3.1 背景類型識別

| 原始描述 | 對應類型 | `background.type` |
|----------|----------|-------------------|
| 純色背景 | Solid Color | `solid` |
| 漸層背景 | Gradient | `gradient` |
| 環境場景 | Environment | `environment` |
| 工作室設定 | Studio | `studio` |

### 3.2 背景參數

| 參數 | 對應欄位 | 提取規則 |
|------|----------|----------|
| 顏色 | `background.color` | 提取色彩描述或色碼 |
| 環境描述 | `background.environment` | 場景描述文字 |
| 氛圍標籤 | `background.customTags` | 氛圍相關關鍵字 |

### 3.3 顏色轉換對照表

| 原始描述 | 標準化色彩 | 色碼參考 |
|----------|-----------|----------|
| white / clean | `#FFFFFF` | 純白 |
| black / dark | `#000000` | 純黑 |
| grey / neutral | `#808080` | 中性灰 |
| warm / golden | `#FFD700` | 暖金色 |
| cool / blue | `#4A90E2` | 冷藍色 |

---

## 四、相機配置 (Camera)

### 4.1 鏡頭參數

| 原始描述 | 參數名稱 | 對應欄位 | 標準值 |
|----------|----------|----------|--------|
| 焦距 | Focal Length | `camera.focalLength` | `35mm` / `50mm` / `85mm` / `100mm` |
| 光圈 | Aperture | `camera.aperture` | `f/1.4` / `f/2.8` / `f/5.6` / `f/11` |
| 景深 | Depth of Field | `camera.dof` | `shallow` / `medium` / `deep` |

### 4.2 構圖參數

| 原始描述 | 參數名稱 | 對應欄位 | 標準值 |
|----------|----------|----------|--------|
| 鏡頭類型 | Shot Type | `camera.shotType` | `extreme-close-up` / `close-up` / `medium-shot` / `full-shot` |
| 拍攝角度 | Camera Angle | `camera.angle` | `eye-level` / `high-angle` / `low-angle` / `overhead` |
| 方位角 | Azimuth | `camera.azimuth` | `0` (正面) / `45` (側面) / `90` (側面) |
| 仰角 | Elevation | `camera.elevation` | `-30` (俯視) / `0` (平視) / `30` (仰視) |

### 4.3 角度描述轉換

| 原始描述 | 標準化角度 | 參數設定 |
|----------|-----------|----------|
| front view / straight on | 正面平視 | `azimuth: 0, elevation: 0` |
| 3/4 view / slight angle | 四分之三視角 | `azimuth: 45, elevation: 0` |
| side view / profile | 側面視角 | `azimuth: 90, elevation: 0` |
| overhead / top down | 俯視 | `azimuth: 0, elevation: -90` |
| low angle / from below | 仰視 | `azimuth: 0, elevation: 30` |

---

## 五、光學配置 (Optics)

### 5.1 燈光系統

#### 5.1.1 主光源 (Key Light)

| 原始描述 | 參數 | 對應欄位 | 標準值 |
|----------|------|----------|--------|
| 燈光類型 | Light Type | `optics.keyLight.type` | `softbox` / `umbrella` / `beauty-dish` / `ring-light` |
| 燈光方向 | Direction | `optics.keyLight.direction` | `front` / `side` / `back` / `top` |
| 燈光強度 | Intensity | `optics.keyLight.intensity` | `low` / `medium` / `high` |
| 燈光品質 | Quality | `optics.keyLight.quality` | `soft` / `hard` / `diffused` |

#### 5.1.2 補光 (Fill Light)

| 參數 | 對應欄位 | 標準值 |
|------|----------|--------|
| 補光類型 | `optics.fillLight.type` | `reflector` / `softbox` / `ambient` |
| 補光強度 | `optics.fillLight.intensity` | `low` / `medium` |

#### 5.1.3 輪廓光 (Rim Light)

| 參數 | 對應欄位 | 標準值 |
|------|----------|--------|
| 輪廓光啟用 | `optics.rimLight.enabled` | `true` / `false` |
| 輪廓光顏色 | `optics.rimLight.color` | `white` / `blue` / `warm` |

### 5.2 燈光預設模式

| 原始描述 | 預設模式 | `optics.lightingPreset` |
|----------|----------|------------------------|
| Rembrandt lighting | 林布蘭光 | `rembrandt` |
| Butterfly lighting | 蝴蝶光 | `butterfly` |
| Split lighting | 分割光 | `split` |
| Loop lighting | 環形光 | `loop` |
| Broad lighting | 寬光 | `broad` |
| Short lighting | 窄光 | `short` |

### 5.3 光線描述轉換

| 原始描述 | 標準化描述 | 參數組合 |
|----------|-----------|----------|
| soft diffused light | 柔和漫射光 | `quality: soft, intensity: medium` |
| hard dramatic light | 硬質戲劇光 | `quality: hard, intensity: high` |
| natural window light | 自然窗光 | `type: window, quality: soft` |
| studio strobe | 攝影棚閃光燈 | `type: strobe, quality: hard` |

---

## 六、風格配置 (Style)

### 6.1 視覺風格

| 原始描述 | 參數 | 對應欄位 | 標準值 |
|----------|------|----------|--------|
| 色調 | Color Grading | `style.colorGrading` | `natural` / `cinematic` / `vintage` / `high-contrast` |
| 底片模擬 | Film Stock | `style.filmStock` | `kodak-portra` / `fuji-velvia` / `ilford-hp5` |
| 後製風格 | Post Processing | `style.postProcessing` | `clean` / `moody` / `faded` / `vibrant` |

### 6.2 情緒標籤

| 原始描述 | 情緒標籤 | `style.moodTags` |
|----------|----------|------------------|
| elegant, sophisticated | 優雅精緻 | `['elegant', 'sophisticated']` |
| dramatic, moody | 戲劇性陰鬱 | `['dramatic', 'moody']` |
| clean, minimal | 簡潔極簡 | `['clean', 'minimal']` |
| warm, inviting | 溫暖親切 | `['warm', 'inviting']` |

---

## 七、完整範例

### 7.1 原始 Prompt

```
A luxury Swiss watch with polished steel case and brown leather strap, 
shot on a clean white background with soft studio lighting from the side, 
using a 100mm macro lens at f/2.8 for shallow depth of field, 
3/4 view angle, elegant and sophisticated mood, 
cinematic color grading with subtle warm tones
```

### 7.2 轉換後的 Preset 結構

```typescript
{
  id: "luxury-watch-elegant",
  name: "優雅奢華手錶",
  description: "經典產品攝影，強調金屬質感與工藝細節",
  category: "product",
  tags: ["luxury", "product", "commercial", "watch"],
  
  config: {
    // 主體配置
    subject: {
      type: "luxury watch",
      materials: ["polished steel", "leather"],
      details: ["swiss movement"],
      customTags: []
    },
    
    // 背景配置
    background: {
      type: "solid",
      color: "#FFFFFF",
      environment: "",
      customTags: ["clean", "minimal"]
    },
    
    // 相機配置
    camera: {
      focalLength: "100mm",
      aperture: "f/2.8",
      dof: "shallow",
      shotType: "close-up",
      angle: "eye-level",
      azimuth: 45,
      elevation: 0,
      customAngles: []
    },
    
    // 光學配置
    optics: {
      lightingPreset: "custom",
      keyLight: {
        type: "softbox",
        direction: "side",
        intensity: "medium",
        quality: "soft"
      },
      fillLight: {
        enabled: true,
        type: "reflector",
        intensity: "low"
      },
      rimLight: {
        enabled: false
      },
      moodTags: ["elegant", "sophisticated"]
    },
    
    // 風格配置
    style: {
      colorGrading: "cinematic",
      filmStock: "",
      postProcessing: "clean",
      customStyles: ["warm tones", "subtle"]
    }
  }
}
```

---

## 八、檢查清單

在提交新 Preset 前，請確認：

### 8.1 必填欄位
- [ ] `id` 唯一且符合命名規範
- [ ] `name` 有意義的中文名稱
- [ ] `description` 清楚描述用途
- [ ] `category` 正確分類
- [ ] `tags` 至少 2-3 個相關標籤

### 8.2 參數完整性
- [ ] 主體描述清晰（type + materials/details）
- [ ] 背景類型明確
- [ ] 相機參數符合攝影邏輯
- [ ] 燈光配置合理
- [ ] 風格標籤準確

### 8.3 相容性檢查
- [ ] 焦距與景深搭配合理
- [ ] 燈光方向與拍攝角度協調
- [ ] 情緒標籤與視覺風格一致
- [ ] 沒有互相衝突的參數

### 8.4 測試驗證
- [ ] 在系統中載入 Preset 無錯誤
- [ ] 生成的 Prompt 語意通順
- [ ] 視覺化元件正確顯示
- [ ] 與其他 Preset 無重複

---

## 九、常見問題

### Q1: 原始 Prompt 沒有明確的焦距資訊怎麼辦？

根據拍攝類型推斷：
- 產品特寫 → `100mm` macro
- 人像 → `85mm` 或 `50mm`
- 全身照 → `35mm` 或 `50mm`
- 環境照 → `24mm` 或 `35mm`

### Q2: 如何處理複雜的燈光描述？

拆解為主光源 + 補光 + 輪廓光：
1. 識別主要光源方向和類型
2. 判斷是否有補光（陰影細節）
3. 檢查是否有輪廓光（邊緣高光）

### Q3: 原始 Prompt 包含多個主體怎麼辦？

選擇主要主體作為 `subject.type`，其他主體放入 `subject.details` 或 `background.customTags`。

### Q4: 如何決定 `category`？

- `product`: 商品、靜物
- `portrait`: 人像、肖像
- `editorial`: 時尚、雜誌風格
- `food`: 食物、飲品
- `pov`: 特殊視角、創意構圖

---

## 十、提交格式

請將規格化後的 Preset 以以下格式提交：

```typescript
// 檔案: presets.ts
// 新增到對應的 category 陣列中

export const PRODUCT_PRESETS: Preset[] = [
  // ... 現有 presets
  {
    id: "your-preset-id",
    name: "你的 Preset 名稱",
    // ... 完整配置
  }
];
```

或提供 JSON 格式：

```json
{
  "id": "your-preset-id",
  "name": "你的 Preset 名稱",
  "description": "簡短描述",
  "category": "product",
  "config": {
    // ... 完整配置
  }
}
```

---

## 十一、參考資源

- 現有 Preset 範例：`presets.ts`
- 類型定義：`types.ts`
- 常數定義：`constants.tsx`
- 燈光系統：`utils/lightingPresetDatabase.ts`
- 相容性規則：`constants/compatibilityRules.ts`
