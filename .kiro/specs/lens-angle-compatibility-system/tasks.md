# 鏡頭-角度相容性系統實作任務清單

## Phase 1: 核心邏輯實作

### 1.1 類型定義與常數
- [x] 1.1.1 擴展 `types.ts`，新增相容性相關介面
  - [x] 1.1.1.1 新增 `PromptPriorityLevel` enum
  - [x] 1.1.1.2 新增 `WarningType` enum
  - [x] 1.1.1.3 新增 `CompatibilityWarning` interface
  - [x] 1.1.1.4 新增 `CompatibilityCheckResult` interface
  - [x] 1.1.1.5 新增 `AutoCorrection` interface
  - [x] 1.1.1.6 新增 `LensType` type
  - [x] 1.1.1.7 新增 `AngleType` type

- [x] 1.1.2 創建 `constants/compatibilityRules.ts`
  - [x] 1.1.2.1 定義 `LENS_DETECTION_RULES`
  - [x] 1.1.2.2 定義 `ANGLE_DETECTION_RULES`
  - [x] 1.1.2.3 定義 `FISHEYE_RULES`
  - [x] 1.1.2.4 定義 `TELEPHOTO_RULES`
  - [x] 1.1.2.5 定義 `WIDE_ANGLE_RULES`
  - [x] 1.1.2.6 定義 `MACRO_RULES`
  - [x] 1.1.2.7 定義 `PRIORITY_SORTING_RULES`

### 1.2 檢測函數
- [x] 1.2.1 創建 `utils/lensAngleCompatibility.ts`
- [x] 1.2.2 實作 `detectLensType(focalLength, shotType)`
  - 檢測魚眼、廣角、標準、長焦、微距
- [x] 1.2.3 實作 `detectAngleType(elevation)`
  - 檢測蟲視、低角度、平視、高角度、鳥瞰

### 1.3 相容性檢查函數
- [x] 1.3.1 實作 `checkFisheyeCompatibility(state, angleType)`
  - [x] 1.3.1.1 檢測衝突關鍵字（architectural, straight lines）
  - [x] 1.3.1.2 生成 CONFLICT 警告
  - [x] 1.3.1.3 自動添加必要關鍵字（centered composition）
  - [x] 1.3.1.4 自動移除衝突關鍵字
  - [x] 1.3.1.5 生成推薦組合提示

- [x] 1.3.2 實作 `checkTelephotoCompatibility(state, angleType)`
  - [x] 1.3.2.1 自動移除衝突關鍵字（dynamic perspective）
  - [x] 1.3.2.2 自動添加必要關鍵字（compressed perspective）
  - [x] 1.3.2.3 檢測特殊組合（長焦 + 蟲視）
  - [x] 1.3.2.4 生成 SUBOPTIMAL 警告
  - [x] 1.3.2.5 自動添加補償關鍵字

- [x] 1.3.3 實作 `checkWideAngleCompatibility(state, angleType)`
  - [x] 1.3.3.1 自動添加必要關鍵字（dynamic perspective）
  - [x] 1.3.3.2 自動移除衝突關鍵字（compressed perspective）
  - [x] 1.3.3.3 生成推薦組合提示

- [x] 1.3.4 實作 `checkMacroCompatibility(state, angleType)`
  - [x] 1.3.4.1 實作角度轉譯邏輯
  - [x] 1.3.4.2 檢測景深需求（f/22 → focus stacking）
  - [x] 1.3.4.3 生成景深相關修正
  - [x] 1.3.4.4 生成 SUGGESTION 警告

### 1.4 主檢查函數
- [x] 1.4.1 實作 `checkCompatibility(state)`
  - [x] 1.4.1.1 檢測鏡頭類型
  - [x] 1.4.1.2 檢測角度類型
  - [x] 1.4.1.3 執行對應的相容性檢查
  - [x] 1.4.1.4 彙總所有警告
  - [x] 1.4.1.5 彙總所有自動修正
  - [x] 1.4.1.6 決定優先級順序
  - [x] 1.4.1.7 返回完整結果

### 1.5 優先級與修正
- [x] 1.5.1 實作 `determinePriorityOrder(lensType, state)`
  - 根據鏡頭類型和 state 決定優先級順序
- [x] 1.5.2 實作 `applyPrioritySorting(components, priorityOrder)`
  - 按照優先級排序 Prompt 組件
- [x] 1.5.3 實作 `applyAutoCorrections(state, corrections)`
  - 應用自動修正到 state

## Phase 2: 整合到翻譯器

### 2.1 修改 visualTranslators.ts
- [x] 2.1.1 導入相容性檢查函數
- [x] 2.1.2 修改 `translatePromptState()` 函數
  - [x] 2.1.2.1 在翻譯前執行相容性檢查
  - [x] 2.1.2.2 應用自動修正到 state
  - [x] 2.1.2.3 執行原有翻譯邏輯
  - [x] 2.1.2.4 應用優先級排序
  - [x] 2.1.2.5 附加相容性資訊到返回值

### 2.2 向後相容性測試
- [x] 2.2.1 測試微距模式不受影響
- [x] 2.2.2 測試大遠景模式不受影響
- [x] 2.2.3 測試標準模式不受影響

## Phase 3: UI 整合

### 3.1 Camera Section 警告顯示
- [ ] 3.1.1 修改 `CameraSection.tsx`
- [ ] 3.1.2 新增 state 管理相容性警告
- [ ] 3.1.3 在鏡頭選擇器下方添加警告區塊
  - [ ] 3.1.3.1 衝突警告（紅色）
  - [ ] 3.1.3.2 效果警告（橘色）
  - [ ] 3.1.3.3 建議提示（藍色）
- [ ] 3.1.4 實作警告樣式（符合 UI Spacing Guidelines）

### 3.2 微距模式焦點合成選項
- [ ] 3.2.1 在 Camera Section 添加焦點合成開關
- [ ] 3.2.2 僅在微距模式顯示
- [ ] 3.2.3 連接到 state 管理
- [ ] 3.2.4 更新 types.ts（新增 focusStacking 欄位）

### 3.3 Protocol Deck 優化顯示
- [ ] 3.3.1 修改 `ProtocolDeck.tsx`
- [ ] 3.3.2 新增相容性分析區塊
  - [ ] 3.3.2.1 顯示優先級層級
  - [ ] 3.3.2.2 顯示自動修正列表
  - [ ] 3.3.2.3 標示添加/移除的關鍵字
- [ ] 3.3.3 實作樣式（符合 Protocol Deck 設計）

## Phase 4: 測試

### 4.1 單元測試
- [x] 4.1.1 創建 `utils/lensAngleCompatibility.test.ts`
- [x] 4.1.2 測試鏡頭類型檢測
  - [x] 4.1.2.1 測試魚眼檢測
  - [x] 4.1.2.2 測試長焦檢測
  - [x] 4.1.2.3 測試廣角檢測
  - [x] 4.1.2.4 測試微距檢測（從 shotType）
  - [x] 4.1.2.5 測試標準鏡頭檢測

- [x] 4.1.3 測試角度類型檢測
  - [x] 4.1.3.1 測試蟲視檢測（elevation < -45）
  - [x] 4.1.3.2 測試鳥瞰檢測（elevation > 60）
  - [x] 4.1.3.3 測試平視檢測（-15 ~ 15）

- [x] 4.1.4 測試魚眼相容性
  - [x] 4.1.4.1 測試自動添加 centered composition
  - [x] 4.1.4.2 測試自動移除 architectural
  - [x] 4.1.4.3 測試衝突警告生成
  - [x] 4.1.4.4 測試推薦組合提示

- [x] 4.1.5 測試長焦相容性
  - [x] 4.1.5.1 測試自動添加 compressed perspective
  - [x] 4.1.5.2 測試自動移除 dynamic perspective
  - [x] 4.1.5.3 測試長焦 + 蟲視警告
  - [x] 4.1.5.4 測試長焦 + 鳥瞰警告

- [x] 4.1.6 測試廣角相容性
  - [x] 4.1.6.1 測試自動添加 dynamic perspective
  - [x] 4.1.6.2 測試推薦組合提示

- [x] 4.1.7 測試微距相容性
  - [x] 4.1.7.1 測試角度轉譯（低角度 → raking light）
  - [x] 4.1.7.2 測試角度轉譯（正視 → flat lay）
  - [x] 4.1.7.3 測試焦點合成（f/22 → focus stacking）
  - [x] 4.1.7.4 測試預設淺景深

- [x] 4.1.8 測試優先級排序
  - [x] 4.1.8.1 測試特殊光學置頂
  - [x] 4.1.8.2 測試極端距離第二
  - [x] 4.1.8.3 測試完整排序邏輯

- [x] 4.1.9 測試自動修正
  - [x] 4.1.9.1 測試添加關鍵字
  - [x] 4.1.9.2 測試移除關鍵字
  - [x] 4.1.9.3 測試替換關鍵字

### 4.2 正確性屬性測試
- [ ] 4.2.1 測試優先級順序正確性
  - [ ] 4.2.1.1 特殊光學永遠在最前面
  - [ ] 4.2.1.2 優先級層級不重疊

- [ ] 4.2.2 測試衝突檢測完整性
  - [ ] 4.2.2.1 所有物理衝突都被檢測
  - [ ] 4.2.2.2 衝突必須被自動修正

- [ ] 4.2.3 測試微距模式特殊邏輯
  - [ ] 4.2.3.1 角度轉譯正確性
  - [ ] 4.2.3.2 景深處理正確性

- [ ] 4.2.4 測試自動修正冪等性
  - [ ] 4.2.4.1 重複應用不改變結果
  - [ ] 4.2.4.2 修正後的 state 不再有衝突

### 4.3 整合測試
- [ ] 4.3.1 測試完整流程（使用者輸入 → Prompt 輸出）
- [ ] 4.3.2 測試 UI 警告顯示
- [ ] 4.3.3 測試 Protocol Deck 顯示

## Phase 5: 效能優化

### 5.1 快取機制
- [ ] 5.1.1 實作快取 Map
- [ ] 5.1.2 實作 `generateCacheKey(state)`
- [ ] 5.1.3 實作 `checkCompatibilityWithCache(state)`
- [ ] 5.1.4 測試快取命中率

### 5.2 效能監控
- [ ] 5.2.1 實作 `checkCompatibilityWithPerfMonitoring(state)`
- [ ] 5.2.2 測試效能（確保 < 50ms）
- [ ] 5.2.3 優化慢速路徑

## Phase 6: 文檔與部署

### 6.1 文檔
- [ ] 6.1.1 更新 README.md
- [ ] 6.1.2 創建使用者指南
- [ ] 6.1.3 創建開發者文檔
- [ ] 6.1.4 創建實作總結文檔

### 6.2 部署
- [ ] 6.2.1 執行完整測試套件
- [ ] 6.2.2 檢查測試覆蓋率（> 90%）
- [ ] 6.2.3 執行效能測試
- [ ] 6.2.4 部署到生產環境

## 完成標準

- ✅ 所有測試通過（覆蓋率 > 90%）
- ✅ 效能測試通過（< 50ms）
- ✅ UI 整合完成且無視覺問題
- ✅ 文檔完整且清晰
- ✅ 向後相容性確認
