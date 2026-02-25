# Structured View Implementation (方案 C)

## 實現日期
2026-01-28

## 概述

在 Live Protocol Deck 中添加了「結構化視圖」功能，讓用戶可以在兩種視圖模式之間切換：

1. **線性視圖**（預設）：AI 可用的連續文字格式
2. **結構化視圖**：教學用途的分層結構顯示

## 功能特點

### 線性視圖（Linear View）
- 顯示最終的 AI 可用提示詞
- 按照類別分組顯示（CAMERA SETUP, SUBJECT DETAILS, etc.）
- 適合直接複製給 AI 使用

### 結構化視圖（Structured View）
- 分離「物理空間設定」和「光學成像效果」
- 清楚展示攝影機位置、主體取景、鏡頭透視、景深關係
- 幫助用戶理解提示詞的組成邏輯
- 適合學習和調試

## 實現細節

### 新增文件
無（所有修改都在現有文件中）

### 修改文件

#### 1. `utils/visualTranslators.ts`
**新增內容：**
- `StructuredCompositionBreakdown` 介面
- `generateStructuredBreakdown()` 函數

**功能：**
- 將提示詞拆解為結構化數據
- 分離物理空間和光學效果
- 提供中文說明和分類

#### 2. `components/layout/ProtocolDeck.tsx`
**新增內容：**
- 視圖模式狀態：`useState<'linear' | 'structured'>('linear')`
- 視圖切換按鈕（線性/結構）
- 結構化視圖 UI 組件

**UI 設計：**
- 切換按鈕使用藍色（線性）和紫色（結構）
- 結構化視圖使用圖標（📐 物理空間，🔬 光學效果）
- 清晰的層級結構和視覺分隔

## 備份文件

### 恢復到原始版本

如果需要恢復到修改前的版本，執行以下命令：

```bash
# Windows (PowerShell)
Copy-Item "components/layout/ProtocolDeck.tsx.backup" "components/layout/ProtocolDeck.tsx" -Force

# 或使用 Git 恢復
git checkout components/layout/ProtocolDeck.tsx
```

### 備份位置
- `components/layout/ProtocolDeck.tsx.backup` - 原始版本的完整備份

## 使用方式

### 用戶操作
1. 打開 Live Protocol Deck（右側面板）
2. 點擊頂部的「線性」或「結構」按鈕切換視圖
3. 在結構化視圖中查看詳細的組成說明

### 開發者操作
```typescript
// 在其他組件中使用結構化數據
import { generateStructuredBreakdown } from './utils/visualTranslators';

const structuredData = generateStructuredBreakdown(promptState);
console.log(structuredData.composition_breakdown);
```

## 結構化數據格式

```typescript
interface StructuredCompositionBreakdown {
  readme: string;  // 說明文字
  composition_breakdown: {
    spatial_geometry: {
      description: string;
      camera_position: string[];    // 相機位置描述
      subject_framing: string[];    // 主體取景描述
    };
    optical_rendering: {
      description: string;
      lens_perspective: string[];           // 鏡頭透視描述
      depth_of_field_relationship: string[]; // 景深關係描述
    };
  };
  final_prompt: string;  // 最終的線性提示詞
}
```

## 範例輸出

### 物理空間設定
```
📐 物理空間設定 (Spatial Geometry)
物理空間中的幾何關係（東西擺在哪裡）

相機位置 (Camera Position)
• 高度關係: an elevated high angle, looking down at product
• 水平角度: front-facing
• 指向: 鏡頭正面朝向主體中心

主體取景 (Subject Framing)
• 景別: Medium shot, product fully visible, balanced composition
• 構圖: 三分法 (rule_of_thirds)
```

### 光學成像效果
```
🔬 光學成像效果 (Optical Rendering)
鏡頭如何呈現上述空間關係（看起來的效果）

鏡頭透視 (Lens Perspective)
• 視角特性: Standard lens perspective
• 空間變形: zero distortion
• 空間感: rectilinear projection, neutral spatial rendering

景深關係 (Depth of Field)
• 景深設定: Shallow depth of field
• 焦點狀態: soft background blur
• 背景狀態: subject separation
```

## 優勢

### 1. 教育價值
- 幫助用戶理解提示詞的組成邏輯
- 清楚區分物理位置和光學效果
- 適合新手學習攝影概念

### 2. 調試便利
- 快速檢查每個參數的翻譯結果
- 容易發現邏輯錯誤或不合理的組合
- 方便開發者測試和驗證

### 3. 不影響核心功能
- 線性視圖保持不變（預設模式）
- 結構化視圖是額外功能
- 不增加系統複雜度

### 4. 易於維護
- 所有邏輯集中在 `generateStructuredBreakdown()`
- UI 層只負責顯示
- 可以輕鬆添加新的分類或說明

## 未來擴展

可以考慮添加：
1. **燈光結構化視圖**：分離燈光的物理位置和視覺效果
2. **導出結構化 JSON**：讓用戶下載結構化數據
3. **對比模式**：同時顯示線性和結構化視圖
4. **互動式說明**：點擊每個項目顯示詳細解釋

## 測試

目前沒有專門的測試文件，但可以通過以下方式驗證：

1. 切換視圖模式，確保沒有錯誤
2. 修改攝影機參數，觀察結構化視圖的更新
3. 檢查不同焦距和景深設定的描述是否正確
4. 驗證商品/人像模式的描述差異

## 注意事項

1. **結構化視圖僅供參考**：最終給 AI 的提示詞仍然是線性格式
2. **中文說明**：結構化視圖使用中文標籤，方便理解
3. **性能影響**：結構化數據使用 `useMemo` 緩存，不會影響性能
4. **向後兼容**：不影響現有功能，可以安全部署

## 回滾指南

如果發現問題需要回滾：

### 完全回滾
```bash
# 恢復 ProtocolDeck
Copy-Item "components/layout/ProtocolDeck.tsx.backup" "components/layout/ProtocolDeck.tsx" -Force

# 移除 visualTranslators.ts 中的新增函數
# 手動刪除 generateStructuredBreakdown() 和 StructuredCompositionBreakdown 介面
```

### 部分回滾（保留函數，只移除 UI）
只需將 ProtocolDeck 恢復到備份版本即可，`generateStructuredBreakdown()` 函數可以保留供未來使用。

## 總結

方案 C 成功實現了結構化視圖功能，在不影響核心邏輯的前提下，為用戶提供了更好的理解和學習工具。系統保持簡潔高效，同時增加了教育價值。
