# 燈光系統澄清 - 回答使用者的疑問

## 使用者的三個問題

### 問題 1：你怎麼判定商品或是人像？哪裡可以讓你知道，現在是人像還是商品？

**答案**：在 `promptAssembly.ts` 中，有以下判定邏輯：

```typescript
const isProductMode = 
  camera.framingMode === 'product' ||  // 手動設定（在 Camera Section）
  camera.photographyMode === 'commercial' ||  // 攝影模式設定
  subject.type.toLowerCase().includes('product') ||  // 主體類型包含「product」
  subject.type.toLowerCase().includes('bottle') ||  // 瓶子
  subject.type.toLowerCase().includes('watch') ||  // 手錶
  subject.type.toLowerCase().includes('jewelry');  // 珠寶
```

**判定來源**：
1. **`camera.framingMode`**：在 `types.ts` 中定義，可以是 `'auto'`, `'product'`, 或 `'portrait'`
2. **`camera.photographyMode`**：可以是 `'commercial'` 或 `'technical'`
3. **`subject.type`**：使用者在 Subject Section 輸入的主體類型

**問題**：目前這些欄位可能沒有在 UI 中暴露給使用者設定！

---

### 問題 2：你說在 Prompt 中沒有林布蘭光（Rembrandt Lighting）的訊息，只有清晰的物理描述。但是我在 AI 推論裡的 Lighting 裡面就看到 Rembrandt Lighting 這個訊息

**答案**：這是因為有**兩個不同的系統**在運作：

#### 系統 A：`assemblePromptParts`（用於 Live Protocol Deck）

- **位置**：`utils/promptAssembly.ts`
- **用途**：生成分段的 Prompt Parts，顯示在右側的 Live Protocol Deck
- **使用**：新的參數驅動系統（`lightingPromptGenerator.ts`）
- **行為**：
  - 人像模式：顯示「Rembrandt lighting style」
  - 產品模式：移除「Rembrandt」，只顯示物理描述

#### 系統 B：`assembleFinalPrompt`（用於最終 Prompt）

- **位置**：`utils/promptAssembly.ts`
- **用途**：生成最終的完整 Prompt 字串
- **使用**：舊的視覺翻譯系統（`visualTranslators.ts`）
- **行為**：**沒有使用新系統**，仍然使用舊的 `translateStudioSetup`

**問題**：兩個系統不一致！

---

### 問題 3：然後在右側的 Live Portal Deck 也看到 Rembrandt Lighting 這個東西。那你這邊說 Prompt 不含 Rembrandt，只有清晰的物理描述，到底是什麼意思呢？

**答案**：我的說明有誤導性。讓我澄清：

#### 實際情況

1. **Live Protocol Deck**（右側面板）：
   - 使用 `assemblePromptParts`
   - **已經整合新系統**
   - 產品模式下會移除「Rembrandt」

2. **最終 Prompt**（用於 AI 生成）：
   - 使用 `assembleFinalPrompt`
   - **尚未整合新系統**
   - 仍然會包含「Rembrandt」（透過 `visualTranslators.ts`）

#### 問題根源

**新系統只整合到 `assemblePromptParts`，沒有整合到 `assembleFinalPrompt`！**

---

## 當前系統的實際流程

### 流程圖

```
使用者調整燈光
    ↓
App.tsx 計算兩個值
    ├─→ promptParts = assemblePromptParts(state)
    │   └─→ 使用新系統（lightingPromptGenerator）
    │       └─→ 產品模式：移除 Rembrandt
    │           └─→ 顯示在 Live Protocol Deck
    │
    └─→ finalPrompt = assembleFinalPrompt(state)
        └─→ 使用舊系統（visualTranslators）
            └─→ 仍然包含 Rembrandt
                └─→ 用於最終 AI 生成
```

### 代碼位置

**App.tsx**：
```typescript
const promptParts = useMemo(() => assemblePromptParts(state), [state]);
const finalPrompt = useMemo(() => assembleFinalPrompt(state), [state]);
```

**promptAssembly.ts - assemblePromptParts**：
```typescript
// LIGHTING 區段（僅在進階燈光啟用時）
if (migratedOptics.useAdvancedLighting) {
  const setup = STUDIO_SETUPS.find(s => s.id === migratedOptics.studioSetup);
  
  // ✅ 偵測產品模式
  const isProductMode = camera.framingMode === 'product' || ...;
  
  // ✅ 使用新系統
  const lightingDesc = formatLightingSection(
    migratedOptics.keyLight,
    migratedOptics.fillLight,
    migratedOptics.rimLight,
    setup?.id,
    setup?.promptTags,
    isProductMode  // ✅ 傳入產品模式
  );
  parts.push({ label: 'LIGHTING', text: lightingDesc });
}
```

**promptAssembly.ts - assembleFinalPrompt**：
```typescript
// ❌ 使用舊系統（visualTranslators）
const translated = translatePromptState(state);

// ❌ 沒有產品模式判定
// ❌ 沒有使用新的 lightingPromptGenerator
```

---

## 問題總結

### 1. 判定邏輯存在但可能沒有 UI

**判定邏輯**：
```typescript
const isProductMode = 
  camera.framingMode === 'product' ||  // ❓ UI 中有這個選項嗎？
  camera.photographyMode === 'commercial' ||  // ❓ UI 中有這個選項嗎？
  subject.type.toLowerCase().includes('product');  // ✅ 使用者輸入
```

**問題**：
- `camera.framingMode` 和 `camera.photographyMode` 可能沒有在 UI 中暴露
- 目前只能依賴 `subject.type` 的關鍵字判定

### 2. 兩個系統不一致

| 系統 | 用途 | 是否整合新系統 | 產品模式行為 |
|------|------|---------------|-------------|
| `assemblePromptParts` | Live Protocol Deck | ✅ 是 | 移除 Rembrandt |
| `assembleFinalPrompt` | 最終 Prompt | ❌ 否 | 仍包含 Rembrandt |

**結果**：
- Live Protocol Deck 顯示：「Key light positioned at...」（正確）
- 最終 Prompt 包含：「Rembrandt lighting style」（錯誤）

### 3. 我的說明有誤導

我說「Prompt 中不含 Rembrandt」，但實際上：
- **Live Protocol Deck**：不含 Rembrandt（✅ 正確）
- **最終 Prompt**：仍含 Rembrandt（❌ 錯誤）

---

## 需要修正的地方

### 修正 1：整合新系統到 `assembleFinalPrompt`

**目標**：讓最終 Prompt 也使用新的參數驅動系統

**方法**：修改 `visualTranslators.ts` 中的 `translatePromptState` 函式，加入產品模式判定和新系統調用

### 修正 2：確保 UI 中有產品模式選項

**目標**：讓使用者可以手動設定產品模式

**方法**：
1. 在 Camera Section 加入「取景模式」選項：
   - Auto（自動偵測）
   - Product（產品攝影）
   - Portrait（人像攝影）

2. 或在 Optics Section 加入「攝影模式」選項：
   - Commercial（商業攝影）
   - Technical（技術攝影）

### 修正 3：統一兩個系統

**目標**：確保 Live Protocol Deck 和最終 Prompt 使用相同的邏輯

**方法**：
- 讓 `assembleFinalPrompt` 也調用 `formatLightingSection`
- 或者讓 `translatePromptState` 內部調用 `generateCompleteLightingPrompt`

---

## 下一步行動

1. **立即修正**：整合新系統到 `assembleFinalPrompt`
2. **UI 改進**：在 Camera Section 或 Optics Section 加入產品模式選項
3. **測試驗證**：確保兩個系統輸出一致

---

## 總結

**你的觀察完全正確！**

1. ✅ 判定邏輯存在，但可能沒有 UI 選項
2. ✅ Live Protocol Deck 確實顯示「Rembrandt Lighting」（因為系統不一致）
3. ✅ 我的說明有誤導，實際上最終 Prompt 仍然包含「Rembrandt」

**問題根源**：新系統只整合到一半，`assembleFinalPrompt` 還沒有使用新系統。

**解決方案**：需要將新系統也整合到 `assembleFinalPrompt` 中。
