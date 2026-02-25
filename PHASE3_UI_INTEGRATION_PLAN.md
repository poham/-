# Phase 3: UI 整合計劃

## 📋 概述

Phase 3 的目標是將相容性檢查系統整合到使用者介面中，讓使用者能夠：
1. **看到警告**：即時顯示相容性問題
2. **理解問題**：清楚的說明和建議
3. **快速修復**：一鍵修復常見問題

---

## 🎯 Phase 3 的三大任務

### 任務 1：Camera Section 警告顯示

**位置**：`components/sections/CameraSection.tsx`

**功能**：在鏡頭選擇器下方顯示相容性警告

#### 視覺設計

```tsx
{/* 相容性警告區塊 */}
{compatibility && compatibility.warnings.length > 0 && (
  <div className="space-y-3 mt-4">
    {compatibility.warnings.map((warning, index) => (
      <div
        key={index}
        className={`p-4 rounded-xl border-2 ${
          warning.type === 'CONFLICT'
            ? 'bg-red-500/10 border-red-500/30'  // 紅色：衝突
            : warning.type === 'SUBOPTIMAL'
            ? 'bg-orange-500/10 border-orange-500/30'  // 橘色：次優
            : 'bg-blue-500/10 border-blue-500/30'  // 藍色：建議
        }`}
      >
        {/* 警告圖示 + 標題 */}
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {warning.type === 'CONFLICT' ? '⚠️' : 
             warning.type === 'SUBOPTIMAL' ? '⚡' : '💡'}
          </span>
          <div className="flex-1">
            {/* 警告訊息 */}
            <p className="text-[13px] font-bold text-white mb-2">
              {warning.message}
            </p>
            
            {/* 建議 */}
            {warning.suggestion && (
              <p className="text-[12px] text-slate-300 mb-3">
                💡 {warning.suggestion}
              </p>
            )}
            
            {/* 快速修復按鈕 */}
            {warning.type === 'CONFLICT' && (
              <button
                onClick={() => handleQuickFix(warning)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 
                           rounded-lg text-[12px] font-bold text-white 
                           transition-all"
              >
                快速修復
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
```

#### 實際效果示例

**場景 1：微距 + 大遠景（紅色衝突）**
```
⚠️ 微距模式（極近）與大遠景模式（極遠）互斥
💡 請選擇其中一種模式
[快速修復] 按鈕
```

**場景 2：長焦 + 蟲視（橘色次優）**
```
⚡ 長焦 + 蟲視會削弱仰角張力，產生「狙擊手視角」
💡 建議切換為廣角鏡頭以增強透視感
```

**場景 3：廣角 + 蟲視（藍色建議）**
```
💡 廣角 + 蟲視 = 最佳英雄感與張力
這是推薦的組合！
```

---

### 任務 2：微距模式焦點合成選項

**位置**：`components/sections/CameraSection.tsx`

**功能**：在微距模式下顯示焦點合成開關

#### 視覺設計

```tsx
{/* 僅在微距模式顯示 */}
{isMacroMode(config.shotType) && (
  <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
    <div className="flex items-center justify-between mb-3">
      <label className="text-[14px] font-black text-white uppercase tracking-wider">
        焦點合成
      </label>
      <button
        onClick={() => handleChange('focusStacking', !config.focusStacking)}
        className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
          config.focusStacking
            ? 'bg-green-500 text-white'
            : 'bg-slate-700 text-slate-400'
        }`}
      >
        {config.focusStacking ? '已啟用' : '已停用'}
      </button>
    </div>
    
    {/* 說明文字 */}
    <p className="text-[12px] text-slate-300 leading-relaxed">
      {config.focusStacking
        ? '✅ 將使用 f/22 光圈和焦點合成技術，確保整個主體清晰'
        : '⚠️ 微距模式預設景深極淺，只有一小部分會清晰'}
    </p>
  </div>
)}
```

#### 效果

- **啟用時**：Prompt 會添加 "f/22 aperture, deep depth of field, focus stacking"
- **停用時**：Prompt 使用預設的淺景深描述

---

### 任務 3：Protocol Deck 相容性分析顯示

**位置**：`components/layout/ProtocolDeck.tsx`

**功能**：在 Live Protocol Deck 中顯示相容性分析

#### 視覺設計

```tsx
{/* 相容性分析區塊 */}
{compatibility && (
  <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 mb-6">
    <h4 className="text-[14px] font-black text-white uppercase tracking-wider mb-4">
      相容性分析
    </h4>
    
    {/* 優先級層級顯示 */}
    <div className="space-y-2 mb-4">
      <p className="text-[12px] text-slate-400">優先級順序：</p>
      <div className="flex flex-wrap gap-2">
        {compatibility.priorityOrder.map((level, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 
                       rounded-lg text-[11px] font-bold text-blue-300"
          >
            Level {index + 1}: {getPriorityLevelName(level)}
          </span>
        ))}
      </div>
    </div>
    
    {/* 自動修正列表 */}
    {compatibility.autoCorrections.length > 0 && (
      <div className="space-y-2">
        <p className="text-[12px] text-slate-400">自動修正：</p>
        <div className="space-y-1">
          {compatibility.autoCorrections.map((correction, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-[11px]"
            >
              {correction.action === 'add' && (
                <span className="text-green-400">➕ 添加：{correction.value}</span>
              )}
              {correction.action === 'remove' && (
                <span className="text-red-400">➖ 移除：{correction.target}</span>
              )}
              {correction.action === 'replace' && (
                <span className="text-yellow-400">🔄 替換：{correction.target}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    
    {/* 相容性狀態 */}
    <div className="mt-4 pt-4 border-t border-slate-700">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${
          compatibility.isCompatible ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="text-[12px] font-bold text-white">
          {compatibility.isCompatible ? '相容' : '發現衝突'}
        </span>
      </div>
    </div>
  </div>
)}
```

#### 效果示例

**魚眼鏡頭 + 蟲視角度**
```
相容性分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

優先級順序：
[Level 1: 特殊光學] [Level 2: 物理視角] [Level 3: 主體風格]

自動修正：
➕ 添加：centered composition
➕ 添加：distorted edges
➖ 移除：architectural

● 相容
```

---

## 🎨 UI 設計規範

### 顏色系統

| 警告類型 | 背景色 | 邊框色 | 文字色 | 圖示 |
|---------|--------|--------|--------|------|
| CONFLICT（衝突） | `bg-red-500/10` | `border-red-500/30` | `text-red-300` | ⚠️ |
| SUBOPTIMAL（次優） | `bg-orange-500/10` | `border-orange-500/30` | `text-orange-300` | ⚡ |
| SUGGESTION（建議） | `bg-blue-500/10` | `border-blue-500/30` | `text-blue-300` | 💡 |

### 間距規範（符合 UI Spacing Guidelines）

- **警告容器**：`p-4`（小型區塊）
- **警告標題**：`text-[13px]`（主要提示）
- **建議文字**：`text-[12px]`（次要提示）
- **按鈕**：`px-4 py-2`（小型按鈕）

---

## 🔧 技術實作細節

### 1. 修改 `types.ts`

添加 `focusStacking` 欄位到 `CameraConfig`：

```typescript
export interface CameraConfig {
  // ... 現有欄位
  focusStacking?: boolean;  // 微距模式焦點合成開關
}
```

### 2. 修改 `CameraSection.tsx`

```typescript
// 1. 從 translatePromptState 獲取相容性結果
const translated = translatePromptState(promptState);
const compatibility = translated.compatibility;

// 2. 實作快速修復函數
const handleQuickFix = (warning: CompatibilityWarning) => {
  if (warning.affectedParams.includes('shotType')) {
    // 修復 shotType
    onChange({ ...config, shotType: 'Long Shot' });
  }
  if (warning.affectedParams.includes('scaleMode')) {
    // 關閉大遠景模式
    onChange({ ...config, scaleMode: undefined });
  }
  // ... 其他修復邏輯
};

// 3. 渲染警告區塊
```

### 3. 修改 `ProtocolDeck.tsx`

```typescript
// 1. 接收 compatibility prop
interface ProtocolDeckProps {
  // ... 現有 props
  compatibility?: CompatibilityCheckResult;
}

// 2. 渲染相容性分析區塊
```

---

## 📊 實作優先級

### 高優先級（必須實作）
1. ✅ **Camera Section 警告顯示**（紅色衝突警告）
2. ✅ **快速修復按鈕**（解決衝突）

### 中優先級（建議實作）
3. ⚠️ **微距模式焦點合成選項**
4. ⚠️ **Protocol Deck 相容性分析**

### 低優先級（可選）
5. 💡 **推薦組合提示**（藍色建議）
6. 💡 **優先級層級顯示**

---

## 🎯 使用者體驗流程

### 流程 1：發現衝突 → 快速修復

1. 使用者選擇「微距」模式
2. 使用者選擇「大遠景」尺度
3. **系統顯示紅色警告**：「微距模式與大遠景模式互斥」
4. 使用者點擊「快速修復」按鈕
5. **系統自動關閉大遠景模式**
6. 警告消失 ✅

### 流程 2：次優組合 → 手動調整

1. 使用者選擇「長焦」鏡頭
2. 使用者調整到「蟲視」角度
3. **系統顯示橘色警告**：「長焦 + 蟲視會削弱張力」
4. 使用者可以：
   - 選項 A：忽略警告，繼續使用
   - 選項 B：切換為廣角鏡頭
   - 選項 C：調整角度

### 流程 3：推薦組合 → 鼓勵使用

1. 使用者選擇「廣角」鏡頭
2. 使用者調整到「蟲視」角度
3. **系統顯示藍色提示**：「廣角 + 蟲視 = 最佳英雄感！」
4. 使用者感到鼓勵 😊

---

## 📝 總結

### Phase 3 會做什麼？

1. **視覺化警告**：讓使用者看到相容性問題
2. **快速修復**：一鍵解決常見衝突
3. **教育使用者**：說明為什麼某些組合不好
4. **鼓勵最佳實踐**：推薦好的組合

### Phase 3 不會做什麼？

- ❌ 不會阻止使用者使用任何組合
- ❌ 不會自動修改設定（除非使用者點擊快速修復）
- ❌ 不會改變 Prompt 生成邏輯（Phase 2 已完成）

### 預估工作量

- **Camera Section 警告顯示**：2-3 小時
- **微距焦點合成選項**：1 小時
- **Protocol Deck 相容性分析**：1-2 小時
- **測試和調整**：1-2 小時

**總計**：約 5-8 小時的開發時間

---

## 🤔 你的決定

現在你了解 Phase 3 的內容了，你想：

1. **選項 A**：先完成新的衝突檢測（微距+大遠景等），然後再做 Phase 3 UI
2. **選項 B**：直接跳到 Phase 3，一次完成檢測 + UI
3. **選項 C**：只做部分 Phase 3（例如只做警告顯示，不做 Protocol Deck）

你覺得哪個選項比較好？
