# 鏡頭-角度相容性系統需求文檔

## 專案概述

**功能名稱**: Lens-Angle Compatibility System (鏡頭-角度相容性系統)

**目標**: 實作智能的鏡頭、距離、角度組合邏輯，確保 Prompt 輸出符合物理攝影原理，避免 AI 產生矛盾或低品質的圖像。

**核心問題**: 
當鏡頭（Lens）、距離（Distance/Scale）、角度（Angle）同時作用時，如果 Prompt 不分主次全部丟進去，AI 往往會選擇「最容易畫」的那個，導致其他指令失效。

## 使用者故事

### US-1: 作為專業攝影師
**我想要**: 系統自動檢測並修正不合理的鏡頭-角度組合
**以便**: 避免產生物理上不可能或視覺效果不佳的圖像
**驗收標準**:
- 當選擇「長焦 + 蟲視」時，系統應警告「長焦會削弱仰角的張力」
- 當選擇「魚眼 + 建築視角」時，系統應自動移除「零變形」關鍵字
- 當選擇「微距 + 想看清細節」時，系統應自動加入「Focus stacking, f/22」

### US-2: 作為 AI 藝術家
**我想要**: Live Protocol Deck 顯示優化後的 Prompt 結構
**以便**: 理解系統如何調整我的設定，學習正確的 Prompt 組合
**驗收標準**:
- Protocol Deck 應顯示「優先級層級」（Level 1-5）
- 應標示哪些關鍵字被自動添加或移除
- 應顯示衝突警告和修正建議

### US-3: 作為產品設計師
**我想要**: 系統在 UI 層面就預防不合理的組合
**以便**: 減少使用者的困惑和錯誤嘗試
**驗收標準**:
- 當選擇特定鏡頭時，某些角度選項應顯示警告圖示
- 應提供「推薦組合」和「進階組合」的區分
- 應在選擇時即時顯示視覺效果預覽

## 功能需求

### FR-1: 核心優先級系統 (Priority Stack)

**描述**: 實作五層優先級邏輯，確保 Prompt 按照物理重要性排序

**優先級定義**:

| Level | 類別 | 關鍵詞範例 | 說明 |
|-------|------|-----------|------|
| 1 | 特殊光學/極端尺度 | EXTREME MACRO, FISHEYE, MICROSCOPIC | 霸道參數，徹底扭曲空間 |
| 2 | 極端距離 | EXTREME WIDE SHOT, ESTABLISHING SHOT | 定義畫面是風景還是物件 |
| 3 | 物理視角 | WORM'S EYE, BIRD'S EYE, OVERHEAD | 定義相機位置 |
| 4 | 鏡頭焦段 | Telephoto, Wide Angle, 35mm | 定義物件變形程度 |
| 5 | 主體與風格 | Subject, Cinematic, Lighting | 填充內容與氣氛 |

**技術要求**:
- 在 `utils/visualTranslators.ts` 中實作 `applyPriorityStack()` 函數
- 根據使用者選擇的參數，自動排序 Prompt 組件
- 確保高優先級的關鍵字永遠在前面

### FR-2: 鏡頭-角度相容性矩陣 (Lens-Angle Compatibility Matrix)

**描述**: 實作相容性檢查邏輯，自動修正或警告不合理的組合

**相容性規則**:

#### 2.1 魚眼鏡頭 (Fisheye)

**必須添加**:
- `Centered composition` (強制居中)
- `Distorted edges` (邊緣扭曲)
- `Sphere projection` (球面投影)

**禁止組合**:
- ❌ `Architectural` (建築視角)
- ❌ `Straight lines` (直線)
- ❌ `Zero distortion` (零變形)

**推薦組合**:
- ✅ 魚眼 + 蟲視 = 90年代饒舌 MV 風格
- ✅ 魚眼 + 鳥瞰 = 監視器/大頭狗風格

#### 2.2 長焦鏡頭 (Telephoto)

**必須添加**:
- `Compressed perspective` (壓縮透視)
- `Flat distinct layers` (扁平分層)
- `Zero distortion` (零變形)

**禁止組合**:
- ❌ `Dynamic perspective` (動態透視)
- ❌ `Foreshortening` (透視變形)
- ❌ `Wide angle` 關鍵字

**特殊組合警告**:
- ⚠️ 長焦 + 蟲視 = 「狙擊手視角」，張力不足
- ⚠️ 長焦 + 鳥瞰 = 「衛星地圖視角」，適合遊戲圖

#### 2.3 廣角鏡頭 (Wide Angle)

**必須添加**:
- `Dynamic perspective` (動態透視)
- `Foreshortening` (透視變形)
- `Exaggerated depth` (誇張深度)

**推薦組合**:
- ✅ 廣角 + 蟲視 = 英雄感、張力
- ✅ 廣角 + 鳥瞰 = 戲劇性俯視

### FR-3: 微距模式特殊邏輯 (Macro Mode Logic)

**描述**: 微距模式下，角度的意義從「透視」轉變為「光影與質感起伏」

**角度轉譯規則**:

| 原始角度 | 微距轉譯 | 視覺效果 |
|---------|---------|---------|
| 正視 (Top down) | `Flat lay macro, texture pattern scan` | 平面圖案 |
| 斜側/低角度 | `Macro landscape, raking light, surface relief` | 凹凸感、山脈般的紋理 |

**景深處理**:

**預設行為** (物理現實):
- `Razor thin DoF` (極淺景深)
- `Millimeter-thin focus plane` (毫米級對焦平面)
- `Background completely dissolved` (背景完全溶解)

**使用者需求** (看清更多細節):
- 必須添加: `f/22 aperture, Deep depth of field, Focus stacking, Entire subject in focus`
- UI 提示: 「微距模式下，預設景深極淺。若要看清更多細節，請啟用『焦點合成』模式。」

### FR-4: 大遠景模式特殊邏輯 (Wide Shot Logic)

**描述**: 大遠景模式下，鏡頭選擇會影響空間感

**相容性規則**:

| 組合 | 邏輯判斷 | Prompt 修正 |
|------|---------|------------|
| 大遠景 + 廣角 | ✅ 標準組合 | 無需修正 |
| 大遠景 + 長焦 | ⚠️ 邏輯怪異 | 添加: `Look from extremely far away distance, Zoom lens view` |

### FR-5: 智能警告與建議系統 (Smart Warning System)

**描述**: 在 UI 層面提供即時反饋，幫助使用者理解組合效果

**警告類型**:

1. **衝突警告** (紅色)
   - 物理上不可能的組合
   - 例如: 「魚眼 + 零變形」

2. **效果警告** (橘色)
   - 可行但效果可能不符預期
   - 例如: 「長焦 + 蟲視 = 張力不足」

3. **建議提示** (藍色)
   - 推薦的最佳組合
   - 例如: 「廣角 + 蟲視 = 最佳英雄感」

**UI 實作位置**:
- Camera Section: 鏡頭選擇器旁邊
- 3D Gizmo: 角度調整時即時顯示
- Protocol Deck: 顯示完整的相容性分析

## 非功能需求

### NFR-1: 效能
- 相容性檢查應在 < 50ms 內完成
- 不應影響 UI 的即時反應性

### NFR-2: 可維護性
- 相容性規則應以 JSON 或 TypeScript 常數定義
- 易於新增或修改規則

### NFR-3: 可測試性
- 每個相容性規則都應有對應的測試案例
- 測試覆蓋率應達 90% 以上

## 驗收標準

### AC-1: 優先級系統
- [ ] Prompt 輸出按照 Level 1-5 排序
- [ ] 特殊光學（魚眼、微距）永遠在最前面
- [ ] 測試案例覆蓋所有優先級組合

### AC-2: 魚眼相容性
- [ ] 魚眼自動添加「居中構圖」
- [ ] 魚眼自動移除「零變形」關鍵字
- [ ] 魚眼 + 建築視角時顯示衝突警告

### AC-3: 長焦相容性
- [ ] 長焦自動添加「壓縮透視」
- [ ] 長焦自動移除「動態透視」關鍵字
- [ ] 長焦 + 蟲視時顯示效果警告

### AC-4: 微距邏輯
- [ ] 微距模式下，角度轉譯為「光影描述」
- [ ] 提供「焦點合成」選項
- [ ] 預設景深極淺，可選深景深

### AC-5: UI 反饋
- [ ] 選擇鏡頭時，即時顯示相容性提示
- [ ] Protocol Deck 顯示優化後的 Prompt 結構
- [ ] 標示自動添加/移除的關鍵字

## 技術架構

### 新增檔案

1. **`utils/lensAngleCompatibility.ts`**
   - 核心相容性邏輯
   - 優先級排序函數
   - 衝突檢測函數

2. **`utils/lensAngleCompatibility.test.ts`**
   - 完整的測試覆蓋

3. **`constants/compatibilityRules.ts`**
   - 相容性規則定義
   - 易於維護和擴展

4. **`types.ts` (擴展)**
   - 新增 `CompatibilityWarning` 介面
   - 新增 `LensAngleCompatibility` 介面

### 修改檔案

1. **`utils/visualTranslators.ts`**
   - 整合相容性檢查
   - 應用優先級排序
   - 自動添加/移除關鍵字

2. **`components/sections/CameraSection.tsx`**
   - 顯示相容性警告
   - 提供「焦點合成」選項（微距模式）
   - 顯示推薦組合

3. **`components/layout/ProtocolDeck.tsx`**
   - 顯示優先級層級
   - 標示自動修正的關鍵字
   - 顯示相容性分析

## 實作優先順序

### Phase 1: 核心邏輯 (高優先級)
1. 實作優先級系統
2. 實作魚眼相容性
3. 實作長焦相容性
4. 實作微距邏輯

### Phase 2: UI 整合 (中優先級)
1. Camera Section 警告顯示
2. Protocol Deck 優化顯示
3. 焦點合成選項（微距）

### Phase 3: 進階功能 (低優先級)
1. 推薦組合系統
2. 視覺效果預覽
3. 使用者教育提示

## 風險與挑戰

### 風險 1: 過度干預使用者選擇
**緩解策略**: 提供「專家模式」，允許使用者關閉自動修正

### 風險 2: 規則過於複雜
**緩解策略**: 採用分層設計，核心規則簡單明確，進階規則可選

### 風險 3: 效能影響
**緩解策略**: 使用快取機制，避免重複計算

## 成功指標

1. **Prompt 品質提升**: 使用者產生的圖像品質提升 30%
2. **錯誤率降低**: 不合理組合的使用率降低 50%
3. **使用者滿意度**: 專業攝影師評分 > 4.5/5
4. **學習曲線**: 新使用者理解時間縮短 40%

## 參考資料

- 現有實作: `MACRO_OVERRIDE_MODE.md`
- 現有實作: `WIDE_SHOT_OVERRIDE_MODE.md`
- 攝影理論: 焦距與透視的關係
- AI Prompt 工程: 關鍵字優先級研究
