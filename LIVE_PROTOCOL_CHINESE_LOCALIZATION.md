# Live Protocol Deck 中文化實作

## 概述

本次實作為 Live Protocol Deck（即時協定面板）添加了完整的中文化支援，讓使用者在操作介面時能夠以中文理解所有攝影參數，同時保持導出的 Prompt 為英文格式，確保與 AI 模型（特別是 Gemini Flash 3.0）的最佳相容性。

## 核心設計理念

### 雙語分離策略

1. **UI 顯示層（中文）**：Live Protocol Deck 中的所有標籤和描述文字都翻譯成中文
2. **資料導出層（英文）**：點擊「Copy String」導出的 Prompt 保持英文格式

這種設計確保：
- 使用者在操作時能夠一目了然，快速理解當前設定
- 導出的 Prompt 保持專業性和 AI 模型相容性
- 兩者互不干擾，各司其職

## 實作架構

### 1. 翻譯模組 (`utils/chineseTranslations.ts`)

建立了一個專門的翻譯模組，包含：

#### 標籤翻譯對照表 (`LABEL_TRANSLATIONS`)
```typescript
{
  'THEME': '主題風格',
  'POV MODE': '特殊視角模式',
  'CAMERA POSITION': '攝影機位置',
  'LENS OPTICS': '鏡頭光學',
  'SHOT TYPE': '景別尺度',
  'DEPTH OF FIELD': '景深效果',
  'COMPOSITION RULE': '構圖法則',
  'SUBJECT DETAILS': '主體細節',
  'ENVIRONMENT': '環境場景',
  'LIGHTING STYLE': '燈光風格',
  'KEY LIGHT': '主光源',
  'FILL LIGHT': '補光',
  'RIM LIGHT': '輪廓光',
  'MOOD': '氛圍情緒',
  'RENDERING STYLE': '渲染風格',
}
```

#### 攝影術語翻譯對照表 (`PHOTOGRAPHY_TERMS`)

包含超過 200 個攝影專業術語的中英對照，涵蓋：

- **攝影機位置**：eye-level（平視）、high angle（高角度）、bird's eye（鳥瞰）等
- **鏡頭類型**：fisheye lens（魚眼鏡頭）、wide-angle lens（廣角鏡頭）、telephoto lens（望遠鏡頭）等
- **變形與透視**：barrel distortion（桶狀變形）、compression（壓縮）、spatial depth（空間深度）等
- **景別**：extreme close-up（極致特寫）、medium shot（中景）、long shot（遠景）等
- **景深**：shallow depth of field（淺景深）、creamy bokeh（奶油般的散景）等
- **構圖**：rule of thirds（三分法）、golden ratio（黃金比例）等
- **燈光**：key light（主光）、fill light（補光）、rim light（輪廓光）等
- **氛圍與風格**：dramatic（戲劇性）、cinematic（電影感）、minimalist（極簡）等

#### 核心翻譯函數

1. **`translateLabel(label: string)`**
   - 翻譯標籤名稱（如 "CAMERA POSITION" → "攝影機位置"）

2. **`translateToChineseUI(text: string)`**
   - 智能翻譯攝影描述文字
   - 支援部分匹配和多詞組合
   - 不區分大小寫
   - 按照詞組長度優先匹配（避免部分匹配覆蓋完整匹配）

3. **`translateCategorizedParts(parts: Array)`**
   - 批量翻譯 categorizedParts 陣列
   - 保留原始的顏色和結構資訊

### 2. Protocol Deck 整合 (`components/layout/ProtocolDeck.tsx`)

#### 修改重點

1. **引入翻譯模組**
```typescript
import { translateCategorizedParts } from '../../utils/chineseTranslations';
```

2. **建立中文版本的資料**
```typescript
// 原始英文版本（用於導出）
const categorizedParts = useMemo(() => {
  // ... 原有邏輯
}, [promptState]);

// 中文版本（僅用於 UI 顯示）
const categorizedPartsZH = useMemo(() => {
  return translateCategorizedParts(categorizedParts);
}, [categorizedParts]);
```

3. **UI 顯示使用中文版本**
```typescript
{categorizedPartsZH.map((part, idx) => (
  <div key={part.label}>
    <p>{part.label}</p>  {/* 中文標籤 */}
    <p>{part.text}</p>   {/* 中文描述 */}
  </div>
))}
```

4. **導出功能保持英文**
```typescript
// finalPrompt 仍然是英文版本
<button onClick={onCopy}>Copy String</button>
```

5. **添加使用提示**
```typescript
<p className="text-[11px] text-slate-400">
  點擊「Copy String」導出英文版 Prompt
</p>
```

## 翻譯範例

### 範例 1：攝影機位置

**英文原文：**
```
camera positioned at high angle, looking down, subject appears smaller
```

**中文翻譯：**
```
攝影機位於 高角度, 俯視, 主體顯得較小
```

### 範例 2：鏡頭光學

**英文原文：**
```
using wide-angle lens perspective, noticeable barrel distortion, expanded spatial depth
```

**中文翻譯：**
```
使用 廣角鏡頭 透視, 可見桶狀變形, 擴展的空間深度
```

### 範例 3：景深效果

**英文原文：**
```
creating shallow depth of field, soft background blur, subject-background separation
```

**中文翻譯：**
```
創造 淺景深, 柔和的背景模糊, 主體背景分離
```

### 範例 4：燈光設定

**英文原文：**
```
studio lighting, soft lighting, dramatic shadows, high contrast
```

**中文翻譯：**
```
攝影棚燈光, 柔光, 戲劇性陰影, 高對比
```

## 測試覆蓋

建立了完整的測試套件 (`utils/chineseTranslations.test.ts`)，包含：

- ✅ 標籤翻譯測試（2 個測試）
- ✅ 術語翻譯測試（10 個測試）
- ✅ 批量翻譯測試（3 個測試）
- ✅ 真實場景測試（4 個測試）

**測試結果：19/19 通過** ✓

## 使用者體驗改善

### 改善前
- 使用者看到的是英文技術術語，需要一定的攝影專業知識才能理解
- 例如："camera positioned at high angle, using wide-angle lens perspective"

### 改善後
- 使用者看到的是中文描述，直觀易懂
- 例如："攝影機位於 高角度, 使用 廣角鏡頭 透視"
- 導出的 Prompt 仍然是英文，確保 AI 模型相容性

## 技術特點

### 1. 智能匹配演算法
- 優先匹配較長的詞組（避免 "wide-angle lens" 被拆成 "wide" + "angle" + "lens"）
- 不區分大小寫
- 支援部分匹配

### 2. 效能優化
- 使用 `useMemo` 快取翻譯結果
- 只在 `promptState` 或 `categorizedParts` 變化時重新計算

### 3. 可維護性
- 翻譯對照表集中管理
- 易於擴充新的術語
- 測試覆蓋完整

### 4. 向後相容
- 不影響現有的英文導出功能
- 不改變資料結構
- 純 UI 層面的改善

## 未來擴充方向

### 1. 多語言支援
可以輕鬆擴充為支援多種語言：
```typescript
// 日文
const PHOTOGRAPHY_TERMS_JA: Record<string, string> = {
  'camera positioned at': 'カメラ位置',
  'eye-level': 'アイレベル',
  // ...
};

// 韓文
const PHOTOGRAPHY_TERMS_KO: Record<string, string> = {
  'camera positioned at': '카메라 위치',
  'eye-level': '눈높이',
  // ...
};
```

### 2. 使用者自訂翻譯
允許使用者自訂特定術語的翻譯：
```typescript
// LocalStorage 儲存使用者自訂翻譯
const customTranslations = loadFromLocalStorage('customTranslations');
```

### 3. 翻譯品質回饋
添加「回報翻譯問題」功能，讓使用者可以提供翻譯改善建議。

## 檔案清單

### 新增檔案
- `utils/chineseTranslations.ts` - 翻譯模組主檔案
- `utils/chineseTranslations.test.ts` - 測試檔案
- `LIVE_PROTOCOL_CHINESE_LOCALIZATION.md` - 本說明文件

### 修改檔案
- `components/layout/ProtocolDeck.tsx` - 整合中文翻譯功能

## 結論

本次實作成功為 Live Protocol Deck 添加了完整的中文化支援，在不影響原有功能的前提下，大幅提升了中文使用者的操作體驗。透過雙語分離策略，我們既保證了 UI 的易用性，又維持了導出 Prompt 的專業性和 AI 模型相容性。

這個設計特別適合 Gemini Flash 3.0 這類對中文有良好支援的 AI 模型，使用者可以在中文介面中輕鬆操作，同時獲得高品質的英文 Prompt 輸出。
