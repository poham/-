# Prompt 淨化系統實作總結

## 概述

根據 Gemini 的建議，我們實作了一套完整的 **Prompt 淨化系統（Prompt Sanitizer）**，解決了 AI 繪圖模型在處理互斥參數時產生「平均值」效果的問題。

## 核心問題

當用戶在 UI 調整參數時，可能會產生以下三種衝突：

### 1. 視角矛盾（Angle vs. Orientation）
- **問題**：攝影機在底部仰拍（LOW ANGLE），但主體描述為「俯視向攝影機」（Top View）
- **結果**：AI 會選擇折衷的「斜平視」，失去仰視感

### 2. 構圖衝突（Framing vs. Composition）
- **問題**：Standard Product View（全入鏡）+ Tight close-up（特寫）
- **結果**：生成遠不遠、近不近的尷尬構圖

### 3. 焦距與距離的邏輯（Lens vs. Perspective）
- **問題**：50mm 標準鏡頭 + Dramatic foreshortening（強烈透視）
- **結果**：畫面變得平淡，因為 50mm 接近人眼，無法產生強烈變形

## 解決方案架構

我們建立了三個核心模組：

### 1. `utils/cameraSubjectAlignment.ts`
**功能**：攝影機-主體對齊系統

**核心原則**：攝影機位置決定主體朝向

**主要函數**：
- `alignSubjectToCamera()` - 根據攝影機角度自動對齊主體朝向
- `hasViewAngleConflict()` - 檢查當前配置是否存在視角矛盾
- `getViewAngleConflictWarning()` - 獲取視角矛盾的警告訊息

**範例**：
```typescript
// 仰視拍攝：攝影機在下方
alignSubjectToCamera(-60, 0, "Front View")
// Returns: "facing downwards towards the lens, towering over camera"

// 俯視拍攝：攝影機在上方
alignSubjectToCamera(75, 0, "Front View")
// Returns: "facing upwards towards the lens, viewed from above"
```

### 2. `utils/lensAngleSuggestions.ts`
**功能**：鏡頭-角度聯動建議系統

**主要函數**：
- `suggestOptimalLens()` - 根據攝影機角度建議最佳鏡頭
- `isSuboptimalCombination()` - 檢查鏡頭-角度組合是否為次優
- `rateLensAngleCombination()` - 獲取當前組合的評分（0-100）

**建議規則**：
| 情境 | 建議 | 優先級 |
|------|------|--------|
| 極端角度（蟲視/鳥瞰）+ 標準鏡頭 | 廣角鏡頭 | Medium |
| 極端角度 + 長焦 | 廣角鏡頭 | High |
| 微距 + 廣角/長焦 | 微距鏡頭 | High |
| 大遠景 + 長焦 | 廣角鏡頭 | Medium |
| 特寫 + 標準鏡頭 | 長焦鏡頭 | Low |

**評分範例**：
```typescript
rateLensAngleCombination(-60, 'Wide Angle (24mm)', 'Medium Shot')  // 100 分
rateLensAngleCombination(-60, 'Telephoto (85mm)', 'Medium Shot')   // 30 分
```

### 3. `utils/promptSanitizer.ts`
**功能**：Prompt 淨化核心系統

**淨化流程**：
1. 修正視角矛盾（攝影機位置 vs 主體朝向）
2. 執行鏡頭-角度相容性檢查
3. 應用自動修正（移除衝突關鍵字、添加補償描述）
4. 過濾重複和稀釋的形容詞

**主要函數**：
- `sanitizePromptState()` - 執行完整的淨化流程
- `needsSanitization()` - 快速檢查是否需要淨化
- `detectDilutedKeywords()` - 檢查 Prompt 是否包含稀釋關鍵字

**返回結果**：
```typescript
interface SanitizationResult {
  sanitizedState: PromptState;        // 淨化後的狀態
  appliedCorrections: string[];       // 應用的修正列表
  removedConflicts: string[];         // 移除的衝突關鍵字
  warnings: string[];                 // 警告訊息
}
```

## 整合到 Prompt 組裝流程

在 `utils/promptAssembly.ts` 的 `assembleFinalPrompt()` 函數中整合淨化系統：

```typescript
export function assembleFinalPrompt(state: PromptState): string {
  try {
    // STEP 0: Prompt 淨化（新增）
    let workingState = state;
    
    if (needsSanitization(state)) {
      const sanitizationResult = sanitizePromptState(state);
      workingState = sanitizationResult.sanitizedState;
      
      // 在開發環境中記錄淨化過程
      if (process.env.NODE_ENV === 'development') {
        console.group('🧹 Prompt 淨化');
        console.log('應用的修正:', sanitizationResult.appliedCorrections);
        console.log('移除的衝突:', sanitizationResult.removedConflicts);
        console.log('警告訊息:', sanitizationResult.warnings);
        console.groupEnd();
      }
    }
    
    // STEP 1: 翻譯技術參數為視覺描述
    const translated = translatePromptState(workingState);
    
    // ... 後續組裝邏輯
  }
}
```

## 測試覆蓋

建立了完整的測試套件：

### `utils/promptSanitizer.test.ts`
- ✅ 視角矛盾修正（仰視 + Top View）
- ✅ 視角矛盾修正（俯視 + Bottom View）
- ✅ 平視時根據方位角調整朝向
- ✅ 重複形容詞檢測與去除
- ✅ needsSanitization 檢測

### `utils/cameraSubjectAlignment.test.ts`
- ✅ 蟲視 → 主體朝下看鏡頭
- ✅ 低角度 → 主體朝下看鏡頭
- ✅ 平視 → 保持正面朝向
- ✅ 高角度 → 主體朝上看鏡頭
- ✅ 鳥瞰 → 主體朝上看鏡頭
- ✅ 視角衝突檢測

### `utils/lensAngleSuggestions.test.ts`
- ✅ 極端角度建議廣角（21 個測試案例）
- ✅ 微距模式建議
- ✅ 大遠景建議
- ✅ 特寫建議
- ✅ 次優組合檢測
- ✅ 組合評分系統

**測試結果**：36 個測試全部通過 ✅

## 優化效果

### 修正前
```
Prompt: "Medium shot, 50mm lens, Low Angle, of Tennis Racket (Top View), 
in clean white background, lit by studio lighting."
```
**問題**：攝影機在下方仰拍，但球拍卻俯視鏡頭（物理矛盾）

### 修正後
```
Prompt: "Medium shot, Wide Angle (24mm) lens using dynamic perspective 
and foreshortening, Low Angle, of Tennis Racket (facing downwards towards 
the lens, towering over camera), in clean white background, lit by studio 
lighting."
```
**改善**：
1. 視角一致：主體朝下看鏡頭
2. 鏡頭優化：建議使用廣角增強透視感
3. 補償描述：添加 "dynamic perspective" 和 "foreshortening"

## 未來擴展

### 1. UI 整合
在 CameraSection 中顯示即時建議：
```tsx
const suggestion = suggestOptimalLens(
  cameraElevation, 
  currentLens, 
  shotType
);

{suggestion && (
  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
    <p className="text-[11px] text-blue-300">
      💡 建議：{suggestion.reason}
    </p>
    <button onClick={() => setLens(suggestion.suggestedLens)}>
      切換為 {suggestion.suggestedLens}
    </button>
  </div>
)}
```

### 2. 警告系統
在 Protocol Deck 中顯示淨化警告：
```tsx
const sanitizationResult = sanitizePromptState(state);

{sanitizationResult.warnings.length > 0 && (
  <div className="space-y-2">
    {sanitizationResult.warnings.map((warning, i) => (
      <div key={i} className="text-[11px] text-orange-300">
        ⚠️ {warning}
      </div>
    ))}
  </div>
)}
```

### 3. 自動修正開關
讓用戶選擇是否啟用自動淨化：
```tsx
const [enableSanitization, setEnableSanitization] = useState(true);

// 在 assembleFinalPrompt 中
if (enableSanitization && needsSanitization(state)) {
  // 執行淨化
}
```

## 參考資料

- Gemini 建議：視角矛盾、鏡頭語言自動關聯、權重標籤化
- 現有系統：`utils/lensAngleCompatibility.ts`（鏡頭-角度相容性檢查）
- 相關文件：`constants/compatibilityRules.ts`（相容性規則定義）

## 總結

這套 Prompt 淨化系統實現了 Gemini 建議的三個核心優化：

1. ✅ **座標系優先原則**：攝影機位置自動決定主體朝向
2. ✅ **鏡頭語言自動關聯**：極端角度自動建議廣角鏡頭
3. ✅ **權重標籤化**：去除重複形容詞，避免 Prompt 稀釋

系統已完全整合到 `assembleFinalPrompt()` 流程中，確保生成的 Prompt 沒有物理矛盾和語義衝突，讓 AI 模型能夠產生更精確、更具視覺衝擊力的圖像。
