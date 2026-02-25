# Utils 單元測試摘要

## 測試覆蓋範圍

本目錄包含三個工具模組的完整單元測試：

### 1. responsive.ts 測試 (10 個測試)

**測試文件**: `responsive.test.ts`

**測試內容**:
- ✅ BREAKPOINTS 常數定義正確性
- ✅ getDeviceType() 邊界值測試
  - mobile: < 768px
  - tablet: 768px - 1023px  
  - desktop: >= 1024px
- ✅ getDefaultSidebarState() 針對不同裝置類型的預設狀態
  - mobile: 兩側欄位都收合
  - tablet: 左側開啟，右側收合
  - desktop: 兩側欄位都開啟

### 2. storage.ts 測試 (10 個測試)

**測試文件**: `storage.test.ts`

**測試內容**:
- ✅ STORAGE_KEYS 常數定義
- ✅ safeLocalStorageGet() 功能測試
  - 成功讀取並解析有效的 JSON
  - 鍵不存在時返回預設值
  - JSON 解析失敗時返回預設值
  - 處理不同類型的預設值（字串、數字、布林值、陣列、物件）
  - 錯誤時記錄 console.error
- ✅ safeLocalStorageSet() 功能測試
  - 成功寫入資料並返回 true
  - 處理不同類型的資料
- ✅ 整合測試：讀寫循環
  - 寫入後正確讀取相同的資料
  - 處理複雜的嵌套資料結構

### 3. promptAssembly.ts 測試 (23 個測試)

**測試文件**: `promptAssembly.test.ts`

**測試內容**:
- ✅ assemblePromptParts() 功能測試
  - 組裝基本的提示詞區段
  - 包含所有必要區段（THEME, SUBJECT, SCENE, OPTICS, COMPOSITION, MOOD）
  - 條件性區段（LIGHTING, PROCESSING）
  - 特殊情況處理：
    - subject.type 為空時使用預設值
    - bgColor 存在/不存在
    - camera.roll 為零/非零
    - useAdvancedLighting 開啟/關閉
    - postProcessing 標籤存在/不存在
  - 區段順序正確性
- ✅ assembleFinalPrompt() 功能測試
  - 將所有區段組合成單一字串
  - 處理空陣列
  - 處理單一區段
  - 正確處理包含空格的文字
- ✅ 整合測試：完整流程
  - 組裝完整的提示詞
  - 處理最小配置

## 測試統計

- **總測試數**: 43
- **通過率**: 100%
- **測試文件數**: 3

## 執行測試

```bash
# 執行所有測試
npm run test

# 執行測試並生成報告
npm run test:run

# 執行測試 UI
npm run test:ui
```

## 測試框架

- **測試框架**: Vitest 4.0.17
- **測試環境**: happy-dom
- **React 測試工具**: @testing-library/react, @testing-library/jest-dom

## 注意事項

1. **console.error 測試**: 某些測試會故意觸發錯誤以驗證錯誤處理邏輯，這些 stderr 輸出是預期的行為。

2. **LocalStorage Mock**: 測試使用 happy-dom 提供的 localStorage 實現，某些進階的錯誤情況（如 QuotaExceededError）在測試環境中難以模擬，因此未包含在測試套件中。

3. **邊界值測試**: 所有響應式斷點都經過邊界值測試，確保在臨界值時行為正確。

## 相關需求

這些測試驗證了以下需求：
- Requirements 19.3: 工具函數抽離到 utils 目錄
- Requirements 19.6: 為新建立的 utils 提供 TypeScript 型別定義
- Requirements 19.9: 使用一致的命名慣例

## 測試覆蓋的設計屬性

- **Property 2**: 響應式斷點自動調整（部分驗證）
- **Property 3**: 提示詞組裝完整性
- **Property 6**: 自定義標籤持久化（LocalStorage 功能）
