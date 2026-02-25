# 燈光系統 UI 改善總結

## 改善日期
2026-02-06

## 問題分析

### 問題 1：使用情境不清晰
- 所有燈光預設混在一起，使用者不知道哪些適合攝影棚、哪些適合戶外
- 缺乏對「專業佈光系統」最佳使用場景的說明
- 在戶外白天場景使用可能會降低整體亮度，但沒有警告

### 問題 2：燈光調整時的狀態混淆
- 當使用者移動燈光角度時，系統會從「Perfect Match」切換到「Style Inheritance」
- UI 沒有清楚說明這個變化和其對 Prompt 輸出的影響
- 缺乏對燈光方向和陰影位置的精確描述

## 解決方案

### 1. 燈光預設分類系統

#### 新增類型定義（constants.tsx）
```typescript
export type LightingScenario = 'studio' | 'outdoor_fill' | 'hybrid';
```

#### 為每個預設添加情境標籤
- `scenario`: 'studio' | 'hybrid'
- `scenarioDesc`: 使用情境的中文描述

**分類標準：**
- **攝影棚（Studio）**：適合室內、可控光源環境
  - Rembrandt、Butterfly、Loop、Broad、Short、Flat、High Key、Clamshell
  
- **混合模式（Hybrid）**：可用於攝影棚或戶外補光
  - Split（夜景補光）、Rim（戶外逆光）

### 2. 改進的 LightingPresetGrid 組件

#### 新增功能
1. **使用情境說明區塊**
   - 清楚說明攝影棚預設 vs 混合模式的差異
   - 警告：在戶外白天場景使用可能降低亮度

2. **情境篩選器**
   - 全部顯示 / 攝影棚 / 混合模式
   - 快速找到適合的預設

3. **狀態指示器**
   - ✓ 精準匹配（Perfect Match）：綠色
   - ~ 已調整（Style Inheritance）：橙色
   - 使用 `generateLightingPrompt` 判斷當前狀態

4. **視覺化標籤**
   - 每個預設卡片右上角顯示「棚」或「混」標籤
   - 藍色（攝影棚）/ 紫色（混合模式）

### 3. 新組件：LightingDirectionIndicator

#### 功能
1. **模式狀態顯示**
   - 精準匹配 / 風格繼承 / 產品模式 / 自訂燈光
   - 顯示偏差角度（方位角 / 仰角）

2. **主光方向說明**
   - 水平方位：正前方、右前方、右側...（8 個方向）
   - 垂直高度：極高角度、高角度、略高於水平...
   - 光線強度百分比

3. **陰影方向說明**
   - 自動計算陰影落在哪個方向（與主光相反）
   - 陰影深度（由補光強度決定）

4. **Prompt 輸出預覽**
   - 顯示實際會輸出到 Prompt 的文字
   - 區分幾何描述和風格標籤

5. **使用提示**
   - 當處於「風格繼承」模式時，說明系統的行為

#### 方向轉換邏輯
```typescript
// 方位角 → 方向描述
0° = 正前方
45° = 右前方
90° = 右側
135° = 右後方
180° = 正後方
225° = 左後方
270° = 左側
315° = 左前方

// 仰角 → 高度描述
> 60° = 極高角度（接近頂部）
30-60° = 高角度（斜上方）
10-30° = 略高於水平
-10-10° = 水平視線
-30--10° = 略低於水平
-60--30° = 低角度（斜下方）
< -60° = 極低角度（接近底部）
```

### 4. OpticsSection 整合

#### 更新內容
1. 傳遞當前燈光狀態給 `LightingPresetGrid`
   - `currentKeyLight`
   - `currentFillLight`
   - `currentRimLight`

2. 在視覺化器下方添加 `LightingDirectionIndicator`
   - 僅在非環境光標籤時顯示
   - 實時顯示當前燈光的方向和陰影資訊

## 使用者體驗改善

### 改善前
- ❌ 不知道哪些預設適合什麼場景
- ❌ 不知道調整燈光後會發生什麼
- ❌ 不清楚燈光方向和陰影位置
- ❌ 不知道實際輸出的 Prompt 內容

### 改善後
- ✅ 清楚的情境分類和篩選
- ✅ 實時的狀態指示（精準 / 已調整）
- ✅ 精確的方向和陰影描述
- ✅ Prompt 輸出預覽
- ✅ 使用提示和警告

## 技術細節

### 新增檔案
- `components/lighting/LightingDirectionIndicator.tsx`

### 修改檔案
- `constants.tsx`：添加 `LightingScenario` 類型和情境標籤
- `components/lighting/LightingPresetGrid.tsx`：添加分類、篩選、狀態指示
- `components/sections/OpticsSection.tsx`：整合新組件
- `utils/lightingMigration.ts`：修正 rimLight 的 azimuth 屬性

### 依賴關係
- 使用 `generateLightingPrompt` 判斷當前模式
- 使用 `LightingPresetDefinition` 的容許誤差邏輯
- 整合現有的視覺化器和控制面板

## 未來改進建議

1. **自動場景偵測**
   - 根據 Background 的描述自動判斷是否為戶外場景
   - 如果偵測到「outdoor」、「daylight」、「park」等關鍵字，自動顯示警告

2. **預設推薦系統**
   - 根據 Subject 類型（人像 / 產品）推薦適合的預設
   - 根據 Background（室內 / 戶外）過濾預設

3. **更多混合模式預設**
   - 添加專門為戶外補光設計的預設
   - 例如：「黃金時刻補光」、「夜景輪廓光」

4. **視覺化改進**
   - 在 PortraitLightingVisualizer 中顯示陰影方向箭頭
   - 添加「預覽 vs 實際」對比模式

## 測試建議

### 測試場景 A：攝影棚人像
```
Subject: 年輕女性
Background: 攝影棚白背景
Lighting: Rembrandt（不調整）
預期：✓ 精準匹配，完整的幾何標籤
```

### 測試場景 B：攝影棚人像（調整後）
```
Subject: 年輕女性
Background: 攝影棚白背景
Lighting: Rembrandt（調整主光到 80°）
預期：~ 已調整，移除幾何標籤，保留風格標籤
```

### 測試場景 C：戶外白天
```
Subject: 年輕女性
Background: 公園白天
Lighting: 啟動專業佈光系統
預期：顯示警告「可能降低整體亮度」
```

### 測試場景 D：產品攝影
```
Subject: 香水瓶
Background: 極簡背景
Lighting: Flat Lighting
預期：產品模式，移除人像用語
```

## 結論

這次改善大幅提升了燈光系統的可用性和透明度，使用者現在可以：
1. 清楚知道每個預設的適用場景
2. 理解調整燈光後的系統行為
3. 精確掌握燈光方向和陰影位置
4. 預覽實際的 Prompt 輸出

這些改善讓 Nano Banana 的燈光系統更加專業和易用，符合專業攝影師和 AI 藝術家的需求。
