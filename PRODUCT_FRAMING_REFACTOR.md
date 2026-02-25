# 商品攝影 Framing 系統重構

## 問題描述

原本的 `SHOT_TYPES` 使用傳統電影術語（如 ECU, MCU, MS），但測試後發現 AI 模型對這些術語反應不佳，產出的構圖幾乎都一樣，無法有效區分「特寫」與「全景」。

## 解決方案

將商品攝影的景別系統重構為**基於幾何描述、畫面佔比和留白/裁切指令**的新格式，這些描述經過測試能有效控制 AI 模型的構圖輸出。

## 實作內容

### 1. 新增型別定義 (`types.ts`)

```typescript
export interface ShotTypeOption {
  label: string;  // 顯示在 UI 的名稱（中英文）
  value: string;  // 實際送給 AI 的 Prompt 描述
}
```

### 2. 重構常數定義 (`constants.tsx`)

#### 新增商品攝影景別

```typescript
export const PRODUCT_SHOT_TYPES: ShotTypeOption[] = [
  {
    label: '微距材質 (Macro Texture)',
    value: 'Extreme Macro detail focus on surface texture, abstract composition, millimeter-thin depth of field, filling the entire frame with material pattern'
  },
  {
    label: '局部特寫 (Detail Shot)',
    value: 'Tight close-up on a specific feature or part, cropped composition (product partially cut off by frame edge), emphasizing craftsmanship and specific design elements'
  },
  {
    label: '標準商品視角 (Standard Product View)',
    value: 'Standard Product View, Full product fits comfortably within the frame boundaries, balanced hero shot composition, zero cropping of the main subject, maximizing screen real estate'
  },
  {
    label: '寬鬆構圖 (Loose Framing)',
    value: 'Loose Framing, Full product visible but positioned with significant negative space around it, creating breathing room, minimalist and airy composition'
  },
  {
    label: '廣角環境 (Wide Environmental)',
    value: 'Wide Environmental, Wide-angle perspective, the product appears smaller within an expansive environment, establishing context and mood, high ratio of background versus subject'
  },
  {
    label: '極遠景氛圍 (Extreme Long Shot)',
    value: 'Extreme Long Shot, Subject is very small in the frame, positioned as a tiny element within a vast landscape or large architectural space, emphasizing scale and isolation'
  }
];
```

#### 保留人像攝影景別

```typescript
export const PORTRAIT_SHOT_TYPES = [
  '微距',
  '極致特寫',
  '特寫/肩上',
  '中特寫/胸上',
  '中景/腰上',
  '中遠景/膝上',
  '遠景/全身',
  '大遠景',
  '極遠景'
];
```

### 3. 更新翻譯邏輯 (`utils/visualTranslators.ts`)

`translateShotType` 函數現在能識別新格式的完整 prompt 描述：

```typescript
// 新格式檢測：如果包含特定關鍵字，表示是完整 prompt，直接返回
if (shotType.includes('composition') || 
    shotType.includes('frame boundaries') || 
    shotType.includes('negative space') ||
    shotType.includes('environmental') ||
    shotType.toLowerCase().includes('extreme macro detail')) {
  return shotType;  // 直接使用完整的 prompt 描述
}
```

### 4. 更新 UI 邏輯 (`components/sections/CameraSection.tsx`)

#### 動態切換景別選項

```typescript
// 根據 framingMode 決定使用哪組 shot types
const getAvailableShotTypes = (): string[] => {
  if (isProductMode) {
    return PRODUCT_SHOT_TYPES.map(opt => opt.label);
  } else if (isPortraitMode) {
    return PORTRAIT_SHOT_TYPES;
  } else {
    return PORTRAIT_SHOT_TYPES;  // auto 模式預設使用人像
  }
};
```

#### 自動切換預設值

```typescript
// 當 framingMode 改變時，檢查當前 shotType 是否在新模式的列表中
useEffect(() => {
  const availableTypes = getAvailableShotTypes();
  if (!availableTypes.includes(config.shotType)) {
    const defaultShotType = availableTypes[2] || availableTypes[0];
    onChange({ ...config, shotType: defaultShotType });
  }
}, [config.framingMode]);
```

## 使用方式

### 資料流程

1. **UI 顯示**：使用 `label`（例如「標準商品視角 (Standard Product View)」）
2. **State 儲存**：使用 `value`（完整的 prompt 描述）
3. **Prompt 生成**：直接使用 state 中的 `value`

### 轉換邏輯

```typescript
// CameraSection.tsx 中的轉換函數

// 從 value 取得 label（用於 UI 顯示）
const getLabelFromValue = (value: string): string => {
  if (isProductMode) {
    const option = PRODUCT_SHOT_TYPES.find(opt => opt.value === value);
    return option ? option.label : value;
  }
  return value;
};

// 從 label 取得 value（用於儲存到 state）
const getValueFromLabel = (label: string): string => {
  if (isProductMode) {
    const option = PRODUCT_SHOT_TYPES.find(opt => opt.label === label);
    return option ? option.value : label;
  }
  return label;
};
```

### 用戶操作流程

1. 在 **CameraSection** 中選擇「取景模式」：
   - **自動**：根據主體類型自動選擇（預設）
   - **商品**：使用新的商品攝影景別
   - **人像**：使用傳統人像景別

2. 選擇商品模式後，下拉選單會顯示：
   - UI 顯示：`微距材質 (Macro Texture)`
   - 實際 Prompt：`Extreme Macro detail focus on surface texture...`

3. 最終 Prompt 會直接使用完整的幾何描述，而非傳統術語

### Prompt 輸出範例

**商品模式 - 標準商品視角**：
```
Standard Product View, Full product fits comfortably within the frame boundaries, 
balanced hero shot composition, zero cropping of the main subject, maximizing screen real estate
```

**人像模式 - 中特寫/胸上**：
```
Head and shoulders portrait, upper chest visible
```

## 向後兼容性

- 舊的 `SHOT_TYPES` 常數保留，指向 `PORTRAIT_SHOT_TYPES`
- 現有的人像景別翻譯邏輯完全保留
- 舊格式的商品景別（如果存在）仍會被正確翻譯

## 測試建議

1. 切換到商品模式，選擇不同的景別選項
2. 檢查 Protocol Deck 中的 prompt 是否包含完整的幾何描述
3. 測試 auto 模式是否能正確偵測主體類型
4. 確認模式切換時景別選項會自動更新

## 關鍵優勢

✅ **精確控制**：使用幾何描述和畫面佔比，而非模糊的術語  
✅ **AI 友好**：經過測試的 prompt 格式，能有效控制構圖  
✅ **靈活切換**：支援商品/人像/自動三種模式  
✅ **向後兼容**：不影響現有的人像攝影功能  
✅ **類型安全**：完整的 TypeScript 型別定義

## 相關檔案

- `types.ts` - 新增 `ShotTypeOption` 介面
- `constants.tsx` - 新增 `PRODUCT_SHOT_TYPES` 和 `PORTRAIT_SHOT_TYPES`
- `utils/visualTranslators.ts` - 更新 `translateShotType` 函數
- `components/sections/CameraSection.tsx` - 動態切換邏輯
