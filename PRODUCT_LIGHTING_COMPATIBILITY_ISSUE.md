# 產品攝影燈光相容性問題分析

## 問題描述

使用者提出了一個非常關鍵的問題：

> **「目前所有的燈光訊息是不是都針對人像去做處理？如果我一旦用了 Preset，它基本上都是針對人去調整的，那假如我是拍商品的話，可以共用這樣的一個 Preset 嗎？會不會因為它的文字敘述，導致我的商品表現變得奇怪？」**

## 測試結果

### 人像模式輸出

```
(Geometry) Rembrandt lighting style, Triangle catchlight on cheek, Classic 45-degree portrait setup, Nose shadow reaching toward cheek, ...
```

### 產品模式輸出（目前）

```
(Geometry) Rembrandt lighting style, Triangle reflective highlight on surface, Classic 45-degree portrait setup, volume shadow reaching toward surface, ...
```

## 問題分析

### ❌ 問題 1：仍然包含「portrait setup」

即使在產品模式下，仍然出現：
- `Classic 45-degree portrait setup`

這會讓 AI 誤以為是在拍人像。

### ❌ 問題 2：Preset 名稱本身就是人像專用

- **Rembrandt**：以畫家林布蘭命名，專指臉部光影
- **Butterfly**：指鼻子下方的蝴蝶狀陰影
- **Loop**：指鼻子旁的環狀陰影
- **Split**：指半臉亮半臉暗

這些名稱本身就暗示了「人像攝影」。

### ❌ 問題 3：幾何描述仍然與人臉相關

即使替換了用語：
- `Triangle reflective highlight on surface` ← 原本是「臉頰上的三角形光斑」
- `volume shadow reaching toward surface` ← 原本是「鼻影延伸到臉頰」

這些描述在產品攝影中沒有意義。

---

## 實際影響

### 測試案例：拍攝香水瓶

**使用者期望**：
- 選擇「林布蘭光」Preset
- 看到 UI 上的燈光位置（主光在右上方 45°）
- 期望 AI 生成：香水瓶被右上方的戲劇性燈光照亮

**實際 Prompt**：
```
Rembrandt lighting style, Triangle reflective highlight on surface, Classic 45-degree portrait setup, volume shadow reaching toward surface, Dramatic chiaroscuro...
```

**AI 可能的理解**：
- 「Rembrandt」→ 這是人像攝影
- 「portrait setup」→ 確認是人像
- 「Triangle on surface」→ 困惑：什麼表面？
- 結果：可能生成奇怪的圖像，或者忽略部分指令

---

## 解決方案

### 方案 1：產品模式下完全移除 Preset 名稱和幾何標籤

**修改邏輯**：
```typescript
if (isProductMode) {
  // 產品模式：只保留方向 + 風格標籤
  return {
    mode: 'product_lighting',
    geometryTags: [],  // 移除所有幾何標籤
    styleTags: [...preset.style_tags],  // 保留風格標籤
    physicalDescription: generatePhysicalDescription(keyLight, 'key'),
    ...
  };
}
```

**輸出範例**：
```
(Key Light) Key light positioned at front-side high angle with strong intensity, in neutral white color, 
(Fill Light) Fill light positioned at back slightly above with soft intensity, in soft gray-blue color, 
(Rim Light) Rim light positioned at back high angle with moderate intensity, in neutral white color, 
(Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows.
```

**優點**：
- ✅ 沒有人像相關的用語
- ✅ 保留了燈光的物理位置
- ✅ 保留了風格標籤（戲劇性、高對比等）
- ✅ AI 不會誤以為是人像攝影

**缺點**：
- ❌ 失去了 Preset 名稱的辨識度
- ❌ 使用者可能不知道這是「林布蘭光」

---

### 方案 2：建立產品專用的 Preset 名稱

**修改資料庫**：
```typescript
rembrandt: {
  id: 'rembrandt',
  name: 'Rembrandt Lighting',
  
  // 新增：產品模式的替代名稱
  product_mode_name: '45-Degree Dramatic Side Lighting',
  
  geometry_tags: [
    'Rembrandt lighting style',
    'Triangle catchlight on cheek',
    ...
  ],
  
  // 新增：產品模式的幾何標籤
  product_geometry_tags: [
    '45-degree side lighting setup',
    'Dramatic angular illumination',
    'Strong directional light from upper side'
  ],
  
  style_tags: [
    'Dramatic chiaroscuro',
    'High contrast illumination',
    ...
  ]
}
```

**輸出範例**：
```
(Geometry) 45-Degree Dramatic Side Lighting, Strong directional light from upper side, 
(Key Light) Key light positioned at front-side high angle with strong intensity, in neutral white color, 
...
(Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows.
```

**優點**：
- ✅ 保留了 Preset 的辨識度
- ✅ 使用產品攝影的專業術語
- ✅ 沒有人像相關的用語
- ✅ 更精確的描述

**缺點**：
- ❌ 需要為每個 Preset 定義產品模式的名稱和標籤
- ❌ 維護成本較高

---

### 方案 3：混合方案（推薦）

**邏輯**：
- 產品模式下：移除 Preset 名稱和人像幾何標籤
- 保留：物理方向描述 + 風格標籤
- 可選：在 UI 上顯示「基於林布蘭光」，但不放入 Prompt

**實作**：
```typescript
if (isProductMode) {
  return {
    mode: 'product_lighting',
    presetName: preset.name,  // 僅供 UI 顯示
    geometryTags: [],  // 不輸出到 Prompt
    styleTags: [...preset.style_tags],
    physicalDescription: generatePhysicalDescription(keyLight, 'key'),
    ...
  };
}
```

**UI 顯示**：
```
💡 基於：林布蘭光 (Rembrandt)
📝 Prompt：Key light positioned at front-side high angle, Dramatic chiaroscuro...
```

**優點**：
- ✅ 使用者知道選擇了哪個 Preset
- ✅ Prompt 中沒有人像相關用語
- ✅ 保留了風格標籤的質感
- ✅ 實作簡單

---

## 建議

### 立即實作：方案 3（混合方案）

**原因**：
1. **最小改動**：只需修改 `generateLightingPrompt` 的邏輯
2. **最佳體驗**：使用者在 UI 上看到 Preset 名稱，但 Prompt 中沒有人像用語
3. **最安全**：避免 AI 混淆

### 長期考慮：方案 2（產品專用 Preset）

如果未來需要更精確的產品攝影控制，可以：
1. 建立產品專用的 Preset 名稱
2. 定義產品專用的幾何標籤
3. 提供更專業的產品攝影術語

---

## 測試驗證

### 測試案例 1：香水瓶 + 林布蘭光

**修改前**：
```
Rembrandt lighting style, Triangle reflective highlight on surface, Classic 45-degree portrait setup...
```
→ AI 可能困惑

**修改後**：
```
Key light positioned at front-side high angle with strong intensity, Dramatic chiaroscuro, High contrast illumination...
```
→ AI 清楚理解

### 測試案例 2：手錶 + 蝴蝶光

**修改前**：
```
Butterfly lighting, Glamour lighting setup, Centered high-angle key light, Butterfly-shaped shadow under object...
```
→ 「Butterfly-shaped shadow under object」沒有意義

**修改後**：
```
Key light positioned at front high angle with strong intensity, Soft flattering illumination, Even modeling...
```
→ 清楚描述燈光位置和質感

---

## 結論

你的擔心是完全正確的！

### 問題確認

1. ✅ 目前的 Preset 確實是針對人像設計的
2. ✅ 產品模式下仍然包含人像相關用語
3. ✅ 這會導致 AI 混淆，生成奇怪的結果

### 解決方向

**產品模式下應該：**
- ❌ 不輸出 Preset 名稱（Rembrandt, Butterfly 等）
- ❌ 不輸出人像幾何標籤（Triangle on cheek 等）
- ✅ 輸出物理方向描述（Key light at 45° angle）
- ✅ 輸出風格標籤（Dramatic chiaroscuro）

這樣可以確保：
- 使用者在 UI 上看到 Preset 名稱（知道選了什麼）
- AI 收到的 Prompt 沒有人像用語（不會混淆）
- 保留了燈光的質感和風格（戲劇性、高對比等）

---

**下一步**：實作方案 3，修改 `generateLightingPrompt` 函式。
