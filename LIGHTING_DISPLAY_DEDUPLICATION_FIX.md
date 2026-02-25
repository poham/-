# 燈光顯示去重修正

## 問題描述

使用者反映在 Live Protocol Deck 中，「燈光風格」(LIGHTING STYLE) 出現了多次重複顯示。

## 根本原因

### 1. 標籤重複問題

在 `lightingPresetDatabase.ts` 中，每個 preset 都有：
- `name`: 例如 "Rembrandt Lighting"
- `geometry_tags`: 例如 ["Rembrandt lighting style", "Triangle catchlight on cheek", ...]
- `style_tags`: 例如 ["Dramatic chiaroscuro", ...]

在 Perfect Match 模式下，`generateStructuredLightingInfo` 會返回：
```typescript
{
  presetName: "Rembrandt Lighting",  // 來自 preset.name
  geometry: "Rembrandt lighting style, Triangle catchlight on cheek, ...",  // 來自 geometry_tags
  style: "Rendering with Dramatic chiaroscuro, ..."  // 來自 style_tags
}
```

### 2. 原本的過濾邏輯不足

```typescript
// ❌ 原本的邏輯：只檢查完全相等
if (ld.geometry && ld.geometry !== ld.presetName) {
  parts.push({
    label: 'LIGHTING SETUP',
    text: ld.geometry,  // "Rembrandt lighting style, ..."
    color: 'yellow'
  });
}
```

**問題**：
- `"Rembrandt lighting style, ..."` !== `"Rembrandt Lighting"`
- 所以會同時顯示：
  1. 燈光預設：Rembrandt Lighting
  2. 燈光設定：Rembrandt lighting style, Triangle catchlight on cheek, ...
  3. （可能還有其他重複）

## 解決方案

### 修正 1：智能關鍵字比對

```typescript
// ✅ 新的邏輯：檢查是否包含 preset 名稱的關鍵字
if (ld.geometry && ld.presetName) {
  // 提取 preset 名稱的關鍵字（長度 > 3 的單字）
  const presetKeywords = ld.presetName.toLowerCase().split(' ');
  const geometryLower = ld.geometry.toLowerCase();
  
  // 檢查 geometry 是否包含任何關鍵字
  const containsPresetName = presetKeywords.some(keyword => 
    keyword.length > 3 && geometryLower.includes(keyword)
  );
  
  // 只在不包含 preset 名稱時才顯示
  if (!containsPresetName) {
    parts.push({
      label: 'LIGHTING SETUP',
      text: ld.geometry,
      color: 'yellow'
    });
  }
}
```

**效果**：
- "Rembrandt Lighting" → 關鍵字：["rembrandt", "lighting"]
- "Rembrandt lighting style, ..." 包含 "rembrandt" → 不顯示
- 避免重複！

### 修正 2：條件式顯示 LIGHTING STYLE

```typescript
// ✅ 只在沒有 presetName 時才顯示 style 標籤
if (ld.style && !ld.presetName) {
  parts.push({
    label: 'LIGHTING STYLE',
    text: ld.style,
    color: 'yellow'
  });
}
```

**邏輯**：
- Perfect Match 模式：有 `presetName`，不顯示 `style`
- Style Inheritance 模式：沒有 `presetName`，顯示 `style`
- Custom 模式：沒有 `presetName`，顯示 `style`（如果有）

## 現在的顯示邏輯

### Perfect Match 模式（例如：林布蘭光）

顯示：
1. ✅ **燈光預設**：Rembrandt Lighting
2. ✅ **主光源**：Key light positioned at front-right slightly above, in neutral white color
3. ✅ **補光**：Fill light positioned at back-left slightly above, in neutral white color
4. ✅ **輪廓光**：Rim light positioned at back-left high angle, in neutral white color

不顯示：
- ❌ 燈光設定（因為包含 "Rembrandt" 關鍵字，會與「燈光預設」重複）
- ❌ 燈光風格（因為有 presetName，風格資訊已經包含在 preset 中）

### Style Inheritance 模式（使用者移動了燈光）

顯示：
1. ✅ **燈光設定**：物理描述（例如：Key light positioned at...）
2. ✅ **主光源**：詳細的主光描述
3. ✅ **補光**：詳細的補光描述
4. ✅ **輪廓光**：詳細的輪廓光描述
5. ✅ **燈光風格**：Rendering with Dramatic chiaroscuro, High contrast illumination, ...

不顯示：
- ❌ 燈光預設（因為已經不符合 preset 的幾何限制）

### Custom 模式（沒有選擇 preset）

顯示：
1. ✅ **燈光設定**：物理描述
2. ✅ **主光源**：詳細的主光描述
3. ✅ **補光**：詳細的補光描述（如果有）
4. ✅ **輪廓光**：詳細的輪廓光描述（如果有）

## 修改的檔案

1. ✅ `components/layout/ProtocolDeck.tsx` - 修正燈光區段的顯示邏輯
2. ✅ `utils/chineseTranslations.ts` - 新增 `LIGHTING PRESET` 標籤翻譯

## 測試建議

1. 載入任何使用燈光 preset 的設定（例如：林布蘭光、蝴蝶光）
2. 確認 Protocol Deck 只顯示：
   - ✅ 燈光預設：[Preset 名稱]
   - ✅ 主光源：[物理描述]
   - ✅ 補光：[物理描述]（如果有）
   - ✅ 輪廓光：[物理描述]（如果有）
3. 確認不會出現重複的「燈光設定」或「燈光風格」
4. 移動燈光角度，確認切換到 Style Inheritance 模式時：
   - ✅ 不顯示「燈光預設」
   - ✅ 顯示「燈光風格」（風格標籤）

## 結論

現在 Protocol Deck 的燈光顯示邏輯已經優化：
- ✅ 避免重複顯示相同資訊
- ✅ 根據模式（Perfect Match / Style Inheritance / Custom）智能調整顯示內容
- ✅ 保持資訊的完整性和可讀性
- ✅ 中文翻譯正確（林布蘭光、平光等）
