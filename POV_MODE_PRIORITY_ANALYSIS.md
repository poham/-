# POV Mode 優先級與相容性分析

## 問題描述

在「動漫大亂鬥魚眼自拍」Preset 中，發現 POV Mode 的語序優先級和相容性規則尚未完整整合到系統中。

## 當前狀態

### 語序實作（visualTranslators.ts）

```typescript
// 第零順位：特殊 POV 模式（如果有）
if (povModeDesc) {
  compositionParts.push(povModeDesc);  // 'handheld selfie'
}

// 第一順位：相機物理位置與角度
compositionParts.push(`camera positioned at ${cameraPositionDesc}`);

// 第二順位：鏡頭光學特性
compositionParts.push(`using ${lensOpticsDesc}`);  // '8mm fisheye'

// 第三順位：景別描述
compositionParts.push(shotTypeDesc);  // 'Close-up'
```

### 優先級排序規則（compatibilityRules.ts）

目前的 `PRIORITY_SORTING_RULES` **不包含** POV Mode：

```typescript
export const PRIORITY_SORTING_RULES: Record<PromptPriorityLevel, string[]> = {
  [PromptPriorityLevel.SPECIAL_OPTICS]: ['EXTREME MACRO', 'FISHEYE LENS', ...],
  [PromptPriorityLevel.EXTREME_DISTANCE]: ['EXTREME WIDE SHOT', ...],
  [PromptPriorityLevel.PHYSICAL_ANGLE]: ['WORM\'S EYE', 'BIRD\'S EYE', ...],
  [PromptPriorityLevel.LENS_FOCAL]: ['telephoto', 'wide angle', ...],
  [PromptPriorityLevel.SUBJECT_STYLE]: ['subject', 'cinematic', ...]
};
```

## 潛在衝突

### 1. POV Mode + 微距模式

**組合範例：**
- `povMode: 'handheld selfie'`
- `shotType: '超特寫/微距'`

**問題：**
- 微距攝影需要極度穩定（通常使用三腳架）
- 手持自拍與微距在物理上衝突

**建議：**
- 添加相容性警告
- 或自動調整為「手持特寫」而非「微距」

### 2. POV Mode + 魚眼鏡頭

**組合範例：**
- `povMode: 'handheld selfie'`
- `lens: '8mm 魚眼'`

**狀態：**
- ✅ 這個組合是合理的！
- 「動漫大亂鬥魚眼自拍」就是這個組合
- 不需要衝突檢測

### 3. POV Mode 的語序優先級

**當前行為：**
- POV Mode 在 `visualTranslators.ts` 中被放在第零順位（最優先）
- 但在 `applyPrioritySorting()` 函數中，POV Mode 不在 `PRIORITY_SORTING_RULES` 中
- 可能導致優先級排序時被重新排列

**問題：**
- 如果相容性系統重新排序，POV Mode 可能被移到錯誤的位置

## 建議的解決方案

### 方案 1：添加 POV Mode 到優先級規則（推薦）

在 `compatibilityRules.ts` 中添加新的優先級層級：

```typescript
export enum PromptPriorityLevel {
  POV_MODE = 0,           // 新增：特殊拍攝方式（最優先）
  SPECIAL_OPTICS = 1,     // 特殊光學（魚眼、微距）
  EXTREME_DISTANCE = 2,   // 極端距離（大遠景）
  PHYSICAL_ANGLE = 3,     // 物理角度（蟲視、鳥瞰）
  LENS_FOCAL = 4,         // 鏡頭焦距
  SUBJECT_STYLE = 5       // 主體風格
}

export const PRIORITY_SORTING_RULES: Record<PromptPriorityLevel, string[]> = {
  [PromptPriorityLevel.POV_MODE]: [
    'selfie',
    'handheld',
    'first-person',
    'gopro',
    'chest-mounted',
    'head-mounted',
    'shoulder-mounted'
  ],
  // ... 其他規則
};
```

### 方案 2：添加 POV Mode 相容性規則

在 `compatibilityRules.ts` 中添加：

```typescript
export const POV_MODE_RULES = {
  /**
   * 衝突檢測規則
   */
  conflicts: [
    {
      condition: (state) => {
        const isPOV = state.camera.povMode && state.camera.povMode !== '';
        const isMacro = state.camera.shotType.includes('微距') || 
                       state.camera.shotType.includes('macro');
        return isPOV && isMacro;
      },
      warning: 'POV 模式（如自拍、手持）與微距攝影在物理上衝突，微距需要穩定的三腳架',
      type: WarningType.CONFLICT,
      suggestion: '建議切換為「特寫」而非「微距」，或移除 POV 模式'
    }
  ],
  
  /**
   * 推薦組合
   */
  recommendations: [
    {
      combination: 'selfie + fisheye',
      message: '自拍 + 魚眼 = 經典的誇張變形自拍效果',
      type: WarningType.SUGGESTION
    },
    {
      combination: 'first-person + wide-angle',
      message: '第一人稱 + 廣角 = 沉浸式 POV 體驗',
      type: WarningType.SUGGESTION
    }
  ]
};
```

### 方案 3：在微距模式中檢測 POV Mode

在 `visualTranslators.ts` 的微距模式邏輯中添加檢測：

```typescript
// 微距模式檢測
const isMacro = isMacroMode(state.camera.shotType);

// 檢測 POV Mode 衝突
if (isMacro && state.camera.povMode && state.camera.povMode !== '') {
  // 添加警告到相容性結果
  compatibilityResult.warnings.push({
    type: WarningType.CONFLICT,
    message: 'POV 模式與微距攝影衝突，已自動調整為手持特寫模式',
    affectedParameters: ['povMode', 'shotType']
  });
  
  // 自動調整：保留 POV Mode，但降級微距為特寫
  // 或者：移除 POV Mode，保留微距
}
```

## 實作優先順序

1. **立即實作**：方案 1（添加 POV Mode 到優先級規則）
   - 確保 POV Mode 永遠在最優先位置
   - 防止被相容性系統重新排序

2. **短期實作**：方案 2（添加相容性規則）
   - 檢測 POV Mode + 微距的衝突
   - 提供友善的警告訊息

3. **長期優化**：方案 3（自動調整）
   - 當檢測到衝突時，自動調整參數
   - 提供最佳的用戶體驗

## 測試案例

### 測試 1：POV Mode + 魚眼（應該通過）

```typescript
{
  camera: {
    povMode: 'handheld selfie',
    lens: '8mm 魚眼',
    shotType: '特寫/肩上'
  }
}
```

**預期輸出：**
```
handheld selfie, camera positioned at High angle, using 8mm fisheye lens with extreme barrel distortion, Close-up
```

### 測試 2：POV Mode + 微距（應該警告）

```typescript
{
  camera: {
    povMode: 'handheld selfie',
    lens: '50mm 標準',
    shotType: '超特寫/微距'
  }
}
```

**預期行為：**
- 顯示衝突警告
- 建議調整為「特寫」或移除 POV Mode

### 測試 3：無 POV Mode + 微距（應該正常）

```typescript
{
  camera: {
    povMode: '',
    lens: '50mm 標準',
    shotType: '超特寫/微距'
  }
}
```

**預期輸出：**
```
EXTREME MACRO CLOSE-UP, 1:1 MACRO DETAIL, MICROSCOPIC VIEW, ...
```

## 結論

POV Mode 是一個強大的功能，但需要：
1. 明確的優先級定義
2. 相容性規則檢測
3. 友善的用戶提示

建議按照上述方案逐步實作，確保系統的一致性和可靠性。
