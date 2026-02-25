# 戶外補光預設說明

## 新增日期
2026-02-06

## 背景

原本的燈光系統只有 2 個混合模式預設（側光、輪廓光），對於戶外補光場景支援不足。使用者需要更多專門為戶外環境設計的補光預設。

## 新增的戶外補光預設

### 1. 黃金時刻補光（Golden Hour Fill）

**使用場景：**
- 日出或日落時的戶外拍攝
- 需要加強暖色調的人像或產品攝影
- 模擬自然的黃金時刻光線

**燈光配置：**
- 主光：60° 方位角，20° 仰角，70% 強度，金黃色 (#ffd700)
- 補光：300° 方位角，10° 仰角，40% 強度，暖白色 (#fff5e6)
- 輪廓光：240° 方位角，30° 仰角，50% 強度，暖橙色 (#ff6b35)

**Prompt 標籤：**
- 幾何：Golden hour side lighting, Warm directional fill, Low-angle natural light
- 風格：Warm golden glow, Soft natural shadows, Romantic atmosphere, Magic hour aesthetic

**適用於：**
- 戶外人像攝影
- 產品攝影（需要暖色調）
- 風景人像結合

---

### 2. 反光板補光（Reflector Fill）

**使用場景：**
- 白天戶外拍攝
- 模擬反光板從下方補光的效果
- 柔化臉部陰影，提亮眼神光

**燈光配置：**
- 主光：0° 方位角，45° 仰角，60% 強度，白色 (#ffffff)
- 補光：0° 方位角，-30° 仰角，50% 強度，暖白色 (#fff5e6)
- 輪廓光：180° 方位角，0° 仰角，0% 強度（關閉）

**Prompt 標籤：**
- 幾何：Reflector bounce light, Bottom fill illumination, Natural daylight with reflector
- 風格：Soft shadow reduction, Natural outdoor look, Eye catchlight enhancement

**適用於：**
- 戶外人像攝影
- 時尚攝影
- 商業人像

**特點：**
- 補光來自下方（-30° 仰角），模擬反光板效果
- 不使用輪廓光，保持自然感

---

### 3. 逆光補光（Backlight Fill）

**使用場景：**
- 背光環境（太陽在背後）
- 避免主體變成剪影
- 保留背光的光暈效果，同時保持主體細節

**燈光配置：**
- 主光：180° 方位角，40° 仰角，80% 強度，白色 (#ffffff)
- 補光：0° 方位角，10° 仰角，60% 強度，冷白色 (#e6f2ff)
- 輪廓光：0° 方位角，50° 仰角，70% 強度，白色 (#ffffff)

**Prompt 標籤：**
- 幾何：Backlit with front fill, Contre-jour setup, Silhouette prevention lighting
- 風格：Glowing edge definition, Preserved subject detail, Dramatic yet balanced

**適用於：**
- 逆光人像
- 日落剪影（但保留細節）
- 戶外產品攝影

**特點：**
- 主光來自背後（180°），創造光暈
- 正面補光（0°）保留主體細節
- 平衡的曝光，避免剪影

---

### 4. 夜景補光（Night Fill）

**使用場景：**
- 夜間街拍
- 城市夜景人像
- 保留環境光氛圍的同時加強主體

**燈光配置：**
- 主光：45° 方位角，20° 仰角，65% 強度，冷白色 (#e6f2ff)
- 補光：315° 方位角，10° 仰角，30% 強度，灰藍色 (#cbd5e1)
- 輪廓光：225° 方位角，30° 仰角，40% 強度，藍色 (#4169e1)

**Prompt 標籤：**
- 幾何：Night portrait fill, Urban street lighting supplement, Low-intensity side fill
- 風格：Moody night atmosphere, Subtle fill enhancement, Urban night portrait, Cool tone illumination

**適用於：**
- 夜間街拍
- 城市夜景人像
- 霓虹燈環境

**特點：**
- 使用冷色調（藍色系）配合夜間環境
- 低強度補光，保留環境光氛圍
- 側面補光，創造立體感

---

## 與原有預設的對比

### 原有混合模式（Hybrid）
- **側光（Split）**：高對比度，戲劇性，適合夜景或攝影棚
- **輪廓光（Rim）**：邊緣發光，分離主體與背景

### 新增戶外補光（Outdoor Fill）
- **黃金時刻補光**：暖色調，自然光感
- **反光板補光**：柔化陰影，提亮眼神光
- **逆光補光**：避免剪影，保留細節
- **夜景補光**：冷色調，保留環境光

## UI 佈局

```
攝影棚佈光（8 個）
┌─────┬─────┬─────┬─────┐
│林布蘭│蝴蝶光│環形光│寬光 │
└─────┴─────┴─────┴─────┘
┌─────┬─────┬─────┬─────┐
│窄光 │平光 │高調光│貝殼光│
└─────┴─────┴─────┴─────┘

戶外補光（4 個）
┌─────┬─────┬─────┬─────┐
│黃金時│反光板│逆光 │夜景 │
│刻補光│補光 │補光 │補光 │
└─────┴─────┴─────┴─────┘

混合模式（2 個）
┌─────┬─────┐
│側光 │輪廓光│
└─────┴─────┘
```

## 使用建議

### 攝影棚佈光
- 適合：室內、可控光源環境
- 特點：經典攝影棚技法，精確控制光影

### 戶外補光
- 適合：自然光環境，需要補光加強
- 特點：配合自然光，不破壞環境氛圍

### 混合模式
- 適合：攝影棚或戶外都可使用
- 特點：通用性高，效果明顯

## 技術實作

### 新增檔案
- 無（使用現有架構）

### 修改檔案
1. `constants.tsx`：添加 4 個新預設定義
2. `utils/lightingPresetDatabase.ts`：添加詳細的 Prompt 標籤
3. `components/lighting/LightingPresetGrid.tsx`：添加「戶外補光」區塊

### 類型定義
```typescript
export type LightingScenario = 'studio' | 'outdoor_fill' | 'hybrid';
```

## 測試建議

### 測試場景 A：黃金時刻人像
```
Subject: 年輕女性
Background: 戶外公園，日落
Lighting: 黃金時刻補光
預期：暖色調，自然光感，浪漫氛圍
```

### 測試場景 B：白天戶外產品
```
Subject: 香水瓶
Background: 戶外白天
Lighting: 反光板補光
預期：柔和陰影，提亮細節，自然感
```

### 測試場景 C：逆光人像
```
Subject: 男性模特
Background: 海邊日落（逆光）
Lighting: 逆光補光
預期：保留光暈，主體有細節，不是剪影
```

### 測試場景 D：夜間街拍
```
Subject: 年輕人
Background: 城市夜景，霓虹燈
Lighting: 夜景補光
預期：冷色調，保留環境光，主體清晰
```

## 未來改進建議

1. **更多戶外預設**
   - 陰天補光（Overcast Fill）
   - 樹蔭補光（Shade Fill）
   - 窗光補光（Window Light Fill）

2. **時間段預設**
   - 正午補光（Noon Fill）
   - 藍調時刻補光（Blue Hour Fill）

3. **環境特定預設**
   - 海邊補光（Beach Fill）
   - 森林補光（Forest Fill）
   - 城市補光（Urban Fill）

4. **產品專用預設**
   - 珠寶補光（Jewelry Fill）
   - 食物補光（Food Fill）
   - 汽車補光（Automotive Fill）

## 結論

新增的 4 個戶外補光預設大幅提升了系統對自然光環境的支援：
- **黃金時刻補光**：暖色調，浪漫氛圍
- **反光板補光**：柔化陰影，自然感
- **逆光補光**：避免剪影，保留細節
- **夜景補光**：冷色調，環境光保留

現在使用者可以根據實際拍攝環境選擇合適的補光預設，而不僅限於攝影棚場景。
