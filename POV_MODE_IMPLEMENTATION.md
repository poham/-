# POV 模式實作總結

## 概述

本次實作在「攝影設定 (Camera Section)」中新增了「特殊拍攝視角 (POV Mode)」功能，用於描述特殊的拍攝方式（如自拍、手持鏡頭、第一人稱視角等）。

## UI 設計決策

### 為什麼與「快速預設角度」整合？

1. **避免介面層次過於複雜**：獨立的 POV 區塊會讓介面看起來過於分散，難以分辨各區段的差異
2. **操作邏輯一致性**：POV 模式和預設角度都是在調整「攝影機的拍攝方式」，整合在一起更符合用戶的心智模型
3. **視覺清晰度**：將相關功能放在同一個容器中，使用分隔線區分，讓介面更緊湊且易讀

### 整合後的區塊結構

```
┌─────────────────────────────────────────┐
│ 特殊拍攝視角 (POV)                      │
│ [下拉選單]                              │
│ [提示詞預覽]（如果有選擇）              │
├─────────────────────────────────────────┤ ← 分隔線
│ 快速預設角度                            │
│ [正面] [左側] [右側] [背面]             │
│ [俯視] [仰視] [左俯] [右俯]             │
├─────────────────────────────────────────┤ ← 分隔線
│ 攝影模式                                │
│ [商業] [技術]                           │
└─────────────────────────────────────────┘
```

## 設計決策

### 為什麼放在「攝影設定」而非「主體細節」或「場景空間」？

1. **語義邏輯**：selfie、手持鏡頭等本質上是「拍攝方式」，屬於攝影機的操作模式，而非主體或場景的屬性
2. **提示詞語序**：目前的語序是 `[POV Mode], [Camera Setup] of [Subject] in [Environment]`，將 POV 放在 Camera Setup 中可以確保它出現在提示詞最前段
3. **用戶心智模型**：用戶在思考「如何拍攝」時，會自然地將 POV 模式與相機設定聯想在一起

## 實作內容

### 1. 資料模型 (types.ts)

在 `CameraConfig` 介面中新增 `povMode` 欄位：

```typescript
export interface CameraConfig {
  // ... 其他欄位
  povMode?: string;  // 'selfie', 'handheld', 'first-person', 'gopro', 等
}
```

### 2. 常數定義 (constants.tsx)

新增 `POV_MODES` 常數，定義可用的 POV 模式選項：

```typescript
export const POV_MODES: ShotTypeOption[] = [
  { label: '無 (None)', value: '' },
  { label: '自拍 (Selfie)', value: 'selfie perspective, arm extended holding camera' },
  { label: '手持鏡頭 (Handheld)', value: 'handheld camera perspective, natural movement' },
  { label: '第一人稱 (First-Person)', value: 'first-person POV, subjective camera' },
  { label: 'GoPro 視角', value: 'GoPro perspective, action camera mounted view' },
  { label: '胸前相機 (Chest Mount)', value: 'chest-mounted camera perspective' },
  { label: '頭戴相機 (Head Mount)', value: 'head-mounted camera perspective' },
  { label: '肩扛攝影 (Shoulder Cam)', value: 'shoulder-mounted camera, documentary style' }
];
```

在 `DEFAULT_STATE` 中初始化 `povMode` 為空字串：

```typescript
export const DEFAULT_STATE: PromptState = {
  camera: {
    // ... 其他欄位
    povMode: ''  // 預設無特殊 POV 模式
  },
  // ...
};
```

### 3. 視覺翻譯層 (utils/visualTranslators.ts)

在 `translatePromptState` 函數中加入 POV 模式的處理邏輯：

#### SLOT 1.5: 特殊 POV 模式

```typescript
// SLOT 1.5: 特殊 POV 模式 (Special POV Mode)
// 如果有設定特殊 POV 模式，這會成為最優先的描述
let povModeDesc: string | null = null;
if (state.camera.povMode) {
  povModeDesc = state.camera.povMode;
}
```

#### 組裝邏輯更新

更新黃金詞序，將 POV 模式放在最前面：

```typescript
// 黃金法則：特殊 POV → 物理視角 → 鏡頭光學 → 景別構圖 → 風格氣氛
const compositionParts: string[] = [];

// 第零順位：特殊 POV 模式（如果有）
if (povModeDesc) {
  compositionParts.push(povModeDesc);
}

// 第一順位：相機物理位置與角度
compositionParts.push(`camera positioned at ${cameraPositionDesc}`);
// ... 其他順位
```

### 4. UI 實作 (components/sections/CameraSection.tsx)

將 POV 模式整合到「快速預設角度」區塊中，使用分隔線區分不同功能：

```tsx
<div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 shadow-2xl space-y-4">
  {/* 特殊 POV 模式 */}
  <div className="space-y-4">
    <label className="text-[18px] font-black text-slate-300 uppercase tracking-widest">
      特殊拍攝視角 (POV)
    </label>
    <select
      value={config.povMode || ''}
      onChange={(e) => handleChange('povMode', e.target.value)}
      className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-[18px] text-white font-bold focus:outline-none focus:border-step-camera-light transition-colors"
    >
      {POV_MODES.map(mode => (
        <option key={mode.label} value={mode.value}>
          {mode.label}
        </option>
      ))}
    </select>
    
    {config.povMode && (
      <div className="p-3 bg-step-camera/10 border border-step-camera-light/30 rounded-lg">
        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">提示詞預覽</p>
        <p className="text-[13px] text-step-camera-light font-mono leading-relaxed">
          {config.povMode}
        </p>
      </div>
    )}
  </div>

  {/* 分隔線 */}
  <div className="border-t border-slate-700/50"></div>

  {/* 預設角度快捷按鈕 */}
  <div className="space-y-4">
    <label className="text-[18px] font-black text-slate-300 uppercase tracking-widest">
      快速預設角度
    </label>
    {/* ... 預設角度按鈕 ... */}
  </div>

  {/* 攝影模式切換 */}
  <div className="space-y-3 pt-2 border-t border-slate-700/50">
    {/* ... 攝影模式切換 ... */}
  </div>
</div>
```

#### UI 設計亮點

1. **統一容器**：POV 模式、預設角度、攝影模式都在同一個 `bg-slate-900/40` 容器中
2. **清晰分隔**：使用 `border-t border-slate-700/50` 分隔線區分不同功能區塊
3. **即時預覽**：選擇 POV 模式後，立即顯示提示詞預覽
4. **視覺層次**：POV 模式放在最上方，因為它在提示詞中的優先級最高

## 提示詞語序範例

### 無 POV 模式（標準模式）

```
camera positioned at eye level frontal view, using standard lens perspective, medium shot, creating shallow depth of field, Cinematic
```

### 有 POV 模式（自拍模式）

```
selfie perspective, arm extended holding camera, camera positioned at eye level frontal view, using standard lens perspective, medium shot, creating shallow depth of field, Cinematic
```

## UI 設計規範

遵循 `ui-spacing-guidelines.md` 的規範：

- 整體容器使用 `p-5`（中型區塊）
- 選擇器使用 `p-4`（中型選單）
- 提示詞預覽使用 `p-3`（小型區塊）
- 標籤文字使用 `text-[18px]`（區塊標題）
- 提示詞預覽使用 `text-[13px]`（主要提示）和 `text-[11px]`（標籤文字）
- 分隔線使用 `border-t border-slate-700/50`

## 用戶體驗優化

1. **減少視覺噪音**：將相關功能整合在一起，避免過多獨立區塊
2. **操作流程順暢**：從上到下依序為「特殊視角 → 預設角度 → 攝影模式」，符合用戶的操作邏輯
3. **即時反饋**：選擇 POV 模式後立即顯示提示詞預覽，讓用戶了解實際效果

## 向後兼容性

- `povMode` 為可選欄位（`povMode?: string`），預設為空字串
- 現有的 Preset 不需要更新，會自動使用預設值（無 POV 模式）
- 如果 `povMode` 為空字串或 undefined，不會影響提示詞生成

## 未來擴展

可以考慮的擴展方向：

1. **自訂 POV 描述**：允許用戶輸入自訂的 POV 描述
2. **POV 預覽視覺化**：在 UI 中顯示 POV 模式的視覺示意圖
3. **POV 與鏡頭的相容性檢查**：某些 POV 模式可能與特定鏡頭不相容（如 selfie 通常使用廣角鏡頭）
4. **Preset 整合**：在「特殊視角系列」的 Preset 中預設 POV 模式

## 測試建議

1. 測試所有 POV 模式選項是否正確顯示在提示詞中
2. 測試 POV 模式與其他相機設定的組合（如魚眼鏡頭 + selfie）
3. 測試提示詞預覽是否正確顯示
4. 測試向後兼容性（載入舊的 Preset 是否正常）

## 相關檔案

- `types.ts`：資料模型定義
- `constants.tsx`：POV_MODES 常數定義
- `utils/visualTranslators.ts`：視覺翻譯邏輯
- `components/sections/CameraSection.tsx`：UI 實作
- `utils/promptAssembly.ts`：提示詞組裝邏輯（使用 visualTranslators）

## 結論

POV 模式功能已成功整合到攝影設定區塊中，提供了清晰的 UI 和正確的提示詞語序。這個功能特別適合「特殊視角系列」的 Preset，能夠更精確地描述 selfie、手持鏡頭等特殊拍攝方式。
