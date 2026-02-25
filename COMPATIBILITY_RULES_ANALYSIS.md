# 相容性規則完整性分析

## 📊 現有規則檢查

根據你提供的表格，讓我檢查每個規則的實作狀態：

### ✅ 已完整實作

| 使用者選擇 | 潛在問題 | 實作狀態 | 位置 |
|-----------|---------|---------|------|
| 魚眼 + 任何角度 | 邊緣扭曲，主體歪掉 | ✅ 完整實作 | `FISHEYE_RULES` |
| 長焦 + 蟲視 | 張力不足，畫面太平 | ✅ 完整實作 | `TELEPHOTO_RULES.specialCombinations` |
| 長焦 + 廣角關鍵字 | 物理互斥 | ✅ 完整實作 | `TELEPHOTO_RULES.mustRemove` |
| 微距 + 想看清細節 | 預設景深太淺 | ✅ 完整實作 | `MACRO_RULES.depthOfField.deepFocus` |
| 微距 + 低角度 | 變成看風景 | ✅ 完整實作 | `MACRO_RULES.angleTranslation` |

### ⚠️ 部分實作（邏輯存在但未應用）

| 使用者選擇 | 潛在問題 | 實作狀態 | 說明 |
|-----------|---------|---------|------|
| 大遠景 + 長焦 | 邏輯怪異 | ⚠️ 未檢測 | 需要添加檢測邏輯 |

---

## 🔍 額外發現的潛在問題

### 1. 廣角 + 長焦關鍵字（物理互斥）⚠️

**問題**：使用者選擇廣角鏡頭，但 Prompt 中包含長焦關鍵字

**現況**：
- `WIDE_ANGLE_RULES.mustRemove` 包含 `compressed perspective, flat layers`
- 但沒有明確檢測「長焦」關鍵字

**建議**：
```typescript
WIDE_ANGLE_RULES.mustRemove: [
  'compressed perspective',
  'flat layers',
  'zero distortion',
  'telephoto',  // 新增
  'long lens'   // 新增
]
```

---

### 2. 魚眼 + 建築視角（嚴重衝突）✅

**問題**：魚眼鏡頭無法拍攝建築（線條會嚴重扭曲）

**現況**：✅ 已實作
```typescript
FISHEYE_RULES.conflicts: [
  {
    condition: 'architectural',
    warning: '魚眼鏡頭會產生嚴重變形，不適合建築攝影',
    type: WarningType.CONFLICT
  }
]
```

---

### 3. 極端角度 + 標準鏡頭（自動調整）✅

**問題**：標準鏡頭在極端角度（> 60°）下會產生不自然的效果

**現況**：✅ 已在 `visualTranslators.ts` 中實作
```typescript
if (absElevation > 60) {
  lensOpticsDesc = 'wide angle lens, dramatic foreshortening, dynamic perspective';
}
```

**改進建議**：應該生成警告，讓使用者知道發生了什麼

---

### 4. 微距 + 大遠景（邏輯矛盾）❌

**問題**：微距是「極近」，大遠景是「極遠」，兩者互斥

**現況**：❌ 未檢測

**建議**：添加衝突檢測
```typescript
// 在 checkCompatibility() 中添加
if (isMacro && isWide) {
  warnings.push({
    type: WarningType.CONFLICT,
    message: '微距模式與大遠景模式互斥',
    suggestion: '請選擇其中一種模式',
    affectedParams: ['shotType', 'scaleMode']
  });
}
```

---

### 5. 魚眼 + 長焦（物理不可能）❌

**問題**：魚眼是超廣角（8mm），長焦是窄視角（200mm），不可能同時存在

**現況**：❌ 未檢測（但實際上使用者無法同時選擇）

**說明**：這是 UI 層級的互斥，不需要在相容性系統中檢測

---

### 6. 鳥瞰 + 蟲視（物理不可能）❌

**問題**：鳥瞰（> 60°）和蟲視（< -45°）是相反的角度

**現況**：❌ 未檢測（但實際上使用者無法同時設定）

**說明**：這是 UI 層級的互斥，不需要在相容性系統中檢測

---

### 7. 大遠景 + 特寫（邏輯矛盾）❌

**問題**：大遠景（Extreme Wide Shot）和特寫（Close-up）互斥

**現況**：❌ 未檢測

**建議**：添加衝突檢測
```typescript
// 在 checkCompatibility() 中添加
const isCloseUp = state.camera.shotType.toLowerCase().includes('close') ||
                  state.camera.shotType.toLowerCase().includes('特寫');

if (isWide && isCloseUp) {
  warnings.push({
    type: WarningType.CONFLICT,
    message: '大遠景模式與特寫鏡頭互斥',
    suggestion: '大遠景應該使用遠景或全景鏡頭',
    affectedParams: ['shotType', 'scaleMode']
  });
}
```

---

### 8. 長焦 + 鳥瞰（特殊效果）✅

**問題**：長焦 + 鳥瞰會產生「衛星地圖視角」

**現況**：✅ 已實作
```typescript
TELEPHOTO_RULES.specialCombinations: [
  {
    angle: 'birds-eye',
    warning: '長焦 + 鳥瞰會產生「衛星地圖視角」',
    type: WarningType.SUGGESTION,
    suggestion: '適合 SimCity 風格的遊戲圖或等距視角',
    autoAdd: ['graphic composition', 'map-like perspective', 'isometric feel']
  }
]
```

---

### 9. 廣角 + 蟲視（最佳組合）✅

**問題**：這不是問題，而是推薦組合！

**現況**：✅ 已實作
```typescript
WIDE_ANGLE_RULES.recommendations: [
  {
    angle: 'worms-eye',
    message: '廣角 + 蟲視 = 最佳英雄感與張力',
    type: WarningType.SUGGESTION
  }
]
```

---

### 10. 微距 + 深景深（需要焦點合成）✅

**問題**：微距模式下，深景深（f/22）需要焦點合成技術

**現況**：✅ 已實作
```typescript
MACRO_RULES.depthOfField.deepFocus: [
  'f/22 aperture',
  'deep depth of field',
  'focus stacking',
  'entire subject in focus',
  'no blur'
]
```

---

## 🎯 建議新增的規則

### 規則 1：大遠景 + 長焦（邏輯怪異）

```typescript
// 在 compatibilityRules.ts 中新增
export const WIDE_SHOT_RULES = {
  /**
   * 不推薦的鏡頭組合
   */
  discouragedLens: [
    {
      lens: 'telephoto',
      warning: '大遠景通常使用廣角鏡頭，長焦會產生「望遠鏡視角」',
      type: WarningType.SUBOPTIMAL,
      suggestion: '如果想要遠距離觀察，可以使用「Look from extremely far away distance, Zoom lens view」',
      autoAdd: ['look from extremely far away distance', 'zoom lens view', 'telephoto compression']
    }
  ]
};
```

### 規則 2：微距 + 大遠景（邏輯矛盾）

```typescript
// 在 checkCompatibility() 中添加
if (isMacro && isWide) {
  warnings.push({
    type: WarningType.CONFLICT,
    message: '微距模式（極近）與大遠景模式（極遠）互斥',
    suggestion: '請選擇其中一種模式',
    affectedParams: ['shotType', 'scaleMode']
  });
  isCompatible = false;
}
```

### 規則 3：大遠景 + 特寫（邏輯矛盾）

```typescript
// 在 checkCompatibility() 中添加
const isCloseUp = state.camera.shotType.toLowerCase().includes('close') ||
                  state.camera.shotType.toLowerCase().includes('特寫') ||
                  state.camera.shotType.toLowerCase().includes('ecu');

if (isWide && isCloseUp) {
  warnings.push({
    type: WarningType.CONFLICT,
    message: '大遠景模式與特寫鏡頭互斥',
    suggestion: '大遠景應該使用遠景（Long Shot）或全景（Full Body）',
    affectedParams: ['shotType', 'scaleMode']
  });
  isCompatible = false;
}
```

### 規則 4：極端角度 + 標準鏡頭（自動調整警告）

```typescript
// 在 checkCompatibility() 中添加
const isStandardLens = !isSpecialOptics && 
                       !lensLower.includes('telephoto') && 
                       !lensLower.includes('wide');

if (isStandardLens && absElevation > 60) {
  warnings.push({
    type: WarningType.SUGGESTION,
    message: '標準鏡頭在極端角度（> 60°）下會自動調整為廣角透視',
    suggestion: '如果想保持標準鏡頭效果，請使用較小的角度（< 60°）',
    affectedParams: ['lens', 'cameraElevation']
  });
}
```

---

## 📋 完整的相容性矩陣

### 鏡頭 × 角度矩陣

| 鏡頭 \ 角度 | 蟲視 (< -45°) | 低角度 (-45° ~ -15°) | 平視 (-15° ~ 15°) | 高角度 (15° ~ 60°) | 鳥瞰 (> 60°) |
|-----------|--------------|-------------------|-----------------|------------------|-------------|
| **魚眼 (8mm)** | ✅ 推薦（饒舌 MV） | ✅ 正常 | ✅ 正常 | ✅ 正常 | ✅ 推薦（監視器） |
| **廣角 (24mm)** | ✅ 推薦（英雄感） | ✅ 正常 | ✅ 正常 | ✅ 正常 | ✅ 推薦（戲劇性） |
| **標準 (50mm)** | ⚠️ 自動調整為廣角 | ✅ 正常 | ✅ 正常 | ✅ 正常 | ⚠️ 自動調整為廣角 |
| **長焦 (200mm)** | ⚠️ 次優（狙擊手視角） | ✅ 正常 | ✅ 正常 | ✅ 正常 | 💡 建議（衛星地圖） |
| **微距** | 🔄 轉譯為光影 | 🔄 轉譯為光影 | 🔄 轉譯為光影 | 🔄 轉譯為光影 | 🔄 轉譯為光影 |

**圖例**：
- ✅ 推薦：最佳組合，會生成 SUGGESTION 提示
- ✅ 正常：相容，無特殊處理
- ⚠️ 次優：可用但效果不理想，會生成 SUBOPTIMAL 警告
- ⚠️ 自動調整：系統會自動修改鏡頭描述
- 💡 建議：特殊效果，會生成 SUGGESTION 提示
- 🔄 轉譯：角度意義改變，會轉譯為其他描述
- ❌ 衝突：物理不可能或邏輯矛盾，會生成 CONFLICT 警告

### 模式 × 模式矩陣

| 模式 A \ 模式 B | 微距 | 大遠景 | 特寫 | 遠景 |
|---------------|-----|-------|-----|-----|
| **微距** | - | ❌ 衝突 | ❌ 衝突 | ❌ 衝突 |
| **大遠景** | ❌ 衝突 | - | ❌ 衝突 | ✅ 正常 |
| **特寫** | ❌ 衝突 | ❌ 衝突 | - | ✅ 正常 |
| **遠景** | ❌ 衝突 | ✅ 正常 | ✅ 正常 | - |

---

## 🎨 使用者體驗建議

### 1. 警告顏色系統（Phase 3 UI）

- **紅色（CONFLICT）**：物理不可能或邏輯矛盾，必須修正
  - 例：微距 + 大遠景
  - 例：魚眼 + 建築視角
  
- **橘色（SUBOPTIMAL）**：可用但效果不理想
  - 例：長焦 + 蟲視（張力不足）
  - 例：標準鏡頭 + 極端角度（自動調整）
  
- **藍色（SUGGESTION）**：推薦組合或特殊效果
  - 例：廣角 + 蟲視（最佳英雄感）
  - 例：長焦 + 鳥瞰（衛星地圖視角）

### 2. 智能提示系統

當使用者選擇某個設定時，主動顯示：
- **推薦組合**：「試試看廣角 + 蟲視，會有最佳英雄感！」
- **避免組合**：「注意：長焦 + 蟲視會削弱張力」
- **自動修正**：「系統已自動調整為廣角透視」

### 3. 快速修復按鈕

在警告旁邊提供快速修復按鈕：
- **「切換為廣角」**（當長焦 + 蟲視時）
- **「切換為遠景」**（當大遠景 + 特寫時）
- **「啟用焦點合成」**（當微距 + 深景深時）

---

## 📊 優先級建議

### 高優先級（應該立即實作）

1. ✅ **魚眼保護**（已完成）
2. ❌ **微距 + 大遠景衝突檢測**（新增）
3. ❌ **大遠景 + 特寫衝突檢測**（新增）

### 中優先級（Phase 3 實作）

4. ⚠️ **長焦 + 蟲視警告**（已實作邏輯，待應用）
5. ⚠️ **極端角度自動調整警告**（新增）
6. ⚠️ **大遠景 + 長焦警告**（新增）

### 低優先級（可選）

7. 💡 **推薦組合提示**（已實作邏輯，待 UI 顯示）
8. 💡 **快速修復按鈕**（Phase 3 UI 功能）

---

## 🔧 實作建議

### 立即實作（修復關鍵衝突）

```typescript
// 在 lensAngleCompatibility.ts 的 checkCompatibility() 中添加

// 檢測微距 + 大遠景衝突
if (isMacro && isWide) {
  warnings.push({
    type: WarningType.CONFLICT,
    message: '微距模式（極近）與大遠景模式（極遠）互斥',
    suggestion: '請選擇其中一種模式',
    affectedParams: ['shotType', 'scaleMode']
  });
  isCompatible = false;
}

// 檢測大遠景 + 特寫衝突
const isCloseUp = state.camera.shotType.toLowerCase().includes('close') ||
                  state.camera.shotType.toLowerCase().includes('特寫') ||
                  state.camera.shotType.toLowerCase().includes('ecu');

if (isWide && isCloseUp) {
  warnings.push({
    type: WarningType.CONFLICT,
    message: '大遠景模式與特寫鏡頭互斥',
    suggestion: '大遠景應該使用遠景（Long Shot）或全景（Full Body）',
    affectedParams: ['shotType', 'scaleMode']
  });
  isCompatible = false;
}
```

### Phase 3 實作（UI 整合）

1. 在 `CameraSection.tsx` 中顯示警告
2. 添加快速修復按鈕
3. 實作推薦組合提示
4. 應用自動修正到 Prompt

---

## 📝 總結

### 已實作且運作良好 ✅
- 魚眼相容性（已修復優先級問題）
- 長焦相容性（邏輯完整，待應用）
- 微距相容性（角度轉譯、景深處理）
- 廣角相容性（推薦組合）

### 需要新增 ❌
- 微距 + 大遠景衝突檢測
- 大遠景 + 特寫衝突檢測
- 大遠景 + 長焦警告
- 極端角度自動調整警告

### 待 Phase 3 實作 ⚠️
- UI 警告顯示
- 快速修復按鈕
- 推薦組合提示
- 自動修正應用

你覺得我應該先實作哪些新規則？
